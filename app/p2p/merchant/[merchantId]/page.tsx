import { AppShell } from "@/components/app-shell";

export default function MerchantProfilePage() {
  return (
    <AppShell currentPath="/p2p">
      <div className="pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Merchant Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Profile Card */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-lg p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-lg bg-surface-container-highest border border-primary/30 flex items-center justify-center overflow-hidden">
                  <img
                    alt="Kinetic_Alpha"
                    className="w-full h-full p-2 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuARO-w4w99FKMFwVAaLTaTFUrAJmZh4EZwzmqcW3L4pp9ARPBgU-I9nn7adPzo5ehWHXPNxud4w0jwKzBujoUflo7RLy1otkTHLa3PxcxbNp9zZGHOl2h19IwX2dxgoZTYd3oq85-tCzvbWGxnDMpgvaBeSjXsdb2AVxsca-I8KuWEeXfYQlXssGBcbmGL1DOLDgjIYN00DzhgQmuqR3skkzPhAx8yxyIBZpLhHKD77Q_dJZc28F2jhMJfC6jGy5T9I1neHzl6vtVg"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary-container px-2 py-0.5 rounded-sm font-label text-[10px] font-bold">
                  PRO
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tight">Kinetic_Alpha</h1>
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md uppercase tracking-wider font-label">
                  Tier 1 liquidity provider • Specializing in high-volume USDT/BTC settlement
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface-container-high p-3 rounded-sm">
                    <span className="block text-on-surface-variant font-label text-[10px] tracking-widest uppercase mb-1">Completion</span>
                    <span className="text-primary font-headline text-xl font-bold">100%</span>
                  </div>
                  <div className="bg-surface-container-high p-3 rounded-sm">
                    <span className="block text-on-surface-variant font-label text-[10px] tracking-widest uppercase mb-1">Total Trades</span>
                    <span className="text-on-surface font-headline text-xl font-bold">2,400</span>
                  </div>
                  <div className="bg-surface-container-high p-3 rounded-sm">
                    <span className="block text-on-surface-variant font-label text-[10px] tracking-widest uppercase mb-1">Avg Release</span>
                    <span className="text-secondary font-headline text-xl font-bold">0.8m</span>
                  </div>
                  <div className="bg-surface-container-high p-3 rounded-sm">
                    <span className="block text-on-surface-variant font-label text-[10px] tracking-widest uppercase mb-1">Positive</span>
                    <span className="text-primary font-headline text-xl font-bold">99.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Score Visualization */}
          <div className="lg:col-span-4 bg-surface-container-low rounded-lg p-6 flex flex-col justify-between border-l-2 border-primary/40">
            <div>
              <h3 className="font-label text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-4">Trust Analytics</h3>
              <div className="flex items-end gap-1 h-24 mb-4">
                <div className="flex-1 bg-primary/20 h-[60%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/30 h-[75%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/40 h-[90%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary h-full rounded-t-sm shadow-[0_0_15px_rgba(92,253,128,0.3)]"></div>
                <div className="flex-1 bg-primary/60 h-[85%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/40 h-[70%] rounded-t-sm"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-label text-xs uppercase text-on-surface-variant">Merchant Score</span>
                <span className="text-primary font-headline font-bold">988/1000</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[98.8%]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Advertisements */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-xl font-bold tracking-tight flex items-center gap-2">
              ONLINE_ADS
              <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded-full text-on-surface-variant font-label">
                4 ACTIVE
              </span>
            </h2>
            <div className="flex gap-2">
              <button className="bg-surface-bright px-4 py-2 rounded-sm font-label text-[10px] font-bold tracking-widest text-primary uppercase border border-primary/10 hover:bg-primary/10 transition-colors">
                BUY_OFFERS
              </button>
              <button className="bg-surface-container-high px-4 py-2 rounded-sm font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase border border-transparent hover:bg-surface-bright transition-colors">
                SELL_OFFERS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ad Card 1 */}
            <div className="bg-surface-container-low rounded-sm p-5 hover:bg-surface-container-high transition-colors group cursor-pointer border border-transparent hover:border-primary/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-sm">
                    <span className="material-symbols-outlined text-primary">currency_bitcoin</span>
                  </div>
                  <div>
                    <span className="block font-headline text-lg font-bold">BTC / USD</span>
                    <span className="block font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Fast Settlement Guaranteed</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-headline text-xl font-bold text-primary tracking-tight">64,231.50</span>
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase">Price Per Unit</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/10 mb-4">
                <div>
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase mb-1">Available</span>
                  <span className="block font-body text-sm font-medium">0.4523 BTC</span>
                </div>
                <div>
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase mb-1">Limits</span>
                  <span className="block font-body text-sm font-medium">$500 - $25,000</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-surface-container-highest rounded-sm font-label text-[9px] text-on-surface-variant uppercase">Zelle</span>
                  <span className="px-2 py-1 bg-surface-container-highest rounded-sm font-label text-[9px] text-on-surface-variant uppercase">Bank Transfer</span>
                </div>
                <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-2 rounded-sm font-label text-xs font-black uppercase tracking-widest active:scale-95 duration-200">
                  BUY_BTC
                </button>
              </div>
            </div>

            {/* Ad Card 2 */}
            <div className="bg-surface-container-low rounded-sm p-5 hover:bg-surface-container-high transition-colors group cursor-pointer border border-transparent hover:border-primary/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-sm">
                    <span className="material-symbols-outlined text-primary">monetization_on</span>
                  </div>
                  <div>
                    <span className="block font-headline text-lg font-bold">USDT / USD</span>
                    <span className="block font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Verified Merchants Only</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-headline text-xl font-bold text-primary tracking-tight">1.012</span>
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase">Price Per Unit</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/10 mb-4">
                <div>
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase mb-1">Available</span>
                  <span className="block font-body text-sm font-medium">150,000 USDT</span>
                </div>
                <div>
                  <span className="block font-label text-[10px] text-on-surface-variant uppercase mb-1">Limits</span>
                  <span className="block font-body text-sm font-medium">$1,000 - $50,000</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-surface-container-highest rounded-sm font-label text-[9px] text-on-surface-variant uppercase">Wire</span>
                  <span className="px-2 py-1 bg-surface-container-highest rounded-sm font-label text-[9px] text-on-surface-variant uppercase">Cash App</span>
                </div>
                <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-2 rounded-sm font-label text-xs font-black uppercase tracking-widest active:scale-95 duration-200">
                  BUY_USDT
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Feed Segment */}
        <section className="mt-12">
          <h3 className="font-label text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-6 flex items-center gap-3">
            REAL_TIME_FEED
            <span className="flex-1 h-[1px] bg-outline-variant/20"></span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 px-4 bg-surface-container-low/50 rounded-sm">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-sm">history</span>
                <span className="text-xs font-body text-on-surface-variant">Trade #88293 completed with 0x4...F29</span>
              </div>
              <span className="font-label text-[10px] text-on-surface-variant">2 MIN AGO</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-surface-container-low/50 rounded-sm">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-sm">history</span>
                <span className="text-xs font-body text-on-surface-variant">Merchant updated price for BTC/USD</span>
              </div>
              <span className="font-label text-[10px] text-on-surface-variant">15 MIN AGO</span>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
