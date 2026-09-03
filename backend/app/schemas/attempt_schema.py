from pydantic import BaseModel


class AttemptCreate(BaseModel):
    """
    Schema to start a quiz attempt.
    """

    quiz_id: str


class SaveAnswer(BaseModel):
    """
    Schema to save a student's answer.
    """

    question_id: str

    selected_answer: str