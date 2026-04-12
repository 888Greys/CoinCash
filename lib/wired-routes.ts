export type WiredRoute = {
  href: string;
  title: string;
  description: string;
  referenceFile: string;
};

export type AppNavRoute = {
  href: string;
  label: string;
};

export const wiredRoutes: WiredRoute[] = [
  {
    href: "/splash",
    title: "Splash Screen",
    description: "Custom migrated splash screen with the animated CoinCash underline.",
    referenceFile: "13.html",
  },
  {
    href: "/login",
    title: "Login",
    description: "Native CoinCash login page migrated from the preserved login reference.",
    referenceFile: "12.html",
  },
  {
    href: "/register",
    title: "Register",
    description: "Native CoinCash registration page migrated from the preserved signup reference.",
    referenceFile: "14.html",
  },
  {
    href: "/markets",
    title: "Markets",
    description: "Market overview terminal wired to the preserved markets reference.",
    referenceFile: "7.html",
  },
  {
    href: "/p2p",
    title: "P2P Marketplace",
    description: "Peer-to-peer marketplace dashboard wired to the preserved reference.",
    referenceFile: "1.html",
  },
  {
    href: "/p2p/merchant/alpha-desk",
    title: "Merchant Profile",
    description: "Merchant profile route wired to the preserved merchant reference.",
    referenceFile: "2.html",
  },
  {
    href: "/p2p/post-ad",
    title: "Post Ad",
    description: "Merchant ad creation flow wired to the preserved posting reference.",
    referenceFile: "3.html",
  },
  {
    href: "/p2p/order/demo-order",
    title: "P2P Order",
    description: "Order and chat screen wired to the preserved trade-flow reference.",
    referenceFile: "4.html",
  },
  {
    href: "/p2p/buy",
    title: "Buy USDT",
    description: "Buy flow screen wired to the preserved transaction reference.",
    referenceFile: "5.html",
  },
  {
    href: "/assets",
    title: "Assets",
    description: "Portfolio and balances screen wired to the preserved assets reference.",
    referenceFile: "6.html",
  },
  {
    href: "/payment-methods",
    title: "Payment Methods",
    description: "Payout and linked payment methods screen wired to the preserved reference.",
    referenceFile: "8.html",
  },
  {
    href: "/notifications",
    title: "Notifications",
    description: "System logs and notifications screen wired to the denser reference.",
    referenceFile: "10.html",
  },
  {
    href: "/settings",
    title: "Settings",
    description: "Security and system configuration screen wired to the preserved reference.",
    referenceFile: "11.html",
  },
];

export const referenceLibrary = [
  "1.html",
  "2.html",
  "3.html",
  "4.html",
  "5.html",
  "6.html",
  "7.html",
  "8.html",
  "9.html",
  "10.html",
  "11.html",
  "12.html",
  "13.html",
  "14.html",
];

export const appNavRoutes: AppNavRoute[] = [
  { href: "/home", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/p2p", label: "P2P" },
  { href: "/assets", label: "Assets" },
  { href: "/payment-methods", label: "Payments" },
  { href: "/notifications", label: "Logs" },
  { href: "/settings", label: "Settings" },
];
