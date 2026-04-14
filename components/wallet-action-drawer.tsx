"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { requestDeposit, submitWithdrawal, transferFundingToSpot } from "@/app/actions/wallet";

type WalletLite = {
  id: string;
  currency: string;
  balance: number;
  locked_balance: number;
};

type ActionMode = "deposit" | "withdraw" | "transfer";

const NETWORKS: Record<string, string[]> = {
  USDT: ["TRC20", "ERC20", "BEP20"],
  BTC: ["Bitcoin"],
  ETH: ["ERC20"],
  BNB: ["BEP20"],
  SOL: ["SOL"],
  AVAX: ["C-Chain"],
  USDC: ["ERC20", "SOL"],
  KES: ["Mobile Money"],
  UGX: ["Mobile Money"],
};

function shortId(id: string) {
  return id.replace(/-/g, "").slice(0, 12).toUpperCase();
}

function buildReceiveAddress(currency: string, walletId: string, network: string) {
  const compact = shortId(walletId);
  if (currency === "BTC") return `bc1q${compact.toLowerCase()}${network.replace(/\W/g, "").toLowerCase()}`;
  if (currency === "ETH" || currency === "USDT" || currency === "USDC" || currency === "BNB" || currency === "AVAX") {
    return `0x${walletId.replace(/-/g, "").padEnd(40, "0").slice(0, 40)}`;
  }
  return `${currency}-${network.replace(/\s/g, "").toUpperCase()}-${compact}`;
}

