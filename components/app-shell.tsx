"use client";

import { motion } from "framer-motion";
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
      <motion.main 
        className="flex-1 overflow-y-auto pb-20 md:pb-8"
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        initial={{ opacity: 0, y: 15, filter: "blur(8px)", scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
      <AppBottomNav currentPath={currentPath} />
    </div>
  );
}
