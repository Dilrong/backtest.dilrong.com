import ccxt
import pandas as pd
from datetime import datetime
from fastapi import HTTPException
from app.core.logger import get_logger

logger = get_logger()

exchange = ccxt.binance()


def fetch_data(symbols, timeframe, start_date, end_date):
    data = {}
    for symbol in symbols:
        try:
            since = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp() * 1000)
            ohlcv = exchange.fetch_ohlcv(symbol, timeframe, since=since, limit=1000)

            df = pd.DataFrame(
                ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"]
            )
            df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
            df.set_index("timestamp", inplace=True)

            df = df[(df.index >= start_date) & (df.index <= end_date)]
            data[symbol] = df
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error fetching {symbol}: {str(e)}"
            )

    return data


def calculate_backtest(
    symbols, weights, initial_balance, start_date, end_date, rebalance_period="1M"
):
    data = fetch_data(symbols, "1d", start_date, end_date)

    portfolio_df = pd.DataFrame(index=pd.date_range(start_date, end_date, freq="D"))

    for symbol in symbols:
        df = data[symbol].copy()
        df[f"{symbol}_return"] = df["close"].pct_change()
        portfolio_df = portfolio_df.join(df[f"{symbol}_return"], how="left")

    portfolio_df.fillna(0, inplace=True)
    portfolio_df["Portfolio_Return"] = sum(
        portfolio_df[f"{symbol}_return"] * weights[symbol] for symbol in symbols
    )

    portfolio_df["Portfolio_Value"] = initial_balance
    rebalance_dates = portfolio_df.resample(rebalance_period).first().index

    for i in range(1, len(portfolio_df)):
        date = portfolio_df.index[i]
        daily_return = portfolio_df.iloc[i]["Portfolio_Return"]

        if date in rebalance_dates:
            current_prices = {
                symbol: data[symbol]["close"]
                .reindex(portfolio_df.index)
                .ffill()
                .loc[date]
                for symbol in symbols
            }
            total_value = sum(
                current_prices[symbol] * weights[symbol] for symbol in symbols
            )
            for symbol in symbols:
                weights[symbol] = (
                    current_prices[symbol] * weights[symbol]
                ) / total_value

        portfolio_df.loc[date, "Portfolio_Value"] = portfolio_df.iloc[i - 1][
            "Portfolio_Value"
        ] * (1 + daily_return)

    peak = portfolio_df["Portfolio_Value"].cummax()
    mdd = ((portfolio_df["Portfolio_Value"] - peak) / peak).min() * 100

    start_value = initial_balance
    end_value = portfolio_df["Portfolio_Value"].iloc[-1]
    num_years = (portfolio_df.index[-1] - portfolio_df.index[0]).days / 365.0
    cagr = (
        ((end_value / start_value) ** (1 / num_years)) - 1 if num_years > 0 else "N/A"
    )

    monthly_values = portfolio_df["Portfolio_Value"].resample("M").last()
    monthly_returns = monthly_values.pct_change().dropna().to_dict()

    portfolio_value_history = {
        k.strftime("%Y-%m-%d"): v for k, v in portfolio_df["Portfolio_Value"].items()
    }

    return {
        "initial_balance": initial_balance,
        "final_balance": end_value,
        "mdd": round(mdd, 2),
        "cagr": f"{cagr * 100:.2f}%" if cagr != "N/A" else "N/A",
        "monthly_returns": {
            k.strftime("%Y-%m"): f"{v * 100:.2f}%" for k, v in monthly_returns.items()
        },
        "portfolio_value_history": portfolio_value_history,  # 🟢 추가된 데이터
    }
