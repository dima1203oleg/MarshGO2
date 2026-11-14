import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  transportTypes,
  activeTypesForSearch,
  choiceFor,
  defaultSelection,
  effectiveProviders,
  hasJourneySearchProvider,
  isAllActive,
  isJourneySearchAvailable,
  loadSelection,
  providersForJourneySearch,
  selectAll,
  toggleProvider,
  toggleType,
  toJourneyPreferences,
} from '../src/domain/transportPreferences';

const groups = [
  { transportType: 'carpool', providers: [{ id: 'carpool:MARSHGO', name: 'MARSHGO Community', available: true, cities: [], sources: ['marshgo'], services: ['carpool'] }] },
  { transportType: 'taxi', providers: [{ id: 'taxi:Uklon', name: 'Uklon', available: true, cities: [], sources: ['taxi'], services: ['taxi'] }, { id: 'taxi:Bolt', name: 'Bolt', available: true, cities: [], sources: ['taxi'], services: ['taxi'] }] },
  { transportType: 'scooter', providers: [{ id: 'scooter:Bolt', name: 'Bolt', available: true, cities: [], sources: ['gbfs'], services: ['scooter'] }] },
  { transportType: 'bike', providers: [{ id: 'bike:3electra', name: '3electra', available: true, cities: ['Львів'], sources: ['gbfs'], services: ['bike'] }] },
  { transportType: 'bus', providers: [{ id: 'bus:Львівавтодор', name: 'Львівавтодор', available: true, cities: ['Львів'], sources: ['gtfs'], services: ['bus', 'tram'] }] },
  { transportType: 'tram', providers: [{ id: 'tram:Львівавтодор', name: 'Львівавтодор', available: true, cities: ['Львів'], sources: ['gtfs'], services: ['tram'] }] },
  { transportType: 'train', providers: [{ id: 'train:Укрзалізниця', name: 'Укрзалізниця', available: true, cities: ['Україна'], sources: ['gtfs'], services: ['train'] }] },
  { transportType: 'city_train', providers: [{ id: 'city_train:Львівавтодор', name: 'Львівавтодор', available: true, cities: ['Львів'], sources: ['gtfs'], services: ['city_train'] }] },
  { transportType: 'funicular', providers: [{ id: 'funicular:Фунікулер', name: 'Фунікулер', available: true, cities: ['Київ'], sources: ['gtfs'], services: ['funicular'] }] },
  { transportType: 'ferry', providers: [{ id: 'ferry:Пором', name: 'Пором', available: true, cities: ['Україна'], sources: ['gtfs'], services: ['ferry'] }] },
];

