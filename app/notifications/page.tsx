import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = { title: "Notifications" };

type NotificationItem = {
  tag: string;
  tagColor: string;
  tagBg: string;
  dotColor: string;
  dotGlow?: string;
  title: string;
  description: string;
  time: string;
};

function mapTransactionToNotification(tx: {
  id: string;
  type: string;
  amount: number;
  status: string;
  reference: string | null;
  created_at: string;
  currency?: string;
}): NotificationItem {
  const ago = getTimeAgo(tx.created_at);
  const amt = Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 });
  const cur = tx.currency ?? "";

  switch (tx.type) {
    case "deposit":
      return {
        tag: "EXEC",
        tagColor: "text-primary",
        tagBg: "bg-primary/10",
        dotColor: "bg-primary",
        dotGlow: "shadow-[0_0_8px_rgba(92,253,128,0.4)]",
        title: `DEPOSIT_RECEIVED: ${amt} ${cur}`,
        description: `Deposit of ${amt} ${cur} has been ${tx.status}. Ref: ${tx.reference ?? "N/A"}.`,
        time: ago,
      };
    case "withdrawal":
      return {
        tag: "EXEC",
        tagColor: "text-secondary",
        tagBg: "bg-secondary/10",
        dotColor: "bg-secondary",
        title: `WITHDRAWAL_PROCESSED: ${amt} ${cur}`,
        description: `Withdrawal of ${amt} ${cur} is ${tx.status}. Ref: ${tx.reference ?? "N/A"}.`,
        time: ago,
      };
    case "trade_buy":
      return {
        tag: "EXEC",
        tagColor: "text-primary",
        tagBg: "bg-primary/10",
        dotColor: "bg-primary",
        dotGlow: "shadow-[0_0_8px_rgba(92,253,128,0.4)]",
        title: `BUY_ORDER_FILLED: ${amt} ${cur}`,
        description: `P2P buy order filled. Volume: ${amt} ${cur}. Status: ${tx.status}.`,
        time: ago,
      };
    case "trade_sell":
      return {
        tag: "EXEC",
        tagColor: "text-tertiary",
        tagBg: "bg-tertiary/10",
        dotColor: "bg-tertiary",
        title: `SELL_ORDER_FILLED: ${amt} ${cur}`,
        description: `P2P sell order completed. Volume: ${amt} ${cur}. Status: ${tx.status}.`,
        time: ago,
      };
    default:
      return {
        tag: "INFO",
        tagColor: "text-on-surface-variant",
        tagBg: "bg-on-surface-variant/10",
        dotColor: "bg-on-surface-variant/40",
        title: `TRANSACTION: ${tx.type.toUpperCase()}`,
        description: `Amount: ${amt} ${cur}. Status: ${tx.status}.`,
        time: ago,
      };
  }
}

