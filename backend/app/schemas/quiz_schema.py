from pydantic import BaseModel, Field


class QuizCreate(BaseModel):
    """
    Schema for creating a new quiz.
    """

    title: str = Field(..., min_length=3, max_length=100)

    description: str = Field(..., min_length=5, max_length=500)

    category_id: str

    duration: int = Field(
    ...,
    ge=1,
    le=180
)

    total_marks: int = Field(..., gt=0)