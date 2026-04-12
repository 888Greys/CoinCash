import Link from "next/link";
import { AppShell } from "@/components/app-shell";

type Merchant = {
  name: string;
  verified: boolean;
  online: boolean;
  trustScore: string;
  price: string;
  speed: string;
  available: string;
  limit: string;
  methods: string[];
};

const merchants: Merchant[] = [
  {
    name: "KINETIC_ALPHA",
    verified: true,
    online: true,
    trustScore: "100% (2.4k)",
    price: "1.041",
    speed: "~1.2 MIN",
    available: "85,240.00 USDT",
    limit: "$500 - $15,000",
    methods: ["Zelle", "Wise"],
  },
  {
    name: "CRYPTO_BEAST_99",
    verified: false,
    online: true,
    trustScore: "98.2% (1.1k)",
    price: "1.042",
    speed: "~3.5 MIN",
    available: "12,000.00 USDT",
    limit: "$100 - $5,000",
    methods: ["Bank Transfer"],
  },
  {
    name: "ZEN_EXCHANGE",
    verified: true,
    online: false,
    trustScore: "99.8% (5.8k)",
    price: "1.045",
    speed: "~0.8 MIN",
    available: "450,112.00 USDT",
    limit: "$1,000 - $100,000",
    methods: ["Swift", "Sepa"],
  },
  {
    name: "GLOBAL_LINK",
    verified: false,
    online: true,
    trustScore: "97.4% (890)",
    price: "1.047",
    speed: "~2.1 MIN",
    available: "5,400.00 USDT",
    limit: "$50 - $2,000",
    methods: ["Revolut"],
  },
  {
    name: "ORBIT_P2P",
    verified: true,
    online: true,
    trustScore: "99.1% (3.4k)",
    price: "1.048",
    speed: "~1.5 MIN",
    available: "102,400.00 USDT",
    limit: "$1,000 - $15,000",
    methods: ["Wire", "Cash"],
  },
  {
    name: "NOMAD_TRADES",
    verified: false,
    online: false,
    trustScore: "96.8% (420)",
    price: "1.049",
    speed: "~5.0 MIN",
    available: "3,500.00 USDT",
    limit: "$20 - $500",
    methods: ["AirTM"],
  },
];

const stats = [
  { label: "24h Vol (USDT)", value: "1.48M", color: "" },
  { label: "Active Peers", value: "12,402", color: "text-primary" },
  { label: "Avg. Settlement", value: "02:45", unit: "MIN", color: "" },
  { label: "Trust Score Avg.", value: "98.4%", color: "" },
];

const settlements = [
  { text: "BUY 2,400.00 USDT", actor: "KINETIC_ALPHA", time: "Just Now", active: true },
  { text: "SELL 15,000.00 USDT", actor: "ZEN_EXCHANGE", time: "2m ago", active: false },
  { text: "BUY 500.00 USDT", actor: "ORBIT_P2P", time: "4m ago", active: false },
];

