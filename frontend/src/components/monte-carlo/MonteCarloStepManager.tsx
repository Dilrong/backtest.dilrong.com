import { useState } from "react";
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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
interface MonteCarloSettings {
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  targetReturn: number;
  days: number;
}

interface MonteCarloStepManagerProps {
  settings: MonteCarloSettings[];
  setSettings: React.Dispatch<React.SetStateAction<MonteCarloSettings[]>>;
}

export function MonteCarloStepManager({
  settings,
  setSettings,
  toast,
}: MonteCarloStepManagerProps) {
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("1d");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-01-31");
  const [initialBalance, setInitialBalance] = useState(100000000);
  const [targetReturn, setTargetReturn] = useState(10);
  const [days, setDays] = useState(30);

  const handleAddSettings = () => {
    if (
      !symbol ||
      !timeframe ||
      !startDate ||
      !endDate ||
      initialBalance <= 0 ||
      days <= 0
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

    const newSetting: MonteCarloSettings = {
      symbol,
      timeframe,
      startDate,
      endDate,
      initialBalance,
      targetReturn: targetReturn / 100,
      days,
    };

    setSettings((prev) => [...prev, newSetting]);
    setSymbol("");
    setTargetReturn(10);
    setDays(30);
    toast({
      title: "Setting Added",
      description: `${symbol} added to the list.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Add Monte Carlo Setting</h3>
      </CardHeader>
      <CardContent>
        <Label htmlFor="symbol">Coin Symbol</Label>
        <Input
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="e.g., BTC/USDT"
        />
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
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Label htmlFor="initialBalance">Initial Balance ($)</Label>
        <Input
          id="initialBalance"
          type="number"
          value={initialBalance}
          onChange={(e) =>
            setInitialBalance(Math.max(0, Number(e.target.value)))
          }
          placeholder="e.g., 100000000"
        />
        <Label htmlFor="targetReturn">Target Return (%)</Label>
        <Input
          id="targetReturn"
          type="number"
          value={targetReturn}
          onChange={(e) => setTargetReturn(Number(e.target.value))}
          placeholder="e.g., 10 for 10%"
          step="0.1"
        />
        <Label htmlFor="days">Prediction Days</Label>
        <Input
          id="days"
          type="number"
          value={days}
          onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
          placeholder="e.g., 30"
        />
        <Button onClick={handleAddSettings} className="w-full">
          Add Setting
        </Button>
      </CardContent>
    </Card>
  );
}
