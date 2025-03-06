from app.core.middleware.logging_middleware import LoggingMiddleware
from app.core.middleware.timeout_middleware import TimeoutMiddleware
from app.core.exception.api_exception import (
    internal_error_handler,
    not_found_handler,
    validation_error_handler,
)
from app.controllers import portfolio_controller
from app.controllers import valuation_controller
from app.controllers import check_controller
from app.controllers import probability_controller
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI()

# Controller
app.include_router(check_controller.router)
app.include_router(valuation_controller.router)
app.include_router(portfolio_controller.router)
app.include_router(probability_controller.router)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)
app.add_middleware(TimeoutMiddleware, timeout=60)  # API 타임아웃 60초 설정

# Exception
app.add_exception_handler(404, not_found_handler)
app.add_exception_handler(422, validation_error_handler)
app.add_exception_handler(500, internal_error_handler)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, workers=1)
