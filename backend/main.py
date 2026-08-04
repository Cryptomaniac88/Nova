from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Nova API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)

class ChatRequest(BaseModel):
    message: str
    agent_name: str = "Companion"
    user_name: str = "Owner"

@app.get("/")
def read_root():
    return {
        "message": "Nova API is running",
        "status": "Phase 2 - Companion via Grok API"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/agent/chat")
async def chat_with_agent(request: ChatRequest):
    user_message = request.message.strip()

    if not user_message:
        return {"reply": "I didn't receive any message."}

    system_prompt = f"""You are {request.agent_name}, the Companion of Nova.

Nova is a gamified AI platform where people learn to work with AI agents and build their own systems.
It combines strengths of Hugging Face, Cursor-like building, and Base44-like speed.

Key facts:
- The user is the Owner
- You are their personal holographic Companion and guide
- Levels + XP unlock features
- Agents get a unique registration number
- Style: dark, futuristic, green glow
- Current stage: early development (Phase 2)
- The hologram is a digital green orb in the web UI (not a physical laser hologram)

Your role:
- Stay in Nova context
- Give practical, concrete help
- Keep answers clear and relatively short unless asked for more detail
- Speak in the same language as the user

Current Owner: {request.user_name}
"""

    try:
        completion = client.chat.completions.create(
            model="grok-4-1-fast-reasoning",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.6,
            max_tokens=500,
        )

        reply = completion.choices[0].message.content

        return {
            "reply": reply.strip() if reply else "No content received from the model.",
            "agent_name": request.agent_name,
        }

    except Exception as e:
        return {
            "reply": f"Error while talking to Grok API: {type(e).__name__}: {str(e)}"
        }