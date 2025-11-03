import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from docx import Document as DocxDocument

from .models import UploadedDocument
from .serializers import DocumentSerializer
from .utils.text_extractor import extract_text_from_pdf
from .utils.text_chunker import chunk_text
from .utils.embedding_store import add_documents, query
from .utils.model_inference import generate_answer


class DocumentUploadView(generics.CreateAPIView):
    """
    Handles file uploads and automatically extracts + indexes their text.
    """
    queryset = UploadedDocument.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        instance = serializer.save()
        file_path = instance.file.path
        ext = os.path.splitext(file_path)[1].lower()
        extracted_text = ""

        try:
            # --- Extract text based on file type ---
            if ext == ".pdf":
                extracted_text = extract_text_from_pdf(file_path)
            elif ext in [".txt", ".md"]:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    extracted_text = f.read()
            elif ext == ".docx":
                doc = DocxDocument(file_path)
                extracted_text = "\n".join([p.text for p in doc.paragraphs])
            else:
                extracted_text = f"Unsupported file type: {ext}"

            # --- Save text in database ---
            instance.content = extracted_text
            instance.save()

            # --- Create text chunks and metadata ---
            chunks = chunk_text(extracted_text, chunk_size=800, overlap=200)
            metadatas = [
                {"doc_id": instance.id, "filename": os.path.basename(file_path), "chunk_index": i}
                for i, _ in enumerate(chunks)
            ]

            # --- Add chunks to FAISS index ---
            add_documents(chunks, metadatas)

        except Exception as e:
            print(f"[ERROR] Error processing uploaded document: {e}")
            instance.content = f"Error: {e}"
            instance.save()


class ChatView(APIView):
    """
    Chat endpoint that answers questions using RAG-style retrieval.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        user_message = request.data.get("message", "").strip()
        if not user_message:
            return Response({"error": "No message provided"}, status=400)

        # --- Step 1: Retrieve relevant document chunks ---
        results = query(user_message)
        if not results:
            return Response({
                "reply": "I couldn’t find relevant company information to answer that yet.",
                "sources": []
            }, status=200)

        # --- Step 2: Build context from retrieved chunks ---
        context = "\n".join([r["text"] for r in results])
        sources = list({r["meta"].get("filename", "unknown") for r in results})

        # --- Step 3: Create the model prompt ---
        prompt = (
            "You are an assistant that answers questions about Sameer Shah’s company. "
            "Use the provided context to answer briefly, accurately, and professionally.\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {user_message}\nAnswer:"
        )

        # --- Step 4: Generate the answer via Hugging Face ---
        try:
            reply = generate_answer(prompt)
        except Exception as e:
            print(f"[ERROR] Failed to generate answer: {e}")
            return Response({
                "reply": "Sorry, there was an error generating an answer.",
                "sources": sources
            }, status=500)

        # --- Step 5: Return clean JSON response ---
        return Response({
            "reply": reply.strip(),
            "sources": sources
        }, status=200)
