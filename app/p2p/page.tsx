import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/utils/supabase/server";
import { getActiveOrders } from "./actions";
import { isAdminEmail } from "@/lib/admin";

export const metadata: Metadata = { title: "P2P Trading" };

type Props = {
  searchParams: { tab?: string; asset?: string; fiat?: string; myAdToast?: string };
};

type MockAd = {
  username: string;
  trades: string;
  completion: string;
  price: string;
  minLimit: string;
  maxLimit: string;
  available: string;
  paymentMethods: string[];
};

const MOCK_ADS: MockAd[] = [
  {
    username: "emmakmanu57",
    trades: "2,586",
    completion: "99.40%",
    price: "95.20",
    minLimit: "1,000",
    maxLimit: "100,000",
    available: "3,000",
    paymentMethods: ["M-Pesa", "Airtel Money"],
  },
  {
    username: "Crypto_Queen",
    trades: "954",
    completion: "98.15%",
    price: "96.80",
    minLimit: "5,000",
    maxLimit: "100,000",
    available: "2,400",
    paymentMethods: ["M-Pesa", "Bank"],
  },
  {
    username: "Swift_Exchange",
    trades: "4,210",
    completion: "99.88%",
    price: "97.90",
    minLimit: "50,000",
    maxLimit: "1,500,000",
    available: "8,600",
    paymentMethods: ["Bank", "Airtel Money"],
  },
];

type AdCardProps = {
  username: string;
  tradesLabel: string;
  completion: string;
  priceLabel: string;
  fiat: string;
  asset: string;
  minLimitLabel: string;
  maxLimitLabel: string;
  availableLabel: string;
  paymentMethods: string[];
  ctaLabel: string;
  ctaHref?: string;
  isPromoted?: boolean;
};

