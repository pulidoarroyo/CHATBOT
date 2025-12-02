import os
import pathlib
from typing import Any
import libsql_client
from backend.app.schemas.schemas import SCHEMA_SQL

async def init_db():
    url = os.getenv("TURSO_DB_URL")
    auth_token = os.getenv("TURSO_AUTH_TOKEN")

    if url and auth_token:
        try:
            db = libsql_client.create_client(url, auth_token=auth_token)

            for stmt in SCHEMA_SQL.strip().split(";"):
                if stmt.strip():
                    await db.execute(stmt)

            print("Sincronizando base de datos")
            return db
        except Exception as exc:
            print("No se pudo conectar a Turso", exc)

            try:
                import inspect

                if 'db' in locals():
                    maybe = None
                    if hasattr(db, "aclose"):
                        maybe = db.aclose()
                    elif hasattr(db, "close"):
                        maybe = db.close()

                    if maybe is not None and inspect.isawaitable(maybe):
                        await maybe
            except Exception:
                pass

    backend_root = pathlib.Path(__file__).resolve().parents[2]
    sqlite_file = str(backend_root / "chatbot.db")
    try:
        import aiosqlite

        class AsyncSQLiteClient:
            def __init__(self, path: str):
                self._path = path
                self._conn: aiosqlite.Connection | None = None

            async def _ensure(self) -> aiosqlite.Connection:
                if self._conn is None:
                    self._conn = await aiosqlite.connect(self._path)
                return self._conn

            async def execute(self, sql: str) -> Any:
                conn = await self._ensure()
                try:
                    cur = await conn.execute(sql)
                    await conn.commit()
                    return cur
                except aiosqlite.OperationalError:
                    await conn.executescript(sql)
                    await conn.commit()
                    return None

            async def aclose(self):
                if self._conn is not None:
                    await self._conn.close()

    except ModuleNotFoundError:
        import sqlite3
        import asyncio

        class AsyncSQLiteClient:
            def __init__(self, path: str):
                self._path = path
                self._conn: sqlite3.Connection | None = None

            def _ensure_sync(self) -> sqlite3.Connection:
                if self._conn is None:
                    self._conn = sqlite3.connect(self._path)
                return self._conn

            async def execute(self, sql: str) -> Any:
                def _run(sql_text: str):
                    conn = self._ensure_sync()
                    try:
                        cur = conn.cursor()
                        cur.execute(sql_text)
                        conn.commit()
                        return cur
                    except sqlite3.OperationalError:

                        conn.executescript(sql_text)
                        conn.commit()
                        return None

                return await asyncio.to_thread(_run, sql)

            async def aclose(self):
                if self._conn is not None:
                    await asyncio.to_thread(self._conn.close)

    sqlite_client = AsyncSQLiteClient(sqlite_file)
 
    for stmt in SCHEMA_SQL.strip().split(";"):
        if stmt.strip():
            await sqlite_client.execute(stmt)

    print(f"Usando base de datos local {sqlite_file} ")
    return sqlite_client
