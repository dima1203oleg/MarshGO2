# PR #50 frozen Lviv replay winner cross-check — 2026-10-27

## Scope and evidence

- Base: `1157b4df29736a7936f9fe5713cb7f9c522d6c26`.
- Candidate: `a66044e0d5ec5f34bbff945d2352dc24624921d6`.
- Frozen replay artifact: `/tmp/marshgo-replay-40574972609/replay-results.jsonl`, feed SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Three repeat runs per SHA have the same winner identities. The JSONL contains strategy winner chain IDs and search diagnostics, not a complete journey tuple.
- Gemini 4 Argon Medium performed a read-only, one-file comparison. Codex independently parsed the JSONL and checked the winner chain strings. No code edits, merge, or deployment.

## Known winner comparison

| Strategy | Base vs candidate | Known scheduled evidence | Unknown in JSONL |
|---|---|---|---|
| FASTEST | First trip ID `32939_1_0` → `29559_1_1`; remaining trip ID and segment sequence unchanged | Same stop sequence `4571→4878→44973→4690`; segment times `05:08→05:22`, `05:27→05:47 UTC`; 1 transfer; 2,340-second transit span | Door-to-door duration, actual walking metres, fare |
| CHEAPEST | Same winner chain change as FASTEST | Same stops/times; 1 transfer; 2,340-second transit span | Fare is unknown, so cheapest-strategy dominance cannot be proven; door-to-door duration and actual walking metres are also absent |
| BALANCED | First trip ID changes; remaining trip ID and segment sequence unchanged | Same stop sequence `4571→5001→5139→4690`; segment times `05:08→05:20`, `05:25→05:47 UTC`; 1 transfer; 2,340-second transit span | Door-to-door duration, actual walking metres, fare |

These are equivalent on the visible transit stop/time/transfer fields, not on a complete door-to-door objective tuple. The only changed identity is the first trip tie-break; the baseline trip chain remains present in the candidate's retained chain IDs. The candidate replay median latency improved 7.40% and peak RSS fell slightly, but graph/search/sampling/page truncation remained true. This one corridor does not establish global routing completeness or cheapest-fare correctness.

## Decision

Keep PR #50 open for now; do not merge from this evidence alone. The scoped first-leg eligibility correction remains justified and the winner shift is not a demonstrated transit-time regression. Exact CI is green, but the route search is still bounded and the replay omits fare and door-to-door walking metrics. Production remains `NOT_RELEASED`.
