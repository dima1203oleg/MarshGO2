import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { devices, expect, test } from '@playwright/test';
import { Pool } from 'pg';
import { requestDevelopmentOtp } from './support/developmentOtp';

const databaseUrl = process.env.E2E_DATABASE_URL;
if (!databaseUrl) throw new Error('E2E_DATABASE_URL must point to the isolated local PostGIS test database');
const database = new URL(databaseUrl);
if (!['127.0.0.1', 'localhost', '::1'].includes(database.hostname)) {
  throw new Error('Browser E2E tests are restricted to a loopback database');
}

const pool = new Pool({ connectionString: databaseUrl });
const driverId = randomUUID();
const vehicleId = randomUUID();
const offerId = randomUUID();
const rescueAlternativeId = randomUUID();
const rescueCorridorAlternativeId = randomUUID();
const driverPhone = `+38050${String(Date.now()).slice(-7)}`;
const passengerPhone = `+38067${String(Date.now() + 1).slice(-7)}`;
const navigationPhone = `+38063${String(Date.now() + 2).slice(-7)}`;
const navigationSecondPhone = `+38066${String(Date.now() + 3).slice(-7)}`;
const navigationPassengerPhone = `+38068${String(Date.now() + 4).slice(-7)}`;
const navigationFlowDriverPhone = `+38069${String(Date.now() + 5).slice(-7)}`;
const journeyPassengerPhone = `+38070${String(Date.now() + 6).slice(-7)}`;
const searchRestorePhone = `+38071${String(Date.now() + 7).slice(-7)}`;
const transportCatalogPhone = `+38074${String(Date.now() + 10).slice(-7)}`;
const gpsDeniedPhone = `+38072${String(Date.now() + 8).slice(-7)}`;
const navigationThirdPassengerPhone = `+38073${String(Date.now() + 9).slice(-7)}`;
const partialSearchPhone = `+38075${String(Date.now() + 11).slice(-7)}`;
const navigationFlowVehicleId = randomUUID();
let navigationFlowDemandId = '';

function tomorrowInKyiv() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' }).format(new Date());
  const [year, month, day] = today.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

async function signIn(page: import('@playwright/test').Page, name: string, phone: string): Promise<string> {
  // Session restore has a bounded 8-second network timeout; allow it to settle
  // before asserting that the unauthenticated login form is available.
  page.setDefaultTimeout(15_000);
  await page.goto('/');
  const loginHeading = page.getByRole('heading', { name: 'Вхід за номером телефону' });
  const welcome = page.getByRole('button', { name: /У мене вже є акаунт/i });
  await expect(loginHeading.or(welcome).first()).toBeVisible({ timeout: 15_000 });
  if (await welcome.isVisible()) await welcome.click();
  await expect(loginHeading).toBeVisible({ timeout: 15_000 });
  await page.getByPlaceholder('Ваше ім’я').fill(name);
  await page.getByPlaceholder('+380 номер телефону').fill(phone);
  const code = await requestDevelopmentOtp(page);
  await page.locator('input[autocomplete="one-time-code"]').fill(code!);
  const [authResponse] = await Promise.all([
    page.waitForResponse(response => response.url().endsWith('/api/v1/auth/otp/verify')),
    page.getByRole('button', { name: 'Підтвердити номер' }).click(),
  ]);
  // The canonical release home copy changes independently of authentication.
  // Assert the signed-in application shell, not a marketing headline.
  await expect(page.locator('.production-app')).toBeVisible();
  expect(Boolean((await authResponse.allHeaders())['set-cookie']), 'OTP verification should issue a refresh cookie').toBe(true);
  return (await authResponse.json()).data.accessToken as string;
}

/** Search lives in its own tab; the home screen only shows what is around the user. */
async function openSearchTab(page: import('@playwright/test').Page) {
  await page.getByRole('navigation', { name: 'Основна навігація' }).getByRole('button', { name: 'Пошук', exact: true }).click();
  const originInput = page.getByPlaceholder(/Місто відправлення|Моє місцеперебування/);
  if (!(await originInput.isVisible())) {
    const showAllResults = page.getByRole('button', { name: /Всі варіанти маршруту|Всі маршрути та фільтри/ }).first();
    if (await showAllResults.isVisible()) await showAllResults.click();
    const backToSearch = page.getByRole('button', { name: 'Назад', exact: true });
    if (await backToSearch.isVisible()) await backToSearch.click();
  }
  await expect(originInput).toBeVisible();
}

async function openCreateMenu(page: import('@playwright/test').Page) {
  const navigation = page.getByRole('navigation', { name: 'Основна навігація' });
  await navigation.getByRole('button', { name: 'Створити поїздку або запит', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Опублікувати поїздку', exact: true })).toBeVisible();
}

async function openTripHistory(page: import('@playwright/test').Page) {
  await page.getByRole('navigation', { name: 'Основна навігація' }).getByRole('button', { name: 'Поїздки', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
  await page.getByRole('tab', { name: /Минулі/ }).click();
}

async function startNavigationFromHome(page: import('@playwright/test').Page) {
  const createSession = page.waitForResponse(response =>
    response.url().endsWith('/api/v1/navigation/sessions') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: /^Навігація Побудувати маршрут/ }).click();
  return createSession;
}

async function chooseRoutePlace(page: import('@playwright/test').Page, field: 'origin' | 'destination', city: string, suggestion: RegExp) {
  const input = page.getByPlaceholder(field === 'origin'
    ? /Місто відправлення|Моє місцеперебування/
    : /Місто призначення|Введіть адресу, місто або зупинку/);
  await input.fill(city);
  const placeSuggestion = page.getByRole('button', { name: suggestion });
  // Older screens need an explicit request; current search updates suggestions while typing.
  const explicitSearchButtons = page.getByRole('button', { name: 'Знайти', exact: true });
  const fieldIndex = field === 'origin' ? 0 : 1;
  if (await explicitSearchButtons.count() > fieldIndex) {
    await explicitSearchButtons.nth(fieldIndex).click();
  }
  await expect(placeSuggestion).toBeVisible();
  await placeSuggestion.click();
}

async function setTomorrowAtEightOnTimeWheel(page: import('@playwright/test').Page) {
  const legacyDateButton = page.getByRole('button', { name: /^Дата/ });
  if (await legacyDateButton.count()) {
    await legacyDateButton.click();
    await page.getByRole('button', { name: 'Завтра', exact: true }).click();
    await page.getByRole('button', { name: 'Застосувати', exact: true }).click();
  } else {
    // Production SearchExperienceV6 uses the date pill instead of the legacy
    // "Дата" button. Always align the search with the next-day offers seeded
    // by this E2E suite; clicking only the time made this test depend on the
    // wall-clock hour and silently searched today's schedule.
    const dateButton = page.getByRole('button', { name: /^Вибрати дату відправлення:/ });
    if (await dateButton.count()) {
      await dateButton.click();
      await page.getByRole('button', { name: 'Завтра', exact: true }).click();
      await page.getByRole('button', { name: 'Застосувати', exact: true }).click();
    }
  }
  const legacyTimeButton = page.getByRole('button', { name: /^Час/ });
  if (await legacyTimeButton.count()) await legacyTimeButton.click();
  else await page.getByRole('button', { name: /Вибрати час відправлення/ }).click();
  const hours = page.locator('[role="listbox"][aria-label="Години"]');
  const minutes = page.locator('[role="listbox"][aria-label="Хвилини"]');
  await hours.locator('[role="option"]').filter({ hasText: /^08$/ }).click();
  await minutes.locator('[role="option"]').filter({ hasText: /^00$/ }).click();
  await page.getByRole('button', { name: 'Застосувати', exact: true }).click();
}

async function setPassengerCount(page: import('@playwright/test').Page, count: number) {
  const countButton = page.getByRole('button', { name: /^Вибрати кількість пасажирів:/ });
  if (await countButton.count()) {
    await countButton.click();
    const dialog = page.getByRole('dialog', { name: 'Пасажири' });
    const option = dialog.getByRole('listbox', { name: 'Пасажири' }).getByRole('option').filter({ hasText: new RegExp(`^${count}\\s`) });
    await option.click();
    await dialog.getByRole('button', { name: 'Застосувати', exact: true }).click();
    const passengerLabel = count === 1 ? '1 особа' : count <= 4 ? `${count} особи` : `${count} осіб`;
    await expect(countButton).toContainText(passengerLabel);
    return;
  }
  const details = page.locator('.search-trip-details');
  const plus = details.getByRole('button', { name: 'Більше пасажирів', exact: true });
  const minus = details.getByRole('button', { name: 'Менше пасажирів', exact: true });
  const current = async () => Number((await details.innerText()).match(/(\d+)\s*пас\./)?.[1] ?? NaN);
  while (await current() < count) await plus.click();
  while (await current() > count) await minus.click();
  await expect(details).toContainText(`${count} пас.`);
}

test('date and time picker applies and restores the selected Kyiv departure time', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const page = await context.newPage();
  try {
    await signIn(page, 'Time Drum Passenger', `+38075${String(Date.now()).slice(-7)}`);
    await openSearchTab(page);
    const openPicker = page.getByRole('button', { name: /Вибрати час відправлення/ });
    await openPicker.click();
    const dialog = page.getByRole('dialog', { name: 'Час маршруту' });
    await expect(dialog).toBeVisible();
    const hourWheel = dialog.locator('[role="listbox"][aria-label="Години"]');
    const minuteWheel = dialog.locator('[role="listbox"][aria-label="Хвилини"]');
    const selectedHour = hourWheel.locator('[role="option"][aria-selected="true"]');
    const currentHour = Number(await selectedHour.innerText());
    const nextHour = String((currentHour + 1) % 24).padStart(2, '0');
    await hourWheel.locator('[role="option"]').filter({ hasText: new RegExp(`^${nextHour}$`) }).click();
    await expect(selectedHour).toHaveText(nextHour);
    await minuteWheel.locator('[role="option"]').filter({ hasText: /^15$/ }).click();
    await expect(minuteWheel.locator('[role="option"][aria-selected="true"]')).toHaveText('15');
    await dialog.getByRole('button', { name: 'Застосувати', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(openPicker).toContainText(`${nextHour}:15`);
    await openPicker.click();
    await expect(dialog).toBeVisible();
    await expect(hourWheel.locator('[role="option"][aria-selected="true"]')).toHaveText(nextHour);
    await expect(minuteWheel.locator('[role="option"][aria-selected="true"]')).toHaveText('15');
  } finally {
    await context.close();
  }
});

test('swapping route endpoints keeps the selected place coordinates with each endpoint', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const page = await context.newPage();
  const places = {
    origin: { label: 'Малоголосківська, Львів', latitude: 49.8682, longitude: 24.003, providerId: 'e2e-origin' },
    destination: { label: 'Сихів, Львів', latitude: 49.7941, longitude: 24.0576, providerId: 'e2e-destination' },
  };
  try {
    await signIn(page, 'Route Swap Passenger', `+38077${String(Date.now()).slice(-7)}`);
    await openSearchTab(page);
    await page.route('**/api/v1/places/suggest?**', route => {
      const query = new URL(route.request().url()).searchParams.get('q')?.toLocaleLowerCase('uk-UA') ?? '';
      const place = query.includes('сихів') ? places.destination : places.origin;
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [place] }) });
    });
    await chooseRoutePlace(page, 'origin', 'Малоголосківська', /Малоголосківська, Львів/);
    await chooseRoutePlace(page, 'destination', 'Сихів', /Сихів, Львів/);
    const originInput = page.getByPlaceholder(/Місто відправлення|Моє місцеперебування/);
    const destinationInput = page.getByPlaceholder(/Місто призначення|Введіть адресу, місто або зупинку/);
    await expect(originInput).toHaveValue(places.origin.label);
    await expect(destinationInput).toHaveValue(places.destination.label);

    await page.getByRole('button', { name: /Поміняти місцями/ }).click();
    await expect(originInput).toHaveValue(places.destination.label);
    await expect(destinationInput).toHaveValue(places.origin.label);
    await setTomorrowAtEightOnTimeWheel(page);

    const responsePromise = page.waitForResponse(response =>
      response.url().endsWith('/api/v1/journeys/search') && response.request().method() === 'POST', { timeout: 60_000 });
    await page.getByRole('button', { name: /^Знайти маршрут/ }).click();
    const response = await responsePromise;
    expect(response.status(), await response.text()).toBe(200);
    const request = response.request().postDataJSON() as {
      origin: { name: string; coordinates: [number, number] };
      destination: { name: string; coordinates: [number, number] };
    };
    expect(request.origin).toEqual({
      name: places.destination.label,
      coordinates: [places.destination.longitude, places.destination.latitude],
    });
    expect(request.destination).toEqual({
      name: places.origin.label,
      coordinates: [places.origin.longitude, places.origin.latitude],
    });
  } finally {
    await context.close().catch(() => undefined);
  }
});

