# Current four-image local integration smoke — 2026-10-25

## Exact image tuple

| Component | Source SHA | Image digest | Result |
|---|---|---|---|
| Server | `134ed017828a020e1d5f696b3cb9ea95527bb093` | `sha256:a0d676c3a3ded9daffb8c1bd1e85ee8879ffc3c3937985f128bf5697e509b7ab` | PASS |
| Site | `9569bb4f174a4bdf912a6f490e69a359148db342` | `sha256:150ce69d4787ef8ec99832b17627be604838c3bfe5f59b0e210f35ccfb7002bb` | PASS static + integrated routes |
| Admin | `bc37198ca139408907aaefa0d97dc9b60a568300` | `sha256:a4668ffc8d7d516a40fa79f7d1d1db19ded6bcba9ee58781d4b8157620f66633` | PASS |
| Partner | `97a3727cc395dea092af6e3e24d6822370c2bc63` | `sha256:9a5f3c25a4f26172b8603c251bfba44e40594c83f1006c29aef869d57a3595b5` | PASS |

All artifacts are local, unpublished and `linux/arm64`. PostGIS `17-3.5-alpine` ran as `linux/amd64` under emulation on the ARM host; Redis 7.4 ran without persistence. Database and Redis had no mounted volumes.

## Checks

- Server image migration from an empty database applied all migrations through `055_provider_commercial_use_requires_license.sql` — PASS.
- API `/healthz`, `/readyz` — 200.
- Site `/`, `/journeys/search`, `/healthz`, `/healthz-api`, `/readyz` — 200.
- Admin `/`, `/partners`, `/providers`, `/integrations`, `/audit`, `/healthz-api` — 200.
- Partner `/`, `/organization`, `/integrations`, `/settings`, `/healthz-api` — 200.
- Through each Site/Admin/Partner reverse proxy, `POST /api/v1/auth/refresh` returned the expected unauthenticated 401 — PASS for proxy wiring.
- Temporary containers and network were removed by the smoke command; no user or persistent volumes were attached.

## Limits

- This is a local development-mode smoke using disposable PostGIS/Redis, a local-only session secret and no real provider/auth/payment credentials. It is not staging or production configuration.
- No authenticated user workflow, provider ingestion, live GPS, maps/tiles, TLS/DNS, production secrets, performance, security, backup/restore, rollback or physical iPhone flow was exercised.
- The Site image was built with an empty `VITE_MAP_STYLE_MANIFEST_URL` because no approved immutable map manifest exists. Do not publish or deploy this image until this configuration is supplied and rebuilt.
- All source PRs remain unmerged. Production stays `NOT_RELEASED`; `production_ready=false`.
