import { AppShell } from "@/components/app-shell";
import { logoutAction } from "@/app/login/actions";

export default function SettingsPage() {
  return (
    <AppShell currentPath="/settings">
      <div className="px-4 pt-6 max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <section className="mb-10">
          <h1 className="font-headline text-4xl font-bold tracking-tight mb-2">
            SYSTEM CONFIGURATION
          </h1>
          <p className="text-on-surface-variant text-sm tracking-wider uppercase font-medium">
            Terminal Security &amp; Global Environment Variables
          </p>
        </section>

        {/* ACCOUNT_SECURITY Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-4 bg-primary" />
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant">
              ACCOUNT_SECURITY
            </h2>
          </div>
          <div className="bg-surface-container-low rounded-lg overflow-hidden">
            {/* 2FA */}
            <div className="flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container-highest rounded-sm">
                  <span className="material-symbols-outlined text-primary">vibration</span>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wide">Two-Factor Authentication</p>
                  <p className="text-xs text-on-surface-variant">
                    Secure your terminal with TOTP or hardware keys
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] bg-primary-container/20 text-primary px-2 py-0.5 font-bold rounded-sm">
                  ACTIVE
                </span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between p-5 border-t border-outline-variant/10 hover:bg-surface-container-high transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container-highest rounded-sm">
                  <span className="material-symbols-outlined text-on-surface-variant">password</span>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wide">Master Password</p>
                  <p className="text-xs text-on-surface-variant">Last updated 14 days ago</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>

            {/* Biometrics */}
            <div className="flex items-center justify-between p-5 border-t border-outline-variant/10 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container-highest rounded-sm">
                  <span className="material-symbols-outlined text-on-surface-variant">fingerprint</span>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wide">Biometric Bypass</p>
                  <p className="text-xs text-on-surface-variant">
                    Use system-level biometric auth for fast entry
                  </p>
                </div>
              </div>
              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" defaultChecked type="checkbox" />
                <div className="w-10 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-on-surface-variant peer-checked:after:bg-primary after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/20" />
              </label>
            </div>
          </div>
        </section>

        {/* PREFERENCES Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-4 bg-primary" />
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant">
              PREFERENCES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Base Currency */}
            <div className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">payments</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                  open_in_new
                </span>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Base Currency
              </p>
              <p className="text-xl font-bold tracking-tight">
                USD <span className="text-primary-dim opacity-50 font-medium">($)</span>
              </p>
            </div>

            {/* Theme */}
            <div className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">dark_mode</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                  palette
                </span>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                UI Engine
              </p>
              <p className="text-xl font-bold tracking-tight">KINETIC DARK</p>
            </div>
          </div>

          {/* Terminal Alerts */}
          <div className="bg-surface-container-low rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container-highest rounded-sm">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    notifications_active
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wide">Terminal Alerts</p>
                  <p className="text-xs text-on-surface-variant">
                    Push, Email, and Webhook dispatch settings
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>
          </div>
        </section>

        {/* SYSTEM_CORE Section */}
        <section className="space-y-4 pb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-4 bg-primary" />
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant">
              SYSTEM_CORE
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Node Topology */}
            <div className="lg:col-span-2 bg-surface-container-low p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl">hub</span>
              </div>
              <h3 className="text-sm font-bold mb-4 tracking-wider">NODE_TOPOLOGY</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-surface-container-highest/50 p-3 rounded-sm border-l-2 border-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-mono">us-east-cluster-01.kinetic.io</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary">12ms</span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-highest/30 p-3 rounded-sm border-l-2 border-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-on-surface-variant/40" />
                    <span className="text-xs font-mono text-on-surface-variant">
                      eu-west-cluster-04.kinetic.io
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant">84ms</span>
                </div>
              </div>
              <button className="mt-6 text-[10px] font-bold tracking-[0.1em] uppercase text-primary flex items-center gap-1 hover:gap-2 transition-all">
                Manage Clusters{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* API Keys Card */}
            <div className="bg-primary-container p-6 rounded-lg flex flex-col justify-between group cursor-pointer hover:brightness-110 transition-all">
              <div>
                <span className="material-symbols-outlined text-on-primary-container text-4xl mb-4">
                  api
                </span>
                <h3 className="text-on-primary-container font-bold tracking-tight leading-tight">
                  API<br />KEYS
                </h3>
              </div>
              <div className="mt-8">
                <p className="text-[10px] font-bold text-on-primary-container/60 uppercase tracking-widest mb-1">
                  Active Keys
                </p>
                <p className="text-2xl font-bold text-on-primary-container">04</p>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOUT Section */}
        <section className="pb-12 pt-6">
          <form action={logoutAction}>
            <button
              className="w-full bg-surface-container-low border border-error/20 hover:bg-error/10 hover:border-error/50 text-error rounded-lg p-5 flex items-center justify-center gap-3 transition-colors group active:scale-95 duration-200"
              type="submit"
            >
              <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">
                logout
              </span>
              <span className="font-headline font-bold tracking-widest uppercase">
                Terminate Session
              </span>
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
