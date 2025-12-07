import os
import inspect
import logging
from fastapi import FastAPI
from dotenv import load_dotenv, find_dotenv
from backend.app.config.dbconf import init_db
from contextlib import asynccontextmanager


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

#poner todas las routes que usaras aqui



@app.get("/")
async def root():
    return {"message": "API is running"}
