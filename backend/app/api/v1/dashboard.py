from fastapi import APIRouter, Depends

from app.constants.dashboard_messages import DashboardMessages
from app.dependencies.auth_dependency import admin_required, student_required
from app.services.dashboard_service import DashboardService
from app.utils.response import success_response

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/admin")
async def get_admin_dashboard(
    current_user=Depends(admin_required)
):
    """
    Fetch admin dashboard.
    """

    result = await DashboardService.get_admin_dashboard()

    response = success_response(
        message=DashboardMessages.DASHBOARD_FETCHED,
        data=result
    )

    return response
@router.get("/student")
async def get_student_dashboard(
    current_user=Depends(student_required)
):
    """
    Fetch student dashboard.
    """

    result = await DashboardService.get_student_dashboard(
        current_user
    )

    response = success_response(
        message=DashboardMessages.DASHBOARD_FETCHED,
        data=result
    )

    return response