import { AppShell } from "@/components/app-shell";

export default function BuyPage() {
  return (
    <AppShell currentPath="/p2p">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Transaction Breadcrumb */}
        <div className="flex items-center gap-2 text-on-surface-variant mb-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span className="font-label text-xs uppercase tracking-[0.1em]">
            P2P Markets / USDT Buy
          </span>
        </div>

        {/* Kinetic Monolith Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
          {/* LEFT COLUMN: Merchant & Status */}
          <div className="md:col-span-4 bg-surface-container-low p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-sm">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shield_person
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-on-surface">Kinetic_Alpha</h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      Verified Merchant
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Merchant Statistics
                  </p>
                  <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                    <span className="text-xs text-on-surface/80">Completion Rate</span>
                    <span className="text-sm font-bold text-primary">99.8%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                    <span className="text-xs text-on-surface/80">Avg. Release</span>
                    <span className="text-sm font-bold text-on-surface">1.42 min</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Trade Conditions
                  </p>
                  <div className="flex items-center gap-2 text-xs py-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      check_circle
                    </span>
                    <span>No 3rd party payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs py-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      check_circle
                    </span>
                    <span>Zelle Instant only</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-outline-variant/10">
              <p className="text-[10px] leading-relaxed text-on-surface-variant uppercase tracking-tighter">
                Encrypted Trade Terminal<br />Session: TRD-992-ALPHA
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Trade Inputs */}
          <div className="md:col-span-8 space-y-1">
            {/* Price Module */}
            <div className="bg-surface-container-high p-6 flex justify-between items-center">
              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Exchange Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline font-bold text-primary">1.041</span>
                  <span className="text-sm text-on-surface-variant uppercase font-medium">USD / USDT</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Available Liquidity
                </p>
                <p className="text-lg font-medium text-on-surface">4,520.00 USDT</p>
              </div>
            </div>

            {/* Input Module */}
            <div className="bg-surface-container-highest p-8 space-y-8">
              {/* I Want to Pay */}
              <div className="space-y-2 group">
                <div className="flex justify-between items-end">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    I want to pay
                  </label>
                  <span className="text-[10px] text-on-surface-variant">Min: 100.00 / Max: 2,500.00</span>
                </div>
                <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/15 focus-within:border-primary/40 transition-all px-4 py-4">
                  <input
                    className="bg-transparent border-none focus:ring-0 text-2xl font-bold w-full text-on-surface placeholder:text-on-surface-variant/30"
                    placeholder="0.00"
                    type="number"
                  />
                  <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/15">
                    <span className="font-bold text-sm tracking-widest">USD</span>
                    <div className="bg-surface-bright px-2 py-1 text-[10px] font-bold text-primary cursor-pointer hover:bg-primary hover:text-on-primary transition-colors">
                      MAX
                    </div>
                  </div>
                </div>
              </div>

              {/* I Will Receive */}
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  I will receive
                </label>
                <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/15 px-4 py-4">
                  <input
                    className="bg-transparent border-none focus:ring-0 text-2xl font-bold w-full text-on-surface-variant"
                    placeholder="0.00"
                    readOnly
                    type="number"
                  />
                  <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/15">
                    <span className="font-bold text-sm tracking-widest">USDT</span>
                    <span className="material-symbols-outlined text-on-surface-variant">
                      currency_exchange
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Select */}
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Payment Method
                </label>
                <div className="bg-surface-container-low p-4 flex items-center justify-between border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#6b21a8]/20 flex items-center justify-center rounded-sm">
                      <span className="text-xs font-black italic text-[#a855f7]">Zelle</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider">Zelle Instant Transfer</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">0.00 Fee • Immediate Settlement</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">radio_button_checked</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-bold text-lg uppercase tracking-[0.2em] shadow-[0_8px_30px_rgba(2,201,83,0.15)] active:scale-[0.98] transition-all">
                BUY USDT
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-on-surface-variant uppercase font-medium tracking-widest">
                <span className="material-symbols-outlined text-sm">lock</span>
                Secured by Escrow Terminal
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Details (Bento Sub-Section) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          <div className="bg-surface-container-low p-6">
            <h3 className="font-label text-[10px] uppercase tracking-widest text-primary mb-4">Merchant Terms</h3>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              1. Must be the account owner. <br />
              2. No memo required in transfer. <br />
              3. Release occurs within 2 minutes of payment confirmation. <br />
              4. Any fraud attempts will be reported to the terminal moderator.
            </p>
          </div>
          <div className="bg-surface-container-low p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Safety Checklist</h3>
              <ul className="text-[11px] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Only pay through the app
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Verify recipient name
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Keep payment receipt
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-surface-container-low overflow-hidden relative group">
            <img
              alt="Security Data"
              className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn-le0guEQNoyvc1UNYzuFKMydef1VaNUmy-irjpsgxk73Vn2yvgM0_u5BvdYXOsQ3pcjfgFqPpRvqJ4N0PWfg_xKWIZQEJHxlmdfXu5EQnQ7YvHMkTpH2TCug7EZGpyMd81WVMNIGdRi8Sr26LmjavVWXoSpddg37QqBDM9JhtRx6mX14UCxwJ9R7oPEAf5vOPxxYP0JqXg5EK4r4Jr_FqjMJ3hWTYGjiFJnsF0rhR6_JoU8rko3rCvk_GhSYqf5rdn2X4NA5VPk"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-surface-container-low to-transparent">
              <p className="font-headline font-bold text-xl leading-tight text-white z-10">
                100% SECURE<br />LIQUIDITY
              </p>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold z-10 mt-1">
                Protocol Verified
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
