# Exact release PR/CI and local environment recheck — 2026-10-25

## Exact candidate tuple and hosted checks

Read-only GitHub queries confirmed the review tuple recorded in the root release manifest:

| Component | PR / exact head | Hosted checks |
|---|---|---|
| Server | PR #40, `38f17b88f98c8530f8090cfc6745cd334c87e53c`, based on #39/#38 | 40157715218, 40157852445 — PASS |
| Site | PR #25, `7aed5344218058b024f5c269b36b03577d94026e`, based on #24 | 40163677847, 40163680187 — PASS |
| iOS | PR #14, `7dfd35bf5f06169d7df82fa8d0879fcaf02431b5` | 40163988537, 40163992039 — PASS; workflow pins the exact Site and Server SHAs above |
| Admin | PR #1, `f39c4b74839a393f4487c830930669eabc8c0390` | 40162633629 — PASS |
| Partner | PR #1, `97a3727cc395dea092af6e3e24d6822370c2bc63` | 40126462889 — PASS |
| Integration | PR #5, `0d068f7104d3cdedde9edb57a1be781df5e86491` | Run 40164409617 fails closed while configuring access to private Admin/Partner source; CodeQL and Gitleaks pass |

The integration verifier cannot materialize the two private portal repos without the least-privilege Actions secret `MARSHGO_REPOS_READ_TOKEN`. Docker/E2E stages are skipped as a result. No gate was bypassed. Exact local component images were previously built but remain unpublished; image evidence is tied to integration source `0d3ed4accecbb5623f0c20c55c69ff0f23f14a4d`. There are no Docker/Compose input changes from that source commit through integration HEAD `0d068f7`.

The root `RELEASE_MANIFEST.json` had stale `source_repositories` descriptions despite its current top-level pins. Those descriptions now match the exact PR tuple and ancestry. `docs/RELEASE_MANIFEST.json` is a historical RC.9 snapshot and remains unchanged at its original matching pins. Release status stays `NOT_RELEASED`; this repair is manifest consistency, not a release approval.

## Current local environment

- Docker Desktop server version 29.7.2 responds. Existing `marshgo-db-1` (PostGIS) and `marshgo-redis-1` containers report healthy; no container, volume, image or database was modified.
- No listener responds on local web/API ports 3000, 4301 or 3002. The saved zrok browser tab reports Bad Gateway; the localhost tab cannot connect.
- `.env.staging.local` contains no `KEY=value` entries. The local `.env` has development DB/cache and routing/geocoding settings, while Twilio and required map-manifest/session values are unset or placeholders. Values were not printed or copied into the report.
- No verified staging hostname, API origin, deployed SHA or staging credentials are available. Local development services and a previously tested local container are not staging evidence.

## Current blockers and next work

1. Additive dense-feed GTFS discovery remains an engineering problem. Existing weighting, overflow and event-queue schedulers were rejected because they lost baseline candidates/winners or exceeded the latency/memory budget. Preserve `searchTruncated` and `candidateGraphTruncated`.
2. Hosted central materialization needs the authorized read-only Actions token for the two private portal repos.
3. Staging needs an authorized host/domain/API origin and real runtime secrets. Production configuration also needs approved licensed map/geocoding/routing endpoints, SMS credentials and object-storage settings.
4. Provider commercial rights, physical iPhone/background GPS/APNs/signing, security/load/recovery, backup/restore, rollback rehearsal and final owner approval remain open.

No production deployment was made. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