export function WalletActionDrawer({ wallets }: { wallets: WalletLite[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ActionMode>("deposit");
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id ?? "");
  const [selectedNetwork, setSelectedNetwork] = useState("TRC20");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDirection, setTransferDirection] = useState<"funding_to_spot" | "spot_to_funding">("funding_to_spot");
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedWallet = useMemo(
    () => wallets.find((w) => w.id === selectedWalletId) ?? wallets[0],
    [selectedWalletId, wallets]
  );

  const networkOptions = useMemo(
    () => NETWORKS[selectedWallet?.currency ?? ""] ?? ["Mainnet"],
    [selectedWallet?.currency]
  );

  const receiveAddress = useMemo(() => {
    if (!selectedWallet) return "";
    const chosenNetwork = networkOptions.includes(selectedNetwork) ? selectedNetwork : networkOptions[0];
    return buildReceiveAddress(selectedWallet.currency, selectedWallet.id, chosenNetwork);
  }, [selectedNetwork, networkOptions, selectedWallet]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(receiveAddress)}`;
  const availableBalance = Number(selectedWallet?.balance ?? 0);
  const spotBalance = Number(selectedWallet?.locked_balance ?? 0);

  function openWith(nextMode: ActionMode) {
    setMode(nextMode);
    setIsOpen(true);
    setFeedback(null);

    if (wallets[0]) {
      setSelectedWalletId(wallets[0].id);
      const defaults = NETWORKS[wallets[0].currency] ?? ["Mainnet"];
      setSelectedNetwork(defaults[0]);
    }
  }

  function closeDrawer() {
    setIsOpen(false);
    setFeedback(null);
  }

  async function handleDepositRequest() {
    if (!selectedWallet) return;

    startTransition(async () => {
      const result = await requestDeposit(selectedWallet.id, selectedNetwork);
      if (!result.success) {
        setFeedback({ type: "error", message: result.error ?? "Unable to submit deposit request" });
        return;
      }

      setFeedback({ type: "success", message: "Deposit request submitted. Address is ready for incoming transfers." });
      router.refresh();
    });
  }

  async function handleWithdraw() {
    if (!selectedWallet) return;

    const amount = Number(withdrawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFeedback({ type: "error", message: "Enter a valid withdrawal amount" });
      return;
    }

    if (amount > availableBalance) {
      setFeedback({ type: "error", message: "Amount exceeds your available balance" });
      return;
    }

    startTransition(async () => {
      const result = await submitWithdrawal(selectedWallet.id, amount, destination);
      if (!result.success) {
        setFeedback({ type: "error", message: result.error ?? "Unable to submit withdrawal" });
        return;
      }

      setWithdrawAmount("");
      setDestination("");
      setFeedback({ type: "success", message: "Withdrawal submitted and queued for processing." });
      router.refresh();
    });
  }

  async function handleTransfer() {
    if (!selectedWallet) return;

    const amount = Number(transferAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFeedback({ type: "error", message: "Enter a valid transfer amount" });
      return;
    }

    if (transferDirection === "funding_to_spot" && amount > availableBalance) {
      setFeedback({ type: "error", message: "Amount exceeds your Funding Wallet balance" });
      return;
    }

    if (transferDirection === "spot_to_funding" && amount > spotBalance) {
      setFeedback({ type: "error", message: "Amount exceeds your Spot Wallet balance" });
      return;
    }

    startTransition(async () => {
      const result = await transferFundingToSpot(selectedWallet.id, amount, transferDirection);
      if (!result.success) {
        setFeedback({ type: "error", message: result.error ?? "Unable to process transfer" });
        return;
      }

      setTransferAmount("");
      setFeedback({ type: "success", message: "Internal transfer completed." });
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => openWith("deposit")}
          disabled={wallets.length === 0}
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-3 font-label text-sm font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">south_west</span>
          Deposit
        </button>
        <button
          onClick={() => openWith("withdraw")}
          disabled={wallets.length === 0}
          className="bg-surface-container-highest border border-primary/20 text-on-surface px-6 py-3 font-label text-sm font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 hover:bg-surface-bright active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">north_east</span>
          Withdraw
        </button>
        <button
          onClick={() => openWith("transfer")}
          disabled={wallets.length === 0}
          className="bg-surface-container-highest border border-primary/20 text-on-surface px-6 py-3 font-label text-sm font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 hover:bg-surface-bright active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">swap_horiz</span>
          Transfer
        </button>
      </div>

      <div className={`fixed inset-0 z-40 transition ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} />

        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-surface-container-low border-l border-outline-variant/20 shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 border-b border-outline-variant/15 flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Wallet Actions</p>
              <h3 className="font-headline text-lg font-bold capitalize">{mode}</h3>
            </div>
            <button
              className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
              onClick={closeDrawer}
              aria-label="Close panel"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-5 space-y-4">
            {wallets.length === 0 && (
              <div className="rounded-sm border border-outline-variant/20 bg-surface-container-highest p-4 text-sm text-on-surface-variant">
                No wallets are available yet. Please refresh shortly after account initialization.
              </div>
            )}

            {!!selectedWallet && (
              <>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Asset</label>
                <select
                  value={selectedWallet.id}
                  onChange={(e) => {
                    setSelectedWalletId(e.target.value);
                    const target = wallets.find((w) => w.id === e.target.value);
                    const defaults = NETWORKS[target?.currency ?? ""] ?? ["Mainnet"];
                    setSelectedNetwork(defaults[0]);
                    setFeedback(null);
                  }}
                  className="w-full bg-surface-container-highest border border-outline-variant/25 px-3 py-3 rounded-sm text-sm"
                >
                  {wallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.currency} | Available: {Number(wallet.balance).toFixed(4)}
                    </option>
                  ))}
                </select>
              </>
            )}

            {mode === "deposit" && selectedWallet && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Network</label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant/25 px-3 py-3 rounded-sm text-sm"
                  >
                    {networkOptions.map((network) => (
                      <option key={network} value={network}>{network}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-surface-container-highest rounded-sm p-4">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Receiving Address</p>
                  <p className="font-mono text-xs break-all text-on-surface">{receiveAddress}</p>
                  <button
                    className="mt-3 text-primary text-[10px] font-bold uppercase tracking-widest"
                    onClick={async () => {
                      await navigator.clipboard.writeText(receiveAddress);
                      setFeedback({ type: "success", message: "Address copied to clipboard." });
                    }}
                  >
                    Copy Address
                  </button>
                </div>

                <div className="bg-surface-container-highest rounded-sm p-4 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="Deposit QR code" width={180} height={180} decoding="async" />
                </div>

                <button
                  onClick={handleDepositRequest}
                  disabled={isPending}
                  className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-sm rounded-sm disabled:opacity-50"
                >
                  {isPending ? "Submitting..." : "Notify Deposit"}
                </button>
              </div>
            )}

            {mode === "withdraw" && selectedWallet && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Amount ({selectedWallet.currency})</label>
                  <input
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="w-full bg-surface-container-highest border border-outline-variant/25 px-3 py-3 rounded-sm text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Destination Address</label>
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Paste destination wallet"
                    className="w-full bg-surface-container-highest border border-outline-variant/25 px-3 py-3 rounded-sm text-sm"
                  />
                </div>

                <p className="text-[11px] text-on-surface-variant">
                  Available: <span className="text-on-surface font-semibold">{availableBalance.toFixed(6)} {selectedWallet.currency}</span>
                </p>

                <button
                  onClick={handleWithdraw}
                  disabled={isPending}
                  className="w-full py-3 bg-surface-container-highest border border-primary/20 text-on-surface font-bold uppercase tracking-widest text-sm rounded-sm disabled:opacity-50"
                >
                  {isPending ? "Submitting..." : "Submit Withdrawal"}
                </button>
              </div>
            )}

            {mode === "transfer" && selectedWallet && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTransferDirection("funding_to_spot")}
                    className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border ${
                      transferDirection === "funding_to_spot" ? "bg-primary/10 text-primary border-primary/30" : "bg-surface-container-highest text-on-surface-variant border-outline-variant/25"
                    }`}
                  >
                    Funding to Spot
                  </button>
                  <button
                    onClick={() => setTransferDirection("spot_to_funding")}
                    className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border ${
                      transferDirection === "spot_to_funding" ? "bg-primary/10 text-primary border-primary/30" : "bg-surface-container-highest text-on-surface-variant border-outline-variant/25"
                    }`}
                  >
                    Spot to Funding
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Amount ({selectedWallet.currency})</label>
                  <input
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="w-full bg-surface-container-highest border border-outline-variant/25 px-3 py-3 rounded-sm text-sm"
                  />
                </div>

                <div className="rounded-sm bg-surface-container-highest p-3 text-xs text-on-surface-variant space-y-1">
                  <p>Funding Wallet: <span className="text-on-surface">{availableBalance.toFixed(6)} {selectedWallet.currency}</span></p>
                  <p>Spot Wallet: <span className="text-on-surface">{spotBalance.toFixed(6)} {selectedWallet.currency}</span></p>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={isPending}
                  className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-sm rounded-sm disabled:opacity-50"
                >
                  {isPending ? "Moving Funds..." : "Move Funds"}
                </button>
              </div>
            )}

            {feedback && (
              <div
                className={`rounded-sm border px-3 py-2 text-xs ${
                  feedback.type === "error"
                    ? "border-error/40 bg-error/10 text-error"
                    : "border-primary/30 bg-primary/10 text-primary"
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
