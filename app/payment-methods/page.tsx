import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/utils/supabase/server";
import { getPaymentMethods } from "@/app/actions/payment-methods";
import { PaymentMethodsList } from "@/components/payment-methods-list";
import { isAdminEmail } from "@/lib/admin";

export const metadata: Metadata = { title: "Payment Methods" };

export default async function PaymentMethodsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(user?.email);
  let profile: { username: string | null; avatar_url: string | null } | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("username, avatar_url").eq("id", user.id).single();
    profile = data;
  }
  const displayName = profile?.username?.toUpperCase() || user?.email?.split("@")[0]?.toUpperCase() || "USER";

  const methods = await getPaymentMethods();

  return (
    <AppShell currentPath="/payment-methods" user={user ? { email: user.email, ...profile, isAdmin } : null}>
      <div className="px-4 pt-6 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Payment Methods</h1>
          <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
            Manage payments for <span className="text-primary font-bold">@{displayName.toLowerCase()}</span>
          </p>
        </section>

        {/* Verification Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-5 rounded flex items-start gap-4 shadow-sm border-l-2 border-primary/40">
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
          <div className="bg-surface-container-low p-5 rounded flex items-start gap-4 shadow-sm border-l-2 border-secondary/40">
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

        {/* Interactive List (Client Component) */}
        <PaymentMethodsList methods={methods} displayName={displayName} />
      </div>
    </AppShell>
  );
}
