import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getExtendedMarketData } from "@/lib/price-api";

export const metadata: Metadata = {
  title: "CoinCash — The Future of P2P Exchange",
  description:
    "Trade crypto peer-to-peer with zero intermediaries. Instant settlement, AI trading bots, and bank-grade security.",
};

const features = [
  {
    icon: "swap_horiz",
    title: "P2P Exchange",
    description:
      "Trade crypto directly with peers using your preferred payment method. Zero hidden fees, zero intermediaries.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/30",
    glow: "group-hover:shadow-[0_0_32px_rgba(92,253,128,0.08)]",
  },
  {
    icon: "smart_toy",
    title: "Trading Bots",
    description:
      "Deploy automated grid, DCA, and arbitrage bots. Let algorithms work while you sleep.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "hover:border-secondary/30",
    glow: "group-hover:shadow-[0_0_32px_rgba(120,245,174,0.08)]",
  },
  {
    icon: "security",
    title: "Bank-Grade Security",
    description:
      "Multi-factor authentication, encrypted wallets, and real-time monitoring across every transaction.",
    color: "text-tertiary",
    bg: "bg-tertiary/10",
    border: "hover:border-tertiary/30",
    glow: "group-hover:shadow-[0_0_32px_rgba(132,236,255,0.08)]",
  },
  {
    icon: "bolt",
    title: "Instant Settlement",
    description:
      "Atomic escrow ensures trades settle in seconds, not minutes. Your funds are always protected.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/30",
    glow: "group-hover:shadow-[0_0_32px_rgba(92,253,128,0.08)]",
  },
];

const stats = [
  { value: "$2.4B+", label: "Trading Volume", icon: "bar_chart" },
  { value: "180K+", label: "Active Traders", icon: "group" },
  { value: "40+", label: "Supported Assets", icon: "currency_bitcoin" },
  { value: "99.99%", label: "Uptime SLA", icon: "verified" },
];

const cryptoAssets = [
  { src: "/icons/btc.svg", name: "Bitcoin", ticker: "BTC", change: "+2.4%" },
  { src: "/icons/eth.svg", name: "Ethereum", ticker: "ETH", change: "+1.8%" },
  { src: "/icons/usdt.svg", name: "Tether", ticker: "USDT", change: "+0.01%" },
  { src: "/icons/bnb.svg", name: "BNB", ticker: "BNB", change: "+3.2%" },
  { src: "/icons/sol.svg", name: "Solana", ticker: "SOL", change: "+5.7%" },
  { src: "/icons/avax.svg", name: "Avalanche", ticker: "AVAX", change: "+4.1%" },
];

const testimonials = [
  {
    quote: "CoinCash is the smoothest P2P platform I've used. Settled 3 trades in under 5 minutes.",
    author: "Alex K.",
    role: "Day Trader · Lagos",
    avatar: "A",
    color: "bg-primary/10 text-primary",
  },
  {
    quote: "The grid bot recovered 12% for me in a sideways market. Incredible automation.",
    author: "Priya M.",
    role: "Algo Trader · Nairobi",
    avatar: "P",
    color: "bg-secondary/10 text-secondary",
  },
  {
    quote: "Finally a platform that actually supports my local payment methods. 10/10.",
    author: "Ibrahim T.",
    role: "Crypto Merchant · Dubai",
    avatar: "I",
    color: "bg-tertiary/10 text-tertiary",
  },
];

