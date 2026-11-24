const { chromium } = require("playwright");
const assert = require("node:assert/strict");

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const errors = [];
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({
        viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
        isMobile: mobile, hasTouch: mobile,
      });
      const page = await context.newPage();
      page.setDefaultNavigationTimeout(60000);
      page.on("pageerror", error => errors.push(error.message));
      page.on("response", response => {
        if (response.status() >= 400) console.log(`HTTP ${response.status()}: ${response.url()}`);
      });
      page.on("console", message => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.goto("http://localhost:3100", { waitUntil: "networkidle" });
      const map = page.locator("footer video");
      assert.equal(await map.getAttribute("src"), null, "Footer video must not download before entry");
      await map.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector("footer video").ended, { timeout: 20000 });
      const end = await map.evaluate(video => video.currentTime);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(250);
      await map.scrollIntoViewIfNeeded();
      await page.waitForTimeout(750);
      assert.equal(await map.evaluate(video => video.currentTime), end, "Footer video must not replay");
      assert.equal(await map.evaluate(video => video.paused), true);
      console.log(`${mobile ? "Mobile" : "Desktop"}: footer lazy loading and once-only playback passed`);
      const routes = ["/", "/window-film", "/ppf", "/interior-ppf", "/ultra-edge", "/warranty", "/regulations", "/our-journey", "/contact", "/become-dealer", "/compare", "/terms-and-conditions", "/privacy-policy", "/disclaimer"];
      if (!process.env.SKIP_BLOG) routes.push("/blog");
      for (const route of routes) {
        const response = await page.goto(`http://localhost:3100${route}`, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200, route);
        assert.ok(await page.title(), `${route}: missing title`);
        for (const fraction of [0.25, 0.5, 0.9]) {
          await page.evaluate(f => window.scrollTo(0, document.documentElement.scrollHeight * f), fraction);
          await page.waitForTimeout(250);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route}: horizontal overflow`);
        }
        const runningOffscreen = await page.locator("video[aria-hidden]").evaluateAll(videos => videos.filter(video => {
          const rect = video.getBoundingClientRect();
          return (rect.bottom <= 0 || rect.top >= innerHeight) && !video.paused;
        }).length);
        assert.equal(runningOffscreen, 0, `${route}: video playing offscreen`);
        console.log(`${mobile ? "Mobile" : "Desktop"}: ${route} passed`);
      }
      await context.close();
    }
    assert.deepEqual([...new Set(errors)], [], "Browser console/runtime errors");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
