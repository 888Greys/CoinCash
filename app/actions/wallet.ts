"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const DEFAULT_CURRENCIES = ["USDT", "BTC", "ETH", "BNB"];

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
    .select("id, balance")
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
    .select("id, balance, locked_balance")
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
  return { success: true };
}
