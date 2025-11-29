#Ejemplo de chatgpt 
#Punto de entrada de FastAPI

from fastapi import FastAPI
from app.routers.chatbot import router as chatbot_router

app = FastAPI(
    title="Academic Chatbot API",
    description="Chatbot para responder preguntas académicas sobre trabajos de grado",
)

app.include_router(chatbot_router)

@app.get("/")
def root():
    return {"status": "API is running"}
