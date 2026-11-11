# Current dirty Server routing acceptance — 2026-10-25

## Exact source boundary

- Canonical Server worktree: branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, with 18 modified and 19 untracked paths at start of this check. The executed source includes these local changes and is **not** the same as its committed HEAD or PR #42.
- GitHub read-only recheck: Server PR #41 is OPEN/DRAFT, head `70e11d8d8730e54311f13d73953ab565fd6b432a`, base PR39 integration SHA `38f17b88f98c8530f8090cfc6745cd334c87e53c`. PR #42 is OPEN/DRAFT, head `a403a51a203d9d89685c10c69658c8fd95b70e9b`, based on #41. No branch, PR, or manifest was changed.
- Local replay used frozen GTFS archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (72 routes, 1,071 stops, 15,716 trips) and runtime Node `v25.4.0`; package pin is Node `24.21.0`. Replay timings are diagnostic, not supported-runtime performance claims.

## Local verification of current dirty Server source

- Focused GTFS timetable/worker/realtime/ranking: **69/69 pass**, 0 skip.
- Full Server unit suite: **233 pass, 0 fail, 1 opt-in integration skip**.
- TypeScript typecheck: PASS. ESLint full server/tests: PASS.
- Full isolated integration workflow: **29/29 pass** across DB migrations/PostGIS, Journey schema, live Journey ownership, booking and last-seat concurrency, trip edit/cancel lifecycle, foreground navigation/GPS deletion, Redis realtime across API instances, booking restart durability, and shared Redis rate limiting. Only loopback `marshgo_e2e` database and existing healthy Postgres/Redis services were used; test API processes exited afterward.
- This verifies the current dirty server implementation locally. It does not bind those results to an immutable candidate SHA or production/staging environment.

## Frozen Lviv routing replay

The current dirty worktree's direct `findGtfsItinerariesWithStats` replay returned 100 results for each 05:00–05:30Z OD. Ordered result hashes were stable in the replay. All three report `searchTruncated=true` and `resultLimitReached=true`:

| OD | Origin/destination stops | Corridor stops | Materialized segments | Search steps | Candidate results (1/2/3 legs) | Truncation causes |
|---|---:|---:|---:|---:|---:|---|
| Малий Голоско → Сихів | 20 / 20 | 423 | 415,180 | 6,822 | 0 / 200 / 200 | stop selection, depth search budget, candidate sampling |
| Наукова → Сихів | 16 / 20 | 233 | 194,355 | 5,931 | 38 / 200 / 200 | stop selection, depth search budget, candidate sampling |
| площа Ринок → Дубляни | 20 / 14 | 364 | 263,812 | 10,230 | 8 / 200 / 200 | stop selection, depth search budget, candidate sampling |

The global 50,000 search-step ceiling was not reached. The active search cutoff is per-depth budget plus candidate sampling, while stop selection also drops alternatives. Do not raise bounds blindly or report complete search. Existing audits 164, 182 and 195 record rejected time-window, label-enumeration and topology-pruning paths; they must not be repeated without a materially different bounded design.

## Decision / next action

