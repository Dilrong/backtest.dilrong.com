import asyncio
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException

from app.core.logger import get_logger

logger = get_logger()


class TimeoutMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, timeout: int):
        super().__init__(app)
        self.timeout = timeout

    async def dispatch(self, request: Request, call_next):
        try:
            return await asyncio.wait_for(call_next(request), timeout=self.timeout)
        except asyncio.TimeoutError:
            endpoint = str(request.url)
            method = request.method

            logger.warning(f"Timeout: {method} {endpoint}")

            return HTTPException(
                status_code=408, detail="Request Timeout: The request took too long."
            )
