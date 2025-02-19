import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface PortfolioItem {
  id: number;
  ticker: string;
  percentage: number;
}

interface Props {
  portfolio: PortfolioItem[];
  onRemove: (id: number) => void;
}

export default function PortfolioList({ portfolio, onRemove }: Props) {
  return (
    <div className="w-full max-w-lg mx-auto mt-4 space-y-2">
      {portfolio.map((item) => (
        <Card key={item.id} className="shadow-sm">
          <CardContent className="flex justify-between items-center p-3 text-gray-200">
            <div className="flex items-center gap-3">
              <span className="font-medium">{item.ticker}</span>
              <span className="text-sm text-muted-foreground">
                {item.percentage}%
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
