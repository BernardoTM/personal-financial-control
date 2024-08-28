from fastapi import APIRouter, Depends, Query
from typing import Annotated, List, Union
from src.database.connection import db
from src.shared.depends import token_verifier
from src.shared.exceptions import BadRequest
from datetime import datetime

from .services import DashboardService


router = APIRouter(
    tags=["Dashboard"],
    prefix="/dashboard",
    responses={404: {"description": "Not found"}},
)


@router.get("/consolidated-transacions")
async def fetch(
    start_time: datetime,
    final_time: datetime,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    data = await DashboardService.get_consolidated_transacions(
        pool=pool,
        user_id=current_user.id,
        start_time=start_time,
        final_time=final_time,
    )

    return dict(data)


@router.get("/consolidated-transacions-month")
async def fetch(
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    return await DashboardService.get_consolidated_transacions_month(
        pool=pool,
        user_id=current_user.id,
    )


@router.get("/consolidated-transacions-categorys")
async def fetch(
    start_time: datetime,
    final_time: datetime,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    datas = await DashboardService.get_consolidated_transacions_categorys(
        pool=pool,
        user_id=current_user.id,
        start_time=start_time,
        final_time=final_time,
    )
    result = []
    for data in datas:
        data = dict(data)
        data["expenses"] = -data["expenses"]
        result.append(data)

    return result


@router.get("/consolidated-budges")
async def fetch(
    start_time: datetime,
    final_time: datetime,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    data = await DashboardService.get_consolidated_budges(
        pool=pool,
        user_id=current_user.id,
        start_time=start_time,
        final_time=final_time,
    )
    return dict(data)
