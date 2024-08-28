from .repositories import AccountRepository
from .schemes import RequestAccount, RequestUpdateAccount
from src.shared.exceptions import AlreadyExists, BadRequest
import asyncpg
import logging


class AccountService:
    @staticmethod
    async def creat(pool, account: RequestAccount, user_id: int):
        if await AccountRepository.get_by_name(pool, account.name, user_id):
            raise AlreadyExists("Name")
        try:

            await AccountRepository.creat(pool, account, user_id)

        except Exception as e:
            logging.info(e)

    @staticmethod
    async def update(pool, account: RequestUpdateAccount, user_id: int):

        update_fields = []
        values = []
        index = 1
        if account.name is not None:
            update_fields.append(f"name = ${index}")
            values.append(account.name)
            index += 1

        if account.description is not None:
            update_fields.append(f"description = ${index}")
            values.append(account.description)
            index += 1

        if account.opening_balance is not None:
            update_fields.append(f"opening_balance = ${index}")
            values.append(account.opening_balance)
            index += 1

        values.append(account.id)
        values.append(user_id)
        try:
            await AccountRepository.update(pool, update_fields, values)

        except asyncpg.IntegrityConstraintViolationError as e:
            if e.constraint_name == "account_name_key":
                raise AlreadyExists("Name")
        except Exception as e:
            logging.info(e)

    @staticmethod
    async def get(pool, account_id: int, user_id: str):
        try:
            return await AccountRepository.get(pool, account_id, user_id)
        except Exception as e:
            logging.info(e)

    @staticmethod
    async def fetch(pool, user_id: str, search: str):
        try:
            return await AccountRepository.fetch(pool, user_id, search)
        except Exception as e:
            logging.info(e)

    @staticmethod
    async def delete(pool, account_id: int, user_id: int):
        try:
            await AccountRepository.delete(pool, account_id, user_id)
        except asyncpg.IntegrityConstraintViolationError as e:
            logging.info(e)
            if e.constraint_name == "transaction_account_id_fkey":
                raise BadRequest(
                    "Cannot delete because there are associated transactions"
                )
        except Exception as e:
            logging.info(e)
