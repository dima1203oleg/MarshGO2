## CURRENT RESUME — Ukraine-wide feed integration, 2026-11-11 18:07 EET

1. The local-dev provider API was sampled read-only at 14 Ukrainian points across two bounded requests. City route-backed modes are confirmed at Kyiv (bus/trolleybus/tram), Lviv (bus/tram), Stryi (bus), Uzhhorod (bus), and Ivano-Frankivsk (bus/trolleybus); sampled Odesa, Rivne, Zhmerinka, Dnipro and Chernihiv show no city transit mode. National rail appears broadly in point-availability responses, but a tile alone does not prove a scheduled trip or end-to-end journey. No DB writes or provider changes were made.
2. Public feed-index recheck: `static-ukr` reports 34 routes/287 stops but its derivative-work license is unspecified; Odesa and Bucha GTFS downloads require operator registration/authentication (Bucha also lacks established commercial reuse rights); inbus schedule dates expired in 2025. Do not enable or proxy these feeds around the access/license gates. The corrected nationwide rail package is offered by quote and is not an automatic open-source connection. See `MarshGO-Server/docs/UKRAINE_TRANSIT_FEED_COVERAGE_2026-11-11.md` for evidence and links.
3. Continue through exact authorized municipal sources and owner onboarding. Preserve currently connected five local-dev schedule sources, the separately attributed nonofficial ODbL rail source, and all dirty Server/Site changes. Do not run `mobility:seed all` or write staging/production.
4. Resource state at checkpoint: disk 16 GiB free, RAM 30%, encrypted swap 10,317 MiB; Docker renderer ~71% CPU and Virtualization ~12%. Defer local feed ingestion, build and tests until load eases. No safe disposable cache found or removed. National coverage remains `PARTIAL`; production remains `NOT_RELEASED`.

## PRIOR CHECKPOINT — bounded route-retention checks passed, live route pending, 2026-11-11 18:02 EET

1. Preserve dirty SHAs: root `4fd9bd70dd36b49f1c538c7a3e1a2cd1dc5ae0fd`; Site `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; Server `e9934abbd8fc973177de8d7f47548739758a1b74`.
2. On the dirty Server SHA above, two focused fixture tests passed: `node --import tsx --test tests/gtfs-objective-reservoir-regression.test.ts` (1/1) and `node --import tsx --test tests/gtfs-route-chain-sampler-adversarial.test.ts` (1/1). They cover keeping global walking/fare/time objective witnesses through bounded route-chain sampling. They are fixture-level, not live-feed proof.
3. The Server suite also contains an exhaustive two-transfer (three scheduled legs) oracle and tests all three ranking winners (`tests/gtfs-timetable.test.ts`); this larger file was not run in this checkpoint.
4. Lviv provider registry read checks were HTTP 200 at both route endpoints and list bus/tram Lvivavtodor, rail UZ, bikes BikeNow/Nextbike; this is point coverage only. Anonymous real journey search returns 401. The existing signed-in zrok tab cannot be attached by CUA; a fresh browser reaches zrok auth. No account or journey DB record was created.
5. E2E harness security/truthfulness changes are syntax/diff checked, not executed: zrok-only HTTPS target, env credentials, actual login response+app-shell assertion before PASS, screenshot-only OBSERVED, no screenshot of credentials, nonzero error exit.
6. Resources: disk 16 GiB available; free memory 34%; encrypted swap 10,192 MiB; Docker Desktop renderer ~113% CPU. Defer the exhaustive file, route search, browser, and builds until host load eases. No cache cleanup.
7. Next: run only the named exhaustive two-transfer test when resources permit; then achieve the provider-backed search via ordinary app auth and existing zrok. Nationwide feeds PARTIAL, production `NOT_RELEASED`.

## HISTORICAL RESUME — official Lviv GTFS validation, before local activation, 2026-11-11

1. Preserve the dirty Server checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; no resets or cleanup.
2. Live read-only validation of the official Lviv static feed passed: 8 GTFS tables, 1,064 stops (0 invalid coordinates), 72 routes (64 bus / 8 tram), 15,606 trips, 421,884 stop times, valid timezone and service in the next 7 days. Source version SHA-256 `cdb173a873fd287a01684950c0967f4f40ab7c8bc53c2269f004300b713e4c98`; exact official CC BY 4.0 source and attribution are now recorded in Server catalog.
3. Added Lviv to the strict validated schedule scope and a one-feed-only `--verified-lviv-gtfs-schedule` seed path. Focused scope/license tests passed 11/11; scoped diff check passed. This historical checkpoint preceded the successful local activation below.
4. The local dev database was subsequently checked and only the Lviv row was synced; see the current resume below. Never run `all`.
5. Nationwide coverage remains PARTIAL; production NOT_RELEASED.

## HISTORICAL RESUME — Lviv connected in local dev, 2026-11-11 17:15 EET

1. Preserve dirty Server worktree `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; do not reset/clean or overwrite changes.
2. Official Lviv static GTFS is active in the verified local development DB only: `healthy/enabled`, commercial reuse permitted with attribution, 1,064 stops, 72 routes (64 bus / 8 tram), 15,606 trips, 421,884 stop times. Source archive SHA-256 `cdb173a873fd287a01684950c0967f4f40ab7c8bc53c2269f004300b713e4c98`. Local API `/api/v1/mobility/providers` returns Lviv as available for bus and tram. No API restart, staging write, or production action.
3. The narrow idempotent seed `--verified-lviv-gtfs-schedule` ran only after checking `DATABASE_URL` resolves to `127.0.0.1:5434/marshgo`; readback confirms the exact row. No broad `all` seed. Focused scope/license tests passed 11/11 before activation.
4. National feeds remain partial: Odesa/Bucha require authorized credentials/terms; sampled official CSV bundles fail coordinates/calendar/service checks. Newly confirmed Malyn GTFS (9 routes; service to Dec 2027) points to OwnNet Source License 1.1, requiring written consent for commercial use, so it remains unregistered/disabled. Continue with exact licensed, fresh, structurally valid feed scopes and live source checks.
5. The next checkpoint refreshed the verified five-city static schedule set; see the current resume below. Production `NOT_RELEASED`.

## CURRENT RESUME — five schedules, verified realtime and strict quality gates in local dev, 2026-11-11 17:34 EET

1. Preserve dirty Server worktree `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`.
2. Exact scope `--verified-gtfs-schedule` refreshed only five source-pinned, licensed feeds in local dev: Kyivpastrans, Lvivavtodor, Stryi, Uzhhorod, Ivano-Frankivsk. All returned `healthy/enabled`; aggregate 368 routes / 3,868 stops. Exact `--verified-live` refreshed Rivne and Uzhhorod healthy/enabled; correctly disabled Kamianske (6/32 outside Ukraine and future-dated positions) and Dnipro iCity (only 281–286/450 entries have valid coordinates; degraded). Exact `--verified-gtfs-rt` refreshed Ivano-Frankivsk realtime degraded/enabled. A read-only Lviv RT check found 620 vehicles, 597 fresh, 23 stale, 7 alerts, feed age 3 seconds. All writes were source-pinned, guarded scopes to local dev only.
3. Read-only API checks returned HTTP 200 and route-backed city modes: Kyiv bus/trolleybus/tram; Lviv bus/tram; Stryi bus; Uzhhorod bus; Ivano-Frankivsk bus/trolleybus. These are provider availability points, not a full authenticated journey or national coverage proof. Kyiv has known external stop-time chronology errors; IF is missing shapes and has two bad stop coordinates; Lviv RT has a stale tail.
4. Latest official CKAN discovery query for “Розклад руху громадського транспорту” returned 82 records, many of them XLSX/DOC or incomplete CSV, not directly routable GTFS. The recently updated Kovel record exposes a route/time XML and a legacy-encoded CSV but no stop-coordinate/shape table; it is not safely routeable without a source adapter and verified coordinates. Malyn is commercially blocked; continue inspecting only promising records and keep credentials/terms gates.
5. Still blocked: authorized Odesa/Bucha credentials and terms; invalid/incomplete municipal CSV sets; Malyn commercial terms require separate written consent. Do not use `all` scope or invent coverage where no feed exists.
6. Latest after the exact live-feed refresh: disk 17 GiB free, RAM 36% free, encrypted swap 9.43 GiB (583 MiB free); Virtualization briefly 86% CPU with Docker backend ~11%. No other build/GTFS job active. Defer heavy work; disk <20 GiB and no clearly disposable unused cache found. Production `NOT_RELEASED`.
7. Reconciled three stale local-only rows: disabled Malyn GTFS because OwnNet commercial SaaS permission requires written consent; disabled old Odesa/Bucha CDN-mirror rows pending authorized credentials/terms (Bucha license cleared to unknown). Read-only API now returns no public-transit mode for Malyn/Bucha and no Odesa transit mode (Odesa bike estimate is unrelated). Added OwnNet-specific deny override to license policy; combined provider-scope/license suite passed 11/11. Do not copy this dev reconciliation to production without a reviewed migration and verified source onboarding.

## CURRENT RESUME — Kyivpastrans verified in local dev; nationwide coverage still partial, 2026-11-11 16:25 EET

1. Preserve the dirty Server checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`.
2. Kyivpastrans HTTPS GTFS mirror is now exactly sourced to the official CC BY 4.0 dataset, Mobility Database and Transitland; current archive last-modified Nov 10, 2026. Narrow scope `--verified-kyiv-gtfs-schedule` refreshed only that feed in local development DB. GTFS counts: 1,774 stops / 191 routes / 27,206 trips / 115,443 stop times; API availability at Kyiv coordinates reports bus, trolleybus and tram. No journey search was authenticated or run.
3. Quality caveat: the external canonical GTFS validator reports 256 chronology errors and additional warnings; MARSHGO's required-table/coordinate/timezone/upcoming-service validator currently classifies it healthy. Keep the external errors visible and investigate filtering/normalization before claiming timetable correctness. This is not production evidence.
4. Other blockers remain: no auth-proven nationwide schedule for most regions; Kyiv's producer GTFS/RT endpoint is HTTP-only; Odesa/Bucha require operator credentials; Malyn's license limits use by revenue and paid service absent agreement; interregional registry source has stale permits/reversed coordinates and unclear calendar semantics; Zhmerinka/Horishni Plavni current CSV fail routing checks; no provider-backed national journey acceptance. Do not seed the full catalog.
5. Keep all existing API/Site/zrok processes unchanged. Last resource check: 17 GiB disk free, 32% RAM free, ~9.0 GiB encrypted swap; avoid a second heavy process and don't remove uncertain caches. Production stays `NOT_RELEASED`.

## CURRENT RESUME — nationwide interregional source is reachable but unsafe to route, 2026-11-11 17:04 EET

1. Preserve the dirty Server checkout at `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`.
2. Official Ukrtransbezpeka public JSON API returned HTTP 200 and CC-BY source metadata. A bounded sample showed an `active=1` route with an expired 2025 permit, apparently reversed coordinates, and two-week calendar flags. Status **DISCOVERED / NOT ROUTABLE** until a dedicated adapter validates permits, points, dates and schedule semantics. Details: `MarshGO-Server/docs/UKRAINE_TRANSIT_FEED_COVERAGE_2026-11-11.md`.
3. No code, database, provider registry, service or production data changed in this checkpoint. The prior exact local-dev verified feed sync remains the only verified registry update; nationwide coverage is still PARTIAL.
4. Resources: 18 GiB free disk, 31% free RAM, ~9.26 GiB encrypted swap; Docker Desktop helper was using high CPU. Defer GTFS parsing/build/browser work until load eases. No safe cache candidate; nothing removed.
5. Next: boundedly review this national source and build fixture-backed filtering/normalization only after resource load permits; continue official municipal source discovery one feed at a time. Production remains NOT_RELEASED.

## CURRENT RESUME — verified Ukraine feeds synced to local dev, 2026-11-11 15:54 EET

1. Preserve the dirty Server checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; no code reset or production change.
2. Ran only exact, strict local development sync scopes using root `.env` whose database host/port were confirmed as `127.0.0.1:5434` / database `marshgo`; staging config is absent. `--verified-live`: Rivne healthy/enabled (163 timestamped positions; two outside-country records rejected), Uzhhorod healthy/enabled (51 fresh positions), Kamianske degraded/disabled (17 positions, 3 outside Ukraine, data age 3,744 seconds). `--verified-gtfs-schedule`: Stryi 292 stops/34 routes/1,061 trips/13,874 stop times; Uzhhorod 215/18/2,376/46,460; Ivano-Frankivsk 525/54/3,187/77,272 — all healthy/enabled. `--verified-gtfs-rt`: Ivano-Frankivsk 157 entities, 138 fresh/19 stale, 7-second feed age — degraded/enabled.
3. Local DB currently reports 10 healthy/enabled GTFS sources across 9 cities plus national rail; only Stryi, Uzhhorod, and Ivano-Frankivsk were revalidated in this sync. Read-only local tile API returned route-backed bus/tram in Lviv, bus/trolleybus in Ivano-Frankivsk, bus in Uzhhorod and Stryi, bus/trolleybus/tram in Kyiv, and bus/trolleybus/tram in Odesa. Bucha’s nearby tile also includes Kyivpastrans; investigate corridor/bbox precision before production. This proves local provider availability only, not journey search or nationwide coverage.
4. New official Ivano-Frankivsk data.gov.ua component CSV bundle was probed read-only and failed: 452/452 stops invalid, timezone missing, and no service in the next seven days. Keep it unregistered/unseeded; the existing official-rights Dozor GTFS remains healthy. Horishni Plavni (163 null-coordinate stops) and Zhmerinka (996 invalid coordinates) remain rejected candidates. Khmelnytskyi's official CC-BY source has a monthly schedule and API components, but every published API host path failed DNS resolution in this checkpoint; its XLSX timetable is not a valid GTFS substitute.
5. The latest package and deployment gates remain: no full `mobility:seed all`, no API/site restart, no authentication bypass, no new port/tunnel. Existing API PID 64943 is ready on 3002; canonical Site PID 42211 stays on 7777/zrok. Authenticated route-level, staging and production proofs remain NOT_TESTED/BLOCKED. Nationwide coverage is PARTIAL; production NOT_RELEASED.
6. Latest resources: disk 15 GiB free, RAM free 34%, encrypted swap ~12.03 GiB used; no safe disposable cache found or removed. Keep one heavy task at a time and defer broad feed scans/builds.

## RESUME — Ukraine feed integration, 2026-11-11 15:03 EET

1. Preserve Server dirty checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server` at `antigravity/ukraine-12-transports-multimodal` / `e9934abbd8fc973177de8d7f47548739758a1b74`; do not reset or overwrite existing edits.
2. A shared componentized GTFS loader was just added to GTFS validation, journey timetable loading, route network geometry and route-type indexing. It supports official data.gov.ua `package_show` CSV resources and has a 60 MB aggregate cap. Focused tests pass **10/10**, typecheck passes, and scoped `git diff --check` passes.
3. Zhmerinka dataset `ea47d118-9085-4695-9202-1839acd7e0c5` (CC BY, last updated 2026-10-29) is registered as a candidate, not active. It has a separate `--candidate-gtfs-csv` scope that only enables it if live schema, coordinates, timezone and upcoming service all pass.
4. Do not invoke the candidate seed scope: the read-only live GTFS validator has now failed the Zhmerinka source (invalid stop coordinates, missing timezone, no active service). Revisit only after the publisher corrects the data; then validate first, and seed only if healthy.
5. Current blockers remain: nationwide catalog is only discovery, not coverage; Kyiv static is HTTP-only and the checked snapshot is out of date, Odesa/Bucha require producer credentials, and other candidate feeds lack current or commercial-rights evidence. Do not seed the full catalog, bypass auth, or label nationwide feeds complete. Latest resource state 18 GiB disk / 44% free RAM / 9.74 GiB swap, Virtualization ~13% CPU; defer GTFS import while that load persists. Production remains **NOT_RELEASED**.

## PREVIOUS CHECKPOINT — Ukraine feed integration, 2026-11-11 14:44 EET

1. Server `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; preserve all existing dirty work. Current evidence is in `MarshGO-Server/docs/UKRAINE_TRANSIT_FEED_COVERAGE_2026-11-11.md`.
2. Strict schedule sync now validates/upserts only three exact, licensed municipal GTFS feeds in the local development DB: Striy, Uzhhorod, and Ivano-Frankivsk; all three were healthy. Striy: 292 stops / 34 routes / 1,061 trips / 13,874 stop times. Uzhhorod: 215 / 18 / 2,376 / 46,460. Ivano-Frankivsk: 525 / 54 / 3,187 / 77,272, with 2 invalid stop coordinates and no `shapes.txt`.
3. Focused tests `node --import tsx --test tests/ukraine-catalog-license.test.ts tests/ukraine-seed-scopes.test.ts`: **7 passed, 0 failed**; scoped diff-check passed. Read-only DB snapshot shows 10 enabled/healthy GTFS schedule rows across city/national entries, but only the three above were just revalidated by the strict scope; older rows still need exact source-rights/provenance review.
4. Striy GTFS-RT currently probes degraded (25/30 fresh, 5 stale), so it remains unactivated. Kyiv official endpoints are HTTP-only; Odesa/Bucha require producer credentials; Malyn's feed license requires a separate agreement. Do not bypass auth or claim nationwide coverage. No route-search E2E or production write was performed.
5. Resource checkpoint: 18 GiB disk free, 32% free RAM, ~9.5 GiB encrypted swap; no safe cache cleanup found. Do not run broad feed scans/builds while heavy virtualization/Docker processes are active. Do not restart the existing API/Site or open another port/tunnel; zrok UI checks remain unavailable in this environment.
6. Next: (a) reconcile the 10 existing enabled GTFS rows against exact upstream rights and provenance; (b) find additional current, authorized municipal feeds and validate before adding exact-reference seed scopes; (c) assess a bounded componentized-data.gov CSV importer to expand past the small set of standard GTFS feeds; (d) prove an authenticated provider-backed journey through the existing app/runtime when browser access is available. Production remains **NOT_RELEASED**.

## NEXT — visual proof and authenticated first route, 2026-11-11 11:59 EET

1. Server typecheck and focused Server tests are green (typecheck exit 0; 30/30 tests); Site typecheck is green and the bottom-sheet/map/navigation focused set is 40/40 at the recorded dirty SHAs. Preserve all dirty worktrees.
2. The compact static-stop style is delivered through canonical `:7777` and the existing zrok, but rendered height is still NOT_TESTED. CUA cannot attach to the current signed-in tab (`browser.user is unavailable`). Do not create another port/tunnel or bypass auth.
3. First route remains unproven; runtime Server build identity is null and a contracted/self-hosted production geocoder is not configured. Next real acceptance is authenticated search → provider-backed alternatives → selected route geometry/stops/fares → navigation. Keep manifest untouched and production `NOT_RELEASED`.

## NEXT — connect verified Server source to the first real journey, 2026-11-11 11:57 EET

1. Current dirty Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74` now passes full TypeScript typecheck; the five source/type errors are fixed and the focused auth/geocoding/search/oracle set passes 30/30.
2. The source checks do not apply to the already-running API (its runtime build SHA is null), and journey search still requires a signed-in session. Use the existing zrok session when browser attachment works; do not restart the API, bypass auth, or claim the dirty source is running.
3. Remaining first-flow gates: authorized contracted/self-hosted production geocoder; exact pinned build/runtime tuple; authenticated provider-backed search→selection→geometry/stops/fare→navigation evidence. Keep the release manifest and `NOT_RELEASED` status unchanged. Current resources: 18 GiB disk, 42% free RAM, ~9.34 GiB encrypted swap.

## NEXT — first provider-backed route, 2026-11-11 11:55 EET

1. Server planner composition now has a genuine tiny-graph exhaustive reference: direct and 3-leg candidate identities plus FASTEST/CHEAPEST/BALANCED winners match; focused route-engine file passes 9/9 at dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`. No planner defect was reproduced; the misleading prior fixture label was corrected.
2. Still must prove the first real flow in the signed-in Web UI: search → real provider-backed alternatives → select → geometry/stops/fares → navigation. The authenticated browser tab cannot be attached (`browser.user is unavailable`), so do not bypass the expected 401 or invent session data.
3. Keep the running API and canonical Site `:7777`/existing zrok untouched. API build identity is unpinned and public Photon is not an approved production geocoder. Full typecheck deferred with Virtualization at ~59% CPU; current resources 18 GiB free disk, 30% free RAM, ~9.01 GiB encrypted swap. Production remains `NOT_RELEASED`.

## NEXT — prove the first authenticated journey, 2026-11-11 11:49 EET

1. The independent small-feed two-transfer oracle and all three ranking winners pass at Server dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74` (focused test 1/1). This is fixture evidence only; no planner edit was needed.
2. Production route search remains unproved because the current browser attachment is unavailable and unauthenticated requests must correctly receive 401. Recover use of the already signed-in zrok tab; then verify search → selected provider-backed legs/fare/geometry → navigation without bypassing auth.
3. Keep API PID 66637 and Site 7777/zrok untouched; runtime `/version` is unpinned and the configured public Photon evaluation host is not production-approved. Do not alter the release manifest or call production ready. Resources: disk 17 GiB, RAM 29%, swap 9.39 GiB; avoid broad local work while system load remains elevated.

## NEXT — bottom-sheet compactness, 2026-11-11 11:49 EET

1. The shared route-sheet CSS now packs static rows in an expanded stop list to 28 px; selectable rows stay at 44 px. Focused density/content-fit tests pass 14/14 and canonical local `:7777` plus existing zrok serve the updated stylesheet.
2. Visual sheet/stop-height comparison is still NOT_TESTED: the existing browser tab is listed, but CUA attachment returns `browser.user is unavailable`. Once that bridge works, reopen the same authenticated journey and measure expanded/collapsed stop behavior at the same phone viewport; do not launch a new port or tunnel.
3. Keep all Site/root dirty work intact. Current resources: 18 GiB free disk, 36% free RAM, ~9.35 GiB encrypted swap; Codex renderer and Virtualization load is high. Avoid broad tests/build/browser work; no safe unused cache is available. Production remains `NOT_RELEASED`.

## RESUME BLOCK — bottom-sheet compactness follow-up, 2026-11-11

- Active Site worktree: `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; preserve its dirty work.
- Active Server worktree: `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; preserve its dirty changes. Fixed geocoding-test environment leakage and guaranteed local test-server cleanup; `node /Users/dima1203/Desktop/MarshGO/node_modules/tsx/dist/cli.mjs --test tests/geocoding.test.ts` passed 13/13, 0 skipped. This exercises the public Photon production guard, not a live approved production geocoder.
- Latest focused edits: street endpoint labels sit directly under the leg metrics (`margin-top: 0`, tighter line-height); active-navigation “Далі” now has the same 2px top gap as route details. 44px interactive targets remain intact. `./node_modules/.bin/tsx --test tests/bottom-sheet-density.test.ts` passed 9/9, 0 skipped, at this dirty source state.
- `git diff --check` passed on the edited tracked Site files. Plain transformed-module URLs still return stale Vite output, but cache-busted requests through both the same `:7777` and existing zrok return the latest source. No process was restarted. Journey HTTP is 200, which is not visual evidence. CUA reports `browser.user is unavailable`; screenshot/DOM measurement is NOT_TESTED.
- Before the bounded density test: 18 GiB disk free, 29% RAM free, encrypted swap 8.83 GiB, with no other test/build active; one focused test ran. Afterward: 18 GiB disk, 31% RAM, swap 8.61 GiB; Virtualization ~26% CPU and WindowServer ~29%. Existing cache review found no clearly disposable unused candidate; do not remove active app caches, repository artifacts, or restart the 7777 process.
- Next: reload the existing signed-in zrok tab once browser control is available; measure the same mobile viewport and inspect endpoint spacing, stop rows and CTA in details/navigation. Cache-busted source delivery is verified, but rendered behavior is not. The Server autocomplete runtime remains development-only and unpinned; provision/verify a contracted or self-hosted production geocoder before staging. Production stays `NOT_RELEASED`.

## CURRENT CHECKPOINT — live Photon autocomplete verified; route search stays auth-gated, 2026-11-11

The earlier raw-Unicode curl probe returned HTTP 400 because the query was not URL-encoded; that was a probe construction error, not evidence of an app outage. With standard URL encoding, local API `GET /api/v1/places/suggest?q=Львів` and the same existing zrok endpoint both return HTTP 200 with six Ukraine-filtered Photon/OSM suggestions. A direct single low-volume request through the current Server adapter also returned six results. The active API remains development-only and `/api/v1/version` has null build identity; the public Photon endpoint is evaluation evidence, not approval for production use. Added isolated Photon GeoJSON/request-contract coverage; `tests/geocoding.test.ts` passes 12/12. Five route-engine fixture files pass 18/18, bounded-retention/adversarial-sampler/calendar tests pass 9/9, and five Site geometry files pass 31/31. No API process was restarted.

The first user journey is still unproven: unauthenticated `POST /api/v1/journeys/search` through zrok correctly returns 401, and the existing authenticated tab cannot be inspected because CUA returns `browser.user is unavailable`. Do not bypass auth or invent a journey. The focused geocoding suite now passes 13/13 on the dirty Server worktree after test environment isolation; it is fixture evidence only. Next: resume the existing signed-in tab when browser control recovers; verify provider-backed route, map geometry, stops, fare, and navigation. Keep Server runtime unpinned and production `NOT_RELEASED`.

## CURRENT CHECKPOINT — compact wait row delivered on canonical preview, 2026-11-11

Reduced the non-interactive wait row's vertical padding from 4px to 2px per side in the dirty Site worktree, saving 4px for each wait row while preserving all 44px touch controls. The focused density suite passes 9/9. Local `:7777` and the existing zrok both serve the updated component, and the journey URL returns 200. The CUA bridge still reports `browser.user is unavailable`, so this increment has not received a screenshot or post-change DOM height measurement; the earlier 384×779 sheet measurement remains historical evidence, not a measurement of this increment. The Vite process on canonical 7777 was confirmed to belong to this Site worktree/Codex command, restarted on the same port to clear stale module output, and now serves the updated source. Resources after the focused check: 18 GiB disk free, 29% RAM free, encrypted swap 8.8 GiB; no build/browser run or cleanup. Preserve 34 dirty Site paths; production remains NOT_RELEASED.

Next: when the existing browser bridge recovers, inspect the same signed-in zrok journey at the same phone viewport, measure before/after wait-row and sheet height, verify collapsed stops and CTA visibility, then check navigation-sheet parity. Do not open another port/tunnel or claim visual verification from source delivery.

## CURRENT CHECKPOINT — zrok address search works; authenticated route still unproven, 2026-11-11

