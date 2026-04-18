"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getLivePrices } from "@/lib/price-api";
import { sendTransactionAlertEmail } from "@/lib/email-notifications";
import {
  formatTransferRecipientLabel,
  parseTransferRecipientInput,
} from "@/lib/transfer-helpers";

const DEFAULT_CURRENCIES = ["USDT", "BTC", "ETH", "BNB", "SOL", "AVAX", "USDC"];
const CONVERTIBLE_CRYPTO = new Set(["USDT", "BTC", "ETH", "BNB", "SOL", "AVAX", "USDC"]);

/**
 * Ensures that the given user has the core wallet currencies created in their account.
 * If they are missing any of the defaults, it will silently insert them.
 * This acts as a robust fallback for new user onboarding in case database triggers fail.
 */
export async function ensureUserWallets(userId: string) {
  const supabase = createClient();

  // 1. Fetch existing wallet currencies for the user
  const { data: existingWallets, error } = await supabase
    .from("wallets")
    .select("currency")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching existing wallets:", error);
    return;
  }

  const existingCurrencies = new Set(existingWallets?.map((w) => w.currency) || []);

  // 2. Determine which core currencies are missing
  const missingCurrencies = DEFAULT_CURRENCIES.filter((currency) => !existingCurrencies.has(currency));

  // 3. Insert any missing wallets with 0 balance
  if (missingCurrencies.length > 0) {
    const walletsToInsert = missingCurrencies.map((currency) => ({
      user_id: userId,
      currency: currency,
      balance: 0.0,
      locked_balance: 0.0,
    }));

    const { error: insertError } = await supabase.from("wallets").insert(walletsToInsert);

    if (insertError) {
      console.error("Error initializing default wallets:", insertError);
    }
  }
}

export async function requestDeposit(walletId: string, network: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: walletForDeposit } = await supabase
    .from("wallets")
    .select("currency")
    .eq("id", walletId)
    .eq("user_id", user.id)
    .maybeSingle();

  const reference = `DEP-${Date.now()}`;
  const { error } = await supabase.from("transactions").insert({
    wallet_id: walletId,
    type: "deposit",
    amount: 0,
    status: "pending",
    reference: `${reference}-${network.toUpperCase()}`,
  });

  if (error) {
    console.error("Error creating deposit request:", error.message);
    return { success: false, error: "Unable to create deposit request" };
  }

  revalidatePath("/assets");

  if (user.email) {
    await sendTransactionAlertEmail({
      email: user.email,
      title: "Deposit Request Created",
      summary: "We received your deposit request and started monitoring the transfer.",
      details: [
        { label: "Asset", value: String(walletForDeposit?.currency ?? "Unknown") },
        { label: "Network", value: network.toUpperCase() },
        { label: "Status", value: "Pending" },
      ],
    });
  }

  return { success: true };
}

export async function submitWithdrawal(walletId: string, amount: number, destination: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Enter a valid amount" };
  }

  if (!destination || destination.trim().length < 8) {
    return { success: false, error: "Enter a valid destination address" };
  }

  const { data: wallet, error: walletError } = await supabase
    .from("wallets")
    .select("id, balance, currency")
    .eq("id", walletId)
    .eq("user_id", user.id)
    .single();

  if (walletError || !wallet) {
    return { success: false, error: "Wallet not found" };
  }

  const currentBalance = Number(wallet.balance ?? 0);
  if (currentBalance < amount) {
    return { success: false, error: "Insufficient available balance" };
  }

  const updatedBalance = currentBalance - amount;
  const { error: updateError } = await supabase
    .from("wallets")
    .update({ balance: updatedBalance })
    .eq("id", walletId)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Error updating wallet for withdrawal:", updateError.message);
    return { success: false, error: "Failed to process withdrawal" };
  }

  const reference = `WDR-${Date.now()}`;
  const { error: txError } = await supabase.from("transactions").insert({
    wallet_id: walletId,
    type: "withdrawal",
    amount,
    status: "pending",
    reference: `${reference}-${destination.slice(0, 8)}`,
  });

  if (txError) {
    console.error("Error creating withdrawal transaction:", txError.message);
    return { success: false, error: "Withdrawal recorded partially. Please contact support." };
  }

  revalidatePath("/assets");
  revalidatePath("/home");

  if (user.email) {
    await sendTransactionAlertEmail({
      email: user.email,
      title: "Withdrawal Submitted",
      summary: "Your withdrawal request has been submitted for processing.",
      details: [
        { label: "Amount", value: `${amount} ${String(wallet.currency ?? "")}`.trim() },
        { label: "Destination", value: `${destination.slice(0, 8)}...` },
        { label: "Status", value: "Pending" },
      ],
    });
  }

  return { success: true };
}

