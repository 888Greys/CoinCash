"use client";

import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

const STORAGE_KEY = "coincash-theme";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(mode);
  window.localStorage.setItem(STORAGE_KEY, mode);
}

export function ThemeModeToggle() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      setMode(saved);
      applyTheme(saved);
      return;
    }

    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const next = prefersLight ? "light" : "dark";
    setMode(next);
    applyTheme(next);
  }, []);

  const onChange = (next: ThemeMode) => {
    setMode(next);
    applyTheme(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Theme</p>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
          {mode === "light" ? "White Mode" : "Dark Mode"}
        </p>
      </div>
      <div className="inline-flex rounded border border-outline-variant/20 bg-surface-container-high p-1">
        <button
          type="button"
          onClick={() => onChange("dark")}
          className={`inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            mode === "dark"
              ? "bg-surface-container-highest text-on-surface"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-sm">dark_mode</span>
          Dark
        </button>
        <button
          type="button"
          onClick={() => onChange("light")}
          className={`inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            mode === "light"
              ? "bg-surface-container-highest text-on-surface"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-sm">light_mode</span>
          White
        </button>
      </div>
    </div>
  );
}
