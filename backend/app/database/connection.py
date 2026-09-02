from motor.motor_asyncio import AsyncIOMotorClient

from app.config.settings import settings

client = AsyncIOMotorClient(
    settings.MONGODB_URL,
    serverSelectionTimeoutMS=5000,
)

database = client[settings.DATABASE_NAME]
