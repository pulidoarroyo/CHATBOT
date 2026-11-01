# Cogni-AI
 
**Cogni-AI** es una aplicación web de apoyo para estudiantes que desean desarrollar su **trabajo de grado**. Mediante un chatbot impulsado por inteligencia artificial, acompaña al estudiante en la construcción de su planteamiento del problema y lo orienta, paso a paso, hasta llegar a un título tentativo para su investigación.
 
---
 
## Tabla de contenido
 
- [Descripción](#descripción)
- [Modelo de los 10 pasos](#modelo-de-los-10-pasos)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
  - [1. Clonar el repositorio](#1-clonar-el-repositorio)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Variables de entorno](#variables-de-entorno)
- [Uso ético y responsable](#uso-ético-y-responsable)
---
 
## Descripción
 
Iniciar un trabajo de grado suele ser la etapa más difícil: definir el tema, delimitar el problema y plantear qué se va a investigar. Cogni-AI busca facilitar ese proceso conversando con el estudiante y guiándolo con preguntas y sugerencias estructuradas, de modo que llegue a una idea de investigación clara, coherente y fundamentada.
 
Cogni-AI **no reemplaza** el criterio del estudiante ni la asesoría de su tutor: es una herramienta de apoyo que ayuda a ordenar ideas y a detectar qué elementos faltan en el planteamiento.
 
## Modelo de los 10 pasos
 
El sistema orienta al estudiante utilizando el **Modelo de los 10 pasos**:
 
| # | Paso | Qué se define |
|---|------|---------------|
| 1 | **Coordenadas espacio-temporales** | Dónde y cuándo ocurre la situación que se quiere estudiar. |
| 2 | **Temáticas** | Áreas o temas generales en los que se enmarca el problema. |
| 3 | **Hechos** | Situaciones concretas y observables que evidencian el problema. |
| 4 | **Síntomas** | Manifestaciones o señales visibles del problema. |
| 5 | **Causas** | Factores que originan o explican el problema. |
| 6 | **Consecuencias** | Efectos que se derivan si el problema persiste. |
| 7 | **Referentes** | Antecedentes, autores y teorías relacionadas con el tema. |
| 8 | **Bases legales** | Normativas, leyes o reglamentos que sustentan o rodean el problema. |
| 9 | **Lo investigable** | Aspectos del problema que pueden abordarse mediante una investigación. |
| 10 | **Título tentativo** | Propuesta de título que sintetiza el trabajo de grado. |
 
## Funcionalidades
 
- Registro e inicio de sesión de usuarios.
- Chat conversacional con IA orientado a la formulación del trabajo de grado.
- Guía progresiva basada en el Modelo de los 10 pasos.
- Historial de conversaciones accesible desde una barra lateral.
- Persistencia de los chats mediante una base de datos SQLite.
- Interfaz web clara y orientada al estudiante.
- API REST independiente, documentada automáticamente con Swagger (FastAPI).
## Tecnologías
 
### Frontend
 
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/) como cliente HTTP
### Backend
 
- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/) como servidor ASGI
- [SQLite](https://www.sqlite.org/) como base de datos
### Inteligencia artificial
 
- Modelo **Gemini 3.8-Flash**, consumido desde el backend.
## Estructura del repositorio
 
Este proyecto es un **monorepo**:
 
```
CHATBOT/
├── backend/        # API en FastAPI (incluye requirements.txt)
├── frontend/       # Aplicación web en React + TypeScript
├── .gitignore
└── README.md
```
 
### Estructura del backend
 
```
backend/
├── app/
│   ├── config/
│   │   ├── dbconf.py        # Configuración de la base de datos SQLite
│   │   └── load_env.py      # Carga de variables de entorno
│   ├── routers/
│   │   ├── chatbot.py       # Endpoints del chat
│   │   └── user.py          # Endpoints de usuarios (registro e inicio de sesión)
│   ├── schemas/
│   │   └── schemas.py       # Modelos de validación de datos
│   ├── services/
│   │   ├── chat_service.py  # Lógica del chat y de las conversaciones
│   │   ├── gemini_client.py # Cliente para el modelo Gemini
│   │   └── user_service.py  # Lógica de usuarios
│   └── main.py              # Punto de entrada de la API
├── test/                    # Pruebas
├── .env.example
└── requirements.txt
```
 
### Estructura del frontend
 
```
frontend/
├── public/
├── src/
│   ├── api/            # Configuración del cliente Axios
│   ├── assets/         # Imágenes y recursos estáticos
│   ├── components/     # Componentes reutilizables
│   ├── context/        # Contextos de React (estado global)
│   ├── hooks/          # Hooks personalizados
│   ├── services/       # Llamadas a la API del backend
│   ├── styles/         # Estilos
│   ├── utils/          # Funciones de utilidad
│   ├── App.tsx
│   ├── Chatbot.tsx     # Vista del chat con la IA
│   ├── Home.tsx        # Página de inicio
│   ├── LogIn.tsx       # Inicio de sesión
│   ├── Register.tsx    # Registro de usuarios
│   └── main.tsx        # Punto de entrada
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
 
## Requisitos previos
 
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/downloads/) 3.10 o superior
- [Node.js](https://nodejs.org/) 18 o superior
- [pnpm](https://pnpm.io/) (gestor de paquetes recomendado para el frontend)
- Una clave de API de Gemini ([Google AI Studio](https://aistudio.google.com/))
Para instalar pnpm:
 
```bash
npm install -g pnpm
```
 
## Instalación y ejecución
 
### 1. Clonar el repositorio
 
```bash
git clone https://github.com/pulidoarroyo/CHATBOT.git
cd CHATBOT
```
 
### 2. Backend
 
Desde la **raíz del repositorio**, crea el entorno virtual e instala las dependencias:
 
```bash
# Crear y activar un entorno virtual
python -m venv backend/venv
 
# Windows
backend\venv\Scripts\activate
# macOS / Linux
source backend/venv/bin/activate
 
# Instalar dependencias
pip install -r backend/requirements.txt
```
 
Crea tu archivo de entorno a partir de la plantilla y completa los valores (ver [Variables de entorno](#variables-de-entorno)):
 
```bash
# Windows
copy backend\.env.example backend\.env
# macOS / Linux
cp backend/.env.example backend/.env
```
 
Levanta el servidor **desde la raíz del repositorio** (no desde dentro de `backend/`):
 
```bash
uvicorn backend.app.main:app --reload --port 8000
```
 
> **Importante:** el comando debe ejecutarse siempre desde la carpeta raíz (`CHATBOT/`). Si lo ejecutas desde `backend/`, Python no encontrará el módulo `backend` y mostrará el error `ModuleNotFoundError: No module named 'backend'`.
 
La API quedará disponible en `http://localhost:8000` y la documentación interactiva en `http://localhost:8000/docs`.
 
### 3. Frontend
 
> **Recomendación:** usa **pnpm** para instalar las dependencias y ejecutar el proyecto. Es más rápido y eficiente en espacio que npm o yarn, y garantiza instalaciones consistentes.
 
```bash
cd frontend
 
# Instalar dependencias
pnpm install
 
# Crear el archivo de entorno
cp .env.example .env
 
# Iniciar el servidor de desarrollo
pnpm dev
```
 
La aplicación estará disponible en la URL que indique la terminal (por defecto, `http://localhost:5173`).
 
Para generar la versión de producción:
 
```bash
pnpm build
```
 
## Variables de entorno
 
### Backend (`backend/.env`)
 
Usa `backend/.env.example` como plantilla. Como mínimo necesitas la clave de API de Gemini:
 
```env
GEMINI_API_KEY=tu_clave_de_api
```
 
### Frontend (`frontend/.env`)
 
```env
VITE_URL_BASE=http://localhost:8000
```
 
`VITE_URL_BASE` debe apuntar a la URL donde corre el backend.
 
> **Importante:** los archivos `.env` están ignorados por Git y no deben subirse al repositorio. Nunca coloques claves secretas en variables con prefijo `VITE_`, ya que quedan expuestas en el navegador.
 
## Uso ético y responsable
 
Cogni-AI es una herramienta de **orientación y apoyo**, no un sustituto del trabajo intelectual del estudiante. Para aprovecharla de forma ética, se recomienda:
 
- **Autoría propia:** las ideas, el análisis y la redacción del trabajo de grado deben ser del estudiante. Las sugerencias del sistema son un punto de partida, no un texto para copiar y entregar.
- **Verificación de la información:** los modelos de IA pueden cometer errores o generar datos inexactos. Los referentes, autores, cifras y bases legales sugeridos deben contrastarse con fuentes confiables y oficiales antes de usarse.
- **Citación adecuada:** toda fuente, teoría o norma que se incorpore a la investigación debe citarse correctamente según las normas académicas de la institución.
- **Transparencia:** se aconseja informar al tutor o a la institución sobre el uso de herramientas de IA en el proceso, conforme a las políticas académicas vigentes.
- **Acompañamiento del tutor:** las decisiones sobre el tema, el enfoque y la viabilidad de la investigación deben validarse con el tutor o asesor académico.
- **Privacidad y datos personales:** no se deben ingresar en el chat datos personales o sensibles, ni información confidencial de terceros u organizaciones.
- **Pensamiento crítico:** el objetivo de Cogni-AI es ayudar a pensar mejor el problema de investigación, no pensar por el estudiante.
El uso de esta herramienta es responsabilidad de quien la utiliza. Los desarrolladores no se hacen responsables por el uso indebido de la herramienta ni por el contenido académico que el estudiante presente a partir de ella.