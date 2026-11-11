# MARSHGO — PROVIDER FEED ACCEPTANCE MATRIX
**Status Date:** 26.10.2026 17:05 UTC | **Audit:** Google Antigravity Live Probes

This matrix records empirical measurements from live probes executed against external transit feeds and provider APIs. No secret tokens or credentials are leaked in this document.

| Provider / Agency | Transport Mode | City / Region | Feed Type | Auth / Protocol | HTTP Status | Response Time | Freshness (Age) | Live Entity Count | Coverage Sanity | Production Status | Next Required Action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Львівавтодор (GTFS Static)** | Bus, Tram, Trolleybus | Львів | GTFS Static | Open HTTPS (track.ua-gis.com) | `200 OK` | 414 ms | 12.10.2026 archive | 3.75 MB ZIP parsed | Lviv Metropolitan | `VERIFIED_STATIC` | Use frozen snapshot for offline replay; update static cache on schedule. |
| **Львівавтодор (GTFS-RT)** | Bus, Tram, Trolleybus | Львів | GTFS-RT Protobuf | Open HTTPS (track.ua-gis.com) | `200 OK` | 398 ms | **3s old** (Threshold: 90s) | **626 vehicles** (585 fresh <90s, 41 stale) | Bbox: `[23.63, 49.77, 24.16, 49.97]` | `PRODUCTION_LIVE` | Only display vehicles heading toward rider's boarding stop in correct direction. |
| **Стрийська міська рада (GTFS Static)** | Bus | Стрий | GTFS Static | Open HTTPS (track.ua-gis.com) | `200 OK` | 401 ms | 15.10.2026 archive | 446 KB ZIP | Stryi city | `VERIFIED_STATIC` | Parsed in regional catalog. |
| **Стрий (GTFS-RT)** | Bus | Стрий | GTFS-RT Protobuf | Open HTTPS (track.ua-gis.com) | `200 OK` | 39 ms | **3s old** | **27 vehicles** (17 fresh <90s, 10 stale) | Bbox: `[23.69, 49.12, 23.92, 49.34]` | `PRODUCTION_LIVE` | Verified live telemetry. |
| **Рівне (Dozor GTFS Static)** | Trolleybus, Bus | Рівне | GTFS Static | Open HTTPS (city.dozor.tech) | `200 OK` | 377 ms | Scheduled | 146 KB ZIP | Rivne city | `VERIFIED_STATIC` | Mapped in regional catalog. |
| **Рівне (Dozor GTFS-RT)** | Trolleybus, Bus | Рівне | GTFS-RT Protobuf | Open HTTPS (city.dozor.tech) | `200 OK` | 363 ms | **11s old** | **92 vehicles** (87 fresh <90s, 5 stale) | Bbox: `[26.15, 50.56, 26.30, 50.64]` | `PRODUCTION_LIVE` | Verified live telemetry. |
| **Івано-Франківськ (Dozor)** | Trolleybus, Bus | Івано-Франківськ | GTFS Static + RT | Open HTTPS (city.dozor.tech) | `200 OK` | 349 ms | Live | 316 KB static + live protobuf | Ivano-Frankivsk city | `PRODUCTION_LIVE` | Verified live telemetry. |
| **Ужгород (Dozor & City)** | Bus | Ужгород | GTFS Static + RT | Open HTTPS (track & dozor) | `200 OK` | 349 ms | Live | 451 KB static + live protobuf | Uzhhorod city | `PRODUCTION_LIVE` | Verified live telemetry. |
| **Zelectra** | E-Scooter | Київ | GBFS v3.0 | Open HTTPS (zelectra.rideatom.com) | `200 OK` | 792 ms | **0s old** | **921 active scooters** (38 outside UA rejected) | Bbox: `[30.46, 50.38, 30.57, 50.48]` | `PRODUCTION_LIVE` | Deep linking to `zelectra.app.link` validated. Geofence zones active. |
| **inbus.ua** | Intercity Bus | Україна | GTFS Static | Open HTTPS (objectstorage) | `200 OK` | 593 ms | Periodic | 4.4 KB ZIP | Limited routes | `CONDITIONALLY_VERIFIED` | Small dataset, verified timetable parsing. |
| **Одеса (x24.digital)** | Tram, Trolleybus | Одеса | GTFS Static API | API Key Required | `401 Unauthorized` | 474 ms | N/A | 0 | Odesa | `BLOCKED_EXTERNAL` | Awaiting municipality open data API key. |
| **Буча (x24.digital)** | Bus | Буча | GTFS Static API | API Key Required | `401 Unauthorized` | 475 ms | N/A | 0 | Bucha | `BLOCKED_EXTERNAL` | Awaiting API key. |
| **Kiwitaxi** | Private Transfer | Regional | CSV / Partner API | Partner Token Required | Defined | N/A | Static rates | Catalog mapped | Regional airports | `DEMO_ONLY` | Needs active affiliate ID; search separated from booking. |
| **Intui.travel** | Private Transfer | Regional | Partner API | Partner Key Required | Defined | N/A | Static rates | Catalog mapped | Regional airports | `DEMO_ONLY` | Awaiting commercial credentials. |
| **Karhoo / Mozio / Splyt** | Taxi Aggregator | Global / UA | B2B API | Commercial Contract | Defined | N/A | N/A | Interface stubs | Global | `BLOCKED_EXTERNAL` | B2B contract required. |
| **838 Taxi** | Taxi | Україна | Partner Protocol | Dispatch Protocol | Defined | N/A | N/A | Protocol mapped | Ukraine national | `DEMO_ONLY` | Live dispatch contract required. |
| **MARSHGO Rideshare (Попутка)** | P2P Carpool | Україна | In-house DB + WS | JWT User Session | `200 OK` | <20 ms (local) | Realtime (<1s) | DB rides | Ukraine national | `PRODUCTION_READY` | 0% platform fee, atomic seat reservation, consent-based rendezvous tracking. |