export async function transferFundingToSpot(walletId: string, amount: number, direction: "funding_to_spot" | "spot_to_funding") {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Enter a valid amount" };
  }

  const { data: wallet, error: walletError } = await supabase
    .from("wallets")
    .select("id, balance, locked_balance, currency")
    .eq("id", walletId)
    .eq("user_id", user.id)
    .single();

  if (walletError || !wallet) {
    return { success: false, error: "Wallet not found" };
  }

  const available = Number(wallet.balance ?? 0);
  const spotAllocated = Number(wallet.locked_balance ?? 0);

  if (direction === "funding_to_spot" && available < amount) {
    return { success: false, error: "Insufficient funding wallet balance" };
  }

  if (direction === "spot_to_funding" && spotAllocated < amount) {
    return { success: false, error: "Insufficient spot wallet balance" };
  }

  const nextBalance = direction === "funding_to_spot" ? available - amount : available + amount;
  const nextLocked = direction === "funding_to_spot" ? spotAllocated + amount : spotAllocated - amount;

  const { error: updateError } = await supabase
    .from("wallets")
    .update({ balance: nextBalance, locked_balance: nextLocked })
    .eq("id", walletId)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Error processing internal transfer:", updateError.message);
    return { success: false, error: "Failed to process transfer" };
  }

  const reference = `INT-${Date.now()}`;
  const { error: txError } = await supabase.from("transactions").insert({
    wallet_id: walletId,
    type: "transfer",
    amount,
    status: "completed",
    reference: `${reference}-${direction === "funding_to_spot" ? "F2S" : "S2F"}`,
  });

  if (txError) {
    console.error("Error recording internal transfer transaction:", txError.message);
  }

  revalidatePath("/assets");
  revalidatePath("/home");

  if (user.email) {
    await sendTransactionAlertEmail({
      email: user.email,
      title: "Wallet Transfer Completed",
      summary: "Internal wallet transfer completed successfully.",
      details: [
        {
          label: "Direction",
          value: direction === "funding_to_spot" ? "Funding -> Spot" : "Spot -> Funding",
        },
        { label: "Amount", value: `${amount} ${String(wallet.currency ?? "")}`.trim() },
        { label: "Status", value: "Completed" },
      ],
    });
  }

  return { success: true };
}



