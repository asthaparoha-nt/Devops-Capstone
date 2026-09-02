from typing import List, Literal

from pydantic import BaseModel, Field, field_validator


class QuestionCreate(BaseModel):
    """
    Schema for creating a question.
    """

    quiz_id: str

    question_text: str = Field(
        ...,
        min_length=5,
        max_length=500
    )

    question_type: Literal[
        "mcq",
        "true_false"
    ]

    options: List[str]

    correct_answer: str

    difficulty: Literal[
        "easy",
        "medium",
        "hard"
    ]

    tags: List[str] = []

    marks: int = Field(
        ...,
        gt=0
    )

    @field_validator("question_text")
    @classmethod
    def validate_question(cls, value):

        if not value.strip():
            raise ValueError(
                "Question cannot be empty"
            )

        return value

    @field_validator("options")
    @classmethod
    def validate_options(cls, value):

        if len(value) < 2:
            raise ValueError(
                "Minimum two options required"
            )

        return value