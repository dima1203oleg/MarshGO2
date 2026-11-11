// PREMIUM-8 CP5 — surface audit: how many distinct blues does the running app actually paint,
// and does every visible text run still clear WCAG AA after the palette is unified?
//   BASE_URL=http://localhost:4175 node scratch/audit-cp5-surface.mjs
// This is a throwaway measurement harness, not CI: the site repo still has no Playwright project.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4175';
const OUT = process.env.OUT_DIR ?? '/tmp/cp5-evidence';
const VIEWPORT = { width: 393, height: 852 };
mkdirSync(OUT, { recursive: true });

const email = `cp5.audit.${Date.now()}@marshgo.ua`;
const password = 'Password2026!';
const report = { base: BASE, viewport: `${VIEWPORT.width}x${VIEWPORT.height}`, themes: {}, pageErrors: [] };

// Runs inside the page. Collects, for every visible painted element, the resolved colour it really
// shows (computed styles, not the class name) and, for every visible text run, the contrast against
// the first non-transparent background behind it.
const census = () => {
  const parse = (value) => {
    const m = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/.exec(value);
    if (!m) return null;
    const a = m[4] === undefined ? 1 : Number(m[4]);
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a };
  };
  const hex = ({ r, g, b }) => `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  const luminance = ({ r, g, b }) => {
    const f = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (a, b) => {
    const la = luminance(a), lb = luminance(b);
    return +(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2));
  };
  // Composite a translucent colour over an opaque backdrop so translucent scrims are measured honestly.
  const over = (fg, bg) => ({
    r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
    a: 1,
  });

  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0
      && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
  };

  const blues = {};
  let unresolved = 0;
  const painted = (value, role, el) => {
    const c = parse(value);
    if (!c || c.a < 0.35) return;
    const { r, g, b } = c;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return;                       // achrome: greys, whites, blacks
    if (b !== max) return;                         // blue must dominate
    if (max - min < 40) return;                    // near-grey tints
    // Hue for the blue-dominant sector of the HSL wheel: 60 * (4 + (r - g) / (max - min)).
    // Using the red-dominant formula here silently filtered out every blue the app paints.
    const hue = 60 * (4 + (r - g) / (max - min));
    if (hue < 185 || hue > 255) return;            // not the blue family
    const key = hex(c);
    (blues[key] ??= { count: 0, roles: {}, samples: [] }).count += 1;
    blues[key].roles[role] = (blues[key].roles[role] ?? 0) + 1;
    if (blues[key].samples.length < 3) {
      const cls = (typeof el.className === 'string' ? el.className : '').split(/\s+/).filter(Boolean).slice(0, 2).join('.');
      blues[key].samples.push(`${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`);
    }
  };

  const textRuns = [];
  const elements = [...document.querySelectorAll('.production-app *')];
  for (const el of elements) {
    if (!visible(el)) continue;
    const style = getComputedStyle(el);
    painted(style.color, 'color', el);
    painted(style.backgroundColor, 'background', el);
    painted(style.borderTopColor, 'border', el);
    painted(style.outlineColor, 'outline', el);
    // Only leaf text nodes are measured: a container's colour is inherited by its children anyway.
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent || '').trim().length > 0);
    if (!ownText) continue;
    // Resolve the real backdrop the way the browser composites it: every ancestor's background colour,
    // translucent ones included, stacked bottom-up until something is fully opaque. A gradient or the
    // map canvas behind the text is NOT resolvable from computed styles, so those runs are reported as
    // unmeasurable rather than guessed at — guessing is what previously produced a false #000000 backdrop.
    const stack = [];
    let unmeasurable = null;
    for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
      const nodeStyle = getComputedStyle(node);
      const image = nodeStyle.backgroundImage;
      const candidate = parse(nodeStyle.backgroundColor);
      if (candidate && candidate.a > 0) stack.push(candidate);
      if (candidate && candidate.a >= 1) break;
      if (image && image !== 'none' && /gradient/.test(image)) { unmeasurable = 'gradient'; break; }
    }
    if (unmeasurable) { unresolved += 1; continue; }
    let background = { r: 255, g: 255, b: 255, a: 1 };
    for (const layer of stack.reverse()) background = layer.a >= 1 ? layer : over(layer, background);
    if (background.a < 1) background = over(background, parse(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 });
    const fgRaw = parse(style.color);
    if (!fgRaw) continue;
    const fg = fgRaw.a < 1 ? over(fgRaw, background) : fgRaw;
    const px = Number.parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    textRuns.push({
      id: `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className.split(/\s+/)[0] : '') || '?'}`,
      text: (el.textContent || '').trim().slice(0, 28),
      px, weight, large,
      fg: hex(fg), bg: hex(background),
      ratio: contrast(fg, background),
    });
  }
  const failures = textRuns.filter((run) => run.ratio < (run.large ? 3 : 4.5));
  const worst = textRuns.slice().sort((a, b) => a.ratio - b.ratio).slice(0, 12);
  return { distinctBlues: Object.keys(blues).length, blues, textRuns: textRuns.length, unresolvedBackgrounds: unresolved, failures: failures.length, worst, failureList: failures.slice(0, 25) };
};

const browser = await chromium.launch();

// Each theme gets its own fresh context. Reusing one page and reloading is not enough: the active
// journey now survives a reload (CP2), so a second sweep would start inside the restored navigation
// screen instead of Home and measure the wrong thing. The theme is written before first paint, the
// same way the Profile toggle persists it.
const openPass = async (theme) => {
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await context.addInitScript(([mode]) => {
    try { localStorage.setItem('mg_theme', mode); } catch { /* storage unavailable */ }
  }, [theme]);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error.message).slice(0, 160)));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.locator('button:has-text("У мене вже є акаунт")').click({ timeout: 20_000 });
  await page.locator('button:has-text("Немає акаунта? Зареєструватися")').click({ timeout: 20_000 });
  const email = `cp5.${theme}.${Date.now()}@marshgo.ua`;
  await page.locator('input[autocomplete="name"]').fill('CP5 Audit');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[autocomplete="new-password"]').fill(password);
  const [registerResponse] = await Promise.all([
    page.waitForResponse((r) => new URL(r.url()).pathname === '/api/v1/auth/register', { timeout: 30_000 }),
    page.locator('button:has-text("Зареєструватися")').click(),
  ]);
  await page.waitForSelector('.production-app', { timeout: 30_000 });
  await page.waitForTimeout(1_500);
  const themeApplied = await page.evaluate(() => ({
    darkClass: document.documentElement.classList.contains('dark'),
    sheetTheme: document.querySelector('.route-map-screen')?.getAttribute('data-theme') ?? null,
  }));
  return { context, page, registerStatus: registerResponse.status(), themeApplied, errors };
};

const pickPlace = async (page, group, listId, text) => {
  const input = page.locator(`[role="group"][aria-label="${group}"] input`);
  await input.waitFor({ timeout: 20_000 });
  await input.fill(text);
  const option = page.locator(`#${listId} button`).first();
  await option.waitFor({ timeout: 30_000 });
  await option.click();
};