Read-only probes through the existing zrok reached the active app/API: `/readyz` 200 with DB and realtime connected; `/api/v1/places/suggest?q=Сихів, Львів` 200 with five suggestions. This proves the address-suggestion endpoint responds on the shared app, not that its provider provenance or journey routing is verified. `POST /api/v1/journeys/search` without a session returns 401 `unauthorized`, as required. A focused source check confirms the current Site form calls `/auth/login` with email/password and the active Server implements that same contract; Server OTP endpoints return disabled, so the old OTP-vs-password note describes the E2E harness mismatch rather than a current UI/API login-contract mismatch. The existing browser control still cannot read the authenticated tab (`browser.user is unavailable`), so no auth session was supplied and no route was fabricated.

Current local source state remains dirty and must not be pinned blindly: Site worktree HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, branch `qoder/route-geometry-continuation-20261110`, 34 changed/untracked paths; Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, branch `antigravity/ukraine-12-transports-multimodal`, 12 changed/untracked paths. Rechecked the only listener on canonical `:7777`: PID 31208 has that Site worktree as CWD, so the earlier matrix claim that `:7777` was exact-main was stale; corrected the current-preview row and proxy evidence in `docs/PRODUCTION_ACCEPTANCE_MATRIX.md`. The checked-in manifest still pins Site `2570e0486de47d4f1c1a6bb519adfa064e7449b4` and Server `7bc1bcfb3bde4f8309dc690d352d2cfd469c8a07`, reports `NOT_RELEASED`, and has no configured staging URL/provider. API `/version` is development with build ID/SHA/time null and source state `unknown`. Product PRs #129 (sheet), #128 (map), and Server #135 (direct-only) remain open drafts; root #24 remains stacked and its CI reports the private Admin/Partner read-token blocker. No merge/deploy or data write.

Resource checkpoint at turn start: disk 18 GiB free, RAM free 30%, encrypted swap 9.9 GiB; ChatGPT process ~70% CPU and Virtualization ~12%. Only short read-only HTTP/GitHub queries ran; no heavy test/build/browser process. Disk <20 GiB: no clearly disposable unused cache identified, nothing removed. Production remains `NOT_RELEASED`.

Next: regain read access to the existing authenticated zrok tab and complete one real user journey against this exact local API/Site pair; verify suggestion source, search result provider/fare/geometry, and navigation. Do not bypass the 401, restart the API, pin dirty HEADs, or deploy. If browser access remains unavailable, continue by checking current auth UI/API contract and release-CI blockers while keeping the real journey gate open.

## CURRENT CHECKPOINT — route sheet vertical density follow-up, 2026-11-11

Tightened the phone route sheet one more step in the active Site worktree: segment-card vertical padding is now 0px around the existing 44px controls, card-to-card rhythm is 1px, and the list's extra 2px top inset is removed. Street labels remain in their compact two-line card layout; the 44px touch floor and stop controls are unchanged. For the current three-leg route, these CSS changes are expected to save about 17px by layout arithmetic; that is not a post-change browser measurement.

Focused density tests pass 9/9 and `git diff --check` passes. The first live CSS check exposed stale Vite module state (`:7777` and zrok both still served 2px values). Confirmed PID 29522 was Codex-owned from the active Site worktree, stopped only that session, and restarted the same `127.0.0.1:7777` app; PID 31208 now serves it. Local and existing zrok CSS requests both return 200 and contain `--mg-sheet-stack-gap: 1px` and `--mg-sheet-card-pad-y: 0px`; the journey route returns 200 through both. This verifies source delivery, not rendered appearance. The existing in-app zrok tab remains listed, but its page API still returns `browser.user is unavailable`, so no screenshot or new DOM measurement could be taken. Do not claim this increment visually verified. Latest resources after restart: 34% free RAM, 18 GiB disk, encrypted swap ~9.2 GiB. No browser/build was started; disk is below 20 GiB, but no clearly disposable unused cache was identified, so nothing was removed. Preserve canonical 7777/zrok and all unrelated dirty work; production remains NOT_RELEASED.

Next: once the existing browser bridge is readable and system load permits, reload the same authenticated zrok journey at the same phone viewport, measure sheet/card/list heights, check street-name readability and CTA visibility, then verify active navigation uses the same compact rhythm. If the labels or touch controls suffer, adjust without reducing the 44px floor.

## CURRENT CHECKPOINT — OpenFreeMap tile path isolated, 2026-11-11

The page at the existing zrok journey still needs browser-side tile evidence. Host-side checks show: OpenFreeMap style JSON is 200; its `/planet` TileJSON selects version `20261101_080013_pt`; a host GET for Lviv z12 at `/planet/20261101_080013_pt/12/2321/1392.pbf` returns 200 with 93,428 bytes. The unversioned wildcard `/planet/12/2321/1392.pbf` returns 200 but zero bytes (`x-ofm-debug: empty tile wildcard`). Therefore the map's blank canvas must be diagnosed by checking which URL the browser actually requests; the host check does not prove CORS/device render.

CUA still reports `browser.user is unavailable`. Current system sample: free RAM 29%, disk 18 GiB, encrypted swap 8.9 GiB; Virtualization VM ~87% CPU. Defer browser/build/test and do not restart it. No clearly disposable cache identified; no cleanup. Site on 7777 and Server on 3002 remain untouched. Server readiness is still available, but build identity remains null. Production remains NOT_RELEASED.

Next: once browser control and resource load recover, inspect the existing authenticated zrok tab's `data-marshgoMapReady/status/error`, camera center/zoom, and OpenFreeMap requests. Confirm the browser uses the versioned tile template. If it does, trace style/source load and camera framing; do not change the basemap based only on host-side results.

## CURRENT CHECKPOINT — map render and release pin recheck, 2026-11-11

The measured bottom-sheet improvement remains verified at 384×779; the same zrok page's map canvas appeared black after the last same-port refresh. The browser control now returns `browser.user is unavailable`, so current canvas status/network failures cannot be read. Vite's live session logs only repeat the already-known upstream missing sprite IDs (`circle-11`, `wood-pattern`). A read-only request to the configured OpenFreeMap style endpoint returns HTTP 200; this proves the style document is reachable from the host, not that browser tile requests render. Avoid speculative map edits until browser resource status is available.

Server `/readyz` is 200 (DB and realtime connected); `/api/v1/version` still reports null buildId/commitSha/builtAt and `sourceState=unknown`, environment development, so this runtime is not an artifact pin. The metadata materializer/Docker wiring already exists; don't duplicate it. Resources now: 35% free RAM, 17 GiB disk, encrypted swap 9.7 GiB; Codex renderer ~84% CPU. Browser/build/typecheck deferred; no safe cache deletion candidate identified, no cleanup performed. Production remains NOT_RELEASED.

Next: recover read access only to the already-open authenticated zrok tab; inspect MapLibre ready/status/error datasets and tile requests, then validate 390/430px and active-navigation sheet. In parallel, continue release preparation against the existing manifest/build metadata pipeline without restarting the long-running API, changing auth, opening another site/port, or deploying.

## CURRENT CHECKPOINT — phone bottom-sheet compactness, 2026-11-11

In the active Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` (branch `qoder/route-geometry-continuation-20261110`, dirty HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`), capped route-card title/metrics to one compact line with transit title/status priority, kept endpoint names to one ellipsized row on narrow phones, clipped the duplicate route-level street row visually at <=430px while retaining it for assistive technology, and set the compact ribbon to its 44px touch floor. Stop and segment controls remain >=44px.

Validation: focused route-sheet/content-fit/map tests passed 29/29 and scoped `git diff --check` passed. On the existing authenticated zrok journey at 384×779, before→after expanded sheet height was 462→399px; bus card 96→50px; compact ribbon 46→44px; the stop list fit its viewport exactly (192px client/192px scroll), with all three legs, the wait row and CTA visible together. The first browser pass exposed stale CSS because `DISABLE_HMR=true`; restarted only the Codex-owned Site process on canonical 7777, refreshed the same route, fixed title truncation, and rechecked. Screenshot was visually inspected in the browser tool but not saved as a separate evidence file. Console has only upstream basemap sprite warnings (`circle-11`, `wood-pattern`), no JS errors; the basemap itself appeared black in the final capture, so map rendering/geometry is not accepted by this check. Resources after the test/browser checkpoint: 30% free RAM, 18 GiB free disk, 9.1 GiB encrypted swap; no safe cache cleanup candidate, nothing deleted. Production remains NOT_RELEASED.

Next: with load settled, first recheck why the basemap appeared black after the same-port restart; then check the existing zrok route at 390px/430px and active navigation for matching density. Avoid more height reductions if they threaten labels or 44px controls. Preserve the single 7777/zrok interface. Do not open another site or port.

## CURRENT CHECKPOINT — route sheet safe-area compaction, 2026-11-11

Updated only the active Qoder Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` on canonical port `7777`; preserved all dirty work. Route details and active navigation now reserve the device/tab-bar bottom clearance once, use the same 8 px minimum when the global navigation is visible, and share the same 2 rem top corners. The CTA wrapper no longer adds another safe-area inset. The stop and segment controls remain at least 44 px. This removes duplicated bottom padding without shrinking touch targets.

Validation: `npm run typecheck` passed; focused density, content-fit and route-map suites passed 28/28; `git diff --check` passed. Local and existing zrok journey routes return HTTP 200. After restarting only the Codex-owned Vite session on the same port (needed because `DISABLE_HMR=true` leaves the Vite module graph stale), both zrok-served transformed route modules contain the new shared bottom-inset logic. This proves source delivery, not rendered visual acceptance. CUA still returns `browser.user is unavailable`; no screenshot or DOM measurements were available, so visual compactness remains NOT_TESTED.

Resources before/after the focused check: free RAM 33% → 39%; disk 18 GiB → 18 GiB; encrypted swap used 9.0 → 9.2 GiB. Latest post-restart sample: RAM free 30%, disk 18 GiB, swap 9.1 GiB; Codex/WindowServer CPU activity remains. No second heavy job was started. Disk is below 20 GiB; no clearly disposable unused cache was identified, so nothing was deleted. Production remains NOT_RELEASED.

Follow-on: Server route-engine oracle + adversarial candidate-retention fixtures passed 9/9 on dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; this proves objective/transfer/truncation behavior on fixtures only, not live providers. Latest resources after that single test: free RAM 28%, disk 18 GiB, swap 9.1 GiB; Virtualization VM ~62% CPU. Defer more heavy work until load settles. The existing zrok browser bridge still reports `browser.user is unavailable`.

Next: prioritize the first release gate: recover read access to the existing authenticated zrok tab, then prove one user flow end-to-end (sign-in → provider-backed route → geometry/stops/fare → navigation). Do not bypass auth or claim fixture data as live. Root Playwright E2E disables GTFS and realtime and targets a different zrok URL, so do not use it as live-route proof or repoint it at the canonical app. Once browser access is restored, measure the same route-sheet viewport in details and active navigation. Separately, pin the exact release artifact/runtime tuple; metadata materializer and Docker wiring already exist, but the running development API remains unpinned. Keep the single canonical port and do not deploy.

## CURRENT RESUME — compact-sheet source is now loaded on canonical server

Vite was started with `DISABLE_HMR=true`; this intentionally disables file watching, explaining why its in-memory CSS stayed stale. Confirmed PID 22030 and parent npm PID 22016 belonged to the canonical Site worktree, stopped that same-port dev-server process, and restarted only the Site on `127.0.0.1:7777` (current PID 25222, owned exec session 65926; keep this session running). Localhost and zrok now both serve the edited density module at the normal URL: stack gap 2 px, card vertical padding 2 px, ribbon 46 px, stops inset 2 px. Route returns 200. Tests previously passed 21/21. CUA remains unavailable (`browser.user is unavailable`), so visual/interaction acceptance is still NOT_TESTED. API `/healthz` and `/readyz` return 200, but `/api/v1/journeys/search` is auth-protected; real provider-backed search is NOT_TESTED. Latest resources: RAM free 32%, disk 18 GiB, swap used 9.1 GiB; no further heavy task started and no safe cache cleanup identified. Next: restore existing zrok browser access and measure the same route at the same viewport; then continue authenticated route→map→navigation proof. NOT_RELEASED.

## RESUME BLOCK — route sheet compactness pass; Vite module cache stale

Backend readiness is currently healthy on API PID 66637 at `:3002` (`/healthz` and `/readyz` both 200; DB and realtime report connected). The production journey search endpoint is explicitly `requireAuth`; this does not yet prove a provider-backed route. Reuse the already-authenticated zrok session when its browser bridge recovers, and verify provider-backed search through UI→API→map before navigation acceptance.

Latest Site source at dirty HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` (`qoder/route-geometry-continuation-20261110`) has tighter shared route-sheet rhythm in `src/views/routeSheetDensity.css` (card padding 4→2 px, list gap 3→2 px, summary/endpoints spacing, ribbon 48→46 px, stop-list inset 4→2 px); 44 px controls remain. Targeted `route-sheet-content-fit` + `journey-route-map` tests pass 21/21. Important: Vite's normal module URL on local 7777 and zrok still serves cached old CSS; a cache-busted URL returns the new CSS. Do not claim the CSS change is visible until the Vite module graph/browser is refreshed. Existing signed-in zrok tab is listed, but CUA reads/screenshots fail with `browser.user is unavailable`; do not launch another browser/port or restart PID 22030 (ownership not established). Current resources: 17 GiB disk, RAM free 29%, swap ~10.7 GiB; Virtualization process active. Next: revalidate HMR/module invalidation when resources settle, then use the existing zrok tab to capture/measure the same route and viewport. No safe cache cleanup candidate confirmed. Keep NOT_RELEASED.

## RESUME BLOCK — route stop density and zrok visual checkpoint

Site `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, serves canonical port 7777 through the existing zrok URL (PID 22030, Vite cwd is the same Site worktree); local and zrok return HTTP 200. On the authenticated existing route `/journeys/2b9503af-6b54-4b1c-bb25-5558b6f1228d`, implemented zoom-gated intermediate stop markers (min zoom 12.5) while pickup/drop-off/transfer stay at all scales. In zrok, selected A41, opened/collapsed its 33-stop list, returned to full route, and visually confirmed the full overview and all three collapsed itinerary legs with the CTA on a 384×768 browser viewport. Focused map showed a cleaner route; exact zoom-threshold transition still needs a dedicated close/far comparison. Targeted geometry/sheet suites passed (26/26 and 12/12), `npm run typecheck`, targeted ESLint, and `git diff --check` passed. Latest resources: RAM free 29%, disk 18 GiB, encrypted swap 9.28 GiB; no safe disposable cache identified, no cleanup. Next: capture a controlled far/near zoom comparison and inspect the actual provider/source and freshness behind GPS status, then prove UI→API→DB/provider and real navigation. Preserve all dirty changes. NOT_RELEASED.

## RESUME BLOCK — upstream style/sprite evidence gathered

Configured OpenFreeMap bright style and sprite return HTTP 200 with browser-like User-Agent; style v8 contains 119 layers. `circle-11` and `wood-pattern` are absent from the sprite index and full style JSON, so warnings arise from dynamic vector feature icon requests; likely optional POI/landcover, but inspect live browser impact before changing. Current port 7777 PID 22030 is not our recorded process; do not restart/kill it. CUA cannot reach existing user tab this turn. RAM 29%, disk 18 GiB, swap ~9.54 GiB. Next: visually inspect map warnings and confirm route remains legible using the current owner zrok tab once automation reconnects; continue first real UI→provider journey proof. Preserve dirty changes; NOT_RELEASED.

## RESUME BLOCK — map style warnings are upstream, inspect when load permits

MapLibre warned that `circle-11` and `wood-pattern` are absent; no references or assets with these IDs exist in Site source, so they appear to come from the configured external basemap style/sprite. Do not add guessed replacement glyphs; verify style/sprite response and visual impact first. Current Docker renderer ~74% CPU, RAM free 29%, swap 9.76 GiB, disk 18 GiB. Defer browser/build and do not delete uncertain caches. Next safe progress: continue source-level API/provider provenance review, then return to zrok visual QA when Docker/browser load settles.

## RESUME BLOCK — live label clarified; browser reconnection needed

Server implementation marks live status for route-scoped fresh vehicles, not necessarily the specific scheduled trip in progress. Site badge copy now says “GPS ОНЛАЙН”. Targeted route/navigation suite 26/26 and typecheck pass; local 7777 and existing zrok root HTTP 200 after restart. Current browser automation cannot access its user session, so visual verification of the copy is NOT_TESTED. Vite also logged missing MapLibre style images `circle-11` and `wood-pattern`; inspect source and map impact before fixing. Next: restore browser access and inspect rendered badge/network-derived status; then capture provider-backed journey result and navigation. Dirty diffs preserved; NOT_RELEASED.

## RESUME BLOCK — current live badge requires fresh evidence

Site changes now refuse to show stored-only LIVE as current; active status requires live API evidence. Targeted route/navigation suite 26/26 and typecheck pass. On zrok, the scheduled itinerary and not-active navigation message coexist with a LIVE transit badge; these may describe timetable vs vehicle feed separately, so inspect authenticated API payload, freshness, trip/route identity before further changes. 7777 is our Vite process (session 19758) and zrok route is loaded. Last resource sample RAM 36%, disk 18 GiB, swap 9.36 GiB; avoid heavy work while competing desktop load persists. Next: capture live endpoint evidence through normal signed-in UI, then prove planner response origin/provenance and real navigation. No production release.

## RESUME BLOCK — readiness verified; focused planner tests pass

Server process PID 66637 cwd `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, API v1. `/healthz` ok; `/readyz` confirms DB and realtime connected on 3002 and through 7777. Focused Server journey/multimodal tests: 69 pass, 0 fail. Still no direct evidence of provider-backed API result through signed-in UI. RAM 33%, disk 17 GiB, swap 10.1 GiB; Docker VM CPU ~69%, so defer browser/build workload until CPU pressure subsides. No safe disposable cache identified. Next: continue actual signed-in search and verify provider provenance and navigation; preserve all Site/Server dirty diffs. NOT_RELEASED.

## RESUME BLOCK — canonical web/API processes checked

Site 7777 PID 17605 (active Qoder worktree) and zrok root return HTTP 200. API target 3002 is served by PID 66637 from canonical root server checkout. Common health paths return 404; source has authenticated `/api/v1/transport/health`, but no authenticated API check yet. RAM free 28%, disk 17 GiB, swap 10.1 GiB used; CPU busy in Codex/WindowServer, so defer expensive checks until pressure eases. No safe cache deletion identified. Next: use signed-in zrok route to inspect actual API-backed journey/auth state, then record provider and DB evidence before touching further geometry. Preserve worktree diffs; NOT_RELEASED.

## RESUME BLOCK — prepared route reveal; signed-in zrok

Site dirty HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; own 7777 PID 17605, existing zrok session signed in. Prepared route reveal sampling removes repeated segment length calculation; geometry fixtures 22/22, typecheck and targeted lint passed. zrok real Sykhiv–Varshavska route and A41 segment rendered and responded to selection; animation, geographical accuracy, live status and full acceptance remain unverified. Continue geometry QA and fix confirmed issues; preserve all dirty work. Resource before/after: RAM free 32%/31%, disk 18/18 GiB, swap 9,034/9,652 MiB; no confirmed safe cleanup candidate and no deletion. Earlier login blockers below are superseded. NOT_RELEASED.

## RESUME BLOCK — owner home reference

Running Site HomeHero now uses masked decorative crops from the owner-supplied home reference for pass/action/destination artwork; actions remain live elements. Typecheck and targeted ESLint passed, home/design suite 41/41 passed, asset HTTP 200. zrok requires normal owner sign-in before screenshot comparison; pixel identity is NOT_TESTED. Verify cropping, layout, tap behavior and mobile viewport, then refine. Preserve all dirty work.

## RESUME BLOCK — geometry 12 baseline

Read `docs/MARSHGO_INTELLIGENT_GEOMETRY_12_REQUIREMENTS.md` and acceptance report. The user requires visual audit before geometry 12 changes. Existing zrok session is at normal login after reload; owner sign-in requested. Then capture actual route/screens and profile. Source audit identifies RAF repeatedly recomputing polyline lengths in `interpolateLineProgress`; benchmark and optimize only while preserving actual geometry and cancellation. Existing focused fixture subset 62/62 passed; not live/visual proof. Preserve all dirty changes and use port 7777.

## RESUME BLOCK — verification and sign-in

Server checkout HEAD `e9934abbd8fc973177de8d7f47548739758a1b74` fixture test `live-journey-vehicles.test.ts` passed 7/7 (using Site tsx). Running API identity not confirmed. Site route sheet/lifecycle/map selection rerun passed 57/57 after fixing selector/source-test collision; geometry/fleet suite 40/40 and typecheck passed before final notice-only change. zrok tab is at normal sign-in; owner input requested. Resume browser acceptance after login and keep data source claims separate from fixtures. User approved 20% free RAM threshold.

## RESUME BLOCK — unconfirmed geometry hidden

In running Site worktree, route detail/active map, camera and reveal use confirmed route segments; estimated walking/micromobility chords remain in data but are not drawn. Details show walking-geometry notice. Typecheck passed; focused suite 40/40 passed; real zrok/browser/mobile acceptance remains pending normal owner sign-in. Verify missing geometry messaging in active navigation as well as map accuracy and potential gaps. User-approved 20% free RAM minimum applies.

## RESUME BLOCK — focused approach freshness

Site focused fleet and labels now use server-emphasized candidates only (up to three, 90s age/30s future skew) and a timer to expire fixes if polling stalls. Typecheck, targeted ESLint and 15/15 focused fixture tests passed. Browser E2E timer, live GPS/ETA, route geometry and sheet remain NOT_TESTED. Existing zrok tab 2 is at normal login after reload; owner sign-in requested. User set 20% free RAM threshold; retain other resource safeguards.

## RESUME BLOCK — passenger camera and sign-in

Owner approved 20% minimum free RAM; existing continuity automation updated, single-heavy-process and disk rules remain. Passenger camera context now excludes A/C and unsliced full routes; focused labels omit outside termini. New focus tests 4/4 and wider suite 34/34 passed, typecheck passed. zrok existing tab 2 returned to normal login after reload; await owner sign-in, then verify current build and sheet/Next/geometry visually. Live GPS motion, ETA, HyperFlight and complete acceptance remain open.

## RESUME BLOCK — stop list spacing

Shared stop panel padding is now 4px per edge in `src/views/routeSheetDensity.css`; verify the owner’s vertical spacing concern in the actual sheet and maintain accessible touch targets. CSS returned 200 on 7777; visual result NOT_TESTED (free memory 30%, disk 17 GiB).

## RESUME BLOCK — focused passenger geometry

Focused overlay now draws verified B only, keeps A/C data, and does not render unsliced full routes as passenger geometry. `tests/focused-passenger-zones.test.ts` added; focused geometry suite 25/25 passed, earlier geometry/camera/vehicle fixtures 64/64. Check real zrok rendering, walking connections and fallback; typecheck after this change pending. Browser attachment unavailable; RAM 29%, disk 17 GiB; defer heavy checks below 35%. Preserve all dirty changes.

## RESUME BLOCK — transit geometry 11

Read `docs/MARSHGO_TRANSIT_GEOMETRY_11_REQUIREMENTS.md` and `docs/MARSHGO_TRANSIT_GEOMETRY_11_ACCEPTANCE.md`. Current Site 7777 serves dirty worktree HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; zrok HTTP 200 but tab control unavailable. Verify content-sized sheet in browser before further changes. Fleet is GeoJSON; the separate straight-line glide is not called with non-null positions by current screens. Geometry, live matching, HyperFlight and mobile acceptance remain open. Memory 30–34%, disk 17 GiB; defer heavy work below 35%.

## RESUME BLOCK — smartphone sheet readability

Narrow-screen sheet styles (<=380px) allow stop names two lines and bound fare width in details and active navigation. CSS served on 7777 and diff check passed. Verify real phone viewport, text clipping, gestures and visual parity; browser control was unavailable and free memory 33%, so no after-change visual check. Preserve dirty files.

## RESUME BLOCK — stage preview parity follow-up

In running Site worktree, route-detail and navigation stage cards now share density, compact ribbon, collapsed stop controls and waiting rows. Typecheck passed and 17 focused tests passed; previous source-anchor failure corrected. After-change visual check and Next/stop gestures remain NOT_TESTED because the 7777 browser tab reports `browser.user is unavailable`; transfer hint parity remains to verify. Preserve dirty work and use current port 7777.

## RESUME BLOCK — unified stage cards

Site active-navigation expanded cards now share the route-detail layout and sheet density CSS; existing route-sheet tests 4/4 passed, Vite component returned 200 and diff check passed. Visual comparison, Next interaction and stops controls are NOT_TESTED after change. Free memory 33%, disk 17 GiB; defer heavy browser checks until >=35%. Preserve all dirty work and use existing 7777 process.

## RESUME BLOCK — content-aware expanded route sheet

Existing 7777 tab was accessible and showed a large blank area in the expanded sheet with stops closed. `JourneyRouteMapScreen.tsx` now measures list content and clamps the expanded detent, sharing that height with drag settling. Component HTTP 200 and diff check passed. Critical: after-change visuals, stops expansion, drag and automated tests are NOT_TESTED; memory dropped to 28%, defer heavy checks until >=35%. Reload existing 7777 page when safe and verify before claiming completion. Preserve dirty work.

## RESUME BLOCK — route sheet follow-up

`routeSheetDensity.css` is imported by `JourneyRouteMapScreen.tsx` in the running Site worktree. It tightens spacing and CTA and centers segment content; Vite component and CSS each return HTTP 200. The expanded detent is still fixed and unused space can remain. Visually verify and measure through the existing zrok tab, then implement content-aware sizing with correct drag/camera coordination and tests. Browser attachment failed; free memory 31%, disk 18 GiB, so heavy checks deferred.

## RESUME BLOCK — route sheet density (partial)

In active Site worktree, `JourneyRouteMapScreen.tsx` groups segment metrics with the heading and fare beside the 44 px stops button. Vite component returned 200 and diff check passed. Expanded detent remains fixed; check unused space and fit with stops collapsed on the real zrok route and complete content-aware sizing only after verifying drag/camera behavior. Browser verification blocked by tab attachment; memory 30%, disk 18 GiB. Preserve all dirty work.

## RESUME BLOCK — canonical home reference

