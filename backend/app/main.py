import os
import inspect
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 1. Importar el middleware
from dotenv import load_dotenv, find_dotenv
from backend.app.config.dbconf import init_db
from contextlib import asynccontextmanager
from .routers import user
from .routers import chatbot

env_path = find_dotenv(usecwd=True)
env_loaded = False
if env_path:
    load_dotenv(env_path)
    env_loaded = True

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = await init_db(env_loaded=env_loaded)
    app.state.db = db
    try:
        yield
    finally:
        try:
            if hasattr(db, "aclose"):
                await db.aclose()
            elif hasattr(db, "close"):
                res = db.close()
                if inspect.isawaitable(res):
                    await res
        except Exception:
            logger.exception("Error closing DB client")


app = FastAPI(lifespan=lifespan)

# 2. Configuración de CORS
# Esto permite que tu React (puerto 5173) se comunique con FastAPI (puerto 8080)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

# Incluir routers
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])

@app.get("/")
async def root():
    return {"message": "API is running"}