import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PortfolioBalance, PortfolioBtcEquivalent, ToggleVisibilityButton } from "@/components/portfolio-balance";

const marketCards = [
  {
    symbol: "BTC",
    icon: "currency_bitcoin",
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
    color: "text-error",
    borderColor: "border-error/40",
    price: "384.21",
    change: "-0.8%",
    changeColor: "text-error",
    sparkline: "M0 5 L20 8 L40 12 L60 10 L80 15 L100 18",
  },
];

const newsItems = [
  {
    tag: "Market Trends",
    tagColor: "bg-primary/10 text-primary",
    time: "2m ago",
    title: "Whale Alert: Over $200M BTC transferred to major exchanges",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkbd7zfg4nMXZArP8UKA7v54FugeaM4-TGqlwL_yGLaVM2j6D9UAmKcNdfG_cwkHkLnMxuPdo3vU5PNMiPBXy-aw979WwefDkJt3THO2deWOkCh6CK-n1icSaH-67y9dRVuyBlQxv9GhCXfZRKqcgWJwn45FRj0WDTzYfdwZ4Y9NpUU5IYoHGsHFJrcnS88gp6i60ejK3iVxucSqNTr_uVG7CP8ikJ0wtEXvl6AVqPrU3c8Buy3E15GeA30GOGLsULTIf5ZRG5up8",
  },
  {
    tag: "Regulation",
    tagColor: "bg-secondary/10 text-secondary",
    time: "45m ago",
    title: "SEC approves new framework for digital asset transparency",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDabwGP1q41DhaMxlaazRAlkl-Gl8WHPVLIrSir5TczabYDC_MKeTofyCF9vpM3NKAV3EUG1eYqZKQQ8rhQtxHBhWwNFjP9kOzyCzEZs2M5yeDGlBwY_bnkvJSxCW-0-9UtYmTkeQcC5nm-rVZn26KC-jpBIyxYvmEEVXVbjL2PnBNx6ZnIB2yEkW_tnYw1fPQGaXKNvJS_a6gbPXq2NWm95z7aH-dYfn-2celsCMuLC9fK9a-XjSDKGTACqeawT3lgUUQUGqFvBk",
  },
];

const gainers = [
  { symbol: "SOL", name: "Solana", icon: "bolt", iconColor: "text-primary", price: "114.24", change: "+12.4%" },
  { symbol: "AVAX", name: "Avalanche", icon: "hive", iconColor: "text-secondary", price: "38.91", change: "+8.7%" },
];

export default function HomePage() {
  return (
    <AppShell currentPath="/home">
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
                <PortfolioBalance />
              </h1>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-primary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold font-headline">+5.24%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs text-on-surface-variant font-mono">≈ <PortfolioBtcEquivalent /> BTC</span>
            <ToggleVisibilityButton />
          </div>
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "add_circle", label: "Deposit" },
              { icon: "logout", label: "Withdraw" },
              { icon: "swap_horiz", label: "Buy/Sell", highlight: true },
              { icon: "card_giftcard", label: "Referral" },
            ].map((action) => (
              <button key={action.label} className="flex flex-col items-center justify-center gap-2 group">
                <div className={`w-12 h-12 rounded flex items-center justify-center transition-all ${
                  action.highlight
                    ? "bg-primary shadow-lg shadow-primary/20"
                    : "bg-surface-container-high border border-outline-variant/10 group-hover:bg-primary/10 group-hover:border-primary/30"
                }`}>
                  <span className={`material-symbols-outlined ${action.highlight ? "text-on-primary font-bold" : "text-primary"}`}>
                    {action.icon}
                  </span>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                  action.highlight ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                }`}>
                  {action.label}
                </span>
              </button>
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
            {marketCards.map((card) => (
              <div key={card.symbol} className={`min-w-[140px] bg-surface-container-low p-4 rounded-lg border-b-2 ${card.borderColor}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`material-symbols-outlined ${card.color} text-xl`}>{card.icon}</span>
                  <span className="font-headline font-bold text-sm">{card.symbol}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-on-surface-variant">{card.price}</p>
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
            {newsItems.map((item) => (
              <article key={item.title} className="bg-surface-container rounded-lg p-4 flex gap-4 border border-outline-variant/10 active:bg-surface-container-high transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`${item.tagColor} text-[9px] px-1.5 py-0.5 rounded font-bold uppercase`}>
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{item.time}</span>
                  </div>
                  <h3 className="text-sm font-semibold leading-tight text-on-surface">{item.title}</h3>
                </div>
                <div className="w-20 h-20 rounded-lg bg-surface-container-high flex-shrink-0 overflow-hidden">
                  <img alt="News thumbnail" className="w-full h-full object-cover grayscale opacity-80" src={item.image} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Top Gainers */}
        <section className="space-y-3 pb-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">
              Top Gainers (24h)
            </h2>
          </div>
          <div className="bg-surface-container-low rounded-lg border border-outline-variant/10 divide-y divide-outline-variant/10">
            {gainers.map((g) => (
              <div key={g.symbol} className="flex items-center justify-between p-4 active:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span className={`material-symbols-outlined ${g.iconColor} text-xl`}>{g.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{g.symbol}</p>
                    <p className="text-[10px] text-on-surface-variant">{g.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{g.price}</p>
                  <p className="text-[10px] font-bold text-primary">{g.change}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
