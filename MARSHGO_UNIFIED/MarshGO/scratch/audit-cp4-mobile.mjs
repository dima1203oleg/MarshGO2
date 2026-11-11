// PREMIUM-8 CP4 — mobile ergonomics audit against the real acceptance API (throwaway account).
//   BASE_URL=http://localhost:4174 node scratch/audit-cp4-mobile.mjs [iphone15|max|narrow]
// Reports: controls under 44x44 px, text under 12 px, the 12-category mode grid, and sheet-drag frame timings.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4174';
const OUT = process.env.OUT_DIR ?? '/tmp/cp4-evidence';
// Three real device widths: the narrowest iPhone we must stay readable on, the reference
// iPhone 15 Pro Max the owner set as priority, and the Pro Max width with the larger safe areas.
const VIEWPORTS = { narrow: { width: 320, height: 568 }, iphone15: { width: 393, height: 852 }, max: { width: 430, height: 932 } };
const WIDE = VIEWPORTS[process.argv[2] ?? 'iphone15'] ?? VIEWPORTS.iphone15;
mkdirSync(OUT, { recursive: true });

const email = `cp4.audit.${Date.now()}@marshgo.ua`;
const password = 'Password2026!';
const report = { base: BASE, viewport: `${WIDE.width}x${WIDE.height}`, screens: {} };
const pageErrors = [];

// Runs inside the page: measures every visible control and every visible text run.
const probe = () => {
  const FLOOR = 44;
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false;
    if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) return false;
    return true;
  };
  const idOf = (el) => {
    const testId = el.getAttribute('data-testid');
    const label = el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 24);
    const cls = (typeof el.className === 'string' ? el.className : '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
    return `${el.tagName.toLowerCase()}${testId ? `[${testId}]` : cls ? `.${cls}` : ''}${label ? ` "${label}"` : ''}`;
  };
  const smallControls = [];
  // Some controls keep a compact visual box on purpose (the route ribbon pill sits inside a
  // one-screenful sheet) and reach the touch floor through an invisible ::before hit area.
  // A bounding rect cannot see that, so anything that fails on its box is re-measured by
  // hit-testing outward from its centre: how far can a finger land and still activate this control?
  const hitBoxOf = (el) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const owns = (x, y) => {
      const top = document.elementFromPoint(x, y);
      return !!top && (top === el || el.contains(top));
    };
    const reach = (axis, sign) => {
      for (let step = 2; step <= 24; step += 2) {
        const x = axis === 'x' ? cx + step * sign : cx;
        const y = axis === 'y' ? cy + step * sign : cy;
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return step - 2;
        if (!owns(x, y)) return step - 2;
      }
      return 24;
    };
    const left = reach('x', -1), right = reach('x', 1), top = reach('y', -1), bottom = reach('y', 1);
    return { w: Math.round(left + right + rect.width), h: Math.round(top + bottom + rect.height) };
  };
  for (const el of document.querySelectorAll('button, a[href], input:not([type="hidden"]), select, summary, [role="button"], [role="tab"], [role="checkbox"]')) {
    if (!visible(el)) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width >= FLOOR && rect.height >= FLOOR) continue;
    const hit = hitBoxOf(el);
    if (hit.w >= FLOOR && hit.h >= FLOOR) continue;
    smallControls.push({ id: idOf(el), w: Math.round(rect.width), h: Math.round(rect.height), hitW: hit.w, hitH: hit.h });
  }
  const smallText = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = (node.nodeValue || '').trim();
    if (!text || text.length < 2) continue;
    const el = node.parentElement;
    if (!el || !visible(el)) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size >= 12) continue;
    const cls = (typeof el.className === 'string' ? el.className : '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
    const key = `${cls}|${el.tagName}|${size}`;
    if (seen.has(key)) continue;
    seen.add(key);
    smallText.push({ size, selector: `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`, sample: text.slice(0, 40) });
  }
  return {
    smallControls: smallControls.sort((a, b) => Math.min(a.w, a.h) - Math.min(b.w, b.h)).slice(0, 40),
    controlCount: smallControls.length,
    smallText: smallText.sort((a, b) => a.size - b.size).slice(0, 40),
    textCount: smallText.length,
  };
};

