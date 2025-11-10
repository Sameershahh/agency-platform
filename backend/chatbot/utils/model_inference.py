import os
import requests
from transformers import pipeline, Pipeline

HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small"
HF_API_TOKEN = os.getenv("HF_API_TOKEN", None)

_local_pipeline: Pipeline | None = None

def _call_hf_api(prompt: str, max_length: int):
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"} if HF_API_TOKEN else {}
    payload = {"inputs": prompt, "parameters": {"max_new_tokens": max_length}}
    resp = requests.post(HF_API_URL, headers=headers, json=payload, timeout=25)
    return resp

def generate_answer(prompt: str, max_length: int = 200) -> str:
    """
    Try Hugging Face Inference API first (requires HF_API_TOKEN for private models / rate limits).
    If that fails or times out, fallback to a local pipeline (CPU).
    """
    global _local_pipeline

    # Try remote HF inference
    try:
        resp = _call_hf_api(prompt, max_length)
        if resp.status_code == 200:
            data = resp.json()
            # HF inference can return list or dict
            if isinstance(data, list) and data and "generated_text" in data[0]:
                return data[0]["generated_text"].strip()
            if isinstance(data, dict) and "generated_text" in data:
                return data["generated_text"].strip()
            # Some models return 'error' or different schema
            print("HF API returned unexpected payload:", data)
        else:
            print(f"HF API returned status {resp.status_code}: {resp.text}")
    except Exception as e:
        print("HF API request failed:", e)

    # Fallback to local model
    try:
        if _local_pipeline is None:
            print("Loading local fallback model (google/flan-t5-small) on CPU...")
            _local_pipeline = pipeline("text2text-generation", model="google/flan-t5-small", device=-1)
        # pipeline returns list of dicts with 'generated_text'
        out = _local_pipeline(prompt, max_length=max_length)
        if isinstance(out, list) and out and "generated_text" in out[0]:
            return out[0]["generated_text"].strip()
    except Exception as e:
        print("Local model inference failed:", e)

    return "Sorry, I couldn’t generate an answer right now."
