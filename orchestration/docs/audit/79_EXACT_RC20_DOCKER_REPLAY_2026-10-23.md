# Точний Docker replay release candidate RC.20 — 2026-10-23

## Source tuple

| Компонент | SHA | Стан перевірки |
|---|---|---|
| Server | `e21536d5f97e7876aae0a360ed3ff4126ba5c78c` | PR #29, exact-head hosted CI PASS |
| Site | `1d2aaa012b88519273eae7a2b8d703ec32c212f6` | PR #15, exact-head hosted CI PASS |
| iOS | `1d1e9763ec99d7e77b22998c4212ce71a7fa924a` | PR #11, pins the exact Site SHA; simulator CI PASS |
| Admin | `9dbf7db0a935498ac40c98b19bc36bce056d630d` | PR #1 CI PASS |
| Partner | `c639257a7f28aeda5b378a816038b01651146b83` | PR #1 CI PASS |
| Integration manifest source | `b53ff7b8ddb6efa73e6c036d1d96b274ffb349d1` | PR #5 hosted code, DB, build and bundle gates PASS; workflow stops before materialization at missing private-repo read token |
| API/migration | `v1` / `055_provider_commercial_use_requires_license.sql` | Clean Server migration/integration CI PASS; no staging apply/rollback rehearsal |

The root manifest and its docs copy were updated locally to `RC-2026-10-23-current-review.20`, status `NOT_RELEASED`. `node ops/scripts/materialize-release.mjs` checked out the exact Server/Site/Admin/Partner commits above and verified pinned trees except the explicitly generated Docker inputs.

## Build results

Using `ops/templates/production.env.example` only for build-time interpolation:

- `docker compose ... config --quiet`: PASS.
- `docker compose ... build api web admin partner`: PASS, all four images tagged `RC-2026-10-23-current-review.20`.
- Local image IDs: API `b90e9a02d1c6`, Web `b6a4b764e3c3`, Admin `2d7f3da21562`, Partner `b497e1e1d5a1`.
- Web runtime container started with an isolated local DNS alias required by its reverse-proxy config. `/healthz`, `/` and SPA fallback `/journeys/search` returned HTTP 200. The successful temporary smoke container was auto-removed. A separate diagnostic container started without the required API DNS alias exited with code 1 and remains stopped as `marshgo-web-smoke-diagnostic-20261023`; it has no mounted volumes or product data.

## Runtime-aligned checks

- `npm run check:production` under Node `24.21.0`: typecheck, lint, unit tests, production build and bundle budget PASS; 256 unit tests PASS, 0 FAIL, 1 opt-in integration SKIP.
- `npm run test:browser-compat` under Node `24.21.0`: **6/6 PASS** — Chromium, Firefox, WebKit; responsive sign-in/home/search and route-map/sheet behavior.
- Full end-to-end Playwright suite: **16/16 PASS** on the same pinned Site/Server tuple with loopback PostGIS/Redis and deterministic map/geocoder/OSRM fixtures (run under the host's Node 26; browser compatibility and production check were then repeated under Node 24). This is not external provider/staging evidence.

This is packaging and static Web-container evidence. It does not prove API connectivity, database migration against staging, OTP delivery, live routing/providers, secure public HTTPS, background iOS GPS, or production operations. The example values were not used to start the production stack. Server API image CI includes exact-head production image build/smoke on PR #29, but the full composed multi-service stack has not been started against owner staging.

## Remaining blockers

- Root umbrella CI run `39855221314` passed install/audit, lint, typecheck, unit, migration/Postgres integration, build and bundle, but cannot materialize private Admin/Partner without Actions secret `MARSHGO_REPOS_READ_TOKEN`; hosted Docker image build and browser E2E therefore did not run.
- No configured staging origin/access has been supplied. GitHub deployments API returned zero records for the six repositories, and Compose production configuration still requires owner-managed domain, HTTPS map manifests, Redis/session values and Twilio credentials.
- Live Lviv search is still partial (`searchTruncated=true`); some providers need contract/key and operational acceptance.
- Physical iPhone, two-device GPS rendezvous, APNs/background GPS, backup/restore and rollback rehearsals remain NOT_TESTED.

**Release status: `NOT_RELEASED`.** No PR was merged and no public deployment was made.
