from langchain_ollama import OllamaLLM # pip install langchain langchain-ollama ollama

model = OllamaLLM(model="llama3.2") # Descargar Ollama (https://ollama.com/) y descargar Llama3.2 con el comando: ollama pull llama3.2 

result = model.invoke(input="waddup")

print(result)