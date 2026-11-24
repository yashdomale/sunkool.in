const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const origin = process.env.CITY_TEST_ORIGIN || 'http://localhost:3000';
const cities = [
  'nagpur', 'mumbai', 'pune', 'bangalore', 'chennai', 'delhi',
  'ahmedabad', 'hyderabad', 'amritsar', 'kolkata', 'bhopal',
  'kozhikode', 'indore', 'vijayawada', 'bhubaneswar',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1440, 390]) {
      for (const city of cities) {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        await context.addInitScript(() => {
          window.geoCalls = 0;
          Object.defineProperty(navigator, 'geolocation', {
            value: { getCurrentPosition() { window.geoCalls++; } },
          });
        });
        const page = await context.newPage();
        assert.equal((await page.goto(`${origin}/${city}`)).status(), 200);
        const dialog = page.getByRole('dialog', { name: 'Use your location?' });
        await dialog.waitFor();
        assert.equal(await page.evaluate(() => window.geoCalls), 0);
        await dialog.getByRole('button', { name: 'No' }).click();
        assert.equal(await dialog.isVisible(), false);
        assert.equal(new URL(page.url()).pathname, `/${city}`);
        assert.equal(await page.evaluate(() => window.geoCalls), 0);
        await page.reload();
        await dialog.waitFor();
        await dialog.getByRole('button', { name: 'Yes' }).click();
        await page.waitForFunction(() => window.geoCalls === 1);
        assert.equal(new URL(page.url()).pathname, `/${city}`);
        console.log(`PASS /${city} ${width}px: Yes requests location; No stays on page`);
        await context.close();
      }
    }

    for (const mode of ['supported', 'outside', 'denied', 'timeout']) {
      const context = await browser.newContext();
      await context.addInitScript(mode => {
        window.geoCalls = 0;
        Object.defineProperty(navigator, 'geolocation', {
          value: { getCurrentPosition(success, error) {
            window.geoCalls++;
            if (mode === 'denied') error({ code: 1 });
            else if (mode === 'timeout') error({ code: 3 });
            else success({ coords: { latitude: 21.1458, longitude: 79.0882 } });
          } },
        });
      }, mode);
      const page = await context.newPage();
      await page.route('https://nominatim.openstreetmap.org/**', route => route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ address: { city: mode === 'outside' ? 'Unsupported City' : 'Nagpur', country_code: 'in' } }),
      }));
      await page.goto(`${origin}/delhi`);
      await page.getByRole('dialog', { name: 'Use your location?' }).getByRole('button', { name: 'Yes' }).click();
      await page.waitForFunction(() => window.geoCalls === 1);
      if (mode === 'supported') {
        await page.waitForURL(`${origin}/nagpur`);
        await page.getByRole('dialog', { name: 'Use your location?' }).waitFor({ state: 'hidden' });
      }
      else await page.getByRole('dialog', { name: 'Use your location?' }).waitFor({ state: 'hidden' });
      assert.equal(new URL(page.url()).pathname, mode === 'supported' ? '/nagpur' : '/delhi');
      assert.equal(await page.evaluate(() => window.geoCalls), 1);
      console.log(`PASS Delhi location choice: ${mode}`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
