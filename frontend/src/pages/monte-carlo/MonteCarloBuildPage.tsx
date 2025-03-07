import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMonteCarloAPI from "../../hooks/useMonteCarloAPI";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MonteCarloStepManager } from "@/components/monte-carlo/MonteCarloStepManager";
import { MonteCarloSavedSettingsList } from "@/components/monte-carlo/MonteCarloSavedSettingsList";
interface MonteCarloSettings {
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  targetReturn: number;
  days: number;
}

const PRESETS = [
  {
    name: "BTC Short-Term",
    symbol: "BTC/USDT",
    timeframe: "1d",
    startDate: "2024-01-01",
    endDate: "2025-01-31",
    initialBalance: 100000000,
    targetReturn: 0.1,
    days: 30,
  },
  {
    name: "ETH Long-Term",
    symbol: "ETH/USDT",
    timeframe: "1d",
    startDate: "2024-01-01",
    endDate: "2025-01-31",
    initialBalance: 100000000,
    targetReturn: 0.3,
    days: 90,
  },
];

export default function MonteCarloBuildPage() {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<MonteCarloSettings[]>([]);
  const { runMonteCarlo, isLoading } = useMonteCarloAPI();
  const navigate = useNavigate();

  useEffect(() => {
    if (settings.length === 0) {
      setSettings([PRESETS[0]]);
    }
  }, []);

  const handleRunMonteCarlo = async () => {
    if (settings.length === 0) {
      setErrorMessage("No settings to run Monte Carlo simulation.");
      return;
    }

    try {
      const monteCarloResults = [];
      for (const setting of settings) {
        const result = await runMonteCarlo(
          setting.symbol,
          setting.timeframe,
          setting.startDate,
          setting.endDate,
          setting.initialBalance,
          setting.targetReturn,
          setting.days
        );
        if (result) {
          monteCarloResults.push(result);
        }
      }

      if (monteCarloResults.length > 0) {
        localStorage.setItem(
          "monteCarloResults",
          JSON.stringify(monteCarloResults)
        );
        navigate("/monte-carlo/results");
      }
    } catch (error) {
      setErrorMessage(
        "Failed to run Monte Carlo simulation. Please try again."
      );
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Monte Carlo Simulator</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MonteCarloStepManager
            settings={settings}
            setSettings={setSettings}
            toast={toast}
          />
          <MonteCarloSavedSettingsList
            settings={settings}
            setSettings={setSettings}
            presets={PRESETS}
            toast={toast}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleRunMonteCarlo}
          disabled={settings.length === 0 || isLoading}
          className="w-full"
        >
          {isLoading ? "Running..." : "Run Simulation"}
        </Button>
      </CardFooter>

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
    </Card>
  );
}
