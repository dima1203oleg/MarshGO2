# Kyiv Metro and minibus capability truthfulness — 2026-10-27

## Finding

Gemini 4 Argon independently inspected the bound canonical MarshGO workspace and found a user-visible mismatch:

- `server/mobility/ukraineRegionalCatalog.ts` advertises Kyiv `metro` as enabled with `SEARCH` and `SCHEDULE_ESTIMATE` based on geometry/station GeoJSON. Kyiv `marshrutka` is already `LIMITED` and disabled in the current dirty diff, with route-geometry-only capabilities.
- The journey search handler in `server/index.ts` selects only enabled, open `source_type='gtfs'` providers for scheduled routing. Geometry-only `geojson` sources are not loaded by the timetable planner; unsupported requested modes are reported as partial results.
- Kyivpastrans GTFS static feed has bus, tram, trolleybus, but no metro/minibus timetables. Official Kyiv route/metro geometry endpoints currently redirect to a stage host and return 403.
- `server/journey/multimodalChainEngine.ts` contains a disconnected Kyiv graph/model; repository search found no caller. Its presence is not proof of production route planning or current source-derived schedules/fares.

## Change and verification

- In the integrated MarshGO workspace, changed only the Kyiv Metro regional catalog DTO to `enabled: false`, retain `availability: 'LIMITED'`, and expose only map geometry/station capabilities. The reason now explicitly says metro trips are not planned without an active timetable in the route engine.
- Updated `tests/regional-mode-catalog.test.ts` to assert metro is disabled for search and exposes map-only capabilities.
- Targeted test: `tests/regional-mode-catalog.test.ts` — 5/5 PASS.
- ESLint on the two touched files — PASS. `git diff --check` — PASS.
- No Server PR/worktree was modified; the existing isolated Server PR worktree does not contain this regional catalog file. Therefore this fixes the integrated local product metadata only; cross-repository source synchronization remains open. No staging/production verification or deployment.

## Status / next action

### Follow-up correction — runtime ownership check (2026-10-27 20:43 UTC)

The earlier statement that this catalog mismatch was user-visible was not established. A targeted repository search found `getTransportCatalogForCity()` referenced only by `tests/regional-mode-catalog.test.ts`; `productionApi.transportTypesCatalog()` and `transportRegions()` also have no runtime call sites. Therefore the previous catalog DTO change is test-only metadata in the current production flow and must not be described as fixing the UI.

The active search flow is `ProductionMarketplace` → `productionApi.providersByTransport()` (`GET /api/v1/mobility/providers`) → `TransportTypesPanel` and `src/domain/transportPreferences.ts`. `providerCanRoute()` requires GTFS for transit (GBFS for scooter; MARSHGO for carpool), and the journey handler loads open GTFS providers only. GeoJSON-only geometry does not activate scheduled route search. Map geometry remains a separate capability.

Added a targeted client regression in `tests/transport-preferences.test.ts` for Metro/minibus GeoJSON-only providers; the focused suite passes 12/12. The earlier regional catalog assertions remain useful only for that helper's DTO semantics. Actual Kyiv Metro/minibus timetable routing remains unavailable without a permitted timetable source. No staging/production verification or deployment occurred; production remains `NOT_RELEASED`.

Next: keep the production search behavior tied to provider capability evidence and only make a server-contract/UI change if a live endpoint test demonstrates a false availability response or user-visible mismatch.

