from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

try:
    from backend.database import search_careers, get_all_careers, get_retriever
except ImportError:
    from database import search_careers, get_all_careers, get_retriever

app = FastAPI(title="Career Guidance Chatbot API")

# Add CORS Middleware to allow requests from Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local dev ease, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class CareerItem(BaseModel):
    name: str
    description: str
    skills: List[str]
    salary: str
    growth: str
    roadmap: List[str]

class ChatResponse(BaseModel):
    reply: str
    careers: List[CareerItem]

class CareerListResponse(BaseModel):
    careers: List[CareerItem]

@app.on_event("startup")
def startup_event():
    # Pre-load the database and retriever to avoid delays on first request
    try:
        get_retriever()
        print("Vector database loaded successfully on startup.")
    except Exception as e:
        print(f"Warning: Could not load vector database on startup: {e}")
        print("Please ensure you run seed_db.py first.")

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    user_msg = request.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    try:
        # Search Chroma DB for matching careers
        matched_careers = search_careers(user_msg, k=3)
        
        # Craft a natural-sounding response
        if matched_careers:
            reply = f"I've analyzed your interest in '{user_msg}'. Based on our database, here are the top matching career paths that align with your skills and preferences. Click on any card below to explore a detailed learning roadmap and career statistics!"
        else:
            reply = "I couldn't find any career options in our database matching those specific interests. Could you describe your skills or hobbies in a different way?"
            
        return ChatResponse(reply=reply, careers=matched_careers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

@app.get("/api/careers", response_model=CareerListResponse)
def get_careers_endpoint():
    try:
        all_careers = get_all_careers()
        return CareerListResponse(careers=all_careers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not retrieve careers: {str(e)}")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": time.time()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
