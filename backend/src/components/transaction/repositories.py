from .schemes import RequestTransaction, Order
from datetime import datetime


class TransactionRepository:
    @staticmethod
    async def creat(pool, transaction: RequestTransaction, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """
                    INSERT INTO "transaction" (user_id, description, value, account_id, transaction_category_id, created_at) VALUES($1, $2, $3, $4, $5, $6)
                    """,
                    user_id,
                    transaction.description,
                    transaction.value,
                    transaction.account_id,
                    transaction.transaction_category_id,
                    transaction.created_at.replace(tzinfo=None),
                )

    @staticmethod
    async def update(pool, update_fields: list, values: list):
        async with pool.acquire() as connection:
            async with connection.transaction():
                query = f"""
                UPDATE "transaction"
                SET {', '.join(update_fields)}
                WHERE id = ${len(update_fields)+1} AND user_id = ${len(update_fields)+2}
                """
                await connection.execute(query, *values)

    @staticmethod
    async def get(pool, transaction: int, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """SELECT * FROM "transaction" WHERE id = $1 AND user_id = $2""",
                    transaction,
                    user_id,
                )

    @staticmethod
    async def fetch(
        pool,
        user_id: int,
        search: str,
        page: int,
        limit: int,
        start_time: datetime,
        final_time: datetime,
        order: Order,
        filter: str,
    ):
        search = f"%{search}%"
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetch(
                    f"""SELECT t.id, t.description, t.value, t.account_id, t.transaction_category_id,
                                t.created_at, tc.name AS category_name, a.name AS account_name
                        FROM transaction t
                        INNER JOIN transaction_category tc ON t.transaction_category_id = tc.id
                        INNER JOIN account a ON t.account_id = a.id
                        WHERE t.user_id = $1
                            AND t.description LIKE $2
                            AND t.created_at >= $3
                            AND t.created_at <= $4
                            {filter}
                        ORDER BY created_at {order.value}
                        LIMIT $5 OFFSET $6""",
                    user_id,
                    search,
                    start_time,
                    final_time,
                    limit,
                    (page - 1) * limit,
                )

    @staticmethod
    async def count_transactions(
        pool,
        user_id: int,
        search: str,
        start_time: datetime,
        final_time: datetime,
        filter: str,
    ):
        search = f"%{search}%"
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchval(
                    f"""SELECT COUNT(id) FROM "transaction"
                        WHERE user_id = $1
                            AND description LIKE $2
                            AND created_at >= $3
                            AND created_at <= $4
                            {filter}""",
                    user_id,
                    search,
                    start_time,
                    final_time,
                )

    @staticmethod
    async def delete(pool, transaction: int, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """DELETE FROM "transaction" WHERE id = $1 AND user_id = $2""",
                    transaction,
                    user_id,
                )
