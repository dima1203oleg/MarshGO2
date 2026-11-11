# Architecture audit — 2026-10-23

## Intended ownership

The accepted 5+1 boundary is coherent: Server owns API, auth, journeys, booking, routing, feeds, cache and data; Site owns the single Web/PWA client; iOS wraps a pinned Site build; Admin and Partner are separate frontends using Server authorization/business logic; MarshGO orchestrates exact SHAs, images, deployment and rollback.

## Observed alignment and gaps

1. The root repository currently contains a full `src/`, `server/`, `shared/`, `ios/`, and tests in addition to release tooling. This is legacy/umbrella functionality and can drift from the separately owned Server/Site/iOS trees. Keep it as a build/test workspace only where the manifest explicitly requires it; do not treat root source as a second canonical product implementation.
2. Local active work is not aligned to the manifest: root `39a18209...`, Server `182c77ae...`, Site `6961afcf...`, iOS `4353cec3...`, while Admin/Partner are detached materializations. These trees are dirty/clean in mixed states and need non-destructive reconciliation before claiming an integrated candidate.
3. Current root manifest pins API v1 and migration 055, but no staging host/API origin is configured or verified. Root PR #5/#6 CI cannot materialize private Admin/Partner without the required read-only token.
4. Current feed evidence is capability-specific. GTFS static schedules/geometry, GTFS-RT vehicle positions and trip updates, GBFS availability, fares, booking and live tracking are different claims. A healthy catalog endpoint does not prove commercial permission, coverage, booking, or vehicle-route matching.
5. The documented dense Lviv replay still reports truncated search for all tested OD/transfer combinations. Several newer routing prototypes were explicitly rejected on candidate/winner retention. Keep `searchTruncated` visible and do not claim complete optimality until a candidate passes exhaustive tiny-feed oracles and frozen real-feed replay.
6. Browser E2E and hosted exact-SHA checks exist, but are fixture/local CI evidence. The current manifest and audit report strict visual mismatch/unavailable licensed map resources; no physical iPhone, owner-controlled staging, backup/restore, production smoke or deployment SHA is verified.

## Trust boundary

Root `RELEASE_MANIFEST.json` is the release pin source, but a release is valid only after each referenced commit is materialized and all exact-tuple gates pass. Open PRs are candidates, not integrated production. Local dirty checkouts are development evidence, not the immutable candidate. Secret values are never read into reports.
