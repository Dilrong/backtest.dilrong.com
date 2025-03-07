import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface MonteCarloHistogramProps {
  result: {
    predicted_price: number;
    probability_above_target: number;
    min_price: number;
    max_price: number;
    final_prices: number[];
  };
  targetPrice: number;
}

const createHistogramData = (finalPrices: number[], bins: number = 20) => {
  const min = Math.min(...finalPrices);
  const max = Math.max(...finalPrices);
  const binWidth = (max - min) / bins;
  const histogram = Array(bins)
    .fill(0)
    .map((_, i) => ({
      priceRange: `${(min + i * binWidth).toFixed(0)}-${(
        min +
        (i + 1) * binWidth
      ).toFixed(0)}`,
      frequency: 0,
    }));

  finalPrices.forEach((price) => {
    const binIndex = Math.min(Math.floor((price - min) / binWidth), bins - 1);
    histogram[binIndex].frequency += 1;
  });

  return histogram;
};

const chartConfig = {
  frequency: { label: "Frequency", color: "hsl(var(--chart-1))" },
  predicted: { label: "Predicted Price", color: "hsl(var(--chart-2))" },
  target: { label: "Target Price", color: "hsl(var(--chart-3))" },
};

export function MonteCarloHistogram({
  result,
  targetPrice,
}: MonteCarloHistogramProps) {
  const histogramData = createHistogramData(result.final_prices);

  return (
    <ChartContainer config={chartConfig} className="w-full h-[400px]">
      <BarChart data={histogramData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="priceRange"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={60}
        />
        <YAxis />
        <Bar dataKey="frequency" fill="hsl(var(--chart-1))" />
        <ReferenceLine
          y={result.predicted_price}
          stroke="red"
          label="Predicted"
        />
        <ReferenceLine y={targetPrice} stroke="blue" label="Target" />
        <Tooltip content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  );
}
