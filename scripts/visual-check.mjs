/**
 * Quick responsive smoke test: loads the local dev server at every
 * breakpoint required by the design spec and checks for horizontal
 * overflow and console/page errors. Screenshots are written to
 * scripts/.screenshots (gitignored).
 *
 * Usage:
 *   npm run dev                # in one terminal
 *   npm run test:visual        # in another
 *
 * Requires Chromium: `npx playwright install chromium` (one-time).
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, ".screenshots");
fs.mkdirSync(OUT, { recursive: true });

const URL = process.env.SITE_URL ?? "http://localhost:5173/";

const breakpoints = [
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 800 },
  { name: "1440", width: 1440, height: 900 },
];

const browser = await chromium.launch();
let failed = false;

for (const bp of breakpoints) {
  const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto(URL, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(300);

  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );

  await page.screenshot({ path: path.join(OUT, `${bp.name}.png`), fullPage: true });

  const status = hasHorizontalScroll || errors.length ? "FAIL" : "ok";
  if (status === "FAIL") failed = true;
  console.log(`[${status}] ${bp.width}px — horizontalScroll=${hasHorizontalScroll} errors=${errors.length}`);
  if (errors.length) errors.forEach((e) => console.log(`   ${e}`));

  await page.close();
}

await browser.close();
if (failed) process.exit(1);
