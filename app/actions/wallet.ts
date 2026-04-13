"use server";

import { createClient } from "@/utils/supabase/server";

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
