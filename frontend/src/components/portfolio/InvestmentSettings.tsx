import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvestmentSettingsProps {
  initialBalance: number;
  setInitialBalance: (value: number) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

export function InvestmentSettings({
  initialBalance,
  setInitialBalance,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
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
      </CardContent>
    </Card>
  );
}
