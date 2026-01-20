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
