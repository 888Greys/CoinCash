"use client";

import { useState } from "react";

type NotificationItem = {
  tag: string;
  tagColor: string;
  tagBg: string;
  dotColor: string;
  dotGlow?: string;
  title: string;
  description: string;
  time: string;
};

type Tab = "all" | "trades" | "security";

const TAB_LABELS: { key: Tab; label: string }[] = [
  { key: "all", label: "All Activity" },
  { key: "trades", label: "Trades" },
  { key: "security", label: "Security" },
];

function matchesTab(item: NotificationItem, tab: Tab): boolean {
  if (tab === "all") return true;
  if (tab === "security") return item.tag === "AUTH";
  if (tab === "trades") return ["EXEC", "PAID", "PEND", "WARN", "CANC"].includes(item.tag);
  return true;
}

export function NotificationsFeed({
  notifications,
  totalEventCount,
}: {
  notifications: NotificationItem[];
  totalEventCount: number;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [allRead, setAllRead] = useState(false);

  const filtered = notifications.filter((n) => matchesTab(n, activeTab));

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
            <h1 className="font-headline text-3xl font-bold tracking-tight uppercase leading-none">
              Activity Center
            </h1>
          </div>
          <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-[0.1em] font-medium mt-1">
            Real-time activity logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
            {totalEventCount} event{totalEventCount !== 1 ? "s" : ""}
          </span>
          <button
            className="font-label text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-sm"
            onClick={() => setAllRead(true)}
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Mark as read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 no-scrollbar border-b border-outline-variant/10">
        {TAB_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 font-label text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeTab === key
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      {filtered.length === 0 ? (
        <div className="bg-surface-container-low p-12 text-center border border-outline-variant/10 rounded-sm">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block">notifications_off</span>
          <p className="text-sm text-on-surface-variant">
            {activeTab === "all"
              ? "No activity yet. Start trading to see updates here."
              : `No ${activeTab} events found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-[1px] bg-outline-variant/10 rounded-sm overflow-hidden border border-outline-variant/10">
          {filtered.map((log, i) => (
            <div
              key={`${log.title}-${i}`}
              className="group relative flex items-start gap-3 p-3 bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full block mt-2 transition-opacity duration-300 ${
                    allRead ? "opacity-30" : log.dotColor
                  } ${allRead ? "" : log.dotGlow ?? ""}`}
                  style={{ backgroundColor: allRead ? undefined : undefined }}
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-body text-[9px] font-bold uppercase ${log.tagColor} ${log.tagBg} px-1 rounded-[1px]`}>
                      {log.tag}
                    </span>
                    <span className="font-headline text-[13px] font-bold text-on-surface">
                      {log.title}
                    </span>
                  </div>
                  <span className="font-body text-[10px] text-on-surface-variant">{log.time}</span>
                </div>
                <p className="text-[12px] text-on-surface-variant leading-snug font-body">
                  {log.description}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <button className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
