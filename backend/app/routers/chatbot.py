#Ejemplo de chatgpt
#Crear el router del chatbot

from fastapi import APIRouter
from pydantic import BaseModel
from app.services.gemini_client import ask_gemini

router = APIRouter(prefix="/chat", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

@router.post("/")
def chat(req: ChatRequest):
    answer = ask_gemini(req.message)
    return {"response": answer}
