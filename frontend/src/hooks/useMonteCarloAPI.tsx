import { useState } from "react";
import axios from "axios";

interface MonteCarloResult {
  symbol: string;
  result: {
    predicted_price: number;
    probability_above_target: number;
    min_price: number;
    max_price: number;
    final_prices: number[];
  };
}

interface APIResponse {
  success: boolean;
  message: string;
  data: MonteCarloResult["result"] & { symbol: string };
}

const useMonteCarloAPI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const runMonteCarlo = async (
    symbol: string,
    timeframe: string,
    startDate: string,
    endDate: string,
    initialBalance: number,
    targetReturn: number,
    days: number
  ): Promise<MonteCarloResult | null> => {
    setIsLoading(true);
    try {
      const response = await axios.post<APIResponse>(
        "http://localhost:8000/backtest/monte-carlo",
        {
          symbol,
          timeframe,
          start_date: startDate,
          end_date: endDate,
          initial_balance: initialBalance,
          target_return: targetReturn,
          days,
          simulations: 500,
        }
      );
      if (response.data.success) {
        return {
          symbol: response.data.data.symbol,
          result: {
            predicted_price: response.data.data.predicted_price,
            probability_above_target:
              response.data.data.probability_above_target,
            min_price: response.data.data.min_price,
            max_price: response.data.data.max_price,
            final_prices: response.data.data.final_prices,
          },
        };
      }
      return null;
    } catch (error) {
      console.error("Error running Monte Carlo simulation:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { runMonteCarlo, isLoading };
};

export default useMonteCarloAPI;
