from fastapi import APIRouter, Request, Response, UploadFile, File
from pydantic import BaseModel
from ..services.gemini_client import ask_gemini,ask_gemini_feedback
from ..services import chat_service
import json
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
    
@router.post("/postchat/{user_id}")
async def post_chat(user_id:int,chat_nombre,request: Request, response: Response):
   return await chat_service.post_chat(user_id,request,response,chat_nombre)

@router.get("/historial{chat_id}")
async def get_chat_history(chat_id: int, request: Request, response: Response):
    return await chat_service.get_chat_history(chat_id, request, response)

@router.post("/upload/{chat_id}")
async def upload_file(chat_id: int, file: UploadFile = File(...), request: Request = None, response: Response = None):
    """Subir una foto al chat y guardar registro en la base de datos.
    Guarda el archivo en `backend/uploads` y crea un mensaje con el nombre de fichero.
    """
    return await chat_service.post_message_file(chat_id, request, response, file)

@router.post("/FeedBackPromt/{chat_id}")
async def chat_ia_feedback(req:ChatRequest,chat_id: int,request: Request, response:Response):
    contexto = await chat_service.chat_by_id(chat_id,request,response)
    json_string = json.dumps(contexto)
    answer = ask_gemini_feedback(req.message,json_string)
    await chat_service.post_message(chat_id,request,response,req.message,answer)
    if not answer:
        return{
            "response": "[Chatbot Error] can't comunicate with Gemini"
            }
    return {
        "response":answer
        }

@router.get("/messages/{chat_id}")
async def chat_messages_by_id(chat_id: int ,request: Request, response: Response):
    return await chat_service.chat_by_id(chat_id,request,response)

@router.get("/all")
async def get_all_chats(request: Request, response: Response):
    """
    Ruta para obtener la lista de todos los chats en la base de datos.
    URL: GET /chatbot/chat/
    """
    return await chat_service.get_all_chats(request, response)

@router.get("/user/{user_id}")
async def get_chats_by_user(user_id: int, request: Request, response: Response):
    """
    Obtiene todos los chats que pertenecen a un ID de usuario específico.
    URL: GET /chatbot/chat/user/1
    """
    return await chat_service.get_chats_by_user(user_id, request, response)