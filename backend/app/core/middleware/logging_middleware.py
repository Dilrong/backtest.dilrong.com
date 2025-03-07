from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import time

from app.core.logger import get_logger

logger = get_logger()


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        logger.info(
            f"Request: {request.method} {request.url} - {response.status_code} - {process_time:.2f}s"
        )
        return response
