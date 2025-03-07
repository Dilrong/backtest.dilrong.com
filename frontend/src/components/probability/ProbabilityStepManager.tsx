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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Combobox } from "../ui/combobox";
import { SUPPORTED_ASSETS } from "@/constants/supportedAssets";
import { useToast } from "@/hooks/use-toast";

interface ProbabilitySettings {
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  targetReturn: number;
}

interface ProbabilityStepManagerProps {
  settings: ProbabilitySettings[];
  setSettings: React.Dispatch<React.SetStateAction<ProbabilitySettings[]>>;
}

export function ProbabilityStepManager({
  setSettings,
}: ProbabilityStepManagerProps) {
  const { toast } = useToast();

  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("1d");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-01-31");
  const [initialBalance, setInitialBalance] = useState(10000);
  const [targetReturn, setTargetReturn] = useState(5);

  const handleAddSettings = () => {
    if (
      !selectedTicker ||
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
      symbol: selectedTicker,
      timeframe,
      startDate,
      endDate,
      initialBalance,
      targetReturn: targetReturn / 100,
    };

    setSettings((prev) => [...prev, newSetting]);
    setSelectedTicker(null);
    setTargetReturn(5);
    toast({
      title: "Setting Added",
      description: `${selectedTicker} added to the list.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Probability Setting</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="asset" className="text-sm">
          Asset
        </Label>
        <Combobox
          options={SUPPORTED_ASSETS.map((asset) => ({
            value: asset,
            label: asset,
          }))}
          value={selectedTicker}
          onChange={setSelectedTicker}
          placeholder="Select an asset"
        />
        <Label htmlFor="timeframe" className="mt-4">
          Timeframe
        </Label>
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
        <Label htmlFor="startDate" className="text-sm">
          Start Date
        </Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mb-4"
        />
        <Label htmlFor="endDate" className="text-sm">
          End Date
        </Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mb-4"
        />
        <Label htmlFor="initialBalance" className="text-sm">
          Initial Balance ($)
        </Label>
        <Input
          id="initialBalance"
          type="number"
          value={initialBalance}
          onChange={(e) =>
            setInitialBalance(Math.max(0, Number(e.target.value)))
          }
          placeholder="e.g., 10000"
          className="mb-4"
        />
        <Label htmlFor="targetReturn" className="text-sm">
          Target Return (%)
        </Label>
        <Input
          id="targetReturn"
          type="number"
          value={targetReturn}
          onChange={(e) => setTargetReturn(Number(e.target.value))}
          placeholder="e.g., 5 for 5%"
          step="0.1"
          className="mb-4"
        />
        <Button onClick={handleAddSettings} className="w-full">
          Add Setting
        </Button>
      </CardContent>
    </Card>
  );
}
