# Window Bros

Marketing website for Window Bros, a residential window cleaning company.
React + TypeScript + Tailwind CSS v4, built with Vite.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks and builds to dist/
npm run lint      # oxlint
```

Optional smoke tests (require `npx playwright install chromium` once):

```bash
npm run dev            # in one terminal
npm run test:visual    # responsive check at 375/390/430/768/1024/1440px
npm run test:a11y      # axe-core WCAG 2.x AA scan
```

## Before launch — replace every remaining placeholder

Nothing in this build invents business details, reviews, prices, or
credentials. Phone, email, and service area (Salado, TX) are filled in.
Search for `[BRACKETED PLACEHOLDERS]` for what's left:

- **`src/config/site.ts`** — street address/ZIP, social links, and the
  placeholder reviews (replace with real customer reviews only — never
  invent them). Pricing is intentionally left as a placeholder in the
  FAQ since no pricing was provided.
- **`index.html`** — the `LocalBusiness` JSON-LD still needs a real
  street address and postal code (keep it in sync with `site.ts`); the
  production domain (currently `windowbros.example`) also needs updating
  everywhere it appears (canonical URL, Open Graph/Twitter tags,
  JSON-LD `url`/`image`).
- **`src/config/images.ts`** — every image is centralized here. The
  initial set uses placeholder Unsplash photography; swap in real
  Window Bros job photos when available, especially `beforeAfterBefore`
  / `beforeAfterAfter`. Image URLs could not be live-verified from this
  build environment (outbound network access to unsplash.com was
  blocked) — double check each one renders before launch. If a URL is
  ever stale, the `<Img>` component falls back to a labeled placeholder
  instead of a broken-image icon.
- **`public/robots.txt`** and **`public/sitemap.xml`** — update the
  production domain.
- **`src/components/sections/QuoteForm.tsx`** — `submitQuoteRequest()`
  currently only logs to the console. Wire it to a real backend, API
  route, or form service before launch.

## Design system

All color, type, spacing and motion tokens live in `src/index.css`
(`@theme` block) — change a value there to re-theme the whole site. The
palette is matched to the Window Bros logo (`public/logo.png`): near-black
ink, white/light-gray surfaces, and the logo's blue as the primary accent,
with its orange reserved as a sparing secondary accent.
