from fastapi import APIRouter, Depends
from src.database.connection import db
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer

from .schema import Login, ResponseLogin
from .service import AuthService
from src.shared.depends import refresh_token_verifier


OAuth2PasswordBearer(tokenUrl="/auth/login-form")


router = APIRouter(
    tags=["Auth"],
    prefix="/auth",
    responses={404: {"description": "Not found"}},
)


@router.post("/login-form", response_model=ResponseLogin)
async def login_form(
    user_form: OAuth2PasswordRequestForm = Depends(), pool=Depends(db.get_connetion)
):
    user = Login(email=user_form.username, password=user_form.password)
    return await AuthService.login(pool=pool, user=user)


@router.post("/login", response_model=ResponseLogin)
async def login(user: Login, pool=Depends(db.get_connetion)):
    return await AuthService.login(pool=pool, user=user)


@router.get("/refresh")
async def refresh_token(current_user=Depends(refresh_token_verifier)):
    print(current_user)
    return await AuthService.refresh(current_user.email)
