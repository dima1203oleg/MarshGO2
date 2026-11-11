# GTFS-Realtime TripUpdate freshness — 2026-10-21

## Finding

The Server parser previously accepted a GTFS-Realtime feed and each individual TripUpdate up to five minutes old. The release policy and GTFS Realtime best practice require Trip Updates to be no more than 90 seconds old. A fresh feed header alone is insufficient: an individual TripUpdate can be stale inside a recently refreshed feed.

## Change

Server PR [#22](https://github.com/dima1203oleg/MarshGO-Server/pull/22), branch `codex/gtfs-freshness-90s-20261021`, commit `d66805cfd3223511f06b0d3d412ba1e244273a16`:

- Sets the maximum accepted feed and entity age to 90 seconds.
- Keeps scheduled GTFS as the fallback when the feed or individual TripUpdate is stale; stale data is not used as a prediction.
- Adds regression cases for the inclusive 90-second boundary, 91-second stale feed, and a 91-second stale entity inside a fresh feed.
- Fixes a nondeterministic fixture test by setting an explicit `now` instant.
- Updates the transitive `markdown-it` dependency from 14.3.2 to 14.3.3 in the lockfile.

## Verification

### Live read-only observation

The existing `safeFetch` boundary queried the public Lviv TripUpdates feed at `2026-10-21T14:46:28.081Z`. The response had 769 TripUpdates and a FeedHeader age of 9 seconds. Of those updates, 751 were no more than 90 seconds old and 18 exceeded the limit. Update age distribution: p50 29s, p90 55s, p95 69s, maximum 924s.

This is one time-bounded public-feed observation. It does not establish provider SLA, route/trip matching coverage, staging behavior, or production readiness.

### Exact candidate local checks

On Node 24.21.0 at the exact PR candidate source:

- Full Server suite: **276 PASS / 0 FAIL / 3 opt-in integration SKIP**.
- TypeScript typecheck: PASS.
- ESLint: PASS.
- Full npm audit and production-only audit: **0 vulnerabilities**.
- `git diff --check`: PASS.

The skipped integration tests require optional local infrastructure. Docker-backed PostgreSQL/PostGIS and Redis tests were not run. Both exact-head hosted `verify` workflows and CodeQL/Gitleaks checks pass. The PR remains draft and is stacked on open PR #21; this is not a deploy or staging acceptance.

## References

- [GTFS Realtime Best Practices](https://gtfs.org/documentation/realtime/realtime-best-practices/)
- [GTFS Realtime Reference: TripUpdate timestamp](https://gtfs.org/documentation/realtime/reference/)

