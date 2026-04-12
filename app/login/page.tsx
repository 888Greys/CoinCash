import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary selection:text-on-primary-container">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-[#0b0e11] px-6">
        <Link className="font-headline text-xl font-bold tracking-tighter text-primary" href="/">
          CoinCash
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
            <div className="absolute -left-10 top-16 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute bottom-10 right-6 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="font-headline text-5xl font-extrabold leading-tight tracking-tighter text-on-surface">
              TRADE FASTER <br /> <span className="text-primary">WITH CONFIDENCE</span>
            </h2>
            <p className="max-w-md text-lg font-light text-on-surface-variant">
              Log in to check markets, manage P2P orders, and continue where you left off.
            </p>
            <div className="flex gap-8 pt-8">
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
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl font-bold tracking-tighter text-on-surface">
                Log in
              </h1>
              <p className="font-label text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                Welcome back to your account
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="group flex items-center justify-center gap-3 rounded-lg bg-surface-container-high px-4 py-3 transition-colors hover:bg-surface-bright"
                type="button"
              >
                <span className="text-sm text-[#4285F4]">G</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface transition-colors group-hover:text-primary">
                  Google
                </span>
              </button>
              <button
                className="group flex items-center justify-center gap-3 rounded-lg bg-surface-container-high px-4 py-3 transition-colors hover:bg-surface-bright"
                type="button"
              >
                <span className="text-sm text-[#229ED9]">T</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface transition-colors group-hover:text-primary">
                  Telegram
                </span>
              </button>
            </div>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant/20" />
              <span className="mx-4 flex-shrink font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                OR
              </span>
              <div className="flex-grow border-t border-outline-variant/20" />
            </div>

            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="login-identifier"
                  >
                    Email or Phone
                  </label>
                  <div className="ghost-border bg-surface-container-lowest transition-all">
                    <input
                      className="w-full border-none bg-transparent px-4 py-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0"
                      id="login-identifier"
                      placeholder="you@example.com"
                      type="text"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-end justify-between">
                    <label
                      className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
                      htmlFor="login-password"
                    >
                      Password
                    </label>
                    <Link
                      className="text-[10px] font-bold uppercase tracking-tighter text-primary"
                      href="/"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="ghost-border bg-surface-container-lowest transition-all">
                    <input
                      className="w-full border-none bg-transparent px-4 py-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0"
                      id="login-password"
                      placeholder="••••••••••••"
                      type="password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs text-on-surface-variant">
                <label className="flex items-center gap-2" htmlFor="remember-login">
                  <input
                    className="h-4 w-4 rounded-sm border-outline-variant bg-surface-container-low text-primary focus:ring-0"
                    id="remember-login"
                    type="checkbox"
                  />
                  Remember me
                </label>
                <Link className="text-primary hover:underline" href="/">
                  Need help?
                </Link>
              </div>

              <button
                className="kinetic-gradient w-full rounded-lg py-4 font-label text-sm font-bold uppercase tracking-[0.2em] text-on-primary-container shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                type="submit"
              >
                Log In
              </button>

              <div className="flex justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                <Link className="transition-colors hover:text-primary" href="/markets">
                  View Markets
                </Link>
                <Link className="transition-colors hover:text-primary" href="/p2p/buy">
                  Buy USDT
                </Link>
              </div>
            </form>

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
