from pydantic import BaseModel

class ValuationRequest(BaseModel):
    burn_daily: float = 0.0  # 일일 소각 금액 (코인 단위)
    fees_daily: float = 0.0  # 일일 수수료 (코인 단위)
    active_wallets: float = 0.0  # 일일 활성 지갑 수 (단일 값)
    inflation: float = 0.0  # 연간 인플레이션율 (단일 값, 퍼센트 단위)
    transaction_volume: float = 0.0  # 일일 온체인 거래량 (코인 단위)