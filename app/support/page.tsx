import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="px-4 pt-3 max-w-3xl mx-auto space-y-3">
        <section className="rounded-lg border border-primary/30 bg-surface-container-low p-3 md:p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-primary">Chat Room</p>
              <h1 className="font-headline text-lg md:text-xl font-bold mt-0.5">Customer Support</h1>
              <p className="text-[11px] md:text-xs text-on-surface-variant mt-1 leading-relaxed line-clamp-2">{message}</p>
              {supportRequestRef && (
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                  Request queued: {supportRequestRef}
                </p>
              )}
            </div>
            <span className="material-symbols-outlined text-xl md:text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              support_agent
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <Link
              href="/p2p"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              Open P2P
            </Link>
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-primary hover:bg-primary/15"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Home
            </Link>
          </div>
        </section>

        <SupportChatRoom initialMessage={message} />
      </div>
    </AppShell>
  );
}
