"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { releaseTradeAction, markTradePaidAction } from "../../actions";

type TradeActionsProps = {
  tradeId: string;
  status: string;
  isBuyer: boolean;
  isSeller: boolean;
  currentUserId?: string;
  variant?: "default" | "payment-mobile";
};

export function TradeActions({ tradeId, status, isBuyer, isSeller, currentUserId, variant = "default" }: TradeActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProofSheet, setShowProofSheet] = useState(false);
  const [proofName, setProofName] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [allowNoImage, setAllowNoImage] = useState(false);
  const [confirmedOwnAccount, setConfirmedOwnAccount] = useState(false);
  const [merchantCalled, setMerchantCalled] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();
  const isPaymentMobile = variant === "payment-mobile";

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

  const handleMarkPaid = async () => {
    if (!confirmedOwnAccount) {
      setError("Please confirm you paid using your own payment account name.");
      return;
    }

    if (!proofName && !allowNoImage) {
      setError("Upload at least one payment proof, or check the proceed-without-image option.");
      return;
    }

    setLoading(true);
    setError(null);

    let proofUrl: string | null = null;

    if (proofFile) {
      const safeName = proofFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${tradeId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase
        .storage
        .from("payment-proofs")
        .upload(path, proofFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}. Create a public storage bucket named payment-proofs.`);
        setLoading(false);
        return;
      }

      const { data: publicData } = supabase.storage.from("payment-proofs").getPublicUrl(path);
      proofUrl = publicData.publicUrl;
    }

    if (currentUserId) {
      const proofMessage = proofUrl
        ? `Payment proof uploaded: ${proofUrl}`
        : "Payment marked as sent. Buyer proceeded without image proof.";

      await supabase.from("messages").insert({
        trade_id: tradeId,
        sender_id: currentUserId,
        content: proofMessage,
      });
    }

    const result = await markTradePaidAction(tradeId);

    if (!result.success) {
      setError(result.error ?? "Failed to mark as paid");
      setLoading(false);
      return;
    }

    setShowProofSheet(false);
    router.refresh();
  };

  if (status === "released" || status === "cancelled") {
    return null;
  }

  return (
    <div className={isPaymentMobile ? "space-y-4" : "bg-surface-container-low p-6 rounded-sm space-y-4"}>
      {!isPaymentMobile && (
        <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</h3>
      )}

      {error && (
        <div className="rounded border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {isBuyer && status === "pending" && (
        <div className="space-y-3">
          {isPaymentMobile ? (
            <>
              <div className="flex items-start gap-3 rounded-lg border border-primary/10 bg-primary/5 p-4">
                <span className="material-symbols-outlined shrink-0 text-primary text-xl">info</span>
                <p className="text-xs leading-relaxed text-on-surface-variant">
                  Tap the button below to upload payment proof for seller confirmation.
                </p>
              </div>

              <label className="flex cursor-pointer select-none items-start gap-3 rounded-lg border border-error/20 bg-error/5 p-4">
                <input
                  type="checkbox"
                  checked={merchantCalled}
                  onChange={(e) => setMerchantCalled(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded-sm border-error/40 bg-surface-container-highest text-error"
                />
                <span className="text-xs font-bold uppercase leading-relaxed tracking-tight text-error">
                  Call the merchant before making payment. Tick to confirm you have called the merchant.
                </span>
              </label>
            </>
          ) : (
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Please complete the payment using the specified method, then click the button below to notify the seller.
            </p>
          )}

          <button
            onClick={() => {
              setError(null);
              setShowProofSheet(true);
            }}
            disabled={loading || (isPaymentMobile && !merchantCalled)}
            className={isPaymentMobile
              ? "fixed bottom-0 left-0 z-40 w-full border-t border-outline-variant/15 bg-surface-container-highest/90 px-6 pb-8 pt-4 disabled:opacity-60"
              : "w-full py-4 bg-tertiary text-on-tertiary font-headline font-bold uppercase tracking-widest text-sm rounded-sm active:scale-[0.98] transition-all disabled:opacity-50"
            }
          >
            {isPaymentMobile ? (
              <span className="mx-auto flex h-14 w-full max-w-3xl items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary-container font-headline text-sm font-bold uppercase tracking-[0.15em] text-on-primary-container shadow-[0_4px_20px_rgba(2,201,83,0.3)]">
                Upload Payment Proof
              </span>
            ) : (
              "Upload Payment Proof"
            )}
          </button>

          {showProofSheet && (
            <div className="fixed inset-0 z-50 flex items-end bg-black/60 md:items-center md:justify-center">
              <div className="w-full rounded-t-3xl border border-outline-variant/20 bg-surface-container-low p-5 md:max-w-md md:rounded-2xl">
                <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-outline-variant/30 md:hidden" />
                <h4 className="font-headline text-2xl font-bold tracking-tight">Payment Confirmation</h4>

                <div className="mt-4 space-y-2">
                  <p className="text-lg font-semibold">Upload Payment Proof</p>
                  <p className="text-sm text-on-surface-variant">
                    Save an image of the payment proof (JPG, JPEG or PNG) and upload at least 1 proof for the seller.
                  </p>

                  <label className="mt-2 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-outline-variant/25 bg-surface-container-high hover:border-primary/40">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setProofFile(file);
                        setProofName(file?.name ?? null);
                      }}
                    />
                    <span className="material-symbols-outlined text-2xl">add</span>
                    <span className="text-xs text-on-surface-variant">{proofName ? "1/1" : "0/1"}</span>
                  </label>

                  {proofName && <p className="text-xs text-primary">Selected: {proofName}</p>}

                  <p className="pt-2 text-sm text-on-surface-variant">
                    Having trouble uploading? Tick the confirmation box below to proceed without an image.
                  </p>

                  <label className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <input
                      type="checkbox"
                      checked={allowNoImage}
                      onChange={(e) => setAllowNoImage(e.target.checked)}
                      className="mt-1"
                    />
                    <span>Proceed without image upload.</span>
                  </label>

                  <label className="flex items-start gap-2 rounded-sm border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                    <input
                      type="checkbox"
                      checked={confirmedOwnAccount}
                      onChange={(e) => setConfirmedOwnAccount(e.target.checked)}
                      className="mt-1"
                    />
                    <span>I have made the transfer with my own payment account name.</span>
                  </label>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProofSheet(false)}
                    className="h-12 rounded-lg border border-outline-variant/25 text-sm font-bold text-on-surface-variant"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkPaid}
                    disabled={loading}
                    className="h-12 rounded-lg bg-tertiary text-sm font-black text-on-tertiary disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Transferred Notify Seller"}
                  </button>
                </div>
              </div>
            </div>
          )}
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
