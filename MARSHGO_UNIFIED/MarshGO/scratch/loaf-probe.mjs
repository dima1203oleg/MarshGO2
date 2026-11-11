// Throwaway probe #2: the first one blocked the main thread for 120 ms inside page.evaluate and got
// zero long-animation-frame entries, so LoAF needs a frame that is actually being rendered. This
// drives rAF + DOM mutation and blocks inside a rAF callback — the same shape as the sheet drag.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
await page.setContent('<div id="d"></div>');
const probe = await page.evaluate(async () => {
  const loaf = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) loaf.push({ d: Math.round(e.duration), blocking: Math.round(e.blockingDuration), scripts: (e.scripts ?? []).map((s) => `${s.name}:${Math.round(s.duration)}`) });
  }).observe({ entryTypes: ['long-animation-frame'] });
  let n = 0;
  await new Promise((resolve) => {
    const tick = () => {
      document.getElementById('d').textContent = String(n);
      n += 1;
      if (n % 5 === 0) { const t = performance.now(); while (performance.now() - t < 90) { /* block */ } }
      if (n < 30) requestAnimationFrame(tick); else resolve();
    };
    requestAnimationFrame(tick);
  });
  await new Promise((r) => setTimeout(r, 400));
  return { frames: n, loafCount: loaf.length, loaf: loaf.slice(0, 4) };
});
console.log(JSON.stringify(probe, null, 1));
await browser.close();
