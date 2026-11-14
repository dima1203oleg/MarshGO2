# GTFS progressive time-window expansion probe — 2026-10-25

## Setup

- Exact Server source: PR #40 candidate `38f17b88f98c8530f8090cfc6745cd334c87e53c`; no production source was changed.
- Runtime: Node `v24.21.0`.
- Frozen Lviv static GTFS archive SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Three ODs: Maloholoskivska→Sykhiv, Naukova→Sykhiv and Rynok→Dubliany; requested departure 05:00Z, two-hour boarding window, six-hour total horizon, two transfers, existing 900/1000/400 m walk bounds, 180 s transfer buffer and 100 results per search window.
- A standalone temporary replay called the unchanged production `findGtfsItinerariesWithStats`. For 2×60-minute and 4×30-minute windows, it normalized candidate duration to the original departure time, unioned by exact itinerary ID, and explicitly reinserted every baseline candidate before ranking. No DB, live feed, API, user data, deployment or production files were involved.
- Each configuration was run once per OD. The latencies below are exploratory point measurements, not SLO or percentile evidence. RSS was sampled after each OD in the same process, so it is not an isolated per-query peak-memory comparison.

## Results

| OD | 120m baseline ms / trip chains / route chains | 2×60m total ms / new itinerary IDs / new trip / route chains | 4×30m total ms / new itinerary IDs / new trip / route chains |
|---|---|---|---|
| Maloholoskivska→Sykhiv | 2,297 / 52 / 29 | 4,500 / 139 / 76 / 29 | 9,247 / 347 / 200 / 100 |
| Naukova→Sykhiv | 2,247 / 60 / 37 | 3,676 / 147 / 62 / 11 | 7,939 / 351 / 172 / 28 |
| Rynok→Dubliany | 2,770 / 55 / 29 | 7,197 / 101 / 56 / 18 | 11,777 / 303 / 167 / 32 |

For all six sliced runs:

- All 100 exact baseline itinerary IDs were present in the merged set.
- The baseline FASTEST, CHEAPEST and BALANCED winner IDs were each represented; the selected winners were unchanged after reranking.
- `searchTruncated`, `candidateGraphTruncated` and `resultLimitReached` remained true. Thus this does not establish complete search, global optimality or better strategy winners.

## Decision

Do not replace or delay the default query with full-window slicing. It costs 1.6–2.6× for two windows and 3.5–3.7× for four windows on these single-run observations, while all searches still truncate and no top strategy winner changes. The result is useful only as an experiment for an explicit, separately requested “more alternatives” continuation that preserves the original result objects and keeps partial-search status visible. No such endpoint/UI exists yet, so nothing was integrated or promoted.

The dense-feed routing completeness requirement remains OPEN. A real fix still needs a better query-directed connection search that honors service calendars/exceptions, time zones, transfers/pathways, pickup/drop-off, realtime updates and fares; it must preserve baseline objects, match the exhaustive tiny-feed oracle, improve useful candidate recall, and meet measured resource limits over repeated multi-OD runs.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
