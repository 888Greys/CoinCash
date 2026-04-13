import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { PortfolioBalance } from "@/components/portfolio-balance";
import { createClient } from "@/utils/supabase/server";
import { getUserBots } from "@/app/actions/bots";
import { getExtendedMarketData } from "@/lib/price-api";
import { BotCard, CreateBotButton } from "@/components/bot-controls";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Trading Bots" };

const botTypes = [
  {
    name: "Grid Trading Bot",
    type: "grid",
    icon: "grid_view",
    iconBg: "bg-primary/10 group-hover:bg-primary/20",
    iconColor: "text-primary",
    description: "Buy low and sell high automatically in volatile markets with custom price ranges.",
  },
  {
    name: "DCA Bot",
    type: "dca",
    icon: "calendar_month",
    iconBg: "bg-secondary/10 group-hover:bg-secondary/20",
    iconColor: "text-secondary",
    description: "Automate your accumulation strategy. Buy assets at regular intervals regardless of price.",
  },
  {
    name: "Arbitrage Bot",
    type: "arbitrage",
    icon: "balance",
    iconBg: "bg-tertiary/10 group-hover:bg-tertiary/20",
    iconColor: "text-tertiary",
    description: "Capitalize on price differences between various trading pairs.",
  },
];

const perfBars: number[] = []; // derived from live data below

export default async function BotPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const [bots, marketData] = await Promise.all([
    getUserBots(),
    getExtendedMarketData(),
  ]);

  // Derive performance bars from BTC 7-day sparkline
  const btcData = marketData.find(a => a.symbol.toUpperCase() === "BTC");
  const rawPrices = btcData?.sparkline_in_7d?.price ?? [];
  // Sample down to ~12 bars for the chart
  const step = Math.max(1, Math.floor(rawPrices.length / 12));
  const sampled = rawPrices.filter((_, i) => i % step === 0).slice(-12);
  const minP = Math.min(...sampled);
  const maxP = Math.max(...sampled);
  const range = maxP - minP || 1;
  const livePerfBars = sampled.length > 0
    ? sampled.map(p => Math.round(((p - minP) / range) * 85) + 10) // 10–95% range
    : [40, 60, 30, 80, 95, 50, 70, 40, 65, 85, 35, 55];
  const runningBots = bots.filter((b) => b.status === "running");
  const totalProfit = bots.reduce((acc, b) => acc + (b.total_profit ?? 0), 0);
  const avgProfitPct = bots.length > 0
    ? bots.reduce((acc, b) => acc + (b.profit_percentage ?? 0), 0) / bots.length
    : 0;

  return (
    <AppShell currentPath="/bot" user={user ? { email: user.email, ...profile } : null}>
      <div className="px-4 pt-6 max-w-4xl mx-auto space-y-6">
        {/* Portfolio Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 bg-surface-container-high p-6 rounded relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">insights</span>
            </div>
            <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant mb-2">
              Portfolio Overview
            </p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary tracking-tight">
                  $<PortfolioBalance />
                </h2>
                <p className="text-xs text-secondary-dim font-medium mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  Total bot profit: {totalProfit >= 0 ? "+" : ""}${totalProfit.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant">Active Bots</p>
                  <p className="font-headline text-xl font-bold">{String(runningBots.length).padStart(2, "0")}</p>
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant">Avg. Profit</p>
                  <p className={`font-headline text-xl font-bold ${avgProfitPct >= 0 ? "text-primary" : "text-error"}`}>
                    {avgProfitPct >= 0 ? "+" : ""}{avgProfitPct.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bot Marketplace */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">
              Bot Marketplace
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {botTypes.map((bot) => (
              <div
                key={bot.name}
                className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/15 hover:bg-surface-container-high transition-all group"
              >
                <div className={`w-10 h-10 ${bot.iconBg} rounded flex items-center justify-center mb-4 transition-colors`}>
                  <span className={`material-symbols-outlined ${bot.iconColor}`}>{bot.icon}</span>
                </div>
                <h4 className="font-headline font-bold text-base mb-1">{bot.name}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-6">{bot.description}</p>
                <CreateBotButton type={bot.type} />
              </div>
            ))}
          </div>
        </section>

        {/* Active Deployments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">
              My Bots
            </h3>
            <div className="flex gap-2">
              <span className="bg-surface-container-high px-3 py-1 rounded text-[10px] font-bold uppercase text-primary border border-primary/10">
                Running ({runningBots.length})
              </span>
            </div>
          </div>

          {bots.length === 0 ? (
            <EmptyState
              title="No bots deployed yet"
              description="Use the marketplace above to launch your first automation strategy and track performance in real time."
              icon="smart_toy"
              className="rounded"
            />
          ) : (
            <div className="space-y-3">
              {bots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
              ))}
            </div>
          )}
        </section>

        {/* Bot Performance Chart */}
        <section className="bg-surface-container-low p-6 rounded relative overflow-hidden border border-outline-variant/10 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">
                Bot Performance
              </h3>
              <p className="text-xs text-on-surface-variant">
                Real-time performance across all algorithms.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live
            </div>
          </div>
          <div className="h-32 flex items-end justify-between gap-1">
            {livePerfBars.map((h, i) => (
              <div
                key={i}
                className={`w-full ${h >= 85 ? "bg-primary" : "bg-primary/20"} rounded-t-sm transition-all duration-500`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[8px] uppercase font-black tracking-widest text-on-surface-variant">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>Now</span>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
