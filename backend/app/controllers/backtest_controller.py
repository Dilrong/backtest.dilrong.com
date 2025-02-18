from app.schemas.backtest_request import BacktestRequest
from app.services.backtest_service import (
    calculate_portfolio_backtest,
    calculate_strategy_backtest,
)
from app.schemas.response_schema import APIResponse
from fastapi import APIRouter

router = APIRouter(prefix="/backtest")


@router.post("/portfolio")
async def run_portfolio_backtest(request: BacktestRequest):
    data = calculate_portfolio_backtest(
        symbols=list(request.assets.keys()),
        weights=request.assets,
        initial_balance=request.initial_balance,
        start_date=request.start_date,
        end_date=request.end_date,
        rebalance_period=request.rebalance_period,
    )
    return APIResponse(
        success=True, message="Calculate Portfolio Backtest Result", data=data
    )


@router.post("/strategy")
async def run_strategy_backtest():
    data = calculate_strategy_backtest()
    return APIResponse(
        success=True, message="Calculate Strategy Backtest Result", data=data
    )
