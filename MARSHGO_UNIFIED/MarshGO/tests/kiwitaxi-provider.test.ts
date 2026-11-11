import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildKiwitaxiAffiliateUrl,
  buildKiwitaxiSearchLink,
  KiwitaxiCatalogClient,
  KiwitaxiConfigurationError,
  KiwitaxiFeedError,
  parseKiwitaxiTsv,
} from '../server/providers/adapters/KiwitaxiCatalogAdapter';

async function* chunks(...values: Array<string | Uint8Array>) {
  yield* values;
}

async function collect<T>(values: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const value of values) result.push(value);
  return result;
}

test('KiwiTaxi TSV parser streams BOM, UTF-8, CRLF, nullable and dynamic localized columns', async () => {
  const input = chunks(
    new TextEncoder().encode('\uFEFFid\tname_en\tname_uk\tvalue\r\n7\tAirport\tАеро'),
    new TextEncoder().encode('порт\t\\N\r\n8\tCity\tМісто\tabc'),
  );
  assert.deepEqual(await collect(parseKiwitaxiTsv(input)), [
    { id: '7', name_en: 'Airport', name_uk: 'Аеропорт', value: null },
    { id: '8', name_en: 'City', name_uk: 'Місто', value: 'abc' },
  ]);
});

test('KiwiTaxi TSV parser rejects ambiguous schemas and malformed records', async () => {
  await assert.rejects(collect(parseKiwitaxiTsv(chunks('id\tid\n1\t1'))), KiwitaxiFeedError);
  await assert.rejects(collect(parseKiwitaxiTsv(chunks('id\tname\n1'))), KiwitaxiFeedError);
  await assert.rejects(collect(parseKiwitaxiTsv(chunks('id\n12345'), { maximumRowBytes: 3 })), KiwitaxiFeedError);
  await assert.rejects(collect(parseKiwitaxiTsv(chunks('id\n12345'), { maximumBytes: 3 })), KiwitaxiFeedError);
});

test('KiwiTaxi catalog client requires server-side credentials before network requests', async () => {
  let requests = 0;
  const client = new KiwitaxiCatalogClient({ fetchImpl: async () => { requests += 1; return new Response(''); } });
  assert.equal(client.isConfigured(), false);
  await assert.rejects(collect(client.fetchEntity('countries')), KiwitaxiConfigurationError);
  assert.equal(requests, 0);
});

test('KiwiTaxi feed client applies allowlisted entity parameters without leaking secrets in errors', async () => {
  const requests: URL[] = [];
  const client = new KiwitaxiCatalogClient({
    securityToken: 'test-token-only',
    fetchImpl: async (input) => {
      requests.push(new URL(String(input)));
      return new Response('id\tvalue\n1\tok', { status: 200 });
    },
  });
  assert.equal(client.isConfigured(), true);
  assert.deepEqual(await collect(client.fetchEntity('transfers', { paymentType: 'full' })), [{ id: '1', value: 'ok' }]);
  assert.equal(requests[0]?.pathname, '/services/data/csv/transfers');
  assert.equal(requests[0]?.searchParams.get('security_token'), 'test-token-only');
  assert.equal(requests[0]?.searchParams.get('payment_type'), 'full');
  assert.deepEqual(await collect(client.fetchEntity('routes', { whiteLabel: true })), [{ id: '1', value: 'ok' }]);
  assert.equal(requests[1]?.searchParams.get('white_label'), '1');
  assert.equal(requests[1]?.searchParams.has('payment_type'), false);
  await assert.rejects(collect(client.fetchEntity('countries', { paymentType: 'none' })), KiwitaxiConfigurationError);
});

test('KiwiTaxi client rejects non-approved hosts and does not follow redirects', async () => {
  assert.throws(() => new KiwitaxiCatalogClient({ securityToken: 'test', baseUrl: 'http://kiwitaxi.com' }), KiwitaxiConfigurationError);
  assert.throws(() => new KiwitaxiCatalogClient({ securityToken: 'test', baseUrl: 'https://evil.example' }), KiwitaxiConfigurationError);
  let redirectMode: RequestRedirect | undefined;
  const client = new KiwitaxiCatalogClient({
    securityToken: 'test-token-only',
    fetchImpl: async (_input, init) => { redirectMode = init?.redirect; return new Response(null, { status: 302 }); },
  });
  await assert.rejects(collect(client.fetchEntity('countries')), /HTTP 302/);
  assert.equal(redirectMode, 'error');
});

test('KiwiTaxi partner URL preserves query and fragment while safely adding pap', () => {
  const domains = [{ locale: 'en', value: 'kiwitaxi.com' }, { locale: 'ru', value: 'kiwitaxi.ru' }];
  const url = new URL(buildKiwitaxiAffiliateUrl({
    target: '/route?existing=1#step', locale: 'en', domains, affiliateId: 'partner-42',
  }));
  assert.equal(url.searchParams.get('existing'), '1');
  assert.equal(url.searchParams.get('pap'), 'partner-42');
  assert.equal(url.hash, '#step');
  assert.equal(url.hostname, 'kiwitaxi.com');
  assert.throws(() => buildKiwitaxiAffiliateUrl({ target: 'https://evil.example/x', locale: 'en', domains, affiliateId: 'partner-42' }), KiwitaxiConfigurationError);
  assert.throws(() => buildKiwitaxiAffiliateUrl({ target: '/route', locale: 'en', domains }), KiwitaxiConfigurationError);
});

test('KiwiTaxi search deep link encodes endpoints and applies configured attribution', () => {
  const url = new URL(buildKiwitaxiSearchLink({
    origin: 'Airport & Hotel', destination: 'Kyiv / Podil', locale: 'uk',
    domains: [{ locale: 'en', value: 'kiwitaxi.com/en' }, { locale: 'ru', value: 'kiwitaxi.ru' }], affiliateId: 'partner-42',
  }));
  assert.equal(url.pathname, '/en/search');
  assert.equal(url.searchParams.get('from'), 'Airport & Hotel');
  assert.equal(url.searchParams.get('to'), 'Kyiv / Podil');
  assert.equal(url.searchParams.get('pap'), 'partner-42');
});

test('KiwiTaxi localized domain path is preserved for relative CSV booking URLs', () => {
  const url = new URL(buildKiwitaxiAffiliateUrl({
    target: 'airport-transfer', locale: 'en',
    domains: [{ locale: 'en', value: 'kiwitaxi.com/en' }], affiliateId: 'partner-42',
  }));
  assert.equal(url.pathname, '/en/airport-transfer');
});
