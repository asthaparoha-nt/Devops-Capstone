from fastapi import APIRouter

from app.constants.auth_messages import AuthMessages
from app.schemas.auth_schema import StudentRegister, UserLogin
from app.services.auth_service import AuthService
from app.utils.response import success_response

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register_student(
    student: StudentRegister
):
    """
    Register a new student.
    """

    await AuthService.register_student(
        student
    )

    response = success_response(
        message=AuthMessages.STUDENT_REGISTERED,
        status_code=201
    )

    return response


@router.post("/login")
async def login(
    login_data: UserLogin
):
    """
    Login user.
    """

    result = await AuthService.login(
        login_data
    )

    response = success_response(
        message=AuthMessages.LOGIN_SUCCESSFUL,
        data=result
    )

    return response