import pytest
import pandas as pd
from unittest.mock import patch
from datetime import datetime
from app.services.backtest_service import fetch_data, calculate_portfolio_backtest


@pytest.fixture
def mock_binance_ohlcv():
    """
    CCXT 목업 데이터
    각 행: [timestamp, open, high, low, close, volume]
    두 개의 월봉 데이터: 2024-01-01, 2024-02-01
    """
    return [
        [1704067200000, 40000, 40500, 39800, 40300, 1000],
        [1706745600000, 40300, 41000, 40000, 40700, 1200],
    ]


@patch("app.services.backtest_service.exchange.fetch_ohlcv")
def test_fetch_data(mock_fetch_ohlcv, mock_binance_ohlcv):
    """
    fetch_data가 정상적으로 데이터를 가져오고 날짜 필터링이 작동하는지 테스트합니다.
    (2024-01-01 ~ 2024-02-28 범위 내 데이터 반환)
    """
    mock_fetch_ohlcv.return_value = mock_binance_ohlcv

    result = fetch_data(["BTC/USDT"], "1M", "2024-01-01", "2024-02-28")

    assert "BTC/USDT" in result
    assert not result["BTC/USDT"].empty
    # 반환된 데이터는 원본 순서를 유지하므로, 첫번째 행은 2024-01-01 (close: 40300)
    assert result["BTC/USDT"].iloc[0]["close"] == 40300
    # 두번째 행의 close 가격 검증
    assert result["BTC/USDT"].iloc[1]["close"] == 40700


@patch("app.services.backtest_service.fetch_data")
def test_calculate_portfolio_backtest_daily(mock_fetch_data):
    """
    일별 리밸런싱(D) 옵션에 대해, 단일 자산의 백테스트 결과가 정상적으로 계산되는지 테스트합니다.
    """
    # 테스트용 데이터: 5일간 10% 상승 (수수료/슬리피지 없음)
    dates = pd.to_datetime(
        ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"]
    )
    df = pd.DataFrame({"close": [10000, 11000, 12100, 13310, 14641]}, index=dates)
    mock_fetch_data.return_value = {"BTC/USDT": df}

    result = calculate_portfolio_backtest(
        symbols=["BTC/USDT"],
        weights={"BTC/USDT": 1.0},
        initial_balance=10000,
        start_date="2024-01-01",
        end_date="2024-01-05",
        rebalance_period="D",
        fee_rate=0,
        slippage=0,
    )

    # 예상: 최종 잔액 = 14641, ROI = 46.41%
    assert result["final_balance"] == 14641
    assert result["roi"] == "46.41%"
    # 포트폴리오 가치 히스토리는 날짜별 데이터가 존재해야 함
    assert isinstance(result["portfolio_value_history"], dict)


# ---------------------------------------------------------------------------------
# 날짜 관련 예외 상황 테스트
# ---------------------------------------------------------------------------------


def test_invalid_date():
    """
    시작일이 종료일보다 늦은 경우 ValueError가 발생하는지 테스트합니다.
    """
    with pytest.raises(ValueError, match="Start date must be before end date"):
        calculate_portfolio_backtest(
            symbols=["BTC/USDT"],
            weights={"BTC/USDT": 1.0},
            initial_balance=10000,
            start_date="2024-12-01",
            end_date="2024-01-01",
        )


def test_unsupported_assets():
    """
    settings.SUPPORTED_ASSETS에 없는 자산이 입력되면 ValueError가 발생하는지 테스트합니다.
    """
    with pytest.raises(ValueError, match="Unsupported assets"):
        calculate_portfolio_backtest(
            symbols=["INVALID/USDT"],
            weights={"INVALID/USDT": 1.0},
            initial_balance=10000,
            start_date="2024-01-01",
            end_date="2024-03-01",
        )


# ---------------------------------------------------------------------------------
# 장기간 (1년 이상) 백테스트 및 CAGR 검증
# ---------------------------------------------------------------------------------


@patch("app.services.backtest_service.fetch_data")
def test_calculate_portfolio_backtest_long_period(mock_fetch_data):
    """
    1년 이상의 기간에 대해, CAGR 및 ROI가 정상적으로 계산되는지 테스트합니다.
    여기서는 월별 리밸런싱(ME)을 사용합니다.
    """
    # 13개월 간 매월 5% 상승하는 데이터 생성 (2023-01-31 ~ 2023-12-31)
    dates = pd.date_range(start="2023-01-31", periods=12, freq="M")
    # 첫 달 가격 10000, 이후 매월 5% 상승
    prices = [10000 * (1.05**i) for i in range(12)]
    df = pd.DataFrame({"close": prices}, index=dates)
    mock_fetch_data.return_value = {"BTC/USDT": df}

    result = calculate_portfolio_backtest(
        symbols=["BTC/USDT"],
        weights={"BTC/USDT": 1.0},
        initial_balance=10000,
        start_date="2023-01-31",
        end_date="2023-12-31",
        rebalance_period="ME",
        fee_rate=0,
        slippage=0,
    )

    final_balance = result["final_balance"]
    # ROI = (final_balance - 10000) / 10000 * 100
    expected_roi = ((final_balance - 10000) / 10000) * 100
    # CAGR = (final_balance/10000)^(1/1) - 1
    expected_cagr = (final_balance / 10000) - 1

    assert float(result["roi"].strip("%")) == pytest.approx(expected_roi, rel=1e-2)
    assert float(result["cagr"].strip("%")) == pytest.approx(
        expected_cagr * 100, rel=1e-2
    )


# ---------------------------------------------------------------------------------
# YE 옵션 테스트 (내부적으로 ME로 처리)
# ---------------------------------------------------------------------------------


@patch("app.services.backtest_service.fetch_data")
def test_calculate_portfolio_backtest_long_period(mock_fetch_data):
    """
    1년 이상의 기간에 대해, CAGR 및 ROI가 정상적으로 계산되는지 테스트합니다.
    (실제 기간을 반영하여 CAGR를 계산)
    """
    dates = pd.date_range(start="2023-01-31", periods=12, freq="ME")
    prices = [10000 * (1.05**i) for i in range(12)]
    df = pd.DataFrame({"close": prices}, index=dates)
    mock_fetch_data.return_value = {"BTC/USDT": df}

    result = calculate_portfolio_backtest(
        symbols=["BTC/USDT"],
        weights={"BTC/USDT": 1.0},
        initial_balance=10000,
        start_date="2023-01-31",
        end_date="2023-12-31",
        rebalance_period="ME",
        fee_rate=0,
        slippage=0,
    )

    final_balance = result["final_balance"]
    # ROI = (final_balance - initial_balance) / initial_balance * 100
    expected_roi = ((final_balance - 10000) / 10000) * 100

    # 실제 기간(일수 차이)을 반영하여 CAGR 계산
    num_years = (
        pd.to_datetime("2023-12-31") - pd.to_datetime("2023-01-31")
    ).days / 365.0
    expected_cagr = ((final_balance / 10000) ** (1 / num_years)) - 1

    assert float(result["roi"].strip("%")) == pytest.approx(expected_roi, rel=1e-2)
    assert float(result["cagr"].strip("%")) == pytest.approx(
        expected_cagr * 100, rel=1e-2
    )