// The canonical mode grid: exactly 12 categories, canonical order, labels readable and not clipped.
const probeGrid = () => {
  const grid = document.querySelector('.transport-mode-grid');
  if (!grid) return null;
  const style = getComputedStyle(grid);
  const buttons = [...grid.querySelectorAll('button')];
  const labels = buttons.map((button) => {
    const cell = button.getBoundingClientRect();
    let clipped = false;
    // The visible category name is a direct text node of the button, so the leaf loop below
    // never sees it; take the button's own font size as the starting measurement.
    let smallest = parseFloat(getComputedStyle(button).fontSize);
    for (const el of button.querySelectorAll('*')) {
      const text = (el.textContent || '').trim();
      if (!text || el.children.length) continue;
      // .sr-only is clipped by design (1 px box); counting it as truncated text produced five
      // false positives on the disabled tiles and hid real truncation behind them.
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      if (el.classList.contains('sr-only') || style.position === 'absolute' && (box.width <= 1 || box.height <= 1)) continue;
      smallest = Math.min(smallest, parseFloat(style.fontSize));
      if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) clipped = true;
    }
    // The category name itself is the button's own text, so test the button for overflow too.
    if (button.scrollWidth > button.clientWidth + 1) clipped = true;
    return { label: (button.getAttribute('aria-label') || button.textContent || '').trim().slice(0, 20), w: Math.round(cell.width), h: Math.round(cell.height), px: smallest, clipped };
  });
  return {
    count: buttons.length,
    columns: style.gridTemplateColumns.split(' ').filter(Boolean).length,
    order: labels.map((item) => item.label),
    minLabelPx: Math.min(...labels.map((item) => item.px)),
    clipped: labels.filter((item) => item.clipped).map((item) => item.label),
    minCell: labels.reduce((best, item) => (item.w < best.w ? item : best), labels[0]),
  };
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: WIDE, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
page.on('pageerror', (error) => pageErrors.push(String(error.message).slice(0, 160)));

await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.locator('button:has-text("У мене вже є акаунт")').click({ timeout: 20_000 });
await page.locator('button:has-text("Немає акаунта? Зареєструватися")').click({ timeout: 20_000 });
await page.locator('input[autocomplete="name"]').fill('CP4 Audit');
await page.locator('input[type="email"]').fill(email);
await page.locator('input[autocomplete="new-password"]').fill(password);
const [registerResponse] = await Promise.all([
  page.waitForResponse((r) => new URL(r.url()).pathname === '/api/v1/auth/register', { timeout: 30_000 }),
  page.locator('button:has-text("Зареєструватися")').click(),
]);
report.registerStatus = registerResponse.status();
await page.waitForSelector('.production-app', { timeout: 30_000 });
await page.waitForTimeout(1_200);
report.screens.home = await page.evaluate(probe);

