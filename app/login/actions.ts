"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function sendOtpAction(formData: FormData) {
  const email = String(formData.get("identifier") ?? "")
    .trim()
    .toLowerCase();

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // This allows people to register from the login mask
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, email };
}

export async function verifyOtpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = String(formData.get("token") ?? "").trim();

  const supabase = createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return { success: false, error: "Invalid or expired code" };
  }

  // Redirect on success
  redirect("/home");
}

export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
