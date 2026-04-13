import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function NotFound() {
  return (
    <AppShell currentPath="">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
          <div className="terminal-grid w-full h-full" />
        </div>

        <div className="relative z-10 space-y-6 max-w-md mx-auto">
          <div className="text-[120px] leading-none font-black font-headline text-surface-container-highest tracking-tighter">
            4<span className="text-primary">0</span>4
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-bold font-headline uppercase tracking-widest text-on-surface">
              Endpoint Not Found
            </h1>
            <p className="text-sm text-on-surface-variant font-body">
              The requested routing destination does not exist or has been deprecated. Please verify your address.
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-label text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-sm hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              Return to Dashboard
            </Link>
          </div>

          <div className="pt-12 flex items-center justify-center gap-2 text-[10px] text-on-surface-variant uppercase font-mono tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
            <span>Connection Reset</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
