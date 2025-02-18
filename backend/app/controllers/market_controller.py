from app.services.market_service import get_tiker_list
from app.schemas.response_schema import APIResponse
from fastapi import APIRouter, Query

router = APIRouter(prefix="/market")


@router.get("/tickers")
async def get_tikers(quote: str = Query(None)):
    data = get_tiker_list(quote)
    return APIResponse(success=True, message="Tiker List", data=data)
