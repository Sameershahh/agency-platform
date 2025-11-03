import os
import requests
from transformers import pipeline

HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small"
HF_API_TOKEN = os.getenv("HF_API_TOKEN", None)

# Load a lightweight local fallback model lazily
_local_pipeline = None


def generate_answer(prompt: str, max_length: int = 200) -> str:
    """
    Generate an answer via Hugging Face API (free) or fallback to local model.
    """
    global _local_pipeline
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"} if HF_API_TOKEN else {}

    try:
        # --- Try remote inference API first ---
        payload = {"inputs": prompt, "parameters": {"max_new_tokens": max_length}}
        resp = requests.post(HF_API_URL, headers=headers, json=payload, timeout=25)

        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and "generated_text" in data[0]:
                return data[0]["generated_text"].strip()
            if isinstance(data, dict) and "generated_text" in data:
                return data["generated_text"].strip()
            print("HF API response format unexpected:", data)
        else:
            print(f" HF API returned {resp.status_code}: {resp.text}")

    except Exception as e:
        print(f" HF API failed ({e}), switching to local model...")

    # --- Fallback to local generation ---
    try:
        if _local_pipeline is None:
            print("Loading local fallback model (flan-t5-small)...")
            _local_pipeline = pipeline(
                "text2text-generation",
                model="google/flan-t5-small",
                device=-1  # always CPU
            )
        out = _local_pipeline(prompt, max_length=max_length, clean_up_tokenization_spaces=True)
        return out[0]["generated_text"].strip()
    except Exception as e:
        print(f" Local model inference failed: {e}")
        return "Sorry, I couldn’t generate an answer right now."
