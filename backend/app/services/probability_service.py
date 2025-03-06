import ccxt
import pandas as pd
import numpy as np
from datetime import datetime
from fastapi import HTTPException
from scipy import stats

exchange = ccxt.binance({'enableRateLimit': True})

def fetch_data(symbol: str, timeframe: str, start_date: str, end_date: str) -> pd.Series:
    since = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp() * 1000)
    try:
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe, since, limit=2000)
        if not ohlcv:
            raise HTTPException(status_code=400, detail=f"No data available for {symbol}")

        df = pd.DataFrame(ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"])
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)
        df = df[(df.index >= start_date) & (df.index <= end_date)]
        if df.empty:
            raise HTTPException(status_code=400, detail=f"No data in range for {symbol}")
        return df["close"]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching {symbol}: {str(e)}")

def calculate_probability(symbol: str, timeframe: str, start_date: str, end_date: str, initial_balance: float, target_return: float) -> dict:
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    if start >= end:
        raise ValueError("Start date must be before end date")

    prices = fetch_data(symbol, timeframe, start_date, end_date)
    daily_returns = prices.pct_change().dropna()
    expected_return = np.mean(daily_returns) * 365
    standard_deviation = np.std(daily_returns) * np.sqrt(365)
    z_score = (target_return - expected_return) / standard_deviation
    probability = 1 - stats.norm.cdf(z_score)

    value = initial_balance
    value_history = [initial_balance]
    for ret in daily_returns[1:]:
        value *= (1 + ret)
        value_history.append(value)
    value_history_dict = {dt.strftime("%Y-%m-%d"): val for dt, val in zip(prices.index, value_history)}

    return {
        "symbol": symbol,
        "timeframe": timeframe,
        "start_date": start_date,
        "end_date": end_date,
        "initial_balance": initial_balance,
        "expected_return": float(expected_return),
        "standard_deviation": float(standard_deviation),
        "target_return": target_return,
        "z_score": float(z_score),
        "probability": float(probability),
        "daily_returns": daily_returns.tolist(),
        "value_history": value_history_dict
    }