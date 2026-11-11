# Dirty-worktree full E2E, integration and browser matrix — 2026-10-26

## Scope and exact inputs

- Orchestrator checkout: `/Users/dima1203/Desktop/MarshGO`, branch `codex/production-finalization-20261014`, HEAD `febd5008fbf7bba058b0e1bf2bfab647a0c735c5` before this checkpoint; working tree already contained extensive user/ongoing changes. No broad staging, commit, reset, cleanup or deployment was performed.
- Browser source was the current dirty root Site bundle. The E2E release materializer logged Server `a403a51a203d9d89685c10c69658c8fd95b70e9b` and manifest Site SHA `6961afcf008e2c845c0fde68c687ce61fe744f2f`; the current dirty Site bundle is not represented by that Site SHA.
- Local database: loopback PostgreSQL `marshgo_e2e_search_20261026`; local Redis `127.0.0.1:6380`; browser map/geocoder/routing use deterministic E2E fixtures. Live transport providers, staging and production were not queried.
- Root release manifest / six-repository exact tuple was not promoted or changed. The tested Server snapshot is a candidate, not a deployed API.

## Evidence

- Full functional Playwright suite: **25/25 PASS**, one worker, 8.5 minutes. Includes 178-control click audit (0 without visible effect), responsive sign-in/home/search, route map and segment focus, all 12 transport modes, two-account search/booking/reverse-marketplace negotiation, chat persistence and block/unblock, boarding/lifecycle/reviews, navigation GPS behavior and rendezvous consent/revocation.
- Cross-browser compatibility and map matrix: **6/6 PASS** across Chromium, Firefox and WebKit (responsive sign-in/home/search and canonical route-map/sheet/focus/light-dark scenario for each browser; 3.8 minutes). Used current dirty root Site rebuilt with the isolated map-fixture manifest.
- Server integration workflow: **30/30 PASS**: Journey/PostGIS schema (2), API bookings/trip editing (23), foreground navigation (2), cross-instance Redis realtime (1), process-restart durability (1), shared Redis rate limit (1). One transient realtime outbox retry was recovered and the test passed.
- `npm run check:production`: PASS. TypeScript, full ESLint, production Vite build, gzip chunk budget passed; unit tests **256 PASS / 0 FAIL / 1 opt-in DB test SKIP**. SKIP is not counted as PASS.
- `git diff --check`: PASS. Focused lint on changed Site/E2E files: PASS.

## Corrections made while running the suite

- Updated the long marketplace E2E to follow the current trips overview → “Інші розділи поїздок” → “Запити пасажирів” flow and the saved “Заплановані” overview filter.
- The account safety controls are reached through Profile → “Безпека та приватність”; the E2E now traverses this actual UI before checking block/unblock and deletion-request flows.
- Updated the account deletion expectation to the UI’s real “Очікування до …” copy. These were test synchronization/selector corrections; assertions on server booking, reviews, conversation persistence, block state, export and deletion request remain active.
- A first compatibility attempt was rejected before running tests because a prior production build had replaced `dist` with a non-fixture map manifest. Rebuilt the same source with the E2E fixture manifest; the subsequent 6/6 run passed.

## Visual and release limits

- E2E fixture tiles are not licensed production map imagery. The six supplied navigation/route screens were functionally exercised, but there was no approved pixel-by-pixel comparison against the ten user mockups in this run. Visual parity remains OPEN.
- Admin/Partner authenticated tenant workflows were not part of these 25 Site E2E cases. Physical iPhone/Safari, production/live-provider probes, staging, security review, load (1,000 RPS/WS), backup/restore, rollback and deployed-SHA smoke remain NOT_TESTED or BLOCKED_EXTERNAL as recorded in the acceptance matrix.
- The source worktree remains dirty, so these results do not identify a new committed Site SHA or production artifact. No commit/push/merge/deploy was made.

## Status

- Local current-source Web functional gate: PASS for the enumerated tests above.
- Local Server integration gate: PASS for the enumerated isolated suites above.
- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
- Next: inspect the supplied design references state by state; run the remaining available Admin/Partner, iOS simulator, security and provider gates on coherent immutable candidates; continue the routing completeness/truncation issue. Do not deploy without the separately required owner approval.

## Additional canonical Site and iOS simulator checks

