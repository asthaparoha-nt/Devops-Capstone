from fastapi import APIRouter, Depends

from app.constants.question_messages import QuestionMessages
from app.dependencies.auth_dependency import (
    admin_required,
    get_current_user,
)
from app.schemas.question_schema import QuestionCreate
from app.services.question_service import QuestionService
from app.utils.response import success_response

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)


@router.post("/")
async def create_question(
    
    question: QuestionCreate,
    current_user=Depends(admin_required)
):
    print("===================")
    print(question)
    print(question.question_type)
    print(question.options)
    print(question.correct_answer)
    print("===================")
    """
    Create a question.
    """

    result = await QuestionService.create_question(
        question
    )

    response = success_response(
        message=QuestionMessages.QUESTION_CREATED,
        data=result,
        status_code=201
    )

    return response


@router.get("/")
async def get_all_questions(
    current_user=Depends(admin_required)
):
    """
    Fetch all questions.
    """

    questions = await QuestionService.get_all_questions()

    response = success_response(
        message=QuestionMessages.QUESTIONS_FETCHED,
        data=questions
    )

    return response

@router.get("/details/{question_id}")
async def get_question_details(
    question_id: str,
    current_user=Depends(get_current_user)
):
    """
    Fetch complete question details.
    """

    result = await QuestionService.get_question_details(
        question_id
    )

    return success_response(
        message="Question details fetched successfully",
        data=result
    )
@router.get("/{question_id}")
async def get_question_by_id(
    question_id: str,
    current_user=Depends(admin_required)
):
    """
    Fetch question by id.
    """

    question = await QuestionService.get_question_by_id(
        question_id
    )

    response = success_response(
        message=QuestionMessages.QUESTION_FETCHED,
        data=question
    )

    return response


@router.put("/{question_id}")
async def update_question(
    question_id: str,
    question: QuestionCreate,
    current_user=Depends(admin_required)
):
    """
    Update question.
    """

    await QuestionService.update_question(
        question_id,
        question
    )

    response = success_response(
        message=QuestionMessages.QUESTION_UPDATED
    )

    return response


@router.delete("/{question_id}")
async def delete_question(
    question_id: str,
    current_user=Depends(admin_required)
):
    """
    Delete question.
    """

    await QuestionService.delete_question(
        question_id
    )

    response = success_response(
        message=QuestionMessages.QUESTION_DELETED
    )

    return response


@router.get("/quiz/{quiz_id}")
async def get_questions_by_quiz(
    quiz_id: str,
    current_user=Depends(get_current_user)
):
    """
    Fetch quiz questions for students.
    """

    questions = await QuestionService.get_questions_by_quiz_student(
        quiz_id
    )

    response = success_response(
        message=QuestionMessages.QUESTIONS_FETCHED,
        data=questions
    )

    return response