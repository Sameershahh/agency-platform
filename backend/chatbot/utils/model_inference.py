import os
import requests
import logging
from transformers import pipeline, Pipeline

logger = logging.getLogger(__name__)

HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small"
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

_local_pipeline: Pipeline | None = None

def _call_hf_api(prompt: str, max_length: int):
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"} if HF_API_TOKEN else {}
    payload = {"inputs": prompt, "parameters": {"max_new_tokens": max_length}}
    return requests.post(HF_API_URL, headers=headers, json=payload, timeout=25)

def generate_answer(prompt: str, max_length: int = 200) -> str:
    """Use HF API in production; fallback to local pipeline in dev."""
    global _local_pipeline

    # Prefer Hugging Face API
    try:
        resp = _call_hf_api(prompt, max_length)
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and data and "generated_text" in data[0]:
                return data[0]["generated_text"].strip()
            if isinstance(data, dict) and "generated_text" in data:
                return data["generated_text"].strip()
            logger.warning(f"HF API returned unexpected payload: {data}")
        else:
            logger.error(f"HF API returned status {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.error(f"HF API request failed: {e}")

    # Fallback only in development
    if ENVIRONMENT == "production":
        return "Service is warming up. Please try again later."

    try:
        if _local_pipeline is None:
            logger.info("Loading local fallback model (google/flan-t5-small) on CPU...")
            _local_pipeline = pipeline("text2text-generation", model="google/flan-t5-small", device=-1)
        out = _local_pipeline(prompt, max_length=max_length)
        if isinstance(out, list) and out and "generated_text" in out[0]:
            return out[0]["generated_text"].strip()
    except Exception as e:
        logger.error(f"Local model inference failed: {e}")

    return "Sorry, I couldn’t generate an answer right now."
