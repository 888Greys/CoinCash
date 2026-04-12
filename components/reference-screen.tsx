"use client";

import { useRef, useCallback } from "react";
import { AppNav } from "@/components/app-nav";

type ReferenceScreenProps = {
  title: string;
  referenceFile: string;
  currentPath?: string;
};

/**
 * CSS injected into each reference iframe to hide its own fixed header
 * and mobile bottom nav, so only the app-shell AppNav is visible.
 */
const IFRAME_OVERRIDE_CSS = `
  /* Hide the reference page's own fixed header */
  body > header,
  body > header:first-of-type {
    display: none !important;
  }

  /* Hide the reference page's fixed mobile bottom nav */
  body > nav {
    display: none !important;
  }

  /* Shift main content up since the reference header is gone.
     Most reference pages use pt-20 (5rem) to clear their own header,
     so we reset that to a small amount. */
  body > main {
    padding-top: 1rem !important;
  }

  /* Also hide the floating FAB that some reference pages include */
  body > div[class*="fixed bottom"] {
    display: none !important;
  }
`;

export function ReferenceScreen({ title, referenceFile, currentPath }: ReferenceScreenProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      const style = doc.createElement("style");
      style.textContent = IFRAME_OVERRIDE_CSS;
      doc.head.appendChild(style);
    } catch {
      // Cross-origin access will throw — silently ignore.
    }
  }, []);

  return (
    <main className="flex flex-col h-[100dvh] w-full overflow-hidden bg-background">
      <AppNav currentPath={currentPath} />
      <div className="flex-1 w-full bg-background relative min-h-0">
        <iframe
          ref={iframeRef}
          aria-label={title}
          className="absolute inset-0 w-full h-full border-0"
          onLoad={handleIframeLoad}
          src={`/reference-designs/${referenceFile}`}
          title={title}
        />
      </div>
    </main>
  );
}
