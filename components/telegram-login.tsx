"use client";

import { useEffect, useRef } from "react";

interface TelegramLoginProps {
  botName: string;
  onAuth: (user: any) => void;
}

export function TelegramLogin({ botName, onAuth }: TelegramLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent reloading the script if already appended
    if (containerRef.current && containerRef.current.children.length > 0) return;

    // We expose a global function for the Telegram callback
    (window as any).onTelegramAuth = (user: any) => {
      onAuth(user);
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write"); // Optional, if you want to send messages
    script.async = true;

    containerRef.current?.appendChild(script);
  }, [botName, onAuth]);

  return <div ref={containerRef} className="flex justify-center" />;
}
