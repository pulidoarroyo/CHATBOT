import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from backend.app.config.dbconf import init_db

load_dotenv()
PORT = int(os.getenv("PORT", 8080))

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_client = None
    try:
        db_client = await init_db()
        app.state.db_client = db_client
        app.state.db_initialized = True
        print("Base de datos inicializada ")
    except Exception as e:
        app.state.db_initialized = False
        print("Error inicializando la base de datos:", e)
    yield

    client = getattr(app.state, "db_client", None)
    if client is not None:
        try:
            import inspect

            maybe = None
            if hasattr(client, "aclose"):
                maybe = client.aclose()
            elif hasattr(client, "close"):
                maybe = client.close()

            if maybe is not None and inspect.isawaitable(maybe):
                await maybe
        except Exception as e:
            print("Error cerrando conexión a DB en shutdown:", e)

    print("Servidor cerrado correctamente.")

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": f"Servidor corriendo en http://localhost:{PORT}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="localhost", port=8080, reload=True)