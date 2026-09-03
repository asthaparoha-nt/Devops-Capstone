from fastapi import APIRouter, Depends

from app.constants.result_messages import ResultMessages
from app.dependencies.auth_dependency import student_required
from app.services.result_service import ResultService
from app.utils.response import success_response
from app.dependencies.auth_dependency import admin_required

router = APIRouter(
    prefix="/results",
    tags=["Results"]
)

@router.get("/history")
async def get_result_history(
    current_user=Depends(student_required)
):
    """
    Fetch logged-in student's result history.
    """

    result = await ResultService.get_result_history(
        current_user
    )

    response = success_response(
        message=ResultMessages.RESULTS_FETCHED,
        data=result
    )

    return response
@router.get("/{attempt_id}")
async def get_result(
    attempt_id: str,
    current_user=Depends(student_required)
):
    """
    Fetch result of a submitted attempt.
    """

    result = await ResultService.get_result(
        attempt_id,
        current_user
    )

    response = success_response(
        message=ResultMessages.RESULT_FETCHED,
        data=result
    )

    return response
@router.get("/quiz/{quiz_id}")
async def get_quiz_results(
    quiz_id: str,
    current_user=Depends(admin_required)
):
    """
    Fetch all results of a quiz.
    """

    result = await ResultService.get_quiz_results(
        quiz_id
    )

    response = success_response(
        message=ResultMessages.RESULTS_FETCHED,
        data=result
    )

    return response
@router.get("/leaderboard/{quiz_id}")
async def get_leaderboard(
    quiz_id: str,
    current_user=Depends(admin_required)
):
    """
    Fetch leaderboard of a quiz.
    """

    result = await ResultService.get_leaderboard(
        quiz_id
    )

    response = success_response(
        message=ResultMessages.RESULTS_FETCHED,
        data=result
    )

    return response