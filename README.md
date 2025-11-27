# Ollama CHATBOT
Chatbot usando Ollama y Streamlit

## Antes de empezar 
Necesitas instalar en tu máquina las siguientes herramientas:
- [Ollama](https://ollama.com/) 

Descargar Ollama (https://ollama.com/) e instalar Llama3.2 con el comando

```bash
ollama pull llama3.2 
   ```

- [uv](https://github.com/astral-sh/uv)

En terminal python ejecutar:

```bash
   pip install uv
   ```
- [Langchain](https://github.com/langchain-ai/langchain) 

En terminal python ejecutar:

```bash
   uv pip install langchain langchain-ollama ollama
   ```

## Setup Guide

1. Inicializar el venv (entorno virtual):
   ```bash
   # Crear el venv con uv en vez de pip
   uv venv

   # Activar el venv
   
   # En Windows:
   .venv\Scripts\activate
   
   # En macOS/Linux:
   source .venv/bin/activate

   # Instalar dependencias
   uv pip install -r requirements.txt
   ```

3. Ejecutar la aplicación Streamlit:
   ```bash
   streamlit run test_app.py
   ```
