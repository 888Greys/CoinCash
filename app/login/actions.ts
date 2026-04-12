"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const identifier = String(formData.get("identifier") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const devEmail = process.env.DEV_LOGIN_EMAIL?.trim().toLowerCase();
  const devPassword = process.env.DEV_LOGIN_PASSWORD;

  // Artificial delay to show off the splash screen seamlessly
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!devEmail || !devPassword) {
    redirect("/login?error=config");
  }

  if (identifier === devEmail && password === devPassword) {
    cookies().set('auth_session', 'true', { path: '/' });
    redirect("/home");
  }

  redirect("/login?error=invalid");
}

export async function logoutAction() {
  cookies().delete('auth_session');
  redirect("/login");
}
