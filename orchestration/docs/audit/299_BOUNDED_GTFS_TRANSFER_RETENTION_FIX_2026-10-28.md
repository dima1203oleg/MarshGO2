# Bounded GTFS transfer-retention correction — 2026-10-28

## Reproduction

On a small scheduled feed, the full graph produced one feasible chain (`access-trip → feasible-middle → egress-trip`). Under a deliberately constrained graph budget, a late origin-only trip was incorrectly ranked as connected to the destination frontier and evicted the feasible feeder. A disconnected loop route exercised competition for the fixed global budget. The bounded result lost the oracle journey while correctly reporting graph truncation.

## Cause and change

Retention's temporal hint used `max(minimum buffer, walking seconds)`. The authoritative transfer decision requires the applicable mode buffer plus walking time, then applies a type-2 minimum as a lower bound; type 4 is in-seat and has no walking/buffer requirement. The hint now uses the matching urban/intercity/suburban buffer arithmetic, walking time, in-seat rule, and type-2 minimum. For remaining origin-only endpoint groups, earlier arrival is a bounded tie-breaker so a later feeder cannot displace an earlier potentially feasible feeder; direct-trip priorities are unchanged. Global/per-route graph ceilings remain unchanged, and the complete deterministic hash is retained.

## Verification

- New exact bounded-vs-exhaustive oracle checks the retained journey and rank-1 FASTEST/CHEAPEST/BALANCED winners, while requiring graph truncation to remain explicit.
- Full `tests/gtfs-timetable.test.ts`: 90 passed, 0 failed, 0 skipped.
- Server `tsc --noEmit --pretty false`: PASS.
- ESLint on `server/journey/gtfsTimetable.ts` and `tests/gtfs-timetable.test.ts`: PASS.
- `git diff --check`: PASS.
- Commit `3c14c28` pushed to the existing Server PR #50 branch. Exact-head CI runs `40592341019` and `40592346986` were pending at checkpoint time. Frozen Lviv replay of this SHA is not yet complete.

## Review and release state

Gemini 4 Argon in Antigravity is running a read-only review limited to the changed retention logic and regression. No model quota telemetry was available. PR #50 remains OPEN; no merge or deployment occurred. This fixture result is not production evidence. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Next action

Collect the Argon review and exact-head CI. If CI passes, run the hosted frozen-feed replay on `3c14c28`, compare the three strategy winners and truncation/runtime evidence, and only then decide whether to continue or revise the candidate.
