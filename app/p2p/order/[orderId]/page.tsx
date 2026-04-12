import { AppShell } from "@/components/app-shell";

export default function OrderPage() {
  return (
    <AppShell currentPath="/p2p">
      <div className="pt-6 pb-24 md:pb-8 px-4 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 space-y-6">
            {/* Header info */}
            <div className="bg-surface-container-low p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">Order #29384755</span>
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface uppercase">Pending Payment</h2>
              </div>
              <div className="bg-surface-container-high px-6 py-4 border-l-4 border-primary">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Time Remaining</span>
                <span className="font-headline text-4xl font-light tracking-tighter text-primary">14:58</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <div className="bg-surface-container-high p-5">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">Total Amount</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-2xl font-bold">2,500.00</span>
                  <span className="font-label text-xs text-on-surface-variant">USD</span>
                </div>
              </div>
              <div className="bg-surface-container-high p-5">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-2xl font-bold">1.02</span>
                  <span className="font-label text-xs text-on-surface-variant">USD/USDT</span>
                </div>
              </div>
              <div className="bg-surface-container-high p-5">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">Receive Amount</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-2xl font-bold text-primary">2,450.98</span>
                  <span className="font-label text-xs text-primary">USDT</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-surface-container-low p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest">Payment Method</h3>
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5">Verified Merchant</span>
              </div>
              <div className="space-y-4">
                <div className="group cursor-pointer bg-surface-container-highest p-4 flex items-center justify-between border-l-2 border-transparent hover:border-primary transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-bright flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                    </div>
                    <div>
                      <p className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider">Bank Transfer</p>
                      <p className="font-medium text-sm">Chase Manhattan Bank</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">content_copy</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface-container-highest/50 p-4">
                    <span className="font-label text-[10px] uppercase text-on-surface-variant tracking-widest block mb-1">Account Name</span>
                    <p className="text-sm font-medium">CYBER_DYNE SOLUTIONS LTD</p>
                  </div>
                  <div className="bg-surface-container-highest/50 p-4">
                    <span className="font-label text-[10px] uppercase text-on-surface-variant tracking-widest block mb-1">Account Number</span>
                    <p className="text-sm font-medium tracking-widest">**** **** 8829</p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-8 p-4 bg-error/5 border-l-2 border-error">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-error text-sm">warning</span>
                  <p className="text-[11px] text-on-surface/80 leading-relaxed uppercase tracking-tight">
                    Do not click "I have paid" before making the transfer. Use only your own verified account. Fraudulent reports will result in immediate terminal blacklisting.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 duration-200 rounded-sm">
                I have paid
              </button>
              <button className="flex-1 h-14 bg-surface-container-highest border border-outline-variant/20 text-on-surface/60 font-headline font-bold uppercase tracking-widest text-sm hover:bg-surface-bright active:scale-95 duration-200 rounded-sm">
                Cancel Order
              </button>
            </div>
          </section>

          {/* Chat Aside */}
          <aside className="lg:col-span-5 h-[600px] lg:h-[calc(100vh-[240px])] flex flex-col bg-surface-container-low border-l border-outline-variant/10">
            <div className="p-4 bg-surface-container-high flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">support_agent</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary border-2 border-surface-container-high rounded-full"></div>
                </div>
                <div>
                  <p className="font-headline text-sm font-bold uppercase">Aura_Trader_X</p>
                  <p className="text-[10px] text-primary uppercase font-bold tracking-tighter">Avg. Release: 2.5 min</p>
                </div>
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div className="flex justify-center">
                <span className="bg-surface-variant px-3 py-1 text-[9px] uppercase tracking-widest text-on-surface-variant rounded-full">System: Encryption Enabled</span>
              </div>
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 flex-shrink-0 bg-surface-bright flex items-center justify-center text-[10px]">AT</div>
                <div className="bg-surface-container-high p-3 space-y-1">
                  <p className="text-xs leading-relaxed">Hello! I am online. Please proceed with the payment to the Chase account provided. Send a screenshot of the receipt here once done.</p>
                  <span className="text-[9px] text-on-surface-variant uppercase">10:02 AM</span>
                </div>
              </div>
              <div className="flex gap-3 max-w-[85%] flex-row-reverse ml-auto">
                <div className="bg-primary/10 border border-primary/20 p-3 space-y-1">
                  <p className="text-xs leading-relaxed text-on-surface">Confirming, transferring $2,500 now via Chase QuickPay.</p>
                  <span className="text-[9px] text-primary/60 uppercase text-right block">10:04 AM</span>
                </div>
              </div>
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 flex-shrink-0 bg-surface-bright flex items-center justify-center text-[10px]">AT</div>
                <div className="bg-surface-container-high p-3 space-y-1">
                  <p className="text-xs leading-relaxed">Perfect. I will release the USDT as soon as the funds reflect. Usually takes less than 3 minutes.</p>
                  <span className="text-[9px] text-on-surface-variant uppercase">10:05 AM</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-high mt-auto">
              <div className="relative flex items-center">
                <button className="absolute left-3 text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-sm">attach_file</span>
                </button>
                <input
                  className="w-full bg-[#000000] border-none focus:ring-1 focus:ring-primary/40 pl-10 pr-12 py-3 text-xs font-label uppercase tracking-wider text-on-surface placeholder:text-on-surface-variant/40"
                  placeholder="TYPE COMMAND OR MESSAGE..."
                  type="text"
                />
                <button className="absolute right-3 text-primary hover:scale-110 active:scale-95 transition-all">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
