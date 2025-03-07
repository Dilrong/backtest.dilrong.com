import pandas as pd
import numpy as np
from datetime import datetime
import ccxt

exchange = ccxt.binance()

def fetch_data(symbol: str, timeframe: str, start_date: str, end_date: str) -> pd.DataFrame:
    since = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp() * 1000)
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe, since, limit=2000)
    if not ohlcv:
        raise ValueError(f"No data for {symbol}")
    
    df = pd.DataFrame(ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"])
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
    df.set_index("timestamp", inplace=True)
    df = df[(df.index >= start_date) & (df.index <= end_date)]
    if df.empty:
        raise ValueError(f"Empty data for {symbol}")
    return df

def calculate_monte_carlo_stats(symbol: str, timeframe: str, start_date: str, end_date: str):
    df = fetch_data(symbol, timeframe, start_date, end_date)
    
    df["returns"] = df["close"].pct_change().fillna(0)
    daily_mean = df["returns"].mean()
    daily_std = df["returns"].std()
    current_price = df["close"].iloc[-1]
    
    return {
        "daily_mean": daily_mean,
        "daily_std": daily_std,
        "current_price": current_price
    }

def monte_carlo_simulation(initial_price: float, daily_mean: float, daily_std: float, target_return: float, days: int = 30, simulations: int = 1000):
    final_prices = []
    for _ in range(simulations):
        price = initial_price
        for _ in range(days):
            daily_return = np.random.normal(daily_mean, daily_std)
            price *= (1 + daily_return)
        final_prices.append(price)
    
    final_prices = np.array(final_prices)
    predicted_price = np.mean(final_prices)
    target_price = initial_price * (1 + target_return)
    probability_above_target = np.mean(final_prices >= target_price)
    min_price = np.min(final_prices)
    max_price = np.max(final_prices)
    
    return {
        "predicted_price": round(predicted_price, 2),
        "probability_above_target": round(probability_above_target * 100, 2),
        "min_price": round(min_price, 2),
        "max_price": round(max_price, 2)
    }

def calculate_monte_carlo(symbol: str, timeframe: str, start_date: str, end_date: str, target_return: float, days: int = 30, simulations: int = 500) -> dict:
    stats = calculate_monte_carlo_stats(symbol, timeframe, start_date, end_date)
    
    monte_carlo_result = monte_carlo_simulation(
        initial_price=stats["current_price"],
        daily_mean=stats["daily_mean"],
        daily_std=stats["daily_std"],
        target_return=target_return,
        days=days,
        simulations=simulations
    )
    
    return {
        "symbol": symbol,
        "predicted_price": monte_carlo_result["predicted_price"],
        "probability_above_target": monte_carlo_result["probability_above_target"],
        "min_price": monte_carlo_result["min_price"],
        "max_price": monte_carlo_result["max_price"]
    }