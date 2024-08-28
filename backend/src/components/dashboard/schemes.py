from pydantic import BaseModel, Field
from datetime import datetime


class RequestDashboard(BaseModel):
    value: int
    transaction_category_id: int
    start_at: datetime
    duration_in_months: int
