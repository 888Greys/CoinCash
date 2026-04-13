"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────
export type P2POrderWithProfile = {
  id: string;
  type: "buy" | "sell";
  asset: string;
  fiat: string;
  price: number;
  total_amount: number;
  min_limit: number;
  max_limit: number;
  payment_method: string;
  terms: string | null;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
};

export type TradeWithDetails = {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  asset_amount: number;
  fiat_amount: number;
  status: string;
  created_at: string;
  p2p_orders: {
    asset: string;
    fiat: string;
    price: number;
    payment_method: string;
    terms: string | null;
  };
  buyer: { username: string | null; avatar_url: string | null };
  seller: { username: string | null; avatar_url: string | null };
};

// ─── Fetch Active Orders ─────────────────────────────────────────────────
export async function getActiveOrders(
  type: "buy" | "sell" = "sell",
  asset: string = "USDT",
  fiat: string = "USD"
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("p2p_orders")
    .select(`
      *,
      profiles:user_id ( username, avatar_url )
    `)
    .eq("status", "active")
    .eq("type", type)
    .eq("asset", asset)
    .eq("fiat", fiat)
    .order("price", { ascending: type === "sell" })
    .limit(20);

  if (error) {
    console.error("getActiveOrders error:", error.message);
    return [];
  }

  return (data ?? []) as P2POrderWithProfile[];
}

// ─── Get Single Order ────────────────────────────────────────────────────
export async function getOrderById(orderId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("p2p_orders")
    .select(`
      *,
      profiles:user_id ( username, avatar_url )
    `)
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("getOrderById error:", error.message);
    return null;
  }

  return data as P2POrderWithProfile;
}

// ─── Create New P2P Order (Post Ad) ──────────────────────────────────────
export async function createOrder(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const type = String(formData.get("type") ?? "buy");
  const asset = String(formData.get("asset") ?? "USDT");
  const fiat = String(formData.get("fiat") ?? "USD");
  const price = Number(formData.get("price") ?? 0);
  const total_amount = Number(formData.get("total_amount") ?? 0);
  const min_limit = Number(formData.get("min_limit") ?? 0);
  const max_limit = Number(formData.get("max_limit") ?? 0);
  const payment_method = String(formData.get("payment_method") ?? "");
  const terms = String(formData.get("terms") ?? "") || null;

  // Basic validation
  if (price <= 0 || total_amount <= 0 || min_limit <= 0 || max_limit <= 0) {
    return { success: false, error: "All numeric fields must be positive" };
  }
  if (min_limit > max_limit) {
    return { success: false, error: "Min limit cannot exceed max limit" };
  }
  if (!payment_method) {
    return { success: false, error: "Payment method is required" };
  }

  const { data, error } = await supabase
    .from("p2p_orders")
    .insert({
      user_id: user.id,
      type,
      asset,
      fiat,
      price,
      total_amount,
      min_limit,
      max_limit,
      payment_method,
      terms,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createOrder error:", error.message);
    return { success: false, error: error.message };
  }

  // Keep users in their selected intent tab after posting, while marketplace still
  // shows opposite-side orders under each tab.
  redirect(`/p2p?tab=${encodeURIComponent(type)}&asset=${encodeURIComponent(asset)}&fiat=${encodeURIComponent(fiat)}`);
}

// ─── Take an Order (Initiates Trade + Escrow Lock) ───────────────────────
export async function takeOrder(orderId: string, assetAmount: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .rpc("take_p2p_order", {
      p_order_id: orderId,
      p_taker_id: user.id,
      p_asset_amount: assetAmount,
    });

  if (error) {
    console.error("takeOrder RPC error:", error.message);
    return { success: false, error: error.message };
  }

  const result = data as { success: boolean; error?: string; trade_id?: string };

  if (!result.success) {
    return { success: false, error: result.error ?? "Failed to take order" };
  }

  return { success: true, tradeId: result.trade_id };
}

// ─── Release Trade (Seller releases escrow) ──────────────────────────────
export async function releaseTradeAction(tradeId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .rpc("release_p2p_trade", {
      p_trade_id: tradeId,
      p_user_id: user.id,
    });

  if (error) {
    console.error("releaseTrade RPC error:", error.message);
    return { success: false, error: error.message };
  }

  const result = data as { success: boolean; error?: string };

  if (!result.success) {
    return { success: false, error: result.error ?? "Failed to release trade" };
  }

  return { success: true };
}

// ─── Get Trade Details ───────────────────────────────────────────────────
export async function getTradeDetails(tradeId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("p2p_trades")
    .select(`
      *,
      p2p_orders ( asset, fiat, price, payment_method, terms ),
      buyer:buyer_id ( username, avatar_url ),
      seller:seller_id ( username, avatar_url )
    `)
    .eq("id", tradeId)
    .single();

  if (error) {
    console.error("getTradeDetails error:", error.message);
    return null;
  }

  return data as TradeWithDetails;
}

// ─── Get Recent Settlements (for the P2P feed) ──────────────────────────
export async function getRecentSettlements(limit: number = 5) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("p2p_trades")
    .select(`
      id, asset_amount, fiat_amount, status, created_at,
      p2p_orders ( type, asset, fiat ),
      buyer:buyer_id ( username ),
      seller:seller_id ( username )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentSettlements error:", error.message);
    return [];
  }

  return data ?? [];
}

// ─── Mark Trade as Paid (Buyer notifies Seller) ─────────────────────────
export async function markTradePaidAction(tradeId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Update trade status to paid
  // Verify user is actually the buyer
  const { error } = await supabase
    .from("p2p_trades")
    .update({ status: 'paid' })
    .eq('id', tradeId)
    .eq('buyer_id', user.id);

  if (error) {
    console.error("markTradePaid error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
