import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, PieChart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PortfolioPieChart from "./PortfolioPieChart";

interface PortfolioItem {
  id: number;
  ticker: string;
  percentage: number;
}

interface Portfolio {
  id: number;
  name: string;
  data: PortfolioItem[];
  initialBalance: number;
  startDate: string;
  endDate: string;
}

interface Props {
  portfolios: Portfolio[];
  onDelete: (id: number) => void;
}

export default function SavedPortfolioList({ portfolios, onDelete }: Props) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Saved Portfolios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((p) => (
              <Card key={p.id} className="relative">
                <CardContent className="p-4 space-y-2 text-center">
                  <span className="font-medium text-lg">{p.name}</span>
                  <div className="text-sm text-muted-foreground flex flex-col">
                    {p.data.slice(0, 3).map((item, index) => (
                      <span key={item.id}>
                        {item.ticker} ({item.percentage}%)
                        {index < 2 && index < p.data.length - 1}
                      </span>
                    ))}
                    {p.data.length > 3 && (
                      <span className="text-gray-500">
                        {" "}
                        +{p.data.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-center gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPortfolio(p)}
                    >
                      <PieChart className="w-5 h-5 text-gray-400 hover:text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(p.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedPortfolio}
        onOpenChange={() => setSelectedPortfolio(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPortfolio?.name} Allocation</DialogTitle>
          </DialogHeader>
          {selectedPortfolio && (
            <PortfolioPieChart portfolio={selectedPortfolio.data} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
