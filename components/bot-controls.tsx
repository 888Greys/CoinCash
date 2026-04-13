"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateBotStatus } from "@/app/actions/bots";
import type { TradingBot } from "@/app/actions/bots";

function formatRuntime(runtimeStart: string | null): string {
  if (!runtimeStart) return "—";
  const diff = Date.now() - new Date(runtimeStart).getTime();
  const totalSeconds = Math.floor(diff / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${String(d).padStart(2, "0")}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

const PAIR_LOGOS: Record<string, string> = {
  BTC:  "/icons/btc.svg",
  ETH:  "/icons/eth.svg",
  SOL:  "/icons/sol.svg",
  BNB:  "/icons/bnb.svg",
  AVAX: "/icons/avax.svg",
  USDT: "/icons/usdt.svg",
};

function getPairLogo(pair: string): string | null {
  const base = pair.split("/")[0]?.toUpperCase();
  return PAIR_LOGOS[base] ?? null;
}

export function BotCard({ bot }: { bot: TradingBot }) {
  const [isPending, startTransition] = useTransition();
  const isRunning = bot.status === "running";
  const isPositive = bot.total_profit >= 0;

  function toggleStatus() {
    startTransition(async () => {
      await updateBotStatus(bot.id, isRunning ? "paused" : "running");
    });
  }

  const logo = getPairLogo(bot.pair);

  return (
    <div className="bg-surface-container-low hover:bg-surface-container-high p-4 flex items-center justify-between group transition-colors">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
            {logo ? (
              <Image src={logo} alt={bot.pair} width={28} height={28} unoptimized />
            ) : (
              <span className={`material-symbols-outlined text-lg ${isRunning ? "text-primary" : "text-on-surface-variant"}`}>
                smart_toy
              </span>
            )}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${isRunning ? "bg-primary shadow-[0_0_6px_rgba(92,253,128,0.6)]" : "bg-on-surface-variant/40"} rounded-full border-2 border-surface-container-low`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-bold text-sm">{bot.name}</h5>
            <span className={`${isRunning ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"} text-[8px] font-black px-1.5 py-0.5 rounded uppercase`}>
              {bot.status}
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant font-medium">
            Pair: <span className="text-on-surface">{bot.pair}</span>{" · "}
            Profit:{" "}
            <span className={isPositive ? "text-primary" : "text-error"}>
              {isPositive ? "+" : ""}${bot.total_profit.toFixed(2)} ({isPositive ? "+" : ""}{bot.profit_percentage.toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:block text-right">
          <p className="text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant">Runtime</p>
          <p className="text-xs font-headline font-bold">{formatRuntime(bot.runtime_start)}</p>
        </div>
        <button
          onClick={toggleStatus}
          disabled={isPending}
          className="bg-surface-container-highest px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-primary active:scale-95 transition-all disabled:opacity-40"
        >
          {isPending ? "..." : isRunning ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}

export function CreateBotButton({ type, pair = "BTC/USDT" }: { type: string; pair?: string }) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedPair, setSelectedPair] = useState(pair);

  const PAIRS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "AVAX/USDT"];

  function handleCreate() {
    const fd = new FormData();
    fd.append("type", type);
    fd.append("pair", selectedPair);
    startTransition(async () => {
      const { createTradingBot } = await import("@/app/actions/bots");
      await createTradingBot(fd);
      setShowForm(false);
    });
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-surface-container-highest text-primary border border-primary/20 py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-primary hover:text-on-primary-container transition-all active:scale-95"
      >
        Create Bot
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={selectedPair}
        onChange={(e) => setSelectedPair(e.target.value)}
        className="w-full bg-surface-container-highest border border-outline-variant/20 text-on-surface text-sm px-3 py-2 rounded-sm outline-none"
      >
        {PAIRS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          disabled={isPending}
          className="flex-1 bg-primary text-on-primary py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all disabled:opacity-40"
        >
          {isPending ? "Deploying..." : "Deploy"}
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="px-3 py-2 bg-surface-container-highest text-on-surface-variant text-[11px] font-bold uppercase rounded-sm hover:text-on-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
