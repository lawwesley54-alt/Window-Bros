import type { Sale } from "../types";
import type { SaleSearchParams, SaleSourceAdapter } from "./types";
import { reverseGeocodeCity } from "../lib/geocode";
import { guessCategory } from "../lib/categorize";

const HOUR_MS = 60 * 60 * 1000;

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  permalink: string;
  createdUtcSeconds: number;
}

interface RedditListingResponse {
  data?: {
    children?: Array<{
      data?: {
        id?: string;
        title?: string;
        selftext?: string;
        permalink?: string;
        created_utc?: number;
      };
    }>;
  };
}

/** Pure, testable parser for a reddit search.json listing response. */
export function parseRedditListings(json: unknown): RedditPost[] {
  const response = json as RedditListingResponse | null | undefined;
  const children = response?.data?.children ?? [];

  return children
    .map((child) => child.data)
    .filter((post): post is NonNullable<typeof post> => Boolean(post?.permalink && post.title))
    .map((post) => ({
      id: post.id ?? post.permalink!,
      title: post.title!,
      selftext: post.selftext ?? "",
      permalink: post.permalink!,
      createdUtcSeconds: post.created_utc ?? Date.now() / 1000,
    }));
}

/** Best-effort subreddit name guess from a city name (e.g. "San Francisco" -> "sanfrancisco"). */
export function citySubreddit(cityName: string): string {
  return cityName.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export const redditAdapter: SaleSourceAdapter = {
  id: "reddit",
  label: "Reddit (local subreddit search)",
  async fetchSales(params: SaleSearchParams): Promise<Sale[]> {
    const cityName = await reverseGeocodeCity(params);
    if (!cityName) return [];

    const subreddit = citySubreddit(cityName);
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=garage+sale+OR+estate+sale+OR+yard+sale&restrict_sr=1&sort=new&limit=25`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];

    const posts = parseRedditListings(await res.json());

    return posts.map((post) => {
      const postedAt = new Date(post.createdUtcSeconds * 1000).toISOString();
      const startsAt = postedAt;
      const endsAt = new Date(post.createdUtcSeconds * 1000 + 4 * HOUR_MS).toISOString();
      const text = `${post.title} ${post.selftext}`;

      const sale: Sale = {
        id: `reddit-${post.id}`,
        title: post.title,
        category: guessCategory(text),
        address: `Somewhere near ${cityName} — see post for exact address`,
        lat: params.lat,
        lng: params.lng,
        startsAt,
        endsAt,
        source: "reddit",
        sourceUrl: `https://www.reddit.com${post.permalink}`,
        description:
          "Location approximated to your search area — Reddit posts rarely include a structured address. Open the post to confirm details.",
        postedAt,
        updatedAt: postedAt,
        corroboratingSources: 1,
        votes: { stillHere: 0, over: 0 },
      };
      return sale;
    });
  },
};
