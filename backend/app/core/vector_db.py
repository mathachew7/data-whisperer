import os
import chromadb
from sentence_transformers import SentenceTransformer

# Disable parallel tokenizer warnings that can cause deadlocks
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Load sentence transformer model for embedding text
model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize persistent Chroma client with local storage path
client = chromadb.PersistentClient(
    path=os.path.join(os.path.dirname(__file__), '..', 'chroma_data')
)

# Create or get existing collection for storing pipeline data embeddings
collection = client.get_or_create_collection(
    name="pipeline_data",
    metadata={"hnsw:space": "cosine"}  # Use cosine similarity for nearest neighbors
)

def add_to_vector_db(docs):
    """
    Add a list of documents (dicts with 'id' and 'content') to Chroma vector DB
    after encoding their content into embeddings.

    Args:
        docs (list): List of dicts with keys "id" and "content"
    """
    ids = [doc["id"] for doc in docs]
    contents = [doc["content"] for doc in docs]
    embeddings = model.encode(contents).tolist()

    # Debug print first 5 dimensions of each embedding with document snippet
    for doc, emb in zip(contents, embeddings):
        print(f"Adding: {doc}\nEmbedding: {emb[:5]}...")

    # Add documents, ids and embeddings to the collection
    collection.add(ids=ids, documents=contents, embeddings=embeddings)

def get_context(query):
    """
    Query the vector DB to find relevant documents matching the input query.

    Args:
        query (str): User's question or query string.

    Returns:
        List[str]: List of matching document strings above similarity threshold.
    """
    # Encode query text into embedding
    query_embedding = model.encode([query]).tolist()

    # Debug print the first 5 dimensions of query embedding
    print(f"Query: {query}\nEmbedding: {query_embedding[0][:5]}...")

    # Search collection for closest matches to query embedding
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=5,
        include=["distances", "documents"]
    )

    documents = results['documents'][0]
    distances = results['distances'][0]

    # Debug output of matches and their distances
    print("DEBUG Chroma Results:")
    print("Documents:", documents)
    print("Distances:", distances)

    # Define distance threshold to filter relevant results
    threshold = 0.85

    matches = []
    for doc, dist in zip(documents, distances):
        if dist < threshold:
            # Confidence score calculation, higher is better
            confidence = round((1 - (dist / 2)) * 100, 2)
            matches.append(f"[{confidence}% match] {doc}")

    return matches
