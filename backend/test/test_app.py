import streamlit as st
from langchain_ollama import OllamaLLM

model = OllamaLLM(model="llama3.2")

#UI
st.set_page_config(page_title="Llama3.2 Chat", page_icon="🤖")

st.title("CHATBOT")
st.write("---")

# Text input
user_input = st.text_input("Escribe algo:", "")


if user_input:
    st.write("**Tu:** ", user_input)

    with st.spinner("Pensando..."):
        result = model.invoke(input=user_input)

    st.write("**Asistente:**")
    st.write(result)
