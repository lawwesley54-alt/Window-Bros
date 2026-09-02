/**
 * Centralized image configuration.
 *
 * Every image on the site is referenced by key from here — never hardcode
 * an image URL inside a component. To replace an image, change its `src`
 * (and `srcSet` sizes if you keep responsive variants) in this one file.
 *
 * `hero`, `windowCleaning`, `interiorWindows`, `screens`,
 * `beforeAfterBefore`, and `beforeAfterAfter` all use real photos the
 * client provided (saved to public/photos/). Note beforeAfterBefore and
 * beforeAfterAfter are NOT the same physical window — they're
 * representative "dirty" vs. "clean" examples, not a matched pair, so
 * keep any copy referencing them honest about that. Only `cta` still
 * uses licensed Unsplash photography as a placeholder (free to use
 * under the Unsplash License) — not a photo of actual Window Bros work.
 *
 * NOTE: the Unsplash URLs below were selected from training knowledge
 * and could not be live-verified in this sandbox (outbound network
 * access to unsplash.com is blocked here). The <Img> component falls
 * back to a neutral placeholder if a URL ever fails to load, so a stale
 * ID never breaks the layout — but double-check every image renders
 * correctly in a normal browser before launch.
 */

type ImageConfig = {
  /** Unsplash (or other) source URL, sized via URL params. */
  src: string;
  /** Descriptive alt text — never leave empty on a meaningful image. */
  alt: string;
  /** Focal point for object-position, as "x% y%". */
  position?: string;
};

const unsplash = (id: string, w: number, q = 80) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const images = {
  hero: {
    src: "/photos/exterior-window-squeegee.jpg",
    alt: "Window Bros technician using a squeegee to clean a soapy exterior window",
    position: "68% 55%",
  },
  windowCleaning: {
    src: "/photos/exterior-window-squeegee.jpg",
    alt: "Window Bros technician using a squeegee to clean a soapy exterior window",
    position: "60% 45%",
  },
  interiorWindows: {
    src: "/photos/interior-window-view.jpg",
    alt: "Crystal-clear window glass with a potted plant visible through it",
    position: "50% 35%",
  },
  screens: {
    src: "/photos/window-screen.jpg",
    alt: "A window screen removed for cleaning, leaning against an exterior wall",
    position: "50% 55%",
  },
  beforeAfterBefore: {
    src: "/photos/window-before-dirty.jpg",
    alt: "A grimy, fogged-up window that's hard to see through",
    position: "center",
  },
  beforeAfterAfter: {
    src: "/photos/interior-window-view.jpg",
    alt: "Crystal-clear window glass with a potted plant visible through it",
    position: "50% 30%",
  },
  cta: {
    src: unsplash("photo-1512917774080-9991f1c4c750", 1800),
    alt: "Modern residential exterior with large glass windows at golden hour",
    position: "center",
  },
} satisfies Record<string, ImageConfig>;

export type ImageKey = keyof typeof images;
