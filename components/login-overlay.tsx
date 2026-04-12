"use client";

import { useFormStatus } from "react-dom";

export function LoginOverlay() {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-surface/95 backdrop-blur-xl text-on-surface">
      <div className="terminal-grid absolute inset-0 opacity-50" />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-center auth-fade-up">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            Coin<span className="text-primary">Cash</span>
          </h1>
          <div className="splash-bar-track mx-auto mt-3 h-1 w-12 overflow-hidden rounded-full">
            <div className="splash-bar-fill kinetic-gradient h-full w-full rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-8 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary animate-pulse auth-fade-up-delay-1">
          Establishing secure session...
        </p>
      </div>
    </div>
  );
}
