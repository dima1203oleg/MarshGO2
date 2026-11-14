# Audit 259 — current root production checks and browser-test blocker — 2026-10-26

## Scope

- Root repository: `/Users/dima1203/Desktop/MarshGO`, branch `codex/production-finalization-20261014`, HEAD `688b58ca6eeae0175ee34cf1c423a3e35c9f765d`.
- The checkout is heavily dirty (325 changed/untracked paths). No files were reset, cleaned, staged, committed, or deployed in this checkpoint.
- Runtime used: Node `v26.7.0`, outside the declared `>=24.21.0 <25` engine range. Passing checks below are local diagnostics, not a supported-runtime release proof.

## Checks performed

| Gate | Result | Evidence / limit |
|---|---|---|
| `npm run check:production` | PASS, exit 0 | TypeScript, ESLint, 257 unit tests (256 pass, 1 opt-in database integration skipped), Vite production build, and 51-chunk gzip budget all passed. |
| `npm test` | PASS | 257 tests, 256 pass, 0 fail, 1 opt-in integration skip. |
| `git diff --check` | PASS | No whitespace errors at the time of the command. |
| `npm run test:e2e` | BLOCKED before browser startup | `ECONNREFUSED 127.0.0.1:5434` from the loopback-only E2E database bootstrap. No Playwright scenario ran in this invocation. |
| Browser compatibility E2E | NOT RUN | It uses the same isolated database bootstrap and is blocked by the unavailable `5434` dependency. |
| Docker dependency startup | BLOCKED / unavailable for this checkpoint | Docker CLI `info`/`compose ps` did not return within the bounded observation and were interrupted. No Docker command that starts/stops/removes containers was issued. |

## Current browser observation

The already-open local browser tab at `http://127.0.0.1:3000/map` renders the MARSHGO phone-number sign-in gate and a guest-continuation action. No authenticated account or mutating action was used in this observation. This is only an entry-page smoke observation, not route/page/button acceptance.

## Existing button and visual evidence

Audit 208 previously recorded 25/25 local browser E2E scenarios and 179 configured production-route controls clicked with no inert control, using fixture map/geocoder/OSRM and a local integration database. This is useful prior evidence, but it is not a current rerun against this exact dirty tree and does not prove live upstream data, Admin/Partner authenticated portal coverage, staging, or physical Safari/iPhone acceptance.

## Decision and next action

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. Current static/local gates are green, but current full browser acceptance is blocked by the unavailable isolated Postgres service and unsupported Node runtime. The next safe action is to restore a functioning isolated test database/Redis dependency (or use an already provisioned isolated test environment), then rerun complete E2E, button and cross-browser suites against this exact source. Do not repurpose the unverified host PostgreSQL instance or touch persistent Docker volumes.

## Safe local database fallback check

- The host PostgreSQL on `127.0.0.1:5432` is Homebrew PostgreSQL 14.23 and accepts the local `dima1203` superuser. It has no `marshgo` role, no `marshgo` database, no existing `marshgo_e2e*` database, and does not advertise the required `postgis` extension. It also contains unrelated production-named databases, so it was not used or modified.
- This removes the tempting host-database fallback. The isolated Docker Postgres/PostGIS dependency remains unavailable; no database was created, migrated, reset, or dropped.