Owner-approved image: `docs/design/reference/canonical-home-owner-2026-11-11.jpg`. In running Site worktree `qoder/route-geometry-continuation-20261110` at `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, scoped home layout work started in `src/views/homeReference.css` and its import in `HomeHero.tsx`. Preserve all pre-existing dirty changes. Visual comparison with the reference and remaining artwork are NOT_TESTED / incomplete. Use existing zrok → 7777 when browser control and resources permit; do not claim pixel identity.

## RESUME BLOCK — 2026-11-11 — owner’s previous UI on zrok target

1. Supersedes the 01:53 block below: PID 89187 now serves the existing dirty Qoder Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` on 127.0.0.1:7777, branch `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`. The source contains recent monochrome and bottom navigation changes; this is a candidate for the owner’s prior UI, not a visually confirmed match. Preserve both Site worktrees and their changes.
2. Existing zrok root returns HTTP 200. The browser bridge cannot attach to the owner’s existing tab; open the home page in that same zrok tab and compare against the owner’s supplied canonical screenshot when browser access and resources permit. Do not introduce another port or claim visual verification.
3. Disk 18 GiB available, memory free 31%, swap 9,233.88 MiB used; defer heavy work below 35%. Cache inventory identified node-gyp (128 MiB), with use unconfirmed; no deletion. Production remains NOT_RELEASED.

## RESUME BLOCK — 2026-11-11 01:53 EET — existing UI/tab inventory

1. Read-only CUA inventory found six in-app tabs: two on the canonical zrok hostname, one localhost `:7777` tab for the same Site, and two old `:4178/tests/visual/hyperflight-navigation.html` previews plus one stale `:4178/bottom-sheet-visual.html` tab. No `:4178` listener exists; these are not another running product UI. Do not launch or use them as the production interface.
2. The only active product frontend is canonical `MarshGO-Site` at `antigravity/ultimate-premium-web-9`, HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`, served by PID 85203 on `127.0.0.1:7777` and the existing zrok share (read-only root probe 200). Keep the public zrok address as the sole user-facing entry; do not open localhost or start another port.
3. No separate live monochrome website was found. The older root `HomeV5` is part of the explicitly stale root source copy and must not be substituted for the Site entrypoint. The current canonical Site home is `HomeHero`; the user's latest direction allows its color palette. CUA cannot attach to the owner's existing authenticated tab (`browser.user is unavailable`), so current rendered appearance remains NOT_TESTED; source inspection is not visual acceptance.
4. No code, tab, or process was changed. Production remains NOT_RELEASED.

## RESUME BLOCK — 2026-11-11 — canonical zrok target restored

1. The zrok share was returning 502 because its configured target `127.0.0.1:7777` had no listener. The correct canonical Site is `/Users/dima1203/Desktop/MarshGO/MarshGO-Site` (`antigravity/ultimate-premium-web-9`, HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`). Started its existing Vite dev command on its configured port 7777 only; local PID 85203 now listens on `127.0.0.1:7777`, and zrok root plus the requested journey route return HTTP 200. No service was restarted, no alternate port was used.
2. The earlier hook/session edits were in a separate Qoder worktree (`1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`), not the zrok-served repository. They did not change the active website; do not report them as a live fix. The served Site has existing dirty edits in `src/index.css`, `src/map/MapLibreAdapter.ts`, `src/map/journeyRouteModel.ts`, `src/views/JourneyRouteMapScreen.tsx`, and `src/views/ProductionMarketplace.tsx`; preserve them.
3. Visual screenshot and authenticated route rendering are still NOT_TESTED. The current Codex-controlled tab has no verified owner session, and browser access to the user's existing tab is unavailable. Recheck the existing zrok tab only (no localhost/other port) after free memory recovers to at least 35%; do not enter credentials or bypass auth.
4. Post-start resources: 33% free memory, 9,890.56 MiB swap used, 17 GiB disk free. Keep the running canonical Vite process; defer browser/build/test until resource gate clears. Production remains NOT_RELEASED.
5. Follow-up on the owner's active journey `fae1984d-6409-465c-888b-f80827d6c544`: zrok root and journey both return HTTP 200 through the same 7777 target; PID 85203 remains the listener. Latest free memory is 30%, so screenshot/browser inspection is still deferred; do not restart or move the server.

## RESUME BLOCK — 2026-11-11 01:18 EET — harden origin-bound session restore

1. In Site worktree `qoder/route-geometry-continuation-20261110` at HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` (dirty), fixed a proven recovery weakness: a `localStorage` session hint was treated as authority, so a missing hint skipped the refresh-cookie check. Removed that hint and now restore through the server's HttpOnly cookie; a 401 resolves to the normal anonymous state, while network errors remain errors.
2. Added focused coverage for valid cookie restore without local storage, anonymous 401, expired in-memory token clearing, and network failure. `git diff --check` is the only check run so far; do not claim tests pass. At 01:18 EET memory is below the 35% heavy-process gate, so defer the Node test/build and browser check.
3. Preserve concurrent geometry edits (`src/index.css`, map geometry/annotations, `HomeHero`, and related tests). Do not restart the shared zrok/Vite/API processes. Recheck the normal sign-in and deep-link journey after the focused unit test passes and safe browser resources are available.
4. Production remains `NOT_RELEASED`; source fix is not yet delivered/visually verified by the running preview and does not prove successful authentication.
5. Latest 01:21 EET resource check: 17 GiB disk free, 31% free memory, 9,786.25 MiB swap. Active Kilo process remained outside the edited auth files. Prior cache inventory found no safe cleanup candidate; do not touch mixed/active caches, Docker images/volumes, or evidence. Wait for ≥35% memory before tests/browser.

## RESUME BLOCK — 2026-11-11 01:13 EET — zrok transport works; journey is unauthenticated

1. Existing zrok URL and journey SPA route both serve successfully; API health/readiness are 200. The current browser tabs show the public MARSHGO intro on the journey URL, and the browser log snapshot has no console errors. The protected journey endpoint returns 401 when called without a browser session.
2. Site source explains the state: `restoreSession()` skips `/auth/refresh` when the origin-local `mg_session_hint` is absent. The `mg_refresh` cookie is host-only, so a login on `localhost`/`127.0.0.1` does not authenticate `marshgo-dima.shares.zrok.io`. If the hint was cleared on zrok while its HttpOnly cookie remains, source also skips refresh. No cookie, token, or localStorage value was inspected.
3. Therefore this is not evidence of a zrok outage; it is an unauthenticated browser session on the zrok origin. Use the normal “У мене вже є акаунт” login on the zrok host. Browser input dispatch timed out, so no login attempt or auth workaround was made. The preview is Vite development, not production.
4. Resources at 01:12 EET: 16 GiB disk free, 30% free memory, 10,894 MiB swap, load is high; defer heavy browser/build/test tasks under the 35% continuity gate. Keep shared zrok/Vite/API processes untouched. Recheck live protected journey only after normal sign-in becomes available.

## RESUME BLOCK — 2026-11-11 01:03 EET — auth-safe acceptance runner needed

1. zrok/Vite/API remain healthy by read-only probes; authenticated journey and map remain unverified because the signed-in tab cannot be attached (`browser.user is unavailable`). A local `127.0.0.1` session cookie is host-only and is not shared with the zrok host.
2. The canonical Server `scripts/run-integration-tests.sh` sets `AUTH_DEV_BYPASS=true` on its primary test API. Do not use that run to claim real login or user-journey acceptance; no bypass or test account was used.
3. Existing focused provider-availability suite is 8/8 on unchanged Server source/test inputs. Latest resource check at 01:02 EET: 16 GiB disk free, memory free 28%, swap 12,566.62 MiB, load 7.71/6.97/6.32. Defer browser/build/integration tasks under the 35% gate.
4. zrok `/api/v1/version` reports development with null build identity; this is an unpinned preview, not production. The release Dockerfile/metadata script can inject exact pins during a clean release materialization; do not mark the dirty preview as a clean build.
5. Next: restore authorized browser control or establish an auth-safe isolated acceptance runtime; then verify real login→search→provider-backed route→geometry→navigation. Keep `NOT_RELEASED` until this and remaining gates have direct evidence.

## RESUME BLOCK — 2026-11-11 00:59 EET — zrok confirmed; release pins still not promotable

1. zrok is up: public `/` and the journey SPA route return 200; `/api/v1/health` and `/readyz` return 200, with database and realtime connected. Existing zrok→Vite `:7777` and API `:3002` processes remain untouched. The protected journey API returns 401 without browser cookies; CUA still cannot attach (`browser.user is unavailable`), so the signed-in route symptom remains unverified.
2. Release tooling reads only root `RELEASE_MANIFEST.json`; current source references are `.github/workflows/ci.yml`, `scripts/{run-e2e.sh,run-e2e-server.mjs,run-browser-compat.sh,build-pwa.mjs}`, and `ops/scripts/materialize-release.mjs`. `docs/RELEASE_MANIFEST.json` is not consumed by these runners.
3. Root manifest is still `RC-2026-10-30-evidence.3` (Server `44f954b…`, Site `fef697e…`); docs copy is `.2` (Server `7bc1bcf…`, Site `2570e04…`). Both are `NOT_RELEASED`, API v1/migration 056, and the root's Nov 9 main snapshot explicitly is observation-only. Do not promote or synchronize pins until a clean, tested exact tuple exists.
4. Current resources at 00:57 EET: 14 GiB free disk, 30% free RAM, 14,676 MiB swap, load 7.19/6.72/5.99. Defer heavy local work. Continue safe source/release work; visual acceptance and production remain NOT_TESTED/NOT_RELEASED.

## RESUME BLOCK — 2026-11-11 00:50 EET — reclaimed only unused npm package cache

1. Cleared `/Users/dima1203/.npm/_cacache` after confirming it was 1.1 GiB, no install/cache jobs were active, and active `npm exec` processes had no open cache files. No repo, app, Qoder/Codex/browser cache, credential, evidence, image, container or volume was touched.
2. Disk moved from 13 GiB free to 15 GiB free. Memory stayed at 29%; swap rose from 12,992 MiB to 13,362 MiB; load is 8.33/7.30/5.78. Heavy tests/E2E/build remain deferred until memory recovers to ≥35%.
3. Docker builder prune was a no-op (`Total: 0B`); builder cache remains 286.1 MiB with 0B reclaimable. Do not retry another builder. The mixed `~/.cache` and active Playwright cache remain untouched. Provider suite remains 8/8; live catalog still runs old API code.

## RESUME BLOCK — 2026-11-11 00:47 EET — disk below 20 GiB; safe cache cleanup unavailable

1. Post-test host sample: 15 GiB disk free, 28% memory free, 12,819 MiB swap used, load 10.50/7.37/5.56. Defer integration suite, lint/typecheck, build and browser work until memory is at least 35%; existing test result remains 8/8.
2. Cache inventory: npm download cache 1.1 GiB and mixed `~/.cache` 2.2 GiB are not proven unused; Playwright cache 1.1 GiB is active. Docker has 1.70 GiB reclaimable images and 6.56 GiB reclaimable volumes—do not touch. Build cache showed 286.1 MiB before prune, but `docker buildx prune --force` returned `Total: 0B`; afterward Docker reports 286.1 MiB with 0B reclaimable and disk remains 15 GiB. Do not retry another builder or delete uncertain caches.
3. No repository, image, container, volume, credential, browser cache or evidence artifact was deleted. Current storage remains above 8 GiB; continue with read-only/source work until resource recovery. Production stays `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-11 00:37 EET — provider fix passes tests; live runtime still stale

1. In canonical Server worktree `antigravity/ukraine-12-transports-multimodal` at dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, `/api/v1/mobility/providers` no longer invents carpool/taxi/carsharing/transfer/train/intercity providers; the transfer tile now requires a registry `transfer` provider. Preserve all other dirty Server changes.
2. `transport-tile-availability.test.ts` now passes **8/8**, including the new rule that a nationwide provider needs a confirmed bbox whenever the search point is known. Server source/test `git diff --check` passes; no lint/typecheck was run after this isolated change.
3. Fresh public GET for Lviv coordinates still returns `MARSHGO Community`, Uklon/Bolt/Opti, Getmancar, Kiwitaxi/MARSHGO transfer, Укрзалізниця and inbus.ua as providers. This is the old loaded API behavior, not source behavior. Do not report the code fix as live-verified or restart API PID 66637.
4. The old `marshgo-local-api` containers are exited and their compose source is missing; do not start them. A safer guarded harness exists in `MarshGO-Server/scripts/run-integration-tests.sh`: it restricts DB URLs to loopback `marshgo_e2e` names, uses a unique Redis rate-limit prefix, and starts APIs on 3306/3307. Read-only SQL confirms `marshgo_e2e` exists in the active local Postgres cluster; ports 3304/3306/3307/3308 were free at 00:39 EET (recheck immediately before use). Do not target `marshgo` or API `:3002`.
5. This integration harness is fixture-backed and does not prove live provider-backed routing. It may run only after resources recover; it applies migrations to the dedicated `marshgo_e2e` DB and may create/delete test rows there, never in production. zrok remains healthy at `:7777`; authenticated browser UI is still inaccessible to CUA. Post-test resources at 00:37 EET: disk 21 GiB, memory 31%, swap 10,355 MiB, load 4.74/4.12/3.63. Release remains `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-11 00:23 EET — zrok tunnel verified; protected journey needs browser auth

1. zrok is reachable: public home and journey shell return HTTP 200, the public Vite module returns 200, and local Site `:7777` returns 200. zrok PID 33510 has established connections to the existing Vite PID 59193 on `:7777`; do not restart or repoint either process.
2. The Site `/api` proxy reaches Server `:3002`: public `/api/v1/version` and `/api/v1/mobility/providers` return 200; `/readyz` returns 200. Protected `/api/v1/journeys/{id}` and `/journeys/me` return 401 to unauthenticated curl, as expected without the user's browser cookie. This does not prove the user's session is expired.
3. Browser inspection remains unavailable (`browser.user is unavailable`), so the actual tab symptom is unknown. If the user still sees a broken page, inspect after browser attachment is restored; do not call the tunnel down based on the protected API response. No service was restarted.
4. At 00:21 EET: disk 21 GiB free, memory free 33%, swap 10,364 MiB used, load 2.64/3.37/3.37. No heavy work started. Release remains `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-11 00:13 EET — live API is ready but its runtime build is unpinned

1. Existing zrok `/healthz` and `/readyz` return HTTP 200; readiness reports database and realtime connected. `/api/v1/version` returns HTTP 200, API `v1`, environment `development`, but `buildId`, `commitSha`, `builtAt` are null and `sourceState=unknown`.
2. API PID 66637 CWD is canonical `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, current Git HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, with dirty source. Site Vite PID 59193 serves the dirty Site worktree on `:7777`; zrok PID 33510 forwards to it. Do not restart any of them.
3. No authenticated search was attempted. CUA still cannot attach to the existing signed-in journey tab (`browser.user is unavailable`), so the user flow remains unverified; no auth data was accessed.
4. Resources at 00:13 EET: disk 20 GiB free, memory free 45%, encrypted swap 10,968.56 MiB, load 3.64/3.34/3.21. No cleanup or process changes. Next: restore browser attachment and verify authenticated UI→API→route→map; keep runtime unpinned and release `NOT_RELEASED` until exact source/build evidence exists.

## RESUME BLOCK — 2026-11-11 00:09 EET — walk-label correction now passes tests, lint and typecheck

1. Follow-up to the 00:06 geometry fix: `tests/route-map-annotations.test.ts` passes **8/8**; targeted ESLint on the changed component/test passes; `npm run typecheck` passes; Site diff check passes. No line label is emitted for a missing or malformed WALK shape.
2. The broader geometry batch at 00:04 passed 34/34; previous current-diff route-map/join tests passed 27/27. Counts are separate runs, not a unique total. All are fixture/source-level checks.
3. Resources before typecheck at 00:08: 21 GiB disk, memory free 37%; after at 00:09: 21 GiB disk, memory free 39%, swap 10,660.62 MiB, load 2.50/3.21/3.16. No service/cache changes.
4. zrok HTTP forwarding is healthy; CUA attachment to both matching signed-in IAB tab records still returns `browser.user is unavailable`. Visual geometry remains NOT_TESTED. Next: continue once browser control is available; preserve dirty work and `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-11 00:06 EET — remove false walking label when path geometry is absent

1. Fixed a rendering mismatch in `MarshGO-Site/src/views/routeMapAnnotations.ts`: map labels for WALK legs now require validated route geometry. A malformed or missing path no longer gets a label positioned on a fabricated straight chord between endpoints.
2. Added regressions in `MarshGO-Site/tests/route-map-annotations.test.ts`. Focused result: **8 passed, 0 failed, 0 skipped** (0.350 s); Site `git diff --check` passes. Targeted lint/typecheck for this incremental change and authenticated visual check remain pending.
3. Resources before/after the single test: before 00:05, disk 21 GiB, free memory 37%; after 00:06, disk 21 GiB, free memory 30%, encrypted swap 10,395.56 MiB, load 3.41/3.46/3.22. Defer further heavy work until memory is ≥35%; no cache/process/service changes.
4. zrok public/local HTTP checks are healthy, but Codex cannot attach to the existing signed-in tab (`browser.user is unavailable`). Preserve the existing work and production `NOT_RELEASED` status.

## RESUME BLOCK — 2026-11-11 00:04 EET — route-geometry suite passes; live visual inspection still blocked

1. On Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, geometry-focused suite `tsx --test tests/line-geometry.test.ts tests/route-map-annotations.test.ts tests/transport-visual-zones.test.ts tests/route-geometry-intelligence.test.ts` — **34 passed, 0 failed, 0 skipped** (0.299 s). Site `git diff --check` passed. Together with the current-diff 27/27 route model + join checks and typecheck/targeted lint recorded at 23:58, this covers more of the current geometry diff; it is fixture/static evidence, not rendered-map acceptance.
2. zrok itself returns HTTP 200 and matches local `:7777`; visual attachment fails with `browser.user is unavailable`. Do not change or restart the signed-in browser, zrok or Vite. Route appearance in the user's authenticated page remains NOT_TESTED.
3. Post-test resources at 00:04 EET: disk 20 GiB free, memory free 36%, encrypted swap 10,803.38 MiB, load 3.76/3.52/3.21. No cache cleanup or process changes.
4. Next: obtain a working browser attachment, inspect console/network and real selected geometry, capture evidence, and correct only observed rendering defects. Preserve all dirty Home and geometry work; production stays `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-11 00:01 EET — zrok transport is healthy; Codex browser bridge unavailable

1. Read-only probes show `https://marshgo-dima.shares.zrok.io/` and local `http://127.0.0.1:7777/` both return HTTP 200 with the same ETag. Existing zrok share PID 33510 forwards to Vite PID 59193, listening on `127.0.0.1:7777`. This verifies tunnel-to-site HTTP delivery, not authenticated app rendering.
2. CUA can inventory the signed-in IAB tab, but attaching by its tab id fails with `browser.user is unavailable`. No reload, sign-in, browser profile, credentials, or process was changed. Therefore the visible-page failure (if any) is not explained by zrok transport; likely causes are the unavailable Codex browser-control bridge or an app/session/API rendering issue, which still needs an attached browser to distinguish.
3. Resource sample at 00:01 EET: `/` has 20 GiB free, memory free 30%, encrypted swap 10,780.81 MiB, load 4.39/3.25/3.05. Defer heavy browser/build work until the 35% free-memory threshold and contention gate clear. No cleanup or restart.
4. Next: regain browser attachment without disturbing the signed-in session, inspect page console/network and authenticated journey state, then continue route-geometry visual acceptance. Keep `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 23:58 EET — geometry tests, typecheck and targeted lint pass

1. Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; preserve all dirty Home/geometry files.
2. On the current diff: focused tests `tsx --test tests/route-join-continuity.test.ts tests/journey-route-map.test.ts` — **27 passed, 0 failed, 0 skipped**; `npm run typecheck` — pass; targeted ESLint on the changed model and two tests — pass; Site and root-notes `git diff --check` — pass. No build or visual browser acceptance.
3. Resources: before typecheck 23:57:41 EET, disk 20 GiB, memory 36%, swap 10,847.88 MiB, load 2.27/2.68/2.87; after typecheck 23:57:56, disk 20 GiB, memory 40%, swap 11,058.94 MiB, load 3.36/2.89/2.95; after targeted lint 23:58:13, disk 20 GiB, memory 32%, swap 10,898.94 MiB, load 2.84/2.80/2.91. Current load includes Codex Renderer ~38% CPU; Vite PID 59193 and zrok PID 33510 remain unchanged. No cleanup/process changes.
4. Defer browser/build until memory is ≥35% and contention settles. Updated source delivery was confirmed by zrok module fetch; rendered map still NOT_TESTED because authenticated browser attachment previously failed with `browser.user is unavailable`. Next: once safe, inspect the signed-in map, capture geometry evidence, and continue first end-to-end journey gate. Keep production `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 23:52 EET — focused geometry regressions pass

1. Latest active Site diff is in `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`. It prevents endpoint snapping across a missing stage and requires evidence before walking geometry is rendered as exact; estimates remain dashed.
2. Ran `./node_modules/.bin/tsx --test tests/route-join-continuity.test.ts tests/journey-route-map.test.ts`: **27 passed, 0 failed, 0 skipped**, 0.345 s. `git diff --check` passes. This is focused fixture evidence only; typecheck/lint/build/browser have not run on the latest diff.
3. Resource before/after the test 23:51→23:52 EET: disk 20→20 GiB free; memory 41%→33%; encrypted swap 11,015.06→10,807.06 MiB; load 2.26/2.96/2.99→2.19/2.91/2.97. Follow-up 23:53: disk 20 GiB, memory 32%, swap 10,836.31 MiB, load 4.11/3.30/3.10, WindowServer ~25% CPU. Existing Vite PID 59193 and other apps were left running. No cleanup or process changes. Defer further heavy work until memory is ≥35% and system load settles.
4. A read-only fetch from the existing zrok share returns the changed source, but authenticated browser attachment remains unavailable (`browser.user is unavailable`); no rendered geometry/screenshots claimed. Next: typecheck and targeted lint after resource recovery, then retry visual map acceptance without disturbing the signed-in session. Keep release `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 23:50 EET — geometry provenance now fails closed for walking paths

1. In the active Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, unverified WALK geometry is now dashed unless it has explicit `SOURCE_GEOMETRY`/`VERIFIED` accuracy or a known walking-router/pathway source. Explicit estimate metadata always stays approximate. This prevents a generic `walking-route` label from presenting an unsupported path as exact.
2. New regressions cover unverified walk geometry, estimate metadata, and route shapes separated by a missing stage. `git diff --check` passes. Read-only zrok source fetch returns the new checks, confirming source delivery only. Latest tests/typecheck/lint remain NOT_TESTED; prior 41/41 result predates these edits.
3. Resource 23:49→23:50 EET: disk 20→20 GiB free; memory free 30%→30%; encrypted swap 11,512.50→10,875.44 MiB; load 3.04/3.24/3.06→4.38/3.47/3.15. Virtualization VM reached ~58.5% CPU after the edit; Vite PID 59193, Qoder and Docker remain active. No cleanup or process changes. Defer tests/browser/build until headroom and competing load improve.
4. Visual map acceptance remains NOT_TESTED; CUA cannot attach to the signed-in zrok page (`browser.user is unavailable`). Next: run focused geometry tests and typecheck once resources are safe, then inspect the real map through the authenticated browser bridge. Production remains `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 23:46 EET — geometry joins now respect the original leg sequence

1. In the active Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` on `qoder/route-geometry-continuation-20261110` at base HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, endpoint snapping now applies only to consecutive original itinerary legs. A missing route shape can no longer cause neighboring displayed shapes to snap together. Walking `routeAccuracy=STRAIGHT_LINE_ESTIMATE` / `ESTIMATED` and `geometrySource=walking-estimate` also preserve dashed estimate styling when the generic source name is ambiguous.
2. Added regressions in `tests/route-join-continuity.test.ts` and `tests/journey-route-map.test.ts`. Site and root-notes `git diff --check` pass. A read-only zrok fetch of `src/map/journeyRouteModel.ts` includes the new original-leg index and accuracy checks; this verifies updated source delivery, not rendered map behavior. The newest tests/typecheck/lint have NOT been run; the earlier 41/41 geometry result applies to the prior snapshot only.
3. Resource before/after the lightweight review/edit: 23:43 → 23:46 EET, disk 21 → 21 GiB free; memory 33% → 34%; encrypted swap 10,716.75 → 10,901 MiB; load 3.64/2.69/2.79 → 3.76/3.43/3.09. Vite PID 59193, Qoder, Docker and Virtualization remain active. No cleanup/process change. Defer tests/browser/build until free memory reaches 35% and competing load settles.
4. zrok visual acceptance remains NOT_TESTED: the signed-in IAB tab cannot be attached (`browser.user is unavailable`). No screenshot or rendered-map claim. Next: rerun the focused geometry suite and typecheck when safe, then inspect the authenticated journey in the existing browser if the bridge becomes available. Keep `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 23:38 EET — live geocoder verified; authenticated journey still needs browser session

1. Current active preview remains Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; preserve its dirty Home art and route-geometry edits. Existing Vite PID 59193 on `:7777` was not restarted. Current Server API PID 66637 runs `MarshGO-Server/server/index.ts` from the dirty Server worktree at HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; do not restart it.
2. Read-only zrok probes at 23:33–23:36 EET: `/healthz` 200; `/readyz` 200 with database and realtime connected; `/api/v1/places/suggest` returned the actual Lviv/Sykhiv result at 49.794117, 24.057585, Warsaw Street at 49.8657606, 24.0123672; reverse geocoding returned the matching Sykhiv label. This verifies the live address step only. `/api/v1/version` still reports `buildId/commitSha/builtAt=null`, `sourceState=unknown`, environment `development`, so the tunnel is not a pinned release build.
3. Unauthenticated `POST /api/v1/journeys/search` returns 401; source confirms `requireAuth`. This is expected and no bypass was used. CUA still cannot attach to the authenticated zrok IAB tab (`browser.user is unavailable`); the regular Chrome window shows a profile picker, so no profile was selected and no credentials/session tokens were touched. Route search, route selection, rendered geometry and navigation remain NOT_TESTED.
4. Geometry work remains focused-test verified: 41/41 pass; `npm run typecheck`, targeted ESLint and `git diff --check` pass. Latest resource sample 23:36 EET: disk 20 GiB free, memory 34%, swap 10,659.88 MiB, load 2.98/3.10/3.00; Virtualization VM ~75% CPU. Defer browser/build/full tests while that competing load persists. No cache or process changes.
5. Next highest-impact action: regain access to the already-signed-in zrok tab, run the real Sykhiv → Warsaw Street journey through UI→API→provider→map→navigation, and capture evidence. Then pin the runtime build identity and continue remaining release gates. Keep production `NOT_RELEASED`; no deployment.

## RESUME BLOCK — 2026-11-10 23:11 EET — focused Home checks pass; visual bridge still unavailable

