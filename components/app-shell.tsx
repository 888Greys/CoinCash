import { AppNav } from "@/components/app-nav";
import { AppBottomNav } from "@/components/app-bottom-nav";

type AppShellProps = {
  children: React.ReactNode;
  currentPath?: string;
};

/**
 * Shared layout shell for natively migrated authenticated pages.
 * Provides the top AppNav and bottom mobile nav.
 */
export function AppShell({ children, currentPath }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-background">
      <AppNav currentPath={currentPath} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
        {children}
      </main>
      <AppBottomNav currentPath={currentPath} />
    </div>
  );
}
