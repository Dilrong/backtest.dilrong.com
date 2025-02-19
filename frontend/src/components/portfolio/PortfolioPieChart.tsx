import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";
import { useTheme } from "@/components/layout/theme-provider";

interface PortfolioItem {
  id: number;
  ticker: string;
  percentage: number;
}

interface Props {
  portfolio: PortfolioItem[];
}

export default function PortfolioPieChart({ portfolio }: Props) {
  const { theme } = useTheme();
  const colors =
    theme === "dark"
      ? ["#1E88E5", "#D32F2F", "#7B1FA2", "#388E3C", "#FBC02D", "#0288D1"]
      : ["#42A5F5", "#E57373", "#BA68C8", "#81C784", "#FFD54F", "#29B6F6"];

  const totalPercentage = portfolio.reduce(
    (acc, item) => acc + item.percentage,
    0
  );

  if (portfolio.length === 0) {
    return (
      <Card className="w-full max-w-lg mx-auto mt-6">
        <CardContent className="text-center text-muted-foreground py-6">
          No portfolio data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto mt-6 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg text-center">Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="w-full max-w-xs flex justify-center">
          <PieChart width={250} height={250}>
            <Tooltip formatter={(value) => `${value}%`} />
            <Pie
              data={portfolio}
              dataKey="percentage"
              nameKey="ticker"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              stroke="none"
              labelLine={false}
            >
              {portfolio.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-2xl font-bold"
                        >
                          {totalPercentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="text-sm"
                        >
                          Allocation
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total portfolio allocation
        </div>
      </CardFooter>
    </Card>
  );
}
