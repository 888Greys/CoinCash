import Link from "next/link";

type AppNavProps = {
  currentPath?: string;
};

export function AppNav({ currentPath: _currentPath }: AppNavProps) {
  return (
    <header className="flex-shrink-0 border-b border-outline-variant/15 bg-[#0b0e11]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
        <Link
          className="font-headline text-xl font-bold tracking-tight text-on-surface"
          href="/"
        >
          Coin<span className="text-primary">Cash</span>
        </Link>
      </div>
    </header>
  );
}
