import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { signInWithEmailPassword } from './support/authHelper';

/**
 * Clicks every visible button, tab and link on each screen of the signed-in web app and checks that the click
 * does something (URL, DOM or network changes) without throwing. Destructive account actions are skipped.
 */
// Audit navigation-heavy home actions last so starting navigation there cannot
// cover controls on the other screens within this single signed-in session.
const routes = ['/journeys/search', '/search', '/trips', '/trips/plan', '/map', '/profile', '/offers/new', '/demands/new', '/demands', '/demands/mine', '/messages', '/admin/verification', '/navigate', '/navigation', '/'];
const routesToAudit = process.env.E2E_BUTTON_AUDIT_ROUTE
  ? routes.filter((route) => route === process.env.E2E_BUTTON_AUDIT_ROUTE)
  : routes;
/** Text that must never reach a user: raw values, internal errors. */
const brokenText = /\bundefined\b|\bnull\b|\bNaN\b|\[object Object\]|Request failed|Internal Server Error|TypeError/;
const skip = /Вийти|Видалити|Скасувати|Завершити|Вихід|Заблокувати|Поскаржитися/i;

async function signIn(page: Page, name: string) {
  await signInWithEmailPassword(page, name);
}

async function dismissAuditOverlays(page: Page) {
  // Some controls open global overlays that persist while the app router
  // changes tabs. Dismiss them before testing the next screen so they do not
  // cover its controls or make later clicks target the overlay by mistake.
  const closeNotifications = page.getByRole('button', { name: 'Закрити сповіщення' });
  if (await closeNotifications.isVisible().catch(() => false)) await closeNotifications.click({ timeout: 1_000 }).catch(() => undefined);
  const closeQuickActions = page.getByRole('button', { name: 'Закрити вікно' });
  if (await closeQuickActions.isVisible().catch(() => false)) await closeQuickActions.click({ timeout: 1_000 }).catch(() => undefined);
  const status = page.getByRole('status');
  const closeStatus = status.getByRole('button', { name: 'Закрити повідомлення' });
  if (await closeStatus.isVisible().catch(() => false)) {
    await closeStatus.click({ timeout: 1_000 }).catch(() => undefined);
    await expect(status).toHaveCount(0, { timeout: 2_000 }).catch(() => undefined);
  }
  const layerDialog = page.getByRole('dialog', { name: 'Шари карти' });
  const expandedLayerToggle = layerDialog.locator('..').getByRole('button', { name: 'Шари карти' });
  if (await layerDialog.isVisible().catch(() => false)
    && await expandedLayerToggle.isVisible().catch(() => false)) await expandedLayerToggle.click({ timeout: 1_000 }).catch(() => undefined);
  // TripChatView is a full-screen layer (not an ARIA dialog). A message/chat
  // action can open it and leave it above the next SPA route unless dismissed.
  const chatBack = page.locator('[class*="fixed"][class*="inset-0"][class*="z-40"]')
    .getByRole('button', { name: 'Назад', exact: true }).first();
  if (await chatBack.isVisible().catch(() => false)) await chatBack.click({ timeout: 1_000 }).catch(() => undefined);
  const closeActionDrawer = page.locator('[class*="fixed"][class*="inset-0"]')
    .getByRole('button', { name: 'Закрити', exact: true }).last();
  if (await closeActionDrawer.isVisible().catch(() => false)) await closeActionDrawer.click({ timeout: 1_000 }).catch(() => undefined);
  for (let attempt = 0; attempt < 3; attempt++) {
    const modal = page.getByRole('dialog').last();
    if (await modal.count()) {
      const closeModal = modal.getByRole('button', { name: /^Закрити/ }).last();
      if (await closeModal.isVisible().catch(() => false)) {
        // Cleanup only: if another app surface overlaps this modal, do not
        // spend the Playwright default timeout retrying an impossible click.
        // The actual audited controls are still clicked without force.
        await closeModal.click({ timeout: 1_000, force: true }).catch(() => undefined);
        if (!(await modal.isVisible().catch(() => false))) continue;
      }
    }
    const alert = page.getByRole('alertdialog').last();
    if (await alert.count()) {
      const dismiss = alert.getByRole('button', { name: /Залишити|Назад|Закрити|Не зараз|Скасувати/ }).first();
      if (await dismiss.isVisible().catch(() => false)) { await dismiss.click(); continue; }
    }
    break;
  }
}

