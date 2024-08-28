from pydantic import BaseModel, Field
from datetime import date, datetime


class RequestUser(BaseModel):
    name: str = Field(
        max_length=255, pattern=r"([a-z]|[0-9]|@)+$", examples=["João Silva"]
    )
    email: str = Field(max_length=255)
    password: str | None = Field(default=None, max_length=255)


class RequestUpdateUser(BaseModel):
    name: str | None = Field(
        default=None,
        max_length=255,
        pattern=r"([a-z]|[0-9]|@)+$",
        examples=["João Silva"],
    )
    password: str | None = Field(default=None, max_length=255)


class ResponseUser(BaseModel):
    id: int
    name: str
    email: str
    updated_at: datetime
    created_at: datetime
