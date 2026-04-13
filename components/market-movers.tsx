"use client";

import { useState } from "react";
import Image from "next/image";

type MoverRow = {
  symbol: string;
  name: string;
  logo: string;
  price: string;
  change: string;
  isPositive: boolean;
};

const marketData: Record<string, MoverRow[]> = {
  gainers: [
    { symbol: "SOL", name: "Solana", logo: "/icons/sol.svg", price: "114.24", change: "+12.4%", isPositive: true },
    { symbol: "AVAX", name: "Avalanche", logo: "/icons/avax.svg", price: "38.91", change: "+8.7%", isPositive: true },
    { symbol: "BNB", name: "Binance Coin", logo: "/icons/bnb.svg", price: "384.21", change: "+4.1%", isPositive: true },
  ],
  losers: [
    { symbol: "LINK", name: "Chainlink", logo: "/icons/link.svg", price: "18.21", change: "-4.2%", isPositive: false },
    { symbol: "BTC", name: "Bitcoin", logo: "/icons/btc.svg", price: "52,340.12", change: "-1.1%", isPositive: false },
    { symbol: "USDC", name: "USD Coin", logo: "/icons/usdc.svg", price: "1.00", change: "-0.01%", isPositive: false },
  ],
  volume: [
    { symbol: "BTC", name: "Bitcoin", logo: "/icons/btc.svg", price: "52,340.12", change: "28.4B Vol", isPositive: true },
    { symbol: "ETH", name: "Ethereum", logo: "/icons/eth.svg", price: "2,912.45", change: "14.2B Vol", isPositive: true },
    { symbol: "USDT", name: "Tether", logo: "/icons/usdt.svg", price: "1.00", change: "50.1B Vol", isPositive: true },
  ],
};

export function MarketMovers() {
  const [activeTab, setActiveTab] = useState<"gainers" | "losers" | "volume">("gainers");

  const currentData = marketData[activeTab];

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          Market Overview
        </h2>
      </div>

      <div className="bg-surface-container-low rounded-lg border border-outline-variant/10 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant/10">
          <button
            onClick={() => setActiveTab("gainers")}
            className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-colors ${
              activeTab === "gainers" ? "text-primary border-b-2 border-primary bg-surface-container-highest/20" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => setActiveTab("losers")}
            className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-colors ${
              activeTab === "losers" ? "text-error border-b-2 border-error bg-surface-container-highest/20" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Losers
          </button>
          <button
            onClick={() => setActiveTab("volume")}
            className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-colors ${
              activeTab === "volume" ? "text-secondary border-b-2 border-secondary bg-surface-container-highest/20" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            24h Vol
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-outline-variant/10">
          {currentData.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between p-4 active:bg-surface-container transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <Image src={asset.logo} alt={asset.symbol} width={28} height={28} unoptimized />
                </div>
                <div>
                  <p className="font-bold text-sm">{asset.symbol}</p>
                  <p className="text-[10px] text-on-surface-variant">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{asset.price}</p>
                <div className="flex items-center justify-end gap-1">
                  <p className={`text-[10px] font-bold ${asset.isPositive ? 'text-primary' : 'text-error'}`}>
                    {asset.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
