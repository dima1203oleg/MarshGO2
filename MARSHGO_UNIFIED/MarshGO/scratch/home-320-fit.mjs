// Throwaway: does the 320x568 short-viewport home banner still fit now that its copy is floored at
// 12 px? Measures the p against its banner box and screenshots the result for the eye check.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 320, height: 568 } });
await page.goto(process.env.BASE_URL ?? 'http://localhost:4174', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const fit = await page.evaluate(() => {
  const banner = document.querySelector('.home-canonical-banner');
  const p = banner?.querySelector('p:last-of-type');
  if (!banner || !p) return { found: false };
  const b = banner.getBoundingClientRect();
  const r = p.getBoundingClientRect();
  return {
    found: true,
    banner: `${Math.round(b.width)}x${Math.round(b.height)}`,
    copyPx: parseFloat(getComputedStyle(p).fontSize),
    copyBox: `${Math.round(r.width)}x${Math.round(r.height)}`,
    overflowBottom: Math.round(r.bottom - b.bottom),
    overflowRight: Math.round(r.right - b.right),
    pScrollH: p.scrollHeight,
    pClientH: p.clientHeight,
  };
});
console.log(JSON.stringify(fit));
await page.screenshot({ path: '/tmp/cp4-evidence/final/00-home-320.png' });
await browser.close();
