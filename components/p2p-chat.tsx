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
}

const PAGE_SIZE = 20;

export function P2PChat({ tradeId, currentUserId }: P2PChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

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

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest border border-outline-variant/15 rounded-xl overflow-hidden">
      <div className="bg-surface-container-low p-4 border-b border-outline-variant/10">
        <h3 className="font-headline font-bold text-sm tracking-wide text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">chat</span>
          Trade Chat
        </h3>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 font-body min-h-[300px]"
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
                  className="bg-surface-container-highest hover:bg-surface-container text-primary px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
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
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      isMe 
                        ? 'bg-primary text-on-primary rounded-tr-sm' 
                        : 'bg-surface-container-high text-on-surface rounded-tl-sm'
                    }`}>
                      {msg.content}
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

      <form onSubmit={handleSendMessage} className="p-3 bg-surface-container-low border-t border-outline-variant/10 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-surface border border-outline-variant/20 rounded-lg px-4 py-2 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className="bg-primary text-on-primary w-10 h-10 rounded-lg flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
}
