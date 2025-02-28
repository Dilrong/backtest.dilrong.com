from app.schemas.api_response import APIResponse
from app.services.valuation_service import valuate_coin
from app.schemas.valuation_request import ValuationRequest
from fastapi import APIRouter

router = APIRouter(prefix="/valuation")

@router.post("/{coin_id}")
async def run_valuation_coin(coin_id: str, request: ValuationRequest):
    data = valuate_coin(coin_id, request)

    return APIResponse(
        success=True, message="valuation done", data=data
    )