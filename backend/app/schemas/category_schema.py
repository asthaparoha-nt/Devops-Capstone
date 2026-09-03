from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=5, max_length=200)


class CategoryResponse(BaseModel):
    id: str
    name: str
    description: str