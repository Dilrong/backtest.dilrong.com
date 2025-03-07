import { ProbabilityGrowthChart } from "@/components/probability/ProbabilityGrowthChart";
import { ResultCardList } from "@/components/probability/ResultCardList";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProbabilityResult {
  symbol: string;
  result: {
    expected_return: number;
    standard_deviation: number;
    target_return: number;
    z_score: number;
    probability: number;
    value_history: Record<string, number>;
    daily_returns: number[];
  };
}

export default function ProbabilityResultPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<ProbabilityResult[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem("probabilityResults");
    if (!storedResults) {
      console.log("No stored results, navigating to /probability");
      navigate("/probability");
      return;
    }

    try {
      const parsedResults: ProbabilityResult[] = JSON.parse(storedResults);
      const validResults = parsedResults.filter(isValidProbabilityData);

      if (validResults.length === 0) {
        console.log("No valid results, navigating to /probability");
        navigate("/probability");
        return;
      }

      console.log("Parsed Results:", validResults);
      setResults(validResults);
    } catch (error) {
      console.error("Error parsing results:", error);
      setResults([]);
    }
  }, [navigate]);

  const chartData = useMemo(() => {
    if (results.length === 0) return [];

    const allDates = new Set<string>();
    results.forEach(({ result }) => {
      Object.keys(result.value_history).forEach((date) => allDates.add(date));
    });

    const sortedDates = Array.from(allDates).sort();
    const data = sortedDates.map((date, index) => {
      const entry: Record<string, any> = { date };
      results.forEach(({ symbol, result }) => {
        const value = result.value_history[date] || null;
        const dailyVolatility = result.daily_returns[index] || 0;
        entry[symbol] = value;
        entry[`${symbol}_volatility`] = Math.abs(dailyVolatility);
      });
      return entry;
    });

    console.log("Chart Data with Daily Volatility:", data);
    return data;
  }, [results]);

  console.log("Rendering ProbabilityResultPage with results:", results);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Probability Results</h2>
      <ResultCardList results={results} />
      <ProbabilityGrowthChart results={results} chartData={chartData} />
    </div>
  );
}

const isValidProbabilityData = (result: ProbabilityResult) => {
  return (
    result &&
    result.symbol &&
    typeof result.result.expected_return === "number" &&
    typeof result.result.standard_deviation === "number" &&
    typeof result.result.target_return === "number" &&
    typeof result.result.z_score === "number" &&
    typeof result.result.probability === "number" &&
    typeof result.result.value_history === "object" &&
    Array.isArray(result.result.daily_returns)
  );
};