// The short-viewport block (max-width 639px and max-height 620px) is where the 12 px floor has the
// least room: it exists to compress the home banner so the action grid stays above the fold. Raising
// its 10 px caption to 12 px is only correct if the copy still fits, so measure the floored text
// against its banner box rather than assume it.
report.homeBannerFit = await page.evaluate(async () => {
  const root = document.querySelector('.home-canonical-banner');
  if (!root) return { present: false };
  // The banner auto-rotates every 5 s and the two slides carry very different CTA labels
  // («Опублікувати поїздку» vs «Знайти маршрут»), so one sample is a coin flip: drive every dot and
  // measure each slide deterministically.
  const settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const dots = [...root.querySelectorAll('div[role="group"] button')];
  const slides = [];
  for (let index = 0; index < dots.length; index += 1) {
    // The banner section is keyed by its eyebrow, so React remounts it on every slide change and the
    // dot nodes captured above go stale. Click a detached node and the event never bubbles to the root
    // container, so React ignores it — re-query the live dot for each slide instead.
    document.querySelectorAll('.home-canonical-banner div[role="group"] button')[index]?.click();
    await settle();
    const banner = document.querySelector('.home-canonical-banner');
  const copy = [...banner.querySelectorAll('p')].at(-1);
  const cta = banner.querySelector('.home-action-cta');
  const b = banner.getBoundingClientRect();
  const r = copy?.getBoundingClientRect();
  const c = cta?.getBoundingClientRect();
  const overlap = (x, y) => Math.round(Math.max(0, Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top)));
  slides.push({
    label: cta?.textContent?.trim() ?? null,
    banner: `${Math.round(b.width)}x${Math.round(b.height)}`,
    copyPx: copy ? parseFloat(getComputedStyle(copy).fontSize) : null,
    // overflow-hidden on the banner means clipped text is invisible, not wrapped — the honest signal
    // is scrollHeight vs clientHeight of the copy element itself.
    copyScrollH: copy?.scrollHeight ?? null,
    copyClientH: copy?.clientHeight ?? null,
    copyBottomInsideBanner: r && b ? Math.round(b.bottom - r.bottom) : null,
    foldVisible: b.bottom <= innerHeight,
    // The screenshot at 320x568 showed the CTA pill sitting on top of the last copy line, so measure
    // the intersection instead of inferring it from the image.
    cta: c ? `${Math.round(c.width)}x${Math.round(c.height)} px` : null,
    // Height ÷ line-height is not a line count for a min-h-11 pill: 44 px is already taller than one
    // 13 px line, so it reported "2 lines" for a pill that rendered one. Count the text's own line
    // boxes with a Range, and read the wrap off the row rather than off the button.
    ctaLabelLines: (() => {
      if (!cta) return null;
      const text = [...cta.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      if (!text) return null;
      const range = document.createRange();
      range.selectNodeContents(text);
      return range.getClientRects().length;
    })(),
    rowHeight: (() => { const row = cta?.parentElement; return row ? Math.round(row.getBoundingClientRect().height) : null; })(),
    dotsInsideBannerRight: (() => {
      const group = cta?.parentElement?.querySelector('div[role="group"]');
      return group ? Math.round(b.right - group.getBoundingClientRect().right) : null;
    })(),
    // The compression block exists to keep the quick-action grid above the fold; verify the thing it
    // is for, not only the banner. Positive = px of clearance between the grid and the fold.
    actionGridBottomInsideFold: (() => {
      const grid = document.querySelector('.home-action-grid');
      return grid ? Math.round(innerHeight - grid.getBoundingClientRect().bottom) : null;
    })(),
    ctaOverCopyPx: c && r ? overlap(c, r) : null,
    ctaOverflowsBannerRight: c ? Math.round(c.right - b.right) : null,
  });
  }
  return { present: true, slides };
});
// Leave the longest CTA label on screen so 00-home-*.png shows the case the fix is about.
await page.locator('.home-canonical-banner div[role="group"] button').first().click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/00-home-${WIDE.width}.png` });

// Search screen holds the canonical 12-category grid.
await page.locator('[data-testid="global-bottom-navigation"] button:has-text("Пошук")').click({ timeout: 20_000 });
await page.waitForTimeout(1_200);
report.screens.search = await page.evaluate(probe);
report.modeGrid = await page.evaluate(probeGrid);
await page.screenshot({ path: `${OUT}/01-search-${WIDE.width}.png` });

const pickPlace = async (group, listId, text) => {
  const input = page.locator(`[role="group"][aria-label="${group}"] input`);
  await input.waitFor({ timeout: 20_000 });
  await input.fill(text);
  const option = page.locator(`#${listId} button`).first();
  await option.waitFor({ timeout: 30_000 });
  await option.click();
};
await pickPlace('Початкова точка', 'route-place-origin-list', 'Львів');
await pickPlace('Кінцева точка', 'route-place-destination-list', 'Трускавець');
const [searchResponse] = await Promise.all([
  page.waitForResponse((r) => new URL(r.url()).pathname === '/api/v1/journeys/search', { timeout: 120_000 }),
  page.locator('button.search-submit').click(),
]);
report.searchStatus = searchResponse.status();
await page.waitForSelector('.journey-result-card', { timeout: 120_000 });
await page.waitForTimeout(1_500);
report.screens.results = await page.evaluate(probe);

// Canonical chain to navigation: card -> details -> «Розпочати».
await page.locator('.journey-result-card').first().click({ timeout: 20_000 });
await page.waitForTimeout(1_500);
const start = page.locator('button:has-text("Розпочати")');
await start.waitFor({ timeout: 30_000 });
report.screens.routeDetails = await page.evaluate(probe);
await start.click();
await page.locator('[data-testid="active-journey-navigation"]').waitFor({ timeout: 30_000 });
await page.waitForTimeout(2_500);
report.screens.navigation = await page.evaluate(probe);
await page.screenshot({ path: `${OUT}/02-navigation-${WIDE.width}.png` });

