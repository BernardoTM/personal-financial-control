from pydantic import BaseModel, Field
from datetime import date, datetime


class RequestTCategory(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=255)
    color: str = Field(max_length=255)


class RequestUpdateTCategory(BaseModel):
    id: int
    name: str | None = Field(
        default=None,
        max_length=255,
    )
    description: str | None = Field(default=None, max_length=255)
    color: str | None = Field(default=None, max_length=255)


class ResponseTCategory(BaseModel):
    id: int
    name: str
    email: str
    birthdate: date
    updated_at: datetime
    created_at: datetime
