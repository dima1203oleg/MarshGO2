# Dirty Site full control and responsive acceptance — 2026-10-25

## Exact local trees

- Orchestrator checkout: `codex/production-finalization-20261014`, HEAD `0d068f7104d3cdedde9edb57a1be781df5e86491` (dirty before and during this checkpoint).
- Site worktree: `codex/sync-journey-mobility-ui`, HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`, with pre-existing dirty changes plus the local HomeHero scroll fix.
- Server worktree: `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, dirty; E2E used its explicitly supplied API directory and isolated loopback `marshgo_e2e` database.
- No changes were staged, committed, pushed, merged, or deployed.

## Changes in this checkpoint

- `MarshGO-Site/src/views/HomeHero.tsx`: bounded short-screen Home now scrolls internally rather than clipping the lower action at 320×568; global bottom navigation remains available.
- Root Playwright selectors in `e2e/browser-compat.spec.ts`, `e2e/button-audit.spec.ts`, and `e2e/conditional-cta.spec.ts` were aligned to current production UI labels, groups, placeholders, tabs, and dialog copy.
- Prior route-map follow-up changes in `MapLayersControl.tsx` keep the mobile layer sheet within 60dvh, make its contents scrollable, retain visible map area, and avoid covering global navigation.

## Evidence

- Site `npm run typecheck`: PASS.
- Site `npm run lint`: PASS.
- Site unit suite: **98/98 PASS**, 0 skipped.
- Site production build: PASS. Bundle gate: **16 JS chunks within the 350 KB gzip budget** (largest 285.81 KB).
- E2E fixture build was explicitly rebuilt from this dirty Site source with the isolated map manifest at `127.0.0.1:3306`; it was not the ordinary production-asset build.
- Root `e2e/browser-compat.spec.ts`: **1/1 PASS**, widths 320/390/430/768/1280/1440, including Home action reachability on short mobile, search category grid, themes, modal, and fixed tab bar.
- Root `e2e/journey-route-map.spec.ts -g 'canonical route map synchronizes'`: **1/1 PASS**, route/map/layer/navigation scenario in fixture data and reviewed local snapshots.
- Root `e2e/conditional-cta.spec.ts`: four independent scenarios passed in the suite; the corrected GPS navigation start/expand/end scenario passed separately **1/1**. It creates and ends a server session using simulated browser GPS and the isolated E2E database.
- Root `e2e/button-audit.spec.ts -g 'empty search|trips route'`: **2/2 PASS**.
- Full `e2e/button-audit.spec.ts -g 'every button on every main screen responds without errors'`: **1/1 PASS**; **179** visible enabled controls clicked across the configured production-route inventory, **0** inert controls, **0** stale controls, no page errors or unexpected 5xx responses.
- Initial GPS test attempt timed out because its second locator used stale accessible name `Розгорнути панель`; trace showed the app had already created a 201 session and was displaying active navigation. Updated the test to the production label `Розгорнути панель навігації`; the retest passed. This was a stale test selector, not a GPS/API failure.
- `git diff --check`: PASS for the Site and orchestrator worktrees.

## Limits and next action

This is local browser/unit/build evidence, not staging or production evidence. Maps used deterministic fixture tiles, not licensed satellite/live transport assets. Exact visual parity against all ten owner images is not established. Physical iPhone/Safari background behavior, external feeds, real booking/payment entitlements, Admin/Partner authenticated workflows, production deployment, backup/restore, load/security acceptance, and owner release approval remain open or not tested. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

Next: reconcile the dirty Site/Server diffs with exact candidate PR SHAs before integration; rerun the full E2E suite against an immutable exact tuple, then continue remaining UI references and release gates. Do not overwrite the existing dirty worktrees.