// One pass over the canonical chain, capturing every screen for the theme currently applied.
const sweep = async (page, label) => {
  const screens = {};
  screens.home = await page.evaluate(census);
  await page.screenshot({ path: `${OUT}/${label}-00-home.png` });

  await page.locator('[data-testid="global-bottom-navigation"] button:has-text("Пошук")').click({ timeout: 20_000 });
  await page.waitForTimeout(1_200);
  screens.search = await page.evaluate(census);
  await page.screenshot({ path: `${OUT}/${label}-01-search.png` });

  await pickPlace(page, 'Початкова точка', 'route-place-origin-list', 'Львів');
  await pickPlace(page, 'Кінцева точка', 'route-place-destination-list', 'Трускавець');
  await Promise.all([
    page.waitForResponse((r) => new URL(r.url()).pathname === '/api/v1/journeys/search', { timeout: 120_000 }),
    page.locator('button.search-submit').click(),
  ]);
  await page.waitForSelector('.journey-result-card', { timeout: 120_000 });
  await page.waitForTimeout(1_500);
  screens.results = await page.evaluate(census);
  await page.screenshot({ path: `${OUT}/${label}-02-results.png` });

  await page.locator('.journey-result-card').first().click({ timeout: 20_000 });
  await page.waitForTimeout(1_800);
  screens.routeDetails = await page.evaluate(census);
  await page.screenshot({ path: `${OUT}/${label}-03-route-details.png` });

  const start = page.locator('button:has-text("Розпочати")');
  await start.waitFor({ timeout: 30_000 });
  await start.click();
  await page.locator('[data-testid="active-journey-navigation"]').waitFor({ timeout: 30_000 });
  await page.waitForTimeout(2_500);
  screens.navigation = await page.evaluate(census);
  await page.screenshot({ path: `${OUT}/${label}-04-navigation.png` });

  const tally = (field) => Object.values(screens).reduce((sum, screen) => sum + screen[field], 0);
  const blues = {};
  for (const screen of Object.values(screens)) for (const [hex, meta] of Object.entries(screen.blues)) {
    const entry = (blues[hex] ??= { count: 0, roles: {}, screens: [] });
    entry.count += meta.count;
    entry.screens.push(Object.keys(screens).find((key) => screens[key].blues[hex]));
    for (const [role, n] of Object.entries(meta.roles)) entry.roles[role] = (entry.roles[role] ?? 0) + n;
  }
  return {
    distinctBlues: Object.keys(blues).length,
    blues: Object.fromEntries(Object.entries(blues).sort((a, b) => b[1].count - a[1].count)),
    textRuns: tally('textRuns'),
    unresolvedBackgrounds: tally('unresolvedBackgrounds'),
    contrastFailures: tally('failures'),
    failureList: Object.entries(screens).flatMap(([name, screen]) => screen.failureList.map((f) => ({ screen: name, ...f }))).slice(0, 40),
    worst: Object.entries(screens).flatMap(([name, screen]) => screen.worst.map((f) => ({ screen: name, ...f })))
      .sort((a, b) => a.ratio - b.ratio).slice(0, 20),
    screens: Object.fromEntries(Object.entries(screens).map(([k, v]) => [k, { distinctBlues: v.distinctBlues, textRuns: v.textRuns, contrastFailures: v.failures }])),
  };
};

