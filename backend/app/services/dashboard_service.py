from app.repositories.attempt_repository import AttemptRepository
from app.repositories.category_repository import CategoryRepository
from app.repositories.question_repository import QuestionRepository
from app.repositories.quiz_repository import QuizRepository
from app.repositories.user_repository import UserRepository


class DashboardService:
    """
    Dashboard business logic.
    """

    @staticmethod
    async def get_admin_dashboard():
        """
        Fetch admin dashboard.
        """

        users = await UserRepository.get_all_users()

        quizzes = await QuizRepository.get_all_quizzes()

        questions = await QuestionRepository.get_all_questions()

        categories = await CategoryRepository.get_all_categories()

        attempts = await AttemptRepository.get_all_attempts()

        student_count = len(
            [
                user
                for user in users
                if user["role"] == "student"
            ]
        )

        average_score = 0

        submitted_attempts = [
            attempt
            for attempt in attempts
            if attempt["status"] == "submitted"
        ]

        if submitted_attempts:

            total = sum(
                attempt["score"]
                for attempt in submitted_attempts
            )

            average_score = round(
                total / len(submitted_attempts),
                2
            )

        recent_attempts = sorted(

            submitted_attempts,

            key=lambda attempt:
            attempt["submitted_at"],

            reverse=True

        )[:5]

        response = {

            "total_students": student_count,

            "total_categories": len(categories),

            "total_quizzes": len(quizzes),

            "total_questions": len(questions),

            "total_attempts": len(attempts),

            "average_score": average_score,

            "recent_attempts": recent_attempts

        }

        return response
    @staticmethod
    async def get_student_dashboard(
        current_user
    ):
        """
        Fetch student dashboard.
        """

        quizzes = await QuizRepository.get_all_quizzes()

        attempts = await AttemptRepository.get_student_attempts(
            current_user["email"]
        )

        completed = len(
            attempts
        )

        pending = len(
            quizzes
        ) - completed

        average_score = 0

        if attempts:

            total = sum(
                attempt["score"]
                for attempt in attempts
            )

            average_score = round(
                total / completed,
                2
            )

        recent_attempts = sorted(

            attempts,

            key=lambda attempt:
            attempt["submitted_at"],

            reverse=True

        )[:5]

        response = {

            "completed_quizzes": completed,

            "pending_quizzes": max(
                pending,
                0
            ),

            "total_attempts": completed,

            "average_score": average_score,

            "recent_attempts": recent_attempts

        }

        return response