// Sheet drag: sample real frames while a finger-height swipe moves the grabber.
// A rAF interval alone cannot tell page jank from the driver's own CDP round-trips, so the same
// window also counts how many pointermove events reached the page, how many style writes the
// sheet actually performed (the frame-coalescing evidence) and any long task over 50 ms.
// A rAF interval on its own proves nothing: headless Chromium ticks on its own vsync, so a steady
// 33.4 ms cadence during a drag may simply be the harness clock. An idle baseline sampled from the
// same counter before the swipe is the control that makes the drag numbers mean something.
const frameStats = (frames) => {
  const sorted = [...frames].sort((a, b) => a - b);
  return {
    frames: frames.length,
    median: Number((sorted[Math.floor(sorted.length / 2)] ?? 0).toFixed(1)),
    p95: Number((sorted[Math.floor(sorted.length * 0.95)] ?? 0).toFixed(1)),
    worst: Number((sorted.at(-1) ?? 0).toFixed(1)),
    over32ms: frames.filter((f) => f > 32).length,
    over50ms: frames.filter((f) => f > 50).length,
  };
};
await page.evaluate(() => {
  window.__frames = [];
  let last = performance.now();
  const tick = (now) => { window.__frames.push(now - last); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  window.__drag = { styleWrites: 0, pointerMoves: 0, longTasks: 0, longTaskMs: 0, longAt: [] };
  window.__marks = {};
  const sheet0 = document.querySelector('[data-testid="active-navigation-sheet"]');
  if (sheet0) new MutationObserver((records) => { window.__drag.styleWrites += records.length; })
    .observe(sheet0, { attributes: true, attributeFilter: ['style'] });
  document.addEventListener('pointermove', () => { window.__drag.pointerMoves += 1; }, true);
  document.addEventListener('pointerdown', (event) => { window.__drag.pointerId = event.pointerId; }, true);
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__drag.longTasks += 1;
        window.__drag.longTaskMs += Math.round(entry.duration);
        // A long task is only actionable if you know which part of the gesture it landed in.
        window.__drag.longAt.push(Math.round(entry.startTime));
      }
    }).observe({ entryTypes: ['longtask'] });
  } catch { /* longtask entries are a Chromium extension; the frame timing still stands */ }
  // longtask says "the main thread was blocked for 62 ms" but not by what. long-animation-frame
  // (Chromium 123+) attributes the blocking work to a script, which is the difference between
  // "the gesture is janky" and "the map layer repaints under the sheet". Kept unfiltered: the
  // first version dropped sub-50 ms frames and reported nothing at all during a drag that produced
  // 8 longtasks, which is itself the finding — the blocked time is not inside rendered frames.
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const scripts = (entry.scripts ?? []).map((s) => ({
          invoker: s.invoker ?? s.name,
          fn: s.sourceFunctionName ?? '',
          url: String(s.sourceURL ?? '').split('/').pop() ?? '',
          dur: Math.round(s.duration),
        })).sort((a, b) => b.dur - a.dur).slice(0, 2);
        (window.__drag.blockedFrames ??= []).push({
          dur: Math.round(entry.duration),
          blocking: Math.round(entry.blockingDuration),
          first: Math.round(entry.startTime),
          scripts,
        });
      }
    }).observe({ entryTypes: ['long-animation-frame'] });
  } catch { /* unsupported engine: the longtask counters above still stand */ }
  // The other half of the question: is MapLibre drawing while the finger moves? Counting GL draw
  // calls is a direct answer, and it does not depend on the frame timers agreeing.
  window.__gl = { draws: 0, uploads: 0 };
  for (const proto of [window.WebGLRenderingContext?.prototype, window.WebGL2RenderingContext?.prototype]) {
    if (!proto) continue;
    for (const [method, key] of [['drawArrays', 'draws'], ['drawElements', 'draws'], ['texImage2D', 'uploads'], ['texSubImage2D', 'uploads']]) {
      const original = proto[method];
      if (typeof original !== 'function') continue;
      proto[method] = function patche(...args) { window.__gl[key] += 1; return original.apply(this, args); };
    }
  }
});
await page.waitForTimeout(600);
// Splicing empties the counter, so everything read after this point is drag-and-settle time.
const idle = await page.evaluate(() => window.__frames.splice(0));
const sheet = page.locator('[data-testid="active-navigation-sheet"]');
const grabber = page.locator('.route-sheet-grabber');
const box = await grabber.boundingBox();
report.sheet = { grabber: box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'missing', idle: frameStats(idle.slice(2)) };

