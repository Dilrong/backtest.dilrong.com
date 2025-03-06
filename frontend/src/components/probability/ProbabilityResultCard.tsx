import { useState } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="p-4 border rounded shadow flex flex-col space-y-2 relative">
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
            <Info className="h-4 w-4 text-gray-500" />
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
      <p className="text-xs text-gray-500">
        Chance of achieving {result.result.target_return * 100}% or higher
        return.
      </p>

      {/* 온보딩 모달 */}
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
              <p className="text-sm text-gray-600">
                The average annual return you might expect based on historical
                data.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Volatility</h4>
              <p className="text-sm text-gray-600">
                How much the asset's value fluctuates over time (higher means
                riskier).
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Target Return</h4>
              <p className="text-sm text-gray-600">
                The return you aim to achieve, set by you.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Z-Score</h4>
              <p className="text-sm text-gray-600">
                A statistical measure showing how far your target return is from
                the expected return.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Probability</h4>
              <p className="text-sm text-gray-600">
                The likelihood of achieving your target return or better, based
                on past performance.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOnboardingOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
