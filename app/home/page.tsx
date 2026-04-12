import { ReferenceScreen } from "@/components/reference-screen";

export default function HomePage() {
  return (
    <ReferenceScreen
      currentPath="/home"
      referenceFile="home.html"
      showShellNav={false}
      title="Home"
    />
  );
}