describe('transport types and providers', () => {
  it('resets a previous narrow stored selection so all routeable modes are initially searched', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    const values = new Map<string, string>([['marshgo_transport_selection_v2', JSON.stringify({ active: ['bus', 'marshrutka'], providers: {} })]]);
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    } });
    try {
      assert.deepEqual(loadSelection(), defaultSelection);
    } finally {
      if (original) Object.defineProperty(globalThis, 'localStorage', original);
      else Reflect.deleteProperty(globalThis, 'localStorage');
    }
  });

  it('exposes exactly 12 canonical transport tiles in the approved order', () => {
    assert.deepEqual(transportTypes.map((type) => type.id), [
      'bus', 'marshrutka', 'trolleybus', 'tram', 'metro', 'carpool',
      'taxi', 'train', 'bike', 'scooter', 'carsharing', 'transfer',
    ]);
  });

  it('selects every currently routeable category through “Усі”', () => {
    assert.deepEqual(activeTypesForSearch(defaultSelection), [
      'bus', 'marshrutka', 'trolleybus', 'tram', 'metro', 'carpool', 'train', 'scooter',
    ]);
    assert.equal(isAllActive(defaultSelection), true);
    assert.equal(isAllActive(selectAll({ ...defaultSelection, active: ['bus'] })), true);
    assert.equal(isAllActive(toggleType(defaultSelection, 'bus')), false);
  });

  it('keeps unsupported canonical categories visible but prevents selecting or routing them', () => {
    const unsupported = ['taxi', 'bike', 'carsharing', 'transfer'] as const;
    for (const type of unsupported) {
      assert.deepEqual(toggleType(defaultSelection, type), defaultSelection);
      assert.equal(hasJourneySearchProvider(type, groups), false);
      assert.deepEqual(providersForJourneySearch(type, groups), []);
    }
    assert.deepEqual(effectiveProviders(defaultSelection, 'taxi', groups), []);
    const taxiPreferences = toJourneyPreferences({ ...defaultSelection, active: ['taxi'] }, groups);
    assert.equal(taxiPreferences.allowTaxi, false);
    assert.deepEqual(taxiPreferences.allowedTransportTypes, []);
  });

  it('routes provider-backed scooter estimates without treating them as public transit', () => {
    assert.equal(isJourneySearchAvailable('scooter', groups), true);
    assert.deepEqual(providersForJourneySearch('scooter', groups).map((provider) => provider.id), ['scooter:Bolt']);
    const scooterSelection = { ...defaultSelection, active: ['scooter'] as ['scooter'] };
    const preferences = toJourneyPreferences(scooterSelection, groups);
    assert.deepEqual(preferences.allowedTransportTypes, ['scooter']);
    assert.equal(preferences.allowPublicTransport, false);
    assert.deepEqual(preferences.allowedTransitProvidersByType, {});
  });

  it('keeps an empty selection empty instead of silently searching all categories', () => {
    let selection = defaultSelection;
    for (const type of defaultSelection.active) selection = toggleType(selection, type);
    assert.deepEqual(selection.active, []);
    assert.deepEqual(activeTypesForSearch(selection), []);
    assert.deepEqual(toJourneyPreferences(selection, groups).allowedTransportTypes, []);
  });

  it('keeps availability unknown after discovery failure, but excludes verified uncovered categories', () => {
    assert.deepEqual(toJourneyPreferences({ ...defaultSelection, active: ['bus', 'tram', 'metro', 'carpool'] }, null).allowedTransportTypes,
      ['bus', 'tram', 'metro', 'carpool']);
    const preferences = toJourneyPreferences({ ...defaultSelection, active: ['bus', 'tram', 'carpool'] }, []);
    assert.deepEqual(preferences.allowedTransportTypes, ['carpool']);
    assert.equal(preferences.allowPublicTransport, false);
    assert.equal(isJourneySearchAvailable('metro', [],), false);
    assert.equal(isJourneySearchAvailable('metro', groups), false, 'Lviv provider response contains no metro service');
    assert.equal(isJourneySearchAvailable('metro', null), true, 'unknown availability is not mislabeled as unavailable');
    const kyivGroups = [...groups, { transportType: 'metro', providers: [{ id: 'metro:Kyiv', name: 'Київський метрополітен', available: true, cities: ['Київ'], sources: ['gtfs'], services: ['metro'] }] }];
    assert.equal(isJourneySearchAvailable('metro', kyivGroups), true);
  });

  it('does not enable Kyiv metro or minibuses from map-only GeoJSON geometry', () => {
    const mapOnlyGroups = [
      { transportType: 'metro', providers: [{ id: 'metro:KyivOpenData', name: 'Київське метро — геометрія', available: true, cities: ['Київ'], sources: ['geojson'], services: ['metro'] }] },
      { transportType: 'marshrutka', providers: [{ id: 'marshrutka:KyivOpenData', name: 'Маршрутки Києва — геометрія', available: true, cities: ['Київ'], sources: ['geojson'], services: ['marshrutka'] }] },
    ];
    for (const type of ['metro', 'marshrutka'] as const) {
      assert.equal(isJourneySearchAvailable(type, mapOnlyGroups), false);
      assert.deepEqual(providersForJourneySearch(type, mapOnlyGroups), []);
      const preferences = toJourneyPreferences({ ...defaultSelection, active: [type] }, mapOnlyGroups);
      assert.deepEqual(preferences.allowedTransportTypes, []);
    }
  });

  it('does not broaden an explicit provider choice when discovery has no matching provider', () => {
    const selection = toggleProvider({ ...defaultSelection, active: ['bus'] }, 'bus', 'bus:Львівавтодор');
    const preferences = toJourneyPreferences(selection, []);
    assert.deepEqual(preferences.allowedTransportTypes, []);
    assert.equal(preferences.allowPublicTransport, false);
  });

  it('filters providers by real route adapter and remembers provider choices by category', () => {
    assert.equal(hasJourneySearchProvider('carpool', groups), true);
    assert.equal(hasJourneySearchProvider('bus', groups), true);
    assert.equal(hasJourneySearchProvider('tram', groups), true);
    assert.equal(hasJourneySearchProvider('train', groups), true);
    assert.equal(hasJourneySearchProvider('bike', groups), false); // GBFS vehicles do not build itineraries.
    assert.equal(hasJourneySearchProvider('scooter', groups), true); // GBFS scooters can produce estimated routes.
    assert.deepEqual(providersForJourneySearch('bus', groups).map((provider) => provider.id), ['bus:Львівавтодор']);
    assert.deepEqual(providersForJourneySearch('train', groups).map((provider) => provider.id), ['train:Укрзалізниця', 'city_train:Львівавтодор']);

    let selection = toggleProvider(defaultSelection, 'bus', 'bus:Львівавтодор');
    assert.deepEqual(effectiveProviders(selection, 'bus', groups), ['bus:Львівавтодор']);
    selection = toggleType(selection, 'bus');
    selection = toggleType(selection, 'bus');
    assert.deepEqual(choiceFor(selection, 'bus'), { all: false, ids: ['bus:Львівавтодор'] });
  });

  it('maps multi-select categories while keeping walking an automatic planner leg', () => {
    const preferences = toJourneyPreferences({ ...defaultSelection, active: ['bus', 'tram', 'train', 'carpool'] }, groups);
    assert.equal(preferences.allowCommunity, true);
    assert.equal(preferences.allowPublicTransport, true);
    assert.equal(preferences.allowBus, true);
    assert.equal(preferences.allowRail, true);
    assert.equal('allowWalk' in preferences, false);
    assert.deepEqual(preferences.allowedTransportTypes, ['bus', 'tram', 'carpool', 'train']);
    assert.deepEqual(preferences.allowedTransitProvidersByType, {
      bus: ['Львівавтодор'], tram: ['Львівавтодор'], train: ['Укрзалізниця'], city_train: ['Львівавтодор'],
    });
  });

  it('does not relabel a funicular provider as a train provider', () => {
    assert.deepEqual(providersForJourneySearch('train', groups).map((provider) => provider.id), ['train:Укрзалізниця', 'city_train:Львівавтодор']);
    const modes = toJourneyPreferences({ ...defaultSelection, active: ['train'] }, groups).allowedTransportTypes;
    assert.ok(Array.isArray(modes));
    assert.equal(modes.includes('funicular'), false);
  });
});
