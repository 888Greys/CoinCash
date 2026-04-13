import Link from "next/link";
import { redirect } from "next/navigation";
import { OTPAuthForm } from "@/components/otp-auth-form";

type RegisterPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  async function registerAction(formData: FormData) {
    "use server";

    const email = String(formData.get("identifier") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const agreedToTerms = formData.get("terms") === "on";

    if (!agreedToTerms) {
      redirect("/register?error=terms");
    }

    if (password !== confirmPassword) {
      redirect("/register?error=nomatch");
    }

    const { createClient } = await import("@/utils/supabase/server");
    const supabase = createClient();
    
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      redirect("/register?error=failed");
    }

    redirect("/login?registered=1");
  }

  const errorState = typeof searchParams?.error === "string" ? searchParams.error : undefined;

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
            href="/login"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="flex min-h-screen flex-col pt-16 md:flex-row">
        <section className="relative hidden overflow-hidden p-12 md:flex md:w-1/2 md:flex-col md:justify-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-container-low to-surface-container-high opacity-90" />
            <img
              alt="Abstract digital network"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7Fa9BbgB3Id4BYrt-gbkLv8QuEZP0maCrft-060D-GAqAQhYXA8-UJPi5BH9SX3CLfFPyjNlycKlu5oQP34WA3dnHdutgtVdUorc5dtgwguSfg6e8vSvmXVV05_mhJ-mjMkgWjozrgJwHr_8Fee9mAnSApJhJjCgmthOW-j68RpMRmIqa7cDXWETxsCAAKCFejCvQpX7scfcQNZyWcxvNrZT5BplkXi9MUZRLMoI8xaDjIaft_A4p81KbE-hka0vocqXtQggSpic"
            />
            <div className="auth-float-slow absolute -left-10 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="auth-float-slower absolute bottom-10 right-6 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="auth-fade-up relative z-10 space-y-6">
            <h2 className="font-headline text-5xl font-extrabold leading-tight tracking-tighter text-on-surface">
              DECENTRALIZE <br /> <span className="text-primary">YOUR WEALTH</span>
            </h2>
            <p className="auth-fade-up-delay-1 max-w-md text-lg font-light text-on-surface-variant">
              Join a next-generation marketplace built for confident execution. Speed is
              your edge. Precision drives your results.
            </p>
            <div className="auth-fade-up-delay-2 flex gap-8 pt-8">
              <div>
                <div className="font-headline text-2xl font-bold text-primary">24/7</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Uptime
                </div>
              </div>
              <div>
                <div className="font-headline text-2xl font-bold text-primary">0.01%</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Taker Fee
                </div>
              </div>
              <div>
                <div className="font-headline text-2xl font-bold text-primary">400+</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Assets
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center p-6 md:p-12 lg:p-24">
          <div className="auth-panel-glow auth-fade-up w-full max-w-md space-y-8 rounded-2xl border border-outline-variant/15 bg-surface-container-high/65 p-6 backdrop-blur-xl md:p-8">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl font-bold tracking-tighter text-on-surface">
                Sign up
              </h1>
              <p className="font-label text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                Create your account to start trading
              </p>
            </div>

            {errorState === "terms" && (
              <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 mb-4 block">
                Please agree to Terms and Privacy Policy to continue.
              </p>
            )}

            <OTPAuthForm mode="register" />

            <p className="text-center font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              Already have an account?{" "}
              <Link className="font-bold text-primary" href="/login">
                Log in
              </Link>
            </p>
          </div>
        </section>
      </main>

      <div className="obsidian-glass fixed bottom-6 right-6 hidden items-center gap-4 rounded-full border border-outline-variant/10 p-3 md:flex">
        <div className="flex items-center gap-2 px-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">
            Network: Stable
          </span>
        </div>
        <div className="h-4 w-px bg-outline-variant/20" />
        <div className="flex gap-3 pr-2">
          <Link
            className="text-sm text-on-surface-variant transition-colors hover:text-primary"
            href="/settings"
          >
            help
          </Link>
          <Link
            className="text-sm text-on-surface-variant transition-colors hover:text-primary"
            href="/settings"
          >
            settings
          </Link>
        </div>
      </div>
    </div>
  );
}
