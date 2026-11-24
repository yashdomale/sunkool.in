import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
// Keep in step with TECH_DEMO_FRAMES.count in src/lib/tech-demo-media.ts.
const FRAME_COUNT = 361;

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  try {
    for (const mobile of [false, true]) {
      const page = await browser.newPage({
        viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
        isMobile: mobile, hasTouch: mobile,
      });
      const errors = [];
      const frames = [];
      await page.addInitScript(() => performance.setResourceTimingBufferSize(2000));
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => {
        if (request.url().includes("/frames/")) frames.push(request.url());
      });
      await page.goto(base);
      await page.waitForTimeout(5000);
      assert.equal(frames.length, mobile ? 0 : 1, "Only the first desktop frame loads before interaction");
      assert.equal(await page.locator("footer video").getAttribute("src"), null);
      const initial = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => ({
        url: entry.name, bytes: entry.transferSize,
      })));
      if (!mobile) {
        assert.ok(!initial.some((entry) => entry.url.includes("hero-mobile")), "Desktop must not download the mobile photo");
        for (const progress of [0.2, 0.5, 0.96, 0.2]) {
          const index = progress >= 0.96 ? FRAME_COUNT : Math.round(1 + (progress - 0.08) / 0.88 * (FRAME_COUNT - 1));
          const name = `ezgif-frame-${String(index).padStart(3, "0")}.avif`;
          await page.evaluate((p) => {
            const section = document.querySelector("main section");
            window.scrollTo(0, (section.offsetHeight - innerHeight) * p);
          }, progress);
          await page.waitForFunction((name) => performance.getEntriesByType("resource").some((entry) => entry.name.includes(name)), name);
          await page.waitForTimeout(250);
          const still = await page.locator("main canvas").evaluate((canvas) => canvas.toDataURL());
          await page.waitForTimeout(250);
          assert.equal(await page.locator("main canvas").evaluate((canvas) => canvas.toDataURL()), still, "Stationary animation must not restart or loop");
        }
        assert.ok(frames.length > 1 && frames.length < FRAME_COUNT, "Frames must load progressively during scroll");
        // Ensure idle work eventually completes rather than silently dropping frames.
        await page.waitForFunction((count) => new Set(performance.getEntriesByType("resource")
          .filter((entry) => entry.name.includes("/frames/")).map((entry) => entry.name)).size === count,
          FRAME_COUNT, { timeout: 90000 });
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      const mode = mobile ? "mobile" : "desktop";
      fs.writeFileSync(`performance-${mode}-network.json`, JSON.stringify({ initial, frames }, null, 2));
      console.log(`${mode}: initial frames ${mobile ? 0 : 1}, initial transfer ${initial.reduce((sum, entry) => sum + entry.bytes, 0)} bytes; animation/responsiveness passed`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
