import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { MarketMovers } from "@/components/market-movers";
import { PortfolioBalance, PortfolioBtcEquivalent, ToggleVisibilityButton } from "@/components/portfolio-balance";
import { createClient } from "@/utils/supabase/server";
import { getLivePrices } from "@/lib/price-api";
import { ensureUserWallets } from "@/app/actions/wallet";
import { fetchCryptoNews } from "@/lib/rss-parser";
import { P2PExpressWidget } from "@/components/p2p-express-widget";

export const metadata: Metadata = { title: "Dashboard" };
const marketCards = [
  {
    symbol: "BTC",
    icon: "currency_bitcoin",
    logo: "/icons/btc.svg",
    color: "text-primary",
    borderColor: "border-primary/40",
    price: "52,340.12",
    change: "+2.1%",
    changeColor: "text-primary",
    sparkline: "M0 15 L20 12 L40 16 L60 8 L80 12 L100 5",
  },
  {
    symbol: "ETH",
    icon: "token",
    logo: "/icons/eth.svg",
    color: "text-secondary",
    borderColor: "border-secondary/40",
    price: "2,912.45",
    change: "+1.4%",
    changeColor: "text-secondary",
    sparkline: "M0 18 L20 15 L40 10 L60 14 L80 8 L100 4",
  },
  {
    symbol: "BNB",
    icon: "database",
    logo: "/icons/bnb.svg",
    color: "text-error",
    borderColor: "border-error/40",
    price: "384.21",
    change: "-0.8%",
    changeColor: "text-error",
    sparkline: "M0 5 L20 8 L40 12 L60 10 L80 15 L100 18",
  },
];

// Removed static newsItems

const gainers = [
  { symbol: "SOL", name: "Solana", icon: "bolt", logo: "/icons/sol.svg", iconColor: "text-primary", price: "114.24", change: "+12.4%" },
  { symbol: "AVAX", name: "Avalanche", icon: "hive", logo: "/icons/avax.svg", iconColor: "text-secondary", price: "38.91", change: "+8.7%" },
];

const academyLinks = [
  { title: "What is Bitcoin Halving?", duration: "4 min read", level: "Beginner", icon: "school" },
  { title: "Understanding Zero-Knowledge Proofs", duration: "8 min read", level: "Advanced", icon: "enhanced_encryption" },
  { title: "How to use the Grid Trading Bot", duration: "6 min read", level: "Intermediate", icon: "smart_toy" },
];

