import re

from pydantic import BaseModel, EmailStr, Field, field_validator


class StudentRegister(BaseModel):
    """
    Schema for Student Registration.
    """

    full_name: str = Field(
        ...,
        min_length=3,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=100
    )

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, value):

        value = value.strip()

        if not value:
            raise ValueError(
                "Full name cannot be empty"
            )

        if not re.fullmatch(
            r"[A-Za-z ]+",
            value
        ):
            raise ValueError(
                "Full name must contain only letters and spaces"
            )

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):

        value = value.strip()

        if not value:
            raise ValueError(
                "Password cannot be empty"
            )

        return value


class UserLogin(BaseModel):
    """
    Schema for Login.
    """

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=100
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):

        value = value.strip()

        if not value:
            raise ValueError(
                "Password cannot be empty"
            )

        return value


class TokenResponse(BaseModel):
    """
    JWT Token Response.
    """

    access_token: str

    token_type: str