import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

test('uses the canonical MARSHGO navy palette', () => {
  for (const token of [
    '--mg-canvas:#0B0F14',
    '--mg-surface-primary:#111820',
    '--mg-surface-secondary:#16202B',
    '--mg-ink-primary:#F5F9FF',
    '--mg-ink-secondary:#B6C2D0',
    '--mg-blue:#1687FF',
    '--mg-action:#0B63D6',
    '--mg-border-subtle:#263648',
  ]) assert.ok(css.includes(token), 'Missing canonical theme token ' + token);
});

test('themes organization, integration, and sign-in surfaces while retaining status meaning', () => {
  for (const selector of ['.login-page{', '.login-card{', '.org-switch,', '.connection-banner,', '.status.approved', '.status.pending_review', '.status.rejected', ':focus-visible{']) {
    assert.ok(css.includes(selector), 'Missing themed surface ' + selector);
  }
});
