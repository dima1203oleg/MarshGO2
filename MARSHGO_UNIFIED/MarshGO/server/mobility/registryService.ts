import type {
  ProviderRegistryEntry,
  ProviderHealth,
  AccessStatus,
  ProviderCategory,
} from '../../shared/mobility/interfaces';
import { ukraineCatalog, ukraineCatalogWave2, kyivOpenDataCatalog } from './ukraineCatalog';

export class MobilityRegistryService {
  private static instance: MobilityRegistryService;
  private entries: Map<string, ProviderRegistryEntry> = new Map();
  private healthMap: Map<string, ProviderHealth> = new Map();

  private constructor() {
    this.seedCatalog();
  }

  public static getInstance(): MobilityRegistryService {
    if (!MobilityRegistryService.instance) {
      MobilityRegistryService.instance = new MobilityRegistryService();
    }
    return MobilityRegistryService.instance;
  }

  private seedCatalog(): void {
    // 1. Kyiv Open Data Official Catalog
    for (const item of kyivOpenDataCatalog) {
      const id = `kyiv-opendata-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const label = item.name.toLocaleLowerCase('uk');
      const geoJsonCapabilities = item.sourceType === 'geojson'
        ? label.includes('станц')
          ? ['TRANSIT_STOPS']
          : ['TRANSIT_ROUTES', 'TRANSIT_GEOMETRY']
        : [];
      this.register({
        id,
        name: item.name,
        category: 'PUBLIC_TRANSIT',
        cities: ['Київ'],
        integrationType: 'OPEN_DATA',
        accessStatus: item.access === 'open' ? 'AVAILABLE' : 'REQUIRES_CONTRACT',
        runtimeStatus: 'NOT_CONFIGURED',
        // The city portal publishes several distinct GeoJSON layers. A line layer
        // is not a stop list or a timetable, and a station layer is not a route.
        capabilities: geoJsonCapabilities,
        documentationUrl: item.sourceRef,
        requiresAuth: false,
        enabled: item.access === 'open',
        license: item.license,
        updateFrequency: item.updateFrequency,
        coverage: item.coverage,
        sourceAttribution: 'Портал відкритих даних Києва (data.kyivcity.gov.ua)',
      });
    }

    // 2. Nationwide / Lviv Catalog
    for (const item of [...ukraineCatalog, ...ukraineCatalogWave2]) {
      const id = `ua-${item.city.toLowerCase()}-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const isAvailable = item.access === 'open';
      const accessStatus: AccessStatus = item.access === 'open'
        ? 'AVAILABLE'
        : item.access === 'requires_credentials'
        ? 'REQUIRES_KEY'
        : item.access === 'requires_partner_access'
        ? 'REQUIRES_CONTRACT'
        : 'BLOCKED';

      const category: ProviderCategory = item.providerType === 'scooter' ? 'MICROMOBILITY' : 'PUBLIC_TRANSIT';
      const capabilities: string[] = [];
      if (item.sourceType === 'gtfs') capabilities.push('TRANSIT_TIMETABLE', 'TRANSIT_STOPS', 'TRANSIT_ROUTES');
      if (item.sourceType === 'gtfs_rt' || item.sourceType === 'json') capabilities.push('LIVE_VEHICLE_POSITIONS');
      if (item.sourceType === 'gbfs') capabilities.push('MICROMOBILITY_AVAILABILITY');

      this.register({
        id,
        name: item.name,
        category,
        cities: [item.city],
        integrationType: item.access === 'requires_partner_access' ? 'PARTNER_API' : 'OPEN_DATA',
        accessStatus,
        runtimeStatus: 'NOT_CONFIGURED',
        capabilities,
        documentationUrl: item.sourceRef,
        requiresAuth: item.access === 'requires_credentials',
        enabled: isAvailable,
        license: item.license,
        updateFrequency: item.updateFrequency,
        coverage: item.coverage,
        sourceAttribution: item.sourceRef,
      });
    }

    // 3. Commercial Partners & External APIs
    this.register({
      id: 'uklon-partner',
      name: 'Uklon',
      category: 'RIDE_HAILING',
      cities: ['Київ', 'Львів', 'Дніпро', 'Одеса', 'Харків'],
      integrationType: 'PARTNER_API',
      accessStatus: 'REQUIRES_CONTRACT',
      runtimeStatus: 'NOT_CONFIGURED',
      capabilities: [],
      documentationUrl: 'https://uklon.com.ua',
      requiresAuth: true,
      enabled: false,
      coverage: 'Міста присутності споживчого сервісу не підтверджують доступ до партнерського API',
      sourceAttribution: 'Потрібно підтвердити партнерський контракт та API capabilities',
    });

    this.register({
      id: 'bolt-partner',
      name: 'Bolt',
      category: 'RIDE_HAILING',
      cities: ['Київ', 'Львів', 'Дніпро', 'Одеса', 'Вінниця'],
      integrationType: 'PARTNER_API',
      accessStatus: 'REQUIRES_CONTRACT',
      runtimeStatus: 'NOT_CONFIGURED',
      capabilities: [],
      documentationUrl: 'https://bolt.eu',
      requiresAuth: true,
      enabled: false,
      coverage: 'Покриття API для MARSHGO не підтверджене; міста споживчого сервісу не є API coverage',
      sourceAttribution: 'Потрібно підтвердити партнерський контракт та API capabilities',
    });

    this.register({
      id: 'uber-api',
      name: 'Uber',
      category: 'RIDE_HAILING',
      cities: [],
      integrationType: 'PUBLIC_API',
      accessStatus: 'REQUIRES_KEY',
      runtimeStatus: 'NOT_CONFIGURED',
      capabilities: [],
      documentationUrl: 'https://developer.uber.com',
      requiresAuth: true,
      enabled: false,
      coverage: 'Наявність споживчого сервісу не підтверджує доступність Rides API для MARSHGO',
      sourceAttribution: 'Потрібно підтвердити продукт API, ключ і територіальні умови',
    });

    this.register({
      id: 'nextbike-lviv-unverified',
      name: 'Nextbike GBFS — покриття України не підтверджене',
      category: 'MICROMOBILITY',
      cities: [],
      integrationType: 'OPEN_DATA',
      accessStatus: 'UNVERIFIED',
      runtimeStatus: 'DEGRADED',
      capabilities: [],
      documentationUrl: 'https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_lv/gbfs.json',
      requiresAuth: false,
      enabled: false,
      coverage: 'Живий probe 2026-10-19 повернув станції поза Україною; мережа Львова не підтверджена',
      sourceAttribution: 'Nextbike GBFS — потребує перевірки конкретної мережі',
    });

    this.register({
      id: 'monobank-acquiring',
      name: 'monobank Acquiring',
      category: 'PAYMENT',
      cities: ['Україна'],
      integrationType: 'PARTNER_API',
      accessStatus: 'REQUIRES_KEY',
      runtimeStatus: 'NOT_CONFIGURED',
      capabilities: ['INVOICE_CREATION', 'WEBHOOK_VERIFICATION', 'REFUNDS', 'APPLE_PAY', 'GOOGLE_PAY'],
      documentationUrl: 'https://monobank.ua/api-docs/acquiring',
      requiresAuth: true,
      enabled: false,
      sourceAttribution: 'АТ «УНІВЕРСАЛ БАНК»',
    });

    this.register({
      id: 'kyiv-parking-opendata',
      name: 'Київтранспарксервіс — Паркувальні майданчики',
      category: 'PARKING',
      cities: ['Київ'],
      integrationType: 'OPEN_DATA',
      accessStatus: 'AVAILABLE',
      runtimeStatus: 'NOT_CONFIGURED',
      capabilities: ['PARKING_LOCATIONS', 'TARIFF_DATA', 'CAPACITY_INFO'],
      documentationUrl: 'https://data.kyivcity.gov.ua/dataset/perelik-mists-dlya-parkuvannya',
      requiresAuth: false,
      enabled: true,
      sourceAttribution: 'КП «Київтранспарксервіс» (data.kyivcity.gov.ua)',
    });

    this.register({
      id: 'kyiv-road-closures-opendata',
      name: 'Київ — Перекриття та обмеження руху',
      category: 'TRAFFIC',
      cities: ['Київ'],
      integrationType: 'OPEN_DATA',
      accessStatus: 'AVAILABLE',
      runtimeStatus: 'NOT_CONFIGURED',
      capabilities: ['ROAD_CLOSURES', 'INCIDENT_OVERLAY'],
      documentationUrl: 'https://data.kyivcity.gov.ua/dataset/obmezhennya-ruhu',
      requiresAuth: false,
      enabled: true,
      sourceAttribution: 'Департамент транспортної інфраструктури КМДА',
    });

    this.register({
      id: 'marshgo-internal-carpool',
      name: 'MARSHGO Попутки',
      category: 'CARPOOL',
      cities: ['Україна'],
      integrationType: 'INTERNAL',
      accessStatus: 'AVAILABLE',
      runtimeStatus: 'HEALTHY',
      capabilities: ['PASSENGER_DEMANDS', 'DRIVER_OFFERS', 'SPATIAL_DETOUR_MATCHING', 'LIVE_NAVIGATION'],
      requiresAuth: false,
      enabled: true,
      sourceAttribution: 'MARSHGO Core Engine (0% commission)',
    });

  }

