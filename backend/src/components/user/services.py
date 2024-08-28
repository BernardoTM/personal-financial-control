from .repositories import UserRepository
from .schemes import RequestUser, RequestUpdateUser
from src.shared.exceptions import AlreadyExists
from passlib.context import CryptContext
import asyncpg


class UserService:
    @staticmethod
    async def creat(pool, user: RequestUser):
        crypt_context = CryptContext(schemes=["sha256_crypt"])
        new_user = RequestUser(
            name=user.name,
            email=user.email,
            password=crypt_context.hash(user.password),
        )
        try:
            await UserRepository.creat(pool, new_user)
        except asyncpg.IntegrityConstraintViolationError as e:
            if e.constraint_name == "user_email_key":
                raise AlreadyExists("Email")

    @staticmethod
    async def update(pool, user: RequestUpdateUser, user_id: int):
        crypt_context = CryptContext(schemes=["sha256_crypt"])

        update_fields = []
        values = []
        index = 1
        if user.name is not None:
            update_fields.append(f"name = ${index}")
            values.append(user.name)
            index += 1

        values.append(user_id)
        try:
            await UserRepository.update(pool, update_fields, values)
        except Exception as e:
            pass

    @staticmethod
    async def get(pool, user_id: str):
        try:
            return await UserRepository.get(pool, user_id)
        except Exception as e:
            pass

    @staticmethod
    async def delete(pool, user_id: str):
        try:
            await UserRepository.delete(pool, user_id)
        except Exception as e:
            pass
