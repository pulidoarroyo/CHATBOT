#Ejemplo de chatgpt
#Crear el router del chatbot

from fastapi import APIRouter
from pydantic import BaseModel
from ..services.gemini_client import ask_gemini

router = APIRouter(prefix="/chat", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

@router.post("/promt")
def chat(req: ChatRequest):
    answer = ask_gemini(req.message)
    if not answer:
        return{ 
            "response": "[Chatbot Error] can't comunicate with Gemini"
            }
    return {
        "response":answer
        }

#uvicorn app.main:app --reload
#http://localhost:8000/docs