async function openSignedInRoute(page: Page, route: string) {
  await dismissAuditOverlays(page);
  // Keep this audit focused on screen controls. Hard reloading for every button
  // rotates the one-time refresh cookie repeatedly and can race session restore.
  // The app's router listens to popstate, so move between screens in the same
  // authenticated app session while still exercising each production URL.
  await page.evaluate(async (path) => {
    // Re-enter the same route through the home shell so transient subviews
    // (profile sections, open sheets, selected tabs) do not leak between controls.
    if (window.location.pathname === path) {
      window.history.pushState({ marshgoRoute: true }, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    window.history.pushState({ marshgoRoute: true }, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, route);
  await expect(page.locator('.production-app'), `signed-in shell did not settle on ${route}; URL=${page.url()}; body=${(await page.locator('body').innerText().catch(() => '')).slice(0, 500)}`).toBeVisible({ timeout: 15_000 });
  // `networkidle` can wait for the browser's background polling on every reload. This audit
  // checks that controls respond, so wait for the app shell and its normal render settling time.
  await page.waitForTimeout(100);
  // Search owns nested form/results/map subviews that intentionally survive SPA
  // route changes. Return to the form before auditing its controls so the
  // screen inventory and each individual click start from the same state.
  if (route === '/search') {
    const backToResults = page.getByRole('button', { name: 'Назад до результатів' });
    if (await backToResults.isVisible().catch(() => false)) await backToResults.click();
    const backToForm = page.getByRole('button', { name: 'Назад до пошуку' });
    if (await backToForm.isVisible().catch(() => false)) await backToForm.click();
    await expect(page.getByRole('textbox', { name: 'Звідки' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('textbox', { name: 'Куди' })).toBeVisible({ timeout: 10_000 });
  }
  // The trips empty-state CTA depends on the bookings request resolving; wait
  // for that screen's data to settle before collecting its dynamic controls.
  if (route === '/trips') {
    await page.waitForTimeout(400);
    const activeTrips = page.getByRole('tab', { name: /^Активні(?:\s·\s\d+)?$/ });
    if (await activeTrips.isVisible().catch(() => false) && await activeTrips.getAttribute('aria-selected') !== 'true') {
      await activeTrips.click();
    }
  }
  if (route === '/profile') {
    const backToProfile = page.getByRole('button', { name: 'Назад до профілю', exact: true });
    if (await backToProfile.isVisible().catch(() => false)) await backToProfile.click({ timeout: 1_000 });
  }
  await dismissAuditOverlays(page);
}

async function interactionFingerprint(page: Page) {
  return page.evaluate(() => ({
    url: location.href,
    text: document.body.innerText,
    state: [...document.querySelectorAll<HTMLElement>('[aria-pressed], [aria-selected], [aria-expanded], [role="dialog"], [role="alertdialog"], [role="status"]')]
      .map(el => [el.tagName, el.getAttribute('aria-label'), el.getAttribute('aria-pressed'), el.getAttribute('aria-selected'), el.getAttribute('aria-expanded'), el.innerText.slice(0, 160)]),
    controls: [...document.querySelectorAll<HTMLElement>('button, [role="tab"], [role="switch"], [role="radio"], a[href]')]
      .filter(el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0)
      .map(el => [el.tagName, el.getAttribute('role'), el.getAttribute('aria-label'), el.getAttribute('aria-current'), el.getAttribute('aria-pressed'), el.getAttribute('aria-expanded'), el.className, el.innerText.slice(0, 120), el instanceof HTMLAnchorElement ? el.href : null]),
    fields: [...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select')]
      .filter(el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0)
      .map(el => [el.tagName, el.getAttribute('aria-label'), el.getAttribute('placeholder'), el.value, el instanceof HTMLInputElement ? el.checked : null]),
    focus: document.activeElement instanceof HTMLElement
      ? [document.activeElement.tagName, document.activeElement.getAttribute('aria-label'), document.activeElement.getAttribute('placeholder'), document.activeElement.innerText.slice(0, 80)]
      : null,
    map: [...document.querySelectorAll<HTMLElement>('[data-marshgo-map-renderer]')]
      .map(el => [el.dataset.marshgoMapReady, el.dataset.marshgoCameraRequestId, el.dataset.marshgoActiveRouteSegmentId]),
  }));
}

test('every button on every main screen responds without errors', async ({ browser }) => {
  test.setTimeout(900_000);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: 49.8397, longitude: 24.0297, accuracy: 10 }, permissions: ['geolocation'] });
  const page = await context.newPage();
  const problems: string[] = []; const noEffect: string[] = []; const staleControls: string[] = []; const clicked: string[] = [];
  let requests = 0;
  page.on('pageerror', (error) => problems.push(`pageerror @${page.url()}: ${error.message}`));
  // The isolated E2E geocoder stub has no reverse lookup; the app must show a message for that (503 on /places/) rather than fail.
  page.on('response', (response) => { if (response.status() >= 500 && !new URL(response.url()).pathname.startsWith('/api/v1/places/')) problems.push(`http ${response.status()} ${response.url()}`); });
  page.on('request', () => { requests++; });
  await signIn(page, 'Button Audit');

  for (const route of routesToAudit) {
    await openSignedInRoute(page, route);
    const onLoad = (await page.evaluate(() => document.body.innerText)).match(brokenText);
    if (onLoad) problems.push(`raw text «${onLoad[0]}» on ${route}`);
    const controls = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('button, [role="tab"], [role="switch"], [role="radio"], a[href]')]
      .flatMap((el, index) => {
        const box = el.getBoundingClientRect(); const style = getComputedStyle(el);
        if (!(box.width > 0 && box.height > 0) || style.visibility === 'hidden' || (el as HTMLButtonElement).disabled || el.getAttribute('aria-disabled') === 'true') return [];
        // Clicking documentation/identity-provider links leaves the app and does not test an in-app control.
        if (el instanceof HTMLAnchorElement && new URL(el.href, location.href).origin !== location.origin) return [];
        const role = el.getAttribute('role') || (el instanceof HTMLButtonElement ? 'button' : el instanceof HTMLAnchorElement ? 'link' : 'button');
        return [{ index, role, label: (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim() }];
      }));
    const occurrences = new Map<string, number>();
    const safeControls = controls.filter((control) => control.label && !skip.test(control.label)).map((control) => {
      const key = `${control.role}\u0000${control.label}`;
      const occurrence = occurrences.get(key) ?? 0;
      occurrences.set(key, occurrence + 1);
      return { ...control, occurrence };
    });
    for (const { role, label, occurrence } of safeControls) {
      await openSignedInRoute(page, route);
      // DOM-derived text and Playwright's accessible-name calculation can
      // differ for nested icons/descriptions. Mark the same visible, enabled
      // DOM control by its stable position for this freshly rendered screen,
      // then use a normal Playwright click so actionability is still checked.
      const controlKey = createHash('sha1').update(`${role}\u0000${label}\u0000${occurrence}`).digest('hex').slice(0, 10);
      const auditId = `${route.replace(/[^a-z0-9]/gi, '-')}-${controlKey}`;
      const prepared = await page.evaluate(({ expectedRole, expectedLabel, targetOccurrence, id }) => {
        const matches = [...document.querySelectorAll<HTMLElement>('button, [role="tab"], [role="switch"], [role="radio"], a[href]')].filter((candidate) => {
          const candidateRole = candidate.getAttribute('role') || (candidate instanceof HTMLButtonElement ? 'button' : candidate instanceof HTMLAnchorElement ? 'link' : 'button');
          const candidateLabel = (candidate.getAttribute('aria-label') || candidate.innerText || candidate.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
          const box = candidate.getBoundingClientRect(); const style = getComputedStyle(candidate);
          return candidateRole === expectedRole && candidateLabel === expectedLabel && box.width > 0 && box.height > 0
            && style.visibility !== 'hidden' && !(candidate as HTMLButtonElement).disabled && candidate.getAttribute('aria-disabled') !== 'true';
        });
        const el = matches[targetOccurrence];
        if (!el) return false;
        el.setAttribute('data-e2e-audit-control', id);
        return true;
      }, { expectedRole: role, expectedLabel: label, targetOccurrence: occurrence, id: auditId });
      if (!prepared) {
        staleControls.push(`${route} → «${label}» (control changed before click)`);
        continue;
      }
      const locator = page.locator(`[data-e2e-audit-control="${auditId}"]`);
      await expect(locator).toBeVisible();
      // Compare the actual DOM, not just its length: aria-selected/class/value changes can have
      // the same serialized length while still being the intended result of a tab or toggle.
      const before = await interactionFingerprint(page);
      const requestsBefore = requests;
      try { await locator.click({ timeout: 1200 }); } catch (error) {
        const detail = error instanceof Error ? error.message.slice(-500).replace(/\s+/g, ' ').trim() : 'click failed';
        const overlayText = await page.locator('[class*="fixed"][class*="inset-0"]').evaluateAll((nodes) => nodes.map(node => `${(node as HTMLElement).innerText.slice(0, 300)} [buttons: ${[...node.querySelectorAll('button')].map(button => button.getAttribute('aria-label') || button.innerText).join(', ')}]`).join(' | ')).catch(() => '');
        // A route-changing action can dispatch successfully and render its
        // destination/modal before Playwright's default post-click navigation
        // wait reaches the short audit timeout. Classify the observed result,
        // not the timeout itself, so a working CTA is not reported as inert.
        await page.evaluate((id) => document.querySelector(`[data-e2e-audit-control="${id}"]`)?.removeAttribute('data-e2e-audit-control'), auditId);
        await page.waitForTimeout(100);
        const after = await interactionFingerprint(page);
        const visible = await page.evaluate(() => document.body.innerText);
        const broken = visible.match(brokenText);
        if (broken) problems.push(`raw text «${broken[0]}» after ${route} → «${label}»`);
        if (JSON.stringify(before) !== JSON.stringify(after) || requests !== requestsBefore) {
          clicked.push(`${route} → ${label}`);
          continue;
        }
        noEffect.push(`${route} → «${label}» (click timed out without an observed result: ${detail}; overlay=${overlayText})`);
        continue;
      }
      await page.evaluate((id) => document.querySelector(`[data-e2e-audit-control="${id}"]`)?.removeAttribute('data-e2e-audit-control'), auditId);
      await page.waitForTimeout(100);
      const after = await interactionFingerprint(page);
      const visible = await page.evaluate(() => document.body.innerText);
      const broken = visible.match(brokenText);
      if (broken) problems.push(`raw text «${broken[0]}» after ${route} → «${label}»`);
      clicked.push(`${route} → ${label}`);
      if (JSON.stringify(before) === JSON.stringify(after) && requests === requestsBefore) noEffect.push(`${route} → «${label}»`);
    }
  }
  await test.info().attach('clicked', { body: clicked.join('\n'), contentType: 'text/plain' });
  await test.info().attach('no-visible-effect', { body: noEffect.join('\n'), contentType: 'text/plain' });
  await test.info().attach('stale-controls', { body: staleControls.join('\n'), contentType: 'text/plain' });
  console.log(`BUTTON AUDIT: clicked ${clicked.length}, without visible effect ${noEffect.length}, changed before click ${staleControls.length}`);
  console.log(noEffect.map((line) => `  no effect: ${line}`).join('\n'));
  console.log(staleControls.map((line) => `  changed before click: ${line}`).join('\n'));
  expect(problems, problems.join('\n')).toEqual([]);
  expect(noEffect, 'every clicked control must produce a visible, URL, state, or network effect').toEqual([]);
  expect(staleControls, 'all enumerated enabled controls must still be available when individually tested').toEqual([]);
  await context.close();
});

test('empty search, trip filter, and demand form show an intentional state change', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: 49.8397, longitude: 24.0297, accuracy: 10 }, permissions: ['geolocation'] });
  const page = await context.newPage();
  let journeySearchPosts = 0;
  let demandPosts = 0;
  page.on('request', (request) => {
    if (request.method() !== 'POST') return;
    if (new URL(request.url()).pathname === '/api/v1/journeys/search') journeySearchPosts++;
    if (new URL(request.url()).pathname === '/api/v1/demands') demandPosts++;
  });
  try {
    await signIn(page, 'Empty State Audit');

    await openSignedInRoute(page, '/journeys/search');
    // The isolated fixture restores a saved route. Clear both endpoints so this
    // specifically exercises invalid empty-search handling, independent of the date clock.
    const origin = page.getByRole('textbox', { name: 'Звідки' });
    const destination = page.getByRole('textbox', { name: 'Куди' });
    await origin.fill('');
    await destination.fill('');
    await page.getByRole('button', { name: 'Знайти маршрут', exact: true }).click();
    // The canonical production form uses native required-field validation;
    // the browser presents its localized validation bubble instead of an ARIA alert.
    expect(await origin.evaluate((input: HTMLInputElement) => input.validity.valid), 'empty origin must remain invalid').toBe(false);
    expect(journeySearchPosts, 'invalid or unresolved endpoints must not reach the journey-search API').toBe(0);

    await openSignedInRoute(page, '/trips');
    const upcoming = page.getByRole('tab', { name: /^Заплановані(?:\s·\s\d+)?$/ });
    await upcoming.click();
    await expect(upcoming).toHaveAttribute('aria-selected', 'true');

    await openSignedInRoute(page, '/demands/new');
    const publish = page.getByRole('button', { name: 'Опублікувати заявку', exact: true });
    const demandForm = page.locator('form').filter({ has: publish });
    expect(await demandForm.evaluate((form: HTMLFormElement) => form.checkValidity()), 'empty demand form must be invalid').toBe(false);
    await publish.click();
    await expect(demandForm.locator(':invalid').first()).toBeVisible();
    expect(demandPosts, 'invalid demand form must not create a server record').toBe(0);
  } finally {
    await context.close();
  }
});

test('home banner selectors switch the active banner accessibly', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await signIn(page, 'Home Banner Audit');
    await openSignedInRoute(page, '/');
    const carpoolBanner = page.getByRole('button', { name: 'Показати банер 1: MARSHGO · ПОПУТКИ' });
    const searchBanner = page.getByRole('button', { name: 'Показати банер 2: МІСТО ТА МІЖМІСТО' });
    await expect(carpoolBanner).toHaveAttribute('aria-pressed', 'true');
    await expect(searchBanner).toHaveAttribute('aria-pressed', 'false');

    await searchBanner.click();
    await expect(searchBanner).toHaveAttribute('aria-pressed', 'true');
    await expect(carpoolBanner).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByText('Усі способи доїхати в одному пошуку')).toBeVisible();

    await carpoolBanner.click();
    await expect(carpoolBanner).toHaveAttribute('aria-pressed', 'true');
    await expect(searchBanner).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByText('Попутники знайдуться на твоєму маршруті')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('trips route opens the canonical trip experience', async ({ page }) => {
  await signIn(page, 'Legacy Lifecycle Audit');
  await page.goto('/trips', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
  await expect(page.getByRole('tab', { name: /Заплановані/ })).toBeVisible();
});
