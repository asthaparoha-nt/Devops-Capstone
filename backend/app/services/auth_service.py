from datetime import datetime

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.repositories.user_repository import UserRepository
from app.core.exceptions import (
    AuthenticationException,
    UserAlreadyExistsException,
    UserNotFoundException,
)

class AuthService:

    @staticmethod
    async def register_student(student):

        existing_user = await UserRepository.get_user_by_email(
            student.email
        )

        if existing_user:
            raise UserAlreadyExistsException()
        user_data = {
            "full_name": student.full_name,
            "email": student.email,
            "password": hash_password(student.password),
            "role": "student",
            "is_active": True,
            "created_at": datetime.utcnow()
        }

        await UserRepository.create_user(
            user_data
        )

        return True

    @staticmethod
    async def login(login_data):

        user = await UserRepository.get_user_by_email(
            login_data.email
        )

        if user is None:
            raise UserNotFoundException()
        if not verify_password(
            login_data.password,
            user["password"]
        ):
            raise AuthenticationException()
        token = create_access_token(
            {
                "email": user["email"],
                "role": user["role"]
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user["role"]
        }