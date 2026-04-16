"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { getOrderById, takeOrder } from "../actions";

export default function BuyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order");
  const [resolvedOrder, setResolvedOrder] = useState<{
    merchantName: string;
    price: number;
    asset: string;
    fiat: string;
    available: number;
    minLimit: number;
    maxLimit: number;
    paymentMethod: string;
  } | null>(null);

  const queryMerchantName = searchParams.get("merchant") || "Merchant";
  const queryOrderPrice = Number(searchParams.get("price") || "1.041");
  const queryOrderAsset = searchParams.get("asset") || "USDT";
  const queryOrderFiat = searchParams.get("fiat") || "USD";
  const queryAvailable = searchParams.get("available") || "0";
  const queryMinLimit = searchParams.get("min") || "100";
  const queryMaxLimit = searchParams.get("max") || "2,500";
  const queryPaymentMethod = searchParams.get("method") || "Bank Transfer";

  const hasCompleteLimitsInQuery =
    searchParams.has("available") && searchParams.has("min") && searchParams.has("max");

  useEffect(() => {
    let alive = true;

    async function hydrateOrderFromDb() {
      if (!orderId || hasCompleteLimitsInQuery) return;

      const order = await getOrderById(orderId);
      if (!alive || !order) return;

      setResolvedOrder({
        merchantName: order.profiles?.username || queryMerchantName,
        price: Number(order.price),
        asset: order.asset,
        fiat: order.fiat,
        available: Number(order.total_amount),
        minLimit: Number(order.min_limit),
        maxLimit: Number(order.max_limit),
        paymentMethod: order.payment_method || queryPaymentMethod,
      });
    }

    hydrateOrderFromDb();

    return () => {
      alive = false;
    };
  }, [orderId, hasCompleteLimitsInQuery, queryMerchantName, queryPaymentMethod]);

  const merchantName = resolvedOrder?.merchantName || queryMerchantName;
  const orderPrice = resolvedOrder?.price ?? queryOrderPrice;
  const orderAsset = resolvedOrder?.asset || queryOrderAsset;
  const orderFiat = resolvedOrder?.fiat || queryOrderFiat;
  const available = resolvedOrder ? String(resolvedOrder.available) : queryAvailable;
  const minLimit = resolvedOrder ? String(resolvedOrder.minLimit) : queryMinLimit;
  const maxLimit = resolvedOrder ? String(resolvedOrder.maxLimit) : queryMaxLimit;
  const paymentMethod = resolvedOrder?.paymentMethod || queryPaymentMethod;

  const parseNum = (v: string) => Number(String(v).replace(/,/g, "")) || 0;
  const availableNum = parseNum(available);
  const minLimitNum = parseNum(minLimit);
  const maxLimitNum = parseNum(maxLimit);

  const [payAmount, setPayAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payAmountNum = Number(payAmount || 0);
  const receiveAmountNum = payAmountNum > 0 ? payAmountNum / orderPrice : 0;
  const receiveAmount = payAmountNum > 0 ? receiveAmountNum.toFixed(6) : "0.00";

  const maxPayByInventory = availableNum * orderPrice;
  const effectiveMaxPay = Math.min(maxLimitNum, maxPayByInventory);
  const safeEffectiveMaxPay = Number.isFinite(effectiveMaxPay) && effectiveMaxPay > 0 ? effectiveMaxPay : 0;
  const outOfRange = payAmountNum > 0 && (payAmountNum < minLimitNum || payAmountNum > effectiveMaxPay);

  const limitsLoading = useMemo(
    () => Boolean(orderId && !hasCompleteLimitsInQuery && !resolvedOrder),
    [orderId, hasCompleteLimitsInQuery, resolvedOrder]
  );

  const handleBuy = async () => {
    if (!orderId) return;

    if (outOfRange) {
      setError(
        `Amount must be between ${minLimitNum.toLocaleString()} and ${effectiveMaxPay.toLocaleString()} ${orderFiat}`
      );
      return;
    }

    if (receiveAmountNum <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (receiveAmountNum > availableNum) {
      setError(`Order has only ${availableNum.toLocaleString()} ${orderAsset} available.`);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await takeOrder(orderId, receiveAmountNum);

    if (!result.success) {
      setError(result.error ?? "Trade failed");
      setLoading(false);
      return;
    }

    router.push(`/p2p/order/${result.tradeId}`);
  };

  return (
    <AppShell currentPath="/p2p">
    <div className="bg-surface text-on-surface">
      <div className="mx-auto mt-1 w-[calc(100%-0.5rem)] max-w-3xl overflow-hidden rounded-t-[28px] border border-outline-variant/15 bg-surface">
      <header className="sticky top-0 z-30 h-14 w-full border-b border-outline-variant/10 bg-surface-container-low px-4">
        <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 transition-all hover:bg-surface-bright"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <h1 className="font-headline text-lg font-bold tracking-tight text-primary">Buy {orderAsset}</h1>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">help</span>
        </div>
      </header>

      <main className="space-y-6 px-4 py-6">
        <section className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Exchange Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold tracking-tight">Price {orderFiat} {orderPrice.toFixed(3)}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Live</span>
          </div>
        </section>

        <nav className="flex gap-1 rounded-lg bg-surface-container-low p-1">
          <button className="flex-1 rounded-md bg-surface-bright py-2 text-center font-label text-xs font-bold uppercase tracking-widest text-on-surface">
            By {orderFiat}
          </button>
          <button className="flex-1 rounded-md py-2 text-center font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            By Crypto
          </button>
        </nav>

        {limitsLoading && (
          <div className="rounded-sm border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
            Loading order limits...
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">
            {error}
          </div>
        )}

        <section className="relative space-y-6 overflow-hidden rounded-xl bg-surface-container-high p-5 shadow-2xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/5 blur-3xl" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Amount to Spend</label>
              <span className="text-[10px] font-medium text-primary/80">Min: {minLimitNum.toLocaleString("en-US", { minimumFractionDigits: 2 })} {orderFiat}</span>
            </div>
            <div className="flex items-center rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4 transition-all focus-within:border-primary/40">
              <input
                className="w-full border-none bg-transparent font-headline text-xl font-medium placeholder:text-outline/40 focus:ring-0"
                placeholder={`Enter ${orderFiat} amount`}
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                disabled={loading}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPayAmount(String(safeEffectiveMaxPay))}
                  className="text-xs font-bold uppercase tracking-wider text-primary hover:brightness-110"
                >
                  Max
                </button>
                <div className="h-6 w-px bg-outline-variant/30" />
                <span className="font-headline font-bold">{orderFiat}</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">
              Enter value between {minLimitNum.toLocaleString()} and {safeEffectiveMaxPay.toLocaleString()} {orderFiat}
            </p>
          </div>

          <div className="flex items-center justify-between border-y border-outline-variant/10 py-4">
            <span className="text-sm text-on-surface-variant">You Receive</span>
            <div className="flex items-center gap-2">
              <span className="font-headline text-2xl font-bold text-primary">{receiveAmount}</span>
              <span className="font-headline font-bold text-on-surface-variant">{orderAsset}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Payment Method</label>
            <div className="group flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant/10 bg-surface-container-low p-4 transition-all hover:bg-surface-bright">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container/20">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    payments
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold">{paymentMethod}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    <p className="text-[10px] font-medium uppercase tracking-tighter text-primary">Active Instant</p>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-on-surface">chevron_right</span>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-high font-bold uppercase text-on-surface-variant">
                  {merchantName.slice(0, 1)}
                </div>
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-surface-container-low bg-primary" />
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold tracking-wide uppercase">{merchantName}</h3>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Verified Merchant</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Online</p>
              <p className="text-[10px] text-on-surface-variant">Available: {availableNum.toLocaleString()} {orderAsset}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border-l-2 border-error bg-error/10 p-3">
            <span className="material-symbols-outlined mt-0.5 text-sm text-error">info</span>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              <span className="font-bold uppercase text-error">Strictly no third party payment.</span> Use an account matching your verified identity.
            </p>
          </div>
        </section>
      </main>
      </div>

      <footer className="fixed bottom-[74px] left-0 z-[60] w-full px-3 md:bottom-4">
        <div className="mx-auto w-full max-w-3xl rounded-xl border border-outline-variant/20 bg-surface-container-highest/95 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mb-2 flex items-center justify-between px-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Payable</span>
            <span className="font-headline text-sm font-bold text-on-surface">
              {(payAmountNum || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} {orderFiat}
            </span>
          </div>
          <button
            onClick={handleBuy}
            disabled={loading || limitsLoading || !orderId || !payAmount || safeEffectiveMaxPay <= 0}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-container font-headline text-base font-bold text-on-primary-container shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
            <span className="material-symbols-outlined">trending_flat</span>
          </button>
        </div>
      </footer>
    </div>
    </AppShell>
  );
}
