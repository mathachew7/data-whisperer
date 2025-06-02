import hashlib

def chunk_text(text, max_length=200):
    """
    Split a given text into smaller chunks each containing up to max_length words.
    This helps manage very long log entries by breaking them into smaller pieces.

    Args:
        text (str): The input text to chunk.
        max_length (int): Maximum number of words per chunk.

    Returns:
        List[str]: List of text chunks.
    """
    words = text.split()  # Split text into individual words
    chunks = []

    # Loop through words in steps of max_length to create chunks
    for i in range(0, len(words), max_length):
        chunk = " ".join(words[i:i + max_length])  # Join words for current chunk
        chunks.append(chunk)

    return chunks


def preprocess_logs(logs: list) -> list:
    """
    Preprocess a list of log entries by:
    - Removing empty or whitespace-only logs.
    - Deduplicating logs based on content hash (MD5).
    - Splitting long logs into smaller chunks using chunk_text.

    Each chunk is assigned a unique ID derived from the original log ID.

    Args:
        logs (list): List of dicts, each with at least a 'content' field.

    Returns:
        List[dict]: Cleaned list of logs ready for vector embedding.
    """
    cleaned = []
    seen_hashes = set()  # To track unique log contents and avoid duplicates

    for log in logs:
        content = log.get("content", "").strip()  # Get and clean content

        if not content:
            # Skip if content is empty or just whitespace
            continue

        # Create a hash of content to detect duplicates efficiently
        content_hash = hashlib.md5(content.encode()).hexdigest()
        if content_hash in seen_hashes:
            # Skip if this content was already processed
            continue

        seen_hashes.add(content_hash)  # Mark content as seen

        # Split long content into smaller chunks for better embedding handling
        chunks = chunk_text(content)

        # Add each chunk as a separate log entry with unique ID
        for idx, chunk in enumerate(chunks):
            cleaned.append({
                "id": f"{log.get('id', 'log')}-{idx+1}",  # Unique chunk ID
                "content": chunk
            })

    return cleaned
