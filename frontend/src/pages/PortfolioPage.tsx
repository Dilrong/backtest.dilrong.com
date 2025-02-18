import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useBacktestAPI from "../hooks/useBacktestAPI";
import PortfolioForm from "../components/portfolio/PortfolioForm";
import PortfolioList from "../components/portfolio/PortfolioList";
import PortfolioPieChart from "../components/portfolio/PortfolioPieChart";

interface PortfolioItem {
  id: number;
  ticker: string;
  percentage: number;
}

interface Portfolio {
  id: number;
  name: string;
  data: PortfolioItem[];
  initialBalance: number;
  startDate: string;
  endDate: string;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfolioName, setPortfolioName] = useState("");
  const [currentPortfolio, setCurrentPortfolio] = useState<PortfolioItem[]>([]);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-01-31");

  const { runBacktest, isLoading } = useBacktestAPI();
  const navigate = useNavigate();

  const handleSavePortfolio = () => {
    if (currentPortfolio.length === 0 || !portfolioName) return;
    setPortfolios([
      ...portfolios,
      {
        id: Date.now(),
        name: portfolioName,
        data: currentPortfolio,
        initialBalance,
        startDate,
        endDate,
      },
    ]);
    setPortfolioName("");
    setCurrentPortfolio([]);
    setInitialBalance(10000);
    setStartDate("2024-01-01");
    setEndDate("2025-01-31");
  };

  const handleBacktest = async () => {
    const backtestResults = [];

    for (const portfolio of portfolios) {
      const assets = Object.fromEntries(
        portfolio.data.map((item) => [item.ticker, item.percentage / 100])
      );
      const result = await runBacktest(
        assets,
        portfolio.initialBalance,
        portfolio.startDate,
        portfolio.endDate
      );
      if (result) {
        backtestResults.push({ name: portfolio.name, result });
      }
    }

    if (backtestResults.length > 0) {
      localStorage.setItem("backtestResults", JSON.stringify(backtestResults));
      navigate("/backtest/results");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">
        📌 Build and Compare Portfolios
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-primary mb-3">
            Portfolio Settings
          </h3>
          <input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            placeholder="Portfolio Name"
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2 mb-3"
          />
          <PortfolioForm
            onAdd={(ticker, percentage) =>
              setCurrentPortfolio([
                ...currentPortfolio,
                { id: Date.now(), ticker, percentage },
              ])
            }
            portfolio={currentPortfolio}
          />
          <PortfolioList
            portfolio={currentPortfolio}
            onRemove={(id) =>
              setCurrentPortfolio(
                currentPortfolio.filter((item) => item.id !== id)
              )
            }
          />
          <button
            onClick={handleSavePortfolio}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg w-full"
          >
            Save Portfolio
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-primary mb-3">
            Investment Details
          </h3>
          <label className="text-text">Initial Balance ($)</label>
          <input
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(Number(e.target.value))}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2"
          />

          <label className="text-text mt-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2"
          />

          <label className="text-text mt-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2"
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-primary mb-3">
            Portfolio Allocation
          </h3>
          <PortfolioPieChart portfolio={currentPortfolio} />
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white">Saved Portfolios</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-400">
          {portfolios.map((p) => (
            <li key={p.id} className="p-3 bg-gray-900 rounded-lg text-center">
              <span className="font-semibold">{p.name}</span>
              <div className="text-sm">
                {p.data.length} assets <br /> Start: {p.startDate} <br /> End:{" "}
                {p.endDate}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleBacktest}
        disabled={isLoading}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white py-3 w-full rounded-lg"
      >
        {isLoading ? "Running Backtest..." : "Run Backtest for All Portfolios"}
      </button>
    </div>
  );
}
