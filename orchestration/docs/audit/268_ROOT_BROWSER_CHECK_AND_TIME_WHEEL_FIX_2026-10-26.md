# Central workspace browser check and time-wheel fix — 2026-10-26

## Scope and exact source

- Active browser app: `http://127.0.0.1:3000`, Vite launched from the central `MarshGO` workspace, not the separate `MarshGO-Site` checkout.
- Source change: `src/components/common/DrumWheelPicker.tsx`.
- The time wheel's first alignment assigned `scrollTop` while CSS `scroll-behavior: smooth` was active. Initial scroll events could therefore be observed as user input and alter the selected time just by opening the picker. The first alignment now explicitly uses an instant scroll.

## Verification

- Browser reproduction before fix: the search button showed `18:30`, but opening the picker changed its selected hour/minute to `01:01`; reopening advanced it to `02:02` without user input.
- Browser after fix: repeated opening kept `18:30` and showed hour `18`, minute `30` as selected. The value was not applied or changed.
- Central workspace `npm run check:production`: typecheck PASS, ESLint PASS, 256 tests PASS / 1 opt-in DB test SKIP / 0 FAIL, production build PASS, bundle budget PASS (51 JS chunks, each ≤350 KB gzip).
- Separate `MarshGO-Site` checkout checks: typecheck, lint, 100 tests and build/bundle budget passed. This is a different checkout and does not substitute for central-workspace browser acceptance.

## Browser acceptance findings

- Guest mode reached Home, Search, Transit Map, Trips, Profile and the global create-action panel. Main tab navigation and quick-action panel opened.
- Search form displayed the 12 canonical user-facing categories; five were disabled for lack of a router, and Metro was still enabled in Lviv, contrary to the requirement that it be unavailable there.
- The selected corridor reported no connected providers. Search returned a server-unavailable message, so results, route details, booking and downstream map states could not be exercised.
- Transit map displayed “Не вдалося завантажити частину шарів”. GPS permission was not requested.
- Trips returned HTTP 502. Guest Profile displayed a placeholder number and personal-data view stated that no server data/operation was available. These are not authenticated-user acceptance results.
- Vite on port 3000 proxies to API port 3002 and returns HTTP 502. The already-running API on port 3310 returns `/healthz` 200 but `/readyz` 500. A database-dependent runtime gate remains unhealthy.
- Local Postgres 14 has no PostGIS extension; the isolated E2E runner previously stopped before browser tests. Only 2.0 GiB disk space was available; no packages, containers, volumes, databases or files were deleted or installed.

## Status and next action

- The time-picker defect is fixed in the active central workspace.
- Full page/button and visual comparison against the supplied reference images is **NOT_TESTED**; there are no route results in the active browser and the API readiness gate is failing.
- Next: restore an isolated PostGIS + Redis E2E environment with adequate disk, align its API proxy explicitly, rerun the route/button tests and inspect screenshots at the six requested viewport widths and both themes. Then fix the observed Lviv Metro availability state and continue page-by-page acceptance.
- No staging or production deployment occurred; `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Lviv mode availability follow-up

- Search previously requested one global provider list and enabled any mode supported by the route engine. That allowed Metro to remain selected in Lviv even though the regional catalog correctly declares no metro there.
- SearchExperienceV6 and the Marketplace search panel now ask the existing `/mobility/providers` endpoint for each geocoded endpoint and merge providers by transport type and provider id. A route spanning two covered cities keeps both ends' verified services.
- Transport modes with no provider in a successful endpoint discovery are disabled, removed from the active request, and excluded from “Усі”. Failed/unavailable discovery remains unknown (`null`) and does not falsely declare services unavailable.
- Regression coverage: Metro is unavailable when a verified Lviv provider response contains no metro; Metro is available when a verified Kyiv metro provider is present; failed discovery retains unknown behavior.
- Production component server-render smoke: Lviv provider response renders the Metro tile `disabled` with the unavailable reason; Kyiv Metro provider renders it enabled. This verifies component rendering with deterministic provider input, not an interactive browser session or live feed.
- Validation after this change: `node --import tsx --test tests/transport-preferences.test.ts` PASS (10/10); `npm run typecheck` PASS; final `npm run check:production` PASS (typecheck, ESLint, 256 tests PASS / 1 opt-in DB skip / 0 FAIL, production build and bundle budget).
- The UI behavior could not be rechecked in the active browser because Vite still proxies to API port 3002 while the running API is on 3310 and fails `/readyz` (500). Metro UI acceptance with live provider discovery remains **NOT_TESTED**.
- `/healthz` on 3310 returns 200. `/readyz` returns the generic internal-error response; this handler performs `SELECT 1` against its configured PostgreSQL connection. Local PostgreSQL 5432 accepts connections, while the isolated E2E port 5434 and local Redis ports 6379/6380 have no listeners. The exact credentials/DB configured for the existing Server process were not exposed or changed; readiness root cause remains unresolved.
- The running Server process's `DATABASE_URL` was inspected with credentials and database path redacted: host `127.0.0.1`, port `5434`. This confirms the immediate readiness blocker is an absent isolated DB listener. Docker CLI `info` and `ps` both timed out after five seconds; free workspace volume is about 1.8 GiB. No containers, volumes, databases or files were deleted, and no packages were installed.
- No production/staging deployment occurred; `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
