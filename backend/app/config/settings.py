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


settings = Settings()