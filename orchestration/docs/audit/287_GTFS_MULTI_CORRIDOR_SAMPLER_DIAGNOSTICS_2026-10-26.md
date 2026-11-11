# 287 — Multi-corridor GTFS sampler diagnostics and order-sensitivity probe

## Reproducible inputs

- Server checkout: `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; preserve its pre-existing dirty worktree.
- Frozen archive: `/tmp/marshgo-lviv-gtfs-current-20261025.zip`, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Runtime: Node `v25.4.0`; timing and RSS are single-run diagnostics, not supported-runtime performance evidence.
- Replayed exact Naukova→Sykhiv and Rynok→Dubliany coordinates recorded in audit 176 using `MARSHGO_GTFS_SEARCH_DEBUG=1` and `scripts/replay-lviv-gtfs.mts`.

## Results at unchanged serving caps

| Corridor | Ordered result hash | Trip / route chains | Steps | Max queue / 10k | Sampling events: pool / trip / route / global / replacement | Truncated |
|---|---|---:|---:|---:|---|---|
| Naukova→Sykhiv | `fe39dcd31269de4f43df03129f0c5c8b67ce5f792978399ead639070cf9601d4` | 58 / 41 | 94,745 | 4,205 | 4,210 / 10,198 / 8,434 / 0 / 2,950 | yes; graph 194,024→100,000 and search sampling |
| Rynok→Dubliany | `db4a6ec11cd1dacb2af253ab61739054d1819e2ac501ed3f8672b2e571ae9661` | 66 / 36 | 226,336 | 5,774 | 1,794 / 18,154 / 64,995 / 0 / 3,350 | yes; graph 262,267→100,000 and search sampling |

Both ordered hashes and trip/route-chain counts exactly match audit 282. The queue limit is not binding. Candidate sampling and the 100k graph ceiling remain binding; omitted alternatives differ by corridor, so a one-corridor cap adjustment is not justified. FASTEST/CHEAPEST/BALANCED winners reproduced as in audit 282. RSS observed around 599 MB for Naukova and 541 MB for Rynok at the end of the sampled stages; these are not peak or load-test guarantees.

A nearby exploratory O/D was initially used in place of exact Naukova coordinates and is excluded from the table and conclusions. It is not evidence for the named corridor.

## Incremental sampler order probe

On 32 synthetic variants derived from one valid small-feed itinerary, `sampleGtfsRouteChainCandidates` was repeatedly applied as an incremental bounded accumulator with cap 8. Cycling candidate arrival order produced **two distinct final retained sets**. The sampler reevaluates locally normalized BALANCED rank over only the retained set plus the arriving item. This does not prove the deterministic current search traversal is nondeterministic or that a current city strategy winner is wrong. No serving code changed.

Follow-up oracle: added a regression test with 32 varied synthetic itineraries. It checks all 32 cyclic arrival orders and confirms that FASTEST, CHEAPEST, and BALANCED winners of the complete fixture each survive every incremental cap-8 sample. The test passes. The secondary retained sets still need not be identical; the test establishes winner retention for this fixture, not universal sampler completeness.

## Next experiment

Build a bounded per-route candidate oracle with fixed, order-independent objective witnesses (FASTEST, CHEAPEST when fare is known, fewest transfers, least walking) and a separately specified BALANCED policy. Compare every permutation on the synthetic fixture, then verify exhaustive identity and all three strategy winners on small feeds with fares, service dates, transfer rules, pathways and realtime. Do not change serving behavior until the oracle establishes a useful diversity/recall gain within existing memory caps; retain truthful truncation. Do not increase graph, search, or candidate caps based on these diagnostics.

Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Deterministic permutation regression update

The sampler regression was strengthened without changing serving code. It now checks five **distinct** objective witnesses (FASTEST, CHEAPEST, BALANCED, minimum transfers and minimum walking) across the 32 cyclic arrival orders and 64 deterministic seeded shuffled orders on the same 32-item synthetic fixture. Targeted test result: 1 PASS / 0 FAIL / 0 SKIP. This is bounded fixture evidence only; it does not guarantee order-independent retained-set identity or completeness for arbitrary feeds. Next: run the full GTFS timetable and journey-search completeness test slice, then record the exact results.

## Verification update

- `node --import tsx --test --test-name-pattern='streaming route-chain sampling retains objective witnesses across candidate arrival orders' tests/gtfs-timetable.test.ts`: 1/1 PASS (five distinct objective witnesses, 32 cyclic plus 64 deterministic seeded shuffled orders).
- `npm run typecheck`: PASS.
- `node --import tsx --test tests/gtfs-timetable.test.ts tests/journey-search-completeness.test.ts`: 82 PASS / 0 FAIL / 0 SKIP (28.2 s).
- No production routing behavior changed. The Server tree remains dirty; no files were staged, committed, pushed, or deployed.

Latest verification reran `node --import tsx --test tests/gtfs-timetable.test.ts tests/journey-search-completeness.test.ts`: 82 PASS / 0 FAIL / 0 SKIP, 31.1 s. This is a fixture/unit regression result, not live-feed, staging, or production acceptance.

Antigravity's adversarial review found that the earlier synthetic data let the fastest, fewest-transfer and least-walking criteria collapse onto the same candidate, leaving unused sample slots and weakening the check. The fixture now gives all five criteria distinct winners and explicitly asserts five unique witness IDs. The revised targeted test passes; rerun the GTFS regression slice after this test-only change.

## Antigravity retention-tier review and rejected change

Antigravity suggested that tier 0 required a *single* segment serving both query endpoints. Inspection showed the current code classifies a **trip group**: it may contain multiple boarding/alighting alternatives, which can matter for a loop trip and downstream transfer chains. A temporary tested variant requiring the same segment to serve both endpoints was A/B replayed against the exact old classifier on the same frozen archive and O/Ds. It kept all three strategy winners unchanged, but reduced the retained itinerary diversity in every corridor:

| Corridor | Baseline trip / route chains | Same-segment experiment | Winner identities | Decision |
|---|---:|---:|---|---|
| Holosko→Sykhiv | 63 / 45 | 63 / 44 | unchanged | reject |
| Naukova→Sykhiv | 58 / 41 | 52 / 34 | unchanged | reject |
| Rynok→Dubliany | 66 / 36 | 61 / 32 | unchanged | reject |

The experiment remained truncated in all cases and did not lower graph/search caps or improve any strategy winner. Its serving change and corresponding mistaken unit assertion were removed. Exact baseline hashes reproduced audit 282. The retained-group semantics are now clarified by a code comment; a separate 32-order streaming sampler winner test remains.

After restoring the old grouping policy, `node --import tsx --test tests/bounded-trip-retention.test.ts tests/gtfs-timetable.test.ts tests/journey-search-completeness.test.ts` passed **89/89, 0 skipped**; `npm run typecheck` and Server/root `git diff --check` passed. No staging, provider calls, commit, push or deployment occurred.