test('route map focuses one selected itinerary leg and restores the overview', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const page = await context.newPage();
  const departure = new Date(Date.now() + 24 * 60 * 60_000);
  const arrival = (minutes: number) => new Date(departure.getTime() + minutes * 60_000).toISOString();
  try {
    await signIn(page, 'Route Leg Focus Passenger', `+38076${String(Date.now()).slice(-7)}`);
    await openSearchTab(page);
    await page.route('**/api/v1/places/suggest?**', route => {
      const query = new URL(route.request().url()).searchParams.get('q')?.toLocaleLowerCase('uk-UA') ?? '';
      const place = query.includes('стрий')
        ? { label: 'вул. Стрийська, 32', latitude: 49.7941, longitude: 24.0576, providerId: 'e2e-destination' }
        : { label: 'вул. Мало-Голосківська, 24', latitude: 49.8682, longitude: 24.003, providerId: 'e2e-origin' };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [place] }) });
    });
    await chooseRoutePlace(page, 'origin', 'Мало-Голосківська', /Мало-Голосківська/);
    await chooseRoutePlace(page, 'destination', 'Стрийська', /Стрийська/);
    await page.route('**/api/v1/journeys/search', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: {
        journeys: [{
          id: 'e2e-leg-focus-route', offerId: null, source: 'gtfs-static', strategy: 'BALANCED',
          recommendedStrategies: ['BALANCED', 'FASTEST', 'CHEAPEST'],
          strategyRanks: { BALANCED: 1, FASTEST: 1, CHEAPEST: 1 }, state: 'PLANNED',
          totalDurationSeconds: 2400, totalPriceMinor: 8000, confirmedPriceMinor: null,
          estimatedPriceMinMinor: null, estimatedPriceMaxMinor: null, walkingMeters: 360,
          transfers: 0, reliabilityScore: null,
          legs: [
            { id: 'e2e-walk-first', mode: 'WALK', offerId: null,
              origin: { name: 'Старт', coordinates: [24.003, 49.868] },
              destination: { name: 'Зупинка А', coordinates: [24.008, 49.86] },
              departureAt: departure.toISOString(), arrivalAt: arrival(5), durationSeconds: 300,
              distanceMeters: 360, priceMinor: 0, priceStatus: 'LOCKED', availabilityStatus: 'AVAILABLE',
              source: 'e2e-fixture', lastUpdatedAt: departure.toISOString(),
              coordinates: [[24.003, 49.868], [24.008, 49.86]], routeGeometry: [[24.003, 49.868], [24.008, 49.86]], driver: null, vehicle: null },
            { id: 'e2e-bus-focus', mode: 'BUS', transportType: 'bus', routeName: 'A20', offerId: null,
              origin: { name: 'Зупинка А', coordinates: [24.008, 49.86] },
              destination: { name: 'Зупинка Б', coordinates: [24.04, 49.82] },
              departureAt: arrival(5), arrivalAt: arrival(35), durationSeconds: 1800,
              distanceMeters: 4800, priceMinor: 8000, priceStatus: 'LOCKED', availabilityStatus: 'SCHEDULED',
              source: 'e2e-fixture', lastUpdatedAt: departure.toISOString(),
              coordinates: [[24.008, 49.86], [24.022, 49.84], [24.04, 49.82]], routeGeometry: [[24.008, 49.86], [24.022, 49.84], [24.04, 49.82]], driver: null, vehicle: null },
            { id: 'e2e-walk-last', mode: 'WALK', offerId: null,
              origin: { name: 'Зупинка Б', coordinates: [24.04, 49.82] },
              destination: { name: 'Фініш', coordinates: [24.045, 49.815] },
              departureAt: arrival(35), arrivalAt: arrival(40), durationSeconds: 300,
              distanceMeters: 360, priceMinor: 0, priceStatus: 'LOCKED', availabilityStatus: 'AVAILABLE',
              source: 'e2e-fixture', lastUpdatedAt: departure.toISOString(),
              coordinates: [[24.04, 49.82], [24.045, 49.815]], routeGeometry: [[24.04, 49.82], [24.045, 49.815]], driver: null, vehicle: null },
          ],
        }],
        partial: false, blockedProviders: [], unsupportedPreferences: [], providerErrors: [],
      } }),
    }));
    await page.getByRole('button', { name: 'Знайти маршрут', exact: true }).click();
    const card = page.getByTestId('journey-result-card').first();
    await expect(card).toBeVisible();
    await card.click();
    const routeMap = page.getByRole('main', { name: 'Побудований маршрут' });
    await expect(routeMap).toBeVisible();
    const expandDetails = routeMap.getByRole('button', { name: 'Розгорнути деталі маршруту', exact: true });
    if (await expandDetails.count()) await expandDetails.click();
    const walkingFirst = routeMap.locator('[data-segment-id="e2e-walk-first"]');
    const bus = routeMap.locator('[data-segment-id="e2e-bus-focus"]');
    const walkingLast = routeMap.locator('[data-segment-id="e2e-walk-last"]');
    const mapContainer = routeMap.getByRole('img', { name: 'Карта маршруту MARSHGO' });
    const mapMetrics = routeMap.locator('[data-marshgo-map-renderer="maplibre"]');
    await expect(mapContainer).toBeVisible();
    await expect(mapMetrics).toHaveAttribute('data-marshgo-route-segment-count', '3');
    await expect(bus).toBeVisible();

    // The compact segment strip and the expanded detail list share the same
    // selection action; the strip's accessible label intentionally omits the
    // provider route number.
    const busSelector = routeMap.getByRole('button', { name: /^Вибрати сегмент: Автобус/ }).first();
    await busSelector.click();
    await expect(busSelector).toHaveAttribute('aria-pressed', 'true');
    // Segment focus draws only the selected leg on the map; other legs remain
    // in the itinerary details and return to the map on overview.
    await expect(mapMetrics).toHaveAttribute('data-marshgo-route-segment-count', '1');
    await expect(mapMetrics).toHaveAttribute('data-marshgo-active-route-segment-id', 'e2e-bus-focus');
    await expect(mapMetrics).toHaveAttribute('data-marshgo-selected-route-segment-count', '1');
    await expect(mapMetrics).toHaveAttribute('data-marshgo-dimmed-route-segment-count', '0');
    await expect(walkingFirst).toBeVisible();
    await expect(walkingLast).toBeVisible();

    await routeMap.getByRole('button', { name: 'Показати маршрут цілком' }).click();
    await expect(busSelector).toHaveAttribute('aria-pressed', 'false');
    await expect(mapMetrics).toHaveAttribute('data-marshgo-route-segment-count', '3');
    await expect(mapMetrics).not.toHaveAttribute('data-marshgo-active-route-segment-id');
    await expect(mapMetrics).toHaveAttribute('data-marshgo-selected-route-segment-count', '3');
    await expect(mapMetrics).toHaveAttribute('data-marshgo-dimmed-route-segment-count', '0');
    await expect(walkingFirst).toBeVisible();
    await expect(walkingLast).toBeVisible();
  } finally {
    await context.close();
  }
});

test('search map picker confirms coordinates without reverse geocoding and uses browser GPS fallback', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({
    baseURL,
    timezoneId: 'Europe/Kyiv',
    geolocation: { latitude: 49.8419, longitude: 24.0315, accuracy: 35 },
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  let reverseLookups = 0;
  try {
    await signIn(page, 'Geolocation E2E', `+38077${String(Date.now()).slice(-7)}`);
    await openSearchTab(page);
    await page.route('**/api/v1/places/reverse?*', async route => {
      reverseLookups += 1;
      await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'test geocoder unavailable' }) });
    });

    await page.getByRole('button', { name: 'Обрати на мапі', exact: true }).first().click();
    const picker = page.getByRole('dialog', { name: 'Звідки' });
    await expect(picker).toBeVisible();
    const map = picker.getByTestId('point-picker-map');
    await expect(map.locator('.maplibregl-canvas')).toBeVisible();
    await map.locator('.maplibregl-canvas').click({ position: { x: 150, y: 160 } });
    const confirm = picker.getByRole('button', { name: 'Підтвердити точку' });
    await expect(confirm).toBeEnabled();
    await expect(picker.getByRole('status')).toContainText('Точка на мапі');
    await confirm.click();
    await expect(picker).toHaveCount(0);
    await expect(page.getByPlaceholder(/Місто відправлення|Моє місцеперебування/)).toHaveValue(/Точка на мапі/);

    await page.getByRole('button', { name: 'Моя локація', exact: true }).click();
    await expect(page.getByPlaceholder(/Місто відправлення|Моє місцеперебування/)).toHaveValue('Моє місцеперебування');
    expect(reverseLookups).toBeGreaterThan(0);
  } finally {
    await context.close();
  }
});

test('route place autocomplete selects a city and clear buttons reset each selected endpoint', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const page = await context.newPage();
  try {
    await signIn(page, 'Place Autocomplete E2E', `+38078${String(Date.now()).slice(-7)}`);
    await openSearchTab(page);
    const originInput = page.getByPlaceholder(/Місто відправлення/);
    const destinationInput = page.getByPlaceholder(/Місто призначення/);

    await originInput.fill('Сихів');
    const originSuggestion = page.getByRole('button', { name: 'Сихів, Сихівський район, Львів, Львівська область, Україна' });
    await expect(originSuggestion).toBeVisible();
    await originSuggestion.click();
    await expect(originInput).toHaveValue('Сихів, Сихівський район, Львів, Львівська область, Україна');
    await page.getByRole('button', { name: 'Очистити початкову точку' }).click();
    await expect(originInput).toHaveValue('');

    await destinationInput.fill('Львів');
    const destinationSuggestion = page.getByRole('button', { name: 'Львів, Львівська область, Україна' });
    await expect(destinationSuggestion).toBeVisible();
    await destinationSuggestion.click();
    await expect(destinationInput).toHaveValue('Львів, Львівська область, Україна');
    await page.getByRole('button', { name: 'Очистити кінцеву точку' }).click();
    await expect(destinationInput).toHaveValue('');
  } finally {
    await context.close();
  }
});

test('route transport catalogue exposes the twelve canonical modes in order and disables unroutable modes', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const page = await context.newPage();
  try {
    await signIn(page, 'Transport Catalogue Passenger', transportCatalogPhone);
    await openSearchTab(page);
    const picker = page.getByRole('region', { name: 'Види транспорту' });
    await expect(picker.locator('.transport-mode-grid > button[aria-label]')).toHaveCount(12);
    await chooseRoutePlace(page, 'origin', 'Стрий', /Стрий, Львівська область, Україна/);
    const allModes = [
      'Попутка', 'Маршрутка', 'Автобус', 'Таксі', 'Трамвай', 'Тролейбус',
      'Метро', 'Поїзд', 'Велосипед', 'Самокат', 'Каршеринг', 'Трансфер',
    ];
    const tiles = picker.locator('.transport-mode-grid > button[aria-label]');
    await expect(tiles).toHaveCount(12);
    const visibleLabels = await tiles.evaluateAll((elements) => elements.map((element) =>
      (element.getAttribute('aria-label') ?? '').replace(/[.—].*/, '').trim(),
    ));
    expect(visibleLabels).toEqual(allModes);
    for (const unsupported of ['Таксі', 'Велосипед', 'Самокат', 'Каршеринг', 'Трансфер']) {
      await expect(picker.locator(`button[aria-label^="${unsupported}"]`)).toBeDisabled();
    }
  } finally {
    await context.close();
  }
});

