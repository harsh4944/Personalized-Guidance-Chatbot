import os
import json
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# Define path to Chroma database
DB_DIR = os.path.join(os.path.dirname(__file__), "career_db")

# Cache the vectorstore and retriever
_retriever = None

def get_retriever():
    global _retriever
    if _retriever is None:
        if not os.path.exists(DB_DIR):
            raise FileNotFoundError(f"Chroma DB directory '{DB_DIR}' not found. Please run seed_db.py first.")
        
        embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vectorstore = Chroma(persist_directory=DB_DIR, embedding_function=embedding_model)
        _retriever = vectorstore
    return _retriever

def search_careers(query: str, k: int = 3):
    """
    Search the Chroma DB for the top k matching careers.
    Unpacks JSON-serialized metadata fields for consumption.
    """
    vectorstore = get_retriever()
    results = vectorstore.similarity_search(query, k=k)
    
    careers = []
    for doc in results:
        meta = doc.metadata
        
        # Deserialise fields that were saved as JSON strings
        try:
            skills = json.loads(meta.get("skills", "[]"))
        except Exception:
            skills = []
            
        try:
            roadmap = json.loads(meta.get("roadmap", "[]"))
        except Exception:
            roadmap = []
            
        careers.append({
            "name": meta.get("name", ""),
            "description": meta.get("description", ""),
            "skills": skills,
            "salary": meta.get("salary", "N/A"),
            "growth": meta.get("growth", "N/A"),
            "roadmap": roadmap
        })
        
    return careers

def get_all_careers():
    """
    Retrieve all careers from the database (useful for direct exploration).
    """
    vectorstore = get_retriever()
    # Get all documents in the Chroma collection
    all_docs = vectorstore.get()
    
    careers = []
    ids_seen = set()
    
    for i in range(len(all_docs.get("ids", []))):
        meta = all_docs["metadatas"][i]
        name = meta.get("name", "")
        
        if name in ids_seen:
            continue
        ids_seen.add(name)
        
        try:
            skills = json.loads(meta.get("skills", "[]"))
        except Exception:
            skills = []
            
        try:
            roadmap = json.loads(meta.get("roadmap", "[]"))
        except Exception:
            roadmap = []
            
        careers.append({
            "name": name,
            "description": meta.get("description", ""),
            "skills": skills,
            "salary": meta.get("salary", "N/A"),
            "growth": meta.get("growth", "N/A"),
            "roadmap": roadmap
        })
        
    return careers
