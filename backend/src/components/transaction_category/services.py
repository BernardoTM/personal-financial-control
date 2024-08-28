from .repositories import TCategoryRepository
from .schemes import RequestTCategory, RequestUpdateTCategory
from src.shared.exceptions import AlreadyExists, BadRequest
import asyncpg
import logging


class TCategoryService:
    @staticmethod
    async def creat(pool, transaction_category: RequestTCategory, user_id: int):
        if await TCategoryRepository.get_by_name(
            pool, transaction_category.name, user_id
        ):
            raise AlreadyExists("Name")
        try:

            await TCategoryRepository.creat(
                pool,
                transaction_category,
                user_id,
            )

        except Exception as e:
            logging.info(e)

    @staticmethod
    async def update(pool, transaction_category: RequestUpdateTCategory, user_id: int):

        update_fields = []
        values = []
        index = 1
        if transaction_category.name is not None:
            update_fields.append(f"name = ${index}")
            values.append(transaction_category.name)
            index += 1

        if transaction_category.description is not None:
            update_fields.append(f"description = ${index}")
            values.append(transaction_category.description)
            index += 1

        if transaction_category.color is not None:
            update_fields.append(f"color = ${index}")
            values.append(transaction_category.color)
            index += 1

        values.append(transaction_category.id)
        values.append(user_id)
        try:
            await TCategoryRepository.update(pool, update_fields, values)

        except asyncpg.IntegrityConstraintViolationError as e:
            if e.constraint_name == "transaction_category_name_key":
                raise AlreadyExists("Name")
        except Exception as e:
            logging.info(e)

    @staticmethod
    async def get(pool, transaction_category_id: int, user_id: int):
        try:
            return await TCategoryRepository.get(pool, transaction_category_id, user_id)
        except Exception as e:
            logging.info(e)

    @staticmethod
    async def fetch(pool, user_id: str, search: str):
        try:
            return await TCategoryRepository.fetch(pool, user_id, search)
        except Exception as e:
            logging.info(e)

    @staticmethod
    async def delete(pool, transaction_category_id: int, user_id: int):
        try:
            await TCategoryRepository.delete(pool, transaction_category_id, user_id)
        except asyncpg.IntegrityConstraintViolationError as e:
            logging.info(e)
            if e.constraint_name == "transaction_transaction_category_id_fkey":
                raise BadRequest(
                    "Cannot delete because there are associated transactions"
                )
        except Exception as e:
            logging.info(e)
