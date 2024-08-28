import asyncpg
import os

DATABASE = os.environ["DATABASE"]
USER = os.environ["USER"]
HOST = os.environ["HOST"]
PASSWORD = os.environ["PASSWORD"]


class Database:
    def __init__(self):
        self.pool = None

    async def init_db(self):
        """Initialize a connection pool."""
        self.pool = await asyncpg.create_pool(
            database=DATABASE,
            user=USER,
            host=HOST,
            password=PASSWORD,
            min_size=50,
            max_size=50,
        )

    async def close(self):
        await self.pool.close()

    async def get_connetion(self):
        return self.pool


db = Database()
