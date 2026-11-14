import { expect, type Page } from '@playwright/test';

let nextTestNetworkOctet = 1;

/** Read the OTP only from the loopback E2E API response, never from user-visible UI. */
export async function requestDevelopmentOtp(page: Page): Promise<string> {
  // A full suite creates many independent test users in a few minutes from
  // one loopback address. Give each OTP request a reserved documentation IP;
  // the API trusts exactly one proxy hop only in this isolated E2E server.
  // This keeps the production per-network OTP limit and its behavior intact.
  const sourceIp = `192.0.2.${nextTestNetworkOctet}`;
  nextTestNetworkOctet = nextTestNetworkOctet >= 254 ? 1 : nextTestNetworkOctet + 1;
  // Scope the proxy header to the OTP API only. Setting it on the whole page
  // makes cross-origin map requests preflight and breaks the local tile fixture.
  const otpRoute = '**/api/v1/auth/otp/request';
  await page.route(otpRoute, async (route) => {
    const headers = { ...route.request().headers(), 'x-forwarded-for': sourceIp };
    await route.continue({ headers });
  });
  const responsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.hostname === '127.0.0.1'
      && url.port === '3300'
      && url.pathname === '/api/v1/auth/otp/request'
      && response.request().method() === 'POST';
  }, { timeout: 10_000 });
  await page.getByRole('button', { name: 'Почати', exact: true }).click();
  const response = await responsePromise;
  await page.unroute(otpRoute);
  expect(response.status(), 'OTP must come from the isolated local E2E API').toBe(200);
  const payload = await response.json() as {
    data?: { developmentCode?: string };
    developmentCode?: string;
  };
  const code = payload.data?.developmentCode ?? payload.developmentCode;
  expect(code, 'the isolated E2E API should return its development OTP').toMatch(/^\d{6}$/);
  return code as string;
}
