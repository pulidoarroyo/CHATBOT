from fastapi import HTTPException, status
from datetime import date


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