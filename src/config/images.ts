/**
 * Centralized image configuration.
 *
 * Every image on the site is referenced by key from here — never hardcode
 * an image URL inside a component. To replace an image, change its `src`
 * (and `srcSet` sizes if you keep responsive variants) in this one file.
 *
 * `hero`, `windowCleaning`, and `hardWater` use real photos the client
 * provided (saved to public/photos/). Everything else still uses
 * licensed Unsplash photography as a placeholder (free to use under the
 * Unsplash License) — these are NOT photos of actual Window Bros
 * customers or work, and should be swapped for real job photography as
 * it comes in. The Before & After section in particular still needs a
 * real matching before/after pair of the same window — none has been
 * provided yet.
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
    src: unsplash("photo-1449844908441-8829872d2607", 1200),
    alt: "Bright living room with clean, sunlit interior windows",
    position: "center",
  },
  screens: {
    src: unsplash("photo-1600566753086-00f18fb6b3ea", 1200),
    alt: "Close-up of a clean window and screen on a modern home",
    position: "center",
  },
  hardWater: {
    src: "/photos/hard-water-stains.jpg",
    alt: "Close-up of hard water mineral buildup on a window pane",
    position: "center",
  },
  beforeAfterBefore: {
    src: unsplash("photo-1558036117-15d82a90b9b1", 1200),
    alt: "Placeholder: window before cleaning — replace with a real Window Bros photo",
    position: "center",
  },
  beforeAfterAfter: {
    src: unsplash("photo-1600607687939-ce8a6c25118c", 1200),
    alt: "Placeholder: window after cleaning — replace with a real Window Bros photo",
    position: "center",
  },
  cta: {
    src: unsplash("photo-1512917774080-9991f1c4c750", 1800),
    alt: "Modern residential exterior with large glass windows at golden hour",
    position: "center",
  },
} satisfies Record<string, ImageConfig>;

export type ImageKey = keyof typeof images;
