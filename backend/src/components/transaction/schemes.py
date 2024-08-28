from enum import Enum
from pydantic import BaseModel, Field
from datetime import date, datetime


class Order(str, Enum):
    desc = "desc"
    asc = "asc"


class RequestTransaction(BaseModel):
    description: str | None = Field(default=None, max_length=255)
    value: int
    account_id: int
    transaction_category_id: int
    created_at: datetime | None = None


class RequestUpdateTransaction(BaseModel):
    id: int
    description: str | None = Field(default=None, max_length=255)
    value: int | None = None
    account_id: int | None = None
    transaction_category_id: int | None = None
    created_at: datetime | None = None


class ResponseTransaction(BaseModel):
    id: int
    description: str
    opening_balance: int
    balance: int
    updated_at: datetime
    created_at: datetime
