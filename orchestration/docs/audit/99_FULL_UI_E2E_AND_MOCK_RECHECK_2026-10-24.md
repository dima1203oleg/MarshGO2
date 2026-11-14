# Full UI E2E and mock-design recheck — 2026-10-24

## Latest continuation — 2026-10-24

- Follow-up on separate Site candidate `codex/map-layers-reference-layout-20261024` (`d7fc931d80e76663b5dc24929f7b323651fbbffa`): added a fullscreen expansion of the confirmed rendezvous map, safe-area header/back action, approach/arrival/stop-sharing controls in the map sheet, and z-order above the global tab bar. Candidate `typecheck`, `lint`, `build`, **103/103 unit tests** and candidate-dist `e2e/rendezvous-map.spec.ts` **2/2** pass. The E2E verifies expand/collapse, overlay stacking, and the arrival action POST using fixtures. Screenshot: `/tmp/marshgo-rendezvous-map-fullscreen.png` (fixture map tiles, not the live licensed map style). This candidate change is not the Site SHA in `RELEASE_MANIFEST.json`, and has not been deployed.

- On the release-manifest fixture tuple (Server `134ed017828a020e1d5f696b3cb9ea95527bb093`, Site `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9`), `E2E_SKIP_VISUAL=1 npm run test:e2e -- e2e/button-audit.spec.ts` passed **4/4**. The broad visible-control sweep clicked **178 controls across the exercised main routes**, with no uncaught page errors or unexpected HTTP 5xx. It recorded 16 heuristic “no visible effect” observations; the follow-up test confirms empty required search/demand forms remain invalid and issue no search request. Current navigation tabs, banner selection and controls with state changes during the click window explain part of the heuristic count. This is broad UI interaction coverage, not proof of every conditional/destructive action or every authenticated role.
- The exact-manifest multimodal route-map scenario passed **1/1** with screenshot comparison enabled and no snapshot-update flag. It covers the route sheet, verified fixture geometries, stop details, selection/focus and overview restoration, live transit overlay selection, light/dark palette, layers, and navigation create/restore. E2E fixture segments now use the API contract field `routeGeometry` (the old fixture used an unsupported `coordinates` property); several stale color and UI-copy assertions were aligned to the pinned Site registry and visible copy. No application source in the pinned release checkout was edited.
- Root orchestration `typecheck`, `lint`, and `git diff --check` passed after the E2E updates. The separate Site candidate branch `codex/map-layers-reference-layout-20261024` still contains the focused transport-label wrapping improvement, with its own typecheck/lint/build and prior Chromium/Firefox/WebKit responsive-search checks passing.
- Docker Desktop had been stopped when the preceding test was interrupted. It was started and the existing `db`/`redis` compose services were brought up without deleting volumes or containers, so the repeated E2E run could use the isolated `marshgo_e2e` database. These are local test dependencies, not a deployed service.
- The route-map screenshot assertions passed as above; complete visual acceptance of all ten supplied mockups has not been completed. Admin/Partner role workflows, physical iPhone, live-provider acceptance and staging remain unverified. Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
- A separate consented-rendezvous fixture run passed **2/2** after repairing stale test-only locators and wording. It verifies two route approach geometries, both LIVE participant labels, arrival ETA/distance text, that the map stays hidden before the second consent, and that revocation stops sharing. In the pinned production UI, the live map is embedded in the Trips booking card. The separate candidate now offers a fullscreen view, but needs integration, exact-SHA acceptance, comparison with the supplied design, and live-map validation.

## Superseding continuation result — 2026-10-24

This section supersedes the 19/20 failure and “do not refresh” status in the historical run below.

- After fixing the expanded-sheet overview control and reviewing the changed route layout against the provided references, the full local functional fixture suite passed **20/20** with `E2E_SKIP_VISUAL=1`. The same changed route-map spec then passed **1/1 with screenshot comparisons enabled and no snapshot-update flag**, after seven route-map local baselines had been deliberately regenerated following visual inspection.
- Site checks after these UI changes: production build, typecheck, lint and **98/98 unit tests PASS**.
- The updated snapshots are local regression baselines for this dirty UI. They do not approve all ten mockups or establish pixel parity, real map-art/licensing acceptance, live GPS/provider correctness, staging or production.
- A true route-sheet usability defect was fixed: “Показати маршрут цілком” was underneath the expanded-sheet drag handle. It is now reachable in the visible summary, and the route-map scenario verifies the action.
- The 195-click audit across 15 paths still has 12 heuristic no-change observations; current/selected or empty/native-invalid states explain those observations, but dedicated conditional/destructive-flow acceptance remains necessary.
- Dirty source tuple and local-only boundaries are unchanged from the tested-candidate section below. No production/staging URL was accessed. Release remains **`PRODUCTION_READY=false`**, **`RELEASE_STATUS=NOT_RELEASED`**.

## Tested candidate and environment

