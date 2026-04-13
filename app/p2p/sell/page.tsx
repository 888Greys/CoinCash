"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useRouter, useSearchParams } from "next/navigation";
import { takeOrder } from "../actions";

export default function SellPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // These would ideally come from a server fetch, but for now we use search params
  // with the expectation that the linking page embeds key data
  const orderId = searchParams.get("order");
  const merchantName = searchParams.get("merchant") || "Merchant";
  const orderPrice = Number(searchParams.get("price") || "1.041");
  const orderAsset = searchParams.get("asset") || "USDT";
  const orderFiat = searchParams.get("fiat") || "USD";
  const available = searchParams.get("available") || "0";
  const minLimit = searchParams.get("min") || "100";
  const maxLimit = searchParams.get("max") || "2,500";
  const paymentMethod = searchParams.get("method") || "Bank Transfer";

  const [payAmount, setPayAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const receiveAmount = payAmount ? (Number(payAmount) * orderPrice).toFixed(2) : "";

  const handleBuy = async () => {
    if (!orderId || !receiveAmount) return;
    setLoading(true);
    setError(null);

    const result = await takeOrder(orderId, Number(payAmount));

    if (!result.success) {
      setError(result.error ?? "Trade failed");
      setLoading(false);
      return;
    }

    // Redirect to trade order page
    router.push(`/p2p/order/${result.tradeId}`);
  };

  return (
    <AppShell currentPath="/p2p">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Transaction Breadcrumb */}
        <div className="flex items-center gap-2 text-on-surface-variant mb-2">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-sm hover:text-primary transition-colors">arrow_back</span>
          </button>
          <span className="font-label text-xs uppercase tracking-[0.1em]">
            P2P Markets / {orderAsset} Sell
          </span>
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
          {/* LEFT COLUMN: Merchant & Status */}
          <div className="md:col-span-4 bg-surface-container-low p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-sm">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shield_person
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-on-surface">{merchantName}</h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      Verified Merchant
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Trade Conditions
                  </p>
                  <div className="flex items-center gap-2 text-xs py-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                    <span>No 3rd party payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs py-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                    <span>{paymentMethod} only</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-outline-variant/10">
              <p className="text-[10px] leading-relaxed text-on-surface-variant uppercase tracking-tighter">
                Secure Trade Room<br />Order: {orderId?.slice(0, 8) ?? "—"}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Trade Inputs */}
          <div className="md:col-span-8 space-y-1">
            {/* Price Module */}
            <div className="bg-surface-container-high p-6 flex justify-between items-center">
              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Exchange Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline font-bold text-primary">{orderPrice.toFixed(3)}</span>
                  <span className="text-sm text-on-surface-variant uppercase font-medium">{orderFiat} / {orderAsset}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Available Liquidity
                </p>
                <p className="text-lg font-medium text-on-surface">
                  {Number(available).toLocaleString("en-US", { minimumFractionDigits: 2 })} {orderAsset}
                </p>
              </div>
            </div>

            {/* Input Module */}
            <div className="bg-surface-container-highest p-8 space-y-8">
              {/* I Want to Pay */}
              <div className="space-y-2 group">
                <div className="flex justify-between items-end">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    I want to sell
                  </label>
                  <span className="text-[10px] text-on-surface-variant">Min: {minLimit} / Max: {maxLimit}</span>
                </div>
                <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/15 focus-within:border-primary/40 transition-all px-4 py-4">
                  <input
                    className="bg-transparent border-none focus:ring-0 text-2xl font-bold w-full text-on-surface placeholder:text-on-surface-variant/30"
                    placeholder="0.00"
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    disabled={loading}
                  />
                  <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/15">
                    <span className="font-bold text-sm tracking-widest">{orderAsset}</span>
                    <button
                      type="button"
                      onClick={() => setPayAmount(maxLimit.replace(/,/g, ""))}
                      className="bg-surface-bright px-2 py-1 text-[10px] font-bold text-primary cursor-pointer hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* I Will Receive */}
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  I will receive
                </label>
                <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/15 px-4 py-4">
                  <input
                    className="bg-transparent border-none focus:ring-0 text-2xl font-bold w-full text-on-surface-variant"
                    placeholder="0.00"
                    readOnly
                    type="text"
                    value={receiveAmount}
                  />
                  <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/15">
                    <span className="font-bold text-sm tracking-widest">{orderFiat}</span>
                    <span className="material-symbols-outlined text-on-surface-variant">
                      currency_exchange
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Payment Method
                </label>
                <div className="bg-surface-container-low p-4 flex items-center justify-between border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-sm">
                      <span className="material-symbols-outlined text-primary">account_balance</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider">{paymentMethod}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">0.00 Fee • Immediate Settlement</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">radio_button_checked</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleBuy}
                disabled={loading || !payAmount || !orderId}
                className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-bold text-lg uppercase tracking-[0.2em] shadow-[0_8px_30px_rgba(2,201,83,0.15)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : `SELL ${orderAsset}`}
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-on-surface-variant uppercase font-medium tracking-widest">
                <span className="material-symbols-outlined text-sm">lock</span>
                Secured by Escrow
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          <div className="bg-surface-container-low p-6">
            <h3 className="font-label text-[10px] uppercase tracking-widest text-primary mb-4">Merchant Terms</h3>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              1. Must be the account owner. <br />
              2. No memo required in transfer. <br />
              3. Release occurs within 2 minutes of payment confirmation. <br />
              4. Any fraud attempts will be reported to customer support.
            </p>
          </div>
          <div className="bg-surface-container-low p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Safety Checklist</h3>
              <ul className="text-[11px] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Only pay through the app
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Verify recipient name
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Keep payment receipt
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-surface-container-low overflow-hidden relative p-6 flex flex-col justify-end">
            <p className="font-headline font-bold text-xl leading-tight text-on-surface">
              100% SECURE<br />LIQUIDITY
            </p>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">
              Security Verified
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
