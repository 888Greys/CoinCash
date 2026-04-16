"use client";

import { useState } from "react";

type CopyUserIdButtonProps = {
  userId: string;
};

export function CopyUserIdButton({ userId }: CopyUserIdButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
      aria-label="Copy CoinCash ID"
      title={copied ? "Copied" : "Copy ID"}
    >
      <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        {copied ? "check" : "content_copy"}
      </span>
    </button>
  );
}
