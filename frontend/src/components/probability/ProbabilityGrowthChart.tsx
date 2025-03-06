import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

interface ProbabilityGrowthChartProps {
  results: {
    symbol: string;
    result: { expected_return: number; target_return: number };
  }[];
  chartData: unknown[];
}

const getSymbolColor = (index: number) => {
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

export function ProbabilityGrowthChart({
  results,
  chartData,
}: ProbabilityGrowthChartProps) {
  console.log("Rendering ProbabilityGrowthChart - Results:", results);
  console.log("Rendering ProbabilityGrowthChart - Chart Data:", chartData);

  const chartConfig = useMemo(() => {
    return results.reduce((config, { symbol }) => {
      config[symbol] = {
        label: `${symbol} Value`,
        color: getSymbolColor(
          results.indexOf({
            symbol,
            result: { expected_return: 0, target_return: 0 },
          })
        ),
      };
      return config;
    }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig;
  }, [results]);

  const lines = useMemo(() => {
    return results.map(({ symbol }, index) => (
      <Line
        key={`${symbol}`}
        name={`${symbol}`}
        dataKey={symbol}
        stroke={getSymbolColor(index)}
        strokeWidth={2}
        dot={false}
        connectNulls
      />
    ));
  }, [results]);

  if (!Array.isArray(chartData) || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Value Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No valid chart data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Value Growth Over Time</CardTitle>
      </CardHeader>
      <CardContent className="w-full overflow-x-auto">
        <ChartContainer config={chartConfig} className="w-full">
          <LineChart
            width={Math.min(window.innerWidth * 0.9, 800)}
            height={300}
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#bbb" />
            <YAxis
              stroke="#bbb"
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {lines}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
