import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PortfolioGrowthChartProps {
  results: { name: string }[];
  chartData: unknown[];
}

const getPortfolioColor = (index: number) => {
  const colors = [
    "#009EFF",
    "#FF5733",
    "#6A00FF",
    "#00C853",
    "#FFC400",
    "#E91E63",
    "#9C27B0",
    "#3F51B5",
    "#FF9800",
  ];
  return colors[index % colors.length];
};

const chartConfig = {
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
} satisfies ChartConfig;

export function PortfolioGrowthChart({
  results,
  chartData,
}: PortfolioGrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            width={Math.min(window.innerWidth * 0.9, 800)}
            height={300}
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#bbb" />
            <YAxis
              stroke="#bbb"
              tickFormatter={(value) => `${value.toFixed(2)}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {results.map(({ name }, index) => (
              <Line
                key={name}
                name={name}
                dataKey={name}
                stroke={getPortfolioColor(index)}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
