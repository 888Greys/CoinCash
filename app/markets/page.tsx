import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import Image from "next/image";
import { getExtendedMarketData, formatCompactNumber, generateSvgSparkline } from "@/lib/price-api";
import { createClient } from "@/utils/supabase/server";

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
              className="bg-surface-container-low p-5 flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
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

        {/* Market Table */}
        <div className="bg-surface-container-low overflow-hidden">
          {/* Tab Filters */}
          <div className="flex border-b border-outline-variant/15 px-6">
            <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] bg-surface-bright text-on-surface transition-all">
              All
            </button>
            <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-all">
              Favorites
            </button>
            <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-all">
              Hot
            </button>
            <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-all">
              New Listings
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                  <th className="px-6 py-4 font-medium">Asset</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">24h Change</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">24h Volume</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Market Cap</th>
                  <th className="px-6 py-4 font-medium text-right">Last 7 Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {marketDataDynamic.map((asset) => (
                  <tr
                    key={asset.symbol}
                    className="hover:bg-surface-bright transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-headline text-xs ${asset.color}`}>
                          {asset.logo ? (
                            <Image src={asset.logo} alt={asset.name} width={24} height={24} unoptimized />
                          ) : (
                            asset.symbol[0]
                          )}
                        </div>
                        <div>
                          <div className="font-headline font-bold text-sm">{asset.symbol}</div>
                          <div className="font-label text-[9px] text-on-surface-variant tracking-widest uppercase">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-headline font-bold">{asset.price}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`font-label text-xs font-bold ${asset.isPositive ? "text-primary" : "text-error"}`}>
                        {asset.change}
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="font-label text-xs text-on-surface-variant">{asset.volume}</div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="font-label text-xs text-on-surface-variant">{asset.marketCap}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <svg
                          className={`w-20 h-8 fill-none ${asset.isPositive ? "stroke-primary" : "stroke-error"} opacity-70 group-hover:opacity-100 transition-opacity`}
                          strokeWidth="1.5"
                          viewBox="0 0 80 32"
                        >
                          <path d={asset.sparkline} />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex justify-between items-center px-6 py-4 bg-surface-container-low border-t border-outline-variant/10">
            <div className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest">
              Showing 1-5 of 142 Assets
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-surface-container-high hover:bg-surface-bright transition-colors rounded-sm group">
                <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary">
                  chevron_left
                </span>
              </button>
              <button className="p-2 bg-surface-container-high hover:bg-surface-bright transition-colors rounded-sm group">
                <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
