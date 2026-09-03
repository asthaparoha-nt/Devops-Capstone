from fastapi import APIRouter, Depends

from app.constants.attempt_messages import AttemptMessages
from app.dependencies.auth_dependency import student_required
from app.schemas.attempt_schema import AttemptCreate, SaveAnswer
from app.services.attempt_service import AttemptService
from app.utils.response import success_response

router = APIRouter(
    prefix="/attempts",
    tags=["Attempts"]
)


@router.post("/start")
async def start_attempt(
    attempt: AttemptCreate,
    current_user=Depends(student_required)
):
    """
    Start quiz attempt.
    """

    result = await AttemptService.start_attempt(
        attempt.quiz_id,
        current_user
    )

    response = success_response(
        message=AttemptMessages.ATTEMPT_STARTED,
        data=result,
        status_code=201
    )

    return response
@router.put("/{attempt_id}/answer")
async def save_answer(
    attempt_id: str,
    answer: SaveAnswer,
    current_user=Depends(student_required)
):
    """
    Save student's answer.
    """

    result = await AttemptService.save_answer(
        attempt_id,
        answer
    )

    response = success_response(
        message=AttemptMessages.ANSWER_SAVED,
        data=result
    )

    return response
@router.post("/{attempt_id}/submit")
async def submit_attempt(
    attempt_id: str,
    current_user=Depends(student_required)
):
    """
    Submit quiz.
    """

    result = await AttemptService.submit_attempt(
        attempt_id
    )

    response = success_response(
        message=AttemptMessages.ATTEMPT_SUBMITTED,
        data=result
    )

    return response