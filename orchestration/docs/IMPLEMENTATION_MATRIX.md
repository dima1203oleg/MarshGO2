# Implementation and acceptance matrix — 2026-10-26

Status is assigned to the evidence currently present, not to intended work. `TESTED` here means the stated local/fixture scope only; it does not imply production readiness.

| Area | Current status | Evidence / open acceptance |
|---|---|---|
| Root release orchestration | PARTIAL | Exact manifest exists and is `NOT_RELEASED`; current integration HEAD and dirty source are not the pinned integration SHA. |
| Server REST/API core | TESTED (local) | Current dirty source: unit/type/lint and isolated Postgres/PostGIS/Redis suites passed in the latest checkpoint; not deployed. |
| Multimodal GTFS routing | PARTIAL | Tiny-oracle and API regressions exist; frozen Lviv OD searches remain truncated. Completeness and resource/performance gate open. |
| GTFS/GTFS-RT feeds | PARTIAL | Static Lviv archive replayed; observed realtime feeds had no current vehicle/trip updates in earlier probe. Commercial/live city coverage and freshness need per-feed probes. |
| GBFS/micromobility | PARTIAL | Registry/adapters exist; each provider's auth, rights, current availability and booking capability must be independently evidenced. |
| Rideshare/GPS rendezvous | PARTIAL | Consent/session/server foundations exist; full automatic, shared live map and real-device background acceptance are not evidenced end-to-end. |
| Site production UI | TESTED (local fixture) | Typecheck/lint/build/bundle, unit checks and post-locator full browser suite 25/25 passed. Map tiles/provider data in E2E are fixtures. |
| Route map and route-sheet states | TESTED (local fixture, targeted) | Three focused current browser cases passed across visual assertions; full post-fix 25-case run is in progress. |
| Button/control audit | TESTED (local fixture) | Full 25-case rerun clicked 179 production-route controls, zero inert / stale-before-click; conditional and authenticated actions remain separate gates. |
| Admin | PARTIAL | Admin connector/dashboard/partner review API is already in Server PR #42 exact tree `a403a51a…`; Node 24 unit/API integration confirms authorization, redaction and review lifecycle on an identical tree. Separate Admin PR #1 hosted checks pass. Authenticated Admin web-client browser acceptance against one immutable 5+1 tuple remains open. |
| Partner | PARTIAL | Organization onboarding, membership, tenant-scoped reads and role permissions are already in Server PR #42 exact tree `a403a51a…`; Node 24 integration confirms cross-tenant 404 and lifecycle permissions on an identical tree. Separate Partner PR #1 hosted checks pass. Authenticated Partner web-client browser acceptance and operational workflows against one tuple remain open. |
| iOS | PARTIAL | Simulator launch previously observed on a different embedded Site SHA; exact current Site sync, physical device, background GPS, APNs/signing remain open. |
| Provider booking / payments | BLOCKED_EXTERNAL / PARTIAL | No provider credentials/contracts or live commercial booking acceptance established; do not simulate payment or inventory. |
| Staging / production deployment | BLOCKED_EXTERNAL | No verified staging URL/deployed SHA in current manifest; production rollout requires separate owner approval. |
| Security / privacy acceptance | NOT_TESTED (full gate) | Local code/tests and historic Admin role-denial tests exist; complete adversarial RBAC, cross-tenant isolation, GPS privacy, upload, account export/deletion and hosted security acceptance open. |
| Load / recovery | NOT_TESTED (full target) | 1,000 RPS and WebSocket targets are objectives only; backup/restore and rollback evidence not closed. |

## Release conclusion

There is no defensible overall percentage. The product is not a production-ready release: exact source tuple, routing completeness, authenticated Admin/Partner, provider rights, staging, device, security, load, recovery and rollout gates remain open. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.