export default async function LandingPage() {
  // Fetch live market snapshot for the ticker strip
  let liveAssets: { symbol: string; price: number; change: number }[] = [];
  try {
    const data = await getExtendedMarketData();
    liveAssets = data.slice(0, 8).map((a) => ({
      symbol: a.symbol.toUpperCase(),
      price: a.current_price,
      change: a.price_change_percentage_24h,
    }));
  } catch {
    // silently fall back to empty
  }

  return (
    <main className="min-h-screen bg-surface text-on-surface overflow-hidden">

      {/* ── NAVIGATION ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-bold tracking-tight">
            Coin<span className="text-primary">Cash</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-label uppercase tracking-widest text-on-surface-variant">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#markets" className="hover:text-primary transition-colors">Markets</a>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Reviews</a>
          </div>

          <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
            Log In
          </Link>
        </div>
      </nav>

      {/* ── LIVE TICKER STRIP ──────────────────────── */}
      {liveAssets.length > 0 && (
        <div className="fixed top-[65px] left-0 right-0 z-40 bg-surface-container-lowest/90 backdrop-blur-sm border-b border-outline-variant/10 overflow-hidden">
          <div className="market-ticker-track py-1.5">
            {[0, 1].map((loop) => (
              <div key={loop} className="market-ticker-group" aria-hidden={loop === 1}>
                {liveAssets.map((a) => (
                  <div key={`${a.symbol}-${loop}`} className="flex items-center gap-2 px-4">
                    <span className="font-headline font-bold text-xs text-on-surface">{a.symbol}</span>
                    <span className="font-mono text-xs text-on-surface-variant">
                      ${a.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-[10px] font-bold ${a.change >= 0 ? "text-primary" : "text-error"}`}>
                      {a.change >= 0 ? "+" : ""}{a.change.toFixed(2)}%
                    </span>
                    <span className="text-outline-variant/30 text-xs">·</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HERO ───────────────────────────────────── */}
      <section className={`relative overflow-hidden ${liveAssets.length > 0 ? "pt-44" : "pt-32"} pb-24 px-6`}>
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-tertiary/3 rounded-full blur-[80px]" />
          <div className="terminal-grid absolute inset-0 opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live · 180K+ Active Traders</span>
            </div>

            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.92] mb-6">
              The Future of<br />
              <span className="text-primary">Peer-to-Peer</span><br />
              Exchange.
            </h1>

            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Trade crypto directly with peers worldwide. Zero intermediaries, fast secure escrow, and AI-powered bots — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-10 py-4 text-sm font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all shadow-xl shadow-primary/25"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                Start Trading Free
              </Link>
              <Link
                href="/markets"
                className="inline-flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 text-on-surface px-8 py-4 text-sm font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">trending_up</span>
                Live Markets
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Non-Custodial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">KYC Verified Peers</span>
              </div>
            </div>
          </div>

          {/* Right: Simulated Trade Card */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-sm">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl scale-110" />

              {/* Main card */}
              <div className="relative bg-surface-container-low border border-outline-variant/20 rounded-xl p-6 shadow-2xl">
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Image src="/icons/usdt.svg" alt="USDT" width={28} height={28} unoptimized />
                    <div>
                      <p className="font-headline font-bold">USDT / KES</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">P2P Trade</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Live</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.15em] mb-1">Best Price</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-headline text-4xl font-black text-primary">130.45</p>
                    <p className="text-on-surface-variant text-sm">KES</p>
                  </div>
                  <p className="text-[10px] text-primary mt-1 font-bold">↑ +0.3% from last trade</p>
                </div>

                {/* Input mockup */}
                <div className="space-y-3 mb-5">
                  <div className="bg-surface-container p-3 rounded-sm border border-outline-variant/10">
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">You Pay (KES)</p>
                    <p className="font-headline font-bold text-lg">10,000</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <span className="material-symbols-outlined text-primary text-sm">swap_vert</span>
                    </div>
                  </div>
                  <div className="bg-surface-container p-3 rounded-sm border border-primary/20">
                    <p className="text-[9px] text-primary uppercase tracking-widest mb-1">You Receive (USDT)</p>
                    <p className="font-headline font-bold text-lg text-primary">76.66</p>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-primary text-on-primary py-3 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all">
                  Buy USDT Now
                </button>

                {/* Merchant row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">A</div>
                    <div>
                      <p className="text-xs font-bold">@alex_ke</p>
                      <p className="text-[9px] text-on-surface-variant">138 trades · 99.1%</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-surface-container-highest border border-outline-variant/20 rounded-lg px-3 py-2 shadow-lg">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Settled in</p>
                <p className="font-headline font-bold text-primary text-sm">02:34 min</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-surface-container-highest border border-outline-variant/20 rounded-lg px-3 py-2 shadow-lg">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Escrow</p>
                <p className="font-headline font-bold text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  Secured
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────── */}
      <section className="bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant/10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-container-low px-8 py-6 text-center group hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-primary/40 text-2xl mb-2 block group-hover:text-primary/60 transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
                {stat.icon}
              </span>
              <p className="font-headline text-3xl md:text-4xl font-black text-primary tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4">Platform Features</span>
            <h2 className="font-headline text-3xl md:text-5xl font-black tracking-tight mb-4">
              Built for <span className="text-primary">Serious</span> Traders
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Every feature is designed to give you an edge. From AI-powered bots to instant P2P settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 ${feature.border} transition-all ${feature.glow} group relative overflow-hidden cursor-default`}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-primary/[0.03] transition-all duration-500 pointer-events-none" />

                <div className={`relative z-10 w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <span className={`material-symbols-outlined ${feature.color} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{feature.icon}</span>
                </div>
                <h3 className="relative z-10 font-headline font-bold text-lg mb-2">{feature.title}</h3>
                <p className="relative z-10 text-sm text-on-surface-variant leading-relaxed">{feature.description}</p>

                {/* Background watermark icon */}
                <span className={`material-symbols-outlined absolute -bottom-6 -right-6 text-9xl ${feature.color} opacity-[0.04] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-500 pointer-events-none`}>
                  {feature.icon}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section className="py-20 px-6 bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4">Process</span>
            <h2 className="font-headline text-3xl md:text-4xl font-black tracking-tight">
              Trade in <span className="text-secondary">3 Simple</span> Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.7%+1rem)] right-[calc(16.7%+1rem)] h-px bg-gradient-to-r from-primary/20 via-secondary/30 to-primary/20" />

            {[
              { step: "01", icon: "person_add", title: "Create Account", desc: "Sign up in under 60 seconds with just your email. No KYC friction upfront.", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
              { step: "02", icon: "storefront", title: "Pick an Offer", desc: "Browse dozens of live buy/sell offers. Filter by asset, price, and payment method.", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
              { step: "03", icon: "check_circle", title: "Trade & Settle", desc: "Funds go into escrow instantly. Release when payment is confirmed. Done.", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
            ].map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center group">
                <div className={`relative w-16 h-16 ${step.bg} border ${step.border} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined ${step.color} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                  <span className={`absolute -top-2 -right-2 w-6 h-6 ${step.bg} border ${step.border} rounded-full flex items-center justify-center text-[9px] font-black font-headline ${step.color}`}>{step.step}</span>
                </div>
                <h3 className="font-headline font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE MARKETS STRIP ─────────────────────── */}
      <section id="markets" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4">Markets</span>
            <h2 className="font-headline text-3xl md:text-4xl font-black tracking-tight mb-3">
              Trade <span className="text-primary">40+ Assets</span>
            </h2>
            <p className="text-sm text-on-surface-variant">From Bitcoin to stablecoins — all available for P2P trading in your local currency.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cryptoAssets.map((asset) => (
              <div key={asset.ticker} className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/10 hover:border-primary/20 group hover:shadow-[0_0_24px_rgba(92,253,128,0.06)] transition-all cursor-pointer flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center border border-outline-variant/10 group-hover:scale-110 transition-transform shadow-lg">
                  <Image src={asset.src} alt={asset.name} width={36} height={36} unoptimized />
                </div>
                <div className="text-center">
                  <p className="font-headline font-bold text-sm">{asset.ticker}</p>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">{asset.name}</p>
                  <p className="text-[10px] font-bold text-primary mt-1">{asset.change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all"
            >
              View All Live Prices
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECURITY ───────────────────────────────── */}
      <section id="security" className="py-24 px-6 bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-tertiary/10 rounded-full blur-3xl scale-125" />

              {/* Main circle */}
              <div className="relative w-72 h-72 bg-surface-container rounded-full flex items-center justify-center border border-tertiary/15 shadow-2xl">
                <span className="material-symbols-outlined text-8xl text-tertiary/30" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>

                {/* Ping rings */}
                <div className="absolute w-full h-full rounded-full border border-tertiary/10 animate-ping" style={{ animationDuration: "3s" }} />
                <div className="absolute w-[115%] h-[115%] rounded-full border border-tertiary/5 animate-ping" style={{ animationDuration: "4.5s" }} />
                <div className="absolute w-[130%] h-[130%] rounded-full border border-tertiary/[0.04] animate-ping" style={{ animationDuration: "6s" }} />
              </div>

              {/* Floating labels */}
              <div className="absolute top-4 -right-8 bg-surface-container-highest border border-tertiary/20 rounded-lg px-3 py-2 shadow-lg">
                <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">Encryption</p>
                <p className="font-headline font-bold text-sm text-tertiary">AES-256</p>
              </div>
              <div className="absolute bottom-8 -left-8 bg-surface-container-highest border border-primary/20 rounded-lg px-3 py-2 shadow-lg">
                <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">Auth</p>
                <p className="font-headline font-bold text-sm text-primary">OTP + 2FA</p>
              </div>
              <div className="absolute -bottom-4 right-8 bg-surface-container-highest border border-secondary/20 rounded-lg px-3 py-2 shadow-lg">
                <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">Settlement</p>
                <p className="font-headline font-bold text-sm text-secondary">Atomic</p>
              </div>
            </div>
          </div>

          {/* Right: Copy */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6">Security First</span>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-6">
              Your Assets.<br />
              <span className="text-tertiary">Fort Knox</span> Protected.
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              We use industry-leading encryption, atomic escrow smart contracts, and continuous monitoring to keep your funds safe at every step.
            </p>
            <div className="space-y-4">
              {[
                { icon: "verified_user", text: "Multi-Factor Authentication (OTP + Biometric)", badge: "Active" },
                { icon: "lock", text: "End-to-end encrypted wallet infrastructure", badge: "256-bit" },
                { icon: "gavel", text: "Atomic escrow — disputes resolved in minutes", badge: "On-chain" },
                { icon: "visibility_off", text: "Non-custodial — we never hold your keys", badge: "Self-sovereign" },
              ].map((item) => (
                <div key={item.text} className="flex items-center justify-between p-4 bg-surface-container rounded-sm border border-outline-variant/10 hover:border-tertiary/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                  <span className="text-[9px] text-tertiary font-bold uppercase tracking-widest bg-tertiary/10 px-1.5 py-0.5 rounded-sm whitespace-nowrap ml-3 hidden sm:block">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────── */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4">Community</span>
            <h2 className="font-headline text-3xl md:text-4xl font-black tracking-tight">
              Loved by <span className="text-secondary">Traders</span> Worldwide
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-6 hover:border-primary/20 transition-all group relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="font-headline text-7xl font-black text-on-surface">&ldquo;</span>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#f3ba2f] text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-headline font-bold text-base`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.author}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden border-t border-outline-variant/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="terminal-grid absolute inset-0 opacity-10" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6">Join Now</span>
          <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tight mb-4">
            Ready to Trade?
          </h2>
          <p className="text-on-surface-variant mb-10 max-w-lg mx-auto text-lg">
            Join 180,000+ traders using CoinCash for fast, secure, peer-to-peer crypto exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-12 py-5 text-sm font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all shadow-2xl shadow-primary/25"
            >
              Create Free Account
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-surface-container-high border border-outline-variant/20 text-on-surface px-10 py-5 text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-surface-container-highest transition-all"
            >
              Sign In
            </Link>
          </div>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
            No fees to create an account · Start trading in under 60 seconds · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>currency_exchange</span>
                </div>
                <span className="font-headline text-lg font-bold">
                  Coin<span className="text-primary">Cash</span>
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                The next-generation P2P crypto exchange. Trade directly with peers, powered by atomic escrow and AI bots.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-surface-container-high rounded-sm flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline-variant/10"
                  aria-label="X / Twitter"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/>
                  </svg>
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-surface-container-high rounded-sm flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline-variant/10"
                  aria-label="Telegram"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-surface-container-high rounded-sm flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline-variant/10"
                  aria-label="Discord"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.053a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs">
              <div>
                <p className="font-bold uppercase tracking-widest text-on-surface mb-4 text-[10px]">Product</p>
                <div className="space-y-3">
                  <Link href="/p2p" className="block text-on-surface-variant hover:text-primary transition-colors">P2P Trading</Link>
                  <Link href="/markets" className="block text-on-surface-variant hover:text-primary transition-colors">Markets</Link>
                  <Link href="/bot" className="block text-on-surface-variant hover:text-primary transition-colors">Trading Bots</Link>
                  <Link href="/assets" className="block text-on-surface-variant hover:text-primary transition-colors">Wallet</Link>
                </div>
              </div>
              <div>
                <p className="font-bold uppercase tracking-widest text-on-surface mb-4 text-[10px]">Company</p>
                <div className="space-y-3">
                  <a href="#" className="block text-on-surface-variant hover:text-primary transition-colors">About Us</a>
                  <a href="#" className="block text-on-surface-variant hover:text-primary transition-colors">Careers</a>
                  <a href="#" className="block text-on-surface-variant hover:text-primary transition-colors">Blog</a>
                  <a href="#" className="block text-on-surface-variant hover:text-primary transition-colors">Press</a>
                </div>
              </div>
              <div>
                <p className="font-bold uppercase tracking-widest text-on-surface mb-4 text-[10px]">Legal</p>
                <div className="space-y-3">
                  <a href="#" className="block text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
                  <a href="#" className="block text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
                  <a href="#" className="block text-on-surface-variant hover:text-primary transition-colors">Cookie Policy</a>
                  <a href="#" className="block text-on-surface-variant hover:text-primary transition-colors">AML Policy</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-outline-variant/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">
              © 2026 CoinCash Technologies Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] text-on-surface-variant uppercase tracking-widest">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
