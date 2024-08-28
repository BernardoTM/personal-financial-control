from fastapi import APIRouter, Depends
from src.database.connection import db
from src.shared.depends import token_verifier
from src.shared.exceptions import BadRequest

from .schemes import RequestAccount, RequestUpdateAccount, ResponseAccount
from .services import AccountService


router = APIRouter(
    tags=["Account"],
    prefix="/account",
    responses={404: {"description": "Not found"}},
)


@router.post("", status_code=201)
async def create(
    account: RequestAccount,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await AccountService.creat(pool=pool, account=account, user_id=current_user.id)
    return {"foi": "uuuuuuuuu"}


@router.get("/all", response_model=list[ResponseAccount])
async def fetch(
    search: str | None = "",
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    accounts = await AccountService.fetch(
        pool=pool, user_id=current_user.id, search=search
    )
    result = []
    for account in accounts:
        result.append(dict(account))
    return result


@router.get("/{account_id}", response_model=ResponseAccount)
async def get(
    account_id: int,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    account = await AccountService.get(
        pool=pool, account_id=account_id, user_id=current_user.id
    )

    if account is None:
        raise BadRequest("Account invalid")

    return dict(account)


@router.put("")
async def update(
    account: RequestUpdateAccount,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await AccountService.update(pool=pool, account=account, user_id=current_user.id)


@router.delete("/{account_id}", status_code=204)
async def delete(
    account_id: int,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await AccountService.delete(
        pool=pool, account_id=account_id, user_id=current_user.id
    )
