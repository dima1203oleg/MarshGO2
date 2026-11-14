# GTFS objective-reservoir search-budget A/B — 2026-10-22

## Question and setup

Tested whether increasing the post-pool objective-reservoir search allowance improves the three GTFS ranking winners on dense Lviv schedules. Compared Server PR #28 base (`d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`) with the isolated temporal-retention experiment plus a 100,000-step objective-reservoir allowance. Runtime Node `24.21.0`, frozen official Lviv static ZIP SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, five 08:00–08:30 Kyiv corridors, 3-hour horizon, up to four transfers, access/egress/transfer walks 900/1,000/400 m, 100 results.

## Results

The baseline allowance is 25,000 additional search steps per full objective pool; the experiment used 100,000. Across all five corridors:

- FASTEST, CHEAPEST, and BALANCED winner IDs were unchanged.
- Every candidate and baseline search remained truncated at graph, candidate/result, or search-budget level.
- Route-ID chain counts under the experiment changed by corridor, with no consistent improvement. The Lviv city registry supplied an adult LeoCard/app fare estimate (23 UAH per eligible ride); the search does not collect fare medium, and cash/bank-card prices differ. CHEAPEST therefore remains unvalidated against the passenger's actual fare choice or differentiated operator fares.
- Total measured ranked-search time increased from approximately **12.6 s to 17.3 s** across the five sequential queries (+38%). Per-query RSS reached **1.14 GB**, versus a maximum of approximately **0.54 GB** in the 25k temporal-retention candidate run. These are single-run diagnostics, not p95/SLO measurements.

## Decision

**Rejected.** A fourfold larger post-pool search budget found no different strategy winner, did not resolve truncation, and materially increased time and memory. The experimental source has been returned to the established 25,000-step constant; the isolated temporal-retention diff remains uncommitted and unpromoted. Next search work should reduce repeated/low-value state expansion or replace eager bounded stop-pair materialization, with explicit equivalence tests for transfer rules and all three objectives.