- The current source passes local correctness and DB/Redis integration gates, including exhaustive tiny-feed one-/two-transfer strategy oracles; dense real-feed completeness remains FAIL/OPEN because each tested corridor is truncated.
- Continue from the existing small-feed oracle and the exact PR #41/#42 candidate ancestry. A new candidate must preserve all baseline journey IDs and FASTEST/CHEAPEST/BALANCED winners, add useful feasible-chain recall, maintain GTFS calendars/time zones/pathway/transfer/pickup/drop-off/fare rules, and show bounded memory and supported-Node performance before integration.
- Keep the current dirty worktree untouched until ownership is reconciled. No commit, merge, force-push, deployment or release-manifest promotion was made.
- `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Exact PR #42 candidate baseline — 2026-10-25

- An isolated worktree at `/private/tmp/marshgo-gtfs-destination-search-20261025` was checked out detached at PR #42 exact SHA `a403a51a203d9d89685c10c69658c8fd95b70e9b`; the dirty canonical Server tree was not changed.
- Targeted timetable and exhaustive calendar/realtime/transfer-oracle suites passed **77/77** (Node `v25.4.0`). This correctness check includes pathways, transfer prohibitions/minimum times, service dates, cancellations, fare semantics, and all three ranking winners on the tiny feed. Node 25 results are not supported-runtime performance proof.
- Three repeated frozen Lviv O/D runs returned stable ordered-ID hashes, but every query remained `searchTruncated=true` and `resultLimitReached=true`. Hashes: Holosko–Sykhiv `8c6a34794c534462cf24873d5c17fd1c8fe2d15c07a558a6d65e68e0ac4ce2ac`; Naukova–Sykhiv `fe39dcd31269de4f43df03129f0c5c8b67ce5f792978399ead639070cf9601d4`; Rynok–Dubliany `3f7c5120913cc2ded010633bf137e1d0ee8cd4fbebd87f85d026e136b12270ce`.
- Per-run diagnostic elapsed ranges were 2.16–2.59 s, 1.69–2.05 s, and 3.44–4.05 s respectively on Node 25.4.0. These timings are exploratory only; the runtime is unsupported and no peak-memory claim is derived from them.
- Repeated on the declared Node `v24.21.0` runtime: the same three hashes and all same FASTEST/CHEAPEST/BALANCED winner identities were preserved. Three-run elapsed ranges: 2.38–3.62 s, 1.61–2.06 s, and 3.07–3.20 s. The search remains truncated, so deterministic repeats do not establish completeness.
- Exact PR #42 debug replay attributes incompleteness to all three of graph cap, per-depth search budget and candidate sampling; stop selection was not truncated in this exact checkout. Estimated graph demand vs retained cap: Holosko 415,997/100,000; Naukova 194,024/100,000; Rynok 262,267/100,000. Node 24 debug samples reached 100,000 graph segments for every OD; the highest sampled RSS was 563 MiB and highest sampled V8 heap was 905 MiB while the replay ran two serial searches per OD. These are sampled process readings, not isolated-peak or concurrency/load evidence. Exact per-OD counters are in `203_PR42_NODE24_DEBUG_SUMMARY.json`.
- The exact candidate was then re-run on Node `v24.21.0`: the same 77 GTFS timetable/oracle tests passed 77/77. `git diff --check` and source status remain unchanged in the detached candidate worktree except for its pre-existing untracked `node_modules` symlink.
- Full exact-candidate Server unit suite on Node `v24.21.0`: **316 passed, 0 failed, 3 opt-in integration tests skipped**. Local exact-candidate `tsc --noEmit` and ESLint `server tests` also passed. The three skipped tests are exercised by hosted CI integration stages, not counted as local passes.
- GitHub PR #42 CI was rechecked by SHA and job steps: runs `40222929785` and `40222932837` both completed successfully on exact SHA `a403a51a203d9d89685c10c69658c8fd95b70e9b`. Both ran dependency audit, lint, typecheck, full unit tests, database migrations, integration tests, production API image build, and PostGIS/Redis API-image smoke. This is hosted CI evidence for the Server candidate, not a staging deployment or route-completeness proof.
- Decision: do not alter or promote PR #42. Stable, bounded results remain explicitly incomplete. Next experiment must change how query-relevant candidates are selected, preserve the current exact transfer authority and all tiny-feed oracle winners, improve useful-chain recall on all frozen O/D pairs, and report bounded memory plus supported-runtime measurements. Existing rejected variants listed above remain rejected.

## Conservative early-transfer-bound experiment — 2026-10-26

- Experiment ran only in the detached PR #42 worktree above. It moved the departure lower-bound binary search forward by the default transfer buffer when the feed contained no type-4 in-seat transfer rule; when any type-4 rule existed, it retained a zero lower bound. Canonical dirty Server source, branches, PRs and manifest were not changed.
- Full exact-candidate unit suite on Node `v24.21.0`: **316 passed, 0 failed, 3 opt-in integration skips**. Typecheck and ESLint had passed before this narrowly scoped edit; the full suite was repeated after it. The targeted timetable oracle had already passed 77/77 before the experiment and the exact semantic behavior was not proven equivalent for dense replay.
- Three alternating paired frozen-feed replays showed mixed median latency: Holosko–Sykhiv 3449→3013 ms, Naukova–Sykhiv 1982→2130 ms, Rynok–Dubliany 3585→3442 ms. FASTEST/CHEAPEST/BALANCED winners stayed the same, but returned 100-item result sets changed materially: each OD had 9–24 baseline-only and 9–24 candidate-only journeys. Every replay remained `searchTruncated=true` and `resultLimitReached=true`; no recall/completeness improvement was demonstrated. Timings are local serial measurements and not capacity/load evidence.
- **Decision: rejected and reversed.** Mixed timing, substantial result-set replacement, and unchanged truncation do not meet the acceptance bar for a performance-only pruning change. The isolated worktree source was restored to exact PR #42 SHA `a403a51a203d9d89685c10c69658c8fd95b70e9b`; its only remaining untracked path is the pre-existing `node_modules` symlink. No commit, PR update, merge, push, deployment or manifest change.
- Next: retain exact transfer semantics and evaluate a bounded destination-directed candidate discovery design against the exhaustive small-feed oracle before any dense replay. Require no unexplained loss of baseline IDs/winners, useful feasible-chain recall on all three frozen O/D cases, and bounded supported-runtime memory/performance. Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
