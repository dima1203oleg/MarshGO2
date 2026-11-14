# Exact RC.6 integrated image stack — 2026-10-24

## Pinned source tuple

| Component | SHA | Local OCI image digest |
|---|---|---|
| Server | `134ed017828a020e1d5f696b3cb9ea95527bb093` | `marshgo/api:RC-2026-10-24-review.6` — `sha256:a0d676c3a3ded9daffb8c1bd1e85ee8879ffc3c3937985f128bf5697e509b7ab` |
| Site | `10454f37b59a848e4a5b381689dfe7f701fe2b81` | `marshgo/web:RC-2026-10-24-review.6` — `sha256:6790304d9a7fc46df972765ff453d402e83720a94fcccbd7a889b8e2a8763b20` |
| Admin | `bc37198ca139408907aaefa0d97dc9b60a568300` | `marshgo/admin:RC-2026-10-24-admin-bc37198` — `sha256:a4668ffc8d7d516a40fa79f7d1d1db19ded6bcba9ee58781d4b8157620f66633` |
| Partner | `97a3727cc395dea092af6e3e24d6822370c2bc63` | `marshgo/partner:RC-2026-10-24-partner-97a3727` — `sha256:9a5f3c25a4f26172b8603c251bfba44e40594c83f1006c29aef869d57a3595b5` |

All four images are local OCI artifacts for `linux/arm64`; none was published.

The integration workspace `MarshGO` at HEAD `8741bd1936115941386148104dff130525aa5f5d` also passed `npm run check:production`: typecheck, ESLint, 256/256 unit tests (one opt-in integration test skipped), Vite production build and the 51-chunk gzip budget. The workspace is dirty, so this validates the current working tree and is not an immutable CI artifact.

## Integrated smoke

- Disposable PostGIS 17-3.5 and Redis 7.4, no persistent volumes; PostGIS ran as linux/amd64 under emulation on the ARM host.
- Fresh database migrations from empty schema through checked-in migration 055: PASS.
- Exact Server image became ready: `/healthz` and `/readyz` returned 200.
- Exact Site image: `/`, `/journeys/search`, `/healthz`, `/healthz-api` returned 200.
- Exact Admin image: `/`, `/partners`, `/providers`, `/integrations`, `/audit`, `/healthz`, `/healthz-api` returned 200.
- Exact Partner image: `/`, `/organization`, `/integrations`, `/settings`, `/healthz`, `/healthz-api` returned 200.
- Site/Admin/Partner `/api/v1/auth/refresh` each reached the Server and returned 401 for the intentionally unauthenticated smoke request (expected; verifies proxy connectivity rather than auth success).
- All six temporary containers and the temporary Docker network were removed. Existing development containers and volumes were not modified.

## Boundary

This proves local image build and container/proxy wiring on one ARM host. The stack ran with development authentication and real provider/realtime jobs disabled. It is not production configuration, staging, authenticated whole-product E2E, external provider acceptance, load/security/recovery testing, HTTPS/DNS, backup/restore, rollback, or production deployment. Release remains `NOT_RELEASED`; `PRODUCTION_READY=false`.
