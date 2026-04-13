// Core crypto asset IDs mapped to CoinGecko's taxonomy
const ASSET_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  BNB: "binancecoin",
  SOL: "solana",
  AVAX: "avalanche-2",
  USDC: "usd-coin",
};

export type LivePrices = Record<string, number>;

/**
 * Fetches live USD prices for core crypto assets from CoinGecko.
 * Uses Next.js Data Cache to revalidate at most once every 60 seconds
 * to strictly stay under the free tier rate limit.
 */
export async function getLivePrices(): Promise<LivePrices> {
  const ids = Object.values(ASSET_MAP).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("CoinGecko API Error:", res.status, res.statusText);
      return fallbackPrices();
    }

    const data = await res.json();
    
    // Map CoinGecko IDs back to our app's symbols (e.g. "bitcoin" -> "BTC")
    const prices: LivePrices = {};
    for (const [symbol, id] of Object.entries(ASSET_MAP)) {
      if (data[id] && typeof data[id].usd === "number") {
        prices[symbol] = data[id].usd;
      }
    }

    // Ensure we always have USDT = $1 if missing
    if (!prices.USDT) prices.USDT = 1.0;

    return prices;
  } catch (error) {
    console.error("Failed to fetch live prices:", error);
    return fallbackPrices();
  }
}

/**
 * Fallback values in case the CoinGecko API is down or rate-limited.
 */
function fallbackPrices(): LivePrices {
  return {
    BTC: 52340.12,
    ETH: 2912.45,
    BNB: 384.21,
    SOL: 114.82,
    AVAX: 34.12,
    USDT: 1.0,
    USDC: 1.0,
  };
}

export type ExtendedMarketData = {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  sparkline_in_7d: { price: number[] };
};

export async function getExtendedMarketData(): Promise<ExtendedMarketData[]> {
  const ids = Object.values(ASSET_MAP).join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=24h`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("CoinGecko API Error:", res.status, res.statusText);
      return fallbackExtendedData();
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch extended market data:", error);
    return fallbackExtendedData();
  }
}

function fallbackExtendedData(): ExtendedMarketData[] {
  return [
    { symbol: "btc", name: "Bitcoin", current_price: 52340.12, price_change_percentage_24h: 2.1, total_volume: 28400000000, market_cap: 842100000000, sparkline_in_7d: { price: [52000, 52100, 52340] } },
    { symbol: "eth", name: "Ethereum", current_price: 2912.45, price_change_percentage_24h: -1.2, total_volume: 14200000000, market_cap: 278400000000, sparkline_in_7d: { price: [2900, 2950, 2912] } },
    { symbol: "bnb", name: "BNB", current_price: 384.21, price_change_percentage_24h: 0.8, total_volume: 1200000000, market_cap: 42100000000, sparkline_in_7d: { price: [380, 382, 384] } },
    { symbol: "sol", name: "Solana", current_price: 114.82, price_change_percentage_24h: 14.2, total_volume: 4800000000, market_cap: 48900000000, sparkline_in_7d: { price: [100, 105, 114] } },
    { symbol: "avax", name: "Avalanche", current_price: 34.12, price_change_percentage_24h: -3.8, total_volume: 842000000, market_cap: 12500000000, sparkline_in_7d: { price: [35, 34.5, 34.12] } },
    { symbol: "usdt", name: "Tether", current_price: 1.0, price_change_percentage_24h: 0.01, total_volume: 50200000000, market_cap: 99100000000, sparkline_in_7d: { price: [1, 1, 1] } },
  ];
}

export function formatCompactNumber(number: number): string {
  const formatter = Intl.NumberFormat("en", { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 });
  return formatter.format(number);
}

export function generateSvgSparkline(prices: number[], width = 80, height = 32): string {
  if (!prices || prices.length === 0) return `M0,${height/2} L${width},${height/2}`;
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1; // avoid division by zero
  
  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((price - min) / range) * height; // Invert Y axis
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  });
  
  return points.join(" ");
}
