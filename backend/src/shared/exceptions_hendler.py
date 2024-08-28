from fastapi import Request
from fastapi.responses import JSONResponse
from .exceptions import NotFound, BadRequest, AlreadyExists


async def not_fount_exception_handler(request: Request, exc: NotFound):
    return JSONResponse(
        status_code=404, content={"msg": f"Oops {exc.message} not found"}
    )


async def bad_request_exception_handler(request: Request, exc: BadRequest):
    return JSONResponse(status_code=400, content={"msg": exc.message})


async def already_exists_exception_handler(request: Request, exc: AlreadyExists):
    return JSONResponse(
        status_code=400, content={"msg": f"{exc.message} already exists"}
    )


async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"msg": "Error Processing!"})
