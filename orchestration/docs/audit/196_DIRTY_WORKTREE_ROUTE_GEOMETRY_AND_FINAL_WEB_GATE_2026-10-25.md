# Dirty worktree route geometry and final Web gate — 2026-10-25

## Scope

Validated the current dirty integration worktree on commit `40a46aced468830ca7c3ab5a7648b6a05a6e6f95`. No branch integration, commit, deployment, or release-status change was made.

## Changes exercised

- Preserved provider `routeGeometry` on journey legs through the production API type and SearchExperienceV6 mapping. The map receives supplied geometry without fabricating a straight line when geometry is missing.
- Reworked the non-compact map layers control as a viewport-fixed mobile sheet above global bottom navigation while retaining the desktop floating panel and compact anchored popover.
- Moved the route-geometry availability notice into the route summary sheet so it does not obscure route geometry or endpoint labels.
- Updated route-map assertions to the active segment palette and current server-provided layer/status labels.

## Evidence

- `npm run check:production` under Node `24.21.0`: PASS. TypeScript, ESLint, unit suite (256 passed, 0 failed, 1 opt-in database test skipped), Vite production build, and 51-chunk gzip budget all passed.
- Full isolated fixture browser suite after the final notice placement and audit correction: 25/25 PASS. The control audit clicked 178 visible controls; 0 had no visible effect and 0 changed state before their click.
- Production sign-in/home/search responsive cases at 320/390/430/768/1280/1440 px plus canonical route-map flow: Chromium, Firefox, WebKit 6/6 PASS.
- After adjusting the geometry notice, the canonical route-map flow was rerun across Chromium, Firefox, and WebKit: 3/3 PASS.
- `git diff --check`: PASS.
- `eslint e2e/button-audit.spec.ts`: PASS. A Playwright post-click navigation-wait timeout is classified by the resulting DOM/network effect; the central quick-actions button opens its dialog and is counted as working.

## Evidence limits and release state

These are local fixture-backed checks, not staging, production, live-provider, external-map-entitlement, or physical-device evidence. Screenshot pixel comparison against the supplied ten mockups was disabled for these runs; full visual acceptance remains open. This does not validate Admin/Partner authenticated operations, production feed freshness, real rendezvous GPS, load/recovery, backup/restore, rollback, or an owner-approved deployment. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

## Next action

Continue visual acceptance against all supplied references without mass-refreshing snapshots; then close the exact cross-repository, provider-rights, staging, device, security/performance/recovery, backup/restore/rollback gates. Reconcile exact release SHAs only after their source/PR ancestry is established.
