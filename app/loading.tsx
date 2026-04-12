export default function Loading() {
  return (
    <main className="relative z-[100] flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-surface text-on-surface selection:bg-primary selection:text-on-primary">
      <div className="terminal-grid absolute inset-0" />
      <div className="vignette absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            Coin<span className="text-primary">Cash</span>
          </h1>
          <div className="splash-bar-track mx-auto mt-3 h-1 w-12 overflow-hidden rounded-full">
            <div className="splash-bar-fill kinetic-gradient h-full w-full rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
