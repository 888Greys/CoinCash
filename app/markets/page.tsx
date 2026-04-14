import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { getExtendedMarketData, formatCompactNumber, generateSvgSparkline } from "@/lib/price-api";
import { createClient } from "@/utils/supabase/server";
import { MarketsTable } from "@/components/markets-table";

export const metadata: Metadata = { title: "Markets" };

const SPOTLIGHT_FALLBACK = "M0,28 L10,20 L20,22 L30,10 L40,12 L50,5 L60,8 L70,1 L80,3";

export default async function MarketsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("username, avatar_url").eq("id", user.id).single();
    profile = data;
  }

  const extendedData = await getExtendedMarketData();

  // Map live prices onto our static visual layout
  const marketDataDynamic = extendedData.map(asset => {
    let symbolStr = asset.symbol.toUpperCase();
    if (symbolStr === "AVALANCHE-2") symbolStr = "AVAX";
    
    // Presentation overrides
    const presentationMap: Record<string, any> = {
      BTC: { logo: "/icons/btc.svg", color: "text-primary" },
      ETH: { logo: "/icons/eth.svg", color: "text-tertiary" },
      SOL: { logo: "/icons/sol.svg", color: "text-secondary" },
      AVAX: { logo: "/icons/avax.svg", color: "text-error" },
      USDT: { logo: "/icons/usdt.svg", color: "text-[#26A17B]" },
      BNB: { logo: "/icons/bnb.svg", color: "text-[#f3ba2f]" },
    };
    
    const style = presentationMap[symbolStr] || { logo: "", color: "text-primary" };
    
    return {
      symbol: symbolStr,
      name: asset.name,
      logo: style.logo,
      price: `$${asset.current_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`,
      change: `${asset.price_change_percentage_24h >= 0 ? '+' : ''}${asset.price_change_percentage_24h.toFixed(2)}%`,
      isPositive: asset.price_change_percentage_24h >= 0,
      volume: `$${formatCompactNumber(asset.total_volume)}`,
      marketCap: `$${formatCompactNumber(asset.market_cap)}`,
      sparkline: generateSvgSparkline(asset.sparkline_in_7d?.price || []),
      color: style.color,
      raw_change: asset.price_change_percentage_24h || 0,
      raw_volume: asset.total_volume || 0,
    };
  });

  // Calculate Spotlights
  const topGainer = [...marketDataDynamic].sort((a, b) => b.raw_change - a.raw_change)[0];
  const highVolume = [...marketDataDynamic].sort((a, b) => b.raw_volume - a.raw_volume)[0];
  
  const spotlightCards = [
    {
      label: "Top Gainer",
      badge: topGainer?.change || "+0%",
      badgeColor: topGainer?.isPositive ? "text-primary" : "text-error",
      pair: `${topGainer?.symbol || "N/A"}/USD`,
      price: topGainer?.price || "$0.00",
      sparkline: topGainer?.sparkline || SPOTLIGHT_FALLBACK,
      strokeColor: topGainer?.isPositive ? "stroke-primary" : "stroke-error",
    },
    {
      label: "High Volume",
      badge: highVolume?.volume || "$0",
      badgeColor: "text-on-surface",
      pair: `${highVolume?.symbol || "N/A"}/USD`,
      price: highVolume?.price || "$0.00",
      sparkline: highVolume?.sparkline || SPOTLIGHT_FALLBACK,
      strokeColor: "stroke-on-surface-variant",
    },
    {
      label: "New Listing",
      badge: "Active",
      badgeColor: "text-tertiary",
      pair: "TIA/USD",
      price: "$18.45",
      sparkline: SPOTLIGHT_FALLBACK,
      strokeColor: "stroke-tertiary",
    },
  ];

  const globalVolRaw = Object.values(extendedData).reduce((acc, curr) => acc + (curr.total_volume || 0), 0);
  const globalVol = `$${formatCompactNumber(globalVolRaw)}`;

  return (
    <AppShell currentPath="/markets" user={user ? { email: user.email, ...profile } : null}>
      <div className="px-4 md:px-8 pt-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
              Market Overview
            </h1>
            <div className="flex items-center gap-4 text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              <span>Global Vol: {globalVol}</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span>BTC Dom: 52.4%</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span className="text-primary">Gas: 18 Gwei</span>
            </div>
          </div>
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">search</span>
            </div>
            <input
              className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 text-on-surface text-xs font-label uppercase tracking-widest pl-10 py-3 rounded-sm outline outline-1 outline-outline-variant/15 transition-all"
              placeholder="SEARCH ASSETS..."
              type="text"
            />
          </div>
        </div>

        {/* Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {spotlightCards.map((card) => (
            <div
              key={card.pair}
              className="bg-surface-container-low p-5 flex flex-col justify-between group hover:bg-surface-container-high transition-colors rounded-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  {card.label}
                </span>
                <span className={`${card.badgeColor} text-xs font-bold`}>
                  {card.badge}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-headline text-2xl font-bold">{card.pair}</div>
                  <div className="font-headline text-lg text-on-surface-variant">
                    {card.price}
                  </div>
                </div>
                <svg className={`w-20 h-8 fill-none ${card.strokeColor}`} strokeWidth="1.5" viewBox="0 0 80 32">
                  <path d={card.sparkline} />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Markets — search + table (client component) */}
        <MarketsTable assets={marketDataDynamic} totalCount={marketDataDynamic.length} />
      </div>
    </AppShell>
  );
}
