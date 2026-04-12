import { create } from "zustand";

interface AppState {
  hideBalances: boolean;
  toggleBalances: () => void;
  totalBalance: number;
  btcEquivalent: number;
  userName: string;
}

export const useAppStore = create<AppState>((set) => ({
  hideBalances: false,
  toggleBalances: () => set((state) => ({ hideBalances: !state.hideBalances })),
  totalBalance: 12482.91,
  btcEquivalent: 0.24812,
  userName: "Aura_Trader_X",
}));
