"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownTimerProps = {
  createdAt: string;
  windowMinutes?: number;
};

function getRemainingMs(createdAt: string, windowMinutes: number) {
  const created = new Date(createdAt).getTime();
  const expiry = created + windowMinutes * 60_000;
  return Math.max(0, expiry - Date.now());
}

export function CountdownTimer({ createdAt, windowMinutes = 15 }: CountdownTimerProps) {
  const [remainingMs, setRemainingMs] = useState(() => getRemainingMs(createdAt, windowMinutes));

  useEffect(() => {
    setRemainingMs(getRemainingMs(createdAt, windowMinutes));

    const timer = window.setInterval(() => {
      setRemainingMs(getRemainingMs(createdAt, windowMinutes));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [createdAt, windowMinutes]);

  const display = useMemo(() => {
    const minutes = Math.floor(remainingMs / 60_000);
    const seconds = Math.floor((remainingMs % 60_000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [remainingMs]);

  return <>{display}</>;
}