for (const theme of ['light', 'dark']) {
  const pass = await openPass(theme);
  report.themes[theme] = { registerStatus: pass.registerStatus, themeApplied: pass.themeApplied, pageErrors: pass.errors, ...(await sweep(pass.page, theme)) };
  await pass.context.close();
}
report.registerStatus = report.themes.light.registerStatus;
report.darkClassApplied = report.themes.dark.themeApplied.darkClass;
report.pageErrors = [...report.themes.light.pageErrors, ...report.themes.dark.pageErrors];

writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  registerStatus: report.registerStatus,
  darkClassApplied: report.darkClassApplied,
  pageErrors: report.pageErrors,
  light: { distinctBlues: report.themes.light.distinctBlues, textRuns: report.themes.light.textRuns, unresolvedBackgrounds: report.themes.light.unresolvedBackgrounds, contrastFailures: report.themes.light.contrastFailures },
  dark: { distinctBlues: report.themes.dark.distinctBlues, textRuns: report.themes.dark.textRuns, unresolvedBackgrounds: report.themes.dark.unresolvedBackgrounds, contrastFailures: report.themes.dark.contrastFailures },
  lightBlues: Object.entries(report.themes.light.blues).map(([h, m]) => `${h} x${m.count} (${m.roles.color ?? 0} text/${m.roles.background ?? 0} fill)`),
  darkBlues: Object.entries(report.themes.dark.blues).map(([h, m]) => `${h} x${m.count} (${m.roles.color ?? 0} text/${m.roles.background ?? 0} fill)`),
}, null, 2));
await browser.close();
