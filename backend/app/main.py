#Ejemplo de chatgpt 
#Punto de entrada de FastAPI

from fastapi import FastAPI
from app.routers.chatbot import router as chatbot_router
from app.routers.user import router as user_router


app = FastAPI(
    title="Academic Chatbot API",
    description="Chatbot para responder preguntas académicas sobre trabajos de grado",
)

app.include_router(chatbot_router)

app.include_router(user_router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"status": "API is running"}
