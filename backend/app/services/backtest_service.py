import pandas as pd
import numpy as np
from datetime import datetime
from fastapi import HTTPException
import ccxt

exchange = ccxt.binance()

VALID_REBALANCE_PERIODS = ["D", "W", "ME", "YE"]

def fetch_data(symbols, timeframe, start_date, end_date) -> dict:
    data = {}
    for symbol in symbols:
        try:
            since = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp() * 1000)
            ohlcv = exchange.fetch_ohlcv(symbol, timeframe, since, limit=2000)

            if not ohlcv:
                continue

            df = pd.DataFrame(
                ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"]
            )
            df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
            df.set_index("timestamp", inplace=True)

            df = df[(df.index >= start_date) & (df.index <= end_date)]
            if df.empty:
                continue

            data[symbol] = df

        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error fetching {symbol}: {str(e)}"
            )

    return data

def get_period_label(date, period):
    if period == "D":
        return date.strftime("%Y-%m-%d")
    elif period == "W":
        return date.strftime("%Y-%W")
    elif period == "ME":
        return date.strftime("%Y-%m")
    elif period == "YE":
        return date.strftime("%Y")
    else:
        raise ValueError("Invalid period")

def calculate_portfolio_backtest(
    symbols,
    weights,
    initial_balance,
    start_date,
    end_date,
    rebalance_period="ME",
    rebalance=True,
    fee_rate=0.001,
    slippage=0.0005,
) -> dict:
    # 날짜 파싱 및 유효성 검사
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    if start >= end:
        raise ValueError("Start date must be before end date")

    if rebalance_period not in VALID_REBALANCE_PERIODS:
        raise ValueError(f"Invalid rebalance period: {rebalance_period}")

    effective_rebalance_period = rebalance_period if rebalance_period != "YE" else "ME"

    # pd.date_range에 사용할 주파수 매핑
    date_range_freq_map = {"D": "D", "W": "W-MON", "ME": "ME"}
    date_range_freq = date_range_freq_map[effective_rebalance_period]
    portfolio_dates = pd.date_range(start=start_date, end=end_date, freq=date_range_freq)
    portfolio_df = pd.DataFrame(index=portfolio_dates)

    # 데이터 가져오기
    timeframe_map = {"D": "1d", "W": "1w", "ME": "1M"}
    timeframe = timeframe_map[effective_rebalance_period]
    data = fetch_data(symbols, timeframe, start_date, end_date)

    # 각 자산의 수익률 계산 및 DataFrame 결합
    for symbol in symbols:
        if symbol not in data or data[symbol].empty:
            continue

        df = data[symbol].copy()
        df[f"{symbol}_return"] = df["close"].pct_change().ffill()
        df = df.reindex(portfolio_df.index, method="ffill")
        portfolio_df = portfolio_df.join(df[f"{symbol}_return"], how="left")

    portfolio_df.fillna(0, inplace=True)

    # 가중치 유효성 검사
    for symbol in symbols:
        if symbol not in weights:
            raise ValueError(f"Weight not provided for symbol: {symbol}")

    # 자산별 초기 가치 할당
    asset_values = {symbol: initial_balance * weights[symbol] for symbol in symbols}
    portfolio_df["Portfolio_Value"] = initial_balance
    portfolio_df["Portfolio_Value"] = portfolio_df["Portfolio_Value"].astype(float)

    # 초기 리밸런싱 기준 설정
    prev_period = get_period_label(portfolio_df.index[0], effective_rebalance_period)

    # 백테스트 진행
    for i in range(1, len(portfolio_df)):
        current_date = portfolio_df.index[i]
        current_period = get_period_label(current_date, effective_rebalance_period)

        # 각 자산의 가치 업데이트
        for symbol in symbols:
            daily_return = portfolio_df.iloc[i][f"{symbol}_return"]
            if pd.isna(daily_return):
                daily_return = 0
            asset_values[symbol] *= 1 + daily_return

        # 리밸런싱
        if rebalance and current_period != prev_period:
            total_value = sum(asset_values.values())
            for symbol in symbols:
                asset_values[symbol] = (total_value * weights[symbol]) * (1 - fee_rate - slippage)
            prev_period = current_period

        portfolio_df.iloc[i, portfolio_df.columns.get_loc("Portfolio_Value")] = float(
            sum(asset_values.values())
        )

    # MDD 계산
    peak = portfolio_df["Portfolio_Value"].cummax()
    mdd = ((portfolio_df["Portfolio_Value"] - peak) / peak).min() * 100

    # ROI 및 CAGR 계산
    start_value = initial_balance
    end_value = portfolio_df["Portfolio_Value"].iloc[-1]
    roi = ((end_value - start_value) / start_value) * 100
    num_years = max((portfolio_df.index[-1] - portfolio_df.index[0]).days / 365.0, 0.01)
    cagr = ((end_value / start_value) ** (1 / num_years)) - 1 if num_years > 0 else 0

    # 포트폴리오 일일 수익률 및 표준편차 계산
    portfolio_returns = portfolio_df["Portfolio_Value"].pct_change().dropna()
    standard_deviation = np.std(portfolio_returns) * np.sqrt(365)  # 연율화

    # 포트폴리오 가치 히스토리
    portfolio_value_history = {
        k.strftime("%Y-%m-%d"): v for k, v in portfolio_df["Portfolio_Value"].items()
    }

    return {
        "initial_balance": initial_balance,
        "final_balance": round(end_value, 2),
        "roi": f"{roi:.2f}%",
        "mdd": round(mdd, 2),
        "cagr": f"{cagr * 100:.2f}%",
        "standard_deviation": round(standard_deviation, 4),  # 표준편차 추가
        "portfolio_value_history": portfolio_value_history,
    }