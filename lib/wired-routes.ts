export type AppNavRoute = {
  href: string;
  label: string;
};

export const appNavRoutes: AppNavRoute[] = [
  { href: "/home", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/bot", label: "Bot" },
  { href: "/p2p", label: "P2P" },
  { href: "/assets", label: "Assets" },
  { href: "/payment-methods", label: "Payments" },
  { href: "/notifications", label: "Activity" },
  { href: "/settings", label: "Settings" },
];
