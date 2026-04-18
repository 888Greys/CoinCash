export type TransferRecipientKind = "user_uid" | "email" | "username";

export type TransferRecipientInput = {
  kind: TransferRecipientKind;
  value: string;
};

export type TransferActivityTransaction = {
  type: string;
  amount: number;
  status: string;
  reference: string | null;
  created_at: string;
  currency?: string;
};

export type TransferActivitySummary = {
  latest: TransferActivityTransaction;
  sentCount: number;
  receivedCount: number;
  sentTotal: number;
  receivedTotal: number;
};

type TransferRecipientProfile = {
  username: string | null;
  user_uid: number | null;
  email: string | null;
};

export function parseTransferRecipientInput(input: string): TransferRecipientInput | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/^[@#]+/, "").trim();
  if (!normalized) return null;

  if (/^\d{7,}$/.test(normalized)) {
    return { kind: "user_uid", value: normalized };
  }

  if (normalized.includes("@")) {
    return { kind: "email", value: normalized.toLowerCase() };
  }

  return { kind: "username", value: normalized.toLowerCase() };
}

export function formatTransferRecipientLabel(recipient: TransferRecipientProfile): string {
  const username = recipient.username?.trim();
  if (username) return `@${username}`;

  if (typeof recipient.user_uid === "number") {
    return `CoinCash ID ${recipient.user_uid}`;
  }

  const email = recipient.email?.trim();
  if (email) return email;

  return "CoinCash account";
}

export function summarizeTransferActivity(
  transactions: TransferActivityTransaction[]
): TransferActivitySummary | null {
  const transfers = transactions
    .filter((tx) => tx.type === "transfer_out" || tx.type === "transfer_in")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (transfers.length === 0) return null;

  return {
    latest: transfers[0],
    sentCount: transactions.filter((tx) => tx.type === "transfer_out").length,
    receivedCount: transactions.filter((tx) => tx.type === "transfer_in").length,
    sentTotal: transactions
      .filter((tx) => tx.type === "transfer_out")
      .reduce((sum, tx) => sum + Math.abs(Number(tx.amount ?? 0)), 0),
    receivedTotal: transactions
      .filter((tx) => tx.type === "transfer_in")
      .reduce((sum, tx) => sum + Math.abs(Number(tx.amount ?? 0)), 0),
  };
}
