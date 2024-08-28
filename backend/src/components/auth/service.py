import logging
from fastapi import HTTPException, status
from src.components.user.repositories import UserRepository
from .schema import Login, User

from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt
from jwt import PyJWTError


from src.shared.exceptions import BadRequest
import os

# from dotenv import load_dotenv

# load_dotenv()
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["ALGORITHM"]


class AuthService:
    @staticmethod
    async def login(pool, user: Login) -> dict:
        user_db = await UserRepository.get_by_email(pool, email=user.email)
        crypt_context = CryptContext(schemes=["sha256_crypt"])

        if not user_db or not crypt_context.verify(
            user.password, user_db["hashed_password"]
        ):
            raise BadRequest("Email or password is incorrect")

        exp = datetime.now(timezone.utc) + timedelta(days=7)
        refresh_exp = datetime.now(timezone.utc) + timedelta(days=7)

        payload = {
            "sub": user_db["email"],
            "exp": exp,
        }

        refresh_payload = {
            "sub": user_db["email"],
            "exp": refresh_exp,
        }

        access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    @staticmethod
    async def refresh(email: str) -> dict:
        exp = datetime.now(timezone.utc) + timedelta(minutes=30)
        refresh_exp = datetime.now(timezone.utc) + timedelta(days=7)

        payload = {
            "sub": email,
            "exp": exp,
        }

        refresh_payload = {
            "sub": email,
            "exp": refresh_exp,
        }

        access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    @staticmethod
    async def verify_refresh_token(pool, refresh_token) -> User:
        try:
            data = jwt.decode(jwt=refresh_token, key=SECRET_KEY, algorithms=[ALGORITHM])
        except PyJWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        try:
            user_db = await UserRepository.get_by_email(pool=pool, email=data["sub"])
        except Exception as e:
            logging.error("error in method login: %s", str(e))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error Processing!",
            )

        if user_db is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        return User(id=user_db["id"], email=user_db["email"], name=user_db["name"])

    @staticmethod
    async def verify_token(pool, access_token) -> User:
        try:
            data = jwt.decode(jwt=access_token, key=SECRET_KEY, algorithms=[ALGORITHM])
        except PyJWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid access token",
            )

        try:
            user_db = await UserRepository.get_by_email(pool=pool, email=data["sub"])
        except Exception as e:
            logging.error("error in method login: %s", str(e))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error Processing!",
            )

        if user_db is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid access token",
            )

        return User(id=user_db["id"], email=user_db["email"], name=user_db["name"])
