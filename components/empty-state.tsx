import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon = "inbox",
  actionLabel,
  actionHref,
  className = "",
}: EmptyStateProps) {
  const hasAction = !!actionLabel && !!actionHref;

  return (
    <div className={`relative bg-surface-container-low p-10 sm:p-12 text-center space-y-4 border border-outline-variant/10 rounded-sm overflow-hidden ${className}`}>
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(92,253,128,0.03) 0%, transparent 70%)" }} />
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant/10 mx-auto">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">{icon}</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface">{title}</h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">{description}</p>
        </div>
        {hasAction && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 mt-1 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-primary/20 transition-colors"
          >
            {actionLabel}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        )}
      </div>
    </div>
  );
}

