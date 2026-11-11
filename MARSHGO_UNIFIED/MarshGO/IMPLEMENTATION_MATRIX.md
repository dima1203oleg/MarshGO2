# Implementation and acceptance matrix — 2026-10-23

Status reflects evidence currently present in the scoped repository and exact-SHA checks, not a percentage estimate.

| Area | Evidence / status | Remaining acceptance |
|---|---|---|
| Release orchestration | Exact pin manifest exists, says `NOT_RELEASED`; `BLOCKED_EXTERNAL` for private repo materialization. | Configure authorized read-only Admin/Partner checkout credential; build and verify one exact six-repo tuple and image digests. |
| Server API / DB | Server PR #31 exact hosted verify PASS; migration CI through 055 documented PASS. Local Server checkout is dirty and on another SHA. | Revalidate exact candidate against migration clean install/upgrade, live configured dependencies and staging. |
| Multimodal routing | GTFS schedule, transfer, scoring and live-feed code/tests exist. Frozen Lviv searches remain `searchTruncated`; competing algorithms have failed oracle/replay tests. | Keep incomplete status; produce an algorithm that passes exhaustive oracle, candidate/winner retention, bounded time/heap, repeated Lviv replay. |
| GTFS/GTFS-RT | Feed probes and parser/route tests exist. Latest cited probe had low/zero fresh vehicle observations in several cities; matching/rendering not proved. | Fresh repeated probes, route/direction match, stale behavior, city-specific coverage, staging UI. |
| GBFS / micromobility | Registry/adapters and catalog smoke evidence exist. `HEALTHY` catalog does not prove current inventory or reserve/ride capability. | Provider-by-provider licenses, auth, live station/vehicle availability, freshness, actual UI and booking/deep-link capability. |
| Site / route UX | Site PR #18/#19 exact hosted checks PASS; route-map browser tests and design audit exist. Root manifest pins older Site SHA. | Rebase/resolve full PR stack; verify all six design states in both themes against supplied mocks; fix map assets/style and strict visual discrepancies; full Site checks. |
| GPS / rendezvous | Consent/privacy and booking-scoped rendezvous candidates exist in PR stacks. | Two-sided foreground GPS, route approach/ETA, stale/permission loss/reconnect acceptance with real authorized devices; no fabricated location. |
| Booking / marketplace | Server integration history includes Postgres/Redis booking/race/ownership checks on exact prior candidates. | Re-run on one exact current tuple; real SMS/payment/provider configuration, cancellation/rebooking, two-account E2E. Do not simulate financial settlement. |
| Admin / Partner | Exact P0 PR heads have hosted verify SUCCESS; local copies are detached snapshots with local untracked deployment files. | Materialize exact heads in root CI; test RBAC/tenant isolation against same Server tuple; confirm all actions are real and not decorative. |
| iOS | iOS PR #12 Simulator CI SUCCESS and exact pin workflow exists. | Align with final Site/Server SHA; physical iPhone, permission/background GPS, push, resume/deep-link, signed distribution/TestFlight remain NOT_TESTED. |
| Security | CodeQL/Gitleaks pass on some exact PRs; root umbrella verify fails. | Complete root exact tuple, auth/tenant/CSRF/CORS/upload/GPS privacy, dependency and operational security acceptance. |
| Staging / production | No verified staging URL, API origin, GitHub deployment/environment or deployed SHA; status NOT_RELEASED. | Owner-controlled staging, HTTPS and live API/provider acceptance, backup/restore/rollback, production artifact and owner approval. |

Evidence references: `docs/audit/85_STAGING_DEPLOYMENT_CAPABILITY_2026-10-23.md`, `docs/audit/89_TRANSPORT_FEED_RECHECK_2026-10-23.md`, `docs/audit/95_USER_MOCK_DESIGN_AUDIT_2026-10-23.md`, `docs/audit/96_TRANSPORT_FEED_SMOKE_2026-10-23.json`, and current `RELEASE_MANIFEST.json`.
