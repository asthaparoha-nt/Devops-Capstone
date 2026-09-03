from datetime import datetime

from bson import ObjectId
from app.core.exceptions import (
    InvalidCategoryIdException,
    ResourceNotFoundException,
)
from app.constants.category_messages import CategoryMessages
from app.repositories.category_repository import CategoryRepository

class CategoryService:

    @staticmethod
    async def create_category(category):

        existing = await CategoryRepository.get_category_by_name(category.name)

        if existing:
            return None

        category_data = {
            "name": category.name,
            "description": category.description,
            "created_at": datetime.utcnow().isoformat()
        }

        category_id = await CategoryRepository.create_category(category_data)

        return {
            "id": str(category_id),
            "name": category_data["name"],
            "description": category_data["description"],
            "created_at": category_data["created_at"]
        }
    @staticmethod
    async def get_all_categories():

        return await CategoryRepository.get_all_categories()

    @staticmethod
    async def get_category(category_id: str):

        if not ObjectId.is_valid(category_id):
            raise InvalidCategoryIdException()

        category = await CategoryRepository.get_category_by_id(
            category_id
        )

        if category is None:
            raise ResourceNotFoundException(
                CategoryMessages.CATEGORY_NOT_FOUND
            )

        response = category

        return response
    @staticmethod
    async def update_category(category_id: str, category):

        if not ObjectId.is_valid(category_id):
            raise InvalidCategoryIdException()

        existing = await CategoryRepository.get_category_by_id(
            category_id
        )

        if existing is None:
            raise ResourceNotFoundException(
                CategoryMessages.CATEGORY_NOT_FOUND
            )

        data = {
            "name": category.name,
            "description": category.description
        }

        await CategoryRepository.update_category(
            category_id,
            data
        )

        response = True

        return response
    @staticmethod
    async def delete_category(category_id):

        if not ObjectId.is_valid(category_id):
            raise InvalidCategoryIdException()

        existing = await CategoryRepository.get_category_by_id(
            category_id
        )

        if existing is None:
            raise ResourceNotFoundException(
                CategoryMessages.CATEGORY_NOT_FOUND
            )

        await CategoryRepository.delete_category(
            category_id
        )

        response = True

        return response
    @staticmethod
    async def get_category_details(
        category_id: str
    ):
        """
        Fetch category along with quizzes
        and questions.
        """

        if not ObjectId.is_valid(
            category_id
        ):
            raise InvalidCategoryIdException()

        category = await CategoryRepository.get_category_by_id(
            category_id
        )

        if category is None:
            raise ResourceNotFoundException(
                CategoryMessages.CATEGORY_NOT_FOUND
            )

        quizzes = await CategoryRepository.get_quizzes_by_category(
            category_id
        )

        quiz_ids = [

            quiz["id"]

            for quiz in quizzes

        ]

        questions = await CategoryRepository.get_questions_by_quizzes(
            quiz_ids
        )

        return {

            "category": category,

            "quizzes": quizzes,

            "questions": questions

        }