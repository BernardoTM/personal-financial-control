from .repositories import DashboardRepository
from .schemes import RequestDashboard
from src.shared.exceptions import AlreadyExists
from datetime import datetime, timedelta
import asyncpg
import logging


class DashboardService:
    @staticmethod
    async def get_consolidated_transacions(
        pool,
        user_id: str,
        start_time: datetime,
        final_time: datetime,
    ):
        start_time = start_time.replace(tzinfo=None)
        final_time = final_time.replace(tzinfo=None)
        try:
            return await DashboardRepository.consolidated_transacions(
                pool, user_id, start_time, final_time
            )
        except Exception as e:
            logging.info(e)

    @staticmethod
    async def get_consolidated_transacions_month(
        pool,
        user_id: str,
    ):

        agora = datetime.now().replace(hour=23, minute=59, second=0, microsecond=0)

        amanha = agora + timedelta(days=1)
        final_time = agora + timedelta(days=1)

        start_time = agora - timedelta(days=365)

        try:
            datas = await DashboardRepository.consolidated_transacions_month(
                pool, user_id, start_time, final_time
            )

        except Exception as e:
            logging.info(e)

        months = [
            {"month": "jan", "expenses": 0, "income": 0},
            {"month": "feb", "expenses": 0, "income": 0},
            {"month": "mar", "expenses": 0, "income": 0},
            {"month": "apr", "expenses": 0, "income": 0},
            {"month": "may", "expenses": 0, "income": 0},
            {"month": "jun", "expenses": 0, "income": 0},
            {"month": "jul", "expenses": 0, "income": 0},
            {"month": "aug", "expenses": 0, "income": 0},
            {"month": "sep", "expenses": 0, "income": 0},
            {"month": "oct", "expenses": 0, "income": 0},
            {"month": "nov", "expenses": 0, "income": 0},
            {"month": "dec", "expenses": 0, "income": 0},
        ]

        for data in datas:
            data = dict(data)
            index = data["month"].month - 1
            months[index]["expenses"] = -(data["expenses"] / 100)
            months[index]["income"] = data["income"] / 100

        for index in range(1, 13 - datetime.now().month):
            item = months.pop()
            months.insert(0, item)
        return months

    @staticmethod
    async def get_consolidated_transacions_categorys(
        pool,
        user_id: str,
        start_time: datetime,
        final_time: datetime,
    ):
        start_time = start_time.replace(tzinfo=None)
        final_time = final_time.replace(tzinfo=None)
        try:
            return await DashboardRepository.consolidated_transacions_categorys(
                pool, user_id, start_time, final_time
            )
        except Exception as e:
            logging.info(e)

    @staticmethod
    async def get_consolidated_budges(
        pool,
        user_id: str,
        start_time: datetime,
        final_time: datetime,
    ):
        start_time = start_time.replace(tzinfo=None)
        final_time = final_time.replace(tzinfo=None)
        try:
            return await DashboardRepository.consolidated_budget(
                pool, user_id, start_time, final_time
            )
        except Exception as e:
            logging.info(e)
