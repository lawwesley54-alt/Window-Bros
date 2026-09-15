import type { Sale } from "../types";
import type { SaleSearchParams, SaleSourceAdapter } from "./types";
import { geocodeAddress, reverseGeocodeCity } from "../lib/geocode";
import { guessCategory } from "../lib/categorize";
import { extractAddress, extractTimeWindow } from "../lib/extractDetails";

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
    const sales: Sale[] = [];

    // Sequential, not parallel: geocoding respects Nominatim's ~1 req/sec
    // policy, and only runs at all for posts where an address was found.
    for (const post of posts) {
      const postedAt = new Date(post.createdUtcSeconds * 1000).toISOString();
      const text = `${post.title} ${post.selftext}`;

      const timeWindow = extractTimeWindow(text, new Date(postedAt));
      const startsAt = timeWindow?.startsAt ?? postedAt;
      const endsAt =
        timeWindow?.endsAt ??
        new Date(post.createdUtcSeconds * 1000 + 4 * HOUR_MS).toISOString();

      const foundAddress = extractAddress(text);
      let lat = params.lat;
      let lng = params.lng;
      let address = `Somewhere near ${cityName} — see post for exact address`;

      if (foundAddress) {
        address = `${foundAddress}, ${cityName}`;
        const geocoded = await geocodeAddress(`${foundAddress}, ${cityName}`).catch(() => null);
        if (geocoded) {
          lat = geocoded.lat;
          lng = geocoded.lng;
        }
      }

      const notes: string[] = [];
      if (!timeWindow) notes.push("time window guessed from when the post appeared");
      if (!foundAddress) notes.push("no address found in the post text");

      sales.push({
        id: `reddit-${post.id}`,
        title: post.title,
        category: guessCategory(text),
        address,
        lat,
        lng,
        startsAt,
        endsAt,
        source: "reddit",
        sourceUrl: `https://www.reddit.com${post.permalink}`,
        description:
          notes.length > 0
            ? `${notes.join("; ")} — open the post to confirm.`
            : "Details extracted from the Reddit post.",
        postedAt,
        updatedAt: postedAt,
        corroboratingSources: 1,
        votes: { stillHere: 0, over: 0 },
      });
    }

    return sales;
  },
};
