import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { createClient } from "@/utils/supabase/server";
import { getActiveOrders, getRecentSettlements, setOrderStatus, type P2POrderWithProfile } from "./actions";

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
  searchParams: { tab?: string; asset?: string; fiat?: string; myAdToast?: string };
};

type MyAdRow = {
  id: string;
  type: "buy" | "sell";
  asset: string;
  fiat: string;
  price: number;
  total_amount: number;
  min_limit: number;
  max_limit: number;
  status: string;
  created_at: string;
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

  const currentAsset = searchParams.asset || "ALL";
  const currentFiat = searchParams.fiat || "ALL";
  const toast = searchParams.myAdToast;

  // Fetch live orders
  const filteredOrders = await getActiveOrders(adTypeToFetch, currentAsset, currentFiat);
  const shouldFallbackToAll = filteredOrders.length === 0 && (currentAsset !== "ALL" || currentFiat !== "ALL");
  const orders = shouldFallbackToAll
    ? await getActiveOrders(adTypeToFetch, "ALL", "ALL")
    : filteredOrders;

  // Fetch recent settlements
  const settlements = await getRecentSettlements(5);
  let myAds: MyAdRow[] = [];

  if (user) {
    const { data: ownOrders } = await supabase
      .from("p2p_orders")
      .select("id, type, asset, fiat, price, total_amount, min_limit, max_limit, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6);

    if (ownOrders) {
      myAds = ownOrders as MyAdRow[];
    }
  }

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
              Trusted peer-to-peer marketplace with fast settlement
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-sm border border-outline-variant/10">
            <Link href={`?tab=buy&asset=${currentAsset}&fiat=${currentFiat}`} className={`px-6 py-2 font-label text-xs font-bold uppercase tracking-widest transition-all ${currentTab === "buy" ? "bg-surface-bright text-on-surface border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
              Buy
            </Link>
            <Link href={`?tab=sell&asset=${currentAsset}&fiat=${currentFiat}`} className={`px-6 py-2 font-label text-xs font-bold uppercase tracking-widest transition-all ${currentTab === "sell" ? "bg-surface-bright text-on-surface border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
              Sell
            </Link>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
            {currentTab === "buy" ? "Showing seller offers" : "Showing buyer offers"}
          </p>
        </div>

        {/* Marketplace Stats Grid */}
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
                <option value="ALL" className="bg-surface text-on-surface">ALL</option>
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
                <option value="ALL" className="bg-surface text-on-surface">ALL</option>
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

        {/* My Ads */}
        <section className="mb-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">
              My Ads
            </h2>
            <Link href="/p2p/post-ad" className="text-primary text-xs uppercase tracking-tighter font-bold">
              Post New Ad
            </Link>
          </div>

          {toast && (
            <div className={`rounded-sm border px-3 py-2 text-xs ${
              toast === "activated" || toast === "paused"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-error/30 bg-error/10 text-error"
            }`}>
              {toast === "activated" && "Ad activated successfully."}
              {toast === "paused" && "Ad paused successfully."}
              {toast === "auth_error" && "Please sign in again to manage your ads."}
              {toast === "update_error" && "Unable to update ad status. Please try again."}
            </div>
          )}

          {!user ? (
            <EmptyState
              title="Sign in to manage ads"
              description="Your posted buy and sell ads will appear here for quick access."
              icon="badge"
              actionLabel="Go to Login"
              actionHref="/login"
            />
          ) : myAds.length === 0 ? (
            <EmptyState
              title="No ads posted yet"
              description="Create your first buy or sell ad to start matching with peers."
              icon="post_add"
              actionLabel="Post an Ad"
              actionHref="/p2p/post-ad"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {myAds.map((ad) => {
                const oppositeTab = ad.type === "buy" ? "sell" : "buy";
                return (
                  <div key={ad.id} className="bg-surface-container-low border border-outline-variant/10 p-4 rounded-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm ${ad.type === "buy" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>
                        {ad.type} ad
                      </span>
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm ${ad.status === "active" ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                        {ad.status}
                      </span>
                    </div>

                    <p className="font-headline text-lg font-black mb-1">
                      {ad.price.toFixed(3)} <span className="text-xs font-medium text-on-surface-variant">{ad.fiat}</span>
                    </p>
                    <p className="text-xs text-on-surface-variant mb-3">
                      {Number(ad.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} {ad.asset} available
                    </p>

                    <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                      Limit: {ad.min_limit.toLocaleString()} - {ad.max_limit.toLocaleString()} {ad.fiat}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-on-surface-variant">
                        Visible in <span className="text-on-surface font-semibold">{oppositeTab === "buy" ? "Buy" : "Sell"}</span> tab
                      </span>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/p2p/post-ad?edit=${encodeURIComponent(ad.id)}`}
                          className="text-on-surface text-[10px] font-bold uppercase tracking-widest hover:text-primary"
                        >
                          Edit
                        </Link>
                        <form action={setOrderStatus.bind(null, ad.id, ad.status === "active" ? "cancelled" : "active", currentTab, currentAsset, currentFiat)}>
                          <button
                            type="submit"
                            className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary"
                          >
                            {ad.status === "active" ? "Pause" : "Activate"}
                          </button>
                        </form>
                        <Link
                          href={`/p2p?tab=${oppositeTab}&asset=${encodeURIComponent(ad.asset)}&fiat=${encodeURIComponent(ad.fiat)}`}
                          className="text-primary text-[10px] font-bold uppercase tracking-widest"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Merchant Cards Grid */}
        {shouldFallbackToAll && orders.length > 0 && (
          <div className="mb-4 rounded-sm border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
            No offers were found for {currentAsset}/{currentFiat}. Showing all available offers instead.
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyState
            title="No active orders yet"
            description={`No ${adTypeToFetch.toUpperCase()} ads found for ${currentAsset}/${currentFiat}. Try switching asset or fiat to ALL.`}
            icon="storefront"
            actionLabel="Post an Ad"
            actionHref="/p2p/post-ad"
            className="mb-8"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {orders.map((order) => {
              const username = order.profiles?.username ?? "Unknown";
              const isOnline = true; // Could be determined by last_seen
              const verified = true; // Could be a profile field

              return (
                <div
                  key={order.id}
                  className="group overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-container-high"
                >
                  <div className="h-1 bg-gradient-to-r from-primary via-secondary to-warning" />

                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/15 bg-surface-container-high font-bold uppercase text-on-surface-variant">
                            {username.slice(0, 1)}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-container-low ${
                              isOnline ? "bg-primary shadow-[0_0_8px_rgba(92,253,128,0.5)]" : "bg-on-surface-variant"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-headline text-sm font-bold tracking-wide uppercase">{username}</h3>
                            {verified && (
                              <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant">
                            <span className="font-bold text-on-surface">{order.type} ad</span>
                            <span>•</span>
                            <span>{currentTab === "buy" ? "Showing sellers" : "Showing buyers"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-[#f3ba2f] text-xs">★</span>
                          <span className="font-headline text-xs font-bold">4.9</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant">138 trades</span>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_240px] md:items-stretch">
                      {/* Left: price + limits */}
                      <div className="space-y-4">
                        <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">Price</span>
                          <span className="mt-1 block font-headline text-[2rem] font-black leading-none">
                            {order.price.toFixed(3)} <span className="text-sm font-normal text-on-surface-variant">{order.fiat}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-3">
                            <span className="block text-[9px] uppercase tracking-widest text-on-surface-variant">Available</span>
                            <span className="mt-1 block font-headline text-sm font-medium">
                              {order.total_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {order.asset}
                            </span>
                          </div>
                          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-3 text-right">
                            <span className="block text-[9px] uppercase tracking-widest text-on-surface-variant">Limit</span>
                            <span className="mt-1 block font-headline text-sm font-medium">
                              ${order.min_limit.toLocaleString()} - ${order.max_limit.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: methods + CTA */}
                      <div className="flex h-full flex-col justify-between rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4">
                        <div className="space-y-2">
                          <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">Payment Methods</span>
                          <div className="space-y-2">
                            {order.payment_method.split(",").map((method, index) => (
                              <div key={method} className="flex items-center justify-between rounded-lg bg-surface-container-highest px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                                <span>{method.trim()}</span>
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    index % 3 === 0 ? "bg-primary" : index % 3 === 1 ? "bg-secondary" : "bg-warning"
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Link
                          className={`mt-4 inline-flex h-12 w-full items-center justify-center rounded-md font-headline text-base font-bold shadow-lg transition-transform active:scale-[0.98] ${
                            currentTab === "buy"
                              ? "bg-[#2bb673] text-white shadow-[#2bb673]/20 hover:brightness-110"
                              : "bg-gradient-to-r from-primary to-primary-container text-on-primary-container shadow-primary/20"
                          }`}
                          href={`/p2p/${currentTab}?order=${order.id}&merchant=${encodeURIComponent(username)}&price=${order.price}&asset=${order.asset}&fiat=${order.fiat}&available=${order.total_amount}&min=${order.min_limit}&max=${order.max_limit}&method=${encodeURIComponent(order.payment_method)}`}
                        >
                          {currentTab === "buy" ? "Buy" : "Sell"}
                        </Link>
                      </div>
                    </div>
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
