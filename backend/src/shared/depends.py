from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from src.database.connection import db


from src.components.auth.service import AuthService

oauth_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login-form")


async def token_verifier(token=Depends(oauth_scheme), pool=Depends(db.get_connetion)):
    return await AuthService.verify_token(pool=pool, access_token=token)


async def refresh_token_verifier(
    token=Depends(oauth_scheme), pool=Depends(db.get_connetion)
):
    return await AuthService.verify_refresh_token(pool=pool, refresh_token=token)
