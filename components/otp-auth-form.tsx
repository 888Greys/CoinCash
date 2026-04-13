"use client";

import { useState } from "react";
import { sendOtpAction, verifyOtpAction } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/client";

import { TelegramLogin } from "@/components/telegram-login";

export function OTPAuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [errorState, setErrorState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleTelegramAuth = async (user: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorState("Telegram authentication failed");
        setLoading(false);
      }
    } catch (e) {
      setErrorState("Network error during Telegram auth");
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorState(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await sendOtpAction(formData);

    if (!result.success) {
      setErrorState(result.error ?? "Failed to send OTP");
      setLoading(false);
      return;
    }

    setEmail(result.email!);
    setStep("otp");
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorState(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    // get token from the input
    const input = e.currentTarget.elements.namedItem("token") as HTMLInputElement;
    formData.append("token", input.value);

    const result = await verifyOtpAction(formData);

    // If it succeeds, the action will do a redirect, so we only handle errors here.
    if (result && !result.success) {
      setErrorState(result.error ?? "Invalid OTP");
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // We read the bot username dynamically from env, or provide a default if null
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "YourTelegramBot";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={loginWithGoogle}
          className="group flex h-12 items-center justify-center gap-3 rounded-lg bg-surface-container-high px-4 transition-all hover:-translate-y-0.5 hover:bg-surface-bright"
          type="button"
        >
          <span className="text-sm text-[#4285F4]">G</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface transition-colors group-hover:text-primary">
            Google
          </span>
        </button>
        <TelegramLogin botName={botUsername} onAuth={handleTelegramAuth} />
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-outline-variant/20" />
        <span className="mx-4 flex-shrink font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          OR
        </span>
        <div className="flex-grow border-t border-outline-variant/20" />
      </div>

      {errorState && (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {errorState}
        </p>
      )}

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="space-y-1.5">
            <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Email Address
            </label>
            <div className="ghost-border bg-surface-container-lowest transition-all">
              <input
                className="w-full border-none bg-transparent px-4 py-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0"
                name="identifier"
                placeholder="you@example.com"
                required
                type="email"
                disabled={loading}
              />
            </div>
          </div>
          
          <button
            className="kinetic-gradient w-full rounded-lg py-4 font-label text-sm font-bold uppercase tracking-[0.2em] text-on-primary-container shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Secure Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Enter OTP Code
              </label>
              <button 
                type="button" 
                onClick={() => setStep("email")} 
                className="text-[10px] font-bold tracking-tighter text-primary hover:underline"
              >
                Change Email
              </button>
            </div>
            <p className="text-xs text-on-surface-variant">Code sent to <strong className="text-on-surface">{email}</strong></p>
            <p className="text-[10px] text-on-surface-variant/60 mt-1">Check your inbox and spam folder. Code may take up to 60 seconds.</p>
            <div className="ghost-border bg-surface-container-lowest transition-all mt-2">
              <input
                className="w-full border-none bg-transparent px-4 py-4 font-body tracking-[0.3em] font-mono text-center text-lg text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0"
                name="token"
                placeholder="123456"
                required
                type="text"
                maxLength={6}
                disabled={loading}
              />
            </div>
          </div>
          
          <button
            className="kinetic-gradient w-full rounded-lg py-4 font-label text-sm font-bold uppercase tracking-[0.2em] text-on-primary-container shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Enter"}
          </button>

          <button
            type="button"
            onClick={async () => {
              setErrorState(null);
              const fd = new FormData();
              fd.append("identifier", email);
              const result = await sendOtpAction(fd);
              if (result.success) {
                setErrorState(null);
                alert("New code sent! Check your email.");
              } else {
                setErrorState(result.error ?? "Failed to resend");
              }
            }}
            className="w-full text-center text-xs text-primary hover:underline py-2"
          >
            Didn't receive the code? Resend
          </button>
        </form>
      )}
    </div>
  );
}
