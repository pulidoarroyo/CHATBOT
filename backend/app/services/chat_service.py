from fastapi import HTTPException, status


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