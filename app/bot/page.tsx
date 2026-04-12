import { AppShell } from "@/components/app-shell";

const botTypes = [
  {
    name: "Grid Trading Bot",
    icon: "grid_view",
    iconBg: "bg-primary/10 group-hover:bg-primary/20",
    iconColor: "text-primary",
    description: "Buy low and sell high automatically in volatile markets with custom price ranges.",
  },
  {
    name: "DCA Bot",
    icon: "calendar_month",
    iconBg: "bg-secondary/10 group-hover:bg-secondary/20",
    iconColor: "text-secondary",
    description: "Automate your accumulation strategy. Buy assets at regular intervals regardless of price.",
  },
  {
    name: "Arbitrage Bot",
    icon: "balance",
    iconBg: "bg-tertiary/10 group-hover:bg-tertiary/20",
    iconColor: "text-tertiary",
    description: "Capitalize on price differences between various trading pairs and market inefficiencies.",
  },
];

const activeBots = [
  {
    name: "BTC/USDT Grid",
    status: "Running",
    statusColor: "bg-primary/10 text-primary",
    dotColor: "bg-primary",
    profit: "+$182.40 (4.2%)",
    profitColor: "text-primary",
    runtime: "12d 04h 22m",
    action: "Manage",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_2Ja2jQy47COvUqiKaFxP55PGb71aPjyNmYa2-7dIUOTlF_iXkUe6T1Y8LkTXs6VPwihd9utXcMepDs10U2VzyuYoPyfLv7ZFvuj2iAi-wGuUMAoeGrphtqn8Nit24CYZro3nK6Sy-XJz-zHNHzIbk2kLO18fg4zO2zaxMrGJf0JE3TCB1xEVyiQjS_Xj-jteX93hiD2XhYUHXY8pyBLApeARjLKX7lTR4N7sv-j5pR4HF1_B35lUIzlqQ6qfsxcAHjrtbD3JDBM",
  },
  {
    name: "ETH/USDC DCA",
    status: "Running",
    statusColor: "bg-primary/10 text-primary",
    dotColor: "bg-primary",
    profit: "+$42.15 (1.8%)",
    profitColor: "text-primary",
    runtime: "04d 18h 12m",
    action: "Manage",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWKF9ceR9HiYnyOyzvetx1roK1STiEx0WHIYeC5pyZ5U0chAitAf9azkDyOKS-2jKZepb2LPXF2HNIILr3Os-igxvH3Gx4XPmIRaqnDwG49AwDTvxGZQgjvJJCmjp0co5HnDsxF4Q73s37bSKYl7nfszZqPnyOVHCog3HgtzJXpu8FArxY_iK0ER4EX0ijlmuP_QE0jG3xvSGG8w-yq5TNzlw-__krtb6JwIda7ObVIEm4-47f4OItdPs_1RhapFoQRDir1lR66jY",
  },
  {
    name: "SOL/USDT Arbitrage",
    status: "Paused",
    statusColor: "bg-surface-container-highest text-on-surface-variant",
    dotColor: "bg-error",
    profit: "-$12.20 (-0.4%)",
    profitColor: "text-error",
    runtime: "00d 00h 00m",
    action: "Resume",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfRLnFWo1P1GochJ0tckiPV8JCXW9GJTFf1EkMA3T-m_Wjv0_FF_E-GuzuS_hdbakOPbSV_1BOX458S_4DaRGTPxZP16eC7ahoFwaRa14reKQHFBwqBgsktadINtDCOpbMBIn_xV3nUDSS9F5DSfdD8OlablMcIjcTOEc4hEV_bHVCK02v0EeN1azx7iAEsPeu1rEKstSrsfKzL38PYyrKdwkdE-ntO01ONu4wmUFzb7gJsGHQrInYEh0JhLRi7mWG3dvKjVzvTGQ",
  },
];

const perfBars = [40, 60, 30, 80, 95, 50, 70, 40, 65, 85, 35, 55];

export default function BotPage() {
  return (
    <AppShell currentPath="/bot">
      <div className="px-4 pt-6 max-w-4xl mx-auto space-y-6">
        {/* Portfolio Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 bg-surface-container-high p-6 rounded relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">insights</span>
            </div>
            <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant mb-2">
              Portfolio Overview
            </p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary tracking-tight">$12,482.90</h2>
                <p className="text-xs text-secondary-dim font-medium mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +$428.12 (24h Change)
                </p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant">Active Bots</p>
                  <p className="font-headline text-xl font-bold">04</p>
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface-variant">Total Profit</p>
                  <p className="font-headline text-xl font-bold text-primary">+12.4%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bot Marketplace */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">Bot Marketplace</h3>
            <span className="text-xs text-primary font-bold cursor-pointer hover:underline uppercase tracking-tighter">View All</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {botTypes.map((bot) => (
              <div key={bot.name} className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/15 hover:bg-surface-container-high transition-all group">
                <div className={`w-10 h-10 ${bot.iconBg} rounded flex items-center justify-center mb-4 transition-colors`}>
                  <span className={`material-symbols-outlined ${bot.iconColor}`}>{bot.icon}</span>
                </div>
                <h4 className="font-headline font-bold text-base mb-1">{bot.name}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-6">{bot.description}</p>
                <button className="w-full bg-surface-container-highest text-primary border border-primary/20 py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-primary hover:text-on-primary-container transition-all active:scale-95">
                  Create Bot
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Active Deployments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">Active Deployments</h3>
            <div className="flex gap-2">
              <button className="bg-surface-container-high px-3 py-1 rounded text-[10px] font-bold uppercase text-primary border border-primary/10">
                Running (4)
              </button>
              <button className="bg-surface-container-low px-3 py-1 rounded text-[10px] font-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors">
                History
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {activeBots.map((bot) => (
              <div key={bot.name} className="bg-surface-container-low hover:bg-surface-container-high p-4 flex items-center justify-between group transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img alt={bot.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" src={bot.image} />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${bot.dotColor} rounded-full border-2 border-surface-container-low`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm">{bot.name}</h5>
                      <span className={`${bot.statusColor} text-[8px] font-black px-1.5 py-0.5 rounded uppercase`}>{bot.status}</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      Profit: <span className={bot.profitColor}>{bot.profit}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant">Runtime</p>
                    <p className="text-xs font-headline font-bold">{bot.runtime}</p>
                  </div>
                  <button className="bg-surface-container-highest px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-primary active:scale-95 transition-all">
                    {bot.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bot Performance Matrix */}
        <section className="bg-surface-container-low p-6 rounded relative overflow-hidden border border-outline-variant/10 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">Bot Performance Matrix</h3>
              <p className="text-xs text-on-surface-variant">Real-time aggregate alpha generation across all bots.</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live
            </div>
          </div>
          <div className="h-32 flex items-end justify-between gap-1">
            {perfBars.map((h, i) => (
              <div
                key={i}
                className={`w-full ${h >= 85 ? "bg-primary" : "bg-primary/20"} rounded-t-sm`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[8px] uppercase font-black tracking-widest text-on-surface-variant">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>Now</span>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
