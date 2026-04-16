import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { SupportChatRoom } from "@/components/support-chat-room";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = { title: "Customer Support" };

type Props = {
  searchParams?: {
    intent?: string;
  };
};

const intentCopy: Record<string, string> = {
  deposit: "Deposit is currently guided by support. Chat with us and we will share the exact funding steps.",
  transfer: "Transfers are currently guided by support. Chat with us and we will walk you through a secure transfer.",
  earn: "Earn products are currently limited. Chat with us for eligibility and activation steps.",
};

export default async function SupportPage({ searchParams }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { username: string | null; avatar_url: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const intent = (searchParams?.intent ?? "").toLowerCase();
  const message = intentCopy[intent] ?? "Tell us what you want to do, and support will provide step-by-step guidance.";
  let supportRequestRef: string | null = null;

  if (user && intent in intentCopy) {
    const requestRef = `SUP-${intent.toUpperCase()}-${user.id.slice(0, 8)}`;

    // Attach requests to USDT wallet when available so operations can reconcile faster.
    const { data: usdtWallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", user.id)
      .eq("currency", "USDT")
      .maybeSingle();

    const { error } = await supabase.from("transactions").upsert(
      {
        wallet_id: usdtWallet?.id ?? null,
        type: `support_${intent}`,
        amount: 0,
        status: "pending",
        reference: requestRef,
      },
      { onConflict: "reference" },
    );

    if (!error) {
      supportRequestRef = requestRef;
    }
  }

  return (
    <AppShell currentPath="/support" user={user ? { email: user.email, ...profile } : null}>
      <div className="mx-auto max-w-3xl px-4 pt-3">
        <SupportChatRoom initialMessage={message} />
        {supportRequestRef && (
          <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            Request queued: {supportRequestRef}
          </p>
        )}
      </div>
    </AppShell>
  );
}
