from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class Settings:
    MONGODB_URL: str = (
        os.getenv("MONGODB_URL")
        or os.getenv("MONGO_URI")
        or "mongodb://127.0.0.1:27017"
    )
    MONGO_URI: str = MONGODB_URL
    DATABASE_NAME: str = (
        os.getenv("DATABASE_NAME") or "assessment_portal"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES= 60
    SECRET_KEY: str = os.getenv("SECRET_KEY") or "your_secret_key"
    ALGORITHM: str = os.getenv("ALGORITHM") or "HS256"
    

settings = Settings()