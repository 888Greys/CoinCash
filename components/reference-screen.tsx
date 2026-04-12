import { AppNav } from "@/components/app-nav";

type ReferenceScreenProps = {
  title: string;
  referenceFile: string;
  currentPath?: string;
  showShellNav?: boolean;
};

export function ReferenceScreen({
  title,
  referenceFile,
  currentPath,
  showShellNav = true,
}: ReferenceScreenProps) {
  return (
    <main className="flex h-[100dvh] flex-col bg-background">
      {showShellNav && <AppNav currentPath={currentPath} />}
      <div className="relative min-h-0 flex-1">
        <iframe
          aria-label={title}
          className="absolute inset-0 h-full w-full border-0"
          src={`/reference-designs/${referenceFile}`}
          title={title}
        />
      </div>
    </main>
  );
}
