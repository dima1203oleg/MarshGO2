# Exact release-candidate cross-browser check — 2026-10-24

## Scope

- Orchestrator: `dima1203oleg/MarshGO`, branch `codex/production-finalization-20261014`, HEAD `566a17e5c584efd4d68a97b381aabc068c87cf5c`.
- Site source pinned for this run: `2af5219538aa005d285f9236ca0b0dafaca0274a` (PR #21).
- Server source pinned for this run: `c7252783f3c8b3b1140d621bcbdae175248008be` (PR #35).
- Runner: local Playwright browser compatibility configuration; disposable E2E database and local map/geocoding/routing fixtures; Node 24.21.0.
- Command: `npm run test:browser-compat` with `E2E_API_PORT=3312` and isolated database `marshgo_e2e_rc_20261024_browsers`.

## Result

**6/6 tests passed in 3.1 minutes.** Each of Chromium, Firefox, and WebKit passed:

1. Production sign-in, home and search usability across configured viewport sizes.
2. Canonical route-map sheet, stop details, map focus, and light/dark palette behavior.

The first attempt did not run tests because the default API port 3302 was already occupied by an existing user container. The successful retry used port 3312; no user container or persistent volume was stopped, removed, or changed.

## Limits

This is browser-engine coverage against the pinned candidate source with local fixtures. It is not a test of every control, conditional account state, Admin/Partner authenticated workflow, live provider feed, deployed staging/production, licensed live map tiles, or physical Safari/iPhone. The suite covers a focused production-path subset, not literal full-program acceptance. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Supplied visual references

Inspected candidate captures for route results, expanded route details, half-expanded map, active navigation, and transport layers against the supplied images. The route hierarchy and light/dark sheet states are exercised, but the map imagery is synthetic and the layer panel has a different composition from the reference. The screenshots for carpool offer/approach and selected live bus do not have matching live-data candidate states. Exact 10-image visual acceptance therefore remains **NOT_ACCEPTED**; the mock-by-mock delta table is in `docs/audit/95_USER_MOCK_DESIGN_AUDIT_2026-10-23.md`.
