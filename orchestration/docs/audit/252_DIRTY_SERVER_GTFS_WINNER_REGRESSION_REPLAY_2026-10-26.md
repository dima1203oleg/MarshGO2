# Dirty Server GTFS winner and performance replay — 2026-10-26

## Exact inputs

- Clean reference: Server PR #43, `24c70dc31d652ac6ba9fbc5fcd7abd138378b457`, router source SHA-256 `7cdaa3ab682e642b865c7396a68c9ef278a254eef92ba872537ed572d66ea381`.
- Comparison: shared dirty Server worktree, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, router source SHA-256 `0f6a07775f021fc969194337e3201f8dd17ba3b7500c1393e3d54eac289af4a9`. The worktree contains extensive pre-existing uncommitted changes; HEAD alone does not reproduce this comparison.
- Runtime: Node `v25.4.0`.
- Input: frozen Lviv GTFS archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Three paired repetitions per variant and O/D: Holosko→Sykhiv, Naukova→Sykhiv, and Rynok→Dubliany; the same 30-minute departure window, six-hour horizon, two-transfer limit, walk limits, transfer buffer, and 100-result page as audit 250.
- Raw run output: `/tmp/marshgo-server-dirty-vs-pr43-paired.json`. Winner-detail output: `/tmp/marshgo-winner-metrics-compare.out`. Temporary harnesses are outside the repository.

## Results

| O/D | PR #43 median | Dirty median | Route chains PR #43→dirty | FASTEST/CHEAPEST winners retained | All truncation flags |
|---|---:|---:|---:|---|---|
| Holosko→Sykhiv | 2,343 ms | 1,635 ms | 44→62 | no / no | both partial; dirty also reports stop selection, pool, and segment-span truncation |
| Naukova→Sykhiv | 1,686 ms | 830 ms | 41→43 | yes / yes | both partial; dirty also reports stop selection, pool, and segment-span truncation |
| Rynok→Dubliany | 3,020 ms | 1,312 ms | 36→45 | yes / yes | both partial; dirty also reports stop selection, step-limit, and segment-span truncation |

Every search returned 100 results and remained truncated. Ordered itinerary identities differed between variants on all three O/Ds. Median wall times were lower in the dirty source in this small local sample, but sampled peak heap/RSS were variable and sometimes higher; this is not a capacity or performance acceptance result.

The material regression is Holosko→Sykhiv: PR #43 returns a 47-minute FASTEST/CHEAPEST winner (fare 2,300 minor UAH, one transfer, 714 m walking); dirty source returns 54 minutes (same fare, one transfer, 802 m walking). Its BALANCED winner is a 72.5-minute direct ride versus PR #43's 47-minute two-leg option. On Naukova→Sykhiv the FASTEST/CHEAPEST identities are preserved; BALANCED changes from 36 minutes/zero transfers/zero walking to a 35.5-minute direct leg with 340 m walking. All three Rynok→Dubliany strategy winners are preserved.

## Decision

- Do not promote or copy the dirty GTFS rewrite wholesale into the clean PR #43 release candidate. The wall-time gains do not offset lost strategy winners, additional reported truncation, changed candidate identities, and unproven memory behavior.
- Keep the explicit `searchTruncated` disclosure. Do not raise graph/result caps to manufacture completeness.
- The next implementation gate is a narrowly isolated query-directed event/segment search that preserves the exhaustive small-feed path and strategy-winner oracles, then proves non-regression on exact frozen-feed winners and measures candidate recall, truncation, heap/RSS, and latency across all three O/D pairs.
- No production source or deployment changed in this replay. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
