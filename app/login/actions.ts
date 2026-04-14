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

  // Try standard email OTP first, then fallback to magiclink for older sessions.
  const { error: emailError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  let finalError = emailError;
  if (emailError) {
    const { error: magiclinkError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "magiclink",
    });
    finalError = magiclinkError;
  }

  if (finalError) {
    console.error("OTP verify error:", finalError.message);
    return { success: false, error: `Code invalid or expired. Please request a new one.` };
  }

  // Redirect on success
  redirect("/home");
}

export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function devLoginAction() {
  const devEmail = (process.env.DEV_LOGIN_EMAIL ?? "").trim().toLowerCase();
  const devPassword = process.env.DEV_LOGIN_PASSWORD ?? "";

  // Safety guard: never allow the shortcut in production.
  if (process.env.NODE_ENV === "production") {
    redirect("/login?error=dev_login_prod_disabled");
  }

  if (!devEmail || !devPassword) {
    redirect("/login?error=dev_login_missing_env");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: devEmail,
    password: devPassword,
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      redirect("/login?error=dev_login_unconfirmed");
    }

    // Common case: user exists via OTP and has no password set.
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      redirect("/login?error=dev_login_invalid_credentials");
    }
    redirect(`/login?error=dev_login_failed&detail=${encodeURIComponent(error.message)}`);
  }

  redirect("/home");
}
