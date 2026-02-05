from fastapi import HTTPException, status
from datetime import date, datetime
import os
import aiofiles

async def get_chat_history(chat_id: int, request, response):
    db = request.app.state.db

    query = """ 
        SELECT fecha, contenido, contenido_ia 
        FROM Mensaje 
        WHERE fk_chat = ? 
        ORDER BY fecha ASC 
    """
    
    try:
        result = await db.execute(query, (chat_id, ))
        rows = result
        
        if not rows:
            response.status_code = 200
            return {"message": "Chat vacío", "data": []}
        
        history = []
        for row in rows:
            msg = dict(row)
            
            history.append({
                "role": "user",
                "content": msg["contenido"],
                "timestamp": msg["fecha"]
            })
            
            if msg["contenido_ia"]:
                history.append({
                    "role": "assistant",
                    "content": msg["contenido_ia"],
                    "timestamp": msg["fecha"]
                })

        response.status_code = 200
        return {
            "chat_id": chat_id,
            "count": len(history),
            "messages": history
        }
            
    except Exception as e:
        print(f"Error al reconstruir historial: {e}")
        raise HTTPException(status_code=500, detail="Error interno al procesar el historial")

async def chat_by_id(chat_id:int,request,response):


    db = request.app.state.db

    query = """ select fecha, contenido, contenido_ia from Mensaje where fk_chat = ? """
    

    try:
        result = await db.execute(query, (chat_id, ))

        rows = result
        
        if not rows:
            response.status_code = 404
            return {"message": "chat sin mensajes", "info": None}
        
        messages_list = []

        for row in rows:
            
            messages_dict = dict(row)

            messages_list.append(messages_dict)

        response.status_code = 202
        return {
            "data":messages_list
            }
            
    except Exception as e:
        print("error al buscar mensajes")
        raise HTTPException(status_code = 400)



async def post_message(chat_id:int,request,response,contenido,contenido_ia):

    db = request.app.state.db

    query = """ insert into mensaje (contenido,contenido_ia,fecha,fk_chat) values (?, ?, ?, ?) """

    fecha = str(date.today())

    params = (contenido,contenido_ia,fecha,chat_id)

    try:
        await db.execute(query,params)

        print("mensaje guardado")

    except Exception as e:

        print("error al guardar mensaje")

        raise HTTPException(status_code = 500)
    

async def post_message_file(chat_id:int, request, response, file):
    """Guardar archivo subido (foto) en backend/uploads y registrar mensaje.
    - `file` es un UploadFile de FastAPI
    """
    db = request.app.state.db

    uploads_dir = os.path.join(os.getcwd(), "backend", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(uploads_dir, safe_filename)

    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        # registrar en la tabla mensaje (contenido almacena el nombre/ubicación del fichero)
        query = """ insert into mensaje (contenido,contenido_ia,fecha,fk_chat) values (?, ?, ?, ?) """
        fecha = str(date.today())
        params = (safe_filename, None, fecha, chat_id)

        await db.execute(query, params)

        response.status_code = 201
        return {"data": "file uploaded", "file": safe_filename}

    except Exception as e:
        print("error al guardar archivo", e)
        raise HTTPException(status_code=500)
    

    
async def post_chat(user_id:int,request, response , nombre_chat):
    
    db = request.app.state.db

    query = """ insert into chat (nombre,fk_usuario) values (?, ?) """

    params = (nombre_chat,user_id)

    try:
        await db.execute(query,params)

        print("chat guardado")
        
        response.status_code = 201
        return {
            "data":"chat creado"
        }
        
    except Exception as e:

        print("error al guardar chat")

        raise HTTPException(status_code = 500)

#Obterner todos los chats 

async def get_all_chats(request, response):
    db = request.app.state.db

    query = """ SELECT id_chat, nombre, fk_usuario FROM Chat """

    try:
        result = await db.execute(query)
        rows = result
        
        if not rows:
            response.status_code = 404
            return {"message": "No hay chats registrados", "data": []}
        
        chats_list = []
        for row in rows:
            # Convertimos cada fila a diccionario para que FastAPI pueda enviarlo como JSON
            chats_list.append(dict(row))

        response.status_code = 200
        return {
            "data": chats_list
        }
            
    except Exception as e:
        print(f"Error al obtener chats: {e}")
        # Mantenemos el estándar de lanzar HTTPException en caso de error de DB
        raise HTTPException(status_code=500, detail="Error al consultar la base de datos")
    



#obtener todos los chats de un usuario

async def get_chats_by_user(user_id: int, request, response):
    db = request.app.state.db

    # Filtramos en la tabla Chat usando la llave foránea fk_usuario
    query = """ SELECT id_chat, nombre, fk_usuario FROM Chat WHERE fk_usuario = ? """

    try:
        # Pasamos el user_id como una tupla (user_id,) para evitar inyecciones SQL
        result = await db.execute(query, (user_id,))
        rows = result

        if not rows:
            response.status_code = 404
            return {"message": f"El usuario {user_id} no tiene chats creados", "data": []}

        chats_list = []
        for row in rows:
            chats_list.append(dict(row))

        response.status_code = 200
        return {
            "usuario_id": user_id,
            "data": chats_list
        }
            
    except Exception as e:
        print(f"Error al buscar chats del usuario {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Error al consultar chats por usuario")