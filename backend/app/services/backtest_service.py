from typing import Any
import ccxt
import pandas as pd
from datetime import datetime
from fastapi import HTTPException

exchange = ccxt.binance()


def fetch_data(symbols, timeframe, start_date, end_date) -> dict:
    data = {}
    for symbol in symbols:
        try:
            since = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp() * 1000)
            ohlcv = exchange.fetch_ohlcv(symbol, timeframe, since, limit=2000)

            if not ohlcv:
                print(f"No data returned for {symbol}")
                continue

            df = pd.DataFrame(
                ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"]
            )
            df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
            df.set_index("timestamp", inplace=True)

            df = df[(df.index >= start_date) & (df.index <= end_date)]

            if df.empty:
                print(f"Data for {symbol} is empty after filtering")
                continue

            data[symbol] = df

        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error fetching {symbol}: {str(e)}"
            )

    return data


def calculate_portfolio_backtest(
    symbols, weights, initial_balance, start_date, end_date, rebalance_period="ME"
) -> dict:
    data = fetch_data(symbols, "1M", start_date, end_date)

    portfolio_df = pd.DataFrame(
        index=pd.date_range(start=start_date, end=end_date, freq="ME")
    )

    for symbol in symbols:
        if symbol not in data or data[symbol].empty:
            continue

        df = data[symbol].copy()

        if df["close"].nunique() <= 1:
            continue

        df[f"{symbol}_return"] = df["close"].pct_change().ffill()

        df = df.reindex(portfolio_df.index, method="ffill")

        portfolio_df = portfolio_df.join(df[f"{symbol}_return"], how="left")

    portfolio_df.fillna(0, inplace=True)

    portfolio_df["Portfolio_Return"] = sum(
        portfolio_df[f"{symbol}_return"] * weights.get(symbol, 0)
        for symbol in symbols
        if f"{symbol}_return" in portfolio_df
    )

    portfolio_df["Portfolio_Value"] = initial_balance

    for i in range(1, len(portfolio_df)):
        prev_value = portfolio_df.iloc[i - 1]["Portfolio_Value"]
        daily_return = portfolio_df.iloc[i]["Portfolio_Return"]

        if pd.isna(daily_return):
            daily_return = 0

        portfolio_df.loc[portfolio_df.index[i], "Portfolio_Value"] = prev_value * (
            1 + daily_return
        )

    peak = portfolio_df["Portfolio_Value"].cummax()
    mdd = ((portfolio_df["Portfolio_Value"] - peak) / peak).min() * 100

    start_value = initial_balance
    end_value = portfolio_df["Portfolio_Value"].iloc[-1]
    roi = ((end_value - start_value) / start_value) * 100

    num_years = (portfolio_df.index[-1] - portfolio_df.index[0]).days / 365.0
    cagr = ((end_value / start_value) ** (1 / num_years)) - 1 if num_years > 0 else 0

    monthly_values = portfolio_df["Portfolio_Value"].resample("ME").last()
    monthly_returns = monthly_values.pct_change().dropna().to_dict()

    portfolio_value_history = {
        k.strftime("%Y-%m-%d"): v for k, v in portfolio_df["Portfolio_Value"].items()
    }

    return {
        "initial_balance": initial_balance,
        "final_balance": round(end_value, 2),
        "roi": f"{roi:.2f}%",
        "mdd": round(mdd, 2),
        "cagr": f"{cagr * 100:.2f}%",
        "monthly_returns": {
            k.strftime("%Y-%m"): f"{v * 100:.2f}%" for k, v in monthly_returns.items()
        },
        "portfolio_value_history": portfolio_value_history,
    }


def calculate_strategy_backtest():
    return {}
