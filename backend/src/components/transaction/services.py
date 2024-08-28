import asyncpg

from .repositories import TransactionRepository
from .schemes import RequestTransaction, RequestUpdateTransaction, Order
from src.shared.exceptions import AlreadyExists, BadRequest
from datetime import datetime
import logging


class TransactionService:
    @staticmethod
    async def creat(pool, transaction: RequestTransaction, user_id: int):
        try:

            await TransactionRepository.creat(pool, transaction, user_id)

        except asyncpg.IntegrityConstraintViolationError as e:
            print("1" + str(e))
            if e.constraint_name == "transaction_account_id_fkey":
                raise BadRequest("Account id does not exist")
            if e.constraint_name == "transaction_transaction_category_id_fkey":
                raise BadRequest("Transaction category id does not exist")
        except asyncpg.exceptions.PostgresError as e:
            if str(e) == "Account does not belong to the user":
                raise BadRequest("Account id does not exist")
            if str(e) == "Transaction category does not belong to the user":
                raise BadRequest("Transaction category id does not exist")
        except Exception as e:
            logging.info("foii")
            logging.info(e)
            pass

    @staticmethod
    async def update(pool, transaction: RequestUpdateTransaction, user_id: int):

        update_fields = []
        values = []
        index = 1
        if transaction.value is not None:
            update_fields.append(f"value = ${index}")
            values.append(transaction.value)
            index += 1

        if transaction.description is not None:
            update_fields.append(f"description = ${index}")
            values.append(transaction.description)
            index += 1

        if transaction.account_id is not None:
            update_fields.append(f"account_id = ${index}")
            values.append(transaction.account_id)
            index += 1

        if transaction.transaction_category_id is not None:
            update_fields.append(f"transaction_category_id = ${index}")
            values.append(transaction.transaction_category_id)
            index += 1

        if transaction.created_at is not None:
            update_fields.append(f"created_at = ${index}")
            values.append(transaction.created_at.replace(tzinfo=None))
            index += 1

        values.append(transaction.id)
        values.append(user_id)
        logging.info("testet")
        try:
            await TransactionRepository.update(pool, update_fields, values)
        except asyncpg.IntegrityConstraintViolationError as e:
            if e.constraint_name == "transaction_account_id_fkey":
                raise BadRequest("Account id does not exist")
            if e.constraint_name == "transaction_transaction_category_id_fkey":
                raise BadRequest("Transaction category id does not exist")
        except asyncpg.exceptions.PostgresError as e:
            if str(e) == "Account does not belong to the user":
                raise BadRequest("Account id does not exist")
            if str(e) == "Transaction category does not belong to the user":
                raise BadRequest("Transaction category id does not exist")
        except Exception as e:
            logging.info(e)
            pass

    @staticmethod
    async def get(pool, transaction_id: int, user_id: str):
        try:
            return await TransactionRepository.get(pool, transaction_id, user_id)
        except Exception as e:
            pass

    @staticmethod
    async def fetch(
        pool,
        user_id: str,
        page: int,
        limit: int,
        search: str,
        start_time: datetime,
        final_time: datetime,
        order: Order,
        account_id: int,
        transaction_category_id: int,
    ):
        filter = ""

        if account_id:
            elementos_str = [str(elem) for elem in account_id]
            resultado_str = "(" + ", ".join(elementos_str) + ")"
            filter += f" AND account_id IN {resultado_str}"

        if transaction_category_id:
            elementos_str = [str(elem) for elem in transaction_category_id]
            resultado_str = "(" + ", ".join(elementos_str) + ")"
            filter += f" AND transaction_category_id IN {resultado_str}"

        start_time = start_time.replace(tzinfo=None)
        final_time = final_time.replace(tzinfo=None)

        try:
            return await TransactionRepository.fetch(
                pool,
                user_id,
                search,
                page,
                limit,
                start_time,
                final_time,
                order,
                filter,
            )
        except Exception as e:
            pass

    @staticmethod
    async def count_transactions(
        pool,
        user_id: str,
        search: str,
        start_time: datetime,
        final_time: datetime,
        account_id: int,
        transaction_category_id: int,
    ):
        filter = ""

        if account_id:
            elementos_str = [str(elem) for elem in account_id]
            resultado_str = "(" + ", ".join(elementos_str) + ")"
            filter += f" AND account_id IN {resultado_str}"

        if transaction_category_id:
            elementos_str = [str(elem) for elem in transaction_category_id]
            resultado_str = "(" + ", ".join(elementos_str) + ")"
            filter += f" AND transaction_category_id IN {resultado_str}"

        start_time = start_time.replace(tzinfo=None)
        final_time = final_time.replace(tzinfo=None)
        try:
            return await TransactionRepository.count_transactions(
                pool,
                user_id,
                search,
                start_time,
                final_time,
                filter,
            )
        except Exception as e:
            pass

    @staticmethod
    async def delete(pool, transaction_id: int, user_id: int):
        try:
            await TransactionRepository.delete(pool, transaction_id, user_id)
        except Exception as e:
            pass
