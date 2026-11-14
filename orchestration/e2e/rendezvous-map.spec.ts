import { expect, test } from '@playwright/test';
import { requestDevelopmentOtp } from './support/developmentOtp';

test('confirmed carpool rendezvous displays consented locations and routed approach distance', async ({ page }) => {
  page.setDefaultTimeout(15_000);
  const bookingId = 'e2e-rendezvous-booking';
  const rendezvousId = 'e2e-rendezvous-session';
  const booking = {
    id: bookingId, offer_id: 'e2e-rendezvous-offer', seat_count: 1,
    total_price_minor: 0, currency: 'UAH', fee_class: 'community',
    platform_fee_minor: 0, fee_rule_version: 'e2e', status: 'confirmed',
    origin_name: 'Київ, Лівий берег', destination_name: 'Київ, Поділ',
    departure_at: new Date(Date.now() + 15 * 60_000).toISOString(), driver_name: 'Test Driver', passenger_name: 'Test Passenger',
    current_user_is_driver: false, completion_confirmation_count: 0,
    current_user_confirmed_completion: false, current_user_has_review: false,
  };
  const rendezvous = {
    id: rendezvousId, bookingId, journeyLegId: null, state: 'ACTIVE',
    pickup: { label: 'Поштова площа', coordinates: [30.5262812, 50.4592213] },
    plannedPickupAt: new Date(Date.now() + 15 * 60_000).toISOString(), predictedPickupAt: null,
    activationAt: new Date(Date.now() - 60_000).toISOString(), locationSharingEnabled: true,
    driverArrivedAt: null, passengerArrivedAt: null, currentParticipant: 'passenger',
    currentParticipantConsent: true, otherParticipantConsent: true,
    locations: {
      driver: { coordinates: [30.51, 50.44], accuracyMeters: 12, capturedAt: new Date().toISOString(), freshness: 'LIVE' },
      passenger: { coordinates: [30.50, 50.43], accuracyMeters: 20, capturedAt: new Date().toISOString(), freshness: 'LIVE' },
    },
  };

  await page.context().grantPermissions(['geolocation']);
  await page.context().setGeolocation({ latitude: 50.43, longitude: 30.50, accuracy: 10 });
  await page.route(url => new URL(url).pathname === '/api/v1/bookings', route => route.request().method() === 'GET'
    ? route.fulfill({ json: { data: [booking] } })
    : route.continue());
  await page.route(url => new URL(url).pathname === `/api/v1/bookings/${bookingId}/rendezvous`, route => route.request().method() === 'GET'
    ? route.fulfill({ json: { data: rendezvous } })
    : route.continue());
  await page.route(url => new URL(url).pathname === `/api/v1/rendezvous/${rendezvousId}/approaches`, route => route.request().method() === 'GET'
    ? route.fulfill({ json: { data: {
      rendezvousId, pickup: rendezvous.pickup,
      driver: { location: rendezvous.locations.driver, approach: { status: 'ROUTED', geometry: [[30.51, 50.44], [30.5262812, 50.4592213]], distanceMeters: 2800, durationSeconds: 420 } },
      passenger: { location: rendezvous.locations.passenger, approach: { status: 'ROUTED', geometry: [[30.50, 50.43], [30.5262812, 50.4592213]], distanceMeters: 4100, durationSeconds: 1100 } },
      updatedAt: new Date().toISOString(),
    } } })
    : route.continue());
  await page.route(url => new URL(url).pathname === `/api/v1/rendezvous/${rendezvousId}/location`, route => route.request().method() === 'POST'
    ? route.fulfill({ json: { data: { rendezvousId, storedEphemerally: true, expiresInSeconds: 90, nearPickup: false, arrivalRequiresUserConfirmation: true } } })
    : route.continue());
  let reportedMeetingAction: string | undefined;
  await page.route(url => new URL(url).pathname === `/api/v1/rendezvous/${rendezvousId}/status`, async route => {
    reportedMeetingAction = (route.request().postDataJSON() as { action?: string }).action;
    await route.fulfill({ json: { data: { id: rendezvousId, state: reportedMeetingAction === 'arrived' ? 'DRIVER_WAITING' : 'DRIVER_APPROACHING', locationSharingEnabled: true } } });
  });

  await page.goto('/');
  const loginHeading = page.getByRole('heading', { name: 'Вхід за номером телефону' });
  const welcome = page.getByRole('button', { name: /У мене вже є акаунт/i });
  await expect(loginHeading.or(welcome).first()).toBeVisible({ timeout: 15_000 });
  if (await welcome.isVisible()) await welcome.click();
  await expect(loginHeading).toBeVisible({ timeout: 15_000 });
  await page.getByPlaceholder('Ваше ім’я').fill('Rendezvous UI Test');
  await page.getByPlaceholder('+380 номер телефону').fill(`+38092${String(Date.now()).slice(-7)}`);
  const otp = await requestDevelopmentOtp(page);
  await page.locator('input[autocomplete="one-time-code"]').fill(otp);
  await Promise.all([
    page.waitForResponse(response => response.url().endsWith('/api/v1/auth/otp/verify') && response.status() === 200),
    page.getByRole('button', { name: 'Підтвердити номер' }).click(),
  ]);
  await expect(page.locator('.production-app')).toBeVisible();
  await page.getByRole('navigation', { name: 'Основна навігація' }).getByRole('button', { name: 'Поїздки', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Мої поїздки' })).toBeVisible();
  // The production card action loads the confirmed session and opens its live
  // map inline on the current Trips screen.
  await page.getByRole('button', { name: 'Відкрити зустріч' }).click();

  const meetingMap = page.getByTestId('rendezvous-location-map');
  await expect(meetingMap).toBeVisible();
  const map = meetingMap.getByRole('group', { name: 'Карта точки зустрічі' }).getByRole('img', { name: 'Карта маршруту MARSHGO' });
  await expect(map).toBeVisible({ timeout: 20_000 });
  await expect(meetingMap).toContainText('Точка посадки');
  await expect(map).toHaveAttribute('data-marshgo-route-segment-count', '2');
  // Two routed approaches each contribute two geometry points to the map.
  await expect(map).toHaveAttribute('data-marshgo-route-point-count', '4');
  await expect(meetingMap).toContainText('Ви (пасажир) · наживо');
  await expect(meetingMap).toContainText('Водій · наживо');
  await expect(meetingMap.getByTestId('meeting-driver-card')).toContainText('~7 хв');
  await expect(meetingMap.getByTestId('meeting-driver-card')).toContainText('2,8 км');
  await expect(meetingMap.getByTestId('meeting-passenger-card')).toContainText('~18 хв');
  await expect(meetingMap.getByTestId('meeting-passenger-card')).toContainText('4,1 км');
  await meetingMap.screenshot({ path: '/tmp/marshgo-rendezvous-map.png' });

  await meetingMap.getByRole('button', { name: 'Розгорнути карту зустрічі' }).click();
  // The participant expands the pickup preview to a full-screen rendezvous map.
  await expect(meetingMap).toHaveCSS('position', 'fixed');
  await expect(meetingMap).toHaveCSS('z-index', '100');
  const bottomCenter = await meetingMap.evaluate((element) => {
    const hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 20);
    return Boolean(hit && element.contains(hit));
  });
  expect(bottomCenter, 'the full-screen meeting map must cover the global bottom navigation').toBe(true);
  await meetingMap.screenshot({ path: '/tmp/marshgo-rendezvous-map-fullscreen.png' });
  await meetingMap.getByRole('button', { name: 'Я на місці' }).click();
  await expect.poll(() => reportedMeetingAction).toBe('arrived');
});

test('rendezvous UI waits for the other participant consent and supports revocation', async ({ page }) => {
  page.setDefaultTimeout(15_000);
  const bookingId = 'e2e-rendezvous-consent-booking';
  const rendezvousId = 'e2e-rendezvous-consent-session';
  const booking = {
    id: bookingId, offer_id: 'e2e-rendezvous-consent-offer', seat_count: 1,
    total_price_minor: 0, currency: 'UAH', fee_class: 'community',
    platform_fee_minor: 0, fee_rule_version: 'e2e', status: 'confirmed',
    origin_name: 'Київ, Лівий берег', destination_name: 'Київ, Поділ',
    departure_at: new Date(Date.now() + 15 * 60_000).toISOString(), driver_name: 'Test Driver', passenger_name: 'Test Passenger',
    current_user_is_driver: false, completion_confirmation_count: 0,
    current_user_confirmed_completion: false, current_user_has_review: false,
  };
  let currentConsent = false;
  const rendezvous = {
    id: rendezvousId, bookingId, journeyLegId: null, state: 'ACTIVE',
    pickup: { label: 'Поштова площа', coordinates: [30.5262812, 50.4592213] },
    plannedPickupAt: new Date(Date.now() + 15 * 60_000).toISOString(), predictedPickupAt: null,
    activationAt: new Date(Date.now() - 60_000).toISOString(), locationSharingEnabled: false,
    driverArrivedAt: null, passengerArrivedAt: null, currentParticipant: 'passenger',
    currentParticipantConsent: currentConsent, otherParticipantConsent: false,
    locations: { driver: null, passenger: null },
  };

  await page.route(url => new URL(url).pathname === '/api/v1/bookings', route => route.request().method() === 'GET'
    ? route.fulfill({ json: { data: [booking] } })
    : route.continue());
  await page.route(url => new URL(url).pathname === `/api/v1/bookings/${bookingId}/rendezvous`, route => route.request().method() === 'GET'
    ? route.fulfill({ json: { data: { ...rendezvous, currentParticipantConsent: currentConsent } } })
    : route.continue());
  await page.route(url => new URL(url).pathname === `/api/v1/rendezvous/${rendezvousId}/consent`, async route => {
    const body = route.request().postDataJSON() as { enabled?: boolean };
    currentConsent = body.enabled === true;
    await route.fulfill({ json: { data: { ...rendezvous, currentParticipantConsent: currentConsent } } });
  });

  await page.goto('/');
  const loginHeading = page.getByRole('heading', { name: 'Вхід за номером телефону' });
  const welcome = page.getByRole('button', { name: /У мене вже є акаунт/i });
  await expect(loginHeading.or(welcome).first()).toBeVisible({ timeout: 15_000 });
  if (await welcome.isVisible()) await welcome.click();
  await expect(loginHeading).toBeVisible({ timeout: 15_000 });
  await page.getByPlaceholder('Ваше ім’я').fill('Rendezvous Consent UI Test');
  await page.getByPlaceholder('+380 номер телефону').fill(`+38093${String(Date.now()).slice(-7)}`);
  const otp = await requestDevelopmentOtp(page);
  await page.locator('input[autocomplete="one-time-code"]').fill(otp);
  await Promise.all([
    page.waitForResponse(response => response.url().endsWith('/api/v1/auth/otp/verify') && response.status() === 200),
    page.getByRole('button', { name: 'Підтвердити номер' }).click(),
  ]);
  await expect(page.locator('.production-app')).toBeVisible();
  await page.getByRole('navigation', { name: 'Основна навігація' }).getByRole('button', { name: 'Поїздки', exact: true }).click();
  await page.getByRole('button', { name: 'Відкрити зустріч' }).click();
  const consentButton = page.getByRole('button', { name: 'Дозволити короткочасний обмін GPS' });
  await expect(consentButton).toBeVisible();
  // The planned pickup map can be opened before mutual consent, but neither
  // private GPS position nor either approach route is rendered until then.
  const meetingMap = page.getByTestId('rendezvous-location-map');
  await expect(meetingMap).toBeVisible();
  const map = meetingMap.getByRole('group', { name: 'Карта точки зустрічі' }).getByRole('img', { name: 'Карта маршруту MARSHGO' });
  await expect(map).toBeVisible();
  await expect(map).toHaveAttribute('data-marshgo-route-segment-count', '0');
  // Before mutual consent there is no approach route geometry or private marker.
  await expect(map).toHaveAttribute('data-marshgo-route-point-count', '0');
  await expect(meetingMap).toContainText('Точка посадки');
  await expect(meetingMap).toContainText('Ви · очікуємо GPS');
  await expect(meetingMap).toContainText('Учасник · очікуємо GPS');
  await expect(page.getByTestId('meeting-driver')).toHaveCount(0);
  await expect(page.getByTestId('meeting-passenger')).toHaveCount(0);

  await consentButton.click();
  await expect(page.getByText('Вашу згоду збережено. Очікуємо окрему згоду другого учасника.')).toBeVisible();
  await expect(map).toHaveAttribute('data-marshgo-route-segment-count', '0');
  await expect(page.getByTestId('meeting-driver')).toHaveCount(0);
  await expect(page.getByTestId('meeting-passenger')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Скасувати мою згоду' })).toBeVisible();

  await page.getByRole('button', { name: 'Скасувати мою згоду' }).click();
  await expect(page.getByText('Обмін GPS зупинено; точку місця очищено.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Дозволити короткочасний обмін GPS' })).toBeVisible();
});
