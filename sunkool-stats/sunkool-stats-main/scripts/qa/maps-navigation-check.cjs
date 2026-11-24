const { chromium } = require("playwright");
const assert = require("node:assert/strict");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  try {
    for (const mobile of [false, true]) {
      const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: mobile, hasTouch: mobile });
      await page.goto("http://localhost:3000/window-film");
      const video = page.locator("footer video");
      await video.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector("footer video")?.ended, { timeout: 30000 });
      const end = await video.evaluate(v => v.currentTime);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await video.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      assert.equal(await video.evaluate(v => v.currentTime), end);
      assert.equal(await video.evaluate(v => v.paused), true);
      await page.locator('footer a[href="/contact"]').first().click();
      await page.waitForURL("**/contact");
      await video.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => { const v = document.querySelector("footer video"); return v && !v.paused && v.currentTime > 0 && !v.ended; });
      await page.locator('footer a[href="/window-film"]').click();
      await page.waitForURL("**/window-film");
      await video.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => { const v = document.querySelector("footer video"); return v && !v.paused && v.currentTime > 0 && !v.ended; });
      console.log(`${mobile ? "Mobile" : "Desktop"}: same-page scrolling does not replay; client navigation and return restart playback`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
