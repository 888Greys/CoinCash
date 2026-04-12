import { AppShell } from "@/components/app-shell";

type LogItem = {
  tag: string;
  tagColor: string;
  tagBg: string;
  dotColor: string;
  dotGlow?: string;
  title: string;
  description: string;
  time: string;
};

const logs: LogItem[] = [
  {
    tag: "EXEC",
    tagColor: "text-primary",
    tagBg: "bg-primary/10",
    dotColor: "bg-primary",
    dotGlow: "shadow-[0_0_8px_rgba(92,253,128,0.4)]",
    title: "BUY_ORDER_FILLED: BTC/USDT",
    description: "Limit order #88492-X filled at $64,210.44. Volume: 1.205 BTC. Fee: 0.00012 BTC.",
    time: "12:45:02",
  },
  {
    tag: "WARN",
    tagColor: "text-error",
    tagBg: "bg-error/10",
    dotColor: "bg-error",
    dotGlow: "shadow-[0_0_8px_rgba(255,115,81,0.4)]",
    title: "LATENCY_ANOMALY",
    description: "Increased latency in AP-Northeast. Failover to Frankfurt-02 recommended for HFT.",
    time: "11:30:15",
  },
  {
    tag: "AUTH",
    tagColor: "text-tertiary",
    tagBg: "bg-tertiary/10",
    dotColor: "bg-tertiary",
    dotGlow: "shadow-[0_0_8px_rgba(0,227,254,0.4)]",
    title: "NEW_LOGIN_DETECTED",
    description: "Access via API Key [MK-82] from IP 192.168.1.104. HW wallet signing enabled.",
    time: "09:12:44",
  },
  {
    tag: "PEND",
    tagColor: "text-on-surface-variant",
    tagBg: "bg-on-surface-variant/10",
    dotColor: "bg-on-surface-variant/40",
    title: "PARTIAL_FILL: ETH/USDT",
    description: "Limit order #99211-P partially filled (45.2%). 12.5 ETH remaining in book.",
    time: "08:05:11",
  },
  {
    tag: "CORE",
    tagColor: "text-primary",
    tagBg: "bg-primary/10",
    dotColor: "bg-primary",
    title: "FIRMWARE_V2.0.4",
    description: "Kinetic Monolith architecture upgraded. +14% execution speed for atomic swaps.",
    time: "YESTERDAY",
  },
];

export default function NotificationsPage() {
  return (
    <AppShell currentPath="/notifications">
      <div className="px-4 pt-6 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight uppercase leading-none mb-1">
              System Logs
            </h1>
            <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-[0.1em] font-medium">
              Real-time terminal protocol monitor
            </p>
          </div>
          <button className="font-label text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-sm">
            <span className="material-symbols-outlined text-sm">done_all</span>
            Mark as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1 no-scrollbar border-b border-outline-variant/10">
          <button className="text-primary border-b-2 border-primary px-4 py-2 font-label text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
            All Logs
          </button>
          <button className="text-on-surface-variant hover:text-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors">
            Trades
          </button>
          <button className="text-on-surface-variant hover:text-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors">
            Security
          </button>
          <button className="text-on-surface-variant hover:text-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors">
            API
          </button>
        </div>

        {/* Log Feed */}
        <div className="space-y-[1px] bg-outline-variant/10 rounded-sm overflow-hidden border border-outline-variant/10">
          {logs.map((log) => (
            <div
              key={log.title}
              className="group relative flex items-start gap-3 p-3 bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${log.dotColor} block mt-2 ${log.dotGlow ?? ""}`} />
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

        {/* Terminal Status Footer */}
        <div className="mt-8 mb-8 p-3 bg-surface-container-lowest border border-outline-variant/10 rounded-sm flex items-center justify-between font-body text-[9px] uppercase tracking-wider text-on-surface-variant">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span>SYSTEM_STABLE</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 border-l border-outline-variant/10 pl-4">
              <span>PING: 14MS</span>
              <span>BUFFER: 0.002MS</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">NODE: FRA-MAIN-01</span>
            <span className="text-on-surface font-bold">LIVE</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
