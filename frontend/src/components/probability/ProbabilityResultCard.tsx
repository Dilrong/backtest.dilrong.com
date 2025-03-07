import { useState } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProbabilityResultCardProps {
  result: {
    symbol: string;
    result: {
      expected_return: number;
      standard_deviation: number;
      target_return: number;
      z_score: number;
      probability: number;
    };
  };
}

export function ProbabilityResultCard({ result }: ProbabilityResultCardProps) {
  const probabilityPercent = result.result.probability * 100;
  const isLikely = probabilityPercent > 50;
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="font-semibold text-primary">
          {result.symbol}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <div className="flex space-x-2">
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
            <span className="font-semibold">Expected Return:</span>{" "}
            {(result.result.expected_return * 100).toFixed(2)}%
          </p>
          <p className="text-sm">
            <span className="font-semibold">Volatility:</span>{" "}
            {(result.result.standard_deviation * 100).toFixed(2)}%
          </p>
          <p className="text-sm">
            <span className="font-semibold">Target Return:</span>{" "}
            {(result.result.target_return * 100).toFixed(2)}%
          </p>
          <p className="text-sm">
            <span className="font-semibold">Z-Score:</span>{" "}
            {result.result.z_score.toFixed(2)}
          </p>
          <p
            className={`text-lg font-bold ${
              isLikely ? "text-green-600" : "text-red-600"
            }`}
          >
            Probability: {probabilityPercent.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-400">
            Chance of achieving {result.result.target_return * 100}% or higher
            return.
          </p>

          <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Understanding Probability Results</DialogTitle>
                <DialogDescription>
                  Here's a quick guide to the numbers on this card:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Expected Return</h4>
                  <p className="text-sm">
                    The average annual return you might expect based on
                    historical data.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Volatility</h4>
                  <p className="text-sm">
                    How much the asset's value fluctuates over time (higher
                    means riskier).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Target Return</h4>
                  <p className="text-sm">
                    The return you aim to achieve, set by you.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Z-Score</h4>
                  <p className="text-sm">
                    A statistical measure showing how far your target return is
                    from the expected return.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Probability</h4>
                  <p className="text-sm">
                    The likelihood of achieving your target return or better,
                    based on past performance.
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
