import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBacktestAPI from "../../hooks/useBacktestAPI";
import { PortfolioStepManager } from "../../components/portfolio/PortfolioStepManager";
import { InvestmentSettings } from "../../components/portfolio/InvestmentSettings";
import SavedPortfolioList from "../../components/portfolio/SavedPortfolioList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfolioName, setPortfolioName] = useState("");
  const [currentPortfolio, setCurrentPortfolio] = useState<PortfolioItem[]>([]);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-01-31");

  const { runBacktest, isLoading } = useBacktestAPI();
  const navigate = useNavigate();

  useEffect(() => {
    if (portfolios.length === 0) {
      setPortfolios([
        {
          id: 1,
          name: "Example Portfolio",
          data: [
            { id: 1, ticker: "BTC/USDT", percentage: 50 },
            { id: 2, ticker: "ETH/USDT", percentage: 30 },
            { id: 3, ticker: "SOL/USDT", percentage: 20 },
          ],
          initialBalance: 10000,
          startDate: "2024-01-01",
          endDate: "2025-01-31",
        },
      ]);
    }
  }, []);

  const handleSavePortfolio = () => {
    const trimmedName = portfolioName.trim();
    const totalPercentage = currentPortfolio.reduce(
      (acc, item) => acc + item.percentage,
      0
    );

    if (currentPortfolio.length === 0) {
      toast({
        variant: "destructive",
        title: "Portfolio is empty",
        description: "Please add at least one asset.",
      });
      return;
    }
    if (!trimmedName) {
      toast({
        variant: "destructive",
        title: "Portfolio name required",
        description: "Please enter a name for your portfolio.",
      });
      return;
    }
    if (totalPercentage !== 100) {
      toast({
        variant: "destructive",
        title: "Invalid Allocation",
        description: "Total asset percentage must equal 100%.",
      });
      return;
    }

    const newPortfolio = {
      id: Date.now(),
      name: trimmedName,
      data: currentPortfolio,
      initialBalance,
      startDate,
      endDate,
    };

    setPortfolios((prev) => [...prev, newPortfolio]);
    setPortfolioName("");
    setCurrentPortfolio([]);
    setInitialBalance(10000);
    setStartDate("2024-01-01");
    setEndDate("2025-01-31");
  };

  const handleDeletePortfolio = (id: number) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
  };

  const handleBacktest = async () => {
    if (portfolios.length === 0) {
      setErrorMessage("No portfolios to backtest.");
      return;
    }

    try {
      const portfolioTestResults = [];
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
          portfolioTestResults.push({ name: portfolio.name, result });
        }
      }

      if (portfolioTestResults.length > 0) {
        localStorage.setItem(
          "portfolioTestResults",
          JSON.stringify(portfolioTestResults)
        );
        navigate("/portfolio/results");
      }
    } catch (error) {
      setErrorMessage("Failed to run backtest. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Build and Compare Portfolios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioStepManager
          portfolioName={portfolioName}
          setPortfolioName={setPortfolioName}
          currentPortfolio={currentPortfolio}
          setCurrentPortfolio={setCurrentPortfolio}
          onSave={handleSavePortfolio}
        />
        <InvestmentSettings
          initialBalance={initialBalance}
          setInitialBalance={setInitialBalance}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      <SavedPortfolioList
        portfolios={portfolios}
        onDelete={handleDeletePortfolio}
      />

      <Button
        onClick={handleBacktest}
        disabled={portfolios.length === 0}
        className="w-full"
      >
        {isLoading ? "Running Backtest..." : "Run Backtest"}
      </Button>

      {errorMessage && (
        <Dialog
          open={!!errorMessage}
          onOpenChange={() => setErrorMessage(null)}
        >
          <DialogContent>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
