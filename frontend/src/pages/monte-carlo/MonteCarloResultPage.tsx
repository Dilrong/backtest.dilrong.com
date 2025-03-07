import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MonteCarloResultCardList } from "@/components/monte-carlo/MonteCarloResultCardList";
import { MonteCarloHistogram } from "@/components/monte-carlo/MonteCarloHistogram";

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

export default function MonteCarloResultPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<MonteCarloResult[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem("monteCarloResults");
    if (!storedResults) {
      navigate("/monte-carlo");
      return;
    }

    try {
      const parsedResults: MonteCarloResult[] = JSON.parse(storedResults);
      setResults(parsedResults);
    } catch (error) {
      console.error("Error parsing Monte Carlo results:", error);
      setResults([]);
    }
  }, [navigate]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Monte Carlo Simulation Results
        </h2>
        <p>View the predicted price distribution based on historical data.</p>
      </CardHeader>
      <CardContent>
        <MonteCarloResultCardList results={results} />
        {results.map((result, index) => {
          const targetPrice = result.result.final_prices[0] * (1 + 0.1); // 예: target_return=0.1로 가정
          return (
            <Card key={index}>
              <CardHeader>
                <h3>{result.symbol} Price Distribution</h3>
              </CardHeader>
              <CardContent>
                <MonteCarloHistogram
                  result={result.result}
                  targetPrice={targetPrice}
                />
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
