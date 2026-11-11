# Lviv live feed and runtime acceptance — 2026-11-09

## Pinned execution

- Server source: current `main` SHA `ba158074ee45ca70486cef10462f9860942e1fa7`.
- GitHub Actions workflow run: [42544916064](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/42544916064), job `128927704357`, completed failure at 2026-11-09 01:19:20 UTC. Workflow used GitHub-hosted Linux/Node 24, made no database writes and used no user addresses.
- Retained artifact: `lviv-live-transit-ba158074ee45ca70486cef10462f9860942e1fa7/lviv-route-acceptance.json` (downloaded to `/private/tmp/marshgo-live-evidence-42544916064/`).

## Static GTFS → planner evidence

- Lviv feed parsed: 1,071 stops, 72 routes, 15,141 trips, timezone `Europe/Kyiv`, service date `20261109`; query window `2026-11-09T13:00Z`–`14:30Z`.
- Center → main station: 10 candidates; examples include bus A25, Магнус (13) → Скриня (113), 13:00–13:29Z.
- North → Sykhiv: 10 candidates; an observed two-leg chain is bus A21, Щепова (865) → Площа Лема (470), then tram T04, Площа Лема (505) → Центр Довженка (791), 13:00–14:08:44Z.
- Both searches are explicitly incomplete. `stopSelection`, `candidateGraph`, `candidatePool`, `candidateSampling`, and `responsePage` truncation are true; `searchBudget` and `searchStepLimit` are false. Estimated graph demand was 130,144 / 224,728 segments; 99,826 / 98,962 were retained under the 100,000 graph ceiling. Final sampled pools held 254 / 255 itineraries and contained no three-leg candidates for these two queries. This demonstrates graph/sampling pressure; it does **not** prove that a specific feasible three-leg service existed in these selected time windows.

## Realtime evidence

- Lviv GTFS-RT endpoint was accessible and parsed as valid protobuf, age 6 seconds, but returned 0 vehicles, 0 trip updates and 0 alerts. Feed health is `DEGRADED`; it provides no live position/prediction evidence for this observation.

## Walking router and application boundary

- One direct read-only request to the already-running local Lviv OSRM foot router (`127.0.0.1:3013`) returned `Ok`, distance 3,986.3 m, duration 2,873.8 s, GeoJSON `LineString` with 242 coordinates; snapped endpoints were within several metres of the request.
- This proves an upstream walking route sample only. It does not prove API ingestion, route-leg stitching, Site map rendering, or navigation.
- Current Site/API paths returned HTTP 502 for `/readyz` and `/api/v1/places/suggest?q=Lviv`; there was no Server listener on `:3002` or `:3007`. UI/API/provider integration remains blocked on the isolated API runtime.

## Decision

- Do not label all 12 modes live or the Lviv search complete. The static GTFS sample proves schedule-backed bus and tram candidates, including one two-leg chain; GTFS-RT was empty at probe time. No feed was activated or database changed.
- Preserve the existing truncation contract. Prior route-cap/sampler experiments in audits 282–300 were rejected or did not establish complete search; do not repeat cap increases or hide flags. Next routing work requires a specific omitted feasible chain traced through stop selection → graph retention → candidate sampling and an exhaustive fixture oracle.
- Full page browser acceptance and Site API → map verification remain NOT_RUN because the API runtime is unavailable. Production remains `NOT_RELEASED`.
