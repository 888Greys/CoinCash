"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type SupportChatRoomProps = {
  initialMessage: string;
  userId: string;
};

type ChatMessage = {
  id: string;
  sender: "support" | "user";
  text: string;
  time: string;
  status?: "sending" | "sent";
};

type SupportMessageRow = {
  id: string;
  user_id: string;
  sender_id: string | null;
  sender_role: "user" | "support";
  content: string;
  created_at: string;
};

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function mapRowToChatMessage(row: SupportMessageRow, userId: string): ChatMessage {
  return {
    id: row.id,
    sender: row.sender_id === userId ? "user" : "support",
    text: row.content,
    time: new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: "sent",
  };
}

function removeFirstPendingUserMatch(messages: ChatMessage[], text: string): ChatMessage[] {
  const index = messages.findIndex(
    (item) => item.sender === "user" && item.status === "sending" && item.text === text
  );
  if (index === -1) return messages;
  return [...messages.slice(0, index), ...messages.slice(index + 1)];
}

export function SupportChatRoom({ initialMessage, userId }: SupportChatRoomProps) {
  const supabase = useMemo(() => createClient(), []);
  const initialSeed: ChatMessage[] = useMemo(() => [
    {
      id: "seed-welcome",
      sender: "support",
      text: "Welcome to CoinCash support. Tell us the coin, amount, and payment method so we can guide you quickly.",
      time: timeNow(),
      status: "sent",
    },
    {
      id: "seed-intent",
      sender: "support",
      text: initialMessage,
      time: timeNow(),
      status: "sent",
    },
  ], [initialMessage]);

  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = draft.trim().length > 0;

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("support_messages")
        .select("id, user_id, sender_id, sender_role, content, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(200);

      if (!isCancelled) {
        if (error) {
          console.error("Failed to load support messages:", error);
          setMessages([]);
        } else {
          const rows = (data ?? []) as SupportMessageRow[];
          setMessages(rows.map((row) => mapRowToChatMessage(row, userId)));
        }
        setIsLoading(false);
      }
    };

    loadMessages();

    const channel = supabase
      .channel(`support_room_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const incoming = payload.new as SupportMessageRow;
          setMessages((prev) => {
            let next = prev;

            if (incoming.sender_id === userId) {
              next = removeFirstPendingUserMatch(next, incoming.content);
            }

            if (next.some((item) => item.id === incoming.id)) {
              return next;
            }

            return [...next, mapRowToChatMessage(incoming, userId)];
          });
        }
      )
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;

    const optimisticId = `pending-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: optimisticId,
      sender: "user",
      text,
      time: timeNow(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft("");

    const { error } = await supabase.from("support_messages").insert({
      user_id: userId,
      sender_id: userId,
      sender_role: "user",
      content: text,
    });

    if (error) {
      console.error("Failed to send support message:", error);
      setMessages((prev) => prev.filter((item) => item.id !== optimisticId));
      setDraft(text);
      return;
    }

    // Keep optimistic bubble visible until realtime insert confirms and replaces it.
  };

  return (
    <section className="flex h-[calc(100dvh-210px)] min-h-[520px] flex-col rounded-lg border border-outline-variant/15 bg-surface-container-low p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/15 pb-3">
        <div>
          <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">Live Support Chat</h2>
          <p className="text-xs text-primary mt-1">Agent online</p>
        </div>
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          support_agent
        </span>
      </div>

      <div className="no-scrollbar mt-3 flex-1 overflow-y-auto rounded-lg border border-outline-variant/10 bg-surface-container-lowest/70 p-3">
        <div className="mb-3 flex justify-center">
          <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-[10px] uppercase tracking-widest text-on-surface-variant">
            Today
          </span>
        </div>

        <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="material-symbols-outlined animate-spin text-primary opacity-60">sync</span>
          </div>
        ) : (
          <>
        {messages.length === 0 && (
          initialSeed.map((msg) => (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[86%] rounded-2xl rounded-bl-sm border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm shadow-sm text-on-surface">
                <p className="leading-relaxed">{msg.text}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] justify-start text-on-surface-variant">
                  <span>{msg.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[86%] px-3 py-2 text-sm shadow-sm ${
                  isUser
                    ? "rounded-2xl rounded-br-sm border border-primary/25 bg-[#204f3c] text-[#ecfff2]"
                    : "rounded-2xl rounded-bl-sm border border-outline-variant/20 bg-surface-container-high text-on-surface"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <div className={`mt-1 flex items-center gap-1 text-[10px] ${isUser ? "justify-end text-[#d2f4dd]" : "justify-start text-on-surface-variant"}`}>
                  <span>{msg.time}</span>
                  {isUser && (
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {msg.status === "sending" ? "schedule" : "done_all"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </>
        )}
        <div ref={endRef} />
        </div>
      </div>

      <form
        className="mt-2 flex items-end gap-2 border-t border-outline-variant/15 pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <textarea
          ref={textAreaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message to support..."
          rows={1}
          className="max-h-[120px] min-h-[44px] w-full resize-none rounded-2xl border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary/60"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-transform active:scale-95 disabled:opacity-50"
          aria-label="Send message"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </button>
      </form>
    </section>
  );
}
