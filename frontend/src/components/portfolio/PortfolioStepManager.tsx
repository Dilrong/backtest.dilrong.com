import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PortfolioForm from "./PortfolioForm";
import PortfolioList from "./PortfolioList";

interface PortfolioItem {
  id: number;
  ticker: string;
  percentage: number;
}

interface PortfolioStepManagerProps {
  portfolioName: string;
  setPortfolioName: (value: string) => void;
  currentPortfolio: PortfolioItem[];
  setCurrentPortfolio: (
    value: PortfolioItem[] | ((prev: PortfolioItem[]) => PortfolioItem[])
  ) => void;
  onSave: () => void;
}

export function PortfolioStepManager({
  portfolioName,
  setPortfolioName,
  currentPortfolio,
  setCurrentPortfolio,
  onSave,
}: PortfolioStepManagerProps) {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label>Portfolio Name</Label>
        <Input
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
          placeholder="Enter portfolio name"
        />
        <PortfolioForm
          onAdd={(ticker, percentage) => {
            if (currentPortfolio.some((item) => item.ticker === ticker)) {
              toast({
                variant: "destructive",
                title: "Duplicate Asset",
                description: "This asset is already in the portfolio.",
              });
              return;
            }
            setCurrentPortfolio((prev) => [
              ...(prev ?? []),
              { id: Date.now(), ticker, percentage },
            ]);
          }}
        />
        <PortfolioList
          portfolio={currentPortfolio}
          onRemove={(id) =>
            setCurrentPortfolio((prev) => prev.filter((item) => item.id !== id))
          }
        />
        <Button
          onClick={onSave}
          variant="default"
          className="w-full"
          disabled={!portfolioName.trim() || currentPortfolio.length === 0}
        >
          Save Portfolio
        </Button>
      </CardContent>
    </Card>
  );
}
