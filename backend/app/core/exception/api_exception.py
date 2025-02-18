from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.logger import get_logger

logger = get_logger()


async def not_found_handler(request: Request, exc):
    logger.warning(f"404 Not Found: {request.url}")
    return JSONResponse(status_code=404, content={"error": "Not Found"})


async def internal_error_handler(request: Request, exc):
    logger.error(f"500 Internal Server Error: {request.url} - {exc}")
    return JSONResponse(status_code=500, content={"error": "Internal Server Error"})


async def validation_error_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error: {exc.errors()} on request {request.url}")
    errors = [
        {"field": ".".join(map(str, err["loc"])), "message": err["msg"]}
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation Error",
            "details": errors,
        },
    )
