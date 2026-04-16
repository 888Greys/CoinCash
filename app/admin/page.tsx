import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { AppShell } from "@/components/app-shell";
import { AdminSupportInbox } from "@/components/admin-support-inbox";
import { createClient } from "@/utils/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export const metadata = { title: "Admin" };

type AdminMessage = {
  id: string;
  trade_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = isAdminEmail(user.email);
  if (!isAdmin) {
    redirect("/home");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  const adminDb = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: messages } = await adminDb
    .from("messages")
    .select("id, trade_id, sender_id, content, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (messages ?? []) as AdminMessage[];
  const senderIds = Array.from(new Set(rows.map((m) => m.sender_id)));

  const { data: senderProfiles } = senderIds.length
    ? await adminDb.from("profiles").select("id, username, email").in("id", senderIds)
    : { data: [] as Array<{ id: string; username: string | null; email: string | null }> };

  const senderMap = new Map(
    (senderProfiles ?? []).map((p) => [
      p.id,
      { username: p.username ?? "Unknown", email: p.email ?? "-" },
    ])
  );

  return (
    <AppShell currentPath="/admin" user={user ? { email: user.email, ...profile, isAdmin } : null}>
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mt-1">
              Cross-account chat visibility (allowlist only)
            </p>
          </div>
          <span className="rounded bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Admin Access
          </span>
        </div>

        <div className="mb-6">
          <AdminSupportInbox />
        </div>

        <section className="rounded-lg border border-outline-variant/15 bg-surface-container-low p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-headline text-lg font-bold tracking-tight">P2P Trade Chat Monitor</h2>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Latest 200</span>
          </div>

          {rows.length === 0 ? (
            <div className="rounded border border-outline-variant/15 bg-surface-container-high/40 p-6 text-sm text-on-surface-variant">
              No chat messages found yet.
            </div>
          ) : (
            <>
              <div className="space-y-2 md:hidden">
                {rows.map((row) => {
                  const sender = senderMap.get(row.sender_id) ?? { username: "Unknown", email: "-" };
                  return (
                    <article key={row.id} className="rounded border border-outline-variant/15 bg-surface-container-high/40 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2 text-[10px] text-on-surface-variant">
                        <span>{new Date(row.created_at).toLocaleString()}</span>
                        <span className="rounded bg-surface-container px-2 py-1 font-mono">{row.trade_id.slice(0, 8)}...</span>
                      </div>
                      <p className="text-xs font-semibold text-on-surface">{sender.username}</p>
                      <p className="text-[10px] text-on-surface-variant">{sender.email}</p>
                      <p className="mt-2 break-words text-xs text-on-surface">{row.content}</p>
                    </article>
                  );
                })}
              </div>

              <div className="hidden overflow-hidden rounded border border-outline-variant/15 md:block">
                <div className="grid grid-cols-12 border-b border-outline-variant/15 bg-surface-container-high px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <div className="col-span-2">Time</div>
                  <div className="col-span-2">Trade ID</div>
                  <div className="col-span-3">Sender</div>
                  <div className="col-span-5">Message</div>
                </div>
                {rows.map((row) => {
                  const sender = senderMap.get(row.sender_id) ?? { username: "Unknown", email: "-" };
                  return (
                    <div
                      key={row.id}
                      className="grid grid-cols-12 gap-2 border-b border-outline-variant/10 px-4 py-3 text-xs last:border-b-0"
                    >
                      <div className="col-span-2 text-on-surface-variant">{new Date(row.created_at).toLocaleString()}</div>
                      <div className="col-span-2 font-mono text-on-surface-variant">{row.trade_id.slice(0, 8)}...</div>
                      <div className="col-span-3">
                        <div className="font-semibold text-on-surface">{sender.username}</div>
                        <div className="text-[10px] text-on-surface-variant">{sender.email}</div>
                      </div>
                      <div className="col-span-5 break-words text-on-surface">{row.content}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
