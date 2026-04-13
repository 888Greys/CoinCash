"use client";

import { useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { createOrder } from "../actions";

const assetOptions = [
  { value: "USDT", label: "USDT (Tether USD)" },
  { value: "BTC", label: "BTC (Bitcoin)" },
  { value: "ETH", label: "ETH (Ethereum)" },
];

const fiatOptions = [
  { value: "USD", label: "USD" },
  { value: "KES", label: "KES" },
  { value: "UGX", label: "UGX" },
];

const paymentOptions = ["Bank Transfer", "M-Pesa", "Zelle", "Wise", "Cash", "Revolut"];

export default function PostAdPage() {
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [asset, setAsset] = useState("USDT");
  const [fiat, setFiat] = useState("USD");
  const [priceMargin, setPriceMargin] = useState("101.20");
  const [totalAmount, setTotalAmount] = useState("");
  const [minLimit, setMinLimit] = useState("");
  const [maxLimit, setMaxLimit] = useState("");
  const [selectedPayments, setSelectedPayments] = useState<string[]>(["Bank Transfer"]);
  const [terms, setTerms] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculatedPrice = (Number(priceMargin) / 100).toFixed(3);

  const togglePayment = (method: string) => {
    setSelectedPayments((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("type", type);
    formData.append("asset", asset);
    formData.append("fiat", fiat);
    formData.append("price", calculatedPrice);
    formData.append("total_amount", totalAmount);
    formData.append("min_limit", minLimit);
    formData.append("max_limit", maxLimit);
    formData.append("payment_method", selectedPayments.join(", "));
    formData.append("terms", terms);

    const result = await createOrder(formData);

    // If redirect happens, we won't reach here
    if (result && !result.success) {
      setError(result.error ?? "Failed to create order");
      setLoading(false);
    }
  };

  return (
    <AppShell currentPath="/p2p">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb / Progress */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">CREATE_NEW_AD</h2>
            <p className="text-on-surface-variant text-sm uppercase tracking-[0.1em]">Configuring Merchant Liquidity Node</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-sm bg-primary text-on-primary-container flex items-center justify-center font-bold text-xs">01</div>
              <span className="text-[9px] mt-1 font-bold text-primary uppercase">Asset</span>
            </div>
            <div className="w-12 h-[1px] bg-outline-variant/30 mb-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-sm bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-xs border border-outline-variant/20">02</div>
              <span className="text-[9px] mt-1 font-bold text-on-surface-variant uppercase opacity-60">Price</span>
            </div>
            <div className="w-12 h-[1px] bg-outline-variant/30 mb-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-sm bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-xs border border-outline-variant/20">03</div>
              <span className="text-[9px] mt-1 font-bold text-on-surface-variant uppercase opacity-60">Limits</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 mb-6">
            {error}
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Asset & Type */}
            <section className="bg-surface-container-low p-6 rounded-sm space-y-8">
              <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                <span className="material-symbols-outlined text-secondary text-lg">settings_input_component</span>
                <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Step 01: Asset Configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Transaction Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType("buy")}
                      className={`flex-1 py-3 border font-bold text-xs uppercase tracking-tighter rounded-sm flex items-center justify-center gap-2 transition-all ${
                        type === "buy"
                          ? "bg-primary-container/10 border-primary text-primary"
                          : "bg-surface-container-highest border-outline-variant/20 text-on-surface-variant hover:bg-surface-bright"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">download</span> I WANT TO BUY
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("sell")}
                      className={`flex-1 py-3 border font-bold text-xs uppercase tracking-tighter rounded-sm flex items-center justify-center gap-2 transition-all ${
                        type === "sell"
                          ? "bg-primary-container/10 border-primary text-primary"
                          : "bg-surface-container-highest border-outline-variant/20 text-on-surface-variant hover:bg-surface-bright"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">upload</span> I WANT TO SELL
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cryptocurrency Asset</label>
                  <div className="relative">
                    <select
                      value={asset}
                      onChange={(e) => setAsset(e.target.value)}
                      className="w-full bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-4 rounded-sm appearance-none focus:outline-none text-sm font-medium"
                    >
                      {assetOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fiat Currency</label>
                <div className="relative w-48">
                  <select
                    value={fiat}
                    onChange={(e) => setFiat(e.target.value)}
                    className="w-full bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-4 rounded-sm appearance-none focus:outline-none text-sm font-medium"
                  >
                    {fiatOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
            </section>

            {/* Section 2: Pricing */}
            <section className="bg-surface-container-low p-6 rounded-sm space-y-8">
              <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                <span className="material-symbols-outlined text-secondary text-lg">monitoring</span>
                <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Step 02: Pricing Engine</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Floating Margin (%)</label>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Suggested: 101.5%</span>
                  </div>
                  <div className="flex items-center bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 rounded-sm p-1">
                    <button type="button" onClick={() => setPriceMargin(String(Math.max(100, Number(priceMargin) - 0.1).toFixed(2)))} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <input
                      className="flex-1 bg-transparent border-none text-center font-bold font-headline text-lg focus:ring-0"
                      type="text"
                      value={priceMargin}
                      onChange={(e) => setPriceMargin(e.target.value)}
                    />
                    <button type="button" onClick={() => setPriceMargin(String((Number(priceMargin) + 0.1).toFixed(2)))} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Calculated Ad Price</label>
                  <div className="h-12 flex items-center px-4 bg-surface-container-highest rounded-sm border border-outline-variant/10">
                    <span className="font-headline font-bold text-lg text-on-surface">{calculatedPrice} <span className="text-xs text-on-surface-variant">{fiat}/{asset}</span></span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Limits */}
            <section className="bg-surface-container-low p-6 rounded-sm space-y-8">
              <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                <span className="material-symbols-outlined text-secondary text-lg">rule</span>
                <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Step 03: Liquidity Limits</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Trading Amount</label>
                  <div className="relative">
                    <input
                      className="w-full bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-4 rounded-sm focus:outline-none text-sm font-headline font-medium"
                      placeholder="0.00"
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary uppercase">{asset}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Order Limit (Per Trade)</label>
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-3 rounded-sm focus:outline-none text-sm font-medium"
                      placeholder="Min"
                      type="number"
                      value={minLimit}
                      onChange={(e) => setMinLimit(e.target.value)}
                    />
                    <div className="w-4 h-[1px] bg-outline-variant/30"></div>
                    <input
                      className="flex-1 bg-[#000000] border border-[#737679]/20 focus-within:border-primary/40 text-on-surface py-3 px-3 rounded-sm focus:outline-none text-sm font-medium"
                      placeholder="Max"
                      type="number"
                      value={maxLimit}
                      onChange={(e) => setMaxLimit(e.target.value)}
                    />
                    <span className="text-[10px] font-bold text-on-surface-variant">{fiat}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Payment Method Configuration</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {paymentOptions.map((method) => {
                    const isSelected = selectedPayments.includes(method);
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => togglePayment(method)}
                        className={`p-3 border rounded-sm flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-surface-container-highest border-primary/40"
                            : "bg-[#000000] border-outline-variant/10 opacity-50 hover:opacity-100"
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase">{method}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Trade Terms (Optional)</label>
                <textarea
                  className="w-full bg-[#000000] border border-[#737679]/20 focus:border-primary/40 text-on-surface py-3 px-4 rounded-sm focus:outline-none text-sm font-medium resize-none"
                  rows={3}
                  placeholder="Enter any special conditions for your trade..."
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !totalAmount || !minLimit || !maxLimit}
                className="px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-extrabold font-headline uppercase tracking-widest text-sm rounded-sm active:scale-95 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Ad To Market"}
              </button>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <div className="bg-surface-container-high rounded-sm overflow-hidden shadow-2xl">
                <div className="bg-primary/10 px-4 py-3 flex justify-between items-center border-b border-primary/20">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Merchant Preview</span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                </div>
                <div className="p-5 space-y-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Type</div>
                    <div className="flex items-center gap-2">
                       <Image src={`/icons/${asset?.toLowerCase()}.svg`} alt={asset} width={24} height={24} unoptimized />
                       <div className="font-headline text-lg font-bold">{type === "buy" ? "BUY" : "SELL"} {asset}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Price</div>
                    <div className="font-headline text-2xl font-bold text-primary">{calculatedPrice} <span className="text-sm font-medium text-on-surface">{fiat}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/10">
                    <div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase">Available</div>
                      <div className="text-xs font-bold">{totalAmount || "0.00"} {asset}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase">Limit</div>
                      <div className="text-xs font-bold">{fiat} {minLimit || "0"} - {maxLimit || "0"}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Payment Methods</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPayments.map((method) => (
                        <span key={method} className="px-2 py-1 bg-surface-container-highest text-[9px] font-bold uppercase rounded-sm border border-outline-variant/20">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-5 bg-surface-container-low rounded-sm border-l-4 border-secondary/40">
                <h4 className="text-xs font-bold text-secondary uppercase mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Merchant Protocols
                </h4>
                <ul className="space-y-3 text-[11px] text-on-surface-variant leading-tight">
                  <li className="flex gap-2"><span className="text-secondary">•</span>Ensure your floating margin covers the platform{"'"}s 0.1% merchant fee.</li>
                  <li className="flex gap-2"><span className="text-secondary">•</span>Response time affects your ranking in the P2P marketplace.</li>
                  <li className="flex gap-2"><span className="text-secondary">•</span>Always verify payment in your bank account before releasing assets.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
