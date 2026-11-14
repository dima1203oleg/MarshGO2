# Audit 262 — linked predecessor labels in bounded GTFS experiment — 2026-10-26

## Scope

- Isolated Server worktree `/private/tmp/marshgo-gtfs-time-label-setting`, branch `codex/gtfs-time-label-setting-20261026`.
- Local test-only commit `8fe16f79c6351091fa6952ee512af79634b213ed`; parent `49bf104808b6f1a3bd8669aa125dfb04af4f0a87`; based on PR #43 candidate `4ed81b47e45520475470b699deac115fb0000b69`. Not pushed.
- Only `tests/helpers/gtfs-lazy-event-label-search.ts` changed. Production routing implementation, PRs, manifest, and deployment were not changed.

## Change

The bounded graph experiment previously copied an entire path array whenever a child label was queued. It now stores a compact predecessor reference, depth, and stable path key, materializing a path only when expanding a label or emitting a candidate. The explicit pending-label cap remains enforced and all queue/expansion truncation remains visible.

## Evidence

- Focused graph-relative and exhaustive two-transfer tests: **2/2 PASS**.
- Full Server unit suite: **316 PASS / 0 FAIL / 3 opt-in database integration SKIP** (319 total); typecheck, lint, and diff-check pass.
- Frozen Lviv replay, cap 10,000 expanded and pending labels, exact result SHA hashes unchanged from audit 261:

| O/D | Selected new chains | Baseline chain coverage | Exact baseline winners | Result identity SHA | Search truncated |
|---|---:|---:|---:|---|---|
| Holosko→Sykhiv | 34 | 100/100 | 3/3 | `4ffae1d27d031896ea1b15521d8a701ae7c30dcdd3f3cd5b0a7f3bd963c84ecf` | yes |
| Naukova→Sykhiv | 40 | 100/100 | 3/3 | `339eb1cee7628c184cc8c6a76b24ebbdbf4d7ba11fed0bf138943cf04c24937f` | yes |
| Rynok→Dubliany | 33 | 100/100 | 3/3 | `0e75e7ed618b5c18a3cbfcf933328224090edfaf5d027f6c8df58fa169438c07` | yes |

Local RSS samples varied (~503 MB, ~530 MB, ~775 MB), as did search-pass durations. Do not claim a general memory or latency win from one replay per O/D. The main evidence is output identity preservation and the structural reduction in queued path copies.

## Decision

Keep this as a test-only representation improvement. It does not solve dense-feed completeness, does not find every feasible chain, and does not change production behavior. Next algorithmic work must reduce redundant equivalent boarding-state exploration while preserving exact transfer-rule, fare-state, realtime, service-date, and itinerary identity semantics; prove it against exhaustive small-feed oracles before any dense-feed promotion.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