---

## Operating Invariants Proven by Probes:
1. **Freshness Filter (<90s)**: Lviv currently provides 626 vehicles of which 585 are <90s fresh. The 41 stale positions are filtered out and will never appear on the user's active route map.
2. **Boundary Culling**: Zelectra feed contains 959 raw scooters, of which 38 test/foreign units outside Ukraine boundary are strictly dropped by `pointIsInsideUkraine()`, leaving exactly 921 valid scooters in Kyiv.
3. **Honest Attribution**: Providers returning HTTP 401 (Odesa, Bucha) are explicitly flagged as `BLOCKED_EXTERNAL`.

---

## Acceptance environment feed state — 2026-10-31 (post-seed, canonical `seedUkraine.ts` run inside `marshgo-acceptance-api-1`)

- Registered `mobility_providers` rows: **52**; enabled with health `healthy` or `degraded`: **21** (lawful open feeds only; every row health-checked live at seed time).
- Proven end-to-end over public zrok HTTPS (`https://marshgo-dima.shares.zrok.io/api/v1/journeys/search`): Lviv city BALANCED → real WALK+BUS+WALK journeys (Львівавтодор GTFS); Lviv→Kyiv intercity → WALK+RAIL+WALK and WALK+TRAM+WALK+RAIL+WALK chains (Львівавтодор + Укрзалізниця GTFS).
- Honest gaps in this environment: fares disclosed `UNKNOWN` (never zero); walking legs are straight-line estimates (`WALKING_ROUTING_URL` intentionally unset until a verified foot-profile router is configured); marshrutka/trolleybus/metro/taxi/bike/carsharing/transport-type providers report `no-routed-provider-in-corridor` for the tested Lviv corridors — availability is search-corridor-specific, not a feed health failure.
- Evidence file: `.release/zrok-live-journey-evidence.json` (keys `lviv_city_balance`, `lviv_kyiv_intercity_balance`, `seed_final_state_2026_10_31`).

### Feed state update — 2026-10-31 after the single-agency probe fix

Enabled feeds moved 21 → 22. `Біла Церква — розклад (GTFS, Dozor)` is now `enabled/healthy` and produced two verified
scheduled bus journeys through the live API (evidence: `bila_cerkva_end_to_end_2026_10_31`). `Рівне` now passes the
agency-timezone check via the Ukraine fallback but stays honestly disabled: the feed publishes no service in the next
7 days. Both rely on an uncommitted `server/mobility/gtfs.ts` change, so re-provisioning from `fc5b589` reverts the
count to 21 until the fix is committed.
