import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "CoinCash — The Future of P2P Exchange",
};

const features = [
  {
    icon: "swap_horiz",
    title: "P2P Exchange",
    description: "Trade crypto directly with peers using your preferred payment method. Zero hidden fees.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: "smart_toy",
    title: "Trading Bots",
    description: "Deploy automated grid, DCA, and arbitrage bots. Let algorithms work while you sleep.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: "security",
    title: "Bank-Grade Security",
    description: "Multi-factor authentication, encrypted wallets, and real-time monitoring.",
    color: "text-tertiary",
    bg: "bg-tertiary/10",
  },
  {
    icon: "speed",
    title: "Instant Settlement",
    description: "Atomic escrow ensures trades settle in seconds, not hours. Your funds are always safe.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const stats = [
  { value: "$2.4B+", label: "Trading Volume" },
  { value: "180K+", label: "Active Users" },
  { value: "40+", label: "Supported Assets" },
  { value: "99.99%", label: "Uptime" },
];

const cryptoLogos = [
  { src: "/icons/btc.svg", name: "BTC" },
  { src: "/icons/eth.svg", name: "ETH" },
  { src: "/icons/usdt.svg", name: "USDT" },
  { src: "/icons/bnb.svg", name: "BNB" },
  { src: "/icons/sol.svg", name: "SOL" },
  { src: "/icons/avax.svg", name: "AVAX" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface text-on-surface overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-headline text-xl font-bold tracking-tight">
            Coin<span className="text-primary">Cash</span>
          </h1>
          <div className="hidden md:flex items-center gap-8 text-sm font-label uppercase tracking-widest text-on-surface-variant">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#markets" className="hover:text-primary transition-colors">Markets</a>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hidden sm:block">
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
          <div className="terminal-grid absolute inset-0 opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Trading</span>
            </div>

            <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              The Future of<br />
              <span className="text-primary">Peer-to-Peer</span><br />
              Exchange
            </h2>

            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Trade crypto directly with peers worldwide. Zero intermediaries, atomic escrow settlement, and AI-powered trading bots — all in one terminal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-10 py-4 text-sm font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
                Start Trading
              </Link>
              <Link
                href="/markets"
                className="inline-flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 text-on-surface px-8 py-4 text-sm font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">trending_up</span>
                View Markets
              </Link>
            </div>
          </div>

          {/* Floating Crypto Logos */}
          <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-6">
            {cryptoLogos.map((logo, i) => (
              <div
                key={logo.name}
                className="w-14 h-14 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant/10 shadow-xl hover:scale-110 transition-transform"
                style={{ transform: `translateX(${Math.sin(i * 1.2) * 40}px)` }}
              >
                <Image src={logo.src} alt={logo.name} width={32} height={32} unoptimized />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-headline text-3xl md:text-4xl font-black text-primary tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-headline text-3xl md:text-4xl font-black tracking-tight mb-4">
              Built for <span className="text-primary">Serious</span> Traders
            </h3>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Every feature is designed to give you an edge in the market. From automated bots to instant P2P settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 hover:border-primary/20 transition-all group relative overflow-hidden"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined ${feature.color} text-2xl`}>{feature.icon}</span>
                </div>
                <h4 className="font-headline font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.description}</p>
                <span className={`material-symbols-outlined absolute -bottom-6 -right-6 text-8xl ${feature.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none`}>
                  {feature.icon}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Assets Marquee */}
      <section id="markets" className="py-16 px-6 bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-headline text-2xl font-bold tracking-tight mb-2">Trade 40+ Assets</h3>
            <p className="text-sm text-on-surface-variant">From Bitcoin to stablecoins — all available for P2P trading.</p>
          </div>
          <div className="flex justify-center gap-8 flex-wrap">
            {cryptoLogos.map((logo) => (
              <div key={logo.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center border border-outline-variant/10 group-hover:border-primary/30 group-hover:scale-110 transition-all shadow-lg">
                  <Image src={logo.src} alt={logo.name} width={36} height={36} unoptimized />
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6">Security</span>
            <h3 className="font-headline text-3xl md:text-4xl font-black tracking-tight mb-6">
              Your Assets.<br />
              <span className="text-tertiary">Fort Knox</span> Protected.
            </h3>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              We use industry-leading encryption, multi-signature wallets, and continuous monitoring to keep your funds safe. Every trade is settled through our atomic escrow smart contract — funds are never at risk.
            </p>
            <div className="space-y-4">
              {[
                { icon: "verified_user", text: "Multi-Factor Authentication (OTP + Biometric)" },
                { icon: "lock", text: "End-to-end encrypted wallet infrastructure" },
                { icon: "gavel", text: "Atomic escrow — disputes resolved in minutes" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="w-72 h-72 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant/10 relative">
              <span className="material-symbols-outlined text-7xl text-tertiary/20">shield</span>
              <div className="absolute w-full h-full rounded-full border border-tertiary/10 animate-ping" style={{ animationDuration: "3s" }} />
              <div className="absolute w-[120%] h-[120%] rounded-full border border-tertiary/5 animate-ping" style={{ animationDuration: "4s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-surface-container-low to-primary/5 border-t border-outline-variant/10">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-headline text-3xl md:text-4xl font-black tracking-tight mb-4">
            Ready to Trade?
          </h3>
          <p className="text-on-surface-variant mb-10 max-w-lg mx-auto">
            Join thousands of traders using CoinCash for fast, secure peer-to-peer crypto exchange.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-12 py-5 text-sm font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Create Free Account
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <p className="text-[10px] text-on-surface-variant mt-4 uppercase tracking-widest">No fees to create an account • Start trading in under 60 seconds</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="font-headline text-lg font-bold tracking-tight">
              Coin<span className="text-primary">Cash</span>
            </h4>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
              The Next-Gen P2P Exchange Terminal
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-on-surface-variant uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="#" className="hover:text-primary transition-colors">API</a>
          </div>
          <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">
            © 2026 CoinCash. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
