import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Nova API", version="0.3.1")

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
    instruction: str = ""

@app.get("/")
def read_root():
    return {
        "message": "Nova API is running",
        "status": "Phase 2 - Companion + Agents via Grok API"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/agent/chat")
async def chat_with_agent(request: ChatRequest):
    user_message = request.message.strip()

    if not user_message:
        return {"reply": "I didn't receive any message."}

    if request.instruction.strip():
        system_prompt = f"""You are {request.agent_name}, an AI agent inside the Nova platform.

Your instructions:
{request.instruction}

Rules:
- Follow your instructions carefully
- You are a specialist agent, not the main Companion
- Do NOT invent features that do not exist in Nova
- Nova currently has: Dashboard, Companion chat, Agents page (create/list/chat), Control Room, Grok API
- Keep answers practical and clear
- Speak in the same language as the user
- Owner: {request.user_name}
"""
    else:
        # Main Companion
        system_prompt = f"""You are {request.agent_name}, the Companion of Nova.

Nova is a gamified AI platform where the Owner learns to work with AI agents and build systems.

What currently exists in Nova:
- Dashboard
- Companion chat (you)
- Agents page: Owner can create agents, see them, and open chat with them
- Control Room
- Floating Companion widget
- Grok API for answers

What does NOT exist yet:
- You cannot create agents yourself
- No automatic agent registry actions
- No multi-agent orchestration yet
- No payments between agents yet

Your role:
- Guide the Owner
- Explain how things work
- Suggest next steps
- If the Owner wants a new agent, tell them to go to the Agents page and click "New Agent"
- Never pretend you already created or activated an agent
- Keep answers practical and clear
- Speak in the same language as the user

Owner: {request.user_name}
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