function mapTradeToNotification(trade: {
  id: string;
  status: string;
  asset_amount: number;
  fiat_amount: number;
  created_at: string;
  p2p_orders?: { asset: string; fiat: string } | null;
}): NotificationItem {
  const ago = getTimeAgo(trade.created_at);
  const asset = trade.p2p_orders?.asset ?? "USDT";
  const fiat = trade.p2p_orders?.fiat ?? "USD";

  const statusMap: Record<string, { tag: string; tagColor: string; tagBg: string; dotColor: string; dotGlow?: string }> = {
    pending: { tag: "PEND", tagColor: "text-on-surface-variant", tagBg: "bg-on-surface-variant/10", dotColor: "bg-on-surface-variant/40" },
    paid:    { tag: "PAID", tagColor: "text-secondary", tagBg: "bg-secondary/10", dotColor: "bg-secondary", dotGlow: "shadow-[0_0_8px_rgba(0,227,254,0.4)]" },
    released:{ tag: "EXEC", tagColor: "text-primary", tagBg: "bg-primary/10", dotColor: "bg-primary", dotGlow: "shadow-[0_0_8px_rgba(92,253,128,0.4)]" },
    disputed:{ tag: "WARN", tagColor: "text-error", tagBg: "bg-error/10", dotColor: "bg-error", dotGlow: "shadow-[0_0_8px_rgba(255,115,81,0.4)]" },
    cancelled:{ tag: "CANC", tagColor: "text-error", tagBg: "bg-error/10", dotColor: "bg-error" },
  };

  const style = statusMap[trade.status] ?? statusMap.pending;

  return {
    ...style,
    title: `P2P_TRADE_${trade.status.toUpperCase()}: ${trade.asset_amount} ${asset}`,
    description: `Trade for ${trade.asset_amount.toLocaleString()} ${asset} ↔ ${trade.fiat_amount.toLocaleString()} ${fiat}. Status: ${trade.status}.`,
    time: ago,
  };
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// Static security events as fallback content
const securityEvents: NotificationItem[] = [
  {
    tag: "AUTH",
    tagColor: "text-tertiary",
    tagBg: "bg-tertiary/10",
    dotColor: "bg-tertiary",
    dotGlow: "shadow-[0_0_8px_rgba(0,227,254,0.4)]",
    title: "SESSION_ACTIVE",
    description: "Current session authenticated via email OTP. Two-factor protection enabled.",
    time: "Active",
  },
];

export default async function NotificationsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("username, avatar_url").eq("id", user.id).single();
    profile = data;
  }

  let notifications: NotificationItem[] = [];

  if (user) {
    // Fetch recent transactions from user's wallets
    const { data: wallets } = await supabase
      .from("wallets")
      .select("id, currency")
      .eq("user_id", user.id);

    if (wallets && wallets.length > 0) {
      const walletIds = wallets.map(w => w.id);
      const walletCurrencyMap = Object.fromEntries(wallets.map(w => [w.id, w.currency]));

      const { data: txs } = await supabase
        .from("transactions")
        .select("id, type, amount, status, reference, created_at, wallet_id")
        .in("wallet_id", walletIds)
        .order("created_at", { ascending: false })
        .limit(10);

      if (txs) {
        notifications.push(
          ...txs.map(tx => mapTransactionToNotification({
            ...tx,
            currency: walletCurrencyMap[tx.wallet_id] ?? "",
          }))
        );
      }
    }

    // Fetch recent P2P trades involving this user
    const { data: trades } = await supabase
      .from("p2p_trades")
      .select("id, status, asset_amount, fiat_amount, created_at, order_id, p2p_orders(asset, fiat)")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (trades) {
      notifications.push(
        ...trades.map(t => {
          const order = Array.isArray(t.p2p_orders) ? t.p2p_orders[0] : t.p2p_orders;
          return mapTradeToNotification({
            ...t,
            p2p_orders: order as { asset: string; fiat: string } | null,
          });
        })
      );
    }

    // Sort combined notifications by recency
    notifications.sort((a, b) => {
      // "Just now" and "Xm ago" should come first; this is a rough sort
      const getWeight = (t: string) => {
        if (t === "Just now" || t === "Active") return 0;
        const m = t.match(/^(\d+)m/); if (m) return parseInt(m[1]);
        const h = t.match(/^(\d+)h/); if (h) return parseInt(h[1]) * 60;
        const d = t.match(/^(\d+)d/); if (d) return parseInt(d[1]) * 1440;
        return 99999;
      };
      return getWeight(a.time) - getWeight(b.time);
    });
  }

  // Always append security events at the end
  const allNotifications = [...notifications, ...securityEvents];

  return (
    <AppShell currentPath="/notifications" user={user ? { email: user.email, ...profile } : null}>
      <div className="px-4 pt-6 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight uppercase leading-none mb-1">
              System Logs
            </h1>
            <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-[0.1em] font-medium">
              Real-time terminal protocol monitor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              {notifications.length} event{notifications.length !== 1 ? "s" : ""}
            </span>
            <button className="font-label text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-sm">
              <span className="material-symbols-outlined text-sm">done_all</span>
              Mark as read
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1 no-scrollbar border-b border-outline-variant/10">
          <button className="text-primary border-b-2 border-primary px-4 py-2 font-label text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
            All Logs
          </button>
          <button className="text-on-surface-variant hover:text-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors">
            Trades
          </button>
          <button className="text-on-surface-variant hover:text-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors">
            Security
          </button>
        </div>

        {/* Log Feed */}
        {allNotifications.length === 0 ? (
          <div className="bg-surface-container-low p-12 text-center border border-outline-variant/10 rounded-sm">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block">notifications_off</span>
            <p className="text-sm text-on-surface-variant">No activity yet. Start trading to see your logs here.</p>
          </div>
        ) : (
          <div className="space-y-[1px] bg-outline-variant/10 rounded-sm overflow-hidden border border-outline-variant/10">
            {allNotifications.map((log, i) => (
              <div
                key={`${log.title}-${i}`}
                className="group relative flex items-start gap-3 p-3 bg-surface-container-low hover:bg-surface-container-high transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${log.dotColor} block mt-2 ${log.dotGlow ?? ""}`} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-body text-[9px] font-bold uppercase ${log.tagColor} ${log.tagBg} px-1 rounded-[1px]`}>
                        {log.tag}
                      </span>
                      <span className="font-headline text-[13px] font-bold text-on-surface">
                        {log.title}
                      </span>
                    </div>
                    <span className="font-body text-[10px] text-on-surface-variant">{log.time}</span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant leading-snug font-body">
                    {log.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <button className="text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Terminal Status Footer */}
        <div className="mt-8 mb-8 p-3 bg-surface-container-lowest border border-outline-variant/10 rounded-sm flex items-center justify-between font-body text-[9px] uppercase tracking-wider text-on-surface-variant">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span>SYSTEM_STABLE</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 border-l border-outline-variant/10 pl-4">
              <span>PING: 14MS</span>
              <span>BUFFER: 0.002MS</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">NODE: FRA-MAIN-01</span>
            <span className="text-on-surface font-bold">LIVE</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
