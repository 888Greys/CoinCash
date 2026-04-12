import { ReferenceScreen } from "@/components/reference-screen";

export default function BotPage() {
  return (
    <ReferenceScreen
      currentPath="/bot"
      hideReferenceBottomNav={false}
      referenceFile="bot.html"
      title="Trading Bots"
    />
  );
}
