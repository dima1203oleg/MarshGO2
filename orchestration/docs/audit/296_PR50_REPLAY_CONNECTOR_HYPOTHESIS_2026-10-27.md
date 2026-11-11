# PR #50 frozen replay and bounded connector hypothesis — 2026-10-27

## Verified state

- Server PR #50 is OPEN/CLEAN at `f35a095b7e3ff424d96dfccec635c2ea3cbc2d2f`; exact-head hosted `verify` runs `40584499772` and `40584508076` both pass. No merge/deployment.
- Replay artifact: `/tmp/marshgo-replay-40574972609/replay-results.jsonl`; base `1157b4df29736a7936f9fe5713cb7f9c522d6c26`, replay candidate `a66044e0d5ec5f34bbff945d2352dc24624921d6`, same frozen feed and OD, three repeat-stable runs each.
- Both versions use 100,000 graph segments against estimated demand 425,855; 70/70 routes are budget-limited, three routes hit the per-route cap, and both report graph/search/candidate-sampling truncation. Underfilled routes are 25→36; redistributed segments 657→1,179. Search steps are 92,723→116,401; first legs 409→1,759; candidates 1,662→1,666; 3-leg candidates 892→855; unique trip chains 45→44 and route chains 28→27. Median runtime is 6.11s→5.67s (~9.5% faster). Signals are mixed and do not prove increased completeness.
- Resource check: about 11 GiB free disk and 40% memory free. No heavy local test/build/replay was started.

## Antigravity attempt

- `agy models` confirmed `gemini-4-argon-medium`; Antigravity app was running, but its visible conversation had no active task. One distinct read-only Argon CLI task was attempted with `--mode plan --sandbox`, restricted to `server/journey/gtfsTimetable.ts`; no permission bypass was used.
- The CLI returned an empty response at print timeout. Reported usage: 61,725 input, 623 output, 284 thinking, 193,218 cache-read, 62,348 total tokens, 62.88363 seconds. Quota telemetry was unavailable. The failed attempt is in `docs/AI_AGENT_QUEUE.json`. Do not repeat it.

## Codex source observation and decision

- In `server/journey/gtfsTimetable.ts`, `materializeTripInstanceLegs` emits stop-pair projections in cursor order (around line 1426), while `compareTripSegments` defines a separate query-aware ranking (around line 2446). During connector overflow collection (around lines 2620–2630), only the first temporally feasible non-endpoint candidate per trip is offered to the connector reservoir.
- This is a test hypothesis, not a confirmed defect: per-trip bounded sampling and whole-trip retention may make the first eligible connector harmless, and no omitted winner has been demonstrated. Do not widen reservoirs or graph caps; a prior expansion was rejected after a frozen replay lost FASTEST/CHEAPEST winners and regressed latency.
- Next: create a small deterministic feed where the cursor-first same-trip connector is not the exhaustive oracle's best feasible continuation. Prove the bounded result loses that chain with graph caps held fixed. Change code only if the oracle exposes an actual mismatch; otherwise record NO PROVEN ISSUE. Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.


## Follow-up

The hypothesis was later proven by a tiny-feed exhaustive oracle and addressed in Server commit `7ed6095e283998ce64c8c26b340ef673537436cf`; see [audit 297](297_BOUNDED_GTFS_CONNECTOR_ORACLE_FIX_2026-10-27.md). The pinned Lviv replay is still required before accepting the serving change.
