import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    TURSO_DB_URL = os.getenv("TURSO_DB_URL")
    TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")
    GEMINI_API_KEY = "AIzaSyDhzA16JNRGB4_DuWg09hQ1rrbPAxMXsAs"

settings = Settings()