from datetime import datetime

from bson import ObjectId

from app.constants.result_messages import ResultMessages
from app.repositories.attempt_repository import AttemptRepository
from app.constants.quiz_messages import QuizMessages
from app.core.exceptions import (
    InvalidQuizIdException,
    QuizAlreadyExistsException,
    QuizNotFoundException,
    ResourceNotFoundException,
)
from app.core.logger import logger
from app.repositories.category_repository import CategoryRepository
from app.repositories.quiz_repository import QuizRepository
from app.repositories.question_repository import QuestionRepository

class QuizService:
    """
    Business logic for Quiz Management.
    """

    @staticmethod
    async def create_quiz(quiz):
        """
        Create a new quiz.
        """

        existing_quiz = await QuizRepository.get_quiz_by_title(
            quiz.title
        )

        if existing_quiz:
            raise QuizAlreadyExistsException()

        if not ObjectId.is_valid(quiz.category_id):
            raise ResourceNotFoundException(
                QuizMessages.INVALID_CATEGORY_ID
            )

        category = await CategoryRepository.get_category_by_id(
            quiz.category_id
        )

        if category is None:
            raise ResourceNotFoundException(
                QuizMessages.CATEGORY_NOT_FOUND
            )
        existing_quiz = await QuizRepository.get_quiz_by_title(

            quiz.title

        )

        if existing_quiz:

            return None
        quiz_data = {
            "title": quiz.title.strip(),
            "description": quiz.description,
            "category_id": quiz.category_id,
            "duration": quiz.duration,
            "total_marks": quiz.total_marks,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": None
        }

        quiz_id = await QuizRepository.create_quiz(
            quiz_data
        )

        quiz_data["id"] = str(quiz_id)

        quiz_data.pop("_id", None)

        print("QUIZ DATA =", quiz_data)

        for k, v in quiz_data.items():
            print(k, type(v), v)

        return quiz_data
    @staticmethod
    async def get_all_quizzes(
        current_user
    ):
        """
        Fetch all quizzes.
        """

        quizzes = await QuizRepository.get_all_quizzes()

        for quiz in quizzes:

            attempts = await AttemptRepository.get_student_attempts_by_quiz(

                current_user["email"],

                quiz["id"]

            )

            quiz["attempts_remaining"] = max(

                0,

                2 - len(attempts)

            )

        return quizzes
    @staticmethod
    async def get_quiz_by_id(
        quiz_id: str
    ):
        """
        Fetch quiz by id.
        """

        if not ObjectId.is_valid(quiz_id):
            raise InvalidQuizIdException()

        quiz = await QuizRepository.get_quiz_by_id(
            quiz_id
        )

        if quiz is None:
            raise QuizNotFoundException()

        response = quiz

        return response

    @staticmethod
    async def update_quiz(
        quiz_id: str,
        quiz
    ):
        """
        Update quiz.
        """

        if not ObjectId.is_valid(quiz_id):
            raise InvalidQuizIdException()

        existing_quiz = await QuizRepository.get_quiz_by_id(
            quiz_id
        )

        if existing_quiz is None:
            raise QuizNotFoundException()

        existing_title = await QuizRepository.get_quiz_by_title_except_id(
            quiz.title,
            quiz_id
        )
        if existing_title:
            raise QuizAlreadyExistsException()

        if not ObjectId.is_valid(
            quiz.category_id
        ):
            raise ResourceNotFoundException(
                QuizMessages.INVALID_CATEGORY_ID
            )

        category = await CategoryRepository.get_category_by_id(
            quiz.category_id
        )

        if category is None:
            raise ResourceNotFoundException(
                QuizMessages.CATEGORY_NOT_FOUND
            )
        duplicate_quiz = await QuizRepository.get_quiz_by_title_except_id(

            quiz.title,

            quiz_id

        )

        if duplicate_quiz:

            return None
        data = {
            "title": quiz.title.strip(),
            "description": quiz.description,
            "category_id": quiz.category_id,
            "duration": quiz.duration,
            "total_marks": quiz.total_marks,
            "updated_at": datetime.utcnow().isoformat()
        }

        await QuizRepository.update_quiz(
            quiz_id,
            data
        )

        logger.info("Quiz updated successfully")

        response = True

        return response

    @staticmethod
    async def delete_quiz(
        quiz_id: str
    ):
        """
        Delete quiz.
        """

        if not ObjectId.is_valid(
            quiz_id
        ):
            raise InvalidQuizIdException()

        quiz = await QuizRepository.get_quiz_by_id(
            quiz_id
        )

        if quiz is None:
            raise QuizNotFoundException()

        await QuizRepository.delete_quiz(
            quiz_id
        )

        logger.info("Quiz deleted successfully")

        response = True

        return response
    @staticmethod
    async def get_leaderboard(
        quiz_id: str
    ):
        """
        Fetch leaderboard for a quiz.
        """

        if not ObjectId.is_valid(
            quiz_id
        ):
            raise ResourceNotFoundException(
                ResultMessages.INVALID_ATTEMPT_ID
            )

        quiz = await QuizRepository.get_quiz_by_id(
            quiz_id
        )

        if quiz is None:
            raise ResourceNotFoundException(
                ResultMessages.RESULT_NOT_FOUND
            )

        attempts = await AttemptRepository.get_attempts_by_quiz(
            quiz_id
        )

        leaderboard = []

        for attempt in attempts:

            percentage = (
                attempt["score"]
                /
                quiz["total_marks"]
            ) * 100

            leaderboard.append(

                {

                    "student_email": attempt["student_email"],

                    "score": attempt["score"],

                    "percentage": round(
                        percentage,
                        2
                    )

                }

            )

        leaderboard.sort(
            key=lambda item: item["score"],
            reverse=True
        )

        response = leaderboard

        return response
    @staticmethod
    async def get_quiz_details(
        quiz_id: str
    ):
        """
        Fetch complete quiz details.
        """

        if not ObjectId.is_valid(quiz_id):

            raise InvalidQuizIdException()

        quiz = await QuizRepository.get_quiz_by_id(
            quiz_id
        )

        if quiz is None:

            raise QuizNotFoundException()

        category = await CategoryRepository.get_category_by_id(
            quiz["category_id"]
        )

        questions = await QuestionRepository.get_questions_by_quiz(
            quiz_id
        )

        attempts = await AttemptRepository.get_all_attempts()

        quiz_attempts = [

            attempt

            for attempt in attempts

            if attempt["quiz_id"] == quiz_id

        ]

        response = {

            "quiz": quiz,

            "category": category,

            "questions": questions,

            "attempt_count": len(
                quiz_attempts
            )

        }

        return response