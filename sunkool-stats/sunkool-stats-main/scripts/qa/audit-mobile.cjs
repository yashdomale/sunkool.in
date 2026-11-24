const { chromium } = require('playwright');
const fs = require('node:fs');

const origin = process.env.AUDIT_ORIGIN || 'http://localhost:3000';
const routes = [
  '/', '/window-film', '/ppf', '/interior-ppf', '/ultra-edge', '/compare',
  '/contact', '/become-dealer', '/blog', '/warranty', '/regulations',
  '/our-journey', '/privacy-policy', '/terms-and-conditions', '/disclaimer',
  '/ahemdabad', '/hydrabad',
  '/nagpur', '/mumbai', '/pune', '/bangalore', '/chennai', '/delhi',
  '/ahmedabad', '/hyderabad', '/amritsar', '/kolkata', '/bhopal',
  '/kozhikode', '/indore', '/vijayawada', '/bhubaneswar',
];
const widths = [320, 390, 430];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const report = [];
  try {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'geolocation', { value: { getCurrentPosition() {} } });
      });
      for (const route of routes) {
        const page = await context.newPage();
        try {
          const response = await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(150);
          const result = await page.evaluate(() => {
            const width = innerWidth;
            const all = [...document.querySelectorAll('body *')];
            const visible = element => {
              const style = getComputedStyle(element);
              return style.display !== 'none' && style.visibility !== 'hidden' && element.getBoundingClientRect().width > 0;
            };
            const overflow = all.filter(element => {
              if (!visible(element)) return false;
              const bounds = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              if (style.position === 'fixed' || style.position === 'absolute') return false;
              return bounds.left < -3 || bounds.right > width + 3;
            }).slice(0, 8).map(element => ({
              tag: element.tagName.toLowerCase(),
              className: typeof element.className === 'string' ? element.className.slice(0, 100) : '',
              text: element.textContent?.trim().slice(0, 65),
              left: Math.round(element.getBoundingClientRect().left),
              right: Math.round(element.getBoundingClientRect().right),
            }));
            const clippedText = all.filter(element => {
              if (!visible(element) || !/^(H[1-6]|P|BUTTON|A|SPAN)$/.test(element.tagName)) return false;
              const style = getComputedStyle(element);
              return style.overflowX === 'hidden' && element.scrollWidth > element.clientWidth + 3;
            }).slice(0, 8).map(element => ({ tag: element.tagName.toLowerCase(), text: element.textContent?.trim().slice(0, 75) }));
            return { scrollWidth: document.documentElement.scrollWidth, overflow, clippedText };
          });
          report.push({ route, width, status: response?.status(), ...result });
          console.log(`${width} ${route} ${response?.status()} scroll=${result.scrollWidth} off=${result.overflow.length} clipped=${result.clippedText.length}`);
        } catch (error) {
          report.push({ route, width, error: error.message });
          console.log(`${width} ${route} ERROR ${error.message}`);
        } finally {
          await page.close();
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
    fs.writeFileSync(process.env.AUDIT_REPORT || 'mobile-audit.json', JSON.stringify(report, null, 2));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
