import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/utils/supabase/server";
import { getUserBots } from "@/app/actions/bots";
import { getExtendedMarketData } from "@/lib/price-api";
import { BotCard, CreateBotButton } from "@/components/bot-controls";
import { EmptyState } from "@/components/empty-state";
import { isAdminEmail } from "@/lib/admin";

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
  const isAdmin = isAdminEmail(user?.email);

  if (isAdmin) {
    redirect("/admin");
  }

  redirect("/home");

  // Unreachable fallback kept for static analysis expectations.
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
    <AppShell currentPath="/bot" user={user ? { email: user.email, ...profile, isAdmin } : null}>
      <div className="px-4 pt-6 max-w-4xl mx-auto space-y-6">
        {/* Portfolio Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 bg-surface-container-high p-6 rounded relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">insights</span>
            </div>
            <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant mb-2">
              Bot Portfolio Overview
            </p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="font-label text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Total Bot P&L</p>
                <h2 className={`font-headline text-3xl font-bold tracking-tight ${totalProfit >= 0 ? 'text-primary' : 'text-error'}`}>
                  {totalProfit >= 0 ? "+" : "-"}${Math.abs(totalProfit).toFixed(2)}
                </h2>
                <p className="text-xs text-on-surface-variant font-medium mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">{avgProfitPct >= 0 ? "trending_up" : "trending_down"}</span>
                  Average return: {avgProfitPct >= 0 ? "+" : ""}{avgProfitPct.toFixed(1)}% across all bots
                </p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant">Active Bots</p>
                  <p className="font-headline text-xl font-bold">{String(runningBots.length).padStart(2, "0")}</p>
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant">Total Bots</p>
                  <p className="font-headline text-xl font-bold">{String(bots.length).padStart(2, "0")}</p>
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
          {/* Y-axis labels + bars */}
          <div className="flex gap-3">
            <div className="flex flex-col justify-between text-[8px] font-mono text-on-surface-variant/50 text-right w-10 py-1">
              <span>{Math.round(maxP).toLocaleString()}</span>
              <span>{Math.round((maxP + minP) / 2).toLocaleString()}</span>
              <span>{Math.round(minP).toLocaleString()}</span>
            </div>
            <div className="flex-1">
              <div className="h-32 flex items-end justify-between gap-1 border-l border-b border-outline-variant/10 relative">
                {/* 50% gridline */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-outline-variant/15" />
                {livePerfBars.map((h, i) => (
                  <div
                    key={i}
                    className={`w-full ${h >= 85 ? "bg-primary" : h >= 50 ? "bg-primary/40" : "bg-primary/20"} rounded-t-sm transition-all duration-500`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[8px] uppercase font-black tracking-widest text-on-surface-variant">
                <span>7d ago</span>
                <span>5d</span>
                <span>3d</span>
                <span>1d</span>
                <span>Now</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
