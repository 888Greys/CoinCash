"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type SupportInboxMessage = {
  id: string;
  userId: string;
  senderId: string | null;
  senderRole: "user" | "support";
  content: string;
  createdAt: string;
  userUsername: string;
  userEmail: string;
  senderUsername: string;
  senderEmail: string;
};

type SupportThread = {
  userId: string;
  userLabel: string;
  userEmail: string;
  lastAt: string;
  messages: SupportInboxMessage[];
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString();
}

export function AdminSupportInbox() {
  const [messages, setMessages] = useState<SupportInboxMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyMessages = (nextMessages: SupportInboxMessage[]) => {
    setMessages(nextMessages);
    setSelectedUserId((previous) => {
      if (nextMessages.length === 0) {
        return "";
      }
      if (!previous) {
        return nextMessages[nextMessages.length - 1].userId;
      }
      if (nextMessages.some((item) => item.userId === previous)) {
        return previous;
      }
      return nextMessages[nextMessages.length - 1].userId;
    });
  };

  const loadInbox = useCallback(async () => {
    const response = await fetch("/api/admin/support-inbox", { cache: "no-store" });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error ?? "Failed to load support inbox");
    }

    const nextMessages = (payload?.messages ?? []) as SupportInboxMessage[];
    applyMessages(nextMessages);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      setLoading(true);
      setError(null);
      try {
        await loadInbox();
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load support inbox");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    const eventSource = new EventSource("/api/admin/support-inbox/stream");
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { messages?: SupportInboxMessage[] };
        if (Array.isArray(payload.messages)) {
          applyMessages(payload.messages);
          setLoading(false);
          setError(null);
        }
      } catch {
        // Ignore malformed event payloads and keep current view.
      }
    };

    eventSource.addEventListener("error", () => {
      setError("Live stream disconnected. Reconnecting...");
    });

    return () => {
      isMounted = false;
      eventSource.close();
    };
  }, [loadInbox]);

  const threads = useMemo<SupportThread[]>(() => {
    const map = new Map<string, SupportThread>();

    for (const item of messages) {
      const existing = map.get(item.userId);
      if (!existing) {
        map.set(item.userId, {
          userId: item.userId,
          userLabel: item.userUsername || "Unknown",
          userEmail: item.userEmail || "-",
          lastAt: item.createdAt,
          messages: [item],
        });
      } else {
        existing.messages.push(item);
        existing.lastAt = item.createdAt;
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
    );
  }, [messages]);

  const selectedThread = threads.find((thread) => thread.userId === selectedUserId) ?? null;

  const sendReply = async () => {
    const content = draft.trim();
    if (!selectedThread || !content) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/support-inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedThread.userId, content }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to send support reply");
      }

      setDraft("");
      await loadInbox();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send support reply");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border border-outline-variant/15 bg-surface-container-low p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-headline text-lg font-bold tracking-tight">Support Inbox</h2>
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Auto-refresh 4s</span>
      </div>

      {error && (
        <p className="mb-3 rounded border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <span className="material-symbols-outlined animate-spin text-primary opacity-60">sync</span>
        </div>
      ) : threads.length === 0 ? (
        <p className="py-6 text-sm text-on-surface-variant">No support conversations yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <aside className="max-h-[560px] overflow-y-auto rounded border border-outline-variant/10 bg-surface-container-high/40">
            {threads.map((thread) => {
              const isSelected = thread.userId === selectedUserId;
              return (
                <button
                  key={thread.userId}
                  type="button"
                  onClick={() => setSelectedUserId(thread.userId)}
                  className={`block w-full border-b border-outline-variant/10 px-3 py-3 text-left last:border-b-0 ${
                    isSelected ? "bg-primary/10" : "hover:bg-surface-container-high"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface">{thread.userLabel}</p>
                  <p className="mt-0.5 text-[11px] text-on-surface-variant">{thread.userEmail}</p>
                  <p className="mt-1 text-[10px] text-on-surface-variant">{formatTimestamp(thread.lastAt)}</p>
                </button>
              );
            })}
          </aside>

          <div className="rounded border border-outline-variant/10 bg-surface-container-high/30 p-3">
            {!selectedThread ? (
              <p className="py-8 text-sm text-on-surface-variant">Select a conversation.</p>
            ) : (
              <>
                <div className="mb-3 border-b border-outline-variant/15 pb-2">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Conversation</p>
                  <p className="text-sm font-semibold text-on-surface">{selectedThread.userLabel}</p>
                  <p className="text-xs text-on-surface-variant">{selectedThread.userEmail}</p>
                </div>

                <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                  {selectedThread.messages.map((item) => {
                    const isSupport = item.senderRole === "support";
                    return (
                      <div key={item.id} className={`flex ${isSupport ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
                            isSupport
                              ? "rounded-br-sm border border-primary/25 bg-[#204f3c] text-[#ecfff2]"
                              : "rounded-bl-sm border border-outline-variant/20 bg-surface-container-high text-on-surface"
                          }`}
                        >
                          <p className="leading-relaxed">{item.content}</p>
                          <p className={`mt-1 text-[10px] ${isSupport ? "text-[#d2f4dd]" : "text-on-surface-variant"}`}>
                            {item.senderRole === "support" ? "Support" : item.senderUsername} • {formatTimestamp(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  className="mt-3 flex gap-2 border-t border-outline-variant/15 pt-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendReply();
                  }}
                >
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Reply to this user..."
                    className="h-11 w-full rounded border border-outline-variant/25 bg-surface-container-low px-3 text-sm text-on-surface outline-none focus:border-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={saving || draft.trim().length === 0}
                    className="h-11 rounded bg-primary px-4 text-xs font-bold uppercase tracking-wider text-on-primary disabled:opacity-50"
                  >
                    {saving ? "Sending" : "Send"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
