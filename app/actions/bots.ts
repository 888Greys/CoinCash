"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type TradingBot = {
  id: string;
  user_id: string;
  name: string;
  type: "grid" | "dca" | "arbitrage";
  pair: string;
  status: "running" | "paused" | "stopped" | "error";
  config: Record<string, any>;
  total_profit: number;
  profit_percentage: number;
  runtime_start: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserBots(): Promise<TradingBot[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("trading_bots")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bots:", error);
    return [];
  }

  return (data as TradingBot[]) ?? [];
}

export async function createTradingBot(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const type = formData.get("type") as string;
  const pair = formData.get("pair") as string;

  const botNames: Record<string, string> = {
    grid: `${pair} Grid`,
    dca: `${pair} DCA`,
    arbitrage: `${pair} Arbitrage`,
  };

  const { error } = await supabase.from("trading_bots").insert({
    user_id: user.id,
    name: botNames[type] ?? `${pair} Bot`,
    type,
    pair,
    status: "paused",
    config: { pair },
    total_profit: 0,
    profit_percentage: 0,
    runtime_start: null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/bot");
}

export async function updateBotStatus(botId: string, newStatus: "running" | "paused" | "stopped") {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const updatePayload: Partial<TradingBot> = { status: newStatus };
  if (newStatus === "running") {
    updatePayload.runtime_start = new Date().toISOString();
  }

  const { error } = await supabase
    .from("trading_bots")
    .update(updatePayload)
    .eq("id", botId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/bot");
}
