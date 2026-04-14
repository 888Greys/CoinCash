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

  return (
    <AppShell currentPath="/support" user={user ? { email: user.email, ...profile } : null}>
      <div className="px-4 pt-6 max-w-3xl mx-auto space-y-5">
        <section className="rounded-lg border border-primary/30 bg-surface-container-low p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Chat Room</p>
              <h1 className="font-headline text-2xl font-bold mt-1">Customer Support</h1>
              <p className="text-sm text-on-surface-variant mt-2">{message}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              support_agent
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/p2p"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-outline-variant/30 bg-surface-container px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              Open P2P Market
            </Link>
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/15"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Home
            </Link>
          </div>
        </section>

        <SupportChatRoom initialMessage={message} />
      </div>
    </AppShell>
  );
}
