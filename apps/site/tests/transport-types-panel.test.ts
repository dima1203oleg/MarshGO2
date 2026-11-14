import assert from 'node:assert/strict';
import { createElement } from 'react';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { TransportTypesPanel } from '../src/components/TransportTypesPanel';
import { defaultSelection, supportedJourneySearchTypes, transportTypes } from '../src/domain/transportPreferences';

describe('TransportTypesPanel corridor-aware selection', () => {
  it('keeps all twelve supported modes selectable when endpoint discovery only finds a bus feed', async () => {
    const html = renderToStaticMarkup(createElement(TransportTypesPanel, {
      selection: defaultSelection,
      groups: [{
        transportType: 'bus',
        providers: [{ id: 'bus:lviv', name: 'Lviv GTFS', available: true, cities: ['Львів'], sources: ['gtfs'], services: ['bus'] }],
      }],
      onChange: () => undefined,
      compact: true,
    }));

    assert.match(html, /data-testid="transport-mode-selector" role="group" aria-label="Усі 12 видів транспорту · гортайте горизонтально" class="transport-mode-grid transport-mode-grid--horizontal"/,
      'the compact search selector clearly announces all twelve categories and exposes a horizontal rail');
    const css = await readFile(resolve(dirname(fileURLToPath(import.meta.url)), '../src/index.css'), 'utf8');
    assert.match(css, /\.transport-types-inline \.transport-mode-grid--horizontal\s*\{[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory;/,
      'the mobile selector can be horizontally scrolled and settles tiles into place');
    assert.match(css, /\.transport-mode-grid--horizontal\s*>\s*button\s*\{[^}]*scroll-snap-align:\s*start;/,
      'each category aligns cleanly after horizontal movement');

    for (const id of supportedJourneySearchTypes) {
      const mode = transportTypes.find((item) => item.id === id);
      assert.ok(mode, `mode ${id} must have a product label`);
      const escapedLabel = mode.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const button = html.match(new RegExp(`<button\\b(?=[^>]*aria-label="${escapedLabel}")[^>]*>`))?.[0];
      assert.ok(button, `${mode.label} tile should be rendered`);
      assert.doesNotMatch(button, /\sdisabled(?:="")?(?:\s|>)/, `${mode.label} should not be disabled by endpoint-local coverage`);
      assert.match(button, /aria-pressed="true"/, `${mode.label} stays selected by default`);
    }

    assert.doesNotMatch(html, /провайдери біля вибраних точок знайдені|усі види.*додасть решту/i,
      'endpoint coverage stays out of the passenger-facing transport picker');
  });
});
