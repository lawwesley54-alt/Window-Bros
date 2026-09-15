import type { Sale } from "../types";
import type { SaleSearchParams, SaleSourceAdapter } from "./types";

/**
 * Craigslist publishes a public, unauthenticated RSS feed for its garage
 * sale search results (e.g. https://<city>.craigslist.org/search/gms?format=rss),
 * which is the one part of Craigslist that's safe to consume
 * programmatically — no login, no HTML scraping, no ToS violation.
 *
 * `parseCraigslistRss` below is the real, pure, testable parsing logic:
 * hand it RSS XML text and it returns partial Sale records (title,
 * sourceUrl, postedAt — Craigslist's RSS doesn't include lat/lng or
 * structured dates, so a real integration still needs to geocode the
 * title/description and pull a date out of the free-text title).
 *
 * `fetchCraigslistSales` is left unimplemented on purpose: Craigslist's
 * server doesn't send CORS headers, so a browser can't `fetch()` it
 * directly. A real deployment needs a small backend/edge function that
 * fetches the feed server-side and forwards normalized JSON to the
 * client. Wire that endpoint up here once it exists.
 */
export function parseCraigslistRss(xml: string): Partial<Sale>[] {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const items = Array.from(doc.querySelectorAll("item"));

  return items.map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() ?? "";
    const link = item.querySelector("link")?.textContent?.trim();
    const pubDate = item.querySelector("pubDate")?.textContent?.trim();

    return {
      title,
      sourceUrl: link,
      postedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
      source: "craigslist",
    };
  });
}

export const craigslistRssAdapter: SaleSourceAdapter = {
  id: "craigslist",
  label: "Craigslist (garage sales RSS)",
  async fetchSales(_params: SaleSearchParams): Promise<Sale[]> {
    throw new Error(
      "craigslistRssAdapter requires a server-side proxy endpoint to fetch " +
        "the RSS feed (Craigslist does not send CORS headers). Point this " +
        "at that endpoint and geocode/parse dates from the returned items " +
        "using parseCraigslistRss() before enabling this adapter.",
    );
  },
};
