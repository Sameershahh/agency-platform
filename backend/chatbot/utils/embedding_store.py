# backend/chatbot/utils/embedding_store.py

import os
import json
import logging
from typing import List, Dict, Any, Optional, Tuple

import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

# -----------------------------------------------------------------------------
# Logging & Environment
# -----------------------------------------------------------------------------
logger = logging.getLogger(__name__)
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

# Enable/disable embeddings globally (e.g., for very low-memory deployments)
EMBEDDING_ENABLED = os.getenv("EMBEDDING_ENABLED", "true").lower() == "true"

# Model selection: use a smaller default in production to reduce memory
DEFAULT_DEV_MODEL = "all-MiniLM-L6-v2"
DEFAULT_PROD_MODEL = os.getenv("EMBEDDING_MODEL_NAME", "paraphrase-MiniLM-L3-v2")

# Batch size for encoding (reduce RAM spikes)
ENCODE_BATCH_SIZE = int(os.getenv("ENCODE_BATCH_SIZE", "64"))

# Persisted locations
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
VECTOR_STORE_DIR = os.path.join(BASE_DIR, "vector_store")
INDEX_PATH = os.path.join(VECTOR_STORE_DIR, "faiss_index.index")
DOCS_PATH = os.path.join(VECTOR_STORE_DIR, "documents.json")

os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

# -----------------------------------------------------------------------------
# Global model (lazy loaded)
# -----------------------------------------------------------------------------
_model: Optional[SentenceTransformer] = None
_model_name: Optional[str] = None


def _current_model_name() -> str:
    """Choose model name based on environment for memory safety."""
    if ENVIRONMENT == "production":
        return DEFAULT_PROD_MODEL
    return DEFAULT_DEV_MODEL


def get_model() -> Optional[SentenceTransformer]:
    """
    Lazy load the embedding model. Returns None if embeddings are disabled.
    Keeps the same signature you use elsewhere.
    """
    global _model, _model_name

    if not EMBEDDING_ENABLED:
        logger.warning("Embeddings are disabled by EMBEDDING_ENABLED=false.")
        return None

    if _model is not None:
        return _model

    try:
        _model_name = _current_model_name()
        logger.info(f"Loading SentenceTransformer model: {_model_name} (device=cpu)")
        _model = SentenceTransformer(_model_name, device="cpu")
        logger.info(f"✓ Embedding model loaded: {_model_name}")
        return _model
    except Exception as e:
        logger.error(f"✗ Failed to load embedding model '{_model_name}': {e}")
        # In production, fail gracefully if model can’t load
        if ENVIRONMENT == "production":
            return None
        # In development, raise to make issues obvious
        raise


# -----------------------------------------------------------------------------
# Metadata I/O
# -----------------------------------------------------------------------------
def _save_docs_metadata(docs_meta: List[Dict[str, Any]]) -> None:
    with open(DOCS_PATH, "w", encoding="utf-8") as f:
        json.dump(docs_meta, f, ensure_ascii=False, indent=2)


