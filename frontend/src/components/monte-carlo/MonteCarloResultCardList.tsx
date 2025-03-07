import { MonteCarloResultCard } from "./MonteCarloResultCard";

interface MonteCarloResult {
  symbol: string;
  result: {
    predicted_price: number;
    probability_above_target: number;
    min_price: number;
    max_price: number;
    final_prices: number[];
  };
}

interface MonteCarloResultCardListProps {
  results: MonteCarloResult[];
}

export function MonteCarloResultCardList({
  results,
}: MonteCarloResultCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result) => (
        <MonteCarloResultCard key={result.symbol} result={result} />
      ))}
    </div>
  );
}
