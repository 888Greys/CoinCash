import Link from "next/link";
import { appNavRoutes } from "@/lib/wired-routes";

type UserInfo = {
  email?: string;
  username?: string | null;
  avatar_url?: string | null;
};

type AppNavProps = {
  currentPath?: string;
  user?: UserInfo | null;
};

export function AppNav({ currentPath, user }: AppNavProps) {
  const displayName = user?.username || user?.email?.split("@")[0] || null;
  const initial = displayName?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/15 bg-background w-full">
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
                className={`relative font-label text-[11px] font-bold uppercase tracking-[0.18em] transition-colors pb-1 ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
                href={route.href}
              >
                {route.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Badge */}
        {user && (
          <Link href="/settings" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="text-primary font-bold text-xs">{initial}</span>
            </div>
            <span className="hidden md:inline font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface transition-colors">
              {displayName}
            </span>
          </Link>
        )}
      </div>

      <nav className="border-t border-outline-variant/10 md:hidden">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-2.5">
          {appNavRoutes.map((route) => {
            const isActive = currentPath === route.href;

            return (
              <Link
                key={route.href}
                className={`whitespace-nowrap rounded-full border px-2.5 py-1.5 font-label text-[9px] font-bold uppercase tracking-[0.14em] transition-colors ${
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
