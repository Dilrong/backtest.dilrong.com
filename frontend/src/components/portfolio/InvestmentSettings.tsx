import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { REBALANCE_PERIODS } from "@/constants/rebalancePeriod";

interface InvestmentSettingsProps {
  initialBalance: number;
  setInitialBalance: (value: number) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  rebalancePeriod: string;
  setRebalancePeriod: (value: string) => void;
  rebalance: boolean;
  setRebalance: (value: boolean) => void;
  feeRate: number;
  setFeeRate: (value: number) => void;
  slippage: number;
  setSlippage: (value: number) => void;
}

export function InvestmentSettings({
  initialBalance,
  setInitialBalance,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  rebalancePeriod,
  setRebalancePeriod,
  rebalance,
  setRebalance,
  feeRate,
  setFeeRate,
  slippage,
  setSlippage,
}: InvestmentSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label>Initial Balance ($)</Label>
        <Input
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(Number(e.target.value))}
        />

        <Label>Start Date</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Label>End Date</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Label>Rebalance Period</Label>
        <Select value={rebalancePeriod} onValueChange={setRebalancePeriod}>
          <SelectTrigger>
            {rebalancePeriod || "Select Rebalance Period"}
          </SelectTrigger>
          <SelectContent>
            {REBALANCE_PERIODS.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-between">
          <Label>Enable Rebalancing</Label>
          <Switch checked={rebalance} onCheckedChange={setRebalance} />
        </div>

        <Label>Transaction Fee Rate (%)</Label>
        <Input
          type="number"
          value={feeRate}
          step="0.0001"
          onChange={(e) => setFeeRate(Number(e.target.value))}
        />

        <Label>Slippage (%)</Label>
        <Input
          type="number"
          value={slippage}
          step="0.0001"
          onChange={(e) => setSlippage(Number(e.target.value))}
        />
      </CardContent>
    </Card>
  );
}
