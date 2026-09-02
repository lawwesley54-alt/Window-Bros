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
- **Quote form backend** — see below. It needs a real access key before
  quote requests actually reach anyone.
- **`business.social.google`** in `src/config/site.ts` — the "Leave Us a
  Review" button in the Reviews section links here. Get your review
  link from your Google Business Profile ("Get more reviews" → copy
  link) and drop it in.

## Quote form backend

The quote form (`src/components/sections/QuoteForm.tsx`) sends
submissions via [Web3Forms](https://web3forms.com) — a free service
that emails form submissions straight to an inbox, with no server of
our own to build or host.

Setup (~2 minutes, no account needed):

1. Go to https://web3forms.com and enter the email address you want
   quote requests delivered to. It emails you an access key instantly.
2. Copy `.env.example` to `.env.local` and paste the key in:
   ```
   VITE_WEB3FORMS_ACCESS_KEY=your-key-here
   ```
3. Restart `npm run dev` (or redeploy) so the new env var is picked up.

`.env.local` is gitignored — never commit a real key. When deploying
(Vercel, Netlify, etc.), set `VITE_WEB3FORMS_ACCESS_KEY` in that host's
environment variable settings instead.

Until the key is set, the form shows a friendly error asking people to
call or email instead — it never silently pretends a submission worked.

## Design system

All color, type, spacing and motion tokens live in `src/index.css`
(`@theme` block) — change a value there to re-theme the whole site. The
palette is matched to the Window Bros logo (`public/logo.png`): near-black
ink, white/light-gray surfaces, and the logo's blue as the primary accent,
with its orange reserved as a sparing secondary accent.
