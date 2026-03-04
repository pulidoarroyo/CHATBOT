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
    

async def post_message_file(chat_id: int, request, response, file):
    """Guardar archivo subido (PDF/Word/Docs) en backend/uploads y registrar mensaje."""
    
    db = request.app.state.db

    # 1. Definir extensiones permitidas
    ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt", ".odt"}
    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Extensión no permitida. Solo se aceptan: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 2. Configurar rutas
    # Asegúrate de que la carpeta existe
    uploads_dir = os.path.join(os.getcwd(), "backend", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    # 3. Crear nombre seguro y único
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    # Limpiamos el nombre original de espacios para evitar problemas en URLs
    clean_name = file.filename.replace(" ", "_")
    safe_filename = f"{timestamp}_{clean_name}"
    file_path = os.path.join(uploads_dir, safe_filename)

    try:
        # 4. Guardar el archivo físicamente
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        # 5. Registrar en la base de datos
        # Guardamos el nombre del archivo en 'contenido'
        query = """ INSERT INTO mensaje (contenido, contenido_ia, fecha, fk_chat) VALUES (?, ?, ?, ?) """
        fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S") # Mejor usar datetime completo si el campo lo permite
        
        params = (safe_filename, None, fecha_actual, chat_id)
        await db.execute(query, params)

        response.status_code = 201
        return {
            "status": "success",
            "message": "Archivo guardado correctamente",
            "file_name": safe_filename,
            "type": file_extension
        }

    except Exception as e:
        print(f"Error al guardar archivo: {e}")
        # Si hubo un error y el archivo se llegó a crear, podrías intentar borrarlo aquí
        raise HTTPException(status_code=500, detail="Error interno al procesar el archivo")
    
async def post_chat(user_id:int,request, response , nombre_chat):
    
    db = request.app.state.db

    query = """ insert into chat (nombre,fk_usuario) values (?, ?) """

    query2 = """ SELECT id_chat FROM chat WHERE nombre = ? AND fk_usuario = ? ORDER BY id_chat DESC LIMIT 1 """

    params = (nombre_chat,user_id)

    try:
        await db.execute(query,params)
        chat_id= await db.execute(query2, params)
        print("chat guardado")
        
        response.status_code = 201
        return {
            "data":"chat creado",
            **chat_id[0]
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