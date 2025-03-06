from app.schemas.portfolio_request import BacktestRequest
from app.services.backtest_service import (
    calculate_portfolio_backtest,
)
from app.schemas.api_response import APIResponse
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
        rebalance=request.rebalance,
        fee_rate=request.fee_rate,
        slippage=request.slippage,
    )

    return APIResponse(
        success=True, message="Calculated Portfolio Backtest Result", data=data
    )