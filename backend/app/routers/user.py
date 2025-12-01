
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List


from app.services import user_service 

router = APIRouter()

# --- ESQUEMAS (Pydantic) ---
class UserSchema(BaseModel):
    username: str
    email: str
    password: str 

class UserUpdateSchema(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

# --- ENDPOINTS ---

@router.post("/")
def create_user(user: UserSchema):
    # Llamada limpia: "Del servicio de usuario, crea el usuario"
    return user_service.create_user(user.dict())

@router.get("/")
def list_users():
    return user_service.get_all_users()

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