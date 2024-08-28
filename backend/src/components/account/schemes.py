from pydantic import BaseModel, Field
from datetime import date, datetime


class RequestAccount(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=255)
    opening_balance: int = 0


class RequestUpdateAccount(BaseModel):
    id: int
    name: str = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    opening_balance: int | None = None


class ResponseAccount(BaseModel):
    id: int
    name: str
    description: str | None
    opening_balance: int
    balance: int
    updated_at: datetime
    created_at: datetime
