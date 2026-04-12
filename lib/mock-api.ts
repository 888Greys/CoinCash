export async function getMockData<T>(key: string, delayMs = 1500): Promise<T> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return mockDatabase[key] as T;
}

export type MarketRow = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  volume: string;
  isPositive: boolean;
  sparkline: string;
};

const mockDatabase: Record<string, any> = {
  markets: [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: "$64,231.50",
      change: "+2.4%",
      volume: "$24.5B",
      isPositive: true,
      sparkline: "M0 15 L20 12 L40 16 L60 8 L80 12 L100 5",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: "$3,450.20",
      change: "+1.8%",
      volume: "$12.1B",
      isPositive: true,
      sparkline: "M0 18 L20 15 L40 10 L60 14 L80 8 L100 4",
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: "$142.80",
      change: "+5.2%",
      volume: "$3.2B",
      isPositive: true,
      sparkline: "M0 20 L20 10 L40 18 L60 8 L80 14 L100 2",
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: "$0.582",
      change: "-1.2%",
      volume: "$450M",
      isPositive: false,
      sparkline: "M0 5 L20 12 L40 8 L60 16 L80 10 L100 18",
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      price: "$0.142",
      change: "+8.4%",
      volume: "$1.8B",
      isPositive: true,
      sparkline: "M0 18 L20 12 L40 6 L60 14 L80 8 L100 2",
    },
    {
      symbol: "DOT",
      name: "Polkadot",
      price: "$8.45",
      change: "-0.5%",
      volume: "$320M",
      isPositive: false,
      sparkline: "M0 8 L20 5 L40 15 L60 10 L80 16 L100 12",
    },
  ],
};
