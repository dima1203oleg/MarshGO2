# Route-map browser acceptance — 2026-10-22

## Scope and exact candidate

- Server: `27ca486d66fa9b30b8559e4b1041ccca67f1d283` (open PR #24 candidate).
- Site: `c50ba344b7dfde9859826363fea119d95e2cc54e` (open PR #14 candidate).
- Local orchestration checkout HEAD: `f944560a3babf7423befc53741217d9281f44dab`, with pre-existing and active local changes. Candidate Server/Site were materialized by the browser harness.
- Test data/services: isolated loopback `marshgo_e2e` PostGIS, local Redis, deterministic map/geocoder/OSRM fixtures. No live operator was queried.

## Results

- Focused route-map behavior scenario: **1/1 Chromium PASS**. It covered route strategy switching; route summary and stop details; map camera focus; active-leg selection; the fixture-backed full transit-line overlay in both directions; four fixture vehicle markers with three emphasized; switch back to a non-transit leg; alternate itinerary and return-to-results/navigation behavior.
- The behavior-only rerun used a named Playwright project that skips snapshots. This establishes interaction assertions only.
- Separate strict screenshot comparison against snapshots extracted from clean orchestration HEAD failed at `journey-route-map-light-half.png`: 121 differing pixels. Image inspection localized the delta to one intermediate map marker; map/sheet geometry and the remaining displayed content align. No tolerance was expanded and no snapshot was rewritten.
- The repository's existing modified screenshot goldens differ substantially from the clean-root screenshot, so their authorship and approval still require reconciliation. They remain untouched.
- Full corrected local browser suite previously recorded **12/13 PASS / 1 FAIL**, with the remaining failure being visual screenshot mismatch. The exhaustive button audit independently passed **157/158 clickables**; 13 no-visible-effect heuristic logs require review. These counts are not a staging result.

## Cleanup and limitations

Only the local `db` and `redis` Compose services used by the test were started. Both were stopped after testing, their named volumes preserved, and `docker compose ps` confirmed no active Compose service. The temporary Playwright config was removed. No staging or production service was modified.

This report does not establish live GTFS-realtime accuracy, real user/device behavior, staging acceptance, visual approval, or production readiness.

## Exact strict visual rerun — 22.10.2026

- Re-ran `e2e/journey-route-map.spec.ts` against materialized Server `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / Site `c50ba344b7dfde9859826363fea119d95e2cc54e`, Node 24.21.0, iPhone 16 viewport, loopback PostGIS/Redis and local map/geocoder/OSRM fixtures. The first strict assertion fails on `journey-results-light.png`: **38,180 differing pixels / 12%**. Playwright captured actual and diff images. Visual inspection shows broad component-style differences in the result cards/action controls versus the existing modified PNG; this is not evidence by itself that either image is the approved design.
- Re-ran the same route-map scenario with the named Chromium compatibility project, which skips only pixel snapshots. Result: **1/1 PASS in 48.0 seconds**, including route sheet behavior, stop details, map focus, and light/dark palettes.
- The repository's screenshot golden is already modified and uncommitted. Neither the golden nor user-owned screenshots were regenerated or overwritten. The separate screenshot gate remains `PARTIAL` until its approved source is identified.
- Started only the root loopback PostGIS and Redis Compose services for the tests, then stopped both. `docker compose ps` is empty; named volumes were preserved.

## Next action

Review button-audit observations and the one-marker screenshot delta against the approved route-map design. Preserve all working-tree screenshot files until ownership is established. Rerun the full browser matrix on a reconciled candidate; then continue staging and deployment gates when the real environment and credentials are available.

## Cross-browser follow-up

- After waiting for healthy loopback PostGIS and Redis, `npm run test:browser-compat` passed **6/6**: responsive production entrypoints at 320/390/440/768/1440/1920 px and route-map behavior in Chromium, Firefox and WebKit.
- Local Node was `v26.7.0`, not pinned Node 24.21.0. Named browser projects skip screenshot assertions; therefore this is behavioral compatibility, not strict visual acceptance or physical iPhone Safari.
- The first invocation raced container readiness and failed in database setup before browser tests; the health-gated retry passed. Test containers were stopped; named volumes preserved.

## Pinned Node confirmation

The same cross-browser suite was rerun on Node **24.21.0**, the repository's pinned runtime, and passed **6/6** on the exact materialized Server/Site SHA pair. Each of Chromium, Firefox and WebKit passed responsive production entrypoints at six viewport widths and route-map behavior. This replaces the earlier Node 26.7.0-only local evidence for this test suite. It still skips screenshot pixel gates and uses deterministic local providers.

## Latest continuation — exact current Server PR head and Site pin

- Refreshed GitHub metadata on 2026-10-22: Server PR #24 is OPEN/DRAFT at exact head `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c`, with both current `verify` runs `39689594787` and `39689590022` SUCCESS. Site PR #14 remains at `c50ba344b7dfde9859826363fea119d95e2cc54e`; iOS PR #9 remains at `7df237845d8841a98a5c15082677ec4198728339` and its listed simulator checks are green. All PRs remain unmerged.
- The root release manifest was still pinning the older Server SHA `9b0228dd23fdd69d59287c16d413d2a541ec601d`. The latest Server source has no migration changes relative to that pin and accepts the Site's `allowBicycle` preference. Previous 400 responses came from accidentally running the dirty orchestration Server instead of a candidate Server; those responses are not counted against either PR candidate.
- Against exact Server `d128e9b…` + Site `c50ba3…`, the isolated local PostGIS/Redis marketplace suite passed **9/9**: time-picker persistence, canonical transport catalogue, onboarding/location permission, two-account search/booking/negotiation/chat, driver multi-rider stop order and GPS rerouting, iPhone-sized foreground route layouts, denied-GPS recovery, search URL restoration, and Journey Planner Community offer/strategy metadata.
- Against the same exact pair, responsive Home/Search and route-map behavior passed **6/6** across Chromium, Firefox and WebKit. Viewports were 320, 390, 440, 768, 1440 and 1920 px; the route scenario checked strategy switching, stop details, segment map focus, light/dark themes, and fixture-backed transit line/vehicle overlays.
- Runtime for this latest direct run was the host Node `v26.7.0`, not repository-pinned Node `24.21.0`; exact-head Server CI uses the pinned runtime and is green. Browser screenshots were generated in the local test run, but this compatibility project skips pixel-baseline assertions. No snapshot was overwritten.
- This is local fixture acceptance, not live operator, staging, production, or physical-iPhone acceptance. Strict visual baseline remains unresolved: the prior comparison showed broad differences against a modified/unapproved screenshot golden, so the snapshot gate remains `PARTIAL`.
- The run used loopback PostGIS on `5544` and Redis on `6381`, with isolated database `marshgo_e2e_codex_20261022_9f2a6c`. Post-run inspection showed both containers predate this session (`marshgo-cache-e2e-postgres` created 2026-10-13; Redis is a healthy service in the separate `marshgo-server-cache` Compose project) and each has a persistent named volume. Neither was started, stopped, or modified; volumes/data were preserved. No staging or production service was touched.


### Повтор exact-candidate acceptance на pinned Node — 22.10.2026

- Повторено під Node **24.21.0** на exact Server `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c` + Site `c50ba344b7dfde9859826363fea119d95e2cc54e`.
- Marketplace E2E: **9/9 PASS**. До запуску створено нову loopback PostGIS базу `marshgo_e2e_prodcheck_20261022`; на ній застосовано чисті міграції Server `001–055`. Перевірені час/дата, 12 категорій, onboarding, два акаунти й booking/чат, водій і GPS reroute, denied GPS, URL reload та Journey Planner.
- Browser compatibility: **6/6 PASS** по Chromium/Firefox/WebKit; Home/Search і route-map interactions; перевірено viewport-и `320/390/440/768/1440/1920px`.
- Map, geocoder та OSRM лишалися локальними fixture-ами; це не live provider/staging. Pixel snapshots були пропущені compatibility-проєктами, жоден snapshot не змінювався. Фізичний iPhone/Safari не тестувався.
