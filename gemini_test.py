import streamlit as st #pip install streamlit
import google.generativeai as genai #pip install google-generativeai

genai.configure(api_key=st.secrets["GEMINI_API_KEY"]) #Ver /.streamlit/secrets.toml

model = genai.GenerativeModel("gemini-2.5-flash") #Correr supported.py para ver modelos soportados

st.title("Gemini PDF test")
st.write("---")

uploaded = st.file_uploader("Carga un PDF", type="pdf")

if uploaded:
    st.write("PDF cargado")

user_input = st.text_input("Pregunta algo sobre el PDF:")

if user_input and uploaded:
    pdf_bytes = uploaded.read()

    response = model.generate_content(
        [
            user_input,
            {
             "mime_type": "application/pdf",
             "data": pdf_bytes
            }

        ]
    )

    st.write("### Respuesta:")
    st.write(response.text)
