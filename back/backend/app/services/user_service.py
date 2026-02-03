from fastapi import HTTPException, status
from passlib.context import CryptContext  # <--- 1. Importar esto


# 2. Configuración del Hashing 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user(user,request,response):

    db = request.app.state.db

    if not db:
        raise HTTPException(status_code=500, detail="Base de datos no inicializada")
    
    hashed_password = pwd_context.hash(user.password)

    query = """
        INSERT INTO Usuario (nombre, apellido, email, contraseña)
        VALUES (?, ?, ?, ?)
    """
    params = (user.nombre ,user.apellido, user.email,hashed_password)

    try:

        await db.execute(query,params)

        response.status_code = 201
        return {
            "message": "Usuario creado exitosamente", 
            "user": {
                     "name": user.nombre,
                     "apellido": user.apellido,
                       "email": user.email,
                         }
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

async def login_user(user, request, response):
    db = request.app.state.db # Asegúrate de usar el nombre correcto que pusiste en main.py

    query = "SELECT id_usuario, nombre, apellido, contraseña FROM Usuario WHERE email = ?"

    try:
        result = await db.execute(query, (user.email, ))

        #print(result)

        rows = result 

        if not rows:
            response.status_code = 400
            return {"message": "usuario no encontrado", "info": None}
            #return response("message" : "usuario no encontrado", status_code = 400)
            
        row = rows[0]

        try:
            user_dict = dict(row)
        except:
            pass

        if user_dict.get("contraseña") != user.password:
             response.status_code = 400
             return {"message": "credenciales inválidas", "info": None}
        
        del user_dict["contraseña"]

        return {
            "message": "login exitoso",
            "info": user_dict 
        }

    except Exception as e:
        print(f"Error en login: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ----> ANA <------
async def get_all_users(request):

    db = request.app.state.db
    query = "SELECT id_usuario, nombre, apellido, email FROM Usuario"
    
    try:

        rows = await db.execute(query)
        
        results = [dict(row) for row in rows]
        return results
    except Exception as e:
        print(f"Error al obtener usuarios: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener usuarios")


async def get_user_by_id(user_id: str, request):
    
    db = request.app.state.db
    query = "SELECT id_usuario, nombre, apellido, email FROM Usuario WHERE id_usuario = ?"
    
    try:
        rows = await db.execute(query, (user_id,))
        
        # Verificamos si la lista está vacía
        if not rows:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
        # Tomamos el primer elemento de la lista
        row = rows[0]
        return dict(row)
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error obteniendo usuario {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno")


async def update_user(user_id: str, user_data, request):
    
    db = request.app.state.db
    
    check_query = "SELECT id_usuario FROM Usuario WHERE id_usuario = ?"
    check_rows = await db.execute(check_query, (user_id,))
    
    if not check_rows:
         raise HTTPException(status_code=404, detail="Usuario no encontrado para actualizar")

    query = """
        UPDATE Usuario 
        SET nombre = ?, apellido = ?, email = ?
        WHERE id_usuario = ?
    """
    
    params = (user_data.nombre, user_data.apellido, user_data.email, user_id)
    
    await db.execute(query, params)
    
    return {"message": "Usuario actualizado correctamente", "id": user_id}

async def delete_user(user_id: str, request):
    """
    Elimina un usuario.
    CORREGIDO: Verificamos existencia primero, y no usamos commit/rowcount.
    """
    db = request.app.state.db
    
    # 1. VERIFICAR: Primero miramos si el usuario existe
    check_query = "SELECT id_usuario FROM Usuario WHERE id_usuario = ?"
    # Como execute devuelve una lista, si está vacía es que no existe
    check_rows = await db.execute(check_query, (user_id,))
    
    if not check_rows:
        raise HTTPException(status_code=404, detail="Usuario no encontrado para eliminar")

    # 2. BORRAR: Si existe, ejecutamos el borrado
    query = "DELETE FROM Usuario WHERE id_usuario = ?"
    await db.execute(query, (user_id,))
    
    # Asumimos que si no dio error, se borró (el wrapper debe hacer commit solo)
    return {"message": "Usuario eliminado exitosamente"}