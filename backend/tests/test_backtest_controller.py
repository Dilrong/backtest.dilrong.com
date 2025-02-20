import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.backtest_service import calculate_portfolio_backtest

client = TestClient(app)


@pytest.fixture
def mock_calculate_portfolio_backtest(mocker):
    """
    Mock `calculate_portfolio_backtest` to return a dummy response.
    """
    return mocker.patch(
        "app.services.backtest_service.calculate_portfolio_backtest",
        return_value={
            "initial_balance": 10000,
            "final_balance": 15000,
            "roi": "50.00%",
            "mdd": 10.5,
            "cagr": "10.00%",
            "portfolio_value_history": {"2024-01-01": 10000, "2025-01-01": 15000},
        },
    )


def test_run_portfolio_backtest_success(mock_calculate_portfolio_backtest):
    """
    정상적인 요청이 들어왔을 때 200 응답을 반환하는지 확인
    """
    payload = {
        "assets": {"BTC/USDT": 0.6, "ETH/USDT": 0.2, "SOL/USDT": 0.2},
        "initial_balance": 10000,
        "start_date": "2024-01-01",
        "end_date": "2025-01-31",
        "rebalance_period": "W",
        "rebalance": "true",
        "fee_rate": 0.001,
        "slippage": 0.0005,
    }

    response = client.post("/backtest/portfolio", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Calculated Portfolio Backtest Result"
    assert data["data"]["initial_balance"] == 10000


def test_run_portfolio_backtest_invalid_request():
    """
    유효하지 않은 요청이 들어왔을 때 422 응답을 반환하는지 확인
    """
    payload = {
        "assets": {"BTC/USDT": 1.2},
        "initial_balance": 10000,
        "start_date": "2024-01-01",
        "end_date": "2025-01-31",
        "rebalance_period": "10W",
    }

    response = client.post("/backtest/portfolio", json=payload)

    assert response.status_code == 422


def test_run_portfolio_backtest_missing_field():
    """
    필수 필드가 누락된 요청이 들어왔을 때 422 응답을 반환하는지 확인
    """
    payload = {
        "initial_balance": 10000,
        "start_date": "2024-01-01",
        "end_date": "2025-01-31",
    }

    response = client.post("/backtest/portfolio", json=payload)

    assert response.status_code == 422
