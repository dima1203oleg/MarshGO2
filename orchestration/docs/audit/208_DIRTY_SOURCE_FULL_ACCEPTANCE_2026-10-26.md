# Dirty-source full local acceptance — 2026-10-26

## Scope and provenance

- This checkpoint records a local verification run on the existing dirty worktrees. No reset, clean, broad stage, merge, container removal, or deployment was performed. The one-line Site fix was committed separately and pushed normally to its existing PR branch; unrelated changes remain untouched.
- Orchestrator: `codex/production-finalization-20261014`, HEAD `febd5008fbf7bba058b0e1bf2bfab647a0c735c5`, dirty (294 status entries at capture).
- Site before the verification run: `codex/sync-journey-mobility-ui`, base HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`, dirty. The tested production bundle was built from this working tree, including uncommitted changes; its commit SHA alone does not identify the artifact. The isolated contact-block fix is committed/pushed as `ae2c8aaf140305c4a1124c0b9a232f21b09eed0e` to [PR #3](https://github.com/dima1203oleg/MarshGO-Site/pull/3). Exact PR checks `40255497701` and `40255502725` pass; remaining Site changes are still dirty and are not in the pushed commit.
- E2E API source materialized by `scripts/run-e2e.sh`: Server `a403a51a203d9d89685c10c69658c8fd95b70e9b`. The separate local Server integration run used dirty `feature/transport-layer-availability` HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- iOS wrapper: `MarshGO-iOS` HEAD `4353cec3cacbaf662ceea047402f361024292b22`; its embedded `web` checkout is `02e97d63c050ae87b0d9fa6c698c97a0b5fdfb5f` and has two modified files. It is not synchronized to the tested Site working tree.

## Results

| Area | Evidence | Result | Limits |
|---|---|---|---|
| Production Site build | `VITE_MAP_STYLE_URL=''`, local E2E fixture manifest, `npm run build` | PASS | Fixture map assets; not the production map artifact. |
| Site static checks | `npm run typecheck`, `npm run lint`, `npm test` | PASS: typecheck/lint and 99/99 unit tests | Local dirty Site source. |
| Site bundle budget | `npm run check:bundle` | PASS: 16 JS chunks, each <=350 KB gzip; largest measured 274.5 KB | Does not measure network/runtime performance. |
| Full browser E2E | `npm run test:e2e`, 25 tests | PASS: 25/25, 6.5 minutes | Loopback API, isolated test database, fixture map/geocoder/OSRM; not live upstream providers or staging. |
| Browser compatibility | `npm run test:browser-compat` using the same local Site bundle | PASS: 6/6 across Chromium, Firefox and WebKit | Home/search responsiveness and route-map states; not physical Safari/iPhone. |
| Visible-control audit | E2E button audit on configured production routes | PASS: 179 clicked, 0 inert, 0 stale-before-click | Covers configured passenger/driver production routes, not Admin/Partner portals. |
| Route/map visuals | Route-map E2E over compact/half/expanded states, stops, segment focus, light/dark palette | PASS for automated browser assertions | No manual pixel acceptance against every supplied mockup; map tiles are fixtures. |
| Server static checks | `npm run typecheck`, `npm run lint`, `npm test` on dirty Server checkout | PASS: typecheck/lint; 234 pass, 0 fail, 1 opt-in skip | One opt-in test is skipped by the unit command. |
| Server integration | `npm run test:integration` on loopback `marshgo_e2e` Postgres/PostGIS and Redis | PASS: 29/29 | Local isolated dependencies, not staging/production. |
| iOS simulator smoke | Xcode 27 / iOS 27, iPhone 16 Pro Max simulator; app installed/launched, then rendered its landing screen | PARTIAL: native wrapper compiles and opens | First immediate capture was the white launch/splash surface; after ~12 seconds the landing UI appeared. Embedded Site is dirty and SHA-mismatched; not current-Site or device acceptance. Screenshot: `/tmp/marshgo-ios-launch-after-wait.png`. |
| Admin candidate | Manifest-pinned `.release/admin-f39c4b74839a393f4487c830930669eabc8c0390` | PASS: typecheck, lint, build, 4/4 unit tests | No authenticated portal E2E in this run. |
| Partner candidate | Manifest-pinned `.release/partner-97a3727cc395dea092af6e3e24d6822370c2bc63` | PASS: typecheck, lint, build, 3/3 unit tests | No authenticated tenant-isolation / operations E2E in this run. |
| Contact block flow | Fixed successful block action to close chat and navigate to trips; full two-account scenario now passes; scoped Site commit `ae2c8aaf140305c4a1124c0b9a232f21b09eed0e` | PASS | Booking remains intact, as required. Broader orchestrator E2E changes remain dirty. |

The full browser run covered sign-in, home/search responsiveness, all 179 configured controls, search filters/date/time, route endpoint swap, route map and transport modes, navigation, marketplace booking and negotiation across two accounts, chat, trip lifecycle, GPS reroute, profile export/deletion request, rendezvous consent, and phone-sized viewports. The separate compatibility matrix passed 6/6 across Chromium, Firefox and WebKit. Test expectations were updated where accessible labels or UI states had changed; the contact-block navigation issue was fixed in the product code.

## Still open

- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED` in both release manifests. No production deployment was attempted.
- No verified staging URL/deployed SHA or production image digest was used. No live-provider or licensed map acceptance occurred.
- Dense Lviv GTFS route search still reports truncation in prior evidence; do not claim complete route recall. See audit 203 and audit 206.
- Separate Admin/Partner worktrees are not present, but their manifest-pinned `.release` snapshots passed typecheck/lint/build/unit checks (4/4 and 3/3); authenticated portal flows and tenant isolation were not exercised.
- The iOS simulator build was not run with the Site bundle tested by E2E; embedded Site SHA/worktree differs. No simulator launch, physical-device GPS/background, APNs, signing, or TestFlight acceptance.
- No full security review, load test, monitoring/alert exercise, backup/restore, rollback, or disaster-recovery acceptance.
- The ten referenced JPG attachments were not available at their listed local `/tmp/codex-remote-attachments/...` path. Automated snapshots cover selected states but are not full reference-image visual sign-off.
- All canonical worktrees remain dirty. The result is not attached to a single immutable cross-repository release tuple.

## Next actions

1. Continue GTFS search completeness against the exhaustive small-feed oracle and frozen Lviv feeds; preserve explicit truncation warnings until solved.
2. Reconcile Site and Server dirty diffs to reviewed immutable candidate SHAs; do not broad-stage or overwrite existing changes.
3. Bring Admin and Partner into a coherent test workspace and run authenticated RBAC/tenant isolation with disposable identities.
4. Pin the exact Site SHA into iOS, rebuild the same web artifact, install/launch on both available simulators, and capture the requested states; physical-device checks remain separate.
5. Obtain/verify staging, licensed map/provider rights, secrets, backup/restore, rollback, security/load and monitoring evidence.
6. Keep production deployment behind the separate explicit owner approval required by the master spec.
