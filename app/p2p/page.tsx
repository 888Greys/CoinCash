import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/utils/supabase/server";
import { getActiveOrders, getRecentSettlements, type P2POrderWithProfile } from "./actions";

export const metadata: Metadata = { title: "P2P Trading" };

const stats = [
  { label: "24h Vol (USDT)", value: "1.48M", color: "" },
  { label: "Active Peers", value: "12,402", color: "text-primary" },
  { label: "Avg. Settlement", value: "02:45", unit: "MIN", color: "" },
  { label: "Trust Score Avg.", value: "98.4%", color: "" },
];

function timeAgo(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMin = Math.floor((now - then) / 60000);
  if (diffMin < 1) return "Just Now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

type Props = {
  searchParams: { tab?: string; asset?: string; fiat?: string };
};

export default async function P2PPage({ searchParams }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile for nav
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  // Determine the current tab. "buy" means the user wants to buy crypto, so we need to show them "sell" ads.
  const currentTab = searchParams.tab === "sell" ? "sell" : "buy";
  const adTypeToFetch = currentTab === "buy" ? "sell" : "buy";

  const currentAsset = searchParams.asset || "USDT";
  const currentFiat = searchParams.fiat || "USD";

  // Fetch live orders
  const orders = await getActiveOrders(adTypeToFetch, currentAsset, currentFiat);

  // Fetch recent settlements
  const settlements = await getRecentSettlements(5);

  const formattedSettlements = settlements.map((s: any, i: number) => ({
    text: `${s.p2p_orders?.type === "buy" ? "BUY" : "SELL"} ${Number(s.asset_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} ${s.p2p_orders?.asset ?? "USDT"}`,
    actor: s.buyer?.username || s.seller?.username || "Unknown",
    time: timeAgo(s.created_at),
    active: i === 0,
  }));

  // Fallback if no settlements yet
  const displaySettlements = formattedSettlements.length > 0 ? formattedSettlements : [
    { text: "No settlements yet", actor: "—", time: "—", active: false },
  ];

  return (
    <AppShell currentPath="/p2p" user={user ? { email: user.email, ...profile } : null}>
      <div className="px-4 md:px-8 pt-6 max-w-7xl mx-auto">
        {/* Sub-Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter mb-2">
              P2P Marketplace
            </h1>
            <p className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em]">
              Liquid peer-to-peer exchange for high-frequency settlement
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-sm border border-outline-variant/10">
            <Link href={`?tab=buy&asset=${currentAsset}&fiat=${currentFiat}`} className={`px-6 py-2 font-label text-xs font-bold uppercase tracking-widest ${currentTab === "buy" ? "bg-surface-bright text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>
              Buy
            </Link>
            <Link href={`?tab=sell&asset=${currentAsset}&fiat=${currentFiat}`} className={`px-6 py-2 font-label text-xs font-bold uppercase tracking-widest ${currentTab === "sell" ? "bg-surface-bright text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>
              Sell
            </Link>
          </div>
        </div>

        {/* Terminal Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant/10 mb-8 border border-outline-variant/10">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-low p-4">
              <span className="block text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-1">{s.label}</span>
              <span className={`block font-headline text-xl font-medium ${s.color}`}>
                {s.value}
                {s.unit && <span className="text-[10px] font-label text-on-surface-variant ml-1">{s.unit}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Filter Form */}
        <form method="GET" className="flex flex-wrap items-center gap-4 mb-6 py-4 border-y border-outline-variant/10">
          <input type="hidden" name="tab" value={currentTab} />
          
          <div className="relative min-w-[140px]">
            <span className="absolute top-0 left-3 -translate-y-1/2 bg-surface px-1 text-[9px] text-primary font-bold uppercase tracking-tighter z-10">Asset</span>
            <div className="relative bg-surface-container-lowest border border-outline-variant/20 flex items-center cursor-pointer">
              <select name="asset" defaultValue={currentAsset} className="w-full bg-transparent px-3 py-2 font-headline font-bold text-sm outline-none appearance-none cursor-pointer z-10">
                <option value="USDT" className="bg-surface text-on-surface">USDT</option>
                <option value="BTC" className="bg-surface text-on-surface">BTC</option>
                <option value="ETH" className="bg-surface text-on-surface">ETH</option>
              </select>
              <span className="material-symbols-outlined text-xs absolute right-3 pointer-events-none z-0">expand_more</span>
            </div>
          </div>

          <div className="relative min-w-[140px]">
            <span className="absolute top-0 left-3 -translate-y-1/2 bg-surface px-1 text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter z-10">Fiat</span>
            <div className="relative bg-surface-container-lowest border border-outline-variant/20 flex items-center cursor-pointer">
              <select name="fiat" defaultValue={currentFiat} className="w-full bg-transparent px-3 py-2 font-headline font-bold text-sm outline-none appearance-none cursor-pointer z-10 text-on-surface">
                <option value="USD" className="bg-surface text-on-surface">USD</option>
                <option value="KES" className="bg-surface text-on-surface">KES</option>
                <option value="UGX" className="bg-surface text-on-surface">UGX</option>
              </select>
              <span className="material-symbols-outlined text-xs text-on-surface-variant absolute right-3 pointer-events-none z-0">expand_more</span>
             </div>
          </div>

          <div className="relative group flex-grow">
            <span className="absolute top-0 left-3 -translate-y-1/2 bg-surface px-1 text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter">Payment Method</span>
            <div className="bg-surface-container-lowest border border-outline-variant/20 px-3 py-2 flex items-center justify-between cursor-pointer">
              <span className="font-label text-xs uppercase tracking-widest">All Methods</span>
              <span className="material-symbols-outlined text-xs text-on-surface-variant">filter_list</span>
            </div>
          </div>
          
          <button type="submit" className="bg-primary/10 text-primary p-2 border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1.5 px-4 rounded-sm font-label text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
            <span className="material-symbols-outlined text-sm">search</span>
            SEARCH
          </button>
        </form>

        {/* Merchant Cards Grid */}
        {orders.length === 0 ? (
          <div className="bg-surface-container-low p-12 text-center space-y-4 mb-8">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">storefront</span>
            <p className="text-sm text-on-surface-variant">No active orders yet. Be the first to post an ad!</p>
            <Link
              href="/p2p/post-ad"
              className="inline-block mt-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-label text-xs font-bold uppercase tracking-widest rounded-sm"
            >
              Post an Ad
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {orders.map((order) => {
              const username = order.profiles?.username ?? "Unknown";
              const isOnline = true; // Could be determined by last_seen
              const verified = true; // Could be a profile field

              return (
                <div key={order.id} className="bg-surface-container-low p-4 group hover:bg-surface-container-high transition-all duration-200 cursor-pointer">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${isOnline ? "bg-primary shadow-[0_0_8px_rgba(92,253,128,0.5)]" : "bg-on-surface-variant"} rounded-full`} />
                      <h3 className="font-label text-sm font-bold tracking-tight">{username.toUpperCase()}</h3>
                      {verified && (
                        <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price / Available */}
                  <div className="flex items-center justify-between mb-4 border-b border-outline-variant/5 pb-4">
                    <div>
                      <span className="block font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Price</span>
                      <span className="block font-headline text-2xl font-black">
                        {order.price.toFixed(3)} <span className="text-xs font-normal text-on-surface-variant">{order.fiat}</span>
                      </span>
                    </div>
                  </div>

                  {/* Available / Limit */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="block font-label text-[9px] text-on-surface-variant uppercase tracking-tighter">Available</span>
                      <span className="block font-headline text-sm font-medium">
                        {order.total_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {order.asset}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-label text-[9px] text-on-surface-variant uppercase tracking-tighter">Limit</span>
                      <span className="block font-headline text-sm font-medium">
                        ${order.min_limit.toLocaleString()} - ${order.max_limit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Methods + Action */}
                  <div className="flex items-center gap-2">
                    <div className="flex-grow flex gap-1 overflow-hidden">
                      {order.payment_method.split(",").map((method) => (
                        <span key={method} className="px-2 py-1 bg-surface-container-highest text-[9px] font-bold uppercase text-on-surface-variant">
                          {method.trim()}
                        </span>
                      ))}
                    </div>
                    <Link
                      className="bg-gradient-to-br from-primary to-primary-container px-6 py-2 text-on-primary-container font-label text-xs font-black uppercase tracking-widest rounded-sm active:scale-95 transition-transform"
                      href={`/p2p/${currentTab}?order=${order.id}&merchant=${encodeURIComponent(username)}&price=${order.price}&asset=${order.asset}&fiat=${order.fiat}&available=${order.total_amount}&min=${order.min_limit}&max=${order.max_limit}&method=${encodeURIComponent(order.payment_method)}`}
                    >
                      {currentTab === "buy" ? "Buy" : "Sell"} {order.asset}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Panels */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 mb-8">
          {/* Settlement Activity */}
          <div className="flex-grow bg-surface-container-low p-6">
            <h4 className="font-headline text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-primary">history</span>
              Settlement Activity
            </h4>
            <div className="space-y-3">
              {displaySettlements.map((s, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center text-[11px] font-label border-l-2 pl-3 py-1 ${
                    s.active ? "border-primary bg-primary/5" : "border-outline-variant"
                  }`}
                >
                  <span className="text-on-surface">
                    {s.text} <span className="text-on-surface-variant">by</span> {s.actor}
                  </span>
                  <span className="text-on-surface-variant">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Advisory */}
          <div className="w-full md:w-80 bg-surface-container-low p-6 relative overflow-hidden">
            <h4 className="font-headline text-sm font-bold uppercase tracking-widest mb-4">Security Advisory</h4>
            <p className="text-[11px] font-label text-on-surface-variant leading-relaxed mb-4">
              CoinCash handles all escrow settlements. Never release assets until you have verified the receipt of funds
              in your account. Support will NEVER ask for your password or OTP.
            </p>
            <Link
              className="text-[10px] font-label text-primary font-bold uppercase tracking-widest border-b border-primary/30"
              href="/settings"
            >
              View Safety Protocol
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
