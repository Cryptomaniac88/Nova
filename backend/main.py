from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI(title="Nova API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    agent_name: str = "Companion"
    user_name: str = "Owner"

@app.get("/")
def read_root():
    return {
        "message": "Nova API is running",
        "status": "Phase 2 - Companion active"
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

Nova is a web application (Next.js + FastAPI) with a digital green hologram orb that has eyes and neural animations.

IMPORTANT RULES:
- Only talk about the current digital hologram in the web interface (CSS/HTML)
- Never talk about real lasers, physical projections, AR/VR hardware, or 3D printing
- Give short, practical suggestions only
- Maximum 4-6 short bullet points or a short paragraph
- Stay 100% inside the Nova project context
- Speak in the same language as the user

Current stage: early Phase 2
Owner: {request.user_name}

Your answers must be concrete and useful for improving the existing web hologram.
"""

    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(
                "http://127.0.0.1:1234/v1/chat/completions",
                json={
                    "model": "prism-ml/bonsai-27b",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    "temperature": 0.5,
                    "max_tokens": 350,
                    "stream": False
                },
                headers={"Content-Type": "application/json"}
            )

            if response.status_code != 200:
                return {"reply": f"LM Studio returned status {response.status_code}"}

            data = response.json()

            try:
                reply = data["choices"][0]["message"]["content"]
            except Exception:
                reply = str(data)

            return {
                "reply": reply.strip() if reply else "No content received from the model.",
                "agent_name": request.agent_name
            }

    except Exception as e:
        return {
            "reply": f"Error while talking to LM Studio: {type(e).__name__}: {str(e)}"
        }