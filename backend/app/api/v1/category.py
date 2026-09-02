from fastapi import APIRouter, Depends

from app.core.exceptions import ResourceExistsException
from app.dependencies.auth_dependency import (
    admin_required,
    get_current_user,
)
from app.schemas.category_schema import CategoryCreate
from app.services.category_service import CategoryService
from app.utils.response import success_response

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.post("/")
async def create_category(
    category: CategoryCreate,
    current_user=Depends(admin_required)
):

    result = await CategoryService.create_category(category)

    if result is None:
        raise ResourceExistsException(
            "Category already exists"
        )
    print(result)
    print(type(result))
    return success_response(
        message="Category created successfully",
        data=result,
        status_code=201
    )


@router.get("/")
async def get_all_categories(
    current_user=Depends(get_current_user)
):

    categories = await CategoryService.get_all_categories()

    return success_response(
        message="Categories fetched successfully",
        data=categories
    )


@router.get("/{category_id}")
async def get_category(
    category_id: str,
    current_user=Depends(get_current_user)
):

    category = await CategoryService.get_category(
        category_id
    )

    return success_response(
        message="Category fetched successfully",
        data=category
    )
@router.get("/{category_id}/details")
async def get_category_details(
    category_id: str,
    current_user=Depends(admin_required)
):
    """
    Fetch category with quizzes and questions.
    """

    result = await CategoryService.get_category_details(
        category_id
    )

    return success_response(
        message="Category details fetched successfully",
        data=result
    )

@router.put("/{category_id}")
async def update_category(
    category_id: str,
    category: CategoryCreate,
    current_user=Depends(admin_required)
):

    result=await CategoryService.update_category(
        category_id,
        category
    )
    if result is None:

        raise ResourceExistsException(
            "Category already exists"
        )

    return success_response(
        message="Category updated successfully"
    )


@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_user=Depends(admin_required)
):

    await CategoryService.delete_category(
        category_id
    )

    return success_response(
        message="Category deleted successfully"
    )