test('welcome entry guides users to phone sign-in without forcing location permission', async ({ page }) => {
  await page.goto('/');
  const start = page.getByRole('button', { name: 'Почати', exact: true });
  if (await start.isVisible()) await start.click();
  const skipOnboarding = page.getByRole('button', { name: 'Пропустити', exact: true });
  const accountLogin = page.getByRole('button', { name: 'У мене вже є акаунт', exact: true });
  const loginHeading = page.getByRole('heading', { name: 'Вхід за номером телефону' });
  await expect.poll(async () => (await loginHeading.isVisible()) || (await skipOnboarding.isVisible()) || (await accountLogin.isVisible())).toBe(true);
  if (await skipOnboarding.isVisible()) await skipOnboarding.click();
  else if (await accountLogin.isVisible()) await accountLogin.click();
  await expect(loginHeading).toBeVisible();
  await expect(page.getByPlaceholder('Ваше ім’я')).toBeVisible();
  await expect(page.getByPlaceholder('+380 номер телефону')).toBeVisible();
  await expect(page.getByText(/Реальна доставка SMS вмикається після налаштування провайдера/)).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test.beforeAll(async () => {
  // Retire only this suite's named rescue fixtures left by an interrupted E2E
  // worker. Remove their dependants in FK order inside the isolated E2E DB.
  const staleBookingIds = `SELECT b.id FROM bookings b JOIN offers o ON o.id=b.offer_id
    WHERE o.route_source='e2e_fixture'
      AND o.origin_name IN ('Rescue E2E Origin','Rescue E2E Corridor Origin')`;
  const staleOfferIds = `SELECT id FROM offers WHERE route_source='e2e_fixture'
    AND origin_name IN ('Rescue E2E Origin','Rescue E2E Corridor Origin')`;
  await pool.query(`DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE booking_id IN (${staleBookingIds}))`);
  await pool.query(`DELETE FROM conversation_members WHERE conversation_id IN (SELECT id FROM conversations WHERE booking_id IN (${staleBookingIds}))`);
  await pool.query(`DELETE FROM conversations WHERE booking_id IN (${staleBookingIds})`);
  await pool.query(`DELETE FROM booking_events WHERE booking_id IN (${staleBookingIds})`);
  await pool.query(`DELETE FROM reviews WHERE booking_id IN (${staleBookingIds})`);
  await pool.query(`DELETE FROM booking_change_approvals WHERE booking_id IN (${staleBookingIds})`);
  await pool.query(`DELETE FROM bookings WHERE id IN (${staleBookingIds})`);
  await pool.query(`DELETE FROM offer_changes WHERE offer_id IN (${staleOfferIds})`);
  await pool.query(`DELETE FROM offers WHERE id IN (${staleOfferIds})`);
  await pool.query(`
    INSERT INTO users(id,phone_e164,display_name,roles,is_verified)
    VALUES($1,$2,'MARSHGO E2E Driver',ARRAY['passenger','driver'],true)
  `, [driverId, driverPhone]);
  await pool.query(`INSERT INTO user_roles(user_id,role) VALUES($1,'passenger'),($1,'driver')`, [driverId]);
  await pool.query(`
    INSERT INTO vehicles(id,owner_id,make,model,model_year,seat_count,verification_status,trust_level,is_active)
    VALUES($1,$2,'E2E','Road Car',2024,4,'verified',3,true)
  `, [vehicleId, driverId]);
  await pool.query(`
    INSERT INTO offers(id,driver_id,vehicle_id,origin_name,destination_name,origin,destination,route,
      departure_at,arrival_at,distance_m,duration_s,route_source,price_per_seat_minor,total_seats,available_seats)
    VALUES($1,$2,$3,'Стрий, Львівська область, Україна','Львів, Львівська область, Україна',
      ST_SetSRID(ST_MakePoint(23.8561,49.2567),4326)::geography,
      ST_SetSRID(ST_MakePoint(24.0297,49.8397),4326)::geography,
      ST_SetSRID(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[23.8561,49.2567],[24.0297,49.8397]]}'),4326),
      (date_trunc('day',now() AT TIME ZONE 'Europe/Kyiv') + interval '1 day' + interval '9 hours') AT TIME ZONE 'Europe/Kyiv',
      (date_trunc('day',now() AT TIME ZONE 'Europe/Kyiv') + interval '1 day' + interval '10 hours 30 minutes') AT TIME ZONE 'Europe/Kyiv',
      78000,5400,'e2e_fixture',15000,4,4)
  `, [offerId, driverId, vehicleId]);
  await pool.query(`
    INSERT INTO offers(id,driver_id,vehicle_id,origin_name,destination_name,origin,destination,route,
      departure_at,arrival_at,distance_m,duration_s,route_source,price_per_seat_minor,total_seats,available_seats)
    VALUES($1,$2,$3,'Rescue E2E Origin','Rescue E2E Destination',
      ST_SetSRID(ST_MakePoint(23.8561,49.2567),4326)::geography,
      ST_SetSRID(ST_MakePoint(24.0297,49.8397),4326)::geography,
      ST_SetSRID(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[23.8561,49.2567],[24.0297,49.8397]]}'),4326),
      (date_trunc('day',now() AT TIME ZONE 'Europe/Kyiv') + interval '1 day' + interval '10 hours') AT TIME ZONE 'Europe/Kyiv',
      (date_trunc('day',now() AT TIME ZONE 'Europe/Kyiv') + interval '1 day' + interval '11 hours 30 minutes') AT TIME ZONE 'Europe/Kyiv',
      78000,5400,'e2e_fixture',22000,4,4)
  `, [rescueAlternativeId, driverId, vehicleId]);
  await pool.query(`
    INSERT INTO offers(id,driver_id,vehicle_id,origin_name,destination_name,origin,destination,route,
      departure_at,arrival_at,distance_m,duration_s,route_source,price_per_seat_minor,total_seats,available_seats)
    VALUES($1,$2,$3,'Rescue E2E Corridor Origin','Rescue E2E Corridor Destination',
      ST_SetSRID(ST_MakePoint(23.9429,49.5482),4326)::geography,
      ST_SetSRID(ST_MakePoint(24.0297,49.8397),4326)::geography,
      ST_SetSRID(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[23.9429,49.5482],[24.0297,49.8397]]}'),4326),
      (date_trunc('day',now() AT TIME ZONE 'Europe/Kyiv') + interval '1 day' + interval '10 hours 10 minutes') AT TIME ZONE 'Europe/Kyiv',
      (date_trunc('day',now() AT TIME ZONE 'Europe/Kyiv') + interval '1 day' + interval '11 hours 30 minutes') AT TIME ZONE 'Europe/Kyiv',
      42000,4800,'e2e_fixture',24000,4,4)
  `, [rescueCorridorAlternativeId, driverId, vehicleId]);
});

test.afterAll(async () => {
  const testUsers = await pool.query<{ id: string }>('SELECT id FROM users WHERE phone_e164=ANY($1::text[])', [[passengerPhone, navigationPhone, navigationSecondPhone, navigationPassengerPhone, navigationFlowDriverPhone, journeyPassengerPhone, searchRestorePhone, transportCatalogPhone, gpsDeniedPhone, navigationThirdPassengerPhone, partialSearchPhone]]);
  const userIds = [driverId, ...testUsers.rows.map((row) => row.id)];
  const testBookingQuery = `SELECT b.id FROM bookings b JOIN offers o ON o.id=b.offer_id WHERE b.passenger_id=ANY($1::uuid[]) OR o.driver_id=ANY($1::uuid[])`;
  await pool.query('DELETE FROM audit_events WHERE actor_id=ANY($1::uuid[]) OR entity_id=ANY($2::uuid[])', [userIds, [offerId, vehicleId]]);
  await pool.query(`DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE booking_id IN (${testBookingQuery}))`, [userIds]);
  await pool.query(`DELETE FROM conversation_members WHERE conversation_id IN (SELECT id FROM conversations WHERE booking_id IN (${testBookingQuery}))`, [userIds]);
  await pool.query(`DELETE FROM conversations WHERE booking_id IN (${testBookingQuery})`, [userIds]);
  await pool.query(`DELETE FROM booking_events WHERE booking_id IN (${testBookingQuery})`, [userIds]);
  await pool.query(`DELETE FROM reviews WHERE booking_id IN (${testBookingQuery})`, [userIds]);
  await pool.query(`DELETE FROM bookings WHERE id IN (${testBookingQuery})`, [userIds]);
  await pool.query('DELETE FROM proposals WHERE driver_id=ANY($1::uuid[]) OR demand_id IN (SELECT id FROM passenger_demands WHERE passenger_id=ANY($2::uuid[]))', [userIds, userIds]);
  await pool.query('DELETE FROM navigation_sessions WHERE driver_id=ANY($1::uuid[])', [userIds]);
  await pool.query('DELETE FROM passenger_demands WHERE passenger_id=ANY($1::uuid[])', [userIds]);
  await pool.query('DELETE FROM offers WHERE id=$1 OR driver_id=ANY($2::uuid[])', [offerId, userIds]);
  await pool.query('DELETE FROM otp_challenges WHERE phone_e164=ANY($1::text[])', [[driverPhone, passengerPhone, navigationPhone, navigationSecondPhone, navigationPassengerPhone, navigationFlowDriverPhone, journeyPassengerPhone, searchRestorePhone, transportCatalogPhone, gpsDeniedPhone, navigationThirdPassengerPhone]]);
  await pool.query('DELETE FROM sessions WHERE user_id=ANY($1::uuid[])', [userIds]);
  await pool.query('DELETE FROM account_deletion_requests WHERE user_id=ANY($1::uuid[])', [userIds]);
  await pool.query('DELETE FROM vehicles WHERE id=$1 OR owner_id=ANY($2::uuid[])', [vehicleId, userIds]);
  await pool.query('DELETE FROM users WHERE id=ANY($1::uuid[])', [userIds]);
  await pool.end();
});

test('two independent accounts search, book, negotiate a demand, and exchange persisted chat messages', async ({ browser, baseURL }) => {
  test.setTimeout(600_000);
  expect(baseURL).toBeTruthy();
  const passengerContext = await browser.newContext();
  const driverContext = await browser.newContext();
  const passengerPage = await passengerContext.newPage();
  const driverPage = await driverContext.newPage();
  passengerPage.setDefaultTimeout(20_000);
  driverPage.setDefaultTimeout(20_000);

  try {
    let passengerAccessToken = await signIn(passengerPage, 'E2E Passenger', passengerPhone);
    let refreshTokenResponses = Promise.resolve();
    passengerPage.on('response', (response) => {
      if (response.url().endsWith('/api/v1/auth/refresh') && response.ok()) {
        refreshTokenResponses = refreshTokenResponses.then(async () => {
          const body = await response.json() as { data: { accessToken: string } };
          passengerAccessToken = body.data.accessToken;
        });
      }
    });
    const profileBeforeRoleSwitch = await passengerPage.evaluate(async token => fetch('/api/v1/users/me', { headers: { Authorization: `Bearer ${token}` } }).then(async response => ({ status: response.status, body: await response.json() })), passengerAccessToken);
    expect(profileBeforeRoleSwitch.status).toBe(200);
    const userIdBeforeRoleSwitch = profileBeforeRoleSwitch.body.data.id;
    const enabledDriverRole = await passengerPage.evaluate(async token => fetch('/api/v1/users/me/roles', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ role: 'driver' }) }).then(response => response.status), passengerAccessToken);
    expect(enabledDriverRole).toBe(200);
    const profileAfterRoleSwitch = await passengerPage.evaluate(async token => fetch('/api/v1/users/me', { headers: { Authorization: `Bearer ${token}` } }).then(response => response.json()), passengerAccessToken);
    const switchedProfile = profileAfterRoleSwitch.data;
    expect(switchedProfile.id).toBe(userIdBeforeRoleSwitch);
    expect(switchedProfile.roles).toEqual(expect.arrayContaining(['passenger', 'driver']));
    const crossAccountVehicleEdit = await passengerPage.evaluate(async ({ token, targetVehicleId }) => fetch(`/api/v1/vehicles/${targetVehicleId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ make: 'Unauthorized edit' }) }).then(response => response.status), { token: passengerAccessToken, targetVehicleId: vehicleId });
    expect(crossAccountVehicleEdit).toBe(404);

    await test.info().attach('marshgo-iphone-home', {
      body: await passengerPage.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
    if (process.env.E2E_SCREENSHOT_PATH) {
      await passengerPage.screenshot({ path: process.env.E2E_SCREENSHOT_PATH, fullPage: true });
    }
    await openSearchTab(passengerPage);
    await chooseRoutePlace(passengerPage, 'origin', 'Стрий', /Стрий, Львівська область, Україна/);
    await chooseRoutePlace(passengerPage, 'destination', 'Львів', /Львів, Львівська область, Україна/);
    await setTomorrowAtEightOnTimeWheel(passengerPage);
    await setPassengerCount(passengerPage, 2);
    const journeySearch = passengerPage.waitForResponse(response => response.url().endsWith('/api/v1/journeys/search') && response.request().method() === 'POST', { timeout: 60_000 });
    await passengerPage.getByRole('button', { name: /^Знайти маршрут/ }).click();
    const journeySearchResponse = await journeySearch;
    expect(journeySearchResponse.status(), await journeySearchResponse.text()).toBe(200);
    const journeySearchPayload = (await journeySearchResponse.json()).data as { journeys: Array<{ id: string; offerId: string }> };
    const communityJourney = journeySearchPayload.journeys.find(journey => journey.offerId === offerId);
    expect(communityJourney).toBeDefined();
    if (!communityJourney) throw new Error('The persisted Community offer was missing from the journey results.');

    const resultCard = passengerPage.locator(`[data-journey-id="${communityJourney.id}"]`);
    await expect(resultCard).toContainText(/300\s*(?:грн|₴)/);
    await resultCard.click();
    await expect(passengerPage.getByTestId('route-bottom-sheet')).toBeVisible();
    await expect(passengerPage.getByRole('main', { name: 'Побудований маршрут' })).toBeVisible();
    // The pinned release opens the provider's offer details from the selected route leg.
    await passengerPage.getByRole('button', { name: /^Забронювати(?:\s|$)/ }).first().click();
    await expect(passengerPage.getByText('Деталі поїздки', { exact: true })).toBeVisible();
    await expect(passengerPage.getByRole('heading', { name: /Стрий.*Львів/ })).toBeVisible();
    const bookingResponsePromise = passengerPage.waitForResponse(response => response.url().endsWith('/api/v1/bookings') && response.request().method() === 'POST');
    await passengerPage.getByRole('button', { name: /Забронювати місце/ }).click();
    const createdBookingResponse = await bookingResponsePromise;
    expect(createdBookingResponse.status()).toBe(201);
    const createdBooking = (await createdBookingResponse.json()).data as { id: string; offer_id: string; seat_count: number; total_price_minor: number; status: string; fee_class: string; platform_fee_minor: number; fee_rule_version: string };
    expect(createdBooking).toMatchObject({ offer_id: offerId, seat_count: 2, total_price_minor: 30000, status: 'confirmed', fee_class: 'community', platform_fee_minor: 0, fee_rule_version: 'community-0pct-v1' });
    await expect(passengerPage.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
    await expect(passengerPage.getByText(/2 місця/).first()).toBeVisible();

    const booking = await pool.query<{ seat_count: number; total_price_minor: number; status: string }>(
      'SELECT b.seat_count,b.total_price_minor,b.status FROM bookings b WHERE b.id=$1 AND b.passenger_id=(SELECT id FROM users WHERE phone_e164=$2)',
      [createdBooking.id, passengerPhone],
    );
    expect(booking.rows).toHaveLength(1);
    expect(booking.rows[0]).toMatchObject({ seat_count: 2, total_price_minor: 30000, status: 'confirmed' });
    const inventory = await pool.query<{ available_seats: number }>('SELECT available_seats FROM offers WHERE id=$1', [offerId]);
    expect(inventory.rows[0].available_seats).toBe(2);

    // A booking deep link must resolve to the server-owned entity after a cold load and reload.
    await passengerPage.goto(`/bookings/${createdBooking.id}`);
    await expect(passengerPage).toHaveURL(new RegExp(`/bookings/${createdBooking.id}$`));
    const savedBooking = passengerPage.locator('article').filter({ hasText: /300\s*(?:грн|₴)/ }).filter({ hasText: '2 місця' });
    await expect(savedBooking).toHaveCount(1);
    await expect(savedBooking).toContainText(/Стрий.*Львів/);
    await passengerPage.reload({ waitUntil: 'domcontentloaded', timeout: 15_000 });
    await expect(passengerPage).toHaveURL(new RegExp(`/bookings/${createdBooking.id}$`));
    const reloadedBooking = passengerPage.locator('article').filter({ hasText: /300\s*(?:грн|₴)/ }).filter({ hasText: '2 місця' });
    await expect(reloadedBooking).toHaveCount(1);
    await expect(reloadedBooking).toContainText(/Стрий.*Львів/);
    await expect(passengerPage.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();

    await passengerPage.getByRole('button', { name: /Чат|Написати/ }).click();
    await expect(passengerPage).toHaveURL(/\/messages\/[A-Za-z0-9_-]+$/);
    const conversationDeepLink = passengerPage.url();
    await passengerPage.getByPlaceholder('Напишіть повідомлення…').fill('Буду на місці о 08:45.');
    await passengerPage.getByPlaceholder('Напишіть повідомлення…').press('Enter');
    await expect(passengerPage.getByText('Буду на місці о 08:45.')).toBeVisible();
    await pool.query(
      `INSERT INTO messages(conversation_id,sender_id,body,created_at)
       SELECT c.id,b.passenger_id,'Стара історія E2E ' || seq::text,now()-((1000-seq)*interval '1 second')
         FROM conversations c JOIN bookings b ON b.id=c.booking_id
         CROSS JOIN generate_series(1,55) AS seq WHERE b.id=$1`, [createdBooking.id],
    );
    expect((await passengerContext.cookies()).some((cookie) => cookie.name === 'mg_refresh')).toBe(true);
    expect((await passengerContext.cookies('http://127.0.0.1:3300/api/v1/auth/refresh')).some((cookie) => cookie.name === 'mg_refresh')).toBe(true);
    const refreshResponse = passengerPage.waitForResponse((response) => response.url().endsWith('/api/v1/auth/refresh'), { timeout: 15_000 });
    await passengerPage.reload();
    const restoredSession = await refreshResponse;
    expect(restoredSession.status(), 'refresh should restore the session after a page reload').toBe(200);
    await refreshTokenResponses;
    // Entity deep links restore the specific server-owned conversation after reload.
    await expect(passengerPage).toHaveURL(/\/messages\/[A-Za-z0-9_-]+$/);
    await expect(passengerPage.getByRole('heading', { name: 'MARSHGO E2E Driver' })).toBeVisible();
    const olderMessagesButton = passengerPage.getByRole('button', { name: 'Завантажити попередні повідомлення' });
    await expect(olderMessagesButton).toBeVisible();
    await expect(passengerPage.getByText('Стара історія E2E 55', { exact: true })).toBeVisible();
    await olderMessagesButton.click();
    await expect(passengerPage.getByText('Стара історія E2E 1', { exact: true })).toBeVisible();
    await expect(passengerPage.getByText('Стара історія E2E 55', { exact: true })).toHaveCount(1);
    await passengerPage.getByRole('navigation', { name: 'Основна навігація' }).getByRole('button', { name: 'Поїздки', exact: true }).click();
    await expect(passengerPage.getByText(/2 місця/).first()).toBeVisible();
    await passengerPage.getByRole('button', { name: 'Відкрити зустріч' }).click();
    await expect(passengerPage.getByText(/Точка посадки · Стрий/)).toBeVisible();
    const prepareMeetingButton = passengerPage.getByRole('button', { name: /^Зустріч можна підготувати/ });
    await expect(prepareMeetingButton, 'a future booking must not start its rendezvous before the displayed activation time').toBeDisabled();
    await passengerPage.goto(conversationDeepLink);
    await expect(passengerPage.getByText('Буду на місці о 08:45.')).toBeVisible();

    // The message deep-link view has its own header and does not render the
    // global bottom navigation. Return to the main app before opening +.
    await passengerPage.goto('/');
    await expect(passengerPage.locator('.production-app')).toBeVisible();
    await openCreateMenu(passengerPage);
    await passengerPage.getByRole('button', { name: /Створити запит/ }).click();
    const demandPlaceInputs = passengerPage.getByPlaceholder('Пошук адреси або міста');
    await demandPlaceInputs.nth(0).fill('Стрий');
    await passengerPage.getByRole('button', { name: 'Знайти', exact: true }).nth(0).click();
    await passengerPage.getByRole('button', { name: /Стрий, Львівська область, Україна/ }).click();
    await demandPlaceInputs.nth(1).fill('Львів');
    await passengerPage.getByRole('button', { name: 'Знайти', exact: true }).nth(1).click();
    await passengerPage.getByRole('button', { name: /Львів, Львівська область, Україна/ }).click();
    const demandTimes = passengerPage.locator('input[type="datetime-local"]');
    await demandTimes.nth(0).fill(`${tomorrowInKyiv()}T08:00`);
    await demandTimes.nth(1).fill(`${tomorrowInKyiv()}T10:00`);
    await passengerPage.getByLabel('Пасажири').selectOption('2');
    await passengerPage.getByLabel('Бюджет, грн').fill('300');
    await passengerPage.getByRole('button', { name: 'Опублікувати заявку' }).click();
    await expect(passengerPage.getByRole('heading', { name: 'Пропозиції водіїв' })).toBeVisible();
    const createdDemandQuery = await pool.query<{ id: string }>(
      'SELECT id FROM passenger_demands WHERE passenger_id=(SELECT id FROM users WHERE phone_e164=$1) ORDER BY created_at DESC LIMIT 1',
      [passengerPhone],
    );
    const createdDemandId = createdDemandQuery.rows[0]?.id;
    expect(createdDemandId, 'the passenger demand must persist before the driver searches for it').toBeTruthy();

    await signIn(driverPage, 'MARSHGO Driver', driverPhone);
    await driverPage.getByRole('button', { name: 'Поїздки', exact: true }).click();
    const publishedOfferCard = driverPage.locator('article').filter({ hasText: /Стрий.*→.*Львів/ }).filter({ hasText: /2\s*(?:із|\/)\s*4 місць/ }).filter({ hasText: /150\s*(?:грн|₴) за місце/ });
    await expect(publishedOfferCard).toBeVisible();
    const driverTripCard = driverPage.locator('article').filter({ hasText: 'E2E Passenger' }).filter({ hasText: 'Стрий' });
    await expect(driverTripCard).toBeVisible();
    await passengerPage.getByRole('button', { name: 'Поїздки', exact: true }).click();
    const passengerTripCard = passengerPage.locator('article').filter({ hasText: 'MARSHGO E2E Driver' }).filter({ hasText: 'Стрий' }).filter({ hasText: /300\s*(?:грн|₴)/ });
    await expect(passengerTripCard).toHaveCount(1);
    await expect(passengerTripCard).toContainText('2 місця');
    const ticketResponsePromise = passengerPage.waitForResponse((response) => response.url().endsWith(`/api/v1/bookings/${createdBooking.id}/ticket`));
    await passengerTripCard.getByRole('button', { name: /Показати квиток для посадки/ }).click();
    const ticketResponse = await ticketResponsePromise;
    expect(ticketResponse.status()).toBe(200);
    const signedTicket = ((await ticketResponse.json()).data as { token: string }).token;
    expect(signedTicket.length).toBeGreaterThan(40);
    await driverTripCard.getByLabel('Токен квитка пасажира').fill(signedTicket);
    await driverTripCard.getByRole('button', { name: 'Підтвердити посадку' }).click();
    await expect(driverTripCard.getByText('Посадка')).toBeVisible();
    await driverTripCard.getByRole('button', { name: 'Почати поїздку' }).click();
    await expect(passengerTripCard.getByText('У дорозі')).toBeVisible();
    await passengerTripCard.getByRole('button', { name: 'Підтвердити завершення' }).click();
    await expect(passengerTripCard.getByText('Ваше підтвердження збережено на сервері.')).toBeVisible();
    await driverPage.bringToFront();
    await expect(driverTripCard.getByText('Завершення: 1/2 учасники')).toBeVisible({ timeout: 12_000 });
    await driverTripCard.getByRole('button', { name: 'Підтвердити завершення' }).click();
    await expect(driverPage.getByRole('status')).toContainText('Поїздку завершено за підтвердженнями обох учасників.');
    const completedBooking = await pool.query<{ status: string; confirmation_count: number }>(
      `SELECT b.status,(SELECT count(*)::int FROM booking_completion_confirmations cc WHERE cc.booking_id=b.id) AS confirmation_count
         FROM bookings b WHERE b.offer_id=$1 AND b.passenger_id=(SELECT id FROM users WHERE phone_e164=$2)`, [offerId, passengerPhone],
    );
    expect(completedBooking.rows).toEqual([{ status: 'completed', confirmation_count: 2 }]);

    await openTripHistory(passengerPage);
    await openTripHistory(driverPage);
    await passengerTripCard.getByTestId('booking-review-open').click();
    await expect(passengerPage.getByTestId('booking-review-form')).toBeVisible();
    await passengerPage.getByTestId('booking-review-form').getByRole('button', { name: '4 з 5', exact: true }).click();
    await expect(passengerPage.getByTestId('booking-review-form').getByRole('button', { name: '4 з 5', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await passengerPage.getByPlaceholder('Поділіться враженням про поїздку').fill('Водій був уважний, маршрут пройшов добре.');
    const passengerReviewResponse = passengerPage.waitForResponse(response => response.url().endsWith(`/api/v1/bookings/${createdBooking.id}/reviews`) && response.request().method() === 'POST');
    await passengerPage.getByRole('button', { name: 'Надіслати відгук' }).click();
    expect((await passengerReviewResponse).status()).toBe(201);
    await expect(passengerPage.getByText('Дякуємо! Ваш відгук збережено.', { exact: true }).first()).toBeVisible();

    await driverTripCard.getByTestId('booking-review-open').click();
    await expect(driverPage.getByTestId('booking-review-form')).toBeVisible();
    await driverPage.getByTestId('booking-review-form').getByRole('button', { name: '5 з 5', exact: true }).click();
    await expect(driverPage.getByTestId('booking-review-form').getByRole('button', { name: '5 з 5', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await driverPage.getByPlaceholder('Поділіться враженням про поїздку').fill('Пасажир був пунктуальний.');
    const driverReviewResponse = driverPage.waitForResponse(response => response.url().endsWith(`/api/v1/bookings/${createdBooking.id}/reviews`) && response.request().method() === 'POST');
    await driverPage.getByRole('button', { name: 'Надіслати відгук' }).click();
    expect((await driverReviewResponse).status()).toBe(201);
    await expect(driverPage.getByText('Дякуємо! Ваш відгук збережено.', { exact: true }).first()).toBeVisible();
    const persistedReviews = await pool.query<{ author_id: string; target_id: string; rating: number; comment: string | null }>(
      `SELECT author_id,target_id,rating,comment FROM reviews WHERE booking_id=$1 ORDER BY rating`, [createdBooking.id],
    );
    expect(persistedReviews.rows).toHaveLength(2);
    expect(persistedReviews.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ author_id: expect.any(String), target_id: driverId, rating: 4, comment: 'Водій був уважний, маршрут пройшов добре.' }),
      expect.objectContaining({ author_id: expect.any(String), target_id: expect.any(String), rating: 5, comment: 'Пасажир був пунктуальний.' }),
    ]));
    const duplicateReviewResponse = await passengerPage.evaluate(async ({ bookingId, token }) => fetch(`/api/v1/bookings/${bookingId}/reviews`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rating: 1, comment: 'Повторний відгук' }),
    }).then(response => response.status), { bookingId: createdBooking.id, token: passengerAccessToken });
    expect(duplicateReviewResponse).toBe(409);

    await passengerPage.reload();
    await driverPage.reload();
    await expect(passengerPage.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
    await expect(driverPage.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
    await openTripHistory(passengerPage);
    await openTripHistory(driverPage);
    await expect(passengerPage.locator('article').filter({ hasText: 'MARSHGO E2E Driver' }).getByTestId('booking-review-open')).toHaveCount(0);
    await expect(driverPage.locator('article').filter({ hasText: 'E2E Passenger' }).getByTestId('booking-review-open')).toHaveCount(0);

    await driverPage.getByRole('button', { name: /Чат|Написати/ }).click();
    await expect(driverPage.getByText('Буду на місці о 08:45.')).toBeVisible();

    await passengerPage.getByRole('button', { name: 'Поїздки', exact: true }).click();
    await passengerPage.getByRole('button', { name: /Чат|Написати/ }).click();
    await expect(passengerPage.getByText(/онлайн/)).toBeVisible();
    const realtimeMessage = 'Чекаю біля центрального входу.';
    await driverPage.getByRole('button', { name: 'Повернутися до поїздок', exact: true }).click();
    await expect(driverPage.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
    const passengerChatInput = passengerPage.getByPlaceholder('Напишіть повідомлення…');
    await passengerChatInput.fill(realtimeMessage);
    await passengerChatInput.press('Enter');
    await driverPage.bringToFront();
    await openTripHistory(driverPage);
    const unreadBookingCard = driverPage.locator('article').filter({ hasText: 'E2E Passenger' });
    const unreadChatButton = unreadBookingCard.getByRole('button', { name: /^(?:Чат|Написати)/ });
    await expect(unreadChatButton).toBeVisible({ timeout: 10_000 });
    await expect(unreadChatButton).toContainText('1');
    await unreadChatButton.click();
    await expect(driverPage.getByText(realtimeMessage)).toBeVisible({ timeout: 10_000 });
    const readCursor = await pool.query<{ last_read_message_id: string | null }>(
      `SELECT cm.last_read_message_id FROM conversation_members cm JOIN conversations c ON c.id=cm.conversation_id
        JOIN bookings b ON b.id=c.booking_id WHERE b.offer_id=$1 AND cm.user_id=(SELECT id FROM users WHERE phone_e164=$2)`,
      [offerId, driverPhone],
    );
    expect(readCursor.rows[0]?.last_read_message_id).toBeTruthy();

    await driverPage.getByRole('button', { name: 'Поїздки', exact: true }).click();
    await expect(driverPage.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
    await driverPage.getByRole('tab', { name: /Запити/ }).click();
    await driverPage.getByRole('button', { name: /Запити пасажирів/ }).click();
    await expect(driverPage.getByRole('heading', { name: 'Заявки пасажирів' })).toBeVisible();
    const openDemand = driverPage.getByTestId(`open-demand-${createdDemandId}`);
    await openDemand.getByRole('button', { name: /Запропонувати ціну/ }).click();
    await driverPage.getByLabel('Перевірене авто').selectOption(vehicleId);
    await driverPage.getByLabel('Ціна, грн').fill('350');
    await driverPage.getByRole('button', { name: 'Надіслати пропозицію' }).click();
    await expect(driverPage.getByText(/350\s*(?:грн|₴)/)).toBeVisible();

    await openCreateMenu(passengerPage);
    await passengerPage.getByRole('button', { name: /Створити запит/ }).click();
    await passengerPage.getByRole('button', { name: 'Мої заявки' }).click();
    await passengerPage.getByTestId(`owned-demand-${createdDemandId}`).click();
    await passengerPage.getByRole('button', { name: 'Змінити ціну або час' }).click();
    await passengerPage.getByLabel('Загальна сума, грн').fill('320');
    await passengerPage.getByRole('button', { name: 'Надіслати зустрічну' }).click();
    await expect(passengerPage.getByText(/320\s*(?:грн|₴)/)).toBeVisible();

    await driverPage.reload();
    await expect(driverPage).toHaveURL(/\/demands\/[A-Za-z0-9_-]+$/);
    await expect(driverPage.getByRole('heading', { name: 'Стрий → Львів' })).toBeVisible();
    // Reload restores the server-owned demand detail; the driver's counteroffer
    // agreement belongs on this detail, not in the open-demands list.
    await driverPage.getByRole('button', { name: 'Погодити зустрічну ціну' }).click();

    await passengerPage.reload();
    await expect(passengerPage).toHaveURL(/\/demands\/[A-Za-z0-9_-]+$/);
    await expect(passengerPage.getByRole('heading', { name: 'Стрий → Львів' })).toBeVisible();
    await openCreateMenu(passengerPage);
    await passengerPage.getByRole('button', { name: /Створити запит/ }).click();
    await passengerPage.getByRole('button', { name: 'Мої заявки' }).click();
    await passengerPage.getByTestId(`owned-demand-${createdDemandId}`).click();
    await passengerPage.getByRole('button', { name: 'Підтвердити домовленість і бронювання' }).click();
    await expect(passengerPage.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
    const negotiatedBooking = await pool.query<{ seat_count: number; total_price_minor: number; status: string }>(
      `SELECT seat_count,total_price_minor,status FROM bookings WHERE passenger_id=(SELECT id FROM users WHERE phone_e164=$1) AND idempotency_key LIKE 'proposal-accept:%'`,
      [passengerPhone],
    );
    expect(negotiatedBooking.rows).toEqual([{ seat_count: 2, total_price_minor: 32000, status: 'confirmed' }]);

    await driverPage.reload();
    await expect(driverPage).toHaveURL(/\/demands\/[A-Za-z0-9_-]+$/);
    await expect(driverPage.getByRole('heading', { name: 'Стрий → Львів' })).toBeVisible();
    await driverPage.getByRole('button', { name: 'Поїздки', exact: true }).click();
    // Navigation restores the overview's previously selected "Заплановані" filter.
    await expect(driverPage.getByRole('tab', { name: /Заплановані/ })).toHaveAttribute('aria-selected', 'true');
    await expect(driverPage.getByText(/320\s*(?:грн|₴)/)).toBeVisible();
    // The persisted chat belongs to the first (completed) booking, which is listed under "Минулі".
    await openTripHistory(driverPage);
    await driverPage.getByRole('button', { name: /Чат|Написати/ }).first().click();
    await expect(driverPage.getByText(realtimeMessage)).toBeVisible();

    const messages = await pool.query<{ body: string }>(
      `SELECT m.body FROM messages m JOIN conversations c ON c.id=m.conversation_id
       JOIN bookings b ON b.id=c.booking_id WHERE b.offer_id=$1 ORDER BY m.created_at`, [offerId],
    );
    expect(messages.rows.filter((row) => !row.body.startsWith('Стара історія E2E ')).map((row) => row.body))
      .toEqual(['Буду на місці о 08:45.', realtimeMessage]);
    expect(messages.rows.filter((row) => row.body.startsWith('Стара історія E2E '))).toHaveLength(55);

    // The passenger remains in the previously opened booking chat after the
    // demand flow; return to the trip list and reopen the completed booking.
    const returnToTrips = passengerPage.getByRole('button', { name: 'Назад', exact: true });
    if (await returnToTrips.isVisible()) await returnToTrips.click();
    await passengerPage.getByRole('button', { name: 'Поїздки', exact: true }).click();
    await openTripHistory(passengerPage);
    await expect(passengerTripCard).toBeVisible();
    await passengerTripCard.getByRole('button', { name: /^(?:Чат|Написати)/ }).click();
    passengerPage.once('dialog', (dialog) => dialog.accept());
    const blockResponse = passengerPage.waitForResponse(response => response.url().endsWith(`/api/v1/bookings/${createdBooking.id}/block-other`) && response.request().method() === 'POST');
    await passengerPage.getByRole('button', { name: 'Заблокувати співрозмовника' }).click();
    expect((await blockResponse).status()).toBe(204);
    await expect(passengerPage.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
    await passengerPage.getByRole('button', { name: 'Профіль', exact: true }).click();
    await expect(passengerPage.getByRole('heading', { name: 'Профіль', exact: true })).toBeVisible();
    await expect(passengerPage.getByText('Заблоковані користувачі')).toBeVisible();
    await expect(passengerPage.getByText('MARSHGO E2E Driver', { exact: true })).toBeVisible();
    const [exportDownload] = await Promise.all([
      passengerPage.waitForEvent('download'),
      passengerPage.getByRole('button', { name: /Завантажити мої дані/ }).click(),
    ]);
    expect(exportDownload.suggestedFilename()).toMatch(/^marshgo-data-\d{4}-\d{2}-\d{2}\.json$/);
    const exportedData = JSON.parse(await readFile(await exportDownload.path()!, 'utf8')) as { profile: { phone_e164: string }; bookings: Array<{ passenger_id?: string }> };
    expect(exportedData.profile.phone_e164).toBe(passengerPhone);
    expect(JSON.stringify(exportedData)).not.toContain(driverPhone);
    await expect(passengerPage.getByRole('status').filter({ hasText: 'Ваші дані завантажено' })).toBeVisible();
    await passengerPage.getByRole('button', { name: 'Подати запит на видалення' }).click();
    await passengerPage.getByRole('alertdialog', { name: 'Подати запит на видалення акаунта?' }).getByRole('button', { name: 'Так, подати запит' }).click();
    await expect(passengerPage.getByRole('status').filter({ hasText: 'Запит на видалення зареєстровано' })).toBeVisible();
    await expect(passengerPage.getByText(/Запит очікує скасування до/)).toBeVisible();
    await passengerPage.getByRole('button', { name: 'Скасувати запит' }).click();
    await expect(passengerPage.getByRole('status').filter({ hasText: 'Запит на видалення скасовано' })).toBeVisible();
    const deletionState = await pool.query<{ status: string; cancelled_at: Date | null }>(
      'SELECT status,cancelled_at FROM account_deletion_requests WHERE user_id=(SELECT id FROM users WHERE phone_e164=$1) ORDER BY requested_at DESC LIMIT 1', [passengerPhone],
    );
    expect(deletionState.rows).toMatchObject([{ status: 'cancelled' }]);
    expect(deletionState.rows[0].cancelled_at).not.toBeNull();
    await passengerPage.reload();

    const deniedMessage = `Це повідомлення має бути заблоковане. ${Date.now()}`;
    const driverChatInput = driverPage.getByPlaceholder('Напишіть повідомлення…');
    await driverChatInput.fill(deniedMessage);
    await driverChatInput.press('Enter');
    await expect(driverPage.getByRole('status').filter({ hasText: 'conversation unavailable' })).toBeVisible();
    const deniedStored = await pool.query<{ count: number }>('SELECT count(*)::int AS count FROM messages WHERE body=$1', [deniedMessage]);
    expect(deniedStored.rows[0].count).toBe(0);

    await passengerPage.getByRole('button', { name: 'Профіль', exact: true }).click();
    await expect(passengerPage.getByText('Заблоковані користувачі')).toBeVisible();
    await passengerPage.getByRole('button', { name: 'Розблокувати', exact: true }).click();
    await expect(passengerPage.getByText('MARSHGO E2E Driver', { exact: true })).toHaveCount(0);
    await driverChatInput.fill(deniedMessage);
    await driverChatInput.press('Enter');
    await expect.poll(async () => (await pool.query<{ count: number }>('SELECT count(*)::int AS count FROM messages WHERE body=$1', [deniedMessage])).rows[0].count, { message: 'unblocked message is persisted' }).toBe(1);
    await expect(driverPage.getByText(deniedMessage)).toBeVisible();

    await refreshTokenResponses;
    const cancelledBooking = await passengerPage.evaluate(async ({ targetOfferId, accessToken }) => {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`, 'Idempotency-Key': `e2e-rescue-${crypto.randomUUID()}` },
        body: JSON.stringify({ offerId: targetOfferId, seats: 1 }),
      });
      return { status: response.status, body: await response.json() };
    }, { targetOfferId: offerId, accessToken: passengerAccessToken });
    expect(cancelledBooking.status).toBe(201);
    await passengerPage.reload();
    await expect(passengerPage).toHaveURL(/\/profile$/);
    await expect(passengerPage.getByRole('heading', { name: 'Профіль' })).toBeVisible();
    await passengerPage.getByRole('button', { name: 'Поїздки', exact: true }).click();
    const rescueTripCard = passengerPage.locator('article').filter({ hasText: 'MARSHGO E2E Driver' }).first();
    await rescueTripCard.getByRole('button', { name: 'Скасувати' }).click();
    const cancelBookingDialog = passengerPage.getByRole('alertdialog', { name: 'Скасувати бронювання?' });
    await expect(cancelBookingDialog).toBeVisible();
    await cancelBookingDialog.getByRole('button', { name: 'Так, скасувати' }).click();
    await expect(rescueTripCard.getByText('Інші поїздки MARSHGO поруч', { exact: true })).toBeVisible();
    const rescueAlternative = rescueTripCard.getByRole('button').filter({ hasText: 'Rescue E2E Origin' }).first();
    await expect(rescueAlternative).toContainText(/220\s*(?:грн|₴)/);
    await expect(rescueAlternative).toContainText('Поруч із початковою точкою');
    const corridorAlternative = rescueTripCard.getByRole('button').filter({ hasText: 'Rescue E2E Corridor Origin' }).first();
    await expect(corridorAlternative).toContainText(/240\s*(?:грн|₴)/);
    await expect(corridorAlternative).toContainText('Початок уздовж вашого маршруту');
    await corridorAlternative.click();
    await expect(passengerPage.getByRole('heading', { name: /Rescue E2E Corridor Origin/ })).toBeVisible();
    await expect(passengerPage.getByTestId('offer-book-button')).toHaveAttribute('data-offer-id', rescueCorridorAlternativeId);
    const rescueBookingResponse = passengerPage.waitForResponse(response =>
      response.url().endsWith('/api/v1/bookings') && response.request().method() === 'POST',
    );
    await passengerPage.getByRole('button', { name: /Забронювати місце/ }).click();
    const bookingResponse = await rescueBookingResponse;
    const rescueBookingPayload = await bookingResponse.json() as { data: { id: string; offer_id: string; status: string; total_price_minor: number } };
    expect(bookingResponse.status()).toBe(201);
    expect(rescueBookingPayload.data).toMatchObject({ offer_id: rescueCorridorAlternativeId, status: 'confirmed', total_price_minor: 24000 });
    const rescueBooking = await pool.query<{ status: string; total_price_minor: number }>(
      'SELECT status,total_price_minor FROM bookings WHERE id=$1 AND offer_id=$2 AND passenger_id=(SELECT id FROM users WHERE phone_e164=$3)',
      [rescueBookingPayload.data.id, rescueCorridorAlternativeId, passengerPhone],
    );
    expect(rescueBooking.rows).toEqual([{ status: 'confirmed', total_price_minor: 24000 }]);
    const replacementInventory = await pool.query<{ available_seats: number }>(
      'SELECT available_seats FROM offers WHERE id=$1', [rescueCorridorAlternativeId],
    );
    expect(replacementInventory.rows).toEqual([{ available_seats: 3 }]);
    const refreshedCorridorInventory = await pool.query<{ available_seats: number }>(
      'SELECT available_seats FROM offers WHERE id=$1', [rescueCorridorAlternativeId],
    );
    expect(refreshedCorridorInventory.rows).toEqual([{ available_seats: 3 }]);
  } finally {
    await passengerContext.close().catch(() => undefined);
    await driverContext.close().catch(() => undefined);
  }
});

