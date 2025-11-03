from django.core.management.base import BaseCommand
from chatbot.models import UploadedDocument
from chatbot.utils.text_extractor import extract_text_from_pdf
from chatbot.utils.text_chunker import chunk_text
from chatbot.utils.embedding_store import build_index
import os

class Command(BaseCommand):
    help = "Build FAISS index from all uploaded documents"

    def handle(self, *args, **options):
        print("Collecting documents...")
        all_chunks = []
        all_meta = []
        for doc in UploadedDocument.objects.all():
            if not doc.file:
                continue
            try:
                file_path = doc.file.path
                text = extract_text_from_pdf(file_path)
                chunks = chunk_text(text)
                for i, c in enumerate(chunks):
                    all_chunks.append(c)
                    all_meta.append({
                        "doc_id": doc.id,
                        "filename": os.path.basename(file_path),
                        "chunk_index": i
                    })
            except Exception as e:
                print(f"Failed to index doc {doc.id}: {e}")

        print(f"Building index with {len(all_chunks)} chunks...")
        build_index(all_chunks, all_meta)
        print("Index build complete.")
