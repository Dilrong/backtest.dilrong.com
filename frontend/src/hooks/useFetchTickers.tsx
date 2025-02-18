import { useEffect, useState } from "react";
import axios from "axios";

interface TickerOption {
  label: string;
  value: string;
}

export default function useFetchTickers() {
  const [tickers, setTickers] = useState<TickerOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/tickers/")
      .then((response) => {
        const rawTickers = response.data?.data;
        if (Array.isArray(rawTickers)) {
          setTickers(
            rawTickers.map((ticker) => ({ label: ticker, value: ticker }))
          );
        } else {
          console.error("Invalid response format:", response.data);
          setTickers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching tickers:", error);
        setTickers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { tickers, loading };
}
