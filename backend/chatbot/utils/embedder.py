import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from chatbot.models import UploadedDocument

model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")  # small, fast, open model
index_path = "faiss_index.index"

def build_faiss_index():
    docs = UploadedDocument.objects.exclude(content__isnull=True)
    texts = [doc.content for doc in docs]

    if not texts:
        return None

    embeddings = model.encode(texts, convert_to_numpy=True)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    faiss.write_index(index, index_path)
    return index

def get_index():
    if os.path.exists(index_path):
        return faiss.read_index(index_path)
    return build_faiss_index()

def search_similar(query, k=3):
    index = get_index()
    if index is None:
        return []

    query_emb = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_emb, k)
    return indices[0].tolist()
