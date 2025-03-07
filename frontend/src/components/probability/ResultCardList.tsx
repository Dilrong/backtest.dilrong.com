import { ProbabilityResultCard } from "./ProbabilityResultCard";

interface ProbabilityResult {
  symbol: string;
  result: {
    expected_return: number;
    standard_deviation: number;
    target_return: number;
    z_score: number;
    probability: number;
    value_history: Record<string, number>;
    daily_returns: number[];
  };
}

interface ResultCardListProps {
  results: ProbabilityResult[];
}

export function ResultCardList({ results }: ResultCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result) => (
        <ProbabilityResultCard key={result.symbol} result={result} />
      ))}
    </div>
  );
}
