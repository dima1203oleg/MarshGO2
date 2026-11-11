import { expect, type Page } from '@playwright/test';

export async function signInWithEmailPassword(page: Page, displayName = 'E2E Tester'): Promise<{ id: string; email: string; name: string }> {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  const testEmail = `e2e.test.${timestamp}.${random}@marshgo.ua`;
  const testPassword = 'Password2026!';

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // This helper registers a new identity; an existing session cannot stand in for it.
  expect(await page.locator('.production-app').isVisible(), 'Registration requires a fresh browser context without an authenticated session').toBe(false);

  // 1. Splash screen: click "У мене вже є акаунт" or start
  const welcomeLogin = page.locator('button:has-text("У мене вже є акаунт")');
  if (await welcomeLogin.isVisible().catch(() => false)) {
    await welcomeLogin.click();
    await page.waitForTimeout(300);
  }

  // 2. Tab switch: switch to "Реєстрація"
  const registerTab = page.locator('button:has-text("Реєстрація")');
  await expect(registerTab).toBeVisible({ timeout: 10_000 });
  await registerTab.click();
  await page.waitForTimeout(300);

  // 3. Fill registration inputs
  const nameInput = page.locator('input[autocomplete="name"], input[placeholder*="ім’я"], input[placeholder*="імя"]').first();
  await expect(nameInput).toBeVisible({ timeout: 5_000 });
  await nameInput.fill(displayName);

  const emailInput = page.locator('input[autocomplete="email"], input[type="email"]').first();
  await emailInput.fill(testEmail);

  const passwordInput = page.locator('input[autocomplete="new-password"], input[placeholder*="Пароль"]').first();
  await passwordInput.fill(testPassword);

  // 4. Submit registration
  const submitBtn = page.locator('button:has-text("Зареєструватися")');
  const registrationResponse = page.waitForResponse(response =>
    new URL(response.url()).pathname === '/api/v1/auth/register'
    && response.request().method() === 'POST',
  );
  // Observe the response before clicking so a fast response cannot be missed.
  const [response] = await Promise.all([registrationResponse, submitBtn.click()]);
  expect(response.status(), 'A new registration must be accepted by the API').toBe(201);
  const body = await response.json();
  const user = body?.data?.user;
  expect(user?.id, 'The API must return the persisted user identity').toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  expect(user?.email, 'Registration must authenticate the requested account').toBe(testEmail);
  expect(user?.display_name).toBe(displayName.trim());
  expect(typeof body?.data?.accessToken).toBe('string');
  expect(body.data.accessToken.length, 'Registration must issue a nonempty session token').toBeGreaterThan(0);

  // 5. Verify successful login into app shell
  await expect(page.locator('.production-app')).toBeVisible({ timeout: 15_000 });

  return { id: user.id, email: user.email, name: user.display_name };
}
