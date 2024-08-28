from fastapi import APIRouter, Depends
from src.database.connection import db
from src.shared.depends import token_verifier
from src.shared.exceptions import BadRequest

from .services import UserService
from .schemes import RequestUser, RequestUpdateUser, ResponseUser

router = APIRouter(
    tags=["User"],
    prefix="/user",
    responses={404: {"description": "Not found"}},
)


@router.get("", response_model=ResponseUser)
async def get(current_user=Depends(token_verifier), pool=Depends(db.get_connetion)):
    user = await UserService.get(pool=pool, user_id=current_user.id)
    return dict(user)


@router.post("", status_code=201)
async def create(user: RequestUser, pool=Depends(db.get_connetion)):
    await UserService.creat(pool=pool, user=user)
    return {"foii": "uuuuuuuu"}


@router.put("")
async def update(
    user: RequestUpdateUser,
    current_user=Depends(token_verifier),
    pool=Depends(db.get_connetion),
):
    await UserService.update(pool=pool, user=user, user_id=current_user.id)
    return {"foii": "uuuuuuuu"}


@router.delete("", status_code=204)
async def delete(current_user=Depends(token_verifier), pool=Depends(db.get_connetion)):
    await UserService.delete(pool=pool, user_id=current_user.id)
