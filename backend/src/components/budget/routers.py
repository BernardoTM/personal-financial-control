from fastapi import APIRouter, Depends, Query
from typing import Annotated, List, Union
from src.database.connection import db
from src.shared.depends import token_verifier
from src.shared.exceptions import BadRequest
from datetime import datetime

from .schemes import RequestBudget, RequestUpdateBudget
from .services import BudgetService


router = APIRouter(
    tags=["Budget"],
    prefix="/budget",
    responses={404: {"description": "Not found"}},
)


@router.post("", status_code=201)
async def create(
    budget: RequestBudget,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await BudgetService.creat(pool=pool, budget=budget, user_id=current_user.id)
    return {"foi": "uuuuuuuuu"}


@router.get("/all")
async def fetch(
    start_time: datetime,
    final_time: datetime,
    search: Annotated[str, Query(max_length=255)] = "",
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    budgets = await BudgetService.fetch(
        pool=pool,
        user_id=current_user.id,
        search=search,
        start_time=start_time,
        final_time=final_time,
    )
    result = []
    for budget in budgets:
        result.append(dict(budget))
    return result


@router.get("/{budget_id}")
async def get(
    budget_id: int,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):

    budget = await BudgetService.get(
        pool=pool, budget_id=budget_id, user_id=current_user.id
    )
    if budget is None:
        raise BadRequest("Invalid id")

    return dict(budget)


@router.put("")
async def update(
    budget: RequestUpdateBudget,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await BudgetService.update(pool=pool, budget=budget, user_id=current_user.id)


@router.delete("/{budget_id}", status_code=204)
async def delete(
    budget_id: int,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await BudgetService.delete(pool=pool, budget_id=budget_id, user_id=current_user.id)
