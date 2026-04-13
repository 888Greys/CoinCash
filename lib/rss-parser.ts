import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  image?: string;
  source: string;
  contentSnippet?: string;
};

export async function fetchCryptoNews(): Promise<NewsItem[]> {
  try {
    // Coindesk RSS feed is reliable for crypto news
    const feedUrl = "https://www.coindesk.com/arc/outboundfeeds/rss/";
    const feed = await parser.parseURL(feedUrl);
    
    return feed.items.slice(0, 5).map(item => {
      // Extract image from media:content or standard enclosures
      let imageUrl = "";
      if (item.mediaContent && item.mediaContent['$'] && item.mediaContent['$'].url) {
        imageUrl = item.mediaContent['$'].url;
      } else if (item.enclosure && item.enclosure.url) {
        imageUrl = item.enclosure.url;
      }
      
      return {
        title: item.title || "Crypto News",
        link: item.link || "#",
        pubDate: item.pubDate || new Date().toISOString(),
        source: "CoinDesk",
        contentSnippet: item.contentSnippet,
        image: imageUrl || "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=200", // fallback crypto image
      };
    });
  } catch (error) {
    console.error("Failed to fetch RSS feed:", error);
    return fallbackNews();
  }
}

function fallbackNews(): NewsItem[] {
  return [
    {
      title: "Bitcoin hits new local highs as institutional inflows continue",
      link: "#",
      pubDate: new Date().toISOString(),
      source: "Market Update",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkbd7zfg4nMXZArP8UKA7v54FugeaM4-TGqlwL_yGLaVM2j6D9UAmKcNdfG_cwkHkLnMxuPdo3vU5PNMiPBXy-aw979WwefDkJt3THO2deWOkCh6CK-n1icSaH-67y9dRVuyBlQxv9GhCXfZRKqcgWJwn45FRj0WDTzYfdwZ4Y9NpUU5IYoHGsHFJrcnS88gp6i60ejK3iVxucSqNTr_uVG7CP8ikJ0wtEXvl6AVqPrU3c8Buy3E15GeA30GOGLsULTIf5ZRG5up8"
    },
    {
      title: "Regulatory frameworks taking shape across multiple jurisdictions",
      link: "#",
      pubDate: new Date(Date.now() - 3600000).toISOString(),
      source: "Regulation",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDabwGP1q41DhaMxlaazRAlkl-Gl8WHPVLIrSir5TczabYDC_MKeTofyCF9vpM3NKAV3EUG1eYqZKQQ8rhQtxHBhWwNFjP9kOzyCzEZs2M5yeDGlBwY_bnkvJSxCW-0-9UtYmTkeQcC5nm-rVZn26KC-jpBIyxYvmEEVXVbjL2PnBNx6ZnIB2yEkW_tnYw1fPQGaXKNvJS_a6gbPXq2NWm95z7aH-dYfn-2celsCMuLC9fK9a-XjSDKGTACqeawT3lgUUQUGqFvBk"
    }
  ];
}
