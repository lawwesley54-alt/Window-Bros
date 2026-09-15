import { describe, expect, it } from "vitest";
import { parseCraigslistRss } from "./craigslistRssAdapter";

const SAMPLE_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">
  <channel>
    <title>craigslist garage sales</title>
    <item>
      <title>Huge multi-family garage sale Sat 8am-2pm</title>
      <link>https://austin.craigslist.org/gms/d/austin-huge-garage-sale/1234.html</link>
      <pubDate>Wed, 10 Sep 2026 14:00:00 -0500</pubDate>
      <geo:lat>30.27</geo:lat>
      <geo:long>-97.74</geo:long>
    </item>
    <item>
      <title>Estate sale - antiques and furniture</title>
      <link>https://austin.craigslist.org/gms/d/austin-estate-sale/5678.html</link>
      <pubDate>Thu, 11 Sep 2026 09:00:00 -0500</pubDate>
    </item>
  </channel>
</rss>`;

describe("parseCraigslistRss", () => {
  it("parses title, link, and date for each item", () => {
    const items = parseCraigslistRss(SAMPLE_RSS);
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe("Huge multi-family garage sale Sat 8am-2pm");
    expect(items[0].sourceUrl).toBe(
      "https://austin.craigslist.org/gms/d/austin-huge-garage-sale/1234.html",
    );
    expect(items[0].postedAt).not.toBeNull();
  });

  it("parses geo coordinates when present", () => {
    const items = parseCraigslistRss(SAMPLE_RSS);
    expect(items[0].lat).toBeCloseTo(30.27);
    expect(items[0].lng).toBeCloseTo(-97.74);
  });

  it("returns null coordinates when geo tags are absent", () => {
    const items = parseCraigslistRss(SAMPLE_RSS);
    expect(items[1].lat).toBeNull();
    expect(items[1].lng).toBeNull();
  });

  it("returns an empty array for a feed with no items", () => {
    const empty = `<?xml version="1.0"?><rss><channel></channel></rss>`;
    expect(parseCraigslistRss(empty)).toEqual([]);
  });
});
