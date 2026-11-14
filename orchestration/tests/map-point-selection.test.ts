import assert from 'node:assert/strict';
import { test } from 'node:test';
import { coordinateMapPlace, geolocationFailureMessage } from '../src/features/search/model/mapPointSelection';

test('map selection remains a valid coordinate when reverse geocoding is unavailable', () => {
  assert.deepEqual(coordinateMapPlace(49.8419, 24.0315), {
    label: 'Точка на мапі (49.8419, 24.0315)',
    latitude: 49.8419,
    longitude: 24.0315,
    providerId: 'map-pin',
  });
});

test('GPS errors distinguish denied access, unavailable position, timeout, and unknown failure', () => {
  assert.match(geolocationFailureMessage(1), /відхилили доступ/);
  assert.match(geolocationFailureMessage(2), /системні служби геолокації/);
  assert.match(geolocationFailureMessage(3), /вчасно/);
  assert.match(geolocationFailureMessage(), /Перевірте доступ сайту/);
});
