# GTFS frontier-state memoization experiment rejected — 2026-10-25

## Experiment

- Isolated Server worktree branch `codex/gtfs-frontier-state-cache-20261025`, based on exact PR #41 SHA `70e11d8d8730e54311f13d73953ab565fd6b432a`.
- Memoized the existing exact `hasPriorEvent` and `hasNextEvent` answers by full event/transfer state, with separate bounded 100,000-entry caches. The transfer predicate and candidate/result ordering were unchanged. Added temporary cache-size diagnostics for measurement.
- Compared the candidate and exact base code in alternating frozen-feed replays on three Lviv OD pairs. The archive SHA was `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; Node was `v25.4.0`.

## Results

- Targeted exact GTFS oracle and transfer tests passed **10/10** with the experiment. This does not establish a production improvement.
- For the eight captured paired measurements, the candidate was faster in six and slower in two. The aggregate mean was about **2.70 s candidate vs 2.74 s base** (roughly 1.4% faster); the effect was not stable enough to establish a useful speedup. One captured pair was slower by about 52%, while the largest observed improvement was about 20%.
- RSS varied substantially between neighboring processes and was not consistently lower for the candidate. No memory improvement is claimed.
- All captured result identity hashes and strategy winners matched the base exactly. Every replay still reported `searchTruncated=true` and `candidateGraphTruncated=true`; the cache did not improve completeness or recall.
- The replay set was incomplete: one of the nine intended paired measurements (Naukova → Sykhiv, pair 1) was not captured in the available output. This further limits any performance conclusion.

## Decision

- **REJECTED; no implementation retained.** The marginal, inconsistent timing difference does not justify additional per-request memory and diagnostics, and it does not address dense-feed truncation.
- The isolated worktree was restored clean to the exact PR #41 base SHA. No commit, push, PR, manifest or release-status change was made.
- Next algorithmic work should batch/index exact reachability states and target candidate-generation completeness. Require complete paired data for all ODs, exact small-feed oracle parity, stable route/winner parity, useful-chain recall, and measured latency/RSS before retaining a change.
- Evidence limits: local Node `v25.4.0`, frozen static Lviv GTFS replay only; not supported-runtime CI, staging, live realtime feeds or production. `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