function AdCard({
  username,
  tradesLabel,
  completion,
  priceLabel,
  fiat,
  asset,
  minLimitLabel,
  maxLimitLabel,
  availableLabel,
  paymentMethods,
  ctaLabel,
  ctaHref,
  isPromoted,
}: AdCardProps) {
  return (
    <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm">
      {isPromoted && (
        <div className="mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <h2 className="font-headline font-bold text-on-surface">Promoted Ad</h2>
        </div>
      )}

      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/25 bg-surface-container-highest font-bold uppercase text-on-surface">
            {username.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-on-surface">{username}</span>
              <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div className="flex gap-2 text-[11px] text-on-surface-variant">
              <span>{tradesLabel} Trades</span>
              <span className="font-semibold text-primary-container">{completion}</span>
            </div>
          </div>
        </div>
        <div className="rounded bg-secondary-container/40 px-2 py-0.5 text-[10px] font-medium text-on-secondary-container">15 min</div>
      </div>

      <div className="mb-5">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">Price</div>
        <div className="flex items-baseline gap-1">
          <span className="font-headline text-2xl font-extrabold text-on-surface">{priceLabel}</span>
          <span className="text-xs font-medium text-on-surface-variant">{fiat}/{asset}</span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] text-on-surface-variant">Limit</div>
          <div className="text-xs font-semibold text-on-surface">
            {fiat} {minLimitLabel} - {maxLimitLabel}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-on-surface-variant">Available</div>
          <div className="text-xs font-semibold text-on-surface">
            {availableLabel} {asset}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="mt-1 flex max-w-[210px] flex-wrap gap-1.5">
          {paymentMethods.map((method, i) => (
            <div key={`${username}-${method}-${i}`} className="flex items-center gap-1.5 rounded-md bg-surface-container-low px-2 py-1">
              <div className={`h-3 w-1 rounded-full ${i % 2 === 0 ? "bg-[#FFCC00]" : "bg-primary"}`} />
              <span className="text-[10px] font-bold text-on-surface-variant">{method}</span>
            </div>
          ))}
        </div>

        {ctaHref ? (
          <Link
            href={ctaHref}
            className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-container active:scale-95"
          >
            {ctaLabel}
          </Link>
        ) : (
          <button type="button" className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-white transition-all active:scale-95">
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default async function P2PPage({ searchParams }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(user?.email);

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const currentTab = searchParams.tab === "sell" ? "sell" : "buy";
  const adTypeToFetch = currentTab === "buy" ? "sell" : "buy";
  const currentAsset = searchParams.asset || "USDT";
  const currentFiat = searchParams.fiat || "KES";

  const orders = await getActiveOrders(adTypeToFetch, currentAsset, currentFiat);
  const promotedOrder = orders.length > 0 ? orders[0] : null;
  const listOrders = orders.length > 1 ? orders.slice(1) : [];

  const minimumVisibleAds = 16;
  const fallbackSlots = Math.max(0, minimumVisibleAds - (promotedOrder ? 1 : 0) - listOrders.length);
  const fallbackAds = Array.from({ length: fallbackSlots }, (_, index) => {
    const source = MOCK_ADS[index % MOCK_ADS.length];
    return {
      ...source,
      username: `${source.username}${index >= MOCK_ADS.length ? index + 1 : ""}`,
    };
  });

  const orderHref = (orderId: string, username: string | null, price: number, asset: string, fiat: string) =>
    `/p2p/${currentTab}?order=${orderId}&merchant=${encodeURIComponent(username || "Trader")}&price=${price}&asset=${asset}&fiat=${fiat}`;

  return (
    <AppShell currentPath="/p2p" user={user ? { email: user.email, ...profile, isAdmin } : null}>
      <div className="mx-auto max-w-5xl px-4 pt-5 md:px-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="font-headline text-2xl font-bold tracking-tight text-on-surface">P2P</span>
            <span className="cursor-pointer font-headline text-lg font-bold text-on-surface-variant opacity-50 transition-opacity hover:opacity-100">
              Express
            </span>
            <span className="cursor-pointer font-headline text-lg font-bold text-on-surface-variant opacity-50 transition-opacity hover:opacity-100">
              Block Trade
            </span>
          </div>
          <div className="w-max cursor-pointer rounded-full bg-secondary-container/30 px-3 py-1 text-sm font-medium text-primary transition-opacity hover:opacity-80">
            {currentFiat}
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex rounded-full bg-surface-container-highest p-1">
              <Link
                href="?tab=buy"
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                  currentTab === "buy" ? "bg-inverse-surface text-inverse-on-surface" : "text-on-surface-variant"
                }`}
              >
                Buy
              </Link>
              <Link
                href="?tab=sell"
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                  currentTab === "sell" ? "bg-inverse-surface text-inverse-on-surface" : "text-on-surface-variant"
                }`}
              >
                Sell
              </Link>
            </div>
            <div className="flex gap-2">
              <Link
                href="/p2p/orders"
                className="material-symbols-outlined cursor-pointer rounded-full bg-secondary-container p-2 text-xl text-primary"
              >
                history
              </Link>
              <span className="material-symbols-outlined cursor-pointer rounded-full bg-secondary-container p-2 text-xl text-primary">
                more_horiz
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-surface-container-highest px-3 py-2 text-sm font-medium">
              {currentAsset}
              <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
            </div>
            <div className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-surface-container-highest px-3 py-2 text-sm font-medium">
              Amount
              <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
            </div>
            <div className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-surface-container-highest px-3 py-2 text-sm font-medium">
              Payment
              <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-lg bg-secondary-container p-2">
              <span className="material-symbols-outlined text-xl text-primary">filter_list</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pb-28">
          <div className="space-y-4">
            {promotedOrder && (
              <AdCard
                isPromoted
                username={promotedOrder.profiles?.username || "Premium_Trader"}
                tradesLabel="2,586"
                completion="99.40%"
                priceLabel={promotedOrder.price.toFixed(2)}
                fiat={promotedOrder.fiat}
                asset={promotedOrder.asset}
                minLimitLabel={promotedOrder.min_limit.toLocaleString()}
                maxLimitLabel={promotedOrder.max_limit.toLocaleString()}
                availableLabel={promotedOrder.total_amount.toLocaleString()}
                paymentMethods={promotedOrder.payment_method.split(",").map((m) => m.trim())}
                ctaLabel={currentTab === "buy" ? "Buy" : "Sell"}
                ctaHref={orderHref(
                  promotedOrder.id,
                  promotedOrder.profiles?.username ?? null,
                  promotedOrder.price,
                  promotedOrder.asset,
                  promotedOrder.fiat
                )}
              />
            )}

            {listOrders.map((order) => (
              <AdCard
                key={order.id}
                username={order.profiles?.username || "Trader"}
                tradesLabel="954"
                completion="98.15%"
                priceLabel={order.price.toFixed(2)}
                fiat={order.fiat}
                asset={order.asset}
                minLimitLabel={order.min_limit.toLocaleString()}
                maxLimitLabel={order.max_limit.toLocaleString()}
                availableLabel={order.total_amount.toLocaleString()}
                paymentMethods={order.payment_method.split(",").map((m) => m.trim())}
                ctaLabel={currentTab === "buy" ? "Buy" : "Sell"}
                ctaHref={orderHref(order.id, order.profiles?.username ?? null, order.price, order.asset, order.fiat)}
              />
            ))}

            {fallbackAds.map((ad, index) => (
              <AdCard
                key={`mock-${ad.username}-${index}`}
                username={ad.username}
                tradesLabel={ad.trades}
                completion={ad.completion}
                priceLabel={ad.price}
                fiat={currentFiat}
                asset={currentAsset}
                minLimitLabel={ad.minLimit}
                maxLimitLabel={ad.maxLimit}
                availableLabel={ad.available}
                paymentMethods={ad.paymentMethods}
                ctaLabel={currentTab === "buy" ? "Buy" : "Sell"}
              />
            ))}

            {orders.length === 0 && fallbackAds.length > 0 && (
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-center text-xs text-on-surface-variant">
                Showing featured sample ads while live {currentAsset} offers load for {currentFiat}.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
