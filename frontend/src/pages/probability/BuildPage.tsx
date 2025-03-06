import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProbabilityAPI from "../../hooks/useProbabilityAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

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
    name: "BTC Short-Term",
    symbol: "BTC/USDT",
    timeframe: "1d",
    startDate: "2025-01-01",
    endDate: "2025-02-01",
    initialBalance: 10000,
    targetReturn: 0.3,
  },
  {
    name: "ETH Long-Term",
    symbol: "ETH/USDT",
    timeframe: "1d",
    startDate: "2025-01-01",
    endDate: "2025-02-01",
    initialBalance: 10000,
    targetReturn: 0.3,
  },
];

export default function ProbabilityBuildPage() {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProbabilitySettings[]>([]);
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("1d");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-01-31");
  const [initialBalance, setInitialBalance] = useState(10000);
  const [targetReturn, setTargetReturn] = useState(5);

  const { runProbability, isLoading } = useProbabilityAPI();
  const navigate = useNavigate();

  useEffect(() => {
    if (settings.length === 0) {
      setSettings([PRESETS[0]]);
    }
  }, []);

  const handleAddSettings = () => {
    if (
      !symbol ||
      !timeframe ||
      !startDate ||
      !endDate ||
      initialBalance <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please fill in all fields correctly.",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      toast({
        variant: "destructive",
        title: "Invalid Dates",
        description: "Start date must be before end date.",
      });
      return;
    }

    const newSetting: ProbabilitySettings = {
      symbol,
      timeframe,
      startDate,
      endDate,
      initialBalance,
      targetReturn: targetReturn / 100,
    };

    setSettings((prev) => [...prev, newSetting]);
    setSymbol("");
    setTargetReturn(5);
    toast({
      title: "Setting Added",
      description: `${symbol} added to the list.`,
    });
  };

  const handleDeleteSetting = (index: number) => {
    setSettings((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Setting Removed",
      description: "The setting has been deleted.",
    });
  };

  const handlePresetSelect = (preset: ProbabilitySettings) => {
    setSymbol(preset.symbol);
    setTimeframe(preset.timeframe);
    setStartDate(preset.startDate);
    setEndDate(preset.endDate);
    setInitialBalance(preset.initialBalance);
    setTargetReturn(preset.targetReturn * 100);
  };

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
    <div>
      <h2>Probability Calculator</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <h3>Add Probability Setting</h3>

          <div style={{ marginTop: "10px" }}>
            <Label htmlFor="symbol">Coin Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g., BTC/USDT"
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Minute</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div style={{ marginTop: "10px" }}>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <Label htmlFor="initialBalance">Initial Balance ($)</Label>
            <Input
              id="initialBalance"
              type="number"
              value={initialBalance}
              onChange={(e) =>
                setInitialBalance(Math.max(0, Number(e.target.value)))
              }
              placeholder="e.g., 10000"
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <Label htmlFor="targetReturn">Target Return (%)</Label>
            <Input
              id="targetReturn"
              type="number"
              value={targetReturn}
              onChange={(e) => setTargetReturn(Number(e.target.value))}
              placeholder="e.g., 5 for 5%"
              step="0.1"
            />
          </div>

          <Button onClick={handleAddSettings} style={{ marginTop: "15px" }}>
            Add Setting
          </Button>
        </div>

        <div>
          <h3>Saved Settings</h3>
          {settings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Timeframe</TableHead>
                  <TableHead>Target (%)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting, index) => (
                  <TableRow key={index}>
                    <TableCell>{setting.symbol}</TableCell>
                    <TableCell>{setting.timeframe}</TableCell>
                    <TableCell>
                      {(setting.targetReturn * 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSetting(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No settings added yet.</p>
          )}

          <div style={{ marginTop: "20px" }}>
            <h3>Presets</h3>
            <Select
              onValueChange={(value) => {
                const preset = PRESETS.find((p) => p.name === value);
                if (preset) handlePresetSelect(preset);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        onClick={handleRunProbability}
        disabled={settings.length === 0 || isLoading}
        style={{ marginTop: "20px" }}
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
