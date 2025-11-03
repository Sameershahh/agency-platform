from typing import List

def chunk_text(text: str, chunk_size: int = 800, overlap: int = 200) -> List[str]:
    """
    Simple sliding-window chunking.
    - chunk_size: number of characters per chunk
    - overlap: characters to overlap between chunks
    """
    if not text:
        return []
    text = text.replace("\r\n", "\n")
    chunks = []
    start = 0
    length = len(text)
    while start < length:
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = max(end - overlap, end)  # ensure progress
    return chunks
