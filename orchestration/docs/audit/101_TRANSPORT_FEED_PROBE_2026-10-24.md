# Ukrainian transport-feed probe — 2026-10-24

## Scope and method

- Read-only execution of `npm run acceptance:transport-feeds` from the dirty root checkout on Node 24.21.0. The probe limits concurrency to two and does not change provider settings or write to a database. The machine emitted UTC `2026-10-23T23:22:19Z` (Europe/Kyiv `2026-10-24T02:22:19`).
- Checked 38 open catalog rows; 5 rows were skipped because their registry access policy does not allow an unauthenticated probe. Counts are endpoint health only, not legal/commercial reuse permission.
- A separate daytime route search used the current dirty Server checkout `feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8d0864fb130f43f8`, plus its local changes. Feed: Lviv public GTFS ZIP; service date Saturday `2026-10-24`, query `08:00–09:30 Europe/Kyiv`, `maximumTransfers=2`, stop radius 2,500 m, limit 100. Exact readout is summarized below; query ran locally using the repository's `cachedGtfsTimetable` and `findGtfsItinerariesWithStats` functions.
- The day-window query is separate from the initial probe's `03:22–04:52` Kyiv window, which was before normal service and returned no journeys. The daytime query avoids treating that early-window result as a routing failure.

## Findings

- Catalog: **43 rows**, **38 checked**, **5 skipped**, **28 healthy**, **7 degraded**, **3 offline**.
- Lviv static GTFS was accessible: **1,071 stops, 72 routes, 15,716 trips, 426,685 stop times** (55 bus, 8 tram, 9 trolleybus routes).
- Both Lviv GTFS-RT endpoints were degraded at probe time: each returned **0 vehicle positions, 0 trip updates, 0 alerts**. This is not live-fleet evidence and must not be shown as live vehicles.
- Daytime Lviv routing returned 100 journeys for each OD in **1.98 s** and **4.24 s**. Both set `searchTruncated=true` and `resultLimitReached=true`; the bounded list is useful, but it is not exhaustive. Sample journey fares were absent, so the UI must keep price unknown rather than present zero.
- Other checked city data included healthy static schedules for Stryi, Uzhhorod, Rivne, Ivano-Frankivsk and Kyiv entries. Live position health varied by source; inspect the attached summary JSON for current counts and per-row states. Kyiv rows that require access were skipped rather than probed.
- CityBikes discovery returned 815 networks and **0 identified Ukrainian networks**. The Zelectra GBFS candidate combined positions from Peru and Ukraine, so it is not a safe Ukrainian service feed. The Nextbike `lv` candidate resolved to Latvia; the `vin` candidate returned HTTP 404. These are candidates/probe outcomes, not enabled Ukrainian micromobility providers.

## Product consequence

- Lviv timetable search can provide scheduled journeys from the real GTFS feed, but the result set is explicitly partial under current graph/search limits. Do not label it exhaustive or promise that the top 100 contain every useful alternative.
- Do not show Lviv fleet icons, real-time arrivals or delay-adjusted ETA from the current empty realtime feeds.
- Keep fare unavailable when the provider supplies no usable fare data.
- Do not enable Zelectra/Nextbike from the global feeds until city coverage, commercial terms, and route/booking semantics are verified.

## Evidence boundary

This was a read-only public-endpoint probe plus local search over the downloaded public GTFS feed. It is not a commercial-rights review, provider contract, live staging integration, physical-device check, load test, or production smoke. No live booking or payment was attempted. The sanitized row-level results are in [`101_TRANSPORT_FEED_PROBE_2026-10-24.json`](101_TRANSPORT_FEED_PROBE_2026-10-24.json).