const resetToHalf = async () => {
  for (let i = 0; i < 4; i += 1) {
    const state = await sheet.getAttribute('data-sheet-state');
    if (state === 'half') return true;
    await page.locator('.route-sheet-grabber__handle').first().click({ timeout: 5_000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
  return await sheet.getAttribute('data-sheet-state') === 'half';
};

// One measured drag, from a reset counter set to a settled sheet. Everything the gesture touches is
// sampled inside the same window: frame deltas, style writes, pointer moves, longtasks, LoAF
// attribution and the map's own draw calls.
const gestureDrag = async () => {
  const b = await grabber.boundingBox();
  if (!b) return { missing: true };
  await page.evaluate(() => {
    window.__drag = { styleWrites: 0, pointerMoves: 0, longTasks: 0, longTaskMs: 0, longAt: [], blockedFrames: [] };
    window.__gl = { draws: 0, uploads: 0 };
    window.__frames.splice(0);
    window.__marks = { zero: Math.round(performance.now()) };
  });
  const before = await sheet.evaluate((el) => el.getBoundingClientRect().height);
  const x = b.x + b.width / 2;
  await page.mouse.move(x, b.y + b.height / 2);
  await page.mouse.down();
  await page.evaluate(() => { window.__marks.down = Math.round(performance.now()); });
  for (let i = 1; i <= 24; i += 1) await page.mouse.move(x, b.y + b.height / 2 - i * 14, { steps: 1 });
  await page.mouse.up();
  await page.evaluate(() => { window.__marks.up = Math.round(performance.now()); });
  await page.waitForTimeout(700);
  const sampled = await page.evaluate(() => ({
    frames: window.__frames.slice(2),
    drag: { ...window.__drag, blockedFrames: (window.__drag.blockedFrames ?? []).slice(-6) },
    marks: { ...window.__marks },
    gl: { ...window.__gl },
  }));
  const after = await sheet.evaluate((el) => el.getBoundingClientRect().height);
  return {
    ...frameStats(sampled.frames),
    ...sampled.drag,
    glDraws: sampled.gl.draws,
    glUploads: sampled.gl.uploads,
    phaseMs: { down: sampled.marks.down - sampled.marks.zero, up: sampled.marks.up - sampled.marks.zero },
    beforeHeight: Math.round(before),
    afterHeight: Math.round(after),
    settledSnap: await sheet.getAttribute('data-sheet-state'),
  };
};

if (box) {
  report.sheet.drag = await gestureDrag();
  await page.screenshot({ path: `${OUT}/03-navigation-expanded-${WIDE.width}.png` });

  // A/B for the residual longtasks: the identical gesture with the map surface taken out of the
  // render tree. Same sheet, same handlers, same frame timers — only the WebGL layer differs. This
  // is a diagnostic mutation of the live page, not a product state; it runs after the real numbers.
  await resetToHalf();
  await page.evaluate(() => {
    const canvas = document.querySelector('.maplibregl-canvas');
    const container = canvas?.parentElement ?? null;
    if (container) container.dataset.auditHidden = 'true';
    if (canvas) canvas.style.visibility = 'hidden';
  });
  await page.waitForTimeout(300);
  report.sheet.dragMapHidden = await gestureDrag();
  await page.evaluate(() => {
    const canvas = document.querySelector('.maplibregl-canvas');
    if (canvas) canvas.style.visibility = '';
    const container = document.querySelector('[data-audit-hidden]');
    if (container) delete container.dataset.auditHidden;
  });
}

// Safe-area declaration and thumb-zone placement, checked on the real DOM.
// A computed padding is always reported in px, so "includes('px')" could never fail: it proved
// nothing. This reads the declared values from the live CSSOM instead, which is the part that can
// actually be wrong. Desktop Chromium resolves env(safe-area-inset-*) to 0, so the computed
// numbers stay zero here — the non-zero inset itself is only checkable on a physical device (CP7).
report.safeArea = await page.evaluate(() => {
  const sheet = document.querySelector('[data-testid="active-navigation-sheet"]');
  const cta = sheet?.querySelector('.mg-route-cta');
  const envRules = [];
  for (const group of document.styleSheets) {
    let rules;
    try { rules = group.cssRules; } catch { continue; }
    for (const rule of rules ?? []) {
      if (rule.style?.paddingBottom?.includes('env(') || rule.style?.bottom?.includes('env('))
        envRules.push(`${rule.selectorText} { ${rule.style.cssText.slice(0, 120)} }`);
    }
  }
  return {
    envRules: envRules.slice(0, 8),
    envRuleCount: envRules.length,
    sheetPaddingBottomPx: sheet ? Math.round(parseFloat(getComputedStyle(sheet).paddingBottom)) : null,
    ctaBottomGapToViewport: cta ? Math.round(innerHeight - cta.getBoundingClientRect().bottom) : null,
    ctaHeight: cta ? Math.round(cta.getBoundingClientRect().height) : null,
    viewportFitCover: document.querySelector('meta[name=viewport]')?.content.includes('viewport-fit=cover') ?? false,
  };
});

// prefers-reduced-motion has to reach the sheet even though its transition is set inline in the
// style prop: the JS listener is what makes the media change take effect, so flip the emulation
// and watch the next snap become instantaneous.
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForTimeout(250);
const handle = page.locator('.route-sheet-grabber__handle');
if (await handle.count()) {
  await handle.first().click({ timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(120);
}
report.reducedMotion = await page.evaluate(() => {
  const sheet = document.querySelector('[data-testid="active-navigation-sheet"]');
  const style = sheet ? getComputedStyle(sheet) : null;
  return {
    matchesReduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    inlineTransition: sheet?.style.transition ?? null,
    computedDuration: style?.transitionDuration ?? null,
  };
});
await page.emulateMedia({ reducedMotion: null });

// The coalescer can only be proven by input that outruns the display. page.mouse.move() is one
// awaited CDP call per step, so a real drag here delivers ~1 pointermove per frame and the writer
// has nothing to collapse: styleWrites 27 vs pointerMoves 25 measured that way proves nothing.
// This dispatches 8 pointermoves inside a single task — a 120 Hz/250 Hz stylus or a trackpad burst
// — and counts the style writes the sheet actually made for them.
const burstBox = await page.locator('.route-sheet-grabber').boundingBox();
if (burstBox) {
  await resetToHalf();
  const pid = await page.evaluate(() => window.__drag.pointerId ?? 1);
  const bb = await page.locator('.route-sheet-grabber').boundingBox();
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await page.mouse.down();
  report.coalescing = await page.evaluate(async (pointerId) => {
    const el = document.querySelector('.route-sheet-grabber');
    const sheetEl = document.querySelector('[data-testid="active-navigation-sheet"]');
    const rect = el.getBoundingClientRect();
    const startY = rect.y + rect.height / 2;
    window.__drag.styleWrites = 0;
    window.__drag.pointerMoves = 0;
    const heightBefore = Math.round(sheetEl.getBoundingClientRect().height);
    for (let i = 1; i <= 8; i += 1) {
      el.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, cancelable: true, isPrimary: true, pointerId, pointerType: 'mouse',
        clientX: rect.x + rect.width / 2, clientY: startY - i * 18,
      }));
    }
    const movesSeen = window.__drag.pointerMoves;
    const heightBeforeFrame = Math.round(sheetEl.getBoundingClientRect().height);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    return {
      dispatched: 8,
      movesSeen,
      styleWrites: window.__drag.styleWrites,
      heightBefore,
      heightBeforeFrame,
      heightAfterFrame: Math.round(sheetEl.getBoundingClientRect().height),
    };
  }, pid);
  await page.mouse.up();
  await page.waitForTimeout(700);
  report.coalescing.settledSnap = await page.locator('[data-testid="active-navigation-sheet"]').getAttribute('data-sheet-state');
}

report.pageErrors = pageErrors;
const json = JSON.stringify(report, null, 2);
writeFileSync(`${OUT}/report-${WIDE.width}.json`, `${json}\n`);
console.log(json);
await browser.close();
