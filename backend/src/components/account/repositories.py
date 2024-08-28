from .schemes import RequestAccount


class AccountRepository:
    @staticmethod
    async def creat(pool, account: RequestAccount, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """
                    INSERT INTO "account" (user_id, name, description, opening_balance, balance) VALUES($1, $2, $3, $4, $5)
                    """,
                    user_id,
                    account.name,
                    account.description,
                    account.opening_balance,
                    account.opening_balance,
                )

    @staticmethod
    async def update(pool, update_fields: list, values: list):
        async with pool.acquire() as connection:
            async with connection.transaction():
                query = f"""
                UPDATE "account"
                SET {', '.join(update_fields)}
                WHERE id = ${len(update_fields)+1} AND user_id = ${len(update_fields)+2}
                """
                await connection.execute(query, *values)

    @staticmethod
    async def fetch(pool, user_id: int, search: str):
        search = f"%{search}%"
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetch(
                    """ SELECT * FROM "account"
                        WHERE user_id = $1
                            AND (name LIKE $2 OR description LIKE $3)
                        ORDER BY name; """,
                    user_id,
                    search,
                    search,
                )

    @staticmethod
    async def get(pool, account_id: int, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """SELECT * FROM "account" WHERE id = $1 AND user_id = $2""",
                    account_id,
                    user_id,
                )

    @staticmethod
    async def get_by_name(pool, name: str, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """SELECT * FROM "account" WHERE name = $1 AND user_id = $2""",
                    name,
                    user_id,
                )

    @staticmethod
    async def delete(pool, account_id: int, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """DELETE FROM "account" WHERE id = $1 AND user_id = $2""",
                    account_id,
                    user_id,
                )
