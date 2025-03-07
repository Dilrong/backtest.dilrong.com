from pydantic import BaseModel

class BacktestMonteCarloRequest(BaseModel):
    symbol: str = "BTC/USDT"
    timeframe: str = "1d"
    start_date: str
    end_date: str
    target_return: float = 0.10
    days: int = 30
    simulations: int = 1000