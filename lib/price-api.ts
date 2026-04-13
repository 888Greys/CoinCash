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
