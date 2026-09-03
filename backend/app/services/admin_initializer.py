from datetime import datetime

from app.core.security import hash_password
from app.database.connection import database


async def create_default_admin():

    admin = await database.users.find_one(
        {
            "email": "admin@assessment.com"
        }
    )

    if admin:
        return

    await database.users.insert_one(
        {
            "full_name": "System Administrator",
            "email": "admin@assessment.com",
            "password": hash_password("Admin@123"),
            "role": "admin",
            "is_active": True,
            "created_at": datetime.utcnow()
        }
    )

    print("Default admin created.")