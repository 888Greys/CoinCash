"use client";

import { useFormStatus } from "react-dom";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export function LoginOverlay() {
  const { pending } = useFormStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!pending || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-surface text-on-surface">
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-center auth-fade-up">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            Coin<span className="text-primary">Cash</span>
          </h1>
          <div className="splash-bar-track mx-auto mt-3 h-1 w-12 overflow-hidden rounded-full">
            <div className="splash-bar-fill kinetic-gradient h-full w-full rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
