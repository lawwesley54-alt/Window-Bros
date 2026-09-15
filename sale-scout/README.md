# Sale Scout

A map-first garage & estate sale finder. Every known sale renders as a pin
on a large interactive map, color-coded and sized by a transparent
**"likelihood still active"** score (0–100%), with a synced sidebar list
and filters for distance, category, date, and minimum confidence.

React + TypeScript + Vite, [Leaflet](https://leafletjs.com/) /
[react-leaflet](https://react-leaflet.js.org/) for the map (OpenStreetMap
tiles, no API key required), and [Vitest](https://vitest.dev/) for the
scoring logic's unit tests.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks and builds to dist/
npm run lint      # oxlint
npm test          # scoring module unit tests
```

## How it's put together

```
src/
  types.ts                 Sale data model
  lib/
    scoring.ts              computeLikelihoodScore() — the "still active" score
    scoring.test.ts          unit tests for every scoring factor
    geo.ts                   distance calculation
    geocode.ts               free-text address -> lat/lng (Nominatim)
  sources/
    types.ts                 SaleSourceAdapter interface — the plug point
                              every listing source implements
    mockSource.ts             seed/demo data, wired up by default
    craigslistRssAdapter.ts   live: fetches the real Craigslist RSS feed
                              for the nearest known city (via a public
                              CORS proxy, since craigslist.org sends none)
    redditAdapter.ts          live: searches the local city subreddit for
                              garage/estate/yard sale posts
  data/mockSales.ts          demo listings, generated around the active center
  lib/
    categorize.ts             guesses a Sale category from free-text titles
    craigslistCities.ts       nearest-city lookup for the Craigslist adapter
  components/
    MapView.tsx               the map: clustering, colored markers, popups
    FilterBar.tsx              category/radius/score filters, location search
    SaleList.tsx / SaleCard.tsx  sidebar list, kept in sync with map bounds
  App.tsx                     wires sources -> scoring -> map/list state
```

### The "likelihood still active" score

`computeLikelihoodScore(sale, now)` in `src/lib/scoring.ts` is a pure
function with no hidden state, so the UI can show *why* a sale got its
score, not just the number. It combines:

- **Time window** — where `now` falls relative to the sale's posted
  start/end time: not-yet-started sales get a moderate score that rises
  as the start approaches, sales inside their posted window score high
  and decay slowly toward the end, and sales past their posted end time
  decay fast (roughly halving every ~2 hours).
- **Freshness** — how long since the listing was last confirmed/updated;
  stale, unconfirmed listings lose points.
- **Corroboration** — a small boost when the same sale is reported by
  more than one source.
- **User votes** — live "Still here" / "Sale's over" buttons on each map
  popup shift the score up or down immediately.

Every factor has its own unit test in `scoring.test.ts`, and the UI
renders `reasons: string[]` straight from the scorer in each map popup
so the score is never a black box.

### Data sources — what's real vs. what's a stub

**Facebook and Craigslist both prohibit automated scraping in their
Terms of Service**, and Facebook actively blocks it. This app is built
around a `SaleSourceAdapter` interface (`src/sources/types.ts`) so
sources can be added without touching any map/scoring/UI code, and each
adapter is honest about what it actually does. All sources are fetched
in parallel (`Promise.allSettled` in `App.tsx`) so one failing doesn't
break the others.

| Source | Status | Notes |
| --- | --- | --- |
| `mockSource` | ✅ live | Seed/demo data generated around the active map center; also stands in for user-submitted listings, the most reliable source once there's a user base. |
| `craigslistRssAdapter` | ✅ live | Fetches Craigslist's public **RSS search feed** for garage sales (`https://<city>.craigslist.org/search/gms?format=rss`) — the one part of Craigslist that's safe to consume, no login or ToS violation. The nearest known city site is picked via `craigslistCities.ts` from your coordinates. Craigslist sends no CORS headers, so the fetch goes through a public CORS-forwarding proxy (`api.allorigins.win`, with a fallback) — a third-party dependency outside this app's control, not an account you need to set up. RSS items rarely include a clean address or sale time, so those are approximated (see caveat below). |
| `redditAdapter` | ✅ live | Reverse-geocodes your location to a city name, then searches that city's subreddit (best-effort guess, e.g. "San Francisco" → r/sanfrancisco) for garage/estate/yard sale posts via Reddit's public `search.json` endpoint — no login needed, and Reddit does send CORS headers for this. Coverage depends entirely on whether people in your area post there. |
| EstateSales.net / .org | ⏳ not started | Both publish public listing pages; a real adapter would need the same CORS-proxy approach as Craigslist and a parser for their listing markup. |
| Facebook | ⏳ not started, and only via the official API | Only Meta's Graph API for Page/Event data the user has explicitly authorized is in scope — never Marketplace or private Groups scraping. This genuinely requires your own Facebook Developer app and login; there's no way around that requirement. |
| Nextdoor | Out of scope | No public API; would only ever be user-submitted-link based. |

`geocode.ts` uses OpenStreetMap's free Nominatim API for the location
search box and reverse geocoding, and is fully functional today — light
client use is within its usage policy, though a high-traffic deployment
should proxy it through a backend to set a proper `User-Agent` and
respect its ~1 req/sec rate limit.

**Accuracy caveat for live sources:** neither Craigslist RSS nor Reddit
posts include a structured street address or a clean sale-time window.
Craigslist listings show an approximate address ("near \<city\>") with
the exact address left to the original listing; Reddit posts are placed
at your search center with the same caveat. Both approximate the sale's
time window from when the post appeared, which is a real limitation —
always click through to the original listing/post to confirm details.
This is disclosed in each listing's description text in the UI, not
just here.

### Next steps for a production version

1. Add a small backend/edge function to remove the third-party CORS
   proxy dependency for Craigslist (and any future estate-sale-site
   adapters), and to respect Nominatim's rate limit properly.
2. Extract real sale times/addresses from listing text with something
   smarter than regex (an LLM pass over the title/description would work
   well here) instead of approximating from the post timestamp.
3. Let users submit sales directly (address, dates, photos) — this is
   the highest-trust, ToS-safe source and should be prioritized over
   scraping anything.
4. Persist user votes and corroboration counts server-side instead of
   the current in-memory `voteOverrides` state in `App.tsx`, so scores
   update for every viewer, not just the one who voted.
5. Add push notifications for saved filters/areas.
