import { AppShell } from "@/components/app-shell";

export default function PostAdPage() {
  return (
    <AppShell currentPath="/p2p">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb / Progress */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">CREATE_NEW_AD</h2>
            <p className="text-on-surface-variant text-sm uppercase tracking-[0.1em]">Configuring Merchant Liquidity Node</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-sm bg-primary text-on-primary-container flex items-center justify-center font-bold text-xs">01</div>
              <span className="text-[9px] mt-1 font-bold text-primary uppercase">Asset</span>
            </div>
            <div className="w-12 h-[1px] bg-outline-variant/30 mb-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-sm bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-xs border border-outline-variant/20">02</div>
              <span className="text-[9px] mt-1 font-bold text-on-surface-variant uppercase opacity-60">Price</span>
            </div>
            <div className="w-12 h-[1px] bg-outline-variant/30 mb-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-sm bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-xs border border-outline-variant/20">03</div>
              <span className="text-[9px] mt-1 font-bold text-on-surface-variant uppercase opacity-60">Limits</span>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Asset & Type */}
            <section className="bg-surface-container-low p-6 rounded-sm space-y-8">
              <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                <span className="material-symbols-outlined text-secondary text-lg">settings_input_component</span>
                <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Step 01: Asset Configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Type */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Transaction Type</label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-primary-container/10 border border-primary text-primary font-bold text-xs uppercase tracking-tighter rounded-sm flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">download</span> I WANT TO BUY
                    </button>
                    <button className="flex-1 py-3 bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant font-bold text-xs uppercase tracking-tighter rounded-sm flex items-center justify-center gap-2 hover:bg-surface-bright transition-all">
                      <span className="material-symbols-outlined text-sm">upload</span> I WANT TO SELL
                    </button>
                  </div>
                </div>

                {/* Asset Selection */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cryptocurrency Asset</label>
                  <div className="relative">
                    <select className="w-full bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-4 rounded-sm appearance-none focus:outline-none text-sm font-medium">
                      <option>USDT (Tether USD)</option>
                      <option>BTC (Bitcoin)</option>
                      <option>ETH (Ethereum)</option>
                      <option>BNB (Binance Coin)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Pricing Logic */}
            <section className="bg-surface-container-low p-6 rounded-sm space-y-8">
              <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                <span className="material-symbols-outlined text-secondary text-lg">monitoring</span>
                <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Step 02: Pricing Engine</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-highest border-l-2 border-primary rounded-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-primary uppercase">Floating Price</span>
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">Price updates automatically based on market fluctuations. Best for high-volatility assets.</p>
                  </div>
                  <div className="p-4 bg-[#000000] border border-outline-variant/10 rounded-sm opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">Fixed Price</span>
                      <div className="w-4 h-4 rounded-full border border-outline-variant"></div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">Price remains constant regardless of market movement. Best for stable coin dominance.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Floating Margin (%)</label>
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Suggested: 101.5%</span>
                    </div>
                    <div className="flex items-center bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 rounded-sm p-1">
                      <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">remove</span></button>
                      <input className="flex-1 bg-transparent border-none text-center font-bold font-headline text-lg focus:ring-0" type="text" defaultValue="101.20" />
                      <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">add</span></button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Calculated Ad Price</label>
                    <div className="h-12 flex items-center px-4 bg-surface-container-highest rounded-sm border border-outline-variant/10">
                      <span className="font-headline font-bold text-lg text-on-surface">1.012 <span className="text-xs text-on-surface-variant">USD/USDT</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Limits */}
            <section className="bg-surface-container-low p-6 rounded-sm space-y-8">
              <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                <span className="material-symbols-outlined text-secondary text-lg">rule</span>
                <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Step 03: Liquidity Limits</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Trading Amount</label>
                  <div className="relative">
                    <input className="w-full bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-4 rounded-sm focus:outline-none text-sm font-headline font-medium" placeholder="0.00" type="number" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary uppercase">USDT</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant px-1">
                    <span>Min: 100 USDT</span>
                    <span>Max: 50,000 USDT</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Order Limit (Per Trade)</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input className="w-full bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-3 rounded-sm focus:outline-none text-sm font-medium" placeholder="Min" type="number" />
                    </div>
                    <div className="w-4 h-[1px] bg-outline-variant/30"></div>
                    <div className="relative flex-1">
                      <input className="w-full bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-3 rounded-sm focus:outline-none text-sm font-medium" placeholder="Max" type="number" />
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">USD</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Payment Method Configuration</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-surface-container-highest border border-primary/40 rounded-sm flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase">Bank Transfer</span>
                    <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                  </div>
                  <div className="p-3 bg-surface-container-highest border border-primary/40 rounded-sm flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase">Zelle</span>
                    <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                  </div>
                  <div className="p-3 bg-[#000000] border border-outline-variant/10 rounded-sm flex items-center justify-center opacity-40 hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined text-sm mr-2">add</span>
                    <span className="text-[10px] font-bold uppercase">Add New</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <button className="px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-extrabold font-headline uppercase tracking-widest text-sm rounded-sm active:scale-95 transition-all shadow-lg shadow-primary/10">
                Publish Ad To Market
              </button>
            </div>
          </div>

          {/* Right Column: Preview & Metadata */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              {/* Live Preview Card */}
              <div className="bg-surface-container-high rounded-sm overflow-hidden shadow-2xl">
                <div className="bg-primary/10 px-4 py-3 flex justify-between items-center border-b border-primary/20">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Merchant Preview</span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                </div>
                <div className="p-5 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-bright flex items-center justify-center rounded-sm text-primary font-bold">JD</div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm">JohnDoe_FX</span>
                        <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
                        <span>1,420 orders</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span>99.2% Completion</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Price</div>
                    <div className="font-headline text-2xl font-bold text-primary">1.012 <span className="text-sm font-medium text-on-surface">USD</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/10">
                    <div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase">Available</div>
                      <div className="text-xs font-bold">12,450.00 USDT</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase">Limit</div>
                      <div className="text-xs font-bold">$100 - $5,000</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Payment Methods</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-surface-container-highest text-[9px] font-bold uppercase rounded-sm border border-outline-variant/20">Bank Transfer</span>
                      <span className="px-2 py-1 bg-surface-container-highest text-[9px] font-bold uppercase rounded-sm border border-outline-variant/20">Zelle</span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-primary text-on-primary-container font-black uppercase text-xs tracking-widest opacity-80 cursor-not-allowed">Buy USDT</button>
                </div>
              </div>

              {/* Quick Guidelines */}
              <div className="mt-6 p-5 bg-surface-container-low rounded-sm border-l-4 border-secondary/40">
                <h4 className="text-xs font-bold text-secondary uppercase mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Merchant Protocols
                </h4>
                <ul className="space-y-3 text-[11px] text-on-surface-variant leading-tight">
                  <li className="flex gap-2">
                    <span className="text-secondary">•</span>
                    Ensure your floating margin covers the platform's 0.1% merchant fee.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-secondary">•</span>
                    Response time affects your ranking in the P2P marketplace.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-secondary">•</span>
                    Always verify payment in your bank account before releasing assets.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
