from bson import ObjectId

from app.database.connection import database

import re
class QuizRepository:
    """
    Repository for Quiz collection.
    """

    @staticmethod
    async def create_quiz(quiz: dict):
        """
        Insert quiz into MongoDB.
        """
        result = await database.quizzes.insert_one(quiz)
        return result.inserted_id

    @staticmethod
    async def get_all_quizzes():
        """
        Fetch all quizzes.
        """
        quizzes = []

        async for quiz in database.quizzes.find():

            quiz["id"] = str(quiz["_id"])
            del quiz["_id"]

            quizzes.append(quiz)

        return quizzes

    @staticmethod
    async def get_quiz_by_id(quiz_id: str):

        quiz = await database.quizzes.find_one(
            {
                "_id": ObjectId(quiz_id)
            }
        )

        if quiz:

            quiz["id"] = str(quiz["_id"])
            del quiz["_id"]

        return quiz

    @staticmethod
    async def get_quiz_by_title(title: str):

        return await database.quizzes.find_one(

            {

                "title": {

                    "$regex": f"^{re.escape(title.strip())}$",

                    "$options": "i"

                }

            }

        )
    @staticmethod
    async def get_quiz_by_title_except_id(

        title: str,

        quiz_id: str

    ):

        return await database.quizzes.find_one(

            {

                "title": {

                    "$regex": f"^{re.escape(title.strip())}$",

                    "$options": "i"

                },

                "_id": {

                    "$ne": ObjectId(quiz_id)

                }

            }

        )
    @staticmethod
    async def update_quiz(quiz_id: str, data: dict):

        return await database.quizzes.update_one(
            {
                "_id": ObjectId(quiz_id)
            },
            {
                "$set": data
            }
        )

    @staticmethod
    async def delete_quiz(quiz_id: str):

        return await database.quizzes.delete_one(
            {
                "_id": ObjectId(quiz_id)
            }
        )
    @staticmethod
    async def quiz_exists(title: str):

        quiz = await database.quizzes.find_one(
                {
            "title": title
            }
        )

        return quiz
    