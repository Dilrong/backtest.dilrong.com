import requests
from fastapi import HTTPException
from app.schemas.valuation_request import ValuationRequest
from typing import Dict

def fetch_coin_data(coin_id: str) -> Dict[str, float]:
    """CoinGecko에서 코인의 실시간 데이터를 가져옵니다."""
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        return {
            "market_cap": data["market_data"]["market_cap"]["usd"],
            "price": data["market_data"]["current_price"]["usd"],
            "circulating_supply": data["market_data"]["circulating_supply"],
            "daily_volume": data["market_data"]["total_volume"]["usd"]
        }
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"CoinGecko API error: {str(e)}")

def fetch_tvl(coin_id: str) -> float:
    """DeFi Llama에서 코인의 TVL을 가져옵니다."""
    url = "https://api.llama.fi/protocols"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        protocol = next((p for p in data if p["chain"].lower() == coin_id), None)
        return protocol["tvl"] if protocol else 0
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"DeFi Llama API error: {str(e)}")

def calculate_nvt(market_cap: float, transaction_volume_usd: float) -> float:
    """NVT 비율을 계산합니다: 시가총액 / 거래량 (USD 기준)."""
    return round(market_cap / transaction_volume_usd, 2) if transaction_volume_usd > 0 else float("inf")

def calculate_fair_price(
    price: float,
    transaction_volume_mnt: float,
    circulating_supply: float,
    burn_daily_mnt: float,
    fees_daily_mnt: float,
    active_wallets: float,
    inflation: float
) -> str:
    """적정 가격 범위를 계산합니다 (MNT 단위 데이터를 USD로 변환)."""
    burn_daily_usd = burn_daily_mnt * price
    fees_daily_usd = fees_daily_mnt * price
    transaction_volume_usd = transaction_volume_mnt * price

    annual_burn_usd = burn_daily_usd * 365
    burn_impact = annual_burn_usd / (price * circulating_supply) if price > 0 else 0
    inflation_rate = inflation / 100 if inflation is not None else 0
    supply_adjustment = 1 - burn_impact + inflation_rate
    adjusted_supply = circulating_supply * supply_adjustment

    volume_boost = 1 + (active_wallets / 1000000 * 0.1) if active_wallets > 0 else 1
    adjusted_volume_usd = transaction_volume_usd * volume_boost

    min_price = (50 * adjusted_volume_usd) / adjusted_supply if adjusted_volume_usd > 0 and adjusted_supply > 0 else price * 0.8
    annual_fees_usd = fees_daily_usd * 365
    max_price = (annual_fees_usd * 100) / circulating_supply if annual_fees_usd > 0 and circulating_supply > 0 else price * 1.2

    return f"{min_price:.4f}-{max_price:.4f}"

def valuate_coin(coin_id: str, static_data: ValuationRequest) -> Dict:
    """코인의 가치평가 데이터를 계산하고 반환합니다."""
    try:
        coin_data = fetch_coin_data(coin_id)
        market_cap = coin_data["market_cap"]
        price = coin_data["price"]
        circulating_supply = coin_data["circulating_supply"]
        daily_volume = coin_data["daily_volume"]
        
        tvl = fetch_tvl(coin_id)
        transaction_volume_mnt = static_data.transaction_volume if static_data.transaction_volume > 0 else daily_volume / price
        nvt = calculate_nvt(market_cap, transaction_volume_mnt * price)
        fair_price_range = calculate_fair_price(
            price,
            transaction_volume_mnt,
            circulating_supply,
            static_data.burn_daily,
            static_data.fees_daily,
            static_data.active_wallets,
            static_data.inflation
        )
        
        # 달러 통화 형식화
        market_cap_str = "${:,.0f}".format(market_cap)  # 천 단위 구분, 소수점 없음
        price_str = "${:.2f}".format(price)  # 소수점 2자리
        tvl_str = "${:,.2f}".format(tvl)  # 천 단위 구분, 소수점 2자리
        
        return {
            "market_cap": market_cap_str,
            "price": price_str,
            "burn_daily": f"{int(static_data.burn_daily * price)}",
            "fees_daily": f"{int(static_data.fees_daily * price * 0.8)}-{int(static_data.fees_daily * price * 1.2)}",
            "active_wallets": f"{int(static_data.active_wallets)}",
            "tvl": tvl_str,
            "inflation": f"{static_data.inflation}",
            "nvt": nvt,
            "fair_price_range": fair_price_range
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error valuating {coin_id}: {str(e)}")