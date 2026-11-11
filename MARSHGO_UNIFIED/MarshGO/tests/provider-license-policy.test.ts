import assert from 'node:assert/strict';
import { test } from 'node:test';
import { commercialUseFromLicense } from '../server/mobility/licensePolicy';

test('recognizes commercial reuse only from a known license or explicit permission', () => {
  assert.equal(commercialUseFromLicense('CC BY 4.0'), true);
  assert.equal(commercialUseFromLicense('ODbL (OpenStreetMap-derived)'), true);
  assert.equal(commercialUseFromLicense('Kyiv Open Data Licence (commercial use permitted; attribution required)'), true);
  assert.equal(commercialUseFromLicense('CC BY-NC 4.0'), false);
  assert.equal(commercialUseFromLicense('Open data portal of a city; terms not stated'), null);
  assert.equal(commercialUseFromLicense(null), null);
});
