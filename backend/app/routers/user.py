
from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional, List


from ..services import user_service 

router = APIRouter()

# --- ESQUEMAS (Pydantic) ---
class UserSchema(BaseModel):
    id_usuario: Optional[str] = None
    nombre: str
    apellido:str
    email: str
    password: str 

class loginSchema(BaseModel):
    email:str
    password:str

class UserUpdateSchema(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

# --- ENDPOINTS ---

@router.post("/register")
async def create_user(user: UserSchema,request:Request):
    return await user_service.create_user(user,request)

@router.post("/login")
async def loginUser(user:loginSchema,request:Request):
    return await user_service.login_user(user,request)

@router.get("/")
async def get_all_users(request: Request): 
    return await user_service.get_all_users(request)

@router.get("/{user_id}")
async def get_user_by_id(user_id: str, request: Request):
    # El {user_id} de la URL llega aquí como variable
    return await user_service.get_user_by_id(user_id, request)

@router.put("/{user_id}")
async def update_user(user_id: str, user_data: UserSchema, request: Request):
    """
    user_id: Viene de la URL (quién quieres editar)
    user_data: Viene del Body (los datos nuevos en JSON)
    request: La conexión a la DB
    """
    return await user_service.update_user(user_id, user_data, request)

@router.delete("/{user_id}")
async def delete_user(user_id: str, request: Request):
    return await user_service.delete_user(user_id, request)

@router.get("/{user_id}")
def get_user(user_id: int):
    return user_service.get_user_by_id(user_id)

@router.put("/{user_id}")
def update_user(user_id: int, user_update: UserUpdateSchema):
    # create_user_endpoint vs update_user (función del servicio)
    # Nota: user_update.dict(exclude_unset=True) ayuda a enviar solo lo que cambió
    return user_service.update_user(user_id, user_update.dict(exclude_unset=True))

@router.delete("/{user_id}")
def delete_user(user_id: int):
    return user_service.delete_user(user_id)