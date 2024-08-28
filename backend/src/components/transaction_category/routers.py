from fastapi import APIRouter, Depends
from src.database.connection import db
from src.shared.depends import token_verifier
from src.shared.exceptions import BadRequest

from .services import TCategoryService
from .schemes import RequestTCategory, RequestUpdateTCategory, ResponseTCategory

router = APIRouter(
    tags=["Transaction Category"],
    prefix="/transaction-category",
    responses={404: {"description": "Not found"}},
)


@router.post("", status_code=201)
async def create(
    transaction_category: RequestTCategory,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await TCategoryService.creat(
        pool=pool, transaction_category=transaction_category, user_id=current_user.id
    )
    return {"foi": "uuuuuuuuu"}


@router.get("/all")
async def fetch(
    search: str | None = "",
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    transaction_categorys = await TCategoryService.fetch(
        pool=pool, user_id=current_user.id, search=search
    )
    result = []
    for transaction_category in transaction_categorys:
        result.append(dict(transaction_category))
    return result


@router.get("/{transaction_category_id}")
async def get(
    transaction_category_id: int,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    transaction_category = await TCategoryService.get(
        pool=pool,
        transaction_category_id=transaction_category_id,
        user_id=current_user.id,
    )
    if transaction_category is None:
        raise BadRequest("Transaction category invalid")

    return dict(transaction_category)


@router.put("")
async def update(
    transaction_category: RequestUpdateTCategory,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await TCategoryService.update(
        pool=pool, transaction_category=transaction_category, user_id=current_user.id
    )


@router.delete("/{transaction_category_id}", status_code=204)
async def delete(
    transaction_category_id: int,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await TCategoryService.delete(
        pool=pool,
        transaction_category_id=transaction_category_id,
        user_id=current_user.id,
    )
