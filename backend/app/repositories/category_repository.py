from unicodedata import category

from bson import ObjectId

from app.database.connection import database
import re

class CategoryRepository:

    @staticmethod
    async def create_category(category: dict):
        result = await database.categories.insert_one(category)
        return result.inserted_id

    @staticmethod
    async def get_category_by_name(name: str):
        """
        Check category ignoring case.
        """

        return await database.categories.find_one(
            {
                "name": {
                    "$regex": f"^{re.escape(name.strip())}$",
                    "$options": "i"
                }
            }
        )

    @staticmethod
    async def get_all_categories():
        categories = []

        async for category in database.categories.find():

            category["id"] = str(category["_id"])
            del category["_id"]

            categories.append(category)

        return categories

    @staticmethod
    async def get_category_by_id(category_id: str):

        category = await database.categories.find_one(
            {
                "_id": ObjectId(category_id)
            }
        )

        if category:
            category["id"] = str(category["_id"])
            del category["_id"]

        return category

    @staticmethod
    async def update_category(category_id: str, data: dict):
        duplicate = await CategoryRepository.get_category_by_name_except_id(
            category.name.strip(),
            category_id
        )
        if duplicate:
            return None
        return await database.categories.update_one(
            {
                "_id": ObjectId(category_id)
            },
            {
                "$set": data
            }
        )

    @staticmethod
    async def delete_category(category_id: str):

        return await database.categories.delete_one(
            {
                "_id": ObjectId(category_id)
            }
        )
    @staticmethod
    async def get_quizzes_by_category(
        category_id: str
    ):
        """
        Fetch quizzes belonging to category.
        """

        quizzes = []

        async for quiz in database.quizzes.find(
            {
                "category_id": category_id
            }
        ):

            quiz["id"] = str(
                quiz["_id"]
            )

            del quiz["_id"]

            quizzes.append(
                quiz
            )

        return quizzes


    @staticmethod
    async def get_questions_by_quizzes(
        quiz_ids: list
    ):
        """
        Fetch questions of quizzes.
        """

        questions = []

        async for question in database.questions.find(
            {
                "quiz_id": {
                    "$in": quiz_ids
                }
            }
        ):

            question["id"] = str(
                question["_id"]
            )

            del question["_id"]

            questions.append(
                question
            )

        return questions
    @staticmethod
    async def get_category_by_name_except_id(
        name: str,
        category_id: str
    ):
        """
        Check duplicate category while updating.
        """

        return await database.categories.find_one(
            {
                "name": {
                    "$regex": f"^{re.escape(name.strip())}$",
                    "$options": "i"
                },
                "_id": {
                    "$ne": ObjectId(category_id)
                }
            }
        )