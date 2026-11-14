## 2026-11-11 — provider availability and first-route gate recheck

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Non-transit provider availability must be real | Live unpinned API on `:3002` advertised Uklon, Bolt, Opti Taxi, Getmancar, Kiwitaxi, inbus and MARSHGO Community as available for Lviv, without a successful quote/offer/booking result. Source now requires positive `quotes_taxi`, `vehicles_carsharing`, `offers_transfer`, or `offers_carpool` counts; legacy-placeholder and positive-control regression tests pass. | SOURCE_AND_TEST_VERIFIED / RUNTIME_FAIL_OLD_BUILD | Active PID 66637 still serves the previous list and has null build SHA. Do not claim source guard is live until a pinned runtime loads it and provider endpoint is rechecked. |
| Server feed adapter and availability types | Focused GTFS component/feed/provider/license/seed tests **21/21**; `npm run typecheck` exit 0; scoped diff check exit 0 at dirty Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`. | SOURCE_AND_TEST_VERIFIED | The bad Zhmerinka source is not activated; no live UI route was produced from the CSV adapter. |
| First authenticated Lviv user journey | Site `:7777` HTTP 200; API `/readyz` HTTP 200 with DB/realtime; anonymous search returns expected 401. Existing zrok tab appears in browser inventory, but `getTab` returns `browser.user is unavailable`. | NOT_TESTED / AUTH_REQUIRED | Need an attachable authenticated zrok tab and a source-pinned runtime; prove real search → provider route → geometry/stops/fare → navigation. No auth bypass or alternate port. |
| Nationwide connected feed coverage | New Zhmerinka CSV candidate fails live GTFS health (996/996 invalid stop coordinates, no timezone, no service in next 7 days); current Kyiv listing is HTTP-only/DNS-blocked. | PARTIAL / BLOCKED_SOURCES | Seek publisher-corrected or other lawful current feeds. Catalog discovery is not connected coverage. |

## 2026-11-11 11:59 EET — Site typecheck and bottom-sheet regression set

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Dirty Site type safety and route-sheet regression | Site worktree `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; `npm run typecheck -- --pretty false` passed. Focused suite `bottom-sheet-density`, `route-sheet-content-fit`, `journey-active-navigation`, and `journey-route-map`: **40/40 passed**. CSS diff check clean. | SOURCE_AND_TEST_VERIFIED | Browser attachment to the existing authenticated zrok journey still fails with `browser.user is unavailable`; visual stop-row height/screenshot remains NOT_TESTED. No new port or process was opened. |

## 2026-11-11 11:57 EET — Server typecheck blockers fixed

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current dirty Server compiles | At dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, fixed five `tsc` errors in password-reset environment typing, estimated-walk provenance fallback, rental provider preference type, and reverse-geocode test environment key. `npm run typecheck -- --pretty false` now exits 0. Related test command covering password-reset policy, geocoding, journey search validation/completeness, and route-engine oracle: **30/30 passed**. Scoped diff check passed. | SOURCE_AND_TEST_VERIFIED | Does not prove the currently running API uses this source or that DB-backed auth integration passes; API was not restarted. No provider-backed signed-in route or staging evidence. |

## 2026-11-11 11:55 EET — planner composition matches independent exhaustive graph

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Small-graph planner completeness, including 3 legs | Server dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; `tests/route-engine-oracle.test.ts` now enumerates all time-feasible paths independently with bounded DFS and compares the complete direct + 3-leg candidate set and FASTEST/CHEAPEST/BALANCED winners. Full focused file: **9/9 passed**, 0 failed/skipped. The former single-chain fixture was renamed so it no longer claims to be exhaustive. | SOURCE_AND_FIXTURE_VERIFIED | No planner implementation defect reproduced on this graph. This cannot substitute for a provider-backed route in the authenticated Web UI; first journey remains unverified. Full Server typecheck was deferred while Virtualization was consuming ~59% CPU. |

## 2026-11-11 11:49 EET — small-graph route completeness oracle

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Two-transfer route completeness and objective winners | Dirty Server source at `e9934abbd8fc973177de8d7f47548739758a1b74`; `node --import tsx --test --test-name-pattern='matches an exhaustive two-transfer oracle and all three ranking winners' tests/gtfs-timetable.test.ts`: **1 passed, 0 failed/skipped** (test body ~62 ms). The test compares production search against an independent exhaustive small-feed oracle and checks all three ranking winners. | SOURCE_AND_FIXTURE_VERIFIED | Deterministic fixture proof only; it does not establish provider-backed live data or route rendering in the authenticated UI. Keep the first journey gate blocked until that full flow is observed. |
| Expanded stop-list density | Dirty Site source at `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; static stop rows target 28 px, selectable stop rows 44 px; focused density/content-fit tests pass 14/14; new stylesheet is served by canonical `:7777` and current zrok. | SOURCE_AND_FIXTURE_VERIFIED | Existing browser tab cannot be attached to (`browser.user is unavailable`); no rendered measurement or screenshot for this increment. |

## 2026-11-11 — production geocoder configuration guard

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Geocoder fail-fast policy | Server worktree `e9934abbd8fc973177de8d7f47548739758a1b74`, dirty source. `server/geocodingPolicy.ts` centralizes the public Photon evaluation host. `server/config.ts` rejects it for forward/reverse production endpoints; `server/geocoding.ts` rejects production reverse calls before network. `tests/config.test.ts` + `tests/geocoding.test.ts`: 22/22 passed. | SOURCE_AND_FIXTURE_VERIFIED | Does not provide a contracted/self-hosted endpoint, SLA, licensing approval, or live production probe. Configure an owner-approved HTTPS provider, then pin and stage the exact artifact. Overall release stays `NOT_RELEASED`. |

## 2026-11-11 — authenticated route flow and refreshed Site sheet styles

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Route sheet compactness and unified safe area | Site worktree `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; details/navigation share the one-inset bottom rule and 2 rem corners. Historical zrok measurement at 384×779: expanded sheet 462→399px, bus card 96→50px, ribbon 46→44px; collapsed-stop list fit all 3 legs, wait row and CTA (client/scroll 192/192px). Latest source keeps stop labels to one ellipsized line while preserving full accessible labels and 44px interactive rows; density/content-fit tests 14/14 and Site typecheck pass. Existing signed-in zrok journey was freshly reloaded at 450×779; visual interaction expanded a 9-stop A19 list and confirmed the CTA remains visible while the list scrolls. | PARTIAL | Current route has short stop names, so the new ellipsis behavior is not visually exercised; no before/after DOM height was measured for this increment. Check a real long-name route at phone widths and compare details/navigation parity, safe areas and gestures before visual acceptance. Earlier `browser.user is unavailable` notes are superseded for this checkpoint only. |
| User journey search | Same-origin public zrok `POST /api/v1/journeys/search` with empty body returns 401 `Authentication required`; Server source applies `requireAuth`. Properly URL-encoded local and zrok `/api/v1/places/suggest?q=Львів` return 200 with six Photon/OSM results; direct adapter also returns six live results. API `/healthz` and `/readyz` return 200 with DB/realtime connected. Root E2E uses an isolated API and mock/disabled transit feeds, so it cannot prove a provider-backed route on the canonical interface. | BLOCKED_AUTHENTICATED_UI_EVIDENCE | Address search is live-verified; journey search remains untested in the owner's signed-in session. CUA page access returns `browser.user is unavailable`. No auth bypass. |
| Runtime build identity | zrok `/api/v1/version` returns `apiContract=v1`, `buildId=null`, `commitSha=null`, `builtAt=null`, `sourceState=unknown`; `instanceId=913397fb-0be3-44f5-b680-b58329f72299`. The release build metadata materializer, Docker ARG/ENV/OCI labels, and focused 4/4 metadata tests already exist. | BLOCKED_RUNTIME_PIN | The running API is development-only and cannot be matched to dirty Server HEAD. Build the exact pinned release artifact and verify its runtime tuple in staging; do not duplicate the implemented metadata pipeline. |
| Current Server behavior | Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, dirty branch `antigravity/ukraine-12-transports-multimodal`. Latest `tests/geocoding.test.ts` passes 13/13, including test isolation and rejection of the public Photon demo host under production mode; route oracle/completeness/transfer/geometry fixture sets pass 18/18; bounded-retention/adversarial/calendar fixtures pass 9/9. Local and same-zrok address suggestions return six live results. API PID 66637 remains unpinned (`/version` build SHA null). | PARTIAL | Unit fixtures do not prove a configured contracted/self-hosted production geocoder or signed-in provider-backed route; do not restart PID 66637 or pin the dirty tree. |
| No fabricated static walking geometry | Server dirty source gates static multimodal estimates to explicit test mode (`NODE_ENV=test` plus opt-in), strips unverified walk shapes before persistence/API response, and labels the walk estimate; targeted policy/provenance tests pass 4/4. | SOURCE_AND_FIXTURE_VERIFIED | This guards the static fallback path only; it does not prove an actual provider-backed walking route. `/readyz` is healthy locally and through zrok; `/version` still has null build pin. |
| CHEAPEST fare comparability | Server dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; `planJourneys` now filters unknown-fare paths for `CHEAPEST`; `tests/journey-planner.test.ts` passes 8/8 including mixed/unknown-only fare cases. | SOURCE_AND_FIXTURE_VERIFIED | This planner helper currently has no Server production callsite; live search uses the strategy-alternative path. Do not treat this fixture result as evidence that the end-to-end journey flow is verified. |
| Current Site geometry behavior | Site HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, dirty worktree; focused route geometry, route joins, confirmed-route display, focused passenger zones, and line geometry tests pass 31/31. Tests cover B-only focus, hiding approximate estimates, no fabricated joins across real gaps, valid whole-line ingress, and zoom-aware geometry. | SOURCE_AND_FIXTURE_VERIFIED | No current browser screenshot or route visual acceptance: the existing CUA page handle is unavailable. Historical 384×779 sheet screenshot is from before the newest wait-row change. |

## 2026-11-09 17:51 EET — compact times merged; Site preview tracks exact main tree

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Compact result card time density | PR #119 head `06ed7446a03bdb8e5e50d62ebf7634876526e11e`, merge SHA `05f55210c9bf92cf863217516cf218a3d62cb547`; focused test 1/1 and both exact-head `verify` checks passed. The repeated row and its CSS are removed; detail timeline still renders each leg’s departure and arrival. | CI_VERIFIED / LOCAL_MODULE_SMOKE | Live module on `:7777` returns HTTP 200 with no row; browser visual/E2E not verified because browser attachment is unavailable. |
| Current canonical preview process | At the current recheck, PID 31208 on `127.0.0.1:7777` has CWD `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, with 34 dirty paths. It is not the exact-main checkout described in the earlier Nov 9 checkpoint. | DIRTY_WORKTREE_PREVIEW | Preserve existing work; do not label this process as an exact-main release preview or pin it into the manifest. |
| Local API autocomplete | Photon-aware implementation from Server main `aa9196ccee4fe0d05e4ce2669933b0d8305b47cc` was selectively synced into the clean file of the dirty local Server checkout; byte hash matches main. After graceful local API restart under Node 24.21.0, sample `Львів` returns HTTP 200 and 6 suggestions. | LOCAL_AUTOCOMPLETE_VERIFIED | Runtime remains dirty/unpinned; this proves suggestions only. No migration was run. |
| Canonical Web proxy | Current same zrok Site/API path: `GET /api/v1/places/suggest?q=Сихів, Львів` returned HTTP 200 with 5 suggestions; local and zrok transformed Site CSS serve compact sheet tokens (1px list gap, 0px vertical card padding). | SOURCE_DELIVERY_AND_AUTOCOMPLETE_ONLY | Not visual acceptance, provider-provenance evidence, or authenticated route-planner acceptance. |
| Runtime provenance and schema | `/api/v1/version` still returns null SHA/build ID. Local database has 53/54 protected-main migrations; migration 057 deactivates sources lacking explicit commercial-use permission. | BLOCKED_PINNED_RUNTIME | Do not apply migration 057 to current DB; prepare an isolated disposable DB/API candidate first. |
| Lviv minibus route | Read-only dev API `:3002` returns `marshrutka: []`; GTFS classifier test confirms generic `route_type=3` stays `bus`, while a source name explicitly saying “Маршрутка” maps to `marshrutka` (1/1 targeted test). | UNAVAILABLE_IN_CURRENT_REGISTRY | No separate Lviv route/minibus source or explicitly tagged marshrutka route is present in the current registry/import. Do not relabel all bus routes; discover an operator-owned source before enabling this category. |

## 2026-11-09 17:15 EET — direct Photon adapter passes; active API still fails

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Exact-main Photon autocomplete adapter | Server `aa9196ccee4fe0d05e4ce2669933b0d8305b47cc`, Node 24.21.0: `tests/geocoding.test.ts` and `tests/place-name-length.test.ts` passed 26/26, 0 failed/skipped. `suggestPlaces('Львів')` against live Photon returned six results carrying Ukrainian provenance. | LIVE_ADAPTER_VERIFIED | Direct adapter→provider only; does not prove the running HTTP API or Site flow. `npm ci` reported 16 moderate advisories; not triaged here. |
| Current local HTTP autocomplete | `GET :3002/api/v1/places/suggest?q=Львів` returns 503. PID 31938 runs from dirty Server checkout `e9934ab...`, Node 26.7.0, no reported build SHA. Runtime selects Photon, but old adapter adds `format=jsonv2`; Photon directly rejects that parameter with HTTP 400. | BLOCKED_RUNTIME_MISMATCH | Keep the process and DB untouched; establish a separately pinned API with disposable DB, then verify the actual API route. |
| Lviv marshrutka availability | Read-only API provider response has `marshrutka: []`; bus and tram have Lviv providers. The Site disables the mode if no usable provider is returned. | UNAVAILABLE_IN_CURRENT_REGISTRY | Do not relabel generic bus trips. Enable only when a verified source reports explicitly classified minibus service. |

## 2026-11-09 16:20 EET — Photon autocomplete adapter and runtime mismatch

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Photon adapter contracts | Protected Server main `aa9196ccee4fe0d05e4ce2669933b0d8305b47cc`; `tsx --test tests/geocoding.test.ts`: 24 passed, 0 failed, 0 skipped. Covers Photon GeoJSON parse, UA provenance, forward/reverse requests and outage behavior. | FIXTURE_VERIFIED | Unit contract only; not the active local API process. |
| Live Photon forward and reverse | Exact-main `suggestPlaces('Львів')` returned 6 UA-filtered results; exact-main reverse call returned a place for generic coordinates `49.8397,24.0297`. | LIVE_ADAPTER_VERIFIED | Direct adapter-to-provider evidence; does not prove browser→API or route planning. |
| Active local API autocomplete | `GET :3002/api/v1/places/suggest?q=Львів` returned HTTP 503. Runtime is dirty Server `e9934ab...`, unpinned; configured provider is Photon, but stale code sends Nominatim-only `format=jsonv2`, receiving Photon HTTP 400. | BLOCKED_RUNTIME_MISMATCH | Do not restart/replace until DB/Compose owner is established. Next: isolated disposable API+DB from exact main, then verify via canonical `:7777`. |

## 2026-11-09 16:00 EET — port 7777 API proxy and launcher preflight

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Browser-origin API proxy | GET to `/api/v1/mobility/providers` through Web `:7777` with `Origin: http://127.0.0.1:7777` returned HTTP 200 and matching allow-origin. | LOCAL_PROXY_SMOKE | Proxy connectivity only; response is registry metadata, not a route. |
| Future local API launcher | `bash scripts/start-local-api.sh --check` passed without launching a service; it would pin dirty Server source SHA `e9934ab...` and set dev auth bypass/OTP off. Launcher CORS origin list now includes `http://127.0.0.1:7777`. | PREFLIGHT_PASS | Active API wasn't restarted. Its `/api/v1/version` remains unpinned, so local stack status correctly reports incomplete. |

## 2026-11-09 15:58 EET — Local stack status verifies port, exposes API build-pin failure

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Read-only local stack status | `bash scripts/local-stack-status.sh`: Web 7777 HTTP 200; API health/readiness 200; PostgreSQL 5434, Redis 6380/6381 and Docker daemon reachable. | SERVICES_INCOMPLETE | Script's `api_build_identity` check fails: `/api/v1/version` has no commit SHA/source state, so expected checkout cannot be matched to running API. This is a provenance failure, not a claimed healthy release. |
| Container safety | `docker ps` lists one local Server/Postgres/Redis project plus two walking routers; all retained. | INVENTORY_ONLY | No container, data, or volume changed. Identify compose owner before any new runtime or restart. |

## 2026-11-09 15:55 EET — Canonical port online; active API/runtime mismatch found

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Canonical Web and zrok | Site source on `127.0.0.1:7777`; local and `marshgo-dima.shares.zrok.io` returned HTTP 200 for `/`, `/journeys/search`, `/readyz`. | LOCAL_PREVIEW_VERIFIED | This is the local development preview, not staging. New port has separate browser auth/storage; sign in again there if needed. |
| Active API readiness and pin | `127.0.0.1:3002/healthz` and `/readyz` returned 200; DB and realtime say connected. API reports `environment=development`, `sourceState=unknown`, and null commit SHA. Its checkout is dirty Server branch at `e9934abbd8fc973177de8d7f47548739758a1b74`; remote Server main is `aa9196ccee4fe0d05e4ce2669933b0d8305b47cc`. | LOCAL_ONLY / BUILD_ID_UNPINNED | Do not treat local runtime as exact-main acceptance. A clean, isolated DB/API pair on pinned main is required. |
| Lviv provider registry | Read-only `GET /api/v1/mobility/providers?lat=49.84&lon=24.03` returned 21 catalog tiles; canonical counts: carpool 1, marshrutka 0, bus 1, taxi 3, tram 1, trolleybus 0, metro 0, train 1, bike 2, scooter 0, carsharing 1, transfer 2. | REGISTRY_ONLY | These counts are not routes or live availability. The dirty runtime handler hard-codes taxi/carsharing/transfer rows as `available=true`; reconcile that with actual operator/source contracts before any mode is presented as bookable. |
| Authenticated route → map flow | `/api/v1/journeys/search` is guarded by `requireAuth`. Current 7777 tab is guest; CUA could not attach to the pre-existing user tab, and no credentials/session data were copied. | NOT_TESTED / AUTH_REQUIRED | Sign in at canonical 7777 origin, then run a real Lviv search and inspect geometry, stops, segment time/cost, and navigation. |
| Validation performed | Static 7777 pin assertion and `git diff --check` passed; local/public root, search shell and readiness HTTP smoke passed. | TARGETED_SMOKE_ONLY | No build, unit suite, authenticated E2E, map render, provider live route, or production check was run. |

Resource sample at this checkpoint: `/` 32 GiB free, RAM 35% free, encrypted swap ~5.2 GiB. Keep one heavy task at a time. Production remains `NOT_RELEASED`.

## 2026-11-09 01:27 EET — Server provider/runtime recheck

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Server provider parser/policy unit checks | Dirty Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`: 43 tests passed, 0 failed/skipped. | FIXTURE_VERIFIED | No current API or live provider calls were exercised. |
| Local API runtime | launcher `--check` passes, but `:3002` has no listener; `/readyz` is HTTP 000, proxy and approved HTTPS readiness are 502. | DOWN / BLOCKED | Start pinned isolated API only after resource gate recovers; assert build SHA and readiness. |

## 2026-11-09 01:19 EET — page/feed acceptance recheck

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Registered route shells | 20 route shapes × 2 local previews returned HTTP 200 and `id="root"`. | SHELL_ONLY | Does not prove component render or user interaction. |
| Focused Site checks | Dirty Site HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`: 56 route/presentation/design tests + 53 map/geometry/provider-selection tests passed; 0 failed/skipped. | LOCAL_TESTED | Unit evidence only; all-page browser/API/live-feed acceptance remains NOT_TESTED. |
| Page-by-page browser behavior | Browser bridge unavailable; API is down. | NOT_TESTED | Restore exact-SHA API and attachable browser, then test all tabs/deep links and critical flows. |
| API-dependent screens | `:3002` connection refused; `:3019` and approved HTTPS readiness return 502. | BLOCKED | Start isolated pinned API only after resource gate allows. |
| Twelve transport modes | Current provider snapshot is stale; API cannot serve registry/search. | NOT_VERIFIED_END_TO_END | Verify source rights/health and source→planner→API→Site per mode; no blanket enablement. |

## 2026-11-09 00:49 EET — current page, PR and provider acceptance checkpoint

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site changed-code unit checks | Dirty Site HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`; focused route-map/provider-selection/GPS/mode tests: 47 passed, 0 failed/skipped. | LOCAL_TESTED | Does not exercise all pages, authenticated user journeys, the live API, or feeds. |
| Qoder compact-results candidate | Site PR #117 base `9e1be2a0b96ce1a20761a2a0956626456e2ba9db`, latest head `dbc3448094514ca1ab461e98daa67738f9e484a9`; follow-up fixes alternative row to use actual first-leg departure. `canonical-design.test.ts`: 27 passed; diff-check passed. | PR_OPEN / TARGETED_LOCAL_PASS | New exact-head CI runs `42532034457` and `42532030084` in progress; no merge until they finish and branch rules are satisfied. |
| Previous PR #117 exact-head CI | Head `b75e75aa88e14b7e3bfa36bc51aeb517d06376cd`; run `42522334496` completed every Site CI step successfully, including full unit suite and boot smoke. | CI_PASS_ON_SUPERSEDED_HEAD | New follow-up commit requires new exact-head CI. Boot smoke covers shell/login only, not every registered page. |
| Current visible preview | `:4178`/`:4179` processes run from dirty Site checkout `eda449f…`; root and `/journeys/search` return SPA HTML shell. | ROUTE_SHELL_ONLY / STALE_SOURCE | Local checkout is 74 commits behind current Site main. Do not treat it as current-main visual acceptance or stop Qoder's process. |
| Page-by-page browser acceptance | Prior sweep covered 20 route shapes as same SPA shell; CUA bridge unavailable; API proxy and approved HTTPS API are 502. | NOT_TESTED | Requires restored exact-SHA API and attachable browser; then cover all routes and critical flows in both themes/viewports. |
| 12 provider modes | Last local DB health snapshot 2026-11-08 18:56 UTC; API unavailable now. | NOT_VERIFIED_END_TO_END | See provider matrix for last snapshot and mode-specific blockers. No feed is newly activated by this checkpoint. |

## 2026-11-08 22:34 UTC — test claims vs live provider acceptance

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Candidate “12 modes across regions” tests | `tests/ukraine-12-transports-all-regions.test.ts` asserts 12 catalog DTOs and directly calls static catalog/composer functions for sample routes. | FIXTURE/CATALOG ONLY | Does not probe feeds or verify API→planner→Site→map. Do not treat as live or all-mode acceptance. |
| Static multimodal fallback | `server/journey/staticMultimodalFallbackPolicy.ts` enables it only in explicit test mode (`NODE_ENV=test` and opt-in variable). | TEST_ONLY | Test-only sample chains cannot be used as production search proof. |
| Candidate provider registry truthfulness | Unmerged Server `server/index.ts` hard-codes taxi, carsharing and transfer providers as available; `getTransportCatalogForCity()` separately requires contracts/limits rentals. | CANDIDATE REGRESSION / HOLD | Unify/fail-close provider availability before integrating candidate changes. |
| Runtime page/provider acceptance | API ports unavailable/502; RAM 27%, swap 14,145 MiB, VM high CPU. | BLOCKED | Wait for API and resource gates; no heavy local test was started. |

## 2026-11-08 22:27 UTC — page shell, API reachability, and provider registry recheck

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site registered routes respond | 20 canonical tab/alias/entity paths on preview `:4179` returned HTTP 200 and the same 5,011-byte SPA HTML shell at Site HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`. | SHELL_ONLY | Does not execute JavaScript or validate rendered pages, controls, API data, or journeys. Run the page E2E suite on an exact candidate after resource/API gates recover. |
| API readiness and provider endpoint | Direct `:3002/readyz` connection refused; proxy `:3019/readyz` and approved HTTPS `/readyz`, `/api/v1/version`, `/api/v1/mobility/providers` returned 502. | BLOCKED | No current route, autocomplete, booking, or feed-to-client acceptance can run. Start the pinned API only after resource gate allows it, and verify build identity first. |
| Local registry snapshot | Read-only DB query: 88 rows, 13 enabled at last check 2026-11-08 18:56 UTC (8 GTFS healthy; 2 GTFS-RT healthy/1 degraded; one JSON degraded; one GBFS degraded). | REGISTRY_SNAPSHOT_ONLY | DB rows do not prove API reachability, current route coverage, freshness beyond `last_checked_at`, fare, availability, or booking. |
| All 12 transport categories | Schedule feeds show bus, tram, trolleybus and train/suburban subsets; other modes are internal code, estimates, catalog-only, degraded, or lack active provider rows/credentials. | NOT_VERIFIED | Do not mark all 12 live. Preserve truthful unavailable states; obtain operator access and run exact-provider route/availability acceptance. |
| Current dirty Server/Site candidate | Server `e9934abbd8fc973177de8d7f47548739758a1b74` and Site `eda449f008025b2126c92fd24cd68deb513ca3ad` match feature remotes but are 99/74 commits behind main and have dirty changes. Server code hard-codes several unconfigured providers as available. | HOLD / NOT_ACCEPTED | Review and remove unsupported availability claims, rebase/port selected changes, and pass exact-head CI before merge. |

## 2026-11-08 22:27 UTC — resource gate

Disk free: 23 GiB. Memory free: 31%. Encrypted swap used: 13,103 MiB. Qoder and Virtualization processes active. No build, test suite, Docker build, GTFS parse, or browser E2E started.

## 2026-11-08 14:52 UTC — Qoder preview aligned to merged Site main

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current Site candidate is reviewable in Codex | Qoder Site branch fast-forwarded to `ee5fb832bec877466158e20218f6a6481e81cefc`; PR #108 MERGED at `0c9b9dff5022497d3611077896dcc791ec148e1a`; candidate/main tree hashes both `cf1c48875b46d992490f5641c27120cc70c3742a`. PR checks `42483030190` and `42483033856` PASS. Codex IAB tab 70 displays the guest landing screen. | COMPONENT_MERGED / LOCAL_RENDERED | No authenticated search or real journey was run. Preview API build identity is unknown; this is not staging acceptance. |
| Typed city suggestion on dev stack | Sample query `Львів`: direct `:3002` and preview-proxied `:4192` each returned HTTP 200 with six suggestions. `/readyz` on `:3002` is 200. | DEV_SAMPLE_VERIFIED | Does not prove all addresses, sustained provider availability, or production geocoder authorization. |
| Place-suggestion cancellation | `npx tsx --test tests/place-suggest-abort.test.ts` on Site candidate tree matching main: 2 passed, 0 failed/skipped. | LOCAL_TESTED | Prevents stale requests/errors; does not configure/fix provider availability by itself. |
| Pedestrian geometry pipeline logic | `npx tsx --test tests/journey-walking-routes.test.ts` on Qoder Server candidate `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`: 19 passed, 0 failed/skipped. Its output notes 73 live Lviv candidates vs a 32-request routing budget, leaving some displayed walks estimated. | FIXTURE_TESTED / LIVE_SEARCH_PARTIAL | Candidate is not current Server main and this suite is not live-route acceptance; independently replay the route and preserve partial-data disclosure. |
| Supported local API launcher preflight | `./scripts/start-local-api.sh --check` passed; it validates local environment targets and keeps auth bypass, OTP, fixtures, and static estimates off. | LOCAL_PREFLIGHT_PASS | The script explicitly does not check runtime readiness; inherited env can still affect dotenv unless cleared. |
| Pedestrian route geometry | Qoder reports source-backed OSRM-foot geometry on Lviv/Kyiv searches after dotenv-based dev API restart; Odesa returns partial reason `walking_routing_unavailable`. | QODER_REPORTED / DEV_RUNTIME | Codex has not independently replayed the route response; no persistent launcher change or production evidence. |
| Unified release | `/api/v1/version`: `environment=development`, `buildId=null`, `commitSha=null`, `sourceState=unknown`. | NOT_RELEASED | Six-SHA runtime pin, authenticated route flow, staging, backup/restore, and rollback remain unverified. |

## 2026-11-08 13:50 UTC — Qoder dev provider-registry probe (read-only)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Regional provider registry consistency | `GET /api/v1/mobility/providers?lat=…&lon=…` on `:3002` and `:3007` returns matching HTTP 200 results for Lviv (carpool/bus/tram/train/suburban_train/bike), Kyiv (+trolleybus/scooter), and Odesa (+trolleybus). Lviv maps bus/tram to ЛьвівАвтодор GTFS, train to UZ GTFS, bike to static-bike estimates, carpool to a MARSHGO Community registry entry. | FIXTURE/DEV_REGISTRY_ONLY | Registry presence is not a live route, geometry, fare, vehicle availability, licensing or booking proof; trace the categories to actual planner edges and offers. |
| Qoder Site browser startup | `:4192` and `localhost:4192` render generic boot failure in Codex IAB, though proxied API health/autocomplete are 200. | FAILED | Capture the client runtime exception before using this preview for UI acceptance. |

## 2026-11-08 13:46 UTC — development connection recheck (not release acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Codex Site preview → Qoder API | Site `:4181` UI rendered the search form; direct `:3002` and proxied `/api/v1/version` share instance ID. `/readyz` is 200; Lviv autocomplete returns 200/six suggestions. API process CWD is Qoder Server HEAD `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`. | LOCAL_DEV_CONNECTED | No authenticated journey or route search; runtime build identity is null/unknown. Site preview remains an older branch. |
| Qoder Site preview startup | Qoder Site `8650cd87dacaac711e81f01c13414821528d5b38` at `:4192` reaches API `:3007`; health/autocomplete return 200, but browser renders “Не вдалося запустити MARSHGO” on both local hostnames. | UI_STARTUP_FAILED | Capture the runtime exception before claiming this Site build usable; leave Qoder's preview/process unchanged. |

## 2026-11-08 13:32 UTC — Qoder PR #72/#73 review

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Reconcile Qoder visual-zone PR #72 | Head `f681a1fc897f9871bdb6ee6c68f5913ee1901f87`; current-main tree comparison: visual-zone module/test identical; residual live segment code accepts a nonmatching fleet when selected vehicle is absent. Both hosted `verify` checks fail. | SUPERSEDED | Retain main's exact selected-trip matching; do not merge stale stack. |
| Reconcile Qoder completeness PR #73 | Head `57ebc85630bf58e71d52eff2ddea354c7d28e246`; main already has `searchCompleteness`; branch removes walking-reach/extended-walk disclosure and tests. Both hosted `verify` checks fail. | SUPERSEDED | Retain main's availability and walking-reach evidence; no code port. |

## 2026-11-08 13:27 UTC — local dev stack identity

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site preview reaches the current dev API | Site `:4181` and API `:3002` return the same instance ID through `/api/v1/version`; `/readyz` 200; sample-city autocomplete 200/six results. API process uses Qoder Server worktree HEAD `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`. | DEV_CONNECTED / NOT_PINNED | API build ID/SHA are null and `sourceState=unknown`; Site preview HEAD `b11b178bb94991f06ce0769e8d84f1add8f3b3ac` is 1 ahead/8 behind current Site main `0c9b9dff5022497d3611077896dcc791ec148e1a`. Build a separate exact-main preview; no login/search/map journey was tested. |

## 2026-11-08 13:22 UTC — Root PR #23 required-check result

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Materialize exact-SHA repositories in root CI | PR #23 head `0c10d116d6d50fd7de44276b6b6d7cfd7ccec3c8`; required `verify` run `42482724709`; Server and Site clone, private Admin clone returns HTTP 403 at `materialize-release.mjs`. Actions credential cannot read Admin; Partner permission not tested. | BLOCKED_EXTERNAL_ACCESS | Owner grants read-only Contents access for Admin and Partner to the Actions credential and reruns exact-head checks. Do not skip a component or bypass required CI. |

## 2026-11-08 13:18 UTC — Qoder Server PR #119 decision

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Reconcile Qoder Server PR #119 | PR head `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`, code commit `f8c3403296e4504fb2805487dbb857fb8f55c061`; direct tree diff against current main `d8c25a560187a89aaa42422d602802854c19c694`. Safe geocoder parsing/readiness and strategy-oracle work are already on main. Remaining differences weaken optional-geocoder readiness, suppress conservative stop-selection truncation, and remove smoke diagnostics. | SUPERSEDED / NOT_MERGED | Preserve current main semantics. PR remains OPEN / DIRTY; its green checks are on the older base. No local tests run under resource gate. |

## 2026-11-08 12:19 UTC — Server PR #120 and exact-main live acceptance

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Exact six current main refs | Root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; Server `d8c25a560187a89aaa42422d602802854c19c694`; Site `cfc3c021515390f78abaa639752660c5866c1922`; iOS `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f`; Admin `d8afa64c4efda8ce4f10557a03651943effa52a7`; Partner `4d605d4353af281dd295fabf0c7c2ac05efe222e`, queried 2026-11-08 12:17 UTC. | OBSERVED_ONLY | Not a unified candidate; root/iOS/Admin/Partner CI and cross-repo API compatibility were not rechecked in this observation. |
| Server PR #120 | Merged normally from head `65407e4b65094a7f2668e065d9e2375387f3b1c5` to `d8c25a560187a89aaa42422d602802854c19c694`. Exact-head required checks passed; post-merge Server CI `42479353894` passed. | MAIN_MERGED / CI_PASS | Corrects geocoder readiness and search truncation classification; it does not configure a provider or make dense Lviv search complete. |
| Lviv live route acceptance | Exact merged SHA `d8c25a560187a89aaa42422d602802854c19c694`, run `42479621595`: two 90-minute corridors returned 10 scheduled results each, both partial. Truncation: stopSelection, candidateGraph, candidatePoolLimit, candidateSampling, responsePage; no searchBudget or hard step limit. Zero 3-leg candidates in these sampled windows. | FAIL_PARTIAL_ROUTE_ACCEPTANCE | The result does not prove no 3-leg service exists at other times. Investigate bounded candidate graph/pool sampling and compare against a pinned baseline. Artifact SHA-256: `78ff5dfe50c9937d46b4eff3e37ec20e1a9d4f02e7555e02223e6a572a2da761`. |
| Lviv feed health | Static feed: 1,071 stops / 72 routes / 15,141 trips. GTFS-RT: 424 vehicle positions, 397 fresh, 27 stale, feed age 3s; state DEGRADED. | LIVE_FEED_PARTIAL | Vehicle positions are not trip updates, fare, inventory, or booking evidence. |
| Place autocomplete | Active local API and zrok return 503 `geocoder_unavailable` for typed Lviv on dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911`. Public Nominatim autocomplete is rejected. | BLOCKED_PROVIDER_CONFIG | Public Photon sample was ambiguous and has no approved production service contract; use a stable authorized endpoint. |
| 12 transport categories | Active development registry currently has provider groups for carpool, bus and tram only; this is not full live route acceptance. The sampled live routes were bus-only. | NOT_VERIFIED | Maintain separate code/source/live statuses for all 12; do not infer working categories from icons or catalog rows. |

## 2026-11-08 07:24 UTC — Site PR #104 merged

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Journey filters are never silently removed after API failure | Site PR #104 merged at `484980e1b50e0029973f8180a3bac377e7268f34`; exact PR-head CI `42458453322` passed the full Site verify job. | MAIN_MERGED / HEAD_CI_PASS | Post-merge CI `42458620427` is still running. This does not prove live route acceptance. |
| Exact six current main refs | Updated observation at 2026-11-08 12:17 UTC is recorded above; it is not a unified release candidate. | OBSERVED_ONLY | No cross-repository API/E2E compatibility validation; production-ready remains false. |

## 2026-11-08 07:22 UTC — Site PR #104 exact-head gate

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Preserve user-selected journey constraints on API failure | Site PR #104 head `b11b178bb94991f06ce0769e8d84f1add8f3b3ac`, base `868a7d16d44369d8d73767e28359f4ea8d87195f`; targeted test 5/5, ESLint/diff-check pass. | PR_OPEN / LOCAL_TESTED | Exact-head CI run `42458453322` IN_PROGRESS. No merge/live API acceptance yet. |
| Local heavy verification resource gate | 07:22 UTC: disk 16 GiB free, RAM 32% free, swap 8,897.25 MiB. | DEFERRED | No heavy local task running; wait for resources before full typecheck/build/E2E. |

## 2026-11-08 07:17 UTC — resource/cleanup gate

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Safe Xcode cache reclamation | `/Volumes/500` mounted, exFAT, 289 GiB available; DerivedData 34 MiB; CoreSimulator service active; no booted devices observed; CoreSimulator/Devices may contain app state. | NO_SAFE_CANDIDATE | No data/cache moved or deleted; prior inventory found no other safe generated cache. Latest 07:19 UTC: disk 16 GiB free, memory 31%, swap 8,964.44 MiB; defer heavy local work. |

## 2026-11-08 07:15 UTC — journey-filter fail-closed behavior

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Do not silently drop passenger search constraints on API error | Isolated Site branch at main base `868a7d16d44369d8d73767e28359f4ea8d87195f`; `tests/journey-search-abort.test.ts`: 5 passed, 0 failed/skipped. Scoped ESLint and whitespace checks pass. | LOCAL_TESTED (stubbed fetch) | Worktree-only, uncommitted; no real backend/API request. Run typecheck and exact Server contract integration when resources permit. |
| Expanded Site verification | After focused check: 15 GiB disk free, RAM free 34%, swap 9,606.94 MiB. | DEFERRED | Full typecheck/build/E2E not run; prior cache inventory found no safely disposable cache. No cleanup or services stopped. |

## 2026-11-08 07:10 UTC — stale-server filter integrity fix (local only)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Passenger-selected journey filters survive API failure | Isolated Site branch based on `868a7d16d44369d8d73767e28359f4ea8d87195f`; removed retry that stripped transport/provider/budget/deadline preferences; regression assertion added to `tests/journey-search-abort.test.ts`; `git diff --check` passes. | IMPLEMENTED_LOCAL / NOT_TESTED | Not committed, PR, or merged. Focused test/typecheck/lint deferred at 31% free RAM and 16 GiB free disk; validate on exact Server main or staging after resource gate recovers. |
| Server search filter contract | Server-main source tree `3db97b5563d8f4049927aa90c360037dc54d8a17` includes validation and planner use for `allowedTransportTypes`, `maxPriceMinor`, and `maxTotalDurationSeconds`. | SOURCE_REVIEW_ONLY | Not a live API test. Public tunnel remains dirty development build; no search request submitted. |

## 2026-11-08 07:08 UTC — integration database precondition

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Isolated Server integration DB availability | Existing loopback Postgres container; read-only `information_schema` count for `marshgo_e2e`: 55 public tables. `scripts/run-integration-tests.sh` defaults to `127.0.0.1:5434/marshgo_e2e` and guards loopback host plus E2E-prefixed DB names and loopback Redis. | TEST_ENVIRONMENT_PRESENT / TESTS_NOT_RUN | No migration or suite was executed. At green resource gates, run focused suites through the guarded harness and require nonzero test counts; never target active dev DB `marshgo` or API `:3002`. |
| Resource gate for local integrated acceptance | Latest 07:14 UTC recheck: disk 16 GiB free, RAM free 30%, swap 8,688.50 MiB; no heavy task active. Existing Docker/API/preview services left running. Backup volume not mounted; prior inventory found no safely disposable cache. | DEFERRED | Disk remains below 20 GiB project green gate. Do not clean Docker, user data, repositories, or active tooling caches. Recheck resources before heavy E2E/build. |

## 2026-11-08 07:03 UTC — Site search controls and current API reachability

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Custom journey budget | Exact Site main `868a7d16d44369d8d73767e28359f4ea8d87195f`; browser selected “Свій варіант…”, entered 450 UAH and applied it; UI showed “До 450 грн”. `tests/journey-search-bounds.test.ts`: 12/12, including conversion to minor units and invalid-value rejection. | LOCAL_UI_VERIFIED | No journey was submitted; route/API filtering was not exercised. |
| Current search layout / compact destination map action | Same Site SHA; `tests/canonical-design.test.ts`: 27/27, 0 skipped. Browser rendered the search UI; only the compact destination-field map-pin action is present, not a separate full-width picker. | LOCAL_UI_AND_FIXTURE_VERIFIED | No screenshot on the final candidate captured; code and accessibility tree were inspected. |
| API health through approved zrok host | `/readyz` and `/api/v1/health`: HTTP 200; `/api/v1/version` identifies dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, `sourceState=dirty`. | DEV_API_READY_ONLY | Not staging; exact release SHA is absent. |
| Place autocomplete | Generic Lviv probe through the tunnel returns 503 `geocoder_unavailable`; the local preview shows the retryable unavailable state and zero suggestions. | BLOCKED_PROVIDER_CONFIG | Configure a lawful, approved geocoder on the pinned candidate; public Photon is sample-only. No route request was submitted. |

## 2026-11-08 06:49 UTC — MarshPass QR replay review

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Ticket signature, expiry, booking binding and boarder authorization | Server main `408d54b5531191885069e057b405cc50444eb268`; read-only source review: HMAC-SHA256, constant-time signature comparison, expiry/booking claims, participant-only ticket retrieval, driver-only boarding with row lock. | IMPLEMENTED_SOURCE_REVIEW | No security or integration test was run in this checkpoint. |
| MarshPass one-time scan / replay behavior | Main-source boarding returns HTTP 200 `replayed: true` for a still-valid ticket after status is already `boarding`; repeated request creates no second transition/event. The characterization test documents this and the absence of nonce persistence. | NOT_ACCEPTANCE_VERIFIED | No isolated loopback API/database was available. Clarify one-time nonce semantics, then test migration, concurrent scans and replay against a disposable DB. This does not demonstrate forged-ticket acceptance or duplicate boarding. |

## 2026-11-08 06:46 UTC — carpool/Rendezvous evidence

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Rendezvous/geofence state rules | Exact Server main `408d54b5531191885069e057b405cc50444eb268`; `tests/rendezvous.test.ts` and `tests/bookings-list-lifecycle-columns.test.ts`: 9/9 passed, 0 skipped. | FIXTURE_VERIFIED | Unit assertions cover dual arrival, state transitions, geofence accuracy/settings, and lifecycle timestamps; not two-account persistence. |
| Booking seat reservation/idempotency | Exact-main source review at `server/index.ts:5283`: transaction, offer-row `FOR UPDATE`, idempotency check, available-seat check, seat decrement and booking insert before commit. | IMPLEMENTED_SOURCE_REVIEW | No concurrent DB test was run. Run opt-in `tests/two-account-rendezvous.integration.test.ts` against a disposable loopback API/database to prove last-seat race, two accounts and strict cleanup. |

## 2026-11-08 06:39 UTC — coordinate request and planner oracle

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Map-picked WGS84 coordinate accepted by Server search contract | Exact Server main `408d54b5531191885069e057b405cc50444eb268`, `tests/journey-search.test.ts`: 3/3 passed, 0 skipped. | FIXTURE_VERIFIED | Validates parsing/time zone/coordinate preservation only; no authenticated API call or DB write. |
| Three-leg routes and strategy selection | Exact Server main, `tests/journey-planner-oracle.test.ts`: 5/5 passed, 0 skipped; three-leg-only graph plus seeded small graphs agree with exhaustive enumeration. | FIXTURE_VERIFIED | Also covers unknown fares and truncation; does not prove candidates exist in a live feed or full API/UI route. |

## 2026-11-08 06:20 UTC — address autocomplete remains blocked at active runtime

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| API readiness | Active local `127.0.0.1:3002/readyz` returned HTTP 200 with database/realtime connected; `/api/v1/version` reports dirty dev SHA `20f64a8b745137f08808d0198ea554f8da8a3911`. | DEV_API_READY_ONLY | Runtime is not the exact Server-main candidate (`408d54b5531191885069e057b405cc50444eb268`); this is not staging or route acceptance. |
| Address autocomplete | Generic Lviv suggestion returned HTTP 503 `geocoder_unavailable`; local root/Server `.env` metadata indicates public Nominatim and no geocoder API key. The Server rejects public Nominatim for autocomplete. | BLOCKED_PROVIDER_CONFIG | Public Photon was approved for sample probes only; do not configure its demo endpoint as production. Verify on the exact candidate after an approved provider is available. |
| Client recovery from geocoder 503 | Site `origin/main` `868a7d16d44369d8d73767e28359f4ea8d87195f`: `tests/place-search-recovery.test.ts` passed 8/8, 0 skipped. Test, recovery module, and imported error constant blobs match current `origin/main`. | FIXTURE_VERIFIED | Verifies recoverable state/copy and clearing stale suggestions; does not verify API recovery, browser rendering, or successful address selection. |
| Manual coordinate/GPS fallback | Site `origin/main` `868a7d16d44369d8d73767e28359f4ea8d87195f`: `tests/map-point-selection.test.ts` passed 6/6, 0 skipped; test and coordinate-selection module blobs match main. | FIXTURE_VERIFIED | Coordinates survive reverse-geocoder failure and GPS coordinates are preserved; still requires rendered-map and authenticated API journey checks. |
| Full user journey | No authenticated search, persisted geometry, rendered browser map, or navigation was performed in this checkpoint. | NOT_TESTED | Browser-control bridge is currently unavailable; use exact pinned Server/Site and an authorized test session when the prerequisites are available. |

## 2026-11-08 03:41 UTC — exact-main local foot geometry component check

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Walking route geometry from provider adapter to Site map model | Server main `f0326ca0d0bfec17bf138a3b479d758f53107a8f`: `tests/journey-walking-routes.test.ts` 19/19. Site main `8ef18e89c22c8d84e5aa5c4c24de6a115ff751b4`: `tests/journey-route-map.test.ts` 13/13. One Lviv sample through Server `routePedestrianPath` → local self-hosted OSRM-foot graph → Site `buildJourneyRouteMapModel` returned 2,054 m / 1,481 s and preserved 93 points with `approximate=false`. | LOCAL_PROVIDER_TO_MAP_COMPONENT_VERIFIED | Does not prove authenticated `/journeys/search`, DB persistence, browser pixels, navigation or staging. Active preview is mismatched: 4179 proxies to dirty API build `20f64a8…`, not Server main; replay the exact journey on a pinned stack with isolated disposable DB. |
| Local preview API identity | `127.0.0.1:4179` Vite config/process targets `127.0.0.1:3002`; `/api/v1/version` reports dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911`. Current Server main is `f0326ca0d0bfec17bf138a3b479d758f53107a8f`; current Site source worktree is dirty at `eda449f008025b2126c92fd24cd68deb513ca3ad`. | DEV_PREVIEW_VERSION_MISMATCH | Proven provenance mismatch only: active API and Server main have identical walking-router source. Prior saved-record inspection found estimate-only WALK legs without street geometry; creation-time router state is unknown. Do not restart/repoint the user's active preview until exact-main stack is isolated. |

## 2026-11-08 04:39 EET — map-pin origin/destination entry contracts

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Search origin/destination selection without reverse geocoder | Exact Site main tree `10952690d3dad7358e9cf0a8d0cf89a5adec311d`: map-point tests 6/6, including coordinate confirmation with reverse-geocoder failure. Exact Server main `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6`: journey-search contract tests 3/3 accept WGS84 [lon, lat] endpoints. | FIXTURE_VERIFIED_COORDINATE_ENTRY | Does not prove auth, live provider routes, walking geometry from API, rendered map, or navigation. Next: exact-main end-to-end test on an isolated disposable DB. |

## 2026-11-08 04:35 EET — local API readiness after idle-container stop

## 2026-11-08 04:35 EET — local API readiness after idle-container stop

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Active local API after stopping unused DB/Redis | Stopped only the idle `marshgo-local-api` DB/Redis pair after verifying its API container had been exited for 31 hours and no clients were connected to 5444/6390. Local `127.0.0.1:3002/healthz` and `/readyz` remained HTTP 200; `marshgo-local-api` volumes were retained. | DEV_API_STILL_READY | API identity remains dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911`; no route search or production/staging acceptance. |

## 2026-11-08 04:29 EET — owner tunnel readiness vs search smoke

## 2026-11-08 04:29 EET — owner tunnel readiness vs search smoke

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Local API readiness through owner zrok tunnel | `GET /healthz` → 200; `GET /readyz` → 200. `GET /api/v1/version` reports build `local-20f64a8b7451-dirty-20261107T074421Z`, commit `20f64a8b745137f08808d0198ea554f8da8a3911`, environment `development`, source state `dirty`. | DEV_TUNNEL_API_READY | Tunnel targets local development, not independent staging; current Server main is `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6`. |
| Search place autocomplete | Generic Lviv query returned HTTP 503 with `geocoder_unavailable`; API error states public Nominatim does not support autocomplete. | BLOCKED | Configure an operated/approved geocoder, then replay typed origin/destination in the app. No user address, authentication, or route-search request was used. |
| Route→map→navigation on a pinned main tuple | No authenticated end-to-end route was run against exact Server `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` + Site `ffad9afc7c0fec826b72868ffcef8efc585e70e6`. | NOT_TESTED | Requires an exact-main runtime and approved geocoder; unit tests and dev tunnel readiness are not route evidence. |

## 2026-11-07 10:05 EET — provider and auth reachability (not journey acceptance)

## 2026-11-07 10:05 EET — provider and auth reachability (not journey acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Lviv static GTFS source | Local dev DB identifies Львівавтодор source ref `mdb:ua-lviv-lvivavtodor-gtfs-2374`, license `CC BY 4.0`, healthy/enabled; last sync `2026-11-06T22:37:13Z`, 1,071 stops, 72 routes, 15,141 trips, 406,422 stop-times (64 bus/8 tram). | LOCAL_SCHEDULE_CATALOG_VERIFIED | Static schedule/source evidence only; not route result or current operator fare/availability. |
| Lviv GTFS-Realtime producer | Single bounded direct probes: VehiclePositions HTTP 200, valid protobuf, 428 entities, feed age 4 s at `2026-11-07T08:04:24Z`; TripUpdates HTTP 200, valid protobuf, 474 entities, age 14 s at `2026-11-07T08:04:14Z`. | LIVE_FEED_SNAPSHOT_VERIFIED | Snapshot only; does not show the authenticated planner/API consumed these entities or generated a live user route. |
| Auth endpoint reachability | Empty JSON POST to register/login returned expected HTTP 400 `invalid_email` on both local API and zrok, all same dirty development Server SHA. | ROUTE_REACHABLE / AUTH_NOT_TESTED | No valid credentials or account creation submitted. Owner must sign in manually for fresh route acceptance. |
| Search autocomplete | Still HTTP 503 because public Nominatim is rejected for autocomplete. Photon adapter works against one generic public landmark query; no user address has been forwarded. | GEOCODER_BLOCKED_PENDING_APPROVAL | Wait for owner approval to send typed place queries/bias to public Photon for low-volume local/staging evaluation, otherwise provision self-hosted/contracted geocoder. |

## 2026-11-07 10:01 EET — fresh walking geometry evidence (still no authenticated acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site route geometry rendering | On Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`, `tsx --test tests/journey-route-map.test.ts`: 14/14 passed, including no invented line for missing geometry, dashed estimated walks, and solid routed walks. | LOCAL_UNIT_PASS | Does not prove a fetched journey contains geometry or map pixels show it. |
| Server walking routing | On dirty Server candidate SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, `tsx --test tests/journey-walking-routes.test.ts`: 19/19 passed, including OSRM foot geometry, bbox pair selection, cross-city refusal, and outage/constraint behavior. Lviv/Kyiv local graph probes return 62/70 points. | LOCAL_UNIT_AND_ROUTER_SMOKE_PASS | No authenticated UI→API→DB search replay yet. |
| Browser route card | Existing saved Lviv result visibly labels walks approximate; after entering search form, Search shows “увійдіть в акаунт”. No fresh journey was created. | AUTH_BLOCKED / OLD_RESULT_UNVERIFIED | Owner signs in in browser; then perform a fresh search. Do not use old result as live geometry evidence. |
| Address autocomplete | `/api/v1/places/suggest?q=Rynok` returns HTTP 503 `geocoder_unavailable` on local API, local Site proxy, and zrok; runtime is configured to reject public Nominatim autocomplete. Photon adapter smoke with generic public Lviv landmark returned 3 normalized results. | GEOCODER_NOT_CONFIGURED | Owner approval pending before sending end-user typed addresses/location-bias coordinates to Photon demo; production requires self-hosted/contracted endpoint. |
| Runtime identity | API `/readyz` HTTP 200; `/api/v1/version` reports dirty development Server SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, build `local-20f64a8b7451-dirty-20261107T074421Z`. | LOCAL_DEV_READY_ONLY | Not staging and not a pinned release candidate. |

## 2026-11-07 03:42 EET — current Lviv feed snapshot (not journey acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Lviv static schedule source | Local dev DB: sourceRef `mdb:ua-lviv-lvivavtodor-gtfs-2374`, open/enabled/healthy, last sync `2026-11-06T22:37:13Z`; 1,071 stops, 72 routes, 15,141 trips, 406,422 stop-times (64 bus/8 tram). | LOCAL_SCHEDULE_SOURCE | Does not prove production sync or current journey correctness; user auth required for route replay. |
| Lviv live VehiclePositions | Direct producer GTFS-RT at 01:40 UTC: HTTP 200, valid 15-byte FeedMessage, header age 3s, zero entities/positions. | FRESH_EMPTY_SNAPSHOT | One overnight instant only; not a live vehicle result and not evidence of outage. |
| Lviv live TripUpdates | Direct producer GTFS-RT at 01:40 UTC: HTTP 200, valid 15-byte FeedMessage, header age 17s, zero entities/stop updates. | FRESH_EMPTY_SNAPSHOT | No live delay/cancellation/ETA claims for this snapshot. |
| Provider terms and schedule coverage | Official static-feed record in Mobility Database shows 72 bus/tram routes, service dates through 2027-08-26; data.gov.ua describes producer and 1–2/week average update cadence. | SOURCE_REFERENCED | Dataset links to portal; verify exact applicable license before production. |

## 2026-11-07 03:37 EET — auth gate diagnosis (not end-to-end acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Search authentication | Server `POST /api/v1/journeys/search` is declared with `requireAuth` at `server/index.ts:3070`; plain browser tab with no session shows register/login. | EXPECTED_AUTH_GATE | Owner must authenticate; don't submit credentials via Codex. |
| API health through local preview/tunnel | `/healthz`, `/readyz`, `/api/v1/version`: HTTP 200 on local API and public zrok at 03:30 EET; candidate SHA `90ed82837453ebcd23be9e7cc8d18c8bb5f62000`, environment `development`. | LOCAL_HEALTH_PASS | Public zrok is a tunnel, not staging; not a release candidate. |
| Registration route reachability | Deliberately invalid input returned HTTP 400 `invalid_email` locally and through zrok. | ROUTE_REACHABLE | No valid registration/login attempted; full auth remains NOT_TESTED. |
| Provider-backed local route display | Previous local authenticated search showed three Lviv schedule routes; provider summary has Lviv `Львівавтодор` GTFS bus/tram. | LOCAL_SCHEDULE_ONLY | No live GPS/availability proof; UI warns search is partial and walking geometry approximate. |
| Current browser visual replay | CUA browser bridge reports `browser.user is unavailable`. | NOT_TESTED | Resume when the bridge is available; do not start Playwright under current RAM gate. |
| Resources | 03:35 EET: disk 21 GiB, free RAM 31%, swap 13.45 GiB. | DEFER_HEAVY_LOCAL_WORK | Resume heavy work after free RAM reaches 35%. |

## 2026-11-07 03:16 EET — local PWA preview and walking-router recovery (not release acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site visual search/detail | Dirty Site branch `antigravity/ultimate-premium-web-9`, HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`; rebuilt local bundle SHA-256 `a070cabd4280faa59529e2df738c5280169a83d7c668c6ad8a45b0459b7374be`. Browser showed three scheduled Lviv routes; route detail labels tram `ЗА РОЗКЛАДОМ` and no longer displays synthetic approaching-vehicle UI. | LOCAL_TESTED | Dirty branch/local preview only; no merge/deployment or current-main browser replay. |
| Site build | `npm run build` in `MarshGO-Site`: PASS; Vite 8.3.5. New bundle has no `approaching-vehicle-card`/`approachState`. | PASS | Bundle is generated from dirty local source and is not a release artifact. |
| Site route-map tests | `npx tsx --test tests/journey-route-map.test.ts`: 14 passed, 0 failed/skipped. | PASS | Covers route geometry/model; not live map/provider acceptance. |
| Server foot-routing tests | `npx tsx --test tests/journey-walking-routes.test.ts`: 19 passed, 0 failed/skipped on runtime candidate source `90ed82837453ebcd23be9e7cc8d18c8bb5f62000`. | PASS | Contract/unit evidence only; separate live endpoint probe below. |
| Local foot graphs | Backend walking adapter chose bbox-scoped Lviv `127.0.0.1:3013` and Kyiv `127.0.0.1:3014`; actual OSRM response: Lviv 20 m/15 s/3 geometry points, Kyiv 1,274 m/917 s/153 points; cross-city endpoint selection returned none. | LOCAL_TESTED | Local OSM graph probe, not live transit feed, public staging, or production. |
| Local API | Restarted using `scripts/start-local-api.sh` against runtime candidate SHA `90ed82837453ebcd23be9e7cc8d18c8bb5f62000` with local bbox-scoped `WALKING_ROUTING_URLS`; `/healthz` and `/readyz` HTTP 200, DB/realtime connected. `/api/v1/version` still reports null build identity. | LOCAL_TESTED | Browser search was not replayed after restart because the browser control bridge stopped responding; rerun authenticated search and verify geometry. |
| Resource / cleanup | 03:18 EET local status script: disk 19 GiB free, RAM 29% free, swap 14.3 GiB; DerivedData 34 MiB, CoreSimulator caches 0 B, simulator device data 13 GiB across 12 shutdown devices. External backup mount `/Volumes/500` absent. | NO_SAFE_CLEANUP | Preserve simulator data/evidence; do not delete or move without mounted backup target. Disk-heavy checks deferred below the current 20 GiB disk gate. |
| Public HTTPS tunnel | zrok `/` and `/readyz` HTTP 200; unauthenticated protected `/api/v1/journeys/me` HTTP 401. | LOCAL_TUNNEL_ONLY | Tunnel targets local services; not stable staging or production. |
| Release | No main merge, exact six-SHA acceptance, staging acceptance, production rollout, or App Store/device action in this checkpoint. | NOT_RELEASED | Production stays `NOT_RELEASED`; continue with authenticated route replay, runtime build identity, and pinned staging/API candidate. |

## 2026-11-07 00:03 EET — current-main isolated runtime prepared

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current Server worktree | `/private/tmp/marshgo-server-current-main-20261106` clean at `7774a81a77afbbdbec7248e2b343020f29cf61f1`; canonical dirty checkout untouched. | PINNED | Install lockfile dependencies and run checks after resource gate. |
| Fresh database stack | Main Compose config PASS with root `.env`; sanitized DB alignment MATCH; ports 5434/6380 free. Unique project prefix provides fresh volumes; fixed-volume local-api launcher must not be used. | PREFLIGHT_PASS | Start Compose project only when RAM ≥35%. |
| API readiness | Approved staging `/readyz` and `/api/v1/journeys/me` HTTP 502. No local Server API on `3002`. | BLOCKED | Start current code against fresh isolated DB, then verify `/healthz` and `/readyz`. |
| Resources | 00:01 EET: 22 GiB disk free, RAM 30%, swap 13.3 GiB. | DEFER_HEAVY_LOCAL_WORK | No Docker startup, npm install or tests until ≥35% free RAM. |

## 2026-11-07 00:00 EET — Server isolated-runtime preflight

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current Server source | Clean detached worktree `/private/tmp/marshgo-server-current-main-20261106` at `7774a81a77afbbdbec7248e2b343020f29cf61f1`; canonical dirty checkout preserved. | PINNED | Build/runtime checks still required. |
| Disposable DB/Redis configuration | Compose config PASS with root `.env`; sanitized DB credential/name comparison MATCH; target ports 5434/6380 are free. Existing old-stack volumes remain isolated on ports 5444/6390. | PREFLIGHT_PASS | Start a new uniquely named Compose project only after RAM ≥35%; wait for health. |
| Local API runtime | No API listener on `3002`; approved staging API `/readyz` and `/api/v1/journeys/me` both HTTP 502. | BLOCKED | Start current Server against new disposable local DB/Redis after resource gate; then verify `/healthz`, `/readyz`, auth and provider-backed search. |
| Resource gate | 23:58 EET: disk 22 GiB free, memory 30%, swap 13.4 GiB. | DEFER_HEAVY_LOCAL_WORK | No Docker startup, npm install, Xcode build, full suite or E2E below 35% free RAM. |

## 2026-11-06 23:35 EET — current integration and runtime recheck (not a release tuple)

| Requirement | Current evidence | Status | Boundary / next action |
|---|---|---|---|
| Exact GitHub `main` refs | Root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; Server `7774a81a77afbbdbec7248e2b343020f29cf61f1`; Site `d12789e47be608a1ca3abac17aa6d4c348206226`; iOS `ad27b6f70b6255d1dd323bafcffafe4558232224`; Admin `02b28940ee017523f2feed01de458f8d0aa20279`; Partner `179631f45e984c5712bef83af43912125e3521d1`. | OBSERVED_ONLY | Not an exact-SHA integration acceptance; build and test one pinned compatible tuple. |
| Server main post-merge CI | Server PR #102 merged to `7774a81a77afbbdbec7248e2b343020f29cf61f1`; post-merge workflow `42296293081` SUCCESS. | CI_PASS | Test-only PostgreSQL socket-failure regression; not product runtime acceptance. |
| Site main | PR #80 merged to `d12789e47be608a1ca3abac17aa6d4c348206226`; post-merge CI `42292550947` SUCCESS. | CI_PASS | Visual/API acceptance remains unproven. |
| Staging API readiness | Approved host `/readyz` HTTP 502 and `/api/v1/journeys/me` HTTP 502 at 23:35 EET. | BLOCKED | Restore API upstream; then verify health, auth, provider-backed search and navigation. |
| Root release materialization | PR #20 exact-head run `42265893827` passed ops tests, migrations/integration, build and bundle checks, then private Admin clone returned HTTP 403. PR #12 remains open. | BLOCKED | Correct read-only Actions credential scope and rerun exact-head required checks. |
| PR #12 refreshed CI | Exact-head run `41918171313`, attempt 2: typecheck, lint/unit/ops, migration/integration, build, bundle and access-setup all passed; final materialization got HTTP 403 cloning Admin. Secret name exists; value not read. | BLOCKED | Replace/repair secret with read-only Contents access to both Admin and Partner; rerun #12/#18/#20 required checks. |
| Current physical iOS / device | No new build or install was run in this checkpoint. | NOT_TESTED | Requires healthy API plus device/signing acceptance. |
| iOS device pairing and pins | Physical iPhone 15 Pro Max `available (paired)` over Wi-Fi; Xcode 27.0. Clean iOS `ad27b6f70b6255d1dd323bafcffafe4558232224` + Site `d12789e47be608a1ca3abac17aa6d4c348206226` candidate prepared in isolated worktree. Capacitor dependencies absent; `xcodebuild -list` did not resolve project. | DEVICE_PAIRED / BUILD_NOT_TESTED | After resource gate, install dependencies, build/sign, deploy and launch; real API acceptance also needs staging `/readyz` recovery from 502. |
| Resource gate | Post-work sample at 23:51 EET: disk 22 GiB free, memory free 29%, swap used 12.99 GiB. | DEFER_HEAVY_LOCAL_WORK | Wait for at least 35% free memory and 20 GiB disk before heavy build/test/E2E. |
| Local API/database wiring | Site listener exists at `127.0.0.1:4178`; API `3002` and root `.env` DB/Redis `5434/6380` are down. Healthy `5444/6390` services are persistent `marshgo-local-api` DB/Redis from old Server SHA `8d3239cf84ab9aca7693f579a77822f00a279453`; acceptance DB/cache and OSRM also run. | BLOCKED | Do not point current code at old persistent volumes without confirming intended DB and credentials; prepare an isolated disposable DB/Redis stack when resources permit. |
| Local auth | Current launcher sets dev OTP/bypass off and SMS provider disabled; no real SMS provider is configured. | BLOCKED | Configure an authorized staging/test SMS provider or use a dedicated test identity flow in a disposable non-production environment. |

## 2026-11-06 15:31 EET — exact GitHub main SHA snapshot (not a release tuple)

Read-only GitHub refs queried at 15:31 EET after Server PR #92 merge:

| Repository | `main` full SHA |
|---|---|
| MarshGO | `1e7d0ee74f11121a7d5a29c6379944a5360581c4` |
| MarshGO-Server | `e5b6be86b9d738281dcafddd15f9a32c6f891fdf` |
| MarshGO-Site | `9cbb4a498037219358108c4ea08ac444b88d531a` |
| MarshGO-iOS | `ad27b6f70b6255d1dd323bafcffafe4558232224` |
| MarshGO-Admin | `02b28940ee017523f2feed01de458f8d0aa20279` |
| MarshGO-Partner | `179631f45e984c5712bef83af43912125e3521d1` |

These are current GitHub branch heads, not a tested six-component candidate. Cross-component compatibility, local worktree state, staging, and exact-SHA E2E remain unverified. Existing `docs/RELEASE_MANIFEST.json` is an October historical RC; it remains unchanged and `NOT_RELEASED` until a new pinned candidate is assembled and verified.

## Fresh checkpoint — 2026-11-06 14:55 EET

| Gate | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site PR #78 merged CI | Run `42220028169` on Site `main` SHA `9cbb4a498037219358108c4ea08ac444b88d531a`: lint, typecheck, tests, token checks, build, bundle/single-react checks, Playwright boot-smoke PASS. | PASS (exact main SHA CI) | CI warns about Node 20 action deprecation and the Ubuntu runner migration; these are not current job failures. |
| Qoder Server geometry/provenance candidate | Existing isolated `qoder/geometry-provenance-p0` worktree has static review and `git diff --check` evidence; no runtime tests/build; changes remain uncommitted and outside canonical dirty checkout. Qwen read-only comparison against merged PR #91/main was dispatched at 14:57 EET and is running. | PARTIAL / NOT_TESTED | Review returned findings and diff against current Server main; run focused tests after resource gates recover. |
| Qwen candidate-vs-main review | Read-only review completed 15:02 EET: candidate base `e9934ab` is not ancestor of Server main `a4c2347`, lacks ~40 main commits, its sanitizer rejects current main GTFS provenance tokens, and its walking API/module family is incompatible. It also predates current walking reach/budget/startup contracts. No files/tests changed. Additional static findings: candidate drops main's 1.3 walk detour allowance, plural-URL boot validation, tunable/batched request budget; it uses one `Promise.all` and a different error/token contract. | PASS (static review only) | Do not merge whole candidate. Compare WGS84-only Antigravity helper; only port a mode/token-aware improvement from current main if it preserves live GTFS shapes and current walking contract. Runtime remains NOT_TESTED. |
| Independent provenance design comparison | Qwen completed read-only review at 15:14 EET against exact Server main `a4c2347cb2ce3300dfa0ff96d42296cb00d52758`. It found W3 persists GTFS routeGeometry without `metadata.routeGeometrySource`, unlike W2. No files/tests changed. Its comparison worktree was stale-local-main-based; it is evidence only, not a coding base. | PASS (static review only) | Stale geometry candidates remain unmerged. Do not introduce sanitizer/allowlist or alter walk tokens in this fix. |
| Site PR #58 design/honest CTA follow-up | PR head `5d897d37d2c66c653adb33b73478907cfeb45b6c`, old base `8d927e8098a36f94f2ac519e52f7c720f1e0d239`, GitHub DIRTY; old-head CI `41778515437`/`41778522257` PASS. Narrow diff includes home/empty results copy, role status, tokens, and diagnostics count. | REVIEW IN PROGRESS | Read-only comparison against current main `9cbb4a498037219358108c4ea08ac444b88d531a` and merged PR #78; do not merge stale branch wholesale. |
| Root PR #13 release manifest | Head manifest RC `RC-2026-11-02-mainmerge.1` pins Server `a632d873252c6d51687918f831e39bdb77240cb9` and Site `8d927e8098a36f94f2ac519e52f7c720f1e0d239`; current main is Server `e5b6be86b9d738281dcafddd15f9a32c6f891fdf`, Site `9cbb4a498037219358108c4ea08ac444b88d531a`; PR is DIRTY and Nov 2 checks are stale. | SUPERSEDED AS CURRENT PIN SET / NEEDS REWORK | Preserve the old RC evidence; assemble a new exact-SHA set and validate compatibility before changing canonical manifest. |
| Root PR #12 security follow-up | Qoder checkpoint PR head `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757` has 3 high CodeQL insecure-temp-file alerts at evidence probe lines 75/97/133, in addition to missing private-repo token. Narrow temp-dir/credential hardening is being prepared in isolated root worktree `/private/tmp/marshgo-root-ci-evidence-hardening-20261106`, branch `codex/root-ci-evidence-hardening-20261106`. | IN_PROGRESS | Do not merge while CodeQL or required `verify` fails; parent PR #12 also needs the private repository read secret. |
| Server PR #76 — passenger journey activation | Exact old head `15ad28e3bc70b124799c671737501d1da40ed5ff`, base `a632d873252c6d51687918f831e39bdb77240cb9`; old exact-head CI `41631976618`/`41631983604` PASS, current PR DIRTY. Unique activation/end API absent from main; PR has large stale GTFS replacement and unsafe test completing journey with confirmed booking. | REIMPLEMENT (lifecycle only) | Isolated implementation started from current main `e5b6be86b9d738281dcafddd15f9a32c6f891fdf`; active booking-state guard and integration tests required; no local runtime tests under resource gate. |
| Narrow Server W3 provenance fix | PR #92 merged from branch `codex/route-geometry-main-contract-20261106`: head `df4004a18641af0485abcaf521f07976e065b359`, new Server main `e5b6be86b9d738281dcafddd15f9a32c6f891fdf`; only W3 provenance stamp + focused persistence regression. Initial exFAT worktree attempt left no files/refs and worker made no edits. | PR OPEN / CI IN_PROGRESS; local runtime NOT_TESTED | PR #92 merged after exact-head CI `42224892034` and `42224931399` PASS (lint, typecheck, unit, migrations, full integration, API image, PostGIS/Redis smoke); post-merge exact-main CI `42225535558` PASS: audit, lint, typecheck, unit, migrations, full integration, production API image and PostGIS/Redis smoke. Node 20 deprecation and Ubuntu runner notices only. |
| Local Web/PWA visual preview | Codex IAB screenshot + interaction on `:4178`, dirty Site SHA `eda449f...`: landing → onboarding steps 1/3, 2/3, 3/3 → “Не зараз” → login. Location permission was not granted; credentials were not submitted. `:4178/` HTTP 200, API readiness previously 502; `:4190` connection refused. | PARTIAL (local visual only) | Does not verify merged Site main, authenticated flows, API, MapLibre journey, or visual regression suite. |
| Xcode DerivedData index cache | 37 MiB `Index.noindex` archived to external disk and verified by tar listing + SHA-256 before local removal. DerivedData 71 MiB → 34 MiB. | PASS (safe cache archive) | Root free space rounded to 18 GiB before/after; no material disk recovery. |
| Xcode simulator caches/state | Four shutdown simulator `Library/Caches` trees ~547 MiB; mixed app/cloud/location cache contents left untouched. Device-state directories total ~13 GiB and were not modified. | NOT_MOVED (privacy/state boundary) | No safe 100 GiB candidate within approved Xcode scope. |
| Host resource gate | Latest sample 15:24 EET: `/` 28 GiB free, memory free 30%, swap used 9,461.81 MiB, load 4.78/4.92/5.31. | BLOCKED for heavy local tasks | Disk is now above threshold; continue deferring builds, suites, E2E, Docker/GTFS until memory ≥35%. |
| Credential handling | Process diagnostic output accidentally included an authentication value; value intentionally excluded from this record. | OWNER ACTION REQUIRED | Rotate exposed credential; do not reuse or copy it into project artifacts. |
| Physical iOS build/install | `xcrun devicectl list devices` at 15:19 EET sees iPhone 15 Pro Max as `available (paired)`, physical. No build/install. | NOT_TESTED / BLOCKED | Build deferred by resource gates; owner approved replacement of `ua.marshgo.app`; exact approved HTTPS staging API URL is still required before build/install. |

## Fresh first-journey gate — 2026-11-06 14:32 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server multimodal integration | PR #91 merged to Server `main` at `a4c2347cb2ce3300dfa0ff96d42296cb00d52758`; exact-main CI run `42217945851` passed lint, typecheck, unit/integration, migration, image build and API smoke. | PASS (Server code/CI only) | Does not prove the full Web user journey or live provider behavior. |
| Web entry preview | `:4178` listener PID 60339 is Node with cwd `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`; `/` HTTP 200, title MARSHGO, asset `index-BEWK81_o.js`. | PASS (entry page only) | Served from the dirty Site checkout at `eda449f008025b2126c92fd24cd68deb513ca3ad`; not a pinned release artifact. |
| Web/API readiness | `:4178/readyz` and `:4178/api/v1/health` return HTTP 502; `scripts/local-stack-status.sh` reports Site `:3000`, API `:3002`, DB `:5434`, Redis `:6380/:6381` down. | BLOCKED | Do not infer API readiness from the static page. Restore the intended isolated stack after resource gate clears. |
| Authentication prerequisite | Status reports no complete real SMS provider; OTP requests are expected to return 503. Dev bypass and fake OTP remain disabled. | BLOCKED (external configuration) | Configure an authorized real provider/test destination before authenticated end-to-end sign-in. |
| First provider-backed search-to-navigation journey | No authenticated search, provider-backed route selection, geometry/map validation, or active navigation was executed in this checkpoint. | NOT_TESTED | Requires API/DB/cache readiness, real auth and a lawful available route source. |
| Host resources | `/` 14 GiB free, memory free 28%, swap used 13,962.69 MiB at 14:32 EET. | YELLOW / defer heavy work | Keep local builds, service starts, browser E2E and large imports deferred until green thresholds. |

Site contract follow-up is being implemented in isolated worktree `/private/tmp/marshgo-site-walk-disclosure-20261106`, branch `codex/site-walk-reach-disclosure-20261106`, based on `f37839128452f1a0039f27928892cc5b519e0876`. It addresses the API `walk_reach_extended` response currently missing from Site completeness mapping and result diagnostics; this is not yet verified or merged.

## Fresh resource gate — 2026-11-06 11:46 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Heavy-work host resources | Memory free 31%; disk 9.6 GiB; swap ~9,112 MiB. | BLOCKED | Defer Docker/API/browser E2E until memory ≥35%. |
| App dependencies | API/DB/Redis/cache ports `3002/3019/5434/6380/6381` all down. | BLOCKED | Start intended Server dev dependencies after resource gate; acceptance network stays isolated. |
| First provider-backed journey | No authenticated search, route geometry, or navigation executed. | NOT_TESTED | Resume only after API `/readyz` succeeds and lawful provider route is available. |

## Server startup preflight — 2026-11-06 11:45 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server dev Compose config | `docker compose -f MarshGO-Server/docker-compose.yml config --quiet` passes; services `db`, `redis`, `redis-cache`. | PASS (configuration only) | No containers started; DB/cache health still BLOCKED. |
| API launcher preflight | `bash -n scripts/start-local-api.sh` and `bash scripts/start-local-api.sh --check` pass; auth bypass/OTP and fixtures off, loopback targets. | PASS (preflight only) | No API process started; no health or user-journey proof. |
| Container architecture | Host `arm64`; local PostGIS image `linux/amd64`. | ENVIRONMENT NOTE | Emulation may affect startup; measure, do not infer prior stop cause. |
| Resource gate | Disk 9.7 GiB, memory 34%, swap ~9,122 MiB. | BLOCKED | Defer heavy service start until memory ≥35%; keep one heavy process. |

## Server static-fallback guard review — 2026-11-06 11:43 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Static graph caller exposure | Repository search finds one Server runtime callsite for `composeUkraineMultimodalChains`, guarded by `isStaticMultimodalFallbackEnabled` requiring exact test-only opt-in. Other references are definition/tests. | PASS (static review) | No API integration test or proof of real-provider routes. |
| Test-only policy behavior | Existing focused policy regression test passed 2/2 on dirty Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`. | PASS (focused test) | Server typecheck and live search NOT_RUN. |
| Resource gate | Memory 33% free (<35% defer threshold); disk 9.7 GiB (>8 GiB hard floor, <20 GiB project GREEN target); swap ~8,963 MiB. | BLOCKED | Wait for memory pressure to recover before heavy services/tests. |

## Local stack status diagnostic — 2026-11-06 11:33 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Redis cache readiness visibility | `scripts/local-stack-status.sh` now checks `redis_cache` on `127.0.0.1:6381`, matching Server dev Compose. `bash -n` passes; status run reports the expected DOWN and exit 1 because stack is stopped. | PASS (diagnostic only) | Does not start services or prove API readiness. |
| Full local app stack | Disk 9.7 GiB free, memory 37%; API and DB/cache host ports remain down. | BLOCKED | Defer heavy startup until disk ≥20 GiB. |

## Latest host/runtime gate — 2026-11-06 11:30 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Disk/memory preflight | `/` 9.7 GiB free; memory 33% free; swap 9,001 MiB used. | BLOCKED | Below local heavy-work gates of 20 GiB disk and 35% memory. |
| App dependencies/API | Ports 3002/3019/5434/6380/6381 all down; root Compose `marshgo` remains exited. | BLOCKED | Restore resource headroom, then start intended Server dev stack and verify readiness. |
| Web preview | zrok `/journeys/search` HTTP 200; local entry page only. | PASS (preview) | Not an authenticated or provider-backed route journey. |
| End-to-end journey | No real route search, connected geometry, or navigation executed. | NOT_TESTED | Requires API, DB/cache, and a working lawful provider feed. |

## Resource/cleanup recheck — 2026-11-06 11:25 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Resource gate | `/`: 9.7 GiB free; memory free 34%; swap ~8,983 MiB used. | YELLOW | Do not start heavy local API/DB/browser/build tasks below green thresholds. |
| Safe cache cleanup inventory | Homebrew cache 42 MiB (mostly API metadata), npm 2.2 MiB, Docker builder cache 0 B, Xcode DerivedData 233 MiB. | NO_MATERIAL_SAFE_CLEANUP | No deletion: total known small caches cannot close disk gap; DerivedData may hold useful build outputs. |
| Docker reclaimable images/volumes | Docker reports reclaimable totals, but individual items are not proven disposable. | PRESERVED | No image/volume prune; no data/evidence removed. |
| Real route acceptance | API and host DB/cache unavailable, public preview only. | BLOCKED | Recheck after resource gate permits intended Server dev-stack startup. |
| Web-to-API origin/proxy | Site API base defaults to relative `/api/v1`; Vite `preview.proxy` forwards `/api`, `/healthz`, `/readyz` to `127.0.0.1:3002`. Local preview and zrok `/healthz` and `/api/v1/health` return 502 with API down. | PARTIAL | Static wiring is correct; repeat live proxied health and browser requests after API startup. |

## Current runtime inventory — 2026-11-06 11:20 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Web preview through zrok | Local Site `:4178` and bridge `:3103` listeners exist; local and public `/journeys/search` return HTTP 200. | PASS (local preview only) | Entry screen only; no authenticated journey. |
| App development database/cache | Root `marshgo` Compose project is exited: Postgres logged a fast-shutdown request at 06:15:41Z Nov 4, then exited 137 ~4 seconds later (`OOMKilled=false`; retained events do not identify initiator); Redis exited 0. Host ports `:5434`/`:6380` are not listening. Server dev Compose additionally defines cache Redis `:6381`. | BLOCKED | Wait for resource green gate, then start the intended Server dev Compose file and verify health; do not infer the stop initiator. |
| Acceptance database/cache | PostGIS and two Redis containers are healthy inside `marshgo-acceptance_isolated_acceptance`, with no published host ports. | NOT_APPLICABLE to app runtime | Keep acceptance infrastructure isolated; do not repurpose it or infer app readiness from its health. |
| API | `:3002`/`:3019` are unavailable; local status script reports readiness down. | BLOCKED | Start API only after intended app DB/cache are available and health is verified. |
| SMS OTP | Read-only status script reports the configured real SMS provider missing/incomplete. | BLOCKED | Password login is a separate path; OTP cannot be accepted as working. |
| Safe disk cleanup | npm cache 2.2 MB, Docker builder cache 0 B. Larger reclaimable image/volume totals were not proven disposable and were retained. | NO_SAFE_MATERIAL_CANDIDATE | No caches, images, volumes, or user data removed. |
| Host resources | Sample 11:18 EET: 9.7 GiB disk free, 32% memory free, ~8,977 MiB swap used. | YELLOW | Defer heavyweight local startup/build/browser work until configured green thresholds pass. |
| Route policy regression | `static-multimodal-fallback-policy.test.ts`: 2/2 PASS on dirty Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`. | PASS (focused unit only) | Typecheck and live provider route/geometry/navigation remain NOT_RUN/BLOCKED. |
| Release | No staging or production deployment in this checkpoint. | NOT_RELEASED | Preserve pinned release SHAs and `production_ready=false`. |

## Current workspace recheck — 2026-11-06 11:15 EET

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Web entry screen via zrok | Public `/` and `/journeys/search` return HTTP 200; Codex browser screenshot shows the MARSHGO entry screen. | PASS (local preview only) | Does not prove login or application API. |
| API readiness | Public `/readyz` returns 502; API :3002/:3019, Postgres :5434, Redis :6380 unavailable. | BLOCKED | Restore local API dependencies, then verify `/healthz` and `/readyz`. |
| Provider-backed routes → geometry → navigation | No live API request possible; no journey results verified. | NOT_TESTED | Requires ready API and lawful feed/provider data. |
| Static graph estimate fallback | Test-only opt-in policy on dirty Server; targeted unit test 2/2 PASS via root TSX runner. Explicit fallback output is UNVERIFIED/ESTIMATED with UNKNOWN availability. | PARTIAL (focused policy test only) | API integration, typecheck and real-feed behavior NOT_TESTED; API/DB remain unavailable. |
| Local admin account | Seed helper remains unexecuted because loopback database is down. | NOT_TESTED | Seed only against disposable loopback development DB, then verify password login and admin role. |
| Production release | No staging deployment, release build tuple, or rollback validation in this step. | NOT_RELEASED | Keep `production_ready=false`; existing full release gates remain open. |

## Current Server routing recheck — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server static/unit checks | Current dirty source on Node 24.22.1: typecheck/lint pass; 239/239 unit pass; one opt-in integration skip | PASS (local source) | Not immutable release SHA or staging. |
| Dense Lviv GTFS completeness | Three repeated baseline O/D replays are deterministic, but endpoint selection, search budget, 2,500 candidate pool/sampling and segment-span loss remain; all set `searchTruncated=true` | FAIL / OPEN | Preserve partial disclosure; implement query-directed frontier and prove exhaustive oracle parity. |
| All-stop endpoint selection experiment | Clears only the endpoint-selection flag; route-chain counts decrease on two O/Ds; all searches still partial | REJECTED | No product code change. See [audit 226](audit/226_GTFS_ACCESS_STOP_CAP_AB_2026-10-26.md). |
| Shared-frontier candidate search | 44/44 exhaustive small-feed tests pass; unbounded draft OOMs on dense city feed; bounded retry exceeds 66 s for 3×3 replay | REJECTED | Not integrated; see audit 226. |
| Mutable DFS allocation optimization | 44/44 exhaustive GTFS tests pass; dense-feed candidate hashes/winners/route-chain counts unchanged, but one of three O/D median latencies regresses 48% | REJECTED | Not integrated; see audit 226. |
| Unknown-fare GTFS balanced preselection | Uses shared balanced scorer; unknown/non-UAH fares are not treated as zero. GTFS 45/45; full Server 240 PASS/1 opt-in skip; typecheck/lint; integration 29/29; stable three-OD replay. | PASS (local dirty source) | Dense-feed searches remain truncated; not a complete-search or release proof. See [audit 227](audit/227_GTFS_UNKNOWN_FARE_BALANCED_CANDIDATE_RANKING_2026-10-26.md). |
| Per-route-chain objective portfolio | 46/46 small GTFS tests pass; dense replay loses route-chain diversity (62→32 / 43→27 / 45→33) and regresses median latency 34–48% | REJECTED | Isolated experiment removed. Next design must allocate candidates globally across chains/strategies; see [audit 228](audit/228_GTFS_ROUTE_CHAIN_PORTFOLIO_SAMPLING_REJECTED_2026-10-26.md). |

## Portal responsive acceptance — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin responsive sections | Five sections across 320/390/430/768/1280/1440; no page horizontal overflow; local checks and hosted Admin PR #1 verify pass | PASS (local authenticated browser + CI) | Not staging or production. |
| Partner mobile navigation and sections | Fixed omitted Settings item; four sections across the same six widths; 54 combined Admin/Partner viewport checks pass; Partner PR #1 exact-head verify pass | PASS (local authenticated browser + CI) | Local isolated API. Screenshot-only OTP retry was throttled, but authenticated page navigation passed. |
| Server/Admin API regression | Server PR #43 checks pass; 30/30 isolated integration tests in prior checkpoint; Admin PR #1 checks pass | PASS (candidate source/CI) | PRs remain open and depend on exact stack; no release tuple. |
| Production readiness | Staging, provider entitlement, physical iOS, complete security/load/recovery/backup/rollback and deployed SHA gates remain incomplete | BLOCKED / NOT_RELEASED | No production deployment. |

See [audit 225](audit/225_PORTAL_RESPONSIVE_NAVIGATION_ACCEPTANCE_2026-10-26.md).

## Admin audit lifecycle fix — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin audit includes partner operations | Server #43 adds role-protected `/admin/audit`; integration asserts 403 for non-admin and approval event/actor with details excluded; Admin #1 updated to render it. Browser confirms approval appears with actor. | PASS (local source/integration/browser); CI pending | Open PRs, no staging/deploy. |
| Source verification | Server 316 unit PASS / 3 opt-in skip, full integration 30/30, typecheck/lint PASS; Admin 4/4 tests, typecheck/lint/build PASS. | PASS (local) | New hosted exact-head checks still pending. |
| Full production | No unified release tuple, staging, deployment SHA, external-provider acceptance, device/recovery/rollback evidence. | BLOCKED / NOT_RELEASED | Keep release gates closed. |

See [audit 224](audit/224_ADMIN_AUDIT_FEED_CROSS_REPO_FIX_2026-10-26.md).

## Authenticated Admin/Partner portal acceptance — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin functional portal | Exact PR #1 head `f39c4b7…`: OTP, overview, partners, providers, integrations, audit; no JS errors; typecheck/lint/4 tests/build and hosted verify pass | PASS (local authenticated browser + component CI) | Local isolated API/DB; open PR, not deployed. |
| Partner onboarding and settings | Exact PR #1 head `97a3727…`: OTP, application submit, pending integration state, settings; typecheck/lint/3 tests/build and hosted verify pass | PASS (local authenticated browser + component CI) | No real partner data or external provider operations. |
| Admin approval lifecycle | Submitted synthetic Partner application approved through Admin; confirmed active status and success notice | PASS (local isolated API/DB) | Not staging or production. |
| Combined Server API | Browser API source tree identical to Server PR #42 tree `86c3899…`; derivative commit `2ff505b…` | PASS (tree identity + local flow) | PR #42 unmerged; no unified release tuple. |
| Production readiness | Staging, deployed SHA, physical device, external provider rights, load/security/recovery and rollback gates still lack evidence | BLOCKED / NOT_RELEASED | Keep `PRODUCTION_READY=false`; obtain required gates and owner rollout approval. |

See [audit 223](audit/223_ADMIN_PARTNER_AUTHENTICATED_BROWSER_ACCEPTANCE_2026-10-26.md).

## Browser recheck — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Full local Site browser suite after locator repair | 25/25 Playwright PASS in 6.7 minutes; 179 controls clicked; zero inert / stale-before-click | PASS (dirty local source) | Isolated `marshgo_e2e` API/DB and fixture map, geocoder, OSRM; not staging/live-provider/production. |
| Current-Site cross-browser smoke | 3/3 responsive sign-in/home/search PASS in Chromium, Firefox, WebKit | PASS (fixture) | One scenario per engine; not all route/map/role states cross-browser. |
| Production readiness | Root manifest `NOT_RELEASED`; no deployed SHA or verified staging URL/provider | FAIL / BLOCKED_EXTERNAL | Keep deployment gates closed and obtain staging/access/secrets; production deploy still needs separate approval. |

## Rendezvous GPS consent serialization — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| GPS write racing consent revocation | Isolated Postgres integration holds the rendezvous row, queues revocation, then queues GPS; revocation succeeds, GPS receives 403 for missing consent, and both Redis-backed positions are absent. | PASS (local integration) | Dirty Server source, not staging or production. |
| Repeated participant consent | Integration posts enabled=true after both positions are live; both exact positions and state remain unchanged. | PASS (local integration) | No physical-device/background GPS evidence. |
| Full Server test checkpoint | Typecheck + focused ESLint PASS; unit 239/239 plus 1 opt-in skip; full isolated integration suites 29/29 PASS. | PASS (dirty source) | Full source tree remains dirty and differs from release-manifest SHA. See [audit 218](audit/218_RENDEZVOUS_CONSENT_RACE_AND_FULL_SERVER_TESTS_2026-10-26.md). |

## Admin and Partner current source checks — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin current local source | `codex/p0-admin` @ `bc37198ca139408907aaefa0d97dc9b60a568300`; typecheck, lint, 2/2 tests and production build PASS. | PASS (source checks) | Tests cover frontend role-state guards; authenticated RBAC/operations are NOT_TESTED. Current SHA differs from release manifest pin. |
| Partner current local source | `codex/p0-partner` @ `97a3727cc395dea092af6e3e24d6822370c2bc63`; typecheck, lint, 3/3 tests and production build PASS. | PASS (source checks) | Tests cover onboarding/member presentation states; authenticated tenant isolation/operations are NOT_TESTED. See [audit 219](audit/219_ADMIN_PARTNER_CURRENT_LOCAL_CHECKS_2026-10-26.md). |

## Latest Server search optimization and deployment recheck — 2026-10-25

## Latest local acceptance checkpoint — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Production Site browser flows | Full Playwright fixture E2E 25/25; 179 controls, zero inert/stale-before-click; route map, two-account booking/chat, GPS reroute, rendezvous, profile, mobile viewports | PASS (dirty local source) | Fixture API/map/geocoder/OSRM; no staging/live providers. |
| Site static checks and build | Typecheck, lint, 99 unit tests, production fixture build and 16-chunk gzip budget | PASS (dirty local source) | Not an immutable release artifact. |
| Server static and local integration checks | Bundled Node 24.22.1; typecheck/lint; full unit suite 237 PASS / 0 FAIL / 1 opt-in SKIP; isolated loopback PostGIS/Redis integration 29/29 PASS | PASS (dirty local source) | Not an immutable release SHA, staging, or production. |
| Root/Web local release gates | Bundled Node 24.22.1 `npm run check:production`: typecheck/lint, 256 unit PASS / 1 opt-in skip, production build and 51-chunk gzip budget all PASS | PASS (dirty local source) | Site was unchanged in this follow-up; previous 25/25 browser E2E used local fixtures. No staging/live-service proof. |
| Dense Lviv GTFS route search | Three repeated frozen-feed O/D replays preserve deterministic result hashes and all FASTEST/CHEAPEST/BALANCED winners after reverse-reachability allocation reduction | FAIL (search completeness) | Every O/D still reports `searchTruncated=true` and result-page limiting. Medians varied by O/D and were unpaired; no general performance gain claimed. See audit 212. |
| GTFS long-segment generation | A 50-stop active-trip regression now returns the selected-origin → selected-destination direct service beyond 20 stops; transfer-enabled search keeps `segmentSpan=true` for other potentially omitted edges | PARTIAL | This does not extend long segments after transfers or close dense-feed search truncation. See audits 213–214. |
| Server DB/cache integration | 29/29 local integration tests against loopback `marshgo_e2e`, PostGIS and Redis | PASS (isolated local) | Not staging/production. |
| Admin pinned snapshot | Manifest SHA `f39c4b74839a393f4487c830930669eabc8c0390`; typecheck/lint/build and 4/4 unit tests | PASS (local snapshot) | Authenticated production flows not tested. |
| Partner pinned snapshot | Manifest SHA `97a3727cc395dea092af6e3e24d6822370c2bc63`; typecheck/lint/build and 3/3 unit tests | PASS (local snapshot) | Tenant-isolation and operations E2E not tested. |
| iOS simulator smoke | Xcode 27 wrapper build/install/launch succeeds; landing UI appears on iPhone 16 Pro Max Simulator | PARTIAL | Embedded Site differs from tested Site; first capture was launch surface; no physical-device acceptance. |
| Admin/Partner authenticated acceptance | No authenticated browser/API workflow run on this tuple | NOT_TESTED | Need role-authorized disposable identities and coherent portal/API staging fixture. |
| Reference mockup visual acceptance | Automated selected screenshots/states pass; supplied JPG paths unavailable locally | PARTIAL | Manual review of all ten references and approved live map style remains open. |

## Addendum — Server Partner/Admin API candidate — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Partner onboarding and organization membership | Open Server PR #42 exact head `a403a51a203d9d89685c10c69658c8fd95b70e9b`; isolated Postgres test covers atomic application, owner membership, own-org read and cross-tenant 404 | PASS (candidate API only) | Not yet the release-pinned Server SHA |
| Partner organization-scoped permissions | Active membership, organization status and role matrix; integration checks suspension and unit tests cover roles | PASS (candidate API only) | Browser operations still need exact-tuple acceptance |
| Admin provider control center | Dashboard, integration list, test/update actions and redacted source data; non-admin 403, URLs/secrets omitted, unsafe enable rejected | PASS (candidate API only) | Does not establish live provider rights/health |
| Admin partner review | Approve/reject/suspend lifecycle; reason validation, approval, duplicate-decision conflict and suspension tested | PASS (candidate API only) | Needs authenticated portal browser acceptance |
| Admin/Partner browser integration | Portal UI against immutable API tuple | NOT_TESTED | Run browser flows once branch ancestry/tuple is reconciled |
| Staging/deployed release | Exact 5+1 artifact and HTTPS smoke | BLOCKED_EXTERNAL | No verified staging URL or deployed SHA |

Candidate checks on tree-identical derivative `2ff505b` (source tree SHA matches PR #42): Node 24.22.1; typecheck/lint PASS; unit 316 PASS / 3 opt-in skips; full isolated integration suites PASS. See [audit 222](audit/222_SERVER_PARTNER_PLATFORM_INTEGRATION_2026-10-26.md). PR #42 remains unmerged and is not selected as release-manifest Server pin.
| Route completeness and live providers | Prior frozen Lviv evidence reports search truncation; E2E providers are fixtures | FAIL / NOT_TESTED | Keep partial-result disclosure; verify provider rights and live probes. |
| Staging, ops and production | No verified staging/deployed SHA; no rollout, backup/restore, rollback or full load/security acceptance | BLOCKED_EXTERNAL / NOT_TESTED | No release; separate owner approval required. |

Release remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| GTFS frontier scan cost | Server PR #42 exact HEAD `d5a1067e637ffcab3a2ea3f4f30e41c7fdbb5e24`, stacked on PR #41 `70e11d8d8730e54311f13d73953ab565fd6b432a`; 76/76 GTFS tests, full unit 316 PASS / 3 opt-in skips, typecheck/lint pass; exact-head CI `40216580417` and `40216598199` pass migration, integrations and production-image PostGIS/Redis smoke. Five frozen Lviv pairs per OD preserve result hashes/winners and improve local median latency 9–19%. | PASS for isolated candidate behavior and hosted Server CI | Open draft PR, not integrated; Lviv still `candidateGraphTruncated=true`; local benchmark Node 25.4.0, RSS mixed. See audit 200. |
| Six-repository deployment discovery | Read-only GitHub API: 0 Environments / 0 deployments in each canonical repository; only local development PostGIS and Redis containers are running. | BLOCKED_EXTERNAL / NOT_TESTED | An independent host outside GitHub is not ruled out; no verified staging URL or deployed SHA. |
| Production Compose configuration | `docker compose -f compose.production.yml config -q` fails closed on absent production domain, map manifests, Redis/session/SMS credentials and web map manifest. No secret values were read. | BLOCKED_EXTERNAL | Configure an owned domain/host, production-only secrets, licensed immutable map assets and staging before release review. No deployment performed. |

## Dirty Server GTFS replay — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server typecheck, lint, unit tests | Dirty Server branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; focused GTFS/realtime/ranking 69/69, full suite 233 pass / 0 fail / 1 opt-in skip, typecheck and lint pass. | PASS (local dirty source) | Not immutable release SHA. Full isolated integration is reported in the next row. |
| PostGIS/Redis integration | `npm run test:integration`: migration/PostGIS, Journey schema, live Journey ownership, bookings/last-seat concurrency, trip edits/cancellation, navigation/GPS, Redis realtime, restart durability, shared rate limiting: 29/29 pass. Test API processes exited; existing Postgres/Redis containers remained healthy. | PASS (local isolated integration) | Uses loopback `marshgo_e2e`; not staging, production or live-provider evidence. |
| Dense Lviv GTFS route search | Frozen archive SHA `bb4ac0…78164`, 3 ODs; each returns 100 and sets `searchTruncated=true` / `resultLimitReached=true`. Debug counters identify stop-selection, per-depth search-budget and candidate-sampling loss; global 50,000 step ceiling was not reached. | FAIL (search completeness) | Node 25.4.0 diagnostic only. Do not raise caps blindly; design a bounded destination-directed search and remeasure on Node 24.21.0. See audit 203. |
| Staging / production deployment | No staging or production run performed in this checkpoint. | NOT_TESTED | No production deployment performed. |

## Separate dirty Site checkout — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site typecheck, lint, unit, build and bundle budget | `MarshGO-Site` branch `codex/sync-journey-mobility-ui`, HEAD `6961afcf`; typecheck/lint/build/bundle/diff checks PASS; 98 unit tests pass. | PASS (local dirty checkout) | Node 25.4.0 vs pinned 24.21.0. This is not exact RC or authenticated browser acceptance. |
| Authenticated visual and live API behavior for this checkout | Not run in this checkpoint. | NOT_TESTED | Validate with the matching API and explicit visual acceptance before attributing results to RC. See audit 167. |

## Cross-browser all-control sweep triage — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Firefox/WebKit primary-route control sweep | 179 controls clicked per browser over 15 routes; no stale targets, JS errors or unexpected 5xx. Generic no-effect heuristic reports 2 Firefox / 14 WebKit cases. | PARTIAL (heuristic triage) | Active tabs, empty forms and stale-GPS fixture explain some no-ops; do not count generic observation as product defect or acceptance. Convert remaining cases to requirement-specific assertions. |
| Demand and publish primary CTAs | `e2e/conditional-cta.spec.ts`, exact Site `9569bb4` + Server `134ed017`: Firefox/WebKit 4/4; request CTA opens `/demands/new`, publish CTA opens `/trips/plan`. | PASS (local fixture semantics) | Does not close other WebKit no-effect cases or prove real GPS/Admin/Partner/staging. See audit 130. |
| New E2E spec quality | Root TypeScript typecheck and targeted ESLint pass. | PASS (local) | No source application code changed. |

## Exact RC cross-browser acceptance — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Chromium responsive home/search and route-map interaction | `npm run test:browser-compat` on Server `134ed017828a020e1d5f696b3cb9ea95527bb093` + Site `9569bb4f174a4bdf912a6f490e69a359148db342`; 6/6 cases PASS across Chromium, Firefox, WebKit; viewport checks 320/390/430/768/1280/1440 px | PASS (local fixture) | Test data and map tiles are local fixtures; no staging, production provider or physical iPhone acceptance. See audit 129. |
| Post-run local service cleanup | Playwright/Vite/API test processes exited; existing `marshgo-db-1` / `marshgo-redis-1` stayed healthy | PASS (local process check) | Existing development DB/Redis intentionally remain running. |

## Server PR #39 — GTFS pathway-connected retention — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Distinct platform IDs connected by GTFS pathways survive bounded graph retention | Server PR #39 head `84f5b85544dac520af3a3e28119cb6ee6d4bf522`; merged-feed forward pathway chain retained, reverse-only chain rejected. | PASS (unit regression) | Continue with external/multi-provider feed fixtures. |
| Full Server unit suite | `npm test`: 311 pass / 0 fail / 3 opt-in skips on final head. | PASS (local) | No failure; all 3 skipped cases exercised in the isolated integration workflow. |
| Server integration workflow | `npm run test:integration`: schema/migrations, journey, booking/race/idempotency, trip changes, partner isolation, navigation/GPS, Redis realtime, restart durability and shared rate limits: 30/30 pass after merged-feed changes. | PASS (local isolated test DB) | No staging or production services involved. |
| Exact frozen Lviv replay | Candidate and PR #38 have identical 100-result ID hash and three strategy winners; both graph and search truncation flags remain true. | PASS for unchanged output; route completeness NOT_MET | This Lviv archive has no `pathways.txt`; investigate dense graph completeness separately. |
| Hosted validation | Exact current head `84f5b85` security Verify `40128763529` and Server CI `40128767640` both PASS, including API image build and PostGIS/Redis smoke. | PASS (hosted candidate gates) | Candidate is still draft/stacked; dense-feed truncation and broad route coverage remain open. |
| Production release | No deployment, public traffic, production credentials or production provider access used. | NOT_RELEASED | All cross-repository, staging, real-device and external-provider gates remain separately tracked. |

## Server GTFS stack integration candidate — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Candidate stack consolidation | Local branch `codex/server-production-integration-20261024` HEAD `134ed017828a020e1d5f696b3cb9ea95527bb093`, based on open PR #34; includes lockfile security fix and reproducible replay script. | PASS local checks; hosted CI pending | Keep open/unmerged until exact-head CI and review. PR #35 remains separate and is not rewritten. |
| Dense Lviv replay determinism | Frozen feed SHA `bb4ac0…78164`, three runs have ordered result hash `698e0e…dd6f`, 58 trip / 37 route chains, 100 results; BALANCED differs from FASTEST/CHEAPEST. | PASS for determinism and observed strategy separation | `searchTruncated=true`, `candidateGraphTruncated=true`; complete route coverage FAIL. |
| Exact local Server checks | 308 unit pass / 0 fail / 3 opt-in skip, typecheck/lint PASS, high-severity npm audit 0 vulnerabilities. | PASS for local candidate source | Integration tests requiring isolated DB/Redis and hosted CI on new SHA still pending. Staging, live providers, iPhone NOT_TESTED. |

---

## Dense GTFS candidate-pool follow-up — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Bounded candidate diversity on Lviv frozen feed | Server PR #35 head `098b85cac6f64d81cb203457961ed33924f12615`: five-page per-leg candidate pool. Deterministic replay improved unique route chains 31→49 and trip chains 44→65; same FASTEST/CHEAPEST/BALANCED winner, median 1.38→1.466 s. Server CI for this code SHA passed both verify jobs (`40055919930`, `40055922751`). | PASS for bounded candidate-breadth improvement | Still `searchTruncated=true` from stop selection, search budget and candidate sampling; not full route completeness. Latest PR head has a docs-only follow-up at `6cd3b6c5613e4165576fdb4bc2662a02c9e54818`, CI pending.
| Endpoint stop-selection expansion experiment | Temporary 40-stops/side and four/type policy yielded 54 route chains vs 49, same winners, but median replay time 1.725 s (+17.6%); truncation remained. Reverted; documented in the Server candidate audit. | REJECTED / not integrated | Keep the accepted 20/2 stop caps. Investigate query-directed bounded expansion with exhaustive small-feed oracle parity and frozen multi-OD performance.

---

## Exact RC snapshot acceptance — 2026-10-24

| Component | Exact candidate | Evidence | Status |
|---|---|---|---|
| Site | `2af5219538aa005d285f9236ca0b0dafaca0274a`, PR #21 | Node 24.21: 98/98 tests, typecheck, lint, build, npm audit 0; hosted runs 40040066282 and 40040182059 pass | PASS local + hosted code gates; live/staging NOT_TESTED |
| Server | `c7252783f3c8b3b1140d621bcbdae175248008be`, PR #35 | Node 24.21: 224 unit pass, 1 opt-in skip, typecheck, lint, npm audit 0; hosted runs 40040067773 and 40040185238 pass; isolated integration 29/29 PASS on Node 24.21 | PARTIAL; dense Lviv still truncated |
| iOS | `0fcf5f36e0a751152b9d3cd6778a930b372afae0`, clean PR #14 from main | Exact Site/Server pins + manifest assertion; simulator runs 40041831739 and 40041815392 PASS | PASS simulator only; physical device NOT_TESTED |
| Admin | `9dbf7db0a935498ac40c98b19bc36bce056d630d` | Typecheck/lint/build, 2/2 tests; only no-session 401 route smoke | PARTIAL; authenticated workflow NOT_TESTED |
| Partner | `c639257a7f28aeda5b378a816038b01651146b83` | Typecheck/lint/build, 3/3 tests; only no-session 401 route smoke | PARTIAL; tenant operations NOT_TESTED |
| Cross-repo Browser E2E | Site `2af5219`, Server `c725278` | Full fixture retest 20/20 PASS in 8.8m; 195 safe control clicks/15 routes, trace enabled, no uncaught JS errors/unexpected 5xx | PASS fixture E2E only; live provider/staging and all-reference visual acceptance NOT_TESTED |
| Exact pinned release images | Server `c725278`, Site `2af521`, Admin `9dbf7d`, Partner `c63925`; materialized root config `f727312` | All four Docker images built locally for linux/arm64 from clean pinned source trees; isolated API image migration + PostGIS/Redis `/readyz` PASS; Web/Admin/Partner root+SPA+healthz smoke PASS; OCI refs in audit 103 | PASS local build/runtime smoke; not published/staged/deployed; target architecture unresolved |
| Production deployment | none | No verified staging/production target, deployed SHA or HTTPS smoke | BLOCKED_EXTERNAL / NOT_RELEASED |

# MARSHGO production acceptance matrix

## Route-map and full fixture E2E checkpoint — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Main Site route/control fixture suite | Dirty local Site/Server pair, isolated fixture DB and local map/geocoder/OSRM; full root Playwright suite **20/20 PASS**, 195 safe enabled control clicks over 15 paths, no uncaught page errors/unexpected HTTP 5xx | PASS (local fixture E2E) | Not immutable release SHA, staging, or live providers; 12 click no-change heuristics require semantics-specific/conditional coverage |
| Canonical route map behavior | `e2e/journey-route-map.spec.ts` full scenario checks sheet snapping, segment selection, route fit/center, bus focus, and light/dark states; **1/1 PASS** | PASS (local fixture) | Uses synthetic map assets/data, not live transit or licensed production tiles |
| Route-map visual regression | Seven reviewed route-map snapshots refreshed after comparing current production-path UI against the supplied route references; rerun with screenshots enabled and no update flag **1/1 PASS** | PASS (local snapshot regression) | This accepts the current local regression baseline only; all ten supplied designs, all states, desktop, real assets and owner acceptance remain NOT_ACCEPTED |
| Expanded route overview action | Playwright exposed that “Показати маршрут цілком” was behind the expanded-sheet handle; action moved into the visible summary; targeted E2E now passes | PASS (local fixture) | Physical touch/device behavior remains NOT_TESTED |
| Site quality gates | Production build, typecheck, lint, and unit suite **98/98 PASS** | PASS (local dirty checkout) | Not tied to immutable release SHA or hosted staging |
| RC.21 Admin/Partner local image smoke | Local exact image digests match manifest: Admin `sha256:5947cb121781cd9d9ab69035754b616c18fd1ac9177ee449c1e84c81ead0e44c`; Partner `sha256:8465971cc2ff9cd687adcaa99f0c944e3626289a1d6e12db36c86be5fe7413fc`. UI root returned 200, correct Ukrainian login view, empty required phone blocked, no browser errors/5xx; viewport widths 320/390/430/768/1280/1440 had no overflow. API `/healthz` and `/readyz` returned 200; unauthenticated `/api/v1/admin/dashboard` and `/api/v1/partner/organizations` returned 401. | PASS (local image smoke) | No authenticated Admin/Partner session, organization isolation or mutating workflow tested; not staging/production |
| Admin/Partner source checks | Admin `codex/p0-admin` @ `9dbf7db`: typecheck/lint/build + 2/2 unit tests; Partner `codex/p0-partner` @ `c639257`: typecheck/lint/build + 3/3 unit tests | PASS (source checks only) | Unit tests cover presentation/access states only, not authenticated API, RBAC or tenant isolation |
| Ukrainian open transport-feed health | Read-only probe 2026-10-24: 43 rows, 38 checked, 5 access-policy skips; 28 healthy, 7 degraded, 3 offline. Lviv static GTFS: 1,071 stops/72 routes/15,716 trips/426,685 stop times. | PASS (feed-health probe only) | See `docs/audit/101_TRANSPORT_FEED_PROBE_2026-10-24.md`; no commercial-rights or booking acceptance implied |
| Lviv daytime GTFS route search | Public feed, 2026-10-24 08:00–09:30 Kyiv time, 2 OD pairs: 100 results each at 1.98 s/4.24 s; both searches and result pages truncated; fares absent | FAIL (search completeness) | Keep partial/truncated disclosure and unknown fare; graph/candidate retention remains P0 |
| Lviv live transit layer | Same probe: GTFS-RT vehicle positions and TripUpdates both empty (0/0), no alerts | FAIL (live-data availability at probe time) | Do not display live vehicle or ETA based on these empty endpoints |
| Ukrainian bike/scooter feed candidates | CityBikes discovery found 0 Ukrainian networks; Zelectra mixed Peru/Ukraine coordinates; Nextbike candidate was Latvia; another candidate 404 | BLOCKED / not enabled | Coverage and commercial rights need a verified Ukrainian service source |
| Exact pinned Docker image set | API/Web/Admin/Partner built locally from exact SHAs; API migrations to 054 + PostGIS/Redis readiness; three portal static smokes | PASS local isolated image acceptance | linux/arm64 only; unpublished; no staging, external provider, backup/restore or rollback evidence |
| Production deployment | No production/staging deployment or HTTPS smoke was run | NOT_RELEASED | Remains `PRODUCTION_READY=false`; staging, external rights, device, security/load, recovery and owner rollout gates are open |

The exercised root/Site/Server worktrees are dirty and their exact heads are recorded in `CODEX_PROGRESS.md`; this evidence must not be represented as a clean exact-SHA release candidate.

## Exact cross-repository candidate and Admin/Partner login-screen smoke — 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site PR #20 exact head | SHA `a000b3cc07a956ae7ded4563ab5e97b11fe3db71`; local `check:production` and hosted runs `39995439983`, `39995439935` attempt 2 pass | PASS (candidate only) | Open/unmerged; fixture tests are not staging |
| Server PR #31 + Site fixture flow | Exact Server `b65882584a3ad1e8dd7512d13176f52299cded51` + Site #20; isolated DB migrated to 055; 19/19 browser scenarios pass, covering 192 control clicks/16 paths | PASS (local E2E fixture) | 12 no-change heuristic observations not all individually classified; not every conditional/destructive state |
| iOS PR #12 source pin/build | SHA `6e825cd59df9529c9b88aab063989d7328497fef` pins exact Site #20 and Server #31; hosted simulator run `39996495495` pass | PASS (simulator only) | Physical iPhone, signing, APNs and background behavior NOT_TESTED |
| Admin PR #1 and Partner PR #1 unauthenticated entry screens | Exact snapshots `9dbf7db0a935498ac40c98b19bc36bce056d630d` / `c639257a7f28aeda5b378a816038b01651146b83`; browser rendered login heading and controls at 320/390/430/768/1280/1440 px with no horizontal overflow or page exceptions; required-phone validation prevents empty OTP submit | PASS (entry-screen smoke only) | No API-backed auth: first probe found local API unavailable (502 on refresh); UI-only retry intercepted refresh as 401. Authenticated Admin/Partner flows NOT_TESTED; development-only bypass is not counted as production behavior |
| Ten supplied mockups | No complete matching-state screenshot/visual acceptance set | NOT_ACCEPTED | See `docs/audit/95_USER_MOCK_DESIGN_AUDIT_2026-10-23.md`; preserve reference baselines and capture matching states against approved assets |
| Release tuple and deployment | All six PR stacks remain open; root PR #6 CI fails private Admin/Partner checkout; no verified staging host/deployed SHA | BLOCKED / NOT_RELEASED | Resolve authorized read token, staging/provider/device/recovery gates and obtain explicit rollout approval |

The cross-repository results above are evidence for candidate review only. They do not satisfy `WEB_DEPLOYED_VERIFIED` or `FULL_REQUEST_COMPLETE`.

## Live data and route-search recheck — 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current provider registry probe | `npm run acceptance:transport-feeds`: 38/43 checked, 32 healthy, 4 degraded, 2 offline, 5 skipped; Lviv GTFS 1,071 stops/72 routes/15,716 trips; Lviv RT 625 vehicles + 700 TripUpdates at probe time | PASS (read-only feed health only) | Does not establish commercial rights, user-path rendering, vehicle/route matching, ticketing or booking; see provider matrix |
| Dense Lviv route search | 2 OD pairs × transfer bounds 0/1/2; six probes disclose `searchTruncated=true`, with graph truncation when transfers enabled | FAIL (completeness) | Preserve truthful partial state; deduplicate same-time/same-route alternatives and prove candidate retention against exhaustive small-fixture oracle and frozen-feed winners |
| Server full local verification | 305 unit PASS / 0 FAIL / 3 opt-in SKIP; 30/30 isolated PostGIS/Redis integration PASS; typecheck/lint PASS | PASS (local isolated) | Does not close live feed completeness, staging, production, or physical device acceptance |
| Main Site empty-state actions | Focused Playwright validation + selected tab assertions: 1/1 PASS; no search/create request on invalid forms | PASS (focused browser fixture) | Broad route sweep exists; nested/conditional actions and exact all-mock visual parity remain open |

Statuses: `PASS` only with current, reproducible evidence; `FAIL` for a reproduced defect; `BLOCKED` for a concrete external dependency; `NOT_TESTED` when evidence is absent. A local fixture is not live feed/staging evidence.

## Full Site route/control regression — 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current dirty Site working tree — all declared production routes | Root Site rebuilt to `/tmp/marshgo-current-e2e/dist` with isolated E2E map fixture; current root Server + loopback `marshgo_e2e`; button audit **1/1 PASS**, 16 route paths, **241 visible control clicks**, 0 JS exceptions / unexpected HTTP 5xx; admin route returns expected 403 to passenger | PASS (local working-tree interaction smoke) | 14 heuristic no-change observations need semantics-specific assertions; not a literal test of every conditional state or destructive action |
| Manifest Site `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae` route parity | The same expanded 16-route audit reached `/lifecycle` and received 404; candidate's `productionRoutes.ts` lacks that path, while current root working tree declares and renders it | FAIL (candidate/tree mismatch) | Produce a new exact Site artifact including lifecycle if it is in scope, and run E2E on that immutable SHA |
| Post-fix browser flows | 17 non-button-audit E2Es **17/17 PASS** together; button audit **1/1 PASS** separately; route-map palette/status and fixture cleanup assertions corrected; current root `check:production` typecheck/lint/build/bundle PASS and **256 unit PASS / 0 FAIL / 1 opt-in integration SKIP** | PASS (local fixtures only) | Current candidate and working-tree evidence are distinct; do not claim production/staging |
| Ten reference mockups | Prior visual review found structural overlap, but fixture maps, layer set/grouping, and incomplete state-matched captures prevent approval | NOT_ACCEPTED | Capture each matching view on real/licensed map assets and complete visual review at target mobile and desktop widths |
| Admin/Partner, physical devices, live release | Separate standalone Admin/Partner authenticated workflows, physical Safari/iPhone, live provider/map assets, staging/deploy and production smoke were not tested here | NOT_TESTED / BLOCKED_EXTERNAL | Complete those acceptance gates before release; current release remains `NOT_RELEASED` |

## GTFS transfer-decision extraction revalidation — 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Shared exact GTFS transfer decision behavior | Isolated Server worktree `codex/gtfs-event-round-v2-20261023`, based on `b65882584a3ad1e8dd7512d13176f52299cded51`; timetable + realtime routing tests **76/76 PASS**, typecheck PASS, lint PASS | PASS (local dirty checkout) | Full Server unit suite also PASS with 3 opt-in SKIPs; neither result is hosted CI or staging |
| Dense Lviv route-search completeness | Frozen feed SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; prior accepted baseline explicitly reports `searchTruncated=true`; candidate round/event prototypes V2–V4 failed recall and winner retention | FAIL / OPEN | Keep candidate-only work unwired; retain visible truncation; require a bounded algorithm to preserve baseline chains and all 3 strategy winners |
| Production deployment | No deployment changes made; release manifest remains `NOT_RELEASED` | BLOCKED_EXTERNAL / NOT_TESTED | Staging/deploy access, live-provider acceptance, backup/rollback, and physical iPhone blockers remain |
| Full Server unit suite on isolated worktree | `npm test`: 308 tests, **305 PASS / 0 FAIL / 3 opt-in SKIP**, about 41.5s | PASS with SKIP | Does not include external providers, staging, full live PostGIS/Redis integration, or production traffic |
| Server PostGIS/Redis integration suite | `npm run test:integration`: **30/30 PASS**, loopback-only guarded `marshgo_e2e` database and local Redis; migration preflight, journeys, bookings, tenant isolation, GPS/navigation, Redis realtime/rate limit, API restart durability; test API ports closed afterward | PASS (local isolated integration) | No actual external provider, public staging or production traffic; checkout is dirty and uncommitted |

## Main-screen empty-state control follow-up — 2026-10-23

| Control behavior | Evidence | Status | Boundary |
|---|---|---|---|
| Empty route search | E2E native `required` validation focuses an invalid endpoint and sends no `/api/v1/journeys/search` request | PASS (1/1 local browser E2E) | Fixture-backed Chromium, not physical Safari |
| Upcoming trips filter | E2E selects the `Майбутні` tab and verifies `aria-selected=true` | PASS (1/1 local browser E2E) | Empty account has no trips; validates selected state, not returned booking data |
| Empty reverse-marketplace form | E2E verifies native invalid form and no `/api/v1/demands` creation request | PASS (1/1 local browser E2E) | Valid-demand lifecycle is covered by the existing 21-test marketplace E2E suite |

## Активний review-кандидат — RC.25 — 2026-10-23

| Gate | Точний доказ | Статус | Що лишилось |
|---|---|---|---|
| Узгоджені source SHA | Server `b65882584a3ad1e8dd7512d13176f52299cded51` (PR #31); Site `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae` (PR #15); iOS `ba2f08d47cf290d44053ec0dbbb120aac87915d2` (PR #12 pins exact Server/Site). | PASS для candidate-пінів; PR-и OPEN/UNMERGED | Це не означає, що коди злиті або розгорнуті. |
| Exact-source CI | Server runs `39880073407`, `39880107952`; Site run `39881586340` (browser E2E 21/21, immutable artifact `12471766907`, SHA-256 `34c76d3e856b53c62b0033edf8ad180b6fa1970507b56506aeca11d773799976`); current iOS SHA `ba2f08d47cf290d44053ec0dbbb120aac87915d2` runs `39884276804`, `39884281286` SUCCESS. | PASS для перелічених exact-source CI gates | Фікстурні браузерні тести й Simulator не підтверджують live staging, реальні провайдери або фізичний iPhone. |
| Результати маршруту та production-карта | Взаємна consent-gated GPS-карта перевірена у Site; frozen GTFS replay Львова досі має `searchTruncated=true`; production map manifest/assets не налаштовані. | PASS для GPS-коду/fixture; FAIL для повноти пошуку та візуального map acceptance | Потрібні перевірений bounded search без прихованого truncation і ліцензований immutable map manifest/assets. |
| GTFS event-search v4 dedupe/cache prototype | Ізольований тестовий прототип на тому самому frozen feed та 3 OD: GTFS suite 69/69, focused oracle/typecheck/lint PASS; але всі запити досягли ліміту 100,001 унікальної пари переходів, winner recall не відновився, тому прототип відхилено. Деталі: [`audit/90_GTFS_EVENT_SEARCH_V4_REJECTED_2026-10-23.md`](audit/90_GTFS_EVENT_SEARCH_V4_REJECTED_2026-10-23.md). | FAIL — не під’єднувати | Потрібне інше пошукове подання, що проходить exhaustive oracle та frozen multi-OD recall/resource gates без збільшення лімітів навмання. |
| GTFS event-label v1 prototype | Exact base PR #31, Node 24.21.0, same frozen Lviv feed/3 ODs; targeted tests 75/75, typecheck/lint PASS. All 3 queries hit 100,000 prototype leg-visit budget; prior winner retention 1/3, 3/3, 3/3 and route-chain recall 2.7%, 27.5%, 3.125%. Production-candidate replay also remained graph/search-truncated. Details: [`audit/91_GTFS_EVENT_LABEL_V1_REJECTED_2026-10-23.md`](audit/91_GTFS_EVENT_LABEL_V1_REJECTED_2026-10-23.md). | FAIL — not a production replacement | Diagnose route-chain explosion and build a meaningfully different bounded/Pareto design; preserve truthful truncation and do not wire this prototype. |
| Розгортання | Немає підтвердженого staging/production HTTPS origin, deployed SHA, backup/restore/rollback rehearsal або HTTPS smoke. | BLOCKED_EXTERNAL / NOT_TESTED | Потрібні hosting/API origin, власницький deploy-доступ/конфігурація, staging acceptance та rollback drill; production rollout окремо погоджується. |
| Повний реліз MARSHGO | Root umbrella PR #5 блокується без read-only `MARSHGO_REPOS_READ_TOKEN` для приватних Admin/Partner; provider entitlement, фізичний iPhone та APNs/background checks не виконані. | BLOCKED_EXTERNAL / NOT_TESTED | Налаштувати доступи й пройти реальні приймальні перевірки. Статус залишається `NOT_RELEASED`. |

Детальна історія поточного Site-зміни: [RC.25 two-way rendezvous route map](#site-dual-rendezvous-route-map--rc25--2026-10-23). Release manifest: [`../RELEASE_MANIFEST.json`](../RELEASE_MANIFEST.json), `status=NOT_RELEASED`.

## Попередня tuple CI — 2026-10-23 (історичний зріз PR #30/#11)

| Gate | Точний доказ | Статус | Що лишилось |
|---|---|---|---|
| Server PR #30 | `14b3abfa29baa90b84d4d0d9d61b51604dac7f1d`; exact-head runs [39871533762](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39871533762) and [39871538356](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39871538356) PASS: audit, lint, typecheck, 301 unit pass/0 fail/3 opt-in skip, migrations, PostGIS/Redis integration, API image build/smoke. Diff adds test-only event index/oracle. | PASS for exact-head CI; PR open/draft | Frozen Lviv multi-leg queries still truncate; not staging or production. |
| iOS PR #11 exact pin | `ef8a290dfe6bb870389f104b229d69a3843801a9`, pins Server `14b3abfa...` + Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; exact runs [39871559946](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39871559946) and [39871565248](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39871565248) PASS: Site build, Capacitor sync, manifest check, iOS Simulator compile. | PASS for unsigned simulator CI; PR open | Physical device, live API, GPS/background/APNs/TestFlight NOT_TESTED. |
| HTTPS staging / production | No configured deployment/environment/domain/target among six repos; local staging compose supplies only test DB/Redis/S3Mock. | BLOCKED_EXTERNAL / NOT_TESTED | Owner-provided host/domain/DNS/TLS/API origin and deploy access, secrets/config, SMS/auth and map assets, backup/restore/rollback. No deploy was run. |
| Dense-feed route completeness | Frozen Lviv replay across three OD pairs has `searchTruncated=true` and/or `candidateGraphTruncated=true`; exact replay details in `audit/84_GTFS_EXHAUSTIVE_ORACLE_AND_LVIV_REPLAY_2026-10-23.md`. | FAIL for complete results; partial-search warning works | Continue query-directed expansion only if exact tiny-oracle equivalence and multi-OD recall/resource checks pass. |
| Lazy event expansion prototype | Isolated against PR #30 base `14b3abfa29baa90b84d4d0d9d61b51604dac7f1d`; 68/68 GTFS tests and typecheck passed, but primary frozen Lviv replay took 9.68s vs 3.12s, changed all 3 objective winners, retained only 13 route chains vs 37, and still truncated. Prototype was removed; PR #30 source was not changed. Details: `audit/87_GTFS_LAZY_EXPANSION_PROTOTYPE_REJECTED_2026-10-23.md`. | FAIL — experiment rejected | Design a route-round/event algorithm with bounded expansion before another prototype; preserve exact transfer rules and baseline objective winners, then compare all 3 frozen OD. |
| Current root local production-quality gate | Dirty orchestration checkout, Node `26.7.0`: `npm run check:production` PASS; typecheck/lint/build/bundle PASS, 256 unit PASS / 0 FAIL / 1 opt-in DB integration SKIP; 51 JS chunks ≤350 KB gzip. | PASS for this local dirty tree only | Repeat on immutable integrated SHA under pinned Node 24.21.0 and full cross-repository CI; skipped DB test is not PASS, and no deployment evidence. |
| Loopback RC runtime recheck | RC.21 Web/API/Admin/Partner and RC.20 Web/API health endpoints: 6/6 HTTP 200; RC.21 API `/readyz` reports DB and realtime connected. Local image tags are not verified to match the current RC.23 source tuple. | PASS for basic loopback health only | Build/run the exact integrated candidate on owner-controlled staging and verify deployed SHA, authenticated journeys, external providers, backups, and rollback. |

## Історичний кандидат RC.24 — 2026-10-23

| Gate | Точний доказ | Статус | Що лишилось |
|---|---|---|---|
| Server freshness of GTFS-RT positions | PR [#31](https://github.com/dima1203oleg/MarshGO-Server/pull/31), SHA `b65882584a3ad1e8dd7512d13176f52299cded51`; hosted runs [39880073407](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39880073407) and [39880107952](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39880107952) PASS; local 304 unit PASS / 0 FAIL / 3 opt-in integration SKIP. | PASS for exact-head CI and local unit | Realtime sample is degraded in all four probed cities; route/trip/direction matching and map overlay are not accepted. |
| iOS exact Server/Site pin and Simulator compile | PR [#12](https://github.com/dima1203oleg/MarshGO-iOS/pull/12), SHA `dec6a1cb5857603167853976e74972831a668917`; pins Server `b65882584a3ad1e8dd7512d13176f52299cded51` and Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; run [39880432963](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39880432963) SUCCESS. | PASS for hosted unsigned Simulator CI | Physical iPhone, live API/auth, GPS/background/APNs NOT_TESTED. |
| Release manifest | Both manifest copies identical, valid JSON, RC.24; Server/Site/iOS pins above, `NOT_RELEASED`, `production_ready=false`; `git diff --check` PASS. | PASS for candidate metadata consistency | Changes remain uncommitted in root dirty checkout; this is not a deployed release artifact. |
| Dense Lviv route completeness | Frozen data still reports `searchTruncated=true` / `candidateGraphTruncated=true`. | FAIL | Needs proven algorithm change passing tiny exhaustive oracle and frozen multi-OD recall/runtime/heap gate. |
| Production map | Browser path reports `Карта недоступна`, local manifest request refused; production map assets/style/attribution not configured. | BLOCKED_EXTERNAL / FAIL visual acceptance | Provide licensed immutable map manifest/assets and repeat visual and runtime acceptance. |
| Root release materialization CI | PR #5 exact-head run `39879173733`: prerequisite checks PASS, required private Admin/Partner read checkout failed because `MARSHGO_REPOS_READ_TOKEN` is absent; subsequent materialize/image/browser/WebKit gates skipped. | BLOCKED_EXTERNAL | Owner configures minimum read-only Contents secret; do not bypass or weaken the required gate. |
| Staging/deploy | No owner-controlled HTTPS staging/deployment origin, deployed SHA, smoke, backup/restore/rollback evidence. | BLOCKED_EXTERNAL / NOT_TESTED | Configure owner staging and deployment access; separate approval remains required for production rollout. |
| Read-only GTFS-RT repeat probe on exact Server PR #31 | `testGtfsRealtimeConnection()` on cataloged RT position URLs at `2026-10-23T00:54:47Z`: Lviv 0 positions, Rivne 0; Ivano-Frankivsk 4/8 fresh; Uzhhorod 2/4 fresh. All four report `degraded`; valid but fresh feed headers do not elevate empty/stale vehicles. | PASS as a diagnostic snapshot | This does not establish an SLA, static-feed trip crosswalk, live map rendering, or stability. Repeat at a different time; the Server repository does not provide the root-only `acceptance:transport-feeds` script. |

## Найновіший runtime checkpoint — 2026-10-23

| Gate | Точний доказ | Статус | Що лишилось |
|---|---|---|---|
| RC.20 API image + чиста схема | Image `marshgo/api:RC-2026-10-23-current-review.20` (`b90e9a02d1c6`), Server SHA `e21536d5f97e7876aae0a360ed3ff4126ba5c78c`; окрема БД `marshgo_rc20_smoke_20261023`, **52/52 міграції** до `055_provider_commercial_use_requires_license.sql`, 18 MB | PASS — локальна міграція кандидата | Не замінює staging upgrade/backup/rollback |
| RC.20 API + Web runtime proxy з PostGIS/Redis | Exact API і Web images: `/healthz`, `/healthz-api`, `/readyz`, `/`, `/journeys/search` — **5/5 HTTP 200**; proxied захищений `/api/v1/journeys/me` — очікуваний 401 без сесії. `.invalid` external endpoints, SMS/provider calls не виконувались | PASS — локальний image/runtime/proxy smoke, не acceptance повного UI | Автентифікований доступ і реальні OTP/map/routing/provider потоки не перевірялися; staging acceptance NOT_TESTED |
| Welcome/onboarding на exact RC.20 Web | Вбудований браузер завантажив welcome, пройдено три onboarding-кроки, «Не зараз» щодо GPS веде до телефонного входу; повернуто на welcome. Без реального номера, OTP чи дозволу геолокації | PASS — локальний UI flow | OTP, створення/відновлення сесії та реальна геолокація NOT_TESTED |
| Full browser E2E на exact Server/Site tuple | Server `e21536d5f97e7876aae0a360ed3ff4126ba5c78c` + Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; окрема loopback БД `marshgo_e2e_rc23_20261023`; чисті міграції до 055; **16/16 PASS за 8,5 хв** на local Node 26.7.0. Охоплено auth test OTP, 12 транспортних категорій, пошук/карту/вибір сегмента, пасажира й водія, бронювання/переговори/чат, GPS reroute, rendezvous consent | PASS — локальний browser E2E на exact source tuple; не staging/production | Повторити на Node 24.21, staging/real provider acceptance, physical iPhone і production edge ще потрібні |
| Button audit усіх основних розділів | 152 контроли натиснуто; 0 captured JS/HTTP runtime failures; 14 евристичних «без видимого ефекту» сигналів, які не є assertion FAIL | PASS для відсутності зловлених runtime-помилок; NOT_TESTED для точного наміру кожного control | Додати конкретні поведінкові assertions для 14 евристик; не рахувати їх confirmed bugs |
| Exact Site/Server cross-browser suite | **6/6 PASS** у Chromium/Firefox/WebKit (browser compatibility + route/map scenario на кожному); exact Site `1d2aaa0…`, Server `e21536d…`, isolated fixtures/DB, 2,6 хв, Node 26.7.0 | PASS для автоматизованого browser compatibility | Фізичний Safari/iPhone і реальні карти/провайдери не перевірено; повторити стабільним Node 24 runtime |
| Release status | Немає перевіреного staging origin, production origin/deployed SHA, HTTPS smoke, live provider acceptance чи owner rollout approval | BLOCKED_EXTERNAL / NOT_TESTED | Залишається `NOT_RELEASED`; див. звіт 80 та `docs/EXTERNAL_BLOCKERS.md` |
| Повторний production-quality gate на root dirty checkout | Node 26.7.0: `npm run check:production` — typecheck/lint PASS, **256 unit PASS / 0 FAIL / 1 opt-in DB integration SKIP**, production build і 51-chunk gzip budget PASS | PASS для локального dirty tree | Не є clean immutable artifact чи Node 24 replay; skipped DB integration не PASS; staging/production далі NOT_TESTED |

## Continuation checkpoint — 2026-10-22 20:39 UTC

| Gate | Exact evidence | Status | Що лишилось |
|---|---|---|---|
| Server GTFS candidate diversity | Branch `codex/gtfs-candidate-diversity-750-20261022`, commit `0dc831b3b8ca1c70f69e40329d6a81532f3a58df`, PR #29 stacked directly on PR #28 head `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`; per-leg pool 500→750. Three frozen Lviv OD returned more route alternatives; all three ranking winners stayed the same; all searches remain truncated. | PASS for bounded replay; hosted CI PASS | Dense-feed completeness remains PARTIAL; PRs #28/#29 are open and unmerged. |
| Server exact-head CI on candidate 750 | PR #29 CI [run 39850929617](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39850929617) succeeded on exact head `0dc831b3b8ca1c70f69e40329d6a81532f3a58df`: audit, lint, typecheck, unit, migrations, integration, production API image build, PostGIS/Redis image smoke. | PASS for this server candidate/CI workflow | This is not a deployment, provider acceptance or production runtime test. |
| Server local tests on candidate 750 | Node 24.21.0: GTFS/oracle 68/68; full unit 296 PASS / 0 FAIL / 3 opt-in SKIP; lint/typecheck PASS; `git diff --check` PASS. | PASS for local candidate | Continue exact-head checks after any code update. |
| Server PostGIS/Redis integration on candidate 750 | `npm run test:integration`: **30 PASS / 0 FAIL / 0 SKIP** on new loopback-only DB `marshgo_e2e_candidate750_verify_20261022`; clean migration application; includes booking race/idempotency, tenant isolation, navigation, realtime across two API instances, restart and rate-limit checks. Exact same suite also passed in CI run 39850929617. | PASS for isolated local and CI integration | Does not establish staging, production services, live provider or operational recovery acceptance. |
| Production/staging configuration | Production `docker compose -f compose.production.yml config -q` fails on unset `APP_DOMAIN`, map manifests, `REDIS_PASSWORD`, `SESSION_SECRET`, Twilio credentials and `VITE_MAP_STYLE_MANIFEST_URL`. Staging Compose validates with `--env-file .env.staging.local`; no services were started. | BLOCKED_EXTERNAL for actual deploy; PASS for staging Compose syntax only | Supply/verify an owned staging host/HTTPS/DNS and deploy API/site against the isolated stack; complete production env/provider/map configuration; verify backup/restore/rollback. No secret values were logged. |
| Production release | No production deploy/URL/deployed SHA; release manifest remains `NOT_RELEASED`. | BLOCKED_EXTERNAL | Need configured staging/production target, credentials, approved migration/backup/rollback procedure; production rollout separately requires owner confirmation. |

## Поточний exact candidate — 2026-10-22 19:14 UTC

| Gate | Exact evidence | Status | Що лишилось |
|---|---|---|---|
| Server PR #26 | `a1961324a2a46bd062231d35720fe349d39d9d76`; exact-head CI runs `39777928826`, `39777958708` passed migrations and PostGIS/Redis integration | PASS for CI candidate | PR open/stacked; staging, daytime live-feed and deployment acceptance absent |
| Site PR #15 | `348eca22e45df6a57960676bbda2745c2feaca30`; exact-head CI `39797257729`, `39797261110`, `39797261495` passed | PASS for CI candidate | No live API/staging visual acceptance |
| iOS PR #9 | `67eafaeb7cb4d4e5aa3f422f40363c71e04b7464`, pins the exact Site SHA; Simulator CI `39797420565`, `39797428136` passed | PASS for simulator build | Physical iPhone, signed distribution, live API, background GPS/APNs NOT_TESTED |
| Root local production gate | Node 24.21.0 `npm run check:production`: typecheck, lint, **256 unit PASS / 0 FAIL / 1 opt-in SKIP**, production build, 51 JS chunks within ≤350 KB gzip | PASS for dirty local checkout | Dirty orchestration tree means not immutable artifact; one DB integration case skipped here |
| Full marketplace lifecycle | Exact Server/Site candidates; isolated PostGIS/Redis; Playwright two-independent-account end-to-end **1/1 PASS in 23.2 s**. Booking → boarding → mutual completion → persisted reviews, reload/history/chat unread-read cursor, demand offer/counteroffer → confirmed booking, block/export/deletion controls | PASS for this fixture-backed scenario | Does not prove real SMS, provider APIs, staging, physical GPS, or production |
| Full root Playwright | On root HEAD `f944560a3babf7423befc53741217d9281f44dab` with pre-existing dirty changes, pinned Server PR #27 `30fa1cfa52621e7ed4ca47ad61794711ac484e62` + Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, Node 24.21.0: **16 PASS / 0 FAIL in 8.3 min**. Route-map test contract/snapshots were reconciled to the current pinned production UI and owner-approved references; repeat full run passed without snapshot update. Covers browser fixture flows, not real provider/staging data. Details: [`66_EXACT_CANDIDATE_FULL_E2E_2026-10-22.md`](audit/66_EXACT_CANDIDATE_FULL_E2E_2026-10-22.md). | PASS for this local pinned-candidate E2E suite | Repeat hosted exact-head/root CI after committing changes; live providers, staging API, physical devices, backup/restore/rollback and deployment remain NOT_TESTED/BLOCKED |
| Deployed production | No verified target URL/API origin, deployment credentials, deployed SHA, HTTPS smoke or rollback rehearsal | BLOCKED_EXTERNAL | Owner/environment must supply staging/deployment config; rollout requires separate owner approval |

Older tables below are historical checkpoints and must not override the exact SHAs and evidence above.

## Current exact candidate — 2026-10-21 19:30 UTC

> Continuation update (2026-10-22): the table below is historical; use the current exact-head evidence in `docs/PRODUCTION_EXECUTION_STATE.md` under “Current-session continuation”. Server PR #24 is now at `9f567960846e015d70c0c9274c4fe8fe45a3d944`; exact-head CI runs `39688315436` and `39688323193` pass. Open PR status is not release acceptance.

> 2026-10-22 follow-up: Server PR #24 advanced to `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c`; exact-head runs `39689590022` and `39689594787` pass. Added regression coverage for an empty-but-fresh GTFS-RT response preserving schedule-only line geometry and emitting no false live vehicle or ETA. Lviv replay remains truncated; these tests do not establish live/daytime availability or production deployment.

| Requirement | Current implementation/evidence | Status | Next evidence/action |
|---|---|---|---|
| GTFS small-feed transfer completeness | Server PR #24 `c33651b1387e0d2b377216a0b88f6ae02cdbec32`; exhaustive fixture oracle matches all six feasible bus/tram transfer chains, and a scorer-derived check retains the FASTEST/CHEAPEST/BALANCED winners under the route-chain cap. Local Server suite 292 PASS / 0 FAIL / 3 opt-in DB/Redis SKIP; typecheck/lint PASS. Hosted run `39661572594` PASS including migrations and PostgreSQL/PostGIS + Redis integration. | PASS for bounded fixture oracle and exact candidate CI; real-feed completeness PARTIAL | Preserve truncation warning. Continue frozen-feed recall/resource work; do not infer completeness from the small fixture. |
| Dense Lviv route search | Static GTFS snapshot SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; stop-pattern quota 2→8 clears stop-selection truncation on 4/5 frozen corridors, but the fifth hits the absolute 48-stop bound and candidate sampling remains bounded. PR #24 does not alter runtime search. | PARTIAL | Improve query-directed candidate selection only when a frozen multi-corridor benchmark shows better recall within latency/memory limits; keep `searchTruncated=true` otherwise. |
| Per-trip-chain sampling breadth | Five frozen Lviv corridors compared trip-chain variant caps 2 vs 4 on the same GTFS snapshot: both variants returned 100/100 and remained graph/result truncated, but cap 4 reduced distinct route-name chains on every corridor (39→26, 31→25, 42→33, 27→20, 47→41). Runtime differences were mixed and non-conclusive. No source change accepted; cap 2 retained. Evidence: `docs/audit/42_PR24_LVIV_TRIP_CHAIN_CAP_AB_2026-10-21.md`. | CAP 2 retained; dense-feed search still PARTIAL | Design stratified route-chain and objective retention together; require no regression in route diversity and all three strategy winners on a frozen multi-corridor suite. |
| Per-route-chain sample cap sweep | Same five Lviv feed corridors and inputs compared cap 8/6/4/3, with 2 repeats for 8/4/3. Cap 3/4 increased route-name chain counts but added material latency; cap 6 had no breadth gain in its one noisy run. FASTEST/CHEAPEST/BALANCED winners stayed the same within the bounded output, yet all modes stayed truncated. Production cap 8 retained. Details: `docs/audit/43_PR24_LVIV_ROUTE_CHAIN_CAP_SWEEP_2026-10-21.md`. | CAP 8 retained; dense-feed search still PARTIAL | Optimize strategy-aware candidate scoring/selection and validate against exhaustive/Pareto truth before lowering caps. |
| Server exact-head CI and DB integration | PR #24 exact head `c33651b1387e0d2b377216a0b88f6ae02cdbec32`; hosted run [39661572594](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39661572594) passed dependency audit, lint, typecheck, unit tests, migrations, PostgreSQL/PostGIS and Redis integration. PR #24 remains OPEN/DRAFT and stacked on PR #23. | PASS for hosted CI only | Merge is not performed; obtain staging deployment target and run live acceptance. |

| Requirement | Current implementation/evidence | Status | Next evidence/action |
|---|---|---|---|
| Server DB/Redis integration on exact release candidate | Server PR #23 exact SHA `b702fc1738e5d6e49e9114aef95f6c79a667aff3`; GitHub Actions run `39632297710` initialized PostGIS `17-3.5` and Redis `7.4-alpine`, passed dependency audit, lint, TypeScript, unit tests, DB migration, and `npm run test:integration`; companion exact-head verify `39632289740` PASS. Local unit run 277 PASS / 0 FAIL / 3 opt-in integration SKIP because local Docker daemon is unavailable. | PASS for hosted ephemeral CI DB/Redis integration; local Docker/staging/production remain NOT_TESTED | Repeat full suite against a stable staging DB/Redis and rehearse backup/restore/rollback before release |
| GTFS-RT vehicle progress / boarding approach truthfulness | Server PR #23 exact head `b702fc1738e5d6e49e9114aef95f6c79a667aff3` decodes protobuf field presence explicitly; an absent `currentStopSequence` is no longer mistaken for numeric default `0`. Live read-only Lviv probe: 614 positions, 580 fresh under 90s, 574 exact trip/route schedule matches, but all 614 raw positions omitted current stop progress. Full details and source attribution in `docs/audit/34_LVIV_GTFS_VEHICLE_PROGRESS_2026-10-21.md`. Exact-head hosted verify workflows `39632297710` and `39632289740` PASS. | PARTIAL; code fix + local/hosted tests PASS, live feed provides positions but cannot prove approach-to-stop without stop progress | In staging validate selected-route fleet and make all unknown-progress markers muted, with no false approach/ETA claim |
| Transit marker emphasis rendering | Site PR #14 SHA `cb854ba6c46094e412fe6b89ba54b42c3d873f02`: uses MapLibre `Marker.setOpacity()` so marker opacity persists through coordinate updates. E2E regression has 3 emphasized vehicles plus an unknown-progress vehicle and verifies the latter's neutral title and opacity `0.42`. Site local `check:production`: 125 unit tests and 15/15 Playwright scenarios across Chromium/Firefox/WebKit PASS; hosted runs `39633244813`, `39633251497`, and `39633251325` PASS. | PASS in local and hosted candidate checks; staging/device proof remains NOT_TESTED | Repeat the map case with the live API on staging |
| Exact-head review candidates and local environment (2026-10-21) | Fresh GitHub PR metadata: Server #23 `b702fc1738e5d6e49e9114aef95f6c79a667aff3` + parent #22 `d66805cfd3223511f06b0d3d412ba1e244273a16`, checks `39632297710` and `39632289740` PASS; Site #14 `cb854ba6c46094e412fe6b89ba54b42c3d873f02`, checks `39633244813`, `39633251497`, `39633251325` PASS; iOS #9 `cc7d94312ead5788d403bc04b00d74798dd1cc60` pins exact Site SHA, simulator runs `39633308955` and `39633317898` PASS. Admin #1 `9dbf7db0a935498ac40c98b19bc36bce056d630d` PASS; Partner #1 `c639257a7f28aeda5b378a816038b01651146b83` PASS. Root MarshGO #6 `af5f0abd11396fd65c022648688d48fbb1c071a1` CodeQL/Gitleaks PASS, verify FAIL because required read-only `MARSHGO_REPOS_READ_TOKEN` is unset. Full Server unit 277 passed, 0 failed, 3 opt-in integration skipped; typecheck and lint PASS. Docker context is `desktop-linux`, but daemon socket is unreachable; active container/volume state therefore unknown. Root development Compose declares PostGIS `db`, Redis `redis`, and optional test-only `s3mock`; no service was started or changed. | PARTIAL / BLOCKED_EXTERNAL; component candidate checks pass, orchestration token and Docker-backed validation unavailable; no staging/deployment evidence | Configure authorized read-only Actions secret; restore Docker Desktop, inventory exact containers/volumes/restart policies before starting anything; continue provider and staging acceptance. Keep `NOT_RELEASED` |
| Refreshed cross-repository release PR dependency graph (2026-10-20) | Server #19 c6e481dc… over #17 1a3598cc…; Site #13 bee23b46…; iOS #8 b1c64a0… pins the exact Site SHA; Admin #1 9dbf7db0…; Partner #1 c639257a…. Exact-head checks for these candidates pass and every PR remains open/unmerged. MarshGO #1 is the production branch to main; #2 is conflicting/DIRTY, #3 depends on #2, #4 depends on #3. MarshGO #5 verify fails because the private-repository read-only token secret is absent; CodeQL and Gitleaks pass. No common deployed tuple, staging origin, or production smoke is verified. | PARTIAL; candidate CI PASS, orchestration stack not integrated, one external credential blocker | Review stack bases and integrate only in dependency order; configure authorized read-only token for PR #5; verify staging and deployed SHA before release |
| Bounded GTFS endpoint-stop selection experiment | Three local policies compared with the same static Lviv feed SHA bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164 on four corridors. The full/7-stop variants added some new Pareto alternatives but displaced baseline non-dominated routes; the 3-stop variant added none. No graph caps changed. Detailed counts in docs/audit/24_GTFS_CORRIDOR_STOP_SELECTION_AB_2026-10-20.md. | EXPERIMENT REJECTED; production source unchanged; 54/54 GTFS tests passed on experimental variants | Design bounded retention that preserves the baseline Pareto set, then evaluate objective-specific recall, graph bounds and truncation |
| GTFS-Realtime TripUpdate freshness | Server PR #22 `d66805cfd3223511f06b0d3d412ba1e244273a16` (stacked on open PR #21): both feed and per-entity timestamps are limited to 90s; exact 90s is accepted, 91s rejected. Test fixture time is explicit. Live Lviv probe at 2026-10-21T14:46:28Z: 769 updates, header age 9s, 751 updates ≤90s, 18 older; p50 29s/p90 55s/p95 69s/max 924s. Node 24.21.0 full suite 276 PASS / 0 FAIL / 3 opt-in integration SKIP; typecheck/lint PASS; npm audits 0 vulnerabilities. Both exact-head verify workflows PASS and CodeQL/Gitleaks PASS; no staging acceptance. | PARTIAL (local code/test + one live snapshot; draft PR open; staging acceptance NOT_TESTED) | Repeat populated-feed observations at different times, integrate in dependency order, then run staging freshness acceptance |
| Clean dependency install and frontend supply-chain audit | Clean root PR candidate at `af5f0abd11396fd65c022648688d48fbb1c071a1` updates `package-lock.json`, `bun.lock` and shared root `markdown-it` override; clean npm/Bun frozen installs and npm/Bun audits pass (0 vulnerabilities), and Node 24.21.0 `check:production` passes 235 unit tests with one opt-in integration skip. Exact-head CodeQL/Gitleaks PASS; hosted `verify` passes install/audit, lint, typecheck, unit tests, migrations, Postgres/Redis integration, build and bundle gate, then fails at the missing `MARSHGO_REPOS_READ_TOKEN` required to materialize private Admin/Partner. Container build and browser E2E are SKIPPED; PR #6 remains open/unmerged and the main root checkout remains dirty. | BLOCKED_EXTERNAL for complete hosted release materialization; PARTIAL for dependency/code/DB gates | Repository owner configures the named read-only Contents token for private Admin/Partner; rerun exact-head verify, then complete materialization/build/E2E and integrate in dependency order |
| Canonical Site production gate | Clean worktree SHA `bee23b463059a1eb29b87d60a4249b042b6840d1`: `npm run check:production` passes typecheck, E2E typecheck, lint, 124/124 unit tests, production build, bundle budget (18 chunks ≤350 KB gzip), and 12/12 Playwright checks across Chromium/Firefox/WebKit. 390px preview returned 200, no JS errors or horizontal overflow; a six-width 320/390/430/768/1280/1440 smoke covered welcome/onboarding/phone auth with no overflow/pageerrors, and the 1280px desktop homepage was visually reviewed. Browser tests use fixtures and deliberate failure cases; no live API/provider/staging flow was exercised. | PARTIAL (candidate UI gates PASS) | Authenticate against an isolated API and verify route search/booking, then staging/provider acceptance and physical iPhone gates |
| Root production quality gate (current local tree) | On 2026-10-20 at HEAD `f944560a3babf7423befc53741217d9281f44dab` plus 87 pre-existing modified/untracked paths, `npm run check:production` passed: typecheck, lint, **252 unit tests PASS / 0 FAIL / 1 opt-in DB integration SKIP**, Vite build, and bundle budget (51 JS chunks, all ≤350 KB gzip). Docker daemon is unavailable, so local API/Postgres/Redis integration, browser E2E, staging and deployed artifact were not part of this run. | PARTIAL (local tree only) | Repeat against a clean, immutable candidate SHA; run browser/API integration on isolated services, then staging and deployment gates |
| Preserve local state and enumerate repos/worktrees | Seven repositories inventoried; all dirty worktrees recorded in execution state | PASS (baseline only) | Continue without overwriting; inspect worktree diffs |
| Complete exact remote branch/PR/CI inventory | User-listed branches resolve; open PR heads and latest selected CI status inventoried on 2026-10-19 in execution state | PARTIAL | Check closed/superseded branches and refresh checks after integration PRs |
| Single canonical Server / Site / iOS architecture | Current manifest candidates are Server PR #17 `1a3598cc270af0d353a2b22cda740f81daa0da73`, Site PR #13 `bee23b463059a1eb29b87d60a4249b042b6840d1`, and iOS PR #8 `b1c64a0ded8fb5f35e0bbde2d9f831a7011153e2`; all OPEN/UNMERGED. Site exact-head CI `39344153506`/`39344159547`/`39344159557`, iOS Simulator CI `39344238870`/`39344243262`, and Server CI `39348608536`/`39348612060` PASS. iOS pins the exact Site SHA. No staging/API-backed browser acceptance, physical-device acceptance, PR merge, or production deployment is claimed. | PARTIAL | Continue integrated staging and physical-device acceptance |
| Healthy GTFS journey search through authenticated HTTP API | CI `39351884170` showed the fixture route is found at 60/120 minutes and at composed-search horizon, while 30 minutes correctly returns none for its 55-minute itinerary. The prior run then failed because the test reused a “real feed” flag for fixture provider availability. Head `2cd30856b8e837f8e9f5f5bd5613cb83e4a5db0` splits those conditions and keeps the live-feed assertion separate; local lint/typecheck pass. Exact-head hosted API/Postgres/Redis checks pending. | IN_PROGRESS (current exact-head CI pending) | Confirm the fixture HTTP/geometry assertions and all Server integration scenarios pass; remove test-only diagnostics and rerun |
| Admin / Partner use central Server and tenant authorization | Local P0 Admin/Partner tests, typecheck, lint, build pass; isolated Server tenant integration 1/1 passes. On 2026-10-19, OTP loopback API flow created a Partner application, Admin approved it, and Partner read back persisted ACTIVE/APPROVED status. Pending org permissions denied protected operations. Browser visual smoke on exact Admin `9dbf7db0…` and Partner `c639257a…`: Admin navigation rendered Overview/Partners/Providers/Integrations/Audit at 1280px; Partner Overview rendered; no horizontal overflow at 1280px or 390px; preview correctly states server/business actions are disabled. The API was unavailable for these preview sessions (502 at the configured origin), and no authenticated browser transaction was claimed | PARTIAL (API flow PASS; UI render/preview PASS; authenticated portal browser flow NOT_TESTED) | Configure a reachable isolated Server/API for two-user UI acceptance; exercise Admin approval and Partner persisted state/tenant separation in browser on staging |
| Production Marketplace and Navigation entrypoints | Exact Server `c524158f…` / Site `d17360f…` local E2E used isolated PostGIS/Redis and deterministic fixtures. Full suite: 13/14 passed; the single route-map test stops at a screenshot comparison. Isolated diagnostic rerun of that same test with screenshot comparisons ignored completed all behavior and geometry assertions (1/1), including segment focus, full transit line in both directions, 4 fixture vehicles with 3 emphasized, camera centering and map/sheet state changes. Screenshot output matches the legacy MarshGO committed results screen but differs from the legacy map-half golden by 121 pixels at a transfer marker. These goldens are not from the pinned Site repository; this is a cross-repository baseline mismatch, not a proven UI defect. Follow-up Site PR #11 at `6b691394c41bbcd4bd12d05f875d9bac10b99643` adds a Site-owned route-flow browser test (9/9 total E2E CI) for carpool → walk → bus, unknown fare, selected segment and stops. This is fixture-backed behavior only; no approved visual baseline/live feed. No golden was rewritten. | PARTIAL (journey behavior PASS on fixture; visual/staging acceptance NOT_TESTED) | Add approved Site visual baselines, then verify route flow with live provider data in staging; keep legacy snapshots untouched |
| Site-owned production-browser and journey E2E | PR #11 exact head `5879adad41ef03a17d07da144c1fae7bbd97d62a` on `codex/site-owned-e2e`. Local Node 24.21.0 `check:production`: 118/118 unit tests, both typechecks, lint, build, bundle gate and 12/12 browser checks across Chromium, Firefox and WebKit. Includes carpool → walk → scheduled bus fixture, unknown fare, selected segment, retained itinerary, stops, two A20 directions/four fixture vehicles/three emphasized approaches in Chromium, plus deliberate lazy-chunk failure and manual recovery across browsers. Overlay assertion remains Chromium-only because Firefox did not initialize MapLibre overlay state consistently. Exact-head hosted runs `39280142165`, `39280149795`, `39280149987` all passed; behavior is fixture-backed and PR remains open/unmerged. | PARTIAL (browser/UI CI PASS; live/staging/approved visual acceptance NOT_TESTED) | Add authenticated real-API and approved visual-baseline acceptance; obtain live feed/staging evidence |
| Passenger/driver complete lifecycle | Local deterministic E2E 13/13 from prior checkpoint | PARTIAL | Verify current exact diffs and distinguish fixture payment/OTP/GPS from external production integrations |
| Multimodal routing feasibility, fares and transfer correctness | Exact Server `704d30108901e81f889b5be78da6a9d780dfd7b7` was exercised through an authenticated local API session (OTP flow, auth bypass disabled) against the configured Lviv static GTFS source: HTTP 200, five scheduled results, all three requested strategies; top example walk → bus A21 → bus A37 → walk, 97 min / 23 UAH estimate. Response correctly reports `partial=true` with `candidate_generation_truncated` and `walking_routing_unavailable`; no provider errors. Provider-health probe: 1,071 stops/72 routes/15,716 trips. Focused GTFS 42/42; full unit 243 pass/0 fail/3 optional skips; typecheck/lint pass; Postgres/PostGIS+Redis integration 30/30 on code-identical parent `f6150bd`; exact-head hosted CI runs `39263337626` and `39263325308` pass on `704d301`. This is local integration, not staging/production; fare is a tariff estimate; search is bounded and walking access is unverified. | PARTIAL | Improve candidate completeness under the memory bound; verify hosted foot routing, live route/trip data and the same journey flow on staging |
| Public transit + private ride + public transit composition | Server API integration on branch `codex/journey-search-completeness` searches validated Lviv GTFS + an isolated published carpool fixture; asserts persisted `[BUS, COMMUNITY, TRAM]`, selected/available carpool leg, and normal booking changes only that leg to `CONFIRMED` while transit legs remain `SUGGESTED` and Journey becomes `PARTIALLY_RESERVED`. Local opt-in API suite passes 14/14 with PostGIS/Redis; exact branch HEAD `95ec90d3e29b73e704cbac0d2faf2412a1019457`; PR #10 exact-head CI runs `39233189456`, `39233201888`, and `39234971756` PASS. This is fixture acceptance, not staging or production-provider acceptance | PARTIAL | Add cancellation/restart lifecycle and user-facing Site rendering; validate live provider coverage and staging |
| Transit live fleet / full route overlay | Server follow-up `ff6a3e2` (includes cache schema fix `4c7a7a9`) on PR #10 preserves GTFS `directionId` and `geometrySource` through the network cache schema; without them the live route builder filtered away real cached directions. Regression coverage: focused map/transit tests 28/28 pass; full Server unit suite on Node 24.21.0 is 254 pass / 0 fail / 3 opt-in integration skips; typecheck and lint pass. Direct public Lviv feed composition via Server parsers/builders returned 550 fresh trip-matched positions from 15,716 scheduled trips; one selected route produced both directions, 10 fresh same-route vehicles, 6 proven approaches and 3 emphasized. Static feed parsed 144 directional geometries. Site `5879adad41ef03a17d07da144c1fae7bbd97d62a` consumes line routes and recent positions; fixture E2E covers 2 directions / 4 fixture vehicles / 3 emphasized in Chromium. These are a one-time live probe plus fixture acceptance, not authenticated staging or a sustained provider SLA. | PARTIAL | Wait for exact-head CI on Server `ff6a3e2`; then exercise an authenticated Journey against staging and validate freshness, route/direction identity, geometry and boarding approach end to end |
| Realtime consented rendezvous | Server enforces separate per-participant consent. Site integration PR #10 at `d17360f01e05fa3c878587b8f149746e57ba36f8` restores explicit consent/revoke UI, waits for both parties before GPS, stops sharing on denied/unavailable geolocation, and prevents consent changes after boarding/terminal state. Local Site typecheck/lint/build, 118 unit tests, and bundle budget pass; exact-head CI `39234073058`, `39234089884`, `39234089890` all PASS. Exact Site production build with isolated map fixtures passed; browser E2E 2/2 passed for map rendering with mutually consented points and the UI grant → wait-for-second-consent → revoke sequence. OTP sign-in used the isolated local API; booking/rendezvous endpoints were fixture-intercepted. Server PR #10 API integration separately exercises two real test accounts, consent, coordinates, revoke, and stale-point clearing; local API suite 14/14 PASS and exact-head CI `39233189456`, `39233201888` PASS. Real two-account browser/API and physical permission acceptance remain NOT_TESTED | PARTIAL | Run two Site clients against the integrated API for consent A → consent B → live map → revoke/permission-denial; then iOS and physical GPS acceptance |
| Full mutual rendezvous map after booking | Site candidate `d17360f01e05fa3c878587b8f149746e57ba36f8` includes the full-screen map and explicit per-participant consent/wait/revoke states. Site local typecheck/lint/build, 118 unit tests, and focused browser E2E 2/2 pass; hosted exact-head Site checks pass. iOS PR #7 pins this exact Site SHA; local bundled Site build, Capacitor sync, and unsigned Xcode Simulator compile pass. iOS exact-head hosted CI `39235862143` PASS; simulator install/launch displayed the welcome UI after WebView startup. Interactive two-account client/API, physical GPS permissions/background operation, staging and production remain NOT_TESTED | PARTIAL | Exercise authenticated two-client flow and physical iPhone; verify staging before any release claim |
| Feed freshness and provenance | Recheck at `2026-10-19T12:59:33.552Z`: 38 open Ukrainian catalog feeds probed, 32 healthy/4 degraded/2 offline/5 skipped; Lviv GTFS loaded (1,071 stops/72 routes/15,716 trips). Zelectra positions span Lima→Ukraine, CityBikes lists 0 Ukrainian networks, Nextbike candidate is Latvia, Rivne/Truskavets realtime return 0 entities. Raw evidence: `docs/audit/17_TRANSPORT_FEED_RECHECK_2026-10-19.json`. Health is only response/structure, not licensing or route correctness | PARTIAL (time-bound) | Confirm exact provider-route-trip-direction match and current vehicle freshness on an enabled Ukrainian source; provider terms/staging acceptance remain open |
| Kiwitaxi/commercial and other partner integrations | Local catalog adapter/testing work exists, no confirmed commercial credential/contract | BLOCKED | Confirm official access, terms, keys and sandbox before claiming quote/booking |
| Safari/PWA lifecycle | Browser matrix/E2E evidence in earlier records; historical physical Safari white screen not reproduced this execution | NOT_TESTED | Reproduce cache/SW/deep-link/offline/resume in WebKit and physical Safari |
| Security, backup/restore, operations | Historical local checks exist, not exact current cross-repo candidate or production environment | PARTIAL | Current exact-SHA scans; staging secrets, backup/restore drill, monitoring and rollback |
| Full responsive design and canonical image acceptance | New local browser smoke inspected Admin primary screens at 1280px and checked document width at 390px; Partner overview inspected at 1280px and checked at 390px. Both reported no horizontal overflow. This is not full breakpoint or canonical-reference acceptance | PARTIAL | Inspect all production screenshots at 320/390/430/768/1280/1440 and compare approved references; cover every production route |
| Current exact-SHA tests | Server `c524158fbed43a3d59c17e50307041cfab85a9dd`: local unit 249 pass/0 fail/3 optional skips; focused GTFS+realtime+graph-budget 54/54; typecheck/lint pass. Parent `a02c6db3…` exact-head CI `39267267777` and `39267274876` passed dependency audit, lint/typecheck, unit tests, clean migrations, and Postgres/Redis integration; current exact-head CI `39267877694` passed including DB migrations and Postgres/Redis integration. Previous Server SHA `6815898…` exact-head CI runs `39265738574` and `39265728533` passed. Site `d17360f01e05fa3c878587b8f149746e57ba36f8`: exact pinned local typecheck/lint, 118 unit tests, production build, and bundle budget pass; exact-head CI 3/3 pass. Admin `9dbf7db…`: typecheck/lint, 2 unit tests and build pass. Partner `c639257…`: typecheck/lint, 3 unit tests and build pass. iOS `51baa960579c77f22c2b61691a428f9f1a952e02`: prior recorded bundle/sync/unsigned Simulator compile and hosted CI pass. Admin/Partner authenticated browser portal flow NOT_TESTED. Staging/production and physical-device acceptance remain NOT_TESTED | PARTIAL | Continue integrated browser, visual, security, staging and device gates on the pinned candidate set |
| iOS Simulator / physical iPhone | iOS PR #7 source commit `51baa960579c77f22c2b61691a428f9f1a952e02` pins exact Site `d17360f01e05fa3c878587b8f149746e57ba36f8`. Local Node 24.19 Site production build, Capacitor sync, and unsigned Xcode Simulator build pass; hosted exact-head CI `39235862143` PASS. Build used reserved invalid API origin and therefore does not test sign-in or booking. Physical permission/GPS, push, background behavior, and interactive login→search are NOT_TESTED. A separate device report says Site→Capacitor sync and generic build 2 succeeded but Wi-Fi installation was interrupted; the current build is not confirmed installed | PARTIAL / NOT_TESTED | Run interactive simulator against reachable candidate API and physical iPhone acceptance |
| Verified staging deployment | No current stable staging origin or exact deployed SHA verified; browser suite uses local fixture services and isolated local database | NOT_TESTED | Provision/confirm staging target, deploy exact candidate, smoke and E2E; see candidate manifest `docs/PRODUCTION_RELEASE_CANDIDATE_2026-10-19.md` |
| Exact release source materialization | Current `node ops/scripts/materialize-release.mjs` pass verified exact clean sources/origins for Server `ff6a3e2…`, Site `5879ad…`, Admin `9dbf7db0…`, Partner `c639257a…`; `.release/materialized.json` binds all source SHAs, generated Docker-input hashes and Compose SHA `f220a155…`, with `pinnedSourceTreesClean: true`. | PASS (source identity/materialization only) | Build exact images when safe disk capacity and real deployment configuration permit; image artifacts and runtime acceptance remain NOT_BUILT/NOT_TESTED |
| Reproducible multi-portal deployment artifact | Previous four-image build and Admin/Partner mock-API runtime smoke used old Server `0c873ade…`. Current exact source trees are materialized; current four-image build is NOT_BUILT. Host has about 6.0 GiB free; Docker reports 13.97 GB build cache and 8.77 GB images. No Docker cleanup performed. Production Compose lacks verified domain/secrets/provider/map/object-storage config. No placeholder values treated as production config | PARTIAL (current image artifact NOT_BUILT; runtime smoke is from older Server SHA; no authenticated DB-backed flow or staging TLS) | Rebuild after safe capacity/configuration are available; run staging acceptance |
| Verified production deployment | No current production origin or deployed SHA proven | BLOCKED | Candidate + rollback + owner-authorized rollout + HTTPS smoke and SHA check |
| Bounded Lviv GTFS search and route-chain diversity | Server PR #10 updated exact head `ff6a3e2db9ca206d46b52fedee36fbfe1cf0700a`; bounded live-feed search remains explicitly partial (`candidateGraphTruncated`, `searchTruncated`, `resultLimitReached`). Same-trip-chain sampling now prioritizes fastest + genuinely cheaper known-fare option, or fastest + lower-walking choice when fare ties. Two regressions and full local Server suite pass (254 pass, 0 fail, 3 optional integration skips); lint/typecheck pass on Node 24.21.0. Exact-head CI `39286373644` and `39286380109` PASS, including migrations and Postgres/Redis integration. Current 80-candidate Lviv schedule probe executed FASTEST/CHEAPEST/BALANCED; top results overlap at ~74 min and 23 UAH tariff estimate, with an alternative bus→tram at ~79 min. Search still truncated and fare is not a confirmed ticket price. | PARTIAL | Confirm exact-head CI; preserve partial warning; staging/provider and completeness/capacity checks remain unverified |
| Current Server API integration on isolated ephemeral services | Exact Server `ff6a3e2db9ca206d46b52fedee36fbfe1cf0700a`; `npm run test:integration` on Node 24.21.0 against newly created tmpfs-only PostGIS/Redis containers: clean migrations through `055_provider_commercial_use`, then 30/30 API, Journey, booking, cancellation/Rescue, negotiation, Partner isolation, GPS/navigation, realtime across API instances, restart durability and rate-limit integration tests passed. Temporary containers were stopped and removed; the pre-existing local PostGIS/Redis services were untouched. The live-Journey endpoint integration currently verifies owner/leg access and disabled-provider unavailable state; enabled-feed API HTTP end-to-end on staging is still NOT_TESTED. | PARTIAL | Add enabled-provider live-Journey HTTP acceptance with controlled isolated feed fixtures; then repeat against staging when available |
| Late cheapest option retention after GTFS candidate caps | Current Server PR #10 head `ff6a3e2db9ca206d46b52fedee36fbfe1cf0700a` includes the objective reservoir and up to 10,000 extra search steps, plus same-trip-chain sampling that retains the fastest and genuinely cheaper known-fare variants. Regressions include late cheapest direct/transfer results and the 520th transfer alternative. Local full Server suite on exact head: 254 pass, 0 fail, 3 optional skips; lint/typecheck pass on Node 24.21.0. Earlier parent `49b9b3b…` exact-head CI passed; exact-head runs `39286373644` and `39286380109` pass. Live Lviv search still truthfully reports truncation. | PARTIAL | Confirm current exact-head CI; continue adversarial route-quality/performance work; preserve partial-result warning |
| Safari/WebKit render recovery | Site PR #11 exact head `5879adad41ef03a17d07da144c1fae7bbd97d62a` adds a React error boundary and controlled lazy-navigation-chunk failure/manual recovery. Local `npm run check:production`: 118 unit tests, typechecks, lint, build, bundle budget and 12/12 Chromium/Firefox/WebKit tests passed. All three exact-head Site CI runs `39280149795`, `39280149987`, `39280142165` passed by 2026-10-19 16:18 UTC. Site has a web manifest but no service worker; historical physical Safari issue and device behavior remain NOT_TESTED. | PARTIAL | Reproduce on physical Safari/iPhone and validate supported update/offline policy before release |
| iOS uses the reviewed Site candidate | iOS PR #7 exact head `51bb028febbeca16bdad454692260b793870a140` pins Site `5879adad41ef03a17d07da144c1fae7bbd97d62a` in non-tag builds and manifest verification. Exact local `SITE_REF` materialization, Site build, Capacitor sync, unsigned Simulator compile, install/launch, welcome-screen capture and embedded Site/iOS SHA verification passed on Node 24.21.0; API origin was loopback. Both exact-head iOS CI runs `39280800298` and `39280804797` passed by 2026-10-19 16:19 UTC. Server/migration pins are null; sign-in, booking, GPS permission/background, push, physical device and staging are NOT_TESTED. | PARTIAL | Run authenticated API-backed Simulator scenarios and physical iPhone/staging acceptance |
| Current localhost runtime and transport registry | Read-only runtime smoke at 2026-10-19 16:00 UTC: Server `/healthz` and `/readyz` on localhost:3002 returned 200; active sockets confirm it uses PostGIS `marshgo-cache-e2e-postgres` on 5544 and Redis `marshgo-server-cache-redis-cache-1` on 6381 (both `restart=no`). That process is the dirty nested Server checkout `182c77ae…`, not PR #10. Provider-list and health endpoints returned 0 records; no seeding/write performed. Local Site serves on port 4301; browser port 3000 has no listener and produced a stale-page lazy-import error. Opening port 4301 showed the welcome screen. A 15-file dirty Server patch cannot be applied wholesale to the PR candidate; several shared untracked modules are identical, and semantic reconciliation remains required. | PARTIAL (local test runtime healthy; no provider rows; Site welcome only; dirty patch unreconciled) | Preserve dirty checkouts; seed/probe only in an isolated DB; reconcile changes individually; do not treat local runtime as the candidate or production |

No readiness percentage is assigned by this matrix. See execution state and blocker file for next work.

| Enabled-provider live Journey HTTP probe | Server `ff6a3e2db9ca206d46b52fedee36fbfe1cf0700a`; isolated tmpfs PostGIS/Redis, temporary enabled Lviv provider and authenticated owner request returned HTTP 200 `LIVE`, 2 exact GTFS directions, 8 fresh real-feed vehicles, and exactly 3 confirmed approaching/emphasized for a real selected boarding stop. Time-sensitive local probe; staging/production NOT_TESTED. | PARTIAL | Add a deterministic endpoint regression using feed fixtures; repeat on staging |
| Composite journey ranking / transfer effort | Server PR #11, exact SHA `2ece5b5a433957480df1aa81025216f47e1dcc93`: 8-minute generalized-time penalty per transfer for composite strategy scoring; FASTEST remains factual-duration ordered and CHEAPEST remains actual-fare ordered. Focused tests 19/19; full Server unit suite 255 passed / 0 failed / 3 opt-in skips; typecheck and lint PASS. Hosted exact-head CI was IN_PROGRESS at checkpoint. | PARTIAL (local verification passed; PR CI and staging still pending) | Confirm exact-head CI; maintain strict strategy promises and continue bounded-search completeness work |
| Composite transfer-cost strategy exact-head CI | Server SHA `2ece5b5a433957480df1aa81025216f47e1dcc93`, PR #11 stacked on Server PR #10. Pinned Node 24.21.0 local full unit suite 255/0/3 optional skips; typecheck and lint PASS. Exact-head GitHub Actions `39289287153`, `39289216489` both SUCCESS. | PARTIAL (code/CI proof only; staging and production remain unverified) | Continue routing completeness/capacity and then staging acceptance |
| Bounded GTFS candidate sampling matches composite ranking | Server PR #11 exact SHA `c77bfa31ea8f064aec79528f51a0b4de801ca68e`: candidate sampler and final BALANCED scorer both use the 8-minute-per-transfer generalized duration. Regression proves a 5-minute onboard saving does not beat the direct route in composite selection. Pinned Node 24.21.0 focused GTFS/scoring 66/66; full unit 256/0/3 optional skips; typecheck/lint PASS. Exact-head CI run `39289847112` IN_PROGRESS at checkpoint. | PARTIAL (local verification passed; CI/staging/production not all accepted) | Confirm exact-head CI; measure bounded search coverage and memory on refreshed Lviv feed; stage when environment exists |
| Routing follow-up API/DB/Redis integration | Exact Server `c77bfa31ea8f064aec79528f51a0b4de801ca68e`; Node 24.21.0, ephemeral loopback tmpfs PostGIS/Redis; migrations through `055_provider_commercial_use`; 30/30 integration tests PASS including Journey, bookings, negotiation, Partner isolation, navigation, Redis realtime, restart durability and rate limits. Lviv GTFS provider was not enabled in this isolated DB, so transit search returned blocked/empty as designed. | PARTIAL (local integration passed; live feed HTTP behavior is NOT_TESTED in this run; staging/production NOT_TESTED) | Add or run enabled-feed HTTP acceptance, then staging provider acceptance |
| Server PR #11 exact-head CI | SHA `c77bfa31ea8f064aec79528f51a0b4de801ca68e`; GitHub Actions `39289847112` and `39289866581` both completed SUCCESS. PR #11 open/mergeable/unmerged. | PARTIAL (CI pass; PR not merged; staging/production NOT_TESTED) | Continue actual-feed completeness and capacity acceptance |

| Lviv GTFS trolleybus normalization | Fresh public static feed probe: 9/72 route records are `route_type=3` while explicitly named `Тр22`–`Тр38`; Server PR #11 follow-up recognizes explicit trolleybus labels and retains ordinary buses. Parser/map regressions added; exact Node 24 focused tests 66/66, full unit 256/0/3 opt-in skips, typecheck/lint PASS. Actual schedule query returns `А37 → Тр24` as bus → trolleybus. | PARTIAL (local static schedule and unit proof; GTFS-RT, staging, production NOT_TESTED; live search remains truncated) | Exact-head CI; bounded graph completeness/memory investigation; staging validation |

| Lviv GTFS route mode correction exact-head acceptance | Server commit `4ac8081315f0183d7778b03218991c67418a6adc`, PR #11. Full pinned Node 24.21.0 unit suite 256/0/3 opt-in skips; focused mobility/GTFS/map layer 80/80; typecheck/lint PASS; exact-head CI `39290774771` and `39290785077` SUCCESS including migrations and API/DB/Redis integration. | PARTIAL (code and CI accepted; PR unmerged; staging/production and realtime tracking NOT_TESTED; static Lviv search remains truncated) | Continue bounded-search completeness and memory work; retain NOT_RELEASED |

| Focused live transit overlay visual/route-map acceptance | Dirty Site `codex/sync-journey-mobility-ui`, HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`; dirty Server `feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`. Site 96/96 unit tests, typecheck, focused lint, production build and `git diff --check` PASS. Dedicated Chromium E2E route-map section 1/1 PASS on local deterministic journey/live fixtures: exact selected-leg focus, both line directions, four fleet markers with three emphasized, and empty overlay after scooter selection. Manually inspected screenshot shows distinct muted direction lines. This is fixture-backed local visual evidence only. | PARTIAL | Full navigation section in the long E2E failed on stale/out-of-order GPS and `800 m` vs `90 m`; diagnose before whole-flow PASS. Repeat with live feed on staging; no staging/production visual acceptance |

| Actual-feed search completeness/capacity | Exact Server `4ac8081315f0183d7778b03218991c67418a6adc`, read-only Lviv GTFS static probe: 96,819/100,000 graph segments retained, 3 routes at 5,000 cap, 45,021 search steps, 509 candidates against 500 pool, 20 returned; stop selection, graph and candidate search all report truncation. `tsx` probe ~618 MB RSS/~1.14 s, one local sample only. | PARTIAL (search functions, but answer is explicitly incomplete; no production capacity claim) | Reduce avoidable graph/candidate allocations and add deterministic tests; do not raise caps without controlled load evidence |

| Transit segment focus camera and live-overlay API contract | Dirty Site `codex/sync-journey-mobility-ui` HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`: removed the post-poll fit-to-entire-line camera effect so the camera stays focused on the chosen itinerary leg; API type now accepts both server geometry provenances. Site tests 95/95, focused lint/typecheck and production build PASS. Dirty Server `feature/transport-layer-availability` HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`: focused live segment/fleet tests 13/13; loopback owner-scope API integration 1/1 PASS on local `marshgo_e2e`. Existing worktrees remain dirty and uncommitted. | PARTIAL (local checks passed; no browser visual acceptance for this camera transition, staging or production verification) | Add browser coverage for selected-leg camera retention plus both-direction overlay/fleet markers; inspect rendered captures across viewport sizes |
| Dirty-checkout quality gates after transit focus fix | Site `codex/sync-journey-mobility-ui` HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`: 95/95 unit tests, full lint, typecheck, production build and 17-chunk gzip budget PASS. Server `feature/transport-layer-availability` HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`: 218 unit PASS, 0 FAIL, 1 opt-in booking integration SKIP; typecheck/lint PASS; separate live-Journey API integration 1/1 and focused live segment tests 13/13 PASS. | PARTIAL (quality gates pass locally; skipped integration remains unverified; dirty changes uncommitted; staging/production absent) | Run the skipped integration only in a confirmed isolated fixture environment; browser visual acceptance and staging remain required |
| Honest live-data availability status | Dirty Server now attaches the explicit unavailable/no-fresh reason even when verified scheduled geometry remains on the map; regression tests preserve the line and assert its reason. Dirty Site shows loading/request-failure/provider-unavailable/no-fresh/incomplete-line states without removing the planned itinerary. Server focused tests 13/13 + typecheck/lint PASS; Site 95/95 + typecheck/lint/build PASS. | PARTIAL (local tests only; no screenshot/browser acceptance for each live-data state; staging/production NOT_TESTED) | Verify live-status copy and camera focus in browser against deterministic API fixtures; then repeat with actual feed on staging |

| GPS fixture isolation and stale-warning regression | Root Playwright config now pins `OSRM_URL` to the local E2E router instead of inheriting a developer `.env` router. With that correction, the exact 800 m guidance and stale-fix checks passed. Actual/expected screenshot comparison isolated the only visual difference to the obsolete stale-GPS warning; the single navigation screenshot was refreshed to reflect duplicate-fix filtering. | PARTIAL (full canonical E2E rerun in progress; no staging/production proof) | Record Playwright completion, then rerun final diff/quality gates |

| Full route sheet, segment selection and navigation acceptance | Chromium canonical end-to-end: **1/1 PASS**, including selected transit focus, route sheet, live-overlay fixtures, 800 m guidance and fresh-GPS behavior. Site quality gates on dirty HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`: **98/98 unit PASS**, typecheck/lint/build/bundle PASS. | PARTIAL (Chromium fixture E2E passes; Firefox drag FAIL in configured mobile-emulation input; WebKit stopped at ENOSPC; no staging/production) | Fix Firefox input-driver compatibility without weakening drag checks; restore safe disk headroom; rerun WebKit then exact cross-browser checks |

| Active-navigation return affordance on search form | WebKit capture showed the fixed resume pill obscuring the search CTA. Production UI now relocates the resume action into the search header and suppresses the floating pill while the search form is visible; a deterministic active-session fixture and visibility assertion were added. | PARTIAL (visual overlap addressed; full WebKit E2E currently stops earlier at camera `moving=true`; Chromium rerun after this change pending) | Resolve WebKit camera settling; rerun Chromium and full WebKit through search CTA; exercise Firefox with browser-appropriate pointer input |

| Active-navigation return affordance and post-session browser checks | Dirty Site `codex/sync-journey-mobility-ui` HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`; 98/98 unit, typecheck, lint, production build (1,862 modules) and 17-chunk gzip bundle gate PASS. Chromium canonical route/navigation E2E 1/1 PASS in 48.9 s against dirty Site build + root dirty API and isolated loopback PostGIS/Redis fixtures; it verifies active-session rehydration and the search-header return action. WebKit FAIL: after drag to expanded, rendered sheet height did not settle to target within 5 s. Firefox remains FAIL at pointer-driven sheet drag; do not count as cross-browser PASS. The E2E assertion was moved from before session creation to after restoring the actual session generated by this same scenario; it was not removed. | PARTIAL (Chromium fixture acceptance passes; WebKit and Firefox fail; provider/staging/production NOT_TESTED) | Diagnose WebKit target/rendered height and transition; fix Firefox native input delivery; rerun all browser projects, then staging acceptance |

| Cross-browser diagnostic rerun environment | A follow-up WebKit run did not reach Playwright assertions because the local API startup could not connect to PostGIS `127.0.0.1:5544` or Redis `127.0.0.1:6381`; read-only Docker inspection reports the daemon is not running. No container or Docker state was changed. | BLOCKED_FOR_THIS_RUN (diagnostic rerun not executed; prior WebKit failure and Firefox failure remain) | Re-run the same browser command after the isolated local database/cache services are available; no staging or production service is involved |

| Current dirty Server Lviv GTFS completeness and memory profile | Server `feature/transport-layer-availability`, dirty HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`; public static GTFS contained 1,071 stops / 72 routes / 15,716 trips / 426,685 stop-times. Malo Holosko → Sykhiv 07:00 Kyiv, 30-minute departure window built 430,040 segment candidates and returned 100 itineraries in 1.33 s at ~721 MiB RSS. Diagnostics: 20 origin + 20 destination stops, 9,727 DFS steps, 800 candidates retained (200 per 2–5 transit legs), per-depth sampling/search budget reached. API reported `searchTruncated=true` and `resultLimitReached=true`. Single local profile; no staging. | PARTIAL (truthfully marked incomplete; production memory/search recall not established) | Add deterministic truncation/coverage tests and compare a compact/lazy graph implementation against this profile without increasing caps blindly; repeat in isolated staging before release |

| GTFS route search event-loop availability | Same dirty Server revision and public Lviv GTFS query: synchronous search took 1,321 ms; a 50 ms event-loop timer observed a 1,321 ms maximum delay. Naïve per-request Worker cloning took 292 ms, still delayed the parent timer by 243 ms, and reached ~911 MiB RSS before a TS import failure; no worker search completed. Current code has no worker-thread/cooperative-yield path. | FAIL for production concurrency (local functional tests pass; latency isolation NOT_IMPLEMENTED; no production load test) | Move CPU-heavy GTFS search off the HTTP event loop with a worker-owned feed cache or deterministic cooperative async search; avoid whole-feed per-request cloning; verify response equivalence, memory envelope, cancellation and concurrent API responsiveness before staging |

| Worker-owned GTFS search feasibility probe | One read-only prototype Worker loaded the public Lviv feed itself, searched and returned 100 results with the same truncation status. Worker search 1,348 ms; parent event-loop max timer delay 2 ms; total process RSS ~710 MiB. This bypassed the production API and did not test cache reuse, queueing, cancellation or secondary queries. | PARTIAL (architecture feasible; production worker/pool NOT_IMPLEMENTED) | Integrate a bounded persistent worker path for GTFS source loading, primary search, metro/micromobility and Community composition queries; cap cache/queue, preserve provider errors/partial reasons, and run full API regression plus concurrency/memory gates |

| Candidate-pool completeness reporting | Server `feature/transport-layer-availability`, dirty HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`: a deterministic small-feed test reproduced that a candidate cap could set `resultLimitReached=true` while `searchTruncated=false`. Search now only marks candidate truncation when it actually rejects an additional feasible route; normal output page truncation remains separate. Focused tests **2/2 PASS**; full unit suite **219 PASS / 0 FAIL / 1 opt-in SKIP**; typecheck/lint PASS. | PASS locally (contract fix only; staging/production NOT_TESTED) | Retest under live API and staging; continue reducing actual-feed memory and candidate omissions |

| Persistent worker-owned Journey GTFS search | Dirty Server `feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8d0864fb130f43f8`: primary GTFS, micromobility↔metro and carpool↔transit follow-up searches now run in one persistent worker-owned feed cache; queue bounded to 8; worker startup unit 1/1 PASS. Live public Lviv probe: 10 primary + 3 group-search itineraries, bus/tram capability, max main-loop timer lag 4 ms over ~7.9 s. Full unit 220/0/1 opt-in skip; typecheck/lint/diff check PASS. | PARTIAL (local implementation and one live-feed probe; response equivalence, worker RSS/eviction, overload/cancellation, DB-backed API integration, stop arrivals, staging and production NOT_TESTED at this checkpoint) | Add deterministic equivalence and lifecycle tests; measure memory with multiple feed groups; run PostGIS/Redis API integration and staging acceptance |

| GTFS stop arrivals and live boarding-trip metadata | Dirty Server `feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`: stop-arrival calculation (including fresh GTFS-RT application) now runs in the worker; live journey route progress requests only selected trip route/direction/stop-sequence metadata instead of a full parsed feed in the API process. Public Lviv static-feed probe found the selected trip and its exact provider-scoped boarding stop; no realtime URL was supplied, so status was correctly `NOT_CONFIGURED`. Full Server suite 220/0/1 opt-in skip; typecheck/lint PASS. | PARTIAL (static probe only; no API/DB/Redis fixture acceptance, no fresh GTFS-RT probe, no worker-memory/load acceptance, map-network parse remains separate) | Add deterministic worker response-equivalence fixtures and rerun isolated stop-arrival + live-segment API integration; then staging verification |

| GTFS worker-core extraction / regression contracts | Server `feature/transport-layer-availability`, dirty HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`; core grouping/search/trip metadata/stop arrivals and bounded group cache have deterministic fixture contracts. Focused tests **5/5 PASS**; full suite **224 PASS / 0 FAIL / 1 opt-in SKIP**; typecheck/lint PASS. Live feed not reprobed after extraction; Docker daemon unavailable, so PostGIS/Redis-backed API integration is NOT_TESTED in this checkpoint. | PARTIAL (unit equivalence only; no worker resource/load, API integration, staging, production or physical-device evidence) | Re-run live feed and worker-backed journey/arrival API integration with isolated services; measure memory/queue/error handling before staging |
| Worker integration on current Server candidate | Server PR #12, head `c9019bf1f0b9f51fa66a4eae2c64deb068bdebd7`, stacked on PR #10 head `ff6a3e2db9ca206d46b52fedee36fbfe1cf0700a`. Primary GTFS search, stop arrivals, metro/micro and carpool/transit follow-ups use the persistent worker. Candidate lint/typecheck pass; 259 unit pass, 0 fail, 3 optional integration skips. Both CI runs `39322712114` and `39322732639` passed, including migrations and 30/30 isolated Postgres/Redis integration checks. CI did not confirm an enabled real Lviv provider; the separate 100-result live Lviv probe called the worker directly and was explicitly truncated, with 4 ms maximum observed event-loop lag. | PARTIAL (PR ready for review; no real-provider API acceptance, staging, production or device evidence) | Continue worker resource/error-path and real-provider API acceptance, then staging |

| Bounded parsed GTFS feed cache and worker memory diagnostics | Server PR #12 includes the cache and diagnostics at `499d0a94be25ae08bd61a78edb433483b73e4cd2`, with exact-head CI runs `39324760351`/`39324768651` passing 262 unit tests and 30 Postgres/Redis integration checks. Current PR head is `4a9015c476cc8ead44617c4544456a5cbf1a8f06`; exact-head CI `39325605209` also passed audit, lint, typecheck, 266 unit tests (263 PASS / 3 opt-in SKIP), migrations, and integration. The worker uses an async single-flight LRU/TTL cache capped at 32 entries and 256 MiB estimated parsed-feed weight; oversize feeds are served but not retained. Internal diagnostics report RSS/heap/cache/groups (not a public route); queue cap accepts 8 and rejects the ninth; API integration asserts coherent partial/truncation metadata. Corrected identical two-source Lviv+Stryi static search: both queries returned 100 results and 1,651 candidates, explicitly truncated; estimated feed-cache weight 238,226,064 bytes, post-GC heap 254→260 MiB, RSS 739→743 MiB, timer lag max 3 ms. These single-process estimates are not an RSS hard bound or concurrent-capacity proof; Docker is currently unavailable. | PARTIAL (local + exact-head CI evidence PASS; no concurrent capacity, API-backed real-provider acceptance, staging/production proof) | Measure memory under controlled staging concurrency and continue bounded search-recall analysis |

| Bounded GTFS graph allocation by estimated route supply | Server PR #12, `codex/gtfs-worker-bounded-cache-20261019`, SHA `4a9015c476cc8ead44617c4544456a5cbf1a8f06`. Per-route slots now cap at estimated stop-pair supply, avoiding unusable over-allocation. Focused tests **51/51 PASS**, full unit **263 PASS / 0 FAIL / 3 opt-in SKIP**, lint/typecheck PASS. Exact-head CI run `39325605209` PASS, including migrations and Postgres/Redis integration. Corrected identical two-source static-feed queries remain explicitly truncated at 97,413 segments, 1M search steps, and 100 results; first/warm search 11.3/7.0 s, worker post-GC RSS ~739/743 MiB. | PARTIAL (code/unit/CI integration PASS; the fix does not change dense-feed truncation; no staging/production acceptance) | Keep truncation explicit; inspect dense search frontier and find a bounded recall improvement before changing release status |

| Selected transit-line map behavior: both directions + fresh vehicles + up to 3 proven approaches | Site PR #11 SHA `5879adad41ef03a17d07da144c1fae7bbd97d62a`: exact hosted browser CI **12/12 PASS** across Chromium/Firefox/WebKit using API fixtures; Chromium asserts 2 line directions, 4 markers, 3 highlighted. Server PR #12 SHA `4a9015c476cc8ead44617c4544456a5cbf1a8f06`: unit fixture asserts both GTFS directions, all fresh same-route vehicles, and exactly up to 3 approaching by exact trip/service date/stop sequence. Latest read-only catalog probe (2026-10-20 Europe/Kyiv) found Lviv static GTFS HEALTHY (1,071 stops/72 routes/15,716 trips), but both Lviv GTFS-RT endpoints returned valid feeds with **0 vehicles / 0 trip updates / 0 alerts**. Daytime static timetable probe found 10 routes in each of 2 city journeys; both explicitly truncated at configured search/result limits. Full details: `docs/audit/18_LIVE_TRANSIT_ROUTE_ACCEPTANCE_2026-10-20.md`. | PARTIAL (implementation + fixture/unit/browser checks PASS; current live fleet unavailable; live provider API/staging/production NOT_TESTED) | Verify current provider configuration and repeat on staging when the Lviv vehicle feed returns fresh usable positions; keep live markers absent rather than inventing them while empty |
| Rendezvous GPS map: mutual-consent foreground exchange | Site PR #12 commit `a42719853f7bce331eefe27a8f51a888cb244aad` (ready for review, base `codex/site-owned-e2e`), stacked on Site PR #11 head `5879adad41ef03a17d07da144c1fae7bbd97d62a`. Watch/send now requires authenticated active session + both consents + visible page; hidden pages stop GPS watch and hide live map points; pushed samples require valid coordinates and <=90s freshness. Server PR #12 head `4a9015c476cc8ead44617c4544456a5cbf1a8f06` tests both participants, outsider denial, ephemeral storage, ordering and clearing on revoke. Site typecheck/lint/build PASS; focused GPS/map tests 5/5 PASS; route E2E 6/6 PASS using fixtures. Site exact hosted CI runs `39326788429`, `39326763839`, `39326788471` all PASS; primary Site CI includes production-build browser acceptance. | PARTIAL (code/test evidence; hosted CI, real two-device GPS, staging, background iOS, road-routed ETA and production NOT_TESTED) | Complete Site PR #12 CI; perform two-account/two-phone staging acceptance, including denied permission, hide/resume, revoke, stale location and reconnect |
| iOS exact Site synchronization | iOS PR #7 updated by commit `e046367478e36282d1538f0d1d5114dbdd64c395`; workflow checks out exact Site PR #12 SHA `a42719853f7bce331eefe27a8f51a888cb244aad`, same as foreground GPS change. README and release manifest pins updated; exact iOS Simulator runs `39327353926` and `39327363862` both PASS on the pinned SHA. | PARTIAL (pin synchronized and Simulator CI PASS; no physical-device GPS/background, staging or release acceptance) | Finish both Simulator workflows; then validate on physical iPhone against a configured staging API |

| GTFS exhausted-queue scheduler optimization | Server branch `codex/gtfs-queue-scheduler-20261020`, commit `f235ca91c75996bd2d5645642780ba7467a7574c`, tested stacked on PR #12 / base candidate `4a9015c476cc8ead44617c4544456a5cbf1a8f06`; PR #13 was closed after the dense-feed comparison showed no material benefit. Branch retained. The experiment removed exhausted route groups from later rounds and added a drain counter. GTFS timetable tests 46/46 PASS; TypeScript/ESLint/diff check PASS on Node 25.4.0 (repo specifies 24.21.0); exact-head hosted CI runs `39328001241` and `39328031904` PASS. | FAIL — experiment does not meet the dense-feed performance objective: same Lviv/Stryi query was replayed on baseline and branch with identical graph size, candidate counts and search steps; no material latency improvement was demonstrated) | Investigate whole-trip graph retention and four-leg candidate expansion; keep truncation visible until dense-feed coverage improves |

| Per-route GTFS graph budget increase to 7,500 | Isolated unpushed experiment from Server SHA `4a9015c476cc8ead44617c4544456a5cbf1a8f06`; global cap remained 100,000. Same Lviv+Stryi query: graph 97,269 vs 97,413, candidate count 1,656 vs 1,651, both hit 1,000,000 steps and returned 100 truncated; warm RSS ~1,047 vs ~943 MiB. Existing graph-bound test also no longer exercised truncation. Source restored; no push. | FAIL (no recall/latency improvement; higher memory and weakened boundary regression) | Keep 5,000 cap; design schedule-aware selection and test recall under the existing bounds |

| Fixed-share time-stratified GTFS graph sampling | Isolated Server prototype from SHA `4a9015c476cc8ead44617c4544456a5cbf1a8f06`; focused GTFS/retention/graph tests 55/55 PASS. Same Lviv+Stryi probe: 91,395 graph segments / 1,648 candidates vs baseline 97,413 / 1,651; both 1M steps, 100 results, partial; prototype first/warm 12.0/6.6 s vs baseline 10.4/6.7 s. Source restored, no push. | FAIL (fixed band shares waste capacity and reduce retained graph/candidates) | Add deterministic spillover for unused bucket allocation before repeating the dense-feed probe |

| Dense GTFS retention: two-hour time-band reservation with spillover | Isolated prototype in `/tmp/MarshGO-Server-time-strata-20261020` from Server SHA `4a9015c476cc8ead44617c4544456a5cbf1a8f06`; focused selector test plus GTFS timetable tests **50/50 PASS**, typecheck/lint PASS. On the same live Lviv+Stryi feeds and query, candidate retained 99,357 graph segments / 1,637 candidates vs baseline 97,413 / 1,651; both reached 1M search steps and returned 100 truncated. Candidate source restored; no commit/PR. | FAIL (no demonstrated recall/latency benefit; slightly fewer route candidates) | Keep baseline behavior; investigate bounded search candidate prioritization and candidate caps |
| Dense GTFS search-step ceiling 1.5M experiment | Same isolated worktree, temporary `MAX_SEARCH_STEPS=1,500,000`; repeated same feeds/query. Candidate counts remained 1,651, graph 97,413, but warm search time rose ~6.7s→~9.4s; both results remained truncated. Reverted, no push. | FAIL (more CPU time without more candidates) | Retain 1M ceiling until a search strategy proves better recall per step |

| GTFS transfer-rule index | Server isolated worktree at base `4a9015c476cc8ead44617c4544456a5cbf1a8f06`: indexed transfer rules by arriving stop; a regression query retained the valid 900-second hub rule with 2,000 irrelevant rules present. Full unit suite **263 PASS / 0 FAIL / 3 opt-in SKIP**, typecheck/lint/diff check PASS. Synthetic 10,001-rule feed: same 24 candidates; 1,419ms baseline vs 115ms indexed. Real Lviv/Stryi probe is unchanged and still explicitly truncated. | PASS for semantics and synthetic hot-path optimization; NOT_TESTED in DB-backed integration/staging/production | Review via a new Server PR; run Postgres/Redis and staging acceptance when Docker/staging are available |
- Follow-up: implementation is reviewable as Server PR #14, commit `c671aac87835c1efed6ee7423ffd79fe690ac987`, stacked on PR #12. Exact-head hosted CI is pending (runs `39330546132`, `39330563757`); do not promote this check to PASS until complete.
- PR #14 now includes follow-up commit `860f41a` (current head). Focused GTFS tests **46/46 PASS**, typecheck/lint PASS locally; re-run exact-head CI is pending and supersedes CI against `c671aac`.
- Exact-head evidence complete: Server PR #14 SHA `860f41a825f898d12701da84fbce4586b162c27f`; CI runs `39330656623` and `39330664232` both PASS, including dependency audit, lint, typecheck, full unit suite, DB migration and isolated Postgres/Redis integration (27 assertions PASS). PR remains OPEN/UNMERGED; this does not establish staging/production or full product readiness.

| Dense GTFS search after candidate-pool saturation | Bounded per-leg objective-reservoir window (100,000 search steps); exact Lviv+Stryi local probe repeated twice, both 100 returned and explicitly truncated. Cold 7.16–7.66s vs baseline 10.80s; warm 2.46–2.54s vs 6.99s. All fastest-5 identical; fastest-20 and cheapest-20 each 19/20 ids overlap, with equal sampled duration/fare values. Full unit tests 263 PASS / 0 FAIL / 3 opt-in SKIP; typecheck/lint PASS. | PASS for bounded local optimization review; NOT_TESTED in staging/production; route search remains incomplete/truncated | Commit/push on PR #14 branch and require exact-head CI; retain the truncation indicator and pursue exhaustive/coverage improvements separately |
- Latest Server PR #14 follow-up commit `fa97c85d8e`: exact-head CI pending on runs `39331578155` and `39331582645`; the earlier green checks apply only to SHA `860f41a`.
- Superseding the pending note above: both exact-head CI runs for `fa97c85fb4f99ac0f4c716ae0f8a25c58f03f997` completed PASS. They ran dependency audit, lint, typecheck, full unit tests, DB migration and Postgres/Redis integration. PR #14 remains OPEN/UNMERGED; no staging or production acceptance.

| Cross-repository release orchestration | Current CI checks are green for Server #9/#10/#12/#14, Site #9/#11/#12, iOS #7, Admin #1 and Partner #1. MarshGO PR #5 verify is FAIL because `MARSHGO_REPOS_READ_TOKEN` is unset; CI fails closed before private Admin/Partner checkout. Exact-head logs reviewed; no secret value exposed. | PARTIAL; affected candidate checks green, integrated repo-materialization gate BLOCKED_EXTERNAL | Owner configures least-privilege Actions secret for private Admin/Partner read; rerun PR #5 CI. Do not weaken checkout gate |

| Current root-checkout production bundle | `npm run check:production` in the current dirty root checkout: typecheck/lint PASS, unit 252 PASS / 0 FAIL / 1 opt-in SKIP, Vite production build PASS, bundle budget PASS (51 JS chunks ≤350 KB gzip; app chunk 222.6 KB gzip; MapLibre vendor 275.7 KB gzip). Checkout has pre-existing user modifications; not an exact pinned-candidate build. | PASS for current local code checks; NOT_TESTED for browser E2E/staging/production | Re-run exact pinned cross-repo E2E on isolated disposable DB and stable staging candidate; preserve current tree changes |

| MarshGO2 UI/reuse review | Read-only inventory at local `main` `8542f4b`, dirty tree preserved. Separate React/Vite app has API adapters and UI candidate components, but imports mock gallery examples in `App.tsx`; README explicitly lists unsupported combined carpool+transit, city live fleet, Wallet and voice guidance; GPS simulation has hard-coded demo journey. | NOT_ACCEPTED as production frontend; candidate visual references only | Preserve working tree; compare desired production screens against canonical Site and approved design snapshots before any deliberate component migration |

- Dense-feed graph diagnostic correction: `graphRoutesAtLimit=4` means four routes filled their allocated shares, not the 5,000 hard per-route ceiling. The exact query retained 97,413/100,000 segments over 67/70 routes; 2,587 slots remained unused due whole-trip bundle granularity. Nearby stop candidates 23/25, selected 21/22, omitted 2/3; all route patterns remained represented but that does not prove transfer/schedule alternatives are complete. Keep the query marked partial.

| Oversized single-trip segment retention | Isolated Server work branch `codex/gtfs-trip-segment-sampling-20261020` from `fa97c85`. Best-K heap preserves exact query-direct/boarding/alighting/transfer segments within the existing per-route graph cap; synthetic overflow regression passes. Server full unit tests 266 PASS / 0 FAIL / 3 opt-in SKIP; typecheck/lint PASS. Lviv+Stryi live-feed comparison on identical downloaded snapshots: same first 20 itinerary IDs, fastest/cheapest top five, 100 results and truncation status; 2.35s baseline / 2.44s candidate (single-run noise only). | PASS for deterministic local behavior and synthetic regression; NOT_TESTED in staging/production; real feed search remains explicitly truncated | Review isolated change, run exact-head CI, then validate on disposable Postgres/Redis integration and staging when available |
- Superseding release evidence: commit `966366977a059807793463f0867b1b79fdf92d48`, PR #15 `https://github.com/dima1203oleg/MarshGO-Server/pull/15`, stacked on PR #14, OPEN/MERGEABLE. Exact-head Server CI is pending (one run IN_PROGRESS, one QUEUED); do not treat either as PASS until both complete.
- Superseding CI result: both PR #15 exact-head runs PASS on `966366977a059807793463f0867b1b79fdf92d48` (audit, lint, typecheck, unit, migrations, Postgres/Redis integration): https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39333554418 and https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39333571441. PR remains OPEN/UNMERGED; local staging/production acceptance remains NOT_TESTED.
- Fresh vehicle-feed observation (2026-10-19 22:17 UTC): Lviv and Stryi VehiclePositions endpoints each returned HTTP 200 with a current header timestamp but 0 entities/positions. This overnight empty response does not validate live fleet-to-route matching. Daytime populated-feed acceptance remains NOT_TESTED.

| GTFS route-wide deterministic graph sampling | Server commit `ecdc1da` / PR #15: same Lviv+Stryi static snapshots, deterministic per-route segment reservoir fills 100,000 graph slots vs baseline 98,152; fastest sample improves 942s→926s but local query time rises 2.34s→3.47s; both return 100 and explicitly truncated. Server local typecheck/lint PASS, unit 263 PASS / 0 FAIL / 3 opt-in SKIP; exact-head GitHub CI pending at checkpoint. | PASS for local bounded sampler regression checks; CI PENDING; route search remains incomplete; staging/production NOT_TESTED | Recheck both exact-head CI jobs; compare latency/memory and route relevance before merge; continue resolving route truncation and validate on stable staging |
- Superseding CI for Server PR #15 commit `ecdc1da`: runs `39334694086` (push) and `39334702837` (pull_request) both PASS for audit, lint, typecheck, unit, DB migration and Postgres/Redis integration. PR remains open/unmerged; this only verifies the candidate code, not deployed readiness.
- Additional isolated-process one-run comparison: base 2.35s / ~790 MB diagnostic RSS peak; candidate 3.58s / ~909 MB. PR description now exposes this local regression. | Tradeoff requires review/optimization before merge; do not count as production-ready performance |
- Follow-up disposition: route-wide sampler experiment was reverted in `76b4e1e` due local 52% slower search and higher RSS; PR #15 now retains only the narrower oversized-trip deterministic sampler. Revert HEAD exact CI is pending, and no staging/production acceptance exists.

| Deterministic GTFS endpoint-only overflow fill | Server PR #15 `7d47db9`: stable trip ordering, bounded per-route endpoint-serving fallback, 99,475/100,000 retained graph segments vs 98,152 baseline; 403,521 vs 406,851 search steps; fastest sampled result 926s vs 942s; 100 results and explicit truncation on both. Local typecheck/lint PASS; unit 266 PASS / 0 FAIL / 3 opt-in SKIP; insertion-order regression PASS. | Local PASS for bounded deterministic candidate behavior; exact-head CI PENDING; route search remains truncated; staging/production NOT_TESTED | Verify exact-head CI, continue improving completeness and measure latency/coverage on staging before considering merge |
- Exact-head CI for Server PR #15 `7d47db9`: both `39335525958` and `39335537588` PASS including migration and Postgres/Redis integration. Status remains candidate-only; no merge, staging, or production evidence.

| Site-to-iOS exact revision synchronization | iOS PR #7 SHA `e046367478e36282d1538f0d1d5114dbdd64c395` checks out and asserts Site `a42719853f7bce331eefe27a8f51a888cb244aad`; hosted run logs 39327353926/39327363862 confirm exact ref, Site build, Capacitor sync and simulator compile. Release tags require external immutable Server/Site vars, migration/API versions and HTTPS origin. PR description corrected. | PASS for candidate pin and simulator build; interactive/staging/physical iPhone NOT_TESTED | Keep coordinated PR chain reviewable; validate actual staging API and physical-device flows before release |
- Queue-scheduler experiment `f235ca9` compared on identical static Lviv+Stryi feed snapshots: 54 idle queues pruned, but search hit 1,000,000 steps / 4.91s and remained truncated. Current candidate `7d47db9`: 403,521 steps / 2.56s; still truncated. The isolated queue-pruning patch is not a substitute for the bounded search and is not adopted.


### Continuation verification — 2026-10-20

| Gate | Fresh evidence | Status | Next action |
|---|---|---|---|
| Server GTFS search regression suite | Isolated PR #15 checkout, `tests/gtfs-timetable.test.ts`: **47 PASS / 0 FAIL / 0 SKIP** after `npm ci --ignore-scripts`; local Node 25.4.0 differs from required 24.21.0. Hosted exact-head Server checks remain PASS on CI runtime. | PASS for focused suite; local compatible runtime NOT_TESTED | Keep hosted Node 24 CI as compatible-runtime evidence; continue dense-feed completeness work without raising bounds blindly |
| Local container runtime | Docker socket unavailable. Root development compose defines PostGIS, Redis, S3Mock; production compose lists DB, Redis, migration job, API, web, Admin, Partner, Caddy. Running state cannot be observed. | NOT_TESTED | Restore Docker daemon before local DB/Redis/object-store integration smoke |
| Cross-repository candidate CI | Server #15 `7d47db98ada941a212ba621385671f55d740aecf`, Site #12 `a42719853f7bce331eefe27a8f51a888cb244aad`, iOS #7 `e046367478e36282d1538f0d1d5114dbdd64c395`; all OPEN/MERGEABLE and exact-head checks PASS. iOS workflow uses exact Site SHA. | PASS for candidate CI; NOT_RELEASED | Keep manifest pins; staging/deploy and physical-device gates remain open |
| Documentation release manifest | Historical 2026-10-01 manifest preserved at `docs/archive/releases/RELEASE_MANIFEST_RC-2026-10-01-staging.9.json`; `docs/RELEASE_MANIFEST.json` now byte-identical to canonical root manifest and remains NOT_RELEASED. | PASS for pin synchronization | Refresh both manifests together for future candidate changes |

| GTFS bounded-search diagnostic follow-up | Server PR #15 head `408490e3c8762b350ba264d0bbaad7405389e497`; debug-only logs now separate estimated demand/global and route budgets from search-step saturation and candidate-pool saturation by leg count. Focused diagnostics regression PASS; full unit **267 PASS / 0 FAIL / 3 opt-in SKIP**, typecheck/lint/diff check PASS. Exact-head CI run `39336651439` is pending. | Local PASS; hosted CI PENDING; production search remains truncated | Recheck exact-head CI, then use diagnostics on a repeatable dense-feed probe to choose the next algorithm improvement |
- Superseding CI result for Server #15 `408490e3c8762b350ba264d0bbaad7405389e497`: exact-head push run `39336651439` and pull-request run `39336656400` both PASS. Each includes dependency audit, lint, typecheck, all unit tests, clean migrations and Postgres/Redis integration. PR remains OPEN/UNMERGED; dense static-feed search remains truncated, staging/production remain NOT_TESTED.

| Fresh dense-feed diagnostics and bounded overflow experiment | Public Lviv static GTFS exact local probe: 72 routes, 1,071 stops, 15,716 trips; 20 itineraries, explicitly truncated. Diagnostics: estimated graph demand 190,330 vs 100,000 cap, all 71 route candidates budget-limited, 3,085 allocated slots unused, global budget binding=true; candidate pool saturated at 65,333 steps and search stopped at 165,333 with queued work, below hard 1,000,000 limit. A controlled endpoint-overflow cap 100→150 added 86 graph segments, did not change leading results or remove truncation, so it was reverted. Latest diagnostic field patch is Server PR #15 SHA `2e427fb918f277121cf52a3db938ca7e752bc3f2`; local full suite 267 PASS / 0 FAIL / 3 opt-in SKIP, typecheck/lint PASS; exact-head CI pending (`39337072791`, `39337077106`). | FAIL for complete search; local diagnostics PASS; current head CI PENDING; live/staging/production NOT_TESTED | Wait for exact-head CI; prioritize schedule-aware route/transfer retention and unused-budget diagnosis instead of raising a cap that did not improve recall |
- Superseding CI for diagnostics SHA `2e427fb918f277121cf52a3db938ca7e752bc3f2`: exact-head push `39337072791` and PR `39337077106` both PASS, including audit, lint, typecheck, complete unit suite, clean migrations and Postgres/Redis integration. PR #15 remains OPEN/UNMERGED; route search remains truncated and staging/production are NOT_TESTED.


| Server #15 current exact-head CI | Current SHA `d6c5ce55c880017d397fac8cea3352a854981231`; push run [39337360844](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39337360844) and PR run [39337366550](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39337366550) both PASS, including audit, lint, typecheck, unit, clean migrations and Postgres/Redis integration. New change is diagnostic-only. | PASS for exact-head CI; PR OPEN/UNMERGED; production NOT_TESTED | Continue candidate work; no deploy evidence is implied by CI
| Bounded transfer-only reservoir experiment | Same local Lviv+Stryi static feed snapshot/query: endpoint-only baseline retained 99,475 segments, left 525 graph slots unused and used 403,521 search steps; experimental transfer-only inclusion retained 99,588, left 412 unused and used 404,465 steps. Top ten itinerary IDs stayed the same and search remained truncated. Experiment reverted due no observed quality/completeness improvement. | Experiment NOT_ACCEPTED; no product code change | Add per-route diagnostics and test a strategy that improves multi-leg recall, then compare exact outputs and bounded runtime/memory
| Docker runtime availability | `docker ps` and `docker compose ps` cannot connect to `unix:///Users/dima1203/.docker/run/docker.sock`; no current container inventory available. Compose files define local PostGIS/Redis/S3Mock, but runtime state is unobserved. | NOT_TESTED | Docker daemon must be available before local DB/Redis/S3 integration smoke; no runtime changes made


| Bounded GTFS endpoint overflow cap adjustment | Server PR #15 head `31c02c3d82a0b7ffe6f3774342f9b773b2b8006d`; Lviv+Stryi static-feed probe cap 100→200: retained graph 99,475→99,777; unused budget 525→223; routes underfilled 21→13; max route gap 158→97; 2-leg candidates 543→547; search steps 403,521→404,201. Both return 100 with `searchTruncated=true`. Local full unit 267 PASS / 0 FAIL / 3 opt-in SKIP, typecheck/lint/diff-check PASS. Exact-head CI run `39337922510` pending at checkpoint. | Local checks PASS; hosted CI PENDING; search incomplete; production NOT_TESTED | Recheck exact-head CI; continue measuring query quality and bounded memory before another tuning change

- Superseding exact-head CI: Server PR #15 push run [39337922510](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39337922510) and PR run [39337928277](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39337928277) both PASS on `31c02c3d82a0b7ffe6f3774342f9b773b2b8006d`; PR remains OPEN/UNMERGED and production remains NOT_TESTED.

| GTFS search objective-window experiment | Temporary 100k→250k objective window on the same Lviv+Stryi static feed/query: 404,201→854,201 search steps; about 2.6s→4.2s single-run elapsed time; candidate results 1,891→1,896; first ten unchanged; both remain truncated. Experiment reverted, checkout still exact candidate SHA `31c02c3d82a0b7ffe6f3774342f9b773b2b8006d`. | NOT_ACCEPTED; no production code change | Improve path enumeration/relevance rather than increase the time budget

| Debug diagnostic production cost | Server PR #15 `d95c39111c636e16442060ecc80ce29c37a18476` computes/sorts the detailed per-route underfill sample only when `MARSHGO_GTFS_SEARCH_DEBUG=1`; local full unit 267 PASS / 0 FAIL / 3 opt-in SKIP, typecheck/lint/diff-check PASS. Exact-head push run `39338316009` and PR run `39338321614` now both PASS. | Local PASS; hosted CI PENDING | Recheck current exact-head CI; keep production diagnostics opt-in
| Exact cross-repo web/iOS CI recheck | Site #12 `a42719853f7bce331eefe27a8f51a888cb244aad`: runs `39326788429`, `39326763839`, `39326788471` PASS. iOS #7 `e046367478e36282d1538f0d1d5114dbdd64c395`: runs `39327353926`, `39327363862` PASS, pins the exact Site SHA. | PASS for hosted candidate CI; NOT_RELEASED | Staging, physical iPhone, live API and deployment acceptance remain open

| GTFS service-date journey identity | Server PR #15 `b6cec8e257a2ba8a4c4e8aa3a9ad5b2df2edd749`: regression reproduced and fixed; same `trip_id` across two active service dates now yields distinct itinerary IDs. Focused GTFS 49/49; full unit 268/0/3 opt-in skip; typecheck/lint/diff-check PASS. Exact-head hosted CI push run 39338728299 and PR run 39338734337 PASS, including migrations and Postgres/Redis integration. | PARTIAL | Continue API-level actual-feed and staging journey acceptance |

| Production API sampling-status reporting | Server PR #15 current head `751d83aedadf9b46b48b3d7e8103475cc058ffff` removes three repeated truncation-status assignments without changing behavior. Local full unit 268/0/3 opt-in skip; typecheck/lint/diff-check PASS. Parent `b6cec8e…` CI passed; exact-head CI runs 39338949807 and 39338959040 PASS, including migrations and Postgres/Redis integration. | PARTIAL | Confirm exact-head CI on `751d83a` before treating this checkpoint as hosted-verified |

| Actual Lviv/Strii GTFS search and worker capacity | Current Server `751d83aedadf9b46b48b3d7e8103475cc058ffff`: fresh open static feeds fetched without provider errors and merged into one group. Search returned 100 itineraries with all three truncation indicators true. Six sequential searches: cold 6.7s, warm ~2.6–2.8s; transient heap peak ~1,135 MiB then ~446 MiB after GC, RSS peak ~933 MiB. Parent timer lag 3ms. Single-process sequential probe only; no concurrent load or staging. | PARTIAL | Profile bounded graph/search allocations and measure concurrency in an isolated test environment; keep incomplete-search status visible |

| GTFS graph-cap memory/coverage experiment | Temporary 50k cap on current Server `751d83aedadf9b46b48b3d7e8103475cc058ffff` reduced returned four-leg chains from 6 to 0 and removed the fastest 3,963 s option; single-run memory did not improve reliably. Change was reverted; current code remains at 100k cap and still reports truncation. | PARTIAL (experiment rejected) | Investigate allocation reduction that preserves long transfer chains; repeat controlled runs before any bound change |

| Consented rendezvous approaches | Stacked Server PR #17 (`e44a0082d97bede142e0f1587f361b0530d595d5`) adds participant-only fresh CAR/FOOT route geometry, distance and duration with consent-epoch enforcement; dirty Site checkout polls and displays both routes | Exact-head push/PR CI PASS (including migration and Postgres/Redis integration); Server local typecheck/lint/unit 269 PASS / 0 FAIL / 3 opt-in SKIP; Site local typecheck/lint, 98/98 tests, build and bundle PASS on dirty checkout | PARTIAL | Configure licensed CAR/FOOT routing, commit and verify matching Site SHA, staging two-account route/GPS flow, visual/browser acceptance, physical iPhone test |

| Rendezvous approach routes in production Site | Site PR #13 exact head `8a509f6476a05b4bff1638804249520764a32593` calls the participant-authorized Server approaches endpoint, renders validated server car/foot geometry and routed distance/ETA, explicitly reports unavailable routing, and carries the selected strategy into route details. Local typecheck/lint, 123/123 unit tests, 12/12 browser E2E across Chromium/Firefox/WebKit, production build and bundle gate PASS; hosted Site CI runs `39343386437`, `39343391812`, `39343391903` PASS. | PARTIAL (candidate CI PASS; no configured pedestrian router, staging/device run, or deployed API) | Configure/verify real foot router and staging; exercise mutual-consent flow with two accounts/devices |

| Site PR #13 hosted acceptance | Exact head `8a509f6476a05b4bff1638804249520764a32593`; three hosted CI checks PASS, including security audit, lint, typecheck, unit, production build, bundle gate and Chromium/Firefox/WebKit browser acceptance. | PASS (candidate UI/build/browser acceptance); live API flow is not covered | Keep unmerged pending stack review/order; connect staging API and run two-user bookings/rendezvous with real routing, then production smoke only after an authorized deployment |

| Admin P0 UI candidate | Admin PR #1 exact SHA `9dbf7db0a935498ac40c98b19bc36bce056d630d`; clean shallow checkout; dependency audit 0 vulnerabilities, typecheck/lint/build PASS, 2/2 unit tests PASS. | PARTIAL (tests are frontend role/presentation guards only; no live Server RBAC or tenant-isolation acceptance; PR remains open) | Integrate after shared Server platform contract; run two-role authenticated staging acceptance before any release |
| Partner P0 UI candidate | Partner PR #1 exact SHA `c639257a7f28aeda5b378a816038b01651146b83`; clean shallow checkout; dependency audit 0 vulnerabilities, typecheck/lint/build PASS, 3/3 unit tests PASS. | PARTIAL (tests are frontend access-state guards only; no authenticated membership/tenant-isolation acceptance; PR remains open) | Integrate after shared Server platform contract; run organization-owner/member cross-tenant staging tests |
| iOS pin for Site rendezvous route-map candidate | iOS PR #8 exact head `55324c97d173d156d93be3863efc026fe0b7d185` pins exact Site SHA `8a509f6476a05b4bff1638804249520764a32593`; local pinned Site build, Capacitor sync and unsigned Simulator build PASS; hosted push run `39343592728` and PR run `39343597375` PASS. | PARTIAL (candidate pin and simulator CI PASS; no staging/device/production verification) | Test the built app against staging on physical iPhone for sign-in, map and foreground/background permissions |

| iOS exact Site SHA simulator check | PR #8 head `55324c97d173d156d93be3863efc026fe0b7d185`; push and PR CI verify Site `8a509f6476a05b4bff1638804249520764a32593`, build its web bundle, run Capacitor sync, and compile iOS Simulator; both jobs PASS. | PASS (unsigned Simulator candidate only) | Physical-device GPS, foreground/background permission behavior, deep link, sign-in and rendezvous on staging; configure release signing and immutable server/API/migration inputs |

| Bounded GTFS transfer-only graph overflow | Server commit `8a30211358da46243c15d8525d0d38f668bdca5c`, PR #18 retains capped transfer-only candidates in route overflow; endpoint candidates keep precedence under existing deterministic rank. | Local targeted GTFS tests 11/11 PASS; full Server unit 268 PASS / 0 FAIL / 3 opt-in SKIP; typecheck/lint PASS. Hosted exact-head push/PR CI pending. | PARTIAL | Confirm hosted CI, repeat same Lviv/Stryi feed probe and compare search recall/truncation, latency and memory; then database/staging acceptance |

| GTFS transfer-only overflow inclusion (PR #18) | Repeated prior controlled experiment: graph +113 segments (99,475→99,588), first ten unchanged, `searchTruncated=true`; PR #18 closed before merge. Commit/branch preserved for traceability. | Experiment NOT_ACCEPTED; no merge; hosted CI pending and disregarded | FAIL for completeness improvement | Do not repeat. Develop a distinct search strategy with a deterministic recall regression and repeat feed/runtime/memory comparison |

| GTFS transfer feasibility memoization | Isolated trial on Server base `751d83a…`; 281,093 cache hits / 97,877 misses across the query, without changing behavior. | 10 targeted tests, typecheck, lint PASS; all 100 result IDs and sampled top itineraries identical; one-run cold/warm 6.589/2.764s baseline vs 6.621/2.710s trial; both truncated. Change reverted. | NOT_ACCEPTED (no stable material improvement) | Improve bounded graph/stop retention and prove recall with a deterministic schedule-based regression |

| Query-directed temporal GTFS pruning | Investigation only on Server PR #15 head `751d83aedadf9b46b48b3d7e8103475cc058ffff`: live static-feed evidence shows 99,207/100,000 segments, 1,676 candidate results, and multiple truncation flags; current budget retention does not first prove time-feasible OD-chain membership. | NOT_IMPLEMENTED / NOT_TESTED | Build small-budget deterministic fixture and prove feasible-chain recall improves without relaxing caps; then repeat frozen-feed query and compare objective coverage, p50/p95 latency and memory |
| Current local Docker services | Compose declares development PostGIS/Redis/S3Mock; Docker daemon at the configured socket is unavailable, so no active containers or DB-backed local integration can be confirmed. | NOT_TESTED | Start Docker Desktop only when the operator is ready; then identify exact containers and volumes before running migrations/integration |

| Selected route strategy label | Site PR #13 exact commit `8a509f6476a05b4bff1638804249520764a32593`; active strategy tab is carried into the route card and selected map details, with pure regression coverage. | Local Site unit 123/123, E2E 12/12 across Chromium/Firefox/WebKit, typecheck/lint/build/bundle PASS; exact-head hosted CI runs `39343386437`, `39343391812`, `39343391903` PASS. No live API in browser E2E. | PARTIAL (candidate gates PASS; staging API acceptance pending) | Test strategy tabs/card/map consistency against a staging response with cross-ranked journeys |
- Follow-up: Site PR #13 exact-head hosted CI run `39343386437` completed PASS for `8a509f6476a05b4bff1638804249520764a32593`; PR remains OPEN and no live API/staging deployment was exercised.

| Cross-repository candidate pins | Current review tuple: Server #17 `e44a0082d97bede142e0f1587f361b0530d595d5`, Site #13 `8a509f6476a05b4bff1638804249520764a32593`, iOS #8 `55324c97d173d156d93be3863efc026fe0b7d185`; iOS local build pins exact Site SHA; root and docs release manifests updated together and remain NOT_RELEASED. | Server PR #17 exact CI PASS; Site PR #13 exact CI PASS; iOS local Site build/Capacitor/Simulator PASS; iOS hosted run 39343592728 pending. | PARTIAL | Confirm hosted iOS CI and staging runtime compatibility; merge only through reviewed dependency order and explicit release gates |
- Follow-up: iOS #8 exact-head simulator CI run `39343592728` PASS, verifying Site pin `8a509f6476a05b4bff1638804249520764a32593`; all three candidate repositories now have green hosted candidate checks, while runtime staging/production acceptance remains open.
- iOS #8 both exact-head workflows now PASS: push run `39343592728`, PR run `39343597375`; both verify the exact Site pin and simulator build.

| Site selected-strategy disclosure | Site PR #13 `bee23b463059a1eb29b87d60a4249b042b6840d1` warns when server strategy ranks are omitted and local basic ordering is used; unit regression added. | Local production check PASS: typecheck, E2E typecheck, lint, 124/124 unit, production build, bundle gate, 12/12 Playwright across Chromium/Firefox/WebKit; hosted runs `39344153506` and `39344159547` PASS, `39344159557` pending at last check. API fixture only. | PARTIAL | Confirm final exact-head hosted CI; test with staging API ranked and unranked route responses |
| iOS pin updated to Site candidate | iOS PR #8 `b1c64a0ded8fb5f35e0bbde2d9f831a7011153e2` pins Site `bee23b463059a1eb29b87d60a4249b042b6840d1`; workflow checks out/verifies exact SHA. | Local exact Site build, Capacitor sync, unsigned generic Simulator compile PASS; hosted runs `39344238870` and `39344243262` pending at last check. | PARTIAL | Confirm both hosted checks; then staging and physical-iPhone acceptance |
| Local Docker test dependencies | `docker ps` cannot reach configured daemon socket. Compose declares PostGIS `127.0.0.1:5434`, Redis `127.0.0.1:6380`, S3Mock `127.0.0.1:9090/9191`; runtime state unknown. | NOT_TESTED (no daemon connection) | Open Docker Desktop when local DB/storage integration testing is needed; inspect containers/volumes before any mutation |
| Docker runtime recheck (2026-10-21) | `docker context show` reports `desktop-linux`, but `docker ps -a` cannot connect to `/Users/dima1203/.docker/run/docker.sock`; no listeners were found on the declared local/staging data ports. Development `docker-compose.yml` parses successfully and defines PostGIS `17-3.5`, Redis `7.4-alpine`, S3Mock `5.2.2`; staging compose intentionally refuses to render without staging-only Postgres and Redis secrets. | NOT_TESTED; no running container inventory, local DB/Redis integration or staging secrets verified | When Docker is available, inventory exact container names, restart policies and volumes before starting any service; obtain staging secrets through the approved secret flow |
| Server GTFS source-branch equivalence | Frozen Lviv feed A/B across four OD/time-window cases: clean release PR #21 SHA `cbf17c2…` vs local `feature/transport-layer-availability` HEAD `182c77a…` plus 30 pre-existing dirty paths. Local branch median latency was lower in all four cases, but sets changed 100/100 IDs in every case; direct one-leg routes fell 14→0, 48→23, 22→0, 22→31, and one best route duration regressed 1,740→2,200 s. All searches remain truncated. Details in audit 32. | FAIL for branch equivalence; local unit/type/lint checks pass but branch cannot replace the release candidate | Keep PR #21 as reviewed baseline; isolate any useful local change on a same-base candidate and require Pareto/direct-route/transfer regressions plus repeated benchmark before adoption |

| Query-aware GTFS bounded retention | Server PR #17 `fe961d297b26e6ba1d63c3f409d20818aca1da75`: bounded retention excludes explicit forbidden/min-time failures and does not treat a shared parent station as proof of a traversable platform transfer; identical events are deduplicated. | Focused GTFS 53/53; full Server tests 273 PASS / 0 FAIL / 3 opt-in integration SKIP; lint/typecheck/diff-check PASS locally (Node 25.4.0 vs required 24.21.0). Exact-head push/PR runs `39346782054` and `39346788256` both PASS. A/B against baseline on the same Lviv feed archive: identical ordered first 100 on two corridors, both truncated; median runtime ~3–4% higher in candidate, not a proven improvement. | PARTIAL | Measure broader feed-scale recall/latency/memory, then staging search acceptance |
| GTFS total-duration and transfer-wait bounds | Server PR #17 SHA `a4d9d765902426e4ae6108d94b008f3c52950836` clamps main, metro, and community-transit worker requests so transfer wait never exceeds the full or remaining journey horizon; metro/community sub-search now subtracts elapsed time from the total journey allowance. Before the fix, explicit short journey limits passed a four-hour max wait, violating the GTFS search validator. | Focused GTFS 54/54; full Server tests 274 PASS / 0 FAIL / 3 opt-in integration SKIP; lint, typecheck, diff-check PASS locally. Exact-head runs `39347569905` and `39347574593` PASS including audit, migrations, and Postgres/Redis integration. | PARTIAL | Add authenticated API acceptance for 30/60/120-minute limits; retain existing partial flags and staging gate |
| Synchronized candidate manifests | Server PR #17 `fe961d297b26e6ba1d63c3f409d20818aca1da75`; Site PR #13 `bee23b463059a1eb29b87d60a4249b042b6840d1`; iOS PR #8 `b1c64a0ded8fb5f35e0bbde2d9f831a7011153e2` pins that Site SHA. Root/docs manifests match and remain NOT_RELEASED. | Server exact-head push/PR runs `39346782054` and `39346788256` PASS; Site and iOS exact-head checks PASS. | PARTIAL | Stage compatible APIs/data and perform authorized smoke before any production action |
- Updated exact-head result: Site PR #13 all three hosted checks (`39344153506`, `39344159547`, `39344159557`) PASS on `bee23b463059a1eb29b87d60a4249b042b6840d1`; fixture E2E does not prove staging/API acceptance.
- Follow-up: iOS PR #8 push run `39344238870` and PR run `39344243262` both PASS on `b1c64a0ded8fb5f35e0bbde2d9f831a7011153e2`, verifying the exact Site pin. Physical-device and staging checks remain NOT_TESTED.
- Follow-up: Server PR #17 push workflow `39344416074` PASS on `65b686854c90b67ecd67e1eec190e38b47bf01ee`, including Postgres/Redis integration; paired pull-request workflow `39344420205` pending at last check.
- Final exact-head CI: Server PR #17 `39344416074` + `39344420205` PASS; Site PR #13 `39344153506` + `39344159547` + `39344159557` PASS; iOS PR #8 `39344238870` + `39344243262` PASS. PRs remain OPEN/UNMERGED; CI does not replace staging or production acceptance.
- Follow-up on Server PR #17: adversarial GTFS test exposed that the retention hint could prioritize a schedule-feasible but explicitly forbidden transfer. Corrected and pushed as `e7790aae2751d3f42c0312f7df0fb033687f714c`; focused GTFS 51/51, full suite 271 PASS / 0 FAIL / 3 opt-in SKIP, lint/typecheck/diff-check PASS. Exact-head push/PR hosted runs `39345259607` and `39345265402` both PASS; prior SHA CI does not cover this change.
- Follow-up: Server PR #17 exact-head push workflow `39345259607` and PR workflow `39345265402` both PASS on `e7790aae2751d3f42c0312f7df0fb033687f714c`, including dependency audit, lint, typecheck, unit tests, clean DB migrations, and Postgres/Redis integration. PR #17 remains OPEN; this is not staging or production acceptance.
- Follow-up: added a second adversarial regression for trip-specific `min_transfer_time`, where a hash-preferred connection has 480 seconds but the explicit rule requires 900 seconds. Retention now checks that minimum before prioritizing the connection. New exact head `594d0c2615050963aa59f360c7d27e13220c46e3`; focused GTFS 52/52, full Server tests 272 PASS / 0 FAIL / 3 opt-in SKIP, lint/typecheck/diff-check PASS. Hosted push/PR runs `39345554528` and `39345560552` both PASS; current Server CI is green on the exact candidate SHA.
- Follow-up: a shared parent station is not proof of a traversable platform connection. Bounded retention now requires exact stop identity for its positive hint; final feasibility still recognizes explicit in-seat transfers. Added a parent-station decoy regression. Server SHA at this checkpoint `18938db4e8d94fb48550bc19a080eaa5b19c108e`; focused GTFS 53/53 and full suite 273 PASS / 0 FAIL / 3 opt-in SKIP; lint, typecheck, diff-check PASS. Exact-head push/PR runs `39345864342` and `39345869591` both PASS.
- New fixed-feed A/B artifact: `docs/audit/20_GTFS_RETENTION_AB_2026-10-20.json`, feed SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; two Lviv corridors, three alternating timings. Baseline/candidate ordered first 100 results are identical in both queries, with truncation in both; candidate median time is ~3–4% higher, too small to claim a performance regression or gain. No real-feed route quality increase was observed.
- Follow-up: exact `(trip, stop, time)` retention events are now deduplicated and indexed by physical stop while parent IDs remain available for station-level transfer-rule matching. Server PR #17 SHA `fe961d297b26e6ba1d63c3f409d20818aca1da75`; local full suite 273 PASS / 0 FAIL / 3 opt-in SKIP, lint/typecheck PASS. Exact-head push/PR CI runs `39346782054` and `39346788256` both PASS.
- The frozen public Lviv static-feed A/B probe on `65b686854c90b67ecd67e1eec190e38b47bf01ee` did not show material improvement across the two tested corridors. Keep this optimization PARTIAL until a broader fixed-snapshot recall/latency/memory comparison demonstrates value.

| Final-candidate Lviv GTFS bounded-search A/B | Baseline Server `751d83aedadf9b46b48b3d7e8103475cc058ffff` vs candidate `1a3598cc270af0d353a2b22cda740f81daa0da73`; one frozen 1,057-stop/72-route/15,694-trip archive; four corridors, 30/90-minute windows, 3 alternating samples each. | Four of four queries had identical ordered top 100, best duration/fare and leg distributions. All remain `searchTruncated=true`; candidate ~2–8% slower in these small local samples. Artifact: `docs/audit/21_GTFS_RETENTION_AB_2026-10-20_FINAL_CANDIDATE.json`. | PARTIAL; not exhaustive and no measured live-feed recall gain | Establish broader diverse-feed recall/latency/memory baseline; retain partial-result disclosure |

| Local Docker dependencies, recheck | Development Compose configures PostGIS, Redis and S3Mock. The Docker daemon is unreachable at the configured socket. | NOT_TESTED; active container state unknown; no data or containers modified | Restore Docker Desktop availability, then inspect actual container/volume names before integration work |

| GTFS graph/search truncation source | Same fixed Lviv archive and north→Sykhiv query at baseline `751d83aedadf9b46b48b3d7e8103475cc058ffff` and candidate `1a3598cc270af0d353a2b22cda740f81daa0da73`: estimated 215,966 graph segments, 98,564 retained/materialized under 100,000 cap, 71/71 routes budget-limited, 804 interchange stops, 463,338 search steps, 1,634 pre-sample candidates. | Identical stage counts and returned route IDs; stop selection, graph, candidate sampling and queued-work truncation remain true; hard 1,000,000 step limit not reached. Details: `docs/audit/22_GTFS_SEARCH_STAGE_DIAGNOSTICS_2026-10-20.json`. | PARTIAL; current temporal-retention change does not improve this measured real-feed query | Test a relevance-weighted allocation/retention strategy with deterministic constrained-budget fixture; do not raise graph cap without isolated resource evidence |

| GTFS endpoint stop-pattern cap experiment | Temporarily changed extra stops per route pattern from 2 to 3 on the current Server candidate; four frozen Lviv corridors, with three alternating repetitions for north→railway station. Temporary source copy removed; no code/branch change. | REJECTED: in repeated north→station runs the best journey regressed 2,187s→2,323s and one/two-leg options decreased; all searches remained truncated. Full results: `docs/audit/23_GTFS_STOP_PATTERN_CAP_EXPERIMENT_2026-10-20.json`. | NOT_ACCEPTED | Preserve fastest/shortest feasible candidates while seeking additional route coverage; deterministic fixture and fixed-feed A/B required |

| Focused GTFS parser/worker/routing/RT/fare suite | Server candidate `1a3598cc270af0d353a2b22cda740f81daa0da73`; local Node 25.4.0 (project requires 24.21.0). | **73 PASS / 0 FAIL / 0 SKIP**; fixture-based unit tests only. | PASS for covered unit behaviors; API/DB integration remains NOT_TESTED locally | Run authenticated HTTP acceptance in hosted integration CI or when local Docker is available |

| Actual local development containers | Candidate `docker-compose.yml` defines PostGIS `db` on 5434, persistent Redis on 6380, and disposable `redis-cache` on 6381. `docker ps` cannot connect to the configured daemon socket. | NOT_TESTED; no container/volume mutation | Configured dependencies identified; runtime state unknown | Restore Docker Desktop and inspect actual runtime before running database/cache integration locally |

| Cross-repository candidate hosted checks | Refreshed heads: Server #17 `1a3598cc270af0d353a2b22cda740f81daa0da73`, Server #19 `c6e481dcab1c0bd520e40458b5387375b8c9a0b8`, Server #20 `c7948bd88c36e03c0a5d81ba7f4c49906e92bc5c`, combined Server #21 `cbf17c2ccf05d7a7e3126fa0caf74ef8049bc7a2`, Site #13 `7e704142bd6ad07ae544e78bd569fa29718ced62`, iOS #8 `fc603e5b07d818b9d9577355449a58d7b1e0cf1e`. | Server #19/#20/#21 exact checks PASS; PR #21 workflows `39356020667` and `39356033329` both PASS on the combined SHA. Site #13 exact checks (lint/typecheck/unit/build/bundle/browser acceptance/artifact) PASS; iOS #8 exact CI `39355771601` PASS, including checkout of Site `7e70414…`, Capacitor sync, and Simulator build. All PRs remain OPEN/unmerged. | PARTIAL; aligned review tuple is CI-verified but all PRs remain open/unmerged and staging is absent; release remains NOT_RELEASED | RC.5 manifests are aligned and exact-head CI is green. Resolve the external staging/read-only token gates, then execute staging deployment, migrations, rollback rehearsal and smoke acceptance; do not treat open PR CI as deployed production |

| Legacy release orchestration PR #5 | Exact head `f944560a3babf7423befc53741217d9281f44dab`; workflow attempts read-only clones of private Admin and Partner repos. | verify FAIL because `MARSHGO_REPOS_READ_TOKEN` is absent; Gitleaks and CodeQL checks PASS. | BLOCKED_EXTERNAL; required check not bypassed | Authorized repo owner must configure read-only Contents token in Actions secrets, then rerun exact-head checks |

| Authenticated GTFS HTTP fixture acceptance (Server PR #19) | Fixture API test and health-monitor isolation at exact SHA `9e90ad80dc3f6a5baed078a099183ad5eae8a35b`; temporary diagnostics removed in final head `c6e481dcab1c0bd520e40458b5387375b8c9a0b8`. | Both final exact-head push/PR workflows `39352613577` and `39352617918` PASS, including dependency audit, lint, typecheck, unit tests, migrations, and Postgres/Redis integration. Local post-cleanup lint/typecheck and unit suite 275 PASS / 0 FAIL / 3 opt-in SKIP. | PASS for deterministic fixture API acceptance; real-feed/staging acceptance remains PARTIAL | Continue real-provider and staging acceptance; retain NOT_RELEASED until all release gates are proven |

| Cross-repository PR dependency checks | Server #9→#10→#12→#14→#15→#17→#19; Site #9→#11→#12→#13; iOS #7→#8. Admin #1 and Partner #1 are also open candidates. | Every rechecked workflow for Server #9/#10/#12/#14/#15/#17/#19, Site #9/#11/#12/#13, iOS #7/#8, Admin #1, Partner #1 passes on its recorded candidate head. All remain OPEN; no shared deployed SHA tuple or staging smoke was confirmed. MarshGO #5 required verification fails without `MARSHGO_REPOS_READ_TOKEN`; Gitleaks/CodeQL pass. | PARTIAL; candidate CI green, but changes are not integrated/deployed | Review dependency bases and manifest; resolve the authorized read-only token blocker; verify reachable staging, migrations/rollback, and smoke tests; do not mark RELEASED |

| RC.4 exact source/build preparation | `RELEASE_MANIFEST.json` and `docs/RELEASE_MANIFEST.json` both pin Server `c6e481dcab1c0bd520e40458b5387375b8c9a0b8`, Site `bee23b463059a1eb29b87d60a4249b042b6840d1`, iOS `b1c64a0ded8fb5f35e0bbde2d9f831a7011153e2`, API v1, migration `055_provider_commercial_use`; status stays `NOT_RELEASED`. | JSON parse and production deployment contract tests 3/3 PASS. The updated tuple is not materialized, images are NOT_BUILT; disk ~5.1 GiB free and Docker daemon unavailable. GitHub environments/deployments/repo secrets are absent. | PARTIAL / BLOCKED_EXTERNAL for packaging and runtime validation | Restore Docker and safe disk capacity, resolve Actions read-only token, materialize exact pin tuple, then run staging acceptance and rollback rehearsal |

| Current local runtime services | Site preview process from `/private/tmp/MarshGO-Site-rendezvous-approach-20261020` listens on `127.0.0.1:3000` and `/journeys/search` returns HTTP 200. | No listeners on API `3002/4301`, PostGIS `5434`, Redis `6380/6381`, S3Mock `9090/9191`; Docker daemon unavailable. This is local UI-only access. | PARTIAL (Site preview only); full local stack NOT_RUNNING | Recheck Docker and named service/volume state before startup; do not count preview as staging or API acceptance |

| Cross-provider GTFS candidate cap | Server PR #17 code path previously sorted all scheduled options by arrival and truncated at 100 before strategy ranking. PR #20 (`codex/gtfs-query-directed-stop-budget-20261020`) adds bounded objective retention for fastest, known-cheapest, low-transfer, low-walking and balanced options. | Exact PR SHA `c7948bd88c36e03c0a5d81ba7f4c49906e92bc5c`; regression keeps a deliberately last-arriving cheapest option; focused tests 73/73, full Server unit 275 PASS / 0 FAIL / 3 opt-in SKIP, typecheck/lint PASS. Hosted workflow `39355083958` PASS including migrations and PostgreSQL/Redis integration. Local Node 25.4.0 vs required 24.21.0. | INTEGRATION_VERIFIED for this targeted candidate-cap behavior; PR OPEN/unmerged, no live feed/staging | Continue real-feed/staging acceptance; retain release `NOT_RELEASED` |


| RC.5 synchronized review tuple | Server #21 `cbf17c2ccf05d7a7e3126fa0caf74ef8049bc7a2`; Site #13 `7e704142bd6ad07ae544e78bd569fa29718ced62`; iOS #8 `fc603e5b07d818b9d9577355449a58d7b1e0cf1e` pinning the exact Site SHA; Admin #1 and Partner #1 remain pinned to their existing P0 PR heads. Root and docs manifests are byte-identical; API v1, migration 055. | Server exact workflows `39356020667`, `39356033329`; Site `39355497894`, `39355501509`, `39355501591`; iOS `39355771601`, `39355775363` all PASS. All component PRs remain OPEN/unmerged. | PARTIAL; aligned source candidate only, `NOT_RELEASED`; no staging/deployed SHA, live feed acceptance, physical iPhone, or rollback rehearsal | Obtain a verified staging environment and authorized private-repo read token; deploy only after explicit owner gate, run migration/backup/rollback and smoke acceptance, then record exact deployed SHA |


### Selected-leg map correction and iOS pin — 2026-10-20, latest exact heads

| Requirement | Implementation and evidence | Status | Next action |
|---|---|---|---|
| Focus selected journey leg without drawing unrelated journey legs | Site PR #13 `0a773f55f512fd14a57600d6817f7e938cf10886`; local production check, 124 unit tests, 12/12 browser E2E, focused map 4/4 and selected-line overlay 1/1 passed. Tests use deterministic fixtures. Hosted Site runs `39356765911` and `39356769504` pass; `39356769512` was still running at checkpoint. | LOCAL PASS; HOSTED PARTIAL/PENDING | Confirm final browser acceptance run; live feed and staging remain NOT_TESTED. |
| Exact web revision embedded by iOS candidate | iOS PR #8 `68749c5ee1bbd59afb8e47584403795034b7c88b` checks out and asserts exact Site SHA `0a773f55f512fd14a57600d6817f7e938cf10886`. Exact-head simulator runs `39356792059` and `39356796291` were running at checkpoint. | HOSTED/PENDING | Confirm both simulator runs; physical iPhone GPS/background remains NOT_TESTED. |

These newer candidate SHAs do not replace the current release manifest pins until all exact-head workflows pass. Both PRs are review-only, open and unmerged; no staging or production deployment was performed.


### Selected-leg map and exact iOS Site pin — final CI refresh, 2026-10-20

| Requirement | Exact evidence | Status | Remaining gate |
|---|---|---|---|
| Selected segment map focus and transport overlay | Site PR #13 `0a773f55f512fd14a57600d6817f7e938cf10886`; exact runs `39356765911`, `39356769504`, `39356769512` PASS, including production build and browser acceptance. Local check: 124/124 unit tests, 12/12 browser scenarios, focused map 4/4 and selected-line overlay E2E 1/1. Fixture-driven only. | PASS for candidate behavior | Live feed/staging and visual acceptance on real tiles remain NOT_TESTED. |
| iOS bundle pinned to that Site | iOS PR #8 `68749c5ee1bbd59afb8e47584403795034b7c88b`; exact runs `39356792059`, `39356796291` PASS for revision assertion, Site build, Capacitor sync, Simulator compile. | PASS for candidate sync and simulator compile | Physical iPhone, signing, TestFlight, live API, GPS/background/push remain NOT_TESTED. |
| Release candidate tuple | Server #21 `cbf17c2ccf05d7a7e3126fa0caf74ef8049bc7a2`; Site #13 `0a773f55f512fd14a57600d6817f7e938cf10886`; iOS #8 `68749c5ee1bbd59afb8e47584403795034b7c88b` pins that Site; API v1, migration 055. Manifest copies byte-identical; deployment contract tests 3/3 PASS. | CANDIDATE VERIFIED; NOT_RELEASED | Open PRs, staging, live providers, backup/restore rehearsal, authorized production rollout, and deployed SHA verification remain outstanding. |


## Latest candidate refresh — 2026-10-20

| Requirement | Current implementation/evidence | Status | Next evidence/action |
|---|---|---|---|
| Exact Site PR #13 candidate | SHA `24916fe7336b47f9b159d8a941231d23de6c8452`; hosted checks `39358604261, 39358600018, 39358604294` pass; local production check passes 136 unit tests, typechecks, lint, build, bundle budget and 12/12 Chromium/Firefox/WebKit Playwright. Fixture-driven; no live API/staging. | PASS for candidate CI; PARTIAL overall | Authenticated staging acceptance with real Server/provider data |
| Exact iOS PR #8 Site synchronization | iOS SHA `01e59741e23edcc9c2396fa3c091e35d3e5454e6` pins exact Site `24916fe7336b47f9b159d8a941231d23de6c8452`; workflows `39358883740, 39358887742` pass revision check, web build, Capacitor sync and iOS Simulator compile. | PASS for simulator gate; NOT_TESTED physical device/signing | Physical iPhone permission/GPS/push acceptance and signed release validation |
| Synchronized review tuple | Server `cbf17c2ccf05d7a7e3126fa0caf74ef8049bc7a2`, Site `24916fe7336b47f9b159d8a941231d23de6c8452`, iOS `01e59741e23edcc9c2396fa3c091e35d3e5454e6`, API v1, migration 055_provider_commercial_use. PRs OPEN/UNMERGED. | NOT_RELEASED | Merge only through required review gates; stage, rehearse migration/rollback, then verify deployed SHA and HTTPS smoke |


| Requirement | Current implementation/evidence | Status | Next evidence/action |
|---|---|---|---|
| GTFS queue-pruning optimization | Isolated Node 24.21.0 experiment `f235ca91c75996bd2d5645642780ba7467a7574c`: 263 unit pass, 0 fail, 3 opt-in DB skips; typecheck/lint pass. Five same-feed corridor result hashes identical; all still truncated; single-pass median was 3.07s baseline vs 3.21s candidate. Full evidence in `docs/audit/29_GTFS_QUEUE_PRUNING_AB_2026-10-20.md`. | REJECTED / NOT MERGED (no demonstrated benefit) | If later profiling confirms queue iteration is material, repeat randomized multi-sample benchmark before proposing a patch |
| Server GTFS freshness + truncation + composed-route preference limits | Server PR #23 exact SHA `b4ae2312bdddebd2806d56731349e0f2e77e4152` contains PR #22's 90-second GTFS-RT freshness, honest sampled-search truncation, deterministic fixtures, the API regression filtering a two-transfer BUS → COMMUNITY → TRAM route under `maxTransfers=1`, and a fixture-independent authenticated API assertion that a known-price Community offer exposes BALANCED/FASTEST/CHEAPEST with rank 1. Local typecheck/lint/full suite: 276 PASS / 0 FAIL / 3 opt-in integration SKIP. Exact push run `39627479817` and PR run `39627488832` PASS, including migrations and PostgreSQL/Redis integration. | PASS for exact candidate CI / OPEN / NOT_MERGED | Continue exact-candidate route/data correctness; staging/live-provider behavior remains NOT_TESTED |
| Cross-repository review candidate tuple | Server PR #23 `b4ae2312bdddebd2806d56731349e0f2e77e4152` stacked on Server PR #22 `d66805cfd3223511f06b0d3d412ba1e244273a16`; Site PR #14 `3d4148664b9c68f1a1083ea979228d2078a1125e`; iOS PR #9 `8d195019fd6c6710f545e1ec6e5caf2f057627f2` pins Site #14. Exact Server push/PR integration CI and Site browser CI pass; iOS PR rollup is now CLEAN after successful rerun 2 of `39624491061` plus four same-SHA simulator pushes. All candidate PRs remain OPEN/UNMERGED. | REVIEW CANDIDATE / NOT_RELEASED / NOT_MERGED | Authenticated staging, live provider acceptance, physical iPhone, backup/restore and deployment gates remain required |
| Root production profile | Node 24.21.0 `npm run check:production`: typecheck, lint, 252 unit tests (0 failed, 1 opt-in API integration skipped), Vite build and bundle-size gate pass. | PASS local only / no live acceptance | Test live integrated Site+Server on staging; confirm deployment SHA and real services |
| Local Site map/navigation candidate | Dirty checkout `codex/sync-journey-mobility-ui` HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`; typecheck, lint, 98 unit tests, build, bundle budget (17 JS chunks ≤350 KB gzip) and diff-check pass. Browser E2E was not run on the dirty tree. | PASS local only / DIRTY / E2E NOT_TESTED | Preserve existing changes; run exact-head browser acceptance after they are consolidated onto an isolated Site candidate |
| Site dependency security patch | PR #14 SHA `3d4148664b9c68f1a1083ea979228d2078a1125e`, stacked on Site PR #13, updates lockfile to Vite 8.3.5; clean audit (0), typecheck, lint, 125 tests, build and bundle pass locally. Exact-head workflows `39623905771, 39623924192, 39623924195` pass; browser build acceptance **12/12** and immutable artifact SHA-256 `fb6003311c0642043980d93474012524f7461952ff1e3ea3c440069f8fc50a12`. | PASS isolated Site candidate / NOT MERGED / no live API | Keep PR #14 stacked on #13 pending review; stage with the integrated Server before release |
| iOS ↔ Site SHA synchronization | iOS PR #9 SHA `8d195019fd6c6710f545e1ec6e5caf2f057627f2` pins exact Site PR #14 SHA `3d4148664b9c68f1a1083ea979228d2078a1125e`. Same-SHA simulator push workflows `39625763494, 39625815295, 39625815376, 39625821051` and refreshed PR run `39624491061` attempt 2 passed exact revision check, Site build, Capacitor sync, and simulator compile. PR rollup `mergeStateStatus=CLEAN`. | PASS for candidate pin and simulator build / NOT_MERGED | Physical iPhone, signing/TestFlight, live API, GPS/background/push, and production deployment remain NOT_TESTED. Unsigned Release archive step is tag-only and was skipped |
| GTFS transfer-only graph overflow experiment | Exact PR #23 baseline `b4ae2312bdddebd2806d56731349e0f2e77e4152` vs isolated experiment `8a30211358da46243c15d8525d0d38f668bdca5c`, same frozen Lviv feed, Node 24.21.0, 3 repeats × 5 result-producing corridors. Experimental branch is slower by 4.7–13.1%, changes some candidates, adds no Pareto option on duration/transfers/walk; all searches remain truncated. | REJECTED / NOT MERGED | Keep current candidate. Continue algorithm investigation; full evidence `docs/audit/33_GTFS_TRANSFER_OVERFLOW_AB_2026-10-21.md` |
| Selected transit-line focus UI | Site PR #14 SHA `3d4148664b9c68f1a1083ea979228d2078a1125e`; full `check:production` PASS: 125 unit tests, build and bundle, 12/12 Chromium/Firefox/WebKit E2E. Select-bus E2E uses mock: hides nonselected journey legs, draws two direction lines, shows 4 fixture vehicles, emphasizes 3. Server PR #23 exact-head hosted CI validates matching against fixture provider data. | PASS for local/hosted candidate gates / LIVE PROVIDER NOT_TESTED | Repeat on authenticated staging with fresh Lviv VehiclePositions and both geometry directions; preserve honest fallback if unavailable |
| Mutual rideshare rendezvous map | Same Site PR #14; rendezvous map/freshness utilities **7/7 PASS**. Source obtains both positions, routed approaches and participant-relative identity under mutual consent. No dedicated browser E2E for full MeetingMapView/two-user session in this candidate; no physical-device GPS test. | PARTIAL / BROWSER END-TO-END NOT_TESTED / PHYSICAL NOT_TESTED | Add/run driver+passenger E2E and then staging two-device test; background GPS remains a separate iOS acceptance gate |
| Local integration containers | Root Compose config: PostGIS 17-3.5 (`db`), Redis 7.4 (`redis`), S3Mock 5.2.2. No restart policies are declared. Docker daemon connection failed after reboot report, so active container/policy state is unknown. | CONFIG VERIFIED / RUNTIME NOT_TESTED | Start Docker Desktop, inspect exact containers/volumes first, then run only named test suites against isolated local data |

## Paired rendezvous acceptance refresh — 2026-10-21

| Requirement | Evidence | Status | Remaining gate |
|---|---|---|---|
| Driver/passenger meeting map and location exchange | Site PR #14 new `e2e/rendezvous-meeting.spec.ts`, SHA `15a4d5207f35620e37fb43960327f4a6645ded5e`; two isolated browser sessions, each posts its GPS fix into a shared deterministic API fixture; both then poll and observe both live points and role-relative meeting cards. New test 3/3 Chromium/Firefox/WebKit. Full Site production check: 125 unit PASS, 15/15 E2E, typecheck/lint/build/bundle PASS. | PASS for local fixture browser acceptance; live API not tested | Hosted exact-head CI pending at checkpoint; run paired users against configured staging, exercise revocation/network loss and physical GPS on both devices |
| iOS candidate embeds tested Site commit | iOS PR #9 commit `57c3cc800b40c5468d10e2604f53ee272968f20a` updates workflow and README to exact Site SHA `15a4d5207f35620e37fb43960327f4a6645ded5e`. | Local pin/source alignment PASS; new exact-head simulator workflows pending at checkpoint | Confirm hosted Simulator build, then physical iPhone permissions/background/APNs and staging API |
| Review release candidate | Server #23 `b4ae2312bdddebd2806d56731349e0f2e77e4152`; Site #14 `15a4d5207f35620e37fb43960327f4a6645ded5e`; iOS #9 `57c3cc800b40c5468d10e2604f53ee272968f20a` pins that Site SHA; Admin `9dbf7db0a935498ac40c98b19bc36bce056d630d`; Partner `c639257a7f28aeda5b378a816038b01651146b83`. Component PRs remain open/unmerged. | REVIEW CANDIDATE / NOT_RELEASED | Staging URL/API/credentials, real feeds, token for root private-repo validation, device acceptance, backups/rollback, owner-authorized deployment |

| Paired rendezvous + iOS exact-head refresh | Site PR #14 SHA `15a4d5207f35620e37fb43960327f4a6645ded5e`: checks `39630678642`, `39630670846`, `39630678801` PASS, including 15/15 browser E2E and the new paired participant GPS fixture test. iOS PR #9 SHA `57c3cc800b40c5468d10e2604f53ee272968f20a` pins that exact Site SHA; simulator checks `39630732616`, `39630737999` PASS. | PASS for exact candidate CI; PRs OPEN/DRAFT, NOT_RELEASED | Staging with real Server/GPS, physical two-device permission/network/background behavior, provider feeds, deploy/recovery evidence |

| Requirement | Evidence | Status | Remaining gate |
|---|---|---|---|
| Startup asset failure recovery (Safari/PWA shell) | Site PR #14 `a3cd07f56edd2eb7a4f1c1ffba52e32787a1da29`; capture-phase handler catches non-bubbling script asset failures before React boot, displays manual retry without cache clearing or automatic reload. Exact regression scenario passed Chromium/Firefox/WebKit locally; full production check 125 unit + 18/18 E2E, typechecks/lint/build/bundle passed. | PASS local and hosted exact-head CI | Hosted exact-SHA checks, then Safari/iPhone physical acceptance and real deployed stale-asset behavior |
| iOS exact Site pin after startup recovery | iOS PR #9 `303e368952d35f0e97a4855901cb2ce8fd4b24db` pins Site SHA `a3cd07f56edd2eb7a4f1c1ffba52e32787a1da29`. | PASS hosted Simulator CI | Confirm exact-SHA simulator workflows; then physical device, signing, API, GPS/background and push |


## Exact-head update — Server PR #23, 2026-10-21

| Requirement | Evidence | Status | Remaining gate |
|---|---|---|---|
| BALANCED ranking keeps transfer-effort semantics during GTFS candidate pruning | Server `0d13b1b58bb1d8ba5fd2d93d14e344c7c8237521`; candidate sampler calls the shared scorer; direct-vs-two-transfer regression passes. Focused GTFS: 56/56; full server: 279 pass, 0 fail, 3 opt-in skips; lint/typecheck pass. | PASS locally | Validate behavior against the composed route pool and staging feed coverage. |
| Server exact-head candidate checks | Push run [39635832510](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39635832510), PR run [39635839030](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39635839030); both passed audit, lint, typecheck, test suite, migrations, Postgres/Redis integration. | PASS for candidate CI | PR remains open/unmerged; no staging/deployment proof. |
| Production deployment and live end-to-end acceptance | No verified staging origin, deployed SHA, live account credentials or production smoke evidence in this checkout. | BLOCKED_EXTERNAL / NOT_TESTED | Obtain environment access and owner-approved rollout after candidate review. |


| Mixed-mode BALANCED winner survives GTFS candidate cap | Server `1ab6034348a8e48adca0c46df472273054eb023f`; shared scorer context includes discovered carpool, micromobility, and community-transit choices; regression reproduces a shifted global winner and verifies retention. Focused GTFS 57/57, full Server 280 PASS / 0 FAIL / 3 opt-in SKIP, typecheck/lint PASS. Push CI `39636489795` PASS; PR CI `39636499906` also PASS, including migrations and Postgres/Redis integration. | PASS locally / hosted push; PR event PENDING | Preserve candidate-truncation disclosure; no staging or live-service evidence yet. |


| Lviv live vehicle positions and approach certainty | Read-only probe at ~16:40 UTC: VehiclePositions HTTP 200, 604 total, 503 fresh ≤90s, 0 with reported stop sequence; application decoder recheck parsed 602/602 positions with 501 fresh and 0 explicit stop-sequence fields; TripUpdates HTTP 200, 657 records, header ~18s old. One initial TripUpdates decode failure followed by a successful retry. Evidence: `docs/audit/35_LVIV_GTFS_RT_RECHECK_2026-10-21.md`. | PASS for this sampled feed response; approach/ETA NOT_PROVEN | Continue observing upstream integrity; no stop-progress highlight from missing protobuf defaults; verify exact route/trip/stop crosswalk in staging. |


| Mixed-mode candidate sampling exact-head gate | Server PR #23 SHA `7af472973d5d4f955ff89edc82b10e6d378c6ebe`; push run [39637115094](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39637115094) and PR run [39637125775](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39637125775) both PASS: audit, lint, typecheck, full tests, migrations, PostgreSQL/Redis integration. | PASS for exact CI; PR OPEN/DRAFT, mergeable | Still no staging/production verification. |

| Vehicle-to-stop approach highlighting from Lviv GTFS-RT | Live journey overlay uses fresh VehiclePositions plus static GTFS route/trip data. Lviv TripUpdates feed is already consumed by stop-arrival/search logic, but VehiclePositions in the 2026-10-21 sample omit both `currentStopSequence` and `startDate`; tripId-only joining cannot disambiguate repeated dated trips. | PARTIAL: fresh fleet markers and separate stop-arrival predictions; specific vehicle approach/ETA NOT_PROVEN | Keep map fleet muted unless exact progress evidence exists. Enable icon-specific approach only when the provider supplies a safe trip/date/progress crosswalk; validate on staging. |
| Local Docker runtime after reboot | `docker ps` cannot connect to `/Users/dima1203/.docker/run/docker.sock`. Root dev Compose declares PostGIS `db`, Redis, optional S3Mock and no restart policy; production Compose declares restart policies but is not evidence of an active deployment. | RUNTIME UNKNOWN / LOCAL DB INTEGRATION NOT_TESTED | Start Docker Desktop, then inspect named containers and volumes before running isolated integration tests. No container or volume changed in this check. |
| Fare-preserving GTFS cap change in integration chain | Server PR #20 and PR #21 affect the same three paths; their review diffs contain the same `selectGtfsCandidatesForCrossProviderSearch` change and objective-retention regression. PR #21 already carries the implementation; PR #20 is a sibling candidate and should not be applied a second time. | REPRESENTED IN PR #21; verify through the required bottom-up PR review/merge sequence | Keep PR #20 as a sibling reference; merge only the reviewed stack in dependency order. |
| Site result strategy display and missing-rank fallback | Exact Site PR #14 SHA `a3cd07f56edd2eb7a4f1c1ffba52e32787a1da29`: selected strategy flows into details; when server ranks are absent the local fallback is clearly described as approximate. Focused presentation/fallback tests 11/11; full gate 125/125 units, typechecks, lint, build/bundle and 18/18 Playwright across three engines. | PASS FOR EXACT CANDIDATE / FIXTURES; LIVE STAGING NOT_TESTED | Repeat on the integrated Server/Site tuple with authenticated staging data before deployment. |

| Requirement | Implementation | Evidence | Status |
|---|---|---|---|
| Selected transit line fleet shows fresh positions and only up to three verified approaches | Server PR #23 `5e838142df0689869f0637951668163bd80d3a6c`; Site PR #14 `9f5f2c8e834dce266e8facbf124416304fc6992a` | Server 289 unit PASS, typecheck/lint PASS; Site 125 unit and 18/18 browser PASS. Latest exact-head CI: Server 2/2 PASS; Site 3/3 PASS. | PARTIAL — fixtures/local verified; no live Lviv vehicle can be emphasized without the feed's missing trip start date/current stop sequence. |
| Arrival ETA is distinct from GPS and never inferred from departure-only updates | Server exact TripUpdate arrival parser and Site live-status text | Regression tests cover exact dated arrivals, stale/canceled/skipped/NO_DATA/UNSCHEDULED and departure-only updates; Site browser assertions distinguish prediction from observed GPS. Server exact-head CI 2/2 PASS. | PARTIAL — implementation verified locally; live fleet/source coverage remains incomplete. |
| iOS uses the exact Site candidate | iOS PR #9 `7e476748666ac8d2b42de2f661343bfa74c0eee1` pins Site `9f5f2c8e834dce266e8facbf124416304fc6992a` | Workflow asserts full SHA and compiles simulator; run `39640363802` PASS; PR run `39640352034` in progress. | NOT_TESTED on final exact tuple yet. |


| Requirement | Current evidence (2026-10-21 refresh) | Status | Remaining gate |
|---|---|---|---|
| Exact Server/Site/iOS review tuple | Server #23 `5e838142df0689869f0637951668163bd80d3a6c`: runs `39640110661`, `39640122969` PASS. Site #14 `9f5f2c8e834dce266e8facbf124416304fc6992a`: runs `39640274019`, `39640282814`, `39640282785` PASS. iOS #9 `7e476748666ac8d2b42de2f661343bfa74c0eee1` pins exact Site SHA; simulator runs `39640363802`, `39640352034` PASS. All three PRs OPEN/DRAFT, merge state CLEAN. | PASS for exact candidate CI; NOT_RELEASED | Review/merge stacked PRs in dependency order under normal repository policy; then staging acceptance. |
| iOS exact Site candidate simulator build | Full Site SHA assertion, clean install, production Site build, Capacitor sync, simulator compilation passed on both exact iOS runs. | PASS for unsigned simulator candidate; physical device NOT_TESTED | Validate permissions, deep links, real API, background GPS/APNs, signing and TestFlight on authorized devices/account. |
| Integrated staging and production deployment | No verified staging host/API origin/credentials/deployed SHA; no HTTPS smoke or operational backup/rollback rehearsal. | BLOCKED_EXTERNAL / NOT_RELEASED | Obtain staging access, run integrated and operational acceptance, prepare rollback, and obtain separate owner approval for production rollout. |


| iOS final exact-head PR workflow reconciliation | iOS PR #9 SHA `7e476748666ac8d2b42de2f661343bfa74c0eee1`, pin `9f5f2c8e834dce266e8facbf124416304fc6992a`: simulator runs `39640363802` and `39640352034` both terminal SUCCESS. | PASS for candidate simulator build | Physical iPhone, signing/TestFlight, live API, GPS background and APNs remain NOT_TESTED. |


| Admin production client build | Exact PR #1 SHA `9dbf7db0a935498ac40c98b19bc36bce056d630d`; `npm run test` 2/2, typecheck, lint, production build PASS. | PASS locally; hosted verify exists but is from 2026-10-14 | Live canonical Server, permissions, tenant isolation, operator ingestion and authenticated admin workflows NOT_TESTED. |
| Partner production client build | Exact PR #1 SHA `c639257a7f28aeda5b378a816038b01651146b83`; `npm run test` 3/3, typecheck, lint, production build PASS. | PASS locally; hosted verify exists but is from 2026-10-14 | Live canonical Server, organization membership, tenant isolation, onboarding approval and authenticated partner operations NOT_TESTED. |


| Integrated root dependency security and production gate | MarshGO PR #6 exact SHA `af5f0abd11396fd65c022648688d48fbb1c071a1`; Node 24.21.0; dependency audit 0 vulnerabilities; typecheck/lint/build/bundle PASS; 235 unit tests PASS, 1 opt-in local DB test SKIP; exact local checkout clean. | PASS locally for root candidate | Hosted umbrella verify still blocked on private Admin/Partner read-only checkout token; staging/live API and full cross-repository browser E2E remain NOT_TESTED. |
| Root local browser E2E infrastructure | Harness restricts its DB target to loopback `marshgo_e2e*`, creates the DB if missing, runs migrations and deletes only OTP challenge rows; Postgres 5434 and Docker daemon are currently unavailable. | NOT_TESTED; no mutation performed | Start isolated local services, confirm test DB ownership/state, then run E2E. Do not point at a live or unknown database. |


| Fresh Ukrainian transport feed probe | Root workspace read-only probe at `2026-10-21T18:05:12Z`; 43 records, 38 probed (31 healthy, 4 degraded, 3 offline), 5 skipped. Lviv static GTFS loaded, but both route cases hit search truncation; one returned 10, one zero. GBFS candidates failed Ukrainian coverage checks or were offline. | PARTIAL; exploratory only, NOT exact release Server or staging acceptance | Repeat exact tuple on staging; fix/prove route-search completeness and validate operator/coverage/licensing before enabling any source. |
| Current local service endpoint check | `127.0.0.1:3000`, API `127.0.0.1:3002`, Postgres `127.0.0.1:5434` all unreachable; Docker daemon unavailable. | NOT_RUNNING / NOT_TESTED | Obtain approved staging endpoint or start explicitly isolated local services after verifying container/data ownership. |
| Exact Server PR #23 Lviv search completeness | SHA `5e838142df0689869f0637951668163bd80d3a6c`; static GTFS (1,071 stops / 72 routes / 15,716 trips); north→Sykhiv found two scheduled bus A47→tram T08 routes, but `stopSelectionTruncated=1`, `candidateSamplingTruncated=1`, and `searchTruncated=true`. A/B with 900m production walk sheds and 1,800m diagnostic sheds (result limits 10/100) retained the same two routes and did not clear truncation. | PARTIAL; local exact-candidate snapshot only | Improve or validate bounded stop selection with frozen-feed regression comparisons; run the same query set through integrated staging before calling route search accepted. |
| Exact Server PR #23 repeated code gate | SHA 8889fce11cf78d2c29c8d0ca8cad8b567b0ef67b; hosted runs 39653279552 and 39653291171 PASS. Run 39653279552 passed dependency audit, lint, typecheck, full unit suite, DB migrations, and PostGIS 17-3.5/Redis 7.4 integration. Local Node 24.21.0: 290 PASS / 0 FAIL / 3 opt-in DB/Redis SKIP; dependency audit 0 vulnerabilities. | PASS for exact candidate CI; PR OPEN/DRAFT, unmerged | Live staging/API, provider acceptance, backup/restore, device and production smoke remain NOT_TESTED. |
| Lviv route stop-cap experiment | Frozen GTFS SHA-256 `bb4ac0ce…78164`; exact Server #23 source, cap 2/3/4; all return same four itinerary chains in ~0.60 s; stop/candidate truncation remains. | No cap change accepted; route completeness PARTIAL | Build time/direction-aware selection and compare across multiple frozen corridors before changing production policy. |
| Site incomplete-search status | Site PR #14 `01b32997ec3e6efaa8ac5f217de1e7ee502f4227`; local production gate 125/125 unit, typechecks/lint/build/bundle PASS, 18/18 Chromium/Firefox/WebKit PASS; exact hosted runs `39651835297`, `39651835499`, `39651826197` PASS. | PASS for candidate code/fixture E2E; PR OPEN/DRAFT | Staging/API acceptance, physical Safari, and production deployment NOT_TESTED. |
| iOS synchronized candidate | iOS PR #9 `9eee78dc7ea3ab9e1012ebe70cd04cfae6c6b3fd` pins exact Site `01b32997ec3e6efaa8ac5f217de1e7ee502f4227`; local Site build, Capacitor sync, unsigned simulator compile PASS; exact hosted simulator runs `39652059040`, `39652053125` PASS. | PASS for candidate simulator compilation; PR OPEN/DRAFT | Physical iPhone, signing/TestFlight, live API, APNs/background GPS and production release NOT_TESTED. |

| Site PR #14 final exact-head CI | SHA `01b32997ec3e6efaa8ac5f217de1e7ee502f4227`; hosted runs `39651835297`, `39651835499`, `39651826197` all SUCCESS. Local gate: 125/125 unit, app/E2E typecheck, lint, build, bundle budget, 18/18 Playwright across Chromium/Firefox/WebKit. | PASS for candidate code/fixture E2E; PR remains OPEN/DRAFT | Real staging/API acceptance, Safari on physical device, production deployment NOT_TESTED. |
| iOS PR #9 final exact-head simulator CI | SHA `9eee78dc7ea3ab9e1012ebe70cd04cfae6c6b3fd` pins exact Site `01b32997ec3e6efaa8ac5f217de1e7ee502f4227`; hosted simulator runs `39652059040`, `39652053125` both SUCCESS; local Site build, Capacitor sync, unsigned Simulator compile PASS. | PASS for candidate simulator compilation; PR remains OPEN/DRAFT | Physical iPhone, signing/TestFlight, live API, APNs/background GPS and production release NOT_TESTED. |

## Exact candidate refresh — 2026-10-21 18:40 UTC

| Requirement | Current implementation/evidence | Status | Remaining acceptance |
|---|---|---|---|
| Server candidate | PR #23 `8889fce11cf78d2c29c8d0ca8cad8b567b0ef67b`; exact runs `39653279552`, `39653291171` passed migration + PostgreSQL/PostGIS + Redis jobs. | PASS for hosted candidate CI; OPEN/DRAFT | Route search still reports truncation on saturated corridors; staging/live-source/API acceptance absent. |
| Site production UI candidate | PR #14 `4ea524853ab2a084a4b6e157496a468a7d33487f`; exact runs `39654240691`, `39654250519`, `39654250707` passed. Combined partial-search fixture passed 3/3 in Chromium/Firefox/WebKit. | PASS for candidate CI and fixture behavior; OPEN/DRAFT | Authenticated staging, real providers, route completeness and physical Safari remain unverified. |
| iOS synchronization | PR #9 `cacd3f068e3236411bdc6355b2ea7daf278f09bf` pins Site `4ea524853ab2a084a4b6e157496a468a7d33487f`; runs `39654279516`, `39654288840` passed simulator build. Local exact checkout/build/Capacitor sync/unsigned Simulator compile also succeeded; local Node was 26.7.0, while hosted CI checks required Node 24.21.0. | PASS for simulator candidate; OPEN/DRAFT | Physical device, signed build, live API, GPS backgrounding and APNs remain NOT_TESTED. |
| Production deployment | No GitHub deployment records/environment for the inspected Server/Site targets; no verified URL, deployed SHA, HTTPS smoke or rollback evidence. | BLOCKED_EXTERNAL / NOT_RELEASED | Owner/operator must provide staging and production target, secret configuration path, and authorized rollout process. |
| Production deployment template | `docker compose -f .release/compose.production.yml config --quiet` cannot resolve 15 required variables; GitHub Environments and Deployments APIs return zero for all six inspected repositories. | BLOCKED_EXTERNAL | Identify staging host/API domain and set required environment/secrets in the hosting secret manager; then validate Compose, migrate a disposable DB, run staging smoke and rehearse rollback. |

| Site startup fallback / first paint | Site PR #14 `9b708741c039daf6033585cb2d6be48a879715d9`: lazy production screen and startup shell; E2E delays production chunk and confirms shell paints. Local typechecks/lint/build/bundle, 125/125 units, 21/21 Chromium/Firefox/WebKit; hosted runs `39657271396`, `39657271232` PASS. | PASS for web chunk-loading fallback; PARTIAL for iOS cold start | Simulator UI appears after settling, but a 3–5 second white WebView was observed after native launch. Investigate WKWebView cold start; physical iPhone NOT_TESTED. |
| Exact iOS shared-Site pin | iOS PR #9 `c0676f5d12bb3548937f3192e90447c7399c5a35` pins Site `9b708741c039daf6033585cb2d6be48a879715d9`; hosted simulator run `39657367618` PASS; local unsigned simulator build and Capacitor sync succeeded. | PASS for pinned simulator build; NOT_TESTED for real device/API | Use real staging API origin and test on physical iPhone; bundled candidate manifest still has null Server/migration commits. |
| Multimodal GTFS search completeness | Server `8889fce11cf78d2c29c8d0ca8cad8b567b0ef67b`: hosted PostgreSQL/PostGIS + Redis CI PASS (`39653279552`, `39653291171`); five static Lviv queries show stop-selection truncation improved in four, but a 48-stop ceiling and candidate sampling still truncate results. | PARTIAL | Preserve incomplete-results reporting; establish deterministic recall against a less-bounded oracle before changing limits or claiming completeness. |

| Release Compose source integrity | Integration PR #6 commit `b2535369f4636f1f2bb63f96525f2a1b4f929f08`: requires a generated artifact; verifies manifest SHA pins, Compose digest, canonical exact checkout HEAD/remotes, generated input hashes, clean trees and matching contexts. Local Node 24.21 production gate PASS (241/0/1 skipped); regression tests 9/9 PASS; Security run `39658734706` PASS; CI run `39658734667` passed install/audit/lint/typecheck/tests/migration/Postgres integration/build/bundle, then failed only at the missing private checkout token. | PASS locally; PARTIAL hosted | Root PR still lacks the private repository read-only token required for complete materialization; Docker image build/browser E2E skipped; no deploy/staging validation. |


| Native cold-start first paint | iOS PR #9 `7df237845d8841a98a5c15082677ec4198728339` pins Site `c50ba344b7dfde9859826363fea119d95e2cc54e`; Capacitor Splash Screen holds launch until React shell first paint. Local iPhone 17 Simulator build/sync/install/launch PASS; 1s and 3s captures show welcome screen. Hosted iOS run `39659884926` SUCCESS; exact Site-pin verification, bundle/sync and simulator compile passed. | PARTIAL | Simulator confirms no visible blank WebView in this capture; physical iPhone, API sign-in/booking, background location and APNs remain NOT_TESTED. |
| Site exact candidate | Site `c50ba344b7dfde9859826363fea119d95e2cc54e`: local production gate PASS (125 unit, 21 Playwright across Chromium/Firefox/WebKit, typecheck/lint/build/bundle); hosted runs `39659459120`, `39659459087` SUCCESS. | PASS for fixture-backed web candidate checks | Fixture/browser tests are not live API, provider, staging or production acceptance. |

- **Latest repeat check:** after the same candidate SHA was pushed to the existing PR #9 branch, run `39660236409` completed SUCCESS (Site pin, dependency installation, bundled Site/Capacitor sync and Xcode compile all passed). The earlier exact-SHA simulator run `39659884926` is SUCCESS.


| GTFS bounded sampling preserves strategy winners | Server PR #24 commit `4df912bac31b0a097de761f7b25d7874bc14fab5`: local Node 24.21.0 focused 1/1 and full suite 291/0/3 opt-in skip; typecheck/lint/diff check PASS; hosted run `39661371958` pending. | PARTIAL | Three candidate winners are retained in the cap regression. Dense-feed route discovery remains incomplete and `searchTruncated=true`; no staging acceptance. |

- PR #24 is now two tests on exact head `c33651b1387e0d2b377216a0b88f6ae02cdbec32`; hosted run `39661572594` pending. The first run `39661371958` ran on the previous test-only commit, not the final PR head.

| Latest local browser acceptance after reboot | Exact Server `c33651b1387e0d2b377216a0b88f6ae02cdbec32`, Site `c50ba344b7dfde9859826363fea119d95e2cc54e`; 12/14 full Chromium tests passed before correcting two stale test assumptions. After correction, URL restore passed 1/1 default Chromium and route-map behavior passed 1/1 Firefox + 1/1 Chromium through compatibility projects. | PARTIAL | Full Chromium suite not rerun; strict Chromium visual gate is open because the already modified snapshot differs by 38,106 pixels (12%). No screenshot baseline changed. Local E2E only; staging/production remain BLOCKED_EXTERNAL. |

| Exact Server DB/Redis integration rerun | PR #24 SHA `c33651b1387e0d2b377216a0b88f6ae02cdbec32`; Node 24.21.0; PostGIS 17-3.5 + Redis 7.4; loopback `marshgo_e2e`; `npm run test:integration`: 30/30 PASS across journey, live-journey, booking/edit, Partner isolation, navigation, realtime, restart durability, and rate limiting. | PASS for local fixture-backed Server/API integration | Not live-provider or staging proof; dense GTFS route discovery still PARTIAL and production runtime remains unverified. |

| Corrected full local browser E2E | Exact Server/Site tuple above, Node 24.21.0, production PWA, loopback PostGIS/Redis and deterministic map/geocoder/OSRM fixtures. `npm run test:e2e`: 13/14 PASS. | PARTIAL; local acceptance only | One strict Chromium screenshot comparison fails at 12% against a pre-existing modified snapshot; no baseline overwritten. Full acceptance is open until its provenance/design is reviewed. Staging/live provider/physical device remain NOT_TESTED. |

| Server balanced GTFS overflow retention | PR #24 exact branch SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`; focused GTFS tests 61/61 PASS; full Server unit tests 293 PASS / 0 FAIL / 3 opt-in DB/Redis SKIP; typecheck/lint/diff check PASS. Hosted exact-head runs `39672268416` and `39672277029` PASS, including migration and Postgres/PostGIS + Redis integration. | PASS for exact-head code/CI | Approximate bounded sample; complete dense-feed route discovery remains PARTIAL with truncation disclosed. No staging or production proof. |
| Dense Lviv feed bounded-search performance | Exact Server PR #24 SHA above; current official static feed hash matches frozen snapshot. Six-corridor A/B of objective reservoir 100k vs 200k: 100k wins unchanged, 200k adds 32 and drops 33 route-name chains across bounded responses (net -1), median 4,348→6,000 ms, 4/6 hit one-million-step ceiling. Route-pattern 8→12 and graph-cap increases also failed to improve strategy winners or route breadth. | PARTIAL; diagnostic-only A/B uses Node 25.4.0 and results stay explicitly truncated | No limit expansion accepted. Continue query-directed dominance/label-search experiment with exhaustive-fixture oracle, then rerun frozen corridors using pinned Node 24.21.0. Production/staging performance remains NOT_TESTED. |

| Canonical route-map browser behavior follow-up | Exact materialized Server `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / Site `c50ba344b7dfde9859826363fea119d95e2cc54e`; isolated fixture-backed E2E, Chromium behavior project. Route selection, map focus, stop details, two-direction transit overlay, four fixture vehicles/three emphasized, alternate-result focus and return flow all passed 1/1. Strict screenshot comparison to clean-root snapshot differs by 121 pixels at one intermediate route marker. | PASS behavior / PARTIAL visual | Do not mark full visual acceptance until marker delta and approved screenshot provenance are reviewed. Local modified snapshots were preserved; no snapshot regeneration. |
| Three-browser responsive and map compatibility | `npm run test:browser-compat`, exact materialized Server `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / Site `c50ba344b7dfde9859826363fea119d95e2cc54e`; responsive production entrypoints at 320/390/440/768/1440/1920 px and route-map flow in Chromium/Firefox/WebKit; **6/6 PASS**. Local Node v26.7.0, deterministic fixtures, screenshot assertions skipped by named projects. | PASS for local cross-browser behavior / PARTIAL for visual acceptance | Repeat on pinned Node 24.21.0 candidate CI and separately complete strict screenshot review, physical iPhone Safari and staging acceptance. |
| Live GitHub release/deployment state | Rechecked PR heads and checks via GitHub CLI: Server #24 / Site #14 / iOS #9 OPEN and draft with SUCCESS exact-head checks; Admin #1 and Partner #1 OPEN, non-draft, each verify SUCCESS. GitHub deployment API returned 0 records for all five repos. | PASS for repository/deployment-record audit / BLOCKED for actual staging or production | PRs remain unmerged; zero GitHub deployments does not rule out external hosts. No verified deployed SHA, URL, staging credentials or rollback target. |
| Pinned-runtime responsive/map compatibility | Repeated `npm run test:browser-compat` with Node 24.21.0 on exact materialized Server `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / Site `c50ba344b7dfde9859826363fea119d95e2cc54e`; 6/6 Chromium/Firefox/WebKit tests pass, including six viewport widths and route-map flow. Deterministic local fixtures; screenshots are skipped in named projects. | PASS for pinned-runtime behavior | Strict visual gate, live providers/staging, physical iPhone and production still open. |
| Exact Server PostGIS/Redis integration | Server PR #24 branch `codex/gtfs-route-oracle-20261021`, HEAD `27ca486d66fa9b30b8559e4b1041ccca67f1d283`, Node 24.21.0, clean worktree: `npm run test:integration` 30/30 PASS / 0 FAIL / 0 SKIP across Journey schema, live-journey, booking/trip-edit/concurrency, Partner tenant isolation, navigation, Redis realtime across two API instances, API restart durability and Redis shared rate limit. | PASS for local loopback exact-candidate API/DB/Redis integration | Test-created data and deterministic providers only; no staging, commercial provider, or production acceptance. |
| Exact-candidate live transport probes | Server PR #24 SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`, Node 24.21.0: official Lviv static GTFS (1,071 stops/72 routes/15,716 trips) returned options for two daytime corridors, both marked truncated; country-filtered Zelectra GBFS returned 49 fresh, available Kyiv scooters. | PASS for observed source responses; route completeness and scooter return feasibility PARTIAL | GBFS has no stations, all per-vehicle return rules unknown, and plans do not prove MARSHGO quote/payment rights. No staging/provider contract or production acceptance. See audit 52. |
| Root current-worktree production gate | Branch `codex/production-finalization-20261014`, HEAD `f944560a3babf7423befc53741217d9281f44dab`, dirty/untracked files preserved, Node 24.21.0: `npm run check:production` exit 0; typecheck, lint, 252 unit pass/0 fail/1 opt-in DB skip, Vite production build and bundle budget (51 JS chunks ≤350 KB gzip) pass. | PASS for the present local working tree only | Dirty/uncommitted tree is not a reproducible release SHA; no staging/deployed artifact or HTTPS smoke. Do not deploy until exact clean candidate and external deployment gates exist. |
| Query-aware GTFS graph allocation experiment | Exact PR #24 baseline vs temporary endpoint-priority weighting on same static feed, six Lviv corridors, Node 24.21.0; experiment tests 67/67, 56 unique chains in both, all 6 searches truncated, 10,424 vs 10,329 ms. | REJECTED; exact candidate restored and baseline tests 66/66 pass | No change accepted because coverage did not increase; details in audit 53. Retain partial-search flag. |
| Strict route-map visual vs behavior | Exact Server/Site `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / `c50ba344b7dfde9859826363fea119d95e2cc54e`, Node 24.21.0. Strict Chromium screenshot failed at first light results image: 38,180 pixels (12%) against the uncommitted modified golden. Same full route-map behavior project with snapshots skipped: 1/1 PASS in 48.0 s. | PASS behavior / PARTIAL visual | Existing golden is modified and unapproved provenance; no snapshots changed. Need approved visual baseline for acceptance. Test containers stopped; volumes preserved. |
| GTFS chain-length budget experiments | Exact Server baseline `27ca486d66fa9b30b8559e4b1041ccca67f1d283`, same official static feed/six corridors/Node 24.21.0. Three temporary variants; focused GTFS tests passed 66/66 each. No variant put a three-leg route in returned top-20. Separate baseline instrumentation did find 169 valid three-leg candidates in the first corridor (slower and same minimum fare as two-leg options); other five searches did not reach the three-leg pass. One unbounded variant reached 1M steps; bounded per-pass was ~29% slower. All changes reverted. | REJECTED experiments; baseline preserved | No change accepted. Dense feed remains explicitly partial; bounded objective/top-k search must establish useful coverage across the corridors without excess work. Details in audit 53. |
| Latest GitHub CI gate and Docker state | Rechecked 2026-10-22: Server #24, Site #14, iOS #9, Admin #1, Partner #1 exact listed checks SUCCESS. MarshGO #6 root verify passed code/test/build gates then failed private Admin/Partner checkout due missing `MARSHGO_REPOS_READ_TOKEN`; materialized images and browser E2E skipped. Current `docker ps` is empty; test `marshgo-db-1`/`marshgo-redis-1` are stopped with restart policy `no`. | PARTIAL / BLOCKED_EXTERNAL | Need read-only Actions credential for private repo materialization; separately need stable staging origin/config/secrets, backup/rollback and final owner approval. No Docker data was deleted or restart policy changed. |

| Server GTFS per-chain objective search window | Exact Server worktree baseline `27ca486d66fa9b30b8559e4b1041ccca67f1d283`; fixed per-length bound 25,000 steps in working diff. Official Lviv static feed, six fixed corridors, pinned Node 24.21.0: 59 unique chains vs baseline 56; 10 three-leg alternatives vs 0 in baseline returned top-20; all six FASTEST/CHEAPEST/BALANCED winners unchanged; 7,970 ms vs 10,223 ms in final repeat. GTFS 61/61, full Server 293 PASS / 0 FAIL / 3 opt-in SKIP, typecheck/lint PASS. | PASS locally for bounded candidate behavior / PARTIAL for route completeness | Searches still truthfully report truncation and result limits. Working diff has not passed exact-head CI or been merged. Validate regression and PostGIS/Redis integration, then CI; no staging or production evidence. See audit 53. |

| Server PR #24 exact-head GTFS bounded search | `6bf44d9781b6493f35a67bd01f6e8e0a3c7fc863`, branch `codex/gtfs-route-oracle-20261021`: capped per-chain objective windows, dense three-leg regression, 6-corridor static-feed repeat. Local Node 24.21.0 unit 294 PASS / 0 FAIL / 3 opt-in SKIP; typecheck/lint PASS; isolated PostGIS 17-3.5 + Redis 7.4 `npm run test:integration` 30/30 PASS. | PASS local / HOSTED CI PENDING | Exact-head GitHub `verify` run `39683473969` pending at checkpoint; PR #24 remains OPEN/DRAFT. Search still reports truncation. No staging or production proof. |

| Exact-head Server PR #24 CI | SHA `6bf44d9781b6493f35a67bd01f6e8e0a3c7fc863`, GitHub run `39683473969`: dependency audit, ESLint, TypeScript, `npm test`, migrations, PostGIS/Redis integration all SUCCESS in 1m38s. | PASS for exact candidate CI | PR remains OPEN/DRAFT and stacked; no merge, staging, deployed SHA, or production smoke. Search completeness remains PARTIAL and flagged truncated. |

| Current seven-repository release inventory | 2026-10-22 read-only GitHub query: zero deployment records for all seven repositories. Server #21–#24 verify PASS; Site #11–#14 PASS; iOS #7–#9 simulator PASS; Admin #1 and Partner #1 PASS. Root PR #5/#6 verify fails at missing read-only `MARSHGO_REPOS_READ_TOKEN`. | Candidate CI PASS / integration BLOCKED | Multiple open stacked PRs; no merged exact release tuple, staging URL, deployed SHA or HTTPS smoke. Keep `NOT_RELEASED`. |
| Local Docker/container handling after integration | MarshGO dev Compose defines PostGIS, Redis, optional S3Mock. Existing persistent `marshgo-db-1`/`marshgo-redis-1` remain stopped and `restart=no`; test-only no-volume containers removed; no active container. | PASS for observed local lifecycle | Do not infer production services from Docker Compose. Preserve existing volumes and unrelated `pro_clickhouse_*` volumes. |

| Authenticated HTTP GTFS fixture response after exact Server candidate | Server PR #24 head `9b0228dd23fdd69d59287c16d413d2a541ec601d`: deterministic all-week test calendar; `/api/v1/journeys/search` checks scheduled bus/tram stop calls, stop-time order and valid intervals; isolated PostGIS/Redis integration 30/30 PASS; unit 294 PASS / 0 FAIL / 3 opt-in SKIP; typecheck/lint PASS; hosted Server CI runs `39684419675` and `39684425040` SUCCESS. | PASS for candidate API contract | Fixture-backed schedule only; no live production feed/staging evidence. Exact PR is open/draft and stacked; dense-feed results still disclose truncation. |

| Exact Site candidate production gate repeat | Clean Site SHA `c50ba344b7dfde9859826363fea119d95e2cc54e`, Node 24.21.0: `npm run check:production` PASS including typecheck, E2E typecheck, lint, 125/125 unit, production build, bundle check, and 21/21 Playwright across Chromium/Firefox/WebKit. | PASS for fixture-backed browser candidate | No live staging/API/provider or physical-device acceptance; strict visual approval and production deployment remain separate gates. |

| Admin and Partner local candidate gates | Admin `9dbf7db0a935498ac40c98b19bc36bce056d630d` and Partner `c639257a7f28aeda5b378a816038b01651146b83`, Node 24.21.0: typecheck, lint, build PASS; Admin unit 2/2 and Partner 3/3 PASS. Server suite separately passed Partner tenant isolation integration. | PASS for local client/component gates | Authenticated Admin/Partner browser scenarios against the shared Server, visual acceptance and staging are NOT_TESTED; umbrella CI still lacks private-repo read token. |

| Four-source production artifact build | Materialized exact Server/Site/Admin/Partner SHAs `9b0228d…`, `c50ba34…`, `9dbf7db…`, `c639257…`; canonical remotes/HEADs and generated-input allowlist verified. Production Compose config PASS with placeholder-only configuration; local `api`, `web`, `admin`, `partner` image builds PASS. No containers were started and no image was published. | PASS for local build artifact | No production secrets, runtime, HTTPS endpoint, live provider, backup/restore or deployed-SHA evidence; this is not staging/production acceptance. |

| Four-image loopback runtime smoke | Exact local images: clean DB migrations, API health/ready, Site/Admin/Partner Nginx shells, health proxy, unauthenticated refresh proxy returns expected HTTP 401. Disposable no-volume PostGIS/Redis/API/UI containers and network were removed. | PASS for container wiring | API used development test mode; no authenticated flow, production runtime config, live providers, staging, HTTPS or deployed-SHA acceptance. |

| Pinned Node 24 Lviv graph-slack replay | Server candidate `9b0228dd23fdd69d59287c16d413d2a541ec601d`; official static GTFS archive SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; exact query replay retained 98,418/100,000 segments, 100/100 returned, 33 route chains, 2,686 ms and explicit graph/search/result truncation. Temporary slack-fill prototype increased retained graph to 100,000 but reduced unique chains to 27 and changed all three selected outcomes; rejected and reverted. Restored Server suite 294 PASS / 0 FAIL / 3 opt-in SKIP; typecheck/lint PASS; clean exact candidate. | PASS for reproducible baseline and safe rollback / FAIL for prototype improvement | Dense-feed search remains partial. Fare was unknown in this direct parser-level replay; not a full planner/city-tariff or production result. See execution state and audit 53 for details. |

| Transfer-connection graph retention experiment | Server exact candidate `9b0228dd23fdd69d59287c16d413d2a541ec601d`; pinned Node 24.21.0; same official Lviv static feed/hash; six feed-coordinate OD pairs. Variant ranked transfer-only trip groups by temporally feasible predecessor/successor coverage. Baseline/variant unique route-chain counts: 57/57, 32/32, 27/27, 38/39, 37/37, 63/63; all three strategy winner IDs unchanged; 6/6 still truncated; aggregate 13,931 vs 16,083 ms. | FAIL (prototype rejected, reverted) | Small diversity gain did not justify ~15.5% slower search. Exact Server candidate remains clean. Need a bounded Pareto/label search proven against exhaustive tiny-feed oracle; truncation must remain visible. |

| GitHub deployment configuration | Read-only check across Server, Site, iOS, Admin, Partner, orchestration: no GitHub Environments and no repository Actions secrets configured. No secret values were read. Docker inventory has no active containers; local PostGIS/Redis are stopped with data volumes preserved. | BLOCKED_EXTERNAL for staging/deployment | Need a confirmed staging host/domain, API origin, and deploy pipeline credentials/config. This does not rule out an untracked external deployment. |

| Exhaustive two-transfer timetable oracle | Server PR #24 SHA `d6ea399d3c38987387eba0e1500115aa51687563`: finite BUS→TRAM→RAIL oracle plus direct option; exact feasible option set; urban/intercity buffers; no truncation in small graph; FASTEST/CHEAPEST/BALANCED winner parity. GTFS 63/63, Server unit 295 PASS / 0 FAIL / 3 opt-in SKIP, typecheck/lint PASS; hosted run `39687249653` SUCCESS including migration and Postgres/PostGIS/Redis integration. | PASS for this bounded fixture and exact-head Server CI | Does not establish dense-city graph completeness; real Lviv search remains PARTIAL/truncated. PR #24 remains OPEN/DRAFT and no staging/production acceptance exists. |

| Site PR #14 exact checkout repeat | SHA `c50ba344b7dfde9859826363fea119d95e2cc54e`, Node 24.21.0: typecheck, E2E typecheck, lint, 125/125 unit, production build, bundle budget, and 21/21 Playwright in Chromium/Firefox/WebKit all PASS. | PASS for local fixture/browser candidate | No API on port 3002; no authenticated integration, provider/live data, staging, physical iPhone/Safari, or HTTPS deployment evidence. |

| Cross-repository candidate CI recheck | Server PR #24 checks PASS on head `d6ea399d3c38987387eba0e1500115aa51687563` (runs `39687249653`, `39687257959`); Site PR #14 `c50ba344b7dfde9859826363fea119d95e2cc54e` checks PASS; iOS PR #9 `7df237845d8841a98a5c15082677ec4198728339` simulator checks PASS; Admin PR #1 `9dbf7db0a935498ac40c98b19bc36bce056d630d` and Partner PR #1 `c639257a7f28aeda5b378a816038b01651146b83` checks PASS. | PASS for separate candidate CI checks | All PRs remain open; the candidates are not one merged, deployed release tuple. MarshGO umbrella PR #6 `b2535369f4636f1f2bb63f96525f2a1b4f929f08` still fails at private Admin/Partner checkout due missing `MARSHGO_REPOS_READ_TOKEN`; CodeQL and Gitleaks pass. |

| Authenticated API GTFS strategy-rank propagation | Server PR #24 SHA `9f567960846e015d70c0c9274c4fe8fe45a3d944`: fixture-backed `/api/v1/journeys/search` asserts GTFS candidate has FASTEST/BALANCED rank and only receives CHEAPEST rank when fare is known. Full integration 30/30 PASS; unit 295/0/3 opt-in SKIP; typecheck/lint PASS; exact-head runs `39688315436` and `39688323193` SUCCESS. | PASS for fixture-backed authenticated API path and exact-head Server CI | Fixture acceptance is not live-feed or dense-feed completeness; Lviv search remains partial/truncated. No staging/production deployment. |

| Latest exact Server/Site production-interface marketplace E2E | Current Server PR #24 head `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c` + Site PR #14 `c50ba344b7dfde9859826363fea119d95e2cc54e`; loopback isolated PostGIS/Redis. Marketplace suite **9/9 PASS**: date/time state, twelve modes, onboarding/GPS opt-out, two-account booking/negotiation/chat, multi-rider driver route and GPS reroute, iPhone-sized navigation, denied-GPS recovery, URL restore and Journey Planner pricing/strategy. Exact Server CI runs `39689594787` and `39689590022` SUCCESS. | PASS for local exact-candidate integration behavior | Deterministic fixtures/test accounts; no live operators, staging, production or physical iPhone evidence. Host Node was 26.7.0 (repository pin 24.21.0). |
| Latest exact Server/Site responsive and route-map compatibility | Same current pair; **6/6 PASS** in Chromium, Firefox and WebKit. Home/Search checked at 320/390/440/768/1440/1920 px; route behavior covers strategy switching, segment focus, stop details, themes and fixture-backed transit overlays. | PASS for local cross-browser behavior / PARTIAL for visual baseline | Compatibility projects skip screenshot pixel assertions. Strict visual comparison remains PARTIAL pending approved baseline; no snapshot overwritten. |
| Manifest synchronization | Root and docs release manifests now pin Server `d128e9b…`, Site `c50ba3…`, iOS `7df2378…` (pins that Site), while status remains `NOT_RELEASED`. | PASS for declared review-candidate pins | PRs remain open/unmerged; not a merged release tuple or deployed artifact. |


| Exact candidate marketplace E2E, pinned runtime | Server `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c` + Site `c50ba344b7dfde9859826363fea119d95e2cc54e`, Node 24.21.0, isolated new PostGIS DB `marshgo_e2e_prodcheck_20261022`, all checked-in clean Server migrations through 055, local Redis 7.4; 9/9 PASS. | PASS for fixture-backed client/API scenarios | Live providers, staging, physical devices and deployed HTTPS smoke remain NOT_TESTED. |
| Exact candidate responsive/map compatibility, pinned runtime | Same exact Server/Site, Node 24.21.0; Chromium/Firefox/WebKit **6/6 PASS**, widths 320/390/440/768/1440/1920 px. | PASS for cross-browser behavior | Pixel snapshots skipped; strict visual gate remains PARTIAL. |

| Current exact Server PostGIS/Redis full integration | `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c`, Node 24.21.0; new loopback database `marshgo_e2e_serverinteg_20261022`; all checked-in migrations through 055 applied. Full `npm run test:integration`: 30/30 PASS, 0 FAIL, 0 SKIP. Covers Journey schema, live journey API, booking/trip edits, Partner tenant isolation, navigation, cross-instance realtime, restart durability and Redis rate limits. | PASS for local Server/API/DB/Redis integration | Isolated fixture data only; no staging, paid provider, hosted operations or production smoke. |

| Exact-pair marketplace suite with partial-search user warning | Server `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c` + Site `c50ba344b7dfde9859826363fea119d95e2cc54e`; Node 24.21.0, isolated PostGIS/Redis; full `e2e/marketplace.spec.ts` **10/10 PASS** (1m36s), including warning metadata injected into otherwise real local API response. Typecheck/lint PASS. | PASS for fixture/API marketplace and warning visibility scenarios | Does not improve dense-feed recall. No staging/live deployment or route-completeness proof; see audit 58. |

| Exact Server dense-feed route completeness replay | Current Server PR #24 `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c`; official Lviv static GTFS SHA-256 `bb4ac0ce…`; production parser/search on Node 24.21.0 at the city API's 6-hour horizon. Estimated demand 436,570 vs 100,000 graph budget; retained 98,452; returned 100 itineraries/35 route-name chains, `searchTruncated=true`, ~1.72s, ~697MB RSS in this single parser-level run. | FAIL for complete dense-feed coverage; PASS for honest truncation reporting | One static timetable replay, not p95/concurrency or live/staging. See audit 59; do not advertise exhaustive coverage. |
| Zero-transfer GTFS graph pruning candidate | Server commit `23224f2b524ca0f22e402d8b000e0f0228a75fe9`, PR #25 stacked on PR #24; only for `maximumTransfers=0`, graph includes selected origin→destination stop pairs. Frozen Lviv OD baseline/candidate IDs identical (0/0); exact multipath A/B at two transfers identical ID sets/flags in 6/6 OD. GTFS 63/63, unit 296/0/3 opt-in SKIP, typecheck/lint PASS, PostGIS/Redis integration 30/30 PASS; exact-head checks `39699959205` and `39699972727` PASS. | PASS local / PASS hosted candidate CI | Multipath truncation remains unchanged. PR #25 is open and stacked; no staging/production test. See audit 60. |

| Full orchestration E2E, exact candidate pair | Root `npm run test:e2e` on Server `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c` + Site `c50ba344b7dfde9859826363fea119d95e2cc54e`, isolated loopback PostGIS/Redis and deterministic map/geocoder/OSRM fixtures: **15 PASS / 1 FAIL**. Core flows include two-account booking/chat, driver GPS reroute, search restore, categories, denied GPS and rendezvous consent. | FAIL: strict `journey-results-dark.png` screenshot differs by 63,327 pixels (19%) | Do not rewrite baseline blindly. Expected image is a compact route summary/detail UI while actual screenshot is search-results list; reconcile approved design/production screen, then fix and rerun strict suite. No staging/live provider evidence. |
| Root production quality check after current changes | `npm run check:production`: typecheck, lint, unit, production build and bundle-size gate PASS; follow-up unit result **256 PASS / 0 FAIL / 1 opt-in integration SKIP**. | PASS for local code/build gate | The skipped test is not integration evidence. Separate Server PostGIS/Redis integration 30/30 PASS on candidate SHA; deployment/staging remain NOT_TESTED. |
| Current release/deployment gate | Candidate PRs remain open/unmerged; no confirmed staging origin, deploy configuration/secrets, deployed SHA, HTTPS smoke or rollback target. Root umbrella PR #6 lacks the private read-only `MARSHGO_REPOS_READ_TOKEN`. | BLOCKED / NOT_RELEASED | Resolve authorized staging/CI access; complete staging and operations acceptance, then require explicit owner approval for production rollout. |

| Canonical Site PR #14 complete production check | Clean Site checkout SHA `c50ba344b7dfde9859826363fea119d95e2cc54e`: `npm run check:production` on local Node 25.4.0 (repo pin 24.21.0); typechecks, lint, 125/125 unit, Vite build, 24-chunk bundle gate and **21/21** Playwright across Chromium/Firefox/WebKit PASS. Exact PR head is OPEN/DRAFT/CLEAN; GitHub runs `39659459087`, `39659443519`, `39659459120` PASS. | PASS for local/hosted candidate code gates | Local E2E intentionally has no API at :3002 and uses request/error fixtures; no authenticated staging API, live providers, pixel visual approval, physical Safari or deployed SHA. |
| Legacy root results UI vs canonical Site | Root screenshot E2E `e2e/journey-route-map.spec.ts` shows old `SearchResultsList` where expected modified golden depicts another compact results/route-summary treatment (19% pixel mismatch). Canonical Site entry uses `JourneyResultsPanel` and owns the current locked design contract. | Legacy check FAIL; not accepted as Site release result. Site pixel acceptance remains NOT_TESTED | Migrate/label root compatibility check and run strict screenshot review against the owner-locked Site references; do not replace snapshots based on a legacy mismatch. |

| Site GPS normalization change and full regression | Site PR #14 `d96ac454ecb733987d00897e564ba90ddbf8d864`: WebKit GPS optional NaN fields no longer invalidate good coordinates; microsecond timestamps normalized. `check:production` after patch: **126/126 unit**, 21/21 Chromium/Firefox/WebKit, typechecks, lint, prod build and 24-chunk budget all PASS locally; target GPS unit tests 3/3. Exact-head Site CI `39775707071`, `39775714476`, `39775714389` PASS. | PASS on Site candidate | Local Node 25.4.0 differs from pinned 24.21.0; hosted CI passes. No physical GPS or live API acceptance. |
| iOS WebView synchronized to Site d96 | iOS candidate `7e64b642319b45a1646a784d994d65d9b526ced6` pins Site `d96ac454ecb733987d00897e564ba90ddbf8d864`; local Capacitor sync, Xcode simulator build and launch on iPhone 16 Pro Max PASS. Screenshot confirms welcome content rendered. | PASS local simulator build; hosted exact-head CI pending at checkpoint | Build manifest has null Server SHA and migration version. Hosted runs `39776303109`, `39776311845` pending; physical device, API-auth, GPS/push and signed release NOT_TESTED. |

| Exact iOS PR #9 / Site PR #14 GPS pin — 2026-10-22 | iOS `7e64b642319b45a1646a784d994d65d9b526ced6` pins Site `d96ac454ecb733987d00897e564ba90ddbf8d864`; hosted simulator runs `39776303109`, `39776311845` SUCCESS. Site exact-head CI `39775707071`, `39775714476`, `39775714389` SUCCESS; local Site check 126/126 unit, build, budget and 21/21 Chromium/Firefox/WebKit PASS. | PASS for CI and local simulator candidate build | Separate OPEN/DRAFT PRs; no merge/deployment. Signed archive, physical iPhone, live API/GPS/background/push and visual approval NOT_TESTED. |
| Lviv public realtime-to-static exact matching sample | At `2026-10-22T12:14:19Z`: 612 decoded; 557 fresh <90s; 548 fresh exact trip+route matches; 0 matched records with stop progress. Sanitized evidence `docs/audit/61_LVIV_GTFS_RT_LIVE_MATCH_2026-10-22.md`. | PARTIAL: exact route match works for this single snapshot | Does not identify approach-to-boarding direction/ETA; no SLA/continued freshness or provider licensing acceptance. |
| Release candidate manifest `.15` | Server `d128e9b…`, Site `d96ac45…`, iOS `7e64b64…` pinning Site, API v1, migration 055; manifest asserts NOT_RELEASED and deployed SHA null. | PASS for candidate SHA bookkeeping | Not one merged tuple; staging, rollout approval, HTTPS smoke, rollback and backup/restore gates remain open. |

| Server PR #26 exact-head GPS boarding approach — 2026-10-22 | SHA `a1961324a2a46bd062231d35720fe349d39d9d76`: exact-head hosted Server CI `39777928826` / `39777958708` SUCCESS; npm audit/lint/typecheck/unit/clean migrations/PostGIS/Redis integration pass. Local 24/24 targeted tests, 296 unit PASS/0 FAIL/3 opt-in SKIP, 30/30 integration. | PASS for code, regression, and CI candidate evidence | OPEN/DRAFT stacked on #25/#24; no merge/staging/deployment. Live sample is not SLA; physical GPS and production smoke NOT_TESTED. |
| Review candidate `.16` exact SHA tuple | Server `a196132…`, Site `d96ac45…`, iOS `7e64b64…` pinning Site; API `v1`, migration 055. Root/docs manifests agree, deployed SHA null. | PASS for candidate bookkeeping | Not a merged/released/deployed tuple. |

| Site full production gate, exact SHA `d96ac454ecb733987d00897e564ba90ddbf8d864` | `npm run check:production`; 126 unit tests, production build, 24-chunk gzip budget, 21 Playwright cases across Chromium/Firefox/WebKit | PASS | API responses are fixture-controlled; no live staging/API/provider acceptance. |
| Root cross-repo browser suite against candidate Server/Site | 5 legacy DOM-selector/assertion failures, 1 interrupted booking flow; 6 tests did not run | FAIL | Align root orchestration E2E with canonical Site DOM and rerun; preserve assertions and semantics. |
| Staging and deployed production acceptance | No verified deployment origin, deployed SHA, live HTTPS smoke, rollback/backup drill | BLOCKED | Requires staging/deploy access/config and separately authorized production rollout. |
| Root cross-repo route E2E subset — Server PR #26 + Site PR #15 | Server `a1961324a2a46bd062231d35720fe349d39d9d76` + Site production dist built from `abae09078adea278e04bc9a4a8c86fd880de4b0d`; isolated PostGIS/Redis; contract-correct `routeGeometry` fixture; 4/4 PASS (time picker, segment focus/full overview, twelve modes, welcome/onboarding). | PASS for these fixture-backed browser scenarios | Not the full root suite; earlier full suite remains 15/16 due legacy screenshot mismatch. No staging/live-provider/deployed smoke. |
| Site PR #15 route-map browser smoke | Site `abae09078adea278e04bc9a4a8c86fd880de4b0d`, Playwright Chromium/Firefox/WebKit, loopback map fixture; 6/6 PASS including selected segment, full route overlay, transit vehicle markers and restore overview. | PASS for fixture-backed route UI in three browser engines | No real provider feed, owner-approved visual baseline, physical iPhone/Safari or staging API. |
| iOS PR #9 pin update | iOS `3ce07ce6be5a63709dc6c92643f03187372ccb9e` changes exact default CI Site revision to PR #15 SHA `abae09078adea278e04bc9a4a8c86fd880de4b0d`; YAML parse and `git diff --check` PASS; exact-head Simulator runs `39783538900` and `39783549914` SUCCESS. | PASS for exact Site checkout, PWA build, Capacitor sync, Xcode Simulator compile | PR open/draft. Device GPS/push/API, signed release, physical iPhone and deployment remain unverified. |

## Recheck — 2026-10-22, Site/iOS synchronized candidate

| Вимога | Реалізація / доказ | Статус |
|---|---|---|
| Site transport palette equals canonical modes | Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; local `check:production` passed; 6/6 focused map checks across Chromium/Firefox/WebKit; exact-head Site CI runs 39812990434, 39812990396, 39812983985 PASS | PASS for tested candidate |
| iOS packages exact reviewed Site | iOS `976ede9e8c61fcae7653d815a46c22a9a234ba7e` pins Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; local production web build, Capacitor sync, Xcode Simulator compile, install, launch and screenshot passed; manifest contains Server `a1961324a2a46bd062231d35720fe349d39d9d76`, API v1, migration 055 | PASS locally; hosted exact-head CI pending |
| iOS hosted exact-head build | GitHub runs 39813560229, 39813329879, 39813552470 | NOT_TESTED until jobs finish |
| Production deployment and real user acceptance | No verified staging/production origin or deployed SHA, live API acceptance, backup/restore/rollback drill or HTTPS smoke | BLOCKED_EXTERNAL / NOT_RELEASED |
| Full journey visual acceptance | Root full E2E previously 15/16; one legacy screenshot mismatch remains unaccepted | PARTIAL |

### Доповнення до перевірки — 2026-10-22

| Вимога | Новий доказ | Статус |
|---|---|---|
| iOS exact-head CI на оновленому Site SHA | Runs 39813552470, 39813560229, 39813329879 успішні для iOS `976ede9e8c61fcae7653d815a46c22a9a234ba7e` + Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6` | PASS |
| Вебсценарії з exact Server/Site tuple | 14/15 non-button-audit E2E passed; booking/chat/reverse marketplace, multi-rider reroute, denied GPS, route search reload, planner and rendezvous included | PARTIAL (one legacy-golden screenshot mismatch) |
| Візуальний baseline результатів | 54,604 px (16%) mismatch; inspected actual vs golden. Golden is older card-based view and canonical reference for this screen is not confirmed | BLOCKED / golden not overwritten |
| Повний button audit | Interrupted after 5.2m at 152 actions; 13 no-visible-effect labels recorded, final assertion not run | NOT_TESTED / incomplete |

### Button audit та deployment inventory — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Відсутність runtime помилок під час обходу production-екранів | `e2e/button-audit.spec.ts`: 152 controls clicked; 0 disallowed page/server errors; test PASS | PASS (runtime only) |
| Кожна дія має підтверджений очікуваний результат | 13 «без видимого ефекту» в евристиці; порівняння не враховує input value/focus/ARIA state; targeted assertions не виконані | PARTIAL |
| GitHub hosted deployment | Deployment API: 0 deployments у шести репозиторіях | BLOCKED / no target |
| Поточні E2E | 15/16 PASS, єдиний fail — legacy screenshot mismatch 54,604 px / 16%; golden залишено незміненим | PARTIAL |

### Server GTFS in-seat continuation regression — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| GTFS `transfer_type=4` між поїздками одного `route_id` не втрачається у пошуку | Server PR #27 commit `30fa1cfa52621e7ed4ca47ad61794711ac484e62`; новий regression test; GTFS suite 63/63, повний unit suite 296/296 (3 opt-in skips), typecheck/lint PASS на Node 24.19.0; exact-head CI runs 39817276374 і 39817284271 перевірили audit, lint, types, unit, migrations і Postgres/Redis integration | PASS для PR candidate |
| Release/deployment acceptance цього Server кандидата | PR #27 відкритий, не merged; немає deployed SHA, staging API smoke або зовнішнього production acceptance | NOT_RELEASED |

### Синхронізація iOS build manifest — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Точні Server/Site/iOS SHA в iOS bundle | iOS PR #11 `ec586d63e1c07a4807c8991b20c35d1193e0f73d`; локальний bundle manifest звірений з Server PR #27 `30fa1cfa52621e7ed4ca47ad61794711ac484e62`, Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6` та iOS SHA | PASS локально |
| Capacitor та Simulator | Зібраний точний Site bundle, Capacitor sync, Xcode Simulator build/install/launch/first render пройшли локально; hosted runs 39818386979 і 39818394871 успішні | PASS симулятор |
| iOS physical device, live API та deployed artifact | Лише loopback API у local build; немає physical iPhone acceptance, signed distribution чи deployed SHA | NOT_TESTED / NOT_RELEASED |

### Frozen Lviv query A/B — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Перевірити, що PR #27 не змінив bounded-search поведінку на контрольному Lviv OD | Server PR #26 vs #27 на одному snapshot/query: 100 results, 33 route chains, однакові FASTEST/CHEAPEST/BALANCED winner IDs, близько 2.7 s; обидва запускають `candidateGraphTruncated`, `searchTruncated`, `resultLimitReached` | PASS як regression A/B; completeness FAIL/PARTIAL |
| Повний Lviv multimodal recall | Пошук усе ще bounded/truncated; 100-result candidate set не доводить, що не пропущено швидші/дешевші/зручніші feasible маршрути | NOT_PASSED; вимагає нового timetable/Pareto алгоритму та oracle/A-B acceptance |

### Повторний exact-candidate E2E — інфраструктурно зірваний — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Повний browser E2E на Server PR #27 `30fa1cfa52621e7ed4ca47ad61794711ac484e62` і Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6` | `.last-run.json` має 15 failed IDs; збережені контексти включають три OTP 500 і PostGIS `ECONNREFUSED 127.0.0.1:5544`. Docker Desktop log: VM graceful-stop після `no space left on device`, далі IPC timeout. E2E інфраструктура перестала бути доступною під час прогону | FAIL/INCOMPLETE; не є продуктовим PASS і не підтверджує UI-дефект |
| Ізольоване PostGIS/Redis для повторного прогона | Docker CLI зависає; 5544/6381 не слухають; локальний PostgreSQL 5432 без PostGIS; Data volume має 2.3 GiB вільно | BLOCKED_LOCAL_INFRA; потрібне відновлення простору та Docker daemon |

- Повторний `docker desktop restart` не відновив Engine; status/restart CLI повернули timeout/помилку через завислі `com.docker.backend`/`com.docker.build` процеси. Повторний `df` показав 1.1 GiB вільного місця. Жоден процес примусово не завершувався, сховище не очищалося.
- GitHub exact-head recheck 2026-10-22: Server PR #27 2/2 CI PASS; Site PR #15 3/3 PASS; iOS PR #11 2/2 PASS. Усі відкриті/не злиті. Це не замінює повний integrated E2E, staging чи production smoke.

| Повторний exact 6-годинний A/B PR #26/#27 | Три повтори на frozen feed та однаковому query дали однакові 100/100 itinerary IDs між base/candidate, BUS А37→А23 winner (4,128 с, fare unknown), але `candidateGraphTruncated=true`, `searchTruncated=true`, `resultLimitReached=true`; debug: 436,570 estimated vs 98,452 retained, ~579 MB RSS в одному локальному запуску | PASS як repeatable regression parity; FAIL для повноти й production acceptance |
| Реальне production/staging середовище | GitHub Deployments API: 0; API/site loopback недоступні; production Compose має unresolved required settings для домену, SMS, Redis/session secrets і map manifests; staging env не містить origin/deploy config | BLOCKED_EXTERNAL / NOT_RELEASED |

### Повторна перевірка після відновлення Docker — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Локальний Server/PostGIS/Redis | Незакомічений Server checkout `feature/transport-layer-availability`, SHA `182c77ae4f78d576a287007d8d0864fb130f43f8`: integration 29/29, unit 224/0/1 opt-in skip, lint/typecheck PASS. PostgreSQL і Redis після пересоздання healthy; PostGIS є, збережена `marshgo` містить 85 таблиць | PASS локально; не є exact PR-head чи staging |
| Root production quality gate | `npm run check:production` на root `f944560a3babf7423befc53741217d9281f44dab`: typecheck, lint, unit, Vite production build, bundle gate PASS (51 chunks, кожен ≤350 KB gzip) | PASS локально; не є deployment |
| Admin exact checkout | SHA `9dbf7db0a935498ac40c98b19bc36bce056d630d`: typecheck/lint/build PASS, 2/2 UI role-state unit tests | PASS вузького UI gate; live RBAC/tenant scope NOT_TESTED |
| Partner exact checkout | SHA `c639257a7f28aeda5b378a816038b01651146b83`: typecheck/lint/build PASS, 3/3 membership-state unit tests | PASS вузького UI gate; live RBAC/tenant scope NOT_TESTED |
| Повний root E2E на Server PR #27 `30fa1cfa52621e7ed4ca47ad61794711ac484e62` і Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6` | Первинний run 15/16 мав застарілий screenshot contract. Після звірки з погодженими journey-results та route-map reference оновлено assertions/goldens; повторний run на Node 24.21.0 пройшов **16/16 за 8.3 хв**, включно з двоакаунтним booking/chat, GPS reroute/denial, search restore, Journey Planner, rendezvous і responsive viewport. Кнопковий audit клікнув 158 елементів, 13 евристичних «без видимого ефекту» сигналів лишились без окремих assertions; це не підтверджені дефекти. Fixtures/loopback API, не live providers/staging | PASS локального E2E на точних кандидатних SHA; зовнішнє приймання NOT_TESTED |
| Docker після відновлення | 11 stopped MarshGO containers видалені; Docker build cache/images очищені, базові PostGIS/Redis/S3Mock знову підняті; volumes збережені. Disk free 21 GiB проти 1.1 GiB; 50 GB ціль не досягнута | PASS для локальної інфраструктури; 50 GB cleanup incomplete |
| Production deployment | Candidate PRs лишаються відкритими/незлитими; немає staging/deployment origin, deployed SHA, HTTPS smoke, backup/rollback acceptance | NOT_RELEASED |
### Server PR #28 — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| GTFS stop-pair allocation | Base/candidate локальний Lviv replay повернув однакові 100 маршрутів; unit 296 PASS, exhaustive one-/two-transfer oracle PASS. Обидва варіанти все ще мають `searchTruncated=true` | PASS для регресійної рівності; `PARTIAL` для recall/full search |
| Server integration на БД та Redis | 30/30 PASS на локальних PostGIS/Redis; один live-feed dependent scenario переведений на deterministic fixture після такого самого FAIL на базовому SHA | PASS для інтеграційного сценарію; live-feed coverage окремо |
| Production API container packaging | Docker image build і runtime `/readyz` PASS (`database=connected`, `realtime=connected`) під development/test config; hosted exact-head CI runs `39834123575` та `39834145330` також PASS із image smoke | PASS для packaging/CI; production config/staging NOT_TESTED |
| Server dependency security | `npm audit --audit-level=high` = 0 vulnerabilities, production audit = 0; зафіксований ip-address dependency оновлений | PASS для поточного lockfile |
| Реальний release/deploy | PR #28 не злитий; немає staging/production URL, prod credentials, HTTPS smoke чи backup/rollback evidence | NOT_RELEASED |

### iOS simulator cold-start and Server pin update — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Capacitor bundle із точними кандидатними SHA | Simulator build з iOS app implementation `ec586d63e1c07a4807c8991b20c35d1193e0f73d`, Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, Server PR #28 `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`; workflow-only pin commit `1d1e9763ec99d7e77b22998c4212ce71a7fa924a` пройшов exact-head run `39839632165` (manifest verify + Xcode simulator build) | PASS hosted candidate build |
| Перший екран iOS | Xcode simulator build/install/launch успішні; теплий перезапуск показав welcome до 8 с і стабільний екран на 20 с. Перша холодна симуляторна зйомка потрапила на відкладений WebKit paint | PASS для прогрітого симулятора; холодний фізичний пристрій NOT_TESTED |
| Production API, походження міграції та iOS польові сценарії | Локальний API не слухав `localhost:3002`; міграція в повторному manifest лишилася `null`; немає physical-device, APNs/GPS background, TestFlight, staging чи deployed SHA | NOT_TESTED / NOT_RELEASED |

### Повний E2E Server PR #28 + Site PR #15 — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Повний production-interface browser flow на точних PR SHA | Node 24.21.0, Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, Server PR #28 `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`, окрема loopback PostGIS БД `marshgo_e2e_pr28_20261022`, Redis і deterministic fixtures; **16/16 PASS / 0 FAIL / 8.4 хв** | PASS для локального інтеграційного кандидата |
| UI, account-to-account booking/chat, map, driver/GPS, search restoration та rendezvous | 152-кнопковий runtime audit без page errors/5xx; map focus/overview, 12 категорій, двоакаунтний booking/negotiation/chat persistence, driver з двома пасажирами та GPS reroute, denied-GPS retry, URL restore, Journey Planner truncation warning, rendezvous consent/revocation | PASS у fixtures; 15 евристичних click-сигналів потребують точкових assertions |
| Live/staging/production acceptance та пошукова повнота | Зовнішні feeds/платежі/SMS не викликалися; локальний пошук ще віддає `searchTruncated=true`; немає підтверджених staging/production origin, deployed SHA, HTTPS smoke, backup/restore/rollback чи physical-device acceptance | NOT_TESTED / BLOCKED_EXTERNAL; `NOT_RELEASED` |

Подробиці та точна відтворювана конфігурація: [`68_EXACT_PR28_SITE15_FULL_E2E_2026-10-22.md`](audit/68_EXACT_PR28_SITE15_FULL_E2E_2026-10-22.md).

| Вимога | Доказ | Статус |
|---|---|---|
| GTFS edge materialization resource use | Два окремі baseline/candidate процеси на поточному локальному Lviv feed. Повторна пара: однаковий SHA-256 упорядкованих 100 itinerary IDs, RSS −8.38%, JS heap −22.39% для Server PR #28. Діагностичний другий прогін не мав frozen-feed SHA і не є benchmark | PASS лише як обмежений regression/memory signal; повторний frozen-feed acceptance NOT_TESTED |
| Повнота Львівського мультимодального пошуку | Baseline і PR #28 обидва повернули `searchTruncated=true` | FAIL/PARTIAL: не позначати як повний маршрутний пошук |

Деталі: [`69_PR28_CURRENT_LVIV_MEMORY_REPLAY_2026-10-22.md`](audit/69_PR28_CURRENT_LVIV_MEMORY_REPLAY_2026-10-22.md).

| Вимога | Доказ | Статус |
|---|---|---|
| Frozen-feed query parity для Server PR #28 | Точний GTFS ZIP SHA `bb4ac0ce…`; parent parser file перевірено за SHA проти parent Git blob; однаковий OD/time/max transfers. 100/100 ordered itinerary IDs збігаються; 34 chains; FASTEST/CHEAPEST/BALANCED candidate winners збігаються | PASS лише для зафіксованого bounded candidate set |
| Frozen-feed route completeness | Parent і PR #28 обидва мають `candidateGraphTruncated=true`, `searchTruncated=true`, `resultLimitReached=true` | FAIL/PARTIAL; пошук не повний |
| Frozen-feed resource comparison | Один окремий процес на варіант: 2,008→1,798 ms, heap −26.6%, RSS −11.7% | Діагностично; повтори/p95 і production concurrency NOT_TESTED |

Деталі: [`70_PR28_FROZEN_LVIV_REPLAY_2026-10-22.md`](audit/70_PR28_FROZEN_LVIV_REPLAY_2026-10-22.md).

### GTFS bounded-search retention prototype — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Здійсненний transfer-chain retention під тісним graph budget | Окремий тест із найменшим slack проходить; 69/69 GTFS tests і 297/297 server unit tests; lint/typecheck PASS | PASS лише як локальна алгоритмічна властивість |
| Multi-corridor A/B temporal retention | Node 24.21.0, 5 frozen Lviv corridors: всі 15 переможців FASTEST/CHEAPEST/BALANCED збігаються; route-chain count той самий у 4/5 та −1 в одному; усі пошуки truncated, всі тарифи 2 300 UAH fallback | NOT_TESTED як повнота/тарифний acceptance; евристику не прийнято |
| Інтеграційна схема Journey/PostGIS | Ізольована loopback test DB, 2/2 інтеграційні перевірки PASS | PASS для локальної схеми; live/staging NOT_TESTED |

Деталі й рішення: [`71_GTFS_TEMPORAL_RETENTION_EXPERIMENT_2026-10-22.md`](audit/71_GTFS_TEMPORAL_RETENTION_EXPERIMENT_2026-10-22.md).

### GTFS objective-search budget A/B — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Збільшення пошукового reservoir покращує результати трьох стратегій | П'ять frozen Lviv queries, Node 24.21.0: 15 переможців не змінилися; усі результати обрізані; усі вартості лишилися спільним 2 300 UAH fallback | FAIL як продуктивна зміна; 100k budget відхилено |
| Ресурсний профіль нового ліміту | Сумарний search time близько 12.6→17.3 с; максимальний RSS окремого запиту 1.14 GB | FAIL для promotion без іншого resource/quality балансу |

Деталі: [`72_GTFS_OBJECTIVE_RESERVOIR_AB_2026-10-22.md`](audit/72_GTFS_OBJECTIVE_RESERVOIR_AB_2026-10-22.md).

### GTFS candidate strategy sampling — 2026-10-22

| Вимога | Доказ | Статус |
|---|---|---|
| Sampling узгоджений з FASTEST/CHEAPEST/BALANCED production scorer-ами та shared provider context | Server `e21536d5f97e7876aae0a360ed3ff4126ba5c78c`; нова регресійна assertion; GTFS suite 63/63, full unit 296 PASS / 0 FAIL / 3 opt-in SKIP | PASS на local candidate |
| Server інтеграція після зміни selector | 30/30 integration PASS з loopback Postgres/PostGIS і Redis: bookings, journeys, partner tenant isolation, navigation, multi-instance realtime, restart, rate-limit | PASS локально; не staging |
| Dense Lviv search completeness | Frozen feed має 413,764 оцінені сегменти при graph bound 100,000; пошук лишається truncated | FAIL / невирішено |
| Exact-head hosted CI на commit e21536d | PR #29 verify workflow `IN_PROGRESS` на checkpoint | NOT_TESTED завершено |
| Staging, live provider, iPhone, production deploy | Відсутні environment/credentials/physical-device evidence | BLOCKED_EXTERNAL / NOT_TESTED |

Часові підвікна (3×10 хв) не прийняті: +кандидати, але близько 2.2× довше й усі підзапити обрізані. Див. [`audit/76_GTFS_STRATEGY_ALIGNED_SAMPLING_2026-10-22.md`](audit/76_GTFS_STRATEGY_ALIGNED_SAMPLING_2026-10-22.md).

### Release materialization / browser compatibility — 2026-10-23

| Вимога | Доказ | Статус |
|---|---|---|
| Production app static gates | root `npm run check:production`: typecheck/lint PASS, 256 unit PASS / 1 opt-in SKIP, production build і bundle budget PASS | PASS локально |
| Cross-browser production UI | release tuple Server `d83fa58` + Site `1d2aaa0`; Chromium 2/2, Firefox 2/2, WebKit 2/2 | PASS для локального production bundle |
| Safe release materialization | exact allowlisted generated modifications проходять; unrelated/staged/deletions лишаються заборонені; unit 5/5, lint/typecheck PASS | PASS локально; root fix uncommitted |
| Current Server candidate CI | PR #29 SHA `e21536d...`; CI runs `39852917615`, `39852909626` SUCCESS; local full unit + 30 integration PASS | PASS для Server candidate; PR OPEN/DRAFT |
| Browser acceptance exact Server #29 SHA | browser run був на manifest Server #28 SHA, не #29 | NOT_TESTED |
| Staging/production acceptance | немає staging origin/deploy access/HTTPS smoke | BLOCKED_EXTERNAL |

### Server PR #29 frozen-feed replay — 2026-10-23

| Вимога | Перевірена реалізація | Доказ | Статус |
|---|---|---|---|
| Малі feasible GTFS-ланцюги й три ranking winners | Server `e21536d5f97e7876aae0a360ed3ff4126ba5c78c` | `gtfs-timetable.test.ts` + `bounded-graph-budget.test.ts`: 68/68 PASS, включно з exhaustive one-/two-transfer oracle | PASS (fixture) |
| Повнота на frozen Lviv OD | Той самий Server SHA і GTFS snapshot від 22.10.2026 | Повернуто 100; estimated graph 413,764 проти bound 100,000; `searchTruncated=true`; audit 81 | FAIL / відомий blocker |
| Runtime ресурсів | Один parser-level локальний replay, Node 25.4 | ~2.1 с, ~680 MB peak RSS; не percentile/load result | NOT_TESTED для навантаження |
| Staging/production та live-provider acceptance | Немає підтвердженого target/origin і зовнішнього приймання | Release blockers і audit 78 | BLOCKED_EXTERNAL / NOT_TESTED |

Повний запис: [`audit/77_RELEASE_MATERIALIZATION_AND_BROWSER_COMPAT_2026-10-23.md`](audit/77_RELEASE_MATERIALIZATION_AND_BROWSER_COMPAT_2026-10-23.md).

| Вимога | Перевірена реалізація | Доказ | Статус |
|---|---|---|---|
| Повний production-web сценарний набір | Production routes на pinned Site + локальний Server candidate, loopback DB/Redis та контрольовані map/routing fixtures | [`78_CURRENT_RELEASE_ACCEPTANCE_2026-10-23.md`](audit/78_CURRENT_RELEASE_ACCEPTANCE_2026-10-23.md), Playwright 16/16 | PASS (fixture/local only) |
| Root production build/unit gate | Поточний dirty root worktree | `npm run check:production`: 256 unit PASS, 0 FAIL, 1 opt-in SKIP, lint/typecheck/build/bundle PASS | PASS (dirty tree, не release SHA) |
| Umbrella CI з private Admin/Partner materialization | Hosted workflow вимагає `MARSHGO_REPOS_READ_TOKEN` | Root PR #5 CI run `39854554389` | BLOCKED |
| Staging/production deploy, HTTPS smoke, rollback | Немає перевірених target credentials/origin | Audit 78, staging status NOT_CONFIGURED | NOT_TESTED |
| Immutable RC.20 production image packaging | Server/Site/Admin/Partner exact manifest tuple | [`79_EXACT_RC20_DOCKER_REPLAY_2026-10-23.md`](audit/79_EXACT_RC20_DOCKER_REPLAY_2026-10-23.md), Compose config/build PASS; Web `healthz`/SPA 3×HTTP 200 | PASS (local package only; API/staging NOT_TESTED) |
| Browser compatibility on declared runtime | Site `1d2aaa0`, Server `e21536d`, Node 24.21.0 | Audit 79, 6/6 across Chromium/Firefox/WebKit | PASS (fixture/local) |
| Root production gate on declared runtime | Dirty root working tree | Audit 79, 256 unit PASS / 0 FAIL / 1 opt-in SKIP; lint/typecheck/build/bundle PASS | PASS (not immutable source tree) |

### Canonical E2E and route endpoint swap — 2026-10-23

| Вимога | Доказ | Статус |
|---|---|---|
| Canonical `E2E_API_PORT` path | `E2E_API_PORT=3309 npm run test:e2e`, exact Server `e21536d…` + Site `1d2aaa0…`, isolated DB `marshgo_e2e_rc23_20261023`, 16/16 PASS за 8,5 хв; Node 26.7.0 | PASS (локальні fixtures; не Node 24/staging) |
| Геокодерний swap з коректними координатами | Новий focused E2E вибрав два mocked геокодерні місця, перемкнув і перевірив body `/api/v1/journeys/search`; 1/1 PASS | PASS (production browser flow) |
| Решта button-audit heuristic signals | 152 кліки дали 14 сигналів без видимого ефекту; точково ще не перевірені | NOT_TESTED як підтверджені дефекти |

### Server PR #29 — довгі прямі GTFS-сегменти — 2026-10-23

| Вимога | Доказ | Статус |
|---|---|---|
| Пункт призначення після >20 проміжних interchange-зупинок | `gtfs-timetable.test.ts`: regression fixture з 26 зупинками; exact GTFS suites 69/69 PASS | PASS (fixture) |
| Не сигналізувати про неповноту для зайвих ребер direct-only пошуку | `oversized single trips retain a useful exact direct segment...` з `maximumTransfers: 0` проходить; regression перевірена після виправлення false-positive | PASS (fixture) |
| Загальний Server локальний набір | SHA `648e481c9439633fd786613c457645c4c25753b7`; lint/typecheck PASS; `npm test`: 297 PASS / 0 FAIL / 3 opt-in SKIP | PASS локально; skips не є PASS |
| Frozen Lviv OD на зміненому алгоритмі | Snapshot 22.10.2026; 100 результатів, 58 trip chains, 37 route chains; `searchTruncated=true`, graph теж truncated | PASS як replay; FAIL для повноти пошуку |
| Exact-head hosted CI | PR #29 run `39863527878` на SHA `648e481...`: audit/lint/typecheck/unit/migrations/PostGIS+Redis integration/API image/smoke всі завершились успішно за 2m34s | PASS (hosted CI, не staging) |
| Production route map на новому Server SHA | `e2e/journey-route-map.spec.ts` 1/1 за 58.6 s; Server `648e481...`, Site `1d2aaa0...`, ізольована loopback DB | PASS (детермінований journey fixture; не live GTFS E2E) |
| Повний production browser E2E на новому Server SHA | `npm run test:e2e`: 17/17 PASS за 8.6 хв; Server `648e481...`, Site `1d2aaa0...`, isolated DB `marshgo_e2e_fullpr29_20261023`, API port 3311 | PASS (local browser/API fixtures; не staging/live providers) |
| Local Server/PostGIS/Redis integration на новому SHA | `npm run test:integration`: 30/30 PASS; ізольована БД `marshgo_e2e_pr29_integration_20261023`, API ports 3312/3313 | PASS (локальний integration профіль з fixtures; не production data/providers) |
| Staging/production та physical device | Немає підтвердженого target і acceptance | BLOCKED_EXTERNAL / NOT_TESTED |
| RC.21 exact iOS Server/Site pin | iOS PR #11 workflow commit `71f993ae342c440e6ea1343e0b1e40ad72f3e210` змінив stale Server `d83fa...` pin на `648e481...`, лишив Site `1d2aaa...`; exact-head run `39866649246` завершився SUCCESS: Site checkout, Capacitor sync, embedded manifest check і iOS Simulator build | PASS для CI Simulator build; physical-device tests NOT_TESTED |
| Точний RC.21 API image/runtime | Server `648e481...`, image `sha256:b4f32df4…`, окрема PostGIS/Redis пара, 52 міграції до `055`; `/healthz` 200, `/readyz` 200 з DB+Redis, два auth endpoints 401 без сесії | PASS для local production-mode runtime smoke з `.invalid` placeholders; не staging/production |
| Точний RC.21 Web image та Nginx API proxy | Site `1d2aaa0...`, image `sha256:fe815477…`; 5/5 HTTP route/proxy checks, exact API повертає 401 без сесії; Playwright root/search 390×844 і 1440×1000 4/4 HTTP 200, 0 JS errors, 0 local 5xx, без горизонтального overflow | PASS для local image wiring/responsive smoke; зовнішні ресурси заблоковані, OTP/map/live feed не перевірені |
| Точні RC.21 Admin/Partner images | Admin `9dbf7db…` image `sha256:5947cb12…`; Partner `c639257…` image `sha256:8465971c…`; кожен shell/proxy/ready 4/4 HTTP 200; browser 390×844 без JS errors/overflow; auth refresh без сесії — 401 | PASS для build/shell/proxy; role/organization operations NOT_TESTED |

### RC.21 exact source tuple — 2026-10-23

| Вимога | Доказ | Статус |
|---|---|---|
| Server exact-head checks | `648e481c9439633fd786613c457645c4c25753b7`; hosted CI `39863527878`; audit, lint, typecheck, unit, migrations, PostGIS/Redis integration, API image/smoke | PASS для candidate CI; не staging |
| Server local tests | Unit 297 PASS / 0 FAIL / 3 opt-in SKIP; GTFS suite 69/69; окрема PostGIS/Redis integration 30/30 | PASS для local fixtures |
| Site + Server browser workflows | Pinned Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; Server `648e481...`; browser E2E 17/17 | PASS для local fixture/API profile; не live-provider acceptance |
| Manifest consistency | RC.21: Server `648e481...`, Site `1d2aaa0...`, iOS workflow-pin `71f993a...`; Simulator embedded manifest checked against exact tuple | PASS для local/hosted candidate build, not release |
| Dense-feed completeness | Frozen Lviv search з 100 результатами лишається graph/search truncated | FAIL / product blocker |
| Staging, commercial integrations, HTTPS smoke, backup/restore/rollback, physical iPhone | Немає підтвердженого staging/deployment target і польових доказів | BLOCKED_EXTERNAL / NOT_TESTED |

Повний доказ: [`audit/82_LONG_DIRECT_GTFS_SEGMENT_2026-10-23.md`](audit/82_LONG_DIRECT_GTFS_SEGMENT_2026-10-23.md). Release залишається `NOT_RELEASED`.

### RC.21 iOS local first-paint і повторний exact-feed replay — 2026-10-23

| Вимога | Доказ | Статус |
|---|---|---|
| Локальна iOS production bundle + Capacitor sync + Simulator compile | iOS `71f993ae342c440e6ea1343e0b1e40ad72f3e210`, Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, Server `648e481c9439633fd786613c457645c4c25753b7`; `BUILD SUCCEEDED`; embedded manifest збігається | PASS для local simulator build |
| Перший запуск і показ інтерфейсу в Simulator | iPhone 18 Pro / iOS 27 Simulator встановив і запустив `ua.marshgo.app`; знімок через кілька секунд після splash показав український welcome/onboarding. Cold first frame спершу був splash під час WebKit paint | PASS для запуску та first visible screen; не функціональне iPhone acceptance |
| Live feed повнота на frozen Lviv | GTFS SHA `bb4ac0ce…78164`; estimated graph demand 415,997, retained 99,054/100,000; 100 результатів після 114,901 кроку; graph/candidate/search truncation flags true | FAIL / product blocker |
| Поточна наявність живого Львівського парку/оновлень | Два прямі probes обох `track.ua-gis.com/gtfs/lviv` GTFS-RT feeds: protobuf валідний; timestamps першого/повторного зрізів 6/16 та 5/3 с; відповіді 259/256 та 236/232 мс; кожен feed двічі мав 0 vehicles / 0 trip updates / 0 alerts | FAIL для live-vehicle acceptance на час двох probe-вікон; повторити під час підтвердженої роботи транспорту |
| Live static timetables у Львові, Стрию, Ужгороді | Production validator виконав GET/parse/static service checks: Lviv 1,071/72/15,716 stops/routes/trips; Stryi 295/34/1,061; Uzhhorod 217/18/2,376; усі ZIP/calendar/timezone/coordinate checks PASS. Для Stryi/Uzhhorod немає license field у каталозі; seeder не активує без нього | PASS для доступності й валідності розкладу; BLOCKED для підтвердження комерційного використання Стрия/Ужгорода |
| iOS фізичний пристрій, GPS дозволи, APNs, background location, TestFlight | Не виконувалися | NOT_TESTED |
| Реальний staging/production deployment | Повторний GitHub перевірочний зріз: 0 deployments і 0 environments у шести репозиторіях; кандидатні PR відкриті/не злиті; немає підтвердженого origin чи deployed SHA | BLOCKED_EXTERNAL / NOT_RELEASED |

Деталі replay, меж алгоритму та локального iOS візуального запуску: [`audit/82_LONG_DIRECT_GTFS_SEGMENT_2026-10-23.md`](audit/82_LONG_DIRECT_GTFS_SEGMENT_2026-10-23.md).

Повний запис: [`audit/82_LONG_DIRECT_GTFS_SEGMENT_2026-10-23.md`](audit/82_LONG_DIRECT_GTFS_SEGMENT_2026-10-23.md).

### Follow-up GTFS eligibility projection — 2026-10-23

| Вимога | Доказ | Статус |
|---|---|---|
| Єдине визначення календарної/RT eligibility в оцінці графа і побудові сегментів | Server `927226d9e7c06efd24d9ed63f731d144fd810d15`; shared `eligibleTripInstanceStopEvents()` | PASS локально |
| Server unit suite | `npm test`: 299 PASS, 0 FAIL, 3 opt-in integration SKIP | PASS локально; SKIP ≠ PASS |
| GTFS timetable suite | `66/66` PASS | PASS локально |
| TypeScript і lint | `npm run typecheck`, `npm run lint` | PASS локально |
| Frozen Lviv replay | GTFS SHA `bb4ac0ce…78164`; 100 результатів; digest `698e0e7538b5f0b9c0645ffdffd75be039ef921a2ebb79feb928237b29b6dd6f`; граф 415,997 попиту / 99,054 retained; 101,827 кроків; graph/search truncated | FAIL / відкритий дефект повноти |
| Exact-head GitHub CI | Server workflow run `39869223686` на SHA `927226d9e7c06efd24d9ed63f731d144fd810d15`; unit, migration, PostGIS/Redis integration, API image build/smoke | PASS |
| Повнота великого львівського графа | Відоме graph/search truncation лишилось; cap навмисно не змінений | FAIL / відкритий дефект |
| Production/staging release | PR #30 draft, не merged; staging/deployment не підтверджені | BLOCKED_EXTERNAL / NOT_RELEASED |

### Оновлення — незалежний exhaustive GTFS transfer oracle (2026-10-23)

| Вимога | Доказ | Статус |
|---|---|---|
| Повний перебір здійсненних одно-пересадкових маршрутів на малих контрольованих фідах | Server SHA `7e848e86f11382fa3ddd424481f53ad59e77f23d`, `tests/gtfs-timetable.test.ts`; pathway-only, station transfer rules, loop occurrence, type-4, RT skipped/canceled/delay | PASS локально, 72/72 GTFS/bounded-graph tests |
| Exact-head hosted validation цього тестового доповнення | GitHub Server CI runs `39870321680` і `39870325749` на SHA `7e848e86f11382fa3ddd424481f53ad59e77f23d`; audit, lint, typecheck, unit, migration, PostGIS/Redis integration, API image build/smoke | PASS в обох runs |
| Зміна production graph caps або алгоритму | Не змінено — лише тестовий oracle | NOT_APPLICABLE для цього checkpoint |
| Dense Lviv feed completeness | Exact-harness replay на Node 24.21.0 відтворив digest `698e0e7538b5f0b9c0645ffdffd75be039ef921a2ebb79feb928237b29b6dd6f`; `searchTruncated=true`, `candidateGraphTruncated=true` | FAIL / відкритий критичний дефект |
| Деплой на перевірений staging/production і HTTPS smoke | Підтвердженого origin/deployment немає | BLOCKED_EXTERNAL / NOT_RELEASED |

## Latest exact candidate tuple — 2026-10-22 23:26 UTC

| Gate | Exact evidence | Status | Remaining |
|---|---|---|---|
| Server PR #30 | `14b3abfa29baa90b84d4d0d9d61b51604dac7f1d`; test-only oracle/index diff; local GTFS 68/68, typecheck, ESLint, diff-check PASS; hosted runs [39871533762](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39871533762) and [39871538356](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39871538356) PASS: audit/lint/typecheck, 301 unit pass/0 fail/3 opt-in skip, migrations, PostGIS/Redis integration, production API image build/smoke. | PASS for exact-head CI; PR open/draft | A/B of the separate spatial-ranking prototype is recorded as REJECTED in audit 86; current candidate still truncates dense Lviv results. |
| iOS PR #11 | `ef8a290dfe6bb870389f104b229d69a3843801a9` pins Server `14b3abfa…` + Site `1d2aaa0…`; exact simulator runs [39871559946](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39871559946) and [39871565248](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39871565248) PASS: Site build, Capacitor sync, embedded manifest check, Simulator compile. | PASS for exact unsigned Simulator CI; PR open | Physical iPhone and interactive live service are NOT_TESTED. |
| Production deployment | No configured/verified HTTPS staging or production target, credentials, deployed SHA, rollback rehearsal. | BLOCKED_EXTERNAL / NOT_TESTED | Requires owner-controlled hosting/domain/API origin and deployment configuration. |
| Dense Lviv route completeness | Three frozen OD probes still report candidate graph/search truncation. | FAIL for complete results | Do not remove warning or claim complete results; implement only after exact oracle and frozen-corridor A/B. |

### Повторне приймання 2026-10-23 — робочі локальні сценарії

| Вимога | Фактичний доказ | Статус | Залишок |
|---|---|---|---|
| Production-web E2E на точних pinned Server/Site SHA | Повторний запуск без ручного порту: `npm run test:e2e`; Server `14b3abfa29baa90b84d4d0d9d61b51604dac7f1d`, Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, окрема loopback DB `marshgo_e2e_20261023_current`: автоматичний port fallback 3302→51839, міграції/build PASS, **17/17 PASS за 9,4 хв**. Button audit: 158 натискань, 14 евристичних сигналів без видимого ефекту, без runtime/HTTP-помилок | PASS локально; fixtures; Node 26.7.0 | Повторити на staging і фізичному Safari/iPhone; Node parity підтвердити на Server 24.21.0; класифікувати 14 евристичних сигналів |
| Повний маршрутний API з реальним Львівським GTFS | Точний Server `14b3abf…`, окрема БД `marshgo_e2e_livegtfs_20261023`, реальний `track.ua-gis.com/gtfs/lviv/static.zip`: HTTP 200, 1 А37, 28 зупинок, 65 хв, tariff estimate 23 грн; 3 ranking strategies, `providerErrors=[]` | PASS для одного live schedule HTTP query | `partialReasons` містить `candidate_generation_truncated` і `walking_routing_unavailable`; тариф не є підтвердженим квитком; потрібен повний search і walking router |
| Dense Lviv search completeness | Frozen multi-OD 3/3 мають `candidateGraphTruncated=true` і `searchTruncated=true`; live API answer також частковий | FAIL | Виправити bounded candidate graph через oracle-перевірену зміну; зберегти partial disclosure до PASS |
| Public transport live GPS | Перевірені львівські GTFS-RT джерела дали 0 vehicle positions і 0 trip updates під час probe | PARTIAL / live data empty | Не показувати рухомі автобусні піктограми без свіжих позицій; повторний probe у час руху |
| Verified staging/production | Немає підтверджених staging/production origin, deployed SHA, deploy secrets чи backup/rollback proof | BLOCKED_EXTERNAL / NOT_RELEASED | Потрібні host/domain/API origin/deploy access, config, smoke та rollback rehearsal |

### Свіжа read-only перевірка фідів — 2026-10-23

| Вимога | Фактичний доказ | Статус | Залишок |
|---|---|---|---|
| Доступність українських фідів | `npm run acceptance:transport-feeds`, 43 записи: 38 перевірено, 29 healthy / 6 degraded / 3 offline / 5 skipped | PASS лише для структурної доступності окремих джерел | Ліцензії, комерційні права, маршрутизація і реальна інтеграція оцінюються окремо |
| Львівський розклад | 1,071 зупинка / 72 маршрути / 15,716 рейсів / 426,685 stop_times | PASS для завантаження й парсингу фіда | Запити ранкового вікна залишилися truncated; повний маршрутний пошук FAIL |
| Live transport positions | Свіжий probe exact Server SHA `14b3abfa…` близько 00:42 UTC: Рівне 2 (19 с), Івано-Франківськ 8 (7 с), Ужгород 5 (3 с), Львів 0 (8 с); protobuf валідний у всіх чотирьох | PARTIAL / часовий зріз | TripUpdates відсутні; довести trip/route/direction crosswalk і відображення на карті; повторити в години руху |
| Мікромобільність в Україні | CityBikes: 815 мереж глобально, 0 українських; Zelectra candidate змішаний глобальний, Nextbike кандидат — Рига/404 | FAIL для цих кандидатів | Не вмикати ці URL як українське покриття; знайти авторизований локальний feed/operator |
| Пошук у Львові | Центр→вокзал 0 у ранньому вікні при `searchTruncated=true`; північ→Сихів 10, але також truncated | FAIL на повноту | Виправити graph/search truncation; зберегти UI partial warning |

Деталі: [`audit/89_TRANSPORT_FEED_RECHECK_2026-10-23.md`](audit/89_TRANSPORT_FEED_RECHECK_2026-10-23.md). Цей probe read-only і не є staging/production acceptance.

### PR #5 exact-head checks — 2026-10-23

| Gate | Доказ | Статус | Залишок |
|---|---|---|---|
| Security | CodeQL і Gitleaks завершилися SUCCESS на root SHA `39a182094c82f58d84b3dbabd4a18808569bd206` | PASS для цих сканів | Не доводить release build або runtime acceptance |
| До release materialization | Bun dependency audit, lint, typecheck, unit, DB migrations, PostGIS/Redis integration, build і bundle checks завершилися SUCCESS у [CI run 39879173733](https://github.com/dima1203oleg/MarshGO/actions/runs/39879173733) | PASS для виконаних кроків | Залежить від наступного приватного checkout кроку |
| Канонічна збірка Admin/Partner і наступні CI-кроки | CI зупинився на відсутньому Actions secret `MARSHGO_REPOS_READ_TOKEN`; матеріалізація й наступні image/browser E2E/WebKit кроки SKIPPED | BLOCKED_EXTERNAL / CI FAILURE | Власник GitHub має додати read-only Contents token для приватних Admin/Partner; обмеження не обходити |
| Local browser E2E | Pinned Site/Server fixture run, 17/17 PASS; вільний API loopback порт обрано автоматично | PASS локально | Не замінює CI release materialization або staging |
| Production map asset configuration | Root `.env` має порожній `VITE_MAP_STYLE_MANIFEST_URL`; Site `docs/PRODUCTION_MAP_SETUP.md` вимагає immutable/versioned styles/data manifest і перевірені права/attribution | BLOCKED_EXTERNAL / NOT_TESTED | Надати власний map-assets origin і дозволену конфігурацію для 2D/3D; satellite лишається окремим ліцензійним джерелом |

### GTFS-RT freshness checkpoint — 2026-10-23

| Вимога | Точний доказ | Статус | Залишок |
|---|---|---|---|
| Не вважати live vehicles свіжими лише через timestamp заголовка фіда | Server PR #31, commit `b65882584a3ad1e8dd7512d13176f52299cded51`; перевірка timestamp/координат на рівні кожної VehiclePosition; 3 нові deterministic tests; локально 304 PASS / 0 FAIL / 3 opt-in SKIP | PASS локально | Очікується hosted exact-head CI; runtime Node локально 25.4.0, CI перевіряє pin 24.21.0 |
| Реальний стан position freshness чотирьох міст | Read-only exact Server probe: Рівне 1/2 fresh, Івано-Франківськ 5/8, Ужгород 3/5, Львів 0; чотири результати `DEGRADED` | PASS як діагностика snapshot | Не доводить стабільну доступність, route/trip/direction crosswalk, мапу чи SLA |
| Exact-head GitHub CI | Server PR [#31](https://github.com/dima1203oleg/MarshGO-Server/pull/31), SHA `b65882584a3ad1e8dd7512d13176f52299cded51`; runs [39880073407](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39880073407) і [39880107952](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39880107952) | PASS | Два exact-head runs успішні; PR відкритий, стекований на PR #30, не злитий; це не staging acceptance |
| Деплой, карта та GPS acceptance у production | Немає підтверджених HTTPS origin / map manifest / deployed SHA | BLOCKED_EXTERNAL / NOT_TESTED | Потрібні власні hosting/map assets і зовнішній acceptance; загальний реліз — `NOT_RELEASED` |
| iOS CI pins exact Server freshness candidate with verified Site | iOS PR [#12](https://github.com/dima1203oleg/MarshGO-iOS/pull/12), commit `dec6a1c`; Server `b65882584a3ad1e8dd7512d13176f52299cded51`, Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; run [39880432963](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39880432963) | PASS | Exact-hosted Simulator build and embedded manifest passed; physical device/live API acceptance remains untested |
| Візуальне приймання карти в production-потоці результатів | Повторний route-segment browser run показав коректні картки/disclosure, але карта віддала «Карта недоступна»: manifest `127.0.0.1:3306/maps/v1.0.0/manifest.json` — `ERR_CONNECTION_REFUSED` | FAIL / BLOCKED_EXTERNAL | Надати валідний immutable map manifest/assets та повторити visual acceptance; не маскувати підкладку фейковою картою |
## Site dual-rendezvous route map — RC.25 — 2026-10-23

| Gate | Точний доказ | Статус | Що лишилось |
|---|---|---|---|
| Взаємний GPS у production route map | Site PR #15 commit `1d0f1fe`: карта використовує consent-gated Server `/rendezvous/:id/approaches`, показує обидві позиції й дві різні підходи, перевіряє свіжість (≤90 с), точність (≤100 м), route freshness (≤60 с), геометрію та кінцеві точки; втрата consent очищає overlay | PASS локально / fixture-backed | Live Server/staging/фізичний GPS acceptance NOT_TESTED |
| Автоматизована перевірка | Site hosted exact-head run [39881586340](https://github.com/dima1203oleg/MarshGO-Site/actions/runs/39881586340) on SHA `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`: dependency audit, lint, app/E2E typecheck, unit, production build, bundle, browser E2E **21/21 PASS**, immutable artifact ID `12471766907` SHA-256 `34c76d3e856b53c62b0033edf8ad180b6fa1970507b56506aeca11d773799976`; local unit 128/128, build and browser route+meeting 6/6 also pass | PASS for source/CI artifact and fixture E2E | Live provider, staging and physical-device acceptance remain untested |
| Окрема карта зустрічі | Production build + `rendezvous-meeting.spec.ts`: driver/passenger consented mutual GPS and approach views Chromium/Firefox/WebKit 3/3 PASS | PASS локально / fixture-backed | Не live device, SMS, network or production data |
| Синхронізація релізу | Site PR #15 `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`; Server PR #31 `b65882584a3ad1e8dd7512d13176f52299cded51`; iOS PR #12 `8904466a1fc9525733281f64f673b5a63d6f5a0d` pin-ить саме ці SHA; Site exact CI 21/21 PASS, iOS hosted Simulator runs 39881781598/39881785272 PASS | PASS для source pins/build CI | PR-и відкриті й стековані, не злиті; root umbrella PR #5 лишається заблокованим приватним Admin/Partner read token |
| Production deploy | Staging/deploy origin та HTTPS smoke не підтверджені; release manifest лишається `NOT_RELEASED` | BLOCKED_EXTERNAL / NOT_TESTED | Не заявляти production-ready; потрібен власницький staging/deploy config, live acceptance, rollback і окремий rollout approval |

## Exact Server/Site integrated local acceptance — 2026-10-23

| Вимога | Фактичний доказ | Статус | Залишок |
|---|---|---|---|
| Server exact candidate core | PR #31 SHA `b65882584a3ad1e8dd7512d13176f52299cded51`; typecheck/lint PASS, unit 304 PASS / 0 FAIL / 3 opt-in SKIP, 55/55 migrations, isolated PostGIS+Redis integration 30 PASS / 0 FAIL / 0 SKIP | PASS для локального кандидата | Повторити на pinned Node 24; hosted CI pass збережений окремо; staging/live-provider acceptance NOT_TESTED |
| Site exact candidate production checks | PR #15 SHA `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`; typecheck/E2E typecheck/lint, 128 unit, build, bundle budget PASS; 21/21 Chromium/Firefox/WebKit | PASS локально | Fixture-backed; production API/map assets/live data/physical Safari NOT_TESTED |
| Пасажир/водій/booking/chat/GPS/rendezvous cross-repo E2E | Точні Server/Site SHAs вище, нова loopback test DB + Redis і local map/geocoder/OSRM fixtures; після виправлення button-audit **17 PASS / 0 FAIL із 17 за 7,4 хв**. Booking, negotiation, persisted chat, GPS reroute, denied GPS, responsive, route segment focus і consent/revocation rendezvous пройшли | PASS локально для integrated fixture suite | 12 button-audit heuristics без візуальної зміни залишені як прикріплені follow-up, а не PASS/bug; fixture-backed, не live providers/staging/production |
| GTFS dense-feed completeness | Frozen feed: graph demand ≈415,997 vs 100,000 cap, 99,054 retained; 41/70 routes budget-limited, with 946 global slots unused due per-route trip groups. Search: 101,827 steps / 1,625 candidates; objective reservoirs saturate near 25,311 (2-leg) and 76,827 (3-leg). Lazy expansion and bounded-round prototypes both hit the 100,001-event cap; the latter yielded 0 paths and lost all 3 baseline winners. | FAIL; both production prototypes rejected | Not a raw search-step-cap issue. Keep truncation disclosure; implement destination-directed graph construction and sound diversity/retention with exhaustive oracle, frozen multi-OD recall, runtime and heap gates. Do not raise caps or wire rejected prototype. |
| Production/staging | HTTPS origin, deployed SHA, live SMS/provider acceptance, licensed map manifest, physical iPhone, backup/restore/rollback proof відсутні | BLOCKED_EXTERNAL / NOT_RELEASED | Надати staging/deploy середовище й необхідні доступи; після acceptance підготувати rollback, окремо підтвердити production rollout |

### Loopback runtime identity recheck — 2026-10-23

| Перевірка | Результат | Статус |
|---|---|---|
| Наявний preview/API `127.0.0.1:3000` / `:3302` | Web root і API `/healthz` — HTTP 200; image tags RC.20 | PASS лише для RC.20 smoke |
| Окремі API/web/Admin/Partner `127.0.0.1:3317–3320` | API `/healthz` і `/readyz`, усі web/admin/partner roots — HTTP 200; image tags RC.21 | PASS лише для RC.21 smoke |
| Ідентичність із RC.25 release pins | Docker image inventory має RC.20/RC.21, але не точні RC.25 Server/Site SHA; `:3000` лишається RC.20 | FAIL для exact-candidate runtime identity |
| Production origin | Loopback-only, deployed SHA/HTTPS не встановлені | NOT_TESTED / BLOCKED_EXTERNAL |
| GitHub current PR state | Server #31 exact SHA checks PASS; Site #15 exact SHA Verify/security PASS; iOS #12 exact SHA simulator checks PASS. Root #5 run `39879173733` failed at private Admin/Partner read-only access setup; image materialization and browser/WebKit steps skipped. All four PRs OPEN; root `UNSTABLE`. | PASS for listed checks / BLOCKED_EXTERNAL for root materialization | Provide configured read-only token secret for private checkouts; do not bypass repo access controls. |
| Exact Server container build | PR #31 SHA `b65882584a3ad1e8dd7512d13176f52299cded51`; `docker build --platform linux/arm64` PASS, Node 24.21.0 base; image digest `sha256:103f284e778091466438cb4ebf9ffef9f0a7634089c8713c72f64bafebe660ef` | PASS для build | Container runtime against isolated DB/Redis and healthcheck NOT_TESTED; no deploy |
### Follow-up gate: dense-feed GTFS completeness algorithm — 2026-10-23

| Крок | Прийнятний доказ | Поточний статус | Результат / наступна дія |
|---|---|---|---|
| Пошук без втрати здійсненних кандидатів у frozen Lviv feed | Три зафіксовані OD зберігають baseline переможців BALANCED/FASTEST/CHEAPEST і мають пояснену повноту | FAIL | Поточний граф обрізає ≈415,997 оцінених сегментів до бюджету 100,000; на 41/70 маршрутах budget-limited. Пошук насичує reservoirs, маючи ще роботу. |
| Новий алгоритм transfer correctness | Exhaustive oracle для календарів/exceptions, часу понад 24:00, timezone, transfer rules, pathways, платформ, realtime та type-4 in-seat; exact `transferDecision` лишається останнім gate | NOT_IMPLEMENTED | Незалежний review пропонує event-index і round-based Pareto frontier із повною ідентичністю рейсу/виклику. Виробничої реалізації немає. |
| Ресурсні межі та чесне обрізання | Обмежені runtime/heap/RSS, жодного вичерпання пам’яті, `searchTruncated=true` при незавершеному пошуку | NOT_TESTED | Spatial retention не покращив recall; lazy та bounded-round прототипи втратили всі три frozen-feed переможці. Відхилені прототипи не підключати. |
| Event-search prototype v2 | Exact Server base `b65882584a3ad1e8dd7512d13176f52299cded51`; GTFS 68/68, typecheck/lint PASS, але frozen Lviv replay OD1/OD2/OD3 повернув baseline-winner recall 0/3, 0/3, 0/3; 0/0/3 paths; 100,001 повторно врахованих boarding scans; до 1.8 GB heapTotal | FAIL; rejected | Причина — downstream stop-pair legs eagerly materialized before exact transfer check; exact source locations and counters in current execution checkpoint. Виправлений v3 лише на experiment branch. |
| Event-search prototype v3 | Sorted event index + exact shared transfer preflight; focused exhaustive fixtures and full GTFS 68/68, typecheck/lint pass | FAIL on frozen replay | Frozen results and failure mechanism are in the following row; no production wiring. |
| Event-search prototype v3 frozen gate | Full GTFS 68/68 + typecheck/lint PASS; three OD all reached 100,001 event scans; route-chain recall 0%/0%/3.125%; winner retention 0/3 each; runtime 6.63/7.61/5.45 s | FAIL; rejected | Exact preflight rejects too few events (2.6–2.7%); repeated per-label scans dominate. v4 experiment is limited to exact event-work deduplication while preserving predecessor path labels. |
| Повтор після інтеграції | Server typecheck/lint/unit + PostGIS/Redis integration; Site production E2E; exact cross-repo tuple; повторний frozen-feed replay | BLOCKED_BY_FAILING_ALGORITHM_GATE | Спершу потрібен новий ізольований алгоритмічний кандидат, який проходить exhaustive oracle, усі frozen OD і resource gates. |

### Актуалізація dense-feed gate — test-only event-label v2 — 2026-10-23

| Перевірка | Результат | Статус |
|---|---|---|
| Tiny-feed semantics / fare / transfer oracle | 72/72 GTFS, exact transfer-context parity, coordinate request adapter parity (IDs, time, duration, walking, fare, sample, 3 ranking winners), typecheck, ESLint, diff-check PASS | PASS тільки для перевірених fixture |
| Frozen Lviv A/B на тому самому ZIP і 3 OD | Baseline IDs recall 0/100 на кожному OD; FASTEST/CHEAPEST/BALANCED winners 0/3 на кожному; v2 уперся у 100,000 expanded labels; 5.3–5.6 с проти 1.6–2.7 с baseline | FAIL; v2 rejected |
| Причина відхилення | Test-only adapter не повторив production corridor/catchment, interchangeStopIds і mode/type graph filters, отже множини кандидатів різні | Невирішений кодовий дефект; production search не змінювався |
| Наступна алгоритмічна спроба | Спільний behavior-preserving candidate graph для baseline та test-only альтернативи, equality gate на fixtures, потім максимум один frozen replay | IN_PROGRESS; не production |
| Site route-map E2E self-contained | Site PR #16 exact commit `fdeaa48fca8d05cda49dc2890b900ad9d714236f`, base PR #15 `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`; Node 24.21.0 Chromium/Firefox/WebKit 3/3; hosted runs 39892782808/39892769215/39892782785 PASS | PASS для test infra/fixture; production licensed map NOT_TESTED |
| Updated iOS exact Site pin | iOS PR #12 code commit `ac29ac5803d9344063b48fac82bc3d1a9eff682a` pins Site PR #15 merge SHA `1e8ce1d42872f9234bf2968f924b7b4a27c10723` and Server PR #31 SHA `b65882584a3ad1e8dd7512d13176f52299cded51`; hosted run `39895633240` completed Site checkout, production bundle, Capacitor sync, embedded-manifest verification and Simulator compile — all PASS. Current doc-evidence PR head `b68be01275d4a170c76d44bbd34218a21a45a71a` also passed the same exact-head gates in run `39895800899` | PASS | No physical-device or staging evidence |
| Site browser-install timeout recovery | Exact Site PR #15 run `39894362294` reached every gate through bundle size; apt-based `playwright install --with-deps` consumed its 20-minute job limit while downloading WebKit GTK/GStreamer dependencies | FAIL on old run: timeout, browser E2E NOT_RUN | Stacked PR #17 SHA `5f5e864b2cd6bcecafb7da2388d690653c59b7b2` raises timeout to 45 minutes and caches Playwright browser binaries without altering coverage; regular CI run `39896314926` PASS; full Verify Site `39896314804` passed through cache restore and is installing browsers |

### Shared graph event-label A/B recheck — 2026-10-23

| Вимога | Доказ | Статус | Рішення |
|---|---|---|---|
| Порівнювати альтернативний GTFS пошук на тому самому production graph | Frozen feed SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; exact Server base `b65882584a3ad1e8dd7512d13176f52299cded51`; один graph snapshot на кожен OD. Observer parity, GTFS 72/72, typecheck/lint/diff-check PASS | PASS для експериментального вимірювання | Observer залишити лише для контрольованого test seam до окремого review; це не production-функція |
| Втримати чинні маршрути/переможців стратегій | Три OD: overlap top-100 IDs 0/100 на кожному; route-chain recall 0/30, 3/37, 1/26; strategy winners 0/9 | FAIL | Event-label traversal відхилено; production пошук не змінювати |
| Вкластися у межі пошуку й пам'яті | 100,000-label cap досягнуто на всіх OD; candidate 1.40–1.69 с; post-run heap 713–793 MB | FAIL | Не збільшувати caps. Нова модель має пройти exhaustive oracle, baseline recall і bounded runtime/heap/RSS |
| Перевірити release tuple після Site PR #16 | Site PR #15 head `1e8ce1d42872f9234bf2968f924b7b4a27c10723`; workflow 39894362297 PASS, Verify Site `39894362294` під час recheck іще інсталював браузери; iOS PR #12 досі pins старий Site SHA | IN_PROGRESS | Почекати завершення браузерного gate, тоді синхронізувати iOS pin і прогнати iOS exact-head CI |
| Production/staging acceptance | Доступний staging origin, credentials, licensed map manifest, live provider acceptance, deployed SHA, HTTPS smoke і rollback rehearsal не надані/не знайдені | BLOCKED_EXTERNAL / NOT_TESTED | Статус залишається `NOT_RELEASED`; після узгодженого коду підготувати конкретний preview і rollback, але без реального target production перевірити неможливо |

Деталі алгоритму: [`audit/92_GTFS_EVENT_LABEL_V2_REJECTED_2026-10-23.md`](audit/92_GTFS_EVENT_LABEL_V2_REJECTED_2026-10-23.md). Release залишається `NOT_RELEASED`.


### Site PR #17 exact-head browser acceptance progress — 2026-10-23

| Gate | Evidence | Status | Next action |
|---|---|---|---|
| Dependency audit, lint, application/E2E typecheck, unit, production build, bundle | Site PR #17 commit `5f5e864b2cd6bcecafb7da2388d690653c59b7b2`, workflow `39896314804` | PASS | Await browser acceptance |
| Playwright browsers available | Same exact-head run; cache restore and browser installation completed | PASS | E2E is running |
| Browser E2E on production build | Same exact-head run `39896314804` | IN_PROGRESS | Record conclusion after hosted job finishes |
| Immutable production build artifact | Same exact-head run `39896314804` | PENDING | Confirm upload after E2E passes |
| Deployment/staging acceptance | No accessible staging/deploy target or deployed SHA | BLOCKED_EXTERNAL / NOT_TESTED | Keep release `NOT_RELEASED` |


### Site PR #17 browser acceptance completed — 2026-10-23

| Gate | Evidence | Status | Boundary |
|---|---|---|---|
| Audit, lint, app/E2E typecheck, unit, production build, bundle | Verify Site run `39896314804`, merge SHA `4585ffd3b7d45f1c2ce8e2fd63fb6c3869d88293` | PASS | Exact integrated PR #17 + PR #15 candidate |
| Chromium / Firefox / WebKit browser acceptance | Same run; 21/21 passed (7 per browser) | PASS | CI local production build + fixtures; not a live-service smoke |
| Immutable Site build artifact | Artifact `12477326113`, 5,426,534 bytes, SHA-256 `411766d2dbc6259fad5ba5edbadd058d1d289dd344d37f41f54570bd2e54801c` | PASS | Retention to 2026-10-30; built from merge SHA above |
| Staging / production HTTPS smoke and deployed SHA | No accessible staging/deploy target or authorized rollout path | BLOCKED_EXTERNAL / NOT_TESTED | Release remains `NOT_RELEASED` |


### Локальний production-профіль і RC smoke — 2026-10-23

| Gate | Evidence | Status | Boundary |
|---|---|---|---|
| Workspace typecheck/lint/unit/build/bundle | `npm run check:production` на локальному незакоміченому дереві; 256/257 unit pass, 1 opt-in integration skipped; 51 JS chunks ≤350 KB gzip | PASS для локального дерева | Не точний релізний commit; skip не є PASS |
| RC21 API liveness/readiness | localhost:3317 `/healthz`=200 `ok`, `/readyz`=200 `ready` | PASS локально | Контейнерний smoke, не зовнішній staging |
| RC web/admin/partner HTTP | localhost:3318/3319/3320 root each HTTP 200; localhost:3000 current web preview HTTP 200 | PASS локально | HTTP surface only; auth/user journeys and public HTTPS not established |
| Production deployment | No verified HTTPS origin/deployed SHA/rollback exercise | BLOCKED_EXTERNAL / NOT_TESTED | Keep release `NOT_RELEASED` |


### Повний локальний PostGIS/Redis integration suite — 2026-10-23

| Сценарій | Результат | Status | Межа доказу |
|---|---:|---|---|
| Journey schema + spatial constraints | 2/2 | PASS | Local `marshgo_e2e` DB |
| Booking + trip editing/cancellation/Rescue/rendezvous/roles | 23/23 | PASS | Local API + PostGIS + Redis; fixture identities |
| Foreground navigation/GPS privacy | 2/2 | PASS | API contract; no physical-device GPS |
| Redis realtime across two API instances | 1/1 | PASS | Local Redis and loopback APIs |
| Booking durability after API process restart | 1/1 | PASS | Same local integration DB |
| Shared Redis rate limit | 1/1 | PASS | Local Redis and loopback APIs |
| Aggregate | 30/30; 0 failed, 0 skipped | PASS | No real SMS, commercial provider, HTTPS staging or production traffic |
| Non-configured transport modes | No invented fallback; blocked/empty where feed absent | PASS for truthful-empty contract | Does not count as transport coverage or provider integration |


### Кросрепозиторні CI gates та секрет доступу — 2026-10-23

| Репозиторій / gate | Точний SHA / run | Статус | Примітка |
|---|---|---|---|
| Server | `b6588258…`; `39880107952` | PASS | PR #31 CI |
| Site | `5f5e864b…`; `39896314804` | PASS | 21/21 browser E2E, artifact на merge SHA |
| iOS | `b68be012…`; `39895800899` | PASS | Simulator build і точна Site/Server sync |
| Admin | `9dbf7db0…`; `38622007161` | PASS | Verify workflow |
| Partner | `c639257a…`; `38622007703` | PASS | Verify workflow |
| Umbrella security | run `39879173727` | PASS | Security workflow |
| Umbrella CI materialization | run `39879173733` | FAIL / BLOCKED_EXTERNAL | Вимагає `MARSHGO_REPOS_READ_TOKEN` read-only для приватних Admin/Partner; не обходити permission |
| Public staging / HTTPS deploy | — | NOT_TESTED / BLOCKED_EXTERNAL | Немає доступного deployment target, secret/config, deployed SHA |

### Live journey API: opt-in integration acceptance — 2026-10-23

| Перевірка | Результат | Статус | Межа доказу |
|---|---:|---|---|
| Server `GET /api/v1/journeys/:id/live`: unauthenticated, owner isolation, disabled provider, wrong leg | 1/1 PASS | PASS | Точний Server PR #31 checkout `b658825…`; окремий loopback API `:3337` і локальна `marshgo_e2e` PostGIS fixture; не реальний фід |
| Реальні GTFS/GTFS-RT маршрут, fleet і freshness через спільний Site→Server E2E | Не виконано | NOT_TESTED | Site browser E2E досі підміняє live API fixture/mock; немає підтвердженого staging/provider probe |
| Production deployment / HTTPS smoke | Не виконано | BLOCKED_EXTERNAL / NOT_TESTED | Немає верифікованого deployment target, секретів, HTTPS origin чи rollback rehearsal; лишити `NOT_RELEASED` |

### Exact candidate source pin recheck — 2026-10-23

| Repository | Pull request | Current GitHub head | iOS pin | Status |
|---|---:|---|---|---|
| Server | #31 | `b65882584a3ad1e8dd7512d13176f52299cded51` | same | OPEN; hosted CI PASS |
| Site | #15 | `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae` | same | OPEN/draft; exact-head browser CI 21/21 |
| iOS | #12 | `b68be01275d4a170c76d44bbd34218a21a45a71a` | pins above Server/Site | OPEN; simulator CI PASS; physical device NOT_TESTED |
| PR #17 Site browser-timeout remediation | #17 | `5f5e864b2cd6bcecafb7da2388d690653c59b7b2` | n/a | Separate workflow run 39896314804 on merge SHA `4585ffd…`; do not treat base `1e8ce1d…` as current PR #15 head |

The manifest is pinned to the three current component PR heads. All are unmerged review candidates, not a deployed release.

### User-requested production UI sweep — local working-tree evidence, 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site code health | Active local Site working tree: typecheck, lint, 98/98 unit tests, production build, and bundle budget (17 JS chunks ≤350 KB gzip) all pass | PASS (local) | Dirty checkout `6961afc…`; not exact release SHA |
| Main passenger UI interactions | Exact RC pair: 156 individually clicked visible controls across 12 primary routes; zero JS exceptions or HTTP 5xx | PASS (interaction smoke) | 10 unchanged outcomes remain; nested/conditional and destructive actions require dedicated scenario acceptance |
| Route map and transport search | 4/4 focused fixture-backed E2E: route-segment selection, whole-route fit, 12 transport categories, swap coordinates, date/time persist | PASS (fixture) | E2E uses dirty local Server `182c77a…` and fixture maps; rerun on immutable release tuple |
| Search mode visual order | Corrected order to the mock: Poputka / Minibus / Bus / Taxi; Tram / Trolleybus / Metro / Train; micromobility/transfer categories | PASS (local source/build) | Exact screenshot comparison remains NOT_TESTED |
| Admin/Partner unauthenticated entry | RC21 page loads and has no JS/5xx errors or horizontal overflow at 320–1440 px | PASS (entry only) | Container revision `d5fb011…` is stale relative to manifest; authenticated workflows NOT_TESTED |
| Ten supplied screenshot references | Reviewed all ten references and current candidate captures for route details, map layers, and navigation; found mismatched tile treatment and layer grouping; not every image has a matching-state capture | NOT_ACCEPTED | Fixture tile captures cannot verify real/licensed map styling; finish per-image capture and correct visible differences |
| Live transport and tracking visuals | Not verified with live provider responses in this sweep | NOT_TESTED | Fixtures do not count as live fleet/data |
| Production deployment | Current manifest remains `NOT_RELEASED`; no deployed SHA/HTTPS smoke/rollback evidence | BLOCKED_EXTERNAL / NOT_TESTED | See external deployment and credential blockers |

## 2026-10-23 browser acceptance re-run

| Requirement | Implementation under test | Evidence | Status |
|---|---|---|---|
| Main Site user routes and critical interactions | Release-manifest Server `b65882584a3ad1e8dd7512d13176f52299cded51` + Site `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae` | `npm run test:e2e`: 17/17 Playwright PASS on isolated loopback services/fixture maps; 7.9 min | PASS (local browser candidate only) |
| Visible controls across primary screens | Same Site candidate | 156 individual control clicks across 12 routes; no JS exception/HTTP 5xx; 10 no-visible-change outcomes remain | PASS (interaction smoke) with observations |
| Responsive primary navigation/search | Same Site candidate | Browser compatibility at 320, 390, 440, 768, 1440, 1920 px; search checks at 320/390/440; no horizontal overflow, category order/touch targets/theme/nav assertions pass | PASS (Chromium emulation) |
| Rendezvous map, privacy, consent and revocation | Same Site candidate with API fixtures | 2/2 E2E PASS; no participant locations before consent; map opens only after enabled sharing; revoke path works | PASS (fixture-backed) |
| Server local unit suite | Dirty working Server checkout `182c77ae4f78d576a287007d8e0864fb130f43f8` | `npm test`: 224 pass, 0 fail, 1 opt-in local integration skipped | PASS with skip |
| Site local unit suite | Dirty working Site checkout `6961afcf008e2c845c0fde68c687ce61fe744f2f` | `npm test`: 98/98 PASS | PASS |
| Static/build gates | Same dirty working trees | Both typecheck + lint PASS; Site build and 17-chunk gzip budget PASS | PASS (working-tree SHA, not RC SHA) |
| Exact visual parity with ten owner reference screenshots | Release candidate screenshot states | Manual review identified visible differences in the map tile treatment and layer panel organization; not all images have matching-state captures | NOT_ACCEPTED |
| External provider freshness, full live fleet, feeds in user path | Current deployment | E2E stubs only; previous registry/probe notes are not renewed by this run | NOT_TESTED |
| Staging/production and HTTPS smoke/rollback | Current deployment | This run used loopback only; release manifest remains NOT_RELEASED | BLOCKED / NOT_TESTED |
| Physical iPhone/WebKit and final iOS package | Current app | Chromium phone emulation only | NOT_TESTED |
| Root orchestration unit/type/lint/build | Dirty root checkout `39a182094c82f58d84b3dbabd4a18808569bd206` | `npm test`: 256 pass / 0 fail / 1 opt-in integration skipped; `npm run typecheck`, `npm run lint`, `npm run build`, `npm run check:bundle` all PASS; 51 chunks under gzip budget | PASS (working tree) |

### Full user-requested browser sweep on current local Site — 2026-10-23

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current working-tree production build | Root Site working tree at base HEAD `39a182094c82f58d84b3dbabd4a18808569bd206` built successfully with isolated map fixture; uncommitted changes included | PASS (build only) | Dirty working tree is not an immutable release artifact |
| Server API used by local E2E | Server worktree HEAD `b65882584a3ad1e8dd7512d13176f52299cded51`, with uncommitted GTFS changes; isolated loopback API and `marshgo_e2e` database | PASS (test harness) | Fixture-backed; not an immutable Server SHA |
| Visible safe buttons/tabs/links on 12 routes | 182 successful clicks; no captured page exceptions or HTTP 5xx; E2E `1/1 PASS` | PASS (interaction sweep) | 11 controls had no observable effect, including non-clickable map controls; destructive and conditional flows require dedicated tests |
| Complete browser E2E suite | Playwright **3/18 PASS, 15/18 FAIL**, 28.8 minutes, current local Site bundle | FAIL | Do not accept this working tree as release-ready until behavior is corrected/rebased and the full run is green |
| Passing cases | Control audit; endpoint swap retains coordinates; partial-search truncation is surfaced | PASS | Local E2E fixtures only |
| Failed cases | Small-screen primary-action selector; empty-search validation/state; route map shell/map target; date-time dialog; mode labels; onboarding copy; two-account booking/demand/chat; driver insertion/reroute; iPhone viewport navigation; denied-GPS recovery; search URL restoration; Community booking CTA; rendezvous map/consent flows | FAIL / NEEDS TRIAGE | Some failures are stale selectors/labels, while booking, driver, GPS, and rendezvous flows timed out and need product-level verification |
| User reference images | No exact-state screenshot acceptance in this run; prior 10-image review remains `NOT_ACCEPTED` | NOT_ACCEPTED | Compare all 10 designs on one candidate and matching states; fixture tiles are not map-style acceptance |
| Production/staging | No public deployment, HTTPS smoke, deployed SHA, physical device, or rollback rehearsal | BLOCKED_EXTERNAL / NOT_TESTED | `NOT_RELEASED` remains unchanged |

### Rendezvous/navigation-label follow-up — 2026-10-23

- Updated the passenger tab label to `Поїздки` in the production shell and shared bottom-navigation component, matching the supplied designs.
- Corrected the confirmed rendezvous E2E to reflect observed production behavior: `Відкрити зустріч` loads the session and opens the map directly; there is no second `Відкрити карту зустрічі` action. The assertion still verifies the map, both consented locations, both approaches and the straight-line distance.
- Current local Site bundle + local dirty Server worktree: confirmed rendezvous map **1/1 PASS**; consent/revocation scenario **1/1 PASS**. Root typecheck, lint and `git diff --check` **PASS**.
- The earlier full local browser result remains **3/18 PASS, 15/18 FAIL**; it has not been rerun after these corrections. This targeted follow-up does not clear the other failing search, booking, navigation or route-map cases. Release remains `NOT_RELEASED`.

### GTFS bounded-overflow candidate sampling — 2026-10-23

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Preserve bounded graph caps and avoid duplicate overflow candidates | Unit tests for route/global ceilings, duplicate identities and stable identity tie-break | PASS (current experiment worktree) | Full suite rerun after latest tie-break pending |
| Preserve three ranking winners on frozen Lviv feed | Same feed SHA and 6 OD/transfer cases: FASTEST/CHEAPEST/BALANCED winner IDs identical baseline vs candidate | PASS (these six fixture replays) | Does not prove complete itinerary recall |
| Increase transfer-candidate diversity | Added 4, 5, 5, and 13 result IDs for center→main/1, center→main/2, north→Sykhiv/1, north→Sykhiv/2; direct-only unchanged | PARTIAL PASS | Bounded sample changed; capture repeated performance/memory metrics |
| Complete dense-feed transfer search without truncation | All transfer-enabled cases still report truncation in baseline and candidate | FAIL | Do not raise caps or enable rejected round prototypes; continue search design investigation |
| Server quality gates | Node 24.21.0, TypeScript/lint/diff-check PASS; full suite 308 pass / 0 fail / 3 opt-in integration skips (311 total) | PASS (experiment worktree only) | Three skips are opt-in integration checks; broader staging/provider gates remain open |
| Routing candidate performance/resource acceptance | Three forced-GC process pairs: retained heap 135–138 MB baseline vs 135–136 MB candidate; median process peak RSS −1%; query timing medians vary (+4.7% under forced GC, −1.6% without) | INCONCLUSIVE | Repeat with a stable benchmark harness; transfer search remains truncated |
| Staging/production and live-fleet acceptance | No staging/deployment performed by this experiment | NOT_TESTED | Release stays `NOT_RELEASED` |

### Current-worktree verification refresh — 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Root typecheck, lint, unit tests, production build, bundle cap | Node 24.21.0 `npm run check:production`: typecheck/lint PASS; 256 pass, 0 fail, 1 opt-in integration skip; build PASS; 51 JS chunks ≤350 KB gzip PASS | PASS (dirty local tree) | Per-chunk budget does not mean the whole bundle is within 350 KB; not a deployed artifact |
| Server bounded GTFS candidate sampling | Current endpoint-only overflow candidate in separate experiment worktree; 308 pass, 0 fail, 3 opt-in integration skips; TypeScript/lint/diff-check PASS | PASS (local experiment) | Search truncation still FAIL; performance acceptance INCONCLUSIVE; broad transfer-edge variant rejected (+18.6% directional runtime) |
| Production reference-home screen at small phone size | Full browser suite failure screenshot: expected `.home-action-card--navigation` not present; captured 320×568 viewport shows large light MarshPass card/colored tiles unlike approved dark compact mock | FAIL / NOT_ACCEPTED | Fix actual production home/layout and test the rendered behavior, not just selectors |
| Full all-page browser suite and button audit | `npm run test:e2e` on current dirty root tree and isolated fixture services has started; first `browser-compat` test failed, all-page button audit is currently running | IN_PROGRESS | Capture final Playwright output before classifying remaining defects |
| Staging/production deployment | No deployment, public HTTPS smoke, deployed SHA, rollback rehearsal, or physical iPhone verification in this run | BLOCKED_EXTERNAL / NOT_TESTED | Release stays `NOT_RELEASED` |

### Full-flow and route-map verification follow-up — 2026-10-23

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Marketplace passenger/driver critical lifecycle | Two-account E2E **1/1 PASS, 50.9 s** on an isolated local DB; includes search, booking, journey start/completion, persisted review state, reverse-marketplace proposal/booking, chat, privacy controls, export/deletion request/cancel and Rescue rebooking | PASS (fixture/local) | Not external, staging, payment or live-provider acceptance |
| Server integration suite | Local Postgres/Redis integration runner **30/30 PASS** on isolated `marshgo_e2e_freshfinal_20261023` | PASS (local integration) | No production DB/deployed API involved |
| Production build/type/lint/unit/bundle | `npm run check:production`: typecheck, ESLint, 256 unit tests PASS, one opt-in integration skipped, Vite build and 51-chunk gzip budget PASS | PASS (dirty working tree) | Build used test-only map manifest; not an immutable release artifact |
| Visible controls across 12 primary routes | Full-suite button audit: **181 clicks**, no browser exceptions or HTTP 5xx | PASS (interaction sweep) | 12 no-observable-effect observations remain for individual acceptance; conditional/destructive flows depend on dedicated scenarios |
| Route map UI/segment behavior | E2E reached route results and map shell; after correcting stale result-root/segment selectors, camera assertion waits for telemetry attributes absent from the current map contract | FAIL / NOT_VERIFIED | Replace stale camera telemetry assertions with a verified current map-camera contract and rerun |
| Route-results exact visual parity | Snapshot diff **54,604 pixels (~16%)** against existing baseline | NOT_ACCEPTED | Do not update baseline to hide the difference; compare matching states against all ten supplied mockups and fix production UI |
| Feed freshness | Fixture tests pass; provider logs show five consecutive EasyWay Konotop position-feed errors followed by backoff | DEGRADED / NOT_ACCEPTED | Re-probe after upstream recovers; do not show stale positions as live |
| Production deployment / physical devices | No deployed SHA, public HTTPS smoke, rollback rehearsal, physical iPhone/WebKit or full provider acceptance in this run | BLOCKED_EXTERNAL / NOT_TESTED | Release remains `NOT_RELEASED` |

| Strategy availability in search | Full suite previously failed because UI kept `Найдешевший` enabled while the API omitted `CHEAPEST`; after fix and rebuilt Site, the same targeted E2E passed **1/1**, and `npm run check:production` passed | PASS (targeted local follow-up) | Full 18-test suite not rerun after this fix; last complete run remains 16/18 |

### Latest verification update — 2026-10-23

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Complete Playwright suite | **17/18 PASS** in 13.1 min on manifest-materialized Server/Site candidate and isolated local services | FAIL (visual acceptance) | Sole failure is route-results screenshot; do not call suite fully green |
| Visible controls on main pages | **181 controls clicked across 12 routes**, no browser exceptions or HTTP 5xx | PASS (interaction sweep) | 12 heuristic no-visible-effect observations need individual acceptance |
| Passenger/driver lifecycle | Two-account booking/demand/chat; driver multi-rider insertion and GPS reroute E2E passed | PASS (fixture/local) | Not staging, real payment or provider acceptance |
| Journey map behavior | Focused functional map E2E **1/1 PASS**; fit, segment focus, sheet geometry, stops, theme/style verified | PASS (functional fixture) | Snapshot comparison skipped for this focused run; visual fidelity remains NOT_ACCEPTED |
| Route-results visual design | Full-suite snapshot differs by **54,604 pixels (16%)** from repository baseline | FAIL / NOT_ACCEPTED | Compare matching screens/states to all ten user mocks and fix production UI; never replace the baseline merely to turn the test green |
| Unit/build quality | `npm run check:production`: typecheck/lint PASS; 256 tests PASS, 1 opt-in integration skipped; production build and 51-chunk gzip budget PASS | PASS (dirty local tree) | Not an immutable release artifact |
| Live feed freshness | Five consecutive EasyWay Konotop position-feed errors; provider entered backoff | DEGRADED | Do not show these positions as current until a live probe succeeds |
| Deployed production | No staging/deployed SHA/HTTPS smoke/rollback evidence or physical iPhone acceptance | NOT_TESTED / NOT_RELEASED | Must verify on a pinned candidate and actual deployment |
# 2026-10-23 follow-up checkpoint

| Requirement group | Status | Evidence / remaining gap |
|---|---|---|
| Root code typecheck, lint, unit, build, bundle | PASS | `npm run check:production`, Node 24.21.0; 256 passed, one opt-in integration skipped; bundle within configured budget. |
| Server unit/config | PASS | Isolated follow-up SHA `b6c0efd9c0d06b8dc4011791e2f2d96eeba05c72`; production OTP override is rejected. |
| Server PostGIS/Redis integrations | PASS (local) | 30 assertions across migration 055, booking concurrency, tenant isolation, navigation/realtime, restart and rate limit. Not staging. |
| Site unit/build | PASS | Isolated follow-up SHA `f0b07f8fc4fdacbf6fa7fa0388da341e74ad988c`; 129/129 unit tests. |
| Production Site browser flows/buttons | PASS (local fixture) | 19/19 Playwright, 195 clicks / 16 paths; 12 heuristic no-change observations are documented for review. Admin/Partner standalone apps and every conditional/destructive state are not covered. |
| Live GPS guidance progress | PASS (browser fixture) | Client now advances along route segments; full GPS reroute scenario passed. No physical device/background GPS proof. |
| Ten supplied mockup visual acceptance | BLOCKED / NOT TESTED | Test maps use local fixture tiles. Not all ten designs captured and visually accepted from one exact release tuple. |
| Live external transport sources | PARTIAL / BLOCKED_EXTERNAL | Local replay/provider adapters do not prove current live coverage, freshness, commercial use rights or booking capability. |
| Staging, deployed production, rollback | BLOCKED_EXTERNAL / NOT_TESTED | No verified owner-controlled staging/deploy target, HTTPS smoke, deployed SHA, backup/restore/rollback drill or rollout approval. Status remains `NOT_RELEASED`. |
# 2026-10-23 checkpoint: route sheet / transport map

| Requirement | Implementation | Evidence | Status |
|---|---|---|---|
| Route-sheet gesture advances to adjacent snap | Captures initial snap for drag and settles to one adjacent stop on a quick gesture | `d761d4b`; Site `tests/route-sheet.test.ts` 3/3 and focused route-map functional Playwright 1/1 | PASS (local fixture) |
| Expanded route details follow approved full-sheet composition | Expanded height leaves 112 CSS px of map visible; list scrolls within sheet | `d761d4b`; CSS-pixel screenshot comparison passed for expanded route detail during focused E2E | PASS (local reference) |
| Transport map has accessible page heading | Adds visually hidden semantic `Карта транспорту` heading; visible brand/style unchanged | `d761d4b`; focused route-map E2E reaches transport map | PASS (behavior; accessibility audit remains incomplete) |
| Current integrated browser suite | One earlier failure was route-sheet gesture; after fix, focused full functional scenario passes. Full suite not rerun on new SHA. | `/tmp/marshgo-pr20-full-e2e-20261023`; `/tmp/marshgo-pr20-route-func-20261023` | PARTIAL |
| Transport map layers screenshot equivalence | Legacy root expected image differs from latest PR #19 layer UI; current PR-specific map-layer reference E2E had passed before this turn | Root E2E screenshot diff in `/tmp/marshgo-pr20-route-rc3-20261023`; PR #19 map-layer E2E result recorded in prior checkpoint | NOT_ACCEPTED |
| Site hosted CI at exact current head | Two runs attached to `d761d4b` | `39993143224` success; `39993143251` pending when written | PARTIAL |
| Production deployment / live sources / physical iPhone | Not run in this checkpoint | No staging origin or deployment evidence | NOT_TESTED / BLOCKED_EXTERNAL |

## Site PR #20 route-sheet final gate — 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site route sheet and map accessibility update | PR #20 head `a000b3cc07a956ae7ded4563ab5e97b11fe3db71`; locally `npm run check:production` passed (129 unit, 24/24 Chromium/Firefox/WebKit, typecheck, lint, build, bundle budget) | PASS (local exact branch) | Hosted `Site CI` run `39995439983` passed; companion run `39995439935` was in progress at checkpoint. |
| Root integrated route flows | Local fixture Playwright suite passed 19/19 | PASS (functional fixtures) | No pixel acceptance of all ten supplied references, no live provider/staging data, no physical Safari/iPhone. |
| Production release | No verified staging or deployment origin/deployed SHA; no approved rollout | BLOCKED_EXTERNAL / NOT_TESTED | Retain `NOT_RELEASED`; deployment is prohibited by this task until separate owner approval. |

## Exact Site/Server candidate integration — 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Cross-repository Site and API behavior | Site PR #20 `a000b3cc07a956ae7ded4563ab5e97b11fe3db71` fixture build + Server PR #31 `b65882584a3ad1e8dd7512d13176f52299cded51`; clean migrations into isolated `marshgo_e2e_site20_server31_20261023`; root Playwright functional suite **19/19 PASS** | PASS (exact local fixture candidate) | No live provider or owner staging data; no external HTTPS acceptance. |
| Main production UI paths and visible controls | Same 19-test suite includes **192 visible clicks / 16 paths**, 0 captured JS errors and unexpected HTTP 5xx; 12 heuristic no-change observations are recorded | PASS for smoke coverage; PARTIAL for individual conditional-action semantics | Three dedicated tests cover empty search/demand validation, trip-tab selection and coordinate-preserving route swap. Add specific assertions where a no-change observation is a meaningful action. |
| Exact Site/iOS bundle | iOS PR #12 `6e825cd59df9529c9b88aab063989d7328497fef` pins exact Site `a000b3c…` and Server `b658825…`; run `39996495495` successfully built/synced Capacitor and compiled Simulator | PASS (simulator build) | Physical iPhone, background GPS, APNs, signing and staging account acceptance remain NOT_TESTED. |

## Admin and Partner local component checks — 2026-10-23

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin PR #1 component candidate | Exact snapshot `9dbf7db0a935498ac40c98b19bc36bce056d630d`: typecheck, lint, 2 access-guard unit tests and production build PASS | PASS (local component checks) | No authenticated Admin browser E2E or live privileged-action/tenant acceptance. |
| Partner PR #1 component candidate | Exact snapshot `c639257a7f28aeda5b378a816038b01651146b83`: typecheck, lint, 3 membership/access unit tests and production build PASS | PASS (local component checks) | No authenticated Partner browser E2E or live organization/role/API acceptance. |


## Dense GTFS search completeness — 2026-10-23

| Requirement | Implementation/evidence | Status | Boundary / next step |
|---|---|---|---|
| Dense Lviv GTFS candidate quality | Frozen feed (`bb4ac0ce…`) replayed for three OD pairs at 25k/50k/100k objective windows; objective winners stable, but all 9 results still set search, graph, and result truncation flags. The 100k graph budget was binding in all three default-window runs. | PARTIAL | Raising the later search window is rejected. Build a new graph-retention candidate, prove small-feed exhaustive parity, then replay frozen feed and compare diversity/resources. No global-optimality claim. |
| Alternate bounded traversal | Independent review hit 100k labels and had zero baseline top-100 ID recall and zero winner recall on all three ODs. | FAIL (candidate rejected) | Do not wire into production; retain current search until a proven alternative passes oracle and frozen-feed gates. |


## Exact production-path browser control acceptance — 2026-10-23

| Requirement | Implementation / evidence | Status | Boundary |
|---|---|---|---|
| Visible control response on the manifest Web/PWA candidate | Site `a000b3cc07a956ae7ded4563ab5e97b11fe3db71` + Server `b65882584a3ad1e8dd7512d13176f52299cded51`; Node 24.21.0; isolated `marshgo_e2e_button_audit_20261023`; button audit clicked 192 controls; 0 uncaught page errors / unexpected HTTP 5xx; `e2e/button-audit.spec.ts` 3/3 PASS | PASS (local fixtures) | Not a literal test of every conditional or destructive state; Admin/Partner authenticated paths and live services remain separate. |
| Home banner control state | New assertion verifies both banner choices, `aria-pressed` changes and corresponding rendered copy; 1/1 Playwright PASS; ESLint and diff-check PASS | PASS (local fixture) | Test change is in dirty root worktree, not yet committed/pushed. |

## Full UI recheck — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Main Web/PWA visible controls | Local dirty Site/Server checkout pair; 195 safe enabled controls clicked over 15 route paths; 0 browser exceptions/unexpected 5xx; 13 expected/no-change observations recorded | PASS for tested smoke paths; PARTIAL for all conditional/destructive controls | Does not cover authenticated Admin/Partner workflows or destructive actions. |
| Responsive route search | Playwright at 320/390/430/768/1280/1440 CSS px; no horizontal overflow, touch-size, provider filter, mode grid, theme and tab bar assertions passed | PASS (local fixture) | One local Chromium environment; no physical browser/device acceptance. |
| Multimodal journey and navigation flows | Full UI E2E 19/20; focused route/segment interaction 1/1; two-account booking/demand/chat, driver GPS reroute, route URL, denied GPS, and rendezvous consent flows passed | PARTIAL | The one failure is a dark half-sheet screenshot delta of 19,828 pixels (6%); do not refresh the baseline before reference review. |
| Ten supplied reference designs | Manual review in audit 95 plus current actual/baseline dark half-sheet comparison | NOT_ACCEPTED | Exact-state captures for all references, real map artwork/data, and full-screen live rendezvous remain open. |
| UI quality gates | Root/Site/Server TypeScript and ESLint pass; unit tests root 256/257, Server 224/225, Site 98/98 (one opt-in skip in each root/Server suite) | PASS (local worktrees) | Not production or staging evidence; trees are dirty and manifest SHAs differ from the tested source tuple. |
## Exact component tuple cross-browser / simulator checkpoint — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server/Site/iOS exact CI tuple | Server `134ed017828a020e1d5f696b3cb9ea95527bb093`, Site `a85b33b774c43f031624fafa2d06732ca7a79354`, iOS `bd1acfcef19b57076f53f4675f37039e3d8c7a88`; six exact-head CI jobs PASS, iOS build verifies both pins in embedded manifest | PASS (candidate CI) | Three PRs remain open/unmerged; root integration tree not immutable |
| Production sign-in, home and search browser compatibility | Site+Server exact tuple; Chromium/Firefox/WebKit; viewport checks 320/390/430/768/1280/1440 | PASS (fixture E2E 3/3) | Local Node 26.7.0 produced engine warnings (project pins 24.21.0); no live provider/staging |
| Canonical route map E2E | Exact Site+Server tuple; route sheet, stop details, focus, light/dark in Chromium/Firefox/WebKit | PASS (fixture E2E 3/3) | Does not cover every control or all six visual reference states; map/data are local fixtures |
| Local visual acceptance runtime | isolated `marshgo_e2e`; API port 3312 selected because 3302 was occupied | PASS | Existing port listener left untouched; no user container removed |
| Dense Lviv routing completeness | Frozen GTFS exact replay retains deterministic results but `searchTruncated=true` and `candidateGraphTruncated=true` | FAIL (completeness) | Continue oracle-guided graph retention work; no completeness claim |
| Production release | No staging/deployed SHA, fresh images for this exact tuple, physical device, live-provider acceptance or backup/restore/rollback evidence | NOT_RELEASED | Keep `PRODUCTION_READY=false`; complete required release gates |

---

## Live transit ETA and exact candidate check — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server live journey contract | Server PR #36 exact head `134ed017828a020e1d5f696b3cb9ea95527bb093`; hosted CI runs `40056723422` and `40056739994` pass, including PostGIS/Redis integration and image smoke | PASS (candidate CI) | PR is open/stacked on #34; no staging or production deploy |
| Site displays verified arrival state | Site PR #21 exact head `a85b33b774c43f031624fafa2d06732ca7a79354`; four ETA unit cases; Site suite 102/102; typecheck/lint/build/bundle budget pass | PASS (local candidate checks) | Exact-head hosted Site CI pending; browser visual acceptance not yet rerun |
| Live vehicle ETA integrity | UI uses only emphasized vehicles with server-confirmed approach; otherwise labels a stop prediction, schedule, fresh fleet without approach confirmation, or unavailable | PASS (unit/contract behavior) | No new live-feed probe or passenger-visible staging test in this checkpoint |
| Dense Lviv route completeness | Frozen feed SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; deterministic replay, 58 trip chains / 37 route chains / 100 results | FAIL (completeness) | `searchTruncated` and `candidateGraphTruncated` still true |
| Production release | No confirmed staging/deployed SHA, physical-device acceptance, final coverage, backup/restore or rollout evidence | NOT_RELEASED | Continue gates; production deployment still requires explicit owner approval |

---

# Routing verification update — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Active Server GTFS timetable and ranking behavior | Dirty Server checkout `feature/transport-layer-availability` at `182c77ae4f78d576a287007d8d0864fb130f43f8`; GTFS + scoring tests 51/51, full suite 224 pass / 0 fail / 1 opt-in skip; typecheck and targeted lint pass | PASS (local fixture checks) | Not a dense-feed completeness proof; maintain truncation disclosure |
| Dense Lviv multimodal route completeness | Frozen-feed objective sweep and round-search candidate review | FAIL (completeness) | Graph cap remains binding; no reviewed candidate passes all oracle, winner, diversity, and resource gates |
| Server routing PR stack | PR #33 exact head `e7e695ee337f64af97679c283c3988dfe883c200`, PR #34 exact head `904a15a57ed7332b0620d048b4d724e7e681beb3`; both OPEN, mergeable, CI green | PASS (CI only) | Unmerged; these PRs do not fix dense-feed completeness |

## Exact candidate cross-browser rerun — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site route-map and sign-in/home/search browser compatibility | Site `2af5219538aa005d285f9236ca0b0dafaca0274a` + Server `c7252783f3c8b3b1140d621bcbdae175248008be`; Playwright Chromium, Firefox, WebKit; 6/6 pass in 3.1 minutes with local E2E/map fixtures | PASS (focused local candidate E2E) | Does not cover every control/state, live providers, Admin/Partner auth, staging, production or physical iPhone. Full details: `docs/audit/104_EXACT_RC_CROSS_BROWSER_2026-10-24.md` |
| Root umbrella hosted CI at `566a17e5c584efd4d68a97b381aabc068c87cf5c` | Security/Gitleaks checks pass; CI fails closed at private Admin/Partner source checkout because `MARSHGO_REPOS_READ_TOKEN` is unset | BLOCKED_EXTERNAL | Set the GitHub Actions secret with read-only Contents access; remaining hosted materialization/E2E stages were skipped. No bypass attempted |
| Ten user visual references | Sampled pinned-candidate snapshots reviewed for route results, detail, half-sheet, navigation and layers; synthetic map assets and non-matching live carpool/bus states | NOT_ACCEPTED | See `docs/audit/95_USER_MOCK_DESIGN_AUDIT_2026-10-23.md` and follow-up `docs/audit/104_EXACT_RC_CROSS_BROWSER_2026-10-24.md`; capture all matching states with licensed/real map assets before visual approval |


## Exact release candidate full UI retest — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Pinned-source Web/PWA E2E | Server `134ed017828a020e1d5f696b3cb9ea95527bb093` + Site `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9`; all 20 Playwright tests pass in 7.6m on isolated DB and local deterministic service fixtures | PASS (local fixture) | Node 26.7.0 used; declared Site runtime 24.21.0 must be rechecked |
| Production-route button smoke | 195 controls clicked across 15 route paths; zero uncaught page exceptions or unexpected HTTP 5xx | PASS (covered states) | 24 no-visible-effect/not-interactable observations are detailed in audit 105; conditional/destructive controls need dedicated flows |
| MapLibre navigation and recovery | Both iPhone viewport cases pass, including fixture tile failures, retry, route rendering; tools-button overlap fixed | PASS (fixture E2E) | Not licensed live map service or physical iPhone |
| Site and iOS candidate CI | Site SHA `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9` CI `40064037097`,`40064033933`; iOS SHA `6e5a3a63b200cc6e490878f889979ea0baf217f7` CI `40064058349`,`40064055620` | PASS (hosted CI) | iOS simulator compilation/pin only; no physical-device acceptance |
| Local code gates | Root typecheck/lint/build pass; root unit 256 pass / 1 opt-in skip; Site typecheck/lint/build and 102/102 unit pass | PASS | Integration skip is not a pass; see full test reports and release gates |
| Production/staging release | No deployed SHA or confirmed staging; no real provider, physical iPhone, security/load, backup/restore/rollback acceptance | NOT_RELEASED | Keep `production_ready=false`; complete external and remaining release gates before owner approval |
| Supplied mockup visual parity | Compared current route-results and route-detail captures with references 4 and 8; synthetic grid basemap and composition differences remain. Ten-state design review is not complete | NOT_ACCEPTED | Capture and compare every matching reference state; no visual compliance claim |

## 2026-10-24 follow-up candidates

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site map layers sheet paired layout | PR #22 `d7fc931d80e76663b5dc24929f7b323651fbbffa`; hosted CI checks `40067548744` and `40067557961` pass; local tests 103/103, typecheck/lint/build pass | PASS (candidate checks) | Draft PR stacked on exact Site RC; all ten supplied visual states remain NOT_ACCEPTED; old synthetic-map golden intentionally unchanged |
| Dense Lviv stop relevance candidate | Server PR #37 `685eda4a9b18ea07c1264ccfe68bd21d3ebbbd16`; CI `40065767808` pass; tests 226 pass / 1 opt-in skip | PARTIAL / NOT_ACCEPTED | Experiment still truncates all three frozen OD pairs and shows mixed diversity with +2.8% summed median runtime; do not claim routing completeness or merge as a fix |
| Production release | Candidate code checks above are green | NOT_RELEASED | No staging/deployment SHA, live-provider acceptance, physical iPhone, operational recovery or release approval evidence |

## Server GTFS search-projection checkpoint — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Shared scheduled stop-pair projection | Server PR #38 head `1c08a98dfe93224eb06cb8562bab2c9e64054573`; production graph and test-only lazy event traversal call the same deterministic projection. | PASS (candidate implementation and local checks) | Does not replace bounded graph construction or establish complete route recall. |
| Frozen-feed search completeness | Lviv archive SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; graph debug: estimated 415,997 candidates, retained 99,054/100,000, search 101,827 steps, candidate sampling truncated. | FAIL (known dense-feed completeness gate) | The one-million search-step hard cap was not reached; target bounded graph retention and candidate selection. |
| Lazy event traversal diagnostic | 10k/20k/100k label caps all ended with `searchTruncated=true`; 100k found 1,904 paths / 88 trip chains / 6 route chains before truncating. | NOT_ACCEPTED for production | Test-only oracle is incomplete on dense feed. Keep diagnostic only until complete bounded algorithm proves oracle parity and three-strategy winners. |
| Server PR #38 checks | Local full suite 308 pass / 0 fail / 3 opt-in skips; typecheck/lint PASS. Hosted exact-head runs `40069022061` and `40069024715` pass at SHA `1c08a98dfe93224eb06cb8562bab2c9e64054573`. | PASS (candidate CI) | Dense-feed completeness still FAIL; staging, provider-live and production acceptance remain NOT_TESTED. |

## Site rideshare detail candidate — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Private-ride details on selected journey segment | Site PR #23, head `f72b2f076999a33bfa9785152e3fe5d12a303503`; selection invokes existing offer detail API, displays its driver/rating, vehicle, seats and photo when supplied; loading/error states explicit. | PASS (local candidate implementation) | No fabricated avatar/live approach; live approach stays behind booking and consent. The selected state has not been captured in authenticated browser for visual acceptance. |
| Site build and unit gates | 103/103 tests, typecheck/lint/build/bundle checks PASS on Node 24.21.0; exact-head hosted workflows `40069286708` and `40069299713` PASS. | PASS (candidate CI) | Authenticated browser/API E2E and exact mockup visual parity NOT_TESTED. |

## GTFS temporal segment retention experiment — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Preserve a scheduled transfer connector under bounded graph sampling | Deterministic regression keeps access → connector → egress despite denser out-of-window interchanges; Server suite 309 pass / 0 fail / 3 opt-in skips; typecheck/lint pass. | PASS (bounded fixture) | Frozen feed is diagnostic only; repeat the full three-OD suite and compare exhaustive small-feed winners. |
| Improve dense Lviv routing completeness | Two sequential paired frozen-feed OD replays; one gained one trip/route chain and changed fastest/cheapest candidates, the other held trip-chain count but lost two route chains. Both remain graph/search truncated. | FAIL (completeness gate open) | Report `GTFS_TEMPORAL_SEGMENT_RETENTION_2026-10-24.md`; keep partial-search disclosure and continue graph-budget investigation. |
| Production release | No staging/deployed SHA, external provider live acceptance, or owner-approved deployment. | NOT_RELEASED | `PRODUCTION_READY=false`; all required release gates remain in force. |

## UI acceptance recheck — 2026-10-24

| Requirement | Status | Evidence / boundary |
|---|---|---|
| Local candidate browser flows | PASS | Candidate Site `5a96e85630428c2ffc15dfe67308334eda9d7398` + pinned Server fixture `134ed017828a020e1d5f696b3cb9ea95527bb093`: full E2E 20/20. |
| Main-route control audit | PARTIAL | 177 safe controls clicked; 4/4 audit tests pass. Conditional/destructive and all role-protected flows are not covered. |
| Journey route map in light/dark and screenshot comparison | PASS (fixture scope) | 1/1 with visual comparisons after manual review of two refreshed light-layer baselines. Uses local fixture map assets. |
| Candidate UI static checks | PASS | Typecheck, lint, 103/103 Site unit tests; root production gate 256 pass, one opt-in skip, build and bundle budget pass. |
| GitHub PR checks | PASS | Site PR #22, both `verify` jobs passed; commit `5a96e85630428c2ffc15dfe67308334eda9d7398`. |
| All supplied owner mockups at matched states | NOT_TESTED | Only selected map/layer states were compared; all ten references have not been accepted. |
| Live GPS/providers, staging, physical iPhone, authenticated Admin/Partner | NOT_TESTED | Local deterministic E2E fixtures only. |
| Production release | NOT_RELEASED | Candidate SHA is not the release manifest tuple; no deployment or production smoke. |

## Server bounded-retention candidate — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server candidate CI / isolated integration | PR #38 exact head `8e570768c7e1e4dd2f016764d7396d9776e92abc`; run `40121317374` passed dependency audit, lint, typecheck, unit tests, clean migrations, integration suite, production API image build and PostGIS/Redis smoke. | PASS (candidate CI) | PR #38 remains draft/open; this is not deployment or staging acceptance. |
| Bounded transfer-connector retention fixture | Focused fixture and full Server tests passed; exact-head hosted run is green. | PASS (fixture) | Does not establish completeness on dense city feeds. |
| Dense Lviv routing completeness | Frozen replay estimates 415,997 candidates vs 100,000 graph cap; current run retains 99,063 and still sets both truncation signals. Paired 3-OD run preserves existing winners but has no recall improvement. | FAIL (open code gap) | Continue query-directed graph allocation / trip-group retention work with exhaustive small-feed oracle and repeated frozen-feed replays. |
| Exact PR #38 endpoint-ranking tie-break | Three paired runs on frozen Малий Голоско → Сихів changed all three strategy candidates and reduced trip/route chain counts from 59/38 to 58/37. | REJECTED EXPERIMENT | Keep PR #38 unchanged; investigate a different bounded candidate-retention policy. Evidence: `docs/audit/116_GTFS_ENDPOINT_TIEBREAK_REJECTED_2026-10-24.md`. |
| Production release | No deployed SHA, staging E2E, live-provider acceptance, or owner-approved deploy. | NOT_RELEASED | `PRODUCTION_READY=false`; no production action performed. |

## Continuation — partial-search UX and dense-feed experiment — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Explain truncated journey candidate generation to passengers | Site PR #23 commit `de8cc7a`; tests assert warning is shown only for partial search. Local suite 105 pass, typecheck/lint/build/bundle pass. | PASS (local candidate) | Hosted PR #23 checks `40122426607` / `40122430450` were pending at checkpoint. |
| Improve dense-feed graph completeness with connector-overflow retention | Three paired replay medians regressed 5.08–10.33%; no additional useful chains; truncation persisted. Experiment is isolated and unpushed. | FAIL (experiment rejected) | Do not merge. Continue a new strategy with oracle and repeated performance/recall evidence. |
| Production release | No staging, deployed SHA, live provider acceptance, device acceptance, backup/restore or rollback evidence. | NOT_RELEASED | Keep `PRODUCTION_READY=false`; user’s master spec requires separate release approval. |
| Site partial-search notice hosted checks | Exact head `de8cc7a08e7803b15863a7889135d6d21036ce37`; Site CI `40122426607` and `40122430450` success. | PASS (hosted CI) | Draft PR #23; not merged, staging or release acceptance. |

## Site full-browser acceptance — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Canonical 12-mode route-search grid | Site PR #23 SHA `eb3005a`; exact labels and order tested in local UI/E2E. | PASS (candidate) | Open draft stacked PR; not merged into the release tuple. |
| General route segment focus | Selected line stays prominent, other itinerary legs remain dimmed; full route-map E2E passed. | PASS (local candidate) | Live bus full-line/fleet behavior remains a separate data/feature gate. |
| Full-screen confirmed rendezvous | Consented map expands over bottom navigation and keeps “Я на місці” action available; rendezvous E2E passed. | PASS (fixture) | External/live permissions and physical-device behavior not proven. |
| Site local browser acceptance | 20/20 Playwright E2E; 177 control clicks; 105 unit tests; typecheck/lint/build/bundle pass. | PASS (local fixture) | Does not equal staging or owner-mock visual acceptance. |
| Site hosted CI | Site PR #23 exact head `eb3005a6558b3688be4c30117c81b7a786f9a7a5`, run `40123974041` SUCCESS. | PASS (hosted CI) | Draft PR, stacked behind #22/#21. |
| Production release | No verified staging/deployed SHA, live commercial-provider acceptance, physical iPhone or backup/restore/rollback evidence. | NOT_RELEASED | `PRODUCTION_READY=false`; follow release gates. |

### Post-merge Site candidate — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site stack PR #22→#23 conflict | Ordinary merge of current #22 into #23; Site SHA `10454f37b59a848e4a5b381689dfe7f701fe2b81`; GitHub reports MERGEABLE. | PASS (integration) | Draft PR; no merge to release or deployment. |
| Site local candidate checks | 105/105 unit; typecheck; lint; build; bundle budget; full local fixture E2E 20/20. | PASS (local candidate) | Candidate E2E uses local fixtures and Server SHA `134ed017828a020e1d5f696b3cb9ea95527bb093`. |
| Site hosted CI | Exact-head run `40124900205` running at checkpoint. | NOT_TESTED (pending) | Recheck exact SHA before candidate acceptance. |
| Production release | No staging/deployed SHA, visual mock acceptance, physical iPhone, commercial-provider rights, or verified backup/restore/rollback. | NOT_RELEASED | `PRODUCTION_READY=false`. |

### Latest hosted candidate results — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site PR #23 hosted CI | Exact merged head `10454f37b59a848e4a5b381689dfe7f701fe2b81`; run `40124900205` SUCCESS; PR is MERGEABLE. | PASS (hosted candidate) | Still draft; no ten-image visual approval, staging or deployment. |
| Root PR #6 release integrity guard | Exact head `2b87b8b016ce8b4c309adc4399ad31b81781cd09`; retained newer target package versions and removed stale dependency downgrades; targeted 9/9 tests pass on prior merge head. CI `40125100349`, Security `40125098012` queued. | NOT_TESTED (hosted pending) | Recheck both exact-head workflows; PR is release-integrity scope, not dependency upgrades. |

### Admin/Partner local candidate recheck — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin candidate | SHA `9dbf7db0a935498ac40c98b19bc36bce056d630d`; 2/2 unit tests, typecheck, lint and build PASS. | PASS (standalone candidate) | Role-display tests only; authenticated Admin API workflows NOT_TESTED. |
| Partner candidate | SHA `c639257a7f28aeda5b378a816038b01651146b83`; 3/3 unit tests, typecheck, lint and build PASS. | PASS (standalone candidate) | Membership state gating only; authenticated Partner workflows and tenant isolation NOT_TESTED. |

### Root PR #6 exact-head hosted result — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Root static/security gates | Exact head `2b87b8b016ce8b4c309adc4399ad31b81781cd09`; dependency audit, lint, typecheck, unit, migrations, integration, build, bundle PASS; Gitleaks/CodeQL run `40125098012` PASS. | PASS (hosted pre-materialization) | CI run `40125100349` then failed at private checkout secret setup. |
| Exact pinned compose/image/browser gates | Private Admin/Partner read token is absent; materialization, Docker build and browser E2E/compat were skipped. | BLOCKED_EXTERNAL | Set `MARSHGO_REPOS_READ_TOKEN` with least-privilege Contents read permission and rerun exact head. |

### iOS and visual-reference follow-up — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| iOS uses current shared Site bundle | iOS PR #14 head `53b28ec86ee806e95284eee8ab6c8a12739f6df4` pins Site #23 `10454f37b59a848e4a5b381689dfe7f701fe2b81` and Server #36 `134ed017828a020e1d5f696b3cb9ea95527bb093`; runs `40125380685` and `40125383444` SUCCESS. Simulator compile and manifest verification passed. | PASS (hosted simulator) | Physical iPhone, signing, APNs, background GPS and TestFlight NOT_TESTED. |
| Site dependency stack | PR #21 → #22 → #23; heads `df796e2c…`, `5a96e856…`, `10454f37…`; all OPEN/MERGEABLE, #22/#23 drafts. | PARTIAL | The stack is not merged and is not an integrated six-repository release tuple. |
| Supplied visual reference #10 | Dark expanded route card and leg detail hierarchy are present; local fixture screenshot uses synthetic grid tiles rather than geographic tiles. | NOT_ACCEPTED | Review all ten exact states with approved production map assets before visual sign-off. |
| Orchestrator production check | Dirty root HEAD `8741bd1936115941386148104dff130525aa5f5d`; typecheck, ESLint, 256 unit pass / 1 opt-in DB skip, build and 51-chunk bundle budget pass; diff-check clean. | PASS (local candidate only) | Not an immutable release image or staging/production proof. |
| Exact four-source materialization | Server/Site/Admin/Partner exact SHAs from RC review manifest; origin/SHA/cleanliness checks passed. | PASS (materialized inputs) | Docker Compose cannot validate/runtime without actual production configuration; no images were built with placeholders. |
| Production Compose configuration | Required APP_DOMAIN, DB/Redis credentials, approved map/geocoder/routing URLs, Twilio and S3 variables are not present. | BLOCKED_EXTERNAL | Configure real staging-safe values and revalidate Compose; do not reuse fake credentials in a client bundle. |
| Admin exact image static runtime | Admin `13f4791d627badb1cfa89247a8a668b4429ecd14`, image digest `sha256:bf07d63dafcd07577936908a75f949244249a495c61db65e084932ab508c22c4`; root, two SPA routes, JS asset and healthz all 200. | PASS (isolated static smoke) | No API/authentication was exercised; authenticated CRUD/tenant acceptance remains NOT_TESTED. |
| Partner exact image static runtime | Partner `9a90b8833d0dc031b307d00e558ab78a251451fe`, image digest `sha256:8c829d1774b4a6527a0fdaca1a4c1dc8c559de6823649badd6088ca8484ed17e`; root, three SPA routes, JS asset and healthz all 200; hosted Verify `40126076348` PASS. | PASS (isolated static smoke + hosted CI) | No API/authentication or tenant isolation was exercised. |
| Admin/Partner JSX control wiring | TypeScript AST: Admin 20/20 and Partner 23/23 buttons have a direct click or form-submit handler; hosted Verify PASS on exact SHAs. | PASS (static handler audit) | Authenticated actions, API success/failure states and cross-tenant isolation remain NOT_TESTED. |

## Partner exact-candidate authenticated acceptance — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Partner OTP and primary portal pages | Exact Partner `97a3727cc395dea092af6e3e24d6822370c2bc63`; local loopback browser exercised OTP, overview, organization, integrations, settings and logout; no page errors. | PASS (local dev-mode API) | Production OTP/SMS and staging are not tested. |
| Partner onboarding and tenant isolation | Exact Server `134ed017828a020e1d5f696b3cb9ea95527bb093`; clean disposable PostGIS migrations plus `partner-platform.integration.test.ts` 1/1. | PASS (isolated local integration) | Does not establish production deployment or live provider access. |
| Provider activation truthfulness | UI shows pending application and “Не підключено”; API rejects enabling an unlicensed provider. | PASS for tested local paths | Provider contracts, keys, live probes and operations remain external/unverified. |
| Partner PR checks | PR #1 hosted Verify run `40126462889`. | PASS | PR remains separate review candidate. |

## Admin exact-candidate OTP and auth gate — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin development OTP entry | Exact Admin `bc37198ca139408907aaefa0d97dc9b60a568300`; 2/2 unit, typecheck/lint/build and hosted Verify `40126700951` PASS. | PASS | Production OTP delivery and staging identity are not tested. |
| Admin authenticated UI actions | Server API moderation/provider role paths are partially covered by isolated partner integration acceptance. | NOT_TESTED | Development-visible OTP intentionally cannot grant platform admin; requires secure staging/admin test identity. |
| Admin exact candidate image shell | `marshgo/admin:RC-2026-10-24-admin-bc37198`, linux/arm64, OCI digest `sha256:a4668ffc8d7d516a40fa79f7d1d1db19ded6bcba9ee58781d4b8157620f66633`; route/bundle/health HTTP smoke 7/7. | PASS (static image smoke) | Not an authenticated Admin UI/API test; image is local and unpublished. |

## Current Site and iOS exact candidate — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site PR #23 exact head | `44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492`; 105/105 unit, typecheck, lint, production build, bundle budget PASS; hosted Verify runs `40132182053`, `40132186290` PASS. | PASS (source candidate) | PR remains OPEN/draft; ten-reference pixel acceptance is not complete. |
| Site full local browser suite | Exact candidate bundle, isolated local Server fixture: Playwright E2E 20/20 PASS; route states, layer toggles, booking/chat, driver GPS/reroute, rideshare and responsive checks included. | PASS (fixture E2E) | Not live-provider, staging, production or exhaustive proof of a successful action for every control. |
| iOS PR #14 exact pin | `94658424c73d7a7e5c1c916560993a460d11f7cb` pins Site `44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492` and Server `134ed017828a020e1d5f696b3cb9ea95527bb093`; simulator CI runs `40133302719`, `40133306386` PASS. | PASS (hosted simulator build) | API unavailable in local native run; authenticated native API/GPS scenarios and physical-device acceptance NOT_TESTED. |
| Current exact OCI tuple | Existing four-image smoke is for Site `10454f37b59a848e4a5b381689dfe7f701fe2b81`, not the new Site head. | BLOCKED (stale artifact) | Rebuild current Site image and repeat isolated image/proxy smoke; no production config or deployment. |
| Supplied ten-mockup visual acceptance | Local snapshots cover route/layer fixture states; basemap is synthetic and live vehicles are fixture/absent. | NOT_ACCEPTED | Compare every mockup at matching state with approved real map assets; do not claim pixel or live data parity. |
| Current Site linux/arm64 image | Exact Site `44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492`; image ID `sha256:7116784c116468f3458c4d339cf4e4af8efd0560b53cdb29afeb5eec0cacd1b5`; `/healthz`, SPA routes and three JS assets returned 200. | PASS (static smoke only) | Map manifest build arg empty; no API/proxy integration; not deployable. Rebuild with approved immutable map manifest and repeat full integrated smoke. |
| Umbrella dirty-checkout production checks | `npm run check:production` exit 0: typecheck, ESLint, 256 unit PASS / 0 FAIL / 1 opt-in integration SKIP, Vite build, 51-chunk gzip budget PASS; release contract tests 3/3 PASS; `git diff --check` PASS. | PASS (local working tree) | Dirty orchestration checkout is not a pinned release artifact. |
| Current six-repository PR reconciliation | Audit 122 records exact current heads/ancestry; Site #23 and iOS #14 hosted checks pass; Server #36 selected candidate, newer #39 still separate; Admin/Partner PR #1 heads match the tested image sources. | PARTIAL | All component PRs remain unmerged; root #6 CI cannot materialize private Admin/Partner without read token. Dense-feed truncation persists. |

## Exact RC.6 four-image integration smoke — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Exact Server/Site/Admin/Partner image builds | Exact sources materialized cleanly; four ARM64 OCI image digests are recorded in audit 114. | PASS (local builds) | Images are not published; production build configuration is incomplete. |
| Fresh schema and API container | Disposable PostGIS migrations through 055; exact Server image `/healthz` and `/readyz` 200. | PASS (local disposable stack) | Development auth and disabled provider jobs; no production credentials. |
| Portal routes and proxy links | Site 4 routes, Admin 7 routes, Partner 6 routes all returned 200; unauthenticated refresh was forwarded to API and returned expected 401. | PASS (local container/proxy smoke) | Does not establish authenticated full-product E2E or staging/production behavior. |
### iOS exact-RC simulator acceptance — 2026-10-24

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Exact iOS/Site/Server revision manifest | iOS `53b28ec86ee806e95284eee8ab6c8a12739f6df4`, Site `10454f37b59a848e4a5b381689dfe7f701fe2b81`, Server `134ed017828a020e1d5f696b3cb9ea95527bb093`; embedded manifest matched | PASS | Migration version unset; pin/reconcile it for a full release tuple. |
| Site bundle + Capacitor sync + Xcode simulator build | `docs/audit/119_IOS_EXACT_RC_SIMULATOR_2026-10-24.md`; final repeat ran under Node 24.21.0 | PASS | Unsigned simulator only. |
| Simulator first-screen launch on iPhone 15 / 16 Pro Max | Exact-pinned screenshots reviewed | PASS | Does not cover interaction, API, GPS or physical device. |
| Authenticated native flows, GPS, map tiles, WebSocket, resume | API on localhost:3002 unavailable; no interactive automation | NOT_TESTED | Start isolated Server with test configuration and execute authenticated device scenarios. |
| Physical iPhone / background GPS / APNs / signing | No physical device or signing/push credentials used | NOT_TESTED | Secure device and release credentials/configuration required. |


## Exact Site candidate — layer sheet and full fixture browser suite — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Layer controls fit above persistent navigation | Site `9569bb4f174a4bdf912a6f490e69a359148db342`; E2E asserts full sheet content fits and final control is visible without scroll. 44px row targets retained. | PASS (fixture E2E) | Changed state reviewed; all ten reference mockups are not visually accepted. |
| Full browser suite on exact Site/Server source | `npm run test:e2e`: 20/20 passed on Site `9569bb4f174a4bdf912a6f490e69a359148db342` and Server `134ed017828a020e1d5f696b3cb9ea95527bb093`. | PASS (local fixture E2E) | Host Node was 26.7.0 vs Site engine pin 24.21.0; hosted Site CI passes on its pinned workflow. No live-provider/staging/production acceptance. |
| Main-screen visible control sweep | 178 clicked without browser/page errors; diagnostic output logged 17 with no observed URL/DOM/network change. | PARTIAL | The audit does not currently assert the no-effect list is empty. Investigate each item and fail on unexplained no-effect behavior before claiming all controls verified. |
| Exact iOS source pin | iOS `0b404ca4dba62d1bba79847b79f052f0e0425ff7` pins Site `9569bb4f174a4bdf912a6f490e69a359148db342`; hosted simulator runs `40135128350`, `40135124223` pass. | PASS (hosted simulator build) | No physical device, live API, background GPS, APNs, or signing validation. |
| Production release | No staging/deployed origin or current Site image tuple verified; no production deployment. | NOT_RELEASED | Keep `production_ready=false`; complete documented gates and obtain the separately required owner release approval. |

| Exact current Site OCI image static smoke | SHA `9569bb4f174a4bdf912a6f490e69a359148db342`, digest `sha256:150ce69d4787ef8ec99832b17627be604838c3bfe5f59b0e210f35ccfb7002bb`; health/root/search/profile and five JS assets 200. | PASS (isolated static container) | Map manifest unset; API proxy and current integrated stack NOT_TESTED; image is non-deployable. See audit 124. |

## Current four-image tuple local smoke — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Exact Server/Site/Admin/Partner images start together | Audit 126: exact digests for Server `134ed017…`, Site `9569bb4f…`, Admin `bc37198c…`, Partner `97a3727c…`; clean PostGIS migrations through 055; Server health/readiness and all portal routes pass. | PASS (local isolated dev-mode smoke) | PostGIS amd64 emulation on ARM; no persistent volumes. |
| Web portal API proxy | Each Site/Admin/Partner `POST /api/v1/auth/refresh` returned expected 401 without session. | PASS (proxy wiring only) | No authenticated workflow was tested in this image stack. |
| Deployable image config / staging / production | Site style manifest build arg is empty; test uses development-mode API and disposable DB/Redis. | BLOCKED / NOT_RELEASED | Obtain approved immutable map manifest and staging configuration, rebuild with release config, then run staging acceptance. |

## Ten supplied mockups — matched-state visual review — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Route result, compact/half/expanded sheet, dark/light theme | Current fixture snapshots reviewed in audit 127; exact route behavior E2E passes. | PARTIAL | Synthetic schematic tiles differ materially from reference imagery; some card composition differs. |
| Dark navigation and layer map references | Current navigation/layer captures reviewed. | NOT_ACCEPTED | No approved satellite/road map style or production map-data manifest. |
| Live rideshare and live bus reference states | Consent/booking and static segment-focus tests exist. | NOT_ACCEPTED | No complete continuously updated driver/bus route, progress and production ETA visual proof in current screenshot fixtures. |
| All ten user mockups | No complete matched-state set accepted. | NOT_ACCEPTED | Obtain approved map-style assets and authorized live data; capture and review all 10 states before visual acceptance. |

## Multimodal routing engine — Server worktree — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| GTFS timetable, transfer feasibility, strategy scoring, worker core | Current dirty Server checkout: focused suites 59/59; full unit 224 pass / 0 fail / 1 opt-in skip; typecheck/lint pass. | PASS (local source checkout) | Dirty source is not the committed PR head; PR #7 remains open/draft. |
| Journey API with current Lviv provider, mode filters, and feasible bus/tram chains | Isolated loopback integration passed after the health eligibility assertion was aligned; six bus routes and bus+tram compositions returned, unsupported modes were blocked; integration workflow completed all suites. | PASS (local isolated integration) | Provider/source behavior verified in local integration only; no staging or commercial-provider acceptance. |
| Dense Lviv candidate coverage and all alternatives | Direct GTFS replay returned 100 candidates/50 route-chain patterns in 1,346 ms with valid segment geometry/stop-time order. | PARTIAL | Search is explicitly truncated and fares are unknown; continue oracle-backed frozen multi-OD recall work. |
| Route-group budget allocator under dense-feed bound | Test-only exact-first-leg prototype passed tiny-feed tests 75/75, but frozen Lviv candidate retained only 2/10/0 itineraries vs 100 baseline per OD, missed 99/94/100 baseline itinerary signatures and preserved none of the three strategy winners; 100k cap did not recover the first OD. Audit 140. | FAIL (experiment rejected) | Keep it isolated; retain truthful truncation warning. Next prototype must schedule by transfer depth as well as route group and preserve baseline first-leg candidates/winners before replay. |
## Navigation screen interaction — exact Site/Server candidate — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Navigation screen controls on Chromium, Firefox, WebKit | Audit 131: 5/5/7 enabled controls clicked; each browser's four button-audit scenarios pass; no stale/no-effect controls or runtime errors. | PASS (local fixture browser acceptance) | Does not test live GPS, physical Safari/iPhone, staging or production. |
| Empty geocoder search provides feedback | `e2e/button-audit.spec.ts` verifies localized minimum-three-character feedback and that invalid forms do not create records. | PASS (local fixture) | Real provider availability and production errors remain separate. |
| Full Firefox/WebKit enabled-control sweep | Audit 130's generic heuristic reported 2/14 candidate no-effect controls; two CTAs and isolated navigation now have semantic follow-up. | PARTIAL | Explicitly classify remaining controls and repeat with fresh GPS fixtures. |

## Site status lifecycle regression — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Clear stale transient feedback between sections and accessible dismiss control | Site PR #24 head `b416da14dd566c0a84a07c2a2eeb7e0f31480aa1`; local typecheck, lint, 105 unit tests, build and bundle check pass; exact-head Site CI `40139361574` succeeds. | PASS (candidate) | PR open/unmerged; release tuple remains unchanged until exact integration review. |
| Conditional CTAs, message dismissal/reset, entered-address swap, and fresh GPS navigation start/end | Audit 132: 15/15 fixture Playwright checks pass across Chromium/Firefox/WebKit; no test GPS sessions left active. | PASS (local fixture E2E) | Not live GPS, staging, production, or physical-device evidence. |
| All visible controls across the web app | Broad WebKit sweep: 179 clicks, 11 generic no-effect candidates, no stale targets/runtime errors/unexpected 5xx. | PARTIAL | Heuristic cases require semantic classification and role-protected/destructive flows require isolated authenticated acceptance. |

## Full UI and cross-repository recheck — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Primary passenger/driver pages and visible controls | Site PR #24 exact source tree `e94d6a12d957c1c906e9569e1d836f72c6ec24b4`; full local fixture E2E 25/25; 179 enabled controls, zero no-effect/stale and no browser errors/5xx. | PASS (local fixture) | Does not cover every role-protected/destructive action or external services. |
| Status feedback accessibility and lifecycle | Dismiss button has accessible name; tab navigation clears stale feedback; successful block action remains visible. Targeted regressions 2/2 on exact PR worktree. | PASS (local fixture) | Candidate remains open PR #24, not part of release manifest yet. |
| Route-map reference states | Snapshot comparison 1/1 PASS without baseline update. | PARTIAL | Synthetic map fixture; complete ten-image reference approval and licensed live-map style remain open. |
| Site code checks | Typecheck, ESLint, 105/105 unit tests and production build pass; hosted PR CI 2/2 pass. | PASS (candidate) | PR #24 is unmerged. |
| Server API and persistence | Typecheck/lint; 224 unit pass and one opt-in skip; loopback Postgres/PostGIS/Redis integrations 29/29 pass. | PASS (local fixture) | Does not establish staging/provider/production operation. |
| Admin / Partner frontends | Admin 2/2 and Partner 3/3 unit tests; typecheck, lint, build pass. | PARTIAL | Authenticated Admin UI/tenant operations not fully covered in this run. |
| iOS native build | Xcode unsigned generic iOS Simulator build passes. | PARTIAL | No interactive simulator acceptance, physical iPhone, signing, APNs or TestFlight. |
| Production release | No deployment or manifest promotion; staging, provider, security/load/recovery, backup/restore, rollback and owner rollout gates remain open. | NOT_RELEASED | `PRODUCTION_READY=false`; do not change manifest status without evidence. |

## Site browser race fix — updated candidate 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Geocoder search on Enter in Chromium, Firefox and WebKit | Site PR #24 head `16f5b21`; place search uses the input's current value; formerly failing WebKit route-map test now passes. Browser compatibility suite 6/6 PASS. Hosted verify jobs `40145665453` and `40145666886` PASS. | PASS (local fixture + hosted CI) | No live geocoder/staging claim. |
| Full primary web fixture scenarios and enabled-control sweep | Updated Site bundle; full E2E 25/25 PASS, 179 enabled controls clicked, 0 no-effect/stale, no runtime errors or unexpected 5xx. | PASS (local fixture E2E) | Conditional/destructive and privileged portal flows remain separate; no production claim. |
| Updated Site code checks | Typecheck, lint, build and 105/105 unit tests PASS; `git diff --check` PASS; hosted verify jobs `40145665453` and `40145666886` PASS. | PASS (candidate) | PR remains open/unmerged. |
| Ten supplied reference mockups | Existing synthetic route-map snapshots pass; no all-image visual sign-off. | NOT_ACCEPTED | Review and implementation of remaining visual states and approved map assets is still open. |

## Orchestrator local release and integration checks — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Central orchestrator typecheck, lint, unit tests, production build and bundle budget | Audit 143: `npm run check:production` exit 0; 256/256 executed unit tests pass, one opt-in case skipped; production build and 51-chunk gzip budget pass. | PASS (local) | Does not validate remote deployment or external providers. |
| Loopback database, booking, navigation, realtime, restart durability and rate-limit integrations | Audit 143: `npm run test:integration` 30/30 pass with local Postgres/PostGIS/Redis and fixtures; migration 048 applied. | PASS (local integration) | Mobility live polling disabled; no staging, production, external providers or physical device. |
| Site functional scenarios on current dirty tree | Audit 142: 25/25 fixture E2E pass, 169 enabled controls observed with effects; the full run skipped screenshot assertions. | PASS (local fixture) | Layers panel screenshot remains about 5% different; ten-mock visual acceptance not complete. |
| Production release | No staging/deployed-SHA or live-provider evidence. | NOT_RELEASED | `PRODUCTION_READY=false`; continue release gates and obtain separate owner release approval. |

## Canonical repository candidate branch smokes — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server candidate branch checks | Audit 144: exact Server checkout typecheck/lint PASS; unit suite 224 PASS, 1 opt-in integration skipped. | PASS (branch-local checks) | Dirty branch not integrated into a release tuple; full branch-specific integration remains separate. |
| Admin and Partner P0 candidate branches | Audit 144: clean isolated P0 refs, each typecheck/lint/build PASS; Admin tests 2/2 and Partner tests 3/3. | PARTIAL | `main` refs contain only README; P0 candidates remain unmerged, tests do not cover authenticated end-to-end portal operations, and Node 25.4.0 differs from required 24.21.0. |
| Six-repository release tuple | Audit 144 records current branch SHAs; no compatibility/integration proof for this complete set. | BLOCKED | Review PR dependency DAG, integrate candidates, and verify against one exact API/migration/Site/iOS tuple. |

## Cross-browser route-focus mismatch between manifest and dirty candidate — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Manifest-pinned route focus behavior | Root browser-compat run against Site SHA `9569bb4f174a4bdf912a6f490e69a359148db342` failed the same selected-segment assertion on Chromium, Firefox and WebKit; three non-selected segments remained dimmed. | FAIL (current manifest candidate) | Promote only after reviewed source integration and immutable SHA verification. |
| Current Site working-tree route focus and baseline browser UX | Rebuilt current dirty Site with isolated map fixtures; browser-compat 6/6 PASS across Chromium/Firefox/WebKit, including route-map focus. | PASS (dirty local candidate) | Not an immutable/reviewed release artifact; Site worktree remains dirty. |

## GTFS service-date expansion — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Direct and composed search includes trips with 48-hour stop times from two prior local service dates | Audit 145; targeted timetable suite 37/37 PASS; full Server unit suite 227 PASS, 1 opt-in integration SKIP; typecheck/lint/diff-check PASS. | PASS (local fixtures) | No live-provider or staging evidence; Server tree is dirty and candidate not committed. |
| Dense-feed completeness and ranking parity | Prior bounded schedulers lost baseline journeys/winners in frozen Lviv replays (audits 140/141). | FAIL (experiments rejected) | Keep rejected prototypes out; require exhaustive small-feed parity and frozen multi-OD identity/winner parity. |

## Open GTFS archive time coverage and empty timetable validation — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Supported open static feeds parse extended service-day times through their observed maximum | Audit 145: 15 live catalog ZIPs, 1,207,262 non-empty time cells; max 63:30 (VD-Express), 0 malformed, 0 values >71h. Fixture covers 63:30 and trips two service dates earlier. | PASS (current source snapshot + fixture) | Does not establish universal GTFS bound or future source behavior. |
| Empty `stop_times.txt` cannot make a GTFS source healthy | Mobility unit test 20/20; Server now exposes `Scheduled stop times`; live Khmelnytsky source remains offline and has a header-only table. | PASS (local code + live observation) | Source owner/archive must restore data before routing availability can be reconsidered. |

## Current Server loopback integration — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server integration against Postgres/PostGIS, Redis, and two local API instances | Audit 145: `npm run test:integration` 29/29 PASS; migration command succeeded; covered Journey schema, live journey, booking/trip edits, navigation, realtime, restart durability and rate-limit sharing. | PASS (isolated loopback integration) | Mobility health polling disabled; not live providers, staging, production, load, recovery restore, or physical-device acceptance. |

## Frozen Lviv route-search parity — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Dense-feed search returns complete candidates and preserves strategy winners | Audit 145 replay: 100 returned / 800 retained candidates; search truncated by stop selection, search budget, and candidate sampling. 0 comparable fares. Prior schedulers lost baseline chains/winners (audits 140/141). | FAIL | Build exhaustive small-feed oracle and frozen multi-OD identity/winner parity before changing/promoting search. |
| Returned benchmark segments have required schedule details and geometry | Audit 145: 329/329 with geometry and valid stop-time details; 0 detail errors. | PASS (current local replay only) | Does not establish complete search, fare coverage, live ETA, staging or production behavior. |

## Current-working-tree full Web E2E — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Primary passenger/driver browser flows and responsive shell | Audit 145: full Playwright 25/25 PASS on current dirty local Site/Server worktrees, separate loopback E2E DB and map/geocoder/OSRM fixtures. | PASS (local dirty candidate) | Re-run on clean immutable compatible SHA tuple and staging; local E2E fixtures do not prove provider or production behavior. |
| Main screen button actions produce visible behavior | Audit 145 button audit: 169 controls clicked; 0 without visible effect; no browser errors reported by the suite. | PASS (covered screens) | Not a literal proof for every route/action in every role; Admin/Partner roles, accessibility and physical devices remain separate gates. |
| Route-map and layer screenshots | Audit 145: combined route map scenario passed after review/update of two changed light layer baselines; route states and light/dark passed. | PASS (current local fixture visuals) | Compare all required states against supplied mockups and repeat on immutable release SHA. |
- The reviewed screenshot baseline change is committed in root SHA `0c1e9a4051cb5ea9a7b31b89f2d9dc609c19c916`; it changes only two light-mode layer PNGs. It is not a product release or deployed artifact.

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Chromium/Firefox/WebKit compatibility for responsive shell and route-map interactions | Audit 145: 6/6 Playwright compatibility checks pass across all three engines on current dirty Site/Server with local map/geocoder/OSRM fixtures. | PASS (local browser automation) | Physical Safari/iPhone, licensed production map, live feeds and staging remain NOT_TESTED. |

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site current working-tree static checks | Audit 145: production build, TypeScript, ESLint PASS; unit suite 98/98 PASS. | PASS (dirty local tree) | Verify bundle budget and repeat on clean exact-SHA candidate. |

## GTFS exhaustive small-feed oracle — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Small-feed one-/two-transfer feasible-chain completeness and three-strategy winner parity | Audit 145: independent fixture enumeration compared exact feasible chains and FASTEST/CHEAPEST/BALANCED winners; timetable 40/40, Server unit 231 pass / 1 opt-in skip, typecheck/lint pass. | PASS (small deterministic fixtures) | Current dirty Server tree only. Does not resolve dense-feed Lviv truncation; expand temporal/transfer/RT cases and frozen multi-OD parity. |
| Dense-feed search completeness and production strategy ranking | Audit 145 frozen Lviv replay remains truncated at stop selection, search budget and candidate sampling. Fare check corrected below: current replays have UAH tariffs, but sampled results do not establish exhaustive winners. | FAIL / OPEN | Do not claim exhaustive search; preserve flags pending chain identity and winner parity on several ODs. |

## Fresh dense Lviv replay — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Search preserves complete dense-feed coverage and useful results under bounded execution | Audit 145 replay: 1,197 ms, 100 returned/800 retained, 11,475 explored steps, stop-selection/search-budget/candidate-sampling all truncated. Corrected tariff query found 100/100 UAH-priced results. | FAIL / OPEN | Keep incomplete state visible. Design baseline-preserving alternative discovery and validate exact chain/winner parity over frozen multi-OD replays. |
| Geometry and stop-time validity for returned results | Audit 145: 329/329 returned segments had correct geometry endpoints and chronological stop times. | PASS (local current-feed replay) | Node 25.4.0; repeat exact candidate on declared Node 24.21.0 and staging before release. |

## Lviv fare-field correction and baseline replay — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current Lviv adult fare and LeoCard transfer source metadata | Audit 145 correction: official ATP-1 payment page lists current single fares and 40-minute LeoCard transfer; only those matching catalog records now carry `lastVerifiedAt=2026-10-25`. Fare tests 9/9 PASS. | PASS (source and metadata) | This source check does not establish fare coverage for other cities, private minibuses or booking. |
| Lviv multi-OD static-tariff calculation | Audit 145: 100/100 comparable UAH values on each of three repeated baseline ODs; stable within two runs. All strategy scores choose the same 23 UAH option under this flat fare sample. | PASS (current local static feed + tariff registry) | Search remains truncated on all six runs; this does not prove exhaustive or globally cheapest results. |
| Server end-to-end local integration after tariff metadata change | Audit 145: loopback Postgres/PostGIS/Redis integration 29/29 PASS; unit 232 PASS / 1 opt-in SKIP; typecheck/lint pass. | PASS (local) | Not staging, provider live acceptance, device, production deployment, load or recovery proof. |

## GTFS calendar and realtime transfer oracle — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Composed search respects added/removed service dates, canceled trips, realtime delays, and minimum transfer time together | Audit 146: exact tiny-feed oracle 1/1 PASS; full Server suite 233 PASS / 0 FAIL / 1 opt-in integration SKIP; typecheck and targeted lint PASS; isolated Server commit `92a26a3f617f32d644a66c0af46cba096ccb0ce0`. | PASS (local fixture) | No production algorithm change. Dense-feed search remains truncated; run frozen multi-OD chain and strategy parity before changing search budget. |

## Integrated GTFS candidate and Site truncation disclosure — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server integration candidate | Audit 147: local branch `codex/production-routing-integration-20261025` @ `269a288ac3a8e0bceaa86c414ecb46dd0093f735`; unit 310 PASS / 3 opt-in SKIP, typecheck/lint PASS, loopback integration 30/30 PASS. | PASS (local isolated) | Not pushed; Node 25.4.0 differs from declared 24.21.0. |
| Frozen Lviv replay parity | Audit 147: three ordered result hashes match baseline and are stable across five repeats. | PASS (baseline parity only) | All three ODs report truncation/result limit reached; completeness NOT_MET. |
| Site search-truncation response contract | Site `codex/site-production-route-contract-20261025` @ `192a526fedb415bcb9f9d3cfff1dac65fa05dd03`; 107/107 unit, typecheck, lint, build and bundle gate PASS. | PASS (local) | Not paired with Server in a release manifest; browser text visual recheck NOT_TESTED. |
| Production release | No allowed deploy or deployed-SHA HTTPS smoke. | NOT_RELEASED | Staging, external provider rights, security/load, physical iPhone, backup/restore/rollback and owner approval remain open. |

## Server PR #38/#39 current-base integration — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current Server + GTFS stack | Audit 148: exact local merge `38f17b88f98c8530f8090cfc6745cd334c87e53c`; full unit 315 PASS / 3 opt-in SKIP; typecheck/lint PASS; loopback DB/API/Redis integration 30/30 PASS. | PASS (local integration) | Node 25.4.0 vs declared 24.21.0; hosted exact-head CI not run. |
| PR #39 retention behavior | Frozen comparison against PR #38, five repeats per OD; all previous strategy winners retained, plus 23/1/2 result identities on three ODs. | PASS (candidate parity/diversity) | Search remains truncated for all three ODs; +8%/+1%/+17% median latency; no load or memory test. |
| Exact Site/Server tuple | No manifest currently pins Server `38f17b8…` with Site based on PR #24. | NOT_TESTED | Continue isolated Site integration and exact contract acceptance. |

## Exact Server/Site browser acceptance — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Exact Site/Server route-search browser contract | Audit 149: Site `254b5b2d0674ec2107269b1e0e93895269c37f15` with Server `38f17b88f98c8530f8090cfc6745cd334c87e53c`; local API route-search URL/refresh E2E 1/1 PASS. | PASS (local fixture) | Not staging/live providers; exact pair not in shared release manifest. |
| Route map, selection, stops, sheet states, light/dark and navigation | Audit 149: full route-map E2E 1/1 PASS using deterministic local map and journey fixtures; Site unit 107/107 PASS. | PASS (local fixture) | Supplied reference-image parity remains NOT_TESTED; screenshot baselines unchanged. |
| iOS pin matches exact Site/Server pair | Current iOS release candidate pins older Site/Server commits; this pair is not yet embedded. | NOT_TESTED | Update isolated iOS candidate only after verifying exact local checkout/build inputs. |
| Production release | No staging, authorized deployment, or deployed-SHA HTTPS smoke. | NOT_RELEASED | Provider, security, load, backup/restore, rollback, physical iPhone and owner rollout gates remain open. |

## Exact RC control/browser acceptance — 2026-10-25 (audit 150)

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Audited production-route controls respond | 169 controls clicked, 0 no-effect, 0 stale; 4 button-audit scenarios PASS. | PASS (local fixture) | Audited 15 routes only; hidden/role-specific/external states not exhausted. |
| Core exact-pair web journeys | Site `9963aee...` + Server `38f17b8...`; functional suite 25/25 PASS. | PASS (local fixture) | Not live providers or staging. |
| Responsive Chromium/Firefox/WebKit and route map | 6/6 browser cases PASS at 320/390/430/768/1280/1440 widths; map/sheet/light-dark assertions included. | PASS (local fixture) | Does not replace visual review against all ten owner mockups or physical Safari. |
| Site/Server hosted checks | Site #25 run `40158631306`; Server #40 run `40157852445`; both exact-head PASS. | PASS (CI) | Draft stacked PRs; not merged or deployed. |
| iOS exact Site/Server pin and simulator | iOS `17da5c0...` manifest matches Site `9963aee...` / Server `38f17b8...`; Capacitor sync, Xcode Simulator and hosted CI pass. | PASS (simulator/CI) | Physical iPhone, live API, background GPS, APNs, signing/TestFlight NOT_TESTED. |
| Full production release | No verified staging or deployed HTTPS origin/SHA; external and operational gates remain open. | NOT_RELEASED | Provider entitlements, Admin/Partner integration, security/load, backup/restore/rollback and owner approval remain. |

## Cross-surface recheck — 2026-10-25

| Area | Status | Evidence / gap |
|---|---|---|
| Server local | PASS (local only) | Exact `38f17b88f98c8530f8090cfc6745cd334c87e53c`; 315 unit PASS / 3 opt-in skipped; 30/30 loopback Postgres/PostGIS/Redis integration PASS. |
| Site browser | PARTIAL | 24/25 E2E against exact Site `9963aee9431c22cf118b965f0356e586951b87de`; 179 controls audited with zero inert. One screenshot baseline came from a newer dirty root UI and is not a same-SHA visual comparison. |
| Admin | PARTIAL | Exact `9dbf7db0a935498ac40c98b19bc36bce056d630d`; typecheck/lint/tests/build PASS, 2 UI tests. Authenticated browser API workflow not run in this checkpoint. |
| Partner | PARTIAL | Exact `c639257a7f28aeda5b378a816038b01651146b83`; typecheck/lint/tests/build PASS, 3 UI tests. Authenticated browser API workflow not run in this checkpoint. Server tenant-isolation API integration is covered separately. |
| Visual reference acceptance | NOT_TESTED | No matching production-route screenshot set was reviewed against all ten supplied reference designs in this checkpoint. |
| Staging / production | NOT_TESTED | No deployment or staging environment used; no production deploy performed. |

## Admin/Partner authenticated preview — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin partner-list default filters | Admin PR #1 `e290ca8f52ea9b2289b632495ff6c13f7ff7f28f`; omits empty `status`/`search`; regression tests prove blank omission and selected filter encoding; GitHub Actions run `40162261746` passed. | PASS (local and hosted CI) | No staging or production claim. |
| Admin authenticated pages | Local production preview: login, overview, partners, providers, integrations, audit. | PASS (local API/DB) | No production host or staging. |
| Partner onboarding and Admin approval | Local preview on loopback Server `38f17b88f98c8530f8090cfc6745cd334c87e53c`: submit organization/module selection → Admin sees row → approve → Partner refreshed active state. | PASS (isolated local E2E) | Not an external partner or production transaction. |
| Partner PR unit/build checks | PR #1 exact head `97a3727cc395dea092af6e3e24d6822370c2bc63`: 3/3 unit, typecheck, lint, build on Node 24.21.0. | PASS (local exact PR head) | Provider onboarding and production tenant acceptance remain separate gates. |
| Full platform production | Staging, provider entitlements, security/load/recovery, backup/restore, rollback, device and deployed SHA gates remain open. | NOT_RELEASED | No production deployment performed. |

## GTFS query-weight experiment — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Query-directed route-budget retention | Audit 157: exact Server `38f17b8…`, same frozen Lviv feed/query, candidate focused tests 81/81 PASS; lost 1 trip chain and 4 route chains, changed BALANCED winner, remained truncated. | FAIL (candidate rejected) | Try additive discovery that retains immutable baseline identities; do not promote or suppress truncation. |
| Production map basemap/imagery for reference visuals | Site `docs/PRODUCTION_MAP_SETUP.md`: no immutable style/data manifest/CDN or licensed satellite URL configured. | BLOCKED_EXTERNAL | Provision/authorize a versioned map asset source, then verify attribution, tiles, fallbacks, performance and screenshots. |

| Exact Site candidate local checks | Site `9963aee9431c22cf118b965f0356e586951b87de`: typecheck, lint, build, bundle budget, 108 tests. | PASS (local only) | Does not establish staging, external APIs, visual fidelity across protected screens, or production readiness. |
| Exact Server candidate local checks | Server `38f17b88f98c8530f8090cfc6745cd334c87e53c`: typecheck/lint, 315 tests; 3 opt-in integration tests skipped. | PASS (local only; skips remain open) | Launch isolated integration suites with their test-only services and fixtures. |
| iOS exact Site synchronization | iOS `4353cec3cacbaf662ceea047402f361024292b22` + Site `9963aee9431c22cf118b965f0356e586951b87de`: simulator build/install/launch on iPhone 16 Pro Max Simulator. | PASS (shell launch only) | API/authenticated journeys, location permission, GPS, notifications and physical iPhone remain NOT_TESTED. |
| Passenger authenticated Site E2E | Local unauthenticated route redirects to login; SMS provider unavailable and API was not running during simulator check. | NOT_TESTED | Use isolated development OTP/test fixtures; no auth bypass. |

## 2026-10-25 latest local acceptance

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Selected-city transit map layers | Site `7aed5344218058b024f5c269b36b03577d94026e`; Lviv Metro unavailable and Kyiv Metro available in local authenticated browser; map-layer suite 6/6 | PASS (local) | Hosted CI pending at checkpoint; no production tiles configured |
| Passenger search and trip details | Local Site + Server `38f17b88f98c8530f8090cfc6745cd334c87e53c`; autocomplete, route search, strategy switching, stop times, focus and preview exercised | PARTIAL (local) | One search disclosed truncation/missing modes; transactions, payments, live GPS and provider booking not tested |
| Site checks | Full unit 109/109, typecheck, lint, build, bundle gate | PASS (local) | Not staging or production proof |
| Mockup visual parity / licensed map | No production basemap/satellite style configured | BLOCKED_EXTERNAL / NOT_ACCEPTED | Configure licensed, versioned map assets before visual acceptance |
| Release | No staging/deployed SHA, device acceptance or release gates closed | NOT_RELEASED | See blockers and audit 159 |
| Site hosted CI | PR run 40163680187 and push run 40163677847 green for exact `7aed5344218058b024f5c269b36b03577d94026e` | PASS (hosted CI) | Does not close staging, production, provider or device gates |
| iOS exact Site sync | iOS PR #14 head `7dfd35bf5f06169d7df82fa8d0879fcaf02431b5` pins Site `7aed5344218058b024f5c269b36b03577d94026e` + Server `38f17b88f98c8530f8090cfc6745cd334c87e53c`; Capacitor sync and simulator launch PASS | PASS (local shell/simulator; hosted CI pending) | Welcome screen only; authenticated flows, live API, GPS, physical iPhone and background behavior NOT_TESTED |
| iOS hosted CI exact pin | Runs 40163988537 and 40163992039 passed for iOS `7dfd35bf5f06169d7df82fa8d0879fcaf02431b5`, pinning current Site/Server SHAs | PASS (hosted simulator build) | Not physical-device, authenticated app, live provider, staging or App Store acceptance |
| Exact tuple Docker build | Server/Site/Admin/Partner pinned trees materialized from exact SHAs; local compose config and 4 linux/arm64 image builds pass; Web/Admin/Partner static container smoke 4 checks each pass | PASS (local build/static smoke) | Unpublished; API image runtime not separately tested; no licensed map config/staging |
| Central exact tuple CI materialization/E2E | PR #5 run 40164409617: lint/typecheck/unit/migration/integration/build/bundle PASS; failed before materialization because Actions secret `MARSHGO_REPOS_READ_TOKEN` is unset | BLOCKED_EXTERNAL | Set least-privilege read-only token secret and rerun; hosted Docker/E2E were skipped, not passed |


## Exact RC10 whole-browser candidate — 2026-10-25

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Main-screen controls | Exact Server/Site E2E: 169 clicks, 0 inert, 0 stale | PASS (local fixture browser) | Not every account/role/provider action is covered by this sweep |
| Passenger search and route presentation | Exact RC10 E2E: address selection/swap, date/time, strategies, category ordering, stop details, sheet states and segment focus | PASS (local fixtures) | Routing graph can truncate; fixtures do not prove external fares/schedules |
| Passenger/driver marketplace | Two-account booking, persisted chat, two riders, ordered stops, deviation reroute | PASS (isolated local API/DB) | No payment, live external provider or production notification claim |
| Navigation/rendezvous | Browser GPS, permission denial recovery, mutual consent/revocation, participant positions and straight-line distance | PASS (browser fixtures/local API) | Physical background GPS and live driver approach/road route not tested |
| E2E suite | `npm run test:e2e`: 25/25 on Server `38f17b88f98c8530f8090cfc6745cd334c87e53c` + Site `7aed5344218058b024f5c269b36b03577d94026e` | PASS (local fixture) | Not staging or production acceptance |
| Browser compatibility | `npm run test:browser-compat`: 6/6 across Chromium, Firefox and WebKit on the same exact tuple | PASS (local fixture) | Does not test physical Safari/iPhone or background behavior |
| Ten supplied mockups | Three current screenshot baselines reviewed/refreshed; licensed satellite/live-data gaps remain | PARTIAL | Approved styles, all reference states, current live data and physical-device comparison required |
| Release gates | No production deploy; manifest remains `NOT_RELEASED`, `production_ready=false` | BLOCKED | Staging, image publication/deployment, security/load/recovery, backup/restore, physical iPhone and owner approval remain open |

Evidence: [audit 161](audit/161_EXACT_RC10_FULL_E2E_2026-10-25.md).


## Exact RC10 API image runtime — 2026-10-25

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| API container runtime | Exact image in local development mode: `/healthz` 200; `/readyz` 200; isolated Postgres and Redis connected | PASS (local dev-mode smoke) | Does not prove production-mode config or external integration |
| Production configuration gate | Startup rejects missing Twilio configuration; approved HTTPS routing/geocoding/map endpoints are absent | BLOCKED_EXTERNAL | Supply real authorized credentials and immutable approved endpoints, then run isolated production-config/staging acceptance |

Evidence: [audit 162](audit/162_RC10_API_IMAGE_RUNTIME_AND_PROD_CONFIG_GATE_2026-10-25.md).

## Dirty Site route-map visual follow-up — 2026-10-25

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Mobile map/layer-sheet composition | Dirty Site `6961afcf008e2c845c0fde68c687ce61fe744f2f`; 60dvh sheet keeps map visible, scrolls the full layer list, and ends above global navigation | PASS (local fixture visual/geometry) | Not physical iPhone; other pages/mockups still require review |
| Route/map/navigation visual flow | Focused Playwright fixture E2E 1/1 after reviewed screenshot updates | PASS (local fixture) | No staging, live provider, licensed production map, or deployed artifact |
| Dirty Site checks | typecheck, lint, build, bundle budget (16 chunks <=350 KB gzip), diff check; 98/98 unit tests | PASS (local) | Runtime Node 25.4.0 differs from repo pin 24.21.0 |
| Overall visual parity | Focused scenario passes; other production pages and full mockup set are not accepted | PARTIAL / NOT_ACCEPTED | Continue review of all required pages and light/dark references; do not bulk-refresh snapshots |
| Release gates | Staging, physical iPhone, external entitlements, security/load/recovery, backup/restore and owner approval remain open | NOT_RELEASED | `PRODUCTION_READY=false` |

Evidence: [audit 168](audit/168_DIRTY_SITE_ROUTE_MAP_VISUAL_ACCEPTANCE_2026-10-25.md).

## Dirty Site full control and responsive acceptance — 2026-10-25

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Enabled controls on main production routes | Dirty Site bundle + dirty Server API, isolated E2E DB; 179 visible controls clicked, 0 inert/stale, no page errors/unexpected 5xx | PASS (local fixture) | The sweep covers configured routes and safe controls, not every account/role/provider state |
| Responsive Home/Search/navigation shell | 1/1 browser check at 320/390/430/768/1280/1440; short Home action is reachable after internal-scroll fix | PASS (local fixture) | Not physical device or production content |
| Navigation, route sheet, layers, GPS start/end | Route-map 1/1 and simulated-GPS CTA 1/1 | PASS (local fixture) | GPS is simulated; background iOS, live driver GPS and production routing remain NOT_TESTED |
| Site source checks | Typecheck, ESLint, 98/98 unit tests, fixture-configured build, bundle budget and diff check | PASS (local) | Dirty tree; exact immutable release tuple not verified here |
| Release readiness | Licensed map assets, full visual-reference parity, staging, live-provider and device gates remain open | NOT_RELEASED | `PRODUCTION_READY=false` |

Evidence: [audit 169](audit/169_DIRTY_SITE_FULL_CONTROL_AND_RESPONSIVE_ACCEPTANCE_2026-10-25.md).

## Current dirty-worktree Web acceptance — 2026-10-25

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Production-path frontend checks | `npm run check:production`: typecheck, ESLint, unit tests, build and bundle gate PASS; 256 pass, 1 opt-in test skipped | PASS (local) | No staging/production proof |
| Main-screen buttons and core flows | Current dirty-worktree Playwright fixture suite 25/25 PASS; 178 visible controls, 0 inert, 0 stale | PASS (local fixture) | Live providers and payment APIs not exercised |
| Route/map/layer panel interactions | Functional route scenario passes Chromium/Firefox/WebKit 3/3; layer panel no longer overlaps bottom nav | PASS (local fixture) | No physical iPhone/Safari background acceptance |
| Results screen visual snapshot | `journey-results-light.png` differs from saved reference by 56,201 pixels (17%) | NOT_ACCEPTED | Review against supplied mockups; no automatic baseline refresh |
| All ten supplied design mockups | Not all reference states captured and reviewed on exact candidate | NOT_ACCEPTED | Need paired light/dark screenshots and licensed map imagery/live data where the mock requires them |
| Release | No staging, deployment, HTTPS smoke or deployed SHA | NOT_RELEASED | External and owner gates remain open; `PRODUCTION_READY=false` |

## 2026-10-25 — exact candidate layer-sheet repair and full fixture E2E

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Mobile layers sheet leaves map and global navigation visible | Site PR #26 exact SHA `1b5986de5af875c5c2945df4752c23603c135ed3`, cap `min(60dvh, available safe-area height)`; focused route/map E2E scrolls to the final infrastructure row and passes | PASS (candidate/local fixture) | Draft PR stacked on Site #25; not in release manifest; no staging |
| Site quality checks | Node 24.21.0 typecheck, lint, 109/109 unit tests, production build; exact-head hosted Site CI `40192350958` | PASS | Does not prove all-ten-reference pixel parity |
| Root quality checks after E2E assertion alignment | Node 24.21.0 typecheck/lint/build/bundle PASS; 256 unit pass, 1 opt-in integration skip | PASS (local) | Opt-in skip is not a pass; root tree and E2E harness are dirty |
| Full production-route fixture browser acceptance | 25/25 E2E PASS against Server #40 plus Site #25 and exact #26 source; 179 visible controls, 0 inert | PASS (local deterministic fixtures) | No external feeds, production payment/provider operations, staging or live map assets |
| Screenshot/mockup acceptance | Full suite ran with screenshot comparison disabled; panel geometry and scrolling assertions pass | NOT_ACCEPTED | Match and manually review all ten reference states with approved map assets and truthful live-state sources |
| Root hosted release workflow | CI `40190716714` passes all checks through bundle, then fails at private Admin/Partner materialization because Actions secret `MARSHGO_REPOS_READ_TOKEN` is unset; Security `40190716717` passes | BLOCKED_EXTERNAL | Configure authorized least-privilege read-only secret; do not bypass |
| Production | No staging or deployment; PR #26 not promoted into manifest | NOT_RELEASED | Provider/map entitlements, staging, physical-device, security/performance/recovery, backup/restore/rollback and owner gates remain open |

Evidence: [audit 179](audit/179_SITE_LAYER_SHEET_AND_FULL_E2E_2026-10-25.md).

Evidence: [audit 165](audit/165_CURRENT_DIRTY_WORKTREE_WEB_ACCEPTANCE_2026-10-25.md).

## Dirty full-worktree Web E2E — 2026-10-25

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Local production quality checks | `npm run check:production`; 256 unit pass, 1 opt-in integration skip; typecheck/lint/build/bundle pass | PASS (local) | Skip is not pass; runtime is not pinned |
| Full browser flows | `npm run test:e2e`: 25/25; two-account marketplace, GPS/reroute, route map, consent, responsive and account lifecycle | PASS (fixture-backed local E2E) | Dirty Site bundle + candidate Server, not a coherent exact-SHA release tuple |
| Production-route enabled controls | 179 clicked, 0 inert, 0 changed before click | PASS (local) | Main-route inventory, not every role/provider/error permutation |
| Route-map visual snapshot | Focused canonical flow 1/1 passes; inspection showed Playwright created a missing browser-specific snapshot during the run | NOT_ACCEPTED | The new snapshot is not an approved reference. Reconcile against the supplied mockups; prior 17% delta was measured against a different saved baseline |
| One canonical route lip across result/map views | Shared `JourneySegmentStrip` exists; top metrics/actions are implemented separately in `JourneyResultsPanel.tsx` and `JourneyRouteMapScreen.tsx` | PARTIAL | Implement and validate the full shared three-row component against approved mock states |
| Live providers and map assets | Local fixtures; no licensed imagery/live API verified in this run | NOT_TESTED / BLOCKED_EXTERNAL | Configure authorized provider endpoints and production map entitlements |
| Deployment and release gates | No current staging/deployed SHA; physical-device, security/load/recovery, backup/restore gates remain open | NOT_RELEASED | Complete exact-candidate staging and release gates; keep `PRODUCTION_READY=false` |

Evidence: [audit 170](audit/170_DIRTY_WORKTREE_FULL_E2E_2026-10-25.md).

## GTFS frozen replay and search-budget experiments — 2026-10-25

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| GTFS transfer/time/realtime/strategy correctness on small exhaustive oracle | Server `feature/transport-layer-availability` at dirty HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; Node 24.21.0; timetable/realtime/scoring suites 64/64 PASS, including exhaustive one-/two-transfer chain and three-winner checks | PASS (deterministic fixtures) | Does not prove dense-feed completeness or production providers |
| Frozen Lviv dense-feed result stability | Five repeats on exact HEAD and dirty timetable source; identical itinerary-set hashes/winners for all 3 ODs | PASS (repeatability) | All ODs remain `searchTruncated=true`; stability is not completeness |
| Higher per-first-leg budget | 128→512 increased latency and reduced trip-chain diversity; reverted | REJECTED | No change retained |
| Higher candidate cap | 200→500 added trip/route chains and kept strategy winners but displaced 27–62/100 previous IDs, cost 14–46% median latency, and stayed truncated; reverted | REJECTED | Design an immutable baseline + additive discovery merge before considering promotion |
| Candidate cap 200→300 | Five repeats per frozen OD kept all three winners but displaced 18–28/100 baseline IDs; one OD lost trip-chain diversity, latency rose 14–43%, and all searches remained truncated; reverted | REJECTED | Do not tune a scalar cap; discover alternatives additively and preserve the baseline pool |
| Exact Server RC40 candidate `38f17b88f98c8530f8090cfc6745cd334c87e53c` | Node 24.21.0: 315 unit pass/3 opt-in skips, typecheck/lint PASS; isolated PostGIS/Redis integration 30/30 PASS. Frozen three-OD replay has more chains but median 1,731–2,927 ms vs 707–1,307 ms baseline, remains truncated, and misses the 33-minute baseline FASTEST itinerary for Naukova→Sykhiv (returns 35.5 min). | NOT_ACCEPTED_AS_REPLACEMENT | Preserve baseline winners and add alternatives; profile memory/latency; exact cross-repository/staging gates remain separate |

| Server GTFS nearby-stop retention PR #41 head `4cd3b998313ef5e2596f2cf9d7fc998e2f3e11b7` (parent PR #40 head `38f17b88f98c8530f8090cfc6745cd334c87e53c`) | Node 24.21.0: 316 unit pass/3 opt-in skips, typecheck/lint PASS; isolated PostGIS/Redis integration 30/30 PASS. Five-repeat frozen replay is deterministic and restores Naukova 33-minute FASTEST/CHEAPEST; Holosko winners improve 54→47 min. Top-100 identity overlap vs release `134ed017`: 45/100 Holosko, 83/100 Naukova, 74/100 Rynok; vs PR #40: 65/100, 83/100, 83/100; route-chain overlap vs PR #40: 34/43, 37/40, 30/32. Representative changed routes show shorter alternatives, but broader completeness is unproven. All three ODs remain truncated, medians 2,080–3,615 ms vs 707–1,307 ms frozen baseline. Hosted Server CI run `40188242109`: SUCCESS on exact head. | PASS (local candidate checks), QUALITY REVIEW IN PROGRESS, NOT_RELEASED | Address truncation and profile dense-query latency/memory; review API ordering/limit semantics; exact cross-repository/staging/release gates remain separate. See [audits 175–176](audit/175_GTFS_NEARBY_TRANSFER_RETENTION_REPAIR_2026-10-25.md) |

Evidence: [audit 172](audit/172_GTFS_SEARCH_BUDGET_AB_NODE24_2026-10-25.md), [audit 173](audit/173_GTFS_CANDIDATE_CAP_300_NODE24_2026-10-25.md), [audit 174](audit/174_SERVER_RC40_LOCAL_ACCEPTANCE_AND_FROZEN_REPLAY_2026-10-25.md), [audit 175](audit/175_GTFS_NEARBY_TRANSFER_RETENTION_REPAIR_2026-10-25.md).


## Exact PR #41 head c217d6e — paired Node 24 replay

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server GTFS nearby-stop candidate cache, exact head `c217d6e4aa33ba032464428415c0694c35ad4fd3` | Node 24.21.0: 316 unit PASS, 0 FAIL, 3 opt-in integration SKIP; typecheck/lint/diff PASS. Hosted run `40189573482` SUCCESS. Seven-pair A/B against `4cd3b998313ef5e2596f2cf9d7fc998e2f3e11b7`: medians 3,092.83→3,011.76 ms Holosko, 2,119.80→2,008.69 ms Naukova, 3,418.66→3,240.45 ms Rynok. All ordered top-100 hashes and strategy winners identical. | PASS (candidate checks); PARTIAL (routing completeness); NOT_RELEASED | All three ODs remain truncated and result-limited. Continue bounded-search completeness, route quality, cross-repository and staging/release gates. See [audit 177](audit/177_GTFS_NEARBY_RETENTION_CACHE_AB_2026-10-25.md). |


## Exact integration run on c217d6e

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Exact Server head `c217d6e4aa33ba032464428415c0694c35ad4fd3` database/realtime integration | Node 24.21.0 full opt-in suite exited 0: 30 PASS / 0 FAIL / 0 SKIP. Fresh loopback DB `marshgo_e2e_c217_verify`; isolated Redis DB 14. Existing DBs and Redis DB 0 untouched; service processes exited and Postgres/Redis containers remain healthy. | PASS (isolated local integration) | Not staging, live provider, physical-device, load, or production acceptance. Dense GTFS still truncated. See audit 177. The 25k→50k search-window screen was rejected; see audit 178. |

## Site PR #26 cross-browser recheck — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Responsive entry/home/search and canonical route map on Chromium, Firefox and WebKit | Exact Site #26 SHA `1b5986de5af875c5c2945df4752c23603c135ed3` + Server #40 `38f17b88f98c8530f8090cfc6745cd334c87e53c`; 6/6 Playwright cases PASS on Node 24.22.1. Responsive widths 320/390/430/768/1280/1440; route sheet, stops, focus and light/dark checks pass. Audit 180. | PASS (local fixtures) | Screenshot comparison disabled; no ten-mockup pixel sign-off, live providers, staging, physical iPhone or production acceptance. PR #26 remains draft and outside the release manifest. |

## Exact-manifest Admin/Partner local checks — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Admin and Partner package checks | Manifest Admin `f39c4b74839a393f4487c830930669eabc8c0390`: typecheck/lint/build + 4/4 unit PASS. Partner `97a3727cc395dea092af6e3e24d6822370c2bc63`: typecheck/lint/build + 3/3 unit PASS. Audit 181. | PASS (local packages; Node patch mismatch noted) | Local runtime 24.22.1 vs exact package pin 24.21.0. Authenticated Admin and deployed cross-tenant acceptance NOT_TESTED; root hosted materialization remains blocked. |

## Latest dirty-worktree Web gate — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Production-route web flows and visible controls | Final local fixture E2E 25/25 PASS; audit clicked 178 visible controls, 0 with no observed effect, 0 stale. The focused post-timeout CTA audit and full-suite repeat both pass. | PASS (local fixtures) | Does not cover every authenticated Admin/Partner action or deployment. |
| Route map and geometry notice placement | Preserves provider geometry and keeps its warning in the route summary rather than covering the map; route-map scenario passes in Chromium/Firefox/WebKit 3/3 after the change. | PASS (local fixture) | Screenshot pixel comparison disabled; ten-mockup visual sign-off remains NOT_TESTED. |
| Responsive entry/home/search and map flow | 6/6 selected Chromium/Firefox/WebKit responsive/map cases pass at 320/390/430/768/1280/1440 px. | PASS (local fixtures) | No physical iPhone/Safari acceptance. |
| Local production quality gate | Node 24.21.0 typecheck/lint/build/bundle pass; 256 unit pass / 0 fail / 1 opt-in database skip. | PASS (local) | Opt-in DB test skipped; not a staging/production gate. |
| Production deployment | Manifest still has `production_ready=false`, deployed Site SHA null; no staging/HTTPS smoke. | NOT_RELEASED | See external blockers and release approval gate; do not deploy from mixed dirty root. |

## GTFS truncation transparency — exact draft candidates — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server reports independent causes of incomplete GTFS search | Server PR #41 SHA `70e11d8d8730e54311f13d73953ab565fd6b432a`; API returns seven boolean fields and integration assertions verify their names/types. Exact CI runs `40194603311`, `40194607141` PASS. | PASS (draft candidate) | PR #41 remains open/draft and stacked on #40/#39/#38; not a production merge. |
| Site explains incomplete GTFS results | Site PR #27 SHA `cc1499573732a41e8ff31d7ab634d15421d45df1`; 6 focused tests, typecheck and lint PASS; exact CI runs `40201475281`, `40201478772` PASS. | PASS (draft candidate) | PR #27 remains open/draft and stacked on #26/#25/#24; integration with Server tuple is not merged. |
| Dense Lviv GTFS candidate completeness | Three frozen ODs on exact Server PR #41 all return 100 results with `searchTruncated=true` and `candidateGraphTruncated=true`; Naukova demand estimate 194,024 vs 100,000 graph budget. | FAIL (completeness) | Keep warning visible; optimize query-directed candidate generation and prove oracle/recall/resource gains before release. Node 25.4 diagnostic, not production SLA. See audit 197. |

## Production UI phone acceptance — current dirty checkout — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Home action order | Current production-source Chromium test asserts Navigation / Transport Map / Publish Trip / Find Route at six viewport widths. | PASS (local fixture) | Not part of an integrated/merged Site SHA. |
| Route-results phone density | Current production-source route E2E requires at least five complete alternatives above the fold at 402×852; 11 px segmented line and all per-segment labels/fare remain. | PASS (local fixture) | Compare design against the supplied reference images and review dark/light captures. |
| Full local browser suite | 24/25 pass; button sweep 179 actions, 0 without visible effect; route-map behavior passes with visual screenshot assertion disabled. | PARTIAL | Full run's one failure is pixel baseline `journey-results-light.png`, 38,395 pixels / 12% different. Old baseline not auto-updated; see audit 201. |
| Supplied mockup visual acceptance | Production pages not yet accepted reference-by-reference across all six navigation states and both themes. | NOT_ACCEPTED | Review actual current captures against uploaded references, address proven mismatches, then re-run visual acceptance. |
| Admin / Partner authenticated browser journeys | Root E2E currently contains six specs for passenger/driver, navigation, maps, and rendezvous; no authenticated Admin or Partner browser journey is present. Existing Admin/Partner checks are unit/build/CI-level only. | NOT_TESTED (browser acceptance) | Add exact-SHA local API-backed Admin/Partner journeys for role gating, tenant isolation, onboarding, moderation/provider operations, and denial paths before release. |
| Staging/device acceptance | Current local fixture only; no deployed staging or physical iPhone used. | NOT_TESTED | Keep production release blocked pending external release gates. |

## Site #27 ↔ Server #42 exact contract recheck — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site presents GTFS search truncation causes returned by Server | Site PR #27 SHA `cc1499573732a41e8ff31d7ab634d15421d45df1`; exact SHA unit suite 115/115, typecheck, lint, build and bundle budget PASS under declared Node 24.21.0; hosted checks `40201475281` and `40201478772` PASS. | PASS (draft candidate) | No integrated staging E2E on the exact pair. |
| Site and Server agree on truncation schema | Server PR #42 SHA `175d5dff3b39140e9410db0c078e9baf1ce5678d` returns the same seven booleans (`stopSelection`, `candidateGraph`, `searchBudget`, `searchStepLimit`, `candidatePoolLimit`, `candidateSampling`, `responsePage`); API integration asserts keys/types and Site UI maps reasons independently from result sampling. | PASS (contract review) | PRs are open/draft; no integrated staging E2E on this exact pair. |
| Production readiness | Neither candidate is merged into an aligned 5+1 SHA set; dense-feed truncation remains. | NOT_RELEASED | Keep deployment and production readiness false. |

## Server PR #42 exact-head continuation — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Indexed frontier scan and unchanged GTFS results | Server PR #42 exact head `175d5dff3b39140e9410db0c078e9baf1ce5678d`; ordered frozen Lviv itinerary hash and all three strategy winners preserved. | PASS (draft candidate) | PR #42 remains open/draft, stacked on #41; does not resolve candidate-graph truncation. |
| Exact-head hosted Server checks | GitHub runs `40221694242` and `40221698958` both PASS, including migration, Postgres/Redis integration and production API image smoke. | PASS (hosted CI) | CI is for the Server branch only, not a coherent 5+1 release tuple. |
| Current local Server verification | Node 24.21.0: 316 unit pass / 0 fail / 3 opt-in integration skips; GTFS timetable 76/76; ESLint and TypeScript PASS. Frozen feed SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`. | PASS (local Server) | Declared-runtime paired performance replay remains NOT_TESTED. |
| Dense-feed completeness | Frozen Lviv query retains stable output but reports `searchTruncated=true` and `candidateGraphTruncated=true`. | FAIL | Continue bounded candidate-graph completeness work and require small-feed oracle parity, frozen multi-OD recall and supported-runtime resource evidence. |
| Production readiness | No deployment; PR is draft and dependencies remain stacked. | NOT_RELEASED | Keep `PRODUCTION_READY=false`; staging, live-provider, cross-repo SHA, iOS/device, operational and owner gates remain open. |


## iOS candidate re-pinned to verified Site/Server heads — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| iOS candidate component pin alignment | iOS PR #14 commit `046be3324e42970430dc4fa85b68a86ac203d5de` pins Site PR #27 `cc1499573732a41e8ff31d7ab634d15421d45df1` and Server PR #42 `a403a51a203d9d89685c10c69658c8fd95b70e9b`; exact Site checkout and generated manifest verified. Hosted runs `40223413802` / `40223417212` PASS; simulator compile PASS. | PASS (hosted candidate CI) | Not physical-device, authenticated API, staging, production, signing, or App Store acceptance. Root release manifest still describes prior tuple; reconcile remaining repos before creating a new coherent manifest. |
| Current full cross-repository release tuple | No exact, integrated tuple has passed central materialization/integration checks for these changed Site/Server inputs. | NOT_TESTED | Verify Admin, Partner and orchestration compatibility, then run central CI and API-backed staging E2E. |
# Current-source full browser rerun — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current dirty canonical Site route/navigation flows | Exact Server PR #42 `a403a51a203d9d89685c10c69658c8fd95b70e9b` + dirty Site source, loopback fixtures: full 25/25 E2E PASS in 6.1 min; 179 controls clicked, zero inert, zero changed before click. | PASS (local fixture only) | Dirty Site changes are not represented by committed Site SHA `6961afcf008e2c845c0fde68c687ce61fe744f2f`. |
| Half-sheet map proportion and gesture snap | Site dirty source reserves ~50% of 844 px for map; gesture-start/adjacent snap fixed; route-map light/dark snapshot + drag scenario passes in Chromium, Firefox and WebKit (3/3). Responsive + route-map matrix 6/6. | PASS (local fixture) | Uses schematic map tiles; real map imagery and physical Safari remain unaccepted. |
| Site source quality checks after latest change | Node 24.22.1: typecheck, full lint, 99/99 unit tests, focused route-sheet/navigation tests 10/10, production build and bundle budget PASS; root E2E ESLint PASS. | PASS (local) | Root production check predates latest snap change; E2E build uses fixture map manifest. |
| Root production check | Earlier `npm run check:production` exits 0; two explicitly opt-in integration checks SKIP. | PARTIAL | Skips are not passes; check predates latest changes and live dependencies remain unverified. |
| GPS route progress after same-route session reconciliation | Reducer fix preserves remaining distance/time and route state; regression test passes. | PASS (unit + local browser) | Real device/background GPS and live backend stream remain NOT_TESTED. |
| Visual acceptance against user-supplied designs | Screenshot tests pass against current repository snapshots, but reference-by-reference evaluation of all attached mockups/states/themes is incomplete. | NOT_ACCEPTED | Compare captures to provided references; only then accept or revise individual baselines. |
| Admin/Partner authenticated journeys | No complete browser acceptance in this run. | NOT_TESTED | Add exact-SHA API-backed role/tenant tests and exercise real workflows. |
| Staging and production | No deployment or external smoke performed. | NOT_TESTED / NOT_RELEASED | Configure authorized staging and dependencies; preserve owner approval gate for production deployment. |

## Exact Server PR #42 routing baseline — 2026-10-25

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Exact-candidate timetable and small-feed oracle | Server PR #42 exact SHA `a403a51a203d9d89685c10c69658c8fd95b70e9b`, isolated worktree; 77/77 timetable, calendar/realtime, transfer/pathway and strategy-oracle tests pass on Node 24.21.0 and Node 25.4.0. | PASS (local correctness) | Frozen-feed result completeness still FAIL; no source change is promoted. |
| Exact-candidate Server quality/integration CI | Local Node 24.21.0 full unit suite 316/316, typecheck and ESLint PASS; exact-head hosted runs `40222929785` and `40222932837` passed dependency audit, lint, typecheck, unit tests, migration, integrations and production API image PostGIS/Redis smoke. | PASS (Server candidate CI) | Draft PR only; does not prove dense-feed completeness, cross-repo integration, staging, or production deployment. |
| Frozen dense Lviv O/D search completeness | Three repeated runs are deterministic, but each reports `searchTruncated=true`, `resultLimitReached=true`; exact ID hashes and diagnostics are in audit 203. | FAIL | Candidate graph and search/candidate bounds omit alternatives. Continue with a materially different bounded method; preserve explicit truncation. |

## Local API search runtime — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Search error handling when API is unavailable | Browser reproduced Vite proxy HTTP 502 because no API listener is present at default `127.0.0.1:3002`; Site now displays a Ukrainian recovery message and keeps the route/retry action. Typecheck, focused lint, 256 unit PASS / 1 opt-in integration SKIP, build, and bundle budget PASS. | PASS (fallback UX) / BLOCKED_LOCAL (live API) | Use the isolated loopback E2E API/database harness to verify search requests. Do not start API on shared dev DB without checking outbox effects. |
| Live journey search from browser | No active API at the proxy target; no journey results returned. | NOT_TESTED | Start an isolated API with test DB/fixture feeds, then verify all result strategies and route details. No production conclusion can be drawn from this local 502. |
| Search controls and invalid/empty states | Isolated E2E on Node 24.21.0: search-button sweep 25 clicked / 0 inert / 0 stale; empty search, trip tab, empty demand form 2/2 PASS. Canonical isolated Server `a403a51a203d9d89685c10c69658c8fd95b70e9b`; current dirty root Site bundle; DB is loopback `marshgo_e2e_search_20261026`. | PASS (isolated UI/API fixtures) | A valid request/result payload and three-strategy route-detail flow were not proven by this sweep. |
| Trip tab labels in accessibility audit | Initial tests asserted obsolete label “Майбутні”; current UI presents “Заплановані”. Updated two test selectors and reran affected tests 2/2 PASS. | PASS (test expectation corrected) | No product label change; keep UI copy and accessible names synchronized in future tests. |

## Current-source local acceptance update — 2026-10-26

| Requirement | Status | Evidence / limit |
|---|---|---|
| Production Site functional browser suite | PASS (enumerated local scenarios) | 25/25 Playwright E2E; isolated local DB and fixtures; dirty Site source, not exact committed Site SHA. See [audit 205](audit/205_DIRTY_WORKTREE_FULL_E2E_INTEGRATION_AND_BROWSER_MATRIX_2026-10-26.md). |
| Main-screen visible button response | PASS (audited scope) | 178 clicked, 0 without visible effect; this is not every nested control in every Admin/Partner/iOS screen. |
| Chromium/Firefox/WebKit compatibility | PASS (enumerated local scenarios) | 6/6 responsive and route-map cases, three browsers; map fixture tiles. |
| Server/PostGIS/Redis isolated integration | PASS (enumerated suites) | 30/30 local isolated integration tests, including booking concurrency, navigation, rendezvous, cross-instance realtime, restart and rate limiting. |
| TypeScript, lint, unit, build, chunk budget | PASS | `npm run check:production`; 256 unit pass, 1 opt-in DB test skipped (not pass). |
| Pixel parity with supplied ten mockups / licensed map imagery | NOT_TESTED | Functional map states ran on schematic E2E fixtures; no approved pixel comparison. |
| Authenticated Admin/Partner end-to-end tenant acceptance | NOT_TESTED | Not in this current 25-case suite. |
| Physical iPhone Safari / TestFlight | NOT_TESTED | Simulator/device acceptance not established here. |
| Live provider entitlement / feeds, staging, production smoke | NOT_TESTED / BLOCKED_EXTERNAL | Local fixtures only; no deployed origin or live-provider proof. |
| Load, security, backup/restore, rollback and deployed SHA | NOT_TESTED | Required release gates remain open. |

Overall `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

| Requirement | Status | Evidence / limit |
|---|---|---|
| Canonical Site dependency security | PASS (current dirty checkout only) | Full `npm audit` 0 findings after lock-only update; package manifest unchanged; lockfile diff is uncommitted and needs review. Node 24.21.0 Site checks: typecheck/lint, 99/99 tests, build and bundle budget PASS. |
| iOS simulator packaging/first screen | PASS (limited) | Existing embedded Site SHA `02e97d63c050ae87b0d9fa6c698c97a0b5fdfb5f`; build/install/launch on iPhone 15 and 16 Pro Max simulators. Not authenticated acceptance or physical-device evidence. |
| iOS embedded Site dependency audit/alignment | BLOCKED / FAIL (release gate) | Embedded old dirty Site reports 5 high production dependency findings and is not the canonical Site SHA `6961afcf…`; must align and re-audit without overwriting its changes. |

| Requirement | Status | Evidence / limit |
|---|---|---|
| Canonical dirty Server dependency security | PASS (current checkout after lock-only change) | Full `npm audit` 0 vulnerabilities after 12-line lock change; Node 24.21.0 typecheck/lint and 233 tests pass, 1 opt-in DB test skipped. This is dirty branch `feature/transport-layer-availability`, not a promoted immutable release. |
| Canonical Server/PostGIS/Redis integration | PASS (isolated local suites) | 29/29 on fresh `marshgo_e2e_server_20261026`, migrations applied through 054. No staging/provider/production proof. |
| Root release candidate dependency audit | PASS | Production-only `npm audit --omit=dev`: 0 vulnerabilities; separate from component-specific dirty trees. |

## 2026-10-26 follow-up — current dirty worktrees and exact tuple

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current dirty Site functional E2E | Isolated Playwright 25/25; 178 clicked controls, 0 without visible effect; Chromium/Firefox/WebKit map/responsive matrix 6/6. | PASS (local fixtures) | Not an immutable release SHA; mockup pixel parity not accepted. |
| Canonical Server local integration | Fresh isolated PostgreSQL/PostGIS + Redis, 29/29; clean migrations through 054. | PASS (local fixtures) | Not staging, live providers, or production. |
| Admin portal build/unit | Exact materialized Admin snapshot: typecheck, lint, build, 4/4 unit, production npm audit 0. | PASS (local checks) | Authenticated RBAC and tenant-isolation browser flows not tested. |
| Partner portal build/unit | Exact materialized Partner snapshot: typecheck, lint, build, 3/3 unit, production npm audit 0. | PASS (local checks) | Authenticated onboarding, organization scoping and operations not tested. |
| iOS tuple | Manifest pins `be5478…`; local checkout is `4353ce…`; its embedded Site is dirty `02e97d…`, not manifest Site `6961af…`. | FAIL (tuple mismatch) | Reconcile exact candidate, rebuild/re-audit embedded Site, then rerun exact iOS CI/Simulator evidence. |
| Production visual match | Ten supplied references not compared pixel-by-pixel with approved real map assets in this run. | NOT_TESTED | Review each reference/state/theme; test real licensed map configuration. |
| Release | No staging or deployed artifact/SHA, provider, security/load, recovery, physical-device, backup/restore/rollback acceptance. | BLOCKED | Preserve `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`; no deployment without separate owner approval. |

## GTFS route-chain diversity candidate — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Small-feed GTFS itinerary and ranking correctness | 42/42 focused timetable/calendar/realtime/oracle tests on Node 24.21.0; exhaustive one/two-transfer oracle winners preserved. | PASS (local) | Candidate remains uncommitted in dirty Server worktree. |
| Dense-feed route diversity | Same-process frozen-feed A/B increased unique route-chain counts 31→65, 41→43, 24→46; all three previously observed strategy winners retained. | PARTIAL | Returned result sets changed materially; current query still truncated. |
| Search latency | Paired elapsed increased 35%, 19%, 36% for three frozen O/D requests. | FAIL (performance tradeoff) | Need bounded query-directed search with lower cost and stronger recall; no load SLA evidence. |
| Search completeness | All three candidate O/D still explicitly report `searchTruncated=true`. | FAIL | Do not promote or hide warning; implement query-directed completeness/recall and preserve exact transfer/fare semantics. |

## GTFS mode-aware endpoint selection — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Respect selected mode before nearby-stop selection cap | Regression with 15 excluded bus stops and three train candidates returns the only time-feasible rail trip; the excluded bus stops do not cause false endpoint truncation. | PASS (local) | Does not establish all-stop/global itinerary completeness. |
| GTFS timetable correctness | 42/42 focused tests and full Server unit suite 235 PASS / 0 FAIL / 1 opt-in integration SKIP on Node 24.22.1; includes exhaustive one- and two-transfer tiny-feed oracles. | PASS (local) | Dense frozen Lviv searches remain truncated; prior audit 206 reports this, and replay details are in audit 210. |
| Frozen-feed regression replay | Two identical result hashes per O/D on pinned 72-route/15,716-trip fixture; all three still return truncated pages. Debug counters show 194k–415k segments and either candidate/result or global-step caps. | PARTIAL | No completeness claim; next optimize candidate discovery while preserving exact semantics. |
| Static analysis | Server typecheck, focused lint, and changed-file diff check pass. | PASS (local) | Source and test files share a pre-existing dirty worktree; uncommitted. |
| Full production readiness | No staging or production evidence added by this change. | NOT_READY | Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`; continue routing search, exact integration tuple, provider, device and operations gates. |

## GTFS truncation diagnostics — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Distinguish internal search loss from response pagination | Typed GTFS result reports stop, budget, global step, candidate pool, route-chain sampling, and response-page causes; optional provider-level `gtfsSearchDiagnostics` is exposed by the API and verified in a real local search response. | PASS (local) | Site accepts the optional field but displays only the general incomplete-search warning; per-reason UI display not tested. |
| Server/Site regression validation | GTFS 42/42, Server unit suite 236 pass / 1 opt-in integration skip, Site 99/99; both typecheck/lint and Site build/bundle pass. | PASS (local) | Does not establish staging, live feed, or production acceptance. |
| Dense-feed route completeness | Prior frozen Lviv replays remain truncated. | FAIL | Use the now-visible causes to continue candidate-search work; do not suppress `searchTruncated`. |

## Direction-aware GTFS candidate sampling — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Preserve distinct GTFS directions when limiting route-chain samples | Direct journey segments carry parsed `direction_id`; same route may retain an eight-candidate sample per direction. Regression proves both directions survive and loss stays flagged. | PASS (local) | Does not increase the per-key cap or change transfer feasibility/ranking. |
| Router regression checks | GTFS 43/43; full Server 237 pass / 1 opt-in skip; typecheck/changed-file lint pass; frozen Lviv replay 3 deterministic repeats per OD with prior three strategy winners unchanged. | PASS (local) | Baseline timing was not paired; no performance claim. Three dense ODs remain truncated. |

## Latest current-Site web acceptance — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Full current-Site web E2E | 25/25 Playwright E2E on dirty Site base `ae2c8aa…` against Server `a403a51…`; local fixtures. | PASS (local) | Dirty/uncommitted source; repeat after making an immutable reviewed candidate. |
| Main UI controls | 179 controls clicked, 0 without visible effect. | PASS (local sweep) | Does not validate every production side effect or live provider operation. |
| Site static validation | Typecheck, lint, production build, and 99/99 unit tests pass. | PASS (local) | This checkpoint covers Site only. |
| Route-map visual states | Repository visual snapshots pass in tested light/dark and sheet states. | PASS (fixture map) | Ten user-provided images were not individually pixel-compared using licensed real map assets. |
| Production readiness | No staging/deployed SHA, live provider, exact iOS/physical device, authenticated Admin/Partner, security/load/recovery, backup/restore, or rollback acceptance. | BLOCKED / NOT_TESTED | Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`; no deployment. |
## GTFS query-targeted long direct ride follow-up — 2026-10-26

| Requirement | Status | Evidence / remaining limit |
|---|---|---|
| Preserve selected-origin → selected-destination direct GTFS rides past the 20-stop span | PASS (local fixture) | 50-stop scheduled trip returned; no-transfer search does not claim segment-span loss. |
| Preserve incomplete status when bounded transfer edges are omitted | PASS (local fixture) | Same feed with transfers allowed keeps `segmentSpan=true`. |
| GTFS/exhaustive regressions and Server checks | PASS (local) | GTFS/completeness 47/47; Server 238 pass / 0 fail / 1 opt-in skip; typecheck and lint pass. |
| Dense Lviv recall/completeness | FAIL / PARTIAL | All three fixed frozen-feed O/Ds still show search and result-page truncation; the limited run added +63 / +0 / +27 materialized segments. |
| Bus+tram API persistence integration | FAIL | Same Lviv feed hash as frozen replay; parser router returns bus→tram chains. API responses varied among bus-only, missing BALANCED rank, and zero journeys while BALANCED was advertised, including runs with local walking fixture. Only journey/live/booking phases started; later navigation/realtime/restart/rate-limit stages were not run. |
| Staging/production release | NOT_TESTED | No staging/deployment, exact immutable release tuple, live-provider sign-off, iPhone acceptance or owner-approved rollout. |

## API multimodal ranking and integration checkpoint — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Avoid nondeterministic walking-route budget allocation | API now routes candidates sequentially in deterministic route-chain round-robin order under the shared per-search budget. | PASS (local source/test) | Validate under actual staging routing service and traffic before production. |
| Preserve a distinct feasible route chain when another chain dominates globally | Scorer preserves the best candidate per diversity key in addition to Pareto frontier; dominated bus→tram regression passes. | PASS (unit) | Continue measuring dense-feed recall and ranking quality. |
| Persist real bus→tram Lviv API alternative with geometry/stops | Booking integration test passed; bus and bus→tram candidates returned and stop/geometry assertions passed. | PASS (loopback integration) | Local test DB/provider snapshot only; not live-provider commercial/freshness acceptance. |
| Server unit/API validation | 239 unit PASS / 1 default opt-in skip; typecheck and scoped ESLint PASS; integration groups 2+1+21+2+1+1+1 pass. | PASS (local) | Repeat on an immutable SHA/hosted CI before release. |
| Dense-feed query completeness | Prior fixed frozen-feed samples remain truncated (audit 214). | FAIL / PARTIAL | Continue exact-oracle-safe candidate-search work; preserve honest truncation status. |
| Production deployment readiness | No immutable six-repository tuple, staging acceptance, live provider approval, physical iPhone, operational recovery or deployment evidence. | NOT_READY / NOT_TESTED | Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`. |

## Current dirty-tuple browser and UI checks — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Main Site unit and static production checks | 99/99 unit; typecheck, ESLint, production build and bundle transfer budget PASS. | PASS (local) | Dirty working tree; repeat against immutable release SHA. |
| User-visible button response | 179 controls clicked, 0 inert, 0 stale before click. | PASS (browser sweep) | Checks visible response; does not prove every external provider side effect. |
| Full browser workflow cases | 22/25 passed in full run; three stale partial-search selectors updated; affected cases rerun 3/3 including route-map screenshots. | PASS across full+focused runs | One single full post-correction rerun outstanding. |
| Map visual regression | Route map and light/dark assertions passed on local deterministic fixture tiles. | PASS (fixture snapshots) | Not a pixel comparison of all supplied mockups against licensed live map assets. |
| Release readiness | No immutable exact tuple, staging/deployed SHA, physical iPhone or operational/provider gate evidence. | NOT_READY / NOT_TESTED | Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`. |

## GTFS query-path time-conversion fast path — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Preserve GTFS path identity and strategy winners | Frozen Lviv archive SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, three O/Ds × three repeats; hashes, winners, and route/trip-chain counts unchanged against no-fast-path copy. | PASS (local replay) | Not live feed or staging evidence. |
| GTFS/Server regression validation | GTFS 45/45; Server 240 pass, zero fail, one opt-in skip; typecheck/ESLint pass; guarded local integration 29/29. | PASS (local) | Current Server tree remains dirty and uncommitted. |
| Dense-feed completeness | All three frozen Lviv requests continue to report search truncation. | FAIL / PARTIAL | Build a bounded query-directed segment representation; retain truthful loss causes. |
| Production release | No exact immutable tuple, staging, deployment or external operational gates changed. | NOT_READY / NOT_TESTED | `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. |

## GTFS transfer-node index prototype — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Preserve transfer path/winner semantics | Isolated array-index prototype passed 45/45 GTFS tests and matched frozen-feed ordered IDs, strategy winners, and route/trip-chain counts. | PASS (prototype only) | Prototype rejected; no product changes retained. |
| Improve dense-feed performance | Three frozen O/D median comparisons were slower 5–14% in separate processes; no paired RSS baseline. | FAIL / REJECTED | Investigate segment materialization instead. |
| Dense-feed completeness | All frozen O/D searches remain truncated. | FAIL / PARTIAL | Continue bounded query-directed search design; keep loss diagnostics. |
## Current dirty-source full Web acceptance and mockup review — 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current dirty Site primary flows | Playwright 25/25; 179 controls clicked, 0 no-effect, 0 stale-before-click | PASS (local fixture) | Not exhaustive census across all six repos; not exact immutable release tuple. |
| Selected cross-browser scenarios | Chromium/Firefox/WebKit 6/6 | PASS (local fixture) | Responsive and route-map scenarios; not full browser parity for every role/page. |
| Site static/unit/build/bundle | 99 unit, typecheck/lint/build pass; 16 JS chunks all <=350 KB gzip | PASS (local dirty source) | Bundle size only; no field performance or deployed assets. |
| Server static/unit/integration | 240 unit PASS, one opt-in test skipped; typecheck/focused lint and 29 guarded DB/Redis integrations PASS | PASS (local dirty source) | Dense frozen-Lviv searches remain truncated; see audits 227–230. |
| Common route lip component | `JourneySegmentStrip` is shared; total/actions/sheet wrapping is duplicated between results and route map | PARTIAL | Consolidate after dirty diff and call-site review; check all six reference states. |
| Ten supplied mockups | Prior comparison and fixture snapshots reviewed; no exact 10-state pixel acceptance; schematic map assets differ | NOT_ACCEPTED | Needs approved map styles/assets and state-matched captures. |
| Production release | Dirty SHAs, external/provider/device/security/operations/staging gates remain unresolved | NOT_RELEASED | Keep `PRODUCTION_READY=false`; no deployment. |

See [audit 231](audit/231_CURRENT_DIRTY_SOURCE_FULL_WEB_AND_VISUAL_BOUNDARY_2026-10-26.md).
# Superseding local acceptance evidence — audit 236, 2026-10-26

| Requirement | Status | Current evidence | Remaining boundary |
|---|---|---|---|
| Canonical Site production UI/browser workflows | PASS (local dirty source) | Site `ae2c8aaf140305c4a1124c0b9a232f21b09eed0e` + Server `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, Playwright 25/25; 169 controls clicked, 0 inert/stale | Fixture DB/map/geocoder/OSRM; not immutable RC or staging. |
| Site static checks | PASS (local dirty source) | Typecheck, lint, 99/99 unit, production build | Not deployed or exact SHA release artifact. |
| Server unit checks | PASS with explicit skip | 240 PASS, 0 FAIL, 1 opt-in integration SKIP | SKIP is not PASS. Dirty Server. |
| Server loopback integrations | PASS (local) | 29/29 twice across DB/PostGIS, Redis, booking, realtime, navigation and restart | Not external/live provider or production data. |
| Route map interaction | PASS (local behavior) | Sheet states, map focus/restore, itinerary details, layer/theme behavior; screenshot capture in `/tmp` | Visual baseline still fails by 38,818 pixels (~12%); production map asset/mockup acceptance open. |
| Dense-feed multimodal search completeness | PARTIAL / FAIL | Local bus→tram booking integration passes; frozen Lviv remains `searchTruncated=true` | Candidate loss remains; must solve without weakening caps/semantics or hiding status. |
| Six-repository exact release tuple | NOT_TESTED | Current Site/Server mutable pair recorded; iOS clean SHA only | Admin/Partner local checkouts absent; iOS not built against tested tuple; no immutable candidate. |
| Production/staging gates | NOT_TESTED | No deploy in this checkpoint | Live providers, HTTPS staging, security, load, backup/restore, rollback, physical iPhone and owner rollout approval remain. |

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Verification delta — 2026-10-26 / audits 269–270

| Requirement | Status | Evidence | Remaining boundary |
|---|---|---|---|
| Site provider coverage for cross-city searches | TESTED (local) | Both endpoint responses merged by transport category/provider ID; Site suite 101/101; typecheck, lint, build pass | No live provider discovery or authenticated search because active proxy/API readiness fails |
| Guest Trips does not poll protected bookings | TESTED (local browser) | Central commit `6dd47db`; guest view checked >4 seconds, remains stable with no repeated 502; central `check:production` PASS | Authenticated booking data flow remains blocked by runtime |
| Main guest pages and controls render | PARTIAL | Home, Search, Trips filters, Profile, quick action, Navigation DISCOVER and Transport Map/layers inspected at 386×519; no horizontal overflow | All buttons/pages, real route response, map data, authenticated roles and reference screenshots not accepted |
| Local API and PostGIS runtime | BLOCKED | `/healthz` 200, `/readyz` 500; port 5434 closed; host PG14 lacks PostGIS; Docker CLI/socket timeout | Need isolated PostGIS/Redis and working API proxy |
| Release to production | NOT_RELEASED | No staging/deployed SHA or operational acceptance | All release gates remain applicable |

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Site visual color checkpoint — audit 253, 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Canonical transit colors across card and map | Site `1a922010562f334fe77e79fd0a89181c2f2f9963`: tram purple and carpool pink; added CSS-token/registry parity test; both hosted verify runs `40303800436` and `40303808897` pass. | PASS (local + hosted CI) | Full visual Playwright rerun not done. |
| Site unit/type/lint/build/bundle | 100/100 unit tests; typecheck, lint, Vite production build and bundle budget pass. | PASS (local source) | Not staging or physical-device evidence. |
| Ten mockup visual acceptance | Existing light-results screenshot delta remains 38,818 pixels (~12%); no baseline update. | NOT_ACCEPTED | Capture all states against licensed production map assets and review differences. |

See [audit 253](audit/253_SITE_TRANSPORT_COLOR_ALIGNMENT_2026-10-26.md). Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Server reverse-reachability optimization — audit 254, 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| GTFS output parity | Three frozen-Lviv O/D pairs × three paired repeats: ordered itinerary hashes, FASTEST/CHEAPEST/BALANCED winners and truncation flags match baseline. | PASS (local replay) | Hosted CI for PR #43 is still running. |
| Server checks and image | Local unit/type/lint pass; hosted PR #43 runs `40304476493` and `40304482350` pass audit, unit, migration, PostGIS/Redis integration, API image build and smoke. | PASS (isolated candidate + hosted CI) | Hosted containers are CI fixtures; not staging or production. |
| Dense-search completeness | All three frozen-feed searches remain truncated by existing graph/search-budget/sampling/page limits. | PARTIAL / FAIL | This optimization only avoids materializing/sorting the full pool in the reverse prepass. |
| Production release | Commit `4ed81b47e45520475470b699deac115fb0000b69` fast-forward pushed to Server PR #43; no staging/deployed SHA or operations gates. | NOT_READY / NOT_RELEASED | Wait for hosted checks; do not deploy. |

See [audit 254](audit/254_SERVER_LAZY_TRANSFER_REACHABILITY_2026-10-26.md). Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Site active-candidate color parity — audit 255, 2026-10-26

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Reference colors in active Site candidate | PR #28 head `d6c9a957a5f767a491daed2ffb5e70bb8ed8b559`: tram purple, carpool pink, registry/CSS parity test; hosted runs `40305831219`, `40305837568` pass. | PASS (local + hosted CI) | Full visual acceptance remains open. |
| Site static checks | Node 25.4: 117 tests, typecheck, lint, Vite production build and 16-chunk bundle budget pass. | PASS (local + hosted CI) | Not staging or physical-device evidence. |
| Full reference visual acceptance | No baseline changes; full state-by-state captures and licensed map assets not accepted. | NOT_ACCEPTED | Validate each supplied state and theme with exact candidate. |

See [audit 255](audit/255_SITE_PR28_CANONICAL_COLOR_PARITY_2026-10-26.md). Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Cross-browser follow-up — audit 237, 2026-10-26

| Requirement | Status | Current evidence | Remaining boundary |
|---|---|---|---|
| Current canonical Site browser compatibility | PASS (local dirty source) | 6/6 Chromium, Firefox and WebKit responsive/sign-in/search and full route-map cases | Current source is dirty; uses local API/map/geocoder/OSRM fixtures. |
| Shared route lip | PASS (source integration) | One `CanonicalRouteLip` import is used by results and route detail/map screens in current Site | Not frozen or deployed as an immutable release artifact. |
| Pixel-level reference acceptance | FAIL / PARTIAL | Normal light-results comparator differs by 38,818 pixels (~12%); images reviewed, cause not fully established | Keep existing baseline/threshold; compare supplied mockups using approved production map assets. |
| Production release | NOT_TESTED | No staging or deployment in this checkpoint | Exact six-repository tuple, provider, iOS/device, security/operations gates remain open. |

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Exact six-repository review candidate — 2026-10-26

| Gate | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Site / Server / iOS exact tuple | Site PR #28 `d6c9a957…`; Server PR #43 `4ed81b47…`; iOS PR #15 `7468cee5…`. Hosted verification: two runs per component; iOS compiled simulator and verified embedded manifest. | PASS (candidate CI) | Open stacked PRs, not merged/deployed; optional unsigned iOS archive and physical iPhone not tested. |
| Admin / Partner exact inputs and component CI | Admin PR #1 `a008dbad…` run `40271205348` PASS; Partner PR #1 `5ec9f368…` run `40272376131` PASS. | PASS (individual CI) | Root release assembly cannot materialize private repos without owner-managed read-only token. |
| Dense-feed multimodal completeness | Frozen Lviv searches retain truthful truncation. | FAIL / PARTIAL | Continue oracle-preserving query-directed search; global optimality not established. |
| Full production release | No staging/deployed SHA or operations evidence. | BLOCKED / NOT_TESTED | Provider entitlements, staging, security/load/recovery, backup/restore, rollback, physical device and owner approval remain. |

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
## Dense GTFS route search — audit 257

| Requirement | Evidence | Status | Remaining boundary |
|---|---|---|---|
| Exact feasible path/fare preservation on small feed | Endpoint-pruned test helper matches exhaustive two-transfer chains/fare and three ranking winners; Server suite 316 PASS / 3 opt-in DB SKIP; typecheck and lint PASS. | PASS (fixture only) | Does not establish dense-feed recall. |
| Preserve current Lviv result chains and strategy winners | At 10,000-label bound: 0/65 current result chains and 0/3 winners retained. | FAIL — prototype rejected | Serving candidate unchanged; implement a different state-setting algorithm. |
| Dense Lviv completeness | Current bounded candidate and prototype both report truncation. | PARTIAL / NOT_READY | Require exact three-O/D replay, no lost bounded results/winners, and measured resources before integration. |

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

| Current root full production checks | PASS (Node 26.7.0, unsupported by package engine) | `npm run check:production`: typecheck, lint, 256/257 unit tests (1 opt-in DB skip), build, 51-chunk bundle gate; `git diff --check` | Local static/build evidence only; no current E2E/staging proof |
| Current root E2E/button/cross-browser acceptance | BLOCKED / NOT_TESTED | `npm run test:e2e` failed before Playwright: `ECONNREFUSED 127.0.0.1:5434`; Docker CLI did not return and was interrupted | Restore isolated test DB/Redis; do not use unknown host DB or alter Docker volumes |
| Host PostgreSQL fallback for E2E | NOT_USED | Read-only probe: Homebrew PostgreSQL 14.23, PostGIS unavailable, unrelated production-named DBs present | Do not run migrations or E2E there; provision isolated PostGIS instead |
| GTFS supplemental discovery | PROTOTYPE_ONLY | Isolated test-only commit `fe9961b532d26795769c634d3580a14b715f550b`; 3 frozen Lviv O/Ds retain baseline chains and exact strategy winners while selecting 33–40 new trip chains | Base graph and supplemental search remain truncated; not wired to API; not a release gate pass |
| GTFS discovery queue memory bound | PASS (test-only guard) | Isolated commit `49bf104808b6f1a3bd8669aa125dfb04af4f0a87`; 316 Server unit pass / 3 opt-in skips; 3 frozen O/Ds retain 100/100 baseline chains and 3/3 exact winners | Experimental traversal still truncated; 752–846 MB local RSS; no production integration |
| Current-root browser E2E after laptop restart | BLOCKED / NOT_TESTED | Docker Desktop processes present, but `docker info` timed out; isolated PostGIS at `127.0.0.1:5434` refuses connections | Need responsive isolated PostGIS/Redis; host database is unsafe and untouched |
| GTFS linked-label experiment | PASS (test-only oracle/replay) | Local commit `8fe16f79c6351091fa6952ee512af79634b213ed`; full Server suite 316 pass / 3 opt-in skips, exact three O/D hashes and winners preserved | Not production code; no completeness result; `searchTruncated=true` |
## Checkpoint — 2026-10-26 (Server PR #44)

| Requirement | Status | Evidence | Remaining boundary |
|---|---|---|---|
| Bounded production GTFS pending frontier | PASS (local + hosted candidate checks) | Server commit `aaa1328f17c35029b7efa4f801dfae07301a9517`; exact-head GitHub runs `40313885418` and `40313914470` PASS; 10,000 queued-work cap; dropped work reports `searchBudget`; Server suite 316 PASS / 3 opt-in DB SKIP; typecheck/lint PASS | Node 25.4 local runtime differs from declared Node 24.21; frozen feed remains candidate/search truncated |
| Complete dense-feed route recall | FAIL / PARTIAL | Frozen Lviv three-OD replay is deterministic with stable winners | Existing graph/candidate caps still truncate results; global completeness not proven |
| Production release | NOT_TESTED | No staging or deployed SHA evidence | iOS/device, real entitlements, security/load/recovery, backup/restore/rollback, and owner approval remain |

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## 2026-10-26 — latest verification notes

| Requirement | Status | Evidence |
|---|---|---|
| GTFS trips with service times up to 71:59:59 can be found from the two preceding service dates | TESTED | Server PR #45 `cb16fe8352c78917eaf6d89f675d6ae58461916f`; local 317 pass / 3 opt-in skip; hosted run `40315614340` passed migrations, PostGIS/Redis integration and image smoke; audit 264 |
| Dense-feed routing returns a complete candidate set | PARTIAL | Frozen Lviv searches preserve baseline winners but still set `searchTruncated=true` and `candidateGraphTruncated=true`; audit 264 |
| Every production page/button works in browser | NOT_TESTED | Playwright stopped before browser startup because local PostgreSQL 14 lacks PostGIS; audit 265 |
| Production visual match to all supplied mockups/themes | NOT_TESTED | No screenshot-based E2E acceptance completed; audit 265 |
| Root source typecheck, lint, unit tests, production build, and bundle transfer budget | TESTED | `npm run check:production` exited 0 on 2026-10-26; audit 265 |

## 2026-10-26 — guest UI/runtime recheck (audit 271)

| Requirement | Status | Evidence |
|---|---|---|
| Root typecheck, lint, unit suite, build and bundle budget | PASS | `npm run check:production`; 256 pass / 1 opt-in DB skip / 0 fail |
| Guest Trips tabs/sections, Profile theme, Search date/passenger/category controls | PASS (limited guest controls) | `docs/audit/271_CURRENT_GUEST_UI_ACCEPTANCE_AND_RUNTIME_RECHECK_2026-10-26.md` |
| Add vehicle/profile server action | FAIL | Browser returned 502; API proxy/runtime not ready |
| Search results and route-map output | BLOCKED_ENVIRONMENT | Vite proxy on 3002 closed; API 3310 readiness 500; DB 5434 closed |
| All authenticated pages/buttons, visual states and responsive matrix | NOT_TESTED | Requires healthy isolated PostGIS/Redis API and authenticated fixture |
| Staging, production, physical iPhone and provider acceptance | NOT_TESTED | No deployed environment/device/provider proof |

Overall: `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Search/geolocation/live-mode acceptance — 2026-10-26 (audit 275)

| Requirement | Status | Evidence / boundary |
|---|---|---|
| Map point picker without reverse geocoder | PASS | Active Site E2E with synthetic point; confirm enabled and accepted |
| Browser GPS fallback | PASS (synthetic); NOT_TESTED (host) | Synthetic GPS passes; actual host timed out after coarse retry |
| “Сихів” autocomplete and clear controls | PASS (fixture auth); BLOCKED_USER_SESSION (current tab) | E2E selects and clears; current browser has no valid API session |
| Twelve category labels/order | PASS | Active Site production-build E2E |
| Live Lviv route search | PARTIAL | 17 bus/tram/walk results; UZ failure made response partial; 8 selected types unsupported in corridor |
| Full multimodal chain across all cities/categories | NOT_TESTED / PARTIAL | Not all city-mode combinations have routed and booking acceptance |
| Production | NOT_RELEASED | No staging or deployment proof |

Evidence: `audit/275_SEARCH_GEOLOCATION_AND_LIVE_MODE_CHAIN_2026-10-26.md`.

## Bounded GTFS overflow retention — 2026-10-27

| Requirement | Status | Evidence / boundary |
|---|---|---|
| Overflow sample is independent of candidate arrival order | PASS (deterministic fixture) | Server SHA `7b7d6e152c3b55b77869c3e9e9051680ff96f09c`; all 120 permutations select the same capacity-1 sample; focused test 1/1 and exact-head CI `40429083385` passed |
| Frozen-feed journey identity and three-strategy winner parity after sampling change | NOT_TESTED | Frozen Lviv archive is absent at documented local path; do not infer real-feed equivalence from fixture or CI |
| Server production readiness | NOT_RELEASED | PR #46 open; no merge, staging, deployment, or production smoke |


### Server PR #46 paired frozen-feed replay — 2026-10-27

- Candidate SHA `096acd62bfb9e20371c82f8b3542466f76d41390`; Lviv city GTFS archive SHA-256 verified as `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Hosted replay workflow `40429752712` succeeded: three repeat-stable runs each for baseline `ee60e4c7ffeb5645e1dc13f472b47fd43f0e838a` and candidate. On this single static Holosko→Sykhiv OD, FASTEST/CHEAPEST/BALANCED winners match, but ordered route identities do not. Both results and candidate graphs are truncated. Median latency regressed from 5,526.74 ms to 7,260.12 ms (+31.36%); sampled peak RSS was 681.3 MiB → 674.7 MiB.
- This is diagnostic evidence for one static OD only, not live/realtime, multiple-corridor, staging, production, or complete-routing acceptance. PR #46 remains OPEN / UNSTABLE and unmerged. Push CI `40429752478` and PR CI `40429757634` were still in progress at checkpoint.
- No production deployment. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
- Next exact action: obtain terminal results for both exact-SHA CI runs; inspect failures if any. Then investigate the +31.36% replay latency and broaden replay coverage before considering promotion.


### Server PR #46 performance follow-up — 2026-10-27

- Two serialized paired replays on the same feed/OD showed candidate latency regressions of +31.36% and +39.59%; each had three stable repeats and preserved FASTEST/CHEAPEST/BALANCED winner identities. Candidate result identity differed by one unique trip chain; both baseline and candidate remained truncated.
- Identified repeated ID-hash work inside the deterministic overflow sample sort. Server worktree `codex/gtfs-objective-reservoir-20261027` now has commit `25e1f1d6773b5720ab52ad09e4ca33b8c1d6c7be`, computing each retained candidate's hash once per update. Scoped full GTFS timetable + reservoir suites: 79/79 passed; scoped ESLint and `git diff --check` passed.
- Pushed to PR #46. Exact-SHA Server CI and frozen-feed replay are running (`40430344987`, `40430349518`, `40430345029`); no result assumed yet. PR #46 is OPEN / UNSTABLE pending checks.
- Next: inspect exact-SHA CI and replay; compare the updated candidate against baseline and the prior candidate. Keep PR unmerged until latency, identities, and truncation are explained, then broaden city/corridor validation. No production deployment.
- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.


### Server PR #46 — frozen Lviv replay instrumentation — 2026-10-27

- Latest measured Server commit: `3f9c624c58e049ae6f29f0ff89197bf4157346a5`; PR #46 is OPEN / CLEAN, stacked on open PR #45. Both Server CI checks and the paired frozen-feed replay pass on the exact head. No merge/deployment.
- Replay uses the verified Lviv city GTFS archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, one static OD, three serialized repeats per side. Strategy winners match; full result IDs differ from original baseline; both are explicitly truncated.
- Exact search evidence: estimated graph demand 415,997 vs 100,000 segment cap; 70 candidate routes (10 at per-route cap); 6,522 overflow-reservoir items (31 reservoirs at cap); 809 segments redistributed. Search had 411 first legs, 89,086 steps, and objective pools reached at 22,894 (2 legs) / 64,086 (3 legs); the 1,000,000 global step limit was not hit. Truncation flags: graph, candidate sampling, search budget.
- Sampler hash-caching commit `25e1f1d` preserved ordered IDs and strategy winners against prior sampler `096acd6` and measured 16.84% faster in a paired replay; broader runner-to-run timings vary, so treat performance as diagnostic. Exact 79/79 GTFS tests passed at `25e1f1d`; latest exact-head CI validates current replay instrumentation.
- Antigravity CLI surfaced five models but its read-only worker attempted a command tool that headless permissions auto-denied; no access was bypassed and no review result was claimed. A Codex read-only reviewer is assessing the bounded graph-budget path.
- Next: use graph-allocation review to select one targeted improvement/test; do not blindly raise caps. Verify on frozen GTFS plus exact CI. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Routing evidence update — 2026-10-28

| Requirement | Implementation/evidence | Status |
|---|---|---|
| Bounded GTFS graph preserves a feasible strategy winner when a false-positive feeder competes under a tight cap | Server `3c14c28`; exact exhaustive-oracle regression; GTFS 90/90, typecheck, targeted lint; exact-head CI and frozen-feed replay pending | PARTIAL — fixture verified; live frozen replay not yet verified |



## Version diagnostics and deployment identity — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server version endpoint | PR #61 head `9be1abf59bb870a25442feb69c51908d272a347d`; `/version` returns package/API version, validated optional build metadata, normalized environment/source state, and opaque instance ID. Focused test 2/2 PASS. | PARTIAL — isolated branch + unit tests | Exact CI run `40853971325` pending; no deployed endpoint verification. |
| Build identity in produced artifact | Root CI builds pinned production images through `ops/scripts/materialize-release.mjs` and `.release/compose.production.yml`; current manifest pins Server `4ed81b47e45520475470b699deac115fb0000b69`, not PR #61. No build metadata injection or automated deploy workflow was found. | BLOCKED | Wire metadata through the pinned release artifact path after the Server change is accepted; verify exact artifact. |
| One coherent local stack | Canonical local Web/API ports 3000/3002 are not listening at this check; current root/Server/Site checkouts have unrelated dirty work. | NOT VERIFIED | Start and fingerprint the intended stack before browser/API acceptance. |


| Exact Server CI for version diagnostics | PR #61 SHA `91afed290518291ccb8cc9ee8208e24991356fbe`: push run `40854230885` and PR run `40854241056` passed audit, lint, typecheck, unit, migrations and integration. | PASS (exact hosted CI) | Still isolated draft; no local/staging HTTP smoke, artifact build identity injection, or production deployment proof. |

| Root dependency audit before release-image verification | `bun.lock` pin `re2js@2.8.6` was in GHSA-gg6h-894w-4m9c affected range; changed only the lock entry to `2.8.7` in root PR #7 SHA `05e845fc3cd0d612b4fc268bc93cddfc6f9350ee`, compatible with Firebase's `^2.8.3`; npm integrity and lock parse verified. | PENDING — exact hosted root CI | CI `40855557649` / Security `40855557581` must pass audit and proceed through release image identity assertions; Bun is unavailable locally. No merge/deployment. |

| Exact root PR #7 CI through artifact materialization | SHA `05e845fc3cd0d612b4fc268bc93cddfc6f9350ee`; audit, lint, typecheck, unit, migrations, integration, build and bundle pass in run `40855557649`; security runs `40855557581`, `40855550099` pass. | BLOCKED — private checkout credential absent | CI explicitly requires Actions secret `MARSHGO_REPOS_READ_TOKEN` with read-only Contents access to private Admin and Partner. Docker image build/metadata assertion and E2E did not run. Owner must configure secret securely, then rerun exact CI; no deployment. |

| Scheduler single-pass behavior | Server PR #60 SHA `7e700aee607d67bdfc5f8305f63e4aa51aa20cac`; exact CI push/PR `40844800294` / `40844809841` PASS. Frozen-feed direct-parent comparisons `40856161112` and `40856417958`, each 3 repeats: ordered IDs and FASTEST/CHEAPEST/BALANCED winners identical in two corridors; truncation causes unchanged. | PARTIAL — two frozen-corridor parity checks pass; performance benefit unproven | Search median deltas +0.59% and -3.34%; sampled RSS peaks higher in candidate. PR stays draft/stacked. Does not prove complete route search, real-user E2E, or production readiness. |
| Lviv bounded-search target chain trace | Server diagnostic SHA `d2045bcac95111c022e04077d7ee1eb5f3d48db0`; exact CI `40857237472` PASS; hosted pinned-feed trace replay `40857375406` | PARTIAL — target trips and 8 feasible graph paths retained, but target chain not generated before bounded search ends | Reproduce queue admission/fairness loss with an exhaustive small fixture; then validate any fix at default budgets on uninstrumented frozen feed. Trace replay timing is not production-performance evidence. |
| Dense FASTEST fixture and completeness flag | Server SHA `31b928d03327ab08ab04a19d8a6bf60464d9af63`; independent event-label oracle; 2 focused tests PASS | PARTIAL — test-only narrow limits omit fastest and report partial; defaults retain fastest | Exact CI `40858925454` pending. This does not resolve the separate Lviv frontier cutoff or prove production readiness. |
| Bounded frontier post-admission witness | Server SHA `0cc9054528362d0b3de8647c98b0fdfbf755d7a1`; independent event-label oracle and 2 focused tests PASS | PARTIAL — synthetic fastest prefix admitted but unexpanded at reduced-budget cutoff; defaults find winner | Exact CI `40859247467` pending; implement and validate a bounded fairness fix before claiming Lviv completeness. |
| Site distinguishes candidate and result sampling truncation | Site PR #32 SHA `7101c45a8a980a05eb9d584a0dccde4797075e19`; focused tests 6/6, typecheck and targeted lint PASS; 24 synthetic browser cases across 320–1440 px PASS | PARTIAL — local synthetic component/browser evidence | Exact CI `40859944210`/`40859970845` pending; coherent live API/browser and staging verification remain open. |


## PR #59 queue-prefix lookup — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Server change passes configured CI gates | SHA `367133f2924da6601f5f1cc1b419eb5a37d4ed3a`; run [40897315395](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40897315395): audit, lint, typecheck, unit/integration, migrations, API image, PostGIS/Redis smoke all PASS | PASS (CI only) | Does not establish routing completeness, staging, or production readiness |
| Lviv route quality and bounded-search completeness | Paired frozen-feed replay [40897329968](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40897329968), three stable repeats per side; strategy winners match, but identity parity NO, median +16.86%, graph/search-budget/sampling/page truncation persists | PARTIAL / NOT_ACCEPTED | Diagnose queue scans and truncation; PR #59 remains open/draft; production `NOT_RELEASED` |


## PR #59 conditional fairness-scan optimization — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Avoid redundant GTFS queue scan while preserving fairness and transfer-path cadence | Server SHA `c1e66d9dc8cd767b2b94caaa9bcb423abb123846`; targeted regression plus debug metadata invariant added; exact CI `40898676494` / `40898666481` running | PENDING | Confirm tests, then compare uninstrumented pinned-feed replay `40898729609` for scan counts, latency, strategy winners, identity parity and truncation |


### PR #59 conditional fairness-scan result — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Configured Server CI for conditional fairness scan | SHA `c1e66d9dc8cd767b2b94caaa9bcb423abb123846`; runs [40898676494](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40898676494) and [40898666481](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40898666481) PASS | PASS (CI only) | No staging or production evidence |
| Lviv performance and routing completeness | Diagnostics-off replay [40898729609](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40898729609): winners preserved; ordered identity parity NO; +15.06%; graph/search-budget/sampling/page truncation | PARTIAL / NOT_ACCEPTED | Direct debug comparison run `40899517920` pending; do not merge/deploy while material truncation remains |


### PR #59 queue-scan diagnostic result — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Conditional queue scan avoids redundant work without changing route selection | Parent/candidate debug replay [40899517920](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40899517920), 3 repeats each: deterministic identical ordered route hashes and strategy winners; scan count 14,057,203→7,026,431 (~50.0%); search steps and truncation unchanged | PARTIAL — algorithm-specific gain confirmed | Debug timing is invalid for latency; inspect diagnostics-off paired replay `40899919374`; route completeness remains unaccepted |


### PR #59 parent/candidate latency result — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Queue scan optimization improves end-to-end latency without route changes | Diagnostics-off replay [40899919374](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40899919374), three repeats: route identities and strategy winners match, median search +1.51% | NOT_DEMONSTRATED | Diagnostic scan work fell ~50%, but no E2E speed win; candidate remains slower than base and truncated. Trace known chain in run `40900376958` |


### Lviv exact-chain stage trace — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Distinguish chain-generation failures from response-page omissions | Replay [40900376958](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40900376958): witness `32952→30617→32656` returned on base/candidate. Replay [40900697687](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40900697687): witness `32952→30617→32932` generated, sampled, ranked but not returned on candidate first page; base returned it | PASS for these two witnesses only | Page truncation is explicit; graph/search-budget/sampling truncation and broader routing completeness remain unaccepted |

### PR #59 returned-page objective metrics — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Explain trade-offs using schedule, known fare allocations, transfers and walking for returned journeys | Commit `d0702905943e3d9e94fde198cb8f82b30c6c4429` adds bounded response-page metrics and repeat-stability checks; local syntax/synthetic checks passed; exact CI `40912206597` and Lviv replay `40912327825` queued | IN PROGRESS | Inspect exact hosted artifacts. Metrics are for the response page, not all feasible candidates; routing completeness and all-mode acceptance remain OPEN |

### Corrected route-search timing — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Compare routing search cost without diagnostic report overhead | First replay `40912327825` included report construction in its timer and is invalid for performance claims; `e85e9ff3c83079ff8046bd2b851e79d2166d8f5c` stops the timer immediately after routing. CI `40912856545` and corrected replay `40912865465` are running | IN PROGRESS | Accept timing only from the corrected paired replay; route completeness is still truncated and unreleased |

### Corrected frozen-feed search performance — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Candidate search does not regress materially against exact base on the pinned Lviv query | Corrected diagnostics-off replay [40913018540](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40913018540), 3 stable repeats: 7,002.82 ms base vs 8,709.53 ms candidate (+24.37%); later verified head [40914619117](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40914619117): 5,424.88 ms base vs 6,680.71 ms candidate (+23.15%), RSS 636.4→711.8 MiB | FAIL / OPEN for this query | Profile run [40913375103](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40913375103) passed; three profiles point to itinerary search/retention-event and chain-sampling allocation, timetable parse/materialization, fare normalization and GC. Profile is not a timing benchmark. Both sides truncate graph/search/sampling/page; no release acceptance or global cap change |


### Retention-index optimization checkpoint — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Preserve GTFS routing semantics while reducing measured index allocations | Server PR #59 SHA `34a690536f5c4448411f4fa01459be3894b8b438`; focused timetable test 104/104 passed; exact CI [40914083541](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40914083541) running | IN PROGRESS | Confirm exact CI, then compare same pinned-feed replay. This has not yet shown latency improvement; production remains `NOT_RELEASED` |


| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Localize the candidate routing regression without changing search bounds | Diagnostic replay [40914927922](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40914927922): candidate/base steps 81,174/70,359; peak pending 9,103/1,592; graph build ~4.294/3.507 s; results 817/816 | REGRESSION LOCALIZED TO EXCESS WORK; FIX OPEN | Diagnostic times are not release timings. Inspect exact queue changes before any edit; replay completeness remains unproven |


### 2026-10-29 — scheduler experiment rejected by paired replay

Frozen Lviv replay [40916620625](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40916620625) compared `34a690536f5c4448411f4fa01459be3894b8b438` and experimental `2a2a9e9d5217ec71be4f0fa3a1a0a3dcf91a7831` on the same feed SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, OD, UTC window, and three serialized repeats. Results were repeat-stable with identical ordered route identities and FASTEST/CHEAPEST/BALANCED winners; no trip chains added or removed. Median search was 9,129.70 ms → 9,286.26 ms (+1.71%); sampled peak RSS 710.3 → 710.4 MiB. Both revisions remain truncated at graph, search budget, candidate sampling, and response-page boundaries. The change did not demonstrate a speed or completeness benefit, so it was reverted in Server commit `90ec8cb1ce3bfb7a49fd1f187b427a4ed83d476b` and pushed to PR #59. Focused exhaustive/fairness tests passed 4/4 after revert. Exact CI runs [40917168473](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40917168473) and [40917158964](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40917158964) are queued/running for the reverted head. This closes the experiment only; routing performance/completeness and production readiness remain OPEN, production `NOT_RELEASED`.


Follow-up: exact Server CI [40917168473](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40917168473) completed successfully on reverted HEAD `90ec8cb1ce3bfb7a49fd1f187b427a4ed83d476b`: dependency audit, lint, typecheck, unit tests, migrations, integration tests, production image, and PostGIS/Redis smoke all passed. Duplicate exact-SHA run `40917158964` was cancelled; GitHub reports that cancelled run as failed, not as a code failure. PR #59 remains OPEN/DRAFT and reports `UNSTABLE` because it is stacked on a separate base PR; no merge/deployment was done. This gate validates the current Server branch only; product release gates remain open.


### 2026-10-29 — Web→API first-journey smoke and local-stack blocker

Canonical dirty Site checkout: branch `codex/sync-journey-mobility-ui`, HEAD `8f238ba170f0d6c212f06fa25aec2a9fdfb26699`; canonical dirty Server checkout: branch `feature/transport-layer-availability`, HEAD `30f9691f1789b28400a3995469677bd4f5f32ca9`. Site dependencies are present; the local API launcher config check passes without printing secrets. Started Vite from the canonical Site checkout on loopback `127.0.0.1:3000`. Browser smoke at `/journeys/search` returns the MARSHGO landing shell (HTTP 200, title `MARSHGO — Один пошук. Усі способи доїхати`, no JavaScript page errors), but `/healthz` and `/api/v1/health` return 502; browser observed `/api/v1/auth/refresh` 502. No route search or real journey was completed. Server API expects loopback Postgres `127.0.0.1:5434` and Redis `127.0.0.1:6380`; neither port is listening. The only observed Postgres is `127.0.0.1:5432`, which was not used; Docker daemon is unavailable. Keep Site serving only on loopback, do not redirect it to another database or claim end-to-end acceptance. Production remains `NOT_RELEASED`.


Local stack follow-up: Compose config resolves cleanly to `db`/`redis`/`s3mock` with isolated project-scoped persistent volumes available in principle. Opening Docker Desktop requested macOS administrator authorization for privileged port mapping; I did not enter/save credentials, cancelled the pending prompt, and stopped the app. No containers or volumes were started or changed. The API/UI end-to-end test is therefore externally blocked until Docker Desktop can be authorized; after that, inspect existing volumes and use a new compose project name so validation data cannot touch the existing `marshgo-*` volumes.


Local fallback check: the only installed PostgreSQL is Homebrew 14.23 on port 5432 and its extension directory lacks PostGIS; neither `redis-server` nor Valkey is installed. No package was installed and the user-owned Postgres service was not changed. These binaries cannot safely substitute for the configured PostGIS 17 + Redis stack. First Web→API acceptance remains blocked by Docker Desktop's required macOS administrator authorization. Vite remains bound only to `127.0.0.1:3000` for inspection.


Hosted-test-path check (2026-10-29): canonical Site workflows expose lint/typecheck/build/bundle checks only; canonical Server CI runs isolated PostGIS/Redis integration tests but has no browser journey. Thus existing green CI cannot substitute for the blocked Web→API→provider→map proof. No workflow was dispatched or edited in this step.


### 2026-10-29 — Antigravity provider-discovery behavior verified in dirty Site

The previously reviewed canonical Site changes already include `mergeSettledProviderGroups`, endpoint union/de-duplication, partial-failure warning state in `ProductionMarketplace`, and tests preserving providers from a successful endpoint when its peer rejects. Verified on dirty Site branch `codex/sync-journey-mobility-ui`, HEAD `8f238ba170f0d6c212f06fa25aec2a9fdfb26699`: `tests/transport-preferences.test.ts` **14/14 passed**, covering the exact twelve categories, marshrutka GTFS/GeoJSON/JSON routeability, endpoint union, partial/total failures, and excluding realtime-only points from scheduled routing. `git diff --check` passed for the three relevant files. No files were edited or committed in this step; this is deterministic unit/fixture evidence only, not live provider or UI→API acceptance. Preserve the pre-existing dirty changes.


### 2026-10-29 — fix provider-availability overwrite in endpoint union

In the pre-existing dirty Site change, `mergeProviderGroups` keyed duplicate providers by ID but overwrote earlier endpoint records. A reproduced case (provider available near origin, unavailable near destination) failed because last-write-wins discarded the successful endpoint plus its city/source/service coverage. Updated only the merge behavior to OR `available` and union `cities`, `sources`, and `services` while preserving a non-empty name. Added the regression to the already-dirty `tests/transport-preferences.test.ts`. Verification on Site branch `codex/sync-journey-mobility-ui`, HEAD `8f238ba170f0d6c212f06fa25aec2a9fdfb26699`: regression failed before the fix; complete focused module passed **15/15** after; targeted ESLint passed; `git diff --check` passed. The modified source/test files already contained unrelated owner work, so no commit or broad staging was performed. This proves deterministic merge logic only, not live endpoint or end-to-end route acceptance. Preserve the dirty work. Production remains `NOT_RELEASED`.


Follow-up verification: full `npm run typecheck` passed on the same dirty canonical Site checkout after the endpoint-union regression fix; targeted ESLint and all 15 transport-preferences tests remain green. Cross-repo contract inspection confirms Server accepts `allowedProviderIds` and passes those IDs into bicycle/scooter route estimates. The canonical Marketplace component has 290 additions/48 removals across unrelated dirty UX changes, so it was not staged or committed wholesale. No live request was possible because local API dependencies remain unavailable.

## Focused runtime and routing recheck — 2026-10-29

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Three strategy scoring and partial-search disclosure | Canonical Server dirty checkout `feature/transport-layer-availability`, HEAD `30f9691f1789b28400a3995469677bd4f5f32ca9`; `npx tsx --test tests/journey-scoring.test.ts tests/journey-search-completeness.test.ts`: 22/22 passed. Covers Optimal/Balanced, Fastest, Cheapest, unknown-fare handling, distinct winners, and truncation reasons. | PASS (local unit tests, dirty source) | Does not prove real-feed chain completeness or UI/API behavior. |
| Site provider discovery at both journey endpoints | Server `/api/v1/mobility/providers` filters provider records by requested point against the provider coverage bbox; dirty Site merge unions endpoint-local availability and coverage. Site focused module 15/15, typecheck, targeted ESLint and diff check previously passed. Site HEAD `8f238ba170f0d6c212f06fa25aec2a9fdfb26699`. | PASS (contract + local tests, dirty source) | Live endpoint-to-route flow remains unverified. |
| Exact-head Server route candidate PR #50 | Both GitHub `verify` checks pass on PR head `84f700e15f39d77575dd7e71ce52550751c22403`. | PASS (hosted CI) | No staging or merge; CI alone does not prove journey correctness. |
| Server build-version diagnostics PR #61 | Both GitHub `verify` checks pass on PR head `91afed290518291ccb8cc9ee8208e24991356fbe`; diff adds safe `/version` metadata. | PASS (hosted CI) | Open draft; not integrated into a deployed tuple. |
| Local Web→API runtime | Web process PID 25589 serves only `127.0.0.1:3000`; no listener on `3002`, `5434`, or `6380`; Docker daemon unavailable; 13 GiB disk available. | BLOCKED / OPEN | Need owner-authorized Docker Desktop startup; inspect existing volumes then use an isolated Compose project. Production remains `NOT_RELEASED`. |

| Bounded multi-leg routing and transfer feasibility | Same dirty Server SHA `30f9691f1789b28400a3995469677bd4f5f32ca9`: filtered GTFS tests 4/4 passed for retention of a cheaper three-leg route after a 13,000-alternative two-leg pool, exhaustive two-transfer oracle with strategy winners, four-segment composition, and rejection of an infeasible transfer buffer. | PASS (local deterministic fixtures) | Dense fixture takes ~28s; not a live Lviv-feed, Web/API, staging, or production proof. |

| Hosted pinned cross-repository browser E2E | Root PR #5 exact head `688b58ca6eeae0175ee34cf1c423a3e35c9f765d`, CI run `40301391620`: workflow includes pinned release materialization and cross-browser tests but stops before them because `MARSHGO_REPOS_READ_TOKEN` is unset for private Admin/Partner Contents access. | BLOCKED_EXTERNAL | Owner must configure a read-only GitHub Actions secret; do not skip or weaken the gate. |

| Local Site→API origin configuration | Existing untracked root launcher now includes `localhost:3000` and `127.0.0.1:3000` in `CORS_ORIGINS`, matching README/Vite and Server middleware; shell syntax and loopback environment validation pass. | PASS (static local launcher config) | No API process or browser CORS exchange ran; PostGIS/Redis/Docker blocker remains. |

| Public zrok Web preview | Canonical dirty Site branch `codex/sync-journey-mobility-ui`, HEAD `8f238ba170f0d6c212f06fa25aec2a9fdfb26699`, preview at `127.0.0.1:3001`; current public share targets this port; public `/` and `/journeys/search` return HTTP 200. Active preview PID 41545, zrok PID 36476. | PASS (UI preview only) | Public `/healthz`, `/readyz`, and `/api/healthz` return 502; API/PostGIS/Redis are down, so no UI→API, route-search, booking, staging, or production acceptance. |
| OTP sign-in via public zrok | Current external and local checks reproduce HTTP 502 from API proxy endpoints; no listener on `127.0.0.1:3002`. Current public `productionApi` bundle contains the Ukrainian 502 fallback; the supplied screenshot's English text does not match that current fallback and may be from a cached/older client or another error path. | BLOCKED (runtime unavailable) | Current disk free is 13 GiB (YELLOW); Docker daemon is stopped; PostGIS `5434`/Redis `6380` are down. Host PostgreSQL `5432` lacks PostGIS and was not used. Start the isolated runtime only after resource preflight is GREEN, then verify OTP with a real configured SMS provider; never enable public development OTP. |
| API-unavailable message in Site | Added localized fallback for 502/503/504; focused unit test 2/2, targeted ESLint and Vite build pass; public zrok asset contains the new message. | PASS (unit/build/public-asset check) | Does not make auth succeed; live API still returns 502. End-to-end auth remains blocked on API/PostGIS/Redis. |
| Local stack diagnostics | Added `scripts/local-stack-status.sh`; shell syntax and diff checks pass; live run correctly detects Site/preview HTTP 200 and API/Postgres/Redis/Docker unavailable. | PASS (local diagnostics) | Read-only status tool, not a service startup or end-to-end acceptance. |
| Public-tunnel dev-auth safety | Local launcher forces dev bypass and dev OTP off, refuses `SMS_PROVIDER=development`, and allows only the exact zrok origin; syntax/normal preflight pass and synthetic development-provider case is refused. | PASS (launcher config/guard) | Runtime not started; live SMS provider is unset. This closes the bypass risk but does not enable sign-in. |
| Missing-SMS user error | Site translates `sms_provider_unavailable` / `sms_delivery_failed`; focused unit tests 3/3, targeted ESLint, full typecheck and build pass; current zrok asset serves the new copy. | PASS (unit/typecheck/build/public-asset check) | No API/SMS provider is active, so real OTP delivery and sign-in remain BLOCKED. |
| Public zrok development-auth guard review | Gemini 3.8 Flash Medium read-only review confirmed launcher disables bypass/dev OTP, rejects development provider from shell or `.env`, and keeps exact-origin CORS. | PASS (independent config review) | Antigravity-reported 81,109 tokens / 149s; no quota telemetry. Does not prove runtime auth because API and SMS provider are unavailable. |
| Local SMS readiness diagnostics | API launcher warns on missing/incomplete real SMS config; local stack status reports `auth_sms BLOCKED` without printing secrets. Shell syntax, preflight, live status, and diff checks pass. | PASS (diagnostic behavior) | No SMS provider is configured, so real OTP and sign-in remain unavailable. |
| Unverified GetOtp adapter fails closed | Dirty Server source at HEAD `30f9691`: `SMS_PROVIDER=getotp` returns the existing unavailable error without making a network call; focused `tests/sms.test.ts` 3/3, targeted ESLint and full Server typecheck pass. | PASS (local unit/static check) | Twilio credentials and live API remain absent; no OTP delivery or authenticated route search is proven. |
## 2026-10-29 — Login restore outage visibility

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Explain backend outage on initial auth restore | Site HEAD `8f238ba170f0d6c212f06fa25aec2a9fdfb26699` with dirty source: `authRestoreErrorMessage()` preserves the normal silent 401/403 sign-in path, surfaces localized 502/503/504/network and timeout failures. `npx tsx --test tests/request-error-message.test.ts`: 4/4; `npm run typecheck` and targeted ESLint pass. | PASS (local unit/static checks, dirty source) | The updated source was not rebuilt into the zrok preview because disk remains YELLOW. It does not restore API or SMS; live sign-in and route search remain blocked until API/PostGIS/Redis and real SMS provider are available. |
## 2026-10-29 — Canonical local stack runbook

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Reproducible canonical Server+Site local startup | README invokes disk/RAM-gated `local-dependencies.sh`, root `.env` for canonical Server migration, guarded `start-local-api.sh`, and canonical Site on loopback. Compose config parses; shell syntax/live status pass. Disk start gate refused at 13 GiB; synthetic 20% memory gate with 25 GiB disk refused before Docker invocation. Current status: memory 37% free, swap 2.0 GiB, load ~2.6/8. | PASS (runbook/preflight only) | Runtime not started; Docker unavailable and SMS missing. Authenticated route acceptance remains NOT_TESTED. |
| Generic gateway and network error localization in Site | Isolated worktree `/private/tmp/marshgo-site-error-localization-20261029`, branch `codex/site-error-localization-20261029`, base SHA `8f238ba170f0d6c212f06fa25aec2a9fdfb26699`: `requestErrorMessage()` filters generic English proxy/gateway messages (`Bad Gateway`, `Gateway Timeout`, `Service Unavailable`, `connect ECONNREFUSED`, `Request failed (50x)`) on 502/503/504 to Ukrainian outage copy while preserving safe custom server messages; `productionApi.ts:request()` catches fetch network errors and maps them to the localized message. Focused `tests/request-error-message.test.ts` 6/6 PASS, `tsc --noEmit` PASS. | PASS (isolated unit/typecheck) | Local frontend unit check only; does not restore offline backend or unblock live auth/search. |
| Server PR #50 search regression resolution and test suite | Worktree `/private/tmp/marshgo-gtfs-connector-key-index-20261028` at remote head `84f700e15f39d77575dd7e71ce52550751c22403`: intermediate `1ad337e` inner-loop sorting regression fixed via commits `bfc356a`, `9691d7f`, `7341674`, and `84f700e`. Focused unit tests `gtfs-timetable.test.ts` 96/96 PASS (29.8s), `bounded-trip-retention.test.ts` 9/9 PASS, and `journey-scoring.test.ts` 22/22 PASS (total 127/127 PASS). | PASS (unit test verification) | Unit and replay verified; does not unblock offline runtime on 3002. Production remains NOT_RELEASED. |
| Server PR #59 multihop retention and queue scan profiling | Worktree `/private/tmp/marshgo-gtfs-multihop-retention-fix-20261029` at HEAD `90ec8cb1ce3bfb7a49fd1f187b427a4ed83d476b` (identical source to `34a6905`): GitHub PR CI `40917168473` SUCCESS. Unit tests 29/29 PASS; `tsc --noEmit` PASS. Replay run `40914927922` confirms multi-hop retention with +26.01% latency (7067→8905 ms); profiling isolates 6.92M linear queue scans and 2,045 `splice()` calls in `itineraries-ranked`. | PASS (unit/CI/replay profiling) | Performance optimization required before integration; production remains NOT_RELEASED. |


| GTFS route shape truthfulness (dirty worktree) | Site `eda449f008025b2126c92fd24cd68deb513ca3ad`, focused `tests/journey-route-map.test.ts` 14/14 PASS and targeted ESLint on the route model, camera controller and test PASS; Server `e9934abbd8fc973177de8d7f47548739758a1b74`, focused geometry-provenance helper test 2/2 PASS, strict helper-only typecheck PASS, in-memory syntax transpile PASS (0 diagnostics), and diff check PASS; removed stop-coordinate/endpoint fallbacks from both transit serialization paths. Legacy `composeKyivMultimodalChains` stop-line synthesis was also removed, but it has no caller in `server/` or tests and is not live-flow proof. | PARTIAL | Server tests/API/browser not run: Server `tsx` and ESLint plugin missing; `/readyz` 502; disk 9.7 GiB and free memory 32%. Source-shape-presence through Server serialization still requires runtime proof. Not staging/production acceptance. |
### 2026-11-06 — Qoder geometry provenance candidate (isolated)

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Validate Qoder's proposed route geometry provenance and bounded pedestrian routing | Isolated worktree `/Users/dima1203/.qoder/worktrees/app/e2e66b/MarshGO-Server`, branch `qoder/geometry-provenance-p0`, base `e9934abbd8fc973177de8d7f47548739758a1b74`; candidate diff check passes. Attempt to invoke `tests/journey-geometry-provenance.test.ts` exited 127 before the runner because `node_modules/.bin/tsx` is absent in both candidate and canonical Server. | BLOCKED / NOT_RUN | Do not infer correctness from static diff. Restore disk headroom and locked dependencies, run focused tests/typecheck, review against canonical dirty Server before integration. API/DB are unavailable, so no live route geometry proof. |
### 2026-11-06 — Follow-up: test runner found, execution deferred by memory gate

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Run Qoder's isolated geometry/provenance tests without downloading dependencies | Canonical Site contains `node_modules/.bin/tsx`; Server and Qoder worktrees do not. Fresh host sample: 9.5 GiB free, 30% memory free, 9,792.81 MiB swap in use. | BLOCKED / NOT_RUN | Do not retry below 35% free memory. At recovery, try the existing Site runner against the candidate and require successful module resolution before interpreting results. |
### 2026-11-06 — Qoder candidate integration safety review

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Keep test-only static graph fallback disabled in non-test runtime when reviewing Qoder geometry candidate | Initial candidate dropped the canonical guard. Codex restored `isStaticMultimodalFallbackEnabled` in the isolated candidate; helper is byte-identical to the canonical dirty helper (`NODE_ENV=test` plus explicit opt-in). | IMPLEMENTED IN CANDIDATE / NOT_TESTED | Candidate is uncommitted and unintegrated; policy test and full route tests are NOT_RUN because disk is 7.1 GiB and memory 30%. Do not accept from static evidence alone. |
| Apply bbox-aware foot-routing to live GTFS access/egress/transfers and degrade safely when a foot router is unavailable | Codex changed the isolated candidate so each live GTFS walking pair calls `resolveWalkingEndpoint(from,to)` and preserves conservative estimates only without measured-walk requirements or explicit walking/time constraints. Regression assertions cover policy and pair-level bbox/national/uncovered-router selection. | IMPLEMENTED IN CANDIDATE / NOT_TESTED | Candidate remains uncommitted/unintegrated. Run focused route/outage tests and exact API serialization checks after disk >=8 GiB and memory >=35%; do not treat estimated distance/time as verified route geometry. |
| Restore local Server+Web readiness for a real user journey | At 2026-11-06 12:27 EET, `:4178` listens but `/readyz` returns HTTP 502; `:3002`, `:3019`, `:5434`, `:6380`, `:6381`, and `:4190` are closed. | BLOCKED / NOT_RUN | Disk 7.3 GiB free and memory 33%; do not start a stack or E2E under the project resource floor. Recover safe disk/memory headroom, then restore the pinned local dependencies and API/DB/cache and verify the provider-backed browser journey. No cache/data deletion was performed. |

### 2026-11-06 12:45 EET — direct runtime recheck

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Local Lviv foot-route geometry uses the matching graph | Direct OSRM `:3013` (`/data/lviv.osrm`) for `(24.0315921,49.841952)` → `(24.057585,49.794117)` returned 6,274.5 m, 4,521.7 s, 274 points, endpoint snaps 41.2/44.0 m. | PASS (local provider smoke) | Not proof of API/GTFS integration or route UI. |
| City graph does not silently claim a far-away route | Same Lviv pair against Kyiv OSRM `:3014` (`/data/kyiv.osrm`) returned `Ok` but 0 m/0 s; both endpoints snapped 443–444 km away. Server `fetchOsrmRoute` requires positive distance/duration and rejects this response; pair bbox selection is required. | PASS (provider behavior and static source guard) | Candidate resolver assertions are NOT_RUN; no API invocation verified. |
| Web preview is backed by a ready API | Site PID 60339 (`vite preview`, `:4178`) serves `/journeys/search` HTTP 200, but `/readyz` and `/api/healthz` return 502 and Server listeners `:3002`/`:3019` are absent. Acceptance DB/Redis containers are healthy internally; walking routers are up. | BLOCKED / NOT_RUN | Host resource gate at 12:43 EET: 6.9 GiB disk free, 30% memory free, 11,041.62 MiB swap. Do not start API/tests until safe thresholds recover. |

### 2026-11-06 12:51 EET — local launch/auth preflight

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Safely start API without development auth bypass | `scripts/start-local-api.sh --check` exits 0; launcher explicitly disables `AUTH_DEV_BYPASS`, `AUTH_DEV_OTP`, `SMS_PROVIDER`, fixtures and static estimates. | PASS (preflight only) | No API was launched because disk is 6.8 GiB and memory 31%; it does not prove runtime readiness. |
| Real OTP sign-in | `scripts/local-stack-status.sh` reports `auth_sms BLOCKED`: no complete real SMS provider configuration. | BLOCKED_EXTERNAL | Obtain/configure owner-authorized Twilio or GetOTP credentials and an authorized test destination. Do not send billable SMS or enable development OTP without that authorization. |


## 2026-11-06 15:55 EET — Server PR #76 current-main lifecycle port

- Candidate: `codex/journey-activation-main-20261106`, base `e5b6be86b9d738281dcafddd15f9a32c6f891fdf`; isolated APFS worktree.
- Implementation in progress: activation/end routes, read timestamps, opt-in integration regressions. Static `git diff --check` PASS; integration suite NOT_RUN due to 34% free memory (gate ≥35%).
- Independent review: P1 outbox dedupe key collision on reactivation after replan; fix + regression requested. Not yet committed/pushed; no PR/CI evidence.
- Acceptance: exact-head integration CI required before merge; staging/release acceptance remains NOT_RUN.


## 2026-11-06 15:59 EET — Server journey activation PR #93

- Exact candidate head `cfc4ca4ce4ed772c31d1981d047e931dc304d555`, base `e5b6be86b9d738281dcafddd15f9a32c6f891fdf`; PR #93 open. Scope: authenticated journey activation/end, lifecycle read fields, focused DB integration regressions and suite registration.
- Static `git diff --check` PASS; independent review collision finding fixed and re-reviewed. Local integration tests NOT_RUN (memory free 30%, gate >=35%).
- Exact-head GitHub `verify` runs `42229759600` and `42229789831` are PENDING. Merge, staging, live-source and cross-component acceptance NOT_YET_VERIFIED.


## 2026-11-06 16:01 EET — PR #93 first exact-head CI result

- Run `42229759600`: audit, lint, typecheck, unit suite, and migrations PASS. Integration 5 passed / 1 failed at new test line 140 because aggregate query for persisted outbox recipients returned null; test query is under correction. API image build and smoke did not run after failure. Reactivation regression itself passed.
- Second run `42229789831` pending at last poll. Local tests NOT_RUN; memory free 30%. Candidate remains unmerged; CI acceptance FAIL/PENDING until new exact-head checks pass.


## 2026-11-06 16:03 EET — PR #93 follow-up head `cb29a5c618c09764d9a192349e462212a24da4eb`

- Corrected integration assertion reads the persisted `recipient_ids` UUID array directly. Static diff-check PASS.
- Exact-head CI run `42230249261` is IN_PROGRESS. Prior head failed one test query; no merge/acceptance claim until all current-head checks finish.


## 2026-11-06 16:06 EET — Server lifecycle change merged

- PR #93 merged at `068a48f0627f5e390531ea04bfa82b2a03b71516`. Candidate exact-head `verify` runs `42230249261` and `42230239346` passed the full Server suite, integration, production image build and PostGIS/Redis smoke.
- Post-merge main CI `42230914946` is running on the merged SHA. Until it passes, post-merge status remains PENDING. No staging/live/cross-component release acceptance is implied.


## 2026-11-06 16:09 EET — Server main exact post-merge CI verified

- Server main `068a48f0627f5e390531ea04bfa82b2a03b71516` post-merge CI `42230914946` PASS: audit, lint, typecheck, unit, DB migrations, full integration, API image build and PostGIS/Redis smoke.
- Evidence is local CI/fixture acceptance only. Live feeds, staging, unified six-SHA integration, physical iPhone, backup/restore and production deployment remain NOT_VERIFIED.


## 2026-11-06 16:17 EET — Site PR #79 exact-head checks pending

- Candidate head `0c5aa3290167785650b66e9c09c79c365eee70b8`, base `9cbb4a498037219358108c4ea08ac444b88d531a`. Static diff-check PASS; current Site CI `42232471579` and `42232499118` pending.
- Local test/build, visual regression, browser E2E and API-connected acceptance NOT_RUN; local root returns HTML 200 but API readiness is unavailable. No merge.


## 2026-11-06 16:30 EET — Site PR #79 CI status

- Exact head `0c5aa3290167785650b66e9c09c79c365eee70b8`: Site CI `42232499118` PASS (Playwright install and boot smoke included). Duplicate `verify` run `42232471579` has been IN_PROGRESS ~13 minutes on Playwright installation; PR remains BLOCKED.
- Local visual/API acceptance NOT_RUN; no merge until required checks reach terminal successful status.


## 2026-11-06 21:45 EET — current Server CI and local first-journey blocker

| Gate | Evidence | Result |
|---|---|---|
| Server main after PR #97 | Main SHA `1f652b348c4afc08eaf4af20c90bf829e1ab9f5a`; CI run `42280810797` PASS; PR exact-head runs `42280116164`, `42280110406` PASS | VERIFIED by GitHub Actions; does not prove live provider behavior |
| Local Site | PID `60339`, Vite preview, dirty Site HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`; root HTTP 200 | LOCAL_ONLY, not pinned release candidate or visual acceptance |
| Local API | Container image ID `sha256:e5c2711be854a2d2785669c2916f3f25917cf93c84abd80454e073be9e38062b`; build `local-20261106T181135Z`; SHA `8d3239cf84ab9aca7693f579a77822f00a279453` | Stale vs current Server main; readiness 200 (DB/realtime connected) |
| Lviv transport providers | `/api/v1/mobility/providers?lat=49.8397&lon=24.0297` returns only community carpool; all external provider arrays are empty in the active local API | No live transit route verified |
| Geocoding | Local `/api/v1/places/suggest?q=Львів` returns 503 `geocoder_unavailable`, “Geocoding service is not configured” | BLOCKED pending approved endpoint/configuration |
| User route flow | Unauthenticated journey search returns 401; no test session used | NOT_TESTED end-to-end |
| Root release gate PR #20 | Exact head `041ab47d083830f1b4271ccf4c3b5d6cde080339`; CodeQL/Gitleaks PASS; CI `42265893827` fails before tests on HTTP 403 cloning private Admin | BLOCKED_EXTERNAL on Actions read access |

Qoder UI now shows the Server routing task active with Qwen3.8-Max, Medium. Local memory was 31% free (<35% gate), so no rebuild, browser E2E, or heavy test was started. Production remains `NOT_RELEASED`.
## 2026-11-06 22:09 EET — API fault evidence and mitigation candidate

| Gate | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Local API process resilience | Container `marshgo-local-api-api-1` exited code 1, `OOMKilled=false`; redacted tail ends on an unhandled `pg` Client `Connection terminated unexpectedly`. The dev Postgres container remains healthy with zero restarts. | FAIL / ROOT CAUSE MATCHED, exact client unknown | Current Server source uses a checked-out `PoolClient` in periodic outbox dispatch and request handlers. Pool `error` listener only covers idle errors. |
| PostgreSQL error listener candidate | Server PR [#98](https://github.com/dima1203oleg/MarshGO-Server/pull/98), head `4aa0e98dfdad6189c79010ce0b4f5ee050c76919`, adds one per-physical-client error listener and focused unit tests. Syntax and `git diff --check` pass. | PENDING | Exact-head CI runs `42285579565`, `42285624474` pending at last poll. Local typecheck/full tests and real DB fault-recovery test not run; do not merge yet. |
| Web + API journey | Site PID `60339` HTTP 200; API port 3002 has no listener. Local geocoder is unconfigured; local provider DB has no Lviv external provider rows. | BLOCKED / NOT_TESTED | Restore current-Server API after resource gate; configure approved geocoder/feed sources, then run authenticated route→map→navigation acceptance. |
| Resources | Disk 24 GiB free; memory free 28%; swap ~11.4 GiB at 22:09 EET. | BELOW HEAVY-WORK GATE | Defer build, full tests and browser E2E until memory free >=35%. Existing DB/Redis/OSRM containers left running. |

## 2026-11-06 22:15 EET — PR #98 exact-head CI status update

| Gate | Evidence | Status | Boundary / next step |
|---|---|---|---|
| PostgreSQL checked-out client mitigation | PR #98 head `4aa0e98dfdad6189c79010ce0b4f5ee050c76919`; Server CI runs `42285579565` and `42285624474` both SUCCESS on that exact SHA. | CI PASS / REVIEW PENDING | No real PG socket termination + API survival/readiness recovery test. Wait for read-only Qoder review, then decide whether disposable DB fault test is required before merge. |
| Qoder review | Qwen3.8-Max side task “Review PR 98 pg-pool” started, read-only; UI showed Running. | IN_PROGRESS | It must assess event listener semantics, error propagation, listener lifecycle, types, tests, and remaining evidence. |
| Unified local journey | API container remains exited; no port 3002 listener; Site preview HTTP 200 only. | BLOCKED / NOT_TESTED | Keep the stale API image out of candidate claims. Resume with current Server main only when resource gate permits; geocoder and Lviv provider sources remain unavailable locally. |
| Resource gate | Last sample memory free 27%, swap ~11.2 GiB; disk ~24–25 GiB. | BELOW HEAVY-WORK GATE | Defer local build, full tests, and browser E2E until memory free >=35%. |

## 2026-11-07 00:53 EET — local route acceptance and exact-head release blocker

| Gate | Evidence | Result | Boundary / next action |
|---|---|---|---|
| Local API readiness | Exact Server main `7774a81a77afbbdbec7248e2b343020f29cf61f1`; `/readyz` reports DB and realtime connected on isolated disposable local Postgres/Redis. | LOCAL_TESTED | Not a separately hosted staging environment. |
| Lviv provider schedule | Current Server feed validator accepted public Lviv static GTFS: 1,071 stops, 72 routes (64 bus/8 tram), 15,141 trips, 406,422 stop-times, valid coverage bbox and service calendar for next 7 days. | LIVE_FEED_VALIDATED | Static schedule only; no live GPS or booking claim. |
| Web route search | Visual browser flow from geocoded Lviv center to Sykhiv, 2026-11-08 08:00: 9 scheduled candidates, direct bus/tram and transfers; page correctly notes approximate walking because exact pedestrian routing is not configured. Site preview SHA `eda449f...`, Server SHA `7774a81...`. | LOCAL_TESTED | Preview runs a pre-existing dirty branch, not current Site main. No booking/payment performed. Fare values come from the configured static tariff registry, not live operator pricing. |
| Current Site main | Site main SHA `2f222f43c704fead860a47ad9d5740fa19efae81`; post-merge CI run `42303606921` passed build, tests, boot smoke and bundle checks. Workflow published no artifact. | CI_VERIFIED | Visual browser acceptance on the exact current-main bundle NOT_TESTED. |
| Approved zrok URL | `/readyz` reports ready and provider endpoint shows local Lviv GTFS because the URL tunnels to the current laptop dev stack. | LOCAL_TUNNEL_ONLY | Not independent staging evidence; staging acceptance remains NOT_TESTED. |
| Root PR #12 | Exact head `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757`, rerun `41918171313` attempt 3: tests, migration and build passed; release materialization failed HTTP 403 cloning private Admin. | BLOCKED_EXTERNAL | Owner must rotate exposed token and update Actions secret with Contents: read on Admin + Partner, then rerun exact-head CI. Docker/E2E did not run. |
| Production | No approved production rollout performed. | NOT_RELEASED | Requires full exact-SHA/staging/security/operations acceptance and separate rollout approval. |
## 2026-11-07 01:06 EET — visual local route smoke

| Test | SHA / environment / data | Result | Boundary |
|---|---|---|---|
| Search `Львів, Львівська область` → `Стрий, Львівська область` at 2026-11-08 08:00 | Browser UI → local API; Site dirty preview SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`; Server main SHA `7774a81a77afbbdbec7248e2b343020f29cf61f1`; geocoder returned real named places | FAIL / truthful empty state: no transit stop found within walking range | Active disposable API registry contains Lviv urban bus/tram only; provider API lists no intercity bus/train and no Stryi provider. No route is available in this runtime. |
| Positive control `Львів, Львівська область` → `Сихів, Львів` at 2026-11-08 08:00 | Same browser, local API and SHAs; source is validated static Lviv GTFS | PASS / 8 scheduled options rendered in ~7 s, direct tram/bus and transfers; three strategy controls available | UI explicitly says pedestrian access is approximate. Schedule only, not live GPS. Fare registry values are not operator-verified. |
| Local runtime identity and readiness | `4178` PID `60339` serves the dirty Site checkout; `3002` PID `41361` is isolated Server-main; `/readyz` local and through zrok both HTTP 200 | LOCAL_TESTED | zrok is a tunnel to the local stack, not independent staging. |
## 2026-11-07 03:49 EET — direct walking candidate source change (not yet API acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Nearby local trip should offer walking | Prior visual result: ~56 m OD returned a 7-minute/30-UAH scheduled tram loop; source review found no standalone WALK candidate. | DEFECT_REPRODUCED | A measured direct-walk candidate was added in isolated Server candidate SHA `90ed82837453ebcd23be9e7cc8d18c8bb5f62000`; live API still runs prior source. |
| Direct-walk candidate constraints | Helper requires measured route geometry, rejects invalid geometry, and enforces max-walk/max-duration preferences. | UNIT_TESTED | `npx tsx --test tests/direct-walking-candidate.test.ts`: 3 passed, 0 failed/skipped. Does not prove endpoint or DB persistence. |
| Candidate integration | Server index now generates, ranks, and persists `osrm-foot-route` WALK-only candidates for local OD <=5 km when the configured foot graph covers the pair. | IMPLEMENTED_NOT_INTEGRATED | Typecheck/API-DB integration and fresh visual search are pending; no commit, push, or runtime restart. |
| Runtime resources | 03:49 EET: disk 20 GiB free, memory free 24%, swap used 14.28 GiB. | HEAVY_CHECKS_DEFERRED | Project gate is 35% free memory; defer typecheck/build/restart/E2E until available. |
## 2026-11-07 03:56 EET — endpoint reachability and auth boundary

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Site route HTTP | PID `60339`, dirty Site checkout, `127.0.0.1:4178` and zrok tunnel | HTTP 200 | Static UI response only; not authenticated journey acceptance. |
| API health/readiness | PID `61835`, isolated Server candidate worktree at baseline `90ed82837453ebcd23be9e7cc8d18c8bb5f62000`, local `:3002` and zrok | `/healthz` 200, `/readyz` 200 | Current process was launched before latest uncommitted walking-candidate patch; not evidence that patch is active. |
| Protected user endpoint | Same local and tunneled API | `/api/v1/journeys/me` 401 without session | Expected auth boundary; successful login and authenticated browser replay not tested. |
| Registration endpoint validation | Local `:3002` + zrok | Invalid, non-user payload returns HTTP 400 `invalid_email` at both endpoints | Proves request reaches API validation and has no account side effect; successful registration/login remains NOT_TESTED. Existing form still displays a retained generic 502/503/504 message. |
| Resource gate | Mac, ~04:00 EET | Disk 20 GiB free; RAM free 25%; swap 14.22 GiB used | Heavy typecheck/build/API integration/browser replay deferred below >=35% RAM gate. |
| Existing authenticated search tab | Site preview `4178`, Lviv center → Rynok Square, query date 2026-11-08 08:00 | Visual accessibility snapshot rendered 3 scheduled transit results; quickest 6 min / 30 UAH; UI says walking access is approximate; no direct walking-only choice | UI and API are reachable, but route ranking is unsuitable for two points ~56 m apart. Not live GPS, fare, or release acceptance. |
| Direct-walk helper | Isolated dirty Server worktree | 4 unit tests passed, 0 failed/skipped; diff check passed | Typecheck, DB persistence/API test, runtime restart and visual replay pending. |
| Resource gate | Mac, 03:56 EET | Disk 21 GiB; free RAM 28%; swap 13.32 GiB | Heavy test/build/browser work deferred below the configured >=35% RAM / >=20 GiB disk gate. |
## 2026-11-07 04:15 EET — endpoint snapping regression

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Lviv foot router OD | Local OSM-derived foot graph `127.0.0.1:3013`, requested coordinates from authenticated visual search | Returns 19.6 m geometry; starts 41.1 m away from origin, ends 11.5 m from destination; straight-line OD 56.1 m | Source geometry does not connect to requested places and understates door-to-door travel. Not acceptable as an exact route. |
| Direct-walk endpoint guard | Isolated Server branch based on `90ed82837453ebcd23be9e7cc8d18c8bb5f62000` | Rejects endpoint snap >15 m and impossible path shorter than geometry chord; explicit provider error | Behavior is unit and API/DB integration verified; the affected Lviv pair correctly has no claimed direct walk. |
| Server typecheck | Same dirty candidate worktree | `npm run typecheck`, exit 0 | Local typecheck only. |
| Direct-walk helper tests | Same dirty candidate worktree | 6 passed, 0 failed/skipped | Unit evidence only. |
| Direct-walk API integration | Candidate API on `127.0.0.1:3306`, migrated disposable loopback `marshgo_e2e`, actual local foot router | 1 passed, 0 failed/skipped; snapped route neither returned nor persisted; provider issue disclosed; fixture user cleaned | Exact dirty worktree candidate tested, not merged; no authenticated browser replay of this source yet. |
## 2026-11-07 04:20 EET — Server PR #105

| Gate | Evidence | Status | Boundary |
|---|---|---|---|
| Candidate base/head | Server `main` base `7b4f9c59f48749cc73b9441e709928ef7fca9d2c`; head `efff2e17d7b34b2ddadef212abcc34880be98725` | PR #105 OPEN, MERGEABLE | Branch is one commit, exact main SHA pinned at creation. |
| Local quality gates | Current-main isolated worktree | Typecheck PASS; changed-file ESLint PASS; unit 6/6; focused API/DB integration 1/1; diff check PASS | No full Server suite, browser replay, staging, or live provider verification. |
| GitHub checks | [PR #105](https://github.com/dima1203oleg/MarshGO-Server/pull/105) | Runs `42328644408` and `42328671510` PENDING at 04:20 EET | Merge only after required exact-head checks and branch rules pass. |

## 2026-11-07 04:28 EET — Server PR #105 candidate (not release acceptance)

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Direct walking geometry guard | Server candidate `80c4c327bb052fc588336e87c6cada0a04d844d5` | Endpoint snap capped at 15 m; measured distance must cover the full polyline within rounding tolerance; helper tests 7/7 pass | Does not create a route when the local foot graph snaps away from requested points. |
| Direct walking API integration | Same candidate, loopback `marshgo_e2e` DB, test-only fixture on `127.0.0.1:3305`, API on `127.0.0.1:3306` | 1 passed, 0 failed/skipped; bad route not returned or persisted | Fixture only; not a live provider test. |
| Candidate quality checks | Same candidate | Typecheck, changed-file ESLint, shell syntax, JSON parse, and diff check PASS | Full Server suite not run on this PR head. |
| GitHub exact-head CI | PR #105 head `80c4c327...` | Run `42329320971` in progress; `42329325443` queued at 04:27 EET | Earlier checks on prior head do not apply; no merge yet. |
| Device/runtime/staging | Current local preview and tunnel | NOT_TESTED on this candidate | Runtime remains on older Server process; staging/production are not verified. |

## 2026-11-07 04:32 EET — Server PR #105 merged

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| PR #105 exact-head CI | Server `80c4c327bb052fc588336e87c6cada0a04d844d5` | Runs `42329320971` and `42329325443` both PASS; full CI includes integration, API image, PostGIS/Redis smoke and Compose lifecycle | Evidence applies to the exact PR head; main SHA has separate post-merge run. |
| Server main after merge | `20f64a8b745137f08808d0198ea554f8da8a3911` | Merged; main CI run `42329710222` IN_PROGRESS as of 04:32 EET | Do not claim final main CI until the run completes. |
| Local preview visual replay | Current process still uses pre-merge API | NOT_TESTED on merged SHA | No runtime restart; production and staging remain unverified. |

## 2026-11-07 04:42 EET — exact Server main runtime smoke (not staging)

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Post-merge Server CI | Main `20f64a8b745137f08808d0198ea554f8da8a3911`, run `42329710222` | PASS: audit, lint, typecheck, unit, DB migrations/integration, production API image, PostGIS/Redis smoke, Compose lifecycle | Server CI does not prove cross-repo E2E or staging. |
| Local Server runtime | PID `70458`, detached worktree at exact main SHA, `127.0.0.1:3002` | `/healthz` 200; `/readyz` 200 (database/realtime connected); `/api/v1/version` SHA matches | Development env; sourceState dirty only due temporary dependency symlink. |
| Site/tunnel/API smoke | Site `127.0.0.1:4178`; zrok tunnel | Search page 200, tunneled readiness/version 200; protected `/api/v1/journeys/me` 401 with no session | This is local development through a tunnel, not staging. No visual replay on new SHA. |
| Direct walking coverage | Local `.env` | Walking router URL absent | No direct route claim for the selected short OD; endpoint guard fails closed. |

## 2026-11-07 05:12 EET — Server main exact post-merge CI

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Server main CI | `5a137bd79a55da5a8a96cd99da548938e7e42d41`, run `42332551933` | PASS in 3m55s: audit, lint, typecheck, unit, migrations, full integration, production API image, PostGIS/Redis smoke, Compose lifecycle | Does not establish Site compatibility, authenticated browser E2E, staging or production. |
| Fresh-browser auth gate | Dirty Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`, local preview | Sign-in form visible, API health/readiness 200, no credentials submitted | Successful login and provider-backed search remain NOT_TESTED. |

## 2026-11-07 05:08 EET — Server PR #107 merge

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| PR #107 exact-head checks | `1eee9220cfcce3b11f6527fb3d707f6b0d3b4908` | `42332213065` and `42332229176` PASS | Confirms fail-closed password-reset regression on PR head. |
| Server main after PR #107 | `5a137bd79a55da5a8a96cd99da548938e7e42d41` | PR merged; main CI run `42332551933` IN_PROGRESS | Do not claim merged-main validation until the run completes. |
| Password recovery | Server main `5a137bd...` | Explicit `503 password_recovery_unavailable`; same for known/unknown addresses, no token row | Real account recovery unavailable until approved email delivery integration. |

## 2026-11-07 05:04 EET — current auth and web reachability checkpoint

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Server PR #106 | Main after merge `bf471bfd66b8d2e2dbb9262573b30cf570ec0c34` | Merged; exact-head checks `42330903438` and `42330929349` PASS | Does not implement SMS; explicit disabled mode only. |
| Password reset behavior | PR #107 head `1eee9220cfcce3b11f6527fb3d707f6b0d3b4908` | Targeted ESLint and diff check PASS; exact-head CI `42332213065`, `42332229176` pending | Recovery correctly unavailable until email sender/config is added; PR not merged. |
| Fresh browser `/journeys/search` | Local Site `eda449f008025b2126c92fd24cd68deb513ca3ad` at `127.0.0.1:4178` | Page 200; visually shows welcome/login; existing-account button opens email/password screen | New Chrome profile has no session. Successful sign-in/search not tested. |
| Local and public API readiness | Runtime Server `20f64a8b745137f08808d0198ea554f8da8a3911` | `/healthz` and `/readyz` 200; DB/realtime connected; protected `/api/v1/journeys/me` 401 without auth | API runtime lags current main and does not prove authenticated journey flow. |
| Public zrok | `marshgo-dima.shares.zrok.io` | UI, `/readyz`, and version endpoint 200; first browser visit presents zrok interstitial | Local development tunnel only; not staging or production. |

## 2026-11-07 04:50 EET — production auth configuration and root CI blocker

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Optional disabled SMS mode | Server PR #106 head `009d91c14d107ccc47789dd269703f1ea962e1ac` | 13 config/SMS unit assertions pass; lint/diff pass | GitHub exact-head checks still pending; not merged yet. |
| Root release materialization | PR #12 head `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757`, CI run `41918171313` | FAIL: HTTP 403 cloning private MarshGO-Admin; downstream image and browser tests skipped | External Actions credential currently lacks readable access. No release acceptance. |
| Password reset delivery | Server main `20f64a8...`, static inspection | NOT VERIFIED: endpoint stores token and says sent, but no mail sender exists in canonical Server | Must implement provider delivery or fail closed; no email credentials/provider approval available. |
| Production Compose | Root main `1e7d0ee...` | NOT PRESENT on main; only found on dirty Antigravity branch 583 commits ahead | No safe production deployment contract on current main. |

## 2026-11-07 05:27 EET — fresh browser auth gate and Site PR #82

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Local Site `/journeys/search` | Dirty Antigravity Site `eda449f008025b2126c92fd24cd68deb513ca3ad`, PID 60339, `127.0.0.1:4178` | HTTP 200; visually renders sign-in form in fresh browser | Source gates marketplace on authenticated user; guest journey search is not implemented. |
| Local API health/readiness | Server runtime `20f64a8b745137f08808d0198ea554f8da8a3911`, PID 70458, `127.0.0.1:3002` | `/healthz` 200, `/readyz` 200 (DB/realtime connected), `/api/v1/journeys/me` 401 unauthenticated | Expected auth boundary; successful sign-in and route-search E2E remain NOT_TESTED. Runtime is behind Server main `5a137bd79a55da5a8a96cd99da548938e7e42d41`. |
| Site passenger lifecycle | PR #82 head `34f6db7f320493e06c65f0df42ab978ff08e5bfd`, base `2f222f43c704fead860a47ad9d5740fa19efae81` | 11 targeted tests, typecheck, targeted ESLint, diff-check PASS; GitHub CI runs `42333962416` and `42333981015` pending | Selective port of Qoder PR #51; do not merge until exact-head required checks pass. No live authenticated device validation. |

## 2026-11-07 05:30 EET — Site lifecycle integration

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Site PR #82 exact-head CI | `34f6db7f320493e06c65f0df42ab978ff08e5bfd` | Runs `42333962416`, `42333981015` PASS | Local lifecycle tests (11/11), typecheck, ESLint, diff-check also pass. |
| Site main after PR #82 | `a3a1edb8758801db1c165b0070a3cef9a19f11ee` | PR merged; post-merge CI `42334189278` IN_PROGRESS at 05:30 EET | Poll post-merge check; no exact six-SHA acceptance yet. |
| Fresh browser auth state | Dirty local Site `eda449f008025b2126c92fd24cd68deb513ca3ad`; local API `20f64a8b745137f08808d0198ea554f8da8a3911` | Page and API readiness return 200; protected endpoint 401; login shown | Guest search not implemented. Authenticated search and visual journey replay remain NOT_TESTED. |

## 2026-11-07 05:32 EET — Site post-merge verification

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Site main CI after PR #82 | `a3a1edb8758801db1c165b0070a3cef9a19f11ee`, run `42334189278` | PASS in 1m48s: lint, typecheck, tests, tokens, build, bundle, single React, Playwright install, boot smoke | Runner notices Node 20 action compatibility and ubuntu-latest image migration; no failed checks. |
| Authenticated visual journey search | Local browser; no account session supplied | NOT_TESTED | Site currently shows login; Server search requires auth. Owner sign-in/register needed to proceed; no credentials requested in chat. |

## 2026-11-07 05:37 EET — nested walking reach contract

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Server contract | Server main `5a137bd79a55da5a8a96cd99da548938e7e42d41` | Search `completeness.walkingReach` contains measured nearest-stop distances, extended flag and count | Validated in current main `server/index.ts`; these values are not necessarily live vehicle data. |
| Site response compatibility | Site PR #83 head `2b47dbd120ae34ff33c2b8560d3a0ff5103ec81d`, base `a3a1edb8758801db1c165b0070a3cef9a19f11ee` | 8 targeted tests PASS; typecheck, targeted ESLint, diff-check PASS; GitHub CI runs `42334845030`, `42334828168` IN_PROGRESS | PR not merged yet; no visual authenticated route replay. |

## 2026-11-07 05:40 EET — Site walking reach integration merged

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Site PR #83 | `2b47dbd120ae34ff33c2b8560d3a0ff5103ec81d`, base `a3a1edb8758801db1c165b0070a3cef9a19f11ee` | Merged normally; exact-head CI `42334828168`, `42334845030` PASS; 8 targeted tests, typecheck, ESLint, diff-check PASS | Post-merge CI run `42335004104` pending at 05:40 EET. |
| Authenticated browser journey search | Local Chrome | Owner said signing in; browser currently shows profile picker; auth NOT_CONFIRMED | Await owner's sign-in confirmation; no booking/payment. |

## 2026-11-07 05:41 EET — Site #83 post-merge check

| Check | SHA / environment | Result | Boundary |
|---|---|---|---|
| Site main after PR #83 | `f8334a0a9b768060b6d816ce6db9f52f7febff7e`, run `42335004104` | PASS in 1m42s: lint, typecheck, tests, tokens, build, bundle, single React, Playwright setup, boot smoke | Runner deprecation/migration notices only. |
| Authenticated journey visual test | Browser | NOT_TESTED; Chrome last showed profile picker, awaiting owner confirmation | Do not infer login or start transaction flows. |


### 2026-11-07 05:52 EET — current local Web search probe

| Gate | Result | Evidence |
|---|---|---|
| Local Site page and search form render | PASS (manual visual, local dirty Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`) | Codex in-app browser tab 26 at `127.0.0.1:4178/journeys/search`; Ukrainian search controls visible. This is not current-main acceptance. |
| API/DB readiness | PASS (local only) | `/readyz` HTTP 200; status `ready`, database and realtime connected; active API build SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, dirty development build. |
| Place autocomplete | FAIL / BLOCKED | UI message and direct `GET /api/v1/places/suggest?q=Львів` return HTTP 503 `geocoder_unavailable`: public Nominatim autocomplete explicitly rejected. |
| Provider-backed route search from UI | NOT_TESTED | Could not select a geocoded place; no route search assertion reached. |
| Production readiness | NOT_RELEASED | The active stack is not pinned to current six-repo main SHAs; no approved production geocoder is evidenced. |


### 2026-11-07 06:00 EET — local map-picker probe (dirty runtime)

| Test ID | Result | Evidence |
|---|---|---|
| WEB-LOCAL-MAP-001 | PASS (visual control + tiles only) | Dirty Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`, API build SHA `20f64a8b745137f08808d0198ea554f8da8a3911`; map picker opened, tiles rendered and attribution links were visible. |
| WEB-LOCAL-REVERSE-001 | PASS (local provider response only) | One map-selected point yielded coordinates and reverse-geocoded label `Борщовичі, Львівська область`; selection was not confirmed or persisted. This does not prove the point was in central Lviv. |
| WEB-LOCAL-SUGGEST-001 | FAIL | Place autocomplete returns HTTP 503 because the active local API refuses public Nominatim autocomplete. |
| WEB-LOCAL-ROUTE-001 | NOT_TESTED | No authenticated session; route search was not submitted. |
| REGION-MODES-001 | OBSERVED, NOT LIVE_VERIFIED | UI currently enables carpool/bus/tram and disables nine other categories for this local provider configuration. No provider-backed itinerary was run. |

### 2026-11-07 06:09 EET — latest API/geocoder recheck

| Test ID | Result | Evidence |
|---|---|---|
| WEB-LOCAL-PAGE-002 | PASS (page render only) | `http://127.0.0.1:4178/journeys/search` renders in the Codex browser. |
| API-LOCAL-READY-002 | PASS (development runtime only) | Local `/healthz` and `/readyz` HTTP 200. Active API SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, dirty development worktree. |
| API-TUNNEL-READY-002 | PASS (tunnel reachability only) | Owner zrok `/readyz` HTTP 200; this remains a tunnel, not independent staging. |
| WEB-PLACE-SUGGEST-002 | FAIL / CONFIG BLOCKED | Local and zrok `GET /api/v1/places/suggest?q=Львів` return HTTP 503 `geocoder_unavailable`; active API rejects public Nominatim autocomplete. No auth is required for this endpoint. |
| WEB-AUTH-ROUTE-002 | NOT_TESTED | No authenticated session confirmed in inspected tab; journey search requires auth. |
| SERVER-FOOT-ENDPOINT-002 | PASS (focused unit evidence only) | On code at `20f64a8...`, direct walking candidate test 7/7 PASS; PR #105 is merged. No API integration/live walking-provider evidence. |
| SERVER-GEOCODER-UNIT-002 | PASS (fixture/unit evidence only) | `node --import=tsx --test tests/geocoding.test.ts`: 15/15 PASS. Does not validate active provider config or live reliability. |
| ADMIN-PR-003-CI | PASS (merged-PR CI only) | Admin PR #3 exact head `4eb5d15d1692ebcdb5aae40dbcffc39446138fb5`; verify run `41332954531` passed; merge/current main `02b28940ee017523f2feed01de458f8d0aa20279`. No cross-component acceptance. |
| PARTNER-PR-003-CI | PASS (merged-PR CI only) | Partner PR #3 exact head `544e5d8c71a04601fae5f0d92dd5ec186f7ac241`; verify run `41332956900` passed; merge/current main `179631f45e984c5712bef83af43912125e3521d1`. No tenant-isolation acceptance. |
| ROOT-PR-012-PRIVATE-MATERIALIZATION | BLOCKED | Current verify log run `41918171313`, job `128201026409`, fails cloning private Admin with HTTP 403. Root `main` remains scaffold SHA `1e7d0ee74f11121a7d5a29c6379944a5360581c4`. |
| ROOT-PR-012-PIN-FRESHNESS | FAIL / REVALIDATION REQUIRED | PR #12 manifest pins are behind current main by Server 90, Site 108, iOS 4, Admin 1, Partner 1 commits. Pins are ancestors; no unified compatibility test for the latest tuple is evidenced. |

### 2026-11-07 06:25 EET — local runtime resource snapshot

| Check | Result | Evidence |
|---|---|---|
| Docker stack inventory | OBSERVED; no cleanup | Three Compose projects active (`marshgo-local-api`, `marshgo-server-main-7774a81`, `marshgo-acceptance`), two OSRM loopback routers. No Photon/geocoder container. |
| Container resource snapshot | LOW CURRENT USE | `docker stats --no-stream`: each visible container ~4–87 MiB; CPU <0.5%. Acceptance DB cumulative block I/O is high but container idle; no deletion warranted. |
| Preview/API relays | ACTIVE | PID 40404 relays 3103→4178; PID 91475 relays 3019→3002. Preserved. |

### 2026-11-07 06:30 EET — pinned source materializer

| Test ID | Result | Evidence |
|---|---|---|
| ROOT-PR12-MATERIALIZE-001 | PASS (source materialization only) | In isolated root worktree at `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757`, `node ops/scripts/materialize-release.mjs` cloned all four exact manifest pins (Server `44f954b...`, Site `fef697e...`, Admin `4eb5d15...`, Partner `544e5d8...`). `pinnedSourceTreesClean=true`; compose SHA-256 `4a272f85a55202e4402757ff682d1baab12a9ce0ef92f4efd0f15e0f346e334b`. |
| ROOT-PR12-METADATA-UNIT-001 | PASS (targeted unit only) | `node --test ops/scripts/release-build-metadata.test.mjs`: 4 passed, 0 failed, 0 skipped on the same isolated root PR worktree. |
| ROOT-PR12-COMPOSE-CONFIG-001 | PASS (template syntax only) | `docker compose -f .release/compose.production.yml config --quiet` with temporary dummy `.invalid` endpoints/placeholders passed; no container started and no real secrets were read. This is not a deployment test. |
| ROOT-PR12-BUILD-AND-RUN-001 | NOT_RUN | No Docker image build, compose startup, migrations, API/Web smoke, or E2E. Local materialization does not clear Actions HTTP 403 or prove compatibility. |

### 2026-11-07 07:06 EET — live preview/API and Xcode resource check

| Test ID | Result | Evidence / boundary |
|---|---|---|
| WEB-PREVIEW-HTTP-001 | PASS (HTTP smoke only) | `https://marshgo-dima.shares.zrok.io/journeys/search` returned 200; `/api/v1/health` and `/readyz` returned 200. `/api/v1/version` returned Server SHA `20f64a8b745137f08808d0198ea554f8da8a3911` for both local and zrok. This is a dirty development Server build, not staging/production. |
| WEB-PLACE-SUGGEST-002 | FAIL / BLOCKED | Local and zrok `GET /api/v1/places/suggest?q=Lviv` both returned 503 `geocoder_unavailable`: public Nominatim autocomplete is rejected. Requires an approved Photon-compatible/self-hosted geocoder. No route query was run. |
| WEB-MAP-COORD-FALLBACK-UNIT-001 | PASS (unit/fixture evidence only) | Site HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`; `./node_modules/.bin/tsx --test tests/map-point-selection.test.ts`: 4 passed, 0 failed/skipped. Verifies coordinate selection without reverse geocoding, GPS failure/retry messages, and actionable geocoder/session errors. No visual or route acceptance. |
| WEB-AUTH-ROUTE-VISUAL-001 | NOT_TESTED | No confirmed account session; browser control could enumerate tabs but could not bind/interact, so no screenshot or authenticated route→map→navigation test. No booking/payment. |
| STORAGE-XCODE-CACHE-001 | INVENTORIED / NO SAFE MOVE | DerivedData 34 MiB; CoreSimulator cache and iOS DeviceSupport 0 B. CoreSimulator Devices 13 GiB across 12 shutdown iOS 27 devices; may contain installed apps/app state, so preserved. `/Volumes/500` backup is not mounted; no move/deletion. |
| RELEASE-STATUS-001 | NOT_RELEASED | No exact-six-SHA candidate, authenticated live route, staging acceptance, backup/restore or deployment proof. |
### 2026-11-07 07:16 EET — local visual welcome/login and API probe

| Test ID | Result | Evidence / boundary |
|---|---|---|
| WEB-VISUAL-WELCOME-001 | PASS (visual screen only) | Native Chrome opened local `http://127.0.0.1:4178/journeys/search`; screenshot and accessibility tree showed the Ukrainian welcome screen. The existing-account button opened the email/password form. Desktop viewport only; no responsive matrix. |
| WEB-AUTHENTICATED-FLOW-001 | NOT_TESTED | Owner has not completed sign-in in the visible browser. Codex did not enter credentials. No route search/results/map navigation acceptance. |
| API-LOCAL-HEALTH-001 | PASS (smoke) | `/api/v1/health`: HTTP 200, 0.153s. |
| API-LOCAL-READINESS-001 | PASS (smoke) | `/readyz`: HTTP 200, DB and realtime connected, 0.116s. |
| API-PLACE-SUGGEST-001 | FAIL / BLOCKED | `GET /api/v1/places/suggest?q=Lviv`: HTTP 503, 0.078s, `geocoder_unavailable`; response says public Nominatim autocomplete is unsupported and requires Photon or another approved geocoder. No route results requested. |

### 2026-11-07 07:17 EET — provider implementation/config distinction

| Test ID | Result | Evidence / boundary |
|---|---|---|
| API-GEOCODER-IMPLEMENTATION-001 | IMPLEMENTED / NOT_LIVE_VERIFIED | Active Server worktree `/private/tmp/marshgo-server-main-20f64a8`, SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, includes Photon support selected by `GEOCODING_PROVIDER=photon` and `GEOCODING_ENGINE_URL`. Clean candidate branch `codex/photon-geocoder-20261106` is at `06b41278d8e19e3c2880eaaba980bd96a2f731d3`. This is source inspection only; no provider was reconfigured and no live suggestion was verified this turn. |
| API-GEOCODER-RUNTIME-001 | FAIL / CONFIG_REQUIRED | The active endpoint returns the specific error that public Nominatim autocomplete is unsupported. The local suggestion request is still 503. An approved/operated Photon endpoint is needed; the public demo is not treated as a production dependency. |
| RESOURCE-GATE-001 | DEFERRED | At 07:17 EET disk free was 14 GiB, memory free 11%, swap 15,214 MiB, load averages 9.22/9.62/12.62. No build/full E2E or process/container shutdown performed. |

### 2026-11-07 07:24 EET — PR ancestry and route-auth gate

| Test ID | Result | Evidence / boundary |
|---|---|---|
| SERVER-PHOTON-PR-096 | ALREADY_IN_MAIN | `gh pr view 96` reports merged, head `06b41278d8e19e3c2880eaaba980bd96a2f731d3`; current main contains the feature at resulting commit `989bba2`. No duplicate port needed. |
| SERVER-RUNTIME-PIN-001 | STALE_LOCAL_RUNTIME | Active local API SHA `20f64a8b745137f08808d0198ea554f8da8a3911` is an ancestor of current `origin/main` `5a137bd79a55da5a8a96cd99da548938e7e42d41`, three commits behind (includes auth/config hardening PRs #106/#107). No restart/redeployment done. |
| ROUTE-SEARCH-AUTH-001 | BLOCKED_PENDING_OWNER_LOGIN | Active API source has `POST /api/v1/journeys/search` behind `requireAuth`; current browser remains on login form. No credentials received/entered. |
| ROUTE-COORDINATE-FALLBACK-001 | IMPLEMENTED / NOT_VISUALLY_VERIFIED | Site has MapPointPicker for selecting coordinate-backed endpoints when geocoder suggestions are unavailable; this turn only inspected source, not the user flow. |

### 2026-11-07 07:30 EET — current Site/API/login recheck

| Test ID | Result | Evidence / boundary |
|---|---|---|
| WEB-LOCAL-PAGE-RECHECK-001 | PASS (HTTP smoke) | Local `/journeys/search` HTTP 200; body contains MARSHGO Ukrainian app title. Not authenticated flow proof. |
| API-READY-RECHECK-001 | PASS (readiness smoke) | `/readyz` HTTP 200 in 0.088s; DB/realtime connected. `/api/v1/health` had one 5s timeout followed by a bounded retry HTTP 200. No server restart. |
| API-GEOCODER-RECHECK-001 | FAIL / BLOCKED | `/api/v1/places/suggest?q=Lviv` HTTP 503 in 0.096s; provider response rejects public Nominatim autocomplete. |
| WEB-LOGIN-RECHECK-001 | BLOCKED_PENDING_OWNER | Chrome accessibility tree still shows email/password login form. No session and no credentials handled by Codex. |
| RESOURCE-RECHECK-001 | DEFERRED | 07:28 EET sample: 16 GiB disk free, 9% memory free, 13,121 MiB swap, load averages 9.23/9.41/10.70. No heavy work or process termination. |

No account credentials, bookings, payments, GPS permission or production data were used. The login form and successful health checks do not establish route-search readiness. Release remains `NOT_RELEASED`.
## 2026-11-07 08:02 EET — local web/API reachability recheck (not release acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Local Site entry and API proxy | `4178/journeys/search` and proxied `/healthz`, `/readyz`, `/api/v1/health` return HTTP 200. Running Vite proxy uses `3019`; isolated preview `4179` uses canonical API `3002`. Both API versions report dirty development build `20f64a8b745137f08808d0198ea554f8da8a3911`. | LOCAL_HEALTH_PASS | Neither runtime is exact current-main Server (`d16e8b767441de4bd9b1ff480a025030ff4b5cb2`); do not treat either as release evidence. |
| Registration route reachability | Safe empty JSON request to both local APIs returns expected HTTP 400 `invalid_email`; no account was created and no user data was transmitted. | ROUTE_REACHABLE | Does not verify a valid sign-in/registration. Prior generic unavailable UI message has no correlated request/status yet. |
| Address autocomplete | Canonical-preview probe returns HTTP 503 `geocoder_unavailable`; no approved geocoder configuration is active. | BLOCKED | Configure an approved Photon/geocoding source; coordinate selection on the map remains a fallback after sign-in. |
| User journey replay | Owner indicated they would authenticate; Codex did not inspect, change, or submit the active form. Browser bridge was unavailable for the current tab this turn. | NOT_TESTED | Resume after owner confirms sign-in; inspect only safe request status/error metadata. |
| Server live-label fix | PR #108 merged; exact-head tests/typecheck and CI passed. Shared runtimes have not restarted and still use pre-merge dirty code. | MERGED_NOT_RUNTIME_VERIFIED | Validate current main only in an isolated runtime with a confirmed disposable DB. |

## 2026-11-07 03:42 EET — current Lviv feed snapshot (not journey acceptance)

## 2026-11-07 08:09 EET — geocoder-outage GPS fallback change (not browser acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| GPS origin when reverse geocoding is unavailable | Site base SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`; files `src/domain/mapPointSelection.ts`, `src/views/ProductionMarketplace.tsx`, `tests/map-point-selection.test.ts`. GPS coordinates remain the selected origin and UI says address resolution failed. | IMPLEMENTED / FIXTURE_VERIFIED | Focused test 6/6, diff check passed. Typecheck and browser/physical GPS verification not run. |
| Resource gate after focused test | 13 GiB disk free, 25% memory free, 15.8 GiB swap used; load 11.14/7.90/7.73. | DEFER_HEAVY_LOCAL_WORK | Wait for ≥35% free memory and ≥20 GiB disk before typecheck/build/E2E. |

## 2026-11-07 08:12 EET — place-search outage UX

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Geocoder failure guidance | Site autocomplete and manual-search catches now use `placeSearchFailureMessage`; the existing test asserts actionable Ukrainian copy for unavailable geocoder and expired session. | IMPLEMENTED / FIXTURE_VERIFIED | Focused suite 6/6 passed. No browser visual test. |
| Qoder delegation | Current task queue contains no active Qoder task; last routing-oracle work is merged and release-manifest validation remains blocked on private-repository Actions access. | NO_ACTIVE_QODER_TASK | Qoder UI offered no accessible task/editor interaction; do not claim additional Qoder work. |

## 2026-11-07 08:17 EET — Qoder geocoder recovery is on main; local preview is stale

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Geocoder outage/retry UX | Qoder Site PR #80 merged as `d12789e47be608a1ca3abac17aa6d4c348206226`; current Site main `f8334a0a9b768060b6d816ce6db9f52f7febff7e` has recoverable provider-outage state/retry UI. | INTEGRATED | User-facing port 4178 uses dirty Site `eda449f...` and doesn't match current-main behavior; don't restart the user's form. |
| GPS-origin fallback | Site PR #84 head `af8e1539215ada12319192178089b6237baaf88b`, base `f8334a0...`; exact focused tests 6/6, diff check passes. | PR_OPEN / CI_PENDING | `verify` runs `42346274689` and `42346284104` pending; typecheck/browser acceptance not yet verified. |

## 2026-11-07 08:19 EET — Site GPS-origin fallback merged

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| GPS origin without reverse geocoding | Site PR #84 squash/main SHA `c13e648d1b9b08fced31eeda67fe9f29fae08526`; exact-head checks both PASS; focused local test 6/6 PASS. | MERGED / TESTED | Post-merge run `42346463580` is still in progress; browser/device behavior not verified. |
| Qoder place-search outage recovery | Qoder PR #80 is already integrated at merge `d12789e47be608a1ca3abac17aa6d4c348206226`; current Site main includes retry/unavailable UI. | MERGED | Port 4178 remains dirty/stale SHA `eda449f...`; do not disturb active user form. |

## 2026-11-07 08:22 EET — exact Site/Server main checks

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site GPS fallback | Main SHA `c13e648d1b9b08fced31eeda67fe9f29fae08526`; PR #84 checks and post-merge CI `42346463580` SUCCESS; typecheck PASS; focused tests 6/6 PASS. | MAIN_CI_PASS / LOCAL_TESTED | No browser/physical GPS evidence. |
| Server false-live status fix | Main SHA `d16e8b767441de4bd9b1ff480a025030ff4b5cb2`; post-merge CI `42344872757` SUCCESS. | MAIN_CI_PASS | Shared local runtime still `20f64a8...` dirty, so runtime fix not verified. |
| Current Site preview and auth journey | 4178 remains dirty Site `eda449f...`; browser control returns `browser.user is unavailable`. | NOT_TESTED | Preserve active form; resume visual search after browser bridge and owner sign-in are available. |

## 2026-11-07 08:25 EET — current-main Site visual preview

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current-main Site entry/auth UI | Isolated tree equals merged Site main `c13e648d1b9b08fced31eeda67fe9f29fae08526`; local preview `4180` renders welcome and email/password login form; HTTP `/journeys/search` 200. | LOCAL_VISUAL_PASS | User has not authenticated; no protected journey test. Existing 4178 untouched. |
| Preview API readiness | Proxy `/readyz` HTTP 200; `/api/v1/version` reports Server `20f64a8b745137f08808d0198ea554f8da8a3911`, dirty development build. | LOCAL_READY_ONLY | Not exact current Server main and not a release candidate. |
| Geocoder | No approved geocoder configured; map coordinate selection is the fallback. | BLOCKED | Authenticated route replay can use selected map coordinates; provider integration still needed for text suggestions. |

## 2026-11-07 08:30 EET — local preview readiness and auth UI

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current-main login UI | Tab 31 at `http://127.0.0.1:4180/journeys/search`; Site tree equals main `c13e648d1b9b08fced31eeda67fe9f29fae08526`; screenshot shows empty email/password form. | LOCAL_VISUAL_PASS | Owner is signing in; no credentials viewed or submitted. Authenticated route flow not yet tested. |
| Local API readiness | `3002/healthz` HTTP 200; `/readyz` HTTP 200 (`database` and `realtime` connected). | LOCAL_READY_ONLY | `/api/v1/version` reports dirty development Server `20f64a8b745137f08808d0198ea554f8da8a3911`, not current main. |
| Search and map result | Not tested in authenticated session. | NOT_TESTED | After sign-in, use map-selected points because no approved geocoder is configured; no real booking/payment. |

## 2026-11-07 08:35 EET — runtime/container check

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Authenticated route search | Fresh tab 32 still shows blank login form after browser-control recovery. | NOT_TESTED | Owner sign-in required; then route search via map-selected coordinates. |
| API runtime identity | Host API PID 70458, worktree `/private/tmp/marshgo-server-main-20f64a8`, build reports dirty SHA `20f64a8...`; health/readiness previously returned 200. | LOCAL_READY_ONLY | Runtime is not current Server main `d16e8b7...`; do not treat as candidate acceptance. |
| Container cleanup safety | `docker stats --no-stream`: active database/Redis/walk-router stacks use ~306 MiB combined reported memory; several DBs are active. No confirmed unused container. | PRESERVED | No stop/prune performed; retain stacks until ownership/consumers are established. |

## 2026-11-07 08:39 EET — auth gate and search completeness

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Journey-search access control | Anonymous `POST /api/v1/journeys/search` to local API 3002 returned HTTP 401 `unauthorized`; handler requires auth. | LOCAL_API_AUTH_GATE_VERIFIED | Does not prove an authenticated search; owner sign-in and CUA recovery required. |
| Search completeness semantics | `npm exec -- tsx --test tests/journey-search-completeness.test.ts` at Server HEAD `20f64a8b745137f08808d0198ea554f8da8a3911`: 3 passed, 0 failed/skipped. | FIXTURE_VERIFIED | Unit-level only; no live provider, geometry or route search proven. |
| Physical browser route flow | In-app browser calls timed out; last verified tab 32 was blank login form. | NOT_TESTED | Resume when browser UI is accessible; do not infer current auth state. |

## 2026-11-07 08:41 EET — planner oracle and browser auth state

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Route composition and ranking | Server SHA `20f64a8b745137f08808d0198ea554f8da8a3911`; `npm exec -- tsx --test tests/journey-planner-oracle.test.ts tests/journey-scoring.test.ts`: 36 passed, 0 failed/skipped, 0.39 s; includes three-leg exhaustive oracle and fare/strategy rules. | FIXTURE_VERIFIED | Not live feed, API response, or Web user journey. |
| Authenticated browser state | Current-main preview tab 32 visibly still has an empty login form; no credentials viewed/submitted. | NOT_TESTED | Owner sign-in at `http://127.0.0.1:4180/journeys/search` required for UI→API route search. |

## 2026-11-07 08:45 EET — geocoder provider validation

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Approved HTTPS API origin readiness | `https://marshgo-dima.shares.zrok.io` `/healthz`, `/readyz`, `/api/v1/version` all HTTP 200; DB/realtime connected. | LOCAL_TUNNEL_READY | Version is dirty development Server `20f64a8...`, not staging or main. |
| MARSHGO place autocomplete | Same host `/api/v1/places/suggest?q=Львів` returns HTTP 503 `geocoder_unavailable`; Server rejects public Nominatim autocomplete. | BLOCKED_CONFIG | Existing Photon adapter is available; active runtime not changed. Need approved production geocoder or controlled local evaluation. |
| Photon adapter behavior | One-off direct invocation of existing `suggestPlaces()` with Photon env and generic query returned 6 parsed OSM-identified results. | LIVE_PROVIDER_PROBE_ONLY | Not the active API/Web runtime. Public Photon demo lacks uptime guarantee and throttles extensive usage; not production evidence. |

## 2026-11-07 08:47 EET — runtime and browser-control recheck

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current-main preview process | Vite PID 9113, `http://127.0.0.1:4180/journeys/search` HTTP 200. | LOCAL_UI_SERVING | Browser-control bridge interrupted; cannot confirm current visible/auth state. |
| Server readiness | API 3002 `/readyz` returns connected DB/realtime; version `20f64a8b745137f08808d0198ea554f8da8a3911`, development/dirty. | LOCAL_READY_ONLY | Not current Server main or staging. |
| Authenticated route flow | Last observed tab state was blank login form at 08:41; no newer visible state available. | NOT_TESTED | Wait for browser control and owner sign-in; do not infer from prior intent. |

## 2026-11-07 10:14 EET — saved route pedestrian geometry diagnosis

| Check | SHA / environment | Result | Boundary / next action |
|---|---|---|---|
| Saved journey leg provenance | Local API DB `marshgo`; journey `1b21973f-013b-4eb0-abe6-719058b7c657`; Server `20f64a8b745137f08808d0198ea554f8da8a3911` | Three WALK legs: `straight-line-estimate`, no geometry provenance, 0 stored points. | Explains the dashed connector; no DB mutation.
| Local foot-router replay | Same stored pairs, localhost OSRM foot `:3013` | 3/3 HTTP 200 `Ok`, with 27/13/17 geometry points (474.9/92.9/195.8 m). | Local service evidence only; not fresh planner persistence or UI acceptance.
| Fresh authenticated route → visible geometry | Current local Site + Server | NOT_TESTED | Requires signed-in search; use map coordinate picker if autocomplete remains unavailable, then verify saved response and solid rendered path.
| Cache recovery | `/Volumes/500` absent; DerivedData 34 MiB; CoreSimulator Devices 13 GiB | NO_SAFE_CLEANUP | Simulator state is not disposable cache; wait for authorized backup volume before moving.

| Fresh-walk provenance compatibility | Server runtime source `20f64a8b745137f08808d0198ea554f8da8a3911` | `osrm-foot-route` geometry accepted for `WALK` by writer/sanitizer (static review). | Does not prove a new route was created, persisted, or rendered.

## 2026-11-07 10:19 EET — fresh authenticated Site route gate

| Check | Environment | Result | Boundary / next action |
|---|---|---|---|
| Fresh search session | Visible local Site tab `127.0.0.1:4178/journeys/search` | NOT_TESTED; welcome screen shown, no signed-in session. | Owner must sign in manually; no password/account creation by Codex. Then search using map-selected coordinates and verify geometry end to end.

## 2026-11-07 10:23 EET — Server main/runtime pin check

| Check | SHA / environment | Result | Boundary / next action |
|---|---|---|---|
| Server remote main | GitHub `d16e8b767441de4bd9b1ff480a025030ff4b5cb2` | Fetched and verified; main is 4 commits ahead of local API runtime. | Do not treat runtime `20f64a8...` as current-main acceptance.
| Foot geometry serializer | Exact remote `origin/main` source | `osrm-foot-route` remains trusted for `WALK`. | Static source evidence only.
| Fresh route UI flow | IAB browser transport closed; fresh local tab was at welcome screen. | NOT_TESTED | Resume after browser control recovers and owner signs in; use map coordinates to avoid external geocoder.

| Server main CI | GitHub Actions run `42344872757`, exact SHA `d16e8b767441de4bd9b1ff480a025030ff4b5cb2` | PASS | CI only; not local runtime/UI acceptance.

## 2026-11-07 10:28 EET — navigation disclosure for approximate pedestrian lines

| Check | SHA / environment | Result | Boundary / next action |
|---|---|---|---|
| UI behavior | Site dirty branch `antigravity/ultimate-premium-web-9`, `JourneyRouteMapScreen.tsx` | Implemented accessible status note for approximate walks; `role=status`, polite live region. | No new geometry is generated. Visual rendering not yet checked.
| Route model tests | Site exact HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad` plus dirty working tree | 14 passed, 0 failed/skipped. | Tests cover map model, not component rendering or authenticated route flow.
| Targeted lint/diff check | Same Site working tree | ESLint PASS; `git diff --check` PASS. | No full typecheck/build due resource and browser gates.

## 2026-11-07 10:31 EET — current tunnel/runtime identity and visual entry point

| Check | Environment | Result | Boundary / next action |
|---|---|---|---|
| Staging tunnel readiness | `https://marshgo-dima.shares.zrok.io/readyz` | HTTP 200, DB + realtime connected | Readiness is not release identity. |
| Tunnel Server version | `/api/v1/version` | HTTP 200; development/dirty build `local-20f64a8b7451-dirty-20261107T074421Z`, commit `20f64a8b745137f08808d0198ea554f8da8a3911` | Not a pinned/clean staging candidate. |
| Unauthenticated API route | `/api/v1/journeys/me`, `/api/v1/journeys/config` | HTTP 401 | Auth gate behaves as expected; no credentials used. |
| Visible staging page | Fresh IAB tab `/journeys/search` | Landing screen visible; login/register actions present | Authenticated route and map remain NOT_TESTED pending owner sign-in. |
| Resource gate | 2026-11-07 10:31 EET | Disk free 16 GiB; memory free 26%; encrypted swap used 12.0 GiB | Heavy build, E2E, and API restart deferred. |

## 2026-11-07 10:35 EET — exact Server main pedestrian/transit geometry path

| Check | SHA / source | Result | Boundary / next action |
|---|---|---|---|
| Current GitHub Server main | `git ls-remote origin refs/heads/main` | `d16e8b767441de4bd9b1ff480a025030ff4b5cb2` | Exact remote head confirmed; no checkout changes. |
| Transit shape writer | `origin/main:server/index.ts` | `makeGtfsLegMetadata` retains trusted `routeGeometrySource` with a route shape. | Static source inspection only. |
| WALK serializer trust | `origin/main:server/journey/legGeometryProvenance.ts` + writer | `osrm-foot-route` is trusted for WALK; writer persists this token as data source. | Does not prove the saved old route can be refreshed. |
| Fresh authenticated search | Staging tunnel / visible IAB | NOT_TESTED; welcome screen still shown, no owner session. | Owner sign-in required, then inspect new API/DB row and map. |
| Resource gate | 2026-11-07 10:34 EET | 16 GiB disk free; memory free 27%; swap used 12.36 GiB. | No heavy build, E2E, or restart. |

## 2026-11-07 10:38 EET — Docker dependency/resource audit

| Stack/container group | Evidence | Current use / disposition |
|---|---|---|
| `marshgo-server-main-7774a81` DB + Redis | API PID 22721 has established connections to ports 5434 and 6380. | Needed by live local/tunnel API; keep running. |
| Lviv/Kyiv walking routers | Ports 3013/3014; both containers active. | Lviv router supports current geometry verification; Kyiv router retained for Kyiv coverage. |
| `marshgo-local-api` DB + Redis | Ports 5444/6390 had no host-side clients; project belongs to a prepared Server worktree. | Possibly idle, but ownership/use is not disproven; preserve. |
| `marshgo-acceptance` DB + Redis/cache | Compose directory `.release`; PostgreSQL data persistent. | Retain acceptance data. No container was stopped. |
| Overall impact | Sample container RSS about 4–81 MiB each; Docker VM runs with 4 GiB allocation. | Stopping uncertain containers would not recover Docker VM allocation; no safe cleanup selected. |

## 2026-11-07 10:40 EET — public tunnel development-auth negative check

| Check | Environment / input | Result | Boundary |
|---|---|---|---|
| Dev identity bypass through tunnel | Read-only `GET /api/v1/journeys/me`, synthetic non-user UUID header, no forwarded header | HTTP 401 `unauthorized`; no user payload | One vector only; not a full auth/security acceptance. |
| Runtime identity | Tunnel `/api/v1/version` | Development/dirty `20f64a8b745137f08808d0198ea554f8da8a3911` | Must not be considered production candidate. |

## 2026-11-07 10:44 EET — place autocomplete provider gate

| Check | SHA / environment | Result | Boundary / next action |
|---|---|---|---|
| Public city autocomplete | Tunnel `/api/v1/places/suggest?q=Львів` | HTTP 503 `geocoder_unavailable`: public Nominatim is not an autocomplete provider; Photon or another approved geocoder is required. | Configuration failure precisely identified. |
| Photon implementation | Runtime `20f64a8...` and Server `origin/main` source/tests | Photon parsing/query support exists; query is limited to Ukraine/6 results; optional locality bias sends lat/lon to Photon. | Do not configure until owner chooses data-sharing scope. |
| Site fallback | Current Site source | Shows unavailable message and offers map coordinate selection. | Does not replace working text autocomplete. |
| Owner approval | Request for Photon scope | PENDING | Text only / text + location bias / no Photon. |

## 2026-11-07 10:49 EET — external Photon smoke (public city query only)

| Check | Environment / input | Result | Boundary |
|---|---|---|---|
| Photon service | One `GET https://photon.komoot.io/api/` for public city `Львів`, Ukraine filter, limit 3; no locality bias. | HTTP 200; 3 Ukrainian GeoJSON features. | No user-specific address/location data sent. |
| Runtime parser | Server source worktree `20f64a8b745137f08808d0198ea554f8da8a3911`, `parsePhotonSuggestions` | Parsed 3 results and disambiguated same-name localities with oblasts. | Parser/provider smoke only; API remains configured to reject public Nominatim. |
| App autocomplete via tunnel | Current tunnel runtime | STILL BLOCKED/NOT_TESTED pending provider scope approval. | Do not configure or forward user search terms/coordinates before owner chooses. |

## 2026-11-07 10:47 EET — route-search session gate

| Check | Environment / source | Result | Boundary / next action |
|---|---|---|---|
| Journey search API auth | Current local Server `server/index.ts` handler | `POST /api/v1/journeys/search` is guarded by `requireAuth`. | No anonymous API search or DB write attempted. |
| Current visible user session | Staging IAB/browser | NOT_TESTED; browser control unavailable and no owner sign-in confirmed. | Owner signs in manually before fresh UI→API route acceptance. |

## 2026-11-07 10:55 EET — API readiness recovered, release identity remains development

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Local API readiness | `:3002/readyz` returned 200; DB/realtime connected. | LOCAL_HEALTHY | Server reports dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911`; not a release candidate. |
| Public tunnel readiness | `/readyz` and `/api/v1/version` returned 200 and matched the same dirty local development Server SHA as Site proxy `:4178`. | DEV_TUNNEL_ONLY | Tunnel currently exposes local development runtime; staging acceptance is NOT established. Earlier 502 is no longer reproducible for these paths. |
| Saved journey inspection | No-session GET `/api/v1/journeys/{id}` returned 401. | AUTH_REQUIRED | No user payload accessed. Owner sign-in is needed for authenticated route inspection and new search acceptance. |
| WALK geometry rendering | Current dirty Site model accepts server route geometry as real shape; endpoint-only fallback is approximate; annotation helper intentionally refuses to synthesize street geometry. | STATIC_SOURCE_REVIEW | Saved route has estimated WALK legs without stored geometry. Fresh authenticated search on a router-enabled candidate is required for UI→API→map proof. |
| Release status | Exact-six-SHA, staging, security, backup/restore and rollback gates remain unproven. | NOT_RELEASED | No deployment performed. |

## 2026-11-07 10:56 EET — visual journey access gate

| Check | Environment | Result | Status / boundary |
|---|---|---|---|
| Requested journey URL opened in a new visible Codex IAB tab | Local Web `:4178` | Public welcome/sign-in screen rendered (`Почати`, `У мене вже є акаунт`); no journey payload rendered. | AUTH_REQUIRED / NOT_VISUALLY_VERIFIED; owner must sign in in this browser session. |
| Authenticated route geometry/map | Local Web + dirty development API | Not tested because the new browser tab has no session and no-session API GET returns 401. | Do not infer map failure or success from the welcome screen; rerun after sign-in. |

## 2026-11-07 11:00 EET — third-party geocoder location-bias privacy candidate

| Check | Candidate | Result | Status / boundary |
|---|---|---|---|
| Photon coordinates default behavior | Isolated branch `codex/geocoder-bias-privacy-default-20261107`, based on Server main `d16e8b767441de4bd9b1ff480a025030ff4b5cb2` | Code forwards `lat`/`lon`/`zoom` only when `GEOCODING_FORWARD_LOCATION_BIAS=true`; default does not forward coordinates. | STATIC_DIFF_REVIEW; runtime test NOT_RUN, not merged. |
| Regression coverage | `tests/geocoding.test.ts` | Added default-deny assertion and explicit opt-in for existing positive test. | NOT_TESTED: `tsx` unavailable; resource gates below project threshold. |
| Live provider configuration | Existing tunnel/server | Unchanged. | Owner scope approval still required before enabling any location forwarding. |

### 2026-11-07 11:02 EET — generalized location-bias opt-in

| Check | Candidate | Result | Status / boundary |
|---|---|---|---|
| Location data sharing with configured autocomplete provider | Isolated branch `codex/geocoder-bias-privacy-default-20261107` at base `d16e8b767441de4bd9b1ff480a025030ff4b5cb2` | Photon `lat`/`lon` and Nominatim-compatible `viewbox` are both gated behind `GEOCODING_FORWARD_LOCATION_BIAS=true`. | Static diff only; isolated and uncommitted. |
| Default-deny regression assertions | `tests/geocoding.test.ts` | Covers both Photon and Nominatim-compatible adapters; existing positive-bias assertions explicitly opt in. | NOT_TESTED; run targeted suite when runner and resource headroom are available. |

## 2026-11-07 11:06 EET — PR #109 exact-head verification

| Gate | Evidence | Result | Boundary / next action |
|---|---|---|---|
| Geocoder location-bias opt-in | Server commit `725f00356e6b95bd81e7f6a2c9ac6dd7c7de4306`, PR #109, base `d16e8b767441de4bd9b1ff480a025030ff4b5cb2` | Targeted `geocoding.test.ts`: 17 passed, 0 failed, 0 skipped; diff check passed. | PR open; no merge. |
| PR exact-head CI | GitHub runs `42358158869`, `42358128997`, head `725f003...` | Both IN_PROGRESS when checked. | Await required checks and review policy. |
| Production acceptance | Exact-six-SHA, staging, full UI journey, backup/restore and rollback | NOT ESTABLISHED | No deployment; status remains NOT_RELEASED. |

## 2026-11-07 — Server PR #109 merged

| Gate | Evidence | Result | Boundary / next action |
|---|---|---|---|
| Geocoder location-bias privacy default | Server main merge commit `c2e612d886edfb0a0219d8fb45c199a1eb4687dd`; PR #109 merged. | PASS on main; caller coordinates/viewbox are sent only when `GEOCODING_FORWARD_LOCATION_BIAS=true`. | No live config change or deployment; running dev API remains old dirty SHA `20f64a8...`. |
| Targeted geocoder tests | `tsx --test tests/geocoding.test.ts` | 17 passed, 0 failed, 0 skipped. | Local targeted suite only. |
| Exact-head Server CI | PR head `725f00356e6b95bd81e7f6a2c9ac6dd7c7de4306`; runs 42358158869 / 42358128997 | Both required `verify` checks passed; lint, typecheck, full tests, migrations, integration, production image smoke and Compose lifecycle passed. | Non-failing GitHub action Node.js 20 and Ubuntu-latest deprecation notices. |
| Web fresh-route visual acceptance | Local UI tab currently unauthenticated; no-session route GET was 401. | NOT_TESTED | Owner sign-in remains needed; no credentials or trip data accessed. |
| Release/staging/production | Running tunnel is still dirty development runtime. | NOT_RELEASED | Exact six-SHA, staging, security and operational gates remain open. |

## 2026-11-07 11:12 EET — geocoder configuration documentation PR

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Environment sample/API documentation | PR #110 head `2eebb8b972e69b70f789943588737f8479fb6524`, base `c2e612d886edfb0a0219d8fb45c199a1eb4687dd`; `.env.example`, `docs/API.md`. | `git diff --check` PASS; PR open. | CI runs 42358653087 and 42358666797 in progress. |
| Active runtime configuration | Local and tunnel `/version` previously showed dirty dev SHA `20f64a8...`. | NOT_UPDATED | No runtime restart or deployment; merged default-off code is not active in this process. |

## 2026-11-07 11:17 EET — geocoder privacy code and docs on Server main

| Gate | Evidence | Result | Boundary / next action |
|---|---|---|---|
| Server main | `9df0ae097abc43a4f611151a482c349a8f931a82` after PR #109 and #110 | Verified by `git fetch` + `git rev-parse`; both PRs merged. | Active dirty dev runtime still SHA `20f64a8...`; fix is not deployed there. |
| Geocoder location-bias control | PR #109 code + PR #110 `.env.example`/API docs | Default OFF; location bias only sent when explicit flag is true. | No provider scope approval/config change; no location data sent as part of this change. |
| CI evidence | PR #109 runs 42358158869/42358128997; PR #110 runs 42358653087/42358666797 | All four exact-head Server CI runs passed, including full unit/integration and production image smoke/lifecycle. | Non-failing Node.js 20 and Ubuntu-latest future migration warnings remain. |
| Web route acceptance | Browser tab remains unauthenticated; route GET returned 401. | NOT_TESTED | Owner sign-in still needed; production NOT_RELEASED. |

11:18 EET read-only `/api/v1/version` checks on both `127.0.0.1:3002` and the public tunnel confirm active runtime is still dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911` (build `local-20f64a8b7451-dirty-20261107T074421Z`), not current Server main.


## 2026-11-07 11:23 EET — current pedestrian-router runtime evidence

The local API process remains dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911` (PID 22721; readiness DB/realtime connected). `WALKING_ROUTING_URLS` is present; both local OSRM-foot containers are running; a bounded direct Lviv OSRM route probe returned HTTP 200. This does not prove fresh authenticated search persistence. The saved journey `1b21973f-013b-4eb0-abe6-719058b7c657` still has three estimate-only WALK rows with zero stored geometry points, so it requires regeneration after end-to-end acceptance; no data was mutated.


## 2026-11-07 11:26 EET — focused walking-route regression evidence

Server checkout `20f64a8b745137f08808d0198ea554f8da8a3911`: `tsx --test tests/journey-walking-routes.test.ts tests/intercity-chain.test.ts tests/route-geometry-provenance.test.ts` passed 28/28, 0 skipped. The runtime does not override route budget vars; current code defaults to 120 pedestrian-route requests/search and six candidates/wave. The test file records a historical 73-candidate / 32-request case that left some estimates, but that does not establish the configuration at this saved journey's creation. A bounded OSRM-foot full-overview route returned one route and 50 points; no journey data changed. Authenticated fresh planner → persisted geometry → visual acceptance remains NOT_TESTED.


## 2026-11-07 11:34 EET — estimate-only route recovery UX

Site dirty branch `antigravity/ultimate-premium-web-9`, base HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`: added a manual “Повторити пошук” action for journeys whose walk geometry is explicitly estimated. It restores the saved origin/destination coordinates to the planner, retains strategy, and requires the user to review date/time and submit. Targeted route-map/annotation tests passed 22/22; targeted ESLint and diff-check passed. Full typecheck/build and visual authenticated test are NOT_RUN due resource gate (28% memory, 17 GiB disk) and no browser session. Uncommitted; no release status change.


## 2026-11-07 11:38 EET — verification/resource gate update

Current measurements: 16 GiB disk free, 26% memory free, ~12.78 GiB swap used; full Site typecheck/build deferred. Site-specific `git diff --check` is clean. Root-repository-wide diff-check reports a pre-existing whitespace-only change in dirty legacy `src/views/ProductionMarketplace.tsx` at line 1472; left untouched per legacy ownership and preservation rules. Replan UX remains uncommitted; authenticated visual acceptance NOT_TESTED.


## 2026-11-07 11:40 EET — saved-route coordinate restoration tests

Site helper `savedJourneySearchPlaces` now validates and restores the original first-leg origin and final-leg destination for manual re-search. Route-map, map-annotation and helper tests passed 24/24, 0 skipped; targeted ESLint and Site diff-check passed. Full typecheck/build and visual authenticated acceptance remain NOT_TESTED due 26% free RAM / 17 GiB disk and absent browser session. No commit or push.


## 2026-11-07 11:42 EET — browser bundle identity check

Local preview at `127.0.0.1:4178` is rooted in `MarshGO-Site` but serves built bundle `/assets/index-Dl9FS3rJ.js`; this bundle does not contain the current dirty Site replan action or estimate notice. `/src/...` requests return the SPA HTML fallback. Visual evidence against this bundle would be stale, so acceptance is NOT_TESTED. Rebuild/preview refresh deferred at 17 GiB free disk and 26% free memory; no process was restarted.

## 2026-11-07 11:47 EET — walking geometry focused verification

| Gate | Evidence | Result |
|---|---|---|
| Current Server walking/provenance regressions | Current dirty Server source; focused `tsx --test` — 11 passed, 0 failed, 0 skipped | PASS (focused fixture/unit only; not live E2E) |
| Current Site re-search implementation served by Vite | `127.0.0.1:4179` cache-busted transformed module contains estimate notice and re-search CTA | PASS (source-served only; not visual acceptance) |
| Saved journey visual inspection | Isolated 4179 browser tab shows sign-in landing; no authorized session in automation | NOT_TESTED |
| Full Site typecheck/build | Resource gate: 16 GiB free disk, 25% free RAM | NOT_RUN |
| Fresh authenticated search → persisted walk geometry → UI | Requires authenticated session and full path verification | NOT_TESTED |

## 2026-11-07 11:51 EET — runtime and branch freshness

| Component | Exact observed identity | Evidence | Release status |
|---|---|---|---|
| Active local API | dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911`; build `local-20f64a8b7451-dirty-20261107T074421Z` | `GET /api/v1/version` HTTP 200; `/readyz` HTTP 200 (DB/realtime connected); PID 22721 on `:3002` | LOCAL_HEALTHY, not release candidate; 6 commits behind Server main |
| Server main | `9df0ae097abc43a4f611151a482c349a8f931a82` | local `origin/main` agrees with `git ls-remote` | current remote base |
| Desktop Server candidate | HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, dirty; 88 behind / 4 ahead | `git rev-list --left-right --count origin/main...HEAD`; changes preserved | NOT_MERGE_READY |
| Site dev source | dirty Site branch HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`; Vite `:4179` | cache-busted transformed module includes re-search control | SOURCE_SERVED; authenticated visual acceptance pending |

## 2026-11-07 11:54 EET — persisted route leg provenance

Read-only DB query for saved journey `1b21973f-013b-4eb0-abe6-719058b7c657` on the local Server DB returned five legs: WALK (`straight-line-estimate`, `straight-line-distance`, 0 route points), BUS (`gtfs-static`, 35 route points), WALK (same estimate provenance, 0 points), TRAM (`gtfs-static`, 61 points), WALK (same estimate provenance, 0 points). Query did not emit coordinates/names and made no DB changes. This confirms missing WALK geometry is persisted data, not merely map rendering; saved journey has not been backfilled. Authenticated new-search → persist → map remains NOT_TESTED.

## 2026-11-07 11:55 EET — saved WALK endpoint router probe

Sequential read-only requests to the local Lviv OSRM-foot router for the saved journey's WALK endpoint pairs returned HTTP 200 / `Code=Ok` and full paths: leg 0: 27 geometry points, 342s; leg 2: 13 points, 67s; leg 4: 17 points, 143s. Persisted estimates were 259s, 51s, and 104s. Coordinates were not recorded or emitted; no trip/DB state changed. This establishes current route availability, but not a valid updated itinerary: planner must re-evaluate departure/transfer feasibility using longer street-route times. Authenticated fresh-search persistence and visual acceptance remain NOT_TESTED.

Schedule sanity for the same DB record and OSRM probe: first access slack was 221s after the saved 259s walk; the current 342s path would leave 138s before the transit departure. Interchange slack after the saved 51s walk was 189s; the current 67s path would leave 173s. Egress adds 39s. This limited arithmetic suggests the same transit departures may remain feasible, but it does not replace a new planner evaluation, strategy ranking, persistence, or UI verification; no saved data was mutated.

## 2026-11-07 12:02 EET — sign-in handoff state

Current Site dev UI (`:4179`) was opened visibly at the saved journey; it displays the email/password sign-in form. Codex did not enter credentials. Browser tab is marked for owner handoff. Authenticated saved-route view and fresh-search geometry remain NOT_TESTED. Resources: 16 GiB free disk / 25% free RAM; full build not run.

## 2026-11-07 12:40 EET — latest root release manifest and HTTPS runtime recheck

1. The active root `RELEASE_MANIFEST.json` still identifies `RC-2026-10-30-evidence.3`, `status=NOT_RELEASED`, `production_ready=false`; its pins do not match the current local Server/Site worktrees and it records no configured staging URL.
2. Read-only HTTPS probe of the owner-provided `marshgo-dima.shares.zrok.io` returned `/readyz` HTTP 200 (`database=connected`, `realtime=connected`) and `/api/v1/version` HTTP 200. Version identifies `MarshGO-Server` build `local-20f64a8b7451-dirty-20261107T074421Z`, full SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, environment `development`, source state `dirty`. This tunnel is a reachable dev runtime, not staging or release evidence.
3. Re-ran the focused current Site test `node_modules/.bin/tsx --test tests/transport-preferences.test.ts` at Site HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`: 17 passed, 0 failed, 0 skipped, 0.133 s. Full verify/build/E2E were not run due the Mac resource gate. No booking, write request, deployment, or Git mutation occurred.

## 2026-11-07 12:48 EET — root PR CI evidence

1. PR #20 exact head `041ab47d083830f1b4271ccf4c3b5d6cde080339`, run `42265893827`: manifest validation, dependency audit, lint, typecheck, unit/ops tests, migration/integration tests, build and bundle checks succeeded. Private source setup succeeded; materialization failed on HTTP 403 cloning Admin. Docker/E2E/browser checks were skipped, so unified acceptance is incomplete.
2. PR #19 head `39d3ed414b580d5eb261495c8f37958fd29584d4`, run `42260243452`: pre-materialization checks passed and source access failed. It overlaps #20 from a divergent base; choose/consolidate one, do not merge both.
3. No exact six-SHA acceptance, staging, backup/restore or rollback evidence is established by these runs. `NOT_RELEASED` remains correct.
4. The latest PR #20 CI evidence is reflected in the PR description and `docs/PR_DEPENDENCY_DAG.md`; current dependency order is #12 → #18 → #20, with #19 left as a divergent overlapping alternative. No root merge or deployment occurred.

## 2026-11-07 13:02 EET — latest focused UI and runtime evidence

| Gate | Evidence | Result |
|---|---|---|
| Provider-only search dialog | Site `tests/canonical-design.test.ts`; 25 passed, 0 failed, 0 skipped; scoped ESLint and diff check clean | PASS (focused source tests) |
| Updated Site modules served | Cache-busted Vite transforms for `TransportTypesPanel.tsx` and `ProductionMarketplace.tsx`, port 4179 | PASS (HTTP 200; source served, not visual acceptance) |
| Visual search acceptance | CUA browser attach returns `browser.user is unavailable` | NOT_TESTED |
| Root release workflow | PR #20 head `041ab47d083830f1b4271ccf4c3b5d6cde080339`, run `42265893827`; private Admin clone HTTP 403; Docker/E2E/browser skipped | FAIL / BLOCKED |
| Owner HTTPS runtime | Search, `/readyz`, `/api/v1/version` return 200; API identifies dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911` | LOCAL/DEV ONLY; NOT STAGING |
| Heavy local build/E2E | 29% free RAM, 18 GiB free disk, ~10.3 GiB swap used at 13:02 EET | NOT_RUN (resource gate) |

Production remains `NOT_RELEASED`. The GitHub Actions credential previously pasted into chat must be revoked/rotated. A fresh read-only credential must be configured in Actions for private Admin and Partner before rerunning the exact-head root checks.

## 2026-11-07 13:08 EET — pedestrian path provenance

| Gate | Evidence | Result |
|---|---|---|
| Synthetic legacy walk rendering | Site `tests/journey-route-map.test.ts`: 15 passed, including `walking` and `transfer-walk` marked approximate; ESLint and diff check pass | PASS (focused map-model test) |
| Provider walk rendering | Existing cases confirm `osrm-foot-route` geometry remains exact/solid | PASS (fixture test) |
| Fresh route API → persistence → map for this saved journey | Requires a new planner search with actual pedestrian provider geometry and transfer feasibility; no authenticated E2E performed | NOT_TESTED |
| Heavy local integration/browser acceptance | 27% free RAM, 18 GiB free disk at 13:07 EET | NOT_RUN (resource gate) |

The change prevents a synthetic city-grid line from being presented as exact street routing. It does not create missing real geometry or change persisted journeys.

## 2026-11-07 13:09 EET — route-card provenance consistency

| Gate | Evidence | Result |
|---|---|---|
| Legacy synthetic walking distance is qualified | Site map/result presentation tests: 44 passed, 0 failed/skipped; scoped ESLint and diff check pass | PASS (focused model/presentation tests) |
| Real walking distance and geometry | OSRM/GTFS source tokens remain exact in current model; no fresh authenticated route was submitted in this checkpoint | FIXTURE_VERIFIED / live path NOT_TESTED |
| Visual/browser acceptance | Browser attach unavailable; no current screenshot or accessibility tree | NOT_TESTED |

Resource sample 13:09 EET: 29% free RAM, 18 GiB free disk, ~10.2 GiB encrypted swap used. Full build/E2E deferred; no production readiness claim follows from these focused tests.

## 2026-11-07 13:17 EET — isolated Site PR evidence

| Gate | Evidence | Result |
|---|---|---|
| Synthetic walk map and aggregate disclosure | Site PR #85 head `75362b15a390e2084b864a3f41d56633423b9788`; 42 focused tests passed, ESLint and diff check passed | PASS (focused local tests) |
| Exact-head Site CI | Runs `42367509530` and `42367484358` on PR #85; both in progress at dependency installation | IN_PROGRESS |
| PR mergeability | PR #85 targets current Site main `c13e648d1b9b08fced31eeda67fe9f29fae08526`; mergeable, merge state blocked by pending checks | NOT_MERGED |
| Visual/live route acceptance | No screenshot or fresh authenticated route/provider E2E in this checkpoint | NOT_TESTED |

This PR only qualifies synthetic geometry as approximate; real pedestrian street geometry and end-to-end route acceptance remain separate gates.

## 2026-11-07 13:20 EET — Site PR #85 merged

| Gate | Evidence | Result |
|---|---|---|
| Exact-head Site CI | PR #85 head `75362b15a390e2084b864a3f41d56633423b9788`; runs `42367484358` and `42367509530` both succeeded, including lint, typecheck, tests, production build and boot-smoke | PASS |
| Site main integration | PR #85 merged; merge commit/current main `3ade7a1b0035024a829b467b71e7ed60d9d9f3ea` | PASS |
| Visual/live routing acceptance | Browser automation unavailable; no fresh authenticated route or live provider path was exercised | NOT_TESTED |
| Unified production release | Root PR #20 private Admin source clone returned HTTP 403; exact six-SHA staging, backup/restore and rollback remain unverified | BLOCKED / NOT_RELEASED |

## 2026-11-07 13:25 EET — current-main routing/runtime trace

| Gate | Evidence | Result |
|---|---|---|
| Server current-main CI | SHA `9df0ae097abc43a4f611151a482c349a8f931a82`, GitHub run `42358976391` | PASS (branch CI) |
| Site current main | PR #85 merged, SHA `3ade7a1b0035024a829b467b71e7ed60d9d9f3ea`; exact-head checks passed | PASS (Site change) |
| Foot-route code path | Server main routes WALK via configured OSRM foot `routePedestrianPath`, persists provider provenance when a valid path is returned | IMPLEMENTED; fresh authenticated journey not verified |
| Local API identity | Port 3002 `/readyz` 200, DB/realtime connected; dirty dev build `20f64a8b745137f08808d0198ea554f8da8a3911`; not current main or staging | LOCAL_HEALTHY / NOT_RELEASE_CANDIDATE |
| Fresh route geometry | Existing saved journey has zero geometry points on three WALK rows; no fresh authenticated search in this checkpoint | NOT_TESTED |
| Root release CI | PR #20 run `42265893827` failed cloning private Admin with HTTP 403 | BLOCKED |
| Production readiness | Staging, exact six-SHA, backup/restore and rollback lack evidence | NOT_RELEASED |

Local dirty Server branch `antigravity/ukraine-12-transports-multimodal` (HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`) is 88 commits behind / 4 ahead of Server main. Preserve its uncommitted work; its walking-path changes use synthetic grid geometry and cannot be represented as real street routing.

## 2026-11-07 13:41 EET — Site search controls PR #86

| Gate | Evidence | Status |
|---|---|---|
| Search controls candidate | PR #86 head `111cfea0360908861bde956eedad08c5b253878d`, based on Site main `3ade7a1b0035024a829b467b71e7ed60d9d9f3ea`; providers moved to header/dialog, duplicate wide map action and lower provider row removed, destination pin preserved, carpool emphasis added without increased tile height | Candidate |
| Focused verification | 43/43 targeted tests; scoped ESLint and `git diff --check` passed | PASS (local candidate) |
| Exact-head CI | Runs `42369194074`, `42369215655` | PENDING at 13:41 EET |
| Visual/full build | Browser visual review and full build not run | NOT_TESTED |
| Production release | No staging/exact six-SHA/backup-restore acceptance | NOT_RELEASED |

## 2026-11-07 13:44 EET — Site search UX merged

| Gate | Evidence | Status |
|---|---|---|
| Site search controls | PR #86 merged at `39681cd1800cf71639c3f5232fbec7d3c8a47d38` | INTEGRATED |
| Site exact-head checks | PR CI runs `42369194074`, `42369215655` passed | PASS |
| Site post-merge CI | Run `42369380819` on main SHA `39681cd1800cf71639c3f5232fbec7d3c8a47d38`; lint, typecheck, tests, token checks, production build, bundle checks, Playwright setup, boot-smoke all passed | PASS |
| Visual browser acceptance | No manual visual review on the merged bundle | NOT_TESTED |
| Root integration PR #20 | verify failed on private Admin/Partner materialization; CodeQL and Gitleaks passed | BLOCKED |
| Production rollout | No exact six-SHA staging acceptance or deployment | NOT_RELEASED |

| Exact main tuple observation | Read-only GitHub main SHAs recorded in `RELEASE_MANIFEST.json` under `observed_main_tuple_2026_11_07_1344_eet`; Site and Server main CI have pass evidence, other components lack current CI evidence | OBSERVED_ONLY / INTEGRATION_NOT_VERIFIED |

## 2026-11-07 13:48 EET — current blockers and live local identity

| Gate | Evidence | Status |
|---|---|---|
| Root PR stack | #12 → #18 → #20; #19 is a divergent-base alternative. Latest listed verify checks fail; #20 run `42265893827` reports HTTP 403 cloning private Admin. | BLOCKED |
| Actions credential | Secret name exists but value was not inspected; current 403 proves usable private source access is not established. Replace with least-privilege read-only Contents token for Admin/Partner; rotate exposed credential. | OWNER ACTION |
| Current local API | `/healthz` and `/readyz` return 200, but `/api/v1/version` reports dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, not release main. | LOCAL DEV ONLY |
| Place autocomplete | `/api/v1/places/suggest?q=Lviv` returns 503 `geocoder_unavailable`; API directs configuration of Photon or an approved geocoder. | RELEASE BLOCKER |
| Public URL | Approved zrok tunnel reports API health/readiness 200; it tunnels to the local dirty server and is not staging. | NOT_STAGING |

## 2026-11-07 13:55 EET — geocoder provider probe

| Gate | Evidence | Status |
|---|---|---|
| MARSHGO place autocomplete | Current dirty local API `/api/v1/places/suggest?q=Lviv` returns 503 `geocoder_unavailable`; API build SHA `20f64a8b745137f08808d0198ea554f8da8a3911` | FAIL (local dev configuration) |
| Photon public demo forward probe | `GET https://photon.komoot.io/api/?q=Lviv&limit=3&lang=en` returned HTTP 200 in 0.335s with UA records | LIVE_PROVIDER_PROBE only |
| Photon public demo reverse probe | `GET https://photon.komoot.io/reverse?lat=49.841952&lon=24.0315921` returned HTTP 200 in 0.138s and «Львів» | LIVE_PROVIDER_PROBE only |
| Photon deployment suitability | Official README allows reasonable project use, but says extensive usage may be throttled/banned and makes no availability guarantees | NOT_PRODUCTION_GRADE |
| MARSHGO Photon adapter/runtime | Server main supports explicit Photon configuration, but active API remains configured for public Nominatim; no config/restart made | NOT_TESTED_IN_APP |
| Provider decision | Owner asked to approve limited staging use, provide contracted/self-hosted endpoint, or keep geocoding disabled | PENDING |

| Photon adapter tests | Server main `9df0ae097abc43a4f611151a482c349a8f931a82`, clean isolated worktree `/private/tmp/marshgo-server-photon-contract-20261107`, `tsx --test tests/geocoding.test.ts`: 17 passed, 0 failed/skipped; uses isolated mock HTTP provider, not live app routing | FIXTURE_VERIFIED |

| Place-search outage recovery | Site search-layout candidate (now merged in main): `place-search-recovery` + `map-point-selection` targeted suites 14/14 passed. A 503 offers recovery, clears stale suggestions, and preserves explicit map/GPS coordinates when reverse geocoding fails. | FIXTURE_VERIFIED; FULL_ROUTE_NOT_TESTED |

| Server → live Photon | Exact Server main SHA `9df0ae097abc43a4f611151a482c349a8f931a82`; direct `suggestPlaces('Lviv')` once through the actual Server adapter to public Photon returned six parsed Ukrainian results, first «Львів, Львівська область» | LIVE_VERIFIED (single adapter probe only); APP_FLOW_NOT_TESTED |

| Root Admin/Partner Actions access refresh | `gh secret list` confirms `MARSHGO_REPOS_READ_TOKEN` last updated `2026-11-06T18:41:15Z`; PR #20 run `42265893827` remains failed; value was not inspected | BLOCKED_PENDING_OWNER_CREDENTIAL_UPDATE |
## 2026-11-07 14:07 EET — foot-router and current HTTPS smoke recheck

| Check | Result | Evidence class | Acceptance status |
|---|---|---|---|
| Local Lviv foot router | OSRM `code=Ok`, 1,769.6 m, 1,274.2 s, 74 geometry points for generic test coordinates | Local service probe; source extract is not verified | LOCAL_TESTED only |
| Local Kyiv foot router | OSRM `code=Ok`, 2,014.1 m, 1,514.3 s, 92 geometry points for generic test coordinates | Local service probe; source extract is not verified | LOCAL_TESTED only |
| Router data identity | Both containers use image digest `sha256:af5d4a83fb90086a43b1ae2ca22872e6768766ad5fcbb07a29ff90ec644ee409`; commands load `/data/lviv.osrm` and `/data/kyiv.osrm`. Container files show Nov 2 timestamps, but their declared host bind source is not visible at the same path on this Mac. | Identity partially observed; OSM source, license, coverage and freshness unknown | NOT VERIFIED for production |
| Local API readiness | `http://127.0.0.1:3002/healthz` and `/readyz` returned 200 | Local runtime; dirty development build | LOCAL_TESTED |
| Local autocomplete | `/api/v1/places/suggest?q=Lviv` returned 503 `geocoder_unavailable` | Local runtime | FAIL; journey search remains blocked |
| Approved HTTPS tunnel | `/readyz` returned 200; autocomplete returned 503 | Tunnel to local development runtime, not staging | NOT STAGING_VERIFIED |
| API → planner → persistence → Site pedestrian polyline | Not exercised in this checkpoint; saved journeys are not mutated | No authenticated integrated scenario | NOT_TESTED |

No configuration was changed and no container or API process was restarted. The router probe does not establish a licensed, version-pinned production dataset or live transit coverage. Production remains `NOT_RELEASED`.

## 2026-11-07 14:20 EET — release materializer exact-SHA guard

| Check | Result | Acceptance status |
|---|---|---|
| Canonical manifest validator on PR #21 base | 6/6 exact component pins; status `NOT_RELEASED`, `production_ready=false` | PASS (local CLI, exact base SHA `041ab47d083830f1b4271ccf4c3b5d6cde080339`) |
| Validator unit suite | 81 passed, 0 failed/skipped | PASS (Node 25.4.0, PR #21 worktree) |
| Production deployment contract | 3 passed, 0 failed/skipped | PASS (Node TypeScript strip-types, PR #21 worktree) |
| Materializer entrypoint | Full existing validator now runs before output directory creation/clones; `integration_sha` uses exact SHA guard | Implemented in PR #21 head `a93aa3617094d33c8222269f1db360f923665a25`; remote CI pending at checkpoint |
| Production deployment | No deployment or staging test performed | NOT_RELEASED |

## 2026-11-07 14:23 EET — PR #21 exact-head remote verification

| Check | Result | Acceptance status |
|---|---|---|
| PR #21 SHA `a93aa3617094d33c8222269f1db360f923665a25` CI | Manifest validation, install/audit, lint, typecheck, unit/ops/integration tests, migrations, build and bundle checks passed | PASS |
| PR #21 materialization | Failed fetching private `MarshGO-Admin` with HTTP 403; Partner clone was not reached | BLOCKED_EXTERNAL: Actions credential lacks usable repository access (confirmed at Admin clone) |
| PR #21 security checks | CodeQL and Gitleaks passed | PASS |
| Staging/release | No staged artifact or deployment was produced | NOT_STAGING_VERIFIED / NOT_RELEASED |


## 2026-11-07 14:26 EET — managed staging inventory

| Repository | GitHub Environments | GitHub Deployments | Status |
|---|---:|---:|---|
| MarshGO | 0 | 0 | No managed staging target evidenced |
| MarshGO-Server | 0 | 0 | No managed staging target evidenced |
| MarshGO-Site | 0 | 0 | No managed staging target evidenced |
| MarshGO-iOS | 0 | 0 | No managed staging target evidenced |
| MarshGO-Admin | 0 | 0 | No managed staging target evidenced |
| MarshGO-Partner | 0 | 0 | No managed staging target evidenced |

The provided zrok URL is currently a tunnel to local development, not a managed staging target. No deployment or paid resource was created. `STAGING_VERIFIED=false`, `production_ready=false`, `deployed=false`.


## 2026-11-07 14:29 EET — current main CI evidence

| Repository | Exact current main SHA | GitHub check-run observation | Acceptance meaning |
|---|---|---|---|
| MarshGO | `1e7d0ee74f11121a7d5a29c6379944a5360581c4` | No check runs | Root orchestration not CI-verified on this main SHA |
| MarshGO-Server | `9df0ae097abc43a4f611151a482c349a8f931a82` | 1 successful check-run collection | Component CI only |
| MarshGO-Site | `39681cd1800cf71639c3f5232fbec7d3c8a47d38` | 1 successful check-run collection | Component CI only |
| MarshGO-iOS | `ad27b6f70b6255d1dd323bafcffafe4558232224` | 1 successful check-run collection | Component CI only; no physical-device evidence |
| MarshGO-Admin | `02b28940ee017523f2feed01de458f8d0aa20279` | 1 successful check-run collection | Component CI only |
| MarshGO-Partner | `179631f45e984c5712bef83af43912125e3521d1` | 1 successful check-run collection | Component CI only |

Green component checks are not unified six-SHA acceptance. Cross-component runtime, staging, backup/restore and rollback remain NOT_TESTED; `production_ready=false`, `deployed=false`.


## 2026-11-07 14:41 EET — Site main visual smoke and React runtime fix

| Check | Exact candidate | Result | Acceptance meaning |
|---|---|---|---|
| Clean Site main preview before change | `39681cd1800cf71639c3f5232fbec7d3c8a47d38` | FAIL: blank page; browser/Vite reported duplicate React dispatcher (`Invalid hook call` in `ProductionMarketplace`) | Reproduced locally in isolated worktree, no dirty checkout overwritten |
| Vite React deduplication | `36adfa6f0ab7db78115eee02461f485a1cb2f512` | Browser reload renders MARSHGO welcome screen; `react.js` and `react-dom_client.js` resolve to the same optimizer chunk | LOCAL_TESTED, visual screen smoke only |
| Site proxied readiness | `36adfa6f0ab7db78115eee02461f485a1cb2f512` → local API build `20f64a8b745137f08808d0198ea554f8da8a3911` | `/readyz` HTTP 200, database and realtime connected | Local-only; not staging |
| Address autocomplete | same local candidate | HTTP 503 `geocoder_unavailable` | RELEASE BLOCKER for real place search; no provider was substituted |
| Exact-head GitHub CI | PR #87 head `36adfa6f0ab7db78115eee02461f485a1cb2f512`, run `42373538205` | lint, typecheck, tests, check-tokens, build, bundle and single-React passed; Playwright install in progress, boot-smoke pending | PR remains open; do not merge until run completes and required checks pass |
| Full local build/typecheck | same candidate | Not run: 28% free RAM, 17 GiB disk, swap ~10.8 GiB used | Resource-gated; remote CI provides exact-head build/test evidence |

`/journeys/search` on the clean preview currently displays the unauthenticated welcome state; authenticated search-control and booking acceptance were not performed. Site PR #87 is open; no exact six-SHA release, staging acceptance, deployment, backup/restore, rollback, or production readiness is claimed.


## 2026-11-07 14:44 EET — Site React fix merged

| Check | Exact SHA / run | Result | Meaning |
|---|---|---|---|
| Site exact-head CI | PR #87 `36adfa6f0ab7db78115eee02461f485a1cb2f512`, run `42373538205` | SUCCESS: lint, typecheck, tests, token check, build, bundle, single-React, Playwright install, boot-smoke | Candidate checks passed |
| Site main | merge commit `cf2fa64c8b8545e3c4554aa1438d0ed06021014b` | Verified by `git fetch origin main` + `rev-parse`; welcome screen visual smoke reloaded | INTEGRATED; post-merge CI not observed |
| Local route search | local API build `20f64a8b745137f08808d0198ea554f8da8a3911` | `/readyz` 200; `/api/v1/places/suggest?q=Lviv` 503 `geocoder_unavailable` | Search unavailable; external/provider configuration remains unresolved |

This is not staging or production acceptance. Keep `production_ready=false`, `deployed=false`, and `NOT_RELEASED`.


## 2026-11-07 14:47 EET — local geocoder and unauthenticated UI

| Check | Result | Status |
|---|---|---|
| API readiness via Site proxy | HTTP 200; database/realtime connected | LOCAL_TESTED |
| Place autocomplete | HTTP 503 `geocoder_unavailable`; current configured host is public `nominatim.openstreetmap.org`, rejected for autocomplete by backend policy | BLOCKED: approved endpoint required |
| Site welcome and login screens | Visually rendered on clean Site main preview after PR #87 | LOCAL_TESTED |
| Authenticated search workflow | No login data entered; owner sign-in on preview requested | NOT_TESTED |


## 2026-11-07 — active Server stack evidence

| Check | Build/environment | Result | Interpretation |
|---|---|---|---|
| Docker local DB/Redis state | isolated `marshgo-local-api` project | PostGIS and Redis healthy | Local development dependency only |
| API health/readiness | `20f64a8b745137f08808d0198ea554f8da8a3911`, dirty development build | `/healthz` and `/readyz` HTTP 200 | LOCAL_TESTED, not staging |
| Geocoder unit/contract suite | same Server HEAD | 15 passed, 0 failed, 0 skipped | FIXTURE_VERIFIED only |
| Local API script smoke | same worktree | NOT RUN: required ignored `.env.local-api` missing | No credentials copied |
| HTTPS tunnel address autocomplete | zrok tunnel to local dev API | HTTP 503 `geocoder_unavailable` | Real search blocker remains |


| Direct Server smoke | `20f64a8b745137f08808d0198ea554f8da8a3911` dirty development runtime | `/healthz`, `/api/v1/health`, `/readyz` all HTTP 200; `/version.commitSha` exactly equals checkout HEAD | PASS local identity/smoke only; not staging or production |

## 2026-11-07 15:20 EET — Site PR #88 candidate

| Check | Exact SHA / run | Result | Meaning |
|---|---|---|---|
| Targeted canonical design tests | Site PR #88 head `e5179e469a25da4824c9289660c1e53cc17c5819` | 26 passed, 0 failed, 0 skipped | LOCAL_TESTED |
| Exact-head CI run | `42376256802` | Full Site verify workflow passed, including boot-smoke | PASS |
| Duplicate exact-head CI run | `42376281612` | Still in progress at Playwright install; boot-smoke pending | PR check unresolved; merge gate remains closed |
| Visual search acceptance | Existing 4179 browser preview | Still shows old destination map-picker controls after reload; preview identity differs from candidate source | NOT_VERIFIED |
| Merge | PR #88, base `cf2fa64c8b8545e3c4554aa1438d0ed06021014b` | Open and reported mergeable; no merge performed while a check is pending | NOT_INTEGRATED |

Candidate only covers removal of the route-search destination map picker; requested provider placement and bottom controls are not part of this PR. Production and staging status unchanged: `NOT_RELEASED`, `NOT_TESTED`.

## 2026-11-07 15:24 EET — Site PR #88 post-merge state

| Check | Exact SHA / run | Result | Meaning |
|---|---|---|---|
| Site PR #88 exact-head CI | `e5179e469a25da4824c9289660c1e53cc17c5819`; runs `42376256802`, `42376281612` | Both success | Required PR CI passed |
| Site main merge | `250ccf04ec56de676a19e1797b15a40319978bac` | PR #88 squash-merged; fetched `origin/main` equals merge SHA | INTEGRATED |
| Site post-merge CI | run `42376821848` on `250ccf04ec56de676a19e1797b15a40319978bac` | In progress at last observation | NOT_YET_VERIFIED |
| Visual browser acceptance | Existing local 4179 preview | Still renders stale pre-merge controls; not exact main candidate | NOT_VERIFIED |

Production readiness and deployment statuses are unchanged: `production_ready=false`, `deployed=false`, `NOT_RELEASED`.

## 2026-11-07 15:27 EET — post-merge Site main CI

| Check | Exact SHA / run | Result | Meaning |
|---|---|---|---|
| Site main CI after PR #88 | `250ccf04ec56de676a19e1797b15a40319978bac`, run `42376821848` | Success | Site main component CI verified |
| Current six main refs | Root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; Server `9df0ae097abc43a4f611151a482c349a8f931a82`; Site `250ccf04ec56de676a19e1797b15a40319978bac`; iOS `ad27b6f70b6255d1dd323bafcffafe4558232224`; Admin `02b28940ee017523f2feed01de458f8d0aa20279`; Partner `179631f45e984c5712bef83af43912125e3521d1` | GitHub main refs re-read at 15:26 EET | Observation only; unified compatibility not verified |
| Search UX in browser | Local 4179 tab | Stale UI still visible; not exact merged SHA | NOT_VERIFIED |

Release remains `NOT_RELEASED`; staging and exact-six-SHA acceptance are not verified.

## 2026-11-07 15:32 EET — exact current-main CI snapshot

| Repository | Main SHA | Latest exact-main run | Result |
|---|---|---|---|
| MarshGO | `1e7d0ee74f11121a7d5a29c6379944a5360581c4` | No main workflow runs observed | NOT_CI_VERIFIED |
| MarshGO-Server | `9df0ae097abc43a4f611151a482c349a8f931a82` | `42358976391` | PASS |
| MarshGO-Site | `250ccf04ec56de676a19e1797b15a40319978bac` | `42376821848` | PASS |
| MarshGO-iOS | `ad27b6f70b6255d1dd323bafcffafe4558232224` | `41513711425` | PASS (Simulator workflow only) |
| MarshGO-Admin | `02b28940ee017523f2feed01de458f8d0aa20279` | `41512221408` | PASS |
| MarshGO-Partner | `179631f45e984c5712bef83af43912125e3521d1` | `41512231762` | PASS |

This snapshot does not establish cross-repository compatibility, staging acceptance, or production readiness.

## 2026-11-07 15:37 EET — runtime identity and resource recheck

| Surface | Observed identity | Result | Acceptance status |
|---|---|---|---|
| Server API `127.0.0.1:3002` | Dirty dev build `20f64a8b745137f08808d0198ea554f8da8a3911`; `/healthz` and `/readyz` 200 | Service is up; provider-backed journey flow not tested | LOCAL_DEV_ONLY |
| Canonical Server checkout | `e9934abbd8fc973177de8d7f47548739758a1b74`, dirty Antigravity branch | 3 tracked/staged + 4 untracked paths; geometry/fallback work visible | NOT_TESTED, PRESERVED |
| Canonical Site checkout | `eda449f008025b2126c92fd24cd68deb513ca3ad`, dirty Antigravity branch | 21 tracked/staged + 2 untracked paths | NOT_TESTED, PRESERVED |
| Exact-main visual preview | `:4181`, detached at old SHA `cf2fa64c8b8545e3c4554aa1438d0ed06021014b` | Owner sign-in pending; not updated during sign-in | NOT_VERIFIED |
| Local resource gate | 15 GiB disk free, 4,362 free pages of 524,288, swap 12.1 GiB | RED; no heavy local work started | RESOURCE_BLOCKED |

## 2026-11-07 15:40 EET — approved HTTPS tunnel probe

| Request | Result | Evidence meaning |
|---|---|---|
| `GET /readyz` | 200; status ready; database and realtime connected | Runtime health only |
| `GET /api/v1/version` | SHA `20f64a8b745137f08808d0198ea554f8da8a3911`; build `local-20f64a8b7451-dirty-20261107T074421Z`; `environment=development`; `sourceState=dirty` | Confirms tunnel reaches local dirty dev API, not staging |
| `GET /api/v1/places/suggest?q=Lviv` | 503 | Address search unavailable |
| `GET /api/v1/journeys/me` without auth | 401 | Expected protected endpoint; no authenticated journey proof |

Probe target `https://marshgo-dima.shares.zrok.io`; no credentials submitted. The host is not a staging acceptance target.

## 2026-11-07 15:42 EET — preview and resource checkpoint

| Surface | Observed identity | Result | Acceptance status |
|---|---|---|---|
| Local preview `:4181` | Clean detached Site worktree at `cf2fa64c8b8545e3c4554aa1438d0ed06021014b` | HTTP 200; CUA cannot inspect the user tab; no screenshot/assertions | NOT_VERIFIED |
| Current local API | Dirty development build `20f64a8b745137f08808d0198ea554f8da8a3911` | Health/readiness pass; place suggestions return 503; no authenticated route verification | LOCAL_DEV_ONLY |
| Local resource gate | 18 GiB disk free; 31% memory free; 9.1 GiB swap; CPU idle 55.8% | Below GREEN threshold; heavy work deferred | YELLOW |

No code or data changes, tests, restarts or cleanup were performed in this checkpoint. Production remains `NOT_RELEASED`.

## 2026-11-07 15:44 EET — autocomplete failure diagnosis

| Check | Exact result | Meaning | Status |
|---|---|---|---|
| Local `GET /api/v1/places/suggest?q=Lviv` | HTTP 503 `geocoder_unavailable`: public Nominatim autocomplete unsupported; configure Photon or approved geocoder | Confirms active API configuration/provider choice causes search suggestions failure | FAIL (DEV CONFIG) |
| Server source at `20f64a8b745137f08808d0198ea554f8da8a3911` | Explicitly rejects `nominatim.openstreetmap.org` for suggestions | Source behavior matches API error | SOURCE_CONFIRMED |

No provider or runtime configuration was changed. An app-level search and production/staging geocoder acceptance remain NOT_TESTED.

## 2026-11-07 15:49 EET — Photon demo dependency policy

The official [Photon README](https://github.com/komoot/photon#demo-server) allows reasonable use of the demo API but provides no availability guarantee and warns of throttling/ban for extensive use. Therefore it may support a bounded, explicitly approved development probe only; it cannot satisfy production geocoder readiness. No external request or runtime change was made while owner approval is pending.

## 2026-11-07 15:53 EET — preview API target identity

| Component | Identity | Evidence | Status |
|---|---|---|---|
| Site preview `127.0.0.1:4181` | PID `68367`, clean detached Site SHA `cf2fa64c8b8545e3c4554aa1438d0ed06021014b` | Vite proxy defaults to `127.0.0.1:3002`; listener and cwd match preview worktree | PREVIEW_IDENTITY_CONFIRMED |
| Server behind preview | Dirty dev SHA `20f64a8b745137f08808d0198ea554f8da8a3911` | Through preview `/api/v1/version` = 200; place suggestion = 503 with public Nominatim error | DEV_API_CONNECTED / SEARCH_BLOCKED |

The preview is one Site merge behind current `main` (`250ccf04…`), and this API/search probe was unauthenticated. It is not visual or route-search acceptance.


## 2026-11-07 16:03 EET — map-pin correction and bounded geocoder probe

| Check | Identity / result | Status |
|---|---|---|
| Site destination picker | Main `864e2383da8b0f1355e534381d2783017b7d1a51`; PR #89 exact-head CI passed twice; targeted tests 26/26, ESLint passed | INTEGRATED / CI_VERIFIED; post-merge CI pending |
| Preview `:4181` | Clean isolated worktree updated to Site SHA `864e2383da8b0f1355e534381d2783017b7d1a51`; CUA could not inspect its browser tab | PREVIEW_UPDATED / VISUAL_NOT_VERIFIED |
| Photon suggestion adapter | Server dev SHA `20f64a8b745137f08808d0198ea554f8da8a3911`; generic query “Львів” yielded 6 results, first from Lviv Oblast | LIVE_ADAPTER_VERIFIED; not HTTP route or production |
| Photon reverse adapter | Lviv city-center coordinate resolved to `Львів, Львівська область` | LIVE_ADAPTER_VERIFIED; not HTTP route or production |
| Existing HTTP API autocomplete | Still configured for public Nominatim; GET through preview returns 503 `geocoder_unavailable` | FAIL (DEV CONFIG) |
| Server focused tests | `node --import tsx --test tests/geocoding.test.ts` | PASS 15/15 |

Photon use was owner-authorized for generic development queries only. No server configuration, database, production service, or API process was changed.


## 2026-11-07 16:06 EET — exact-main visual screenshot

| Check | Result | Status |
|---|---|---|
| Site PR #89 post-merge | CI run `42379422310` success on main SHA `864e2383da8b0f1355e534381d2783017b7d1a51` | PASS |
| Preview identity | Clean isolated worktree `:4181` at `864e2383da8b0f1355e534381d2783017b7d1a51`, HTTP 200 | PASS |
| Screenshot inspection | Destination in-field map pin present; full-width duplicate absent; Providers and All Types visible; carpool highlighted; bottom nav visible | VISUAL_PASS_SINGLE_VIEW |
| Viewport/interaction coverage | Approx. 630×940 pane only; no button click, other viewport or full route search | NOT_TESTED |

The local screenshot contains a user-entered origin and remains unshared; no address value was recorded here. Authentication identity was not independently verified.

## 2026-11-07 16:10 EET — provider and resource gate

| Gate | Evidence | Status |
|---|---|---|
| Lviv GTFS reuse | Official data.gov.ua record states commercial reuse is allowed with attribution; resource metadata last updated 2025-01-09. Existing local snapshot counts are from a separate database, not the active `:3002` runtime. | RIGHTS_REVIEW_PARTIAL / FRESH_ARCHIVE_NOT_RECHECKED |
| Provider-backed local search | Active `:3002` DB previously had zero provider rows; no provider was activated and no route search was run. | NOT_VERIFIED |
| Resource gate | 18 GiB disk free; 31% RAM free; 8.7 GiB swap used. DerivedData 34 MiB, simulator data 13 GiB, no booted simulator; external `/Volumes/500` absent. | YELLOW / HEAVY_WORK_DEFERRED |

No GTFS archive was downloaded or parsed and no active database, provider registry, or simulator data was changed.

Read-only feed `HEAD` probe: HTTP 200 `application/zip`, 3,568,789 bytes, Last-Modified 2026-11-02 08:06:59 UTC. This confirms an updated archive is served, but not current content, service dates or routing. The isolated acceptance stack was stopped after confirming zero PostgreSQL client sessions and only inspection clients on Redis; volumes were retained. Post-stop resource sample: 18 GiB disk free, RAM free 28%, swap 8.1 GiB. Heavy work remains deferred.

Active local API check on `127.0.0.1:3002`: `/healthz` 200 and `/readyz` 200; `/api/v1/places/suggest?q=Lviv` remains 503 `geocoder_unavailable` because public Nominatim autocomplete is intentionally rejected. The request contained only a generic city name. This is development readiness, not staging acceptance.

## 2026-11-07 16:31 EET — provider-error severity / fallback disclosure

| Check | Exact identity/result | Status |
|---|---|---|
| Qoder Site #56 selective port | PR #90 source head `d30bb36645a9ed20eb76e708b3e114ab3a0c0f83`; Site main merge `9c637c7dcbf0815b72478f64666d8a05267ece6c` | MERGED / exact-head CI PASS |
| Provider notice tests | `journey-completeness-notices.test.ts`: 7 passed, 0 failed, 0 skipped; `journey-result-presentation.test.ts`: 29 passed, 0 failed, 0 skipped | LOCAL_TESTED / FIXTURE_VERIFIED |
| Exact-head CI | Site verify runs `42381729385` and `42381732849` both succeeded | CI_PASS |
| Post-merge CI | Site run `42381911143` on merge SHA `9c637c7dcbf0815b72478f64666d8a05267ece6c` | PASS |
| Live provider behavior | No provider-backed route search was run in this checkpoint | NOT_TESTED |

User-facing provider explanations now remain separate: schedule fallback and candidate pruning are cautions; failed provider data remains an outage. No external availability is asserted. Current production status remains `NOT_RELEASED`.

### 2026-11-07 16:51 EET — Lviv live VehiclePositions feed spot check

| Scenario | Evidence | Result |
|---|---|---|
| Current Lviv GTFS-RT VehiclePositions payload | Current-main parser source SHA-256 `3127b48fd04c59a09844536ae5236e94e4440e4b4ad1e15a6916b5e47ef12a27`, same bytes in current `origin/main` and probe checkout; read-only current URL probe | Feed accessible and valid protobuf; header age 8 s; 428 position entities; 401 fresh within 90 s, 27 stale; none missing timestamps/coordinates; 0 TripUpdates/Alerts; validator `degraded` |
| API, route identity, Web map and journey result | Not exercised by this feed-level probe | NOT_TESTED |

This is a one-time LIVE feed observation, not staging/production acceptance or a guarantee of continuous coverage. Current local API/provider DB state and client rendering must be checked separately. See `docs/PRODUCTION_PROVIDER_MATRIX.md` for provider limitations.


## 2026-11-07 17:09 EET — Qoder #55 accessibility slice merged

- Site PR #91 merged normally: https://github.com/dima1203oleg/MarshGO-Site/pull/91. Base `9c637c7dcbf0815b72478f64666d8a05267ece6c`; exact head `ffc8b920da25fefe7a7ad99f7fd00c0e49115931`; merge commit and current Site `origin/main`: `24f305bb65591b8d5104ceb603b0132cc7051b0c`.
- Exact-head required Site CI runs `42384364772` and `42384368760`: PASS. Post-merge main CI run `42384556014` on the merge SHA: PASS, including lint, typecheck, full Site tests, token check, build, bundle checks, and boot smoke. The first attempt failed only because the existing token checker omitted the new imported feedback stylesheet; that gate was updated to scan it, then all fresh checks passed.
- Targeted local accessibility/contrast test: 2/2 passed; token check passed (145 defined / 114 referenced); `git diff --check` passed.
- This is a PARTIAL_PORT from Qoder #55: journey search failures now have alert semantics, icon and screen-reader cue, with light/dark AA contrast-tested styling. Other Qoder #55 status-message call sites were not bulk-converted. Theme boot implementation was already present in main. Dirty original Site worktree remains untouched.
- Current Site main SHA is now `24f305bb65591b8d5104ceb603b0132cc7051b0c`. This does not constitute exact-six-SHA, staging, backend journey, or production acceptance. Production remains `NOT_RELEASED`.


## 2026-11-07 17:09 EET — Photon adapter live city-sample probe

- Using the current Server main `server/geocoding.ts` at local checkout `/private/tmp/marshgo-server-main-20f64a8`, called its actual `suggestPlaces` adapter with `GEOCODING_PROVIDER=photon`, `GEOCODING_ENGINE_URL=https://photon.komoot.io/api/`, and only generic queries `Lviv` and `Kyiv`. Photon returned HTTP 200; adapter parsing returned 6 unique suggestions for each city with OSM-based provider IDs. No personal addresses were queried.
- An exploratory request adding `lang=uk` returned HTTP 400; the app adapter correctly omits that unsupported parameter and uses the country/bbox settings already in code.
- This validates the adapter against two live sample queries only; it does not verify the currently running API, attribution in rendered UI, sustained rate, exact address selection, reverse geocoding, or production SLA. The current local API still has public Nominatim autocomplete configured and returns 503. No live config was changed.
- Photon’s official README describes `photon.komoot.io` as a public demo: reasonable request volume only, extensive use may be throttled/banned, and availability is not guaranteed. OSM data requires attribution and license notice. Therefore do not silently make this public demo the production default; use an approved provider or provision a managed/self-hosted Photon service with operations and attribution addressed. Sources: [Photon project README](https://github.com/komoot/photon), [OSM copyright and license](https://www.openstreetmap.org/copyright).

## 2026-11-07 17:22 EET — provider picker and dev API smoke

| Check | Evidence | Status |
|---|---|---|
| Provider picker visual + accessibility tree | Isolated Site preview SHA `864e2383da8b0f1355e534381d2783017b7d1a51`; Lviv panel lists Lvivavtodor for bus/tram and MARSHGO Community carpool; unavailable modes disabled with explanation | VISUAL_PASS_SINGLE_VIEW |
| Available-mode toggle | Clicked off/on in preview; selected carpool, bus and tram were restored; no route submitted | INTERACTION_PASS |
| Provider catalog HTTP | `GET /api/v1/mobility/providers?lat=49.84&lon=24.03` -> HTTP 200, matching catalog rows | CATALOG_ONLY; route search not proven |
| API liveness/readiness | `:3002/healthz` and `/readyz` -> HTTP 200; `/version` identifies dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911` | LOCAL_DEV_PASS |
| HTTP place autocomplete | Generic `Lviv` and `Kyiv` queries -> HTTP 503 `geocoder_unavailable` under the dev process's rejected public-Nominatim autocomplete configuration | FAIL / RELEASE BLOCKER |
| Real route search, booking, payment | Not submitted | NOT_TESTED |

The UI screenshot/interaction was performed on the isolated preview, not the owner’s active `:4179` or a production/staging host. No user-entered address was sent to a provider; no process, config, DB or container was changed. The running API is a separately launched dirty dev process and must not be treated as the release candidate.

## 2026-11-07 17:26 EET — HTTPS share and API recheck

| Check | Evidence | Status |
|---|---|---|
| Owner-provided HTTPS share | `/` returns the MARSHGO landing page, HTTP 200 | WEB_PREVIEW_AVAILABLE |
| API health/readiness/version | `/healthz`, `/readyz`, `/api/v1/version` return HTTP 200; version points at dirty dev SHA `20f64a8b745137f08808d0198ea554f8da8a3911` | DEV_API_REACHABLE; NOT_STAGING |
| Provider catalog | City-scoped endpoint returns HTTP 200 with catalog rows for MARSHGO Community and Львівавтодор | CATALOG_ONLY; route result not verified |
| Protected journeys endpoint | Unauthenticated `/api/v1/journeys/me` returns HTTP 401 | AUTH_GATE_PRESENT; signed-in flow NOT_TESTED |
| Place autocomplete | Generic city sample returns HTTP 503 `geocoder_unavailable` | FAIL / RELEASE BLOCKER |
| Visual HTTPS page | Public sign-in/landing view rendered; no credentials entered and no new account created | VISUAL_PASS_LANDING_ONLY |
| Login form validation | Invalid-email browser validation blocked submit; no request was sent; autofill content was left untouched | FORM_VALIDATION_ONLY; AUTH_NOT_TESTED |

This recheck did not reproduce the earlier historical 502. The HTTPS share tunnels to a dirty development API running on the Mac; do not classify it as staging, production, or an exact-SHA candidate. No user records, routes, reservations, payments, runtime config, or processes were changed.

Unauthenticated security spot check: `/api/v1/journeys/me` with a synthetic nonexistent `x-dev-user-id` returned 401 and no data. This checks only this dev-bypass header path; it is not a security gate pass.

## 2026-11-07 17:39 EET — six current GitHub main SHAs

GitHub API `commits/main` was queried for all six canonical repositories. Exact tuple is recorded in root `RELEASE_MANIFEST.json` under `observed_main_tuple_2026_11_07_1738_eet`. All SHA values are full-length. Status: `OBSERVATION_ONLY_NOT_RELEASE_CANDIDATE`; CI was not rechecked in this query and cross-repository compatibility, artifact build, staging, restore, rollback, and deployment remain NOT_VERIFIED.

Follow-up on the same exact SHAs: Server, Site, iOS, Admin and Partner each have a completed successful check run (`verify` or iOS `simulator-build`). Root has no check runs, no combined status contexts (`pending`, total 0), and the GitHub tree has no `.github/workflows/` files. Root CI is therefore NOT_VERIFIED and is a release infrastructure gap.

### Root release workflow PRs — current GitHub state

| PR | Current state | Exact blocker |
|---|---|---|
| #12 — release checkpoint | OPEN, mergeable; `verify` failed | `ops/scripts/materialize-release.mjs` cannot clone private Admin (`HTTP 403`) |
| #13 — release manifest | OPEN, conflicting; `verify` failed | workflow step configuring private Admin/Partner read access failed |
| #21 — exact SHA gate | OPEN, mergeable; `verify` failed | materialization cannot clone private Admin (`HTTP 403`) |

CodeQL and Gitleaks checks passed on these PRs, but this does not override the failed `verify` checks or PR #13 conflict. The exposed token in chat was not used. Do not merge or bypass checks until the private-repository access is restored securely and exact-head checks pass.


## 2026-11-07 17:52 EET — Qoder worker memory protection candidate

| Gate | Candidate evidence | Status |
|---|---|---|
| Exact baseline | Server main `9df0ae097abc43a4f611151a482c349a8f931a82`; PR #111 head `3527f70fc6c648b84f3b779d58810d67b1f9c024` | PINNED_FOR_REVIEW
| GTFS worker memory helper | `tests/gtfs-worker-memory-ceiling.test.ts` — 6 passed, 0 failed, 0 skipped; local Node v25.4.0 | LOCAL_TESTED; runtime version differs from project pin 24.21.0
| Worker factory regression | Actual worker diagnostics confirmed the configured 384 MiB old-generation request reaches the worker on this host | LOCAL_TESTED
| Diff hygiene | `git diff --check` | PASS
| Lint/typecheck | ESLint could not start: `eslint-plugin-unused-imports` absent from available shared dependencies; full typecheck not run | BLOCKED / NOT_RUN
| GitHub exact-head CI | `verify` runs `42388476225`, `42388451810` | IN_PROGRESS at checkpoint; merge blocked pending PASS
| Production | No production runtime config changed; no deployment | NOT_RELEASED


## 2026-11-07 18:57 EET — PR #111 review fixes

| Gate | Candidate evidence | Status |
|---|---|---|
| Exact head | Server PR #111 `c89b85f3e2677255525d7c14b0060524af56e79`, base `9df0ae097abc43a4f611151a482c349a8f931a82` | OPEN / NOT_MERGED |
| Cgroup v1 coverage | Test covers `/sys/fs/cgroup/memory/memory.limit_in_bytes` and legacy flat path | LOCAL_TESTED |
| Worker heap regression | Explicit larger control no longer assumes unlimited host | LOCAL_TESTED |
| Targeted test | `tests/gtfs-worker-memory-ceiling.test.ts`: 6 passed, 0 failed, 0 skipped, Node 25.4.0 | PASS; repo pins Node 24.21.0 |
| Exact-head CI | runs `42388826698`, `42388831522` | IN_PROGRESS |
| Production | No live config changed or deployment made | NOT_RELEASED |


## 2026-11-07 19:02 EET — Server PR #111 merged

| Gate | Evidence | Status |
|---|---|---|
| PR exact-head CI | #111 checks `42388826698`, `42388831522` passed on `c89b85f3e2677255525d7c14b0060524af56e79` | PASS |
| Merge | Normal squash merge, commit `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` | MERGED |
| Post-merge Server CI | `verify` run `42389192270` | IN_PROGRESS |
| Current six-SHA observation | New tuple `observed_main_tuple_2026_11_07_1902_eet` in root `RELEASE_MANIFEST.json` | OBSERVATION_ONLY; compatibility NOT_VERIFIED |
| Production | No deployment | NOT_RELEASED |


## 2026-11-07 19:06 EET — Server post-merge CI and main tuple refresh

| Gate | Evidence | Status |
|---|---|---|
| Server main | `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` | CURRENT
| Post-merge verify | run `42389192270`, 4m11s; audit, lint, typecheck, tests, migrations, integration, image build/smoke, compose lifecycle | PASS
| Six current main SHAs | root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; Server `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6`; Site `24f305bb65591b8d5104ceb603b0132cc7051b0c`; iOS `ad27b6f70b6255d1dd323bafcffafe4558232224`; Admin `02b28940ee017523f2feed01de458f8d0aa20279`; Partner `179631f45e984c5712bef83af43912125e3521d1` | OBSERVED; exact-tuple integration NOT_VERIFIED
| Root CI/private portals | No root workflows; release PR materialization still blocked on private Admin/Partner access | BLOCKED
| Staging/production | No exact tuple staging acceptance or rollout | NOT_VERIFIED / NOT_RELEASED


## 2026-11-07 18:28 EET — geocoder and live runtime gate

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current-main geocoder adapter | Server main-equivalent PR #111 tree; `tests/geocoding.test.ts` — 17 passed, 0 failed/skipped | PASS (adapter contract) | Does not prove API, browser, route or staging acceptance. |
| Live low-volume Photon sample | Generic Lviv and Kyiv queries, no coordinates/bias; six Ukraine-scoped normalized suggestions each | LIVE_VERIFIED (two sample requests only) | Public demo only; no uptime/usage guarantee. Not approved production config. |
| Active local API health | `:3002/healthz`=200, `/readyz`=200; runtime SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, 7 behind main, `sourceState=dirty` | PARTIAL | Not current-main candidate or staging. |
| Typed autocomplete through active API | Generic city queries -> 503 `geocoder_unavailable`; runtime configured for public Nominatim | FAIL / RELEASE BLOCKER | Use an approved operated/self-hosted geocoder and restart a controlled exact-main stack. |
| Route→map→navigation | Not executed on exact-current Server + authenticated Site | NOT_TESTED | Requires approved geocoder plus authenticated route session. |

## 2026-11-07 18:41 EET — selected Qoder/Antigravity Site improvements

| Check | Exact candidate | Result | Evidence / limitation |
|---|---|---|---|
| Qoder motion utility/reduced-motion fixes plus Antigravity Escape/dark point-picker port | Site PR #92, base `24f305bb65591b8d5104ceb603b0132cc7051b0c`, head `d1b708a0bb98f811557ea3b5614d6ce5cd37b126` | LOCAL_TESTED; CI PENDING | Six targeted test files: 50 passed, 0 failed, 0 skipped; targeted ESLint and diff-check passed. GitHub verify runs `42392505186`, `42392528508` pending. No visual browser acceptance yet.
| Antigravity animated camera/3D pitch/geometry bundle | Dirty branch `eda449f008025b2126c92fd24cd68deb513ca3ad` vs Site main `24f305bb65591b8d5104ceb603b0132cc7051b0c` | PRESERVED / NOT_ACCEPTED | Candidate changes fit/padding and adds synthetic pedestrian geometry; also removes many regression tests. Requires isolated provenance-safe camera-only change plus visual acceptance; no wholesale port.

## 2026-11-07 18:44 EET — Qoder/Antigravity Site merge status

| Check | Exact candidate | Result | Evidence / limitation |
|---|---|---|---|
| Selective Qoder motion + Antigravity overlay/theme fixes | Site PR #92; exact head `d1b708a0bb98f811557ea3b5614d6ce5cd37b126`; merge/current main `0ee96c8052c094a99daf3218abea7b77b3e6df95` | MERGED; POST_MERGE_CI_PENDING | Exact-head Site CI runs `42392505186`/`42392528508` passed. Post-merge `Site CI` run `42392731336` is in progress. Local six-file targeted suite: 50 passed, 0 failed/skipped; ESLint and diff-check passed.

## 2026-11-07 18:46 EET — post-merge and remaining contribution checks

| Check | SHA / run | Result | Evidence / limitation |
|---|---|---|---|
| Site PR #92 post-merge | Site main `0ee96c8052c094a99daf3218abea7b77b3e6df95`; CI `42392731336` | PASS | Full Site CI passed, including lint, typecheck, full tests, tokens, build, bundle/single React, and boot-smoke. Exact-head CI runs `42392505186` and `42392528508` passed.
| Qoder Server activation/completeness/visual-zone/roles/integration candidates | Server main `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` | ALREADY_IN_MAIN by code/test presence | Current main contains activation, completeness, transport-zone, budget/truncation, role-source and auth integration test files. Do not duplicate stale PR stacks.
| Root Qoder release-validator PRs #19/#20/#21 | Root main `1e7d0ee74f11121a7d5a29c6379944a5360581c`; exact-head runs `42260243452`, `42265893827`, `42371962621` | BLOCKED | Required verify fails at private Admin/Partner materialization (HTTP 403). CodeQL and secret scans pass; branch protection remains in force.

## 2026-11-07 18:56 EET — map camera accessibility candidate

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Manual camera input interrupts programmatic animation | Site PR #93 head `9936891493228c1f797c3dcf516b4ce63fce9fdf`; focused tests cover genuine input vs programmatic events and manual/follow state | LOCAL_TESTED (5/5 suite) / CI_PENDING | Exact-head runs `42393945375`, `42393969285` in progress; merge only after pass and current-base check |
| Map camera honors `prefers-reduced-motion` | Same candidate; reduced-motion duration and normal-duration tests pass; targeted ESLint and TypeScript no-diagnostic completion | LOCAL_TESTED | Full build/browser visual acceptance not run locally because disk is below the 20 GiB gate; await exact-head CI |

## 2026-11-07 19:07 EET — Qoder/Antigravity short-screen and camera evidence

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Map camera yields to manual input and honors reduced motion | Site main `248595807552b0cdc0d09ca6221bad0c304bde68`; PR #93 exact-head runs `42393945375`/`42393969285` and post-merge run `42394233896` all passed; 5 local focused tests | VERIFIED_ON_SITE_MAIN | Does not prove physical device or full visual acceptance |
| Active navigation sheet coalesces pointer movement and honors reduced motion | Current Site main `routeSheet.ts`, `JourneyActiveNavigation.tsx`; `route-sheet.test.ts` covers frame writer and transition | ALREADY_IN_MAIN / TESTED | Qoder #46 broad token/CSS changes were not merged wholesale |
| Home 320×568 height/tile layout correction | Site PR #94 head `d34d89cdcee1184abc91b084a31c743c41e5ba25`; focused tests 7/7, ESLint/typecheck pass | LOCAL_TESTED / CI_PENDING | Exact-head CI runs `42394678784`, `42394703966` in progress; no fresh browser screenshot on current main |

## 2026-11-07 19:09 EET — Qoder #49 short-screen layout merge

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Fixed-tabbar measurement and square short-screen quick actions | Site PR #94 merge/main `59115680cf96ec6f359ec62130db20d3fa4df1af`; exact-head CI `42394678784`/`42394703966` passed; local 7/7 focused tests | INTEGRATED / CI_PASS | Post-merge CI `42394893033` in progress; current-main visual screenshot not yet recorded |

## 2026-11-07 19:11 EET — Qoder #49 post-merge gate

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Current Site main CI after Qoder short-screen layout merge | Exact Site main `59115680cf96ec6f359ec62130db20d3fa4df1af`; post-merge run `42394893033` successful, including full tests/build/boot smoke | PASS | Does not provide screenshot-based visual acceptance, provider-backed route acceptance, staging or cross-repo integration |

## 2026-11-07 — Qoder quick-action theme-token slice

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Home quick-action text, default surface and border follow canonical light/dark tokens | Site PR #95 head `1a865be8e2c5f2efcd2b3afc7acc5d91b3925296`; `tests/canonical-design.test.ts` 27/27; `git diff --check` passed | LOCAL_TESTED / CI_PENDING | Exact-head run `42395690147` was in progress; no full build or current-main visual screenshot yet |

## 2026-11-07 19:22 EET — Qoder #58 selective token slice merged

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Home quick-action text, default surface and border follow canonical light/dark tokens | Site PR #95 merged at `ca8c54498ec717807aba630d26e478795e2c32ca`; exact-head run `42395690147` passed; targeted design suite 27/27 | INTEGRATED / EXACT_HEAD_CI_PASS | Post-merge CI `42395920829` in progress; fresh visual screenshot not captured; this does not prove release readiness |

## 2026-11-07 19:23 EET — Qoder #58 Site main CI

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Site main post-merge CI after token-alignment slice | Run `42395920829` completed SUCCESS on `ca8c54498ec717807aba630d26e478795e2c32ca` | CI_PASS | No screenshot-based visual acceptance, live journey, cross-repo compatibility or staging evidence |

## 2026-11-07 19:24 EET — autocomplete runtime probe

| Requirement | Evidence | Status | Boundary / next step |
|---|---|---|---|
| Place autocomplete for a generic city query | `GET /api/v1/places/suggest?q=Lviv`: 503 `geocoder_unavailable` on loopback and owner HTTPS share; API `/healthz`, `/readyz`, `/api/v1/version` return 200 | BLOCKED | Active build is dirty development `local-20f64a8b7451-dirty-20261107T074421Z`, not staging/main. Configure an approved geocoder in a pinned test/staging target, then verify authenticated journey search. No runtime config was changed. |


## 2026-11-07 19:41 EET — search provider discovery regression

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Provider metadata is discovered for both selected journey endpoints | Site PR #96 main SHA `748bb5db93739b5be76bc2c46d461ab35b9ff404`; targeted `transport-preferences.test.ts` 18/18; post-merge CI `42397408778` passed lint, typecheck, full tests, token check, build, bundle checks and boot smoke | INTEGRATED / CI_PASS | Metadata discovery only. No current live route, fare, reservation, visual screenshot, staging or exact-six-SHA acceptance claim. |


## 2026-11-07 20:22 EET — Qoder diagnostics and iOS pin validation

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Search diagnostics label accurately describes the API count | Site PR #97 merged at `1b8838163aeb78d96915eec8c4a014960b0c6181`; focused `tests/results-diagnostics.test.ts` 8/8; exact-head checks and post-merge CI `42400528874` passed | INTEGRATED / CI_PASS | Does not validate live journey results or visual display on device. |
| iOS branch-build uses current verified Site/Server inputs | PR #18 head `1c44cbd72c526eb46166982c08153a45333d0da8`, base iOS `ad27b6f70b6255d1dd323bafcffafe4558232224`; Site pin `1b8838163aeb78d96915eec8c4a014960b0c6181`; Server pin `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` | PENDING CI | Simulator workflow run `42400902946` is in progress. No local Xcode build or physical iPhone acceptance claimed. |
| Current exact six-main observation | All six canonical `main` refs refreshed at 2026-11-07T18:22:52Z; see `observed_main_tuple_2026_11_07_2022_pre_ios18_eet` in the release manifest | OBSERVED ONLY | Compatibility remains `NOT_VERIFIED`; no unified build, staging, backup/restore or rollback evidence. |


## 2026-11-07 20:25 EET — six-main observation after iOS pin merge

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| iOS CI consumes current verified Site and Server SHAs | iOS PR #18 merged at `42265870291f34641e8519a347e1ebde5cdf7441`; exact-head simulator checks `42400884900` and `42400902946` passed | INTEGRATED / EXACT-HEAD CI PASS | Post-merge main workflow `42401155512` remains in progress. No physical device verified. |
| Six canonical main refs observed after iOS merge | Refreshed root, Server, Site, iOS, Admin, Partner refs recorded under `observed_main_tuple_2026_11_07_2025_post_ios18_eet` in manifest | OBSERVED ONLY | Not unified compatibility acceptance; production remains not ready/deployed. |
| Qoder/Antigravity selected changes retained | Qoder diagnostics PR #97 and Antigravity provider-coverage PR #96 merged; other matching mainline features identified as already present | INTEGRATED / CURRENT-MAIN COVERAGE | Synthetic geometry/motion excluded. Root materialization still blocked by private-repo Actions access. |


## 2026-11-07 20:28 EET — iOS main CI result

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| iOS main builds against refreshed Site/Server pins | iOS main `42265870291f34641e8519a347e1ebde5cdf7441`; post-merge workflow `42401155512` SUCCESS; exact Site checkout, Site production bundle, Capacitor sync, iOS Simulator compile passed | CI_PASS / SIMULATOR | Unsigned archive/upload skipped; no signing, physical device, staging or production evidence. |
| Six component main refs refreshed after iOS merge | `git ls-remote` confirmed all six refs; see `observed_main_tuple_2026_11_07_2028_post_ios18_ci_eet` | OBSERVED ONLY | Exact-SHA compatibility and release gates remain unverified. |


## 2026-11-07 21:18 EET — Site PR #98 acceptance

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Global city selector and honest MarshPass UI | Site PR #98 exact head `a2f547b5e69757b4186cc91bff60ff5cdc1999d6`; merged main `21030d2b53b9e3b939240320c0cc2509a14fec5b`; exact-head CI `42405118953`, `42405155708` PASS; post-merge CI `42405310665` PASS; local 524/524 tests, typecheck, ESLint, token check and production build passed | INTEGRATED / LOCAL_TESTED / MAIN CI PASS | Guest-only preview; authenticated visual acceptance, staging auth/API, exact-six-SHA compatibility, deployment and production remain unverified. |


## 2026-11-07 22:14 EET — Site navy monochrome candidate

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Navy monochrome Site design candidate | PR #99 head `c302f0ccca360c389057f0ebe1f4ac55a9f012ee`, base `21030d2b53b9e3b939240320c0cc2509a14fec5b`; local typecheck, lint, 528 tests, token/bundle/single-React checks, production build, and `git diff --check` passed | LOCAL_TESTED / PR_OPEN | Exact-head GitHub checks pending. |
| Guest entry visual and responsive smoke | 11 boot-smoke configurations at 320, 360, 375, 390, 414, 430, 768, and 1280 px; screenshots under `/private/tmp/marshgo-navy-visual/`; no clipped entry actions or horizontal overflow | GUEST_VISUAL_PASS | Authenticated search, route, map, ticket, and true in-app light-theme states remain NOT_TESTED. |
| Release status | PR #99 changes Site UI only | NOT_RELEASED | No staging, exact-six-SHA integration, backup/restore, rollback, or production deployment evidence. |


## 2026-11-07 22:18 EET — Site PR #99 merged

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Navy monochrome Site UI change on main | PR #99 merged normally; merge SHA `98b1227c0a378d43ef4661fd73622975f8eb93bc`; both exact-head `verify` runs passed | MAIN_MERGED / EXACT_HEAD_CI_PASS | Post-merge main CI `42410244020` is still in progress. |
| Six main refs after Site merge | Observation tuple `observed_main_tuple_2026_11_07_2017_post_site99_eet` in release manifest | OBSERVED_ONLY | Cross-repository exact-SHA compatibility remains NOT_VERIFIED; staging and production remain NOT_RELEASED. |

## 2026-11-07 22:31 EET — Site PR #100 sign-in contrast candidate

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Navy sign-in contrast in both theme preferences | Site candidate `9d432d570558214115b213f92166dc3c40d7103f`, based on main `98b1227c0a378d43ef4661fd73622975f8eb93bc`; local full suite 529/529, typecheck/lint/token/build/bundle/single-React passed; 11 boot-smoke configurations passed; light/dark login screenshots visually inspected | LOCAL_TESTED / VISUAL_PASS / PR_OPEN | GitHub exact-head checks `42411297616` and `42411324106` were still in progress/queued. No merge until green and base recheck. Authenticated search/map/ticket, staging, exact-six-SHA compatibility and release gates remain unverified. |
| Production state | No deployment or production target touched | NOT_RELEASED | Manifest gates unchanged; keep `production_ready=false`, `deployed=false`. |

## 2026-11-07 22:35 EET — Site PR #100 final result

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Navy sign-in contrast across light/dark preferences | PR #100 source head `9d432d570558214115b213f92166dc3c40d7103f` merged as Site main `4e6fc594b0fd68c8e059c531dd5b2cc51406344a`; exact-head checks `42411297616`/`42411324106` and post-merge CI `42411544859` PASS; local 529/529 tests and 11-case responsive boot-smoke PASS; both sign-in screenshots visually inspected | MAIN_MERGED / LOCAL_AND_CI_VERIFIED | This confirms a focused Site visual fix, not authenticated route/map/ticket acceptance or six-repository compatibility. |
| Six component refs after Site PR #100 | Exact refs recorded under `observed_main_tuple_2026_11_07_2034_post_site100_eet` in root release manifest | OBSERVED_ONLY | Cross-repository compatibility, staging, backup/restore, rollback and production gates remain unverified. |
| Production state | No staging or production target was changed | NOT_RELEASED | `production_ready=false`; `deployed=false`. |

## 2026-11-07 22:51 EET — Navy monochrome cross-repository checkpoint

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Canonical Site Navy theme and login preference contrast | Site PR #99 merged at 98b1227c0a378d43ef4661fd73622975f8eb93bc; PR #100 merged at 4e6fc594b0fd68c8e059c531dd5b2cc51406344a; Site post-merge run 42411544859 SUCCESS; 11 local guest-entry boot-smoke configurations and light/dark sign-in screenshots inspected | MAIN_MERGED / CI_PASS / GUEST_VISUAL_PASS | Authenticated route, map, ticket screens and actual light theme remain NOT_TESTED. |
| iOS uses the canonical Site SHA for branch builds | iOS PR #19 merged at 20f5fab6d33709844a0bbd97011bebf68542f549; exact-head runs 42412073077, 42412093935 PASS; post-merge run 42412458735 SUCCESS | MAIN_MERGED / SIMULATOR_CI_PASS | No physical iPhone install, GPS acceptance, signed release or App Store evidence. |
| Admin Navy theme | Candidate commit 0fa35c42f3a3f78de26b2a565d71acbbe428e341, PR #4; CSS brace balance and diff check pass; contrast calculations meet AA on measured pairs | PR_OPEN / CI_PENDING | No local build or browser screenshot due low available memory; run 42412957787 pending. |
| Partner Navy theme | Candidate commit 19c9aba7bca19bd1d0a8befe1936a9d744c1af30, PR #4; CSS brace balance and diff check pass; contrast calculations meet AA on measured pairs | PR_OPEN / CI_PENDING | No local build or browser screenshot due low available memory; run 42412957411 pending. |
| Production release | No deployment performed; release manifest remains production_ready=false | NOT_RELEASED | Exact-six-SHA compatibility, staging, restore, rollback, physical-device acceptance, and production gates remain outstanding. |

## 2026-11-07 22:57 EET — Navy monochrome main integration

| Requirement | Evidence | Status | Boundary |
|---|---|---|---|
| Admin Navy theme | PR #4 merged at d8afa64c4efda8ce4f10557a03651943effa52a7; exact-head Verify 42413284226 and post-merge Verify 42413380214 passed, including typecheck, lint, 11/11 tests and production build | MAIN_MERGED / CI_PASS | No portal screenshot/manual visual acceptance; no authenticated operational-flow acceptance. |
| Partner Navy theme | PR #4 merged at 4d605d4353af281dd295fabf0c7c2ac05efe222e; exact-head Verify 42413284534 and post-merge Verify 42413379658 passed, including typecheck, lint, 5/5 tests and production build | MAIN_MERGED / CI_PASS | No portal screenshot/manual visual acceptance; no tenant-isolation runtime retest in this theme task. |
| Six exact component refs observed | Root 1e7d0ee74f11121a7d5a29c6379944a5360581c4; Server 180e30b8d066a650e95ed1cdfdf6314ce6b42ad6; Site 4e6fc594b0fd68c8e059c531dd5b2cc51406344a; iOS 20f5fab6d33709844a0bbd97011bebf68542f549; Admin d8afa64c4efda8ce4f10557a03651943effa52a7; Partner 4d605d4353af281dd295fabf0c7c2ac05efe222e | OBSERVED_ONLY | Exact-SHA integration compatibility not verified; this does not establish a release candidate. |
| Production readiness | No staging/production operation was performed; manifest remains production_ready=false | NOT_RELEASED | Staging, exact-SHA acceptance, restore, rollback, physical-device acceptance, and deployment remain outstanding. |
| Map point selection during reverse-geocoder outage | Site PR #102 merged as `8ef18e89c22c8d84e5aa5c4c24de6a115ff751b4`; exact-head runs `42439764167` and `42439780108` passed; post-merge run `42439960771` passed. Selection tests 6/6 and deep-link tests 4/4 passed. | LOCAL_TESTED / CI_PASS | Coordinate entry only; live route search, route geometry, navigation, and staging remain unverified. |
| Geocoder provider adapter | Exact Server main `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` `suggestPlaces` with ephemeral Photon config returned 6 Lviv and 5 Stryi sample suggestions; one Photon `reverseGeocode` sample returned a matching Lviv label/coordinate. Approved zrok API still returned 503 `geocoder_unavailable` due public Nominatim configuration. | LIVE_VERIFIED_ADAPTER_SAMPLES / DEV_API_BLOCKED | Sample-only public Photon probe; no arbitrary address, configured app runtime, authenticated route→map, staging or production verification. Requires approved configured forward/reverse endpoint. |
| Exact six-main refs and per-component CI | `RELEASE_MANIFEST.json` observation `observed_main_tuple_2026_11_08_0300_post_site102_ci_recheck`: Server/Site/iOS Simulator/Admin/Partner runs passed on exact refs; root main had no run returned. | COMPONENT_CI_PASS / ROOT_CI_NOT_OBSERVED / CROSS_REPO_NOT_VERIFIED | Green component workflows do not prove exact-SHA compatibility, authenticated E2E, staging, physical iPhone, backup/restore, rollback, or production. |
| Physical iPhone acceptance | `xcrun devicectl list devices` reports iPhone 15 Pro Max connected. Current iOS/Site refs are `20f5fab6d33709844a0bbd97011bebf68542f549` / `8ef18e89c22c8d84e5aa5c4c24de6a115ff751b4`; no device build/install/launch. | DEVICE_CONNECTED / NOT_TESTED | Build deferred: disk 17 GiB and memory free 34%; approved host is a dev tunnel whose autocomplete is 503, not staging. Pin `SITE_REF` and use healthy approved staging before physical acceptance. |
| Production geocoder configuration guard | Server PR #112 merged as `f0326ca0d0bfec17bf138a3b479d758f53107a8f`; config tests 10/10 pass; exact-head runs `42441620667` / `42441648841` and post-merge run `42441962165` pass. | MAIN_MERGED / CI_PASS | Prevents known-invalid public demo config from appearing ready; does not configure a provider or prove live route results. |
| Visual search-route inspection | Existing IAB tab was present, but the Codex CUA bridge returned `browser.user is unavailable`; no browser action or screenshot was produced. | NOT_TESTED / TOOL_UNAVAILABLE | Do not claim visual acceptance; retry when supported browser control is available and resources allow. |
### Local preview API build identity — 2026-11-08 03:50 UTC

| Check | Evidence | Result | Boundary |
|---|---|---|---|
| Site preview | `http://127.0.0.1:4179/` → HTTP 200 | RESPONDS | Static UI only; not route acceptance |
| API health/readiness | API `127.0.0.1:3002` `/healthz` and `/readyz` → HTTP 200 | RESPONDS | Readiness does not establish compatible build identity |
| Running API identity | `/api/v1/version`: `20f64a8b745137f08808d0198ea554f8da8a3911`, dirty | OBSERVED | Local dev build |
| Canonical Server checkout | HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, dirty | OBSERVED | Not current GitHub main and contains preserved uncommitted work |
| Cross-check | `scripts/local-stack-status.sh` → expected-vs-actual mismatch, exit 1; focused Server diff shows walking router unchanged between active SHA and main | MISMATCH_DETECTED, NOT_CAUSAL_EVIDENCE | Proven build mismatch; prior saved-route evidence indicates absent persisted street geometry, not an established runtime divergence |
| Resource gate | 16 GiB disk; 31% memory free; swap 8,753.69 MiB after check | DEFER_HEAVY_WORK | No cleanup or process/service change |

This read-only diagnostic does not verify authenticated search, journey persistence, map rendering, staging, or production. Keep the current preview untouched until an exact-pinned isolated acceptance setup is safe.

### Missing walking-shape UI regression guard — 2026-11-08 03:57 UTC

| Check | Evidence | Result | Boundary |
|---|---|---|---|
| Saved journey record | Prior inspection of `1b21973f-013b-4eb0-abe6-719058b7c657`: 3 WALK legs with `straight-line-estimate`, no persisted street geometry | STORED_ESTIMATE_ONLY | Original router result is unknown; old records are not rerouted |
| Site model/UI | Dirty Site `eda449f008025b2126c92fd24cd68deb513ca3ad` tracks absent WALK shapes, displays an accessible notice, exposes existing replan action | LOCAL_TESTED | No fabricated line; not in Site main |
| Focused verification | `tsx --test tests/journey-route-map.test.ts`; scoped ESLint; scoped diff check | 16/16 PASS, 0 skipped; lint/diff PASS | No full typecheck/build or browser visual test |

Fresh search→persistence→map→navigation and visual acceptance remain NOT_TESTED. Changes are uncommitted in the original dirty Site worktree; release remains `NOT_RELEASED`.

| Local Site stale-transform recovery | Restarted only the project-owned Vite dev process at `127.0.0.1:4179`; normal module now contains the missing-walk-geometry notice and replan action; Site root and API readiness HTTP 200 | LOCAL_PREVIEW_REFRESHED | No production/staging proof; saved journey route now shows unavailable state and cannot verify map geometry. |
| Saved journey visual follow-up | Read-only AX inspection of `1b21973f-013b-4eb0-abe6-719058b7c657` lands on Trips with “journey no longer open”; UI lists fully booked/cancelled/departed as possible reasons, account future list empty | ROUTE_NOT_ACCESSIBLE / VISUAL_ROUTE_NOT_TESTED | Underlying state and creation-time pedestrian geometry cause remain unknown; no trip or booking was created. |
| Resource gate at 2026-11-08 04:11 UTC | Disk 16 GiB free; memory free 32%; swap used 9,296.12 MiB; Docker virtualization active | DEFER_HEAVY_LOCAL_WORK | Below >=20 GiB disk and >=35% memory thresholds; no safe cache deletion candidate, no cleanup performed. |

| Saved WALK route geometry cause | Server main behavior traced: missing routed geometry persists as labelled `straight-line-estimate` / `straight-line-distance`; OSRM endpoint/timeout/budget cause is not stored in the historical row | ROOT_BEHAVIOR_EXPLAINED / PROVIDER_CAUSE_UNKNOWN | Current preview API runs dirty SHA `20f64a8…`; fresh isolated route search still needed to verify endpoint and persisted provider outcome. |
| Docker/resource cleanup inventory | 5 active project services: PostgreSQL, Redis, Redis cache, two foot routers. Builder cache 286.1 MB / 0 B reclaimable; reclaimable images/volumes not treated as disposable. Disk 15 GiB, memory free 27%, swap 10,323.06 MiB. | INVENTORIED / NO_SAFE_CLEANUP | No containers, images, caches or volumes changed; heavy local work deferred. |

| Walking geometry / active preview API configuration | PID 22721, dirty API `20f64a8…`: singular `WALKING_ROUTING_URL` absent while plural `WALKING_ROUTING_URLS` present; old runtime guard ignores plural set. Server main `f0326ca…` uses plural-aware `walkingRoutingEnabled()` / `walkingEndpointFor()`. Historical route rows are estimate-only. | PREVIEW_CAUSE_CONFIRMED / MAIN_FIX_PRESENT | Existing API left running; no fresh exact-main API+DB+map route acceptance. Old journey creation-time attribution remains unknown. |

| Affected GitHub main refs | Read-only `git ls-remote`: Root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`, Server `f0326ca0d0bfec17bf138a3b479d758f53107a8f`, Site `8ef18e89c22c8d84e5aa5c4c24de6a115ff751b4` | CURRENT_REF_CONFIRMED | Matches recorded tuple; no runtime/candidate integration has been executed. |

| Exact-main walking router regression | Server SHA `f0326ca0d0bfec17bf138a3b479d758f53107a8`; `./node_modules/.bin/tsx --test tests/journey-walking-routes.test.ts` | PASS 19/19, 0 fail/skip | Unit evidence only; API + disposable DB + Site map route acceptance still not run. |
| Preview foot endpoint bbox config | Active API env parsed without values: two plural endpoint rules cover generic Lviv/Kyiv centers; singular URL unset | CONFIG_COVERAGE_CONFIRMED | Stale API guard ignores plural configuration; no process/config was modified. |
## 2026-11-08 04:44 UTC — local walking endpoint configuration and live build identity

| Check | Evidence | Status | Limitation |
|---|---|---|---|
| Isolated Server API Compose accepts bbox-selected walking endpoints | PR #113 merged as Server main `408d54b5531191885069e057b405cc50444eb268`; focused test 48/48; exact-head runs `42447198761`/`42447182224` and post-merge run `42447556073` passed, including API image build/smoke and Compose lifecycle | MAIN_MERGED / POST_MERGE_CI_PASS | No local fresh walking request or persisted-route/map verification yet. |
| Public API health and live build identity | `https://marshgo-dima.shares.zrok.io/healthz` and `/readyz` return 200; readiness reports database/realtime connected. `/api/v1/version` returns dirty commit `20f64a8b745137f08808d0198ea554f8da8a3911`, API v1 | LIVE_HEALTH_VERIFIED / BUILD_PIN_MISMATCH | This is not the verified Server main SHA; browser is at sign-in and no authenticated route was exercised. |
| Local preview/API identity | `scripts/local-stack-status.sh`: Site 4178 and API 3002 respond; DB/Redis respond; running API `20f64a8…` mismatches configured checkout `e9934ab…`; canonical Site process is absent | SERVICES_INCOMPLETE | No process restarted; user data/session remains untouched. |
| Real walking geometry through API → persisted journey → Site map | No new route request | NOT_TESTED | Needs exact-SHA isolated API with disposable data and adequate local resource headroom, then authenticated UI acceptance. |
| Cleanup/resource readiness | 16 GiB free disk, 33% free RAM, swap 8,952.69 MiB; `/Volumes/500` not mounted; 13 GiB CoreSimulator device data retained as potentially stateful | BELOW_GATE / NO_SAFE_CLEANUP | No simulator state, volumes, or uncertain caches were removed or moved. Production stays NOT_RELEASED. |

## 2026-11-08 04:51 UTC — Site route-map honesty candidate

| Check | Evidence | Status | Limitation |
|---|---|---|---|
| Missing WALK geometry is reported without drawing a fabricated line | Site PR #103 merged as `868a7d16d44369d8d73767e28359f4ea8d87195f`; 14/14 route-map tests; exact-head CI `42448458405`/`42448445084` and post-merge CI `42448622272` passed | MAIN_MERGED / POST_MERGE_CI_PASS | Browser visual acceptance and authenticated route integration not run. |
| Live API provenance | Public `/healthz` and `/readyz` HTTP 200; `/api/v1/version` reports dirty build SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, not Server main `408d54b5531191885069e057b405cc50444eb268` | LIVE_HEALTH_VERIFIED / PIN_MISMATCH | No authenticated route search or persisted geometry verified. |


## 2026-11-08 05:07 UTC — iOS branch cross-repository pins

| Check | Evidence | Status | Limitation |
|---|---|---|---|
| iOS branch CI uses current verified Site and Server revisions | PR [#20](https://github.com/dima1203oleg/MarshGO-iOS/pull/20), head `f92db48a3c0b4ea41ac3531339f331e617b87b1f`; Site `868a7d16d44369d8d73767e28359f4ea8d87195f`; Server `408d54b5531191885069e057b405cc50444eb268` | OPEN / EXACT-HEAD CI IN_PROGRESS (`42449340759`, `42449357127`) | Not merged; simulator compile incomplete at checkpoint. No physical-device build/install/launch. |
| Workflow syntax and patch hygiene | Ruby YAML parser accepted `.github/workflows/ios-ci.yml`; `git diff --check` passed | LOCAL_STATIC_PASS | Does not prove Xcode compile or runtime compatibility. |
| Local build resource gate | Disk 16 GiB free, memory free 31%, swap 8,786 MiB; Docker virtualization active | DEFERRED / BELOW_GATE | No local build/test started. No safe cache candidate: DerivedData ~34 MiB; shutdown CoreSimulator data ~13 GiB may contain user state; `/Volumes/500` absent. |
| Unified release / physical iPhone acceptance | No exact six-SHA candidate or device install evidence | NOT_TESTED | Public API build identity remains dirty and no authenticated live route acceptance. Production remains NOT_RELEASED. |


## 2026-11-08 05:10 UTC — iOS branch pins merged

| Check | Evidence | Status | Limitation |
|---|---|---|---|
| iOS CI pinned to current verified Site and Server mains | PR [#20](https://github.com/dima1203oleg/MarshGO-iOS/pull/20) merged as `0114f7b11d042bd0964fb3d2e3a90fc98d34fc83`; Site `868a7d16d44369d8d73767e28359f4ea8d87195f`; Server `408d54b5531191885069e057b405cc50444eb268`; exact-head runs `42449340759`/`42449357127` pass | MAIN_MERGED / EXACT-HEAD CI PASS | Post-merge CI `42449573385` still running at checkpoint. |
| Physical device availability and signing prerequisites | `devicectl` reports connected iPhone 15 Pro Max; Xcode 27.0; one valid signing identity; no installed provisioning profiles | DEVICE_CONNECTED / SIGNING_NOT_VERIFIED | No physical build/install/launch attempted. |
| Approved HTTPS API endpoint | `/healthz`, `/readyz`, `/api/v1/version` return 200; version reports dirty development SHA `20f64a8b745137f08808d0198ea554f8da8a3911` | LIVE_HEALTH_ONLY / NOT_STAGING | Does not match verified Server main; authenticated API and route behavior not tested. |
| Local build readiness | Disk 16 GiB, memory free 34%, swap 8,789 MiB; no safe cache cleanup; `/Volumes/500` absent | DEFERRED / BELOW_MEMORY_GATE | No local build/browser work run; CoreSimulator state preserved. |
| Release readiness | No exact six-SHA unified acceptance, physical-device acceptance, staging/restore/rollback evidence | NOT_RELEASED | These gates remain open. |


## 2026-11-08 05:14 UTC — six-main observation after iOS pin integration

| Check | Evidence | Status | Limitation |
|---|---|---|---|
| Six canonical GitHub main refs | Root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`, Server `408d54b5531191885069e057b405cc50444eb268`, Site `868a7d16d44369d8d73767e28359f4ea8d87195f`, iOS `0114f7b11d042bd0964fb3d2e3a90fc98d34fc83`, Admin `d8afa64c4efda8ce4f10557a03651943effa52a7`, Partner `4d605d4353af281dd295fabf0c7c2ac05efe222e`; recorded in manifest key `observed_main_tuple_2026_11_08_0510_post_ios20_ci_pass` | OBSERVED / NOT_RELEASE_CANDIDATE | Cross-repository compatibility NOT_VERIFIED; root has no observed Actions run. |
| iOS exact-main workflow | Post-merge run `42449573385` SUCCESS; exact-head PR runs `42449340759`/`42449357127` SUCCESS | IOS_SIMULATOR_CI_PASS | Simulator compilation only; unsigned Release archive skipped; no physical-device proof. |
| Device signing/install readiness | iPhone 15 Pro Max connected; one valid signing identity, no installed provisioning profiles | DEVICE_CONNECTED / SIGNING_UNVERIFIED | No build/install/launch attempted; Xcode automatic provisioning unproven. |
| API origin | Approved HTTPS host health/readiness/version return 200; version is development dirty SHA `20f64a8b745137f08808d0198ea554f8da8a3911` | LIVE_HEALTH_ONLY | Not matching Server main, not staging, no authenticated journey test. |
| Local build resources | Disk 16 GiB free; RAM free 31%; swap 8,783 MiB; five required containers active | DEFERRED / RESOURCE_GATE | No cleanup candidate or mounted backup volume; local Xcode/dependency install deferred. |
| Release and operations | No integrated exact-SHA E2E, staging, restore or rollback | NOT_RELEASED | Required acceptance evidence remains absent. |


## 2026-11-08 05:23 UTC — live runtime, preview, root CI and resource recheck

| Gate | Evidence | Status | Limitation |
|---|---|---|---|
| Local/public API identity | Local and public `/healthz`, `/readyz`, `/api/v1/version` return 200; build SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, dirty development | HEALTH_PASS / WRONG_RELEASE_IDENTITY | Not Server main `408d54…`; no authenticated route or DB persistence test. |
| Current browser preview source | Port 4181 maps to detached Site SHA `864e2383da8b0f1355e534381d2783017b7d1a51`; current Site main `868a7d…`. Other preview listeners 4178–4180. | STALE_PREVIEW | Visual bridge unavailable. Existing active clients/processes preserved; no restart. |
| Root exact materialization check | PR #22 run `42438575780` fails at `materialize-release` cloning private Admin, HTTP 403; Actions secret name exists but access denied | BLOCKED_EXTERNAL / REQUIRED CHECK FAIL | PR is based on checkpoint branch, not main. Fresh read-only Admin/Partner token required; no bypass. |
| Resource/caches | Disk 17 GiB free, RAM 33%, swap 8,651 MiB. Docker: builder 286.1 MB/0 reclaimable; 5 active services; image/volume/container reclaimable figures retained as non-cache data. DerivedData 34 MiB; CoreSimulator 13 GiB; external volume absent. | BELOW_MEMORY_GATE / NO_SAFE_CLEANUP | Heavy browser/build deferred; no deletion, pruning, or process stop. |
| Unified release | Six main SHAs are observed in manifest; no combined exact-SHA live flow | NOT_VERIFIED / NOT_RELEASED | Need fresh private-repo access, exact-main API+Site route→map acceptance, physical-device, staging and operations evidence. |


## 2026-11-08 05:43 UTC — exact-main Photon adapter and current runtime geocoder

| Check | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Server-main Photon adapter | Server `origin/main` `408d54b5531191885069e057b405cc50444eb268`; validation worktree tree SHA matches exactly. `node_modules/.bin/tsx --test tests/geocoding.test.ts`: 17/17 pass, 0 failed/skipped (Node v25.4.0). One call to `suggestPlaces("Lviv")` with ephemeral dev config returned 6 Ukraine-filtered suggestions, all with valid coordinates and OSM provider IDs. | PASS (focused adapter + one live public-demo probe) | Demo service only; not production rights/SLA. Public Photon docs state throttling/no availability guarantees.
| Current local/tunnel autocomplete | Both API origins: health/readiness 200; typed `Lviv` suggestions 503 `geocoder_unavailable`; version identifies dirty development Server `20f64a8b745137f08808d0198ea554f8da8a3911`, configured to unsupported public Nominatim autocomplete. | FAIL (runtime configuration) | Do not restart/repoint active preview. Configure an approved endpoint on controlled staging, then repeat authenticated search.
| Visual/authenticated route acceptance | CUA `getTab` failed with `browser.user is unavailable`; no visual or logged-in flow evidence gathered. | NOT_TESTED | Retry only with available browser bridge and exact-main candidate.


## 2026-11-08 05:46 UTC — current runtime provider catalog snapshot

| Check | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Provider catalog endpoint | Local API and owner zrok returned 21 category groups; only `carpool` (MARSHGO Community), `bus` and `tram` (Львівавтодор, Львів) had provider rows. Bus/tram are marked `available:true`. | PASS (read-only runtime diagnostic) | Dirty development Server `20f64a8…`; catalog availability does not prove route results, feed freshness, live vehicles, source rights, or booking. Route-to-map remains NOT_TESTED.
| Resource gate after catalog read | Disk 17 GiB; memory free 29%; swap 8,474.12 MiB. No project build/test/E2E/GTFS job active. | BELOW_MEMORY_GATE | No cleanup performed; defer heavy exact-main integration until the resource gate clears.


## 2026-11-08 05:53 UTC — Lviv realtime and static feed metadata

| Check | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Lviv GTFS-RT VehiclePositions | Exact Server-main tree; `testGtfsRealtimeConnection`: protobuf valid, header 7 s, 395 entities, 368 fresh (<90 s), 27 stale, no missing coordinates/timestamps, 0 TripUpdates/Alerts, 258 ms. | DEGRADED (one live probe) | Stale vehicles must remain stale; no delays/alerts implied. Not planner→API→UI proof.
| Lviv static GTFS reachability | HTTP HEAD: 200, `application/zip`, 3,568,789 bytes, Last-Modified `2026-11-02 08:06:59 GMT`. | PASS (metadata only) | Archive/calendar/route search not run in this checkpoint. Attribution declared CC BY 4.0 in catalog; confirm rights and attribution for release.
| Resource gate | Before/after sample 16→17 GiB free disk; RAM 28→30%; swap 9,542.12→8,453.50 MiB. Docker builder 286.1 MB/0 B reclaimable. | BELOW_MEMORY_GATE | No cleanup or heavy run; wait for ≥35% free RAM, then one bounded static GTFS route smoke.


## 2026-11-08 06:00 UTC — exact-main static Lviv timetable planner probe

- Ran the Server-main in-memory GTFS planner against the public Lviv static feed `https://track.ua-gis.com/gtfs/lviv/static.zip` for two generic city O/D samples, without API authentication or database writes. Validation worktree: `/private/tmp/marshgo-server-main-f0326ca-validation`, HEAD `3db97b5563d8f4049927aa90c360037dc54d8a17`; its source tree was confirmed equal to `origin/main` SHA `408d54b5531191885069e057b405cc50444eb268` before the probe. Parsed feed: 1,071 stops, 72 routes, 15,141 trips, 169 shapes, timezone `Europe/Kyiv`.
- Center → main-station sample: 10 candidates returned; `searchTruncated=true` and `resultLimitReached=true`. Top A52/A25 options have scheduled transit from Магнус (feed stop 13) to Скриня (stop 113), approximately 07:04–07:16 UTC in the queried service window. A52 shape has 37 points/~2.51 km; A25 has 38/~2.50 km. This establishes feed-backed schedule/shape output for the sample, not complete candidate enumeration or a best-route claim.
- North → Sykhiv sample: 10 candidates; likewise truncated and result-limit reached. Top A37 option connects Академія друкарства (stop 815) to Центр Довженка (stop 455), with planner-reported journey approximately 06:54–07:56 UTC.
- Evidence level: `LIVE_STATIC_FEED_FIXTURE_VERIFIED` for these two read-only planner samples. No fare was asserted; this probe did not verify live vehicle position, API/auth/DB persistence, walking legs, UI/map, navigation, booking, or staging. Truncation remains visible and blocks any claim of complete/optimal search.
- Resource gate: before the one-at-a-time feed parse, disk had 17 GiB free, memory free 38%, swap used ~8.6 GiB. At 05:56 UTC afterward: disk 17 GiB free, memory free 33%, swap used 8,447 MiB; long-running local Vite/API processes remained untouched, and no second heavy task was started. Docker images/volumes/build cache were not changed; no safe cache was deleted. Defer further heavy local work until memory is at least 35% free and disk at least 20 GiB. Production stays `NOT_RELEASED`.


## 2026-11-08 06:06 UTC — live foot-router integration and exact-main walking tests

- Confirmed the two already-running OSRM-compatible foot graphs from their published local ports, without changing containers: Lviv `127.0.0.1:3013/route/v1/foot/` and Kyiv `127.0.0.1:3014/route/v1/foot/`. Then called the exact Server-main `routePedestrianPath` adapter (validation worktree HEAD `3db97b5563d8f4049927aa90c360037dc54d8a17`; `HEAD` and `origin/main` both have tree `f3cdee185b3921fce1d8070446ef92ef075b0edd`, origin/main commit `408d54b5531191885069e057b405cc50444eb268`). It returned Lviv 2,379 m / 1,717 s / 119 WGS84 points and Kyiv 654 m / 471 s / 68 points, with endpoints matching requested coordinates. This verifies two sample router responses through the app's adapter; it does not verify a stored journey, transit walk join, API response, or rendered map.
- Active API process environment contains two bbox-routed foot graphs: Lviv `[23.9,49.75,24.2,49.95]` → port 3013 and Kyiv `[30.2,50.25,30.8,50.62]` → port 3014. `/readyz` was HTTP 200 (`ready`); generic autocomplete `/api/v1/places/suggest?q=Lviv` remained HTTP 503. Thus the foot-router host/config is present; the older saved journey's missing geometry is not explained by absent foot-router containers/config, and needs a fresh authenticated search to isolate route-specific causes.
- Exact-main focused suite: `node --import tsx --test tests/journey-walking-routes.test.ts` → **19 passed, 0 failed, 0 skipped**, duration 0.66 s. Covers measured geometry replacement, transfer feasibility, missing-provider truthful fallback, per-city endpoint selection, and bounded requests. The clean tracked tree was verified against origin/main; existing untracked `node_modules` in this worktree was preserved.
- Browser attempt used the existing in-app preview tab; UI bridge returned `browser.user is unavailable`, so no authenticated visual/API-to-map flow was performed. The API search endpoint is authenticated; no credentials or browser data were read.
- Resource after the focused check (06:05 UTC): 16 GiB disk free, 33% memory free, swap 8,673.62 MiB, CPU 31.25% user / 34.82% system / 33.92% idle. No build/E2E/GTFS job active. Existing 5 project containers and dev processes were retained; no cleanup or restarts. Heavy local work remains deferred (disk <20 GiB and RAM <35%); production remains `NOT_RELEASED`.


## 2026-11-08 06:10 UTC — current Site main reports partial-search limits

Read current Site `origin/main` SHA `868a7d16d44369d8d73767e28359f4ea8d87195f` from `/private/tmp/marshgo-site-main-acceptance` (detached, no local changes). The expected sibling checkout `/Users/dima1203/Desktop/MarshGO-Site` is absent; no new checkout or build was created. On that exact main, `src/views/JourneyResultsPanel.tsx` invokes `truncationNotices`, and `src/views/resultsDiagnostics.ts` has passenger-facing copy for candidate-generation and source-result caps plus diagnostic counts. This is code-path evidence that partial-search status is implemented, not visual/E2E acceptance. The existing preview on 4181 remains an older Site SHA and the browser bridge is unavailable, so no claim about rendered behavior. Resource status from 06:05 UTC remains yellow: 16 GiB free disk, 33% free RAM, 8,673.62 MiB swap; no cleanup, container/service change, or test/build in this checkpoint.


## 2026-11-08 06:17 UTC — Antigravity/Qoder Server branch comparison; static nationwide fallback rejected for release

- Preserved and inspected canonical Server dirty checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`: branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, remote main `408d54b5531191885069e057b405cc50444eb268`, merge-base `fcdf9d8bca2206f30a5e95b578165b0dc0be89c7`, **91 commits behind / 4 ahead**. Its four unique commits add ~7,070 lines across 14 files; working-tree edits/untracked provenance/policy/tests also remain untouched. No cherry-pick/merge/delete.
- Decision by component: (a) static catalog claim “all 12 modes in all 26 regions” is **REJECTED for production availability**: its test verifies enum/shape presence, not source freshness, legal coverage, route, or booking; e.g. metro is asserted present nationwide. (b) 72-corridor `UkraineTransitGraph`/`multimodalChainEngine` is **REJECTED for provider-backed journey results** pending authoritative schedules/shape/fare/availability and route oracle; station/time/fare tables are embedded and generated pedestrian grid paths are not street geometry. (c) old foot-route implementation is **SUPERSEDED** by current main's bbox-selected OSRM foot graphs, bounded routing budget, and source/mode provenance; exact current-main tree already passed `journey-walking-routes.test.ts` 19/19 and live adapter samples for two cities. (d) branch's coordinate-only `sourceRouteGeometry` helper is **SUPERSEDED** by main's stricter `trustedRouteGeometry`, which checks mode/source provenance and sanitizes persisted legs. (e) Photon adapter contribution is **ALREADY_IN_MAIN/SUPERSEDED** by current main Photon support plus production-demo guard; public Photon remains sample-only. Keep the branch and its dirty data as a future provider-discovery reference, not release code. Short decision record appended to `docs/PR_DEPENDENCY_DAG.md`.
- `scripts/local-stack-status.sh` was run read-only: Site preview 4178, API health/readiness 3002, Postgres 5434, Redis 6380/6381, and Docker respond; `SERVICES_INCOMPLETE` because expected local Server checkout is dirty e993 while running API is dirty SHA `20f64a8b745137f08808d0198ea554f8da8a3911`. The running API reports build ID `local-20f64a8b7451-dirty-20261107T074421Z`; its `/readyz` is 200, but generic address suggestion is 503. `start-local-api.sh --check` passes for the e993 checkout; no runtime restart attempted.
- Resource checkpoint 06:16 UTC: 17 GiB disk free, 33% free RAM, swap 8,510.94 MiB, CPU 26.82% user / 30.24% system / 42.92% idle. Existing Docker cache review shows no safely reclaimable builder cache; images/volumes are preserved. No cleanup or heavy build/test was performed. Keep services and all dirty branch work intact; production stays `NOT_RELEASED`.

## 2026-11-08 07:31 UTC — Site #104 post-merge and live endpoint recheck

| Check | Exact evidence | Result | Release effect |
|---|---|---|---|
| Site PR #104 exact head | `b11b178bb94991f06ce0769e8d84f1add8f3b3ac`; CI `42458453322` | PASS | Filter-preserving retry fix integrated at Site main `484980e1b50e0029973f8180a3bac377e7268f34` |
| Site post-merge main | CI run `42458620427`, verify job | PASS | Confirms main build/test/boot workflow; does not prove API live journey acceptance |
| Public API readiness | `https://marshgo-dima.shares.zrok.io/readyz` | HTTP 200; DB/realtime connected | Development tunnel only, not staging evidence |
| Public API identity | `/api/v1/version` | Dirty development Server SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, build `local-20f64a8b7451-dirty-20261107T074421Z` | Not an exact main release artifact |
| Place autocomplete | `/api/v1/places/suggest?q=Lviv` | HTTP 503 `geocoder_unavailable`; public Nominatim cannot provide autocomplete | Blocks live route acceptance pending approved/self-hosted geocoder |
| Exact six-SHA compatibility | observed main tuple in release manifest | NOT VERIFIED | `production_ready=false`, `deployed=false` |

Resource checkpoint 07:31 UTC: 21 GiB disk free, RAM free 36%, swap 9,028.50 MiB; virtualization VM active. No heavy local work or cleanup performed; no safe cache candidate identified in the earlier inventory.

## 2026-11-08 07:34 UTC — Server #112 final integration evidence

| Check | Evidence | Result | Meaning |
|---|---|---|---|
| Server PR #112 | [PR #112](https://github.com/dima1203oleg/MarshGO-Server/pull/112); head `10afa683a8f0542fbbc8ff80c8905e661cc79a96`; squash merge `f0326ca0d0bfec17bf138a3b479d758f53107a8f` | MERGED | Production config now fails closed for known public demo geocoder endpoints; no provider was provisioned |
| PR exact-head CI | Runs `42441620667`, `42441648841` | PASS | Exact proposed code checks succeeded |
| Post-merge/current main CI | Run `42441962165` on merge SHA; run `42447556073` on current main `408d54b5531191885069e057b405cc50444eb268` | PASS | Server main checks green; GitHub compare confirms merge SHA is ancestor of current main |
| Site #104 | PR-head `42458453322`, post-merge verify `42458620427`; main `484980e1b50e0029973f8180a3bac377e7268f34` | PASS | Search filter preservation integrated; live journey outcome still unverified |
| Release tuple | Root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; Server `408d54b5531191885069e057b405cc50444eb268`; Site `484980e1b50e0029973f8180a3bac377e7268f34`; iOS `0114f7b11d042bd0964fb3d2e3a90fc98d34fc83`; Admin `d8afa64c4efda8ce4f10557a03651943effa52a7`; Partner `4d605d4353af281dd295fabf0c7c2ac05efe222e` | OBSERVED ONLY | Cross-component compatibility not verified; production/deployed remain false |

Resources at 07:34 UTC: 21 GiB disk free, memory free 32%, swap 9,188.25 MiB; virtualization VM ~165% CPU. No local heavy task or cleanup started.

## 2026-11-08 07:50 UTC — iOS exact Site pin and physical-device discovery

| Check | Evidence | Result | Acceptance boundary |
|---|---|---|---|
| iOS PR #21 | [PR #21](https://github.com/dima1203oleg/MarshGO-iOS/pull/21), head `14e317eadbfdcc0754168e700c96d259a3dedf4f`, merged `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff` | MERGED | Updates branch CI Site pin to `484980e1b50e0029973f8180a3bac377e7268f34`; Server metadata pin stays `408d54b5531191885069e057b405cc50444eb268` |
| iOS exact-head simulator CI | Runs `42460162197`, `42460189051` | PASS | Simulator compile only; no physical install claim |
| iOS post-merge CI | Run `42460385464` on merge SHA | IN_PROGRESS at 07:50 UTC | Await completion before claiming merged CI validation |
| Device connection | iPhone 15 Pro Max, iOS 27.0; CoreDevice `localNetwork`, paired, booted, Developer Mode enabled | DEVICE_READY_FOR_BUILD | One signing identity found; provisioning/team still requires build validation |
| Existing app | `ua.marshgo.app`, version 1.0, build 1 | INSTALLED | Replacement was previously authorized; no replacement/install performed here |
| Physical acceptance | No build, install, launch or feature interactions this checkpoint | NOT_TESTED | Do not equate paired device or simulator CI with acceptance |

Resource gate 07:49 UTC: disk 21 GiB free, RAM free 33%, swap used 9,080.81 MiB. Docker service containers each under 1% CPU and ≤64 MiB RSS in the point sample; kept active for local API/routing. Heavy local iOS build deferred.

## 2026-11-08 07:53 UTC — iOS PR #21 post-merge verification

| Check | Exact evidence | Result | Limit |
|---|---|---|---|
| iOS PR-head simulator build | Runs `42460162197`, `42460189051` on PR head `14e317eadbfdcc0754168e700c96d259a3dedf4f` | PASS | Simulator compilation, not physical install |
| iOS post-merge main CI | Run `42460385464` on current iOS main `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff` | PASS | Exact Site pin `484980e1b50e0029973f8180a3bac377e7268f34`; Server metadata SHA `408d54b5531191885069e057b405cc50444eb268` |
| Physical device | iPhone 15 Pro Max, paired over local network, Developer Mode on, old app v1.0(1) present | DEVICE_PAIRED / BUILD_NOT_RUN | No install/launch/feature verification of current candidate |
| Release acceptance | Exact-six-SHA integration, staging, device routes, backup/restore, rollback | NOT_VERIFIED | `production_ready=false`, `deployed=false` |

Resource at 07:53 UTC: disk 21 GiB free, memory free 30%, swap used 9,108.75 MiB; local Xcode build deferred.


| Search custom budget edit/apply/cancel | Site PR #105 (`ce99f79` on base `484980e`): preserves the prior applied bound until Apply, Cancel retains it, custom amount remains visible/selectable; incomplete/changed draft is blocked from search. Focused test: `tests/journey-search-bounds.test.ts`, 13 pass / 0 fail / 0 skipped; diff check passes. | LOCAL_TESTED (domain/control logic); exact-head Site CI PASS; post-merge CI run `42462237825` PASS; visual/browser NOT_TESTED | Merge only after required CI and current-base recheck; then run visual/mobile acceptance when resources permit. |


| iOS branch bundle Site pin after Site #105 | iOS PR #22 merged at `309cf66`; pins Site `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7`, Server metadata `408d54b5531191885069e057b405cc50444eb268`. Exact-head simulator runs `42462472738` and `42462489767` pass; post-merge run `42462745572` pending. | PR CI VERIFIED; post-merge CI IN_PROGRESS; physical device NOT_TESTED | Wait for post-merge CI, then build/install/launch exact main tuple on paired iPhone when resource gate is green. |

## Checkpoint — 2026-11-08 08:27 UTC — iOS post-merge CI passed; local build deferred

- iOS PR #22 is merged at `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f`. Exact-head simulator checks `42462472738` and `42462489767`, plus post-merge main CI `42462745572`, passed; the post-merge run tested that exact iOS SHA. Site remains `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7`; Server metadata pin remains `408d54b5531191885069e057b405cc50444eb268`.
- Resource sample: `/` has 33 GiB free; memory free 29%; swap used 9,079 MiB; Docker build process active, `xcodebuild` absent. No heavy local task started or process stopped. Defer npm install/Xcode/browser/E2E until memory is at least 35% and competing heavy work is idle.
- Device remains paired, but no local physical-device build, install, or launch has been attempted. Provisioning profile availability remains unverified.
- Security: a provider API credential was inadvertently included in process-diagnostic output. Its value is not recorded here; treat it as exposed and rotate it at the provider.
- Release status remains `NOT_RELEASED`: root/Admin/Partner exact-main CI, exact six-SHA integration, route E2E, staging, backup/restore, rollback, and physical-device acceptance are not established.

## Checkpoint — 2026-11-08 08:30 UTC — exact main refs and component CI rechecked

- Current GitHub main SHAs and workflow evidence: Root `1e7d0ee74f11121a7d5a29c6379944a5360581c4` — no run returned for `main` in the latest 30 runs; Server `408d54b5531191885069e057b405cc50444eb268` — `42447556073` SUCCESS; Site `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7` — `42462237825` SUCCESS; iOS `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f` — `42462745572` SUCCESS; Admin `d8afa64c4efda8ce4f10557a03651943effa52a7` — `42413380214` SUCCESS; Partner `4d605d4353af281dd295fabf0c7c2ac05efe222e` — `42413379658` SUCCESS. Each successful run's `headSha` matches the listed current `main` SHA.
- This is component-level CI evidence only. Root has no listed main run; a unified exact-six-SHA application flow is still unverified. No staging, physical install, backup/restore, or rollback evidence.
- Resource gate still defers local heavy work: disk 33 GiB free; memory free 34%; swap 9,232.94 MiB; Docker build process remains active; no `xcodebuild`. No build/test/browser task started and no process stopped.
- Production remains `NOT_RELEASED`; next safe action is read-only inspection of root release workflow and local runtime identities, then resume one local task only when memory reaches 35% and Docker build is no longer active.

## Runtime and geocoder evidence — 2026-11-08 08:37 UTC

- Local Web preview on 4181 is worktree `codex/search-budget-controls-20261108`, SHA `b11b178bb94991f06ce0769e8d84f1add8f3b3ac`; local API on 3002 is detached Server SHA `20f64a8b745137f08808d0198ea554f8da8a3911`, build ID `local-20f64a8b7451-dirty-20261107T074421Z`, environment `development`, source state `dirty`. Both differ from current Site and Server main SHAs, so this is not a release candidate. The active Server worktree has untracked `node_modules`; no tracked diff was reported.
- `http://127.0.0.1:4181/` and the user-provided HTTPS tunnel return HTTP 200. Tunnel `/readyz` says database and realtime are connected; `/api/v1/journeys/me` returns 401 without a session, as expected. This is service smoke only.
- `GET /api/v1/places/suggest?q=Львів` returns HTTP 503 with `geocoder_unavailable` locally and through the tunnel. Server code explicitly rejects public Nominatim for autocomplete. A single generic Photon city query with the Server's UA country/bbox parameters returned HTTP 200 and six candidates, but it was a direct provider sample, not app integration or route acceptance.
- Photon maintainers describe the public endpoint as a demo: reasonable request counts only, extensive use can be throttled/banned, no availability guarantees; for larger use they recommend a private instance. The README lists about 95 GB for a planet data set and 64 GB RAM recommended, so self-hosting the full data on this 8 GB Mac is not viable. Production needs an approved reliable geocoder endpoint or suitable hosted service; do not route production traffic to the public demo. Source: https://github.com/komoot/photon (checked 2026-11-08).
- Root GitHub `main` contains a legacy `react-example` Vite UI and no `.github/workflows` directory; its `package.json` has only `dev/build/preview/clean/lint`. Current local branch has CI workflow files, but these are not on `main`. No Root main workflow run was returned. This remains an integration gap; the active product UI remains Site.
- Resource sample: 33 GiB disk free, 29% memory free, swap 9,114 MiB, Docker build process active, no `xcodebuild`. No local heavy job was started or stopped.

## Checkpoint — 2026-11-08 08:48 UTC — exact Server main typecheck and focused route tests pass

- Server candidate: clean detached worktree `/private/tmp/marshgo-server-exact-main-20261108`, SHA `408d54b5531191885069e057b405cc50444eb268`; Node `24.21.0`, npm `11.19.0`. `npm ci --no-audit --no-fund` added 467 packages. npm warned that 4 dependency lifecycle scripts are not allowlisted; none were manually approved.
- Safety correction: the initial install guard observed 33% memory but the shell did not stop because it lacked fail-fast; `npm ci` nevertheless completed in about 2 seconds. No other build/test ran concurrently; primary worktrees were untouched. All later checks used `set -euo pipefail`.
- `npm run typecheck`: PASS, no diagnostics. Focused command `./node_modules/.bin/tsx --test tests/geocoding.test.ts tests/journey-planner-oracle.test.ts tests/journey-search-completeness.test.ts tests/journey-walking-routes.test.ts`: PASS, 44 tests, 0 failed, 0 skipped, 0 cancelled, 0 todo, 728 ms. Coverage includes Photon adapter parsing/config guard, public Nominatim autocomplete rejection, independent strategy oracle, three-leg composition, unknown-fare ordering, walking geometry/budgets. These are local deterministic tests, not live-route acceptance.
- Test output notes a 73-candidate Lviv regression pool with a 32-request walking budget leaving some walking legs estimated; those legs must remain visibly labeled as estimates until routed geometry is confirmed.
- Post-check resources at 08:48:36 UTC: disk 32 GiB free, memory free 42%, swap used 9,495.31 MiB; no Xcode build; Docker daemon process is idle (0% CPU). No cleanup or process stop.
- Next: install exact Site main dependencies in its isolated nested worktree only if the resource preflight remains green, then build/serve one pinned local web bundle for route acceptance.

## Checkpoint — 2026-11-08 08:52 UTC — dense three-leg fare-retention regression passes slowly

- On exact Server main `408d54b5531191885069e057b405cc50444eb268`, targeted synthetic GTFS test `keeps the cheapest three-leg option after a dense two-leg candidate pool fills` passed: 1 passed, 0 failed, 0 skipped; duration 30.84 s. It verifies that a low-fare three-leg itinerary survives 13,000 competing two-leg options. This is a synthetic fixture regression, not the previously missed live Lviv itinerary.
- The 13,000-candidate test is slow enough to warrant a separate measured performance follow-up. Do not claim a live p95 or route-latency regression from this unit-test duration. Main code was not modified.
- Resource sample at 08:51:49–08:52:12 UTC: 32 GiB disk free; memory free 33%; swap used 9,343 MiB. The test process ended successfully. Defer all further heavy work (including Site build) until memory free is at least 35%. No process stopped and no cleanup performed.
- Next: build exact Site main and start a separate preview only after the gate clears; keep the local server geocoder blocker and the live three-leg acceptance visibly open.

## 2026-11-08 09:12 UTC — Server PR #114 merged; main CI pending

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Dense GTFS candidate search retains the cheapest feasible 3-leg route while disclosing truncation | Exact-base Server CI `42447556073` / SHA `408d54b5531191885069e057b405cc50444eb268`: 60,050.208 ms. Exact-head PR CI `42465692606` / SHA `cf6a2179b1d9349cf3b4d17aa86bdfe1ad951ad7`: 1,655.516 ms; full CI passes. PR #114 merged at `f13a061eb332a15a551d7d352cf1027370b1bf70`. | MAIN_MERGED / EXACT_HEAD_CI_PASS / FIXTURE_VERIFIED | Separate hosted runners; indicative synthetic fixture timing only, not a controlled same-machine benchmark, live route, or API p95. Post-merge main CI `42466059564` is IN_PROGRESS. Local post-patch test deferred below RAM threshold. |
| Current exact GitHub main refs | Root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; Server `f13a061eb332a15a551d7d352cf1027370b1bf70`; Site `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7`; iOS `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f`; Admin `d8afa64c4efda8ce4f10557a03651943effa52a7`; Partner `4d605d4353af281dd295fabf0c7c2ac05efe222e`. Queried 2026-11-08 09:10 UTC. | OBSERVED_ONLY | Not one integrated six-repo release. Route → real provider → map/navigation, staging, backup/restore, rollback and unified app-flow acceptance remain open; production remains `NOT_RELEASED`. |

## 2026-11-08 09:14 UTC — Server PR #114 post-merge acceptance

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Server main exact-head and post-merge CI | PR #114 head `cf6a2179b1d9349cf3b4d17aa86bdfe1ad951ad7`: runs `42465692606` and `42465714046` PASS. Merge `f13a061eb332a15a551d7d352cf1027370b1bf70`; post-merge run `42466059564` PASS at 09:13:57Z, including audit, lint, typecheck, unit, migrations, integration, image smoke and Compose lifecycle. | MAIN_MERGED / MAIN_CI_PASS | Confirms Server repository state only. No live provider route, unified six-repo flow, staging, restore or rollback proof. Production remains `NOT_RELEASED`. |

## 2026-11-08 09:48 UTC — geocoder and multimodal search acceptance status

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site geocoder-outage coordinate fallback | Site PR #107 merged at `0b825b160981eacd6ffa09cd52bea312294c2123`; exact-head checks `42468100754`/`42468111971` and post-merge Site CI `42468339888` passed. | SITE_CI_PASS / CODE_IN_MAIN | Active preview on 4181 is older SHA `b11b178...`; no visual acceptance of current main yet. |
| Typed origin/destination autocomplete | Active development API `local-20f64a8b7451-dirty-20261107T074421Z` returns 503 `geocoder_unavailable` for `/api/v1/places/suggest?q=Львів`; `/readyz` is only DB/realtime readiness. | BLOCKED_RUNTIME_CONFIG | Configure a permitted, reliable HTTPS geocoder, then verify typed search end-to-end on a pinned Site+Server candidate. |
| Availability and composition of transport categories | Active development API registry: Lviv carpool/bus/tram; Kyiv carpool. Current main graph has scheduled transit, bounded carpool+transit, and bike/scooter+metro composition. No evidence for every category or arbitrary cross-category chaining. | PARTIAL / NOT_LIVE_VERIFIED | Keep unsupported types disabled until lawful feeds, current availability, geometry and provider contracts are verified. |
| Local unified Site+Server browser flow | Existing Site preview and Server process are stale/different builds; RAM free 33%, disk free 32 GiB, swap ~9.1 GiB at checkpoint. | NOT_TESTED | Preserve active processes; defer local browser/build until resource gates permit and use an isolated pinned candidate. |
| Lviv public transit upstream availability and reuse terms | Canonical Server catalog entry; official [data.gov.ua Lviv GTFS dataset](https://data.gov.ua/dataset/lviv-public-transport-gtfs-real-time) permits commercial reuse with attribution. Read-only HTTP HEAD at 09:50:49Z: static GTFS 200 (3,568,789 bytes, last-modified 2026-11-02); vehicle positions 200 (44,160 bytes, last-modified 2026-11-08 09:50:39Z). | SOURCE_RIGHTS_CONFIRMED / ENDPOINT_REACHABLE / NOT_IMPORTED | HEAD alone does not verify payload, service dates, feed parse, vehicle identity, route feasibility, or app consumption. Next run a single-feed isolated acceptance import and end-to-end schedule route. |
| Bounded Lviv schedule-feed acceptance tool | Server PR #115 merged as `2cf2912a7ea3a0c7c5409980f6d42b1e7fd07f40`; exact-head checks `42469559132` and `42469594450` and post-merge run `42469925119` passed. New `npm run acceptance:lviv-route-feed` only queries the Lviv static timetable and vehicle positions; it asserts a non-truncated route. | IMPLEMENTED / CI_VERIFIED / LIVE_ROUTE_NOT_RUN | CI validates the script but does not run its live feed probe. A current provider route and browser result remain unverified. |
| Server post-merge acceptance for PR #115 | Run `42469925119` completed SUCCESS at 10:09:11Z on main SHA `2cf2912a7ea3a0c7c5409980f6d42b1e7fd07f40`, including audit, lint, typecheck, unit/integration, migrations, API image and Compose lifecycle. | SERVER_MAIN_CI_PASS | Does not run the live Lviv route command or prove provider-to-UI behavior. |
| Manual live-feed acceptance workflow | Server PR #116 merged at `25de48aa358040447014c7cd2b5216228142d15b`; YAML validation `42470415799` and Server CI checks passed. Manual workflow-dispatch `42470746698` targets that exact main SHA. | WORKFLOW_MERGED / LIVE_PROBE_IN_PROGRESS | Await run and inspect JSON artifact. Route result is not established until the live job completes successfully with non-truncated route evidence. |

## 2026-11-08 10:21 UTC — search diagnosis and live Lviv route evidence

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Typed “Звідки/Куди” suggestions on active local stack | Site 4181 serves stale SHA `b11b178bb94991f06ce0769e8d84f1add8f3b3ac`; API 3002 is dirty build `local-20f64a8b745137f08808d0198ea554f8da8a3911`. Read-only `/readyz` = HTTP 200; `/api/v1/places/suggest?q=Lviv` = HTTP 503 `geocoder_unavailable`, with runtime rejecting public Nominatim autocomplete. | FAIL / RUNTIME_CONFIG_BLOCKED | Configure a permitted HTTPS Photon-compatible or other geocoder in a separately pinned candidate; preserve the active user processes. |
| Lviv schedule route feasibility | Manual Server workflow `42470746698`, exact SHA `25de48aa358040447014c7cd2b5216228142d15b`: feed parsed 1,071 stops, 72 routes, 15,141 trips; both corridors returned routes; north→Sykhiv included bus→tram. | LIVE_ROUTE_FOUND / ACCEPTANCE_FAIL | Both cases had `searchTruncated=true` and `resultLimitReached=true`; feed proves at least one scheduled transfer, not complete/best search. Diagnose limits while keeping truncation assertions. Artifact: `/private/tmp/marshgo-live-feed-artifact-42470746698/lviv-live-transit-25de48aa358040447014c7cd2b5216228142d15b/lviv-route-acceptance.json`. |
| Lviv vehicle positions | Same artifact: GTFS-RT age 7 seconds; 424 entities, 391 fresh coordinates and 33 stale; protobuf and feed timestamp valid. | DEGRADED / LIVE_FEED_PARSED | Do not label every position live/fresh; preserve stale counts and verify vehicle↔trip identity before displaying movement. |
| All 12-category composition | Selector filters connected providers. Server composes GTFS schedule modes, bounded carpool→transit and compatible bike/scooter+metro. Lviv live case verified bus→tram only. | PARTIAL / NOT_ALL_MODES_COMPOSABLE | General route adapters/data for taxi, carsharing and transfer are not verified. Add integrations only with permitted provider data, current availability, geometry and contract tests. Selecting all categories does not mean each itinerary contains every mode. |
| Current Server main CI | Post-merge run `42470728566` completed SUCCESS on exact Server main `25de48aa358040447014c7cd2b5216228142d15b`. | SERVER_MAIN_CI_PASS | Component CI does not resolve the local geocoder outage or failed live-search completeness gate. |

## 2026-11-08 10:24 UTC — bounded diagnostic follow-up

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Identify internal reason for live Lviv searchTruncated=true | Server PR #117, head 7be9d3e7162bda3cd04bf596d5d79b06a7051ec2, adds existing search.truncation flags to manual acceptance JSON. git diff --check passed. Exact-head checks 42471789783 and 42471809017 are pending. | IMPLEMENTED_ON_BRANCH / CI_PENDING | Do not merge until exact-head CI passes. Then re-run manual Lviv acceptance on merged SHA and use reason flags to target a routing correction. |

## Checkpoint — 2026-11-08 10:46 UTC — geocoder outage and live truncation reasons confirmed

- Merged Server PR #117 normally at `ade74b02ade5613be0a482d75abc96df2eb23967`; exact-head checks `42471789783` and `42471809017` passed, and post-merge Server CI `42472512763` passed on the merge SHA. The PR only exposes existing truncation flags in the read-only acceptance report.
- Read-only Lviv feed acceptance `42472529528` on that exact SHA failed its completeness assertion: both test cases found routes but were truncated by `stopSelection`, `candidateGraph`, `searchBudget`, `candidatePoolLimit`, `candidateSampling`, and `responsePage`; `searchStepLimit=false`. Do not relax assertions; fix the limiting stage and rerun.
- Active UI/API are a mismatched older local pair: Site preview `b11b178bb94991f06ce0769e8d84f1add8f3b3ac`; API build `local-20f64a8b7451-dirty-20261107T074421Z`, commit `20f64a8b745137f08808d0198ea554f8da8a3911`. Current observed GitHub main tuple is separately recorded in RELEASE_MANIFEST.json; it is not an integrated candidate.
- Typed Lviv autocomplete on active API returns HTTP 503 `geocoder_unavailable`: server source rejects public Nominatim for autocomplete; use an approved Photon-compatible HTTPS endpoint. `/readyz` checks DB/realtime only. Direct Photon sample success is not production readiness.
- “0/12” means no category had complete UI→API→provider→route geometry/booking verification on one exact release tuple; it does not mean geometry code/routes are absent. Existing `generatePedestrianGeometry()` is an explicitly synthetic grid estimate; real street paths require configured OSRM-compatible foot routing. Latest live probe does not emit route geometry.
- Resource check near this checkpoint: 31 GiB disk free, memory 33% free, swap ~10.2 GiB. No local heavy operation or process restart. Preserve all dirty canonical worktrees. Production remains `NOT_RELEASED`.

## Checkpoint — 2026-11-08 11:13 UTC — current Server route performance and live search status

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Dense 3-leg candidate retention performance | Server main before fare-route index `408d54b5531191885069e057b405cc50444eb268`, CI `42447556073`: exact test took 60,050 ms. Post-change current Server main `0b0aac1f1dd4e2f6cc8b59411380b09042f99043`, CI `42473981780`: same test took 1,493 ms and passed. | FIXTURE_VERIFIED / PERFORMANCE_TEST_IMPROVED | ~40x CI test-time reduction; this does not establish live route latency or completeness. |
| Lviv scheduled route availability | Live run `42473995628` on Server SHA `0b0aac1f1dd4e2f6cc8b59411380b09042f99043`; two corridors returned routes from 1,071 stops / 72 routes / 15,141 trips. | LIVE_VERIFIED / PARTIAL | Feed/run proves some scheduled routes exist; both cases were truncated and 0 three-leg candidates appeared in the tested time window. |
| Search completeness / truncation | Same artifact: `stopSelection`, `candidateGraph`, `searchBudget`, `candidatePoolLimit`, `candidateSampling`, and `responsePage` set; `searchStepLimit` false. Acceptance workflow failed. | FAILED / BLOCKING | Fix limiting stages and compare exact same inputs; do not relax assertions or claim complete search. |
| Typed place autocomplete | Active API `127.0.0.1:3002`, `GET /api/v1/places/suggest?q=Львів` → HTTP 503 `geocoder_unavailable`; public Nominatim config is explicitly rejected. Port 3000 has no listener. | FAILED / BLOCKING | No approved reliable production geocoder endpoint is configured. Site GPS-origin fallback does not repair typed autocomplete. |
| 12 transport categories and geometry | No new one-tuple UI→API→provider→geometry acceptance; current Lviv live evidence is GTFS scheduled transit only, and the latest live artifact has no geometry output. | NOT_VERIFIED | Continue per-category source and geometry provenance matrix; keep estimates distinct from real street/route geometry. |

## Checkpoint — 2026-11-08 11:22 UTC — local geocoder config source

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Locate an existing usable autocomplete provider configuration | Read-only scan of all registered Server worktrees' `.env*` found only canonical `MarshGO-Server/.env`; provider is unset and engine host is `nominatim.openstreetmap.org`. No secret value was printed. | BLOCKED_EXTERNAL / CONFIGURATION | Active API rejects public Nominatim autocomplete with 503. No existing Photon/approved HTTPS endpoint to reconnect. Obtain an approved stable endpoint or implement an explicit, policy-compliant query flow; do not silently route user searches to Photon public demo. |


| Checkpoint | Requirement | State | Evidence / limitation |
|---|---|---|---|
| 2026-11-08 11:35 UTC | Superseded route-place autocomplete requests are cancelled | PR_CHECKS_PENDING | Site PR #109, head `d2b75702d089fbec47cab3edc14b3f3eaeda2e77`; tests added for signal forwarding and abort behavior; exact-head CI pending. This does not supply a geocoder or prove live autocomplete. |


| 2026-11-08 11:41 UTC | Site place-query cancellation | PASS (component CI) | PR #109 merged at `cfc3c021515390f78abaa639752660c5866c1922`; exact-head tests and post-merge CI passed. Does not prove a live geocoder is available. |
| 2026-11-08 11:41 UTC | Lviv live schedule routing completeness | FAIL / PARTIAL | Artifact `42473995628`, Server SHA `0b0aac1f1dd4e2f6cc8b59411380b09042f99043`: two sampled corridors each returned 10 scheduled routes, both truncated; zero 3-leg candidates in this query window. GTFS-RT was DEGRADED (387 fresh / 37 stale positions). |


| 2026-11-08 11:44 UTC | Six GitHub main refs observed | OBSERVATION_ONLY_NOT_RELEASE_CANDIDATE | Exact refs recorded at `observed_main_tuple_2026_11_08_1144_after_site_pr109`; only Server/Site CI rechecked. No unified integration acceptance. |


## 2026-11-08 21:26 UTC — requested page and 12-mode acceptance not yet executable

- No source changes or tests in this checkpoint. `git diff --check` passed for the dirty canonical Site and Server worktrees.
- Page list to accept: `/`, `/journeys/search`, `/trips`, `/messages`, `/profile`, `/demands/new`, `/demands`, `/demands/mine`, `/offers/new`, `/admin/verification`, `/navigate`, `/map`; also offer, booking, demand, journey and conversation deep links. Existing root E2E files cover browser compatibility, button behavior, route map, marketplace, rendezvous map and conditional CTAs, but are not current-page test results.
- Current local API and zrok readiness return 502 (or ports 3002/3007 have no listener), so browser screenshots/static HTTP 200 cannot stand in for functional acceptance. No page-by-page browser run occurred.
- All-12 live status cannot be asserted. The latest registry evidence is stale (generated Nov 4); historical status shows scheduled feeds only in covered cities and commercial/provider gaps for taxi, carshare, rentals and transfer booking. Require source rights, current health/freshness, planner path, map behavior and booking capability per category.
- Resource state: 22 GiB disk free, 36% RAM free, 12,882 MiB encrypted swap used, active virtualization at ~69% CPU; defer another heavyweight run until that competing workload is idle. No containers or volumes changed.
- Release status remains NOT_RELEASED. Next step: isolated exact-SHA Server stack with unique volumes, then one-at-a-time API, browser and provider acceptance.


## 2026-11-08 21:31 UTC — geometry source review (not runtime acceptance)

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Static multimodal fallback is excluded from production by default | Dirty Server diff requires `NODE_ENV=test` and an explicit opt-in; new unit tests assert default-off behavior | SOURCE_REVIEW_ONLY | Tests were not run; does not connect provider feeds or establish search results |
| Route geometry rejects malformed coordinates | Dirty Server helper checks array length, finite WGS84 bounds; new focused test file exists | SOURCE_REVIEW_ONLY | No API→Site map validation performed |
| No fabricated live approach marker | Dirty Site diff removes a timer-driven synthetic vehicle-position ticker; existing source tests cover verified/missing geometry cases | SOURCE_REVIEW_ONLY | Site tests/browser not run; preserve actual selected-route focus and validate in browser |


## 2026-11-08 21:33 UTC — no current-main API image for local acceptance

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Exact Server-main runtime available locally | Newest local API image metadata points to `8d3239cf84ab9aca7693f579a77822f00a279453`, older than candidate main `d8c25a560187a89aaa42422d602802854c19c694`; exact-main Compose requires build and isolated DB/Redis volumes | BLOCKED_RESOURCE_GATE | RAM 28% free and active Docker VM/Qoder workload; defer build. Do not run stale image as current acceptance |


## 2026-11-08 21:35 UTC — live Lviv feed works; planner completeness gate fails

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Lviv realtime feed connectivity | Exact-main workflow `42479621595` artifact: valid GTFS-RT, 424 vehicle entities, 397 fresh / 27 stale, 3-second header; zero TripUpdates/Alerts | FEED_READONLY_VERIFIED / DEGRADED | No vehicle-to-journey or UI mapping proved |
| Lviv scheduled route search | Same artifact: 1,071 stops, 72 routes, 15,141 trips; both 90-minute OD probes returned 10 routes, each truncated; 0 three-leg candidates | LIVE_ROUTE_PARTIAL / CI_FAIL | stop-selection, candidate-graph, pool/sampling and page caps remain; fix without loosening completeness gate |
| Exact Server main CI | `42479353894` on `d8c25a560187a89aaa42422d602802854c19c694` | PASS | This does not override the separate live route acceptance failure |


## 2026-11-08 21:36 UTC — concrete Lviv scheduled routes from exact-main artifact

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Lviv direct schedule results | Exact-main artifact `42479621595`: tram T01 and bus Tр32 for center→station; each under `searchTruncated=true` | FIXTURE/LIVE-FEED-PLANNER PARTIAL | Does not prove UI or complete alternatives |
| Lviv scheduled transfer chain | Same artifact: north→Sykhiv includes A52 bus → T04 tram; search truncated; no three-leg candidate was produced | LIVE-FEED-PLANNER PARTIAL | Truncation means zero three-leg candidates is inconclusive; need a same-feed replay after planner fix |
| Trolleybus and remaining modes | Workflow allowed trolleybus but returned examples show bus/tram; other categories absent from this acceptance scope | NOT_VERIFIED | Require source→planner→UI evidence by mode; do not infer from selection icon |

## 2026-11-08 23:45 EET — current Site/API smoke

| Check | Evidence | Status | Limitation / next action |
|---|---|---|---|
| Registered Site routes | Dirty Site preview HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`: 20 route shapes (15 fixed paths/aliases and five representative entity routes) return HTTP 200 and SPA root HTML | ROUTE_SHELL_ONLY | No browser rendering, route-specific data, control, theme, or workflow assertions ran |
| API through Site preview | `/api/v1/version`, `/readyz`, geocoding, and provider probes on `4181` return 502; direct `:3002`/`:3007` refuse connections | FAIL / API_UNAVAILABLE | Restore an exact-SHA isolated API after resource gate, then repeat search and page workflow checks |
| All 12 transport categories | Current matrix remains internal carpool only; schedule-backed city rail/bus modes partial; minibus needs explicit source; taxi/carshare blocked on agreements/credentials; bike/scooter unavailable for verified Ukrainian journey search; transfer catalog only | NOT_VERIFIED_END_TO_END | Connect only feeds with permitted access and prove each source→planner→UI path; do not infer readiness from registry rows or icons |
| Resource gate | 23 GiB disk free, 28% free memory, 12,353 MiB swap used; Qoder/Chrome/Docker active | HEAVY_TEST_DEFERRED | Retry one local heavy operation only after free memory ≥35% and competing load subsides; no cleanup below the 20 GiB disk threshold |

| Stopped local API image | `marshgo-local-api-api-1` exited 1 on 2026-11-06; `OOMKilled=false`; image revision `8d3239cf84ab9aca7693f579a77822f00a279453`, older than intended current-main candidate | STALE_BUILD / EXIT_CAUSE_UNKNOWN | Do not restart this image; validate a fresh isolated build at exact Server SHA `d8c25a560187a89aaa42422d602802854c19c694` after the resource gate |

| Current component CI | Server main `d8c25a560187a89aaa42422d602802854c19c694`: run `42479353894` PASS; Site main `9e1be2a0b96ce1a20761a2a0956626456e2ba9db`: run `42517891677` PASS | COMPONENT_CI_PASS | Does not establish runtime or cross-component acceptance |
| Current Lviv live acceptance | Server main exact-SHA run `42479621595` failed; both OD results were truncated; the current examples show bus/tram and one bus→tram chain | FAIL / PARTIAL_LIVE_ROUTE_EVIDENCE | Resolve candidate/graph/pool truncation without relaxing the completeness gate; rerun live acceptance |
| Qoder exhaustive journey oracle | PR #97 merged; current Server main CI passes; Qoder worktree oracle test file equals current main | ALREADY_IN_MAIN | Do not merge the stale 22-behind branch; no unique oracle test change remains |

| Lviv search budget diagnosis | Exact-main artifact `42479621595`: ~64k/75k of 1M steps used; stop selection, graph and candidate sampling truncate; second OD has 30 one-leg / 220 two-leg / 0 three-leg retained candidates | SEARCH_BUDGET_NOT_BINDING / COVERAGE_FAIL | Fix stop/graph/candidate retention and prove bounded completeness; increasing the step cap is not supported by evidence |
## 2026-11-09 00:56 EET — post-merge scope and remaining acceptance

| Check | Exact evidence | Result | Limitation / next action |
|---|---|---|---|
| Site PR #117 | Squash merge and `origin/main`: `411cb45794d70ce744f64099d4d9d3b19d71588a`; exact CI run `42532518865` SUCCESS | MERGED / CI_PASS | Component CI is not six-repository acceptance |
| CI quality | lint, typecheck, full `npm test`, token check, build, bundle/single-React checks, Playwright boot-smoke | PASS | Boot-smoke only checks `/` at four theme/viewport combinations and permits API 502; it is not every-page or authenticated E2E |
| Page-by-page browser acceptance | No current browser attachment; IAB bridge returns `browser.user is unavailable`; API is down | NOT_RUN | Wait for a usable browser and exact-SHA healthy API, then sweep all registered pages, themes and viewports |
| API health/readiness | direct `:3002` connection refused; `:3019` and approved HTTPS host return 502 | FAIL / UNAVAILABLE | Restore and identify an exact-SHA API before route, booking, or provider acceptance |
| Twelve transport categories | Last registry snapshot 2026-11-08 18:56 UTC; no current feed probe/activation | NOT_VERIFIED_END_TO_END | Verify source rights, ingestion freshness, planner usage and UI route on one pinned candidate; obtain missing operator credentials/contracts |
| Resource gate | 22 GiB disk free; 28% memory free; 13,078 MiB swap used; VM/Qoder/Docker/browser active | HEAVY_TEST_DEFERRED | Start at most one heavy local browser/build/GTFS task after memory free reaches 35% and API is ready |
## 2026-11-09 01:01 EET — current main tuple and service readiness

| Component | Current remote `main` SHA | Evidence / result |
|---|---|---|
| Root | `1e7d0ee74f11121a7d5a29c6379944a5360581c4` | GitHub ref only |
| Server | `d8c25a560187a89aaa42422d602802854c19c694` | GitHub ref; component CI run `42479353894` SUCCESS |
| Site | `411cb45794d70ce744f64099d4d9d3b19d71588a` | Exact post-merge Site CI run `42532518865` SUCCESS |
| iOS | `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f` | GitHub ref only |
| Admin | `d8afa64c4efda8ce4f10557a03651943effa52a7` | GitHub ref only |
| Partner | `4d605d4353af281dd295fabf0c7c2ac05efe222e` | GitHub ref only |

This is a current-main snapshot, not unified acceptance. Local manifests remain NOT_RELEASED and pin older tuples. Runtime probes: Site preview `:4178` HTTP 200; API `:3002` down; proxy `:3019` 502; PostgreSQL/Redis and OSRM walking routers are up; no API container. Authenticated page flow and provider routing were not run. Resource gate is below 35% free RAM, so heavy local acceptance is deferred.



### 2026-11-09 01:48 EET — current test boundary

- Site `eda449f008025b2126c92fd24cd68deb513ca3ad`: 60 focused production-route, transport-preference and route-presentation tests passed; all 20 registered route/deep-link paths returned SPA shell HTTP 200 on `:4178` and `:4179`. Browser-rendered page acceptance NOT_RUN (browser bridge unavailable).
- Current local API `:3002` has no listener; Site autocomplete through local proxy and readiness through `:3019`/approved HTTPS return 502. Live search and provider-to-UI acceptance BLOCKED.
- Server smoke-window candidate based on `d8c25a560187a89aaa42422d602802854c19c694`: 6 focused tests passed; no full typecheck, live feed, or integration suite. All 12 modes remain NOT_VERIFIED_END_TO_END.


### 2026-11-09 01:52 EET — geometry provenance and fallback unit gate

- Dirty Server `e9934abbd8fc973177de8d7f47548739758a1b74`: geometry provenance and static fallback targeted tests passed 4/4. This is fixture/unit evidence only; API runtime, actual map rendering and provider-backed route evidence remain NOT_VERIFIED. Local API preflight passed but the service was not launched.


### 2026-11-09 01:53 EET — route logic and map unit gates

- Site dirty SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`: 36 map/focus/geometry tests and 60 route/presentation/provider-selection tests passed. Coverage includes 12 mode segment rendering, no invented road geometry, walking provenance, GPS failure copy and route-focus bearings.
- Server dirty SHA `e9934abbd8fc973177de8d7f47548739758a1b74`: 31 scoring/oracle/three-strategy/provider-corridor tests plus 4 geometry-provenance/fallback tests passed. Fixture evidence only; runtime/API/live feed gates remain blocked.


### 2026-11-09 02:02 EET — Lviv smoke determinism PR

- PR #121 head `0f1d2c6815cc0d3f0147c2f440e5a5613fd9f152` changes only the smoke query-window selection and tests. Six focused tests pass locally; exact-head CI is pending. Live route acceptance remains NOT_RUN and the PR is not merged.


### 2026-11-09 02:06 EET — Server main exact-head verification

- PR #121 merged to Server main `5b6462adff2cab44625d9a9c3bb50e839c208ddb`; its tested tree matches main. Both exact-head `verify` runs passed full Server checks.
- Read-only live Lviv GTFS/GTFS-RT run `42538348641` is in progress on the merged SHA; until artifact/result is inspected, LIVE route acceptance remains pending. No broader provider or release claims.


### 2026-11-09 02:33 EET — UI patch checkpoint

- Compact result-card regression suite: 64 passed, 0 failed/skipped; targeted ESLint passed on dirty Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`.
- Route/deep-link smoke checked 20 SPA shells only; rendered-page, interaction, theme, responsive, full build/typecheck and E2E acceptance are NOT_RUN. The `:4181` preview is stale; `:4179` serves the updated module.
- API readiness/search remains unavailable (502); no API→UI or source→ingestion→planner→UI acceptance can currently be claimed. All 12 categories remain NOT_VERIFIED_END_TO_END; production NOT_RELEASED.


### 2026-11-09 02:37 EET — API not running; full page acceptance still blocked

- `:4178/:4179/:4181` serve Site dev/preview, but `:3002` refuses connections and API proxy paths return 502. Docker has healthy DB/Redis/cache and walk-router containers, but no API container. No services were changed.
- Full rendered-page/browser acceptance remains NOT_RUN. Existing 64/64 focused Site tests and 20 shell-route checks do not prove every page works. Memory free 28%, below heavy-work threshold.


### 2026-11-09 02:45 EET — API crash explained; current-main candidate prepared

- Old stopped API image source revision `8d3239...` exited code 1, OOM=false, with an unhandled PostgreSQL client connection termination. Current Server main `5b6462...` includes merged PR #98's checked-out-client error handler and exact regression test. Runtime is still unavailable; this identifies the stale image failure mode, not current runtime health.
- Current-main isolated Compose config passes with new volume names and local-only Photon/walk-router config. No build, container, or volume was created. Photon and walk-router source probes succeeded directly; no API→UI journey was run.
- 29% free RAM; full build/E2E deferred.


### 2026-11-09 02:47 EET — exact-main routing oracle and DB resilience tests

- Server exact SHA `5b6462adff2cab44625d9a9c3bb50e839c208ddb`: focused route-oracle, scoring and pool-client-error suites passed **40/40**, including a three-leg-only graph and Postgres disconnect error handler. Fixture/unit evidence only.
- Runtime API still not started; Photon/walking source probes are not app integration. Browser page functionality and all 12 mode journeys remain NOT_VERIFIED_END_TO_END.


### 2026-11-09 02:58 EET — scoped Lviv integration preparation

- PR #122 adds tested Lviv-only provider seeding from exact-main base `5b6462ad...`; 4/4 selector tests and targeted lint pass. GitHub `verify` checks pending; PR not merged. No DB/provider state changed.
- This enables targeted feed setup but is not feed verification. API start, Lviv seed, API search, geometry/map and browser acceptance remain NOT_RUN.


### 2026-11-09 03:02 EET — Server main seed tooling checkpoint

- Server main `ba158074ee45ca70486cef10462f9860942e1fa7` includes scoped Lviv feed seeding (PR #122); PR checks passed and post-merge focused tests 4/4 pass.
- Local API image/runtime and Lviv provider seeding remain NOT_RUN. No live route-to-UI evidence or page visual acceptance. Resource gate below threshold (31% RAM free).

### 2026-11-09 03:10 EET — updated page/provider gate

- Web shell: 20/20 registered URLs previously returned the SPA root; this is routing fallback evidence only.
- Focused Site tests: 64/64 and targeted ESLint are recorded on dirty Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`; no rendered all-page/browser acceptance.
- Current Site API proxy and approved HTTPS readiness/autocomplete return 502; there is no direct API listener. Journey search, map data and feed→UI are NOT_VERIFIED.
- All 12 modes remain NOT_VERIFIED_END_TO_END. No feed activation occurred; provider blockers/status are in `docs/PRODUCTION_PROVIDER_MATRIX.md`.
- Full browser sweep deferred while RAM free is 28% (<35% gate). Production status: NOT_RELEASED.

### 2026-11-09 03:16 EET — focused test refresh

- Site dirty SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`: result/design tests 50/50; transport preference/provider selection 17/17; no skips. UI unit evidence only.
- Server-main focused provider tests did not execute: isolated worktree lacks `tsx`; no feed-health conclusion can be drawn from that attempt. PR #122 required CI passed, but no current API/feed replay is available.
- Preview/API readiness and place suggestions remain HTTP 502; page-level E2E and feed→planner→UI are not verified. Keep all 12 modes NOT_VERIFIED_END_TO_END and release NOT_RELEASED.

### 2026-11-09 03:23 EET — live Lviv route gate

- Server `ba158074ee45ca70486cef10462f9860942e1fa7`, read-only workflow `42544916064`: static Lviv GTFS produced bus and bus→tram candidates on the service date. Both searches were truncated (stop selection, graph, pool/sampling and response page); completeness gate FAIL. This is a real schedule-feed-to-planner probe, not API/UI acceptance.
- Fresh GTFS-RT was empty (0 vehicle/update/alert entities); status DEGRADED for live-position purpose.
- Direct OSRM foot geometry succeeded (242 points) but was not stitched through API or displayed in Site.
- App/API readiness and autocomplete are still 502; page E2E remains NOT_RUN. Release NOT_RELEASED.

### 2026-11-09 03:28 EET — registered page routing check (not browser acceptance)

- Canonical Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`: `tests/production-routes.test.ts` **2 passed, 0 failed/skipped**. Active Site `:4179` served SPA fallback HTTP 200 for 20 registered tab/deep-link paths. This is URL-shell evidence only; page interactions and visuals are NOT_TESTED.
- API proxy readiness, place suggestions, and journey search all returned HTTP 502. API-backed pages and feed→route→map remain NOT_VERIFIED.
- Resource gate at 03:28 EET: 23 GiB disk free, 30% memory free, 12,152 MiB swap used; defer browser E2E/API startup until free RAM ≥35%.
- Feed evidence remains partial on Server SHA `ba158074ee45ca70486cef10462f9860942e1fa7`: Lviv static bus and bus→tram schedule candidates with truncation; GTFS-RT snapshot empty; foot-router sample geometry not yet integrated into API/UI. All 12 transport modes remain NOT_VERIFIED_END_TO_END; release NOT_RELEASED.

### 2026-11-09 03:30 EET — API artifact readiness

- Read-only Docker inventory: no Server API container is running; no local API image is pinned to Server SHA `ba158074ee45ca70486cef10462f9860942e1fa7`. Existing API images predate this main candidate, so they cannot prove current behavior.
- Isolated candidate source/Compose preparation is available; build and runtime acceptance were deferred at 28% free RAM (12,380.75 MiB swap) despite 23 GiB disk free. No containers, DBs or volumes were changed. API/page E2E remains NOT_RUN; release NOT_RELEASED.

### 2026-11-09 03:32 EET — Server main CI gate

- Exact Server main SHA `ba158074ee45ca70486cef10462f9860942e1fa7` GitHub Actions run `42543310830` succeeded. Passed npm install/audit, lint, typecheck, unit, migration, integration tests, API Docker image build/smoke with PostGIS+Redis, and Compose lifecycle E2E. Evidence: https://github.com/dima1203oleg/MarshGO-Server/actions/runs/42543310830.
- This is hosted exact-SHA CI evidence only. The local preview API and approved HTTPS endpoint remain 502; provider-backed Site flows and browser interactions are still NOT_VERIFIED. Lviv live route acceptance `42544916064` separately fails the completeness gate due truncation. Do not infer that all 12 categories are live.

### 2026-11-09 03:50 EET — user-requested page/feed check

- Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`: `tests/production-routes.test.ts` passed 2/2 with no skips. `/`, `/journeys/search`, and `/profile` on `:4179` returned 200 SPA shell only. Visual rendering and page interactions remain NOT_TESTED.
- API checks: Site health/autocomplete proxy, local relay readiness `:3019`, and approved HTTPS `/readyz` returned 502. API-backed page acceptance and provider-to-route-to-map acceptance are BLOCKED by the unavailable API runtime.
- Resource gate: 23 GiB free disk, 31% free RAM, 12,227.81 MiB swap; heavy browser/API/feed-import checks deferred.
- Transport: all 12 categories remain NOT_VERIFIED_END_TO_END. Root's catalog smoke checks 43 rows while canonical Server catalog contains 52; nine canonical entries are not covered by that smoke. This gap must be closed before asserting complete feed inventory.

### 2026-11-09 04:01 EET — canonical endpoint probe, not feed acceptance

- Exact Server main `ba158074ee45ca70486cef10462f9860942e1fa7`: read-only HEAD probe covered 47 open endpoints from 52 unique catalog rows; 32 returned HTTP 200 and 15 returned no HTTP status. Five non-open rows were skipped by policy. No bodies were parsed, and no source was imported into the API.
- Kyiv official API resource links currently redirect to `gisserver-stage.kyivcity.gov.ua`; both that host and `gisserver.kyivcity.gov.ua` have no A records through 1.1.1.1 and 8.8.8.8. `datastore_search` returned resource metadata only, not transit content. Kyiv feed integration remains blocked pending a working authorized endpoint.
- API readiness/search are still HTTP 502; browser-rendered pages and all 12 end-to-end category gates remain NOT_TESTED/NOT_VERIFIED.

### 2026-11-09 03:36 EET — targeted Site route and search gates

- Dirty Site SHA `eda449f008025b2126c92fd24cd68deb513ca3ad`: route map/camera/sheet **25 passed**; search bounds/provider availability/strategy **20 passed**; production route resolver **2 passed**. Prior same-SHA UI/design **50 passed** and transport selection **17 passed**. No skips/failures in these focused runs. They do not replace browser interaction or API acceptance.
- Isolated Server main Compose configuration validated for exact SHA `ba158074ee45ca70486cef10462f9860942e1fa7`, loopback-only free ports, unique empty volumes, fixture mode off, and no development auth bypass. No image/container/volume created.
- Post-test resources: 32% free RAM, 12,195.69 MiB swap, 23 GiB free disk. API runtime and page E2E remain not run; defer build until RAM free ≥35%.

### 2026-11-09 03:38 EET — search API target root cause

- Canonical Site Vite config proxies API/readiness paths to `API_PROXY_TARGET` or `127.0.0.1:3002`. No API process listens on that target; current 502 is consistent with the missing Server runtime. Do not record geocoder/provider failure based solely on this proxy response.
- Exact Server main candidate/isolated compose is prepared, loopback-only, disposable data stores, fixture mode off and dev-auth bypass off; build not run because RAM fell below the resource gate. Search→provider→route→map remains NOT_RUN locally.

### 2026-11-09 03:42 EET — Qoder search PR disposition

- Server #119 is superseded by merged #120; the fixes are present in exact Server main SHA `ba158074ee45ca70486cef10462f9860942e1fa7`, and current-main CI `42543310830` passed. No duplicate merge.
- Site #56 is not merge-ready: its tested head is 109 commits behind current Site main `411cb45794d70ce744f64099d4d9d3b19d71588a` and GitHub reports `dirty`. It has useful measured nearest-stop/outage wording, but current dirty Site intentionally puts noncritical diagnostics in a disclosure. Eight notice/diagnostics unit tests pass on Site dirty SHA `eda449f...`; browser/API behavior remains unverified. Only a tested, detail-only compatible port should be considered.

### 2026-11-09 04:09 EET — API/resource gate

- Rechecked exact Server main `ba158074ee45ca70486cef10462f9860942e1fa7`; PR #122 is merged and both exact-head CI runs passed. Local API has no listener; Site proxy and approved HTTPS readiness return 502.
- Docker has shared DB/Redis plus walking routers only, about 167 MiB combined memory; no API container. No container was stopped. Free RAM 29–30%, swap ~12.2 GiB and disk 23 GiB; API build/browser work deferred under the resource gate.

## 2026-11-09 06:27 EET — current web and feed acceptance

| Gate | Exact evidence | Result |
|---|---|---|
| Local Site shell | `:4179` served the existing MARSHGO guest landing page; accessibility tree exposed “Почати” and “У мене вже є акаунт”. `/` is HTTP 200. Preview uses dirty Site HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`; another existing `:4181` preview is branch `codex/search-budget-controls-20261108` at `b11b178bb94991f06ce0769e8d84f1add8f3b3ac`. | SHELL_RENDERED; authenticated search NOT_TESTED |
| API readiness | Local `/readyz` on previews returned 502; `127.0.0.1:3002/healthz` refused connection; approved HTTPS readiness and place-suggest returned 502. | FAIL / API UPSTREAM ABSENT |
| Direct geocoder and walking router | Public Photon generic “Lviv” sample returned a city result; local OSRM foot sample returned `code=Ok`. Neither was called through the product API or rendered route map. | COMPONENT_SAMPLE_ONLY |
| Lviv scheduled route | Server exact main `4db6e97b392cb9f01e07fea035b8346826119333`, workflow `42561583860`: 10 results in each of two corridors, including bus→tram; both have five truncation flags. | SCHEDULE_FIXTURE/LIVE-FEED PLANNER SAMPLE; INCOMPLETE |
| All-feed probe | Same Server SHA, artifact probe: 88 catalog entries, 83 actually probed, 5 skipped, 49 healthy, 13 degraded, 21 offline. | PROBE_COMPLETED; ALL-MODE ACCEPTANCE FAIL |
| Site/API/map/navigation integration | API is absent; no route reached Site map or active navigation. | NOT_RUN |
| Resource/stack safety | 23 GiB free disk, 35% free RAM in two readings, ~12.55 GiB swap; Virtualization VM sustained >50% CPU while Qoder was active. | DEFER LOCAL DOCKER/API BUILD; no process/container/volume stopped |

Production readiness stays `false`, release `NOT_RELEASED`. The all-feed probe is not a success gate for 12 modes. Next local action: after the active VM/Qoder load subsides and free RAM remains above threshold, start the exact-Server-SHA API using a disposable DB/Redis stack; verify version/health/readiness, autocomplete, one Lviv provider route and geometry through a separate Site preview before browser interaction sweeps.


## 2026-11-09 06:35 EET — Kyiv official feed endpoint reconciliation; preserve Qoder runtime

- Opened the existing Site preview at `http://127.0.0.1:4179/journeys/search`; it renders the guest welcome screen. Its API proxy returns 502; direct `:3002` has no listener. No login was attempted, and neither `:4179` nor Qoder-owned worktrees were restarted or edited.
- Server current `origin/main` remains `4db6e97b392cb9f01e07fea035b8346826119333`. The latest exact-main 88-row probe remains the only complete source snapshot: 83 probed, 5 policy-skipped; 49 healthy, 13 degraded, 21 offline. It does not prove route/API/UI use.
- Fresh official-source review: [Kyiv Open Data's transport dataset](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport) reports commercial reuse under its Open Data Licence and an update on 2026-10-14. Its published metro/funicular/route resource links on [the national data.gov.ua mirror](https://data.gov.ua/dataset/96128887-4f36-4c19-a96e-5d4765fade16) point to `gisserver-stage.kyivcity.gov.ua`. The catalog's production `gisserver.kyivcity.gov.ua` and the published stage host both failed DNS from this Mac; the web fetcher also returned 502/timeouts on stage queries. This is an endpoint/network blocker, not proof that the city dataset was deleted. Do not silently switch production to a stage endpoint or fabricate metro/marshrutka routes.
- Mode disposition remains: bus/tram/trolleybus have partial scheduled GTFS evidence; train has schedule-only evidence; bike is static-only; scooter's global GBFS is not verified for local rentable stock; carpool code is not API/UI verified; marshrutka, metro, taxi, carsharing, and transfer have no verified end-to-end route/booking evidence. All 12 remain `NOT_VERIFIED_END_TO_END`.
- No provider URL, database, Qoder source, or production config changed.
- Resource checkpoint: disk 23 GiB free; memory free 28%; encrypted swap 12,402.81 MiB; load 1.52/2.10/2.36; Qoder, Docker Desktop, and Virtualization are still running. No heavy local build/test/import/browser suite started.
- Next: preserve both active browser previews; after memory is stably >=35%, run only the exact-Server-SHA isolated API + disposable DB/Redis acceptance. Then verify sample autocomplete → provider route → geometry → Site map. Keep inaccessible provider endpoints and missing partner credentials explicit; production remains `NOT_RELEASED`.


## 2026-11-09 06:48 EET — Site/API and scooter evidence update

- Existing Site preview `:4179` responds HTTP 200, but `/readyz`, typed Lviv suggestion, direct API `:3002`, and the approved HTTPS readiness/suggestion routes are unavailable (HTTP 502 / connection refused). The browser preview is the UI shell, not a functional search acceptance.
- Read-only direct feed path on Server-main-equivalent parser code (source SHA `4db6e97b392cb9f01e07fea035b8346826119333`): Zelectra at `2026-11-09T04:47:32Z` yielded 706 fresh available scooters in Kyiv; `selectNearby` returned all 706 within the 15 km sample radius; map-model builders produced 706 points and 300 geofence features; 0 stations; 8 plans. This is LIVE source + parser/model evidence only, not API/DB/Site/booking acceptance. Example feed rate is UAH 12 + UAH 5.6/min, not a confirmed total price. Qoder regional catalog has a `CONTRACT_ONLY` entry despite the current registry's `ACTIVE_LIVE` record; reconcile before activation. See `docs/PRODUCTION_PROVIDER_MATRIX.md` for source details.
- Status: scooter improved from global-feed discovery to one Kyiv LIVE normalization/map-model sample; API and UI unverified. Remaining 11 modes unchanged. All 12 remain `NOT_VERIFIED_END_TO_END`; `production_ready=false`, release `NOT_RELEASED`.
- Resource gate: 23 GiB disk free, 28% free RAM, 12,101 MiB swap used; no local build, API startup, import, or E2E run. Qoder and existing preview/runtime processes were left untouched.


## 2026-11-09 06:55 EET — stale local API image failure traced to PostgreSQL disconnect

- Read-only Docker inspection: `marshgo-local-api-api-1` used image `marshgo-local-api-api:latest`, built 2026-11-06 18:12 UTC from Server SHA `8d3239cf84ab9aca7693f579a77822f00a279453`; it exited 1 at 2026-11-06 19:44:53 UTC, `OOMKilled=false`. Sanitized logs show `Connection terminated unexpectedly` emitted by a checked-out `pg` Client, followed by an unhandled EventEmitter `error`; this explains why the local API port is absent. No database or container was modified.
- Current exact Server main `4db6e97b392cb9f01e07fea035b8346826119333` already contains commit `4aa0e98` (`fix(server): handle checked-out PostgreSQL client errors`): `observePgPoolClientErrors` attaches a sanitized listener to physical checked-out clients. The integration runner includes the opt-in socket failure test; it terminates only its own backend in a loopback `marshgo_e2e*` database and asserts that a fresh query succeeds.
- Exact-main GitHub Actions run [42561570045](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/42561570045) completed successfully on SHA `4db6e97...`; its job log confirms `pg-socket-failure` executed 3 tests, and the API image build/smoke plus Compose lifecycle steps passed. Thus the checked-in main already fixes the old-image crash in CI; the local runtime is stale, not evidence that Qoder's/current main source regressed.
- Still unverified locally: a newly built exact-main API connected to an isolated disposable DB/Redis, readiness, autocomplete, search, and Site rendering. Do not restart the exited 8d3239 image. Local disk 22 GiB free, free RAM 28%, encrypted swap 13,535 MiB, load 5.42/5.28/4.01; defer local build/start until RAM is stably >=35%. Qoder's dirty Server/Site worktrees remain untouched. Production stays `NOT_RELEASED`.


## 2026-11-09 07:00 EET — safe API preflight and read-only local feed inventory

- `./scripts/start-local-api.sh --check` passed without starting the API. It validated loopback DB/Redis/geocoder/router targets; the launcher forces auth dev bypass/OTP off, SMS disabled, fixtures off, and static multimodal estimates off. It would run the **dirty Qoder checkout** at `e9934abbd8fc973177de8d7f47548739758a1b74` (`sourceState=dirty`), so this is a preflight only, not a release build or runtime acceptance.
- Read-only `BEGIN READ ONLY` queries to the validated local Postgres showed the existing provider table has 13 enabled rows (11 healthy, 2 degraded) and 75 disabled/offline rows (60 `DISCOVERED`, 15 `TEMPORARILY_UNAVAILABLE`). Last checks were around `2026-11-08T18:56Z`; successful sync timestamps around `12:37Z`. This database inventory is old local state, not current live API health, and it does not prove all 12 user-facing modes.
- PostgreSQL `pg_isready` on the local target accepted connections; the mapped Redis container returned `PONG`. These are existing shared containers/data, not a disposable test stack; no writes, migration, restart, or container changes were made. API `:3002` remains down.
- Current resource gate at 06:57 EET: disk 22 GiB available, RAM free 28%, encrypted swap 13,090 MiB used, load 1.96/3.44/3.55. Do not start API against the shared DB or build/start a container under the memory threshold.
- Next safe runtime gate: when free RAM is stably >=35%, create/use an isolated disposable DB+Redis, build/run one pinned Server candidate, verify build identity/readiness, then connect the existing Site preview. Keep dirty Qoder code isolated and preserve all local provider/database state.


## 2026-11-09 07:07 EET — current decision for preserved all-Ukraine multimodal branch

- Rechecked against actual GitHub-tracking refs: Server `origin/main=4db6e97b392cb9f01e07fea035b8346826119333`; dirty checkout `antigravity/ukraine-12-transports-multimodal= e9934abbd8fc973177de8d7f47548739758a1b74`; merge base `fcdf9d8bca2206f30a5e95b578165b0dc0be89c7`; main has 105 commits not in the checkout and the checkout has 4 unique commits. A paginated GitHub PR query for this exact head returned no PR. The four commits are authored as Dima in Git metadata; branch naming is not proof they were produced by Qoder.
- Decision register update: `b986ac7`, `6eda068`, `2280390` (12-mode/72-corridor static engine and stop metadata) = **REJECTED as provider-backed production results**; those paths embed route/timetable corridors without verified source-backed service. `e9934ab` and generated grid paths = **SUPERSEDED for real walking geometry**; current main uses provider geometry provenance and routed foot paths, while the grid helper is explicitly synthetic. Dirty `sourceRouteGeometry` = **SUPERSEDED** by main's stricter `trustedRouteGeometry` (validates mode/source provenance and sanitizes persisted geometry). Dirty `staticMultimodalFallbackPolicy` = **NEEDS_REVIEW / no port**: current main has no static engine call site, so the test-only gate has no production behavior to protect.
- Preservation: Server working tree remains at `e9934...` with 3 tracked modifications (`server/index.ts`, `server/journey/multimodalChainEngine.ts`, `shared/navigation/pedestrianGeometry.ts`) and 4 untracked helper/test files. No edit, checkout, stash, cherry-pick, merge, cleanup or restart was performed. Existing current-main CI run `42561570045` is successful, but branch dirty tests were not run.
- This branch must not be launched as the newest compatible Server build or merged wholesale. Use exact `origin/main` for the first API→Site runtime acceptance; if a later verified improvement is found, port it to a new isolated worktree and run acceptance there. Current local preview remains HTTP 200 with API 502; resource gate 22 GiB disk, 29% free RAM, 12,799 MiB swap at 07:06 EET; defer heavy build/test.

## 2026-11-09 07:20 EET — preview smoke and isolated exact-main candidate

| Test ID | SHA / environment | Command/action | Result | Conclusion |
|---|---|---|---|---|
| WEB-PREVIEW-0714 | Site dirty HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`, process PID 58023, `127.0.0.1:4179` | GET `/`, `/journeys/search`, `/src/main.tsx`, `/readyz`, `/api/v1/places/suggest?q=Львів`; open in-app browser | SPA and transformed entry HTTP 200; readiness and place suggestion HTTP 502; API `:3002` has no listener. Browser rendered the guest welcome/unauthenticated screen only. | Shell delivery PASS; authenticated search, provider journeys, geometry/map interaction NOT_RUN. |
| SERVER-ISOLATION-0720 | Server exact main `4db6e97b392cb9f01e07fea035b8346826119333` | Create detached worktree `/private/tmp/marshgo-server-main-4db6e97-20261109`; inspect `docker-compose.local-api.yml` | Worktree clean at exact SHA. Compose is loopback-only, separate named DB/Redis volumes, auth bypass/OTP and fixtures disabled. `.env.local-api` absent. | Preparation PASS; API build/start, migrations, `/version`, `/readyz`, search NOT_RUN. |
| RESOURCE-GATE-0720 | Local Mac | `df -h /`, `memory_pressure`, `sysctl vm.swapusage`, `uptime`, process sample | Disk 22 GiB free; readings 36–41% RAM free, swap 13,043 MiB; Docker Virtualization VM reached 115% CPU. | Do not start another heavy Docker/build/browser task until the VM is idle and RAM is stably >=35%. |

Qoder Server and Site worktrees were not edited or restarted (7 and 26 dirty entries respectively). No feed/database/container state was changed. All 12 transport categories remain `NOT_VERIFIED_END_TO_END`; the source/parser counts in the provider matrix are not UI journey acceptance. Unified acceptance remains NOT_RUN; release remains NOT_RELEASED.


### 2026-11-09 07:21 EET — API proxy root-cause check

| Test ID | SHA / environment | Check | Result | Interpretation |
|---|---|---|---|---|
| API-PROXY-0721 | Site dirty HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`, PID 58023, `:4179` | Read `vite.config.ts`; inspect only `API_PROXY_TARGET` for PID; GET `:3002/healthz`, `:4179/readyz`, and city suggestion | `API_PROXY_TARGET` unset; Site default target is `127.0.0.1:3002`; `:3002` connection refused; proxy endpoints return 502 | Search is blocked before geocoder/planner. Separate `:3019` listener is not the configured Site upstream. This does not show a provider-feed regression. No config changed. |

Exact-main API candidate remains prepared but NOT_STARTED; all live route/UI acceptance remains NOT_RUN.


### 2026-11-09 07:25 EET — local API data isolation check

| Test ID | Check | Result | Decision |
|---|---|---|---|
| API-VOLUME-0725 | Read-only `docker volume ls/inspect` for local API state | Default Postgres/Redis volumes exist, created 2026-11-06; unique prepared override volumes absent; no local-api container running | Preserve existing volumes; use a new unique project only. No DB contents inspected or changed. |
| API-ENV-PIN-0725 | Inspect only non-secret build identity fields in temporary env | SHA pin is `ba158074ee45ca70486cef10462f9860942e1fa7`, older than current Server main `4db6e97...` | Stale candidate env rejected; do not run it or expose/copy its secrets. |
| API-RESOURCE-0725 | Disk/memory/swap and VM process | 23 GiB free, 29% RAM free, swap 12,140 MiB; VM CPU low at snapshot | Resource gate still fails; API build/start NOT_RUN. |


### 2026-11-09 07:30 EET — isolated API compose configuration gate

| Test ID | SHA / environment | Check | Result | Interpretation |
|---|---|---|---|---|
| API-COMPOSE-0730 | Clean detached Server `4db6e97b392cb9f01e07fea035b8346826119333`, local ignored env | `docker compose -p marshgo-verified-5b646-20261109 -f docker-compose.local-api.yml -f compose.override.yml --env-file .env.local-api config --format json`; output parsed without printing secrets | PASS: API/DB/Redis; unique volumes; loopback 3002/5444/6390; build arg exact SHA; debug auth/OTP false; fixture mode 0 | Configuration gate only; no image build, container, migration, DB, provider feed or UI request occurred. Runtime acceptance NOT_RUN. |
| API-RESOURCE-0730 | Host Mac | `df -h /`, `memory_pressure`, swap, load and VM process | 23 GiB disk, 31% free RAM, 12,230.56 MiB swap, load 10.39/4.54/3.36; Docker VM active | Local heavy build/start deferred. |


### 2026-11-09 07:33 EET — local image identity check

| Test ID | Check | Result | Decision |
|---|---|---|---|
| API-IMAGE-SHA-0733 | Read-only inspect of all local MARSHGO Docker images | 137 images; 0 contain current Server SHA `4db6e97…`; `marshgo-local-api-api:latest` contains `8d3239c…` | No current-main API artifact available; do not reuse the stale image. Fresh build required, deferred below resource gate. |
| API-RESOURCE-0733 | Host Mac | 23 GiB free disk, 31% free RAM, swap 12,144.88 MiB, load 2.94/3.64/3.21 | Build/start NOT_RUN. |


### 2026-11-09 07:34 EET — CI image availability review

| Test ID | Check | Result | Consequence |
|---|---|---|---|
| CI-IMAGE-0734 | Inspect current-main CI and feed-acceptance workflows | CI builds/smokes locally on runner; feed workflow uploads JSON only; no container push/archive step found | Cannot use CI as a deployable local image artifact; exact-main local build required. No runtime result inferred from this workflow-source review. |
# Runtime checkpoint — 2026-11-09 07:43 EET

| Gate | Current evidence | Result |
|---|---|---|
| Web shell | Existing Site preview `:4179` renders the guest welcome screen; root/search HTTP 200 | PARTIAL — not authenticated search |
| API | Site proxy `:3002` has no listener; `:4179/readyz` and city suggestions return 502 | BLOCKED |
| Feeds | Exact-main source probe plus partial Lviv GTFS and single Kyiv GBFS observations; no full API→planner→Site acceptance | NOT_VERIFIED_END_TO_END (all 12 modes) |
| Qoder preservation | Qoder worktrees not edited/restarted/cleaned | PASS |
| Local resources | 23 GiB disk free; 28% RAM free; ~12.44 GiB swap; Docker VM active | Heavy build deferred |

Release remains NOT_RELEASED. Next gate is an isolated API build on exact Server SHA `4db6e97b392cb9f01e07fea035b8346826119333` after RAM is stably >=35%, followed by readiness, autocomplete, provider-backed route, geometry, and Site checks.

# Runtime checkpoint — 2026-11-09 07:49 EET

| Gate | Current evidence | Result |
|---|---|---|
| Web shell | Existing Site preview :4179 renders guest welcome; static root/search return 200 | PARTIAL |
| Server API | :3002 has no listener; Site readiness/autocomplete proxy returns 502 | BLOCKED |
| Lviv source | Static GTFS URL responds HTTP 200; previous exact-main parse/planner report had scheduled candidates with truncation | SOURCE_REACHABLE; ROUTE_TO_SITE NOT_VERIFIED |
| Kyiv metro source | Official ArcGIS host DNS fails | SOURCE_UNAVAILABLE_FROM_ENVIRONMENT |
| Zelectra GBFS | Root URL responds HTTP 200; prior single snapshot reached parser/nearby/map-model only | SOURCE_REACHABLE; API/UI/booking NOT_VERIFIED |
| Other modes | Existing matrix/report evidence | All 12 NOT_VERIFIED_END_TO_END |
| Resources | 23 GiB free disk, 30% free RAM, 12.23 GiB swap | Heavy build deferred |

No data, source config, Qoder tree, or container was changed. Production remains NOT_RELEASED.

## Runtime checkpoint — 2026-11-09 09:01 EET — Qoder local Web/API smoke

| Gate | Evidence | Result |
|---|---|---|
| Site preview | Qoder Site SHA `e26c598572a0b032d1cd8f6503e65902f45ae387`; `:4202` search form rendered | LOCAL_UI_RENDERED; no full page sweep |
| API identity/readiness | Qoder Server SHA `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`; clean build ID; `/readyz` HTTP 200 | LOCAL_RUNTIME_READY; not current main |
| Sample geocoder | `Львів` returned six suggestions | LOCAL_SAMPLE_VERIFIED |
| Provider categories | City-specific registry counts are in provider matrix | REGISTRY_ONLY; no new route/booking verification |
| Saved route result | Existing intercity query returned zero routes with stop-selection/candidate-graph truncation indicators | ROUTE_SPECIFIC_FAIL; no inference about Lviv or all modes |
| Live vehicle in UI | Qoder departure-now browser run still in progress | NOT_YET_VERIFIED |
| All 12 modes / release | No source→planner→API→UI proof for every category | NOT_VERIFIED_END_TO_END; `NOT_RELEASED` |

No Codex source, provider configuration, database, booking, or container state changed. Qoder's local CORS correction was confined to a temporary launcher script. Resources: 34 GiB disk free; 35% RAM free; swap 4,480.69 MiB; load 3.83/3.50/5.67. No second heavy task should start until Qoder's browser run finishes.

## Qoder visual and local live-feed checkpoint — 2026-11-09 09:39 EET

| Test | Exact SHA/environment | Result |
|---|---|---|
| Site visual sweep | Site `e26c598...`; Chrome/Playwright 390×844; local `:4202` | Landing/login/search/autocomplete/results/route map/navigation/transport map/trips/profile/settings; 0 console/page errors; no horizontal overflow. Qoder reports four passes; screenshots remain local under `/tmp`. This is not current-main acceptance. |
| City autocomplete | Server `dc1eae7...` local `:3002`; sample `Львів` | Six suggestions; local sample only. |
| Lviv live bus map | Server `dc1eae7...` + Site `e26c598...`; selected Lviv city | 23 live GPS markers, ages 9–30 s; A01/A34 moved 13 m/27 m between polls; 72 routes/1,071 stops in schedule layer. Local live map evidence for buses in Lviv only. |
| A21 active journey overlay | Same local pair; active journey | No fresh matching vehicle after 32 polls; segment remained `SCHEDULED / no_fresh_matching_vehicle`. No incorrect vehicle was substituted. |
| Three strategies / all 12 route-to-UI | Same local pair | NOT_TESTED / NOT_VERIFIED_END_TO_END. No evidence from this visual sweep can promote all 12 modes. |
| Current-main Site visual | Detached worktree `411cb45794d70ce744f64099d4d9d3b19d71588a` | NOT_TESTED — deferred at 30% free RAM and elevated system load. |

Historical 09:39 EET branch reconciliation (updated below): Site Qoder HEAD is 6 commits behind and 6 ahead of live main; Server Qoder HEAD is 7 behind and 2 ahead. PR #119 must not be merged wholesale. Its safe Server changes were selectively corrected and integrated by PR #120; the current status and exact-main feed evidence are recorded in the 09:56 EET checkpoint below. Qoder worktrees remained clean; no local code, DB, provider configuration, or deployment state was changed.

## Current-main Qoder reconciliation and feed probe — 2026-11-09 09:56 EET

| Gate | Exact SHA / environment | Evidence | Result |
|---|---|---|---|
| Qoder Server safe-port integration | PR #120 merge `d8c25a560187a89aaa42422d602802854c19c694`; current main `4db6e97b392cb9f01e07fea035b8346826119333` | PR #120 merged; current-main ancestry verified; readiness helper returns healthy for every optional-geocoder state; conservative stop-selection flag and tests present. Exact-head CI runs `42478373561`, `42478413105` passed. | INTEGRATED; CI_VERIFIED; live route acceptance still incomplete |
| Qoder Server PR #119 | head `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3` | GitHub says open/unmergeable. CI runs `42476455663`, `42476461798` passed; Lviv acceptance `42556382366` failed. | Do not merge; safe portions already ported by #120 |
| Current-main feed catalog | Server `4db6e97b392cb9f01e07fea035b8346826119333`; run `42570088420` | 88 selected, 83 probed, 5 skipped by policy; 48 healthy, 14 degraded, 21 offline. | SOURCE_PROBE_VERIFIED only |
| Current-main Lviv route planner | Same SHA/run | Bus A21 → tram T04 candidate found; both corridors returned 10 results but flags remained for stop selection, graph, pool, sampling and response page. | ROUTES_FOUND; SEARCH_INCOMPLETE; no 3-leg or UI proof |
| Qoder local UI/API | Site `e26c598572a0b032d1cd8f6503e65902f45ae387`, Server `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3` | Current localhost read-only smoke: search 200, `/readyz` 200, city autocomplete six suggestions. Runtime `/version` currently has null build identity; Git worktrees are clean. | LOCAL_SMOKE_ONLY; not pinned release evidence |

Current resource gate during the recheck: 35 GiB disk free; RAM sample varied 31–44%; Docker Virtualization was actively consuming >170% CPU. No local build/browser suite was launched, no Qoder process was stopped, and no code/feed/database change was made. Production remains `NOT_RELEASED`.


## 2026-11-09 11:02 EET — exact-head CI green and paired Site→Server request contract passes

- Site PR #118, commit a59b67646e80519eaa8a8e7810dae24248406bd4, run 42589422740: SUCCESS. CI completed lint, typecheck, all Site unit tests, token check, production build, bundle/single-React checks, Chromium setup and boot-smoke.
- Server PR #126, commit 39d76899ee829bced26212ab3f8609c2c0d058ea, run 42589392341: SUCCESS. CI completed audit, lint, typecheck, full unit tests, database migrations, integration tests, production API image build, PostGIS/Redis smoke and local Compose lifecycle E2E.
- One-time paired contract probe directly called Site toJourneyPreferences then Server parseJourneySearchRequest from these exact worktrees. It preserved bike+scooter+train and accepted only the explicit scooter provider filter (scooter:zelectra becomes zelectra). This proves request-shape compatibility at the source/parser boundary, not an HTTP provider-backed journey or browser route.
- PRs remain draft: Server #126 https://github.com/dima1203oleg/MarshGO-Server/pull/126; Site #118 https://github.com/dima1203oleg/MarshGO-Site/pull/118 (depends on #126). No main merge, staging deploy, production deploy, or Qoder change. Qoder Site :4202 and Server :3002/readyz still returned HTTP 200 on recheck.
- Feed scope remains partial: Lviv bus live-map observation on Qoder; one Kyiv scooter GBFS snapshot reached parser/nearby/map-model on identical-main files, but not API/DB/Site/booking. Transit feeds are schedule-partial; several categories remain offline/credential/contract blocked. All 12 are NOT_VERIFIED_END_TO_END.
- Latest resource sample at 11:00: 33 GiB free disk, 40% free RAM, 4,434 MiB swap used, load 2.31/3.13/3.75. No further heavy local task started. Browser visual inspection remains unavailable while the Mac is locked.
- Next: keep Qoder as the known-good preview. Run an exact-pair journey smoke only on a newly isolated disposable database/feed snapshot; do not touch Qoder shared data. Then verify rendered map/navigation and pages. Only then make these draft PRs merge candidates.


## 2026-11-09 11:04 EET — route-oracle fixtures and runtime-version caveat

- On Server head 39d76899ee829bced26212ab3f8609c2c0d058ea, `node --import tsx --test tests/route-engine-oracle.test.ts tests/journey-search-completeness.test.ts` passed 11/11 (0 failed/skipped), including FASTEST vs BALANCED tradeoffs, known-fare CHEAPEST, unknown fare not ranking as zero, infeasible transfers, a feasible 3-segment small-graph chain and truthful truncation flags. These are deterministic fixture/oracle tests, not live route completeness.
- Local Node is v25.4.0 while both repos pin Node 24.21.0. Treat local test/build results as supplemental only. Exact-head GitHub CI runs 42589422740 (Site) and 42589392341 (Server) pass under workflows pinned to Node 24.21.0; Server CI includes full unit/integration, migrations, image, PostGIS/Redis and Compose lifecycle steps.
- Decision register: Server PR #126 and dependent Site PR #118 remain `NEEDS_REVIEW` / draft despite green CI; the missing proof is exact-pair HTTP route → response geometry → rendered map/navigation on an isolated runtime.
- Qoder stays clean and online; `GET :4202/journeys/search` and `GET :3002/readyz` returned 200. No code from these PRs is deployed or merged.
## Evidence delta — 2026-11-09 11:24 EET

| Gate | Result | Exact evidence | Limit |
|---|---|---|---|
| Qoder Web/API smoke | PASS for local development availability | Site `411cb45794d70ce744f64099d4d9d3b19d71588a` at `:4202`; API process cwd at Qoder Server `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`; search page, `/readyz`, `/places/suggest?q=Львів` via Site proxy return 200 | Runtime build ID/SHA absent; not staging/release acceptance |
| Twelve-mode selector behavior | PASS in focused component render | Site candidate `01f899369c512e87a4173edf56d897f877b545a2`; 21/21 focused tests; all 12 selected modes accepted by paired Server parser | Fixture/source boundary only; current Site CI still running |
| Mode provider discovery | PARTIAL | Region snapshots in `PRODUCTION_PROVIDER_MATRIX.md` | Catalog rows do not prove routes, geometry, fare, live availability, or booking |
| Exact-pair route→geometry→map | NOT TESTED | No compatible disposable runtime/visual browser control in this checkpoint | Do not merge dependent PRs or claim end-to-end readiness |
| Twelve complete user journeys | NOT VERIFIED | No category has current complete route→UI acceptance in this checkpoint | Release remains `NOT_RELEASED` |
## Evidence delta — 2026-11-09 11:30 EET

| Gate | Result | Evidence | Limit |
|---|---|---|---|
| Site selector + design contracts | PASS locally on current source | `e80d0472d5fde501865ad8bac1ca0e9cdd36a883`; 48 targeted tests pass, ESLint/diff-check pass | Local Node v25.4.0; targeted tests only |
| Current-head Site CI | PENDING | GitHub runs `42593815323`, `42593808907` | Prior head failed an outdated source-string assertion; rerun covers the updated assertion |
| Qoder runtime | UNCHANGED | Site `411cb45794d70ce744f64099d4d9d3b19d71588a`; Server `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3` | No exact build identity; development only |
| Exact-pair route→geometry→map | NOT TESTED | Not run | Release remains NOT_RELEASED |

## Evidence update — 2026-11-09 09:41 UTC

| Gate | Result | Evidence | Limit |
|---|---|---|---|
| Local web/API HTTP smoke | PASS (development only) | Qoder Site `411cb45794d70ce744f64099d4d9d3b19d71588a` at `:4202`; Qoder Server process SHA `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3` at `:3002`; search, readiness and Lviv place suggestions returned HTTP 200 | Runtime API version lacks build identity; no visual verification because IAB automation is unavailable; not staging/production |
| Server PR #126 exact-head CI | PASS | Head `d181af6afaf32c2076e762e1cf35a8a5d8218135`; runs `42594262395`,`42594255710` passed audit/lint/typecheck/tests/migrations/integration/image smoke/lifecycle | Draft; route acceptance on paired candidate still required |
| Site PR #118 exact-head CI | PASS | Head `e80d0472d5fde501865ad8bac1ca0e9cdd36a883`; runs `42593815323`,`42593808907` passed Site CI | Draft; exact-pair runtime/map acceptance still required |
| Provider source probe | PARTIAL | Run `42570088420`, Server SHA `4db6e97b392cb9f01e07fea035b8346826119333`; 83/88 sources probed: 48 healthy, 14 degraded, 21 offline, 5 skipped | Feed health does not prove route, UI, commercial permission, price, availability, or booking |
| 12 transport categories | NOT VERIFIED END-TO-END | Regional live provider inventory and category-specific source limits in `PRODUCTION_PROVIDER_MATRIX.md` | Several modes unavailable or blocked; do not claim all 12 operational |

## Evidence update — 2026-11-09 10:29 UTC — provider status merge and selector dependency

| Gate | Result | Evidence | Remaining requirement |
|---|---|---|---|
| Provider reseed preserves operator status | INTEGRATED / CI_VERIFIED | Server PR #127 merged as `a2bc6c753b8e452f040e545dddbee5b34d7166a9`; exact-head CI runs `42597489068`,`42597483399` passed | No DB execution in this checkpoint; verify in isolated disposable DB before operational seed run |
| Rental provider filters scoped by mode | PENDING | Server PR #126 refreshed to head `7f4d94d0786442626407e1d36f58a3c32531553c`, base `a2bc6c753b8e452f040e545dddbee5b34d7166a9`; CI `42601025099`,`42601030862` in progress | Wait exact-head checks; then authenticated paired HTTP acceptance |
| All transport categories stay selectable and are submitted | FIXTURE/CI VERIFIED, not live | Site PR #118 exact head `e80d0472d5fde501865ad8bac1ca0e9cdd36a883`; CI `42593815323`,`42593808907` passed | Draft; depends on Server #126 parser for `allowedProviderIdsByType`; verify paired request/route/map |
| Current Qoder Web/API available | LOCAL_HTTP_SMOKE | Site `411cb45794d70ce744f64099d4d9d3b19d71588a` and Server `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`; search and `/readyz` returned 200 | Visual, authenticated user journey and build identity not verified; Qoder remains on pre-merge code |
| Twelve transport modes end-to-end | NOT_VERIFIED_END_TO_END | Direct source results and per-mode gaps in `PRODUCTION_PROVIDER_MATRIX.md` | Several source, license, availability, endpoint and operator blockers remain |
| Exact six-SHA release / staging / production | NOT_READY / NOT_RELEASED | Existing `docs/RELEASE_MANIFEST.json` is an older review-only tuple and does not include the new Server main merge | Rebuild and accept a pinned six-SHA tuple; staging, restore, rollback and owner-authorized deployment remain outstanding |

Resource note: `/` 34 GiB free; system memory free 29%; encrypted swap ~3,970 MiB. No local heavy build/test/browser task was started.
| Lviv route completeness | FAIL / TRUNCATED | Same artifact: two planner cases each returned 10 routes with stop-selection, graph, pool/sampling and page truncation | Search/step budget flags false; investigate measured bounds before release |
| Exact-pair route→geometry→rendered map | NOT TESTED | No isolated paired runtime or visual screenshot on current candidate | Keep PRs draft; do not merge/deploy on CI alone |

### Feed source refresh — 2026-11-09 09:47 UTC

| Gate | Result | Evidence | Limit |
|---|---|---|---|
| Latest catalog probe | PASS (read-only source probe) | Server main SHA `4db6e97b392cb9f01e07fea035b8346826119333`, run `42595606467`, sample `09:44:36Z`; 83/88 probes, 48 healthy / 14 degraded / 21 offline / 5 skipped | Healthy means source response/probe health only |
| Kyiv marshrutka position feed | PARTIAL / not a route feed | 137 fresh timestamped `vehicles_bus` from Kyiv Dozor JSON | No confirmed marshrutka classification, route geometry or timetable; official routeTaxi GeoJSON download currently DNS-blocked |
| Kyiv metro/funicular sources | BLOCKED at source download | Probe artifact reports `Host cannot be resolved` on official resource endpoints; metadata pages remain listed | No usable imported schedule/geometry while download host is unreachable |
| Kyiv scooter feed | PARTIAL live inventory snapshot | 987 GBFS vehicles, 0 stations in same probe | No verified return geofence, user availability or booking |
| All twelve modes | NOT VERIFIED END-TO-END | Regional provider table | Do not infer routes or bookings from feed health/counts |

### Provider-registry seed safety — 2026-11-09 10:02 UTC

| Gate | Result | Evidence | Limit |
|---|---|---|---|
| Existing provider status preservation | LOCAL_TESTED | Server PR #127 head `dc69252a48bd2d0a164ee3ab19db564e510bddd9`; typecheck passed; seed-scope/status suite 5/5; targeted lint/diff check passed | Unit tests and code review only; CI pending; no DB invocation in this checkpoint |
| Feed health after transient outage | NOT YET RUNTIME_VERIFIED | Offline feed remains excluded by health filters while its enabled registry status is preserved for monitor retries | Requires isolated seeded DB and an outage/recovery integration test |


### Current integration checkpoint — 2026-11-09 10:42 UTC

| Gate | Result | Evidence | Limit / next step |
|---|---|---|---|
| Server provider-status and per-mode filter changes | MERGED / CI PASS | Server #127 `a2bc6c753b8e452f040e545dddbee5b34d7166a9`; #126 `3d53e33b26f5c147dc437d56e92596828a72d1f7`; exact-head runs recorded in `CODEX_PROGRESS.md` | Not yet loaded into or exercised against Qoder's pinned runtime |
| Selected transport modes retained in Site search | MERGED / CI PASS | Site #118 `b2f20d7ad3b2bc1a724d7050601ee1f51432c3c7`; exact-head runs recorded in `CODEX_PROGRESS.md` | Selector/API contract does not prove route availability for all categories |
| Qoder Site/API preview | LOCAL HTTP SMOKE PASS | `:4202/journeys/search` and `:3002/readyz` returned HTTP 200; runtime SHAs are older than current main | Qoder's feature sweep is still running; browser checks deferred below memory guard |
| Walking route geometry | BLOCKED | Router containers mount an empty graph directory; intact graph files are elsewhere and not modified | Correct only the owned compose mount, wait for >=35% free RAM, then verify OSRM foot `LineString` and API leg geometry |
| Twelve transport categories | NOT VERIFIED END-TO-END | Provider evidence and limitations in `docs/PRODUCTION_PROVIDER_MATRIX.md` | Need source→route→geometry→render evidence per category/region |
| Release | NOT_RELEASED | Exact six-SHA acceptance, staging, backup/restore and rollback not completed | Keep historical manifest unchanged until a complete candidate passes |


### Qoder follow-up — 2026-11-09 10:49 UTC

| Gate | Result | Evidence | Limit / next step |
|---|---|---|---|
| Canonical Site unit suite | PASS | Qoder Site SHA `411cb45794d70ce744f64099d4d9d3b19d71588a`; 583 pass, 0 fail, 0 skipped; output `/tmp/mg-site-suite.txt` | Does not prove page-by-page rendering, API integration, or live feeds |
| Guest functional matrix | IN PROGRESS | Qoder acknowledged an auth-safe guest-only scope | Review results and tested pages after Qoder completes; visual browser pass remains unrun |
| Authenticated screens | BLOCKED | Qoder will not use credentials found in source/temp/env or create a test account | Requires an already-authenticated, owner-provided session to test |
| Walking geometry | BLOCKED / FOLLOW-UP ACTIVE | Missing foot graph mount; router containers restart; exact graph files preserved | Inspect compose ownership and repair only the owned mount after stable >=35% free RAM |
| All 12 modes | NOT VERIFIED END-TO-END | Existing provider matrix | Each needs source→journey→geometry→render evidence |
## 2026-11-09 16:25 EET — supported-runtime CI and isolated-runtime readiness

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Exact Server main CI | GitHub run `42625658864`, exact SHA `aa9196ccee4fe0d05e4ce2669933b0d8305b47cc`, completed `success`; Node `24.21.0`; lint, typecheck, unit, migration, integration, image build and PostGIS/Redis smoke steps passed. | CI_VERIFIED | Does not prove active `:3002`, browser search, authenticated journey, or staging. |
| Local Photon adapter unit run | 24/24 passed using `tsx --test tests/geocoding.test.ts`, exact source worktree `aa9196c...`, but host Node was `25.4.0`, outside declared engine. | SUPPLEMENTARY_ONLY | Exact-SHA CI above supplies supported Node proof; don't count local Node 25 run as release acceptance. |
| Isolated local DB readiness | `ops/staging/docker-compose.yml` declares PostGIS/Redis on unused `15434`/`16380`; image cached. | PREPARED_NOT_STARTED | Requires local-only passwords and project-scoped persistent volumes; resources at 31% RAM free, so do not start until >=35%. |

## 2026-11-09 18:28 EET — live compact-card check

| Check | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Compact result-card time row | Canonical Site main `05f55210c9bf92cf863217516cf218a3d62cb547`; Vite `:7777` PID `59193`, page HTTP 200, current transformed panel has no time-window row/formatter; per-leg times remain in details. | SOURCE_AND_RUNTIME_MODULE_VERIFIED | Existing browser DOM may be stale. User must refresh; UI automation unavailable, so visual acceptance is not claimed. |

## 2026-11-09 18:25 EET — search and Lviv runtime recheck

| Check | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Compact-card time row | Exact Site main SHA `05f55210c9bf92cf863217516cf218a3d62cb547`; Vite `:7777` module HTTP 200 and no `journey-result-window`; exact times remain in route details. | SOURCE_AND_RUNTIME_MODULE_VERIFIED | Browser DOM not visually reloaded; user tab needs refresh; visual acceptance not claimed. |
| Search provider preference | Active old Server parser rejected `allowedProviderIdsByType`; bounded `bike`/`scooter` parser support backported from current Server main to the previously clean local file; API `/readyz` HTTP 200 after restart. | LOCAL_PATCHED / SEARCH_NOT_TESTED | Current Server runtime still reports null build SHA; rerun authenticated search on a pinned Server candidate. |
| Lviv GTFS and realtime | DB report: 72 static routes (64 bus/8 tram), 1,071 stops, 15,141 trips; RT positions 424 (391 fresh, 7 s) marked degraded; trip updates 459, 16 s, healthy. | FEED_METADATA_VERIFIED | No minibus/trolleybus route counts in current import; no city-wide 12-mode journey acceptance. |
| Lviv scooter / bike | Zelectra GBFS v3 live system identifies Kyiv and returned no Lviv vehicle or geofence records; DB Zelectra row is Kyiv/degraded. Lviv provider list has no scooter; BikeNow is represented by static OSM estimate. | COVERAGE_LIMITED | Do not label Zelectra or OSM estimate as live Lviv availability; request/public feed or operator integration required. |
| Lviv pedestrian routing | Foot router `:3013` returned a routed sample path 3,931.8 m, 2,838.5 s, 201 coordinates; local ignored Server `.env` now names `WALKING_ROUTING_URL`. | ROUTER_LIVE_VERIFIED / APP_ROUTE_NOT_TESTED | Verify a real API journey and rendered map geometry on a pinned candidate when resource headroom permits. |


## Evidence update — 2026-11-09 19:52 EET

| ID | SHA/environment | Command / input | Result | Scope/status |
|---|---|---|---|---|
| SEARCH-PLACE-LOCAL-2026-11-09 | Site `bc29206734dd9e0e958b39393eaa60929116e9ac` at `http://127.0.0.1:7777`; proxied API `:3002` reports unknown build SHA | `GET /api/v1/places/suggest?q=Львів` through the Site origin | HTTP 200; six suggestions | `LIVE_AUTOCOMPLETE_VERIFIED`; journey routing, authenticated response, and map geometry remain `NOT_TESTED` |
| WALK-ROUTER-SAMPLE-2026-11-09 | Configured local foot-router endpoint; API runtime SHA unknown | One generic Lviv foot-route request | HTTP 200 `Ok`; 201 geometry points | `PROVIDER_SAMPLE_VERIFIED`; not evidence of API persistence or Site rendering |


## 2026-11-09 21:42 EET — Qoder Site PR and Lviv transport runtime

| Check | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Qoder Site PR #122 | Base `bc29206734dd9e0e958b39393eaa60929116e9ac`; head `a9a5f84a4786a5f319f205a058abea1f01a09e8c`; open/clean; exact-head checks `42685005919` and `42685039922` passed. Qoder reports typecheck exit 0 and 47/47 focused tests. | CI_PASS; LOCAL_TEST_QODER_REPORTED; VISUAL_NOT_TESTED | Visual check deferred at 28% free memory. No merge. |

### 2026-11-09 21:49 EET — Tandem runtime/provider checkpoint

| Gate | Evidence | Status | Next action |
|---|---|---|---|
| Qoder chain-mode participation | Qoder UI reports a read-only subtask `Map journey chain mode participation` running; exact result has not returned. | IN_PROGRESS | Wait for the source SHA, planner response, filters and truncation evidence before overlapping routing edits. |
| Shared zrok provider registry | Read-only GET to `/api/v1/mobility/providers?lat=49.794117&lon=24.057585` returned HTTP 200; Lviv bus/tram entries present, marshrutka/trolleybus/scooter entries absent. `/healthz` and `/readyz` returned 200 without build identity. | LIVE_METADATA_ONLY; RUNTIME_SHA_UNKNOWN | Identify runtime and DB/import before updating any feed; metadata is not live vehicle or journey proof. |
| Lviv trolleybus | Current isolated feed report has 9 trolleybus routes and Server main has explicit route-label classification; shared runtime provider registry omits trolleybus. | INCONSISTENT_RUNTIME_DATA; BLOCKED_FOR_REIMPORT | Validate in a disposable exact-main DB and compare importer report to provider registry; do not mutate active DB. |
| Lviv tram chain | Provider/feed entry appears, but no exact current planner response establishes route inclusion. | NOT_VERIFIED | Qoder to return feasibility/filter/truncation evidence. |
| Lviv active provider registry `:7777` | Read-only GET `/api/v1/mobility/providers?lat=49.794117&lon=24.057585` returned HTTP 200 with bus+tram; no trolleybus, marshrutka, or scooter. | LIVE_REGISTRY_PARTIAL | The API build is the old dirty Server runtime; provider registry is not route feasibility evidence. |
| Lviv GTFS on isolated main-based import | Qoder reports source `track.ua-gis.com/gtfs/lviv/static.zip`, CC BY 4.0, 72 routes: 55 bus, 9 trolleybus, 8 tram. | ISOLATED_FEED_IMPORT_REPORTED | Not an exact paired API→planner→map acceptance. Reproduce on clean candidate when resources permit. |
| Trolleybus classification | Visible result `Тр24` rendered as bus on old runtime `e9934ab...`; protected Server main `449bc79...` includes PR #129 explicit-label mapping. | REGRESSION_CAUSE_IDENTIFIED | Reimport/verify in clean candidate; do not restart unknown active DB. |
| Tram in requested route search | Provider and isolated feed exist, but no tram leg seen in observed result set. | NOT_VERIFIED | Capture exact planner response, saved mode preferences and truncation diagnostics. |
| Lviv marshrutka and scooter | No distinct marshrutka source verified; Zelectra public GBFS reports no Lviv vehicles. | UNAVAILABLE_WITH_CURRENT_SOURCES | Do not synthesize or relabel other categories. |
| Default Site transport selection | `defaultSelection` includes all 12; serializer sends active types without endpoint-coverage trimming. | SOURCE_VERIFIED | User's persisted local selection was not inspected. |

### 2026-11-09 22:14 EET — Qoder tandem and Server mode-composition candidate

| Gate | Evidence | Status | Remaining proof |
|---|---|---|---|
| Qoder Site PR #122 | Last verified head 30522bb3bb32af2e06f1a206d4cfcfb6b604f2f5; exact-head CI 42687812164 and 42687801811 passed; Qoder reports 58/58 focused checks. Qoder is now editing map focus/motion in the same worktree. | CI_PASS at last pushed head; CURRENT_WORK_IN_PROGRESS | Capture final exact SHA and browser visuals after Qoder finishes; no merge yet. |
| Server micromobility + transit | Isolated Server candidate based on 449bc79a6ebfbc1eae2591ac5dd1353de8b98952 broadens bike/scooter composition from metro-only to selected GTFS modes using bounded transfer stops. | IMPLEMENTED_UNCOMMITTED; LOCAL_TEST_NOT_RUN | Focused tests and typecheck remain deferred under 28% free RAM. |
| Lviv scooter honesty | Candidate requires fresh available scooter inventory in route corridor and a pickup satisfying GBFS start rules; Kyiv-only assets cannot establish Lviv availability. | IMPLEMENTED_UNCOMMITTED | Unit tests not run; current public source evidence still has no Lviv scooter inventory. |
| Route mode completeness | New helper counts carpool only when real corridor offers exist; GTFS types and micromobility require observed provider data. | IMPLEMENTED_UNCOMMITTED | Focused completeness tests and API integration acceptance pending. |
| Shared live journey chains | Provider registry endpoint was HTTP 200, but no exact authenticated planner response at pinned runtime was captured for tram/trolleybus. | NOT_VERIFIED | Identify runtime SHA/DB and obtain a disposable exact-SHA environment. |

### 2026-11-09 22:19 EET — Qoder exact-head map acceptance

| Gate | Evidence | Status | Remaining proof |
|---|---|---|---|
| Qoder Site PR #122 exact head | 21ec8af43a18c79c54d80b1f0565733aebb4ca2b, branch clean, PR OPEN/CLEAN, exact-head verify runs 42690662130 and 42690672152 pass. Qoder reports 605/605 tests, typecheck, build and bundle checks. | CI_PASS; QODER_LOCAL_CHECKS_REPORTED | Visual browser acceptance remains NOT_TESTED at 28% free RAM; no merge. |
| Codex Server chain-mode candidate | Base 449bc79a6ebfbc1eae2591ac5dd1353de8b98952; nine files uncommitted; diff/syntax checks pass. | LOCAL_TEST_NOT_RUN | Focused unit tests and typecheck deferred by resource gate. |

### 2026-11-09 22:41 EET — Lviv feed and route-type candidate

| Gate | Evidence | Status | Remaining proof |
|---|---|---|---|
| Server stale-feed prefilter | Candidate no longer filters spatial GTFS providers by cached per-mode counts; regression fixture models stale trolleybus count. | IMPLEMENTED; STATIC_CHECKS_PASS | Focused tests and exact-SHA planner replay not run. |
| Bus vs marshrutka | Generic type-3 journey legs become `bus_unspecified`, still selectable as bus; type 1501 and explicit unambiguous marker map to marshrutka. | IMPLEMENTED_UNTESTED | Run tests; verify actual Lviv feed route types and neutral Site label. No Lviv marshrutka route proven. |
| Micromobility + selected transit | Candidate removes Metro-only gate and uses bounded served stops; scooter needs fresh local inventory/rules. | IMPLEMENTED_UNTESTED | Unit tests and route-level geometry/availability acceptance not run. No Lviv inventory proven. |
| Qoder Site API contract | Read-only audit at Site `21ec8af43a18c79c54d80b1f0565733aebb4ca2b`; explicit 12-mode request confirmed; neutral `bus_unspecified` label missing. | CONTRACT_REVIEWED; UI_ALIAS_PENDING | Qoder to add alias/test after current visual task. |
| Unified Lviv journey | Shared registry lists bus/tram only, has no build SHA; isolated import reports 55 generic bus-class, 9 trolleybus, 8 tram. | NOT_VERIFIED_END_TO_END | Pin runtime/disposable DB; prove dated routes, geometry and Site rendering for each claimed mode. |
| Resource/test gate | Disk 27 GiB, RAM free 31%, encrypted swap 8.14 GiB used; Server worktree lacks installed dependencies. | HEAVY_CHECKS_DEFERRED | Run focused tests then typecheck as separate processes after resource gate. |

### 2026-11-09 23:04 EET — Qoder MAP & ROUTE MOTION 3.0 (work in progress)

| Gate | Evidence | Status | Remaining proof |
|---|---|---|---|
| Existing camera foundations | Qoder read-only audit at Site base `21ec8af43a18c79c54d80b1f0565733aebb4ca2b` reports visible-map-area fitting, reveal along real geometry with cancel/cleanup, segment focus modes and gesture interruption; cites 35 existing map tests. | QODER_AUDIT_REPORTED | Fresh exact-worktree map tests and visual route acceptance not yet provided. |
| Adaptive camera duration | Qoder's dirty Site worktree wires distance/zoom/bearing-aware duration into four MapLibre camera paths; Qoder reports 26/26 targeted tests and typecheck exit 0. | IMPLEMENTED_IN_WORKTREE; CHECKS_REPORTED | No final commit SHA; inspect exact diff and reproduce checks at final head. |
| Fresh vehicle-position glide | New `vehicleMotion.ts` and `vehicle-motion.test.ts` are present; focused test command running; adapter integration not yet observed. Input gates require ≤90 s fix age, ≤20 s interval and ≤400 m displacement; coordinates are currently interpolated linearly. | IN_PROGRESS | Capture test result, wire adapter, verify no stale/reduced-motion animation, route/road adherence, bearing/noise handling and cancellation. |
| Visual map acceptance | Qoder reports guest home rendered at 393×852; browser connector could not see owner's Chrome window. | PARTIAL; MAP_NOT_TESTED | Authenticated route, walking geometry, reveal, focus, bottom-sheet interaction, light/dark map and navigation screenshots or video. |
| Resource/process gate | At 23:04 EET: disk 27 GiB free, memory 30% free, swap 8,364.75 MiB, load 3.48/4.38/4.76; Qoder test active. | NO_COMPETING_CODEX_HEAVY_TASK | Keep one-heavy-task rule; canonical free-memory minimum is 20%, but wait for Qoder's active test and recheck contention before starting any local heavy check. |

### 2026-11-09 23:06 EET — vehicle-motion adapter integration update

| Gate | Evidence | Status | Remaining proof |
|---|---|---|---|
| Vehicle-motion pure helper | Qoder reports `vehicle-motion.test.ts` passes 10/10 in the isolated Site worktree. | HELPER_TEST_PASS_REPORTED | Exact final dirty-tree SHA and rerun after adapter integration. |
| MapLibre vehicle marker integration | Qoder is editing `MapLibreAdapter.ts`; current read-only snapshot has glide imports/state and a cancellation call, but the marker-update path is not yet wired and the cancellation method was not yet present. | IN_PROGRESS | Wait for final adapter diff; typecheck and focused tests at final state. |
| Vehicle data truthfulness | Helper gates on fresh fixes and bounded time/distance, then linearly interpolates coordinates. | REVIEW_REQUIRED | Demonstrate route/road alignment, bearing/noise behavior, reduced motion, stale-fix jump, and animation cancellation; straight-line interpolation alone is not road-following evidence. |
| Map visual acceptance | No route/map screenshot or authenticated journey was reported. | NOT_TESTED | Verify route geometry, visible viewport, reveal, focus and sheet interaction on a real route. |

### 2026-11-09 23:11 EET — Qoder MAP & ROUTE MOTION candidate

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Exact Site candidate | Qoder pushed `9d8cb7bc456599c995b09d57bd4a1a0303fc7a53` to PR #122 (`qoder/design-canvas-20261109`); 7 files, +358/−9; isolated worktree clean. | PUSHED; OPEN | Review diff; not merged. |
| Local validation | Qoder reports typecheck, lint, 624/624 tests (57 suites), build, and `check:bundle`; 16 chunks ≤350 KB. | REPORTED_PASS | Await exact-head CI. |
| GitHub checks | Exact-head `verify` runs `42700038333`, `42700029299` were IN_PROGRESS; PR was OPEN/non-draft and BLOCKED at 23:11 EET. | PENDING | Recheck against this exact SHA. |
| Camera movement | Adaptive duration added for distance/zoom/bearing and called from four paths. `fitBounds` supplies center without a target zoom/bearing. | IMPLEMENTED_PARTIAL | Verify visible route behavior and whether target zoom must feed effort. |
| Transit vehicle motion | Fresh fixes only: age ≤90 s, ordered gap ≤20 s, displacement ≤400 m, reduced motion disables glide; cancel on new fix/null/destroy. | IMPLEMENTED; HELPER_TEST_REPORTED | Straight-line interpolation can cut across roads; no bearing/noise smoothing in this diff. Require truthful route-aligned evidence or revision. |
| Map visual acceptance | Qoder authenticated route-map verification is in progress; no result recorded. | IN_PROGRESS | Capture route, walk geometry, focus, gestures, sheet and theme behavior. |

### 2026-11-09 23:15 EET — exact-head CI follow-up

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Exact-head Site CI | PR #122 SHA `9d8cb7bc456599c995b09d57bd4a1a0303fc7a53`; verify runs `42700038333` and `42700029299` both SUCCESS; PR OPEN/CLEAN. | CI_VERIFIED | Does not replace visual route/map acceptance. |
| Authenticated browser check | Qoder reports dark home confirmed at 393×852 and search opened; next visible action is no-transfer control and route search. | PARTIAL | Capture actual journey map, walking geometry, focus/reveal, sheet gestures and console. |
| Resources | 23:15 EET: RAM free 28%, encrypted swap 8,634.62 MiB; Qoder browser work active. | HEAVY_TASK_RESERVED | No competing local build/test/browser. |

### 2026-11-09 23:23 EET — Qoder search and iPhone follow-up status

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Lviv search chain | Qoder UI reports Ploshcha Rynok → railway station, 19 min, 30 ₴; walk 1 min → tram T01 13 min → walk <1 min. API build SHA and visible map output were not captured. | QODER_REPORTED_LOCAL_SEARCH | Not independently verified live or visually; capture response provenance, map screenshot and pedestrian geometry. |
| iPhone 15/16 Pro Max rendering | User requested 430×932 and 440×956 CSS viewports at DPR 3, dark Safari/iOS WebView, safe areas and core interactions. Qoder reached model daily limit before this follow-up could be sent; all models disabled. | NOT_SENT / BLOCKED_BY_QODER_USAGE_CAP | Send when model access returns; distinguish emulation from physical device. |
| Qoder usage | UI says free daily limit reached; model selector options disabled. | BLOCKED | No upgrade/Credits used; owner approval needed before any paid usage. |

### 2026-11-09 23:26 EET — iPhone follow-up handoff

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| iPhone 15/16 Pro Max rendering | Full viewport checklist staged in Qoder composer, but `Send message` disabled by daily model usage cap. | STAGED_NOT_SENT | Send when model access returns; no Credits/upgrade used. |
| Route-map acceptance | Qoder-reported Lviv chain exists; exact API SHA and rendered map/pedestrian geometry absent. | PARTIAL; NOT_MAP_VERIFIED | Resume map/details check when Qoder can continue. |


## 2026-11-09 23:42 EET — Site map motion and mobile viewport evidence

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site motion integration | PR #122 Qoder head `9d8cb7bc456599c995b09d57bd4a1a0303fc7a53` merged to Site `main` SHA `3b481e44f392713704fe418bc17d84725e6acc79`; required exact-head and post-merge `verify` passed. Independent focused map tests: 36/36 passed. | MERGED / LOCAL_TESTED / CI_VERIFIED | Full release acceptance still requires exact API SHA and unified component matrix. |
| iPhone 15 Pro Max layout dimensions | Authenticated `:7777` browser viewport 430×932 CSS px: search, suggestions, 12 modes, results, details, route map and walk focus; no horizontal overflow. | BROWSER_EMULATED | Browser DPR 1.2, not 3; not Safari/WebView or physical device. |
| iPhone 16 Pro Max layout dimensions | Authenticated `:7777` browser viewport 440×956 CSS px: form, all 12 modes, compact result and route detail/map; no horizontal overflow; CTA reachable after scroll. | BROWSER_EMULATED | Dynamic Island/home indicator, keyboard, GPS and physical iPhone remain NOT_TESTED. |
| Lviv route and pedestrian geometry | Local preview returned 19 min, 30 ₴, 0 transfers; walk 1 min → tram T01 13 min → walk <1 min. Map rendered after tiles arrived; selecting walk focused/highlighted it; manual drag changed map. | LOCAL_PREVIEW_VISUAL | API `/api/v1/version` has null build/commit/environment/source identity; not LIVE_VERIFIED or exact-SHA integrated proof. |
| Maplibre style warning | One non-blocking missing `wood-pattern` image warning, no page errors; map tiles and route subsequently appeared. | OBSERVED_NON_BLOCKING | Decide whether optional style image should be registered or removed; no release claim from this warning alone. |
| Physical iOS acceptance | No physical iPhone / native Safari test performed in this handoff. | NOT_TESTED | Run on iPhone 15 Pro Max and 16 Pro Max before native iOS release. |

## 2026-11-10 00:00 EET — Qoder handoff and Server PR #131

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Qoder Site motion | PR #122 merged to Site main `3b481e44f392713704fe418bc17d84725e6acc79`; exact-head and post-merge CI passed; independent focused tests 36/36. | MERGED / TESTED | Browser-only viewport emulation; not physical iPhone. |
| 15/16 Pro Max layout | Authenticated local `:7777` checked at 430×932 and 440×956 CSS px, with search, results, map and pedestrian focus. | BROWSER_EMULATED | DPR measured 1.2; not iOS Safari/WebView, safe-area, keyboard, GPS, or physical-device evidence. |
| Qoder Server PR #119 | Geocoder/truncation/scoring changes were carried in merged PR #120, merge SHA `d8c25a560187a89aaa42422d602802854c19c694`; #119 closed after comparison with current main. | SUPERSEDED | Branch retained. |
| Server PR #131 | Head `e4d8a101779f9ae76579eaca5608069fb5633376`, base `449bc79a6ebfbc1eae2591ac5dd1353de8b98952`; targeted fixture tests 136/136; Node 24 typecheck and changed-file ESLint passed. | OPEN; CI PENDING | Exact-head verify checks `42708070674`, `42708121521` are still running; merge only after both pass and base is current. |
| Lviv live route/12 categories | No exact live Lviv feed import/planner replay or API build identity; no full bicycle/scooter transit-chain geometry was exercised. | NOT_TESTED | Fixture evidence does not prove live transport category coverage. |
| Performance/staging/production | No comparative performance, staging acceptance, deployment, production change, or physical iPhone test in this checkpoint. | NOT_TESTED / NOT_RELEASED | Continue separate release gates. |


## Server PR #131 post-merge status — 2026-11-10

PR #131 is **MERGED**, not open: feature head `e4d8a101779f9ae76579eaca5608069fb5633376` merged to Server `main` SHA `f61993013e5abf6fbf6afca96bc6eda3d0ff1c27`; remote main matches. Exact-head checks `42708070674` and `42708121521` passed. Post-merge run `42708728118` is **IN_PROGRESS** on the merge SHA: audit/lint/typecheck/full unit tests/migrations passed, integration tests are running, production image build and image/Compose smoke are pending. Therefore the post-merge CI gate is not yet PASS. Targeted local fixtures 136/136 passed; live feed replay, staging, full release acceptance and production remain NOT_TESTED / NOT_RELEASED.


## Server PR #131 CI completion — 2026-11-10

PR #131 is **MERGED**: feature head `e4d8a101779f9ae76579eaca5608069fb5633376` → Server `main` `f61993013e5abf6fbf6afca96bc6eda3d0ff1c27`; remote main matches. Exact-head runs `42708070674` and `42708121521` passed. Post-merge run [42708728118](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/42708728118) completed SUCCESS on that SHA, including audit, lint, typecheck, full unit and integration suites, DB migrations, API image build, PostGIS/Redis smoke, and Compose lifecycle. This is CI evidence only: live Lviv provider replay, full rental-chain geometry, staging, physical iPhone and production remain NOT_TESTED / NOT_RELEASED.


## Lviv transport category check — 2026-11-10 02:30 EET

On the current local API, provider-registry GET returned bus and tram metadata for Lviv; the 11-mode end-to-end search was not completed because the API reports no build SHA and its journey-search POST requires an authenticated session (unauthenticated probe returned 401). Registry-only rows for taxi, carsharing and transfer are not proof of an operator connection or booking. Marshrutka, trolleybus and scooter have empty Lviv provider groups; bicycle is marked static-estimate-only; carsharing names Kyiv/Dnipro; national rail and internal carpool have no verified Lviv itinerary. Metro is intentionally excluded. See the dated 11-category evidence table in `docs/PRODUCTION_PROVIDER_MATRIX.md`.

Targeted dirty-Server fixture/unit tests: 171 passed, 0 failed, 0 skipped across 16 routing/provider files on checkout HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, branch `antigravity/ukraine-12-transports-multimodal`, with local uncommitted changes. This is `FIXTURE_VERIFIED`, not `LIVE_VERIFIED`; current Lviv end-to-end transport acceptance remains NOT_TESTED and release remains NOT_RELEASED.


## Remaining Qoder release-validator blocker — 2026-11-10

- Qoder's root release-manifest validator PR [#20](https://github.com/dima1203oleg/MarshGO/pull/20) is still OPEN and stacked on PR #18, itself based on PR #12. Do not cherry-pick/merge it alone or bypass required CI.
- The Actions secret list confirms `MARSHGO_REPOS_READ_TOKEN` exists, but exact-head run `42265893827` fails at materializing private `MarshGO-Admin` with HTTP 403. Validator, lint, typecheck, root tests, ops tests, DB migration/integration, root build and bundle checks succeeded earlier in that run; release materialization failed, so image/E2E/browser-compat steps were skipped. CodeQL and Gitleaks passed.
- Qoder-reported offline ops suite 89/89 and diff-check passed on its candidate; this does not substitute for the failed required integrated CI. The credential pasted earlier in chat may be the configured token; rotate it, set a new least-privilege read-only credential for private Admin/Partner, then rerun the parent stack checks before review/merge. Do not reveal or reuse the exposed value.
- Site #122 and Server #131 are merged and their relevant CI is green. Root validator remains BLOCKED_EXTERNAL; production remains NOT_RELEASED.

## 2026-11-10 16:56 UTC — Fresh zrok service and place-suggest probe

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Existing zrok Site worktree is serving current route-model code | Local listener PID 59193 is Vite on 127.0.0.1:7777; both local and HTTPS zrok module responses include `isWalk: leg.mode === "WALK"`; saved journey HTML returns 200. | SOURCE_DELIVERY_VERIFIED | This confirms source delivery only, not a rendered map or authenticated journey. |
| zrok API health | `/healthz` → 200; `/readyz` → ready with database/realtime connected. `/api/v1/version` returns environment `development`, sourceState `unknown`, null commit/build identifiers. | DEV_SERVICE_READY_UNPINNED | Not staging or a release tuple. Establish exact API source/build identity before route acceptance. |
| Place autocomplete | Generic `GET /api/v1/places/suggest?q=Lviv` returned six normalized suggestions; sample is Львів, 49.841952, 24.0315921. No personal address or account was used. | API_SUGGEST_PARTIAL | Response does not expose its upstream provider or rights/freshness; provider-backed journey, autocomplete UI, and address privacy are not verified. Photon public demo is expressly non-guaranteed and may throttle/ban extensive usage; it is not an acceptable production dependency. |
| Authenticated route→geometry→navigation flow | Server route-search source is guarded by `requireAuth`; existing Codex browser bridge still returns `browser.user is unavailable`. No account, credentials, or user session was read or created. | BLOCKED_NOT_TESTED | Need browser control or owner-operated sign-in and an exact pinned API build. Then run a fresh provider-backed search and navigation. |
| Browser geometry visual acceptance | The existing IAB tab cannot be attached through the current CUA bridge. | NOT_TESTED | Retry only when bridge works and resource gate is safe; screenshot required. |

## Current dirty Site geometry checkpoint — 2026-11-11 00:09 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Geometry sanitization and line labels | On Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, dirty checkout based at `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`: geometry suite at 00:04 passed 34/34; subsequent `route-map-annotations.test.ts` passed 8/8 after removing fallback walk-label chords. | FIXTURE_VERIFIED | Does not prove live-provider geometry or visual quality. |
| Site type/lint/integrity | `npm run typecheck` passed after the annotation change; targeted ESLint on `src/views/routeMapAnnotations.ts` and `tests/route-map-annotations.test.ts` passed; `git diff --check` passed. | SOURCE_VERIFIED | The current checkout is dirty and uncommitted; rebuild/CI exact-head evidence remains pending. |
| zrok HTTP forwarding | HTTPS zrok root and local `127.0.0.1:7777` both returned 200 with the same ETag; existing PIDs 33510 (zrok) and 59193 (Vite) were not restarted. | SOURCE_DELIVERY_VERIFIED | HTTP forwarding does not prove authenticated route/API rendering. |
| Signed-in map visual acceptance | CUA tab attachment tried against both existing IAB records and returned `browser.user is unavailable`; no credentials or session were touched. | NOT_TESTED | Need the browser-control bridge to inspect rendered geometry, console/network, and capture a screenshot. |
| Resource gate | Before targeted typecheck: 21 GiB disk free, RAM free 37%; after at 00:09: 21 GiB free, RAM free 39%, encrypted swap 10,660.62 MiB, load 2.50/3.21/3.16. | OBSERVED | No cleanup or process/service changes. Production remains `NOT_RELEASED`. |

## Current zrok API runtime checkpoint — 2026-11-11 00:13 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| zrok Server readiness | `/healthz` 200; `/readyz` 200 with database and realtime connected. | DEV_SERVICE_READY | Development only; readiness does not prove a provider-backed journey. |
| API build identity | `/api/v1/version` returns API v1 and environment development, but `buildId`, `commitSha`, `builtAt` are null and `sourceState=unknown`. PID 66637 runs from canonical Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, whose worktree is dirty. | UNPINNED | Exact loaded snapshot cannot be proven. Build/launch an exact clean candidate and verify metadata before release acceptance; do not restart the current service in this checkpoint. |
| Browser-authenticated route flow | Codex CUA attachment to existing signed-in zrok tab returns `browser.user is unavailable`. | NOT_TESTED | No auth bypass or credentials touched. Reconnect browser control, then perform route search→selection→geometry→navigation. |
| Resource checkpoint | 20 GiB free disk, RAM free 45%, encrypted swap 10,968.56 MiB, load 3.64/3.34/3.21. | OBSERVED | No process/cache changes; release remains `NOT_RELEASED`. |
## 2026-11-11 — zrok and provider availability checkpoint

| Requirement | Evidence | Status | Boundary / next action |
|---|---|---|---|
| zrok transport to current Site | Public root and journey SPA shell return HTTP 200; module fetch returns 200; local `:7777` shell returns 200. Existing zrok PID 33510 is connected to Vite PID 59193. | TUNNEL_VERIFIED | HTTP shell success is not rendered/authenticated browser acceptance; CUA attachment returns `browser.user is unavailable`. Do not restart the shared processes. |
| Protected journey API via zrok | Public `/api/v1/version`, provider catalog and `/readyz` return 200; unauthenticated curl to journey detail and `/journeys/me` returns 401. Server sets `mg_refresh` with no `Domain`, making it host-only. | ROUTING_VERIFIED / AUTH_SESSION_NOT_TESTED | A session created on `127.0.0.1` is not shared with the zrok hostname. This is a plausible cause only if sign-in happened on localhost; owner browser cookie and authenticated request remain uninspected because CUA cannot attach. |
| No fabricated provider availability | Source diff removes static fallbacks; expanded `transport-tile-availability.test.ts` passes 8/8. Fresh public Lviv response still lists MARSHGO Community, Uklon/Bolt/Opti, Getmancar, Kiwitaxi/MARSHGO transfer, Укрзалізниця and inbus.ua. | LIVE_FAIL / SOURCE_AND_FIXTURE_VERIFIED | Existing API PID 66637 predates the source change; no restart. Verify in a safely pinned non-production runtime. Endpoint HTTP 200 is only reachability evidence, not provider availability. |
| Isolated acceptance API | Prior `marshgo-local-api` containers are exited and their compose file is missing. Canonical `scripts/run-integration-tests.sh` guards loopback `marshgo_e2e` database names and loopback Redis with a unique rate-limit prefix; read-only SQL confirms `marshgo_e2e` exists. Ports 3304/3306/3307/3308 were free at 00:39 EET. | TEST_DB_PRESENT / SUITE_NOT_RUN | Fixture harness applies migrations and may create/delete rows only in the E2E database; recheck ports and resources before execution. It does not prove live provider routing. Do not use `marshgo` or API `:3002`. |

## Release manifest source-of-truth check — 2026-11-11 00:59 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Operational manifest selection | CI, browser/E2E runners, PWA build, and release materializer read root `RELEASE_MANIFEST.json`. No release runner references `docs/RELEASE_MANIFEST.json`. | ROOT_INPUT_CONFIRMED | Root file is the tooling input; documentation copy is not authoritative for builds. |
| Pin consistency | Root is `RC-2026-10-30-evidence.3` (Server `44f954b…`, Site `fef697e…`); docs copy is `RC-2026-10-30-evidence.2` (Server `7bc1bcf…`, Site `2570e04…`). Both say `NOT_RELEASED`, API `v1`, migration `056`. Root's Nov 9 main tuple is marked observation-only and is not the release pin. | FAIL / NOT_RELEASED | Do not update either pin from dirty local heads or an observation-only snapshot. Create a new exact tuple only after component CI, compatibility and release materialization evidence. |
| Production package identity | zrok serves Vite development HTML; API `/api/v1/version` historically lacks exact build identity, and current route browser cannot be attached (`browser.user is unavailable`). | NOT_VERIFIED | Keep dev preview separate from staging/production evidence; pin a clean build and verify authenticated UI→API behavior before release. |

## Authenticated journey test-harness review — 2026-11-11 01:03 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Canonical integration runner auth mode | `MarshGO-Server/scripts/run-integration-tests.sh` starts its primary API with `AUTH_DEV_BYPASS=true` and `AUTH_DEV_OTP=true`; `server/index.ts` accepts `x-dev-user-id` in that development mode. | NOT_VALID_FOR_REAL_LOGIN_ACCEPTANCE | Runner not executed for user-journey proof; do not call bypass-backed fixtures real authentication. Keep requireAuth intact and use an owner-authenticated browser or auth-safe isolated environment. |
| Real login→journey→navigation | Existing browser-control bridge cannot attach to the owner's signed-in zrok tab; no session cookie was inspected. | NOT_TESTED | No test user or credentials were created/used; complete only with the existing authorized session or separately approved auth-safe setup. |

## Runtime build identity probe — 2026-11-11 01:04 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Current zrok runtime identity | Public `/api/v1/version` returns `environment=development`, `buildId=null`, `commitSha=null`, `builtAt=null`, `sourceState=unknown`. Production `Dockerfile.server` accepts build metadata, and `release-build-metadata.mjs` produces/binds it for a release build. | DEV_PREVIEW_UNPINNED | This confirms the preview is not a pinned release artifact, not a tunnel failure. Never stamp dirty checkout metadata as a clean release; verify exact metadata after clean materialization/build. |
## zrok user-visible state diagnosis — 2026-11-11 01:13 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| zrok tunnel and SPA delivery | Existing zrok root and protected journey URL return the Site shell; API health/readiness return 200. Existing tabs show the public intro at the journey URL. Browser console snapshot has no errors. | TUNNEL_REACHABLE / JOURNEY_NOT_AUTHENTICATED | This rules out a tunnel transport outage at observation time; it does not prove a successful protected journey render. |
| Current browser session | Protected API without browser auth returns 401. Site `restoreSession()` skips refresh if origin-local `mg_session_hint` is missing; `mg_refresh` is host-only. | AUTH_REQUIRED | Sign in through the normal login on the zrok hostname. A session from localhost is not shared. No cookie, token, or storage value was inspected; no auth bypass or credentials were used. |
| Browser interaction | Normal button dispatch timed out at the browser bridge; no click or login was completed. No console warning/error entries were captured. | INTERACTION_NOT_TESTED | Do not treat the empty log snapshot or public intro as authenticated route acceptance. Resume only when normal signed-in interaction is available. |
| Runtime type | Site is served by the existing Vite development preview; API runtime reports development with no exact build SHA. | DEV_PREVIEW / NOT_PRODUCTION | Keep release status `NOT_RELEASED`; do not restart shared zrok/Vite/API processes or claim production readiness. |
## Session restoration resilience — 2026-11-11 01:18 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Restore valid same-origin refresh cookie without local-storage marker | Dirty Site worktree `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; source removes `mg_session_hint` gating and always tries the HttpOnly refresh endpoint; 401 maps to anonymous state and clears in-memory token. | IMPLEMENTED / NOT_TESTED | Focused test updated but not run due free memory below 35%. |
| Regression coverage | Four cases cover no-hint anonymous 401, valid cookie restoration, token clearing, and network failure behavior. | TESTS_WRITTEN / NOT_RUN | Run only after resource gate is met; then verify normal login/deep-link in the existing authorized zrok browser without restarting shared services. |

## Route-sheet compactness increment — 2026-11-11

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Details/navigation sheet spacing | Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, dirty base HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`. Endpoint bottom padding and endpoint row-gap are zero; details/navigation stage-list tail is 2px; no extra top gap before either pinned CTA. 44px controls and safe-area reserve retained. | SOURCE_VERIFIED | CSS/source spacing only; do not infer a rendered pixel reduction. |
| Focused sheet tests | `tests/bottom-sheet-density.test.ts` and `tests/route-sheet-content-fit.test.ts`: 13/13 pass; scoped `git diff --check` passes. | FIXTURE_VERIFIED | Does not prove layout in an authenticated browser. |
| Canonical zrok delivery | Verified active Site listener CWD and restarted only that known preview on the same `127.0.0.1:7777`; existing zrok remains pointed at 7777. Local and zrok CSS responses contain the new zero endpoint padding/row gap; target journey shell returns HTTP 200. | SOURCE_DELIVERY_VERIFIED | Browser bridge still returns `browser.user is unavailable`; screenshot and DOM measurements remain NOT_TESTED. Production remains NOT_RELEASED. |
| Resource gate | After test/probes: disk 18 GiB free, RAM free 35%, encrypted swap 9,372 MiB; ChatGPT renderer/Docker UI busy. No broad build/browser task. No clearly disposable cache identified, no cleanup. | OBSERVED | Retry visual measurement when existing browser control is available; no extra port or tunnel. |

## Password recovery truthfulness — 2026-11-11 11:43 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Server reset-request behavior without a mail sender | Dirty Server source at HEAD `e9934abbd8fc973177de8d7f47548739758a1b74` now returns `503 password_reset_unavailable` before querying users or writing tokens. Token issuance remains permitted only for `NODE_ENV=test` plus explicit `AUTH_EXPOSE_RESET_TOKEN=true`. `password-reset-policy.test.ts`: 1/1 passed; changed Server and integration-test TS files transform with esbuild. | SOURCE_AND_UNIT_VERIFIED | Auth integration test was updated to assert identical unavailable responses for known/unknown addresses and zero token writes, but was not run because it uses a mutable DB. Existing API PID 66637 is unpinned (`commitSha/buildId/builtAt=null`) and was not restarted; runtime behavior remains NOT_TESTED. |
| Web recovery entry and unavailable copy | Dirty Site source at HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` adds an accessible “Забули пароль?” path, request API call, and explicit Ukrainian unavailable message. Site auth/session/error tests: 12/12 passed. Local and zrok-transformed modules return HTTP 200 and contain the reset flow. | SOURCE_AND_UNIT_VERIFIED | Browser rendering/interaction was not tested because CUA cannot attach to the signed-in tab (`browser.user is unavailable`). The public UI is on Vite dev preview, not staging. |
| Real email recovery | No mail transport/provider is integrated or approved. | BLOCKED_EXTERNAL | Select and configure an authorized sender/domain and secrets before implementing delivery; then test delivery, token expiry, single use, and session revocation in isolated staging. |
| Release pin | Root release manifest remains untouched; both component trees are dirty and current runtime identities are unknown. | NOT_RELEASED | Do not pin dirty source or call recovery production-ready. |

## Current user-journey checkpoint — 2026-11-11 12:12 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Site route-sheet stop density | Site worktree `qoder/route-geometry-continuation-20261110`, base HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; long stop labels now ellipsize on one line while accessible names and 44px selection targets remain. Focused tests 14/14 and TypeScript check pass. Existing signed-in zrok journey at 450×779 was freshly reloaded; the expanded 9-stop list scrolls with CTA visible. | PARTIAL | Route sample had short stop names, so the new ellipsis itself and before/after height savings were not visually measured. |
| Micromobility provider filter contract | Server dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; `allowedProviderIdsByType.bike` and `.scooter` are now applied independently to their estimators; explicit empty lists yield no estimates; flat legacy list is preserved. Search + estimate tests 9/9, including selected provider IDs reaching each estimator; Server typecheck and scoped diff-check pass. | SOURCE_AND_UNIT_VERIFIED | No live bike/scooter source response or provider-backed route was exercised. |
| Existing authenticated route page | Existing zrok route `0ab06ee0-8159-40c8-9bfb-872bcc24166b` rendered its A19 route, schedule stops and CTA after reload. | BROWSER_UI_PARTIAL | Route source/build identity was not proven; do not claim provider-backed/live acceptance. The runtime API build identity remains null and no service was restarted. |
| Release | Component worktrees dirty; active API is unpinned; production geocoder approval and end-to-end source proof remain absent. | NOT_RELEASED | Continue safe first-journey work; do not deploy or pin random dirty HEADs. |
| Production build identity gate | Server `validateRuntimeConfig` now fails startup when a production build lacks a valid ID, exact 40-character commit SHA, valid build time, or clean source state. Config/build-info tests 13/13; Server typecheck and scoped diff-check pass. | SOURCE_AND_UNIT_VERIFIED | The running API was not restarted and has no build identity; verify the behavior in a clean pinned staging artifact before release. |

## Route-sheet stop-row density — 2026-11-11 12:23 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Static stop rows | Site density CSS now caps non-interactive stop rows at 24px and removes vertical padding; names remain one line with ellipsis. Selectable stop controls remain 44px. Route-sheet density/content-fit tests pass 14/14; scoped diff check passes. Existing zrok returns HTTP 200 for the updated CSS. | SOURCE_AND_UNIT_VERIFIED | Existing browser bridge unavailable (`browser.user is unavailable`); rendered dimensions, screenshot and visual comparison remain NOT_TESTED. |
| Expanded-sheet compactness | Static rows can save up to 4px each (up to 36px across 9 static rows), excluding actual browser font/layout effects. | PARTIAL | Measure the same signed-in route and viewport in the existing zrok tab when CUA recovers; do not claim pixel savings or total-height percentage as visually verified. |

## Expanded route-sheet density — 2026-11-11 12:49 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Duplicate stage summary | Expanded details omit the 44px stage ribbon because every detailed leg card remains a segment selector; peek/collapsed/half retain the swipeable ribbon. | SOURCE_AND_UNIT_VERIFIED | Focused density/content-fit tests pass 17/17; scoped diff check passes. |
| Same-route visual measurement | Existing signed-in zrok journey `2b9503af-6b54-4b1c-bb25-5558b6f1228d`, viewport 384×779: expanded sheet 372→328px (−44px, −11.8%). Three 46px cards and 44px CTA remain visible, stops collapsed, list height 167px; selecting A41 still focuses its map route. Console errors: none. | BROWSER_VISUAL_VERIFIED | One route and viewport only; screenshot was inspected but not saved as a repository evidence file. Verify other mobile widths and active navigation separately. |
| Release status | Worktrees remain dirty; API is unpinned and production provider/source gates remain open. | NOT_RELEASED | No deploy or release claim. |

## Stage-control density follow-up — 2026-11-11 12:57 EET

| Gate | Evidence | Status | Boundary / next action |
|---|---|---|---|
| Detail-sheet stage controls | Ribbon is present only in collapsed details, where full leg cards are hidden. Peek has its own ribbon. In half/expanded, selectable detail cards remain and the duplicate 44px ribbon is omitted. | SOURCE_AND_UNIT_VERIFIED | Focused density/content-fit tests 18/18; zrok serves the updated module. Half-state visual fit after this change is NOT_TESTED. |
| Active-navigation stage controls | Ribbon is present only in collapsed navigation; half/expanded use the selectable leg-card list. | SOURCE_AND_UNIT_VERIFIED | Same focused tests pass. Navigation browser test is NOT_TESTED; do not start a GPS session without a controlled consented test environment. |
| Existing visual evidence | Same zrok 384×779 expanded Details view measured 328px with three 46px stage cards, collapsed stops and visible 44px CTA after the prior expanded-only ribbon removal. | BROWSER_VISUAL_VERIFIED | This measurement predates the latest half-state/navigation update and does not verify those states. Existing page-evaluation control is currently unavailable. |
