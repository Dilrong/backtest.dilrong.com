import { ProbabilityStepManager } from "@/components/probability/ProbabilityStepManager";
import { SavedSettingsList } from "@/components/probability/SavedSettingsList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProbabilityAPI from "../../hooks/useProbabilityAPI";

interface ProbabilitySettings {
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  targetReturn: number;
}

const PRESETS = [
  {
    symbol: "BTC/USDT",
    timeframe: "1d",
    startDate: "2025-01-01",
    endDate: "2025-02-01",
    initialBalance: 10000,
    targetReturn: 0.3,
  },
  {
    symbol: "ETH/USDT",
    timeframe: "1d",
    startDate: "2025-01-01",
    endDate: "2025-02-01",
    initialBalance: 10000,
    targetReturn: 0.3,
  },
];

export default function ProbabilityBuildPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProbabilitySettings[]>([]);
  const { runProbability, isLoading } = useProbabilityAPI();
  const navigate = useNavigate();

  useEffect(() => {
    if (settings.length === 0) {
      setSettings([PRESETS[0]]);
    }
  }, []);

  const handleRunProbability = async () => {
    if (settings.length === 0) {
      setErrorMessage("No settings to calculate probability.");
      return;
    }

    try {
      const probabilityResults = [];
      for (const setting of settings) {
        const result = await runProbability(
          setting.symbol,
          setting.timeframe,
          setting.startDate,
          setting.endDate,
          setting.initialBalance,
          setting.targetReturn
        );
        if (result) {
          probabilityResults.push({ symbol: setting.symbol, result });
        }
      }

      if (probabilityResults.length > 0) {
        localStorage.setItem(
          "probabilityResults",
          JSON.stringify(probabilityResults)
        );
        navigate("/probability/results");
      }
    } catch (error) {
      setErrorMessage("Failed to calculate probability. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Probability Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProbabilityStepManager settings={settings} setSettings={setSettings} />
        <SavedSettingsList
          settings={settings}
          setSettings={setSettings}
          presets={PRESETS}
        />
      </div>
      <Button
        onClick={handleRunProbability}
        disabled={settings.length === 0 || isLoading}
        className="w-full"
      >
        {isLoading ? "Calculating..." : "Calculate Probability"}
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
