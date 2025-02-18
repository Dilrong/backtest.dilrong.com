import { Button } from "react-aria-components";

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
    <ul className="w-full max-w-lg mx-auto mt-6 space-y-3">
      {portfolio.map((item) => (
        <li
          key={item.id}
          className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-lg rounded-lg shadow-md"
        >
          <span className="text-gray-300">
            {item.ticker} - {item.percentage}%
          </span>
          <Button
            className="text-red-400 hover:text-red-500 transition-all"
            onPress={() => onRemove(item.id)}
          >
            ❌
          </Button>
        </li>
      ))}
    </ul>
  );
}
