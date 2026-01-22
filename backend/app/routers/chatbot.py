#Ejemplo de chatgpt
#Crear el router del chatbot

from fastapi import APIRouter, Request , Response
from pydantic import BaseModel
from ..services.gemini_client import ask_gemini
from ..services import chat_service

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

@router.get("/messages/{chat_id}")
async def chat_by_id(chat_id: int ,request: Request, response: Response):
    return await chat_service.chat_by_id(chat_id,request,response)

#uvicorn app.main:app --reload
#http://localhost:8000/docs


@router.get("/all")
async def get_all_chats(request: Request, response: Response):
    """
    Ruta para obtener la lista de todos los chats en la base de datos.
    URL: GET /chatbot/chat/
    """
    return await chat_service.get_all_chats(request, response)