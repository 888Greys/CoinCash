import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/utils/supabase/server";

type Wallet = {
  id: string;
  currency: string;
  balance: number;
  locked_balance: number;
};

type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  reference: string | null;
  created_at: string;
};

const currencyMeta: Record<string, { icon: string; color: string; name: string; letter: string }> = {
  USDT: { icon: "paid", color: "text-primary", name: "Tether USD", letter: "U" },
  BTC:  { icon: "currency_bitcoin", color: "text-[#f7931a]", name: "Bitcoin", letter: "B" },
  ETH:  { icon: "token", color: "text-[#627eea]", name: "Ethereum", letter: "E" },
  BNB:  { icon: "database", color: "text-[#f3ba2f]", name: "Binance Coin", letter: "N" },
  KES:  { icon: "payments", color: "text-secondary", name: "Kenya Shilling", letter: "K" },
  UGX:  { icon: "payments", color: "text-tertiary", name: "Uganda Shilling", letter: "G" },
};

// Simple USD conversion rates (hardcoded for now)
const usdRates: Record<string, number> = {
  USDT: 1,
  BTC: 52340,
  ETH: 2912,
  BNB: 384,
  KES: 0.0078,
  UGX: 0.00027,
};

function getCurrencyInfo(currency: string) {
  return currencyMeta[currency] ?? { icon: "monetization_on", color: "text-on-surface-variant", name: currency, letter: currency[0] };
}

export default async function AssetsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let wallets: Wallet[] = [];
  let transactions: Transaction[] = [];
  let totalUsdValue = 0;
  let profile: { username: string | null; avatar_url: string | null } | null = null;

  if (user) {
    // Fetch profile for nav
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    profile = profileData;

    const { data: walletData } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .order("currency");

    if (walletData) {
      wallets = walletData as Wallet[];
      totalUsdValue = wallets.reduce((sum, w) => {
        const rate = usdRates[w.currency] ?? 0;
        return sum + (w.balance + w.locked_balance) * rate;
      }, 0);
    }

    // Fetch recent transactions across all wallets
    const walletIds = wallets.map(w => w.id);
    if (walletIds.length > 0) {
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .in("wallet_id", walletIds)
        .order("created_at", { ascending: false })
        .limit(10);

      if (txData) {
        transactions = txData as Transaction[];
      }
    }
  }

  const btcRate = usdRates.BTC;
  const totalBtc = totalUsdValue / btcRate;

  return (
    <AppShell currentPath="/assets" user={user ? { email: user.email, ...profile } : null}>
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
                  {totalBtc.toFixed(5)} <span className="text-primary text-2xl md:text-3xl">BTC</span>
                </h1>
              </div>
              <p className="font-headline text-xl md:text-2xl text-on-surface-variant opacity-60 mt-1">
                ≈ ${totalUsdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

        {/* Asset Table */}
        <div className="bg-surface-container-low rounded-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
            <h2 className="font-headline text-lg font-bold tracking-tight">Asset Inventory</h2>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
              {wallets.length} {wallets.length === 1 ? "Asset" : "Assets"}
            </span>
          </div>

          {wallets.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">account_balance_wallet</span>
              <p className="text-sm text-on-surface-variant">No wallets found. Wallets are created automatically on signup.</p>
            </div>
          ) : (
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
                  {wallets.map((wallet) => {
                    const info = getCurrencyInfo(wallet.currency);
                    const rate = usdRates[wallet.currency] ?? 0;
                    const usdValue = (wallet.balance + wallet.locked_balance) * rate;
                    const totalBalance = wallet.balance + wallet.locked_balance;

                    return (
                      <tr
                        key={wallet.id}
                        className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-surface-container-highest rounded-full flex items-center justify-center ${info.color} font-bold text-xs`}>
                              {info.letter}
                            </div>
                            <div>
                              <p className="font-bold">{wallet.currency}</p>
                              <p className="text-[10px] text-on-surface-variant uppercase">{info.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-headline font-medium">
                          {totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                        </td>
                        <td className="px-6 py-5">
                          {wallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                        </td>
                        <td className={`px-6 py-5 ${wallet.locked_balance > 0 ? "text-error" : "text-on-surface-variant"}`}>
                          {wallet.locked_balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                        </td>
                        <td className="px-6 py-5 text-right font-headline">
                          ${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link
                            className="text-primary font-label text-[10px] font-bold tracking-widest uppercase hover:underline"
                            href="/p2p"
                          >
                            Trade
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <section className="mt-10 mb-8">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">
              Recent Transactions
            </h2>
          </div>

          {transactions.length === 0 ? (
            <div className="bg-surface-container-low rounded-sm p-8 text-center space-y-3 border border-outline-variant/10">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">receipt_long</span>
              <p className="text-sm text-on-surface-variant">No transactions yet. Start trading to see your history.</p>
              <Link href="/p2p" className="inline-block mt-2 px-6 py-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded hover:bg-primary/20 transition-colors">
                Go to P2P
              </Link>
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10 divide-y divide-outline-variant/10">
              {transactions.map((tx) => {
                const isPositive = tx.type === "deposit" || tx.type === "trade_buy";
                const icons: Record<string, string> = {
                  deposit: "south_west",
                  withdrawal: "north_east",
                  trade_buy: "swap_horiz",
                  trade_sell: "swap_horiz",
                };
                const colors: Record<string, string> = {
                  deposit: "text-primary bg-primary/10",
                  withdrawal: "text-error bg-error/10",
                  trade_buy: "text-secondary bg-secondary/10",
                  trade_sell: "text-tertiary bg-tertiary/10",
                };
                const icon = icons[tx.type] ?? "receipt";
                const colorClass = colors[tx.type] ?? "text-on-surface-variant bg-surface-container-high";

                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-surface-container-high transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass} transition-transform group-hover:scale-110`}>
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight capitalize">{tx.type.replace("_", " ")}</p>
                        <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          {tx.status === "pending" && <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />}
                          <span className="capitalize">{tx.status}</span>
                          <span>•</span>
                          <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm font-mono ${isPositive ? "text-primary" : "text-on-surface"}`}>
                        {isPositive ? "+" : "-"}{Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      {tx.reference && (
                        <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">{tx.reference}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom Panels */}
        <aside className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                <span className="text-secondary">[SYSTEM]</span>
                <span>WALLET_SYNC_SUCCESSFUL: DB_PRIMARY</span>
              </li>
              <li className="flex justify-between">
                <span className="text-secondary">[AUTH]</span>
                <span>SESSION_ACTIVE: ENCRYPTED_TRANSPORT</span>
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
