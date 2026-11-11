import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Page } from '@playwright/test';
import { signInWithEmailPassword } from '../e2e/support/authHelper';

test('email registration helper rejects an existing session instead of inventing a new account identity', async () => {
  let registrationWaits = 0;
  const page = {
    goto: async () => undefined,
    waitForLoadState: async () => undefined,
    locator: (selector: string) => {
      assert.equal(selector, '.production-app');
      return { isVisible: async () => true };
    },
    waitForResponse: () => { registrationWaits += 1; throw new Error('No registration should be attempted'); },
  } as unknown as Page;

  await assert.rejects(signInWithEmailPassword(page, 'Intended Passenger'), /fresh browser context/);
  assert.equal(registrationWaits, 0);
});
