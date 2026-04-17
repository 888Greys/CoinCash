"use client";

import { useEffect, useMemo, useState } from "react";

type SimpleCountdownProps = {
  initialMinutes: number;
  initialSeconds?: number;
  suffix?: string;
  restartOnZero?: boolean;
};

export function SimpleCountdown({
  initialMinutes,
  initialSeconds = 0,
  suffix,
  restartOnZero = false,
}: SimpleCountdownProps) {
  const initialTotalSeconds = Math.max(0, initialMinutes * 60 + initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds);

  useEffect(() => {
    setTotalSeconds(initialTotalSeconds);

    const timer = window.setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev > 0) return prev - 1;
        return restartOnZero ? initialTotalSeconds : 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [initialTotalSeconds, restartOnZero]);

  const display = useMemo(() => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const base = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return suffix ? `${base} ${suffix}` : base;
  }, [suffix, totalSeconds]);

  return <>{display}</>;
}
