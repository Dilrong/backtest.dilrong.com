import { useState } from "react";

interface BacktestRequest {
  assets: Record<string, number>;
  initial_balance: number;
  start_date: string;
  end_date: string;
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
    endDate: string
  ) => {
    setIsLoading(true);
    setError(null);
    setBacktestResult(null);

    const requestBody: BacktestRequest = {
      assets,
      initial_balance: initialBalance,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const response = await fetch("http://localhost:8000/backtest/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok || !data.success) {
        setError(data.message || "Backtest failed.");
        return null;
      }

      setBacktestResult(data.data);
      return data.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError("Error connecting to the server.");
      return null;
    }
  };

  return { runBacktest, isLoading, error, backtestResult };
}
