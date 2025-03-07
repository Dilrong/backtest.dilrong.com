from app.schemas.api_response import APIResponse
from app.schemas.monte_carlo_request import BacktestMonteCarloRequest
from app.services.monte_carlo_service import calculate_monte_carlo
from fastapi import APIRouter

router = APIRouter(prefix="/backtest")

@router.post("/monte-carlo")
async def get_monte_carlo(request: BacktestMonteCarloRequest):
        data = calculate_monte_carlo(
            symbol=request.symbol,
            timeframe=request.timeframe,
            start_date=request.start_date,
            end_date=request.end_date,
            target_return=request.target_return,
            days=request.days,
            simulations=request.simulations
        )
        return APIResponse(
            success=True,
            message=f"Calculated Monte Carlo Simulation Result for {request.days} days",
            data=data
        )