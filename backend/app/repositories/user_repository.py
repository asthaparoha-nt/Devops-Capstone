from app.database.connection import database


class UserRepository:

    @staticmethod
    async def get_user_by_email(email: str):
        return await database.users.find_one({"email": email})

    @staticmethod
    async def create_user(user: dict):
        return await database.users.insert_one(user)
    @staticmethod
    async def get_all_users():
        """
        Fetch all users.
        """

        users = []

        async for user in database.users.find():

            user["id"] = str(
                user["_id"]
            )

            del user["_id"]

            users.append(
                user
            )

        return users