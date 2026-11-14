import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMapAssetManifest, styleForMapLayer, styleForMapTheme } from '../src/map/style/manifest';

const manifest = {
  schemaVersion: 1, mapDataVersion: '2026-09-30', styleVersion: '1.0.0', mapDataUrl: 'https://maps.example/maps/ukraine/2026-09-30/ukraine.pmtiles',
  styles: { MARSHGO_NAVIGATION_LIGHT: 'https://maps.example/styles/navigation/v1.0.0/style.json' },
};

test('map asset manifest accepts immutable versioned data and style URLs', () => {
  assert.equal(parseMapAssetManifest(manifest).mapDataVersion, '2026-09-30');
});

test('map asset manifest accepts additional immutable style variants', () => {
  const extended = {
    ...manifest,
    styles: {
      ...manifest.styles,
      MARSHGO_3D_LIGHT: 'https://maps.example/styles/3d/v1.0.0/style.json',
      MARSHGO_SATELLITE_DARK: 'https://maps.example/styles/satellite/v1.0.0/style.json',
    },
  };
  assert.equal(parseMapAssetManifest(extended).styles.MARSHGO_3D_LIGHT, extended.styles.MARSHGO_3D_LIGHT);
});

test('navigation theme resolves to its managed base theme when no navigation variant is published', () => {
  const styles = { MARSHGO_LIGHT: 'https://maps.example/styles/light/v1.0.0/style.json' };
  assert.equal(styleForMapTheme(styles, 'MARSHGO_NAVIGATION_LIGHT'), styles.MARSHGO_LIGHT);
  assert.equal(styleForMapTheme(styles, 'MARSHGO_NAVIGATION_DARK'), undefined);
});

test('3D navigation prefers the published managed variant and otherwise uses the matching base theme', () => {
  const styles: Record<string, string> = {
    MARSHGO_LIGHT: 'https://maps.example/styles/light/v1.0.0/style.json',
    MARSHGO_3D_LIGHT: 'https://maps.example/styles/3d/v1.0.0/style.json',
  };
  assert.equal(styleForMapLayer(styles, 'MARSHGO_NAVIGATION_LIGHT', 'navigation'), styles.MARSHGO_3D_LIGHT);
  assert.equal(styleForMapLayer(styles, 'MARSHGO_NAVIGATION_LIGHT', 'standard'), styles.MARSHGO_LIGHT);
});

test('map asset manifest rejects mutable URLs and incompatible versions', () => {
  assert.throws(() => parseMapAssetManifest({ ...manifest, mapDataUrl: 'https://maps.example/maps/current.pmtiles' }), /immutable and versioned/);
  assert.throws(() => parseMapAssetManifest({ ...manifest, styles: { MARSHGO_NAVIGATION_LIGHT: 'https://maps.example/styles/current.json' } }), /immutable and versioned/);
  assert.throws(() => parseMapAssetManifest({ ...manifest, schemaVersion: 2 }), /Invalid input/);
});
