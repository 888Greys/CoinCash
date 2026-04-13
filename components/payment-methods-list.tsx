"use client";

import { useState } from "react";
import { addPaymentMethod, deletePaymentMethod, togglePaymentMethod } from "@/app/actions/payment-methods";
import { useRouter } from "next/navigation";

type PaymentMethod = {
  id: string;
  name: string;
  type: string;
  account_holder: string;
  account_number: string;
  is_active: boolean;
  created_at: string;
};

const typeIcons: Record<string, { icon: string; color: string; ghost: string }> = {
  mobile_money: { icon: "smartphone", color: "text-primary", ghost: "MPESA" },
  bank_transfer: { icon: "account_balance", color: "text-tertiary", ghost: "BANK" },
  cash: { icon: "payments", color: "text-secondary", ghost: "CASH" },
  other: { icon: "credit_card", color: "text-on-surface-variant", ghost: "OTHER" },
};

export function PaymentMethodsList({ methods, displayName }: { methods: PaymentMethod[]; displayName: string }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const result = await addPaymentMethod(formData);
    if (result.success) {
      setShowForm(false);
      router.refresh();
    } else {
      setError(result.error ?? "Failed to add");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this payment method?")) return;
    await deletePaymentMethod(id);
    router.refresh();
  };

  const handleToggle = async (id: string, current: boolean) => {
    await togglePaymentMethod(id, !current);
    router.refresh();
  };

  return (
    <>
      {/* Payment Methods List */}
      <div className="space-y-4">
        {methods.map((pm) => {
          const style = typeIcons[pm.type] ?? typeIcons.other;
          return (
            <div
              key={pm.id}
              className="group relative bg-surface-container-high hover:bg-surface-bright transition-colors duration-200 p-5 rounded-sm flex items-center justify-between overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0b0e11] rounded flex items-center justify-center border border-outline-variant/15">
                  <span className={`material-symbols-outlined ${style.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {style.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-on-surface tracking-tight">{pm.name}</span>
                    <span className={`${pm.is_active ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter`}>
                      {pm.is_active ? "Verified" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-xs font-label">{pm.account_holder} • {pm.account_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                    {pm.is_active ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleToggle(pm.id, pm.is_active)}
                    className={`w-10 h-5 ${pm.is_active ? "bg-primary-container" : "bg-outline-variant"} rounded-full relative cursor-pointer flex items-center px-1`}
                  >
                    <div className={`w-3 h-3 rounded-full ${pm.is_active ? "bg-white ml-auto" : "bg-surface-container-highest"}`} />
                  </button>
                </div>
                <button onClick={() => handleDelete(pm.id)} className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              {/* Ghost decoration */}
              <div className={`absolute right-0 bottom-0 text-primary/5 font-headline font-black text-4xl select-none translate-y-1/4 translate-x-1/4 pointer-events-none uppercase`}>
                {style.ghost}
              </div>
            </div>
          );
        })}

        {/* Add New Button / Form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-5 border-2 border-dashed border-outline-variant/30 rounded-sm hover:border-primary/50 transition-all group"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">add</span>
              </div>
              <span className="font-headline font-bold text-sm uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-primary">
                Link New Account
              </span>
            </div>
          </button>
        ) : (
          <div className="bg-surface-container-low p-6 rounded-sm border border-outline-variant/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest">Add Payment Method</h3>
              <button onClick={() => { setShowForm(false); setError(null); }} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {error && (
              <div className="rounded border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</div>
            )}

            <form action={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Name</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g., M-Pesa Kenya"
                    className="w-full bg-[#000000] border border-[#737679]/20 focus:border-primary/40 text-on-surface py-3 px-4 rounded-sm text-sm font-medium outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</label>
                  <select
                    name="type"
                    required
                    className="w-full bg-[#000000] border border-[#737679]/20 focus:border-primary/40 text-on-surface py-3 px-4 rounded-sm text-sm font-medium outline-none appearance-none"
                  >
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Account Holder</label>
                  <input
                    name="account_holder"
                    required
                    placeholder="e.g., JAMES OMINO"
                    className="w-full bg-[#000000] border border-[#737679]/20 focus:border-primary/40 text-on-surface py-3 px-4 rounded-sm text-sm font-medium outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Account Number</label>
                  <input
                    name="account_number"
                    required
                    placeholder="e.g., 0720****40"
                    className="w-full bg-[#000000] border border-[#737679]/20 focus:border-primary/40 text-on-surface py-3 px-4 rounded-sm text-sm font-medium outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold text-xs uppercase tracking-widest rounded-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Add Payment Method"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-error/10 p-4 border-l-2 border-error/50 flex gap-4 mb-8">
        <span className="material-symbols-outlined text-error text-xl">info</span>
        <p className="text-[11px] text-on-error-container leading-tight">
          For security reasons, you cannot change the Account Name. All payment methods must match your KYC verified
          name <span className="font-bold underline">{displayName}</span>. Unauthorized account linkage will lead to
          permanent suspension.
        </p>
      </div>
    </>
  );
}
