import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { P2PChat } from "@/components/p2p-chat";
import { createClient } from "@/utils/supabase/server";
import { getTradeDetails } from "../../actions";
import { TradeActions } from "./trade-actions";
import { CountdownTimer } from "./countdown-timer";

type Props = {
  params: { orderId: string };
  searchParams: { view?: string };
};

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "AWAITING PAYMENT", color: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30", icon: "hourglass_top" },
  paid: { label: "PAYMENT SENT", color: "text-tertiary bg-tertiary/10 border-tertiary/30", icon: "check_circle" },
  released: { label: "COMPLETED", color: "text-primary bg-primary/10 border-primary/30", icon: "verified" },
  disputed: { label: "DISPUTED", color: "text-error bg-error/10 border-error/30", icon: "warning" },
  cancelled: { label: "CANCELLED", color: "text-on-surface-variant bg-surface-container-high border-outline-variant/30", icon: "cancel" },
};

export default async function OrderPage({ params, searchParams }: Props) {
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
  const counterpartyId = isBuyer ? trade.seller_id : trade.buyer_id;
  const status = statusConfig[trade.status] ?? statusConfig.pending;
  const payerName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.email ? user.email.split("@")[0] : "Account Holder");
  const referenceCode = trade.id.replace(/-/g, "").slice(0, 18);
  const methodLabel = trade.p2p_orders.payment_method || "Bank Transfer";
  const isChatView = searchParams.view === "chat";

  const { count: completedTradesCount } = await supabase
    .from("p2p_trades")
    .select("id", { count: "exact", head: true })
    .eq("status", "released")
    .or(`buyer_id.eq.${counterpartyId},seller_id.eq.${counterpartyId}`);

  return (
    <AppShell currentPath="/p2p">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {isChatView ? (
          <div className="md:hidden -mx-4 bg-surface pb-40">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/15 bg-surface px-4">
              <div className="flex items-center gap-3 min-w-0">
                <Link href={`/p2p/order/${trade.id}`} className="material-symbols-outlined text-on-surface">arrow_back</Link>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-headline text-sm font-bold uppercase tracking-tight text-on-surface">
                      {counterparty?.username ?? "Unknown"}
                    </p>
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Completed {(completedTradesCount ?? 0).toLocaleString()} Trades
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">info</span>
                <span className="material-symbols-outlined text-on-surface">more_vert</span>
              </div>
            </header>

            <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-4">
              <div className="rounded-lg border-l-2 border-primary bg-surface-container-low p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-headline text-lg font-bold text-primary">
                    {isBuyer ? "Buy" : "Sell"} {trade.p2p_orders.asset} with {trade.fiat_amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} {trade.p2p_orders.fiat}
                  </h2>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
                </div>
                <p className="mt-1 text-sm font-medium text-on-surface-variant">
                  {isBuyer ? "Pending Payment Confirmation" : "Awaiting Buyer Payment"}
                </p>
              </div>

              <div className="flex gap-3 rounded-lg border border-error/20 bg-error-container/10 p-4">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <p className="text-xs leading-relaxed text-on-surface/80">
                  <span className="font-bold text-error">NEVER release cryptocurrency before actually receiving the payment!</span> CoinCash will not be responsible if you release before payment verification.
                </p>
              </div>

              <P2PChat tradeId={trade.id} currentUserId={user.id} variant="mobile-immersive" />
            </main>
          </div>
        ) : (
          <div className="md:hidden -mx-4 bg-surface pb-28">
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-surface px-6">
              <div className="flex items-center gap-4">
                <Link href="/p2p" className="text-primary hover:text-secondary">
                  <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="font-headline text-lg font-bold uppercase tracking-wider text-primary">Payment</h1>
              </div>
              <button className="text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-error">
                Cancel Order
              </button>
            </header>

            <div className="border-b border-outline-variant/10 bg-surface-container-low px-6 py-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Pay the seller within</span>
                <div className="rounded-md border border-primary/20 bg-primary/10 px-3 py-1 font-headline text-2xl font-bold tracking-tight text-primary">
                  <CountdownTimer createdAt={trade.created_at} windowMinutes={15} />
                </div>
              </div>
            </div>

            <div className="mx-4 mt-4 flex items-center justify-between rounded-lg bg-surface-container-high p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-bright">
                  <span className="material-symbols-outlined text-secondary">person</span>
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] uppercase tracking-widest text-on-surface-variant">Merchant</div>
                  <div className="font-headline text-md font-bold text-on-surface uppercase">{counterparty?.username ?? "Unknown"}</div>
                  <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                    Completed {(completedTradesCount ?? 0).toLocaleString()} trades
                  </div>
                </div>
              </div>
              <Link
                href={`/p2p/order/${trade.id}?view=chat`}
                className="flex items-center gap-2 rounded-md border border-primary/10 bg-surface-bright px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Chat
              </Link>
            </div>

            <div className="mt-4 px-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">
                  Transfer via: <span className="text-secondary">{methodLabel}</span>
                </h2>
                <button className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined">refresh</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="group rounded-lg border-l-2 border-primary/30 bg-surface-container-low p-4 transition-colors hover:bg-surface-container">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">You Pay</div>
                      <div className="font-headline text-lg font-bold text-on-surface">
                        {trade.fiat_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {trade.p2p_orders.fiat}
                      </div>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-bright text-on-surface-variant transition-colors group-hover:bg-surface-container-high hover:text-primary">
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>

                <div className="group rounded-lg border-l-2 border-outline-variant/30 bg-surface-container-low p-4 transition-colors hover:bg-surface-container">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">Merchant Payment Method</div>
                      <div className="font-headline text-lg font-bold text-on-surface">{methodLabel}</div>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-bright text-on-surface-variant transition-colors group-hover:bg-surface-container-high hover:text-primary">
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>

                <div className="group rounded-lg border-l-2 border-outline-variant/30 bg-surface-container-low p-4 transition-colors hover:bg-surface-container">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">Your account name</div>
                      <div className="font-headline text-lg font-bold text-on-surface">{payerName}</div>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-bright text-on-surface-variant transition-colors group-hover:bg-surface-container-high hover:text-primary">
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>

                <div className="group rounded-lg border-l-2 border-outline-variant/30 bg-surface-container-low p-4 transition-colors hover:bg-surface-container">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">Ref Message</div>
                      <div className="font-headline text-lg font-bold text-on-surface break-all">{referenceCode}</div>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-bright text-on-surface-variant transition-colors group-hover:bg-surface-container-high hover:text-primary">
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 px-6">
              <TradeActions
                tradeId={trade.id}
                status={trade.status}
                isBuyer={isBuyer}
                isSeller={isSeller}
                currentUserId={user.id}
                variant="payment-mobile"
              />
            </div>
          </div>
        )}

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
              currentUserId={user.id}
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