export default function P2PPage() {
  return (
    <AppShell currentPath="/p2p">
      <div className="px-4 md:px-8 pt-6 max-w-7xl mx-auto">
        {/* Sub-Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter mb-2">
              P2P TERMINAL{" "}
              <span className="text-primary text-sm font-label uppercase tracking-widest bg-primary/10 px-2 py-1 ml-2">
                PRO MODE
              </span>
            </h1>
            <p className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em]">
              Liquid peer-to-peer exchange for high-frequency settlement
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-sm border border-outline-variant/10">
            <button className="px-6 py-2 bg-surface-bright text-on-surface font-label text-xs font-bold uppercase tracking-widest">
              Buy
            </button>
            <button className="px-6 py-2 text-on-surface-variant hover:text-on-surface font-label text-xs font-bold uppercase tracking-widest">
              Sell
            </button>
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

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 py-4 border-y border-outline-variant/10">
          <div className="relative group min-w-[140px]">
            <span className="absolute top-0 left-3 -translate-y-1/2 bg-surface px-1 text-[9px] text-primary font-bold uppercase tracking-tighter">Asset</span>
            <div className="bg-surface-container-lowest border border-outline-variant/20 px-3 py-2 flex items-center justify-between cursor-pointer">
              <span className="font-headline font-bold text-sm">USDT</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </div>
          </div>
          <div className="relative group min-w-[140px]">
            <span className="absolute top-0 left-3 -translate-y-1/2 bg-surface px-1 text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter">Fiat</span>
            <div className="bg-surface-container-lowest border border-outline-variant/20 px-3 py-2 flex items-center justify-between cursor-pointer">
              <span className="font-headline font-bold text-sm">USD</span>
              <span className="material-symbols-outlined text-xs text-on-surface-variant">expand_more</span>
            </div>
          </div>
          <div className="relative group flex-grow">
            <span className="absolute top-0 left-3 -translate-y-1/2 bg-surface px-1 text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter">Payment Method</span>
            <div className="bg-surface-container-lowest border border-outline-variant/20 px-3 py-2 flex items-center justify-between cursor-pointer">
              <span className="font-label text-xs uppercase tracking-widest">All Methods</span>
              <span className="material-symbols-outlined text-xs text-on-surface-variant">filter_list</span>
            </div>
          </div>
          <button className="bg-primary/10 text-primary p-2 border border-primary/20 hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        {/* Merchant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {merchants.map((m) => (
            <div key={m.name} className="bg-surface-container-low p-4 group hover:bg-surface-container-high transition-all duration-200 cursor-pointer">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${m.online ? "bg-primary shadow-[0_0_8px_rgba(92,253,128,0.5)]" : "bg-on-surface-variant"} rounded-full`} />
                  <h3 className="font-label text-sm font-bold tracking-tight">{m.name}</h3>
                  {m.verified && (
                    <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Trust Score</span>
                  <span className="block font-headline text-xs font-bold text-primary">{m.trustScore}</span>
                </div>
              </div>

              {/* Price / Speed */}
              <div className="flex items-center justify-between mb-4 border-b border-outline-variant/5 pb-4">
                <div>
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Price</span>
                  <span className="block font-headline text-2xl font-black">
                    {m.price} <span className="text-xs font-normal text-on-surface-variant">USD</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Speed</span>
                  <span className="block font-label text-xs font-bold">{m.speed}</span>
                </div>
              </div>

              {/* Available / Limit */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block font-label text-[9px] text-on-surface-variant uppercase tracking-tighter">Available</span>
                  <span className="block font-headline text-sm font-medium">{m.available}</span>
                </div>
                <div className="text-right">
                  <span className="block font-label text-[9px] text-on-surface-variant uppercase tracking-tighter">Limit</span>
                  <span className="block font-headline text-sm font-medium">{m.limit}</span>
                </div>
              </div>

              {/* Methods + Action */}
              <div className="flex items-center gap-2">
                <div className="flex-grow flex gap-1 overflow-hidden">
                  {m.methods.map((method) => (
                    <span key={method} className="px-2 py-1 bg-surface-container-highest text-[9px] font-bold uppercase text-on-surface-variant">
                      {method}
                    </span>
                  ))}
                </div>
                <Link
                  className="bg-gradient-to-br from-primary to-primary-container px-6 py-2 text-on-primary-container font-label text-xs font-black uppercase tracking-widest rounded-sm active:scale-95 transition-transform"
                  href="/p2p/buy"
                >
                  Buy USDT
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Panels */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 mb-8">
          {/* Settlement Activity */}
          <div className="flex-grow bg-surface-container-low p-6">
            <h4 className="font-headline text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-primary">history</span>
              Settlement Activity
            </h4>
            <div className="space-y-3">
              {settlements.map((s, i) => (
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
              KINETIC handles all escrow settlements. Never release assets until you have verified the receipt of funds
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
