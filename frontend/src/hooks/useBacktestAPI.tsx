import { useState } from "react";
import { baseUrl } from "../constants/baseUrl";

interface BacktestRequest {
  assets: Record<string, number>;
  initial_balance: number;
  start_date: string;
  end_date: string;
  rebalance_period: string;
  rebalance: boolean;
  fee_rate: number;
  slippage: number;
}

interface BacktestResult {
  final_balance: number;
  roi: string;
  mdd: number;
  cagr: string;
  portfolio_value_history: Record<string, number>;
}

export default function useBacktestAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(
    null
  );

  const runBacktest = async (
    assets: Record<string, number>,
    initialBalance: number,
    startDate: string,
    endDate: string,
    rebalancePeriod: string,
    rebalance: boolean,
    feeRate: number,
    slippage: number
  ) => {
    setIsLoading(true);
    setError(null);
    setBacktestResult(null);

    const requestBody: BacktestRequest = {
      assets,
      initial_balance: initialBalance,
      start_date: startDate,
      end_date: endDate,
      rebalance_period: rebalancePeriod,
      rebalance: rebalance,
      fee_rate: feeRate,
      slippage: slippage,
    };

    try {
      const response = await fetch(`${baseUrl}/backtest/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Backtest failed.");
      }

      setBacktestResult(data.data);
      return data.data;
    } catch (err) {
      console.error("Backtest Error:", err);
      setError(
        err instanceof Error ? err.message : "Error connecting to the server."
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { runBacktest, isLoading, error, backtestResult };
}
