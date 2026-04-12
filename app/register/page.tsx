import Link from "next/link";

export default function RegisterPage() {
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
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="font-headline text-5xl font-extrabold leading-tight tracking-tighter text-on-surface">
              DECENTRALIZE <br /> <span className="text-primary">YOUR WEALTH</span>
            </h2>
            <p className="max-w-md text-lg font-light text-on-surface-variant">
              Join the high-frequency terminal for the next generation of asset exchange. Speed is
              your edge. Precision is your profit.
            </p>
            <div className="flex gap-8 pt-8">
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
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl font-bold tracking-tighter text-on-surface">
                Sign up
              </h1>
              <p className="font-label text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                Create your account to start trading
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
                    htmlFor="register-identifier"
                  >
                    Email or Phone
                  </label>
                  <div className="ghost-border bg-surface-container-lowest transition-all">
                    <input
                      className="w-full border-none bg-transparent px-4 py-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0"
                      id="register-identifier"
                      placeholder="terminal@coincash.io"
                      type="text"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-end justify-between">
                    <label
                      className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
                      htmlFor="register-password"
                    >
                      Password
                    </label>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">
                      Security: Strong
                    </span>
                  </div>
                  <div className="ghost-border bg-surface-container-lowest transition-all">
                    <input
                      className="w-full border-none bg-transparent px-4 py-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0"
                      id="register-password"
                      placeholder="••••••••••••"
                      type="password"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="register-password-confirm"
                  >
                    Confirm Password
                  </label>
                  <div className="ghost-border bg-surface-container-lowest transition-all">
                    <input
                      className="w-full border-none bg-transparent px-4 py-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0"
                      id="register-password-confirm"
                      placeholder="••••••••••••"
                      type="password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-5 items-center">
                  <input
                    className="h-4 w-4 rounded-sm border-outline-variant bg-surface-container-low text-primary focus:ring-0"
                    id="terms"
                    type="checkbox"
                  />
                </div>
                <label className="text-xs leading-relaxed text-on-surface-variant" htmlFor="terms">
                  I agree to the{" "}
                  <span className="cursor-pointer text-primary hover:underline">Terms of Service</span>{" "}
                  and{" "}
                  <span className="cursor-pointer text-primary hover:underline">Privacy Policy</span>
                  . I understand that digital asset trading involves significant risk.
                </label>
              </div>

              <button
                className="kinetic-gradient w-full rounded-lg py-4 font-label text-sm font-bold uppercase tracking-[0.2em] text-on-primary-container shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                type="submit"
              >
                Create Account
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
          <span className="cursor-pointer text-sm text-on-surface-variant transition-colors hover:text-primary">
            help
          </span>
          <span className="cursor-pointer text-sm text-on-surface-variant transition-colors hover:text-primary">
            settings
          </span>
        </div>
      </div>
    </div>
  );
}
