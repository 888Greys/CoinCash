import Link from "next/link";

import { appNavRoutes } from "@/lib/wired-routes";

type AppNavProps = {
  currentPath?: string;
};

export function AppNav({ currentPath }: AppNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/15 bg-[#0b0e11] w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        <Link
          className="font-headline text-xl font-bold tracking-tight text-on-surface"
          href="/"
        >
          Coin<span className="text-primary">Cash</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {appNavRoutes.map((route) => {
            const isActive = currentPath === route.href;

            return (
              <Link
                key={route.href}
                className={`font-label text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
                href={route.href}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <nav className="border-t border-outline-variant/10 md:hidden">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
          {appNavRoutes.map((route) => {
            const isActive = currentPath === route.href;

            return (
              <Link
                key={route.href}
                className={`whitespace-nowrap rounded-full border px-3 py-2 font-label text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-outline-variant/15 bg-surface-container-low text-on-surface-variant"
                }`}
                href={route.href}
              >
                {route.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
