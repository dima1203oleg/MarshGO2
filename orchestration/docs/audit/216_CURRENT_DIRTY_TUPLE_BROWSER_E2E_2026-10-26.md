# Current dirty-tuple browser acceptance — 2026-10-26

## Inputs

- Root: `/Users/dima1203/Desktop/MarshGO`, branch `codex/production-finalization-20261014`, current dirty tree.
- E2E Site bundle: current dirty canonical `MarshGO-Site` production build, rebuilt with the required isolated loopback map-fixture manifest.
- E2E API: current dirty canonical `MarshGO-Server` checkout on branch `feature/transport-layer-availability`; loopback Postgres `marshgo_e2e`, Redis and map/geocoder/OSRM fixtures. The harness used the server worktree via `E2E_SERVER_DIR`, not the manifest materialization for its API process.
- Test source was changed only to match the live Ukrainian partial-search status wording (`Пошук не охопив усі можливі варіанти …`) instead of removed stale copy (`частина маршрутів`). No product behavior or assertion strength was weakened.

## Results

- First full 25-case browser run: **22 passed, 3 failed**. All three failures were stale text locators for the same currently visible partial-search status. The route-map, reload, booking, navigation, rendezvous and other scenarios were exercised; no other failures occurred.
- Updated the three stale locators/assertions to match the current explicit partial-data message.
- Focused rerun of all three affected tests: **3/3 passed**. This included the canonical route-map interactions and its light/dark screenshot assertions, URL restore, and the partial-search warning scenario.
- Combined scenario evidence: all **25/25** cases now have a passing run (22 from the full run plus the 3 individually rerun). A single full 25-case rerun after the test-only correction has not yet been performed.
- Button audit within the full run: **179 clicked, 0 without visible effect, 0 changed before click**.
- Site static checks in current checkout: typecheck PASS, unit tests 99/99 PASS, ESLint PASS, production build PASS, bundle transfer budget PASS (largest JavaScript chunk 274.5 KB gzip under 350 KB).

## Limits

- Map assertions use a deterministic local fixture, not licensed/live production map tiles. The supplied ten mock images were not each pixel-compared against production assets; these are regression-snapshot assertions, not complete visual sign-off.
- This does not prove real public feeds, deployed staging, hosted CI on an immutable SHA tuple, physical iPhone, external-provider rights, load/recovery, backup/restore, production deployment or owner-approved release.
- Worktrees remain dirty; no commit, push, merge, manifest promotion or deployment. `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Next

1. Rerun the complete current dirty-tuple E2E once if time permits, then repeat browser compatibility on the same immutable Site/Server SHA tuple.
2. Continue unresolved exact-SHA/PR and production gates from the existing inventory, without broad staging or overwriting dirty work.
