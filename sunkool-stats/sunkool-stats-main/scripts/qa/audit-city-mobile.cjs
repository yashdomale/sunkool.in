const { chromium } = require('playwright');
const fs = require('node:fs');

const origin = process.env.CITY_TEST_ORIGIN || 'http://localhost:3000';
const cities = [
  'nagpur', 'mumbai', 'pune', 'bangalore', 'chennai', 'delhi',
  'ahmedabad', 'hyderabad', 'amritsar', 'kolkata', 'bhopal',
  'kozhikode', 'indore', 'vijayawada', 'bhubaneswar',
];
const widths = [320, 360, 375, 390, 412, 430, 1440];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const report = [];
  try {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      for (const city of cities) {
        const page = await context.newPage();
        try {
          const response = await page.goto(`${origin}/${city}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.getByRole('dialog', { name: 'Use your location?' }).waitFor({ timeout: 10000 });
          const layout = await page.evaluate(() => {
            const viewport = document.documentElement.clientWidth;
            const visible = element => {
              const style = getComputedStyle(element);
              const box = element.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0;
            };
            const overflow = [...document.querySelectorAll('main *, .city-landing *')]
              .filter(element => {
                if (!visible(element)) return false;
                const style = getComputedStyle(element);
                if (style.position === 'absolute' || style.position === 'fixed') return false;
                const box = element.getBoundingClientRect();
                return box.left < -3 || box.right > viewport + 3;
              })
              .slice(0, 8)
              .map(element => ({ tag: element.tagName, className: String(element.className).slice(0, 80), text: element.textContent?.trim().slice(0, 45) }));
            const dialog = document.querySelector('.city-location-popup');
            const dialogBox = dialog?.getBoundingClientRect();
            return {
              viewport, scrollWidth: document.documentElement.scrollWidth,
              sectionCount: document.querySelectorAll('.city-landing section').length,
              headingCount: document.querySelectorAll('.city-landing h2').length,
              headerCount: document.querySelectorAll('header').length,
              footerCount: document.querySelectorAll('footer').length,
              logoCount: document.querySelectorAll('header img[alt*="SUNKOOL"]').length,
              dialogFits: !!dialogBox && dialogBox.left >= 0 && dialogBox.right <= viewport,
              yes: !!dialog?.querySelector('button.city-location-allow'),
              no: !!dialog?.querySelector('button.city-location-decline'),
              overflow,
            };
          });
          const row = { city, width, status: response?.status(), ...layout };
          report.push(row);
          console.log(`${city} ${width}: ${row.status} scroll=${row.scrollWidth} sections=${row.sectionCount} overflow=${row.overflow.length} dialog=${row.dialogFits}`);
        } catch (error) {
          report.push({ city, width, error: error.message });
          console.log(`${city} ${width}: ERROR ${error.message}`);
        } finally { await page.close(); }
      }
      await context.close();
    }
  } finally {
    await browser.close();
    fs.writeFileSync(process.env.CITY_AUDIT_REPORT || 'city-mobile-audit.json', JSON.stringify(report, null, 2));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
