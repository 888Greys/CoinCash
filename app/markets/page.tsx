import { AppShell } from "@/components/app-shell";
import { getMockData, MarketRow } from "@/lib/mock-api";

const sparklines = {
  btcDown: "M0,15 L10,18 L20,12 L30,22 L40,15 L50,18 L60,10 L70,12 L80,15",
  ethUp: "M0,25 L10,22 L20,24 L30,12 L40,15 L50,5 L60,10 L70,8 L80,2",
  solUp: "M0,30 L10,25 L20,28 L30,15 L40,20 L50,8 L60,12 L70,2 L80,5",
  avaxDown: "M0,5 L10,8 L20,4 L30,15 L40,12 L50,25 L60,20 L70,30 L80,28",
  linkUp: "M0,15 L10,14 L20,16 L30,12 L40,14 L50,11 L60,13 L70,10 L80,9",
};

type MarketAsset = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePositive: boolean;
  volume: string;
  marketCap: string;
  sparkline: string;
  color: string;
};

const marketData: MarketAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$42,912.40",
    change: "-0.42%",
    changePositive: false,
    volume: "$28.4B",
    marketCap: "$842.1B",
    sparkline: sparklines.btcDown,
    color: "text-primary",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$2,314.15",
    change: "+2.18%",
    changePositive: true,
    volume: "$14.2B",
    marketCap: "$278.4B",
    sparkline: sparklines.ethUp,
    color: "text-tertiary",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$114.82",
    change: "+14.2%",
    changePositive: true,
    volume: "$4.8B",
    marketCap: "$48.9B",
    sparkline: sparklines.solUp,
    color: "text-secondary",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: "$34.12",
    change: "-3.82%",
    changePositive: false,
    volume: "$842M",
    marketCap: "$12.5B",
    sparkline: sparklines.avaxDown,
    color: "text-error",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    price: "$18.94",
    change: "+1.04%",
    changePositive: true,
    volume: "$512M",
    marketCap: "$11.1B",
    sparkline: sparklines.linkUp,
    color: "text-primary-dim",
  },
];

const spotlightCards = [
  {
    label: "Top Gainer",
    badge: "+14.2%",
    badgeColor: "text-primary",
    pair: "SOL/USDT",
    price: "$114.82",
    sparkline: sparklines.solUp,
    strokeColor: "stroke-primary",
  },
  {
    label: "High Volume",
    badge: "$4.2B",
    badgeColor: "text-on-surface",
    pair: "BTC/USDT",
    price: "$42,912.40",
    sparkline: sparklines.btcDown,
    strokeColor: "stroke-on-surface-variant",
  },
  {
    label: "New Listing",
    badge: "Active",
    badgeColor: "text-tertiary",
    pair: "TIA/USDT",
    price: "$18.45",
    sparkline: "M0,28 L10,20 L20,22 L30,10 L40,12 L50,5 L60,8 L70,1 L80,3",
    strokeColor: "stroke-tertiary",
  },
];

export default async function MarketsPage() {
  const asyncMarketData = await getMockData<MarketRow[]>("markets", 1500);

  return (
    <AppShell currentPath="/markets">
      <div className="px-4 md:px-8 pt-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
              MARKET_OVERVIEW
            </h1>
            <div className="flex items-center gap-4 text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
              <span>Global Vol: $84.2B</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span>BTC Dom: 52.4%</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span className="text-primary">Gas: 18 Gwei</span>
            </div>
          </div>
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">search</span>
            </div>
            <input
              className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 text-on-surface text-xs font-label uppercase tracking-widest pl-10 py-3 rounded-sm outline outline-1 outline-outline-variant/15 transition-all"
              placeholder="SEARCH ASSETS..."
              type="text"
            />
          </div>
        </div>

        {/* Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {spotlightCards.map((card) => (
            <div
              key={card.pair}
              className="bg-surface-container-low p-5 flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  {card.label}
                </span>
                <span className={`${card.badgeColor} text-xs font-bold`}>
                  {card.badge}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-headline text-2xl font-bold">{card.pair}</div>
                  <div className="font-headline text-lg text-on-surface-variant">
                    {card.price}
                  </div>
                </div>
                <svg className={`w-20 h-8 fill-none ${card.strokeColor}`} strokeWidth="1.5" viewBox="0 0 80 32">
                  <path d={card.sparkline} />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Market Table */}
        <div className="bg-surface-container-low overflow-hidden">
          {/* Tab Filters */}
          <div className="flex border-b border-outline-variant/15 px-6">
            <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] bg-surface-bright text-on-surface transition-all">
              All
            </button>
            <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-all">
              Favorites
            </button>
            <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-all">
              Hot
            </button>
            <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-all">
              New Listings
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                  <th className="px-6 py-4 font-medium">Asset</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">24h Change</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">24h Volume</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Market Cap</th>
                  <th className="px-6 py-4 font-medium text-right">Last 7 Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {asyncMarketData.map((asset) => (
                  <tr
                    key={asset.symbol}
                    className="hover:bg-surface-bright transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-headline text-xs text-primary`}>
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <div className="font-headline font-bold text-sm">{asset.symbol}</div>
                          <div className="font-label text-[9px] text-on-surface-variant tracking-widest uppercase">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-headline font-bold">{asset.price}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`font-label text-xs font-bold ${asset.isPositive ? "text-primary" : "text-error"}`}>
                        {asset.change}
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="font-label text-xs text-on-surface-variant">{asset.volume}</div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="font-label text-xs text-on-surface-variant">$20.2B</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <svg
                          className={`w-20 h-8 fill-none ${asset.isPositive ? "stroke-primary" : "stroke-error"} opacity-70 group-hover:opacity-100 transition-opacity`}
                          strokeWidth="1.5"
                          viewBox="0 0 80 32"
                        >
                          <path d={asset.sparkline} />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex justify-between items-center px-6 py-4 bg-surface-container-low border-t border-outline-variant/10">
            <div className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest">
              Showing 1-5 of 142 Assets
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-surface-container-high hover:bg-surface-bright transition-colors rounded-sm group">
                <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary">
                  chevron_left
                </span>
              </button>
              <button className="p-2 bg-surface-container-high hover:bg-surface-bright transition-colors rounded-sm group">
                <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
