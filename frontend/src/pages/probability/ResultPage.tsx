import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProbabilityResultCard } from "../../components/probability/ProbabilityResultCard";
import { ProbabilityGrowthChart } from "../../components/probability/ProbabilityGrowthChart";

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
    const data = sortedDates.map((date) => {
      const entry: Record<string, any> = { date };
      results.forEach(({ symbol, result }) => {
        const value = result.value_history[date] || null;
        const stdDev = result.standard_deviation; // 연율화된 값 그대로 사용
        entry[symbol] = value;
        entry[`${symbol}_stdDevUpper`] = value ? value * (1 + stdDev) : null;
        entry[`${symbol}_stdDevLower`] = value ? value * (1 - stdDev) : null;
      });
      return entry;
    });

    console.log("Chart Data with StdDev:", data);
    return data;
  }, [results]);

  console.log("Rendering ProbabilityResultPage with results:", results);

  return (
    <div>
      <h2>Probability Results</h2>
      <p>
        View the probability of achieving your target return based on historical
        data.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {results.map((result) => (
          <ProbabilityResultCard key={result.symbol} result={result} />
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        {chartData.length > 0 ? (
          <ProbabilityGrowthChart results={results} chartData={chartData} />
        ) : (
          <p>No chart data available.</p>
        )}
      </div>
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
