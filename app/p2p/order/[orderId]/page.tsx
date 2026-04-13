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

function timeLeftFromCreatedAt(createdAt: string, windowMinutes: number) {
  const created = new Date(createdAt).getTime();
  const expiry = created + windowMinutes * 60_000;
  const remainingMs = Math.max(0, expiry - Date.now());
  const minutes = Math.floor(remainingMs / 60_000);
  const seconds = Math.floor((remainingMs % 60_000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

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
  const tradeTimer = timeLeftFromCreatedAt(trade.created_at, 15);
  const payerName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.email ? user.email.split("@")[0] : "Account Holder");
  const referenceCode = trade.id.replace(/-/g, "").slice(0, 18);
  const methodLabel = trade.p2p_orders.payment_method || "Bank Transfer";

  return (
    <AppShell currentPath="/p2p">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="md:hidden rounded-2xl border border-outline-variant/15 bg-surface-container-low p-4">
          <div className="mb-5 flex items-center justify-between">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            <span className="text-sm font-bold text-error">Cancel Order</span>
          </div>

          <h1 className="font-headline text-4xl font-black tracking-tight">Payment</h1>
          <p className="mt-1 text-lg text-on-surface-variant">
            Pay the seller within <span className="font-bold text-on-surface">{tradeTimer}</span>
          </p>

          <div className="mt-5 rounded-xl border border-outline-variant/20 bg-surface p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high text-lg font-bold uppercase">
                  {(counterparty?.username ?? "U").slice(0, 1)}
                </div>
                <p className="text-xl font-bold uppercase">{counterparty?.username ?? "Unknown"}</p>
              </div>
              <span className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary-container">Chat</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-3xl font-semibold">Transfer via: {methodLabel}</p>
            <div className="space-y-4 text-on-surface">
              <div>
                <p className="text-sm text-on-surface-variant">You Pay</p>
                <p className="text-4xl font-black tracking-tight">
                  {trade.fiat_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {trade.p2p_orders.fiat}
                </p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Merchant Payment Method</p>
                <p className="text-2xl font-semibold">{methodLabel}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Your account name</p>
                <p className="text-2xl font-semibold">{payerName}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Ref Message</p>
                <p className="text-2xl font-semibold">{referenceCode}</p>
              </div>
            </div>
            <p className="pt-2 text-xl text-on-surface-variant">
              Tap the button below to upload payment proof for seller confirmation.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-error/40 bg-error/10 px-4 py-3">
            <p className="text-base font-bold text-error">CALL THE MERCHANT BEFORE MAKING PAYMENT</p>
          </div>

          <div className="mt-4">
            <TradeActions
              tradeId={trade.id}
              status={trade.status}
              isBuyer={isBuyer}
              isSeller={isSeller}
            />
          </div>
        </div>

        <div className="hidden md:block">
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
      </div>
    </AppShell>
  );
}
