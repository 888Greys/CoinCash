"use client";

import { useAppStore } from "@/lib/store";

export function PortfolioBalance() {
  const { totalBalance, hideBalances } = useAppStore();

  const formattedBalance = hideBalances
    ? "********"
    : totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return <>{formattedBalance}</>;
}

export function PortfolioBtcEquivalent() {
  const { btcEquivalent, hideBalances } = useAppStore();

  const formattedBtc = hideBalances ? "******" : btcEquivalent.toFixed(6);

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
