"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type TickerSymbol = "USDT" | "BTC" | "ETH" | "BNB";

type TickerRow = {
  symbol: TickerSymbol;
  label: string;
  logo: string;
  price: number;
};

const API_IDS = "tether,bitcoin,ethereum,binancecoin";

const STARTING: TickerRow[] = [
  { symbol: "USDT", label: "Tether", logo: "/icons/usdt.svg", price: 1.0 },
  { symbol: "BTC", label: "Bitcoin", logo: "/icons/btc.svg", price: 52340.12 },
  { symbol: "ETH", label: "Ethereum", logo: "/icons/eth.svg", price: 2912.45 },
  { symbol: "BNB", label: "BNB", logo: "/icons/bnb.svg", price: 384.21 },
];

function mapApiToRows(payload: any): TickerRow[] {
  return [
    {
      symbol: "USDT",
      label: "Tether",
      logo: "/icons/usdt.svg",
      price: typeof payload?.tether?.usd === "number" ? payload.tether.usd : 1.0,
    },
    {
      symbol: "BTC",
      label: "Bitcoin",
      logo: "/icons/btc.svg",
      price: typeof payload?.bitcoin?.usd === "number" ? payload.bitcoin.usd : STARTING[1].price,
    },
    {
      symbol: "ETH",
      label: "Ethereum",
      logo: "/icons/eth.svg",
      price: typeof payload?.ethereum?.usd === "number" ? payload.ethereum.usd : STARTING[2].price,
    },
    {
      symbol: "BNB",
      label: "BNB",
      logo: "/icons/bnb.svg",
      price: typeof payload?.binancecoin?.usd === "number" ? payload.binancecoin.usd : STARTING[3].price,
    },
  ];
}

export function LiveMarketStrip() {
  const [rows, setRows] = useState<TickerRow[]>(STARTING);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${API_IDS}&vs_currencies=usd`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;

        const payload = await res.json();
        if (!active) return;

        setRows(mapApiToRows(payload));
      } catch {
        // Keep last known prices when API is temporarily unavailable.
      }
    };

    refresh();
    const timer = setInterval(refresh, 60000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const updatedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="border-b border-outline-variant/15 bg-surface-container-low/90 backdrop-blur-md">
      <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 md:px-6">
        {rows.map((row) => (
          <div
            key={row.symbol}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-3 py-1"
          >
            <Image src={row.logo} alt={row.symbol} width={14} height={14} unoptimized />
            <span className="font-label text-[9px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
              {row.symbol}
            </span>
            <span className="font-mono text-[11px] font-bold text-on-surface">
              ${row.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: row.symbol === "USDT" ? 4 : 2 })}
            </span>
          </div>
        ))}
        <span className="ml-auto hidden shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-primary md:inline">
          Live • {updatedAt}
        </span>
      </div>
    </div>
  );
}
