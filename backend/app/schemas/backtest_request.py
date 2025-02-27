from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Dict


class BacktestRequest(BaseModel):
    assets: Dict[str, float] = Field(
        ..., min_length=1, description="At least one asset must be provided."
    )
    initial_balance: float = Field(
        ..., gt=0, description="Initial balance must be greater than zero"
    )
    start_date: str
    end_date: str
    rebalance_period: str = Field(
        ...,
        pattern=r"^(D|W|ME|YE)$",
        description="Rebalance period must be D, W, ME, or YE",
    )
    rebalance: bool
    fee_rate: float
    slippage: float

    @field_validator("start_date", "end_date")
    def validate_date_format(cls, value):
        try:
            datetime.strptime(value, "%Y-%m-%d")
            return value
        except ValueError:
            raise ValueError(f"Invalid date format: {value}. Expected YYYY-MM-DD.")

    @field_validator("assets")
    def validate_assets(cls, value):
        if not value:
            raise ValueError("At least one asset must be provided.")
        total_weight = sum(value.values())
        if not (0.99 <= total_weight <= 1.01):
            raise ValueError(
                f"Total asset allocation must sum to 100%, but got {total_weight * 100:.2f}%"
            )
        return value
