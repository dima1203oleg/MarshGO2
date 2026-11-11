# Lviv stop-cap A/B: 48 vs 64 per side

Date: 2026-10-21 UTC  
Server code: PR #24 exact test candidate `c33651b1387e0d2b377216a0b88f6ae02cdbec32`  
Feed: static Lviv GTFS ZIP SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`

## Setup

- Frozen query from «Малоголосківська (813)» (`24.008217, 49.864885`) to «Центр Довженка (455)» (`24.057532, 49.794657`).
- Departure window `2026-10-22T19:07:53Z`–`2026-10-22T20:37:53Z`; 3-hour journey horizon and wait bound; at most 2 transfers; access/egress/transfer walk limits 900/1,000/400 m.
- Node `24.21.0`; current route-pattern quota is 8. Only the absolute stop-selection cap was varied. One fresh process per measurement; latency and RSS are single-run diagnostics, not performance percentiles.

## Result

| Absolute stop cap per side | Origin/destination stops selected | Candidate routes | Search steps | Returned chains | Search flags | Search time | RSS at end |
|---:|---:|---:|---:|---|---|---:|---:|
| 48 | 27 / 35 | 34 | 5,734 | `А47 → Т08`; `А52 → А47 → Т08` | candidate sampling truncated; search truncated | 612 ms | 519,487,488 bytes |
| 64 | 27 / 35 | 34 | 5,734 | `А47 → Т08`; `А52 → А47 → Т08` | candidate sampling truncated; search truncated | 603 ms | 539,475,968 bytes |

Both runs built 8,208 segments, had the same transfer/reachability counts and returned the same four itinerary variants (two stop-level variations for each of the two route chains). The higher cap did not select additional stops or recover a route; the downstream candidate sampler remained the binding truncation source. The small latency/RSS difference is within the uncertainty of one process run.

## Decision

Reject raising `MAX_STOPS_PER_SIDE` from 48 to 64 for this case. It adds no route recall, does not clear `searchTruncated`, and has no demonstrated resource benefit. Keep the current bound and the UI/API partial-results signal. A future selector change must target candidate sampling using schedule time, direction and transfer feasibility, preserve existing Pareto/objective winners, and pass multi-corridor recall plus repeated latency/memory checks.

This is a static snapshot experiment, not live-feed, staging, or production acceptance. No production code was changed by this experiment.
