import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { isAdminEmail } from "@/lib/admin";

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

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const adminDb = buildAdminDb();

  const { data: rows, error } = await adminDb
    .from("support_messages")
    .select("id, user_id, sender_id, sender_role, content, created_at")
    .order("created_at", { ascending: true })
    .limit(600);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

  return NextResponse.json({ messages: normalized }, { status: 200 });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { userId?: string; content?: string }
    | null;

  const targetUserId = (payload?.userId ?? "").trim();
  const content = (payload?.content ?? "").trim();

  if (!targetUserId || !content) {
    return NextResponse.json({ error: "Missing userId or content" }, { status: 400 });
  }

  const adminDb = buildAdminDb();

  const { error } = await adminDb.from("support_messages").insert({
    user_id: targetUserId,
    sender_id: user.id,
    sender_role: "support",
    content,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
