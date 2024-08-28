from .schemes import RequestBudget
from datetime import datetime


class MonthlyBudgetRepository:
    @staticmethod
    async def creat(pool, budget: RequestBudget, user_id: int):
        from datetime import timedelta

        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    f"""
                    INSERT INTO "budget" (user_id, transaction_category_id, value, start_at, duration) VALUES($1, $2, $3, $4, '{budget.duration_in_months} months')
                    """,
                    user_id,
                    budget.transaction_category_id,
                    budget.value,
                    budget.start_at.date(),
                )

    @staticmethod
    async def update(pool, update_fields: list, values: list):
        async with pool.acquire() as connection:
            async with connection.transaction():
                query = f"""
                UPDATE "budget"
                SET {', '.join(update_fields)}
                WHERE id = ${len(update_fields)+1} AND user_id = ${len(update_fields)+2}
                """
                await connection.execute(query, *values)

    @staticmethod
    async def get(pool, budget_id: int, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """SELECT * FROM "budget" WHERE id = $1 AND user_id = $2""",
                    budget_id,
                    user_id,
                )

    @staticmethod
    async def fetch(pool, user_id: int, search: str, start: datetime, finish: datetime):
        search = f"%{search}%"
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetch(
                    """SELECT b.id, b.value, b.transaction_category_id, b.start_at, b.finish_at,              
                        b.amount_spent, b.created_at, b.updated_at, tc.name AS category_name
                        FROM budget b 
                        INNER JOIN transaction_category tc ON b.transaction_category_id = tc.id
                        WHERE b.user_id = $1
                            AND tc.name LIKE $2
                            AND b.start_at >= $3
                            AND b.finish_at <= $4
                        ORDER BY category_name""",
                    user_id,
                    search,
                    start,
                    finish,
                )

    @staticmethod
    async def delete(pool, budget: int, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """DELETE FROM "budget" WHERE id = $1 AND user_id = $2""",
                    budget,
                    user_id,
                )
