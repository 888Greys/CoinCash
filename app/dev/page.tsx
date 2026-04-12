import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { referenceLibrary, wiredRoutes } from "@/lib/wired-routes";

export default function DevPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AppNav />
      <main className="px-6 py-10 md:py-12">
        <div className="mx-auto max-w-5xl space-y-10">
          <section className="space-y-4">
            <p className="font-label text-xs font-bold uppercase tracking-[0.25em] text-primary">
              HTML-First Migration
            </p>
            <h1 className="font-headline text-4xl font-bold tracking-tight">
              Preserve The Original CoinCash UI, Add App Structure Carefully
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-on-surface-variant">
              This app shell exists to migrate the static CoinCash reference screens into Next.js
              without redesigning them. The original HTML files remain available as reference pages
              under <code> /public/reference-designs</code>.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Link
              className="rounded-lg border border-primary/20 bg-surface-container-low p-6 transition-colors hover:bg-surface-container-high"
              href="/splash"
            >
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Launch Flow
              </p>
              <h2 className="mt-2 font-headline text-2xl font-bold">Splash Screen</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Custom CoinCash entry screen with the preserved animated underline loader.
              </p>
            </Link>

            <Link
              className="rounded-lg border border-primary/20 bg-surface-container-low p-6 transition-colors hover:bg-surface-container-high"
              href="/login"
            >
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Native Route
              </p>
              <h2 className="mt-2 font-headline text-2xl font-bold">Login</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                First auth screen migrated natively into Next.js with CoinCash branding.
              </p>
            </Link>

            <Link
              className="rounded-lg border border-primary/20 bg-surface-container-low p-6 transition-colors hover:bg-surface-container-high"
              href="/register"
            >
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Native Route
              </p>
              <h2 className="mt-2 font-headline text-2xl font-bold">Register</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Account creation flow migrated natively while keeping the original composition.
              </p>
            </Link>
          </section>

          <section className="space-y-4">
            <div>
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Product Routes
              </p>
              <h2 className="mt-2 font-headline text-2xl font-bold">Navigate The CoinCash App</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant">
                The shared app navigation now connects the full route map inside Next.js. Native
                pages are replacing reference-backed pages incrementally, starting with auth.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {wiredRoutes.map((route) => (
                <Link
                  key={route.href}
                  className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-6 transition-colors hover:bg-surface-container-high"
                  href={route.href}
                >
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {route.referenceFile}
                  </p>
                  <h3 className="mt-2 font-headline text-2xl font-bold">{route.title}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant">{route.description}</p>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    {route.href}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Reference Library
              </p>
              <h2 className="mt-2 font-headline text-2xl font-bold">Preserved HTML Screens</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {referenceLibrary.map((file) => (
                <a
                  key={file}
                  className="rounded-sm border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm transition-colors hover:bg-surface-container-high"
                  href={`/reference-designs/${file}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {file}
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
