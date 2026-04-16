import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/utils/supabase/server";
import { NotificationsFeed } from "@/components/notifications-feed";
import { isAdminEmail } from "@/lib/admin";

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

export default async function NotificationsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(user?.email);
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

  return (
    <AppShell currentPath="/notifications" user={user ? { email: user.email, ...profile, isAdmin } : null}>
      <div className="px-4 pt-6 max-w-5xl mx-auto">
        {/* Notifications — client component handles header, tabs, feed, mark-as-read */}
        <NotificationsFeed
          notifications={notifications}
          totalEventCount={notifications.length}
        />

        {/* System Status Footer */}
        <div className="mt-8 mb-8 p-3 bg-surface-container-lowest border border-outline-variant/10 rounded-sm flex items-center justify-between font-body text-[9px] uppercase tracking-wider text-on-surface-variant">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span>System healthy</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 border-l border-outline-variant/10 pl-4">
              <span>Latency: 14 ms</span>
              <span>Sync delay: 0.002 ms</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Region: Frankfurt</span>
            <span className="text-on-surface font-bold">LIVE</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
