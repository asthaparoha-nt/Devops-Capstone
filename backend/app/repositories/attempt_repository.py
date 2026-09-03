from datetime import datetime

from bson import ObjectId

from app.database.connection import database


class AttemptRepository:
    """
    Repository for Quiz Attempts.
    """

    @staticmethod
    async def create_attempt(attempt: dict):

        result = await database.attempts.insert_one(
            attempt
        )

        return result.inserted_id

    @staticmethod
    async def get_attempt_by_id(
        attempt_id: str
    ):

        attempt = await database.attempts.find_one(
            {
                "_id": ObjectId(attempt_id)
            }
        )

        if attempt:

            attempt["id"] = str(
                attempt["_id"]
            )

            del attempt["_id"]

        return attempt

    @staticmethod
    async def get_student_attempt(
        student_email: str,
        quiz_id: str
    ):

        return await database.attempts.find_one(
            {
                "student_email": student_email,
                "quiz_id": quiz_id
            }
        )

    @staticmethod
    async def update_attempt(
        attempt_id: str,
        data: dict
    ):

        return await database.attempts.update_one(
            {
                "_id": ObjectId(attempt_id)
            },
            {
                "$set": data
            }
        )

    @staticmethod
    async def get_all_attempts():

        attempts = []

        async for attempt in database.attempts.find():

            attempt["id"] = str(
                attempt["_id"]
            )

            del attempt["_id"]

            attempts.append(attempt)

        return attempts
    @staticmethod
    async def save_answers(
        attempt_id: str,
        answers: list
    ):
        """
        Save answers for an attempt.
        """

        result = await database.attempts.update_one(
            {
                "_id": ObjectId(attempt_id)
            },
            {
                "$set": {
                    "answers": answers
                }
            }
        )

        return result
    @staticmethod
    async def submit_attempt(
        attempt_id: str,
        score: int
    ):
        """
        Submit quiz attempt.
        """

        result = await database.attempts.update_one(
            {
                "_id": ObjectId(attempt_id)
            },
            {
                "$set": {
                    "status": "submitted",
                    "score": score,
                    "submitted_at": datetime.utcnow().isoformat()
                }
            }
        )

        return result
    @staticmethod
    async def get_student_attempts(
        student_email: str
    ):
        """
        Fetch all attempts of a student.
        """

        attempts = []

        async for attempt in database.attempts.find(
            {
                "student_email": student_email,
                "status": "submitted"
            }
        ):

            attempt["id"] = str(
                attempt["_id"]
            )

            del attempt["_id"]

            attempts.append(
                attempt
            )

        return attempts
    @staticmethod
    async def get_attempts_by_quiz(
        quiz_id: str
    ):
        """
        Fetch all submitted attempts of a quiz.
        """

        attempts = []

        async for attempt in database.attempts.find(
            {
                "quiz_id": quiz_id,
                "status": "submitted"
            }
        ):

            attempt["id"] = str(
                attempt["_id"]
            )

            del attempt["_id"]

            attempts.append(
                attempt
            )

        return attempts
    @staticmethod
    async def get_student_attempts_by_quiz(
        student_email: str,
        quiz_id: str
    ):
        """
        Fetch all attempts of a student for a quiz.
        """

        attempts = []

        async for attempt in database.attempts.find(
            {
                "student_email": student_email,
                "quiz_id": quiz_id,
                "status": "submitted"
            }
        ):

            attempt["id"] = str(attempt["_id"])

            del attempt["_id"]

            attempts.append(attempt)

        return attempts