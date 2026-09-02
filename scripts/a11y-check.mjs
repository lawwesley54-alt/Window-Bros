/**
 * Accessibility smoke test using axe-core against the local dev server.
 * Checks WCAG 2.0/2.1/2.2 AA rules plus axe best practices.
 *
 * Usage:
 *   npm run dev          # in one terminal
 *   npm run test:a11y    # in another
 *
 * Requires Chromium: `npx playwright install chromium` (one-time).
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const URL = process.env.SITE_URL ?? "http://localhost:5173/";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto(URL, { waitUntil: "load", timeout: 30000 });

const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"])
  .analyze();

console.log(`Violations: ${results.violations.length}`);
for (const v of results.violations) {
  console.log(`\n[${v.impact}] ${v.id}: ${v.help}`);
  console.log(`  ${v.helpUrl}`);
  for (const node of v.nodes.slice(0, 5)) {
    console.log(`  - ${node.target.join(" ")}`);
  }
}

await browser.close();
if (results.violations.length) process.exit(1);
