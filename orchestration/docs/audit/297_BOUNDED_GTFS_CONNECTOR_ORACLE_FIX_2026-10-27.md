# Bounded GTFS connector oracle fix — 2026-10-27

## Change

Server PR #50, branch `codex/argo-lviv-route-completeness-20261027`; oracle fix `7ed6095e283998ce64c8c26b340ef673537436cf`, followed by bounded-evaluation optimization `f441a29732745a147149a7c35b7b0167f5ec2b42` arrival-ordered pruning `1be7463e42dc89205423d65dc3233dac36375495` (rejected by replay), and score-cap follow-up `ced95300438f17f60b608aee971c46f103552d12`.

A deterministic tiny feed with an exhaustive exact-stop trip-pair/triple oracle proved that, under a deliberately small graph budget, connector overflow kept a cursor-first stop pair from a middle trip and omitted the same trip's faster onward connector. The unbounded production traversal matched the oracle, while the bounded graph did not contain the oracle-winning connector.

Connector overflow scores feasible same-trip connector candidates by onward destination arrival, applying existing transfer feasibility, wait, pathway, and journey-horizon limits. The first implementation scanned every onward event and replayed too slowly; follow-up `f441a29` bounds evaluation using the earliest feasible event at each reachable stop, and `1be7463` sorted candidate segments by arrival but replay rejected the latency cost. `ced9530` instead caps onward-arrival scoring at two feasible connector candidates per trip while retaining the oracle case. Graph budgets and reservoir capacities remain unchanged. No real-world quality conclusion until its replay is complete.

## Verification

- Focused exhaustive-oracle regression: 1/1 PASS.
- `tests/gtfs-timetable.test.ts`: 89/89 PASS, 0 skipped.
- `tsc --noEmit`: PASS.
- ESLint on changed Server source and test: PASS.
- `git diff --check`: PASS.
- Exact-head CI `40587738372`/`40587729059` passed. First replay `40587827447`: all objective winners matched, but median runtime regressed 5.58s→26.69s (+378.22%), sampled RSS rose 678.4→774.2 MiB, and 3-leg candidates fell 855→826; this profile is not acceptable.
- Bounded-evaluation follow-up exact CI `40588596110`/`40588588028` and replay `40588603023` against `f35a095`: IN PROGRESS.

## Next

Audit the stacked PR dependency chain #47–#50 and continue with the next bounded dense-feed completeness hypothesis. Keep PR #50 open until parent ordering and integration are resolved; no deployment.

Antigravity Argon quota is unavailable. A later compact diff-only review also returned an empty response (`SUCCESS` status, no findings) after reporting 20,939 tokens in 38.96s; both attempts are recorded FAILED in the task queue and will not be repeated. Production remains `NOT_RELEASED`, `PRODUCTION_READY=false`.
