import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#00C6FF",
  "#007BFF",
  "#00E396",
  "#FF4560",
  "#775DD0",
  "#FEB019",
];

interface PortfolioItem {
  id: number;
  ticker: string;
  percentage: number;
}

interface Props {
  portfolio: PortfolioItem[];
}

export default function PortfolioPieChart({ portfolio }: Props) {
  if (portfolio.length === 0)
    return (
      <p className="text-gray-400 text-center mt-4">
        📉 Input Your Portfolio data
      </p>
    );

  return (
    <div className="w-full max-w-lg mx-auto mt-6 bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl">
      <h3 className="text-lg font-bold text-gray-200 text-center">
        📊 Portfolio
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={portfolio}
            dataKey="percentage"
            nameKey="ticker"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {portfolio.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#1E1E1E"
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
