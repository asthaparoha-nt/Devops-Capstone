from datetime import datetime

from bson import ObjectId

from app.constants.attempt_messages import AttemptMessages
from app.core.exceptions import (
    AttemptAlreadySubmittedException,
    AttemptLimitReachedException,
    AttemptNotFoundException,
    InvalidAttemptIdException,
    ResourceNotFoundException,
)
from app.core.logger import logger
from app.repositories.attempt_repository import AttemptRepository
from app.repositories.question_repository import QuestionRepository
from app.repositories.quiz_repository import QuizRepository


class AttemptService:
    """
    Business logic for Quiz Attempt.
    """

    @staticmethod
    async def start_attempt(
        quiz_id: str,
        current_user
    ):
        """
        Start quiz attempt.
        """

        if not ObjectId.is_valid(
            quiz_id
        ):
            raise ResourceNotFoundException(
                AttemptMessages.INVALID_QUIZ_ID
            )

        quiz = await QuizRepository.get_quiz_by_id(
            quiz_id
        )

        if quiz is None:
            raise ResourceNotFoundException(
                AttemptMessages.QUIZ_NOT_FOUND
            )

        attempts = await AttemptRepository.get_student_attempts_by_quiz(
            current_user["email"],
            quiz_id
        )

        if len(attempts) >= 2:
            raise AttemptLimitReachedException()

        question_ids = await QuestionRepository.get_question_ids_by_quiz(
            quiz_id
        )

        attempt = {

            "student_email": current_user["email"],

            "quiz_id": quiz_id,

            "question_ids": question_ids,

            "answers": [],

            "status": "in_progress",

            "score": 0,

            "started_at": datetime.utcnow().isoformat(),

            "submitted_at": None,

            "time_limit": quiz["duration"]

        }

        attempt_id = await AttemptRepository.create_attempt(
            attempt
        )

        attempt.pop("_id", None)

        attempt["id"] = str(attempt_id)

        logger.info(
            "Attempt started %s",
            attempt_id
        )

        response = attempt

        return response
    @staticmethod
    async def save_answer(
        attempt_id: str,
        answer
    ):
        """
        Save or update a student's answer.
        """

        if not ObjectId.is_valid(attempt_id):
            raise InvalidAttemptIdException()

        attempt = await AttemptRepository.get_attempt_by_id(
            attempt_id
        )

        if attempt is None:
            raise AttemptNotFoundException()

        if attempt["status"] == "submitted":
            raise AttemptAlreadySubmittedException()

        if answer.question_id not in attempt["question_ids"]:
            raise ResourceNotFoundException(
                AttemptMessages.INVALID_QUESTION
            )

        answers = attempt["answers"]

        updated = False

        for existing_answer in answers:

            if existing_answer["question_id"] == answer.question_id:

                existing_answer["selected_answer"] = (
                    answer.selected_answer
                )

                updated = True

                break

        if not updated:

            answers.append(
                {
                    "question_id": answer.question_id,
                    "selected_answer": answer.selected_answer
                }
            )

        await AttemptRepository.save_answers(
            attempt_id,
            answers
        )

        response = {
            "attempt_id": attempt_id,
            "answers": answers
        }

        return response
    @staticmethod
    async def submit_attempt(
        attempt_id: str
    ):
        """
        Submit quiz attempt.
        """

        if not ObjectId.is_valid(
            attempt_id
        ):
            raise InvalidAttemptIdException()

        attempt = await AttemptRepository.get_attempt_by_id(
            attempt_id
        )

        if attempt is None:
            raise AttemptNotFoundException()

        if attempt["status"] == "submitted":
            raise AttemptAlreadySubmittedException()

        started_at = datetime.fromisoformat(
            attempt["started_at"]
        )

        elapsed_minutes = (
            datetime.utcnow() - started_at
        ).total_seconds() / 60

        questions = await QuestionRepository.get_questions_map(
            attempt["quiz_id"]
        )

        score = 0

        for answer in attempt["answers"]:

            question = questions.get(
                answer["question_id"]
            )

            if question:

                if (
                    answer["selected_answer"]
                    ==
                    question["correct_answer"]
                ):
                    score += question["marks"]

        await AttemptRepository.submit_attempt(
            attempt_id,
            score
        )

        response = {

            "attempt_id": attempt_id,

            "score": score,

            "status": "submitted"

        }

        return response