1. Owner confirmed sign-in; do not request another login. CUA inventory now sees the zrok journey tab, but `cua.getTab("30", { browser: "iab" })` still fails with `browser.user is unavailable`; no page interaction, screenshot, or console review occurred.
2. One bounded Site check against HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`: `tsx --test tests/home-marshpass.test.ts tests/home-fit-and-profile-ink.test.ts tests/home-short-viewport.test.ts` — **13 passed, 0 failed, 0 skipped**. This covers home ticket eligibility, layout sizing, destination cards, and short viewport behavior; it does not verify the artwork diff visually or prove pixel identity. `git diff --check` passes for Site. Read-only HTTPS fetch of the existing zrok Vite module returns the new `home-marshpass-promo__contour` and destination-marker class, confirming source delivery only.
3. Site branch/worktree remains unchanged at `qoder/route-geometry-continuation-20261110`; preserve uncommitted `src/index.css` and `src/views/HomeHero.tsx`. `:7777` remains Vite PID 59193 and was not restarted. Ternopil still points to a Lviv image; no correctly licensed local Ternopil source was found, so do not silently substitute another destination/photo.
4. Resource before/after the single test: disk 19 GiB free; memory fell from 36% to 29%; encrypted swap rose from 11,893.06 to 12,228.56 MiB; load changed 1.69/2.35/2.68 → 3.01/2.63/2.77. Defer all further heavy checks until memory is again ≥35% and CPU settles. Do not prune active npm/Playwright/Vite caches.
5. Root #24 exact-head verify remains failed at `889664978591c5a4d1264d550449ee8b3a24d089` / run `42855458564`; Admin private-repository access still needs owner-managed read-only Actions credentials. No authorized staging target/provider, integrated six-repository tuple, staging/rollback evidence, or production authorization exists. Keep `NOT_RELEASED`; no merge or deployment.

## RESUME BLOCK — 2026-11-10 23:08 EET — owner signed in; release work held at safe-resource gate

1. User confirms normal zrok sign-in and asks to continue without further input. No credentials were accessed. The authenticated page has not been visually rechecked in this checkpoint because memory is below the 35% heavy-browser threshold; current browser attachment limitation from the previous checkpoint remains unresolved.
2. Active Site preview on `:7777` is Vite PID 59193 from `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`; do not restart or alter it. Current Site branch is `qoder/route-geometry-continuation-20261110` at local HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, one commit ahead of its remote; only `src/index.css` and `src/views/HomeHero.tsx` are dirty in that worktree. Preserve them; no checks/build/browser were run on this tree after the artwork edit.
3. Read-only GitHub check on Root PR #24 exact head `889664978591c5a4d1264d550449ee8b3a24d089`: verify workflow `42855458564` remains FAILED; CodeQL and Gitleaks succeed. Prior failure evidence identifies HTTP 403 cloning private Admin using `MARSHGO_REPOS_READ_TOKEN`. This requires the owner-managed Actions secret to have read-only Contents access to both Admin and Partner; do not request or print the secret value. Site PRs #127–129 remain separate from the 10-commit local integration branch, so do not bulk-push it.
4. Disk/memory checkpoint 23:08 EET: `/` has 19 GiB free; memory-pressure free 31%; encrypted swap used 12,007.19 MiB; load 2.48/2.67/2.83. Virtualization VM ~48% CPU and WindowServer ~32%. Defer heavy test/build/browser. Cache inventory: npm cache 1.1 GiB has active npm MCP consumers; Playwright cache 1.1 GiB has active Playwright MCP; Vite cache 11 MiB belongs to the active preview; Xcode cache 620 KiB. No cache is safe and worthwhile to remove; no cleanup performed.
5. Continue only lightweight, non-mutating release preparation until memory is at least 35% and competing CPU load settles. Then do one bounded visual/browser or test/build process at a time against the signed-in preview, verify the served SHA/worktree, and reconcile Site PR overlap before any release candidate. Root CI token access, authorized staging URL/provider, integrated six-repository candidate, staging acceptance and rollback evidence are still blockers. `NOT_RELEASED`; no merge, port/service/container change, or deployment.

## RESUME BLOCK — 2026-11-10 23:00 EET — owner login confirmed; browser bridge still blocked

1. User confirmed sign-in to zrok. The IAB inventory shows the route URL, but attaching the tab still fails with `browser.user is unavailable`; no screenshot or interaction evidence could be collected. Treat the visual gate as NOT_TESTED, not as a login blocker.
2. Active Site branch `qoder/route-geometry-continuation-20261110` has 10 commits / 40 files (1,588 additions, 327 deletions) relative to Site main; no PR exists for this integrated branch. Latest Codex dock fix is local at `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` and the home hybrid remains uncommitted in `src/views/HomeHero.tsx` and `src/index.css`. Do not push the whole branch as if it were a small UI fix; first reconcile overlapping #127–129 scope.
3. Site #127, #128, #129 are separate open PRs; #128/#129 remain drafts. Their individual checks are not integrated acceptance. Root #24 still fails private Admin materialization (HTTP 403); the owner must update the read-only secret for Admin and Partner. Staging is unset; no deployment.
4. Resource sample 23:00 EET: disk 20 GiB free, RAM free 29%, encrypted swap 11,742.75 MiB, load 2.59/3.09/3.04. Do not start local build/browser/test until resource headroom clears the 35% gate. Leave Qoder, Docker, :7777 and browser processes untouched.

## RESUME BLOCK — 2026-11-10 22:53 EET — canonical home hybrid in progress

1. User provided two canonical home references and asked for the best/hybrid direction. Decision: use reference 2's restrained graphite/navy structure with reference 1's warmer travel imagery. Active HomeHero already uses the matching Kyiv sunset and mountain-road assets; the route-card structure and five-item dock stay unchanged.
2. In the active Site worktree at HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, made an uncommitted art-only refinement in `src/views/HomeHero.tsx` and `src/index.css`: subtle map-contour strokes in the ticket illustration and toned-down blue glow. No fake ticket QR or new provider imagery was added.
3. Site `git diff --check` passes. No automated test/build/browser run after this UI change. Visual zrok attachment still fails with `browser.user is unavailable`; do not mark visual acceptance verified.
4. Resource sample 22:53 EET: 20 GiB free disk, 29% free RAM, 11,298.19 MiB encrypted swap; `mds_stores` and Qoder renderer each about 30% CPU. Defer heavy work and leave existing processes unchanged.
5. Release gates remain as documented below: Root #24 private-repository access failure, draft product PRs, no staging target, and no integrated six-SHA candidate. `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 22:45 EET — post-Qoder handoff

1. Active Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`; Codex committed the two-file dock-inset follow-up as `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` (parent `708eb8f7a7edf3bc904c92e105a6005a66fef312`). No push/PR. The exact tree had 8/8 focused tests, typecheck, targeted ESLint, and diff check pass before commit.
2. Browser tab list shows the zrok journey URL, but attaching the in-app browser fails with `browser.user is unavailable`; screenshot, interaction, and login state remain NOT_TESTED. No credentials were read or entered. Continue visual acceptance only when the normal authenticated tab can be attached.
3. Root PR #24 remains open; materialization fails with HTTP 403 cloning private Admin using the configured read token. Owner must grant read-only Contents access for both private Admin and Partner and update the secret. Site #129 / Server #137 remain draft; separate green checks are not integrated acceptance.
4. Staging URL/provider are unset; manifest still has historical pins and NOT_RELEASED. Do not deploy. Next release work needs an authorized staging target, exact merged six-repository SHA tuple, integrated acceptance, and rollback evidence.
5. Resource sample 22:45 EET: 20 GiB disk free, 30% free RAM, 11,104.12 MiB encrypted swap, load 2.75/2.57/2.93. Defer heavy builds/browser tests while below the 35% continuation threshold. Existing Qoder and :7777 processes remain untouched.

## RESUME BLOCK — 2026-11-10 22:41 EET — production-readiness follow-up

1. Qoder coding session has ended. Active Site branch/worktree: `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, `qoder/route-geometry-continuation-20261110`, HEAD `708eb8f7a7edf3bc904c92e105a6005a66fef312`; only Codex dock remeasurement hook/test are uncommitted. Current focused checks pass 8/8, typecheck, targeted ESLint, diff check. Preserve dirty root and other Site worktree.
2. Current root PR #24 exact head `889664978591c5a4d1264d550449ee8b3a24d089` CI `42855458564` fails materialization: private Admin clone returns HTTP 403. Security succeeds. Owner-managed `MARSHGO_REPOS_READ_TOKEN` must have read Contents access for both private Admin and Partner; never paste a credential into chat.
3. Site #129/#128 and Server #137/#136 are still draft PRs despite successful individual CI. iOS #16 is open and its physical device check remains open. Do not merge or call these an integrated release tuple. Exact current six-main SHAs and PR evidence are in `docs/PRODUCTION_EXECUTION_STATE.md`.
4. `RELEASE_MANIFEST.json` is still `RC-2026-10-30-evidence.3`, `NOT_RELEASED`, `production_ready=false`, with stale component SHA pins and no staging URL/provider. Do not update pins until a new compatible candidate is assembled and accepted.
5. The zrok tab requires normal login; user said they would sign in. Continue authenticated Site visual acceptance after their reply. No credentials have been used.
6. Resource sample 22:41 EET: 20 GiB disk free, 32% free RAM, swap 11,026.25 MiB; mobileassetd ~63% CPU and Virtualization ~32% CPU. Defer heavy build/browser until resource headroom recovers. No production deployment, merge, cache cleanup, restart, or port change.

## RESUME BLOCK — 2026-11-10 22:34 EET — focused code checks done; await authenticated zrok

1. Site shared branch HEAD remains `708eb8f7a7edf3bc904c92e105a6005a66fef312`; Codex's 28 added lines remain uncommitted in the map-aware dock hook/test. No reset, commit, push, port restart, or deployment.
2. Current code checks: 8/8 focused tests passed; typecheck exit 0; targeted ESLint exit 0; Site diff check passed.
3. A visible zrok tab is open at the MARSHGO login form. I did not enter or read credentials. Please sign in manually in that tab and reply “готово”; then I can continue visual acceptance on the actual app. The previous authenticated tab is not attachable from this session.
4. Resource sample 22:34 EET: 20 GiB free disk, 30% free RAM, swap 11,246.25 MiB; metadata indexing ~17% CPU. Defer more browser/build work while below 35% RAM; no cache cleanup or process changes.
5. Once authenticated and resources recover, verify the exact zrok build, Home at 430×932 against the supplied reference, map toolbar entry/auto-hide/reveal, sheet inset timing, and capture screenshots. Visual/pixel match remains NOT_TESTED; production remains `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 22:30 EET — resource hold after transition-inset fix

1. The shared Site branch remains `qoder/route-geometry-continuation-20261110` at `708eb8f7a7edf3bc904c92e105a6005a66fef312`; Codex has 28 uncommitted added lines across the dock hook and focused test. `git diff --check` passes for Site.
2. The last change adds a global `transitionend` listener so map/sheet remeasure after the dock finishes showing or hiding. Prior snapshot had 8/8 focused tests, typecheck, and targeted ESLint passing; rerun after this final adjustment.
3. Resource check 22:30 EET: 21 GiB disk free, 34% free RAM, encrypted swap 10,559.44 MiB; Docker helper ~120% CPU and VM ~82% CPU. Defer more tests/browser/build until the host settles; do not stop Docker/VM or restart `:7777`.
4. zrok visual acceptance remains NOT_TESTED because the Codex in-app browser cannot be attached from this session (`browser.user is unavailable`). Keep authentication intact; do not switch Chrome profiles.
5. Next: when resources recover, run the two focused dock tests, typecheck and targeted lint; then complete authenticated zrok visual acceptance and compare the Home page at 430×932. No production deploy; `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 22:28 EET — Qoder session ended; finish Site dock acceptance

1. Shared Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, base shared HEAD `708eb8f7a7edf3bc904c92e105a6005a66fef312`. Qoder session ended with its model usage limit. Preserve its commits. Codex has a small uncommitted follow-up in `src/views/mapAwareBottomNavigation.ts` and `tests/map-aware-bottom-navigation.test.ts` to remeasure the sheet/map inset after the dock transform completes in either direction.
2. Before that last listener-scope adjustment, 8/8 focused dock tests, typecheck, targeted ESLint, and diff check passed. Rerun these on current code; Qoder-reported 690/690/full build are earlier evidence, not a fresh Codex run.
3. Latest resources 22:28 EET: 21 GiB disk free; 32% free RAM; encrypted swap 10,569.31 MiB; VM CPU 35.2%; defer new test/browser/build until memory recovers. No cleanup, restart, or port changes.
4. Visual gate is still NOT_TESTED: the existing Codex zrok tab cannot be attached from this tool (`browser.user is unavailable`). Do not switch into ambiguous Chrome profiles or bypass authentication. Use the existing authenticated preview only if access becomes available; verify it serves the intended Site worktree and record screenshots/measurements at 430×932.
5. After focused rechecks, inspect final diff, record any visual blocker, and update acceptance evidence. No production deployment; status remains `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 22:15 EET — shared Site dock committed, awaiting Qoder completion

1. Site worktree: `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, HEAD `708eb8f7a7edf3bc904c92e105a6005a66fef312`, currently clean. Shared commits `8ce005a` and `708eb8f` contain the map-aware dock and focused tests; preserve them and any new Qoder work.
2. Qoder app/worker/MCP/Playwright processes are still alive. Do not start a browser, build, or test while Qoder continues. Do not restart `:7777` or zrok.
3. Latest resource sample 22:18 EET: 21 GiB free disk, 31% free RAM, 10,438.88 MiB encrypted swap, load 3.61/3.83/4.57. Defer heavy checks; no cleanup was performed.
4. After Qoder stops: inspect final branch diff and commit provenance; verify dock hide/reveal, safe-area placement, and whether sheet/map remeasure after CSS transition. Then run a focused test process, followed by typecheck/build only if resource limits allow.
5. Visual gate remains pending: verify the authenticated zrok serves this exact worktree/build, inspect Home against the supplied iPhone reference at 430×932, and test map entry/auto-hide/reveal/sheet inset/keyboard/reduced-motion/return-to-map. Capture screenshots and measurements; do not claim pixel identity without them.
6. Production and deployment remain `NOT_RELEASED`; no production deployment is authorized.

## RESUME BLOCK — 2026-11-10 22:11 EET — Site dock behavior in parallel with Qoder

1. Keep working only in `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, current base HEAD `5bcfa3e2f1c9e16bc4484e22b9e91d9036789633`. Preserve the shared dirty diff; Qoder and Codex both touched `src/views/ProductionMarketplace.tsx`, but separate hunks are currently intact. Qoder also owns ongoing edits in `src/index.css` and `tests/tabbar-dock-pop.test.ts`. Do not reset, stage, or commit.
2. Codex added map-aware nav hide/reveal logic and three focused unit cases. `git diff --check` passed; tests/typecheck/build/browser are NOT_TESTED. Qoder worker and Playwright MCP are still live.
3. Do not start browser/build/full tests while Qoder is active or free RAM is below 35%. Do not restart `:7777` or zrok.
4. After Qoder stops, first inspect its latest commit and working diff, then reconcile the shared `ProductionMarketplace.tsx` hunks. Recheck disk/RAM/swap/CPU; run the new focused tests and Qoder's tab-pop test together as one bounded test process, then typecheck if resources allow.
5. Next visual gate: use the existing authenticated zrok preview only after verifying it serves the intended worktree/build; compare the active HomeHero at 430×932 (iPhone 15 Pro Max CSS viewport) with the supplied reference, then test map entry, dock auto-hide, bottom-edge reveal, sheet inset, focus/reduced-motion, and restoration when leaving map. Capture evidence. Do not claim pixel identity without screenshots.
6. Production and deployment remain `NOT_RELEASED`; no production deployment is authorized.

## RESUME BLOCK — 2026-11-10 13:44 EET — HyperFlight 9 Site candidate

1. Continue solo in `/Users/dima1203/.codex/worktrees/marshgo-bottom-sheet-density-20261110`, branch `codex/bottom-sheet-density-20261110`, base SHA `bebecdba1e7319d7f2fec7d2816a7bac6d13cbef`. Preserve the dirty canonical checkout and unrelated changes in the root worktree; do not stage root progress files.
2. Added a route-geometry preview flight for adjacent navigation legs, including reverse travel, safe docking checks, reveal, adaptive camera framing, 2D north-up, user interruption, and a non-GPS Scout marker. Bad or estimated geometry falls back to the existing segment focus. The bottom sheet height is unchanged.
3. Candidate checks: 662 tests passed/0 failed/0 skipped; 17 focused navigation/geometry tests passed; typecheck, ESLint, production build, token check, bundle check, single-React check, and `git diff --check` passed. The final CSS-only token adjustment was followed by build, token, and diff checks; the test suite/typecheck/lint had passed immediately before it.
4. Visual acceptance is BLOCKED: the open zrok page showed a temporary service error and an older route-details screen, not this worktree or active navigation. The `playwright` module is missing for `boot-smoke`. iPhone Safari, performance measurements, and demo video remain NOT_TESTED. Do not change the shared tunnel or `:7777` to expose this candidate.
5. Detailed evidence is in `MarshGO-Site/docs/MARSHGO_HYPERFLIGHT_9_ACCEPTANCE.md` in the candidate worktree. Implementation commit `d4aba1dadc182747806950ca321bb7a99806de20` passed CI run `42810336926`; latest report-only head `4d6eacedd0c19ed4a4c0e8e0cf33fbc0cc4366fa` passed both exact-head runs `42810779676` and `42810788294`, including browser boot smoke. Both commits are pushed to draft PR [#129](https://github.com/dima1203oleg/MarshGO-Site/pull/129). Overall status PARTIAL / `NOT_RELEASED`. Next: visual/device acceptance only when a safe candidate session is available.

## RESUME BLOCK — 2026-11-10 11:06 EET — Solo Direct-Only acceptance

1. Work only in isolated Codex worktrees; user explicitly asked to continue without Qoder or other outside coders. Canonical Site/Server checkouts and all pre-existing dirty files remain untouched.
2. Server candidate `/Users/dima1203/.codex/worktrees/marshgo-server-direct-only-acceptance-20261110`, branch `qoder/lviv-direct-only-acceptance-20261110`, is based on current Server `main` `c7d434d5c32e44970357cc9103fb6f8f1abca4ed`. Commit `2e04e73300232c177500e75bb4effd8dfd2eb31e` changes only `tests/gtfs-walking-reach.test.ts`. Draft PR [#137](https://github.com/dima1203oleg/MarshGO-Server/pull/137) is OPEN/DRAFT; both exact-head checks PASS (`42787406186`, `42787445017`).
3. Focused result: 8 passed, 0 failed/skipped; `git diff --check` passed. Post-test resources were 23 GiB free and 33% free RAM; latest sample after remote PR checks: 24 GiB free, 29% free RAM, encrypted swap 9.40 GiB. Spotlight remained CPU-heavy; no second build/browser/full suite was run and no process was stopped.
4. Site PR [#128](https://github.com/dima1203oleg/MarshGO-Site/pull/128), head `1c2811e4e6258fef50687e3cdc1075920c4d6383`, is OPEN/DRAFT and both exact-head CI checks are SUCCESS. Physical iPhone, visual browser review, live feed and performance acceptance remain incomplete; do not merge or mark ready.
5. Next: keep PR #137 in draft pending broader routing acceptance; do not merge this test-only slice as product completion. Continue Lviv live acceptance, provider evidence, browser/device and production gates only as resources and exact pinned inputs permit. Release remains `NOT_RELEASED`.

## CHECKPOINT — 2026-11-10 — Site passenger-map focus candidate pushed

- Solo Site candidate branch `codex/intelligent-navigation-premium-20261110`, based on `origin/main` `895f51e0e1f728c5b3ba0458b2d98e74ad5fb62f`; latest head `1c2811e4e6258fef50687e3cdc1075920c4d6383`. Draft PR [#128](https://github.com/dima1203oleg/MarshGO-Site/pull/128) is open. No merge, deployment, or Server edits.
- Focused passenger overlay keeps only confirmed zone B; fresh server-confirmed approaching vehicles are capped at three; ETA is shown only with valid server evidence; unrelated live positions are muted; stale positions are omitted. ETA styling uses canonical blue token.
- Exact targeted tests on code commit `8c5d4953b31832e255a2a87cd6179168fb9621c7`: 18 passed, 0 failed/skipped. Focused ESLint and `tsc --noEmit` passed on the implementation before the later documentation-only commit `1c2811e`. `git diff --check` passed.
- Camera transitions, route reveal, bottom-sheet layout/gestures, full browser screenshots, touch-device/iPhone, live-feed replay, performance, and full build remain NOT_TESTED/PARTIAL. `USER_ONBOARD` is BLOCKED without explicit user/API confirmation. Release remains `NOT_RELEASED`.
- Resources after focused tests: `/` 23 GiB available; memory-pressure 33% free; encrypted swap 8,983 MiB used. Existing Qoder Vite on `:7777`, Docker components and Playwright MCP process are present; no heavy build/browser task was started. The `:7777` worktree was not touched.
- Next: wait for exact-head PR checks; pursue isolated visual acceptance only when resource contention allows. Do not merge before the required visual/device and live evidence gates.

## RESUME BLOCK — 2026-11-10 10:42 EET — Site focused route geometry and live arrivals

1. Work is being done solo in `/Users/dima1203/.codex/worktrees/marshgo-intelligent-navigation-premium-20261110`, branch `codex/intelligent-navigation-premium-20261110`, based on current Site `origin/main` SHA `895f51e0e1f728c5b3ba0458b2d98e74ad5fb62f`. The canonical Site checkout and all unrelated dirty work remain untouched.
2. Implemented passenger-only B geometry in the focused live overlay; removed A/C continuation annotations; added strict fresh/server-confirmed approach selection capped at three; read the current API's `approachEvidence.predictedArrivalAt` for a future ETA when `etaConfidence` is absent; preserved priority levels through the MapLibre adapter; muted background vehicles and moved ETA badge to the blue design token.
3. Verification on the current candidate: 18 focused tests passed, 0 failed, 0 skipped; ESLint on changed TS/TSX paths passed; `tsc --noEmit` passed; `git diff --check` passed. No full build, browser, screenshot, device, or live-feed replay was performed.
4. `USER_ONBOARD` remains BLOCKED: no explicit user boarding confirmation is available in the Site/API contract, and GPS proximity must not be used to infer it. Fade-after-pass, 3D stage focus, compact-sheet visual measurements, and device motion remain PARTIAL/NOT_TESTED.
5. Last resource sample: disk 23 GiB free, memory-pressure 38% free, swap 9.14 GiB used; existing Qoder Vite on `:7777` and a Virtualization process are active. Do not stop or restart them. No Server edits, commit, push, PR, merge, or deployment yet. Acceptance reports are in the candidate worktree under `docs/MARSHGO_INTELLIGENT_NAVIGATION_4_ACCEPTANCE.md` and `docs/PREMIUM_MAP_HUD_DESIGN_ACCEPTANCE.md`.
6. Next: final diff/status review, then decide whether a task-only draft PR is appropriate with the visual/device criteria honestly marked incomplete. Keep release `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 10:13 EET — Site premium map/HUD polish (partial)

1. Candidate worktree: `/Users/dima1203/.codex/worktrees/marshgo-premium-design-polish-20261110`, branch `codex/premium-design-polish-20261110`, base `eda449f008025b2126c92fd24cd68deb513ca3ad`. The canonical Site tree remains dirty and untouched; `:7777` was not restarted or modified.
2. Removed fabricated vehicle movement, ETA, coordinates and “щойно” GPS claim from the route sheet. A compact boarding card now requires a fresh API `LIVE` vehicle explicitly approaching boarding, valid ETA confidence, coordinates and timestamp. ETA styling uses `--mg-action`; hidden diagnostic padding and dead simulated-banner CSS/state were removed.
3. Focused ESLint passed and 5 targeted tests passed (0 failed, 0 skipped); `git diff --check` passed. Full Site verify/typecheck/build and browser/device screenshots are still NOT_TESTED.
4. Resources after the focused gate: disk 24 GiB free, memory 34% free, swap 9.38 GiB in use; Virtualization and Qoder processes remain active. Defer full verify and browser work until resource headroom is clearer. Do not touch `:7777` or production.
5. Acceptance report: `MarshGO-Site/docs/PREMIUM_MAP_HUD_DESIGN_ACCEPTANCE.md`. Status stays PARTIAL / NOT_RELEASED. Next: inspect current diff, then run full checks and visual route-map acceptance on this isolated candidate only when safe; capture real before/after evidence before PR/merge.

## RESUME BLOCK — 2026-11-10 04:36 EET — release validator follow-up

