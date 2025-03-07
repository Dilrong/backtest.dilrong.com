import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface ProbabilityGrowthChartProps {
  results: {
    symbol: string;
    result: {
      expected_return: number;
      target_return: number;
      standard_deviation: number;
    };
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: { [key: string]: any; date: string }[];
}

const chartConfig = {
  value: { label: "Value ($)" },
} satisfies ChartConfig;

const getSymbolColor = (
  index: number,
  volatility: number,
  maxVolatility: number
) => {
  const baseColors = [
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
  const baseColor = baseColors[index % baseColors.length];
  const normalizedVolatility =
    maxVolatility > 0 ? Math.min(volatility / maxVolatility, 1) : 0;
  const opacity = 0.7 + normalizedVolatility * 0.5;
  return `${baseColor}${Math.round(Math.min(opacity, 1) * 255)
    .toString(16)
    .padStart(2, "0")}`;
};

export function ProbabilityGrowthChart({
  results,
  chartData,
}: ProbabilityGrowthChartProps) {
  const maxVolatility =
    chartData.length > 0
      ? Math.max(
          ...chartData.flatMap((d) =>
            results.map((r) => d[`${r.symbol}_volatility`] || 0)
          )
        )
      : 0;

  if (!Array.isArray(chartData) || chartData.length === 0) {
    return (
      <Card>
        <CardContent>
          <p>No valid chart data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart
            width={Math.min(window.innerWidth * 0.9, 800)}
            height={300}
            data={chartData}
            barGap={4}
            barCategoryGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border p-2 bg-background">
                      <div className="grid gap-2">
                        <div className="font-bold">
                          {payload[0].payload.date}
                        </div>
                        {payload.map((item, idx) => {
                          const symbol = item.dataKey as string;
                          const volatility =
                            item.payload[`${symbol}_volatility`];
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span>
                                {symbol}: ${Number(item.value).toFixed(2)}
                              </span>
                              {volatility !== undefined && (
                                <span>
                                  (Volatility: {(volatility * 100).toFixed(2)}%)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {results.map(({ symbol }, index) => (
              <Bar
                key={`${symbol}`}
                name={`${symbol} Value`}
                dataKey={symbol}
                barSize={20}
                fill={getSymbolColor(index, 0, maxVolatility)}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
