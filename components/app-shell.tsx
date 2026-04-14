"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AppNav } from "@/components/app-nav";
import { AppBottomNav } from "@/components/app-bottom-nav";

type UserInfo = {
  email?: string;
  username?: string | null;
  avatar_url?: string | null;
};

type AppShellProps = {
  children: React.ReactNode;
  currentPath?: string;
  user?: UserInfo | null;
};

/**
 * Shared layout shell for natively migrated authenticated pages.
 * Provides the top AppNav and bottom mobile nav.
 */
export function AppShell({ children, currentPath, user }: AppShellProps) {
  const showFloatingChat = currentPath !== "/support";

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-background">
      <AppNav currentPath={currentPath} user={user} />
      <motion.main 
        className="flex-1 overflow-y-auto pb-20 md:pb-8"
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)", scale: 0.99 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
      {showFloatingChat && (
        <Link
          href="/support"
          aria-label="Open customer support chat"
          className="group fixed right-4 bottom-[92px] md:bottom-6 z-50 h-16 w-16 rounded-full border border-primary/45 bg-surface-container-high p-1 shadow-[0_0_32px_rgba(92,253,128,0.25)] active:scale-95 transition-transform"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full border border-primary/40 opacity-40 animate-ping" />
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            <Image
              src="/icons/support-avatar.webp"
              alt="Support agent"
              fill
              sizes="64px"
              priority
              className="object-cover"
            />
          </span>
          <span className="absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
        </Link>
      )}
      <AppBottomNav currentPath={currentPath} />
    </div>
  );
}
