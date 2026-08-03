from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Nova API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    agent_name: str = "Agent"
    user_name: str = "User"

@app.get("/")
def read_root():
    return {
        "message": "Nova API is running",
        "status": "Phase 1 - Core Loop"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/agent/chat")
def chat_with_agent(request: ChatRequest):
    user_message = request.message.strip()

    if not user_message:
        return {"reply": "I didn't receive any message."}

    # Voorlopig een eenvoudig maar netjes antwoord
    # Later vervangen we dit door echte AI
    reply = f"You said: \"{user_message}\". I'm still learning, but I'm here to help you, {request.user_name}."

    return {
        "reply": reply,
        "agent_name": request.agent_name
    }