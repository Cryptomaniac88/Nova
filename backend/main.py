from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import traceback

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
    agent_name: str = "Agent"
    user_name: str = "User"

@app.get("/")
def read_root():
    return {
        "message": "Nova API is running",
        "status": "Phase 2 - Connected to LM Studio"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/agent/chat")
async def chat_with_agent(request: ChatRequest):
    user_message = request.message.strip()

    if not user_message:
        return {"reply": "I didn't receive any message."}

    system_prompt = f"""You are {request.agent_name}, a helpful AI agent created by {request.user_name} inside the Nova platform.
You are friendly, clear and concise.
Always answer in the same language the user is using.
Keep answers relatively short unless the user asks for more detail."""

    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(
                "http://127.0.0.1:1234/v1/chat/completions",
                json={
                    "model": "qwen/qwen3.5-9b",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 400,
                    "stream": False
                },
                headers={"Content-Type": "application/json"}
            )

            print("=== STATUS ===")
            print(response.status_code)
            print("=== RAW RESPONSE ===")
            print(response.text)

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
        print("=== FULL TRACEBACK ===")
        traceback.print_exc()
        return {
            "reply": f"Error while talking to LM Studio: {type(e).__name__}: {str(e)}"
        }