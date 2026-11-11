import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const nginx = readFileSync(new URL('../deploy/nginx.conf', import.meta.url), 'utf8');
const stagingEdge = readFileSync(new URL('../ops/staging/edge.mjs', import.meta.url), 'utf8');

// The browser origin and the staging edge are public. API readiness answers disclose
// PostgreSQL and realtime state, so they must stay reachable only on the API origin.
test('public nginx proxies nothing but the versioned API namespace', () => {
  assert.doesNotMatch(nginx, /\/(?:readyz|healthz-api)/);
  assert.deepEqual([...nginx.matchAll(/proxy_pass\s+(\S+);/g)].map((match) => match[1]), ['http://api:3002/api/']);
});

test('staging edge proxies only versioned API traffic', () => {
  assert.doesNotMatch(stagingEdge, /pathname\s*===\s*['"]\/(?:readyz|healthz-api)['"]/);
  assert.match(stagingEdge, /pathname\.startsWith\('\/api\/'\)/);
});

test('nginx keeps the app-critical routes intact', () => {
  assert.match(nginx, /location \/api\/ \{\s*proxy_pass http:\/\/api:3002\/api\/;/);
  assert.match(nginx, /location = \/healthz \{[\s\S]*?return 200/);
});
