"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { releaseTradeAction } from "../../actions";

type TradeActionsProps = {
  tradeId: string;
  status: string;
  isBuyer: boolean;
  isSeller: boolean;
};

export function TradeActions({ tradeId, status, isBuyer, isSeller }: TradeActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRelease = async () => {
    if (!confirm("Are you sure you want to release the escrow? This action cannot be undone.")) return;

    setLoading(true);
    setError(null);

    const result = await releaseTradeAction(tradeId);

    if (!result.success) {
      setError(result.error ?? "Failed to release funds");
      setLoading(false);
      return;
    }

    router.refresh();
  };

  if (status === "released" || status === "cancelled") {
    return null;
  }

  return (
    <div className="bg-surface-container-low p-6 rounded-sm space-y-4">
      <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</h3>

      {error && (
        <div className="rounded border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {isBuyer && status === "pending" && (
        <div className="space-y-3">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Please complete the payment using the specified method, then click the button below to notify the seller.
          </p>
          <button
            disabled={loading}
            className="w-full py-4 bg-tertiary text-on-tertiary font-headline font-bold uppercase tracking-widest text-sm rounded-sm active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "I've Paid — Notify Seller"}
          </button>
        </div>
      )}

      {isSeller && (status === "pending" || status === "paid") && (
        <div className="space-y-3">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {status === "pending"
              ? "Waiting for the buyer to complete payment. You will be notified when they mark it as paid."
              : "The buyer has marked the payment as sent. Verify the funds in your account before releasing."}
          </p>
          <button
            onClick={handleRelease}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-bold uppercase tracking-widest text-sm rounded-sm active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
          >
            {loading ? "Releasing..." : "Release Funds to Buyer"}
          </button>
          <p className="text-[10px] text-error text-center">
            ⚠️ Only release after verifying payment in your bank/wallet
          </p>
        </div>
      )}

      {status === "disputed" && (
        <div className="bg-error/5 border border-error/20 p-4 rounded-sm text-center">
          <span className="material-symbols-outlined text-error text-2xl mb-2">gavel</span>
          <p className="text-xs text-on-surface-variant">This trade is under dispute. A moderator will review it shortly.</p>
        </div>
      )}
    </div>
  );
}
