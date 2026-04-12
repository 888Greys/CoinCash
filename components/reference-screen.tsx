"use client";

import { useRef, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import { AppBottomNav } from "@/components/app-bottom-nav";

type ReferenceScreenProps = {
  title: string;
  referenceFile: string;
  currentPath?: string;
  hideReferenceHeader?: boolean;
  hideReferenceBottomNav?: boolean;
  hideReferenceFab?: boolean;
};

const OVERRIDE_STYLE_ID = "app-shell-overrides";

/**
 * Build CSS overrides injected into each reference iframe.
 * By default we hide embedded chrome so the app shell controls navigation.
 */
function buildIframeOverrideCss({
  hideReferenceHeader,
  hideReferenceBottomNav,
  hideReferenceFab,
}: {
  hideReferenceHeader: boolean;
  hideReferenceBottomNav: boolean;
  hideReferenceFab: boolean;
}) {
  const rules: string[] = [];

  if (hideReferenceHeader) {
    rules.push(`
      body > header,
      body > header:first-of-type {
        display: none !important;
      }
      body > main {
        padding-top: 1rem !important;
      }
    `);
  }

  if (hideReferenceBottomNav) {
    rules.push(`
      body > nav,
      body > nav:last-of-type {
        display: none !important;
      }
      body > main {
        padding-bottom: 0 !important;
      }
    `);
  }

  if (hideReferenceFab) {
    rules.push(`
      body > div[class*="fixed"][class*="bottom"] {
        display: none !important;
      }
    `);
  }

  return rules.join("\n");
}

/**
 * Try to inject override CSS into the iframe document.
 * Returns true on success, false if the document isn't ready yet.
 */
function tryInjectCss(iframe: HTMLIFrameElement, css: string): boolean {
  try {
    const doc = iframe.contentDocument;
    if (!doc || !doc.head) return false;

    // Already injected — nothing to do
    if (doc.getElementById(OVERRIDE_STYLE_ID)) return true;

    const style = doc.createElement("style");
    style.id = OVERRIDE_STYLE_ID;
    style.textContent = css;
    doc.head.appendChild(style);
    return true;
  } catch {
    // Cross-origin or not ready — will retry
    return false;
  }
}

export function ReferenceScreen({
  title,
  referenceFile,
  currentPath,
  hideReferenceHeader = true,
  hideReferenceBottomNav = true,
  hideReferenceFab = true,
}: ReferenceScreenProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const css = buildIframeOverrideCss({
      hideReferenceHeader,
      hideReferenceBottomNav,
      hideReferenceFab,
    }).trim();

    if (!css) return;

    // Poll until we successfully inject (handles race conditions with iframe load)
    const interval = setInterval(() => {
      if (tryInjectCss(iframe, css)) {
        clearInterval(interval);
      }
    }, 80);

    // Also try on load events for faster injection
    const onLoad = () => {
      setTimeout(() => tryInjectCss(iframe, css), 0);
      setTimeout(() => tryInjectCss(iframe, css), 50);
      setTimeout(() => tryInjectCss(iframe, css), 200);
    };
    iframe.addEventListener("load", onLoad);

    // Stop polling after 10s as a safety measure
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      iframe.removeEventListener("load", onLoad);
    };
  }, [referenceFile, hideReferenceHeader, hideReferenceBottomNav, hideReferenceFab]);

  return (
    <main className="flex flex-col h-[100dvh] w-full overflow-hidden bg-background">
      <AppNav currentPath={currentPath} />
      <div className="flex-1 w-full bg-background relative min-h-0">
        <iframe
          ref={iframeRef}
          aria-label={title}
          className="absolute inset-0 w-full h-full border-0"
          src={`/reference-designs/${referenceFile}`}
          title={title}
        />
      </div>
      <AppBottomNav currentPath={currentPath} />
    </main>
  );
}
