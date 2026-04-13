import { AppShell } from "@/components/app-shell";
import { P2PChat } from "@/components/p2p-chat";
import { createClient } from "@/utils/supabase/server";
import { getTradeDetails } from "../../actions";
import { TradeActions } from "./trade-actions";

type Props = {
  params: { orderId: string };
};

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "AWAITING PAYMENT", color: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30", icon: "hourglass_top" },
  paid: { label: "PAYMENT SENT", color: "text-tertiary bg-tertiary/10 border-tertiary/30", icon: "check_circle" },
  released: { label: "COMPLETED", color: "text-primary bg-primary/10 border-primary/30", icon: "verified" },
  disputed: { label: "DISPUTED", color: "text-error bg-error/10 border-error/30", icon: "warning" },
  cancelled: { label: "CANCELLED", color: "text-on-surface-variant bg-surface-container-high border-outline-variant/30", icon: "cancel" },
};

export default async function OrderPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AppShell currentPath="/p2p">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-on-surface-variant">Please log in to view this trade.</p>
        </div>
      </AppShell>
    );
  }

  const trade = await getTradeDetails(params.orderId);

  if (!trade) {
    return (
      <AppShell currentPath="/p2p">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">search_off</span>
          <p className="text-on-surface-variant">Trade not found.</p>
        </div>
      </AppShell>
    );
  }

  const isBuyer = trade.buyer_id === user.id;
  const isSeller = trade.seller_id === user.id;
  const counterparty = isBuyer ? trade.seller : trade.buyer;
  const status = statusConfig[trade.status] ?? statusConfig.pending;

  return (
    <AppShell currentPath="/p2p">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight mb-1">
              TRADE ORDER
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-mono">
              ID: {trade.id.slice(0, 8)}...{trade.id.slice(-4)}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm border ${status.color} font-label text-xs font-bold uppercase tracking-widest`}>
            <span className="material-symbols-outlined text-sm">{status.icon}</span>
            {status.label}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Trade Details */}
          <div className="lg:col-span-7 space-y-4">
            {/* Trade Summary Card */}
            <div className="bg-surface-container-low p-6 rounded-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
                <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>swap_horiz</span>
                </div>
                <div>
                  <p className="font-bold text-sm">
                    {isBuyer ? "BUYING" : "SELLING"} {trade.p2p_orders.asset}
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {isBuyer ? "from" : "to"} {counterparty?.username ?? "Unknown"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Amount</span>
                  <span className="block font-headline text-lg font-bold">
                    {trade.asset_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="block text-[10px] text-on-surface-variant">{trade.p2p_orders.asset}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total</span>
                  <span className="block font-headline text-lg font-bold text-primary">
                    {trade.fiat_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="block text-[10px] text-on-surface-variant">{trade.p2p_orders.fiat}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Price</span>
                  <span className="block font-headline text-lg font-bold">
                    {trade.p2p_orders.price.toFixed(3)}
                  </span>
                  <span className="block text-[10px] text-on-surface-variant">{trade.p2p_orders.fiat}/{trade.p2p_orders.asset}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Method</span>
                  <span className="block font-headline text-sm font-bold">
                    {trade.p2p_orders.payment_method}
                  </span>
                </div>
              </div>
            </div>

            {/* Trade Actions */}
            <TradeActions
              tradeId={trade.id}
              status={trade.status}
              isBuyer={isBuyer}
              isSeller={isSeller}
            />

            {/* Trade Terms */}
            {trade.p2p_orders.terms && (
              <div className="bg-surface-container-low p-6 rounded-sm">
                <h3 className="font-label text-[10px] uppercase tracking-widest text-primary mb-3">Trade Terms</h3>
                <p className="text-xs leading-relaxed text-on-surface-variant">{trade.p2p_orders.terms}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-surface-container-low p-6 rounded-sm">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Trade Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-on-surface">Trade created</span>
                  <span className="text-on-surface-variant ml-auto">{new Date(trade.created_at).toLocaleString()}</span>
                </div>
                {(trade.status === "paid" || trade.status === "released") && (
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-tertiary" />
                    <span className="text-on-surface">Payment marked as sent</span>
                  </div>
                )}
                {trade.status === "released" && (
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-on-surface font-bold">Funds released — Trade complete</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 h-[500px]">
              <P2PChat tradeId={trade.id} currentUserId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
