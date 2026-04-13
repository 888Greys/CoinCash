"use server";

import { createClient } from "@/utils/supabase/server";

export async function takeP2POrderAction(orderId: string, assetAmount: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Call the secure RPC function
  const { data, error } = await supabase.rpc("take_p2p_order", {
    p_order_id: orderId,
    p_taker_id: user.id,
    p_asset_amount: assetAmount
  });

  if (error) {
    console.error("RPC Error:", error);
    return { success: false, error: "Database transaction failed" };
  }

  const result = data as { success: boolean, error?: string, trade_id?: string };
  return result;
}

export async function releaseP2PTradeAction(tradeId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Call the secure RPC function
  const { data, error } = await supabase.rpc("release_p2p_trade", {
    p_trade_id: tradeId,
    p_user_id: user.id
  });

  if (error) {
    console.error("RPC Error:", error);
    return { success: false, error: "Database transaction failed" };
  }

  const result = data as { success: boolean, error?: string };
  return result;
}
