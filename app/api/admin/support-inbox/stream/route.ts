import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportMessageRow = {
  id: string;
  user_id: string;
  sender_id: string | null;
  sender_role: "user" | "support";
  content: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  username: string | null;
  email: string | null;
};

function buildAdminDb() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

async function fetchSupportInboxSnapshot() {
  const adminDb = buildAdminDb();

  const { data: rows, error } = await adminDb
    .from("support_messages")
    .select("id, user_id, sender_id, sender_role, content, created_at")
    .order("created_at", { ascending: true })
    .limit(600);

  if (error) {
    throw new Error(error.message);
  }

  const messages = (rows ?? []) as SupportMessageRow[];
  const profileIds = Array.from(
    new Set(messages.flatMap((item) => [item.user_id, item.sender_id]).filter(Boolean) as string[])
  );

  const { data: profiles } = profileIds.length
    ? await adminDb.from("profiles").select("id, username, email").in("id", profileIds)
    : { data: [] as ProfileRow[] };

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  const normalized = messages.map((item) => ({
    id: item.id,
    userId: item.user_id,
    senderId: item.sender_id,
    senderRole: item.sender_role,
    content: item.content,
    createdAt: item.created_at,
    userUsername: profileMap.get(item.user_id)?.username ?? "Unknown",
    userEmail: profileMap.get(item.user_id)?.email ?? "-",
    senderUsername: item.sender_id ? profileMap.get(item.sender_id)?.username ?? "Support" : "Support",
    senderEmail: item.sender_id ? profileMap.get(item.sender_id)?.email ?? "-" : "-",
  }));

  const signature = `${normalized.length}:${normalized.at(-1)?.id ?? "none"}:${normalized.at(-1)?.createdAt ?? "none"}`;
  return { messages: normalized, signature };
}

export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      let lastSignature = "";

      const sendEvent = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\\n\\n`));
      };

      const sendError = (message: string) => {
        controller.enqueue(encoder.encode(`event: error\\ndata: ${JSON.stringify({ error: message })}\\n\\n`));
      };

      const tick = async () => {
        if (closed) return;
        try {
          const snapshot = await fetchSupportInboxSnapshot();
          if (snapshot.signature !== lastSignature) {
            lastSignature = snapshot.signature;
            sendEvent({ messages: snapshot.messages });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to stream support inbox";
          sendError(message);
        }
      };

      // First snapshot immediately.
      void tick();

      // Lightweight server-side watch loop; pushes only on changes.
      interval = setInterval(() => {
        void tick();
      }, 2000);

      const closeStream = () => {
        if (closed) return;
        closed = true;
        if (interval) clearInterval(interval);
        controller.close();
      };

      request.signal.addEventListener("abort", closeStream);
    },
    cancel() {
      if (interval) clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
