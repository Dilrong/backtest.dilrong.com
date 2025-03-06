import { useState } from "react";
import { baseUrl } from "../constants/baseUrl";

interface ProbabilityRequest {
  symbol: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  initial_balance: number;
  target_return: number;
}

interface ProbabilityResult {
  symbol: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  initial_balance: number;
  expected_return: number;
  standard_deviation: number;
  target_return: number;
  z_score: number;
  probability: number;
  daily_returns: number[];
  value_history: Record<string, number>;
}

export default function useProbabilityAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [probabilityResult, setProbabilityResult] =
    useState<ProbabilityResult | null>(null);

  const runProbability = async (
    symbol: string,
    timeframe: string,
    startDate: string,
    endDate: string,
    initialBalance: number,
    targetReturn: number
  ) => {
    setIsLoading(true);
    setError(null);
    setProbabilityResult(null);

    const requestBody: ProbabilityRequest = {
      symbol,
      timeframe,
      start_date: startDate,
      end_date: endDate,
      initial_balance: initialBalance,
      target_return: targetReturn,
    };

    try {
      const response = await fetch(`${baseUrl}/backtest/probability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Probability calculation failed.");
      }

      setProbabilityResult(data.data);
      return data.data;
    } catch (err) {
      console.error("Probability Error:", err);
      setError(
        err instanceof Error ? err.message : "Error connecting to the server."
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { runProbability, isLoading, error, probabilityResult };
}
