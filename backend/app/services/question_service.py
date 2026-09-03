from datetime import datetime

from bson import ObjectId

from app.constants.question_messages import QuestionMessages
from app.core.exceptions import (
    InvalidQuestionIdException,
    QuestionAlreadyExistsException,
    QuestionNotFoundException,
    ResourceNotFoundException,
)
from app.core.logger import logger
from app.repositories.question_repository import QuestionRepository
from app.repositories.quiz_repository import QuizRepository
from app.repositories.category_repository import CategoryRepository

class QuestionService:
    """
    Business logic for Question Management.
    """
    @staticmethod
    def validate_question(question):
        """
        Validate question data.
        """

        if question.question_type == "mcq":

            if question.correct_answer not in question.options:
                raise ResourceNotFoundException(
                    QuestionMessages.INVALID_CORRECT_ANSWER
                )

        if question.question_type == "true_false":

            if question.options != [
                "True",
                "False"
            ]:
                raise ResourceNotFoundException(
                    QuestionMessages.INVALID_TRUE_FALSE_OPTIONS
                )

            if question.correct_answer not in [
                "True",
                "False"
            ]:
                raise ResourceNotFoundException(
                    QuestionMessages.INVALID_TRUE_FALSE_ANSWER
                )
    @staticmethod
    async def create_question(question):
        """
        Create a new question.
        """

        if not ObjectId.is_valid(question.quiz_id):
            raise ResourceNotFoundException(
                QuestionMessages.INVALID_QUIZ_ID
            )

        quiz = await QuizRepository.get_quiz_by_id(
            question.quiz_id
        )

        if quiz is None:
            raise ResourceNotFoundException(
                QuestionMessages.QUIZ_NOT_FOUND
            )

        existing_question = await QuestionRepository.get_question_by_text(
            question.quiz_id,
            question.question_text
        )

        if existing_question:
            raise QuestionAlreadyExistsException()

        if question.question_type == "mcq":

            if question.correct_answer not in question.options:
                raise ResourceNotFoundException(
                    "Correct answer must exist in options"
                )

        if question.question_type == "true_false":

            if question.options != ["True", "False"]:
                raise ResourceNotFoundException(
                    "Options must be True and False"
                )

            if question.correct_answer not in [
                "True",
                "False"
            ]:
                raise ResourceNotFoundException(
                    "Correct answer must be True or False"
                )

        question_data = {
            "quiz_id": question.quiz_id,
            "question_text": question.question_text,
            "question_type": question.question_type,
            "options": question.options,
            "correct_answer": question.correct_answer,
            "difficulty": question.difficulty,
            "tags": question.tags,
            "marks": question.marks,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": None
        }

        question_id = await QuestionRepository.create_question(
            question_data
        )

        question_data["id"] = str(question_id)

        question_data.pop("_id", None)

        print("QUESTION DATA =", question_data)

        for k, v in question_data.items():
            print(k, type(v), v)

        return question_data

    @staticmethod
    async def get_all_questions():
        """
        Fetch all questions.
        """

        questions = await QuestionRepository.get_all_questions()

        response = questions

        return response

    @staticmethod
    async def get_question_by_id(question_id: str):
        """
        Fetch question by id.
        """

        if not ObjectId.is_valid(question_id):
            raise InvalidQuestionIdException()

        question = await QuestionRepository.get_question_by_id(
            question_id
        )

        if question is None:
            raise QuestionNotFoundException()

        response = question

        return response

    @staticmethod
    async def get_questions_by_quiz(
        quiz_id: str
    ):
        """
        Fetch questions of a quiz.
        """

        if not ObjectId.is_valid(
            quiz_id
        ):
            raise ResourceNotFoundException(
                QuestionMessages.INVALID_QUIZ_ID
            )

        quiz = await QuizRepository.get_quiz_by_id(
            quiz_id
        )

        if quiz is None:
            raise ResourceNotFoundException(
                QuestionMessages.QUIZ_NOT_FOUND
            )

        questions = await QuestionRepository.get_questions_by_quiz(
            quiz_id
        )

        response = questions
    
        return response

    @staticmethod
    async def update_question(
        question_id: str,
        question
    ):
        """
        Update question.
        """

        if not ObjectId.is_valid(
            question_id
        ):
            raise InvalidQuestionIdException()

        existing_question = await QuestionRepository.get_question_by_id(
            question_id
        )

        if existing_question is None:
            raise QuestionNotFoundException()
        duplicate_question = await QuestionRepository.get_question_by_text_except_id(
            existing_question["quiz_id"],
            question.question_text,
            question_id)
        if duplicate_question:
            raise QuestionAlreadyExistsException()
        QuestionService.validate_question(
    question
)
        data = {
            "question_text": question.question_text,
            "question_type": question.question_type,
            "options": question.options,
            "correct_answer": question.correct_answer,
            "difficulty": question.difficulty,
            "tags": question.tags,
            "marks": question.marks,
            "updated_at": datetime.utcnow().isoformat()
        }

        await QuestionRepository.update_question(
            question_id,
            data
        )

        logger.info("Question updated successfully")

        response = True

        return response

    @staticmethod
    async def delete_question(
        question_id: str
    ):
        """
        Delete question.
        """

        if not ObjectId.is_valid(
            question_id
        ):
            raise InvalidQuestionIdException()

        question = await QuestionRepository.get_question_by_id(
            question_id
        )

        if question is None:
            raise QuestionNotFoundException()

        await QuestionRepository.delete_question(
            question_id
        )

        logger.info("Question deleted successfully")

        response = True

        return response
    @staticmethod
    async def get_questions_by_quiz_student(
        quiz_id: str
    ):
        """
        Fetch quiz questions for students.
        Correct answers are hidden.
        """

        if not ObjectId.is_valid(quiz_id):
            raise ResourceNotFoundException(
                QuestionMessages.INVALID_QUIZ_ID
            )

        quiz = await QuizRepository.get_quiz_by_id(
            quiz_id
        )

        if quiz is None:
            raise ResourceNotFoundException(
                QuestionMessages.QUIZ_NOT_FOUND
            )

        questions = await QuestionRepository.get_questions_by_quiz(
            quiz_id
        )

        for question in questions:
            question.pop(
                "correct_answer",
                None
            )

        response = questions

        return response
    @staticmethod
    async def get_question_details(
        question_id: str
    ):
        """
        Fetch complete question details.
        """

        if not ObjectId.is_valid(question_id):

            raise InvalidQuestionIdException()

        question = await QuestionRepository.get_question_by_id(
            question_id
        )

        if question is None:

            raise QuestionNotFoundException()

        quiz = await QuizRepository.get_quiz_by_id(
            question["quiz_id"]
        )

        category = None

        if quiz:

            category = await CategoryRepository.get_category_by_id(
                quiz["category_id"]
            )

        response = {

            "question": question,

            "quiz": quiz,

            "category": category

        }

        return response