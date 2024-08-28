from .schemes import RequestUser
from datetime import datetime


class UserRepository:
    @staticmethod
    async def creat(pool, user: RequestUser):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """
                    INSERT INTO "user" (name, email, hashed_password, birthdate) VALUES($1, $2, $3, $4)
                    """,
                    user.name,
                    user.email,
                    user.password,
                    datetime.now(),
                )

    @staticmethod
    async def update(pool, update_fields: list, values: list):
        async with pool.acquire() as connection:
            async with connection.transaction():
                query = f"""
                UPDATE "user"
                SET {', '.join(update_fields)}
                WHERE id = ${len(update_fields)+1}
                """
                await connection.execute(query, *values)

    @staticmethod
    async def get(pool, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """SELECT * FROM "user" WHERE id = $1""", user_id
                )

    @staticmethod
    async def delete(pool, user_id: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    """DELETE FROM "user" WHERE id = $1""", user_id
                )

    @staticmethod
    async def get_by_email(pool, email: int):
        async with pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchrow(
                    """SELECT id, name, email, hashed_password FROM "user" WHERE email = $1""",
                    email,
                )
