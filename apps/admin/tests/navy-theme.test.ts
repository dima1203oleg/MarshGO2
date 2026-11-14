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

test('themes authentication, data tables, and focus without flattening status meaning', () => {
  for (const selector of ['.login-wrap{', '.login-card{', '.table-scroll th{', '.table-scroll td{', '.status-pill.approved', '.status-pill.pending_review', '.status-pill.rejected', ':focus-visible{']) {
    assert.ok(css.includes(selector), 'Missing themed surface ' + selector);
  }
});
