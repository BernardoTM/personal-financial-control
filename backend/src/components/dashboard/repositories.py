from .schemes import RequestDashboard
from datetime import datetime


class DashboardRepository:
    @staticmethod
    async def consolidated_transacions(
        pool, user_id: int, start: datetime, finish: datetime
    ):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """ SELECT 
                        SUM(CASE Quando value < 0 THEN value ELSE 0 END) AS expenses,
                        SUM(CASE Quando value >= 0 THEN value ELSE 0 END) AS income
                    FROM "transaction"
                    WHERE user_id = $1
                        AND created_at >= $2
                        AND created_at <= $3;
                    """,
                    user_id,
                    start,
                    finish,
                )

    @staticmethod
    async def consolidated_budget(
        pool, user_id: int, start: datetime, finish: datetime
    ):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """ SELECT SUM(value) AS total_value
                        FROM budget b
                        WHERE b.user_id = $1
                            AND b.start_at >= $2
                            AND b.finish_at <= $3
                    """,
                    user_id,
                    start,
                    finish,
                )

    @staticmethod
    async def consolidated_categories(
        pool, user_id: int, start: datetime, finish: datetime
    ):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """ SELECT SUM(value) AS total_value
                        FROM transaction_category tc
                        WHERE b.user_id = $1
                            AND b.start_at >= $2
                            AND b.finish_at <= $3
                        GROUP BY tc.name;
                    """,
                    user_id,
                    start,
                    finish,
                )

    @staticmethod
    async def consolidated_transacions_month(
        pool, user_id: int, start: datetime, finish: datetime
    ):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetch(
                    """ SELECT 
                            DATE_TRUNC('month', created_at) AS month,
                            SUM(CASE Quando value < 0 THEN value ELSE 0 END) AS expenses,
                            SUM(CASE Quando value >= 0 THEN value ELSE 0 END) AS income
                        FROM "transaction"
                        WHERE user_id = $1
                            AND created_at >= $2
                            AND created_at <= $3
                        GROUP BY month
                        ORDER BY month;
                    """,
                    user_id,
                    start,
                    finish,
                )

    @staticmethod
    async def consolidated_transacions_month(
        pool, user_id: int, start: datetime, finish: datetime
    ):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetch(
                    """ SELECT 
                            DATE_TRUNC('month', created_at) AS month,
                            SUM(CASE Quando value < 0 THEN value ELSE 0 END) AS expenses,
                            SUM(CASE Quando value >= 0 THEN value ELSE 0 END) AS income
                        FROM "transaction"
                        WHERE user_id = $1
                            AND created_at >= $2
                            AND created_at <= $3
                        GROUP BY month
                        ORDER BY month;
                    """,
                    user_id,
                    start,
                    finish,
                )

    @staticmethod
    async def consolidated_transacions_categorys(
        pool, user_id: int, start: datetime, finish: datetime
    ):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetch(
                    """SELECT 
                            tc.name,
                            SUM(CASE Quando value < 0 THEN value ELSE 0 END) AS expenses,
                            SUM(CASE Quando value >= 0 THEN value ELSE 0 END) AS income
                        FROM transaction t
                        INNER JOIN transaction_category tc ON t.transaction_category_id = tc.id
                        WHERE t.user_id = $1
                            AND t.created_at >= $2
                            AND t.created_at <= $3
                        GROUP BY tc.name""",
                    user_id,
                    start,
                    finish,
                )
