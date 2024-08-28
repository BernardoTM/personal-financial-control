import logging.config
from fastapi import FastAPI, Path, Query, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging

from src.database.connection import db
from src.database.create_tables import create_tables, create_trigger_sql

from src.shared.exceptions_hendler import (
    already_exists_exception_handler,
    bad_request_exception_handler,
    not_fount_exception_handler,
    exception_handler,
)

from src.shared.exceptions import BadRequest, NotFound, AlreadyExists


from src.components.auth import routers as auth
from src.components.user import routers as user
from src.components.account import routers as account
from src.components.transaction import routers as transaction
from src.components.transaction_category import routers as transaction_category
from src.components.budget import routers as budget
from src.components.dashboard import routers as dashboard

logging.basicConfig(
    format="%(asctime)s: %(levelname)s: %(message)s", level=logging.INFO
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    await db.init_db()
    await create_tables()
    await create_trigger_sql()
    yield
    # Clean up the ML models and release the resources
    await db.close()


app = FastAPI(
    lifespan=lifespan, title="Titulo da api", version="0.0.1", description="descição"
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(account.router)
app.include_router(transaction.router)
app.include_router(dashboard.router)
app.include_router(budget.router)
app.include_router(transaction_category.router)

app.add_exception_handler(AlreadyExists, already_exists_exception_handler)
app.add_exception_handler(BadRequest, bad_request_exception_handler)
app.add_exception_handler(NotFound, not_fount_exception_handler)
app.add_exception_handler(Exception, exception_handler)


# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info", reload=True)

# gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
