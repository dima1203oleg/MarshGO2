# MARSHGO — candidate release manifest

**Status: NOT_RELEASED.** This document identifies exact integration candidates for reproducible review. It is not evidence of a staging or production deployment.

**Current review pin refresh — 2026-10-21 20:41 UTC:** Server PR #24 is now `27ca486d66fa9b30b8559e4b1041ccca67f1d283`; hosted exact-head checks `39672268416` and `39672277029` passed (audit, lint, typecheck, unit tests, migration, Postgres/PostGIS and Redis). Site remains `c50ba344b7dfde9859826363fea119d95e2cc54e`; iOS remains `7df237845d8841a98a5c15082677ec4198728339` and pins that Site SHA. All PRs remain open/draft. Dense Lviv routing is still partial/truncated; staging, live-provider acceptance, physical iPhone, backup/restore, rollback rehearsal, deployment and HTTPS smoke remain unverified. No release was made.

| Component | Repository | Candidate branch | Exact SHA | Review |
|---|---|---|---|---|
| Server | `MarshGO-Server` | `codex/gtfs-route-oracle-20261021` | `27ca486d66fa9b30b8559e4b1041ccca67f1d283` | [PR #24](https://github.com/dima1203oleg/MarshGO-Server/pull/24), open/draft; exact-head CI `39672268416`/`39672277029` passed |
| Site | `MarshGO-Site` | `codex/site-vite-security-20261021` | `c50ba344b7dfde9859826363fea119d95e2cc54e` | [PR #14](https://github.com/dima1203oleg/MarshGO-Site/pull/14), open/draft; exact-head checks passed as recorded in the JSON manifest |
| iOS | `MarshGO-iOS` | `codex/reliable-capacitor-sync` | `7df237845d8841a98a5c15082677ec4198728339` | [PR #9](https://github.com/dima1203oleg/MarshGO-iOS/pull/9), open/draft; pins the exact Site SHA; simulator CI passed |
| Admin | `MarshGO-Admin` | `codex/p0-admin` | `9dbf7db0a935498ac40c98b19bc36bce056d630d` | [PR #1](https://github.com/dima1203oleg/MarshGO-Admin/pull/1), open; checks/local basic validation passed |
| Partner | `MarshGO-Partner` | `codex/p0-partner` | `c639257a7f28aeda5b378a816038b01651146b83` | [PR #1](https://github.com/dima1203oleg/MarshGO-Partner/pull/1), open; checks/local basic validation passed |
| Deployment orchestration | `MarshGO` | `codex/production-finalization-20261014` working checkout | `f944560a3babf7423befc53741217d9281f44dab` | Checkout is dirty; do not treat this source SHA as a releasable clean integration commit |

**Current candidate update — 2026-10-19 16:25 UTC:** The pins above supersede the older Server/Site/iOS SHAs in the historical evidence paragraphs below. `node ops/scripts/materialize-release.mjs` now verified the exact Server/Site/Admin/Partner source set and generated build-input/Compose hashes; this is not an image build. Server exact-head CI is queued; Site and iOS exact-head CI are green. Disk free is about 1.2 GiB, so Docker images were not built. Manifest status remains `NOT_RELEASED`; no staging or production deployment is evidenced.

## Contracts and schema

- API contract label used by the local bundle: `v1`.
- Database migration head in the Server candidate: `055_provider_commercial_use` (upgrade and rollback rehearsal still required).
- iOS bundles the exact Site SHA above and records the Server SHA/API/migration metadata in the generated release manifest.
- The current iOS Simulator build used the reserved invalid API origin `https://api.marshgo.invalid`; it is compile/UI-start evidence only and cannot test API, authentication or booking. No verified staging API origin was found. Do not ship this local build configuration.

## Evidence

- Server candidate: exact SHA `d249df1aff79b33344ee161cca5cfca47dd87691`; 237 unit tests passed, 0 failed, 3 optional integration tests skipped; focused GBFS suite 13/13, including Ukraine boundary regressions; TypeScript and lint passed; guarded local Postgres/PostGIS/Redis integration passed 30/30; exact-head GitHub checks `39252440448` and `39252449566` passed. The bounded Lviv route graph can still report partial/truncated results. UA point filtering uses Natural Earth 1:10m Ukraine-view cartographic geometry, not a legal boundary or provider-rights proof; commercial rights/staging remain unverified.
- Site candidate: exact SHA `d17360f01e05fa3c878587b8f149746e57ba36f8`; prior candidate evidence records 118 unit tests, TypeScript, lint, production build and bundle budget passed, focused rendezvous browser E2E 2/2 with fixture-intercepted booking/rendezvous endpoints, and exact-head CI 3/3 passed. Full two-account browser/API acceptance remains open. The earlier 12% pixel difference against a stored light-results baseline remains unresolved; the baseline was not replaced.
- iOS candidate: exact iOS SHA `51baa960579c77f22c2b61691a428f9f1a952e02` pins Site SHA `d17360f01e05fa3c878587b8f149746e57ba36f8`. Prior evidence records Site build, Capacitor sync, unsigned Xcode Simulator build/launch and hosted Simulator CI `39235862143` passed. Interactive sign-in/booking against staging, physical iPhone, GPS background behavior and push are not tested. The local build used reserved invalid API origin `https://api.marshgo.invalid` and is not a deployable configuration.
- Latest Server follow-up `d249df1aff79b33344ee161cca5cfca47dd87691` replaces the coarse UA GBFS envelope with point-in-polygon filtering using only the Ukraine feature from Natural Earth 1:10m v5.1.2 Ukraine-view data. Focused GBFS 13/13, full Server unit 237 passed/0 failed/3 optional skips, typecheck/lint and local isolated Postgres/PostGIS+Redis integration 30/30 passed. Exact-head hosted CI `39252440448` and `39252449566` passed. This is cartographic country scoping, not legal-boundary or commercial-rights evidence; staging remains unverified.
- Admin/Partner candidates: Admin `9dbf7db0…` and Partner `c639257a…`; local P0 suites 2/2 and 3/3, respectively, plus typecheck/lint/build. On 2026-10-19 the exact local Server candidate served an OTP-authenticated loopback API flow: Partner submitted an application, Admin read and approved it, and Partner read back the persisted approval and restricted permissions. This is API-level local acceptance only; a browser-driven portal flow and staging acceptance remain open.
- Release orchestration now includes exact Admin/Partner pins and generated production containers. All four images (Server `0c873ade…`, Site `09871e6…`, Admin `9dbf7db0…`, Partner `c639257a…`) built successfully in a separate temp release directory. Admin/Partner container smoke returned HTTP 200 and correctly proxied a mock unauthenticated refresh (401); Caddy and Compose config validated. This confirms deployment wiring only. `RELEASE_MANIFEST.json` pins all five repositories and remains `NOT_RELEASED`; its `integration_sha` identifies orchestration commit `fb06856c…`. There is no stable staging environment.
- Hosted CI on MarshGO head `76bac636…`: CodeQL and Gitleaks passed; verify passed typecheck/lint/unit/integration/build/bundle, then failed at private Admin clone because the repository has no cross-repository read secret. CI now fails clearly unless `MARSHGO_REPOS_READ_TOKEN` is configured with read-only Contents on Admin/Partner; the secret is not present yet.
- Latest verified exact-head checks: Server `d249df1…` checks `39252440448` and `39252449566` passed; Site `d17360f…` 3/3; iOS `51baa96…` Simulator CI passed; Admin 1/1 and Partner 1/1 in previously recorded candidate checks. PRs are open and unmerged; successful candidate checks alone do not establish a released integration. Site/iOS acceptance remains partial or untested as described above.

- Latest source materialization: `node ops/scripts/materialize-release.mjs` verified exact clean source trees for Server `d249df1aff79b33344ee161cca5cfca47dd87691`, Site `d17360f01e05fa3c878587b8f149746e57ba36f8`, Admin `9dbf7db0a935498ac40c98b19bc36bce056d630d`, and Partner `c639257a7f28aeda5b378a816038b01651146b83`; generated Docker inputs and Compose digest are recorded in `.release/materialized.json`. No current images were built.

## Environment and deployment

- Test environment: isolated local Postgres/Redis and deterministic local fixtures. This is not staging and does not prove live-provider behavior.
- Current GitHub deployment inventory returned no deployment records for Server, Site, iOS, Admin or Partner on 2026-10-19. This is not evidence that an independently managed host does not exist; no deploy target/deployed SHA could be verified here.
- Verified staging origin/deployed SHA: none.
- Verified production origin/deployed SHA: none.
- Backup/restore drill, deployment rollback, production HTTPS smoke and actual deployed-SHA comparison: not run.
- Commercial provider coverage and contractual access: not proven by these candidate checks.

**Release decision:** NOT_RELEASED. Do not infer production readiness from successful CI, local builds, or fixture-based E2E. Required next gates are visual acceptance, exact integrated Admin/Partner and iOS review, a reachable isolated staging origin, live feed/provider acceptance, backup/restore and rollback rehearsal, physical iPhone acceptance, and an owner-approved deployment.


## Latest exact-SHA checkpoint — 2026-10-19

- The exact pins in the table and `RELEASE_MANIFEST.json` supersede older historical checkpoints below. Server/Site/iOS source PRs are still open and unmerged; their dependency bases are not yet a single integrated release commit. The release remains `NOT_RELEASED`.
- `ops/scripts/materialize-release.mjs` successfully checked out Server `09e4b75…` and Site `d17360f…`, verified their canonical origins and exact HEADs, and generated the pinned Docker build inputs. This did not build images or deploy them. Admin/Partner source SHAs remain pinned as in the table.
- iOS commit `51baa96…` pins Site `d17360f…`. Node 24.19 local Site production bundle, Capacitor sync, unsigned Xcode Simulator compile, install and launch passed. The first screenshot at roughly two seconds showed WebView startup white; a later screenshot after resources loaded showed the welcome UI. This delayed render is not counted as an error after the later render, but the iOS readiness review should retain a startup-render timing check.
- Hosted iOS check `39235862143` passed its exact-SHA Site checkout, bundled build/Capacitor sync and Simulator compile. The unsigned Release archive step is skipped in that workflow. No physical iPhone, sign-in, API, booking, GPS permission/background, push, staging or production acceptance has passed.
- Current candidate versions at this checkpoint (updated by the boundary-filter continuation below): Server `d249df1aff79b33344ee161cca5cfca47dd87691`; Site `d17360f01e05fa3c878587b8f149746e57ba36f8`; iOS `51baa960579c77f22c2b61691a428f9f1a952e02`; API `v1`; migration `055_provider_commercial_use`. Server local focused GBFS 13/13, unit 237/0/3 skipped, typecheck/lint, isolated integration 30/30 passed; exact-head CI `39252440448` and `39252449566` passed. Searches still expose bounded truncation. No staging or production deploy is verified.


### Server route-stop selection follow-up — 2026-10-19

- Server PR #10 now contains commit `09e4b75bf5111b0071c0873212ae8a615c85d694`. Nearby-stop sampling counts GTFS patterns by route ID, direction ID and headsign, so nearby stops from one direction no longer crowd out the reverse direction simply because they share `route_id`. A regression test proves a 21st-ranked reverse-direction stop is retained and the small search is not marked truncated.
- Targeted GTFS suite 37/37; full Server unit suite 234 passed, 0 failed, 3 opt-in skips; typecheck, lint and `git diff --check` pass. Loopback PostGIS/Redis integration suite 30/30 passes. Exact-head hosted Server CI `39236981994` is queued; wait for terminal result before calling it hosted PASS.
- Repeated the same live Lviv GTFS query against this commit. It generated 345 candidates, returned 100, and reached the 1,000,000-step limit in about 1.8 seconds; `candidateGenerationTruncated` remains true. Therefore this fix closes a narrow route-direction omission but does not solve the global candidate-coverage problem or prove a globally optimal route.

### Server graph-search dead-end pruning — 2026-10-19

- Server PR #10 head is now `9d93eae7c281c31e6e83ee70c2bdb34880e2764a`. Cached each equivalent next-leg view after filtering out segments whose destination cannot reach the requested destination with the remaining leg budget. Transfer time, transfer feasibility, stop/route rules, itinerary construction, and ranking were unchanged.
- Against the same current Lviv static GTFS feed and same origin/destination/time query, the planner dropped from 1,000,000 search steps and 345 candidate results to 158,938 search steps and 800 candidate results, returning 100. Planner stage elapsed about 1.86 s. This is stronger candidate coverage and clears the global step-budget cutoff for this sample, but overall search still reports partial/truncated due to bounded stop selection and candidate sampling. It does not prove globally exhaustive or optimal results.
- Validation on this code: GTFS tests 37/37; full unit suite 234 passed, 0 failed, 3 opt-in skips; typecheck and lint pass; isolated Postgres/PostGIS + Redis integration 30/30 pass; `git diff --check` pass. Exact-head GitHub CI runs `39237426338` and `39237433861` both PASS. Live probe peak RSS measured about 687 MB including feed parsing and candidate graph construction; profile memory before broadening deployment load.
- **Next action:** capture exact-SHA hosted CI terminal result; profile memory and candidate-cap reasons; then improve coverage at stop-selection and route-chain sampling without hiding truncation or arbitrarily relaxing caps. Keep release `NOT_RELEASED`.

### Server bounded candidate-pool expansion — 2026-10-19

- Current Server PR #10 head `a530561001e6faa4b43928b788bad55e8be7c449` sets the per-leg candidate sampling ceiling to the already configured maximum of 500, instead of scaling it down to 200 for production's `limit:100` request. This gives later multi-objective and cross-provider ranking a broader input set while retaining a fixed upper bound and explicit truncation flags.
- On the same Lviv static GTFS query, this candidate produced 1,708 candidates, 100 returned, and planner time around 2.99 seconds; the preceding 200-cap candidate produced 800 candidates in around 1.86 seconds. Search remains `partial`; this is a coverage/performance trade-off, not proof of exhaustive search. Measured peak RSS was about 639 MB for the full probe process, so per-request memory and concurrency still need profiling.
- Current exact-head CI runs `39237939719` and `39237947701` both PASS. On this exact candidate, local GTFS 37/37, unit 234 passed/0 failed/3 opt-in skips, typecheck and lint pass, and the isolated Postgres/PostGIS+Redis integration suite was rerun 30/30. Re-run integration if a later change alters search semantics.
- **Next action:** profile memory and cap behavior under concurrent isolated queries, then improve remaining stop/candidate truncation. Do not hide the partial result state.

### Server stop-time allocation reduction — 2026-10-19

- Current Server PR #10 head `3516934d844339dff1c4e23e680d1337344d38fd` reuses scheduled service-date arrival/departure Date values once per eligible stop-time rather than recreating them inside each stop-pair segment. Debug-only GTFS search stage logs now also include `heapUsedBytes` and `rssBytes`.
- Same-process comparison against prior exact source `a530561…` on the identical cached Lviv GTFS feed returned the same 100 itinerary IDs (100/100 overlap), with identical partial/search-limit flags. Measured planner time improved from about 2.32 s to 2.03 s; JS heap while the results were live fell from about 439 MB to about 398 MB. RSS varied because Node retains allocator pages, so no RSS reduction is claimed.
- Current code passed GTFS 37/37, full unit 234 passed/0 failed/3 opt-in skips, typecheck, lint, and isolated Postgres/PostGIS+Redis integration 30/30. Exact-head CI runs `39238749426` and `39238755044` both passed on exact SHA `3516934d844339dff1c4e23e680d1337344d38fd`. Search remains partial and production memory/concurrency remains unverified.
- **Next action:** continue reducing graph memory without changing route results; retain bounded-search truth flags and refresh the exact release materialization after code stabilizes.

### Bounded GTFS candidate graph — 2026-10-19

- Server PR #10 exact head `69be55f32c595c545757b4341c2247bf025d842c` adds a per-request GTFS graph ceiling (100,000 total proportional to selected route count; at most 5,000 per selected route), order-independent deterministic per-route priority retention, de-duplicates canonical transfer-node IDs, and uses arrays instead of per-node Sets in the reverse transfer index. `candidateGraphTruncated` still feeds truthful partial-search signaling.
- A dense-feed regression places a faster feasible trip last in feed order and proves it survives the cap. Focused GTFS 38/38; full Server unit 235 passed, 0 failed, 3 opt-in skipped; typecheck/lint/diff check pass locally. Local Postgres integration could not start because `127.0.0.1:5434` refused connections.
- On the cached Lviv static GTFS feed (72 routes, 15,716 trips, 1,071 stops), the exact OD/time replay returned 100 results and 35 distinct route chains (previous prefix-cap sample: 21), completed in about 3 seconds under `--max-old-space-size=512`, with ~361 MiB heap / ~548 MiB RSS. It remains explicitly truncated and is not realtime, concurrency, staging, or production acceptance. An earlier unbounded graph version OOMed above 2 GiB.
- Commit `69be55f32c595c545757b4341c2247bf025d842c` passed exact-head push/PR CI `39241040483` and `39241045903`. Diagnostics follow-up `5d6ad9cf28da15d8f56614fde1b1fdbd3a17c0dc` is pushed; exact-head push/PR CI `39241725345` and `39241732394` both passed.
- **Next action:** verify exact-SHA CI, then continue reducing memory and measuring route/time coverage across multiple query windows.


### Current Server pin refresh — 2026-10-19

- Updated the Server candidate pin to `ff6a3e2db9ca206d46b52fedee36fbfe1cf0700a` after both exact-head CI checks passed, including Postgres/Redis integration and migration validation. The change preserves GTFS route direction/geometry metadata in the network cache and versions cache keys so stale pre-fix Redis values are bypassed.
- Rematerialized exact Server/Site/Admin/Partner sources with `node ops/scripts/materialize-release.mjs`; `.release/materialized.json` now binds Server `ff6a3e2…`, Site `5879ad…`, Admin `9dbf7db…`, Partner `c639257…`, and reports `pinnedSourceTreesClean: true`. No image build or deployment was run.
- The release is still `NOT_RELEASED`: no staging deployment/HTTPS smoke, production host/deployed SHA, physical iPhone acceptance or backup/restore rehearsal is verified. Historical evidence sections below retain older SHA results and are not current pins.
