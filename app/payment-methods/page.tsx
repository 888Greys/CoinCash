import { AppShell } from "@/components/app-shell";

const paymentMethods = [
  {
    name: "M-Pesa Kenya",
    icon: "smartphone",
    iconColor: "text-primary",
    holder: "JAMES OMINO • ****7240",
    status: "Verified",
    statusColor: "bg-primary/20 text-primary",
    active: true,
    ghost: "MPESA",
    ghostColor: "text-primary/5",
  },
  {
    name: "Equity Bank",
    icon: "account_balance",
    iconColor: "text-tertiary",
    holder: "JAMES OMINO • 1220 **** **** 881",
    status: "Action Required",
    statusColor: "bg-error/20 text-error",
    active: false,
    ghost: "BANK",
    ghostColor: "text-tertiary/5",
  },
];

export default function PaymentMethodsPage() {
  return (
    <AppShell currentPath="/payment-methods">
      <div className="px-4 pt-6 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <section className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Payment Methods</h1>
          <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
            Manage your liquidity channels
          </p>
        </section>

        {/* Verification Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-5 rounded flex items-start gap-4 shadow-sm">
            <div className="bg-primary/10 p-2 rounded text-primary">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm uppercase tracking-wider mb-1">Verify Ownership</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Submit a screenshot of your account dashboard to activate P2P trading features.
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low p-5 rounded flex items-start gap-4 shadow-sm">
            <div className="bg-secondary/10 p-2 rounded text-secondary">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm uppercase tracking-wider mb-1">2FA Mandatory</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Ensure Google Authenticator is linked before adding new payout destinations.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((pm) => (
            <div
              key={pm.name}
              className="group relative bg-surface-container-high hover:bg-surface-bright transition-colors duration-200 p-5 rounded-sm flex items-center justify-between overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0b0e11] rounded flex items-center justify-center border border-outline-variant/15">
                  <span className={`material-symbols-outlined ${pm.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {pm.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-on-surface tracking-tight">{pm.name}</span>
                    <span className={`${pm.statusColor} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter`}>
                      {pm.status}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-xs font-label">{pm.holder}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                    {pm.active ? "Active" : "Inactive"}
                  </span>
                  <div className={`w-10 h-5 ${pm.active ? "bg-primary-container" : "bg-outline-variant"} rounded-full relative cursor-pointer flex items-center px-1`}>
                    <div className={`w-3 h-3 rounded-full ${pm.active ? "bg-white ml-auto" : "bg-surface-container-highest"}`} />
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              {/* Ghost decoration */}
              <div className={`absolute right-0 bottom-0 ${pm.ghostColor} font-headline font-black text-4xl select-none translate-y-1/4 translate-x-1/4 pointer-events-none uppercase`}>
                {pm.ghost}
              </div>
            </div>
          ))}

          {/* Add New */}
          <button className="w-full py-5 border-2 border-dashed border-outline-variant/30 rounded-sm hover:border-primary/50 transition-all group">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">add</span>
              </div>
              <span className="font-headline font-bold text-sm uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-primary">
                Link New Account
              </span>
            </div>
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-error/10 p-4 border-l-2 border-error/50 flex gap-4 mb-8">
          <span className="material-symbols-outlined text-error text-xl">info</span>
          <p className="text-[11px] text-on-error-container leading-tight">
            For security reasons, you cannot change the Account Name. All payment methods must match your KYC verified
            name <span className="font-bold underline">JAMES OMINO</span>. Unauthorized account linkage will lead to
            permanent suspension.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
