# Guest trips polling and runtime acceptance — 2026-10-26

## Finding and fix

- Reproduced in the central `MarshGO` production entry point: the guest Trips view began authenticated booking refresh polling every three seconds. The API proxy on `localhost:3002` was unavailable, so each poll produced HTTP 502 while the view simultaneously showed an empty account state.
- Updated the polling guard to skip the synthetic `guest_user` identity. No guest booking data is requested and the empty state remains calm and truthful.
- Manual browser verification after HMR: entered guest mode, opened Trips, waited over four seconds; the empty state remained and no 502 status appeared. Also exercised Home, Search, Trips filters, Profile, quick-actions modal, Navigation discover screen, and Transport Map/layers.

## Current runtime blockers

- Vite is open on `localhost:3000`; configured proxy target `localhost:3002` is closed.
- Server `/healthz` on `localhost:3310` returns 200, but `/readyz` returns 500. Its configured PostgreSQL port `5434` has no listener; unrelated `5432` is not substituted because it lacks PostGIS.
- Docker Desktop is open but CLI `docker ps` again timed out; no containers, volumes, databases, or files were deleted.
- Docker Desktop dashboard reports “Engine running” and nine container entries, but Engine API `/_ping` on its Unix socket times out; host ports 3317/3318/3339 shown in the list are closed. The page did not expose enough accessibility details to identify a safely startable DB container.
- No local `redis-server`/`redis-cli` is installed. Homebrew PostGIS reports 11 required dependencies; with about 2 GiB free, no package installation was attempted.
- Transport Map reports a partial layer-load failure. Search returns “Server unavailable.” Authenticated booking, full journey results, live feeds, full map acceptance, and iOS remain untested.
- Browser viewport was 386×519; current Trips view had no horizontal overflow. This is not a complete responsive or reference-image acceptance.

## Validation

- Central `npm run check:production`: PASS — typecheck, ESLint, 256 tests PASS / 1 opt-in DB integration skipped / 0 failed, production build and bundle budget PASS.
- Site both-endpoint provider-discovery change: full Site unit suite 101/101 PASS, typecheck/ESLint/build PASS; separate evidence: `269_SITE_ENDPOINT_PROVIDER_COVERAGE_2026-10-26.md`.
- No staging or production deployment. No precise-location permission granted. `PRODUCTION_READY=false`.

## Next action

- Repair the isolated local runtime without deleting user data: restore the intended PostGIS service/database on port 5434, then align Vite proxy target with the healthy API. Rerun readiness before browser acceptance.
- Then test authenticated passenger/driver flows, map layers, route results, booking lifecycle, all tabs/actions, and responsive Light/Dark screenshots against the supplied reference designs.
