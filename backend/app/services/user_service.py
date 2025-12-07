from fastapi import HTTPException, status
import uuid 
import aiosqlite

async def create_user(user,request):

    db = request.app.state.db

    if not db:
        raise HTTPException(status_code=500, detail="Base de datos no inicializada")
    
    user.id_usuario = str(uuid.uuid4())

    query = """
        INSERT INTO Usuario (id_usuario, nombre, apellido, email, contraseña)
        VALUES (?, ?, ?, ?, ?)
    """
    params = (user.id_usuario,user.nombre , user.apellido, user.email,user.password)

    try:

        await db.execute(query,params)

        return {
            "message": "Usuario creado exitosamente", 
            "user": {"id": user.id_usuario,
                     "username": user.nombre,
                       "email": user.email,
                         "password": user.password}
        }
    
    except Exception as e:
        # Manejo de errores (ej. Violación de restricción UNIQUE en email)
        error_msg = str(e).lower()
        if "unique" in error_msg or "constraint" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario o correo ya existe."
            )
        
        print(f"Error en DB: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

async def login_user(user, request):
    db = request.app.state.db # Asegúrate de usar el nombre correcto que pusiste en main.py

    query = "SELECT id_usuario, nombre, apellido, contraseña FROM Usuario WHERE email = ?"

    try:
        result = await db.execute(query, (user.email, ))

        print(result)

        rows = result 

        if not rows:
            return {"message": "usuario no encontrado", "info": None}
            
        row = rows[0]

        try:
            user_dict = dict(row)
        except:
            pass

        if user_dict.get("contraseña") != user.password:
             return {"message": "credenciales inválidas", "info": None}
        
        del user_dict["contraseña"]

        return {
            "message": "login exitoso",
            "info": user_dict 
        }

    except Exception as e:
        print(f"Error en login: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def get_all_users():
    

    return [{"id": 1, "name": "Prueba Exitosa"}]

def get_user_by_id(user_id: int):
    """
    TODO: Lógica para buscar un usuario por ID.
    """
    pass

def update_user(user_id: int, user_data: dict):
    """
    TODO: Lógica para actualizar datos de un usuario.
    """
    pass

def delete_user(user_id: int):
    """
    TODO: Lógica para eliminar un usuario.
    """
    pass