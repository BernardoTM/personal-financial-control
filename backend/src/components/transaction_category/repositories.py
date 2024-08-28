from .schemes import RequestTCategory


class TCategoryRepository:
    @staticmethod
    async def creat(pool, transaction_category: RequestTCategory, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """
                    INSERT INTO "transaction_category" (user_id, name, description, color) VALUES($1, $2, $3, $4)
                    """,
                    user_id,
                    transaction_category.name,
                    transaction_category.description,
                    transaction_category.color,
                )

    @staticmethod
    async def update(pool, update_fields: list, values: list):
        async with pool.acquire() as connection:
            async with connection.transaction():
                query = f"""
                UPDATE "transaction_category"
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
                    """ SELECT * FROM "transaction_category" 
                        WHERE user_id = $1
                            AND (name LIKE $2 OR description LIKE $3)
                        ORDER BY name; """,
                    user_id,
                    search,
                    search,
                )

    @staticmethod
    async def get(pool, transaction_category_id: int, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """SELECT * FROM "transaction_category" WHERE id = $1 AND user_id = $2""",
                    transaction_category_id,
                    user_id,
                )
            
    @staticmethod
    async def get_by_name(pool, name: str, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """SELECT * FROM "transaction_category" WHERE name = $1 AND user_id = $2""",
                    name,
                    user_id,
                )

    @staticmethod
    async def delete(pool, transaction_category_id: int, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """DELETE FROM "transaction_category" WHERE id = $1 AND user_id = $2""",
                    transaction_category_id,
                    user_id,
                )
