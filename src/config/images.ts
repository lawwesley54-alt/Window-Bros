/**
 * Centralized image configuration.
 *
 * Every image on the site is referenced by key from here — never hardcode
 * an image URL inside a component. To replace an image, change its `src`
 * (and `srcSet` sizes if you keep responsive variants) in this one file.
 *
 * The initial set uses licensed Unsplash photography as placeholder
 * imagery (free to use under the Unsplash License). These are NOT photos
 * of actual Window Bros customers or work — replace with real Window
 * Bros job photography as soon as it's available, especially the
 * Before & After section.
 *
 * NOTE: image URLs were selected from training knowledge and could not
 * be live-verified in this sandbox (outbound network access to
 * unsplash.com is blocked here). The <Img> component falls back to a
 * neutral placeholder if a URL ever fails to load, so a stale ID never
 * breaks the layout — but double-check every image renders correctly in
 * a normal browser before launch.
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
    src: unsplash("photo-1600585154340-be6161a56a0c", 1800),
    alt: "Bright modern home exterior with large clean windows",
    position: "center",
  },
  windowCleaning: {
    src: unsplash("photo-1585421514738-01798e348b17", 1200),
    alt: "Professional cleaning an exterior window with a squeegee",
  },
  interiorWindows: {
    src: unsplash("photo-1449844908441-8829872d2607", 1200),
    alt: "Bright living room with clean, sunlit interior windows",
  },
  screens: {
    src: unsplash("photo-1600566753086-00f18fb6b3ea", 1200),
    alt: "Close-up of a clean window and screen on a modern home",
  },
  hardWater: {
    src: unsplash("photo-1527515637462-cff94eecc1ac", 1200),
    alt: "Clear glass window with sunlight streaming through",
  },
  beforeAfterBefore: {
    src: unsplash("photo-1558036117-15d82a90b9b1", 1200),
    alt: "Placeholder: window before cleaning — replace with a real Window Bros photo",
  },
  beforeAfterAfter: {
    src: unsplash("photo-1600607687939-ce8a6c25118c", 1200),
    alt: "Placeholder: window after cleaning — replace with a real Window Bros photo",
  },
  cta: {
    src: unsplash("photo-1512917774080-9991f1c4c750", 1800),
    alt: "Modern residential exterior with large glass windows at golden hour",
  },
} satisfies Record<string, ImageConfig>;

export type ImageKey = keyof typeof images;
