export const KIWITAXI_PROVIDER_ID = 'kiwitaxi';
export const KIWITAXI_BASE_URL = 'https://kiwitaxi.com';
export const KIWITAXI_ENTITIES = [
  'url_domains',
  'currencies',
  'countries',
  'regions',
  'place_types',
  'places',
  'routes',
  'transfer_types',
  'transfers',
] as const;

export type KiwitaxiEntity = typeof KIWITAXI_ENTITIES[number];
export type KiwitaxiTsvRow = Record<string, string | null>;

export class KiwitaxiConfigurationError extends Error {}
export class KiwitaxiFeedError extends Error {}

export interface KiwitaxiCatalogClientOptions {
  securityToken?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maximumBytes?: number;
}

function normalizeBaseUrl(raw: string): URL {
  let url: URL;
  try { url = new URL(raw); } catch { throw new KiwitaxiConfigurationError('KiwiTaxi base URL is invalid'); }
  const hostAllowed = url.hostname === 'kiwitaxi.com' || url.hostname === 'kiwitaxi.ru';
  if (url.protocol !== 'https:' || !hostAllowed || url.username || url.password || url.search || url.hash) {
    throw new KiwitaxiConfigurationError('KiwiTaxi base URL must use an approved HTTPS host');
  }
  url.pathname = url.pathname.replace(/\/$/, '');
  return url;
}

/**
 * Parse the documented tab-separated feed incrementally. It deliberately yields
 * rows instead of retaining an entire provider catalog in process memory.
 * KiwiTaxi's documented format does not define quoted tabs/newlines.
 */
export async function* parseKiwitaxiTsv(
  chunks: AsyncIterable<Uint8Array | string>,
  options: { maximumBytes?: number; maximumRowBytes?: number } = {},
): AsyncGenerator<KiwitaxiTsvRow> {
  const maximumBytes = options.maximumBytes ?? 256 * 1024 * 1024;
  const maximumRowBytes = options.maximumRowBytes ?? 1024 * 1024;
  if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 1
    || !Number.isSafeInteger(maximumRowBytes) || maximumRowBytes < 1) {
    throw new TypeError('KiwiTaxi TSV parser limits must be positive integers');
  }

  const decoder = new TextDecoder('utf-8', { fatal: true });
  let pending = '';
  let headers: string[] | undefined;
  let totalBytes = 0;

  const parseLine = (rawLine: string): KiwitaxiTsvRow | undefined => {
    const line = rawLine.replace(/\r$/, '');
    if (!line.trim()) return undefined;
    if (!headers) {
      const headerLine = line.replace(/^\uFEFF/, '');
      headers = headerLine.split('\t').map((value) => value.trim());
      if (headers.length === 0 || headers.some((value) => !value)
        || new Set(headers).size !== headers.length) {
        throw new KiwitaxiFeedError('KiwiTaxi TSV header is empty or contains duplicate columns');
      }
      return undefined;
    }

    const values = line.split('\t');
    if (values.length !== headers.length) {
      throw new KiwitaxiFeedError(`KiwiTaxi TSV row has ${values.length} values; expected ${headers.length}`);
    }
    const row: KiwitaxiTsvRow = {};
    headers.forEach((name, index) => { row[name] = values[index] === '\\N' ? null : values[index]!; });
    return row;
  };

  for await (const chunk of chunks) {
    const bytes = typeof chunk === 'string' ? Buffer.byteLength(chunk, 'utf8') : chunk.byteLength;
    totalBytes += bytes;
    if (totalBytes > maximumBytes) throw new KiwitaxiFeedError('KiwiTaxi TSV feed exceeds the configured size limit');
    try { pending += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true }); }
    catch { throw new KiwitaxiFeedError('KiwiTaxi TSV feed is not valid UTF-8'); }

    let newline = pending.indexOf('\n');
    while (newline >= 0) {
      const line = pending.slice(0, newline);
      if (Buffer.byteLength(line, 'utf8') > maximumRowBytes) throw new KiwitaxiFeedError('KiwiTaxi TSV row exceeds the configured size limit');
      const row = parseLine(line);
      if (row) yield row;
      pending = pending.slice(newline + 1);
      newline = pending.indexOf('\n');
    }
    if (Buffer.byteLength(pending, 'utf8') > maximumRowBytes) throw new KiwitaxiFeedError('KiwiTaxi TSV row exceeds the configured size limit');
  }

  try { pending += decoder.decode(); } catch { throw new KiwitaxiFeedError('KiwiTaxi TSV feed ends with invalid UTF-8'); }
  if (pending.length > 0) {
    const row = parseLine(pending);
    if (row) yield row;
  }
  if (!headers) throw new KiwitaxiFeedError('KiwiTaxi TSV feed is empty');
}

