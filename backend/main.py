from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nova API", version="0.1.0")

# CORS instellingen (nodig zodat de frontend met de backend kan praten)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Nova API is running",
        "status": "Phase 0 - Foundation"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}