- Root orchestrator HEAD: `f727312619dbb6d73b7de8eba99bab55880201d`.
- Site checkout: `MarshGO-Site`, branch `codex/sync-journey-mobility-ui`, HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`, including its existing dirty changes; E2E served the locally built `MarshGO-Site/dist`.
- Server checkout: `MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`, including existing dirty changes. The fresh isolated database applied migrations through `054_rendezvous_participant_consent.sql`.
- The root manifest still prints Server `b65882584a3ad1e8dd7512d13176f52299cded51` and Site `a000b3cc07a956ae7ded4563ab5e97b11fe3db71`; these are not the local working source pair exercised here. Report this run as dirty-worktree fixture acceptance, not exact-manifest acceptance.
- Browser: Playwright Chromium/iPhone 16 emulation, Node `v24.21.0`; loopback API, isolated `marshgo_e2e_full_ui_audit_20261024`, local geocoder/OSRM/map-tile fixtures. No production or staging URL was contacted.

## Results

- Full E2E suite: **19/20 PASS**. The sole failure is the dark half-expanded route-map screenshot: **19,828 pixels (6%)** differ from the checked-in screenshot. The full route/map behavior assertions reach that visual check. A follow-up with `E2E_ROUTE_MAP_ONLY=1` passed **1/1** for the light route/map and focused-leg behavior; this mode returns before the dark screenshot section.
- The 15-route visible-control audit clicked **195 safe, enabled controls** with no browser exceptions or unexpected HTTP 5xx. It reports 13 controls with no detected DOM/URL/network delta. They are selected-state/current-page actions or empty/invalid form actions documented by the test; the result does not cover destructive controls, every conditional state, or authenticated Admin/Partner workflows.
- Responsive production search passed at **320, 390, 430, 768, 1280 and 1440 CSS px**: no horizontal overflow, touch controls at least 44 px high, shared bottom navigation stays fixed, provider filter opens, twelve categories are present, and dark theme renders.
- Other passing E2E scenarios cover empty-search validation, route swap with coordinate retention, 12 transport categories and unavailable states, phone sign-in, two-account search/booking/demand/chat, driver GPS deviation/reroute, foreground navigation at iPhone 15 Pro Max and 16 Pro Max sizes, denied-GPS recovery, route URL restoration, truncated-search disclosure, strategy metadata, and rendezvous consent/revocation.
- The first pre-recheck run exposed the E2E harness exceeding the backend's per-network OTP limit of 20. The Server now supports a bounded override only when `NODE_ENV=development` and `AUTH_DEV_OTP=true`, with a maximum of 100; production remains at 20. The E2E server sets this only for its local development process. The subsequent full run completed all OTP-dependent scenarios.
- TypeScript checks and ESLint passed for root, Site and Server. Unit suites: root **256/257** (one opt-in integration skipped), Server **224/225** (one opt-in integration skipped), Site **98/98**. The Site production build passed earlier in this work session after the local Site changes; this report does not represent a new full integration/security/load suite.

## Design review against the ten user references

- The route-map E2E snapshot failure is a real visual delta from its checked-in baseline, not a flake: actual dark half-sheet uses a different title, address-summary hierarchy and segment strip. The snapshot was deliberately not replaced.
- Existing snapshots use synthetic map tiles. They cannot demonstrate satellite artwork, live transit positions, real vehicle arrival, real fares or exact reference-image parity.
- The confirmed carpool UI E2E proves consented positions, labeled straight-line distances and ETA fields in the current inline-map view. It does not match or accept the larger full-screen live-driver map in the supplied mock.
- The supplied ten designs have not had a complete pixel-matched capture/review across all states. Reference-image acceptance remains **NOT_ACCEPTED**; visual gaps and untested states are listed in `95_USER_MOCK_DESIGN_AUDIT_2026-10-23.md`.

## Release boundary and next actions

- Local fixture E2E is not live-provider acceptance, staging, production smoke, physical iPhone/Safari acceptance, or Admin/Partner authorization acceptance. No deployment was run; release remains **NOT_RELEASED**.
- Next: resolve the dark half-sheet visual delta against the user reference before changing any screenshot baseline; capture the remaining supplied states on one exact immutable candidate; run authenticated Admin/Partner and physical-device acceptance when available; rerun the full production gate on a clean exact SHA tuple.
- Checkpoint: preserve the current dirty worktrees. Do not clean/reset, delete data, or claim exact-candidate/production readiness from this run.

## Current Site candidate acceptance — 2026-10-24

- Tested Site PR #22 candidate branch `codex/map-layers-reference-layout-20261024`, exact SHA `5a96e85630428c2ffc15dfe67308334eda9d7398` (PR base `codex/site-final-rc-20261024`). The candidate was built with the E2E map manifest and served from its own `dist`; API calls used the isolated local harness pinned to Server `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- Candidate Site: unit **103/103 PASS**, typecheck, lint, production build and bundle budget **PASS**. Its transfer budget reports 17 JS chunks at or below 350 KB gzip.
- Full local fixture E2E: **20/20 PASS** on the candidate bundle with visual comparisons skipped for this 20-test suite. The broad button audit clicked **177 controls** over main user routes and reported no uncaught browser exception or unexpected HTTP 5xx. It logged 15 heuristic no-effect observations for current tabs/selected values or invalid empty forms; dedicated checks confirm empty forms are rejected and do not submit.
- Route-map test: **1/1 PASS** on candidate with functional assertions and screenshot comparison enabled. It checks route selection/focus, sheet sizing, stop details, light/dark styles and recovery to overview. Its synthetic fixture map does not establish live map style or exact match to the ten owner images.
- The first full suite showed three stale test assertions for an older partial-search warning. The current production UI correctly exposed `role=status` with “Пошук досяг ліміту обробки джерел; частина маршрутів могла не потрапити до результатів…”. Updated only root E2E matchers to this actual copy; rerun passed 20/20. No Site production component was changed in this recheck.
- These are local fixture/browser checks, not live-provider acceptance, physical iPhone/Safari, Admin/Partner authorization, staging or production. Full ten-reference visual acceptance remains **NOT_ACCEPTED**; keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
