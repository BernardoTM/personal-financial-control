from fastapi import APIRouter, Depends, Query, Path
from src.database.connection import db
from src.shared.depends import token_verifier
from src.shared.exceptions import BadRequest
from typing import Annotated, List, Union
from datetime import datetime

from .schemes import RequestTransaction, RequestUpdateTransaction, Order
from .services import TransactionService


router = APIRouter(
    tags=["Transaction"],
    prefix="/transaction",
    responses={404: {"description": "Not found"}},
)


@router.post("", status_code=201)
async def create(
    transaction: RequestTransaction,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await TransactionService.creat(
        pool=pool, transaction=transaction, user_id=current_user.id
    )
    return {"foi": "uuuuuuuuu"}


@router.get("/all")
async def fetch(
    page: Annotated[int, Query(ge=1, le=999)],
    limit: Annotated[int, Query(ge=1, le=100)],
    start_time: datetime,
    final_time: datetime,
    order: Order,
    account_id: Union[List[int], None] = Query(default=None),
    transaction_category_id: Union[List[int], None] = Query(default=None),
    search: Annotated[str, Query(max_length=255)] = "",
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):

    transactions = await TransactionService.fetch(
        pool=pool,
        user_id=current_user.id,
        page=page,
        limit=limit,
        search=search,
        start_time=start_time,
        final_time=final_time,
        account_id=account_id,
        transaction_category_id=transaction_category_id,
        order=order,
    )
    count = await TransactionService.count_transactions(
        pool=pool,
        user_id=current_user.id,
        search=search,
        start_time=start_time,
        final_time=final_time,
        account_id=account_id,
        transaction_category_id=transaction_category_id,
    )
    result = []
    for transaction in transactions:
        result.append(dict(transaction))
    return {"transactions": result, "total": count}


@router.get("/{transaction_id}")
async def get(
    transaction_id: Annotated[int, Path(ge=1, le=99999999)],
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    transaction = await TransactionService.get(
        pool=pool, transaction_id=transaction_id, user_id=current_user.id
    )

    if transaction is None:
        raise BadRequest("Transaction invalid")

    return dict(transaction)


@router.put("")
async def update(
    transaction: RequestUpdateTransaction,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await TransactionService.update(
        pool=pool, transaction=transaction, user_id=current_user.id
    )


@router.delete("/{transaction_id}", status_code=204)
async def delete(
    transaction_id: int,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await TransactionService.delete(
        pool=pool, transaction_id=transaction_id, user_id=current_user.id
    )