export async function transferToUser(walletId: string, recipientInput: string, amount: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const parsedRecipient = parseTransferRecipientInput(recipientInput);
  if (!parsedRecipient) {
    return { success: false, error: "Enter a recipient CoinCash ID, email, or username" };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Enter a valid transfer amount" };
  }

  const { data: sourceWallet, error: sourceWalletError } = await supabase
    .from("wallets")
    .select("id, currency, balance")
    .eq("id", walletId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (sourceWalletError || !sourceWallet) {
    return { success: false, error: "Source wallet not found" };
  }

  const recipientQuery = supabase
    .from("profiles")
    .select("id, email, username, user_uid");

  const { data: recipientProfile, error: recipientError } = await (() => {
    switch (parsedRecipient.kind) {
      case "user_uid":
        return recipientQuery.eq("user_uid", Number(parsedRecipient.value)).maybeSingle();
      case "email":
        return recipientQuery.ilike("email", parsedRecipient.value).maybeSingle();
      case "username":
        return recipientQuery.ilike("username", parsedRecipient.value).maybeSingle();
    }
  })();

  if (recipientError || !recipientProfile) {
    return { success: false, error: "Recipient not found" };
  }

  if (recipientProfile.id === user.id) {
    return { success: false, error: "You cannot transfer to your own account" };
  }

  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("username, user_uid")
    .eq("id", user.id)
    .maybeSingle();

  // --- Direct transfer logic (bypasses PostgREST RPC schema cache) ---

  const currentBalance = Number(sourceWallet.balance ?? 0);
  const roundedAmount = Number(amount.toFixed(8));

  if (currentBalance < roundedAmount) {
    return { success: false, error: "Insufficient available balance" };
  }

  // Ensure recipient has a wallet for this currency
  const { data: recipientWallet } = await supabase
    .from("wallets")
    .select("id, balance")
    .eq("user_id", recipientProfile.id)
    .eq("currency", sourceWallet.currency)
    .maybeSingle();

  let recipientWalletId: string;

  if (!recipientWallet) {
    const { data: newWallet, error: createError } = await supabase
      .from("wallets")
      .insert({
        user_id: recipientProfile.id,
        currency: sourceWallet.currency,
        balance: 0,
        locked_balance: 0,
      })
      .select("id")
      .single();

    if (createError || !newWallet) {
      return { success: false, error: "Failed to initialize recipient wallet" };
    }
    recipientWalletId = newWallet.id;
  } else {
    recipientWalletId = recipientWallet.id;
  }

  // Debit sender
  const { error: debitError } = await supabase
    .from("wallets")
    .update({ balance: Number((currentBalance - roundedAmount).toFixed(8)) })
    .eq("id", sourceWallet.id)
    .eq("user_id", user.id);

  if (debitError) {
    console.error("transferToUser debit error:", debitError.message);
    return { success: false, error: "Failed to debit your wallet" };
  }

  // Credit recipient
  const recipientCurrentBalance = Number(recipientWallet?.balance ?? 0);
  const { error: creditError } = await supabase
    .from("wallets")
    .update({ balance: Number((recipientCurrentBalance + roundedAmount).toFixed(8)) })
    .eq("id", recipientWalletId);

  if (creditError) {
    // Rollback sender debit
    await supabase
      .from("wallets")
      .update({ balance: currentBalance })
      .eq("id", sourceWallet.id)
      .eq("user_id", user.id);
    console.error("transferToUser credit error:", creditError.message);
    return { success: false, error: "Failed to credit recipient wallet" };
  }

  // Log transactions
  const reference = `TRF-${Date.now()}-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  await supabase.from("transactions").insert([
    {
      wallet_id: sourceWallet.id,
      type: "transfer_out",
      amount: roundedAmount,
      status: "completed",
      reference: `${reference}-OUT`,
    },
    {
      wallet_id: recipientWalletId,
      type: "transfer_in",
      amount: roundedAmount,
      status: "completed",
      reference: `${reference}-IN`,
    },
  ]);

  const currency = String(sourceWallet.currency ?? "").toUpperCase();
  const transferAmount = roundedAmount;
  const senderLabel = formatTransferRecipientLabel({
    username: senderProfile?.username ?? null,
    user_uid: senderProfile?.user_uid ?? null,
    email: user.email ?? null,
  });
  const recipientLabel = formatTransferRecipientLabel({
    username: recipientProfile.username ?? null,
    user_uid: recipientProfile.user_uid ?? null,
    email: recipientProfile.email ?? null,
  });

  // NOTE: revalidation is deferred to the client side (WalletActionDrawer)
  // so that the success confirmation screen remains visible after transfer.

  if (user.email) {
    await sendTransactionAlertEmail({
      email: user.email,
      title: "Transfer Sent",
      summary: `You sent ${transferAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${currency} to ${recipientLabel}.`,
      details: [
        { label: "Recipient", value: recipientLabel },
        { label: "Amount", value: `${transferAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${currency}`.trim() },
        { label: "Reference", value: reference },
        { label: "Status", value: "Completed" },
      ],
    });
  }

  if (recipientProfile.email) {
    await sendTransactionAlertEmail({
      email: recipientProfile.email,
      title: "Transfer Received",
      summary: `${senderLabel} sent you ${transferAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${currency}.`,
      details: [
        { label: "Sender", value: senderLabel },
        { label: "Amount", value: `${transferAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${currency}`.trim() },
        { label: "Reference", value: reference },
        { label: "Status", value: "Completed" },
      ],
    });
  }

  return {
    success: true,
    data: {
      amount: transferAmount,
      currency,
      reference,
      recipientLabel,
    },
  };
}

export async function convertCrypto(
  fromWalletId: string,
  toCurrency: string,
  fromAmount: number
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  if (!Number.isFinite(fromAmount) || fromAmount <= 0) {
    return { success: false, error: "Enter a valid amount" };
  }

  const normalizedToCurrency = toCurrency.trim().toUpperCase();
  if (!CONVERTIBLE_CRYPTO.has(normalizedToCurrency)) {
    return { success: false, error: "Unsupported destination asset" };
  }

  const { data: fromWallet, error: fromWalletError } = await supabase
    .from("wallets")
    .select("id, currency, balance")
    .eq("id", fromWalletId)
    .eq("user_id", user.id)
    .single();

  if (fromWalletError || !fromWallet) {
    return { success: false, error: "Source wallet not found" };
  }

  const fromCurrency = String(fromWallet.currency).toUpperCase();
  if (!CONVERTIBLE_CRYPTO.has(fromCurrency)) {
    return { success: false, error: "Only crypto assets can be converted" };
  }

  if (fromCurrency === normalizedToCurrency) {
    return { success: false, error: "Choose a different destination asset" };
  }

  const currentFromBalance = Number(fromWallet.balance ?? 0);
  if (currentFromBalance < fromAmount) {
    return { success: false, error: "Insufficient source balance" };
  }

  const prices = await getLivePrices();
  const fromRate = Number(prices[fromCurrency] ?? 0);
  const toRate = Number(prices[normalizedToCurrency] ?? 0);

  if (fromRate <= 0 || toRate <= 0) {
    return { success: false, error: "Price feed unavailable. Try again shortly." };
  }

  const usdValue = fromAmount * fromRate;
  const grossReceiveAmount = usdValue / toRate;
  const receiveAmount = Number(grossReceiveAmount.toFixed(8));

  if (receiveAmount <= 0) {
    return { success: false, error: "Amount too small to convert" };
  }

  let toWalletId: string;
  let toWalletBalance: number;

  const { data: existingToWallet, error: toWalletError } = await supabase
    .from("wallets")
    .select("id, balance")
    .eq("user_id", user.id)
    .eq("currency", normalizedToCurrency)
    .maybeSingle();

  if (toWalletError) {
    return { success: false, error: "Unable to load destination wallet" };
  }

  if (!existingToWallet) {
    const { data: insertedWallet, error: insertWalletError } = await supabase
      .from("wallets")
      .insert({
        user_id: user.id,
        currency: normalizedToCurrency,
        balance: 0,
        locked_balance: 0,
      })
      .select("id, balance")
      .single();

    if (insertWalletError || !insertedWallet) {
      return { success: false, error: "Failed to initialize destination wallet" };
    }

    toWalletId = insertedWallet.id;
    toWalletBalance = Number(insertedWallet.balance ?? 0);
  } else {
    toWalletId = existingToWallet.id;
    toWalletBalance = Number(existingToWallet.balance ?? 0);
  }

  const nextFromBalance = Number((currentFromBalance - fromAmount).toFixed(8));
  const nextToBalance = Number((toWalletBalance + receiveAmount).toFixed(8));

  const { error: fromUpdateError } = await supabase
    .from("wallets")
    .update({ balance: nextFromBalance })
    .eq("id", fromWallet.id)
    .eq("user_id", user.id);

  if (fromUpdateError) {
    return { success: false, error: "Failed to debit source wallet" };
  }

  const { error: toUpdateError } = await supabase
    .from("wallets")
    .update({ balance: nextToBalance })
    .eq("id", toWalletId)
    .eq("user_id", user.id);

  if (toUpdateError) {
    // Attempt rollback best-effort when credit fails.
    await supabase
      .from("wallets")
      .update({ balance: currentFromBalance })
      .eq("id", fromWallet.id)
      .eq("user_id", user.id);

    return { success: false, error: "Failed to credit destination wallet" };
  }

  const reference = `CNV-${Date.now()}`;
  await supabase.from("transactions").insert([
    {
      wallet_id: fromWallet.id,
      type: "convert_debit",
      amount: fromAmount,
      status: "completed",
      reference: `${reference}-${fromCurrency}-OUT`,
    },
    {
      wallet_id: toWalletId,
      type: "convert_credit",
      amount: receiveAmount,
      status: "completed",
      reference: `${reference}-${normalizedToCurrency}-IN`,
    },
  ]);

  revalidatePath("/assets");
  revalidatePath("/home");

  if (user.email) {
    await sendTransactionAlertEmail({
      email: user.email,
      title: "Conversion Completed",
      summary: "Your crypto conversion was executed successfully.",
      details: [
        { label: "From", value: `${fromAmount} ${fromCurrency}` },
        { label: "To", value: `${receiveAmount} ${normalizedToCurrency}` },
        { label: "Status", value: "Completed" },
      ],
    });
  }

  return {
    success: true,
    data: {
      fromCurrency,
      toCurrency: normalizedToCurrency,
      fromAmount,
      receiveAmount,
      rateUsed: toRate / fromRate,
    },
  };
}
