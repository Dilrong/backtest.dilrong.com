import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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

const getPortfolioColor = (index: number) => {
  const colors = [
    "#009EFF",
    "#FF5733",
    "#6A00FF",
    "#00C853",
    "#FFC400",
    "#E91E63",
    "#9C27B0",
    "#3F51B5",
    "#FF9800",
  ];
  return colors[index % colors.length];
};

export default function BacktestResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<BacktestResult[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem("backtestResults");
    if (!storedResults) {
      navigate("/");
      return;
    }
    setResults(JSON.parse(storedResults));
  }, [navigate]);

  if (results.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">
        📊 Compare Portfolio Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(({ name, result }) => (
          <div key={name} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-3">{name}</h3>
            <div className="grid grid-cols-2 gap-3 text-gray-300">
              <span className="font-semibold">Final Balance:</span>
              <span className="text-green-400">
                ${result.final_balance.toLocaleString()}
              </span>

              <span className="font-semibold">ROI:</span>
              <span className="text-blue-400">{result.roi}</span>

              <span className="font-semibold">Max Drawdown:</span>
              <span className="text-red-400">{result.mdd}%</span>

              <span className="font-semibold">CAGR:</span>
              <span className="text-yellow-400">{result.cagr}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">
          📈 Portfolio Growth Comparison
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            {results.map(({ name, result }, index) => (
              <Line
                key={name}
                data={Object.entries(result.portfolio_value_history).map(
                  ([date, value]) => ({ date, value })
                )}
                type="monotone"
                dataKey="value"
                stroke={getPortfolioColor(index)}
                strokeWidth={2}
                dot={false}
              />
            ))}
            <XAxis dataKey="date" stroke="#bbb" />
            <YAxis stroke="#bbb" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
