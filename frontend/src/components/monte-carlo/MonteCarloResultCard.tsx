import { useState } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MonteCarloResultCardProps {
  result: {
    symbol: string;
    result: {
      predicted_price: number;
      probability_above_target: number;
      min_price: number;
      max_price: number;
      final_prices: number[];
    };
  };
}

export function MonteCarloResultCard({ result }: MonteCarloResultCardProps) {
  const isLikely = result.result.probability_above_target > 50;
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{result.symbol}</h3>
            <div className="flex items-center space-x-2">
              {isLikely ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <AlertCircle className="text-red-500" />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOnboardingOpen(true)}
                className="h-6 w-6"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm">
            <span className="font-semibold">Predicted Price:</span> $
            {result.result.predicted_price.toFixed(2)}
          </p>
          <p
            className={`text-lg font-bold ${
              isLikely ? "text-green-600" : "text-red-600"
            }`}
          >
            Prob. Above Target:{" "}
            {result.result.probability_above_target.toFixed(2)}%
          </p>
          <p className="text-sm">
            <span className="font-semibold">Min Price:</span> $
            {result.result.min_price.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Max Price:</span> $
            {result.result.max_price.toFixed(2)}
          </p>

          <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Understanding Monte Carlo Results</DialogTitle>
                <DialogDescription>
                  Here's a quick guide to the Monte Carlo simulation results:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Predicted Price</h4>
                  <p className="text-sm">
                    Average price prediction after the specified days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Prob. Above Target</h4>
                  <p className="text-sm">
                    Probability of exceeding the target return.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Min/Max Price</h4>
                  <p className="text-sm">
                    Minimum and maximum price predictions from the simulation.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsOnboardingOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