  public register(entry: ProviderRegistryEntry): void {
    this.entries.set(entry.id, entry);
    if (!this.healthMap.has(entry.id)) {
      this.healthMap.set(entry.id, {
        status: entry.runtimeStatus,
        lastCheckedAt: new Date().toISOString(),
      });
    }
  }

  public get(id: string): ProviderRegistryEntry | undefined {
    return this.entries.get(id);
  }

  public getAll(): ProviderRegistryEntry[] {
    return Array.from(this.entries.values());
  }

  public getActive(): ProviderRegistryEntry[] {
    return this.getAll().filter(
      (e) => e.enabled && e.accessStatus === 'AVAILABLE' && e.runtimeStatus === 'HEALTHY'
    );
  }

  public getByCity(city: string): ProviderRegistryEntry[] {
    return this.getAll().filter(
      (e) => e.cities.includes(city) || e.cities.includes('Україна')
    );
  }

  public getByCategory(category: ProviderCategory): ProviderRegistryEntry[] {
    return this.getAll().filter((e) => e.category === category);
  }

  public updateHealth(id: string, health: Partial<ProviderHealth>): void {
    const existing = this.healthMap.get(id) || {
      status: 'NOT_CONFIGURED',
      lastCheckedAt: new Date().toISOString(),
    };
    const updated: ProviderHealth = {
      ...existing,
      ...health,
      lastCheckedAt: new Date().toISOString(),
    };
    this.healthMap.set(id, updated);

    const entry = this.entries.get(id);
    if (entry) {
      entry.runtimeStatus = updated.status;
    }
  }

  public getHealth(id: string): ProviderHealth | undefined {
    return this.healthMap.get(id);
  }
}

export const mobilityRegistry = MobilityRegistryService.getInstance();
