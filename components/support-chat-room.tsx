"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SupportChatRoomProps = {
  initialMessage: string;
};

type ChatMessage = {
  id: number;
  sender: "support" | "user";
  text: string;
  time: string;
  status?: "sending" | "sent";
};

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildSupportReply(input: string) {
  const lower = input.toLowerCase();

  if (lower.includes("deposit")) {
    return "For deposit, share coin + amount + network. We will send the exact wallet and confirmation steps.";
  }
  if (lower.includes("transfer")) {
    return "For transfer, share recipient details and amount. We will verify limits and guide secure completion.";
  }
  if (lower.includes("buy") || lower.includes("usdt") || lower.includes("btc") || lower.includes("eth")) {
    return "For buy flow, share the coin, amount, and payment method. We will match you with the fastest available offer.";
  }

  return "Thanks. Please also share coin, amount, and preferred payment method so support can process your request quickly.";
}

export function SupportChatRoom({ initialMessage }: SupportChatRoomProps) {
  const storageKey = "support-chat-room-v1";
  const initialSeed: ChatMessage[] = useMemo(() => [
    {
      id: 1,
      sender: "support",
      text: "Welcome to CoinCash support. Tell us the coin, amount, and payment method so we can guide you quickly.",
      time: timeNow(),
      status: "sent",
    },
    {
      id: 2,
      sender: "support",
      text: initialMessage,
      time: timeNow(),
      status: "sent",
    },
  ], [initialMessage]);

  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialSeed);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = draft.trim().length > 0;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      // Ignore bad local cache and keep default seed.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-80)));
    } catch {
      // Ignore persistence write failures.
    }
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAgentTyping]);

  useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const now = Date.now();
    const userMsg: ChatMessage = {
      id: now,
      sender: "user",
      text,
      time: timeNow(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft("");

    // Resolve optimistic "sending" state quickly for snappy UX.
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === now ? { ...m, status: "sent" } : m)));
    }, 120);

    // Agent typing + fast reply to mimic live support flow.
    setTimeout(() => {
      setIsAgentTyping(true);
    }, 180);

    setTimeout(() => {
      setIsAgentTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: now + 1,
          sender: "support",
          text: buildSupportReply(text),
          time: timeNow(),
          status: "sent",
        },
      ]);
    }, 650);
  };

  return (
    <section className="rounded-lg border border-outline-variant/15 bg-surface-container-low p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/15 pb-3">
        <div>
          <h2 className="font-headline text-sm uppercase tracking-widest font-bold text-on-surface-variant">Live Support Chat</h2>
          <p className="text-xs text-primary mt-1">Agent online</p>
        </div>
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          support_agent
        </span>
      </div>

      <div className="mt-3 max-h-[420px] overflow-y-auto rounded-lg border border-outline-variant/10 bg-surface-container-lowest/70 p-3">
        <div className="mb-3 flex justify-center">
          <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-[10px] uppercase tracking-widest text-on-surface-variant">
            Today
          </span>
        </div>

        <div className="space-y-2">
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
        {isAgentTyping && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-xs text-on-surface-variant">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
              <span>Support typing...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
        </div>
      </div>

      <form
        className="mt-3 flex items-end gap-2"
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
