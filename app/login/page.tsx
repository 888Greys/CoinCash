import Link from "next/link";
import { LoginOverlay } from "@/components/login-overlay";
import { OTPAuthForm } from "@/components/otp-auth-form";
import { devLoginAction } from "./actions";

type LoginPageProps = {
  searchParams?: {
    error?: string;
    registered?: string;
    detail?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {


  const errorState = typeof searchParams?.error === "string" ? searchParams.error : undefined;
  const errorDetail = typeof searchParams?.detail === "string" ? searchParams.detail : undefined;
  const justRegistered = searchParams?.registered === "1";

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary selection:text-on-primary-container">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-[#0b0e11] px-6">
        <Link className="font-headline text-xl font-bold tracking-tighter text-on-surface" href="/home">
          Coin<span className="text-primary">Cash</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-5">
          <Link
            className="hidden font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#f8f9fe]/60 transition-colors hover:text-on-surface md:inline-flex"
            href="/markets"
          >
            Markets
          </Link>
          <Link
            className="hidden font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#f8f9fe]/60 transition-colors hover:text-on-surface md:inline-flex"
            href="/p2p"
          >
            P2P
          </Link>
          <Link
            className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#f8f9fe]/60 transition-colors hover:text-primary"
            href="/register"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="flex min-h-screen flex-col pt-16 md:flex-row">
        <section className="relative hidden overflow-hidden p-12 md:flex md:w-1/2 md:flex-col md:justify-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-container-low to-surface-container-high opacity-95" />
            <div className="auth-float-slow absolute -left-10 top-16 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
            <div className="auth-float-slower absolute bottom-10 right-6 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="auth-fade-up relative z-10 space-y-6">
            <h2 className="font-headline text-5xl font-extrabold leading-tight tracking-tighter text-on-surface">
              TRADE FASTER <br /> <span className="text-primary">WITH CONFIDENCE</span>
            </h2>
            <p className="auth-fade-up-delay-1 max-w-md text-lg font-light text-on-surface-variant">
              Log in to check markets, manage P2P orders, and continue where you left off.
            </p>
            <div className="auth-fade-up-delay-2 flex gap-8 pt-8">
              <div>
                <div className="font-headline text-2xl font-bold text-primary">24/7</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Trading
                </div>
              </div>
              <div>
                <div className="font-headline text-2xl font-bold text-primary">P2P</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Ready
                </div>
              </div>
              <div>
                <div className="font-headline text-2xl font-bold text-primary">Fast</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Sign in
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center p-6 md:p-12 lg:p-24">
          <div className="auth-panel-glow auth-fade-up w-full max-w-md space-y-8 rounded-2xl border border-outline-variant/15 bg-surface-container-high/65 p-6 backdrop-blur-xl md:p-8">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl font-bold tracking-tighter text-on-surface">
                Log in
              </h1>
              <p className="font-label text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                Welcome back to your account
              </p>
            </div>

            <LoginOverlay />
            
            {justRegistered && (
              <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary mb-4 block">
                Account created. You can log in now.
              </p>
            )}
            {errorState === "auth_required" && (
              <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 mb-4 block">
                Authentication required. Please log in first.
              </p>
            )}
            {errorState === "dev_login_missing_env" && (
              <p className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error mb-4 block">
                Dev login env vars are missing. Set DEV_LOGIN_EMAIL and DEV_LOGIN_PASSWORD in .env.local.
              </p>
            )}
            {errorState === "dev_login_invalid_credentials" && (
              <p className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error mb-4 block">
                Dev login failed: invalid credentials. If this account was created via OTP-only, set a password in Supabase Auth first.
              </p>
            )}
            {errorState === "dev_login_failed" && (
              <p className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error mb-4 block">
                Dev login failed unexpectedly. {errorDetail ? `Supabase says: ${errorDetail}` : "Check Supabase Auth user password and try again."}
              </p>
            )}
            {errorState === "dev_login_unconfirmed" && (
              <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 mb-4 block">
                This user email is not confirmed. Confirm it in Supabase Auth Users, then try Dev Login again.
              </p>
            )}
            {errorState === "dev_login_prod_disabled" && (
              <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 mb-4 block">
                Dev login is disabled in production.
              </p>
            )}

            <OTPAuthForm mode="login" />

            {process.env.NODE_ENV !== "production" && (
              <form action={devLoginAction} className="pt-1">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary hover:bg-primary/20"
                >
                  Dev Login (.env.local)
                </button>
              </form>
            )}

            <p className="text-center font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              New to CoinCash?{" "}
              <Link className="font-bold text-primary" href="/register">
                Create account
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
