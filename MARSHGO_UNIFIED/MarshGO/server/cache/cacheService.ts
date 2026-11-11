export interface SmartCacheOptions {
  ttlSeconds?: number;
  maxEntries?: number;
}

export class SmartCache<K, V> {
  private map = new Map<K, { value: V; expiresAt: number }>();
  private readonly ttlSeconds: number;
  private readonly maxEntries: number;

  constructor(options: SmartCacheOptions = {}) {
    this.ttlSeconds = options.ttlSeconds ?? 300;
    this.maxEntries = options.maxEntries ?? 1000;
  }

  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    if (this.map.size >= this.maxEntries && !this.map.has(key)) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) this.map.delete(firstKey);
    }
    this.map.set(key, { value, expiresAt: Date.now() + this.ttlSeconds * 1000 });
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.map.clear();
  }

  size(): number {
    return this.map.size;
  }

  toPrometheus(): string {
    return `# HELP marshgo_smart_cache_entries Current cache entries\n# TYPE marshgo_smart_cache_entries gauge\nmarshgo_smart_cache_entries ${this.size()}\n`;
  }
}

export const smartCache = new SmartCache<string, unknown>({ ttlSeconds: 300, maxEntries: 1000 });
