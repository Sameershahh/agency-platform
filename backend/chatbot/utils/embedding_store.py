import os, json, faiss, numpy as np
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
VECTOR_STORE_DIR = os.path.join(BASE_DIR, "vector_store")
INDEX_PATH = os.path.join(VECTOR_STORE_DIR, "faiss_index.index")
DOCS_PATH = os.path.join(VECTOR_STORE_DIR, "documents.json")

os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

MODEL_NAME = "all-MiniLM-L6-v2"

def _load_model():
    model = None
    """Safely load SentenceTransformer on CPU (handles meta-tensor issue)."""
    from torch import nn
    try:
        model = SentenceTransformer(MODEL_NAME)
        model = model.to_empty(device="cpu") 
        model.to("cpu")
    except NotImplementedError:
        print(" Meta tensor issue detected, reinitializing model safely.")
        def _load_model():
            model = SentenceTransformer(MODEL_NAME)
            try:
                model.to("cpu")
            except NotImplementedError:
        # fallback for PyTorch 2.3+ meta tensor issue
                model = SentenceTransformer(MODEL_NAME, device=None)
            return model
    print(" Embedding model loaded.")
    return model

_model = _load_model()

def _save_docs_metadata(docs_meta):
    with open(DOCS_PATH, "w", encoding="utf-8") as f:
        json.dump(docs_meta, f, ensure_ascii=False, indent=2)

def _load_docs_metadata():
    return json.load(open(DOCS_PATH, "r", encoding="utf-8")) if os.path.exists(DOCS_PATH) else []

def build_index(text_chunks, metadatas):
    """Build or rebuild FAISS index."""
    if not text_chunks:
        if os.path.exists(INDEX_PATH):
            os.remove(INDEX_PATH)
        _save_docs_metadata([])
        return

    embeddings = _model.encode(text_chunks, show_progress_bar=False, convert_to_numpy=True)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings.astype("float32"))
    faiss.write_index(index, INDEX_PATH)
    _save_docs_metadata([{"text": t, "meta": m} for t, m in zip(text_chunks, metadatas)])
    print(f" Built FAISS index with {len(text_chunks)} chunks.")

def add_documents(text_chunks, metadatas):
    """Append to existing FAISS index."""
    if not text_chunks:
        return
    if os.path.exists(INDEX_PATH):
        index = faiss.read_index(INDEX_PATH)
        docs = _load_docs_metadata()
        new_embs = _model.encode(text_chunks, convert_to_numpy=True)
        index.add(new_embs.astype("float32"))
        faiss.write_index(index, INDEX_PATH)
        docs.extend([{"text": t, "meta": m} for t, m in zip(text_chunks, metadatas)])
        _save_docs_metadata(docs)
    else:
        build_index(text_chunks, metadatas)

def query(query_text, top_k=3):
    if not os.path.exists(INDEX_PATH):
        return []
    index = faiss.read_index(INDEX_PATH)
    docs = _load_docs_metadata()
    q_emb = _model.encode([query_text], convert_to_numpy=True)
    D, I = index.search(q_emb.astype("float32"), top_k)
    return [docs[i] for i in I[0] if 0 <= i < len(docs)]