- Canonical Site checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`, HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`, is itself dirty. `npm audit fix --package-lock-only` changed only its previously clean lockfile (the package manifest was unchanged), resolved Zod to 4.6.7 and reported 0 vulnerabilities in the full dependency tree. Its exact dependency tuple was then checked with Node 24.21.0: typecheck PASS, lint PASS, 99/99 unit tests PASS, build PASS, bundle budget PASS. The lockfile diff includes other within-range lock refreshes; it remains uncommitted and needs review before release.
- iOS checkout `MarshGO-iOS`, branch `codex/production-site-sync-20261014`, HEAD `4353cec3cacbaf662ceea047402f361024292b22` (clean at start). Its embedded `web` Site checkout is `02e97d63c050ae87b0d9fa6c698c97a0b5fdfb5f` with pre-existing modifications in `src/services/productionApi.ts` and `src/views/JourneyResultsPanel.tsx`. We preserved those changes and built that checkout, without changing its source SHA.
- Local API used only the isolated loopback E2E database, on port 3322; it was stopped after the simulator run. Xcode simulator build/install/launch and first-screen capture PASS on iPhone 15 Pro Max and iPhone 16 Pro Max. Screenshots: `/tmp/marshgo-iphone15-current-2026-10-26.png` and `/tmp/marshgo-iphone16-current-2026-10-26.png`.
- During `npm ci` of the embedded iOS Site checkout npm reported 7 high findings; `npm audit --omit=dev` confirmed 5 high production findings in its old Firebase/Firestore → `@grpc/grpc-js` chain and Zod. This is not the canonical Site source at `6961afcf…`; do not silently replace the embedded dirty checkout. It is an iOS exact-Site alignment and dependency-remediation blocker.
- Simulator screenshots show only the initial welcome/entry screen. No native OTP entry, authenticated booking, GPS permission/background tracking, route-map provider tiles, push, camera or device-specific gesture acceptance occurred. No physical iPhone was tested.

## Canonical Server dependency and integration recheck

- Canonical `MarshGO-Server` branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, was already dirty across source/tests; its `package-lock.json` was clean before this work. `npm audit fix --package-lock-only` changed only 12 lockfile lines and resolved body-parser, markdown-it, Zod and ip-address findings. Full npm audit now reports 0 vulnerabilities. Existing modified `package.json` only had a test script addition; no package manifest change was made by the audit fix.
- After Node 24.21.0 `npm ci`: typecheck PASS, ESLint PASS, **233 unit PASS / 0 FAIL / 1 opt-in DB SKIP**. The skipped booking DB unit is not counted as pass.
- Canonical Server isolated integration suite against new loopback DB `marshgo_e2e_server_20261026` and Redis `127.0.0.1:6380`: **29/29 PASS**, including clean migration apply through `054_rendezvous_participant_consent.sql`, Journey/PostGIS, live-journey disabled-source response, booking concurrency, trip edits/cancel, GPS, rendezvous consent, Redis realtime across API instances, restart durability and shared rate limits. One recoverable outbox retry appeared in the realtime logs. The test script stopped its temporary API/OSRM processes; checked ports 3302–3322 were clear afterwards.
- `git diff --check` passes in root, canonical Server and Site. Server lock diff is 12 lines; Site lock diff is 186 changed lines and still needs review. No source branches or commits were created; both canonical component checkouts remain dirty.
- Separate security result: release materialized Server candidate `a403a51a203d9d89685c10c69658c8fd95b70e9b` and root orchestrator production dependency audits both report 0 vulnerabilities. The separate stale embedded iOS Site SHA still reports 5 high production findings, as described above.

## Admin/Partner portal checks and release tuple integrity

- Materialized Admin candidate `.release/admin-f39c4b74839a393f4487c830930669eabc8c0390`: Node 24.21.0 typecheck, ESLint, production build and 4/4 unit tests PASS; `npm audit --omit=dev` reports 0 vulnerabilities. Materialized Partner candidate `.release/partner-97a3727cc395dea092af6e3e24d6822370c2bc63`: same checks PASS, 3/3 unit tests, production dependency audit 0. These snapshots contain pre-existing untracked deployment files; they were not changed. This is build/unit evidence only, not authenticated browser or tenant-isolation acceptance.
- Release manifest pins iOS `be5478bed577b91a89035fe6785ab938f0335799`, dated 2026-10-25, while the current iOS checkout is `4353cec3cacbaf662ceea047402f361024292b22`, dated 2026-10-15. The manifest commit exists in the object database and is ahead of the checkout; the locally built simulator therefore does not prove the manifest iOS SHA. That exact manifest commit changes only CI workflow/README, but it still needs exact-tuple CI/build evidence when reconciled with the candidate inputs.
- Resulting iOS gate: manifest-pinned hosted Simulator CI is recorded historically as passing (runs 40225191341/40225194358) for Site `6961afcf…` and Server `a403a51a…`; local simulator evidence is from the different `4353cec…` checkout and dirty embedded Site `02e97d…`. Keep this distinction explicit. The embedded Site production dependency audit has 5 high findings; its dependency tree must be replaced with or reconciled to the canonical reviewed Site before an iOS release artifact is built.
- The root `RELEASE_MANIFEST.json` remains review-only and `NOT_RELEASED`; no manifest promotion, branch operation or deployment was performed.
