import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "react-aria-components";

interface Props {
  onAdd: (ticker: string, percentage: number) => void;
  portfolio?: { ticker: string; percentage: number }[];
}

const schema = z.object({
  ticker: z.string().min(1, "Please enter a ticker."),
  percentage: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .positive("Percentage must be greater than 0.")
      .max(100, "Percentage cannot exceed 100%.")
  ),
});

type FormData = z.infer<typeof schema>;

export default function PortfolioForm({ onAdd, portfolio = [] }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const totalPercentage =
      (portfolio ?? []).reduce((sum, item) => sum + item.percentage, 0) +
      data.percentage;

    if (totalPercentage > 100) {
      setError("percentage", {
        message: "Total allocation cannot exceed 100%.",
      });
      return;
    }

    onAdd(data.ticker.toUpperCase(), data.percentage);
    reset();
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl">
      <h2 className="text-lg font-semibold text-gray-200 mb-4">📌 Add Asset</h2>
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          className="border border-gray-500 bg-black/30 text-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Ticker (e.g., BTC, ETH)"
          {...register("ticker")}
        />
        {errors.ticker && (
          <p className="text-red-500 text-sm">{errors.ticker.message}</p>
        )}

        <Input
          className="border border-gray-500 bg-black/30 text-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Percentage (%)"
          type="number"
          {...register("percentage", { valueAsNumber: true })}
        />
        {errors.percentage && (
          <p className="text-red-500 text-sm">{errors.percentage.message}</p>
        )}

        <Button
          className="border border-gray-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all"
          type="submit"
        >
          ➕ Add
        </Button>
      </form>
    </div>
  );
}
