import 'dotenv/config';
import { KIWITAXI_ENTITIES, KiwitaxiCatalogClient, type KiwitaxiEntity } from '../server/providers/adapters/KiwitaxiCatalogAdapter';

async function main() {
  const client = new KiwitaxiCatalogClient({
    securityToken: process.env.KIWITAXI_SECURITY_TOKEN,
    baseUrl: process.env.KIWITAXI_BASE_URL,
    timeoutMs: Number(process.env.KIWITAXI_REQUEST_TIMEOUT_MS ?? 300_000),
  });
  if (!client.isConfigured()) {
    console.error('KiwiTaxi live check not run: KIWITAXI_SECURITY_TOKEN is not configured.');
    process.exitCode = 2;
    return;
  }

  const selectedEntity = process.env.KIWITAXI_SMOKE_ENTITY;
  if (selectedEntity && !(KIWITAXI_ENTITIES as readonly string[]).includes(selectedEntity)) {
    throw new Error('KIWITAXI_SMOKE_ENTITY is not an allowlisted entity');
  }
  const entities: readonly KiwitaxiEntity[] = selectedEntity ? [selectedEntity as KiwitaxiEntity] : KIWITAXI_ENTITIES;
  for (const entity of entities) {
    let count = 0;
    const domains: string[] = [];
    for await (const row of client.fetchEntity(entity, entity === 'transfers' ? { paymentType: 'partial' } : {})) {
      if (row) count += 1;
      if (entity === 'url_domains' && row.locale && row.value) domains.push(`${row.locale}=${row.value}`);
    }
    console.log(`${entity}: ${count} rows`);
    if (domains.length > 0) console.log(`locales/domains: ${domains.join(', ')}`);
  }
  console.log(`Affiliate ID configured: ${Boolean(process.env.KIWITAXI_AFFILIATE_ID?.trim())}`);
}

main().catch((error: unknown) => {
  // Avoid including request URLs or provider response bodies, which can contain the security token.
  console.error(`KiwiTaxi live check failed: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exitCode = 1;
});
