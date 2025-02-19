import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortfolioResultCardProps {
  result: {
    name: string;
    result: {
      final_balance: number;
      roi: string;
      mdd: number;
      cagr: string;
    };
  };
}

export function PortfolioResultCard({ result }: PortfolioResultCardProps) {
  return (
    <Card className="shadow-md border rounded-lg">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="font-semibold text-primary">
          {result.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 p-6 items-center">
        <span className="text-sm text-muted-foreground">Final Balance:</span>
        <span className="text-green-500">
          ${result.result.final_balance.toFixed(2)}
        </span>

        <span className="text-sm text-muted-foreground">ROI:</span>
        <span className="text-blue-500">{result.result.roi}</span>

        <span className="text-sm text-muted-foreground">Max Drawdown:</span>
        <span className="text-red-500">{result.result.mdd}%</span>

        <span className="text-sm text-muted-foreground">CAGR:</span>
        <span className="text-blue-500">{result.result.cagr}</span>
      </CardContent>
    </Card>
  );
}
