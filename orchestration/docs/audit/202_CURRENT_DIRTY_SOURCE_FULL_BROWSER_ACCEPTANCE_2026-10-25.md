# Current dirty-source full browser acceptance — 2026-10-25

## Tested source and limits

- Orchestrator repository HEAD: `febd5008fbf7bba058b0e1bf2bfab647a0c735c5`.
- Committed Site base: `6961afcf008e2c845c0fde68c687ce61fe744f2f`; current tested Site files were dirty and are not represented by that commit or the release manifest.
- Server candidate: PR #42 `a403a51a203d9d89685c10c69658c8fd95b70e9b`.
- Browser tests used local deterministic map/geocoder/OSRM fixtures and isolated loopback test data. This is not live feed, staging, production or physical-device evidence.
- The captured route-map snapshot uses schematic test tiles; it does not visually match the detailed real-map backgrounds shown in the supplied navigation mockups. Functional map interaction may pass while map-style/imagery acceptance remains open.

## Results

- Full browser E2E against the built current dirty canonical Site source: 25/25 PASS in 6.1 minutes.
- Interaction audit: 179 controls clicked; zero had no visible effect; zero changed before being clicked.
- Focused Site route-map test (light/dark screenshot comparisons and drag transitions): PASS. Current route-sheet tests + navigation-core regression: 10/10 PASS. Site typecheck and local build PASS; root E2E ESLint PASS.
- After a final snap-threshold refinement, responsive and route-map scenarios passed 6/6 across Chromium, Firefox and WebKit. The three route-map runs include gesture transitions and light/dark screenshots.
- After the final snap adjustment, Site typecheck, full lint and 99/99 unit tests passed; targeted route-sheet/navigation tests also pass 10/10. A prior root `npm run check:production` exited 0 with two opt-in integration checks SKIP; that root check predates the latest adjustment. Skips are not passes.

## Product defect fixed in the tested dirty Site source

When a GPS heartbeat reconciled the same server navigation session and route version, the reducer reinitialized remaining distance and duration from the route origin. This erased live progress and made the ETA jump backwards. The reducer now preserves matched location, remaining distance/duration and off-route/reroute status for the same route version, and clears route-bound position/matching state only when the session or route version changes. Regression tests cover both same-route preservation and changed-route reset.

Visual comparison also found the half-open sheet took 66% of viewport height, leaving only a third of the map. It now reserves approximately half of a standard-height viewport for the map. Fast swipe snapping now selects the adjacent point from gesture-start state and total displacement, avoiding coalesced-frame velocity errors. Only the reviewed light/dark half-state baselines were refreshed; the route-map snapshot test then passed.

## Not accepted / not tested

- Manual image review covered the current results list (Light/Dark), expanded route details (Light/Dark), half and collapsed map states, active navigation controls, navigation layers, and transport-map layers. Broad structure aligns with the supplied direction: route choices and segment strips, stop timeline, sheet handle, global bottom bar, navigation prompt, and explicit unavailable layer states. This was a spot review, not acceptance of every supplied image or every product page.
- The current map fixture is a pale schematic grid (and the dark variant is the same test network); it lacks the supplied mockups' real Lviv/Kyiv imagery, road labels, landmarks, vehicle icons and realistic live vehicles. Navigation's `— км/год` correctly means no browser speed measurement was available; no speed/limit value was invented.
- User-supplied mockups have not received a complete state-by-state pixel and interaction review. Passing repository screenshot snapshots does not establish conformance to all references.
- No authenticated Admin/Partner browser journey was included in this run.
- Live provider entitlements/probes, staging HTTPS, deployed SHA smoke, physical iPhone/background GPS, security acceptance, load, backup/restore and rollback remain NOT_TESTED or externally blocked.
- Do not mark the app production-ready: `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Next actions

1. Compare the six navigation/result states in both themes against the supplied designs; make focused corrections without bulk snapshot updates.
2. Rerun browser compatibility across Chromium, Firefox and WebKit after the final snap change.
3. Exercise authenticated Admin and Partner flows against a coherent exact-SHA local API tuple.
4. Continue routing-completeness work and exact cross-repository release verification, then staging and operational release gates when configured.

## Continuation checkpoint — canonical workspace and reference assets

- Root orchestrator checkout is `febd5008fbf7bba058b0e1bf2bfab647a0c735c5`; it currently has 89 modified and 199 untracked paths. No broad staging, cleanup, commit, merge, or reset was performed.
- Canonical Server checkout is `feature/transport-layer-availability` at `92a26a3f617f32d644a66c0af46cba096ccb0ce0` (dirty: 18 modified, 19 untracked). Canonical Site checkout is `codex/sync-journey-mobility-ui` at `6961afcf008e2c845c0fde68c687ce61fe744f2f` (dirty: 32 modified, 11 untracked). Canonical iOS checkout is clean at `4353cec3cacb`. Admin and Partner have no canonical working checkout here; only materialized `.release` snapshots are present, and those snapshots themselves have local status changes.
- The supplied JPG paths under `/tmp/codex-remote-attachments/...` are absent in this environment. The inline mockups are visible in the conversation, but source files cannot be measured or used for direct pixel-diff acceptance.
- Admin/Partner snapshots explicitly reserve their development-preview sign-in as UI-only and block API mutations; verified tenant/administrator acceptance requires a real authorized role/session from the shared Server. No role was self-granted and no authenticated tenant flow was claimed.
- Release manifest still says `production_ready=false` and `NOT_RELEASED`. No deployment was attempted. Keep all current dirty work intact while reconciling candidate SHAs and continue only with isolated, semantics-based acceptance that does not require owner credentials.
