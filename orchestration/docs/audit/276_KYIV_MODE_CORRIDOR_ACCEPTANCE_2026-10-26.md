# 276 — Kyiv route corridor and mode acceptance (2026-10-26)

## Scope and environment

- Read-only provider discovery and temporary authenticated searches through the local development API at `127.0.0.1:3311`; no production endpoint was used.
- Searches used random synthetic passenger records in the local `marshgo` database. The script removed each synthetic user, role, and generated journey in `finally`; a post-timeout check found no leftover synthetic user.
- Transit searches selected only the four Kyiv city-network modes under test: bus, tram, trolleybus, metro. They used public station/square coordinates and the current local GTFS/metro data.
- Search results are schedule-based; they are not live vehicle positions. API marked each result set `partial=true`, with no upstream provider errors, because pedestrian access/transfer routing is not configured and the walking connectors are straight-line estimates.

## Verified corridors

| Corridor | Returned route modes | Evidence |
|---|---|---|
| Вокзальний район → Контрактова площа | Bus, tram, metro | Local search returned route alternatives: bus via Залізничний вокзал → Поштова пл.; tram via вул. Старовокзальна → Контрактова пл.; metro via Вокзальна → Хрещатик → Майдан Незалежності → Контрактова площа. |
| Вокзальна → Палац спорту | Bus, trolleybus, metro | Local search returned alternatives in all three modes, including trolleybus from Залізничний вокзал and metro via Театральна ↔ Золоті Ворота. |
| Контрактова площа → площа Тараса Шевченка | Tram, trolleybus | Local search returned tram №19 to пл. Шевченка and trolleybus alternatives. The official Kyivpastrans schedule lists tram 19 on this corridor; see [official schedule](https://beta.kpt.kyiv.ua/schedule/tram/19). |

No single queried corridor returned all four city modes together. The first two corridors together exercise the currently routed Kyiv bus, tram, trolleybus, and metro categories. The official Kyiv open-data catalog identifies its GTFS Static feed as covering city bus, tram, and trolleybus; it also documents a commercial-use open-data license with attribution. See [Kyiv GTFS Static dataset](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport/resource/58f0c3d0-9409-4de9-92c8-de4afa035efd).

## Other canonical categories

- Kyiv provider discovery listed Community carpool, bus, minibus geometry, trolleybus, tram, metro, national rail, city rail, funicular, intercity bus, and Zelectra scooter data.
- Catalog presence is not route availability. The earlier four-transit-mode searches had no routed option for minibus, taxi, train, bike, scooter, carsharing, or transfer. The minibus record is geometry-only; rail is not applicable to these short intra-city queries. The later all-mode morning searches did return estimated scooter options, documented below.
- The catalog had no bike, taxi, carsharing, or transfer provider at the tested Kyiv endpoint. Community carpool is listed, but no matching driver offer was established for these city corridors. Scooter GBFS provider data exists; the morning route estimates are not proof of an available vehicle or a bookable ride.
- Therefore it would be misleading to mark every category active or expect all 12 transport modes in one route. Use all 12 in UI availability tests, while route acceptance asserts only categories for which the corridor returns a real route/provider.

## Runtime note and next action

- An initial broad 12-category attempt at an unsuitable late-night departure exceeded the 30-second command window. This was not evidence that the route engine was hung. A corrected request for the next Kyiv-local morning departure completed successfully; see the addendum below.
- Next: use the morning corridor for web/API acceptance, test unsupported-category messaging separately, and investigate GTFS candidate/search completeness and walking-router setup before making any completeness claim.
- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. No deployment, payment, real booking, or user GPS data was used.

## Addendum — broad 12-category morning searches

The earlier timeout conclusion is superseded by a correctly timed repeat on the same local development API. Both searches used the next morning's Kyiv-local 08:00 departure (2026-10-27T06:00Z), all 12 canonical mode preferences, local test records, and cleanup after each request.

| Corridor | Duration | Returned options | Modes present in returned options | Other response facts |
|---|---:|---:|---|---|
| Вокзальний район → Контрактова площа | 12.2 s | 17 | Metro, scooter, tram, bus | `partial=true`; BALANCED, FASTEST, CHEAPEST available |
| Вокзальна → Палац спорту | 15.7 s | 15 | Metro, scooter, trolleybus, bus | `partial=true`; BALANCED, FASTEST, CHEAPEST available |

These are local schedule/routing results, not proof of live vehicle positions, bookable scooters, scooter availability, or fares. The scooter path is estimated from provider/geofence data; availability, pricing, and booking are unconfirmed. The responses remain partial because the walking router is unavailable and pedestrian access/transfer connectors are not verified walking geometry. The two requests together exercised five mode types in result options, but did not activate all twelve.

For the broadest one-query sample, use **Вокзальний район → Контрактова площа** at 08:00. It returned bus, tram, metro, and scooter alternatives. To exercise trolleybus too, use **Вокзальна → Палац спорту**. Neither corridor proves all-mode coverage; taxi, bike, carsharing, transfer, minibus, train, and carpool did not produce matching options in these searches. Catalog rows alone are not route availability.

The local search used temporary synthetic passengers/journeys only and removed them after each call; a cleanup check found no remaining synthetic users. No production endpoint, real account, real booking, or user GPS was used. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Client availability mismatch and local verification

The local API could return a GBFS-backed estimated scooter itinerary, but the client search-mode model treated scooter as unsupported and excluded it from search preferences. Updated the current dirty Site source so a scooter can be selected only when provider discovery reports an available GBFS scooter provider. Scooter stays separate from public-transit provider filters; bike remains unavailable until a bike itinerary adapter is verified. This does not claim live scooter inventory, fare, or reservation.

- Root checkout: `codex/production-finalization-20261014`, HEAD `affef61e4706b2b9ce95c3ab4c2f5e2c0607e1dd` (pre-existing dirty tree preserved).
- Server checkout: `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0` (pre-existing dirty tree preserved).
- Site verification on Node 24.22.1: transport-preferences tests 11/11; full unit suite 259 pass / 1 opt-in integration skip / 0 fail; typecheck and focused ESLint pass; production build pass; `git diff --check` pass.
- Browser catalogue E2E: 1/1 pass. It verified the 12 canonical tiles and their unavailable state in the isolated Stryi fixture; it did not test live Kyiv provider discovery.
- The first E2E attempt correctly refused an ordinary production bundle; the isolated map-fixture build was created under `/tmp/marshgo-mode-catalog-e2e-20261026` and the test then passed.
- Code changes are local and uncommitted because both files contain pre-existing dirty edits. No production deploy or real reservation was performed.
