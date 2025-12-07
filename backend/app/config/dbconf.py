import os
import pathlib
import sqlite3
import logging
import inspect
import asyncio
from typing import Any, Optional, List, Dict

from backend.app.schemas.schemas import SCHEMA_SQL

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def _init_sqlite_conn(db_path: str) -> sqlite3.Connection:
  path = pathlib.Path(db_path)
  path.parent.mkdir(parents=True, exist_ok=True)
  conn = sqlite3.connect(str(path), check_same_thread=False)
  conn.row_factory = sqlite3.Row
  return conn


class DBClient:
  """Async wrapper that provides a consistent API over SQLite and libsql clients.

  Methods are async so callers can `await db.execute(...)` regardless of backend.
  """
  def __init__(self, kind: str, sqlite_conn: Optional[sqlite3.Connection] = None, libsql_client: Any = None):
    self.kind = kind
    self._sqlite = sqlite_conn
    self._libsql = libsql_client

  async def execute(self, sql: str, params: Optional[Any] = None) -> Any:
    if self.kind == "sqlite":
      def _run():
        cur = self._sqlite.cursor()
        if params is None:
          cur.execute(sql)
        else:
          cur.execute(sql, params)
        if sql.strip().lower().startswith("select"):
          rows = cur.fetchall()
          return [dict(r) for r in rows]
        self._sqlite.commit()
        return cur.rowcount
      return await asyncio.to_thread(_run)


    exec_fn = getattr(self._libsql, "execute", None) or getattr(self._libsql, "execute_sql", None) or getattr(self._libsql, "run", None)
    if exec_fn is None:
      raise RuntimeError("libsql client has no execute method")

    try:
      result = exec_fn(sql, params) if params is not None else exec_fn(sql)
    except TypeError:
  
      result = None
      for kw in ("params", "parameters", "variables", "bindings"):
        try:
          result = exec_fn(sql, **{kw: params})
          break
        except TypeError:
          result = None
      if result is None:
        raise

    if inspect.isawaitable(result):
      result = await result

    
    if isinstance(result, dict):
     
      if "result" in result:
        inner = result["result"]
        
        if isinstance(inner, dict) and "rows" in inner:
          return inner.get("rows")
        return inner
      if "rows" in result:
        return result.get("rows")
      if "data" in result:
        return result.get("data")
      if "rows_affected" in result:
        return result.get("rows_affected")
      if "last_insert_id" in result:
        return result.get("last_insert_id")

    return result

  async def fetchall(self, sql: str, params: Optional[Any] = None) -> List[Dict]:
    res = await self.execute(sql, params)
    
    if isinstance(res, list):
      return res
   
    try:
      return [dict(r) for r in res]
    except Exception:
      return res

  async def fetchone(self, sql: str, params: Optional[Any] = None) -> Optional[Dict]:
    rows = await self.fetchall(sql, params)
    return rows[0] if rows else None

  async def executemany(self, sql: str, seq_of_params: List[Any]) -> Any:
    if self.kind == "sqlite":
      def _run_many():
        cur = self._sqlite.cursor()
        cur.executemany(sql, seq_of_params)
        self._sqlite.commit()
        return cur.rowcount
      return await asyncio.to_thread(_run_many)

   
    last = None
    for p in seq_of_params:
      last = await self.execute(sql, p)
    return last

  async def aclose(self) -> None:
    if self.kind == "sqlite":
      await asyncio.to_thread(self._sqlite.close)
    else:
      
      close_fn = getattr(self._libsql, "aclose", None) or getattr(self._libsql, "close", None)
      try:
        if close_fn is not None:
          res = close_fn()
          if inspect.isawaitable(res):
            await res
          return
      except Exception:
        logger.exception("error intentando cerrar libsql")

      
      for attr in ("session", "_session", "http", "_http", "client_session", "_client_session"):
        sess = getattr(self._libsql, attr, None)
        if sess is not None:
          try:
            closem = getattr(sess, "close", None)
            if closem is not None:
              res = closem()
              if inspect.isawaitable(res):
                await res
          except Exception:
            logger.exception("Error en la sesion del cliente")


def _apply_schema_to_sqlite(conn: sqlite3.Connection) -> None:
  cur = conn.cursor()
  cur.executescript(SCHEMA_SQL)
  conn.commit()

  try:
    cur.execute("PRAGMA table_info(Usuario)")
    cols = [r[1] for r in cur.fetchall()]
    if "contraseña" not in cols:
      logger.info("Adding missing column 'contraseña' to Usuario table")
      cur.execute("ALTER TABLE Usuario ADD COLUMN contraseña TEXT DEFAULT ''")
      conn.commit()
  except Exception:
    logger.exception("error de compatibilidad")

  logger.info("Aplicando esquema a la base de datos local")


async def _init_turso(url: str, auth_token: Optional[str]) -> Any:
  try:
    import libsql_client
  except Exception as e:
    logger.warning("libsql_client not available: %s", e)
    return None

  client = None
  try:
    if hasattr(libsql_client, "create_client"):
      client = libsql_client.create_client(url=url, auth_token=auth_token)
    elif hasattr(libsql_client, "connect"):
      client = libsql_client.connect(url=url, auth_token=auth_token)
    elif hasattr(libsql_client, "Client"):
      client = libsql_client.Client(url=url, auth_token=auth_token)
    else:
      client = None
  except Exception:
    logger.exception("Fallo al crear al clente de turso")
    return None

  try:
    if client is not None:
      wrapper = DBClient(kind="libsql", libsql_client=client)
    
      try:
        await wrapper.execute(SCHEMA_SQL)
      except Exception:
        logger.info("aplicando esquemas ")
        parts = [s.strip() for s in SCHEMA_SQL.split(";") if s.strip()]
        for p in parts:
          try:
            await wrapper.execute(p)
          except Exception:
            logger.exception("Fallo en los esquemas: %s", p)
           
            try:
              await wrapper.aclose()
            except Exception:
              logger.exception("error en el cliente de turso")
            return None

      logger.info("Conectando base de datos Turso %s", url)
      return wrapper
  except Exception:
    logger.exception("Error al aplicar los esquemas en turso")
    return None


async def init_db(env_loaded: bool = False) -> Any:

    turso_url = os.getenv("TURSO_DB_URL")
    turso_token = os.getenv("TURSO_AUTH_TOKEN")

    if env_loaded and turso_url and turso_token:
        logger.info("Leyendo las variables .env; conectando")
        client_wrapper = await _init_turso(turso_url, turso_token)
        if client_wrapper:
            return client_wrapper
        else:
            logger.warning("fallo iniciando el turso cambiando a local")
    else:
        if turso_url and not turso_token:
            logger.warning("Variables faltantes para turso ")
        if not env_loaded:
            logger.info("no se detecto variables de entorno usando base de datos local")

    db_file = os.getenv("LOCAL_DB_PATH")
    if not db_file:
        #usenla para probar todos sus enpoints en local mientras arreglo la nube 
        db_file = "Chatbotprueba.db" 

    conn = _init_sqlite_conn(db_file)
    try:
        _apply_schema_to_sqlite(conn)
    except Exception:
        logger.exception("Fallo al aplicar el esquema a la base de datos local")
        raise
    return DBClient(kind="sqlite", sqlite_conn=conn)


__all__ = ["init_db"]