1. Root PR [#24](https://github.com/dima1203oleg/MarshGO/pull/24), head `82d50301768ae735c8e07fd04d245ba36c40d3b3`, is a one-commit follow-up stacked on PR #20's branch at `041ab47d083830f1b4271ccf4c3b5d6cde080339`. It addresses historical pin-record behavior and strengthens the staging false-green regression test. Security `42743541927` passed; CI `42743541865` failed during private Admin/Partner materialization after earlier code gates passed. Do not merge before materialization and required checks pass.
2. Local exact-head checks on the PR branch: `node --check ops/scripts/validate-release-manifest.mjs`; `node --test ops/scripts/validate-release-manifest.test.mjs` — 81 passed, 0 failed, 0 skipped; `git diff --check` — PASS.
3. Root PR #20 remains stacked on #18/#12 and blocked on private Admin/Partner materialization (HTTP 403). The root release manifest stays `NOT_RELEASED`; do not use the exposed chat token.
4. Resources 04:36 EET: disk 29 GiB free, memory 39% free, swap 4,744 MiB used; Virtualization ~6% CPU. Avoid another heavy local suite. Next: obtain a new least-privilege private-repository credential through the owner’s secure GitHub settings, rerun materialization and the skipped gates, then proceed to unified staging acceptance.

## RESUME BLOCK — 2026-11-10 04:25 EET — post-merge readiness

1. Site PR #125 and Server PR #133 are merged; exact post-merge main CI passed (`42741370578`, `42741569772`). Their full SHAs and coverage are recorded below in `CODEX_PROGRESS.md` and `docs/PRODUCTION_EXECUTION_STATE.md`.
2. Latest read-only local smoke: Site `:7777/` HTTP 200; Server `:3002/healthz` and `/readyz` HTTP 200. The Server is a development runtime without verified build/commit provenance; this is not a pinned release pair.
3. Do not run another heavy local suite while Virtualization/Docker is using CPU and the 8 GB host has 38% free RAM / 29 GiB free disk / 4.6 GiB swap in use. Exact-main CI already covers the merged Site and Server changes. CUA visual inspection still fails to attach (`browser.user is unavailable`).
4. Next release gates: restore authorized root CI access to private Admin/Partner, use a pinned real staging target, prove route search and geometry by category on the exact six-SHA pair, then backup/restore and rollback rehearsal. All-12 live coverage is not proven; production remains `NOT_RELEASED`.

## Next actions — 2026-11-10 01:37 EET

1. Continue the source-only review of active Site screens; preserve the canonical hierarchy and do not edit the root legacy UI or inactive prototype views.
2. Re-read the exact Site diff and check markup/token consistency. Run no tests or builds until the user requests verification and the local memory/resource gate is safe; visual review is still NOT_TESTED.
3. When resources allow, use the existing 7777 server only for browser review; do not start a second server or change the canonical port.
4. Keep edits on `codex/full-ui-audit-20261110` at base `7ebc2c70d3428758f3e047cc4c8e479454effb77`; create no commit/PR until the full scoped review is ready and required evidence is available. Production remains `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 — Site map controls merged

- Site PR [#124](https://github.com/dima1203oleg/MarshGO-Site/pull/124) merged via squash. Remote Site `main` is `7ebc2c70d3428758f3e047cc4c8e479454effb77` (PR head `832e3489e48c556bbda0bf4013e0eec31605f442`, base `cebf72efbe1d0c6140174f57d8cd8ac0e283f472`).
- Shared map control rail now covers the four primary full-screen map views; duplicate page-specific map mode state/handlers removed. Three `MapPreview` props proven unused at both call sites were deleted.
- Exact PR CI `42718978038`: lint, typecheck, 629/629 tests, token check, build, bundle/single-React checks, Playwright install, boot smoke passed. Focused local checks 25/25 passed; manual visual/physical touch acceptance remains NOT_TESTED. CI npm audit also reported 10 moderate advisories; dependencies were not modified.
- Post-merge CI run `42719466929` completed SUCCESS on exact merge SHA `7ebc2c70d3428758f3e047cc4c8e479454effb77`. Keep port 7777 and its existing Node PID untouched.
- Next: once memory is at/above the local resource gate, visually verify map zoom/pan/pinch and voice/basemap controls on the existing canonical UI. Then continue only evidence-backed refactoring in Site: prove unused exports/props have no import, route, or runtime dependencies before small deletions. Keep the six repo boundaries and assemble one product through exact-SHA integration; do not flatten repos or delete generated/user data.
- Resources last measured: disk 27 GiB free, RAM 30% free, swap 7,341.81 MiB used; active Qoder, Docker/VM and browser/app processes. Avoid local full build/E2E until memory is at/above the required gate. Production remains `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 — Site shared map controls PR #124

- Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `codex/map-controls-canonical-20261110`, head `4668aafeb169de2ebfb4e728a8c25090a75a720a`, base `cebf72efbe1d0c6140174f57d8cd8ac0e283f472`; PR [#124](https://github.com/dima1203oleg/MarshGO-Site/pull/124) is draft/open.
- Shared map controls refactor includes one vertical control rail, shared zoom/voice/2D-3D/basemap/layer controls, and touch pan/pinch settings. Duplicate page-specific map mode state/handlers were removed.
- First CI run failed one outdated source assertion; lint/typecheck passed. Assertion now targets shared controls. Focused tests: 25 passed, 0 failed/skipped; `git diff --check` passed. Exact-head CI run `42718632384` is in progress.
- Next: inspect CI completion and exact failure logs if needed. If every required check passes, review the diff and branch protection, then merge normally. Keep the PR draft until evidence is complete. No local heavy checks while memory free is 30%; disk 27 GiB; swap ~7.4 GiB; Docker/Qoder/browser active. Do not restart port 7777 or alter canonical repo boundaries.
- Do not claim broad dead-code cleanup: remove additional code only after proving it has no active route/import/feature dependency and running relevant checks. Release remains `NOT_RELEASED`.

## RESUME BLOCK — 2026-11-10 — Current: canonical map controls refactor

- Active Site worktree: `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `codex/map-controls-canonical-20261110`, base SHA `cebf72efbe1d0c6140174f57d8cd8ac0e283f472`. Previous local map-control changes are preserved on this branch; do not reset or replay them.
- One shared map-control rail now owns zoom, voice preference, 2D/3D, basemap and layers across the four primary full-screen map views. Targeted tests passed 13/13; full typecheck/lint/build and visual device acceptance are still pending.
- Port `127.0.0.1:7777` was not restarted. At the last checkpoint memory was 31% free with Docker VM activity; wait for the heavy-process/resource gate before another heavy check.
- Next: run Site typecheck, changed-file lint, then one browser validation on 7777 when resources permit. Keep changes isolated until those pass; do not deploy. Production remains `NOT_RELEASED`.

## Prior resume state — 2026-11-10 — Qoder handoff integrated; Server CI passed

- Qoder Site PR [#122](https://github.com/dima1203oleg/MarshGO-Site/pull/122) merged to Site `main` at `3b481e44f392713704fe418bc17d84725e6acc79`; exact-head and post-merge checks passed. Browser checks covered 430×932 and 440×956 CSS emulation, not physical iPhone/Safari.
- Qoder Server PR #119 was superseded by Server PR #120 (`d8c25a560187a89aaa42422d602802854c19c694`) and closed without deleting its branch.
- Server PR [#131](https://github.com/dima1203oleg/MarshGO-Server/pull/131) merged normally: head `e4d8a101779f9ae76579eaca5608069fb5633376` → Server `main` `f61993013e5abf6fbf6afca96bc6eda3d0ff1c27`. `git ls-remote` confirmed the exact remote SHA. Exact-head checks `42708070674`, `42708121521` passed; post-merge CI run [42708728118](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/42708728118) passed on the merge SHA. It covered audit, lint, typecheck, full unit/integration tests, DB migrations, production API image build, PostGIS/Redis image smoke and local Compose lifecycle.
- Candidate-specific local evidence: seven fixture files 136/136 pass; final Node 24 typecheck, changed-file ESLint and whitespace check pass. These are supplemental to the post-merge CI.
- Still unverified: live Lviv provider replay and live coverage for all categories, complete rental-to-transit geometry, staging, physical iPhone, and production. Root `MarshGO` has extensive pre-existing mixed dirty changes; preserve them and do not stage/commit the root tree. No production deployment or shared runtime/database mutation occurred.
- Qoder release-manifest validator PR [#20](https://github.com/dima1203oleg/MarshGO/pull/20) is still blocked in a stacked root PR chain (#12 → #18 → #20): Actions has `MARSHGO_REPOS_READ_TOKEN`, but materialization fails cloning private MarshGO-Admin with HTTP 403. Do not bypass the required check. The token previously pasted in chat should be rotated; replace the Actions secret with a fresh least-privilege read-only token for Admin and Partner, then rerun exact-head CI and review the stack before merging.
- Release stays `NOT_RELEASED`. Next: resolve the private-repository credential blocker for the stacked validator PR, then continue live-provider and staging acceptance from exact pinned component SHAs; do not infer live functionality from fixtures or CI.

## Next actions — 2026-11-09 21:32 EET

1. Let Qoder complete its source inventory and return its report; it has found the checked EasyWay and Dozor endpoints return 404, Nextbike has no current Lviv live city, and Zelectra's live vehicles are Kyiv-only.
2. Reconcile the stale Nextbike Lviv registry entry with verified live coverage, but do not remove/reclassify data until the complete catalog diff and contract tests are reviewed.
3. Continue the isolated exact-main trolleybus re-import and tram feasibility/truncation diagnosis after the source-inventory handoff. Do not change the live DB or claim Lviv marshrutka/scooter support without separate verified provider evidence.
4. Heavy local checks remain deferred while memory is at 29% free and Qoder/Virtualization are active. Production stays `NOT_RELEASED`.

## Next actions — 2026-11-09 21:34 EET

1. Let Qoder finish its feed inventory and return exact source/licensing/city coverage findings. Its EasyWay/Dozor URLs were 404; Nextbike had no Lviv live entry; Zelectra vehicles were Kyiv-only; Eway is currently only a consumer-map lead.
2. Reconcile the current Lviv Nextbike registry entry against current authorized live coverage before exposing it as live; preserve estimates only if clearly labeled.
3. Continue Server PR #129 trolleybus re-import and tram feasibility/truncation checks only in an isolated exact-main candidate and disposable DB. Do not touch the unknown live DB or restart active services.
4. Keep marshrutka and scooter unavailable for Lviv unless Qoder finds a verifiable, permitted source and proves import-to-planner coverage. Production remains `NOT_RELEASED`.

## Next actions — 2026-11-09 21:42 EET

1. Keep Qoder PR #122 open until visual checks at 393×852 and 430×932, light/dark, are completed once free memory is stably ≥35%; then review exact diff and required checks before merge. Qoder reports 47/47 tests and typecheck; visual is not tested.
2. Use the clean Server candidate `codex/lviv-feed-chain-20261109` at `449bc79a6ebfbc1eae2591ac5dd1353de8b98952` for exact-SHA feed/planner diagnosis. Do not restart or modify the dirty active `:3002` service or its unknown DB.
3. Verify that the isolated Lviv GTFS import's 9 trolleybus routes are exposed by the provider API and returned as trolleybus legs; the active runtime is stale and currently labels `Тр24` as bus.
4. Capture the same Sykhiv→Varshavska planner response, mode preferences and truncation flags to determine why no tram itinerary appears despite 8 imported tram routes.
5. Keep marshrutka and scooter unavailable for Lviv until a permitted, real source appears; Zelectra is Kyiv-only. Do not force a category into infeasible chains.
6. Update the exact release manifest only after cross-component acceptance. No deployment; `NOT_RELEASED`.

## Next actions — 2026-11-09 21:49 EET

1. Let Qoder finish its read-only Lviv chain-mode participation subtask. Reconcile its exact SHA, selected modes, planner response, and truncation evidence before editing overlapping Server search/routing code.
2. Investigate why the shared zrok provider endpoint omits trolleybus despite Server main's explicit label mapping and the isolated feed report of 9 trolleybus routes. Establish active API SHA and disposable DB/import identity first; do not restart or mutate the current runtime.
3. Keep tram as feed-present but itinerary-not-yet-proven; capture a same-query exact planner response only on an identified safe environment. Keep Lviv marshrutka and scooter unavailable until a permitted source and local inventory are verified.
4. Browser-check Qoder PR #122 only after free RAM is stably at least 35%; it is currently 29%. Do not merge #122 before visual acceptance; keep production `NOT_RELEASED`.

## Next actions — 2026-11-09 22:14 EET

1. Keep Qoder and Codex in the established split: Qoder owns Site/map focus and mobile rendering; Codex owns Server mode composition. Wait for Qoder's final exact SHA/diff before visually reviewing PR #122.
2. Defer heavy local work until memory is stably ≥35%. Then run one focused Server test process: npx tsx --test tests/gtfs-search-worker.test.ts tests/micromobility-estimates.test.ts tests/search-completeness-indicators.test.ts; after that, run typecheck separately. Record failed/skipped tests accurately.
3. Review the nine-file Server candidate on codex/lviv-feed-chain-20261109 against base 449bc79a6ebfbc1eae2591ac5dd1353de8b98952; verify query bounding, fresh scooter inventory, transfer limits, and the three objective strategies before commit/PR.
4. Do not restart the live :7777/zrok API, import into its unknown database, or claim a trolleybus/tram live route until exact runtime identity and a safe DB are available.
5. Keep Lviv marshrutka unavailable until a permitted source explicitly distinguishes it from ordinary bus service; keep scooter unavailable without fresh Lviv vehicle inventory. Production remains NOT_RELEASED.

## Next actions — 2026-11-09 22:19 EET

1. Qoder PR #122 now points to exact head 21ec8af43a18c79c54d80b1f0565733aebb4ca2b; exact-head checks pass. Wait for Qoder's visual acceptance result; do not merge before reviewing its final evidence.
2. Keep Server candidate uncommitted until memory is stably ≥35%. Run its three focused unit files first, then typecheck in a separate process; no integration DB/runtime work until a disposable target is identified.
3. Review the Server candidate against Qoder's mode matrix, especially transfer-stop bounds, current scooter inventory, and route-completeness status. Keep feed registration distinct from an actual feasible itinerary.
4. Preserve the live zrok/API and unknown DB. No deployment or production claims; NOT_RELEASED.


## Next actions — 2026-11-10 00:36 EET

1. Poll Site PR #123 exact-head CI run `42713259463` for head `c7fb5563ede66be94efd381657fcd85d4821cb1c`; investigate any failure on the same isolated branch.
2. Complete typecheck/build and visual acceptance on the existing `127.0.0.1:7777` candidate once resources/browser access allow. Verify a long diagonal selected segment at peek and expanded sheet positions, plus divider/CTA layout; do not change port or start a second server.
3. Keep PR #123 draft until visual evidence and required checks are complete; merge only after exact-head checks/review pass.
4. Preserve the old Qoder branch/worktree and the extra isolated test worktree. No production deployment; `NOT_RELEASED`.


## Next actions — 2026-11-10 00:40 EET

1. Poll Site PR #123 run `42713765574` on exact head `a9d7d9a4f6eb04827567323c94ff387386e6f9e6`; address any failures without weakening assertions.
2. Use the existing port `127.0.0.1:7777` for visual review once browser control is available; verify a selected diagonal segment at peek and expanded states, summary divider, and retained touch target. Do not switch to another runtime or port.
3. Keep PR #123 draft until visual acceptance and all required exact-head checks pass; only then integrate into main.
4. Preserve the existing Qoder branch/worktree and the isolated test worktree. Production remains `NOT_RELEASED`.


## Next actions — 2026-11-10 00:42 EET

1. Complete visual acceptance for a selected long/diagonal segment and the 168–176 px peek sheet on the existing `127.0.0.1:7777` UI. Keep the port and current runtime.
2. If visual behavior is correct, mark PR #123 ready and integrate after required review; if not, fix the exact issue on the same branch and rely on exact-head CI.
3. After any merge, verify the resulting Site main SHA and keep the release status `NOT_RELEASED` until remaining release gates are met.


## Next actions — 2026-11-10 00:46 EET

1. Site #123 is complete and merged at `cebf72efbe1d0c6140174f57d8cd8ac0e283f472`; do not replay or reapply it. Port 7777 is now on the same `main` SHA.
2. When visual tooling can attach to the existing browser, inspect a focused route at peek and expanded detents; this is the only remaining evidence gap for this UI change.
3. Keep production `NOT_RELEASED`; no deployment was performed.


## Next actions — 2026-11-10 — canonical map controls

1. Keep the existing Site `main` worktree and port `127.0.0.1:7777`; review the local uncommitted shared map-control changes before staging or committing.
2. When memory free is at least 35% and no other heavy local process is active, run Site typecheck/lint and then a browser check on port 7777. Verify vertical +/− alignment, persisted sound preference, one-finger map drag, and two-finger pinch on a touch device if available.
3. Do not claim physical touch-device verification from the static test. Do not restart 7777, deploy, or change production. Keep release `NOT_RELEASED`.


## Next actions — 2026-11-10 — shared map controls

1. Keep working in `codex/map-controls-canonical-20261110`; no changes have been committed or merged.
2. When resources permit, run `npm run typecheck`, changed-file ESLint, then verify the four full-screen map views at 390px and a desktop viewport on the existing port 7777.
3. Verify controls remain vertically aligned, satellite stays disabled when unavailable, voice preference persists, and one-finger drag/pinch zoom work on a touch device. Only then prepare a focused PR; production remains `NOT_RELEASED`.


## Next actions — 2026-11-10 — active interface review

1. Preserve the six unstaged Site edits on `codex/full-ui-audit-20261110`; continue a focused source review of active customer screens only. Do not touch legacy `HomeView` or the separate Qoder/map-controls worktree.
2. When memory recovers above the project resource gate and the owner-facing browser is available, review the existing `127.0.0.1:7777` build at mobile and desktop widths. Do not restart or change the canonical port.
3. Only claim visual acceptance after inspecting the actual pages. No tests/builds have been run for this checkpoint; production stays `NOT_RELEASED`.


## Next actions — 2026-11-10 01:52 EET — interface review

1. Continue the static review of active Site screens in the isolated worktree; keep Qoder and Chrome closed as requested and do not disturb Docker or the existing `127.0.0.1:7777` process.
2. The existing in-app browser is still open, but its CUA bridge currently returns `browser.user is unavailable`. Resume visual review only if that existing session becomes controllable; do not start another browser or change ports.
3. Keep all six Site files unstaged and uncommitted until the review is complete. No tests/build/merge/deploy evidence is claimed; production remains `NOT_RELEASED`.


## Next actions — 2026-11-10 02:10 EET — carpool verification

1. After Docker/Virtualization load subsides and memory is back above the project gate, run Site typecheck, targeted ESLint, then the full Site test suite on the exact isolated worktree. Do not launch concurrent builds or browser runs.
2. Run the two-account driver/passenger acceptance only against a disposable isolated database pinned to Server `f61993013e5abf6fbf6afca96bc6eda3d0ff1c27`: publish with a photo-backed vehicle, find and book, last-seat concurrency/idempotency, cancellation/seat restoration, MarshPass ownership and QR boarding, mutual GPS consent, trip start/completion. Do not use the shared live database.
3. Inspect the actual carpool screens at desktop and 430×932 / 440×956 CSS viewports when the existing browser session can be controlled; current CUA attach fails, so do not claim visual acceptance or physical-iPhone behavior.
4. Review the final exact diff, then prepare a focused Site PR with CI evidence; keep the main checkout and `:7777` runtime untouched. Production remains `NOT_RELEASED`.


## Next actions — 2026-11-10 02:23 EET — navigation acceptance

1. Preserve the current unstaged Site worktree on `codex/full-ui-audit-20261110`; navigation, map, carpool-refresh, and accessibility edits now pass 244 targeted tests, typecheck, changed-file lint, and diff check.
2. When the existing browser session can be controlled, visually exercise the route map and active-navigation screen on `127.0.0.1:7777`: explicit start vs direct open, destination selection, GPS permission/denial, route focus, pan/pinch/zoom, voice toggle, pause/resume, off-route recovery, background/restore, and finish. Do not restart the port; current API version has no source SHA.
3. Physical iPhone GPS/touch acceptance and authenticated two-user rideshare acceptance remain separate NOT_TESTED gates. Do not mutate shared data; use a disposable environment pinned to the exact Server SHA.
4. Review all current diffs before preparing any PR. No commit, merge, or deployment has been made; production remains `NOT_RELEASED`.


## Next actions — 2026-11-10 02:30 EET — Lviv transport acceptance

1. Keep metro excluded. Current provider-registry evidence does not establish all-mode route coverage: only bus/tram source metadata appears in the active Lviv registry; three groups (marshrutka, trolleybus, scooter) are empty, bike is static-only, and taxi/carsharing/transfer metadata is not quote/booking proof.
2. To verify feasible Lviv itineraries, run authenticated searches for each selectable category against a pinned disposable Server/API and fresh provider snapshots. Current API `/api/v1/version` has no commit identity, and protected search returned 401 without a session; do not use the shared database or bypass auth.
3. Resolve feeds/credentials by evidence: separate authorized marshrutka source; refresh and classify Lviv trolleybus GTFS in an isolated DB; obtain a permitted Lviv micromobility inventory/zone source; verify operator APIs and Lviv coverage for taxi/carsharing/transfer; verify dated UZ legs and actual MARSHGO offers. Keep unsupported modes unavailable in UI.
4. The 171 Server tests are fixture/unit evidence only. Preserve the dirty Server candidate and Site worktree; no restart, commit, merge, or deployment was performed. Production remains `NOT_RELEASED`.


## Next actions — 2026-11-10 — map settings switches

1. Preserve the unstaged map-settings fix in `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` on `codex/full-ui-audit-20261110`; exact base SHA `7ebc2c70d3428758f3e047cc4c8e479454effb77`.
2. When resources recover and the existing browser bridge is available, verify in the current `:7777` session: turn each available transport layer on/off; test route lines, route numbers, stops and live vehicle display; confirm saved preferences after closing/reopening the map. Do not restart the port.
3. Run Site typecheck when memory permits. Current map-only verification is 16 targeted tests + ESLint + diff check; browser, build and full typecheck remain NOT_TESTED.
4. Keep unsupported infrastructure as noninteractive status until a real source/API exists; carpool, taxi and transfer remain journey modes, not standalone map overlays. Do not mark all 12 transport modes live from map toggles or fixture evidence. No merge or production release; `NOT_RELEASED` remains.


## Next actions — 2026-11-10 — single basemap switch

1. Keep the duplicate basemap removal unstaged in the existing isolated Site worktree on `codex/full-ui-audit-20261110`; the shared globe is now the only basemap switch in active navigation.
2. When the existing browser session is controllable and resources permit, visually verify the active navigation rail and map sheet. Do not restart `:7777` for this check.
3. Focused tests (14), ESLint and diff check pass; full typecheck/build/browser remain NOT_TESTED. No commit, merge or release claim.


## Next actions — 2026-11-10 — app-wide visual consistency

1. Keep the design polish on Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `codex/full-ui-audit-20261110`, exact HEAD `7ebc2c70d3428758f3e047cc4c8e479454effb77`; do not reset or fold in unrelated dirty files.
2. When memory is above the project gate and the current browser can be controlled, visually compare Home, Search, Trips, Profile, and the global header/tab bar in light and dark themes at mobile and desktop sizes. Do not restart canonical `:7777`.
3. Current design evidence is fixture/source-based: 37 design/token/contrast tests, focused ESLint and diff check pass. Browser, build, typecheck and full Site tests remain NOT_TESTED for this change.
4. Review the complete accumulated Site diff before any PR. No commit, merge, deployment, or production-readiness claim has been made.


## Next actions — 2026-11-10 03:07 EET — Lviv bus / marshrutka separation

1. Preserve the uncommitted candidate in `/private/tmp/marshgo-lviv-feed-separation-20261110` on `qoder/lviv-feed-separation-20261110`; base `f61993013e5abf6fbf6afca96bc6eda3d0ff1c27`. Review changes against the latest Server main before any PR; do not merge into the dirty Server checkout.
2. To establish current Lviv marshrutka coverage, fetch/import the allowed Lviv GTFS in an isolated environment and produce a route-level report for `route_type`, names, classifier evidence, and schedule usability. This checkpoint did not perform a live feed import.
3. Keep a single shared feed unless an independently verified and permitted marshrutka source URL is found. Do not duplicate the GTFS URL as a fake provider.
4. Targeted fixtures and TypeScript check pass (121/121, `tsc --noEmit`); changed-file ESLint remains unverified because `eslint-plugin-unused-imports` is absent in the available dependency tree. No commit/PR/merge, runtime restart, or production deployment.


## Next actions — 2026-11-10 03:11 EET — route metadata gap

1. Keep the 55 generic route_type=3 routes separate from the marshrutka filter until an authoritative operator route-class crosswalk or explicit GTFS extended route/name markers are supplied. Current live snapshot has no 1501 or explicit marshrutka rows; it does not prove the service does not exist.
2. If city or operator metadata becomes available, add a versioned route-ID mapping with source, effective date, and review provenance, then test both bus-only and marshrutka-only searches on that exact snapshot.
3. Preserve candidate branch `/private/tmp/marshgo-lviv-feed-separation-20261110`; 121 targeted tests and TypeScript check pass. ESLint remains blocked by missing `eslint-plugin-unused-imports`. No PR, merge, service restart, or production deployment.


## Next actions — 2026-11-10 03:14 EET — PR #132

1. Watch required checks on exact head `0e5e66d18240f237f0c14ca059242687e0c4d77f` in https://github.com/dima1203oleg/MarshGO-Server/pull/132; both `verify` jobs were still running at the latest read. Do not merge until all required checks pass and branch protection permits it.
2. If CI reports a failure, inspect its exact job/log and repair only this PR branch; preserve the unrelated dirty Server checkout and root state.
3. After checks/review, verify the live Lviv route classification still has an evidence-backed vehicle-class crosswalk before claiming any marshrutka route is live; the current public GTFS snapshot has no 1501 or explicit minibus row.


## Next actions — 2026-11-10 03:18 EET — post-merge verification

1. Server `origin/main` includes PR #132 at exact SHA `b838d882c20dd2f75ab0a47126eaa14c889ae9c3`; fetched main tree matches tested PR head tree. Do not copy into the separate dirty Server checkout.
2. A true Lviv bus-vs-marshrutka route inventory still requires an operator-approved crosswalk or source field: current 72-route GTFS snapshot has 55 generic type-3 rows, 9 trolleybuses, 8 trams, and no explicit minibus marker. Do not classify all generic type-3 records as marshrutkas.
3. Next validation needing user/provider data: obtain authoritative Lviv route-to-service-class metadata, then test actual bus-only and marshrutka-only searches and a dated route. Production and live marshrutka itinerary remain unverified.

## Next actions — 2026-11-10 03:28 EET — carpool driver/passenger acceptance

1. Preserve Site candidate `codex/full-ui-audit-20261110` at `7ebc2c70d3428758f3e047cc4c8e479454effb77` and all unstaged changes. Focused UI logic/design tests (104/104), typecheck, changed-file ESLint and diff check pass; browser visual acceptance is still NOT_TESTED because the existing browser bridge cannot attach.
2. Do not run `npm test` on the dirty Server candidate `e9934abbd8fc973177de8d7f47548739758a1b74`: its two-account and QR integration tests currently run unconditionally against default local API/database and can write test data. Restore explicit opt-in plus disposable DB/API requirements before any full test run; keep the shared `marshgo` DB untouched.
3. Run driver/passenger UI → API → DB acceptance on an isolated database pinned to Server main `b838d882c20dd2f75ab0a47126eaa14c889ae9c3`: publish photo-backed offer, search/book from a second account, proposal/counter-proposal conversion, last-seat concurrency/idempotency, cancellation and seat restore, ticket/QR boarding, mutual GPS consent/revocation, start and completion. Do not create real bookings or payments.
4. Review the documented same-booking QR replay semantics and decide whether signed MarshPass nonces must be single-use; any change needs an additive migration and isolated replay/concurrency integration evidence.
5. Resume visual acceptance only when the existing `:7777` browser tab is controllable: inspect driver offer/vehicle and passenger demand/trips/ticket screens at desktop and 430×932 / 440×956 viewports. Do not restart the canonical port. Production remains `NOT_RELEASED`.


## Next actions — 2026-11-10 03:45 EET — route-chain fairness candidate (initial checkpoint; see 03:52 update)

1. Keep the isolated Server worktree `/private/tmp/marshgo-route-objective-chain-20261110` on `qoder/route-objective-chain-correctness-20261110`, based on `b838d882c20dd2f75ab0a47126eaa14c889ae9c3`; do not copy into the dirty Server checkout.
2. The targeted test and typecheck were subsequently run and passed; ESLint was attempted but blocked by the missing repo-required plugin. See the later 03:52 actions for the current remaining steps.
3. Keep fixture evidence separate from live feed evidence; do not claim all-12 live support from fixture evidence.
4. The change only prevents represented GTFS transit categories and a bounded set of their mixed-mode chains from being starved in the pre-ranking candidate cap. It does not add providers or make taxi, carsharing, transfers, carpool, bike or scooter combinations available where provider data/routing support is absent. Production remains `NOT_RELEASED`.

## Next actions — 2026-11-10 03:52 EET — route-chain candidate

1. Keep the isolated branch at qoder/route-objective-chain-correctness-20261110 and base SHA b838d882c20dd2f75ab0a47126eaa14c889ae9c3; do not copy into the dirty Server checkout.
2. Before commit/PR, obtain a clean isolated lint environment containing the repo-required eslint-plugin-unused-imports; rerun changed-file ESLint. Do not install or mutate dependencies in the existing shared trees.
3. If lint/required CI pass, review and commit only server/journey/gtfsTimetable.ts and tests/gtfs-route-chain-sampler-adversarial.test.ts; then use a normal PR and branch protection. Main remains unchanged until verified.
4. Separate follow-up: verify real feeds and actual feasible mixed chains by corridor; this sampler does not create provider inventory or assert all 12 categories are live. Production remains NOT_RELEASED.



## Next actions — 2026-11-10 03:57 EET — Site acceptance after font correction

1. Site full suite on `codex/full-ui-audit-20261110` / HEAD `7ebc2c70d3428758f3e047cc4c8e479454effb77` initially reported **636/638 passed**; both failures were the same 10 px badge in `MapLayersControl.tsx`. The class is now `text-xs`; `tests/motion-tokens.test.ts` passes **11/11**, and `git diff --check` passes.
2. Rerun `npm test` only after free memory is at least 35% and no competing heavy task is active. At the last check it was 34%, so the full rerun is deferred; do not count the pre-fix suite as green.
3. After the full suite passes, continue serially with Site typecheck, lint, token checks, production build, bundle/single-React checks, and boot smoke, checking resource gates before each heavy step. Any existing dependency/plugin gap must be recorded as blocked rather than skipped.
4. Keep all Qoder/Site dirty work preserved and uncommitted until the exact candidate passes. No production deployment: the manifest is still `NOT_RELEASED`, and the recorded six-main tuple is only an unvalidated baseline. Staging, exact six-SHA acceptance, restore/rollback, current live transport feeds, and physical iPhone remain release gates.


## Next actions — 2026-11-10 04:00 EET — release candidate blockers

1. Current `origin/main` refs are recorded in `CODEX_PROGRESS.md`; they are not a compatible six-repository release candidate. Preserve the dirty Site candidate at `7ebc2c70d3428758f3e047cc4c8e479454effb77`.
2. Root PR #20 depends on open PR #18 and failed its observed CI materialization of private Admin with HTTP 403. Required private Admin/Partner read access must be repaired by the repository owner; do not use or disclose the token previously pasted in chat.
3. Local API `:3002` is development with no build/commit identity. It is not staging. No deployment or production-ready claim until exact-SHA integration, staging, restore and rollback evidence exist.
4. Site suite correction: rerun the full suite only at ≥35% free memory; after that, complete Site gates one at a time. Latest measured free memory was 34%, so full rerun remains deferred.


## Next actions — 2026-11-10 04:05 EET — pending gates

1. Monitor Server PR #133 exact-head run `42740336191`; merge only if every required check passes and the base is still current. If a required check fails, fix that PR and rerun it. Its fixture does not establish live all-12 support.
2. Full Site rerun after the text-size fix is still pending. Resume only when memory is at least 35% **and** Virtualization/Docker is no longer actively consuming resources; then run `npm test` and the remaining Site checks one process at a time.
3. Preserve root legacy `src/views/ProductionMarketplace.tsx:1472`; a root-wide diff check reports trailing whitespace there. Do not make unrelated legacy UI changes.
4. Current runtime and root release blockers remain: local API has no exact commit/build provenance; root validator PR #20 is open and CI cannot materialize private Admin (HTTP 403); no exact six-SHA acceptance, staging, restore/rollback rehearsal, or production deployment exists.


## Next actions — 2026-11-10 04:16 EET — post-merge and release acceptance

1. Verify post-merge main checks for Server `62c8731f50788be2f805972e2890b845423a86b5` and Site `b32de02191572c767435d64bf284728a06b6ce25`. PR-head CI is green; post-merge runs were still in progress at the last check.
2. PR #125 and #133 are merged; keep their feature branches. Do not restart local services or point the dirty Server checkout at the new SHA without confirming its DB target.
3. Root PR #20 remains stacked on #18 and the observed exact-head materialization failed private Admin with HTTP 403. Owner must repair the read-only Admin/Partner CI access; do not reuse the exposed token.
4. Do a visual check on canonical :7777 once the browser bridge is available; CUA is currently unavailable. The current browser-rendered code tree matches merged Site main, but this is not manual visual acceptance.
5. Exact six-main refs now exist in the progress log, but unified API/client/migration acceptance, current live provider verification, staging, backup/restore, rollback, physical iPhone, and approved production deployment are still required. Production remains NOT_RELEASED.


## Next actions — 2026-11-10 04:18 EET — verify after merge

1. Wait for Server post-merge run 42741569772 and Site post-merge run 42741370578 to finish on their exact main SHAs; inspect all steps, not just the run headline.
2. The approved HTTPS host responds, but its API declares development and has no build/commit SHA. Do not call it staging; obtain an independently pinned staging deployment before staging acceptance.
3. Do not run an extra local full suite while Docker/Virtualization are active. The merged PR exact-head CI already passed; post-merge jobs are exercising integration and boot smoke.
4. After CI, continue only with exact six-component acceptance and externally supported operational gates; production remains NOT_RELEASED.


## Next actions — 2026-11-10 04:20 EET — production blockers after CI

1. Site and Server changes are merged and both post-merge exact-main CI runs passed: Site `42741370578`, Server `42741569772`. Preserve feature branches for traceability.
2. Obtain owner-side read-only Actions access to private Admin/Partner for root PR #20; exact-head release materialization currently fails HTTP 403. Do not use the token previously pasted in chat.
3. Stand up or identify a real staging target pinned to exact SHAs. Current HTTPS tunnel points to development API with null build/commit metadata.
4. Complete unified six-SHA acceptance, visual check on :7777, authorized live-feed checks by category, backup/restore and rollback rehearsals. Physical iPhone is separately required for native iOS.
5. Only after those gates and separate production deployment approval may status advance beyond NOT_RELEASED. No production deployment was performed here.


## Next actions — 2026-11-10 04:22 EET — geocoder sample passed

1. Current development tunnel autocomplete for the generic city query “Львів” returned HTTP 200 and six suggestions, with Lviv, Lviv Oblast first. Keep the status limited to this one live dev query.
2. Verify the same query and its outage behavior against a pinned staging API once available; current endpoint build/commit SHA is null.
3. Do not infer that route search, all transport categories, or production autocomplete are verified from this GET. Production remains NOT_RELEASED.


## Next actions — 2026-11-10 04:52 EET — bike/walk map geometry

1. Visually inspect a bicycle-plus-walk journey on `:7777` after refresh; route model tests pass, but visual acceptance is NOT_TESTED because browser automation is unavailable.
2. Add real cycling and pedestrian routing only through verified/configured providers. Current dashed endpoint lines are explicitly estimates, not street-level paths; confirm provider URL/profile and Lviv coverage before marking real geometry available.
3. Wait for PR #126 checks on exact head `858a2ab8d1cfd461f37000fe3c7a6b64660fc7f3`; review and merge only if required checks pass and branch protection allows. Run a bundle build to a new temporary output directory and visual browser flow when available. Targeted tests and typecheck pass; real cycling/foot routing still needs verified configured providers. Keep release `NOT_RELEASED` until CI and integrated acceptance pass.


## Next actions — 2026-11-10 05:06 EET — Qoder Server geometry task

1. Let Qoder complete its isolated provider-backed WALK/BIKE geometry implementation. Do not run another heavy local build/test while its work is active.
2. Verify its worktree is a fresh branch from the current Server origin/main; inspect its exact diff and tests, then run only relevant follow-up checks if resource gates allow. Never copy from or modify the dirty Server worktree without selective review.
3. Review exact provider config/provenance and ensure absent or failed providers remain explicitly estimated/unavailable. Fixtures do not establish live geometry.
4. If Qoder opens a PR, review it against exact head/base SHA and required checks; do not merge until correctness is independently verified.
5. Site PR #126 is already merged at main SHA `895f51e0e1f728c5b3ba0458b2d98e74ad5fb62f`; no Site build/restart was performed.
6. Keep release `NOT_RELEASED` pending live permitted routing-provider validation, visual acceptance, exact six-SHA integration, staging, restore/rollback, and the remaining release gates.


## Next actions — 2026-11-10 05:12 EET — Qoder geometry implementation checkpoints

1. Wait for Qoder's read-only provider-path analysis, then require an explicit implementation plan tied to exact files and API fields before it edits. Keep its worktree isolated from the dirty canonical Server checkout.
2. After each substantial, tested Server change: inspect the exact diff; ask Qoder to checkpoint with a task-only commit and push to its own branch; then use the canonical Codex browser on `:7777` to inspect a representative journey/map before it proceeds. Never commit other dirty work.
3. Keep heavy work serialized. Current memory free 31%, disk free 27 GiB, swap used about 6.9 GiB; do not start a second heavy local test/build while Qoder or Chrome remains active.
4. For visual acceptance of bike/walk geometry, use a representative route that actually includes those legs. Existing verified route is walk+bus only and is insufficient. Confirm provider-backed real geometry separately from estimate/fallback status.
5. Do not merge Qoder's Server PR until Codex independently reviews exact SHA, tests, endpoint continuity/provenance, and the `:7777` map. Production remains NOT_RELEASED.


## Next actions — 2026-11-10 05:21 EET — review PR #134 before acceptance

1. Wait for both PR #134 exact-head `verify` checks to finish; inspect individual jobs, not just PR mergeability.
2. Ask Qoder to correct the cache graph-version mismatch (`BIKING_GRAPH_VERSION` vs gateway's `OSRM_GRAPH_VERSION`) on the same isolated branch, add a focused test, run the relevant checks, then create a new commit and push.
3. After each new pushed checkpoint, refresh and inspect the canonical `:7777` page. The current bus/walk route reload is only UI continuity evidence; use a route that actually contains a bicycle leg to verify candidate API geometry.
4. Confirm whether a permitted, explicitly configured Lviv cycling router is present without printing secrets or URLs. If absent, the code remains implemented but live bike street geometry is NOT_TESTED/UNAVAILABLE and the fallback remains an estimate.
5. Review exact PR head and provider provenance after the correction. Do not merge until CI is green and the cache issue is fixed; do not deploy production.


## Next actions — 2026-11-10 08:03 EET — multimodal routing 4.0

1. The previous Qoder geometry review item for PR #134 is superseded for current-main code: exact Server main is now `c7d434d5c32e44970357cc9103fb6f8f1abca4ed`, whose merge commit is PR #134. Keep the old entry as historical; do not replay it.
2. Continue only in `/private/tmp/marshgo-multimodal-routing-4-20261110` on `codex/multimodal-routing-4-20261110`. Review the staged direct-only policy and its new regression fixture; do not copy into or alter the dirty canonical Server checkout.
3. The first focused test run found a constant-name error and an invalid fixture wait bound; both were corrected. Rerun `node --import tsx --test tests/gtfs-direct-only-adaptive-walking.test.ts` using the already installed Node 24.21.0/root dependencies only when memory free is at least 35%, disk remains above 8 GiB, and no competing heavy task is running. Then run typecheck as a separate process.
4. Add or revise no performance claims without measurements. Compare a pinned Lviv GTFS snapshot on exact candidate SHA only after the focused fixture and typecheck pass; report truncation and every provider/mode result honestly.
5. Prepare the Server acceptance report and exact-SHA PR only after required tests pass. No merge, runtime restart, data write, staging change, or production deployment. Keep release `NOT_RELEASED`.

## Next actions — 2026-11-10 08:27 EET — API-level adaptive walking retry

1. Continue only in `/private/tmp/marshgo-multimodal-routing-4-20261110` on `codex/multimodal-routing-4-20261110`; the dirty canonical Server tree remains untouched.
2. Add an endpoint-level regression that proves direct-only search retries after all normal-radius candidates fail routed-foot feasibility, reuses the parsed feed, requires confirmed expanded geometry, respects total walking caps, and preserves truncation flags.
3. Current exact local evidence: project typecheck PASS; six focused routing suites 75/75 PASS; isolated `git diff --check` PASS. ESLint is blocked by the missing `eslint-plugin-unused-imports`; do not change dependencies or lockfiles for this task.
4. Then run relevant exact-head CI and a replay on a pinned Lviv GTFS snapshot. Compare the shared candidate set and the three strategy winners, recording every source, mode, and truncation state. Live provider, performance, staging and operational gates remain open.
5. Only prepare/push a reviewed task-only PR after the API-level regression passes. No merge, service restart, database write, or production deployment; release remains `NOT_RELEASED`.

## Next actions — 2026-11-10 — multimodal routing 4.0 verification

1. Continue only in `/private/tmp/marshgo-multimodal-routing-4-20261110`, branch `codex/multimodal-routing-4-20261110`; do not copy over the dirty canonical Server checkout.
2. Address the documented boundary: retry the next direct-only walking tier if scheduled candidates all fail confirmed pedestrian-route feasibility, while reusing cached feeds, enforcing the total-walk cap, and preserving truncation metadata. Add a small-feed regression for this API-path decision.
3. Current exact local evidence: project typecheck PASS; focused routing regression set 75/75 PASS; isolated `git diff --check` PASS. ESLint is blocked by missing `eslint-plugin-unused-imports`; do not install dependencies or touch lockfiles for this task.
4. After resource checks, run the additional bounded tests and exact-head CI. Use only a pinned Lviv snapshot for feed replay; no live Lviv, all-mode, performance, or staging claim is established yet.
5. Review and commit only task-owned files after the API retry and acceptance boundary are decided. No merge, service restart, database write, or production deployment without passing gates; release remains `NOT_RELEASED`.

## Next actions — 2026-11-10 08:37 EET — Lviv replay evidence

1. Do not start another heavy test/replay while free memory is 33% (below the 35% floor); disk is 26 GiB free. Recheck resources before the next heavy process.
2. Once eligible, typecheck the modified replay script, then run one no-transfer replay against the pinned GTFS archive SHA-256 `45b8c8613b0ae40ae22f703c5e29011413a6baeabeaea6d0dc5b676a18f6bc64` with explicit `GTFS_REPLAY_MAX_TRANSFERS=0` and adaptive walking controls. Preserve truncation output; do not report it exhaustive if any cap is hit.
3. Add endpoint-level coverage for the route handler's retry after measured pedestrian routing rejects every standard-reach candidate; verify worker/feed reuse, walk cap, confirmed geometry and truncation aggregation. The generic retry-controller fixture is not a substitute for this.
4. Run relevant exact-head CI and obtain reproducible candidate SHA before PR. Current static feed evidence was run with uncommitted source changes; it is not exact-SHA acceptance. ESLint remains blocked by absent `eslint-plugin-unused-imports`.
5. Leave `:3002`, `:7777`, database, containers and dirty canonical checkouts untouched. No merge or deployment; `production_ready=false` / `NOT_RELEASED`.

## Next actions — 2026-11-10 08:42 EET — draft PR #135

1. PR [#135](https://github.com/dima1203oleg/MarshGO-Server/pull/135) is draft, base `c7d434d5c32e44970357cc9103fb6f8f1abca4ed`, current head `62a89a9acd174c8ddf5198a68d47986ff39a4444`; current exact-head CI run `42770307876` was queued at the latest check.
2. Do not merge this partial candidate. Required remaining code evidence: endpoint retry integration test, replay-script typecheck, no-transfer pinned Lviv replay and exact-head CI completion.
3. Current resources are below the local heavy-work threshold: 32% free memory, 26 GiB disk free, about 7.7 GiB swap used, Docker VM active. Monitor CI remotely only until the memory gate recovers.
4. Continue only in `/private/tmp/marshgo-multimodal-routing-4-20261110`. Keep `:3002`, `:7777`, data stores and dirty canonical worktrees unchanged. Release remains `NOT_RELEASED` / `production_ready=false`.

## Next actions — 2026-11-10 08:49 EET — PR CI passed; Qoder review running

1. Current draft PR #135 head `c12902afd235e94de51caa17f62140d3885c2047` passes both GitHub verify runs `42770673011` and `42770665318`, including full tests, integration, lint, typecheck, API image smoke and Compose lifecycle. Do not treat this as acceptance for untested live transport or foot geometry.
2. Qoder is independently reviewing this exact PR head in read-only mode. Incorporate only concrete findings; do not allow Qoder to edit overlapping Server files while the review is running.
3. Remaining gates: endpoint-level retry/feed-reuse/geometry test; pinned Lviv `maxTransfers=0` replay with truncation captured; exact common-pool/three-strategy comparison; profile/performance evidence. PR remains draft until these are resolved.
4. Resources: 28% free memory, 25 GiB disk, ~8.5 GiB encrypted swap used; Docker VM is CPU-heavy and Qoder is running. No local heavy work until the project floor recovers. No merge or deployment; `NOT_RELEASED`.

## Next actions — 2026-11-10 09:43 EET — finish Qoder Lviv feed handoff

1. Continue only in `/private/tmp/marshgo-lviv-all-feeds-20261110`, branch `qoder/lviv-all-feeds-20261110`; do not touch the dirty canonical Server tree or active Site/zrok runtime.
2. Recheck memory and active processes before running the focused Lviv/mobility tests and typecheck. Do not start them below the 35% free-memory gate or with less than 8 GiB disk.
3. Review the final five task-owned files, ensure the temporary `node_modules` symlink is not staged, then commit only named task files. Push a new branch/PR only after confirming the remote branch does not already exist; do not merge or deploy.
4. Keep Lviv marshrutka, bike, scooter, taxi, carshare and transfer unavailable unless an authorized, geographically relevant provider and its operating rules are verified. Do not label source geometry as rendered geometry or fixture checks as live acceptance.
5. `:7777`/zrok currently serves the Qoder Site worktree and is not using this Server candidate. Keep that runtime unchanged until a separate safe integration/acceptance step. Production remains `NOT_RELEASED`.

## Next actions — 2026-11-10 09:55 EET — PR #136 verification

1. Monitor exact-head Server CI run `42777974404` for PR [#136](https://github.com/dima1203oleg/MarshGO-Server/pull/136), head `073e6a976dd5aa78c2b0e78adaa99c2c63f72583`. CI is `in_progress`; no local tests/typecheck were run.
2. If CI passes, keep PR draft pending review/acceptance; if it fails, read the failing job and fix only the confirmed issue. Do not merge or deploy.
3. Recheck memory before any local test; it was 29% free with 9,643 MiB swap used and 24 GiB disk free. Do not run local heavy checks until >=35% free memory and no competing heavy process.
4. Keep `:7777` and zrok untouched; they serve the existing Qoder Site worktree, not this Server candidate. Do not stage the untracked `node_modules` symlink.
5. Lviv live supply remains unverified/unavailable for marshrutka, bike/scooter rentals, taxi, carshare and transfer; do not seed fake providers. Metro is not applicable. Production remains `NOT_RELEASED`.

## Next actions — 2026-11-10 10:02 EET — await PR #136 exact-head CI

1. Inspect PR #136 run `42778290020` for head `b8e1d683da307c82257ad76f482de9210d3a18c3`; prior head had exactly one stale-string assertion failure, now corrected. Do not report CI green until this run completes.
2. When free, verify exact counts of pass/fail/skip and inspect any failed step. Local checks remain deferred while Docker Desktop uses high CPU; current RAM free is 35%, swap use 9.4 GiB, disk free 24 GiB.
3. Leave PR #136 draft/unmerged pending exact-head CI and review. No main merge, active service change, zrok switch, or production deployment.
4. Current `:7777` Site is still the Qoder worktree. This Server candidate is not integrated into the running zrok build.

## Next actions — 2026-11-10 09:56 EET — PR #136 passes CI, still partial

1. Keep PR #136 at head `b8e1d683da307c82257ad76f482de9210d3a18c3` open and unmerged pending review and any required exact Lviv route acceptance. CI run `42778290020` passed; unit tests were 653 passed, 0 failed, 3 skipped.
2. Before local replay or UI tests, wait until memory is at least 35% free and Docker/Virtualization is no longer CPU-heavy. Last sample: 34% free, 24 GiB disk, 9,364 MiB swap used, Virtualization ~64% CPU.
3. Do not call the task “all feeds live”: separate Lviv marshrutka, bicycle/scooter rental, taxi, carsharing and transfer providers were not verified; carpool offer and train use were not tested. Metro is not applicable.
4. The latest PR is not deployed to `:7777` or zrok; current tunnel serves the existing Qoder Site worktree. Keep the working runtime unchanged until an approved integrated build passes browser/runtime acceptance.

## Next actions — 2026-11-10 12:27 EET — compact route-sheet PR #129

1. Check exact-head GitHub CI for draft PR [#129](https://github.com/dima1203oleg/MarshGO-Site/pull/129), branch `codex/bottom-sheet-density-20261110`, SHA `bebecdba1e7319d7f2fec7d2816a7bac6d13cbef`; latest status was QUEUED.
2. If CI fails, inspect and repair only the confirmed cause in the isolated worktree. Do not merge or deploy.
3. Before any release claim, verify on physical iPhone/iOS Safari (safe-area and touch behavior) and against an authenticated live route. The synthetic fixture preview is not live acceptance; production remains `NOT_RELEASED`.
4. Leave `:7777`, zrok, API, databases, and the dirty canonical Site checkout unchanged.

## Next actions — 2026-11-10 — Signature Navigation 8 candidate

1. Finish local diff checks and review only task-owned files in `/Users/dima1203/.codex/worktrees/marshgo-bottom-sheet-density-20261110` on `codex/bottom-sheet-density-20261110`; do not stage root or canonical Site dirty paths.
2. Commit/push this checkpoint to existing draft Site PR #129, then check CI against the exact pushed SHA. Keep the PR draft, unmerged, and undeployed.
3. Keep the candidate preview at `http://127.0.0.1:4178/bottom-sheet-visual.html` available for visual review; the route is synthetic. Do not change the owner-managed :7777 or zrok runtime.
4. Before claiming full Signature 8 acceptance, still verify authenticated live route data, real provider geometry, physical iPhone/iOS Safari, performance, and remaining screens. Production remains `NOT_RELEASED`.

## Next actions — 2026-11-10 — Signature Navigation 8 exact-head CI

1. Documentation-only head `8632eb66746d508139c6ad8e54db4e04097af536` is pushed to PR #129; exact-head run `42817587235` is in progress. Product-code head `1646937859edd7d67c530e78713c7dda26d76784` passed exact-head CI run `42816504324`.
2. Keep PR #129 draft and unmerged; do not deploy or alter `:7777`/zrok. The local visual preview remains available at `http://127.0.0.1:4178/bottom-sheet-visual.html` and displays synthetic route data.
3. Signature Navigation 8 remains PARTIAL until authenticated live route, provider geometry, physical iPhone Safari, performance, and remaining-screen acceptance are verified. Production remains `NOT_RELEASED`.

## Next actions — 2026-11-10 — Master 10 first visual checkpoint

1. Check exact-head Site CI run `42821210697` for PR #129 at SHA `c5968f8b5bf1e77236ef7c5dd29f4f56cb429a5d`; current state `in_progress`. If it fails, inspect the failed step and fix only the confirmed issue in the isolated Site worktree.
2. Keep PR #129 draft/unmerged and production `NOT_RELEASED`. Do not alter canonical Site, `:7777`, the current zrok tunnel, Server, or production data.
3. Continue the next Master 10 gate with another incremental implementation + local browser loop. Existing shared zrok is pointed at the wrong worktree; do not claim it as candidate acceptance or create a new public tunnel.
4. Remaining release blockers include authenticated live journey, physical iPhone/iOS Safari touch/safe-area, GPS navigation, complete HyperFlight/transfer replay, all 12 icon acceptance, live vehicle evidence, performance profile and complete cross-repository release manifest.
5. The visual preview uses synthetic route data; console asset/bounds warnings and one unscoped MutationObserver error remain recorded for follow-up.

## Next actions — 2026-11-10 — Master 10 iconography checkpoint

1. Monitor draft Site PR #129 exact-head CI run `42821887856`, SHA `b4fcddbc74be4277ff5d4b59b406ab97c35aad7f`. It was `in_progress` after source/tests/docs were pushed.
2. Continue Master 10 solo with the next bounded implementation and browser loop; retain PARTIAL for iconography until every production context/theme is visually checked.
3. Do not switch/restart `:7777` or the shared zrok tunnel. It is the wrong worktree for this candidate; use local `:4178` preview and report zrok gate BLOCKED.
4. Keep PR #129 draft/unmerged and production `NOT_RELEASED` until the live authenticated, physical-device and cross-repository release gates have evidence.

## Next actions — 2026-11-10 — Master 10 navigation visual follow-up

1. Draft PR #129 report-only head `09a63b0d542cfd7b972434b8b728e4b5ffcc024b` passed exact-head CI run `42830178181`. The exact app source SHA `8b1ca056459dc976a67fbdd9eac50422926b0cb0` passed run `42828227538`, and PR snapshot `56b71cc6d51f0577202a6833742f77bee0cb3025` passed run `42829380818` (676 tests, lint, typecheck, build and boot smoke); no source/fixture code changed in the final report-only commits.
2. Keep preview `http://127.0.0.1:4178/tests/visual/hyperflight-navigation.html` available. It uses synthetic route data and is not authenticated/live. Do not switch or restart the shared `:7777`/zrok runtime.
3. Next visual work should verify the complete in-flight animation and confirm the floating-label hold/dissolve after final styling, then test touch on physical iPhone Safari or mark BLOCKED if hardware is unavailable.
4. Remaining Master 10 gates: authenticated live journey and route geometry, GPS navigation, physical touch/PWA, live vehicles/ETA, full performance profile, final exact-head CI and the six-repository release manifest. No merge or production deployment; production remains `NOT_RELEASED`.

## Next actions — 2026-11-10 — Persistent bottom-navigation checkpoint

1. Exact-head Site CI run `42835947180` для коду та documentation-only run `42837070272` для PR head `07dbdcabc4d050a82eb7da307ac8d590274ff4f9` обидва пройшли. Наступний етап — наступний невиконаний Master 10 gate, із такою ж локальною візуальною перевіркою та звітом.
2. Залишити PR #129 draft і не зливати/не деплоїти без окремого рішення власника.
3. Не змінювати `:7777` або zrok: тунель і далі показує Qoder-worktree. Для кандидата використовувати локальний preview `:4178`; якщо треба повне приймання через zrok, спершу потрібне безпечне погоджене переключення середовища.
4. Критичні невиконані гейти: справжні mobile touch-перевірки, iPhone Safari/PWA, автентифікований live route, придатні карти/стильові ресурси, GPS і live ETA, повний профіль продуктивності та міжрепозиторний release manifest. До доказів production лишається `NOT_RELEASED`.

## Next actions — 2026-11-10 — Floating info timing

1. Залишити незакомічену правку у чистому ізольованому Site-кандидаті. Вона вирівнює CSS dissolve тривалість tap-dismiss із 275 ms lifecycle timer; автоматичне 4-секундне утримання не змінене.
2. Перед тестом і локальним browser preview повторно перевірити диск, вільну пам’ять, swap та активні важкі процеси. Запустити лише після досягнення 35% вільної пам’яті й завершення конкуруючого важкого навантаження.
3. Виконати `tests/floating-info-lifecycle.test.ts`, потім відкрити кандидатський `:4178` preview і виміряти повний 4-секундний hold, 750 ms automatic dissolve та 275 ms tap dismissal. Не використовувати спільний `:7777`/zrok, не перезапускати його.
4. Лише після тесту й браузерної перевірки оновити acceptance/matrix статус G9; production залишається `NOT_RELEASED`.

## Next actions — 2026-11-10 — Route sheet density

1. Keep the existing uncommitted compact-sheet changes in `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`; do not reset or replace them.
2. When free memory is at least 35% and competing load is calm, run `tests/route-map-sheet-3.test.ts` and the existing `tests/route-ribbon-density.test.ts`; then use the already running zrok page to check 320–430 px widths, long street names, summary fit, CTA visibility and ribbon swipe. Do not restart or repoint `:7777`.
3. If the horizontal summary clips fare/time at narrow widths, adjust only the sheet layout and repeat the focused checks. Keep accessibility labels, touch targets and all route actions.
4. Resume the separate Master 10 floating-info timing acceptance after this visual checkpoint. No merge/deploy; production stays `NOT_RELEASED`.

## Next actions — 2026-11-10 — Route sheet horizontal density follow-up

1. Preserve the current edits in `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`; existing zrok remains on that tree through PID 59193 at port 7777. Do not restart or repoint it.
2. Before another test/browser/build, recheck resources. Latest: 22 GiB free disk, 34% free memory, 10,676.62 MiB encrypted swap used, Virtualization at 94.7% CPU. Wait until memory is at least 35% and competing load is calm.
3. Then run focused sheet tests and verify the latest HMR build in the existing zrok tab. Check endpoints/summary at mobile widths, all four detents, CTA visibility and horizontal stage scrolling; capture actual browser dimensions/screenshots. Current detent heights are formula-only.
4. Keep unrelated floating-info work queued until this visual checkpoint is complete. No merge/deploy; production remains `NOT_RELEASED`.
5. Partial zrok measurement found only 25 px for the expanded detail list (sheet 301 px; endpoint 17 px; summary 24 px; ribbon 75 px) at 267×473 CSS px. Revisit ribbon/vertical budget after resources recover; do not accept the new snap formula from arithmetic alone.
6. A fresh load redirects to the public landing/sign-in screen, and the authenticated route tab cannot currently be controlled by the browser automation bridge. Keep user tabs and authentication untouched; resume visual acceptance only when the route is available in a controllable authenticated tab.
7. The route-details ribbon is now 48 px high with 44 px horizontal chips; test that it stays readable and swipeable and that active navigation is unchanged. `git diff --check` passed; focused tests and visual result remain pending. Do not run them while the current high CPU load is active.
8. Latest recheck: 32% free memory, 10,554.88 MiB swap used, 22 GiB free disk; hold automated/browser/build checks until memory is >=35% and competing CPU load subsides.
9. Most recent sample: 33% free memory, 10,496.88 MiB swap used, Virtualization 35.1% CPU; continue to defer heavy checks until memory clears 35% and load is calm.

## Next actions — 2026-11-10 — Route geometry visual refinement

1. Preserve geometry-token edits in `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` at HEAD `d8e813d08446c851604a9f229172fa9979dc4cdd`; leave the existing horizontal-sheet edits intact.
2. After free memory recovers above 35% and active system load is calm, run `tests/route-geometry-intelligence.test.ts` and `tests/transport-visual-zones.test.ts`, then targeted typecheck/lint if the first checks pass.
3. Visually inspect the currently served zrok route only when the authenticated journey is available in the browser bridge. Confirm transit, walking, focused passenger geometry and reveal line remain readable on the real basemap; capture before/after dimensions or screenshots. Do not restart/repoint `:7777` or disturb user tabs.
4. Current evidence: source diff and `git diff --check` only; tests and browser render remain **NOT_TESTED**. Latest resource sample: 21 GiB free disk, 37% free memory, 11,082 MiB swap used, Virtualization 55.1% CPU and WindowServer 36.2%. Wait for competing load to settle before a focused test or zrok visual review. No merge/deploy; production remains `NOT_RELEASED`.
## Next actions — 2026-11-10 — Site CI and production gates

1. Preserve all unstaged work in `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` and root docs. Do not reset, clean, stage unrelated files, restart/repoint PID 59193 or `:7777`, merge, or deploy.
2. Wait until free memory is at least 35% and competing CPU load settles. Then run `tests/motion-tokens.test.ts` first; if it passes, run the Site suite once. Keep one heavy local process at a time and record before/after resources.
3. Review and commit only the deliberate Site CI fix (selected-stage `--mg-z-raised` layering and reduced-motion test scope), then fast-forward the existing Site PR branch only if its remote head still equals `d8e813d08446c851604a9f229172fa9979dc4cdd`; rerun exact-head CI. Do not include the unrelated dirty geometry/sheet edits in that commit.
4. After the gate clears and browser resources are safe, inspect the existing authenticated zrok journey without touching its tabs, auth, target, or port; verify updated geometry and compact sheet visually. Current measurements and source changes are not visual acceptance.
5. Continue release readiness only from exact, tested component SHAs. Root PR #12/#20 private Admin/Partner Actions access and staging/provider/device evidence remain blockers; keep release `NOT_RELEASED` until each required gate is verified.
## Next actions — 2026-11-10 16:40 UTC — Exact-head follow-up

1. Wait for Site PR #127 CI on `dbd670b88c47c79b6da782ca4b5e5064b8c6d5c2`; if it fails, inspect exact logs and fix without staging any existing map/sheet work.
2. Do not run local test/build/browser while memory is 30% and Virtualization/WindowServer are busy. Recheck resources; once free memory is at least 35% and load settles, run the targeted motion-token test, then one Site suite and visually inspect the authenticated zrok journey if it remains accessible.
3. Root PR #24 verify is blocked by HTTP 403 cloning private Admin; root PR #20 and PR #12 security/verify gates remain unresolved. Continue independent release evidence, but request a fresh least-privilege private-repository Actions credential from the owner only when ready to unblock hosted materialization. Do not bypass the gate.
4. Keep PR #22’s insecure-temp fix unmerged until exact checks and stack order are reviewed; its CodeQL scan is clear, but required verify is still failing.
5. Keep release `NOT_RELEASED`; no production deploy until exact pinned builds, staging, security, provider, browser/device and rollback gates are verified.
## Next actions — 2026-11-10 16:42 UTC — Geometry token follow-up

1. Preserve the new reveal-opacity restore fix with all other unstaged route-geometry and compact-sheet changes. It is not part of PR #127’s committed CI fix.
2. Once free memory is ≥35% and system load is settled, run the focused route-geometry and visual-zone tests, then inspect the authenticated zrok journey and verify repeated route reveal stays at the intended restrained glow.
3. Do not mark geometry verified from token assertions; capture the actual basemap render and recheck after the shared source recovers.
## Next actions — 2026-11-10 16:43 UTC — Site checks passed

1. Keep PR #127 at exact passing SHA `dbd670b88c47c79b6da782ca4b5e5064b8c6d5c2`; review remaining browser/device evidence before treating the mobile gesture change as fully accepted.
2. Preserve unstaged compact-sheet/geometry edits and the later glow-opacity restoration fix. When free memory is at least 35% and load is calm, run focused geometry/zone/sheet tests, then the Site suite once if focused tests pass.
3. Inspect the authenticated route on the existing zrok browser only when resources permit; verify route/walk strokes, passenger zone B, repeated reveal opacity, sheet detents, and horizontal swipe. Do not restart or repoint `:7777`.
4. Continue root release gates: exact component pins, private Admin/Partner 403 in root materialization, missing staging/rollback and provider/device evidence. Keep `NOT_RELEASED` and do not deploy.

## Next actions — 2026-11-10 16:49 UTC — Geometry semantics and visual gate

1. Preserve the explicit `isWalk` field change and all existing geometry/sheet edits on Site branch `codex/compact-horizontal-route-sheet-20261110` at HEAD `dbd670b88c47c79b6da782ca4b5e5064b8c6d5c2`.
2. Do not run local tests/build or browser automation until free memory is at least 35% and WindowServer/system load settles. Then run focused journey model, route geometry, transport-zone and sheet tests serially; follow with typecheck/build only if resources remain safe.
3. Use the existing authenticated zrok page only after the resource gate clears. Visually confirm light/dark basemap contrast, WALK dashed styling, selected transit stroke, repeated reveal opacity, passenger zone B, and sheet not obscuring route. Capture evidence and retest any visual defect. Do not restart/repoint PID 59193 or port 7777.
4. The geometry and sheet diff is still dirty; do not claim production readiness or merge it without the focused test and browser evidence. Keep release `NOT_RELEASED`.

## Next actions — 2026-11-10 16:50 UTC — Geometry test follow-up

1. Focused tests passed 56/56. Next, typecheck the Site contract after memory remains >=35% and competing CPU load subsides.
2. Then inspect the authenticated zrok route in the existing browser at a mobile viewport; verify real light/dark route rendering, dashed walking, selected transit shape, repeated reveal and compact sheet. Capture evidence without changing the existing tunnel or port.
3. Do not merge/deploy from unit tests alone. The geometry work still needs visual evidence and the broader release gates remain open.

## Next actions — 2026-11-10 16:53 UTC — Visual QA blocked by current session state

1. When free memory recovers to at least 35% and CPU pressure is calm, retry the existing authenticated zrok route in the browser. Current Codex tab-control call fails with `browser.user is unavailable`; do not create or repoint a tunnel as a workaround.
2. Once visual access works, verify route/casing/core alignment, walking dash on both themes, selected B-zone, reveal fade restoration, and the sheet/map framing at 390 px. Save a screenshot and record actual observations.
3. After browser QA, run the full Site suite and production build one at a time under the same resource guard. Do not include the geometry/sheet diff in release pins until checks finish.
4. Production remains NO-GO / `NOT_RELEASED` until the root private-repository Actions gate, staging target, live provider, device, and rollback evidence are cleared.

## Next actions — 2026-11-10 16:56 UTC — First live journey

1. Identify an owner-approved production geocoder and ensure the API exposes source/build provenance. Do not point production at Photon’s public demo.
2. Restore a control path for the already-open zrok browser when safe; current bridge errors with `browser.user is unavailable` and the active renderer/computer-use service is CPU-heavy. Do not restart the user’s browser or tunnel.
3. Once an owner signs in through the existing session, run a fresh query with a public/approved geocoder, prove provider→API→journey→map→navigation, and capture screenshot/route evidence. Do not create credentials or bypass `requireAuth`.
4. Keep route geometry and compact-sheet changes dirty until focused tests, typecheck, full verification and visual acceptance have passed. Release stays `NOT_RELEASED`.

## Next actions — 2026-11-10 16:59 UTC — Current state after repo-policy alignment

1. Continue only in isolated Site worktree /Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site, now branch qoder/route-geometry-continuation-20261110; preserve its 15 dirty paths and the separate nested canonical Site checkout's 28 dirty entries.
2. Wait for load to calm (currently Docker Desktop renderer ~66% CPU, free memory 35%) before full suite/build/browser. The focused 56-test subset and typecheck already passed on current dirty source.
3. Current zrok module is the changed code, but no browser pixels are proven. Retry visual QA only when CUA can attach to the current tab; do not restart/repoint zrok or access credentials.
4. Authenticated first route, live provider provenance, exact Server build pin, root private Admin/Partner CI gate, staging, device and rollback remain release blockers. Keep NOT_RELEASED.

## Next actions — 2026-11-10 17:02 UTC — Resource-gated validation

1. Do not start full Site tests/build/browser while memory is 32% and Codex renderer/Virtualization remain busy. Recheck after they settle; start one heavy task at a time only at >=35% free memory and >=8 GiB free disk.
2. Codex panel open request for the supplied zrok journey returned queued; this is not visual evidence. If it becomes visible, inspect actual render only after the resource gate clears.
3. Do not prune caches: disk is 23 GiB free and current UI/browser/VM caches are active or user-owned. Preserve all evidence and worktrees.

## Next actions — 2026-11-10 17:03 UTC — Exact-head CI confirmed

1. Do not bypass release materialization. Root PR #24 and #22 verify workflows both fail at the required materialize-release step; resolve private Admin/Partner read access through owner-managed least privilege, then rerun the exact stacks.
2. Site PR #127 exact-head CI is green, but local route geometry/sheet edits are uncommitted and still require full suite/build plus visual screenshots.
3. Continue to defer heavy runs until resources recover; latest was 32% free memory. No production deployment or merge.

## Next actions — 2026-11-10 17:06 UTC — Post-suite validation

1. Full Site suite is green at 658/658 after restoring the 172 px expanded map strip. Re-run typecheck after the last sheet-cap edit when memory recovers above 35%.
2. Do not run build or browser now: free memory fell to 29%. The zrok URL request is queued in the Codex panel, while the CUA bridge still cannot attach to the existing authenticated tab.
3. After resources recover, finish visual route geometry and sheet acceptance; capture a screenshot. Then run Site production build, each as a separate heavy task.
4. Keep geometry/sheet changes uncommitted until visual and build gates pass. Production remains NOT_RELEASED due auth/provider/build pin, release materialization, staging, and other evidence gates.

## Next actions — 2026-11-10 17:13 UTC — Route arrow fix and production gates

1. Preserve the current zrok-served Site worktree and branch `qoder/route-geometry-continuation-20261110`; do not touch the user's root/Site dirty trees or restart port `:7777`.
2. After free memory is at least 35% and competing processes settle, run the focused route-geometry regression test first, then typecheck; run the full Site build separately and capture its exit code.
3. Reopen the saved route through an owner-authenticated session. The existing page showed the route before reload, then a country-scale frame after HMR; same-URL reload was redirected to the landing/sign-in page. No auth workaround. Capture the corrected route screenshot and check the direction marks at overview and street zoom.
4. Keep the latest route-arrow render **NOT_TESTED** until the route is accessible and visible. Release remains `NOT_RELEASED`; private Admin/Partner CI read access, approved geocoder/provider evidence, exact build pins, staging, and deployment/rollback acceptance still need resolution.

## Next actions — 2026-11-10 17:20 UTC — Resource and auth recheck

1. Do not start the focused suite, typecheck, build, or another browser session while free memory is 29%, swap is above 10 GiB, and Codex/Qoder/WindowServer are CPU-active. Keep the existing Vite/zrok processes untouched.
2. When the owner restores an authenticated route view, check the fixed arrow density at overview and street zoom and capture the actual rendered result. The unauthed landing after reload does not provide route evidence.
3. When memory is at least 35% and host load settles, run the route geometry test, then typecheck, then production build as separate tasks; capture each exit code and resource snapshots.
4. Release remains `NOT_RELEASED` until the first authenticated provider-backed journey is proved and the known root private-repository CI, staging, and rollback gates are resolved.

## Next actions — 2026-11-10 19:34 UTC — Home reference and iPhone bottom bar

1. Keep the current Site worktree on `qoder/route-geometry-continuation-20261110` and preserve HEAD `3803cab02b8dc1636f23e6fdc0e960a200fadec3` plus its four local edits; do not reset, restart Vite `:7777`, or repoint zrok. At 19:37 UTC, memory free was 29% with 12,912 MiB swap used, so continue to defer build/test/browser.
2. After free memory is at least 35% and competing UI/VM load settles, run focused home and bottom-navigation tests, then typecheck, then build separately.
3. Open the already-authorized zrok session at iPhone 15 Pro Max viewport (430×932 CSS px), capture the current home screen and compare it with the provided reference; inspect bottom safe-area placement and non-overlap on home, route details, and active navigation. Fix observed visual differences and recapture. The current HTTP 200 module fetches are not screenshot evidence.
4. Do not report pixel-perfect/visual acceptance until the actual rendered comparison is captured. Production remains `NOT_RELEASED`.


## Next actions — 2026-11-10 19:41 UTC — Shared tab pop animation

1. Preserve Site HEAD `3803cab02b8dc1636f23e6fdc0e960a200fadec3` and all current edits; do not restart the existing Vite/zrok preview.
2. When free memory reaches at least 35% and host load settles, run the focused global navigation test, then inspect the active-tab animation in the existing zrok browser at the iPhone 15 Pro Max viewport and verify reduced-motion behavior. Run any further checks separately.
3. The current zrok CSS fetch is HTTP 200 only; the motion and home design are still **NOT_VISUAL_VERIFIED**. Keep that status until a real screenshot/interaction capture is available.

## Next actions — 2026-11-11 00:55 EET — zrok is up; authenticated browser check remains blocked

1. Keep zrok PID 33510, Vite PID 59193 (`:7777`), and API PID 66637 (`:3002`) untouched. Public zrok root, current journey SPA route, API health and `/readyz` all respond 200; the protected journey API returns 401 only when queried without a browser session.
2. Restore the existing browser-control attachment (`browser.user is unavailable`) or use the owner's already-authenticated browser session when accessible. Inspect the journey page's rendered state and network response before attributing the issue to an expired session; do not request credentials or bypass auth.
3. Continue to label visual journey acceptance NOT_TESTED. Preview is served by Vite development mode, not a production build. Current resources: 15 GiB disk, 29% free memory, 13,441 MiB swap; defer heavy browser/build/test work until the continuity memory threshold is met.
## RESUME BLOCK — route-sheet compactness follow-up, 2026-11-11

- Site source: `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, branch `qoder/route-geometry-continuation-20261110`, dirty HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`. Preserve all existing dirty paths.
- This increment tightens active navigation by an estimated ~20–30px in fixed vertical gaps/line boxes, depending on whether a wait row is present; 44px controls and single safe-area reservation remain intact. This is a CSS estimate, not a rendered measurement.
- `./node_modules/.bin/tsx --test tests/bottom-sheet-density.test.ts` passes **10/10, 0 failed/skipped**; targeted `git diff --check` passes. Cache-busted updated TSX is served through canonical `:7777` and the existing zrok origin. CUA sees the existing authenticated journey tab but cannot attach (`browser.user is unavailable`), so visual result/DOM measurements remain NOT_TESTED.
- Post-test resources: disk 17 GiB free, RAM 29%, swap 9.98 GiB used. Cache inventory: Site `node_modules` 252 MiB is active; `~/.npm` 1.9 GiB is entirely `_npx` packages used by active MCP runtimes and is protected; `_cacache` is 176 KiB; `~/Library/Caches` is 14 GiB mixed/unsafe. No safe cleanup candidate; nothing was deleted and no process was restarted.
- Next: attach to the existing signed-in zrok tab once the browser bridge recovers; at the same mobile viewport measure the expanded active-navigation sheet and compare details/navigation. Do not start another UI port or tunnel. Production remains `NOT_RELEASED`.

## NEXT — route street spacing, 2026-11-11

1. `tests/bottom-sheet-density.test.ts` passed 10/10. The canonical Vite on `7777` was restarted from the verified Site worktree because it had `DISABLE_HMR=true`; same port and existing zrok share are active, and both local/zrok serve the updated CSS and journey HTTP 200.
2. Reattach to the existing authenticated zrok journey tab and compare details with active navigation at the same mobile viewport; capture DOM heights/screenshots before claiming visual verification. Current CUA attachment still fails with `browser.user is unavailable`.
3. Do not start another port/tunnel. Keep visual acceptance NOT_TESTED and production `NOT_RELEASED` until browser evidence and release gates exist.

## NEXT — first provider-backed journey, 2026-11-11

1. Recover access to the existing signed-in zrok browser tab and verify the actual route UI; CUA currently fails with `browser.user is unavailable`, so do not bypass auth or invent a route.
2. Resolve the production API pin after choosing/configuring an approved contracted or self-hosted HTTPS geocoder; current `/api/v1/version` reports null build SHA/ID/time and `sourceState=unknown`.
3. Continue from the active Server+Site dirty worktrees. Static fallback geometry is guarded and estimated, but the 4/4 policy/provenance tests are fixture evidence only; prove a provider-backed walking + transit route in the UI before expanding scope.
4. Resource checkpoint: 18 GiB disk free, 33% RAM free, 8,820 MiB encrypted swap. Do not start a broad build/browser run while the VM is busy; no safe unused cache is available for cleanup.

## NEXT — confirm first route end to end, 2026-11-11

1. Route pricing invariant is covered: the direct `planJourneys` helper rejects unknown-fare candidates for CHEAPEST, 8/8 focused tests pass. This helper has no current production callsite; live API selection already filters unknown fares.
2. Recover the existing signed-in zrok page control (`browser.user is unavailable` remains the blocker) and prove search → select → map/legs → start navigation with the actual API response.
3. Pin the exact Server artifact only after the configured, approved geocoder/provider is available; current `/version` has null `buildId`, `commitSha` and `builtAt`. Keep release `NOT_RELEASED`.

## RESUME BLOCK — production geocoder guard, 2026-11-11

- Server: `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, dirty HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; preserve all dirty files.
- Production boot now fails fast if either forward or reverse geocoding is configured to the public `photon.komoot.io` demo. Runtime reverse lookups share the same guard; forward lookup already had one. Focused config+geocoding suites pass 22/22; scoped diff check passes.
- This does not configure or approve a real provider. Remaining first-flow blockers: owner-approved contracted/self-hosted HTTPS geocoder + exact API artifact/runtime pin + authenticated browser session access for route→map→navigation acceptance. Never bypass 401 or point production at public Photon.
- Resource after this single focused test: disk 17 GiB free, RAM 31%, swap 9.96 GiB. No service restart, cleanup, browser or other heavy task. Production stays `NOT_RELEASED`.
- Next: continue the provider-backed first user journey; verify current API `/version` and provider config read-only, then recover the existing authenticated zrok tab and validate route output. Only reconfigure runtime after the endpoint is owner-approved and operated.

## NEXT — route-sheet compactness, 2026-11-11

1. Latest compactness source is served by the existing zrok → canonical Site `:7777`: details and navigation now drop redundant endpoint/footer gaps while preserving 44px controls and safe-area spacing. Focused sheet/content-fit tests pass 13/13.
2. Capture the same signed-in journey at the same phone viewport and measure sheet/header/summary/ribbon/cards/CTA before and after. CUA still reports `browser.user is unavailable`; no screenshot or visual measurement is verified yet. Do not bypass auth or use another port/tunnel.
3. Preserve the dirty Site worktree and continue the larger route→geometry→navigation acceptance separately. Production remains `NOT_RELEASED`.

## NEXT — production first journey and sheet visual proof, 2026-11-11 11:25 EET

1. The canonical zrok→Site `:7777` route is reachable and serves compact sheet CSS; focused sheet/content-fit tests are 13/13. Rendered height/screenshot are still NOT_TESTED because the existing tab attachment fails with `browser.user is unavailable`.
2. The canonical Server `:3002` is healthy but unpinned (`buildId`, `commitSha`, `builtAt` null). Resume provider-backed search only through the user's normal authenticated session; do not bypass the expected 401.
3. Keep production `NOT_RELEASED`. Do not treat provider `last_sync_at` as live-feed freshness; verify actual `sourceFreshAt`/feed response when the protected route flow can be exercised. No extra preview ports or tunnels.
4. Resource gate at 11:25 EET: disk 17 GiB free, RAM 28%, swap 9,809 MiB; defer any heavy build/browser/E2E task until memory is at least 35% and competing load settles. No safe disposable cache is available for cleanup.

## NEXT — compact navigation header, 2026-11-11 11:35 EET

1. Preserve the active Site worktree and all dirty files. The active-navigation destination and schedule/duration now share one line; 20/20 focused tests pass, and local plus existing zrok module delivery is HTTP 200.
2. Once the authenticated browser bridge is available, open the same journey at 320/390/430 CSS px, measure the navigation sheet header and total expanded height, and compare it with route details. Current browser access still fails with `browser.user is unavailable`; keep visual acceptance NOT_TESTED.
3. The current change removes one 16px text row by CSS line-height, not a browser-measured total sheet height. Do not claim an overall before/after percentage until the same rendered route and viewport can be measured.
4. Resources after the focused run: disk 18 GiB free, swap ~9.40 GiB; host load includes active Virtualization, WindowServer and Codex rendering. Avoid build/full browser/E2E work and leave all processes/tunnels unchanged. No safe disposable cache was identified. Production remains `NOT_RELEASED`.

## NEXT — auth recovery and first real journey, 2026-11-11 11:43 EET

1. Preserve Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74` and Site HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` with all dirty changes. Password reset now reports unavailable before token creation unless running explicit isolated token tests; Site presents the honest failure path. Focused tests: Server 1/1, Site 12/12.
2. Do not restart API PID 66637: `/readyz` is 200, but `/api/v1/version` has null build identity. The DB-backed regression has not run; first provision only an isolated E2E DB/runtime and recheck resource limits, then execute the focused integration safely.
3. Real password recovery remains externally blocked by absent authorized email sender/domain/credentials. Do not invent delivery. Continue first provider-backed route → map → navigation through the existing authenticated session when CUA/browser access works; current bridge error is `browser.user is unavailable`, so do not bypass auth.
4. Keep root `RELEASE_MANIFEST.json` unchanged because both component checkouts are dirty and the active runtime is unpinned. Production remains `NOT_RELEASED`. Current resources: 18 GiB free disk, 29% free RAM, ~9.27 GiB swap; avoid build/full browser/E2E and cache cleanup unless a safe candidate is identified.
## NEXT — route-sheet long stop labels, 2026-11-11 12:07 EET

1. Preserve the dirty Site worktree/branch and all existing changes. Expanded stop rows now ellipsize long names on one line while retaining full accessible names, visible boarding/alighting markers and 44px interactive targets. Focused tests **14/14** and Site typecheck pass.
2. Existing zrok → `127.0.0.1:7777` was freshly reloaded and exercised on the same 9-stop journey; screenshot confirms the expanded list scrolls while the CTA remains visible. The current route has short labels, so visually verify the ellipsis with a real long-name route when available. Do not fabricate provider data or claim rendered height savings until measured on the same route/viewport.
3. Continue the route-sheet compactness and route geometry work without another server, port, or tunnel. Current CUA control works for this existing tab; capture before/after dimensions when the browser can read DOM measurements. Production stays `NOT_RELEASED`.
4. Resource checkpoint before/after the typecheck: 18/18 GiB free disk, RAM free 33%/38%, encrypted swap 9,455/9,754 MiB. Avoid broader build/browser/E2E while the host is busy. Disk is below 20 GiB; no clearly disposable unused cache was found or removed.

## NEXT — first authenticated provider-backed journey, after micromobility filter fix

1. Preserve Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74` and all dirty files. Per-mode bike/scooter provider filters now reach the correct estimators; empty mode selections return no offers. Focused tests **9/9**, Server typecheck and diff-check pass.
2. The existing signed-in zrok route was controlled for the prior visual checkpoint, but reattachment now intermittently returns `browser.user is unavailable`. Retry the same user tab when control is available; do not open another port/tunnel or use shell auth bypass. Then use the ordinary “back to results → compare/select” flow and inspect route provenance before calling the A19 journey live/provider-backed. Its current rendering is browser evidence, not proof of source/build identity.
3. Production Server startup now rejects missing/malformed build ID/SHA/time and any source state other than `clean`; config + build-info tests pass 13/13. Build and launch a pinned candidate only through the approved release process. Do not restart API PID 66637; its active development build is unpinned.
4. The public Photon demo is not an approved production geocoder. Recover ordinary control of the same zrok tab and verify route provenance/source/build identity before claiming a live route. Continue independent safe work; release remains `NOT_RELEASED`.
5. Resource checkpoint after Server checks: 17 GiB free disk, RAM free 42%, encrypted swap 10,176 MiB. Defer build or broad E2E while host load is busy; disk <20 GiB and no safe disposable cache was found.

## NEXT — route-sheet density follow-up, 2026-11-11 12:23 EET

1. Preserve the dirty Site worktree at `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`. Static stop rows are now 24px, while selectable stops remain 44px. The two focused route-sheet tests pass 14/14. The same zrok URL serves the updated CSS (HTTP 200, contains `min-height: 24px`); canonical listener PID 42211 still serves `127.0.0.1:7777`.
2. Once the existing browser bridge attaches again, inspect the same authenticated route sheet and measure collapsed/expanded heights at the current mobile viewport; verify long stop-name ellipsis and compare the stop-list height. Current CUA error is `browser.user is unavailable`, so source delivery is confirmed but visual status remains NOT_TESTED.
3. Do not create another preview, port, or tunnel. Do not claim a percentage reduction based on CSS alone. Continue preserving all dirty changes.
4. Latest resource sample: 17 GiB free disk, 37% free memory, 9.93 GiB swap used; Virtualization CPU was active. Avoid build/browser/E2E while host load is busy. No safely disposable cache was found; no cleanup performed. Production remains `NOT_RELEASED`.

## NEXT — authenticated route acceptance, 2026-11-11 12:30 EET

1. The current Site and Server trees are still dirty at SHAs `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` and `e9934abbd8fc973177de8d7f47548739758a1b74`; preserve them. Canonical Site PID 42211 remains on `127.0.0.1:7777`; API PID 66637 is ready but unpinned (version endpoint has null build metadata).
2. The existing authenticated zrok tab is visible in browser inventory, but CUA cannot attach (`browser.user is unavailable`) and the Codex app itself is denied for computer use. Continue source-level safe work; resume UI→API→journey checks only when the existing browser bridge is available. Do not open another port/tunnel or access credentials.
3. Resources: disk 18 GiB free, RAM free 29%, swap used ~9.1 GiB. Avoid heavy local work while memory/swap remain constrained. No safe disposable cache identified or removed; release stays `NOT_RELEASED`.

## NEXT — expanded route-sheet density, 2026-11-11 12:49 EET

1. On the existing dirty Site worktree at base HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, expanded details no longer repeat the horizontal stage ribbon above the selectable segment cards. Peek/collapsed/half keep the ribbon. Focused sheet/content-fit tests pass 17/17; scoped diff check passes.
2. Existing zrok→canonical Site `127.0.0.1:7777` visibly served the change. On the same signed-in 384×779 journey, expanded height decreased 372→328px (44px / 11.8%); three 46px stage cards, collapsed stop list and 44px CTA remain visible. Selecting A41 still focuses the map. No console errors. This is visual verification for this viewport/route only; no screenshot artifact was written to disk.
3. Do not run typecheck/build while the Virtualization process is heavily using CPU. Recheck resources before the next bounded validation; disk remains 18 GiB free and no safe disposable cache has been identified. Preserve the current session and do not restart the canonical preview or zrok.
4. Continue remaining production gates separately. Server source/build identity and approved geocoder remain unverified; production stays `NOT_RELEASED`.

## NEXT — stage-control density and first provider-backed flow, 2026-11-11 12:57 EET

1. Preserve the dirty Site tree at base HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`. Route details and active navigation now keep the stage ribbon only where the detailed cards are hidden; 18 focused tests pass and zrok serves both updated modules.
2. The 384×779 expanded Details measurement remains 328px with cards/CTA visible. The latest half-state and Active Navigation ribbon changes are source/unit verified but not browser-measured because control of the existing zrok page's page-evaluation bridge now returns `browser.user is unavailable`. Resume visual measurement on the same tab when control returns; do not open another preview/tunnel or invoke “Розпочати” without a safe, consented navigation test.
3. The authenticated journey API requires normal session auth. Continue the source→provider→route→map proof only through the current authorized browser session; current runtime API is development and reports null build identity, so do not claim the displayed A41 route is provider-proven or pin a dirty worktree.
4. Resource check: disk 17 GiB free, RAM free 32%, encrypted swap 9,908 MiB; `knowledge-agent` was ~82% CPU and WindowServer ~26%. Defer typecheck/build/browser-heavy work until host load settles. Disk <20 GiB; no safe disposable cache identified. Production remains `NOT_RELEASED`.
## NEXT — Ukraine-wide feed activation, 2026-11-11 13:07 EET

1. Preserve Server dirty worktree/HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`; the catalog is now 54 rows. Focused license-policy tests pass 2/2.
2. Do not run the 52-feed seed/probe yet: active API PID 66637 and Virtualization were high CPU, disk free 17 GiB, memory free 30%, encrypted swap ~9.96 GiB. Recheck resources first; keep to one heavy task and do not restart the active API.
3. When the resource gate clears, refresh only the canonical local/dev provider registry, then separately validate each candidate's schedule window, route/stops, source licence, country coverage, and realtime freshness. Never seed production data or treat the 2026-10-31 snapshot as current.
4. Continue Rivne discovery from the official CC-BY CSV timetable: find authorized route/stops/geometry companion resources or an owner-confirmed mapping to the current GTFS. Do not route from schedules alone or fabricate shapes. Then design/test a bounded CSV adapter only if the source supplies all required fields.
5. Resolve the 29 catalog entries with missing/ambiguous commercial terms from their actual official datasets; obtain Odesa/Bucha credentials and required partner agreements through authorized onboarding. Only then enable those feeds.
6. Current validated coverage is not nationwide; report precise city/mode coverage from a fresh run. Keep production `NOT_RELEASED` until a pinned Server runtime and route-level end-to-end evidence exist.

## NEXT — виміряти компактність активної навігаційної губи, 2026-11-11 13:13 EET

1. Коли навантаження Virtualization/Codex renderer і swap знизяться, виконати один вузький тест `tests/bottom-sheet-density.test.ts` та перевірити DOM на чинному zrok табі; записати висоту до/після і кількість видимих карток.
2. Зміна вже доставляється з Site worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` через `:7777` та наявний zrok. Не відкривати інший порт/тунель і не перезапускати preview.
3. Якщо відступ або заголовок не скоротили фактичну висоту приблизно на 20px, перевірити DOM layout і усунути лише підтверджене джерело зайвого простору; зберігати 44px touch targets та безперервний доступ до пересадок.
4. На останньому зрізі disk free 17GiB, RAM 28–34%, encrypted swap близько 10GiB, Virtualization до 55.7% CPU, Codex renderer до 372%. До покращення ресурсного стану не запускати build, повний набір тестів чи нову browser сесію. Безпечного disposable cache не визначено; нічого не видаляти.

## NEXT — browser-вимір активної губи, 2026-11-11 13:15 EET

1. Цільовий `tests/bottom-sheet-density.test.ts` пройшов 15/15; `git diff --check` пройшов. Новий видимий рядок над списком прибраний, пересадки залишені у лічильнику етапу, доступна назва списку збережена.
2. Не заявляти фактичне скорочення висоти: оцінка близько 20px із розмітки. Потрібен реальний DOM `getBoundingClientRect()` на тому самому zrok табі та viewport.
3. CUA `getTab` для існуючої zrok вкладки повернув `browser.user is unavailable`. Повторно спробувати лише коли наявний браузерний керуючий міст відновиться; не створювати нову вкладку/порт/тунель і не перезапускати `:7777`.
4. Перевірити ресурси після тесту; не починати build чи повний набір тестів, якщо Virtualization/рендерер або swap знову зростають. Disk нижче 20GiB; disposable cache наразі не визначено.
5. Після 15/15 targeted tests: диск 18GiB free, RAM 28%, encrypted swap ~9.38GiB, load 3.86/3.87/3.94; залишити важкий build/E2E відкладеним. Останній CUA виклик підтвердив той самий блокер `browser.user is unavailable`, тому не повторювати його до зміни доступності bridge.

## NEXT — національні фіди, 2026-11-11 13:42 EET

1. Зберегти Server dirty tree та інші локальні правки. Після перевірки Рівного каталог має 54 джерела. В попередньому checkpoint live endpoints Ужгорода і Кам’янського дали відповідно 51/51 та 52/52 валідних позицій; тепер додано перевірений Rivne endpoint за точним офіційним dataset ID.
2. Активний API/БД не змінювались. Після pin/build/release-процесу потрібен вузький запуск seed для трьох записів або штатне адмін-підключення та повторна перевірка з живого реєстру; не запускай повний `mobility:seed all` для цього.
3. Конотоп зараз повертає 0 GPS-позицій. Не показувати live-покриття до наступної успішної валідації.
4. Ромни GTFS-CSV непридатний через завершення календаря; Чортківський набір потребує повної перевірки та валідних координат зупинок. Потрібен CSV manifest adapter перед маршрутизацією з таких наборів; не вигадувати зупинки/геометрію.
5. Поточна реалізація — часткове підключення джерел, не покриття всієї України. Продовжити перевіряти міські та міжміські джерела за точними правами, актуальністю, схемою й ефективним використанням. Відсутні партнерські API/Odesa/Bucha credentials лишаються зовнішніми блокерами.
6. Ресурсний зріз: диск 18 GiB, RAM 33%, swap 9.59 GiB; жоден cache не видалявся, бо безпечний кандидат не знайдено. Не робити build/повний feed sweep; production лишається `NOT_RELEASED`.
7. У Server environment немає налаштованого `DATABASE_URL`/`PGHOST`/`PGDATABASE`, тому не виконано навіть адресне upsert-підключення до runtime provider registry. Для фактичної активації потрібне штатно налаштоване dev/staging DB та pinned сервер; секрети й адмін-сесію не обходити.
8. Додано scope `npm run mobility:seed -- --verified-live`: він тепер обмежений трьома точними source IDs (Ужгород, Кам’янське, Рівне JSON), тож після налаштування dev/staging DB його можна виконати без повного seed/probe всього каталогу. Не запускати до підтвердження адреси DB; після штатного upsert перевірити provider rows і живий planner/map через штатний auth.
9. Рівненський GPS-набір — `https://data.gov.ua/dataset/a41488fb-bf97-4f12-8ee3-87817a4c50bd`; live JSON check: 155 позицій в Україні та 2 поза країною відкинуто. Старий dataset ID в каталозі був неправильним і виправлений. Рівненський Dozor GTFS залишити без ліцензії, поки права не підтверджені саме для цього ZIP.

## NEXT — validated national feed expansion, 2026-11-11

1. Zhmerinka's official CC BY dataset has a legacy CKAN ID alias; the guarded component-CSV adapter now verifies exact package-name/ID correspondence and same-host HTTPS resource URLs. Focused tests pass 11/11.
2. A live read-only GTFS health check found the current Zhmerinka tables unusable: 996/996 stop coordinates invalid, timezone absent, and no active service in the next seven days. Do not seed/enable it or count it as routing coverage. Request corrected coordinates/calendar/timezone from the publisher or find a different licensed source.
3. The component-CSV adapter is now wired through validator, planner timetable cache, and route network. Its behavior is only feed-tested against this invalid candidate; a healthy CSV feed and actual route-search proof are still required.
4. Continue nationwide discovery against exact official records; prioritize current complete schedules with coordinates, active calendars, explicit reuse terms, and public HTTPS. For locked Odesa/Bucha feeds and partner-only intercity APIs, use authorized onboarding rather than scraping or auth bypass.
5. Do not seed until the exact local dev/staging target is confirmed for this new candidate and its feed health is healthy. No production write or release action.
6. Latest resources: disk 18 GiB free, RAM 35% free, encrypted swap 9.11 GiB; Virtualization briefly 17.6% CPU. No safe disposable cache found, no cleanup performed. Keep heavy work bounded and sequential.
7. Official Kyiv CC BY schedule dataset (metadata updated 2026-10-26) lists GTFS and metro/funicular/city-express API resources. The GTFS export is HTTP-only and its advertised ArcGIS `gisserver-stage.kyivcity.gov.ua` host failed DNS lookup. Treat as blocked, not connected; seek a reachable HTTPS producer endpoint through official onboarding.

## NEXT — national feed registry correctness, 2026-11-11

1. Live JSON and GTFS-RT ingestion now apply the provider country boundary; the connection validator reports foreign positions and degrades a UA JSON source when more than 5% of entries are outside Ukraine. `--verified-live` now disables a source unless its latest probe is healthy. Six focused feed/license test files passed (exit 0).
2. Current live probes: Uzhhorod 51/51 fresh and inside Ukraine, but 2 vehicles are far outside the city cluster (within Ukraine), so city service-area filtering still needs authoritative polygons. Rivne 155/157 fresh in Ukraine, 2 out-of-country points excluded. Kamianske is currently degraded: 46/51 in Ukraine, 5 foreign points, and its timestamps are 42 seconds ahead (beyond the accepted skew); strict seed will keep it disabled.
3. Existing local server shell has no configured DATABASE_URL/PGHOST/PGDATABASE. Do not seed any registry until a clearly configured dev/staging DB is available. Keep only the targeted three-source verified-live scope; do not use `all`.
4. Continue source discovery/rights checks beyond these municipal live feeds. 54 catalog rows across 21 city labels still do not constitute nationwide routing: several are stale, credentialed, partner-only, unknown-license, or data-only/no schedule sources.
5. Latest resource sample: disk 18 GiB free, RAM 32%, encrypted swap 9.30 GiB; Virtualization reached ~66% CPU. No cleanup candidate was deleted; no further heavy work was started. Production remains NOT_RELEASED.
## CURRENT RESUME — nationwide bus registry found but not safe to route, 2026-11-11 17:04 EET

1. Preserve dirty Server checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`.
2. Official Ukrtransbezpeka API is reachable and CC BY, but the bounded live sample exposed an expired permit behind `active=1`, swapped-looking waypoint coordinates, and two-week calendar flags. It is **DISCOVERED / NOT ROUTABLE**; do not add/seed it until complete bounded validation and a dedicated parser safely handles those facts. Evidence: `MarshGO-Server/docs/UKRAINE_TRANSIT_FEED_COVERAGE_2026-11-11.md`.
3. The previous exact local-dev feed sync remains the only verified local registry update. Do not run `mobility:seed all`, change production data, or claim nationwide coverage. No code/data writes in this checkpoint.
4. Resources: 18 GiB free disk, 31% free RAM, ~9.26 GiB encrypted swap; Docker Desktop helper high CPU. Defer GTFS parsing/build/browser and wait for load to ease. No safe cache candidate; no cleanup.
5. Next: resume one official candidate at a time. First review the national registry payload only when resource load permits, then implement/test its validity/coordinate/calendar policy before any activation. In parallel only do light catalog metadata research. Production remains NOT_RELEASED.

## NEXT — national feed connection follow-up, 2026-11-11

1. The current round rejected Romny, Fastiv and Gaisyn as incomplete/invalid; exact evidence is in `MarshGO-Server/docs/UKRAINE_TRANSIT_FEED_COVERAGE_2026-11-11.md`. Do not add them to routable coverage without corrected publisher data.
2. Odesa (87 routes) and Bucha (4 routes) are strong official feed candidates but require provider registration and HTTP-header credentials; Odesa licensing points to municipal open-data terms, while Bucha commercial reuse is unverified. Continue only through the publishers' authorized onboarding process; never bypass authentication.
3. After obtaining authorized source access, validate static schedule health and license/attribution, add exact provenance, add an isolated seed scope, run focused tests, seed only confirmed local dev, and prove route search before claiming connected coverage.
4. Preserve current dirty worktrees and leave production NOT_RELEASED. Do not run the broad seed, restart API/Site, or launch a heavy local task while Docker Desktop helper is CPU-bound without a fresh resource check.

## NEXT — route-sheet compactness verification, 2026-11-11

1. Current canonical Site is the existing dirty worktree `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site` on `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`, served by existing port 7777 and zrok. Keep all dirty changes; do not restart it or open another preview.
2. Focused density/content-fit/active-navigation tests pass 29/29. Expanded active navigation now fits measured content to avoid excess blank sheet area; walking-geometry warning now occupies one compact accessible row in both modes. Existing touch targets stay 44px.
3. Focused tests pass 29/29 and `npm run typecheck -- --pretty false` passes. Next reload the already-open zrok journey and measure the same viewport in route details and active navigation. The browser bridge currently fails with `browser.user is unavailable`; until it recovers, rendered size and visual acceptance remain NOT_TESTED. Do not treat transformed-module HTTP 200 as visual proof.
4. Latest resource checkpoint: `/` 16 GiB free, RAM 44%, encrypted swap 10.0 GiB. Disk <20 GiB; no safe unused generated cache was found, no cleanup. Production remains NOT_RELEASED.


## 2026-11-11 18:25 EET — MarshGO2 unified source import uploaded

- Published an additive snapshot of the six canonical repositories to `dima1203oleg/MarshGO2`, branch `codex/unified-marshgo-import-2026-11-11`, commit `fcdbbd71d5b90b9d519bbca17b6add123ec33dc2`. Remote `main` remains exactly `8542f4b5bd90512d8e22974bcdb9b1184c700821`; no merge or deployment.
- Snapshot path: `MARSHGO_UNIFIED/`; 1,567 files / ~50 MiB across MarshGO, Server, active Site worktree, iOS, Admin, and Partner. Exact source SHAs and dirty path counts are recorded in `MARSHGO_UNIFIED/SOURCE_MANIFEST.json`. Existing MarshGO2 prototype remains intact at repository root.
- The active 7777 Site Qoder worktree is the primary Site snapshot. The overlapping dirty Antigravity Site worktree is preserved as patches and eligible untracked files in `integration/site-antigravity-overlay/`, intentionally unapplied pending conflict reconciliation.
- Public-snapshot scan: zero checked credential-token/private-key patterns; no `.env` files other than `.env.example`; zrok/audit/session screenshot artifacts omitted. A local hook containing a private-key test marker was excluded. Root operational progress logs and local caches/build outputs were not copied.
- Checks: branch ancestry/base SHA confirmed; source manifest/path count checked; secret-pattern scan clean. `git diff --check` reports pre-existing trailing whitespace in imported source/docs, so no mass reformat was applied. No application build, automated suite, browser test, or compatibility merge was run. Production remains `NOT_RELEASED`.
- Resource before/after: disk 16 GiB free → 16 GiB; system free memory 31% → 39%; encrypted swap 10,173 MiB → 10,238 MiB; load average 3.52 → 3.07. Existing Vite 7777/API/database processes were left untouched. Known `node_modules`, `dist`, `.e2e-dist`, and `.release` content was not deleted; no safe cache cleanup was needed for the ~50 MiB snapshot.


### MarshGO2 import — next integration steps

1. Review/reconcile `MARSHGO_UNIFIED/integration/site-antigravity-overlay/` against the active Site snapshot; apply changes only after resolving overlapping files and running the focused Site checks.
2. Define and verify per-product build/test entry points inside the consolidated tree; the import currently preserves each product independently and has not been wired into one root build.
3. Run the bounded source checks and relevant product CI when resource gates allow. Keep `MarshGO2/main` unchanged until the integrated tree passes review; current branch is a source-import candidate, not a production release.


## 2026-11-11 18:33 EET — authenticated real-route gate revalidated

- Current runtime mapping: existing Site PID 42211 serves `127.0.0.1:7777` from `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`; existing API PID 64943 listens on `127.0.0.1:3002`, working directory `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`. Both processes were left running. Site root and `/api/v1/health` return HTTP 200.
- Read-only live API: `/api/v1/places/suggest` for `Сихів, Львів` returned five geocoder suggestions; top result coordinates were `[24.057585, 49.794117]`. Lviv `/api/v1/mobility/providers` reports route-backed GTFS tiles for bus and tram from ЛьвівАвтодор, and train/suburban from УЗ. This is tile/source evidence only, not proof an itinerary was found. Static bike estimates have no live inventory/booking claim.
- Planner access check: unauthenticated `POST /api/v1/journeys/search` is guarded and returns HTTP 401. This is expected access control; no credentials, browser cookies, or auth bypass were used. `MARSHGO_E2E_EMAIL` and `MARSHGO_E2E_PASSWORD` are unset. The existing in-app zrok tabs are present, but CUA snapshot still fails with `browser.user is unavailable`; signed-in route search and visual acceptance remain unverified.
- Exact current Server HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`: `node --import tsx --test tests/journey-search.test.ts` passed 4/4 (0.184 s); `node --import tsx --test tests/journey-planner.test.ts` passed 8/8 (0.141 s). These are unit/fixture checks, not live itinerary evidence. No source or database changes.
- Resources before → after bounded checks: disk 16 → 17 GiB free; memory 31% → 39% free; encrypted swap 10,676 → 9,620 MiB; load average 3.76 → 3.17. Existing 7777/API services and Docker were not restarted. Disk is below the 20 GiB green threshold; cache inventory found only 176 KiB npm cache, while project build/dependency/evidence caches may be active, so nothing was removed.
- Gate result: provider tiles and geocoding are locally verified; real authenticated planner itinerary → selected route geometry/stops → GPS navigation is still NOT_VERIFIED. Immediate blocker is lack of working authenticated browser control in this session, not an API auth defect. Next action: resume the existing signed-in zrok tab when CUA is available and run the saved actual-route flow; otherwise continue independent Server/contract work without treating fixtures as live evidence.


## 2026-11-11 18:37 EET — removed synthetic GPS from user-flow smoke

- Found and removed the smoke harness's hard-coded Kyiv geolocation plus automatic permission grant. A simulated fix must not be counted as real GPS navigation. Existing 7777/API services and all source worktrees remain untouched.
- Validation: `node --check scripts/run-complete-user-flow.mjs` passed; scoped `git diff --check -- scripts/run-complete-user-flow.mjs` passed. The full browser smoke was not run: its authenticated credentials are unset, CUA cannot control the existing zrok tab, and a headless run would not prove real device GPS.
- Current resources: 17 GiB disk free, 37% memory free, encrypted swap 9,365 MiB. Docker Desktop renderer was ~20% CPU; no heavy build/browser/test launched. Cache review still finds only a 176 KiB npm cache as clearly disposable; left caches and Docker state untouched.
- Acceptance impact: browser fixture GPS can no longer produce a false navigation pass. Live user-permission/GPS navigation remains NOT_VERIFIED; release remains NOT_RELEASED.

## CURRENT RESUME — MarshGO2 monorepo snapshot, 2026-11-11 18:51 EET

1. Integration branch `codex/consolidate-canonical-repos` exists in `/Users/dima1203/Desktop/Робота/MarshGO2`, based on `8542f4b5bd90512d8e22974bcdb9b1184c700821`. The six current source snapshots are under `apps/` and selected coordination material under `orchestration/`; see target `MONOREPO_INTEGRATION.md` for exact source SHAs and excluded artifacts.
2. Preserve all existing MarshGO2 unstaged edits and the six original repositories. Do not stage target prototype edits, import `.release` archives, or rewrite branch history.
3. No build/test/browser validation or push has occurred. Host is resource-constrained (17 GiB free disk, 35% free RAM, 9.54 GiB encrypted swap, Docker renderer ~119% CPU); defer heavy checks and git pack/push until load drops.
4. Next: inspect the exact index after staging only `apps/` (respecting ignored `apps/server/.release/`), `orchestration/`, `.gitignore`, and `MONOREPO_INTEGRATION.md`; then validate workspace integration and push this branch only when resource gates permit. Production remains NOT_RELEASED.

## CURRENT RESUME — MarshGO2 snapshot pushed, 2026-11-11 18:53 EET

1. `codex/consolidate-canonical-repos` is pushed to MarshGO2 at `78b86023c2bb82c39b7ca6a70673a0bbfa1a51fa`; remote SHA was verified. Review branch: https://github.com/dima1203oleg/MarshGO2/tree/codex/consolidate-canonical-repos.
2. Source snapshots are in `apps/{site,server,ios,admin,partner}` and `orchestration/`. See `MONOREPO_INTEGRATION.md` for source pins, captured dirty state, and exclusions. Existing MarshGO2 edits remain unstaged and uncommitted.
3. This is not yet a runnable unified workspace: root workspace/build/test commands and cross-app wiring remain. No build, test, browser check, or production deployment was run. Production remains NOT_RELEASED.
4. Defer heavy checks while Virtualization/Docker load is elevated. Latest resources: disk 17 GiB free, RAM free 34%, swap 9.53 GiB; no cleanup performed.
