import type { SaleCategory } from "../types";

const PATTERNS: Array<{ category: SaleCategory; re: RegExp }> = [
  { category: "estate", re: /\bestate\s*sale\b/i },
  { category: "moving", re: /\bmoving\s*sale\b|\bmove[\s-]?out\b/i },
  { category: "yard", re: /\byard\s*sale\b/i },
  { category: "garage", re: /\bgarage\s*sale\b/i },
];

/** Best-effort category guess from a free-text listing title/description. */
export function guessCategory(text: string): SaleCategory {
  for (const { category, re } of PATTERNS) {
    if (re.test(text)) return category;
  }
  return "other";
}
