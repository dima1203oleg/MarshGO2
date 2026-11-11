import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lifecycleFixtureTargets } from '../scripts/lifecycle-fixture-targets.mjs';

const isolated = {
  MARSHGO_LIFECYCLE_FIXTURE_MODE: 'true',
  API_TEST_DATABASE_URL: 'postgres://fixture:fixture@127.0.0.1:5434/marshgo_e2e_lifecycle_run1',
  PREVIEW_URL: 'http://127.0.0.1:4311',
  API_URL: 'http://127.0.0.1:4312',
};

test('default invocation cannot use shared preview or DATABASE_URL fallbacks', () => {
  assert.throws(() => lifecycleFixtureTargets({}), /disabled/);
  assert.throws(() => lifecycleFixtureTargets({ ...isolated, API_TEST_DATABASE_URL: undefined, DATABASE_URL: isolated.API_TEST_DATABASE_URL }), /API_TEST_DATABASE_URL/);
});

test('shared database and known active preview ports are rejected', () => {
  for (const name of ['marshgo', 'marshgo_e2e', 'production']) {
    assert.throws(() => lifecycleFixtureTargets({ ...isolated, API_TEST_DATABASE_URL: `postgres://127.0.0.1:5434/${name}` }), /shared databases/);
  }
  assert.throws(() => lifecycleFixtureTargets({ ...isolated, API_TEST_DATABASE_URL: `${isolated.API_TEST_DATABASE_URL}?host=db.example.com` }), /shared databases/);
  for (const key of ['PREVIEW_URL', 'API_URL']) {
    for (const port of [3001, 3002]) assert.throws(() => lifecycleFixtureTargets({ ...isolated, [key]: `http://127.0.0.1:${port}` }), /shared ports/);
  }
});

test('remote targets, deceptive loopback names and credential-bearing origins are rejected', () => {
  for (const key of ['PREVIEW_URL', 'API_URL']) {
    for (const url of ['https://marshgo-dima.shares.zrok.io', 'http://127.0.0.1.example.com:4312', 'http://user:secret@localhost:4312', 'http://localhost:4312/api']) {
      assert.throws(() => lifecycleFixtureTargets({ ...isolated, [key]: url }));
    }
  }
  assert.throws(() => lifecycleFixtureTargets({ ...isolated, API_TEST_DATABASE_URL: 'postgres://db.example.com/marshgo_e2e_lifecycle_run1' }), /loopback/);
});

test('explicit dedicated fixture targets are accepted without contacting services', () => {
  const result = lifecycleFixtureTargets(isolated);
  assert.equal(result.apiUrl, isolated.API_URL);
  assert.equal(result.previewUrl, isolated.PREVIEW_URL);
  assert.equal(new URL(result.databaseUrl).pathname, '/marshgo_e2e_lifecycle_run1');
  assert.throws(() => lifecycleFixtureTargets({ ...isolated, API_URL: isolated.PREVIEW_URL }), /separate/);
  assert.throws(() => lifecycleFixtureTargets({ ...isolated, API_URL: 'http://localhost:4311' }), /separate/);
});
