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

# Global model instance (lazy loaded)
_model = None

def get_model():
    """Lazy load embedding model only when first used."""
    global _model
    if _model is None:
        try:
            _model = SentenceTransformer(MODEL_NAME, device="cpu")
            print(f"✓ Embedding model loaded: {MODEL_NAME}")
        except Exception as e:
            print(f"✗ Failed to load embedding model: {e}")
            raise
    return _model

def _save_docs_metadata(docs_meta):
    """Save document metadata to JSON file."""
    with open(DOCS_PATH, "w", encoding="utf-8") as f:
        json.dump(docs_meta, f, ensure_ascii=False, indent=2)

def _load_docs_metadata():
    """Load document metadata from JSON file."""
    if os.path.exists(DOCS_PATH):
        with open(DOCS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def build_index(text_chunks, metadatas):
    """Build or rebuild FAISS index from scratch."""
    if not text_chunks:
        # Clean up if no chunks provided
        if os.path.exists(INDEX_PATH):
            os.remove(INDEX_PATH)
        if os.path.exists(DOCS_PATH):
            os.remove(DOCS_PATH)
        print("✓ Index cleared (no documents)")
        return

    try:
        model = get_model()  # ✓ Correctly loads model
        print(f"Building index for {len(text_chunks)} chunks...")
        
        embeddings = model.encode(
            text_chunks, 
            show_progress_bar=False, 
            convert_to_numpy=True
        )
        
        dim = embeddings.shape[1]
        index = faiss.IndexFlatL2(dim)
        index.add(embeddings.astype("float32"))
        
        faiss.write_index(index, INDEX_PATH)
        _save_docs_metadata([
            {"text": t, "meta": m} 
            for t, m in zip(text_chunks, metadatas)
        ])
        
        print(f"✓ Index built successfully: {len(text_chunks)} chunks indexed")
        
    except Exception as e:
        print(f"✗ Error building index: {e}")
        raise

def add_documents(text_chunks, metadatas):
    """Append to existing FAISS index (creates index if missing)."""
    if not text_chunks:
        print("No chunks to add")
        return

    try:
        model = get_model()  # ✓ FIX: Get model instance
        
        if os.path.exists(INDEX_PATH):
            # Append to existing index
            index = faiss.read_index(INDEX_PATH)
            docs = _load_docs_metadata()
            
            new_embs = model.encode(  # ✓ Use model variable
                text_chunks, 
                show_progress_bar=False, 
                convert_to_numpy=True
            )
            
            index.add(new_embs.astype("float32"))
            faiss.write_index(index, INDEX_PATH)
            
            docs.extend([
                {"text": t, "meta": m} 
                for t, m in zip(text_chunks, metadatas)
            ])
            _save_docs_metadata(docs)
            
            print(f"✓ Appended {len(text_chunks)} chunks (total: {len(docs)})")
        else:
            # No existing index, build from scratch
            print("No existing index found, building new one...")
            build_index(text_chunks, metadatas)
            
    except Exception as e:
        print(f"✗ Error adding documents: {e}")
        raise

def query(query_text, top_k=3):
    """
    Search for similar documents.
    Returns: List of dicts with 'text' and 'meta' keys.
    """
    if not query_text or not query_text.strip():
        print("⚠ Empty query provided")
        return []
    
    if not os.path.exists(INDEX_PATH):
        print("⚠ No index found, returning empty results")
        return []
    
    try:
        model = get_model()  # ✓ FIX: Get model instance
        index = faiss.read_index(INDEX_PATH)
        docs = _load_docs_metadata()
        
        if not docs:
            print("⚠ Index exists but no documents found")
            return []
        
        # Encode query
        q_emb = model.encode(  # ✓ Use model variable
            [query_text], 
            convert_to_numpy=True
        )
        
        # Search index
        D, I = index.search(q_emb.astype("float32"), min(top_k, len(docs)))
        
        # Collect results
        results = []
        for idx in I[0]:
            if 0 <= idx < len(docs):
                results.append(docs[idx])
        
        print(f"✓ Query returned {len(results)} results")
        return results
        
    except Exception as e:
        print(f"✗ Error during query: {e}")
        # Don't raise in query - return empty results gracefully
        return []

# Optional: Preload model on module import (if you want eager loading)
# Uncomment the line below if you want the model loaded immediately
# get_model()