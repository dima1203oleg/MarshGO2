# GTFS lazy event-index prototype result — 2026-10-26

## Scope

- Isolated Server checkout: `/private/tmp/marshgo-gtfs-lazy-event-index-20261026`.
- Branch `codex/gtfs-lazy-event-index-20261026`, based on PR #45 candidate `cb16fe8352c78917eaf6d89f675d6ae58461916f`.
- No serving code was changed. The event-index helpers in this checkout are test-only.
- Frozen feed SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.

## Correctness checks

The existing small-feed tests passed for: graph-relative path identities and strategy winners; exhaustive one-transfer identities with exact production transfer validation; directed pathways, explicit transfer rules, loops, and realtime delay/cancellation; and proof that the query-directed index materializes only query-relevant stop-pair legs on a synthetic dense feed.

Command: `node --import tsx --test --test-name-pattern='event index materializes|deterministic exhaustive oracle|graph-relative lazy search' tests/gtfs-timetable.test.ts` — 3 passed, 0 failed.

These are fixture proofs, not proof of full-feed completeness or production performance.

## Frozen-feed probe

On the Holosko→Sykhiv frozen Lviv feed, the independent lazy event-label oracle used 30 origin and 27 destination stops, three service dates, a 6-hour journey horizon, up to two transfers and a 10,000-label bound. It expanded 10,000 labels, materialized 2,051 boarding expansions / 35,975 legs, found 166 identities before stopping, and correctly returned `searchTruncated=true`. Runtime was 8,354 ms, heap 446 MB, RSS 679 MB, under Node 25.4.0 (outside the Server package's declared Node 24.21.0 runtime).

The unchanged production candidate on the same feed, coordinates and departure window returned 100 journeys in 2,170 ms, heap 430 MB, RSS 509 MB; it also correctly reported graph/search truncation. These are one-run diagnostic measurements with different candidate semantics, not a controlled performance comparison. The lazy prototype did not demonstrate a useful completeness or resource improvement and is rejected for serving-path integration.

## Decision and next action

- Keep the current production candidate unchanged and keep all truncation signals visible.
- Do not raise graph or label limits based on this probe.
- Next algorithm gate: improve the compact search-state representation and candidate discovery together, then prove exhaustive small-feed parity including service-date, fare, transfer, pathway, realtime and ranking semantics before repeating paired frozen-feed runs under the supported Node version.
- Production remains `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
