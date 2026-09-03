from bson import ObjectId

from app.constants.result_messages import ResultMessages
from app.core.exceptions import (
    InvalidAttemptIdException,
    ResourceNotFoundException,
)
from app.repositories.attempt_repository import AttemptRepository
from app.repositories.quiz_repository import QuizRepository
from app.repositories.question_repository import QuestionRepository

class ResultService:
    """
    Business logic for Result Management.
    """

    @staticmethod
    async def get_result(
        attempt_id: str,
        current_user
    ):
        """
        Fetch result of a submitted attempt.
        """

        if not ObjectId.is_valid(
            attempt_id
        ):
            raise InvalidAttemptIdException()

        attempt = await AttemptRepository.get_attempt_by_id(
            attempt_id
        )

        if attempt is None:
            raise ResourceNotFoundException(
                ResultMessages.RESULT_NOT_FOUND
            )

        if (
            attempt["student_email"]
            !=
            current_user["email"]
        ):
            raise ResourceNotFoundException(
                ResultMessages.RESULT_NOT_FOUND
            )

        if (
            attempt["status"]
            !=
            "submitted"
        ):
            raise ResourceNotFoundException(
                ResultMessages.RESULT_UNAVAILABLE
            )

        quiz = await QuizRepository.get_quiz_by_id(
                    attempt["quiz_id"]
                )
        questions = await QuestionRepository.get_questions_map(
            attempt["quiz_id"]
        )

        answer_review = []

        for answer in attempt["answers"]:

            question = questions.get(

                answer["question_id"]

            )

            if question:

                answer_review.append(

                    {

                        "question": question["question_text"],

                        "selected_answer": answer["selected_answer"],

                        "correct_answer": question["correct_answer"],

                        "is_correct":

                            answer["selected_answer"]

                            ==

                            question["correct_answer"],

                        "marks": question["marks"]

                    }

                )

                percentage = (
                    attempt["score"]
                    /
                    quiz["total_marks"]
                ) * 100

                result = {

            "quiz_title": quiz["title"],

            "score": attempt["score"],

            "total_marks": quiz["total_marks"],

            "percentage": round(

                percentage,

                2

            ),

            "status": (

                "PASS"

                if percentage >= 40

                else "FAIL"

            ),

            "submitted_at": attempt["submitted_at"],

            "answers": answer_review

        }

        response = result

        return response
    @staticmethod
    async def get_result_history(
        current_user
    ):
        """
        Fetch result history.
        """

        attempts = await AttemptRepository.get_student_attempts(
            current_user["email"]
        )

        results = []

        for attempt in attempts:

            quiz = await QuizRepository.get_quiz_by_id(
                attempt["quiz_id"]
            )

            percentage = (
                attempt["score"]
                /
                quiz["total_marks"]
            ) * 100

            results.append(

                {

                    "attempt_id": attempt["id"],

                    "quiz_title": quiz["title"],

                    "score": attempt["score"],

                    "total_marks": quiz["total_marks"],

                    "percentage": round(
                        percentage,
                        2
                    ),

                    "status": (
                        "PASS"
                        if percentage >= 40
                        else "FAIL"
                    ),

                    "submitted_at": attempt["submitted_at"]

                }

            )

        response = results

        return response
    @staticmethod
    async def get_quiz_results(
        quiz_id: str
    ):
        """
        Fetch all results of a quiz.
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

        results = []

        for attempt in attempts:

            percentage = (
                attempt["score"]
                /
                quiz["total_marks"]
            ) * 100

            results.append(

                {

                    "student_email": attempt["student_email"],

                    "score": attempt["score"],

                    "total_marks": quiz["total_marks"],

                    "percentage": round(
                        percentage,
                        2
                    ),

                    "status": (
                        "PASS"
                        if percentage >= 40
                        else "FAIL"
                    ),

                    "submitted_at": attempt["submitted_at"]

                }

            )

        response = results

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