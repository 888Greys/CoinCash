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
  { href: "/bot", label: "Bot", icon: "smart_toy" },
  { href: "/assets", label: "Assets", icon: "account_balance_wallet" },
  { href: "/p2p", label: "P2P", icon: "swap_horizontal_circle" },
];

type AppBottomNavProps = {
  currentPath?: string;
};

export function AppBottomNav({ currentPath }: AppBottomNavProps) {
  return (
    <nav className="flex-shrink-0 md:hidden z-50 bg-[#0b0e11]/80 backdrop-blur-xl border-t border-outline-variant/15 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center px-2 py-3">
      {bottomNavItems.map((item) => {
        const isActive =
          currentPath === item.href ||
          (item.href !== "/home" && currentPath?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ease-in-out ${
              isActive
                ? "text-primary bg-surface-container-high rounded-sm"
                : "text-[#64748b] hover:text-secondary"
            }`}
            href={item.href}
          >
            <span className="material-symbols-outlined mb-1">{item.icon}</span>
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.05em]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
