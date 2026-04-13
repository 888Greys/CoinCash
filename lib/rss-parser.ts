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

export type TutorialItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: "Video" | "Guide";
  duration: string;
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

function estimateDuration(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(3, Math.round(words / 180));
  return `${mins} min ${mins <= 6 ? "read" : "watch"}`;
}

function inferLevel(title: string): TutorialItem["level"] {
  const lower = title.toLowerCase();
  if (lower.includes("advanced") || lower.includes("strategy") || lower.includes("derivatives")) return "Advanced";
  if (lower.includes("guide") || lower.includes("trading") || lower.includes("analysis")) return "Intermediate";
  return "Beginner";
}

function inferFormat(link: string, title: string): TutorialItem["format"] {
  const merged = `${link} ${title}`.toLowerCase();
  if (merged.includes("youtube") || merged.includes("youtu.be") || merged.includes("video")) return "Video";
  return "Guide";
}

export async function fetchLearningFeed(): Promise<TutorialItem[]> {
  const feeds = [
    { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", source: "CoinDesk Learn" },
    { url: "https://cointelegraph.com/rss/tag/education", source: "Cointelegraph" },
  ];

  try {
    const collected: TutorialItem[] = [];

    for (const feedSource of feeds) {
      try {
        const feed = await parser.parseURL(feedSource.url);
        const mapped = feed.items.slice(0, 4).map((item) => {
          const title = item.title || "Crypto tutorial";
          const snippet = item.contentSnippet || item.content || "";
          const format = inferFormat(item.link || "", title);

          return {
            title,
            link: item.link || "#",
            pubDate: item.pubDate || new Date().toISOString(),
            source: feedSource.source,
            level: inferLevel(title),
            format,
            duration: estimateDuration(snippet || title),
          } satisfies TutorialItem;
        });

        collected.push(...mapped);
      } catch {
        // Continue to next source if one feed is unavailable.
      }
    }

    if (collected.length > 0) {
      return collected
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .slice(0, 6);
    }

    return fallbackLearningFeed();
  } catch (error) {
    console.error("Failed to fetch learning feed:", error);
    return fallbackLearningFeed();
  }
}

function fallbackLearningFeed(): TutorialItem[] {
  return [
    {
      title: "How to Place Your First P2P Trade Safely",
      link: "/p2p",
      pubDate: new Date().toISOString(),
      source: "CoinCash Guides",
      level: "Beginner",
      format: "Guide",
      duration: "4 min read",
    },
    {
      title: "Reading Market Structure Before Entering a Trade",
      link: "/markets",
      pubDate: new Date(Date.now() - 3600000).toISOString(),
      source: "CoinCash Academy",
      level: "Intermediate",
      format: "Guide",
      duration: "6 min read",
    },
    {
      title: "Managing Risk with Funding and Spot Wallet Transfers",
      link: "/assets",
      pubDate: new Date(Date.now() - 7200000).toISOString(),
      source: "CoinCash Academy",
      level: "Advanced",
      format: "Guide",
      duration: "5 min read",
    },
  ];
}
