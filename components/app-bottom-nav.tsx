"use client";

import Link from "next/link";

type BottomNavItem = {
  href: string;
  label: string;
  icon: string;
};

const bottomNavItems: BottomNavItem[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/markets", label: "Markets", icon: "equalizer" },
  { href: "/support", label: "Chat", icon: "chat" },
  { href: "/bot", label: "Bot", icon: "smart_toy" },
  { href: "/assets", label: "Assets", icon: "account_balance_wallet" },
  { href: "/p2p", label: "P2P", icon: "swap_horizontal_circle" },
];

type AppBottomNavProps = {
  currentPath?: string;
};

export function AppBottomNav({ currentPath }: AppBottomNavProps) {
  return (
    <nav className="mobile-nav-enter fixed bottom-0 left-0 w-full md:hidden z-50 bg-background/95 backdrop-blur-xl border-t border-outline-variant/15 shadow-[0_-4px_24px_rgba(0,0,0,0.6)] flex justify-around items-end px-1 pt-2 pb-safe pb-3">
      {bottomNavItems.map((item) => {
        const isActive =
          currentPath === item.href ||
          (item.href !== "/home" && currentPath?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 relative group"
            href={item.href}
          >
            {/* Active pill indicator */}
            {isActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
            )}
            <span
              className={`material-symbols-outlined text-[22px] transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant group-hover:text-on-surface"
              }`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span
              className={`font-label text-[9px] font-bold uppercase tracking-[0.06em] transition-colors duration-200 ${
                isActive ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
