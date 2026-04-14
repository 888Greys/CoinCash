"use client";

import Image from "next/image";
import { useState } from "react";

type MarketAsset = {
  symbol: string;
  name: string;
  logo: string;
  price: string;
  change: string;
  isPositive: boolean;
  volume: string;
  marketCap: string;
  sparkline: string;
  color: string;
};

export function MarketsTable({ assets, totalCount }: { assets: MarketAsset[]; totalCount: number }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? assets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(query.toLowerCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase())
      )
    : assets;

  return (
    <>
      {/* Search */}
      <div className="relative w-full md:w-80 group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">search</span>
        </div>
        <input
          className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 text-on-surface text-xs font-label uppercase tracking-widest pl-10 py-3 rounded-sm outline outline-1 outline-outline-variant/15 transition-all"
          placeholder="SEARCH ASSETS..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="absolute inset-y-0 right-3 flex items-center text-on-surface-variant hover:text-on-surface"
            onClick={() => setQuery("")}
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-surface-container-low overflow-hidden mt-0">
        {/* Tab Filters */}
        <div className="flex border-b border-outline-variant/15 px-6">
          <button className="px-6 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-primary border-b-2 border-primary transition-all">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    No assets match &ldquo;{query}&rdquo;
                  </td>
                </tr>
              ) : (
                filtered.map((asset) => (
                  <tr
                    key={asset.symbol}
                    className="hover:bg-surface-bright transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-headline text-xs ${asset.color}`}>
                          {asset.logo ? (
                            <Image src={asset.logo} alt={asset.name} width={24} height={24} unoptimized />
                          ) : (
                            asset.symbol[0]
                          )}
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
                      <div className="font-label text-xs text-on-surface-variant">{asset.marketCap}</div>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center px-6 py-4 bg-surface-container-low border-t border-outline-variant/10">
          <div className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest">
            {query ? `${filtered.length} of ${totalCount} Assets` : `${totalCount} Assets`}
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
    </>
  );
}