test('driver safely matches two independent riders, inserts ordered stops, and reroutes after browser GPS deviation', async ({ browser, browserName, baseURL }) => {
  test.setTimeout(360_000);
  expect(baseURL).toBeTruthy();
  const driverContext = await browser.newContext({
    ...devices['iPhone 16 Pro Max'], baseURL, timezoneId: 'Europe/Kyiv',
    geolocation: { latitude: 49.2567, longitude: 23.8561, accuracy: 8 }, permissions: ['geolocation'],
  });
  const passengerContext = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const secondPassengerContext = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const driverPage = await driverContext.newPage();
  const passengerPage = await passengerContext.newPage();
  const secondPassengerPage = await secondPassengerContext.newPage();
  for (const page of [driverPage, passengerPage, secondPassengerPage]) page.setDefaultTimeout(15_000);
  if (browserName === 'firefox') {
    // Playwright Firefox stamps its mocked GeolocationPosition one day ahead
    // of Date.now(). Normalize only this test sensor clock to model real GPS.
    await driverPage.addInitScript(() => {
      const geolocation = navigator.geolocation;
      const withCurrentTimestamp = (position: GeolocationPosition) => new Proxy(position, {
        get(target, property) {
          if (property === 'timestamp') return Date.now();
          return Reflect.get(target, property);
        },
      });
      const current = geolocation.getCurrentPosition.bind(geolocation);
      const watch = geolocation.watchPosition.bind(geolocation);
      Object.defineProperty(geolocation, 'getCurrentPosition', { configurable: true, value: (success: PositionCallback, error?: PositionErrorCallback | null, options?: PositionOptions) => current(position => success(withCurrentTimestamp(position)), error, options) });
      Object.defineProperty(geolocation, 'watchPosition', { configurable: true, value: (success: PositionCallback, error?: PositionErrorCallback | null, options?: PositionOptions) => watch(position => success(withCurrentTimestamp(position)), error, options) });
    });
  }
  let navigationSessionId = '';
  let driverAccessToken = '';
  try {
    driverAccessToken = await signIn(driverPage, 'Navigation Driver', navigationFlowDriverPhone);
    let passengerToken = await signIn(passengerPage, 'Navigation Passenger', navigationPassengerPhone);
    const secondPassengerToken = await signIn(secondPassengerPage, 'Navigation Passenger Two', navigationThirdPassengerPhone);
    const enableDriverRole = await driverPage.evaluate(async token => fetch('/api/v1/users/me/roles', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ role: 'driver' }),
    }).then(response => response.status), driverAccessToken);
    expect(enableDriverRole).toBe(200);
    const driverProfile = await driverPage.evaluate(async token => fetch('/api/v1/users/me', { headers: { Authorization: `Bearer ${token}` } }).then(response => response.json()), driverAccessToken);
    const passengerProfile = await passengerPage.evaluate(async token => fetch('/api/v1/users/me', { headers: { Authorization: `Bearer ${token}` } }).then(response => response.json()), passengerToken);
    const driverUserId = driverProfile.data.id as string;
    const passengerUserId = passengerProfile.data.id as string;
    expect(driverUserId).not.toBe(passengerUserId);
    await pool.query(`INSERT INTO vehicles(id,owner_id,make,model,model_year,seat_count,verification_status,is_active)
      VALUES($1,$2,'E2E','Navigation car',2024,4,'verified',true)`, [navigationFlowVehicleId, driverUserId]);
    const driverRefresh = driverPage.waitForResponse(response => response.url().endsWith('/api/v1/auth/refresh'));
    await driverPage.reload();
    const refreshedDriverSession = await driverRefresh;
    expect(refreshedDriverSession.status()).toBe(200);
    driverAccessToken = (await refreshedDriverSession.json()).data.accessToken as string;

    // Account and vehicle setup takes long enough for Firefox to age the
    // context's initial geolocation fix. Refresh the simulated sensor just
    // before starting so this scenario exercises the fresh-fix path.
    await driverContext.setGeolocation({ latitude: 49.2567, longitude: 23.8561, accuracy: 8 });
    const sessionResponse = await startNavigationFromHome(driverPage);
    expect(sessionResponse.status()).toBe(201);
    navigationSessionId = (await sessionResponse.json()).data.id as string;
    await expect(driverPage.getByRole('textbox', { name: 'Куди їдемо?' })).toBeVisible();
    await driverPage.getByRole('textbox', { name: 'Куди їдемо?' }).fill('Львів');
    await driverPage.getByRole('button', { name: 'Знайти місце', exact: true }).click();
    const destinationResponse = driverPage.waitForResponse(response =>
      response.url().endsWith('/api/v1/navigation/sessions') === false
        && response.url().endsWith('/destination') && response.request().method() === 'PUT',
    );
    await driverPage.getByRole('button', { name: /Львів, Львівська область, Україна/ }).click();
    const destinationResult = await destinationResponse;
    expect(destinationResult.status()).toBe(200);
    const destinationPayload = (await destinationResult.json()).data as { destination_name: string; route: Array<[number, number]> };
    expect(destinationPayload.destination_name).toContain('Львів');
    expect(destinationPayload.route.length).toBeGreaterThan(1);
    // A driver with a verified vehicle gets passenger search along the route on by default.
    await expect(driverPage.locator('section[aria-label="Панель навігації"]')).toHaveCount(0);
    const perspectiveControl = driverPage.getByRole('button', { name: /(?:Увімкнути|Вимкнути) 3D-перспективу/ });
    await expect(perspectiveControl).toBeVisible();
    const initial3dState = await perspectiveControl.getAttribute('aria-pressed');
    await perspectiveControl.click();
    await expect(perspectiveControl).toHaveAttribute('aria-pressed', initial3dState === 'true' ? 'false' : 'true');
    await perspectiveControl.click();
    await expect(perspectiveControl).toHaveAttribute('aria-pressed', initial3dState!);
    const layersButton = driverPage.getByRole('button', { name: 'Шари карти', exact: true });
    await expect(layersButton).toBeVisible();
    await layersButton.click();
    const layersDialog = driverPage.getByRole('dialog', { name: 'Шари карти' });
    await expect(layersDialog).toBeVisible();
    await expect(layersDialog.getByRole('button', { name: 'Мій маршрут', exact: true })).toHaveCount(0);
    await expect(layersDialog).toContainText('немає даних');
    await expect(layersDialog.getByRole('checkbox', { name: 'Автобуси' })).toHaveCount(0);
    await expect(layersDialog.getByRole('button', { name: 'Транспорт', exact: true })).toHaveCount(0);
    await layersButton.click();
    await expect(layersDialog).toBeHidden();
    await expect(driverPage.getByRole('button', { name: 'Показати моє місце' })).toBeVisible();
    await expect(driverPage.getByRole('button', { name: 'Розгорнути панель навігації' })).toBeVisible();
    await driverPage.getByRole('button', { name: 'Розгорнути панель навігації' }).click();
    await expect(driverPage.getByRole('button', { name: 'Шари карти' })).toBeVisible();
    await driverPage.getByRole('button', { name: 'Розгорнути панель повністю' }).click();
    await expect(driverPage.getByRole('button', { name: 'Завершити навігацію' })).toBeVisible();
    await expect(driverPage.getByRole('switch', { name: 'Пошук попутників уздовж маршруту' })).toHaveAttribute('aria-checked', 'true');
    // The expanded sheet folds to the canonical half-open state and comes back.
    await driverPage.getByRole('button', { name: 'Згорнути панель' }).click();
    await expect(driverPage.getByRole('switch', { name: 'Пошук попутників уздовж маршруту' })).toHaveCount(0);
    await expect(driverPage.getByRole('button', { name: 'Завершити навігацію' })).toBeVisible();
    await expect(driverPage.locator('section[aria-label="Панель навігації"]')).toBeVisible();
    await driverPage.getByRole('button', { name: 'Розгорнути панель повністю' }).click();
    await expect(driverPage.getByRole('button', { name: 'Завершити навігацію' })).toBeVisible();
    await expect(driverPage.getByRole('switch', { name: 'Пошук попутників уздовж маршруту' })).toBeVisible();
    // "My location" brings back the Apple-Maps-like follow camera (close, tilted, heading-up).
    await driverPage.getByRole('button', { name: 'Показати моє місце' }).click();
    await expect(driverPage.locator('[data-marshgo-map-renderer="maplibre"]')).toHaveAttribute('data-marshgo-camera-mode', 'FOLLOW_HEADING');
    await expect(driverPage.getByRole('button', { name: 'Показати моє місце' })).toHaveAttribute('aria-pressed', 'true');
    await expect(driverPage.getByTestId('navigation-speed')).toBeVisible();
    await expect.poll(async () => pool.query<{ current_location_at: Date | null }>('SELECT current_location_at FROM navigation_sessions WHERE id=$1', [navigationSessionId]).then(result => result.rows[0]?.current_location_at ?? null)).not.toBeNull();

    const departureStart = new Date(Date.now() + 15 * 60_000);
    const departureEnd = new Date(Date.now() + 4 * 60 * 60_000);
    const demandResponse = await passengerPage.evaluate(async ({ token, earliest, latest }) => fetch('/api/v1/demands', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        originName: 'Дуліб', destinationName: 'Львів', origin: [23.94, 49.53], destination: [24.0, 49.77],
        earliestDeparture: earliest, latestDeparture: latest, passengers: 1, budgetMinor: 30000, budgetType: 'total_all', notes: 'E2E navigation demand',
      }),
    }).then(async response => ({ status: response.status, body: await response.json() })), {
      token: passengerToken, earliest: departureStart.toISOString(), latest: departureEnd.toISOString(),
    });
    expect(demandResponse.status).toBe(201);
    navigationFlowDemandId = demandResponse.body.data.id as string;

    const candidateResult = await driverPage.evaluate(async ({ token, sessionId }) => fetch(`/api/v1/navigation/sessions/${sessionId}/matches/refresh`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    }).then(async response => ({ status: response.status, body: await response.json() })), { token: driverAccessToken, sessionId: navigationSessionId });
    expect(candidateResult.status).toBe(200);
    const candidate = (candidateResult.body.data as Array<{ id: string; demand_id: string; detour_distance_m: number; detour_duration_s: number }>).find(item => item.demand_id === navigationFlowDemandId);
    expect(candidate, 'the real demand should pass route/time/seat matching against the foreground session').toBeTruthy();
    expect(candidate!.detour_distance_m).toBeGreaterThanOrEqual(0);

    if (browserName === 'webkit') {
      // Playwright WebKit can reuse one timestamp for different mocked fixes.
      // Real device fixes advance their capture time; model that browser contract
      // here so the test verifies movement/rerouting rather than mock-clock reuse.
      await driverPage.addInitScript(() => {
        const geolocation = navigator.geolocation;
        let latestTimestamp = Date.now();
        const withFreshTimestamp = (position: GeolocationPosition) => new Proxy(position, {
          get(target, property) {
            if (property === 'timestamp') {
              latestTimestamp = Math.max(Date.now(), latestTimestamp + 1);
              return latestTimestamp;
            }
            return Reflect.get(target, property);
          },
        });
        const current = geolocation.getCurrentPosition.bind(geolocation);
        const watch = geolocation.watchPosition.bind(geolocation);
        Object.defineProperty(geolocation, 'getCurrentPosition', { configurable: true, value: (success: PositionCallback, error?: PositionErrorCallback | null, options?: PositionOptions) => current(position => success(withFreshTimestamp(position)), error, options) });
        Object.defineProperty(geolocation, 'watchPosition', { configurable: true, value: (success: PositionCallback, error?: PositionErrorCallback | null, options?: PositionOptions) => watch(position => success(withFreshTimestamp(position)), error, options) });
      });
    }
    const restoredDriverRefresh = driverPage.waitForResponse(response => response.url().endsWith('/api/v1/auth/refresh'));
    await driverPage.reload();
    const restoredSessionResponse = await restoredDriverRefresh;
    expect(restoredSessionResponse.status()).toBe(200);
    driverAccessToken = (await restoredSessionResponse.json()).data.accessToken as string;
    const routeMap = driverPage.locator('[data-marshgo-map-renderer="maplibre"]');
    await expect(routeMap.locator('.maplibregl-canvas')).toBeVisible();
    await expect.poll(() => routeMap.getAttribute('data-marshgo-route-point-count')).toBeTruthy();
    const initialRoutePointCount = Number(await routeMap.getAttribute('data-marshgo-route-point-count'));
    const liveProgress = driverPage.getByTestId('navigation-live-progress');
    const initialLiveProgress = await liveProgress.innerText();
    const distanceKm = (text: string) => Number(text.match(/(\d+(?:[,.]\d+)?) км/)?.[1]?.replace(',', '.') ?? Number.NaN);
    const initialDistanceKm = distanceKm(initialLiveProgress);
    expect(Number.isFinite(initialDistanceKm)).toBe(true);
    const activeNavigation = await driverPage.evaluate(async token => fetch('/api/v1/navigation/sessions/active', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => response.json()), driverAccessToken);
    const routeGeometry = activeNavigation.data.route as Array<[number, number]>;
    expect(routeGeometry.length).toBeGreaterThan(1);
    const [routeStart] = routeGeometry;
    const coordinateDistanceMeters = (from: [number, number], to: [number, number]) => {
      const radians = Math.PI / 180;
      const latitudeDelta = (to[1] - from[1]) * radians;
      const longitudeDelta = (to[0] - from[0]) * radians * Math.cos(from[1] * radians);
      return Math.hypot(latitudeDelta, longitudeDelta) * 6_371_000;
    };
    // Exercise Playwright's browser geolocation API; the production WebGeolocationProvider,
    // validation, route projection, NavigationCore and live UI all receive this update.
    // Move 150 m along the actual route. A small fraction of the first vertex
    // edge can fall below the turn-guidance distance display resolution.
    const routeCoordinateAt = (distanceMeters: number): [number, number] => {
      let covered = 0;
      for (let index = 1; index < routeGeometry.length; index += 1) {
        const start = routeGeometry[index - 1]!;
        const end = routeGeometry[index]!;
        const length = coordinateDistanceMeters(start, end);
        if (covered + length >= distanceMeters) {
          const fraction = length === 0 ? 0 : (distanceMeters - covered) / length;
          return [start[0] + (end[0] - start[0]) * fraction, start[1] + (end[1] - start[1]) * fraction];
        }
        covered += length;
      }
      return routeGeometry.at(-1)!;
    };
    const firstGpsTarget = routeCoordinateAt(150);
    const firstGpsResponsePromise = driverPage.waitForResponse((response) => {
      if (!response.url().endsWith(`/api/v1/navigation/sessions/${navigationSessionId}/location`) || response.request().method() !== 'POST') return false;
      const body = response.request().postDataJSON() as { coordinates?: [number, number] } | null;
      return Boolean(body?.coordinates && Math.abs(body.coordinates[0] - firstGpsTarget[0]) < 1e-5 && Math.abs(body.coordinates[1] - firstGpsTarget[1]) < 1e-5);
    }, { timeout: 20_000 });
    await driverPage.bringToFront();
    await driverContext.setGeolocation({ longitude: firstGpsTarget[0], latitude: firstGpsTarget[1], accuracy: 5 });
    const firstGpsResponse = await firstGpsResponsePromise;
    expect(firstGpsResponse.status(), await firstGpsResponse.text()).toBe(200);
    const firstGpsPostedCoordinates = (firstGpsResponse.request().postDataJSON() as { coordinates: [number, number] }).coordinates;
    expect(coordinateDistanceMeters(firstGpsPostedCoordinates, firstGpsTarget), 'the first live GPS event should contain the fresh WebKit fix').toBeLessThan(1);
    expect((await firstGpsResponse.json()).data).toMatchObject({ accepted: true, onRoute: true });
    const firstSavedFix = await pool.query<{ longitude: number; latitude: number }>(
      'SELECT ST_X(current_location::geometry) AS longitude,ST_Y(current_location::geometry) AS latitude FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    );
    expect(coordinateDistanceMeters([firstSavedFix.rows[0]!.longitude, firstSavedFix.rows[0]!.latitude], firstGpsTarget)).toBeLessThan(1);
    await expect.poll(() => liveProgress.innerText(), { timeout: 20_000 }).not.toBe(initialLiveProgress);
    await expect(driverPage.getByRole('button', { name: 'Розгорнути панель навігації' })).toBeVisible();
    await driverPage.getByRole('button', { name: 'Розгорнути панель навігації' }).click();
    await expect(driverPage.getByRole('region', { name: 'Панель навігації' })).toContainText('На маршруті');
    // Other browser contexts are used below for passenger actions. Bring the
    // driver page to the foreground and obtain a new fix before offering a
    // response, because matching intentionally refuses stale GPS positions.
    const locationBeforePause = await pool.query<{ longitude: number | null; latitude: number | null; current_location_at: Date | null }>(
      'SELECT ST_X(current_location::geometry) AS longitude,ST_Y(current_location::geometry) AS latitude,current_location_at FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    );
    const previousFixAt = locationBeforePause.rows[0]?.current_location_at?.getTime() ?? 0;
    const previousCoordinate = locationBeforePause.rows[0]?.longitude != null && locationBeforePause.rows[0]?.latitude != null
      ? [locationBeforePause.rows[0].longitude, locationBeforePause.rows[0].latitude] as [number, number]
      : routeStart;
    const targetCoordinate = routeCoordinateAt(190);
    expect(coordinateDistanceMeters(previousCoordinate, targetCoordinate), 'the next GPS fix must pass the 25 m client send threshold').toBeGreaterThanOrEqual(25);
    // Keep the injected movement plausible so the production teleport guard accepts it.
    await driverPage.waitForTimeout(1_000);
    const locationUpdate = driverPage.waitForResponse((response) => {
      return response.url().endsWith(`/api/v1/navigation/sessions/${navigationSessionId}/location`) && response.request().method() === 'POST';
    }, { timeout: 20_000 });
    await driverPage.bringToFront();
    await driverContext.setGeolocation({ longitude: targetCoordinate[0], latitude: targetCoordinate[1], accuracy: 5 });
    const locationResponse = await locationUpdate;
    expect(locationResponse.status(), await locationResponse.text()).toBe(200);
    const postedCoordinates = (locationResponse.request().postDataJSON() as { coordinates: [number, number] }).coordinates;
    expect(coordinateDistanceMeters(postedCoordinates, targetCoordinate), 'the live GPS request should contain the latest WebKit fix').toBeLessThan(1);
    expect((await locationResponse.json()).data).toMatchObject({ accepted: true, onRoute: true });
    const savedFix = await pool.query<{ longitude: number; latitude: number; current_location_at: Date }>(
      'SELECT ST_X(current_location::geometry) AS longitude,ST_Y(current_location::geometry) AS latitude,current_location_at FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    );
    expect(savedFix.rows[0]?.current_location_at.getTime()).toBeGreaterThan(previousFixAt);
    expect(coordinateDistanceMeters([savedFix.rows[0]!.longitude, savedFix.rows[0]!.latitude], targetCoordinate)).toBeLessThan(1);
    await expect(driverPage.getByRole('region', { name: 'Панель навігації' })).not.toContainText('GPS застарів');
    await driverPage.getByRole('button', { name: 'Розгорнути панель повністю' }).click();
    await driverPage.getByRole('button', { name: 'Зупиніться та призупиніть навігацію, щоб відповісти' }).first().click();
    await expect.poll(async () => pool.query<{ state: string }>(
      'SELECT state FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    ).then(result => result.rows[0]?.state)).toBe('paused');
    await expect(driverPage.getByRole('button', { name: 'Підтвердити інтерес водія' })).toBeVisible();
    const driverInterestResponse = driverPage.waitForResponse(response => response.url().endsWith(`/matches/${candidate!.id}/interest`));
    await driverPage.getByRole('button', { name: 'Підтвердити інтерес водія' }).click();
    expect((await driverInterestResponse).status()).toBe(200);
    await expect(driverPage.getByText(/Ваш інтерес надіслано\. Чекаємо підтвердження пасажира/)).toBeVisible();

    const refreshedPassengerSession = passengerPage.waitForResponse(response => response.url().endsWith('/api/v1/auth/refresh'));
    await passengerPage.reload();
    const passengerRefreshResponse = await refreshedPassengerSession;
    expect(passengerRefreshResponse.status()).toBe(200);
    passengerToken = (await passengerRefreshResponse.json()).data.accessToken as string;
    await openCreateMenu(passengerPage);
    await passengerPage.getByRole('button', { name: /Створити запит/ }).click();
    await passengerPage.getByRole('button', { name: 'Мої заявки' }).click();
    await passengerPage.getByRole('button', { name: 'Оновити', exact: true }).click();
    await expect(passengerPage.getByRole('button', { name: 'Підтвердити взаємний інтерес' })).toBeVisible();
    await passengerPage.getByRole('button', { name: 'Підтвердити взаємний інтерес' }).click();
    await expect(passengerPage.getByRole('button', { name: 'Підтвердити взаємний інтерес' })).toHaveCount(0);
    await expect(passengerPage.getByText(/Взаємний інтерес підтверджено\. Водій може надіслати ціну у пропозиції/)).toBeVisible();

    const driverRefreshAfterConfirmation = driverPage.waitForResponse(response => response.url().endsWith('/api/v1/auth/refresh'));
    await driverPage.reload();
    const refreshedDriverAfterConfirmation = await driverRefreshAfterConfirmation;
    expect(refreshedDriverAfterConfirmation.status()).toBe(200);
    driverAccessToken = (await refreshedDriverAfterConfirmation.json()).data.accessToken as string;
    await expect(driverPage.getByRole('button', { name: 'Розгорнути панель навігації' })).toBeVisible();
    await driverPage.getByRole('button', { name: 'Розгорнути панель навігації' }).click();
    await driverPage.getByRole('button', { name: 'Розгорнути панель повністю' }).click();
    const openDemandButton = driverPage.getByRole('button', { name: 'Відкрити заявку та запропонувати ціну' });
    await expect(openDemandButton).toBeVisible();
    await openDemandButton.click();
    await expect(driverPage.getByLabel('Ціна, грн')).toBeVisible();
    await expect(driverPage.getByText(/Пропозиція прив’язана до підтвердженого збігу навігації/)).toBeVisible();
    const proposalResponse = driverPage.waitForResponse(response => response.url().endsWith(`/api/v1/demands/${navigationFlowDemandId}/proposals`) && response.request().method() === 'POST');
    await driverPage.getByRole('button', { name: 'Надіслати пропозицію' }).click();
    expect((await proposalResponse).status()).toBe(201);
    await expect(driverPage.getByRole('status')).toContainText('Цінову пропозицію надіслано пасажиру');
    const proposalRecord = await pool.query<{ id: string; price_minor: number; status: string }>(
      'SELECT id,price_minor,status FROM proposals WHERE demand_id=$1 AND driver_id=$2 ORDER BY created_at DESC LIMIT 1',
      [navigationFlowDemandId, driverUserId],
    );
    expect(proposalRecord.rows).toEqual([expect.objectContaining({ price_minor: 30000, status: 'pending' })]);

    await passengerPage.getByTestId(`owned-demand-${navigationFlowDemandId}`).click();
    await expect(passengerPage.getByText('Переговори')).toBeVisible();
    const proposalAcceptance = passengerPage.waitForResponse(response => response.url().endsWith(`/api/v1/proposals/${proposalRecord.rows[0].id}/accept`) && response.request().method() === 'POST');
    await passengerPage.getByRole('button', { name: 'Підтвердити домовленість і бронювання' }).click();
    const acceptanceResponse = await proposalAcceptance;
    const acceptance = { status: acceptanceResponse.status(), body: await acceptanceResponse.json() };
    expect(acceptance.status).toBe(201);
    await expect(passengerPage.getByText('Домовленість підтверджено; бронювання створено на сервері.', { exact: true })).toBeVisible();
    const booking = await pool.query<{ status: string; total_price_minor: number }>('SELECT status,total_price_minor FROM bookings WHERE id=$1', [acceptance.body.data.id]);
    expect(booking.rows).toEqual([{ status: 'confirmed', total_price_minor: 30000 }]);
    expect(acceptance.body.data).toMatchObject({ fee_class: 'community', platform_fee_minor: 0, fee_rule_version: 'community-0pct-v1' });
    const route = await pool.query<{ route_version: number; opt_in: boolean; waypoint_count: number }>(
      `SELECT s.route_version,s.opt_in,(SELECT count(*)::int FROM navigation_waypoints w WHERE w.navigation_session_id=s.id) AS waypoint_count
         FROM navigation_sessions s WHERE s.id=$1`, [navigationSessionId],
    );
    expect(route.rows[0]).toMatchObject({ route_version: 3, opt_in: false, waypoint_count: 2 });
    const driverRefreshAfterBooking = driverPage.waitForResponse(response => response.url().endsWith('/api/v1/auth/refresh'));
    await driverPage.reload();
    const refreshedDriverAfterBooking = await driverRefreshAfterBooking;
    expect(refreshedDriverAfterBooking.status()).toBe(200);
    driverAccessToken = (await refreshedDriverAfterBooking.json()).data.accessToken as string;
    await driverPage.getByRole('button', { name: 'Повернутися до активної навігації' }).click();
    const reroutedMap = driverPage.locator('[data-marshgo-map-renderer="maplibre"]');
    await expect(reroutedMap.locator('.maplibregl-canvas')).toBeVisible();
    await expect.poll(async () => Number(await reroutedMap.getAttribute('data-marshgo-route-point-count'))).not.toBe(initialRoutePointCount);
    await expect(driverPage.getByRole('button', { name: 'Розгорнути панель навігації' })).toBeVisible();
    await driverPage.getByRole('button', { name: 'Розгорнути панель навігації' }).click();
    await driverPage.getByRole('button', { name: 'Розгорнути панель повністю' }).click();
    await expect(driverPage.getByRole('switch', { name: 'Пошук попутників уздовж маршруту' })).toHaveAttribute('aria-checked', 'false');
    await driverPage.getByRole('button', { name: 'Відновити навігацію' }).click();
    await expect.poll(async () => pool.query<{ state: string }>(
      'SELECT state FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    ).then(result => result.rows[0]?.state)).toBe('active');
    expect((await passengerPage.evaluate(async token => fetch('/api/v1/bookings', { headers: { Authorization: `Bearer ${token}` } }).then(response => response.json()), passengerToken)).data.some((item: { id: string }) => item.id === acceptance.body.data.id)).toBe(true);

    const insertedRouteResponse = await driverPage.evaluate(async token => fetch('/api/v1/navigation/sessions/active', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async response => ({ status: response.status, body: await response.json() })), driverAccessToken);
    expect(insertedRouteResponse.status, JSON.stringify(insertedRouteResponse.body)).toBe(200);
    const insertedRoute = insertedRouteResponse.body;
    const insertedGeometry = insertedRoute.data.route as Array<[number, number]>;
    const liveLocation = insertedRoute.data.current_location as [number, number] | null;
    expect(insertedGeometry.length).toBeGreaterThan(1);
    expect(liveLocation).toBeTruthy();
    const [routeA, routeB] = insertedGeometry;
    const latitudeRadians = routeA[1] * Math.PI / 180;
    const eastMeters = (routeB[0] - routeA[0]) * 111_320 * Math.cos(latitudeRadians);
    const northMeters = (routeB[1] - routeA[1]) * 111_320;
    const segmentLengthMeters = Math.hypot(eastMeters, northMeters);
    expect(segmentLengthMeters).toBeGreaterThan(0);
    const perpendicularEast = -northMeters / segmentLengthMeters;
    const perpendicularNorth = eastMeters / segmentLengthMeters;
    const routeVersionBeforeDeviation = Number(insertedRoute.data.route_version);
    await driverPage.bringToFront();
    for (let step = 1; step <= 10; step += 1) {
      const offsetMeters = step * 80;
      const target = {
        longitude: liveLocation![0] + perpendicularEast * offsetMeters / (111_320 * Math.cos(latitudeRadians)),
        latitude: liveLocation![1] + perpendicularNorth * offsetMeters / 111_320,
      };
      await driverContext.setGeolocation({ ...target, accuracy: 5 });
      await expect.poll(async () => pool.query<{ longitude: number; latitude: number }>(
        'SELECT ST_X(current_location::geometry) AS longitude,ST_Y(current_location::geometry) AS latitude FROM navigation_sessions WHERE id=$1', [navigationSessionId],
      ).then(result => {
        const current = result.rows[0];
        if (!current) return Number.POSITIVE_INFINITY;
        const dLat = (current.latitude - target.latitude) * Math.PI / 180;
        const dLon = (current.longitude - target.longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(target.latitude * Math.PI / 180) * Math.cos(current.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
        return 6_371_000 * 2 * Math.asin(Math.sqrt(a));
      }), { timeout: 10_000 }).toBeLessThan(20);
      if (step >= 8) {
        await expect.poll(async () => pool.query<{ route_version: number }>(
          'SELECT route_version FROM navigation_sessions WHERE id=$1', [navigationSessionId],
        ).then(result => result.rows[0]?.route_version ?? 0), { timeout: 30_000 }).toBeGreaterThan(routeVersionBeforeDeviation);
        break;
      }
      await driverPage.waitForTimeout(2_000);
    }
    await expect(driverPage.getByText('Маршрут оновлено від останньої підтвердженої GPS-позиції. Пошук попутників призупинено до повторної згоди.')).toBeVisible({ timeout: 30_000 });
    await expect.poll(async () => pool.query<{ route_version: number }>(
      'SELECT route_version FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    ).then(result => result.rows[0]?.route_version ?? 0)).toBeGreaterThan(routeVersionBeforeDeviation);
    await test.info().attach('two-account-navigation-reroute-driver', { body: await driverPage.screenshot({ fullPage: true }), contentType: 'image/png' });

    // A fresh demand later on the updated route must be matched only after the driver opts in again.
    const postReroute = await driverPage.evaluate(async token => fetch('/api/v1/navigation/sessions/active', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => response.json()), driverAccessToken);
    const postRerouteGeometry = postReroute.data.route as Array<[number, number]>;
    const routeVersionBeforeSecondBooking = Number(postReroute.data.route_version);
    expect(postRerouteGeometry.length).toBeGreaterThan(1);
    const postRerouteEnd = postRerouteGeometry[postRerouteGeometry.length - 1];
    const metersBetween = (from: [number, number], to: [number, number]) => {
      const radians = (value: number) => value * Math.PI / 180;
      const latitudeDelta = radians(to[1] - from[1]);
      const longitudeDelta = radians(to[0] - from[0]);
      const latitudeFrom = radians(from[1]);
      const latitudeTo = radians(to[1]);
      const haversine = Math.sin(latitudeDelta / 2) ** 2
        + Math.cos(latitudeFrom) * Math.cos(latitudeTo) * Math.sin(longitudeDelta / 2) ** 2;
      return 6_371_000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    };
    const segmentLengths = postRerouteGeometry.slice(1).map((point, index) => metersBetween(postRerouteGeometry[index], point));
    const targetDistance = segmentLengths.reduce((sum, distance) => sum + distance, 0) * 0.68;
    let distanceBeforeSegment = 0;
    let secondPickup: [number, number] = postRerouteEnd;
    for (let index = 0; index < segmentLengths.length; index += 1) {
      const segmentLength = segmentLengths[index];
      if (targetDistance <= distanceBeforeSegment + segmentLength) {
        const fraction = segmentLength === 0 ? 0 : (targetDistance - distanceBeforeSegment) / segmentLength;
        const start = postRerouteGeometry[index];
        const end = postRerouteGeometry[index + 1];
        secondPickup = [start[0] + (end[0] - start[0]) * fraction, start[1] + (end[1] - start[1]) * fraction];
        break;
      }
      distanceBeforeSegment += segmentLength;
    }
    const secondDropoff = postRerouteEnd;
    const secondDemand = await secondPassengerPage.evaluate(async ({ token, earliest, latest, pickup, dropoff }) => fetch('/api/v1/demands', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        originName: 'E2E Second Rider Pickup', destinationName: 'Львів', origin: pickup, destination: dropoff,
        earliestDeparture: earliest, latestDeparture: latest, passengers: 1, budgetMinor: 24000,
        budgetType: 'total_all', notes: 'Second rider in browser multi-passenger acceptance',
      }),
    }).then(async response => ({ status: response.status, body: await response.json() })), {
      token: secondPassengerToken,
      earliest: new Date(Date.now() + 15 * 60_000).toISOString(),
      latest: new Date(Date.now() + 4 * 60 * 60_000).toISOString(),
      pickup: secondPickup,
      dropoff: secondDropoff,
    });
    expect(secondDemand.status).toBe(201);
    const secondDemandId = secondDemand.body.data.id as string;
    const matchingSwitch = driverPage.getByRole('switch', { name: 'Пошук попутників уздовж маршруту' });
    await expect(matchingSwitch).toHaveAttribute('aria-checked', 'false');
    await matchingSwitch.click();
    await expect(matchingSwitch).toHaveAttribute('aria-checked', 'true');
    const secondCandidateCard = driverPage.locator('article').filter({ hasText: 'E2E Second Rider Pickup' }).first();
    await expect(secondCandidateCard).toBeVisible({ timeout: 20_000 });
    await driverPage.getByRole('button', { name: 'Зупиніться та призупиніть навігацію, щоб відповісти' }).first().click();
    await expect.poll(async () => pool.query<{ state: string }>(
      'SELECT state FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    ).then(result => result.rows[0]?.state)).toBe('paused');
    const secondInterestResponse = driverPage.waitForResponse(response => response.url().match(/\/matches\/[0-9a-f-]+\/interest$/)?.[0] !== undefined);
    await secondCandidateCard.getByRole('button', { name: 'Підтвердити інтерес водія' }).click();
    expect((await secondInterestResponse).status()).toBe(200);

    await openCreateMenu(secondPassengerPage);
    await secondPassengerPage.getByRole('button', { name: /Створити запит/ }).click();
    await secondPassengerPage.getByRole('button', { name: 'Мої заявки' }).click();
    await secondPassengerPage.getByRole('button', { name: 'Оновити', exact: true }).click();
    await expect(secondPassengerPage.getByRole('button', { name: 'Підтвердити взаємний інтерес' })).toBeVisible();
    await secondPassengerPage.getByRole('button', { name: 'Підтвердити взаємний інтерес' }).click();
    await expect(secondPassengerPage.getByRole('status')).toContainText('Взаємний інтерес підтверджено');

    const secondProposalButton = secondCandidateCard.getByRole('button', { name: 'Відкрити заявку та запропонувати ціну' });
    await expect(secondProposalButton).toBeVisible({ timeout: 15_000 });
    await secondProposalButton.click();
    await expect(driverPage.getByLabel('Ціна, грн')).toBeVisible();
    const secondProposalResponse = driverPage.waitForResponse(response => response.url().endsWith(`/api/v1/demands/${secondDemandId}/proposals`) && response.request().method() === 'POST');
    await driverPage.getByRole('button', { name: 'Надіслати пропозицію' }).click();
    expect((await secondProposalResponse).status()).toBe(201);
    await secondPassengerPage.getByTestId(`owned-demand-${secondDemandId}`).click();
    await expect(secondPassengerPage.getByText('Переговори')).toBeVisible();
    const secondBookingResponse = secondPassengerPage.waitForResponse(response => Boolean(response.url().match(/\/api\/v1\/proposals\/[0-9a-f-]+\/accept$/)) && response.request().method() === 'POST');
    await secondPassengerPage.getByRole('button', { name: 'Підтвердити домовленість і бронювання' }).click();
    const secondBookingResult = await secondBookingResponse;
    expect(secondBookingResult.status()).toBe(201);
    const secondBooking = (await secondBookingResult.json()).data as { id: string; offer_id: string; total_price_minor: number };
    const multiPassengerState = await pool.query<{ booking_id: string; ordinal: number; kind: string; occupancy: number }>(
      `WITH ordered AS (
         SELECT booking_id,ordinal,kind,
           sum(CASE kind WHEN 'pickup' THEN 1 WHEN 'dropoff' THEN -1 ELSE 0 END) OVER(ORDER BY ordinal) AS occupancy
         FROM navigation_waypoints WHERE navigation_session_id=$1
       ) SELECT booking_id,ordinal,kind,occupancy FROM ordered ORDER BY ordinal`, [navigationSessionId],
    );
    expect(multiPassengerState.rows).toHaveLength(4);
    expect(new Set(multiPassengerState.rows.map(row => row.booking_id))).toEqual(new Set([acceptance.body.data.id, secondBooking.id]));
    expect(Math.min(...multiPassengerState.rows.map(row => row.occupancy))).toBeGreaterThanOrEqual(0);
    expect(Math.max(...multiPassengerState.rows.map(row => row.occupancy))).toBeLessThanOrEqual(4);
    for (const id of [acceptance.body.data.id, secondBooking.id]) {
      const orderedStops = multiPassengerState.rows.filter(row => row.booking_id === id);
      expect(orderedStops.map(row => row.kind)).toEqual(['pickup', 'dropoff']);
      expect(orderedStops[0].ordinal).toBeLessThan(orderedStops[1].ordinal);
    }
    await expect.poll(async () => pool.query<{ route_version: number; opt_in: boolean }>(
      'SELECT route_version,opt_in FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    ).then(result => result.rows[0])).toMatchObject({ opt_in: false });
    await expect.poll(async () => pool.query<{ route_version: number }>(
      'SELECT route_version FROM navigation_sessions WHERE id=$1', [navigationSessionId],
    ).then(result => result.rows[0]?.route_version ?? 0)).toBeGreaterThan(routeVersionBeforeSecondBooking);
    // The active session remains available while the driver reviews the booking.
    // Return to that session instead of expecting a second /navigation/sessions POST.
    await driverPage.getByRole('button', { name: 'Повернутися до активної навігації' }).click();
    const updatedRouteMap = driverPage.locator('[data-marshgo-map-renderer="maplibre"]');
    await expect(updatedRouteMap.locator('.maplibregl-canvas')).toBeVisible();
    await expect.poll(() => updatedRouteMap.getAttribute('data-marshgo-route-point-count')).toBeTruthy();
    const routeScreenshot = await driverPage.screenshot({ path: '.release/staging-multipassenger-route.png', fullPage: true });
    await test.info().attach('three-account-multi-passenger-route', { body: routeScreenshot, contentType: 'image/png' });
  } finally {
    if (navigationSessionId && driverAccessToken) await driverPage.evaluate(async ({ token, id }) => fetch(`/api/v1/navigation/sessions/${id}/end`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }), { token: driverAccessToken, id: navigationSessionId }).catch(() => undefined);
    await driverContext.close();
    await passengerContext.close();
    await secondPassengerContext.close();
  }
});

test('foreground road route renders on iPhone 15 Pro Max and 16 Pro Max viewports', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  for (const model of ['iPhone 15 Pro Max', 'iPhone 16 Pro Max'] as const) {
    const context = await browser.newContext({
      ...devices[model],
      baseURL,
      timezoneId: 'Europe/Kyiv',
      geolocation: { latitude: 49.2567, longitude: 23.8561, accuracy: 8 },
      permissions: ['geolocation'],
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    const mapExpressionWarnings: string[] = [];
    page.on('console', message => {
      if (/Expected value to be of type boolean, but found null/.test(message.text())) mapExpressionWarnings.push(message.text());
    });
    let sessionId: string | undefined;
    try {
      const phone = model === 'iPhone 15 Pro Max' ? navigationPhone : navigationSecondPhone;
      const accessToken = await signIn(page, 'MARSHGO Driver', phone);
      const roleResponse = await page.evaluate(async (token) => fetch('/api/v1/users/me/roles', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: 'driver' }),
      }).then((response) => response.status), accessToken);
      expect(roleResponse).toBe(200);
      await page.reload();
      const viewport = await page.evaluate(() => ({ width: window.innerWidth, documentWidth: document.documentElement.scrollWidth }));
      expect(viewport.documentWidth).toBeLessThanOrEqual(viewport.width + 1);
      const modelFileName = model.toLowerCase().replaceAll(' ', '-');
      await page.screenshot({ path: `/tmp/marshgo-${modelFileName}-home.png`, fullPage: true });
      for (const [tabLabel, buttonName] of [['Пошук', 'Пошук'], ['Поїздки', 'Поїздки'], ['Профіль', 'Профіль']] as const) {
        await page.getByRole('button', { name: buttonName, exact: true }).click();
        if (tabLabel === 'Профіль') await expect(page.getByText('MARSHGO Driver', { exact: true })).toBeVisible();
        else {
      const expectedHeading = tabLabel === 'Пошук' ? 'Куди їдемо?' : 'Мої поїздки';
      await expect(page.getByRole('heading', { name: expectedHeading, exact: true })).toBeVisible();
        }
        const tabViewport = await page.evaluate(() => ({ width: window.innerWidth, documentWidth: document.documentElement.scrollWidth }));
        expect(tabViewport.documentWidth).toBeLessThanOrEqual(tabViewport.width + 1);
        await page.screenshot({ path: `/tmp/marshgo-${modelFileName}-${tabLabel.toLowerCase()}.png`, fullPage: true });
      }
      await page.getByRole('button', { name: 'Головна', exact: true }).click();
      const tileFixture = 'http://127.0.0.1:3306';
      // Fail real tiles during source creation, rather than hoping a later camera move evicts cached coverage.
      await page.request.get(`${tileFixture}/__test/mode?value=mixed`);
      const response = await startNavigationFromHome(page);
      expect(response.status()).toBe(201);
      sessionId = (await response.json()).data.id as string;
      const destinationRoutePromise = page.waitForResponse((response) =>
        response.url().endsWith(`/api/v1/navigation/sessions/${sessionId}/destination`) && response.request().method() === 'PUT',
      );
      await page.getByRole('textbox', { name: 'Куди їдемо?' }).fill('Львів');
      await page.getByRole('button', { name: 'Знайти місце', exact: true }).click();
      await page.getByRole('button', { name: /Львів, Львівська область, Україна/ }).click();
      const destinationRouteResponse = await destinationRoutePromise;
      expect(destinationRouteResponse.status(), await destinationRouteResponse.text()).toBe(200);
      const destinationRouteBody = (await destinationRouteResponse.json()).data as { id: string; route: Array<[number, number]> };
      expect(destinationRouteBody.id).toBe(sessionId);
      const activeRoute = destinationRouteBody.route;
      expect(activeRoute.length).toBeGreaterThan(1);

      await expect(page.getByTestId('navigation-guidance')).toBeVisible();
      await expect(page.getByTestId('navigation-live-progress')).toContainText(/\d+(?:[,.]\d+)? км/);
      const routeMap = page.locator('[data-marshgo-map-renderer="maplibre"]');
      await expect(routeMap.locator('.maplibregl-canvas')).toBeVisible();
      await expect(routeMap).toHaveAttribute('data-marshgo-map-ready', 'true');
      await expect.poll(async () => Number(await routeMap.getAttribute('data-marshgo-route-point-count'))).toBeGreaterThan(1);
      expect(mapExpressionWarnings, 'MapLibre route paint expressions must tolerate route features without selection metadata').toEqual([]);
      await expect(page.getByText('Стиль і підкладка MARSHGO не налаштовані. Геометрія реального маршруту залишається доступною.')).toHaveCount(0);
      await expect.poll(async () => page.request.get(`${tileFixture}/__test/stats`).then(response => response.json()).then(stats => stats.failed))
        .toBeGreaterThan(0);
      await expect(page.getByRole('alert')).toContainText('Карта завантажилася частково.');

      await page.request.get(`${tileFixture}/__test/mode?value=success`);
      await page.getByRole('button', { name: 'Повторити завантаження карти' }).click();
      await expect(page.getByRole('alert')).toHaveCount(0);

      await expect(routeMap.locator('.maplibregl-canvas')).toBeVisible();
      await expect.poll(async () => Number(await routeMap.getAttribute('data-marshgo-route-point-count'))).toBeGreaterThan(1);
      await expect(page.getByRole('button', { name: 'Розгорнути панель навігації' })).toBeVisible();
      await expect(page.locator('section[aria-label="Панель навігації"]')).toHaveCount(0);
      await expect(page.getByRole('navigation', { name: 'Основна навігація' })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Основна навігація' }).getByRole('button', { name: 'Створити поїздку або запит', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Шари карти' })).toBeVisible();
      const perspectiveControl = page.getByRole('button', { name: /(?:Увімкнути|Вимкнути) 3D-перспективу/ });
      await expect(perspectiveControl).toBeVisible();
      const initial3dState = await perspectiveControl.getAttribute('aria-pressed');
      await perspectiveControl.click();
      await expect(perspectiveControl).toHaveAttribute('aria-pressed', initial3dState === 'true' ? 'false' : 'true');
      await perspectiveControl.click();
      await expect(perspectiveControl).toHaveAttribute('aria-pressed', initial3dState!);
      const navigationSheet = page.locator('section[aria-label="Панель навігації"]');
      await page.getByRole('button', { name: 'Розгорнути панель навігації' }).click();
      await expect(navigationSheet).toContainText(/GPS пауза|На маршруті|Поза маршрутом|Перевірка GPS/);
      await expect(page.getByRole('button', { name: 'Шари карти' })).toBeVisible();
      await navigationSheet.getByRole('button', { name: 'Розгорнути панель повністю' }).click();
      await expect(navigationSheet.getByRole('button', { name: 'Завершити навігацію' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Завершити навігацію' })).toHaveCount(1);
      await test.info().attach(`${model.replaceAll(' ', '-')}-navigation-map`, {
        body: await page.screenshot({ fullPage: true }), contentType: 'image/png',
      });
      await page.screenshot({ path: `/tmp/marshgo-${modelFileName}-route.png`, fullPage: true });

      await navigationSheet.getByRole('button', { name: 'Завершити навігацію' }).click();
      await expect(page.getByText('Навігацію завершено. Точну геолокацію видалено із сервера.')).toBeVisible();
      const ended = await pool.query<{ state: string; route: unknown; current_location: unknown }>(
        'SELECT state,route,current_location FROM navigation_sessions WHERE id=$1', [sessionId],
      );
    expect(ended.rows).toEqual([{ state: 'ended', route: null, current_location: null }]);
      sessionId = undefined;
    } finally {
      if (sessionId) await page.request.post(`/api/v1/navigation/sessions/${sessionId}/end`).catch(() => undefined);
      await context.close();
    }
  }
});

test('navigation recovers from denied GPS permission with a localized retry message', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  await context.grantPermissions([], { origin: baseURL! });
  const page = await context.newPage();
  try {
    const accessToken = await signIn(page, 'GPS Denied Driver', gpsDeniedPhone);
    const roleStatus = await page.evaluate(async (token) => fetch('/api/v1/users/me/roles', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: 'driver' }),
    }).then((response) => response.status), accessToken);
    expect(roleStatus).toBe(200);
    await page.reload();
    let navigationCreateRequests = 0;
    page.on('request', (request) => {
      if (request.url().endsWith('/api/v1/navigation/sessions') && request.method() === 'POST') navigationCreateRequests += 1;
    });
    await page.getByRole('button', { name: /^Навігація Побудувати маршрут/ }).click();
    await expect(page.getByRole('status')).toContainText(/Дозвольте MARSHGO доступ до геолокації/);
    await page.getByRole('button', { name: 'Почати без пункту призначення', exact: true }).click();

    await expect(page.getByText(/Дозвольте MARSHGO доступ до геолокації/)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('GPS_UNAVAILABLE')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Почати без пункту призначення', exact: true })).toBeEnabled();
    expect(navigationCreateRequests).toBe(0);
  } finally {
    await context.close().catch(() => undefined);
  }
});



test('route search URL restores geocoded criteria after direct reload', async ({ browser, baseURL }, testInfo) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const page = await context.newPage();
  try {
    await signIn(page, 'Search Restore Passenger', searchRestorePhone);
    await openSearchTab(page);
    await chooseRoutePlace(page, 'origin', 'Стрий', /Стрий, Львівська область, Україна/);
    await chooseRoutePlace(page, 'destination', 'Львів', /Львів, Львівська область, Україна/);
    await setTomorrowAtEightOnTimeWheel(page);
    const searchResponse = page.waitForResponse(response => response.url().endsWith('/api/v1/journeys/search') && response.request().method() === 'POST', { timeout: 60_000 });
    await page.getByRole('button', { name: /^Знайти маршрут/ }).click();
    const initialSearch = await searchResponse;
    expect(initialSearch.status(), await initialSearch.text()).toBe(200);
    const initialPayload = (await initialSearch.json()).data as {
      journeys: Array<{ id: string }>;
      candidateGenerationTruncated?: boolean;
      partial?: boolean;
    };
    await expect(page).toHaveURL(/\/journeys\/search\?mode=planner&/);
    await expect.poll(() => page.evaluate(() => new URLSearchParams(window.location.search).get('origin')))
      .toBe('Стрий, Львівська область, Україна');
    await expect.poll(() => page.evaluate(() => new URLSearchParams(window.location.search).get('destination')))
      .toBe('Львів, Львівська область, Україна');
    expect(initialPayload.journeys.length).toBeGreaterThan(0);
    const plan = page.getByRole('region', { name: 'Результати мультимодального пошуку' });
    await expect(plan).toBeVisible();
    const truncationNotice = plan.getByRole('status').filter({ hasText: 'не охопив усі можливі варіанти' }).first();
    if (initialPayload.partial || initialPayload.candidateGenerationTruncated) {
      await expect(truncationNotice).toBeVisible();
    } else {
      await expect(truncationNotice).toHaveCount(0);
    }
    await expect(plan.getByTestId('journey-result-card').first()).toBeVisible();

    await page.reload();
    // The canonical URL restores geocoded criteria. Fresh route results are
    // requested again so the page never presents stale availability.
    const restoredResults = page.getByRole('region', { name: 'Результати мультимодального пошуку' });
    await expect(page.getByText('Параметри маршруту відновлено')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Знайти маршрут', exact: true })).toBeVisible();
    const refreshedSearch = page.waitForResponse(response => response.url().endsWith('/api/v1/journeys/search') && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'Знайти маршрут', exact: true }).click();
    const refreshedResponse = await refreshedSearch;
    expect(refreshedResponse.status(), await refreshedResponse.text()).toBe(200);
    await expect(restoredResults).toBeVisible();
    await expect(page.locator('.journey-results-header')).toContainText('Стрий, Львівська область, Україна → Львів, Львівська область, Україна');
    await expect(page.getByTestId('journey-result-card').first()).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('search-url-restored.png'), fullPage: true });
    await page.getByRole('button', { name: 'Назад до пошуку', exact: true }).click();
    await expect(page.getByPlaceholder(/Місто відправлення|Моє місцеперебування/)).toHaveValue('Стрий, Львівська область, Україна');
    await expect(page.getByPlaceholder(/Місто призначення|Введіть адресу, місто або зупинку/)).toHaveValue('Львів, Львівська область, Україна');
  } finally {
    await context.close().catch(() => undefined);
  }
});

test('Journey Planner clearly warns when candidate generation was truncated', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const page = await context.newPage();
  try {
    await signIn(page, 'Partial Search Passenger', partialSearchPhone);
    await openSearchTab(page);
    await chooseRoutePlace(page, 'origin', 'Стрий', /Стрий, Львівська область, Україна/);
    await chooseRoutePlace(page, 'destination', 'Львів', /Львів, Львівська область, Україна/);
    await setTomorrowAtEightOnTimeWheel(page);

    // Keep the real server response and journey data, changing only the
    // completeness metadata to verify the production warning contract.
    await page.route('**/api/v1/journeys/search', async route => {
      const response = await route.fetch();
      const payload = await response.json() as { data: Record<string, unknown> };
      payload.data.partial = true;
      payload.data.candidateGenerationTruncated = true;
      payload.data.partialReasons = ['candidate_generation_truncated'];
      await route.fulfill({ response, json: payload });
    });

    const searchResponse = page.waitForResponse(response => response.url().endsWith('/api/v1/journeys/search') && response.request().method() === 'POST', { timeout: 60_000 });
    await page.getByRole('button', { name: /^Знайти маршрут/ }).click();
    expect((await searchResponse).status()).toBe(200);
    const results = page.getByRole('region', { name: 'Результати мультимодального пошуку' });
    await expect(results).toBeVisible();
    const incompleteSearchWarning = results.getByRole('status').filter({ hasText: 'не охопив усі можливі варіанти' }).first();
    await expect(incompleteSearchWarning).toBeVisible();
    await expect(incompleteSearchWarning).toContainText('частині джерел');
  } finally {
    await context.close().catch(() => undefined);
  }
});