type WalletRow = { currency: string; balance: number };
type TxRow = {
  id: string;
  type: string;
  amount: number;
  status: string;
  reference: string | null;
  created_at: string;
};

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let liveUsdtBalance = 0;
  let profile: { username: string | null; avatar_url: string | null } | null = null;
  let recentTransactions: TxRow[] = [];
  let walletIds: string[] = [];

  // Fetch Global Non-Auth Data in Parallel
  const [livePrices, liveNews, p2pRes] = await Promise.all([
    getLivePrices(),
    fetchCryptoNews(),
    supabase.from("p2p_orders").select("*").eq("type", "sell").eq("asset", "USDT").eq("fiat", "KES").eq("status", "active").order("price", { ascending: true }).limit(1).single()
  ]);

  if (user) {
    // Ensure wallets exist immediately on login
    await ensureUserWallets(user.id);

    // Fetch auth-dependent data in parallel
    const [profileRes, walletsRes] = await Promise.all([
      supabase.from("profiles").select("username, avatar_url").eq("id", user.id).single(),
      supabase.from("wallets").select("id, currency, balance").eq("user_id", user.id)
    ]);
    
    profile = profileRes.data;
    const wallets = walletsRes.data;

    if (wallets) {
      const usdt = wallets.find((w: any) => w.currency === 'USDT');
      if (usdt) liveUsdtBalance = Number(usdt.balance);
      walletIds = wallets.map((w: any) => w.id);
    }

    // Fetch recent transactions
    if (walletIds.length > 0) {
      const { data: txData } = await supabase
        .from("transactions")
        .select("id, type, amount, status, reference, created_at")
        .in("wallet_id", walletIds)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (txData) {
        recentTransactions = txData as TxRow[];
      }
    }
  }

  const btcRate = livePrices.BTC || 52340.12;
  const liveBtc = liveUsdtBalance / btcRate;
  
  const bestP2POrder = p2pRes.data;

  // Map dynamic prices
  const dynamicMarketCards = marketCards.map(card => ({
    ...card,
    price: livePrices[card.symbol] ? livePrices[card.symbol].toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : card.price
  }));

  const txIcons: Record<string, { icon: string; color: string; bg: string }> = {
    deposit: { icon: "south_west", color: "text-primary", bg: "bg-primary/10" },
    withdrawal: { icon: "north_east", color: "text-error", bg: "bg-error/10" },
    trade_buy: { icon: "swap_horiz", color: "text-secondary", bg: "bg-secondary/10" },
    trade_sell: { icon: "swap_horiz", color: "text-tertiary", bg: "bg-tertiary/10" },
  };

  return (
    <AppShell currentPath="/home" user={user ? { email: user.email, ...profile } : null}>
      <div className="px-4 pt-4 max-w-5xl mx-auto space-y-6">
        {/* Hero Portfolio Section */}
        <section className="bg-surface-container-low rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-l from-primary to-transparent" />
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-medium">
                Total Balance (USD)
              </span>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">
                $<PortfolioBalance liveBalance={liveUsdtBalance} />
              </h1>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-primary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold font-headline">+0.00%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs text-on-surface-variant font-mono">≈ <PortfolioBtcEquivalent liveBtc={liveBtc} /> BTC</span>
            <ToggleVisibilityButton />
          </div>
          {/* Quick Actions Grid Expanded */}
          <div className="grid grid-cols-5 gap-2 mt-6">
            {[
              { icon: "download", label: "Deposit", color: "text-primary", bg: "bg-primary/10" },
              { icon: "currency_exchange", label: "Convert", color: "text-secondary", bg: "bg-secondary/10" },
              { icon: "swap_horiz", label: "P2P Trading", color: "text-on-surface", bg: "bg-surface-container-high", route: "/p2p" },
              { icon: "send", label: "Transfer", color: "text-on-surface", bg: "bg-surface-container-high" },
              { icon: "savings", label: "Earn", color: "text-tertiary", bg: "bg-tertiary/10" },
            ].map((action) => (
              <Link href={action.route || "#"} key={action.label} className="flex flex-col items-center justify-start gap-2 group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95 ${action.bg}`}>
                  <span className={`material-symbols-outlined ${action.color}`}>
                    {action.icon}
                  </span>
                </div>
                <span className="text-[9px] uppercase font-bold text-on-surface-variant group-hover:text-on-surface text-center leading-tight">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Markets */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">
              Featured Markets
            </h2>
            <Link className="text-primary text-xs uppercase tracking-tighter font-bold" href="/markets">
              See All
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {dynamicMarketCards.map((card) => (
              <div key={card.symbol} className={`min-w-[140px] bg-surface-container-low p-4 rounded-lg border-b-2 ${card.borderColor}`}>
                <div className="flex items-center gap-2 mb-3">
                  {card.logo ? (
                    <Image src={card.logo} alt={card.symbol} width={20} height={20} unoptimized />
                  ) : (
                    <span className={`material-symbols-outlined ${card.color} text-xl`}>{card.icon}</span>
                  )}
                  <span className="font-headline font-bold text-sm">{card.symbol}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-on-surface-variant font-mono font-bold">${card.price}</p>
                  <p className={`text-[10px] font-bold ${card.changeColor}`}>{card.change}</p>
                </div>
                <div className="mt-3 h-8 w-full flex items-end">
                  <svg className={`w-full h-full ${card.color}`} preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d={card.sparkline} fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Market News */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">
              Latest Market News
            </h2>
            <button className="text-on-surface-variant text-xs uppercase tracking-tighter font-bold flex items-center gap-1 hover:text-primary transition-colors">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="space-y-3">
            {liveNews.map((item, i) => (
              <a href={item.link} target="_blank" rel="noopener noreferrer" key={i} className="bg-surface-container rounded-lg p-4 flex gap-4 border border-outline-variant/10 hover:bg-surface-container-high transition-colors group">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold uppercase`}>
                      {item.source}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {new Date(item.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-tight text-on-surface group-hover:text-primary transition-colors">{item.title}</h3>
                </div>
                <div className="w-20 h-20 rounded-lg bg-surface-container-high flex-shrink-0 overflow-hidden">
                  <img alt="News thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src={item.image} />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Market Movers Tabs component replacing static gainers */}
        <MarketMovers />

        {/* P2P Express Buy Widget */}
        <section className="space-y-3 pb-4">
          <P2PExpressWidget 
            bestPrice={bestP2POrder?.price ?? null}
            fiat={bestP2POrder?.fiat ?? "KES"}
            asset={bestP2POrder?.asset ?? "USDT"}
            orderId={bestP2POrder?.id ?? null}
            merchantName={bestP2POrder?.profiles?.username ?? null}
            minLimit={bestP2POrder?.min_limit ?? 0}
            maxLimit={bestP2POrder?.max_limit ?? 0}
            paymentMethod={bestP2POrder?.payment_method ?? null}
            totalAmount={bestP2POrder?.total_amount ?? 0}
          />
        </section>

        {/* Promotional / Ecosystem Banners */}
        <section className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-surface-container-low to-primary/10 rounded-lg p-5 border border-primary/20 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10 w-2/3">
              <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-bold rounded-sm uppercase tracking-widest mb-2">Rewards</span>
              <h3 className="font-headline font-bold text-lg leading-tight mb-2">Invite Friends, Earn 40%</h3>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">Share your referral link and earn commissions on their trading fees for life.</p>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-primary/10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">groups</span>
          </div>

          <div className="bg-gradient-to-br from-surface-container-low to-secondary/10 rounded-lg p-5 border border-secondary/20 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10 w-2/3">
              <span className="inline-block px-2 py-0.5 bg-secondary/20 text-secondary text-[9px] font-bold rounded-sm uppercase tracking-widest mb-2">Academy</span>
              <h3 className="font-headline font-bold text-lg leading-tight mb-2">Master Grid Trading</h3>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">Learn how to capture market volatility automatically with our new trading bots.</p>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-secondary/10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">smart_toy</span>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="space-y-3 pb-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">
              Recent Transactions
            </h2>
            <Link href="/assets" className="text-primary text-xs uppercase tracking-tighter font-bold flex items-center gap-1">
              History <span className="material-symbols-outlined text-sm">history</span>
            </Link>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="bg-surface-container-low rounded-lg p-6 text-center border border-outline-variant/10">
              <p className="text-xs text-on-surface-variant">No transactions yet. Start trading on the <Link href="/p2p" className="text-primary font-bold">P2P Terminal</Link>.</p>
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-lg border border-outline-variant/10 divide-y divide-outline-variant/10">
              {recentTransactions.map((tx) => {
                const conf = txIcons[tx.type] ?? { icon: "receipt", color: "text-on-surface-variant", bg: "bg-surface-container-high" };
                const isPositive = tx.type === "deposit" || tx.type === "trade_buy";

                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${conf.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <span className={`material-symbols-outlined ${conf.color} text-xl`}>{conf.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight capitalize">{tx.type.replace("_", " ")}</p>
                        <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          {tx.status === "pending" && <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />}
                          <span className="capitalize">{tx.status}</span> • {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm font-mono ${isPositive ? 'text-primary' : 'text-on-surface'}`}>
                        {isPositive ? "+" : "-"}{Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      {tx.reference && <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">{tx.reference}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CoinCash Academy */}
        <section className="space-y-3 pb-24">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">
              CoinCash Academy
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {academyLinks.map((lesson) => (
              <div key={lesson.title} className="bg-surface-container-highest p-5 rounded-lg border border-transparent hover:border-primary/30 transition-colors group cursor-pointer relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl text-on-surface">{lesson.icon}</span>
                </div>
                <span className="inline-block px-2 py-0.5 bg-surface-container-low border border-outline-variant/10 text-on-surface-variant text-[9px] font-bold uppercase tracking-widest rounded-sm mb-3">
                  {lesson.level}
                </span>
                <h3 className="font-bold text-sm leading-snug mb-2 pr-4">{lesson.title}</h3>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">schedule</span> {lesson.duration}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
