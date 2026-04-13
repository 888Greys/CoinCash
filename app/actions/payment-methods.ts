"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPaymentMethods() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch payment methods:", error.message);
    return [];
  }
  return data ?? [];
}

export async function addPaymentMethod(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const accountHolder = formData.get("account_holder") as string;
  const accountNumber = formData.get("account_number") as string;

  if (!name || !type || !accountHolder || !accountNumber) {
    return { success: false, error: "All fields are required" };
  }

  const { error } = await supabase.from("payment_methods").insert({
    user_id: user.id,
    name,
    type,
    account_holder: accountHolder,
    account_number: accountNumber,
  });

  if (error) {
    console.error("Failed to add payment method:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/payment-methods");
  return { success: true };
}

export async function deletePaymentMethod(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("payment_methods")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete payment method:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/payment-methods");
  return { success: true };
}

export async function togglePaymentMethod(id: string, isActive: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("payment_methods")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to toggle payment method:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/payment-methods");
  return { success: true };
}
