import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { journeySegmentColor, normalizeTransportVisualMode, transportColor } from '../src/domain/transportVisuals';

describe('transport visual mapping', () => {
  it('keeps category identity colors separate from approved journey segment colors', () => {
    assert.equal(transportColor('bus'), '#0284C7');
    assert.equal(transportColor('tram'), '#EF4444');
    assert.equal(journeySegmentColor('bus'), '#1687FF');
    assert.equal(journeySegmentColor('trolleybus'), '#13A66F');
    assert.equal(journeySegmentColor('tram'), '#8B3CE6');
    assert.equal(journeySegmentColor('carpool'), '#E83082');
    assert.equal(journeySegmentColor('walk'), '#8792A4');
    assert.equal(journeySegmentColor('minibus'), journeySegmentColor('marshrutka'));
    assert.equal(journeySegmentColor('TRAM'), journeySegmentColor('tram'));
  });

  it('falls back safely for unknown modes', () => {
    assert.equal(normalizeTransportVisualMode('unknown-mode'), 'other');
    assert.equal(transportColor('unknown-mode'), '#64748B');
    assert.equal(journeySegmentColor('unknown-mode'), '#64748B');
  });
});
