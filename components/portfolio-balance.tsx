"use client";

import { useAppStore } from "@/lib/store";

export function PortfolioBalance({ liveBalance }: { liveBalance?: number }) {
  const { totalBalance, hideBalances } = useAppStore();
  const displayVal = liveBalance ?? totalBalance;

  const formattedBalance = hideBalances
    ? "********"
    : displayVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return <>{formattedBalance}</>;
}

export function PortfolioBtcEquivalent({ liveBtc }: { liveBtc?: number }) {
  const { btcEquivalent, hideBalances } = useAppStore();
  const displayVal = liveBtc ?? btcEquivalent;

  const formattedBtc = hideBalances ? "******" : displayVal.toFixed(6);

  return <>{formattedBtc}</>;
}

export function ToggleVisibilityButton() {
  const { hideBalances, toggleBalances } = useAppStore();

  return (
    <span
      className="material-symbols-outlined text-xs text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors"
      onClick={toggleBalances}
    >
      {hideBalances ? "visibility_off" : "visibility"}
    </span>
  );
}