def _load_docs_metadata() -> List[Dict[str, Any]]:
    if os.path.exists(DOCS_PATH):
        with open(DOCS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


# -----------------------------------------------------------------------------
# Helper: batched encoding to avoid RAM spikes
# -----------------------------------------------------------------------------
def _encode_texts_batched(model: SentenceTransformer, texts: List[str]) -> np.ndarray:
    if not texts:
        return np.empty((0, 384), dtype="float32")  # shape placeholder; overwritten anyway

    all_embs: List[np.ndarray] = []
    for i in range(0, len(texts), ENCODE_BATCH_SIZE):
        chunk = texts[i : i + ENCODE_BATCH_SIZE]
        embs = model.encode(
            chunk,
            show_progress_bar=False,
            convert_to_numpy=True,
        )
        # Ensure float32 for FAISS
        all_embs.append(embs.astype("float32"))
    return np.vstack(all_embs)


# -----------------------------------------------------------------------------
# Index builders and appenders
# -----------------------------------------------------------------------------
def build_index(text_chunks: List[str], metadatas: List[Dict[str, Any]]) -> None:
    """
    Build or rebuild FAISS index from scratch.
    - Dev: full capability (build in-process).
    - Prod: still allowed with smaller model & batch caps; recommended to precompute offline if data is large.
    """
    if not text_chunks:
        # Clean up if no chunks provided
        for path in (INDEX_PATH, DOCS_PATH):
            if os.path.exists(path):
                os.remove(path)
        logger.info("✓ Index cleared (no documents)")
        return

    model = get_model()
    if model is None:
        logger.warning("Embedding model unavailable. Skipping index build.")
        return

    try:
        logger.info(f"Building index for {len(text_chunks)} chunks (batch={ENCODE_BATCH_SIZE})...")
        embeddings = _encode_texts_batched(model, text_chunks)  # batched to avoid OOM

        dim = embeddings.shape[1]
        index = faiss.IndexFlatL2(dim)
        index.add(embeddings)

        faiss.write_index(index, INDEX_PATH)
        _save_docs_metadata(
            [{"text": t, "meta": m} for t, m in zip(text_chunks, metadatas)]
        )
        logger.info(f"✓ Index built successfully: {len(text_chunks)} chunks indexed, dim={dim}")
    except MemoryError as me:
        logger.error(f"✗ MemoryError during index build: {me}")
        if ENVIRONMENT == "production":
            logger.error("Consider precomputing embeddings offline or upgrading memory.")
        raise
    except Exception as e:
        logger.error(f"✗ Error building index: {e}")
        raise


def add_documents(text_chunks: List[str], metadatas: List[Dict[str, Any]]) -> None:
    """Append to existing FAISS index (creates index if missing)."""
    if not text_chunks:
        logger.info("No chunks to add")
        return

    model = get_model()
    if model is None:
        logger.warning("Embedding model unavailable. Skipping document append.")
        return

    try:
        new_embs = _encode_texts_batched(model, text_chunks)

        if os.path.exists(INDEX_PATH):
            index = faiss.read_index(INDEX_PATH)
            index.add(new_embs)

            docs = _load_docs_metadata()
            docs.extend([{"text": t, "meta": m} for t, m in zip(text_chunks, metadatas)])
            _save_docs_metadata(docs)

            faiss.write_index(index, INDEX_PATH)
            logger.info(f"✓ Appended {len(text_chunks)} chunks (total: {len(docs)})")
        else:
            logger.info("No existing index found, building new one...")
            build_index(text_chunks, metadatas)
    except MemoryError as me:
        logger.error(f"✗ MemoryError during append: {me}")
        if ENVIRONMENT == "production":
            logger.error("Consider precomputing embeddings offline or upgrading memory.")
        raise
    except Exception as e:
        logger.error(f"✗ Error adding documents: {e}")
        raise


# -----------------------------------------------------------------------------
# Query
# -----------------------------------------------------------------------------
def _safe_read_index() -> Optional[faiss.Index]:
    if not os.path.exists(INDEX_PATH):
        logger.warning("⚠ No index found, returning empty results")
        return None
    try:
        return faiss.read_index(INDEX_PATH)
    except Exception as e:
        logger.error(f"✗ Failed to read FAISS index: {e}")
        return None


def query(query_text: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Search for similar documents.
    Returns: List of dicts with 'text' and 'meta' keys.
    Production safety:
    - Uses batched encoding for the query (tiny batch).
    - If model is unavailable, returns top_k docs (basic fallback) to avoid 500s.
    """
    query_text = (query_text or "").strip()
    if not query_text:
        logger.warning("⚠ Empty query provided")
        return []

    index = _safe_read_index()
    if index is None:
        return []

    docs = _load_docs_metadata()
    if not docs:
        logger.warning("⚠ Index exists but no documents found")
        return []

    model = get_model()
    if model is None:
        logger.info("⚠ Model unavailable; returning first N docs as fallback.")
        return docs[: min(top_k, len(docs))]

    try:
        q_emb = model.encode([query_text], convert_to_numpy=True).astype("float32")
        # Limit top_k to available docs
        k = min(top_k, len(docs))
        D, I = index.search(q_emb, k)

        results: List[Dict[str, Any]] = []
        for idx in I[0]:
            if 0 <= idx < len(docs):
                results.append(docs[idx])

        logger.info(f"✓ Query returned {len(results)} results")
        return results
    except MemoryError as me:
        logger.error(f"✗ MemoryError during query: {me}")
        if ENVIRONMENT == "production":
            logger.error("Consider smaller model or offline query processing.")
        return []
    except Exception as e:
        logger.error(f"✗ Error during query: {e}")
        return []
