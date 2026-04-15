"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const TICKER_ASSETS = [
  { symbol: "USDT", label: "USDT", price: 1.0, logo: "/icons/usdt.svg" },
  { symbol: "BTC", label: "BTC", price: 74343.0, logo: "/icons/btc.svg" },
  { symbol: "ETH", label: "ETH", price: 2333.85, logo: "/icons/eth.svg" },
  { symbol: "BNB", label: "BNB", price: 615.17, logo: "/icons/bnb.svg" },
];

export function AnimatedTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate the ticker content for seamless looping
  const tickerItems = [...TICKER_ASSETS, ...TICKER_ASSETS];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let animationId: number;
    let start: number | null = null;
    let scrollLeft = 0;
    const speed = 0.22; // px per ms
    const maxScroll = container.scrollWidth / 2;

    function step(ts: number) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      scrollLeft = maxScroll - ((elapsed * speed) % maxScroll);
      if (container) {
        container.scrollLeft = scrollLeft;
      }
      animationId = requestAnimationFrame(step);
    }
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-hidden border-b border-outline-variant/15 bg-surface-container-low/90 backdrop-blur-md"
      style={{ whiteSpace: "nowrap" }}
    >
      <div className="inline-flex min-w-full" style={{ minWidth: "200%" }}>
        {tickerItems.map((row, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-3 py-1 mx-1"
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
      </div>
    </div>
  );
}
