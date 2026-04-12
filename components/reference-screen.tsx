import { AppNav } from "@/components/app-nav";

type ReferenceScreenProps = {
  title: string;
  referenceFile: string;
  currentPath?: string;
};

export function ReferenceScreen({ title, referenceFile, currentPath }: ReferenceScreenProps) {
  return (
    <main className="min-h-screen bg-background">
      <AppNav currentPath={currentPath} />
      <iframe
        aria-label={title}
        className="h-[calc(100vh-4rem)] w-full border-0"
        src={`/reference-designs/${referenceFile}`}
        title={title}
      />
    </main>
  );
}
