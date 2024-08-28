from .repositories import MonthlyBudgetRepository
from .schemes import RequestBudget, RequestUpdateBudget
from src.shared.exceptions import AlreadyExists, BadRequest
from datetime import datetime
import asyncpg
import logging


class BudgetService:
    @staticmethod
    async def creat(pool, budget: RequestBudget, user_id: int):
        try:
            await MonthlyBudgetRepository.creat(pool, budget, user_id)
        except asyncpg.exceptions.PostgresError as e:
            if str(e) == "Budget already exists":
                raise AlreadyExists("Budget")
        except Exception as e:
            print(e)
            pass

    @staticmethod
    async def update(pool, budget: RequestUpdateBudget, user_id: int):

        update_fields = []
        values = []
        index = 1
        if budget.transaction_category_id is not None:
            update_fields.append(f"transaction_category_id = ${index}")
            values.append(budget.transaction_category_id)
            index += 1

        if budget.value is not None:
            update_fields.append(f"value  = ${index}")
            values.append(budget.value)
            index += 1

        if budget.start_at is not None:
            update_fields.append(f"start_at = ${index}")
            values.append(budget.start_at.date())
            index += 1

        if budget.duration_in_months is not None:
            update_fields.append(f"duration = ${index}")
            values.append(budget.duration_in_months)
            index += 1

        values.append(budget.id)
        values.append(user_id)
        try:
            await MonthlyBudgetRepository.update(pool, update_fields, values)
        except Exception as e:
            pass

    @staticmethod
    async def get(pool, budget_id: int, user_id: str):
        try:
            return await MonthlyBudgetRepository.get(pool, budget_id, user_id)
        except Exception as e:
            pass

    @staticmethod
    async def fetch(
        pool,
        user_id: str,
        search: str,
        start_time: datetime,
        final_time: datetime,
    ):
        start_time = start_time.replace(tzinfo=None)
        final_time = final_time.replace(tzinfo=None)
        try:
            return await MonthlyBudgetRepository.fetch(
                pool, user_id, search, start_time, final_time
            )
        except Exception as e:
            pass

    @staticmethod
    async def delete(pool, budget_id: int, user_id: int):
        try:
            await MonthlyBudgetRepository.delete(pool, budget_id, user_id)
        except Exception as e:
            logging.info(e)
