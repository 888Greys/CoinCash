"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface P2PChatProps {
  tradeId: string;
  currentUserId: string;
  variant?: "default" | "mobile-immersive";
}

const PAGE_SIZE = 20;

export function P2PChat({ tradeId, currentUserId, variant = "default" }: P2PChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const isMobileImmersive = variant === "mobile-immersive";

  const fetchMessages = useCallback(async (from: number, to: number) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("trade_id", tradeId)
      .order("created_at", { ascending: false }) // Fetch newest first
      .range(from, to);
    
    if (error) {
      console.error("Failed to fetch messages:", error);
      return [];
    }
    
    // We get them newest first, but we need to display them oldest first (top to bottom)
    return (data as Message[]).reverse();
  }, [supabase, tradeId]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const initChat = async () => {
      setIsLoading(true);
      const initialMessages = await fetchMessages(0, PAGE_SIZE - 1);
      
      if (initialMessages.length < PAGE_SIZE) {
        setHasMore(false);
      }
      
      setMessages(initialMessages);
      setIsLoading(false);

      // Subscribe to real-time updates after initial fetch
      channel = supabase
        .channel(`trade_${tradeId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `trade_id=eq.${tradeId}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();
    };

    initChat();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [tradeId, fetchMessages, supabase]);

  // Scroll to bottom on new message if we were already at the bottom
  // or on initial load
  useEffect(() => {
    if (isInitialMount.current && !isLoading && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialMount.current = false;
    } else if (!isInitialMount.current && !isLoadingMore) {
      // Only smooth scroll if it's a new message (not loading old ones)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isLoadingMore]);

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    // Save current scroll height to maintain position after prepending
    const container = chatContainerRef.current;
    const previousScrollHeight = container?.scrollHeight || 0;

    const from = messages.length;
    const to = from + PAGE_SIZE - 1;
    
    const olderMessages = await fetchMessages(from, to);
    
    if (olderMessages.length < PAGE_SIZE) {
      setHasMore(false);
    }
    
    setMessages((prev) => [...olderMessages, ...prev]);
    setIsLoadingMore(false);

    // Restore scroll position
    setTimeout(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - previousScrollHeight;
      }
    }, 0);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage(""); // Optimistic clear

    const { error } = await supabase.from("messages").insert({
      trade_id: tradeId,
      sender_id: currentUserId,
      content,
    });

    if (error) {
      console.error("Failed to send message:", error);
    }
  };

  const parseProofUrl = (content: string) => {
    if (!content.startsWith("Payment proof uploaded: ")) return null;
    const url = content.replace("Payment proof uploaded: ", "").trim();
    return url.startsWith("http") ? url : null;
  };

  return (
    <div className={isMobileImmersive ? "flex min-h-0 flex-col" : "flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest"}>
      {!isMobileImmersive && (
        <div className="border-b border-outline-variant/10 bg-surface-container-low p-4">
          <h3 className="flex items-center gap-2 font-headline text-sm font-bold tracking-wide text-on-surface">
            <span className="material-symbols-outlined text-lg text-primary">chat</span>
            Trade Chat
          </h3>
        </div>
      )}
      
      <div 
        ref={chatContainerRef}
        className={isMobileImmersive
          ? "min-h-[42vh] flex-1 space-y-5 overflow-y-auto px-1 pb-32 pt-3 font-body"
          : "min-h-[300px] flex-1 space-y-4 overflow-y-auto p-4 font-body"
        }
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-primary opacity-50">sync</span>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="flex justify-center mb-4">
                <button 
                  onClick={loadMoreMessages}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 rounded-full bg-surface-container-highest px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:bg-surface-container disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                      Loading...
                    </>
                  ) : "Load Previous Messages"}
                </button>
              </div>
            )}
            
            {messages.length === 0 && !hasMore ? (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50 space-y-2">
                <span className="material-symbols-outlined text-3xl">question_answer</span>
                <p className="text-xs uppercase tracking-widest">No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                const proofUrl = parseProofUrl(msg.content);
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 text-sm shadow-sm ${
                      isMobileImmersive
                        ? isMe
                          ? "rounded-xl rounded-tr-none bg-primary-container text-on-primary-container"
                          : "rounded-xl rounded-tl-none border-l-2 border-primary/30 bg-surface-container-high text-on-surface"
                        : isMe
                          ? "rounded-2xl rounded-tr-sm bg-primary text-on-primary"
                          : "rounded-2xl rounded-tl-sm bg-surface-container-high text-on-surface"
                    }`}>
                      {proofUrl ? (
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wider">Payment Proof</p>
                          <a href={proofUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-outline-variant/25">
                            <img src={proofUrl} alt="Payment proof" className="max-h-48 w-full object-cover" />
                          </a>
                          <a
                            href={proofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] underline"
                          >
                            View full proof
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </a>
                        </div>
                      ) : (
                        msg.content
                      )}
                      <div className={`text-[9px] mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className={isMobileImmersive
          ? "fixed bottom-[72px] left-0 z-[65] w-full border-t border-outline-variant/15 bg-surface-dim px-4 pb-3 pt-3"
          : "flex gap-2 border-t border-outline-variant/10 bg-surface-container-low p-3"
        }
      >
        <div className={isMobileImmersive ? "mx-auto flex w-full max-w-3xl items-center gap-3" : "contents"}>
          {isMobileImmersive && (
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-bright"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          )}

          <div className={isMobileImmersive ? "relative flex-1" : "flex-1"}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className={isMobileImmersive
                ? "h-10 w-full rounded-lg border-none bg-surface-container-lowest px-4 pr-12 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary"
                : "w-full rounded-lg border border-outline-variant/20 bg-surface px-4 py-2 text-sm font-body text-on-surface transition-colors focus:border-primary/50 focus:outline-none"
              }
              disabled={isLoading}
            />

            {isMobileImmersive ? (
              <button
                type="submit"
                disabled={isLoading || !newMessage.trim()}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-primary disabled:opacity-40"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !newMessage.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
