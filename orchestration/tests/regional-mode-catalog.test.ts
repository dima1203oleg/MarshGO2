import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getTransportCatalogForCity } from '../server/mobility/ukraineRegionalCatalog';
import { canonicalTransportTypes } from '../src/domain/transportCatalog';

describe('regional transport capability catalog', () => {
  it('returns exactly the 12 canonical categories', () => {
    assert.deepEqual(getTransportCatalogForCity('Київ').map((mode) => mode.id), canonicalTransportTypes);
  });

  it('does not claim commercial taxi, carsharing, or transfer APIs are active', () => {
    const kyiv = new Map(getTransportCatalogForCity('Київ').map((mode) => [mode.id, mode]));
    for (const id of ['taxi', 'carsharing', 'transfer'] as const) {
      assert.equal(kyiv.get(id)?.enabled, false, `${id} must stay disabled without a connected partner API`);
      assert.equal(kyiv.get(id)?.availability, 'REQUIRES_CONTRACT');
      assert.deepEqual(kyiv.get(id)?.capabilities, []);
    }
  });

  it('keeps city route coverage limited to capabilities supported by the source format', () => {
    const kyiv = new Map(getTransportCatalogForCity('Київ').map((mode) => [mode.id, mode]));
    assert.equal(kyiv.get('bus')?.enabled, true);
    assert.equal(kyiv.get('tram')?.enabled, true);
    assert.equal(kyiv.get('trolleybus')?.enabled, true);
    assert.equal(kyiv.get('metro')?.enabled, false, 'map geometry without a routed timetable must not enable metro search');
    assert.equal(kyiv.get('metro')?.availability, 'LIMITED');
    assert.deepEqual(kyiv.get('metro')?.capabilities, ['TRANSIT_STOPS', 'TRANSIT_GEOMETRY']);
    assert.match(kyiv.get('metro')?.reason ?? '', /активного розкладу метро в маршрутному рушії немає/);
    assert.equal(kyiv.get('marshrutka')?.enabled, false, 'route geometry alone is not a scheduled minibus offer');
    assert.deepEqual(kyiv.get('marshrutka')?.capabilities, ['TRANSIT_ROUTES', 'TRANSIT_GEOMETRY']);
    assert.ok(getTransportCatalogForCity('Київ').filter((mode) => mode.id !== 'carpool').every((mode) => mode.availability !== 'AVAILABLE'));
  });

  it('marks Lviv bike coverage as static and limited, not live Nextbike', () => {
    const bike = getTransportCatalogForCity('Львів').find((mode) => mode.id === 'bike');
    assert.equal(bike?.availability, 'LIMITED');
    assert.equal(bike?.enabled, false);
    assert.deepEqual(bike?.capabilities, ['ASSET_DISCOVERY']);
    assert.match(bike?.reason ?? '', /Nextbike.*не підтвердилося/);
  });

  it('does not expose unlocated nationwide feeds as active city route coverage', () => {
    const modes = getTransportCatalogForCity();
    assert.equal(modes.length, 12);
    assert.ok(modes.filter((mode) => mode.id !== 'carpool').every((mode) => mode.availability !== 'AVAILABLE'));
    assert.equal(modes.find((mode) => mode.id === 'carpool')?.availability, 'AVAILABLE');
    assert.equal(modes.find((mode) => mode.id === 'carpool')?.enabled, true);
    assert.equal(modes.find((mode) => mode.id === 'bus')?.enabled, false);
    assert.equal(modes.find((mode) => mode.id === 'train')?.enabled, false);
    assert.equal(modes.find((mode) => mode.id === 'taxi')?.availability, 'REQUIRES_CONTRACT');
  });
});
