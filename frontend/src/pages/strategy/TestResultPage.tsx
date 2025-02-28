import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PortfolioGrowthChart } from "../../components/portfolio/PortfolioGrowthChart"; // 재사용 가정
import { PortfolioResultCard } from "../../components/portfolio/PortfolioResultCard"; // 재사용 가정

// 전략 백테스트 결과 타입 (PortfolioTestResult와 동일 가정)
interface BacktestResult {
  name: string;
  result: {
    final_balance: number;
    roi: string;
    mdd: number;
    cagr: string;
    portfolio_value_history: Record<string, number>;
  };
}

// 결과 유효성 검사 함수 (PortfolioTestResult에서 재사용)
const isValidBacktestData = (result: BacktestResult): boolean => {
  return (
    result &&
    result.name &&
    typeof result.result.final_balance === "number" &&
    typeof result.result.mdd === "number" &&
    typeof result.result.cagr === "string" &&
    typeof result.result.roi === "string" &&
    typeof result.result.portfolio_value_history === "object"
  );
};

export default function StrategyTestResultPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<BacktestResult[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem("strategyTestResults");
    if (!storedResults) {
      navigate("/strategy");
      return;
    }

    const parsedResults: BacktestResult[] = JSON.parse(storedResults);
    const validResults = parsedResults.filter(isValidBacktestData);

    if (validResults.length === 0) {
      navigate("/strategy");
      return;
    }

    setResults(validResults);
  }, [navigate]);

  const chartData = useMemo(() => {
    if (results.length === 0) return [];

    const allDates = new Set<string>();
    results.forEach(({ result }) => {
      Object.keys(result.portfolio_value_history).forEach((date) =>
        allDates.add(date)
      );
    });

    const sortedDates = Array.from(allDates).sort();
    return sortedDates.map((date) => {
      const entry: Record<string, unknown> = { date };
      results.forEach(({ name, result }) => {
        entry[name] = result.portfolio_value_history[date]
          ? parseFloat(result.portfolio_value_history[date].toFixed(2))
          : null;
      });
      return entry;
    });
  }, [results]);

  if (results.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Strategy Backtest Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <PortfolioResultCard key={result.name} result={result} />
        ))}
      </div>

      <PortfolioGrowthChart results={results} chartData={chartData} />
    </div>
  );
}
