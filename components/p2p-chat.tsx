"use client";

import { useEffect, useState, useRef } from "react";
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

export function P2PChat({ tradeId, currentUserId }: P2PChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("trade_id", tradeId)
        .order("created_at", { ascending: true });
      
      if (data) {
        setMessages(data as Message[]);
      }
    };
    fetchMessages();

    // 2. Subscribe to real-time updates
    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tradeId, supabase]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      // Could add toast notification here
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
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-body min-h-[300px]">
        {messages.map((msg) => {
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
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-surface-container-low border-t border-outline-variant/10 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-surface border border-outline-variant/20 rounded-lg px-4 py-2 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button 
          type="submit"
          className="bg-primary text-on-primary w-10 h-10 rounded-lg flex items-center justify-center transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
}
