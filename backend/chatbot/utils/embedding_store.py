import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
VECTOR_STORE_DIR = os.path.join(BASE_DIR, "vector_store")
INDEX_PATH = os.path.join(VECTOR_STORE_DIR, "faiss_index.index")
DOCS_PATH = os.path.join(VECTOR_STORE_DIR, "documents.json")

os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

MODEL_NAME = "all-MiniLM-L6-v2"

def _load_model():
    """Load SentenceTransformer model and ensure it's on CPU."""
    try:
        model = SentenceTransformer(MODEL_NAME)
        # SentenceTransformer handles device selection; ensure CPU usage
        # (if you later want GPU, set device="cuda" explicitly when available)
        print("Embedding model loaded:", MODEL_NAME)
        return model
    except Exception as e:
        print("Failed to load embedding model:", e)
        raise

# instantiate once
_model = None

def get_model():
    """Lazy load embedding model only when first used."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(MODEL_NAME, device="cpu")
    return _model

def _save_docs_metadata(docs_meta):
    with open(DOCS_PATH, "w", encoding="utf-8") as f:
        json.dump(docs_meta, f, ensure_ascii=False, indent=2)

def _load_docs_metadata():
    return json.load(open(DOCS_PATH, "r", encoding="utf-8")) if os.path.exists(DOCS_PATH) else []

def build_index(text_chunks, metadatas):
    """Build or rebuild FAISS index from scratch."""
    if not text_chunks:
        if os.path.exists(INDEX_PATH):
            os.remove(INDEX_PATH)
        _save_docs_metadata([])
        return

    model = get_model()  # ensure model is loaded here
    embeddings = model.encode(text_chunks, show_progress_bar=False, convert_to_numpy=True)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings.astype("float32"))
    faiss.write_index(index, INDEX_PATH)
    _save_docs_metadata([{"text": t, "meta": m} for t, m in zip(text_chunks, metadatas)])

def add_documents(text_chunks, metadatas):
    """Append to existing FAISS index (creates index if missing)."""
    if not text_chunks:
        return

    if os.path.exists(INDEX_PATH):
        index = faiss.read_index(INDEX_PATH)
        docs = _load_docs_metadata()
        new_embs = _model.encode(text_chunks, show_progress_bar=False, convert_to_numpy=True)
        index.add(new_embs.astype("float32"))
        faiss.write_index(index, INDEX_PATH)
        docs.extend([{"text": t, "meta": m} for t, m in zip(text_chunks, metadatas)])
        _save_docs_metadata(docs)
        print(f"Appended {len(text_chunks)} chunks to existing index (now {len(docs)} total).")
    else:
        build_index(text_chunks, metadatas)

def query(query_text, top_k=3):
    """Return list of docs: each item is {'text':..., 'meta':...}"""
    if not os.path.exists(INDEX_PATH):
        return []
    index = faiss.read_index(INDEX_PATH)
    docs = _load_docs_metadata()
    q_emb = _model.encode([query_text], convert_to_numpy=True)
    D, I = index.search(q_emb.astype("float32"), top_k)
    results = []
    for i in I[0]:
        if 0 <= i < len(docs):
            results.append(docs[i])
    return results
