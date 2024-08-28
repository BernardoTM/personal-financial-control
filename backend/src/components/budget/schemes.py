from pydantic import BaseModel, Field
from datetime import datetime


class RequestBudget(BaseModel):
    value: int
    transaction_category_id: int
    start_at: datetime
    duration_in_months: int


class RequestUpdateBudget(BaseModel):
    id: int
    value: int | None = None
    transaction_category_id: int | None = None
    start_at: datetime | None = None
    duration_in_months: int | None = None


class ResponseBudget(BaseModel):
    id: int
    description: str
    opening_balance: int
    balance: int
    updated_at: datetime
    created_at: datetime
