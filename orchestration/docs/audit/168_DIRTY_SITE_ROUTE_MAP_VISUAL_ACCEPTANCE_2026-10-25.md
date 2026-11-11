# Dirty Site route-map visual acceptance — 2026-10-25

## Scope and source identity

- Site checkout: `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`, branch `codex/sync-journey-mobility-ui`, committed HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`, 40 dirty paths at the start of this follow-up. The checkout was already dirty; no reset, broad staging, commit, push, or deployment was performed.
- Server checkout used by the local E2E runner: `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, 37 dirty paths. API started only through the test runner against isolated `marshgo_e2e` fixtures.
- Central E2E runner: `/Users/dima1203/Desktop/MarshGO`, branch `codex/production-finalization-20261014`, HEAD `0d068f7104d3cdedde9edb57a1be781df5e86491`, dirty. The root E2E test and reference snapshots were changed additively; unrelated files were not modified intentionally.
- Runtime was Node `25.4.0`; Site pins `24.21.0`. Functional results are recorded; any timing implications would be exploratory.

## Product change and visual review

- Capped the mobile map-layers sheet at `60dvh` / `60svh`, retaining the existing bottom offset above persistent navigation. This leaves approximately the upper third of a short mobile viewport available to the map, while longer layer controls remain scrollable inside the sheet. Desktop sizing remains unchanged.
- Updated E2E geometry assertions to require a visible map region, preserve the global navigation, and verify the full layer list by scrolling to its final item.
- Reviewed the actual mobile light-theme rendering before updating only the two layer-panel screenshot references (`transport-map-layers-light`, `navigation-light-layers`). A navigation screenshot was also updated after manual review showed only a 27-pixel localized MapLibre puck rasterization difference; this does not widen screenshot tolerances.
- Corrected stale fixture assertions for current registry colors: Ferry `#0891B2` and Funicular `#64748B`. Existing test assertions for route geometry, city feed disclosure, and transport colors were aligned to inspected production-path source/registry behavior; screenshots were not bulk-refreshed.

## Local evidence

- Focused visual/browser flow: `E2E_DIST_DIR=.../MarshGO-Site/dist E2E_SERVER_DIR=.../MarshGO-Server E2E_API_PORT=3302 npm run test:e2e -- e2e/journey-route-map.spec.ts -g 'canonical route map synchronizes'` — **1/1 PASS** on the final run (about 1.2 minutes). It exercised route-sheet snap states, route details, stop times, segment focus, map layers, light/dark styling, active navigation, fixture-backed transport map, sheet scrolling, and scheduled ferry/funicular intermediate stops.
- Dirty Site: `npm run typecheck` PASS; `npm run lint` PASS; `npm test` **98/98 PASS**; production build PASS; `npm run check:bundle` PASS (16 JS chunks at or below 350 KB gzip; largest was 285.81 KB); `git diff --check` PASS.
- The isolated E2E uses test fixtures and local test services only. It does not establish live provider/AVL operation, licensed production map assets, full-site/page/control acceptance, staging, physical iPhone behavior, or production readiness.

## Remaining status

- Visual acceptance is still partial: the complete set of supplied mockups, other production pages, licensed satellite/map imagery, and all remaining light/dark combinations have not been accepted.
- Dense Lviv GTFS search remains truncated; the dirty timetable replay matched HEAD outputs without a recall gain (audit 166).
- Staging, external credentials/entitlements, production deployment, physical iPhone acceptance, security/load/recovery/backup-restore gates, and final release approval remain open.
- No release status was changed: `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
