"use client";

import { useEffect, useCallback } from "react";

interface TelegramLoginProps {
  botName: string;
  onAuth: (user: any) => void;
}

export function TelegramLogin({ botName, onAuth }: TelegramLoginProps) {
  // Load the Telegram widget script (just for the auth API, not the iframe)
  useEffect(() => {
    if (document.getElementById("telegram-widget-script")) return;

    const script = document.createElement("script");
    script.id = "telegram-widget-script";
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handleClick = useCallback(() => {
    const win = window as any;
    if (win.Telegram?.Login?.auth) {
      win.Telegram.Login.auth(
        { bot_id: botName, request_access: "write" },
        (user: any) => {
          if (user) {
            onAuth(user);
          }
        }
      );
    } else {
      // Fallback: open telegram auth manually
      window.open(
        `https://oauth.telegram.org/auth?bot_id=${botName}&origin=${encodeURIComponent(window.location.origin)}&request_access=write`,
        "telegram_auth",
        "width=550,height=450"
      );
    }
  }, [botName, onAuth]);

  return (
    <button
      onClick={handleClick}
      className="group flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-surface-container-high px-4 transition-all hover:-translate-y-0.5 hover:bg-surface-bright"
      type="button"
    >
      <span className="text-sm text-[#229ED9]">T</span>
      <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface transition-colors group-hover:text-primary">
        Telegram
      </span>
    </button>
  );
}