async function* responseChunks(body: ReadableStream<Uint8Array>): AsyncGenerator<Uint8Array> {
  const reader = body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      if (value) yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

/** Authenticated, allowlisted TSV reader. Tokens are kept in query strings per the provider's contract but never logged. */
export class KiwitaxiCatalogClient {
  private readonly token?: string;
  private readonly baseUrl: URL;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;
  private readonly maximumBytes: number;

  constructor(options: KiwitaxiCatalogClientOptions = {}) {
    this.token = options.securityToken?.trim() || undefined;
    this.baseUrl = normalizeBaseUrl(options.baseUrl ?? KIWITAXI_BASE_URL);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 120_000;
    this.maximumBytes = options.maximumBytes ?? 256 * 1024 * 1024;
    if (!Number.isSafeInteger(this.timeoutMs) || this.timeoutMs < 1) throw new TypeError('timeoutMs must be a positive integer');
  }

  isConfigured(): boolean { return Boolean(this.token); }

  async *fetchEntity(
    entity: KiwitaxiEntity,
    options: { paymentType?: 'none' | 'partial' | 'full'; whiteLabel?: boolean } = {},
  ): AsyncGenerator<KiwitaxiTsvRow> {
    if (!this.token) throw new KiwitaxiConfigurationError('KIWITAXI_SECURITY_TOKEN is not configured');
    if (!(KIWITAXI_ENTITIES as readonly string[]).includes(entity)) throw new KiwitaxiConfigurationError('KiwiTaxi entity is not allowlisted');
    if (options.paymentType && entity !== 'transfers') throw new KiwitaxiConfigurationError('paymentType is supported only for transfers');
    if (options.whiteLabel && entity !== 'routes') throw new KiwitaxiConfigurationError('whiteLabel is supported only for routes');

    const url = new URL(`/services/data/csv/${entity}`, this.baseUrl.origin);
    url.searchParams.set('security_token', this.token);
    if (entity === 'transfers') url.searchParams.set('payment_type', options.paymentType ?? 'partial');
    if (entity === 'routes' && options.whiteLabel) url.searchParams.set('white_label', '1');

    const response = await this.fetchImpl(url, {
      headers: { accept: 'text/csv, text/plain;q=0.9', 'user-agent': 'MARSHGO-Kiwitaxi-Adapter/1.0' },
      redirect: 'error',
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      throw new KiwitaxiFeedError(`KiwiTaxi ${entity} feed returned HTTP ${response.status}`);
    }
    if (!response.body) throw new KiwitaxiFeedError(`KiwiTaxi ${entity} feed has no response body`);
    yield* parseKiwitaxiTsv(responseChunks(response.body), { maximumBytes: this.maximumBytes });
  }
}

export interface KiwitaxiUrlDomain { locale: string; value: string; }

function normalizedKiwitaxiDomain(value: string): URL {
  const candidate = value.includes('://') ? value : `https://${value}`;
  let parsed: URL;
  try { parsed = new URL(candidate); } catch { throw new KiwitaxiConfigurationError('KiwiTaxi URL domain is invalid'); }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port
    || parsed.search || parsed.hash
    || (parsed.hostname !== 'kiwitaxi.com' && parsed.hostname !== 'kiwitaxi.ru')
    || !/^\/(?:[a-z]{2})?$/.test(parsed.pathname.replace(/\/$/, '') || '/')) {
    throw new KiwitaxiConfigurationError('KiwiTaxi URL domain is not an approved HTTPS domain');
  }
  return parsed;
}

/** Build a validated partner URL and preserve existing query/fragment data. */
export function buildKiwitaxiAffiliateUrl(input: {
  target: string;
  locale?: string;
  domains: readonly KiwitaxiUrlDomain[];
  affiliateId?: string;
}): string {
  const affiliateId = input.affiliateId?.trim();
  if (!affiliateId) throw new KiwitaxiConfigurationError('KIWITAXI_AFFILIATE_ID is not configured');
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(affiliateId)) throw new KiwitaxiConfigurationError('KiwiTaxi affiliate ID has an invalid format');
  if (!input.domains.length) throw new KiwitaxiConfigurationError('KiwiTaxi URL-domain catalog is empty');

  const domain = input.domains.find((item) => item.locale === input.locale) ?? input.domains[0]!;
  const providerDomain = normalizedKiwitaxiDomain(domain.value);
  const host = providerDomain.hostname;
  let target: URL;
  try {
    const base = new URL(providerDomain.toString());
    base.pathname = `${base.pathname.replace(/\/$/, '')}/`;
    target = new URL(input.target, input.target.startsWith('/') ? `https://${host}` : base);
  } catch { throw new KiwitaxiConfigurationError('KiwiTaxi target URL is invalid'); }
  if (target.protocol !== 'https:' || target.hostname !== host || target.username || target.password || target.port) {
    throw new KiwitaxiConfigurationError('KiwiTaxi target must stay on the selected provider domain');
  }
  target.searchParams.set('pap', affiliateId);
  return target.toString();
}

/** Public deep-link fallback; it does not imply a quote, availability, or booking. */
export function buildKiwitaxiSearchLink(input: {
  origin: string;
  destination: string;
  locale: string;
  domains: readonly KiwitaxiUrlDomain[];
  affiliateId?: string;
}): string {
  const domain = input.domains.find((item) => item.locale === input.locale)
    ?? input.domains.find((item) => item.locale === 'en')
    ?? input.domains[0];
  if (!domain) throw new KiwitaxiConfigurationError('KiwiTaxi URL-domain catalog is empty');
  const providerDomain = normalizedKiwitaxiDomain(domain.value);
  const host = providerDomain.hostname;
  const localePath = providerDomain.pathname.replace(/\/$/, '');
  const target = new URL(`${localePath}/search`, `https://${host}`);
  target.searchParams.set('from', input.origin);
  target.searchParams.set('to', input.destination);
  return buildKiwitaxiAffiliateUrl({ target: target.toString(), locale: domain.locale, domains: [domain], affiliateId: input.affiliateId });
}

