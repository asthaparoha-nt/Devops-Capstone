from bson import ObjectId

from app.database.connection import database


class QuestionRepository:
    """
    Repository for Question collection.
    """

    @staticmethod
    async def create_question(question: dict):

        result = await database.questions.insert_one(
            question
        )

        return result.inserted_id

    @staticmethod
    async def get_question_by_id(
        question_id: str
    ):

        question = await database.questions.find_one(
            {
                "_id": ObjectId(question_id)
            }
        )

        if question:

            question["id"] = str(
                question["_id"]
            )

            del question["_id"]

        return question

    @staticmethod
    async def get_all_questions():

        questions = []

        async for question in database.questions.find():

            question["id"] = str(
                question["_id"]
            )

            del question["_id"]

            questions.append(question)

        return questions

    @staticmethod
    async def get_questions_by_quiz(
        quiz_id: str
    ):

        questions = []

        async for question in database.questions.find(

            {

                "quiz_id": quiz_id

            }

        ):

            question["id"] = str(question["_id"])

            del question["_id"]

            questions.append(question)

        return questions
    @staticmethod
    async def get_question_by_text(
        quiz_id: str,
        question_text: str
    ):

        return await database.questions.find_one(
            {
                "quiz_id": quiz_id,
                "question_text": question_text
            }
        )

    @staticmethod
    async def update_question(
        question_id: str,
        data: dict
    ):

        return await database.questions.update_one(
            {
                "_id": ObjectId(question_id)
            },
            {
                "$set": data
            }
        )

    @staticmethod
    async def delete_question(
        question_id: str
    ):

        return await database.questions.delete_one(
            {
                "_id": ObjectId(question_id)
            }
        )
    @staticmethod
    async def get_question_by_text_except_id(
        quiz_id: str,
        question_text: str,
        question_id: str
    ):
        """
        Check duplicate question excluding current question.
        """

        question = await database.questions.find_one(
            {
                "quiz_id": quiz_id,
                "question_text": question_text,
                "_id": {
                    "$ne": ObjectId(question_id)
                }
            }
        )

        return question
    @staticmethod
    async def get_question_ids_by_quiz(
        quiz_id: str
    ):
        """
        Fetch all question ids for a quiz.
        """

        question_ids = []

        async for question in database.questions.find(
            {
                "quiz_id": quiz_id
            }
        ):

            question_ids.append(
                str(question["_id"])
            )

        return question_ids
    @staticmethod
    async def get_questions_map(
        quiz_id: str
    ):
        """
        Fetch questions indexed by id.
        """

        questions = {}

        async for question in database.questions.find(
            {
                "quiz_id": quiz_id
            }
        ):

            question["id"] = str(question["_id"])

            questions[str(question["_id"])] = question

        return questions