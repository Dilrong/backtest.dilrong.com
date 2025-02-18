from pydantic import BaseModel
from typing import Dict


class BacktestRequest(BaseModel):
    assets: Dict[str, float]
    initial_balance: float
    start_date: str
    end_date: str
    rebalance_period: str = "1M"
