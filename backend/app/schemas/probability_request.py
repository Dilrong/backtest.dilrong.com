from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class BacktestProbabilityRequest(BaseModel):
    symbol: str = Field(..., description="Coin symbol (e.g., BTC/USDT)")
    timeframe: str = Field(..., pattern=r"^(1m|5m|15m|1h|4h|1d|1w|1M)$", description="Valid ccxt timeframe")
    start_date: str
    end_date: str
    initial_balance: float = Field(..., gt=0, description="Initial balance must be greater than zero")
    target_return: float = Field(..., description="Target return to calculate probability for (e.g., 0.05 for 5%)")

    @field_validator("start_date", "end_date")
    def validate_date_format(cls, value):
        try:
            datetime.strptime(value, "%Y-%m-%d")
            return value
        except ValueError:
            raise ValueError(f"Invalid date format: {value}. Expected YYYY-MM-DD.")

class BacktestProbabilityResponse(BaseModel):
    symbol: str
    timeframe: str
    start_date: str
    end_date: str
    initial_balance: float
    expected_return: float
    standard_deviation: float
    target_return: float
    z_score: float
    probability: float
    daily_returns: list[float]
    value_history: dict[str, float]