import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: {
    default: "CoinCash — P2P Crypto Exchange",
    template: "%s | CoinCash",
  },
  description: "Trade crypto peer-to-peer with zero intermediaries. Instant settlement, AI trading bots, and bank-grade security.",
  keywords: ["crypto", "p2p", "exchange", "bitcoin", "usdt", "trading", "coinCash"],
  openGraph: {
    title: "CoinCash — The Future of P2P Exchange",
    description: "Trade crypto directly with peers worldwide. Zero intermediaries, atomic escrow settlement, and AI-powered trading bots.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitScript = `
    (function () {
      try {
        var key = "coincash-theme";
        var saved = window.localStorage.getItem(key);
        var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        var mode = saved === "light" || saved === "dark" ? saved : (prefersLight ? "light" : "dark");
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(mode);
      } catch (e) {
        document.documentElement.classList.add("dark");
      }
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-surface text-on-surface`}>
        {children}
      </body>
    </html>
  );
}
