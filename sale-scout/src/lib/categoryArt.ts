import type { SaleCategory } from "../types";

interface CategoryArt {
  bg: string;
  fg: string;
  /** Inner SVG markup for a simple flat icon representing the category. */
  icon: string;
}

const ART: Record<SaleCategory, CategoryArt> = {
  garage: {
    bg: "#1f3b30",
    fg: "#3ecf8e",
    icon: `<path d="M8 42 L50 14 L92 42 V88 H8 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><rect x="20" y="50" width="60" height="38" fill="none" stroke="currentColor" stroke-width="5"/><path d="M28 58 h44 M28 68 h44 M28 78 h44" stroke="currentColor" stroke-width="4"/>`,
  },
  estate: {
    bg: "#332a1a",
    fg: "#f0b429",
    icon: `<path d="M50 12 L88 34 V50 H12 V34 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><rect x="18" y="50" width="64" height="38" fill="none" stroke="currentColor" stroke-width="5"/><path d="M42 88 V64 h16 v24" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="50" cy="36" r="7" fill="currentColor"/>`,
  },
  moving: {
    bg: "#1a2b38",
    fg: "#4aa8e0",
    icon: `<rect x="10" y="42" width="46" height="34" fill="none" stroke="currentColor" stroke-width="5"/><path d="M56 50 h20 l14 16 v10 h-34 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><circle cx="28" cy="80" r="8" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="76" cy="80" r="8" fill="none" stroke="currentColor" stroke-width="5"/>`,
  },
  yard: {
    bg: "#2a3318",
    fg: "#8bc34a",
    icon: `<circle cx="50" cy="34" r="14" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 8 v8 M50 52 v8 M24 34 h8 M68 34 h8 M32 16 l6 6 M62 16 l-6 6 M32 52 l6 -6 M62 52 l-6 -6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M20 88 Q50 60 80 88" fill="none" stroke="currentColor" stroke-width="5"/>`,
  },
  other: {
    bg: "#2a2a33",
    fg: "#9aa3b2",
    icon: `<path d="M16 50 L50 16 L84 50 L50 84 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><circle cx="50" cy="50" r="10" fill="currentColor"/>`,
  },
};

/**
 * Simple, self-contained illustrated icon standing in for a listing photo,
 * one per category. Rendered as an inline SVG data URI (no network
 * request, works offline, and never claims to be a real photo of
 * someone's actual sale/house).
 */
export function categoryThumbnail(category: SaleCategory): string {
  const art = ART[category] ?? ART.other;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${art.bg}"/>
    <g color="${art.fg}">${art.icon}</g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
