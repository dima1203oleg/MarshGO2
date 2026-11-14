# Local API search outage and user-facing fallback — 2026-10-26

## Observation

- Browser tab `http://127.0.0.1:3000/journeys/search` loaded the current production-route search form as guest.
- The Find Route action received HTTP 502 from the Vite `/api` proxy. Local Vite is listening on port 3000; no API process is listening on configured default port 3002. `curl http://127.0.0.1:3002/healthz` returned connection refused. No staging or production endpoint was tested.
- Runtime inspection found local Postgres/Redis containers. The API was not started against the shared development database because its startup begins processing the database realtime outbox; no records or containers were changed.

## Change

- In `src/features/search/SearchExperienceV6.tsx`, generic 5xx and browser network failures now produce clear Ukrainian recovery copy: “Сервер зараз недоступний. Перевірте з’єднання та повторіть пошук трохи пізніше.”
- The search form retains the user-entered route and the retry action. Browser AX inspection and screenshot confirmed the copy is visible in the form after scrolling to the error region. The raw `Request failed (502)` is no longer shown.

## Verification

- `npm run typecheck`: PASS.
- `npx eslint src/features/search/SearchExperienceV6.tsx`: PASS.
- `npm test`: 256 PASS, 0 FAIL, 1 opt-in local integration test SKIP (not counted as pass).
- `npm run build`: PASS.
- `npm run check:bundle`: PASS, 51 JavaScript chunks within 350 KB gzip budget.
- `git diff --check`: PASS.
- Local browser retry before/after source change: reproduced 502 and verified Ukrainian user-facing fallback. The retry was still served by an unavailable API, so no journey results were verified.
- Isolated E2E using Node 24.21.0, canonical Server SHA `a403a51a203d9d89685c10c69658c8fd95b70e9b`, current dirty root Site bundle, loopback database `marshgo_e2e_search_20261026`, and fixture map/geocoder/OSRM services: search button sweep **25 clicked / 0 inert / 0 stale**; empty search, trip filter and empty demand **2/2 PASS**. An initial combined file run reported two additional failures because its assertions still expected the removed tab name “Майбутні”; the rendered production UI correctly uses “Заплановані”. Updated only the stale E2E accessible-name selectors and reran those two tests; both passed. No product tab labels changed.

## Boundary / next step

- This is a development-runtime outage, not proof of a production provider outage. E2E validates controls and invalid/empty states only; a successful valid journey search against fixture or live feed data, staging, and deployed service remain NOT_TESTED. Continue using only the isolated loopback E2E database/API harness for that work; do not point the test API at a shared database with pending outbox work.
- No production deploy, remote branch change, manifest promotion, commit, or container/database cleanup was performed. Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
