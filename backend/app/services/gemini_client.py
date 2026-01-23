#Ejemplo de chatgpt
#Cliente para Gemini

import google.generativeai as genai
from ..config.load_env import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

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

    response = model.generate_content(system_prompt + "\nPregunta: " + prompt)
    return response.text

def ask_gemini_feedback(prompt: str,contexto):
    # Personalización del chatbot
    system_prompt = """
    en caso de proporcionarte un contexto necesito que le des continuidad a la conversacion
    siendo el consultor "contenido" y la respuesta de la ia "contenido_ia", esto es solo para que lleves el contexto
    de la conmversacion. en tu respuesta no coloques "contenido_ia".
    """

    response = model.generate_content(system_prompt +"\n contexto:"+ contexto +"\nPregunta: " + prompt)
    return response.text
