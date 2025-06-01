import chromadb
from sentence_transformers import SentenceTransformer
import os

model = SentenceTransformer('all-MiniLM-L6-v2')

client = chromadb.PersistentClient(
    path=os.path.join(os.path.dirname(__file__), '..', 'chroma_data')
)

collection = client.get_or_create_collection(
    name="pipeline_data",
    metadata={"hnsw:space": "cosine"}
)

def add_to_vector_db(docs):
    ids = [doc["id"] for doc in docs]
    contents = [doc["content"] for doc in docs]
    embeddings = model.encode(contents).tolist()

    for doc, emb in zip(contents, embeddings):
        print(f"Adding: {doc}\nEmbedding: {emb[:5]}...")  # Debug

    collection.add(ids=ids, documents=contents, embeddings=embeddings)

def get_context(query):
    query_embedding = model.encode([query]).tolist()

    print(f"Query: {query}\nEmbedding: {query_embedding[0][:5]}...")  # Debug

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=5,
        include=["distances", "documents"]
    )

    documents = results['documents'][0]
    distances = results['distances'][0]

    print("DEBUG Chroma Results:")
    print("Documents:", documents)
    print("Distances:", distances)

    threshold = 0.85  # Key filter

    matches = []
    for doc, dist in zip(documents, distances):
        if dist < threshold:
            confidence = round((1 - (dist / 2)) * 100, 2)
            matches.append(f"[{confidence}% match] {doc}")

    # If no good matches, return empty
    return matches