test('Journey Planner preserves priced Community offers and consistent strategy metadata', async ({ browser, baseURL }) => {
  expect(baseURL).toBeTruthy();
  const context = await browser.newContext({ baseURL, timezoneId: 'Europe/Kyiv' });
  const page = await context.newPage();
  try {
    const accessToken = await signIn(page, 'Journey Passenger', journeyPassengerPhone);
    await openSearchTab(page);
    await chooseRoutePlace(page, 'origin', 'Стрий', /Стрий, Львівська область, Україна/);
    await chooseRoutePlace(page, 'destination', 'Львів', /Львів, Львівська область, Україна/);
    await setTomorrowAtEightOnTimeWheel(page);
    // Capture failures too; filtering for HTTP 200 here turns an API error into
    // a misleading three-minute browser timeout with no response diagnostics.
    const searchResponse = page.waitForResponse(response => response.url().endsWith('/api/v1/journeys/search') && response.request().method() === 'POST', { timeout: 60_000 });
    await page.getByRole('button', { name: /^Знайти маршрут/ }).click();
    const response = await searchResponse;
    expect(response.status(), await response.text()).toBe(200);
    const payload = (await response.json()).data as {
      journeys: Array<{
        id: string;
        strategy: string;
        offerId: string;
        source?: string;
        recommendedStrategies?: string[];
        strategyRanks?: Record<string, number>;
        legs?: Array<{ driver?: { averageRating: unknown } }>;
      }>;
      partial: boolean;
      providerErrors: string[];
      availableStrategies: string[];
      unsupportedPreferences: string[];
    };
    expect(typeof payload.partial).toBe('boolean');
    const communityJourney = payload.journeys.find(item => item.offerId === offerId);
    expect(communityJourney).toBeDefined();
    if (!communityJourney) throw new Error('The persisted Community offer was missing from the journey results.');
    const cheapestAvailable = payload.availableStrategies.includes('CHEAPEST');
    const cheapestResults = payload.journeys.filter(item => item.recommendedStrategies?.includes('CHEAPEST')
      || typeof item.strategyRanks?.CHEAPEST === 'number');
    expect(cheapestResults.length > 0).toBe(cheapestAvailable);
    if (!cheapestAvailable) await expect(page.getByRole('button', { name: /^Найдешевший/ })).toBeDisabled();
    const journeyDriverRating = payload.journeys.find(item => item.offerId === offerId)?.legs?.[0]?.driver?.averageRating;
    expect(journeyDriverRating === null || typeof journeyDriverRating === 'number').toBe(true);
    await expect(page.getByRole('region', { name: 'Результати мультимодального пошуку' })).toBeVisible();
    const journeyResults = page.getByRole('region', { name: 'Результати мультимодального пошуку' }).getByTestId('journey-result-card');
    await expect(journeyResults).toHaveCount(payload.journeys.length);
    await page.screenshot({ path: '/tmp/marshgo-search-results-list.png' });
    const communityResult = page.locator(`[data-journey-id="${communityJourney.id}"]`);
    await expect(communityResult).toContainText('Попутка');
    await expect(communityResult).toBeVisible();
    const saved = await pool.query<{ owner_id: string; offer_id: string; journey_leg_id: string }>(
      `SELECT j.user_id AS owner_id,l.offer_id,l.id AS journey_leg_id FROM journeys j JOIN journey_legs l ON l.journey_id=j.id WHERE j.id=$1`, [communityJourney.id],
    );
    const profile = await page.evaluate(async token => fetch('/api/v1/users/me', { headers: { Authorization: `Bearer ${token}` } }).then(response => response.json()), accessToken);
    expect(saved.rows).toHaveLength(1);
    expect(saved.rows[0]).toMatchObject({ owner_id: profile.data.id, offer_id: offerId });

    // Open the canonical route view first, then book from the specific
    // Community leg so the selected Journey and leg stay linked to the offer.
    await communityResult.click();
    await expect(page.getByTestId('route-bottom-sheet')).toBeVisible();
    await expect(page.getByRole('main', { name: 'Побудований маршрут' })).toBeVisible();
    await page.getByRole('button', { name: /^Забронювати$/ }).click();
    await expect(page.getByText('Деталі поїздки', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Стрий → Львів' })).toBeVisible();
    await expect(page.getByText('Фото авто не додано')).toBeVisible();
    await page.screenshot({ path: '/tmp/marshgo-offer-detail-mobile.png', fullPage: true });
    await expect(page.getByRole('button', { name: /Забронювати місце/ })).toBeVisible();
    const linkedBookingResponse = page.waitForResponse(response => response.url().endsWith('/api/v1/bookings') && response.request().method() === 'POST');
    await page.getByRole('button', { name: /Забронювати місце/ }).click();
    const linkedBookingHttp = await linkedBookingResponse;
    expect(linkedBookingHttp.status()).toBe(201);
    const linkedBooking = await linkedBookingHttp.json() as { data: { id: string } };
    // Booking confirmation navigates to Trips immediately; verify its durable
    // UI state and database snapshot below instead of a transient toast that
    // may disappear while the booking and Journey refreshes complete.
    await expect(page.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
    await expect(page.getByText('Маршрут готовий')).toBeVisible();
    const linked = await pool.query<{ id: string; state: string; confirmed_price_minor: number; leg_state: string; price_status: string; booking_id: string }>(
      `SELECT j.id,j.state,j.confirmed_price_minor,l.state AS leg_state,l.price_status,l.booking_id
         FROM journeys j JOIN journey_legs l ON l.journey_id=j.id WHERE j.user_id=(SELECT id FROM users WHERE phone_e164=$1)`, [journeyPassengerPhone],
    );
    const bookedJourney = linked.rows.filter(row => row.state === 'READY' && row.booking_id === linkedBooking.data.id);
    expect(bookedJourney).toHaveLength(1);
    expect(bookedJourney[0]).toMatchObject({ id: communityJourney.id, state: 'READY', confirmed_price_minor: 15000, leg_state: 'CONFIRMED', price_status: 'LOCKED' });

    await expect(page.getByRole('button', { name: 'Скасувати', exact: true })).toBeVisible();
    const cancelResponse = page.waitForResponse(response => response.url().endsWith(`/api/v1/bookings/${linkedBooking.data.id}/cancel`));
    await page.getByRole('button', { name: 'Скасувати', exact: true }).click();
    const cancellationDialog = page.getByRole('alertdialog', { name: 'Скасувати бронювання?' });
    await expect(cancellationDialog).toBeVisible();
    await cancellationDialog.getByRole('button', { name: 'Так, скасувати' }).click();
    expect((await cancelResponse).status()).toBe(200);
    await expect(page.getByText('Потрібне перепланування')).toBeVisible();
    await expect(page.getByText('Ціна оновиться після перепланування')).toBeVisible();
    const replanned = await pool.query<{ state: string; total_price_minor: number | null; confirmed_price_minor: number | null }>(
      `SELECT state,total_price_minor,confirmed_price_minor FROM journeys WHERE id=$1`, [communityJourney.id],
    );
    expect(replanned.rows).toEqual([{ state: 'REPLANNING', total_price_minor: null, confirmed_price_minor: null }]);
  } finally {
    await context.close().catch(() => undefined);
  }
});
