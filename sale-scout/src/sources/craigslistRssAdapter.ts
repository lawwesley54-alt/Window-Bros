import type { Sale } from "../types";
import type { SaleSearchParams, SaleSourceAdapter } from "./types";
import { nearestCraigslistCity } from "../lib/craigslistCities";
import { guessCategory } from "../lib/categorize";
import { extractAddress, extractTimeWindow } from "../lib/extractDetails";

const HOUR_MS = 60 * 60 * 1000;

/**
 * Public CORS proxies that forward the response with permissive CORS
 * headers, since craigslist.org itself sends none. These are third-party
 * services outside our control (rate limits, uptime), not part of any
 * account/credential setup — tried in order, first success wins.
 */
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

export interface ParsedCraigslistItem {
  title: string;
  sourceUrl: string | null;
  postedAt: string | null;
  lat: number | null;
  lng: number | null;
}

/**
 * Pure, testable parser for a craigslist garage-sales RSS response.
 * Craigslist's RSS/GeoRSS items include <geo:lat>/<geo:long> when the
 * poster set a map pin; most don't, so callers should have a fallback.
 */
export function parseCraigslistRss(xml: string): ParsedCraigslistItem[] {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const items = Array.from(doc.querySelectorAll("item"));

  return items.map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() ?? "";
    const link = item.querySelector("link")?.textContent?.trim() ?? null;
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() ?? null;
    const latText = item.getElementsByTagName("geo:lat")[0]?.textContent;
    const lngText = item.getElementsByTagName("geo:long")[0]?.textContent;

    return {
      title,
      sourceUrl: link,
      postedAt: pubDate ? new Date(pubDate).toISOString() : null,
      lat: latText ? parseFloat(latText) : null,
      lng: lngText ? parseFloat(lngText) : null,
    };
  });
}

async function fetchViaProxy(url: string): Promise<string> {
  let lastError: unknown;
  for (const buildProxyUrl of CORS_PROXIES) {
    try {
      const res = await fetch(buildProxyUrl(url));
      if (res.ok) return await res.text();
      lastError = new Error(`Proxy responded ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("All CORS proxies failed");
}

export const craigslistRssAdapter: SaleSourceAdapter = {
  id: "craigslist",
  label: "Craigslist (garage sales RSS)",
  async fetchSales(params: SaleSearchParams): Promise<Sale[]> {
    const city = nearestCraigslistCity(params);
    const feedUrl = `https://${city.subdomain}.craigslist.org/search/gms?format=rss`;

    const xml = await fetchViaProxy(feedUrl);
    const items = parseCraigslistRss(xml);

    return items
      .filter((item) => item.sourceUrl)
      .map((item, index) => {
        const postedAt = item.postedAt ?? new Date().toISOString();
        const timeWindow = extractTimeWindow(item.title, new Date(postedAt));
        const startsAt = timeWindow?.startsAt ?? postedAt;
        const endsAt =
          timeWindow?.endsAt ??
          new Date(new Date(postedAt).getTime() + 4 * HOUR_MS).toISOString();

        const foundAddress = extractAddress(item.title);
        const address = foundAddress
          ? `${foundAddress}, near ${city.label}`
          : `Near ${city.label} — see listing for exact address`;

        const notes: string[] = [];
        if (!timeWindow) notes.push("time window guessed from when the listing was posted");
        if (!foundAddress) notes.push("exact address not in the listing title");

        const sale: Sale = {
          id: `craigslist-${item.sourceUrl ?? index}`,
          title: item.title,
          category: guessCategory(item.title),
          address,
          lat: item.lat ?? city.lat,
          lng: item.lng ?? city.lng,
          startsAt,
          endsAt,
          source: "craigslist",
          sourceUrl: item.sourceUrl ?? undefined,
          description:
            notes.length > 0
              ? `${notes.join("; ")} — click through to confirm.`
              : "Details extracted from the Craigslist listing title.",
          postedAt,
          updatedAt: postedAt,
          corroboratingSources: 1,
          votes: { stillHere: 0, over: 0 },
        };
        return sale;
      });
  },
};
