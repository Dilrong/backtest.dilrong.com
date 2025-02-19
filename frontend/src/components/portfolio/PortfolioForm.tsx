import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { useToast } from "@/hooks/use-toast";
import { SUPPORTED_ASSETS } from "../../constants/supportedAssets";

interface PortfolioItem {
  ticker: string;
  percentage: number;
}

interface PortfolioFormProps {
  onAdd: (ticker: string, percentage: number) => void;
  currentPortfolio?: PortfolioItem[];
}

export default function PortfolioForm({
  onAdd,
  currentPortfolio = [],
}: PortfolioFormProps) {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<string>("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!selectedTicker) {
      toast({
        variant: "destructive",
        title: "Asset not selected",
        description: "Please select an asset to add to your portfolio.",
      });
      return;
    }

    const parsedPercentage = percentage !== "" ? parseFloat(percentage) : NaN;

    if (
      isNaN(parsedPercentage) ||
      parsedPercentage <= 0 ||
      parsedPercentage > 100
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Percentage",
        description: "Percentage must be between 1 and 100.",
      });
      return;
    }

    const totalPercentage =
      (Array.isArray(currentPortfolio)
        ? currentPortfolio.reduce((acc, item) => acc + item.percentage, 0)
        : 0) + parsedPercentage;

    if (totalPercentage > 100) {
      toast({
        variant: "destructive",
        title: "Total Percentage Exceeded",
        description: `Total allocation cannot exceed 100%. Current: ${
          totalPercentage - parsedPercentage
        }%`,
      });
      setPercentage("");
      return;
    }

    onAdd(selectedTicker, parsedPercentage);
    setSelectedTicker(null);
    setPercentage("");

    toast({
      title: "Asset added",
      description: `${selectedTicker} (${parsedPercentage}%) added successfully.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Add Asset
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <Label htmlFor="percentage" className="text-sm">
          Percentage
        </Label>
        <Input
          id="percentage"
          type="number"
          value={percentage}
          onChange={(e) =>
            setPercentage(e.target.value.replace(/[^0-9.]/g, ""))
          }
          placeholder="Enter value"
          min={1}
          max={100}
          className="mb-4"
        />

        <Button
          onClick={handleAdd}
          disabled={!selectedTicker || !percentage}
          className="w-full"
        >
          Add to Portfolio
        </Button>
      </CardContent>
    </Card>
  );
}
