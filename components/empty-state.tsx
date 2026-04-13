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
    <div className={`bg-surface-container-low p-10 sm:p-12 text-center space-y-3 border border-outline-variant/10 rounded-sm ${className}`}>
      <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">{icon}</span>
      <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-md mx-auto">{description}</p>
      {hasAction && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 mt-2 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-primary/20 transition-colors"
        >
          {actionLabel}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      )}
    </div>
  );
}
