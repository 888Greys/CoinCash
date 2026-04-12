import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PortfolioBalance, PortfolioBtcEquivalent } from "@/components/portfolio-balance";

type AssetRow = {
  symbol: string;
  name: string;
  letter: string;
  totalBalance: string;
  available: string;
  frozen: string;
  frozenHighlight: boolean;
  usdValue: string;
  action: string;
  actionHref: string;
};

const assets: AssetRow[] = [
  {
    symbol: "USDT",
    name: "Tether USD",
    letter: "U",
    totalBalance: "12,450.00",
    available: "12,400.00",
    frozen: "50.00",
    frozenHighlight: false,
    usdValue: "$12,450.00",
    action: "Trade",
    actionHref: "/markets",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    letter: "B",
    totalBalance: "0.84200000",
    available: "0.80000000",
    frozen: "0.04200000",
    frozenHighlight: true,
    usdValue: "$50,351.60",
    action: "Trade",
    actionHref: "/markets",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    letter: "E",
    totalBalance: "4.50000000",
    available: "4.50000000",
    frozen: "0.00000000",
    frozenHighlight: false,
    usdValue: "$11,700.00",
    action: "Trade",
    actionHref: "/markets",
  },
  {
    symbol: "KES",
    name: "Kenya Shilling",
    letter: "K",
    totalBalance: "1,400,000.00",
    available: "1,350,000.00",
    frozen: "50,000.00",
    frozenHighlight: false,
    usdValue: "$10,918.72",
    action: "P2P Trade",
    actionHref: "/p2p",
  },
];

const accounts = [
  {
    title: "Funding Account",
    icon: "account_balance",
    color: "text-secondary",
    balance: "0.1420 BTC",
    usd: "≈ $8,491.60",
  },
  {
    title: "Spot Account",
    icon: "storefront",
    color: "text-secondary",
    balance: "1.2145 BTC",
    usd: "≈ $72,627.10",
  },
  {
    title: "Futures Account",
    icon: "trending_up",
    color: "text-secondary",
    balance: "0.0720 BTC",
    usd: "≈ $4,301.62",
  },
];

export default function AssetsPage() {
  return (
    <AppShell currentPath="/assets">
      <div className="px-4 md:px-8 pt-6 max-w-7xl mx-auto relative">
        {/* Background Grid */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.05]" style={{
          backgroundImage: "radial-gradient(circle, #45484c 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* Total Balance Header */}
        <section className="mb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                Portfolio Net Worth
              </h2>
              <div className="flex items-baseline gap-3">
                <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-on-surface">
                  <PortfolioBtcEquivalent /> <span className="text-primary text-2xl md:text-3xl">BTC</span>
                </h1>
              </div>
              <p className="font-headline text-xl md:text-2xl text-on-surface-variant opacity-60 mt-1">
                ≈ $<PortfolioBalance />{" "}
                <span className="text-primary text-sm font-label ml-2 uppercase">+4.2% (24H)</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-3 font-label text-sm font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-lg">south_west</span>
                Deposit
              </button>
              <button className="bg-surface-container-highest border border-primary/20 text-on-surface px-6 py-3 font-label text-sm font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 hover:bg-surface-bright active:scale-95 transition-all">
                <span className="material-symbols-outlined text-lg">north_east</span>
                Withdraw
              </button>
              <button className="bg-surface-container-highest border border-primary/20 text-on-surface px-6 py-3 font-label text-sm font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 hover:bg-surface-bright active:scale-95 transition-all">
                <span className="material-symbols-outlined text-lg">swap_horiz</span>
                Transfer
              </button>
            </div>
          </div>
        </section>

        {/* Account Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {accounts.map((acct) => (
            <div
              key={acct.title}
              className="bg-surface-container-low p-6 rounded-sm relative overflow-hidden group hover:bg-surface-container-high transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">{acct.icon}</span>
              </div>
              <h3 className={`font-label text-[10px] font-bold uppercase tracking-[0.2em] ${acct.color} mb-4`}>
                {acct.title}
              </h3>
              <div className="space-y-1">
                <p className="font-headline text-2xl font-medium">{acct.balance}</p>
                <p className="font-body text-sm text-on-surface-variant">{acct.usd}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Asset Table */}
        <div className="bg-surface-container-low rounded-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
            <h2 className="font-headline text-lg font-bold tracking-tight">Asset Inventory</h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                className="bg-surface-container-lowest border border-outline-variant/15 text-xs font-label px-9 py-2 rounded-sm focus:outline-none focus:border-primary/40 w-48"
                placeholder="Search Assets"
                type="text"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60 border-b border-outline-variant/10">
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Total Balance</th>
                  <th className="px-6 py-4">Available</th>
                  <th className="px-6 py-4">In Order / Frozen</th>
                  <th className="px-6 py-4 text-right">USD Equivalent</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="font-body text-sm">
                {assets.map((asset) => (
                  <tr
                    key={asset.symbol}
                    className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-container-highest rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {asset.letter}
                        </div>
                        <div>
                          <p className="font-bold">{asset.symbol}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase">{asset.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-headline font-medium">{asset.totalBalance}</td>
                    <td className="px-6 py-5">{asset.available}</td>
                    <td className={`px-6 py-5 ${asset.frozenHighlight ? "text-error" : "text-on-surface-variant"}`}>
                      {asset.frozen}
                    </td>
                    <td className="px-6 py-5 text-right font-headline">{asset.usdValue}</td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        className="text-primary font-label text-[10px] font-bold tracking-widest uppercase hover:underline"
                        href={asset.actionHref}
                      >
                        {asset.action}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Panels */}
        <aside className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Security Logs */}
          <div className="p-4 bg-surface-container-highest/30 rounded-sm border-l-2 border-primary/40">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-sm">terminal</span>
              <h4 className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Security Logs
              </h4>
            </div>
            <ul className="font-label text-[9px] text-on-surface-variant/80 space-y-2">
              <li className="flex justify-between">
                <span className="text-secondary">[2023-10-24 14:22:01]</span>
                <span>WALLET_SYNC_SUCCESSFUL: DB_PRIMARY</span>
              </li>
              <li className="flex justify-between">
                <span className="text-secondary">[2023-10-24 12:05:45]</span>
                <span>AUTH_SESSION_RENEWED: IP_192.168.1.1</span>
              </li>
              <li className="flex justify-between">
                <span className="text-secondary">[2023-10-23 23:12:10]</span>
                <span>WITHDRAWAL_WHITELIST_UPDATE: ADDR_7X...F2</span>
              </li>
            </ul>
          </div>

          {/* Promo Card */}
          <div className="relative overflow-hidden rounded-sm min-h-[120px] bg-surface-container-low">
            <div className="relative z-10 p-6 flex flex-col justify-center h-full">
              <p className="font-headline text-lg font-bold leading-tight">Master the Volatility</p>
              <p className="font-body text-xs text-on-surface-variant mt-2 max-w-xs">
                Leverage our high-speed execution engine for futures and margin trading.
              </p>
              <Link
                className="mt-4 text-primary font-label text-[10px] font-bold tracking-widest uppercase flex items-center gap-1"
                href="/markets"
              >
                Upgrade Tier{" "}
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
