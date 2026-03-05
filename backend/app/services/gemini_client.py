from fastapi import HTTPException
import google.generativeai as genai
from google import genai
from google.genai import types
from ..config.load_env import settings
import os
import time

#genai.configure(api_key=settings.GEMINI_API_KEY)  # type: ignore

client = genai.Client(api_key=settings.GEMINI_API_KEY)

SYSTEM_PROMPT = """
Eres un asistente académico. Solo puedes responder preguntas sobre:
- trabajos de grado
- metodología de investigación
- estructura de proyectos académicos
- redacción académica
- veracidad de la informacion
- En caso de hacer referencia o segun sea el caso usa el modelo de construccion del objeto de estudio (modelo de los diez pasos): 
1.) COORDENADAS ESPACIO -TEMPORAL, 2.) Tematicas, 3.) Hechos, 4.) Sintomas, 5.) Causas, 6.) Consecuencias, 7.) Referentes, 8.) Bases legales, 9.) Lo investigable, 10.) Titulo tentativo

IMPORTANTE: Tienes la capacidad de leer y analizar los documentos que el usuario te adjunta. Basate en los archivos adjuntos para responder.
IMPORTANTE: Si el usuario te pide ayuda sobre el documento puedes buscar en otras fuentes como internet, pero dale preferencia a las fuentes academicas.
IMPORTANTE: Si la pregunta no es académica, responde cortésmente que no puedes ayudar.
"""

#model = genai.GenerativeModel("gemini-2.5-flash") #system_instruction=SYSTEM_PROMT)  # type: ignore


def ask_gemini(prompt: str):
    # Personalización del chatbot
    system_prompt = """
    Eres un asistente académico. Solo puedes responder preguntas sobre:
    - trabajos de grado
    - metodología de investigación
    - estructura de proyectos académicos
    - redacción académica
    Si la pregunta no es académica, responde cortésmente que no puedes ayudar.
    """

    #response = model.generate_content(system_prompt + "\nPregunta: " + prompt)
    #return response.text


def ask_gemini_feedback(prompt: str, history: list = None):  # type: ignore

    if history is None:
        history = []

    chat_config = types.GenerateContentConfig(
        system_instruction = SYSTEM_PROMPT
    )
    
    chat = client.chats.create(
        model='gemini-2.5-flash',
        history=history,
        config = chat_config
        )
    
    DIR = os.getcwd()
    
    file_path = os.path.join(DIR, "backend", "uploads", "test_file..pdf")

    if os.path.exists(file_path):
        try:
            print(f"Subiendo archivo a los servidores de Gemini...")
            archivo_gemini = client.files.upload(file=file_path)
            
            print("Esperando a que Gemini procese el PDF...")
            while archivo_gemini.state.name == "PROCESSING":  # type: ignore
                print(".", end="", flush=True)
                time.sleep(2)
                archivo_gemini = client.files.get(name=archivo_gemini.name) # type: ignore
            
            print("\n¡Archivo listo y activo!")
            
           # prompt_forzado = f"Basándote estrictamente en el documento adjunto, responde a la siguiente consulta del usuario: {prompt}"
            
            response = chat.send_message([archivo_gemini, prompt])
            
            #os.remove(file_path) 
            #print("Archivo local eliminado con éxito.")
            
        except Exception as e:
            print(f"Error procesando el archivo con Gemini: {e}")
            response = chat.send_message(prompt)
            
    else:
        
        response = chat.send_message(prompt)
        
    return response.text
