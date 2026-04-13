"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type P2PExpressWidgetProps = {
  bestPrice: number | null;
  fiat: string;
  asset: string;
  orderId: string | null;
  merchantName: string | null;
  minLimit: number;
  maxLimit: number;
  paymentMethod: string | null;
  totalAmount: number;
};

export function P2PExpressWidget({
  bestPrice,
  fiat,
  asset,
  orderId,
  merchantName,
  minLimit,
  maxLimit,
  paymentMethod,
  totalAmount,
}: P2PExpressWidgetProps) {
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleBuy = () => {
    if (!orderId || !bestPrice) return;
    
    // Validate limits
    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) return;
    
    router.push(
      `/p2p/buy?order=${orderId}&merchant=${encodeURIComponent(merchantName || "Unknown")}&price=${bestPrice}&asset=${asset}&fiat=${fiat}&available=${totalAmount}&min=${minLimit}&max=${maxLimit}&method=${encodeURIComponent(paymentMethod || "Bank Transfer")}`
    );
  };

  return (
    <div className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/10 relative overflow-hidden">
      {/* Background design */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      
      <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface mb-1 relative z-10 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-sm">flash_on</span>
        P2P Express Buy
      </h2>
      <p className="text-[10px] text-on-surface-variant mb-4 relative z-10">
        Best Match: {bestPrice ? `~${bestPrice.toFixed(2)} ${fiat}/${asset}` : "No active orders found"}
      </p>
      
      <div className="flex gap-2 relative z-10">
        <div className="flex-1 bg-surface-container-highest rounded-sm flex items-center px-3 border border-outline-variant/20 focus-within:border-primary/50">
          <span className="text-sm font-bold text-on-surface-variant mr-2">{fiat}</span>
          <input 
            type="number" 
            placeholder={bestPrice ? String(minLimit) : "0"} 
            className="w-full bg-transparent outline-none py-3 text-sm font-headline font-bold"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!bestPrice}
          />
        </div>
        <button 
          onClick={handleBuy}
          disabled={!bestPrice || !amount || Number(amount) < minLimit || Number(amount) > maxLimit}
          className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-6 rounded-sm uppercase text-xs tracking-widest active:scale-95 transition-transform shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
        >
          Buy {asset}
        </button>
      </div>
      {amount && bestPrice && (Number(amount) < minLimit || Number(amount) > maxLimit) && (
        <p className="text-[10px] text-error mt-2">
          Amount must be between {minLimit} and {maxLimit} {fiat}
        </p>
      )}
    </div>
  );
}
