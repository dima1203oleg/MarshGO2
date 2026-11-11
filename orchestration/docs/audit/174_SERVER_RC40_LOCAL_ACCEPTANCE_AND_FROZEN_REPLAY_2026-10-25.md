# Server RC40 local acceptance and frozen Lviv replay — 2026-10-25

## Exact candidate

- Isolated Server worktree: `/private/tmp/marshgo-gtfs-additive-discovery-20261025`.
- Exact commit: `38f17b88f98c8530f8090cfc6745cd334c87e53c` (merged current GTFS route candidate stack).
- `server/journey/gtfsTimetable.ts` SHA-256: `894281dd3771879a37f482bb16d44fc80d35803f28c2afbe0c359676f19cc7e8`.
- Runtime: Node `v24.21.0`.
- No tracked source change was made in this acceptance pass.

## Frozen-feed replay

- Lviv GTFS SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; 72 routes, 1,071 stops, 15,716 trips.
- Three ODs, 30-minute departure window, six-hour horizon, two transfers, 100 returned itineraries; five repeats per OD.
- Exact RC40 median latency and returned-chain counts versus the previously measured dirty feature branch baseline:

| OD | Trip chains | Route chains | Median latency | Winner comparison | Truncated |
|---|---:|---:|---:|---|---|
| Малий Голоско → Сихів | 44 → 60 | 31 → 43 | 1,307 → 2,659 ms | RC40 FASTEST/CHEAPEST/BALANCED: 54 → 47 min; both 23 UAH, one transfer; walk 802 → 714 m | Yes, both |
| Наукова → Сихів | 52 → 57 | 41 → 40 | 707 → 1,731 ms | RC40 FASTEST: 33 → 35.5 min; both 23 UAH and one transfer, walk 398 → 340 m. The candidate missed the faster baseline itinerary. | Yes, both |
| площа Ринок → Дубляни | 38 → 57 | 24 → 32 | 954 → 2,927 ms | All three unchanged | Yes, both |

The candidate is deterministic over its five repeats and exposes more trip-chain alternatives, but costs materially more latency. Its 47-minute Holosko FASTEST is a valid improvement over the 54-minute baseline under the tested fare/transfer values; on Naukova it loses a valid 33-minute baseline and returns 35.5 minutes instead, despite 58 m less walking. Therefore the bounded candidate set still regresses a tested fastest objective and must not replace/purge the baseline pool. Every query still reports truncation.

One diagnostic run on RC40 reached 100,000 of estimated 194,024–415,997 stop-pair segments per query, evaluated 97,326–195,983 search steps, and reported graph and/or candidate sampling truncation. Peak observed `heapUsedBytes` reached about 924 MB during Rynok→Dubliany; this is a single-process high-water observation, not a load-test or peak-RSS claim. It warrants memory profiling before a production workload claim.

## Local verification

- Full Server unit suite: **315 PASS, 0 FAIL, 3 opt-in integration SKIP**.
- TypeScript typecheck: **PASS**.
- ESLint: **PASS**.
- Full opt-in Server integration suite: **30 PASS, 0 FAIL, 0 SKIP** on temporary PostGIS 17 + Redis 7.4 containers with tmpfs data and isolated loopback ports. This includes clean migrations through `055_provider_commercial_use`, journey schema, live-journey ownership/unavailable response, bookings, 20-way last-seat race, cancellation/editing, partner tenant isolation, navigation, two-instance realtime, restart durability and shared Redis rate limiting.
- The temporary test containers were removed by the runner trap. Existing `marshgo-db-1` and `marshgo-redis-1` remained running and untouched.
- This is local isolated evidence only: no staging, live provider, physical device, production deployment, load, backup/restore or rollback proof.

## Decision

RC40 is the strongest exact Server candidate measured in this pass for trip-chain variety, but it is **not accepted as a replacement**: the Naukova replay demonstrates loss of the fastest observed itinerary. Preserve baseline objective candidates and discover alternatives additively. Keep candidate truncation visible. Before promotion, retain every baseline strategy winner, compare fares/walking/transfers and duration, obtain repeated latency and memory profiles, and prove exact feasible-chain parity against the exhaustive small-feed oracles. Cross-repository exact-SHA compatibility and release gates remain separate. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
