from app.schemas.probability_request import BacktestProbabilityRequest
from app.services.probability_service import calculate_probability
from app.schemas.api_response import APIResponse
from fastapi import APIRouter

router = APIRouter(prefix="/backtest")

@router.post("/probability")
async def get_probability(request: BacktestProbabilityRequest):
    data = calculate_probability(
        symbol=request.symbol,
        timeframe=request.timeframe,
        start_date=request.start_date,
        end_date=request.end_date,
        initial_balance=request.initial_balance,
        target_return=request.target_return
    )
    return APIResponse(success=True, message="Calculated Probability Result", data=data)