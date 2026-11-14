# Server PR #28: frozen Lviv route-search replay — 2026-10-22

## Reproducible input and query

- Frozen Lviv GTFS archive: 3,755,976 bytes; SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Parsed static data: 1,071 stops, 72 routes, 15,716 trips.
- Runtime: Node `24.21.0`; parser-level replay with `parseGtfsTimetable` and `findGtfsItinerariesWithStats`; no database, API, or network request during either search.
- Baseline source: exact `server/journey/gtfsTimetable.ts` from PR #28 parent. The copied baseline file SHA-256 matches `git show d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe^:server/journey/gtfsTimetable.ts`: `02f3917cd6d1378f0996576204bc193f91c5a021f0e08f527f1c3f0452020119`.
- Candidate: Server PR #28, `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`.
- Query: Maloholoskivska (`24.008217,49.864885`) → Sykhiv (`24.0175835,49.8013165`), 23.10.2026, 08:00–08:30 Europe/Kyiv; six-hour journey horizon; up to two transfers; 900 m access, 1,000 m egress, 400 m transfer walk; 180 s minimum transfer buffer; four-hour maximum wait; response limit 100.

## Results

| Measure | Parent baseline | PR #28 | Difference |
|---|---:|---:|---:|
| Returned itinerary candidates | 100 | 100 | same |
| Distinct route chains in candidate set | 34 | 34 | same |
| Ordered itinerary ID SHA-256 | `f58accb021eab9afc415ccaccabc000bcf3e6a268b496ac0deb5fe10aa7c5a28` | same | 100/100 same IDs and order |
| FASTEST / CHEAPEST / BALANCED candidate winners | same itinerary in all three diagnostic scorer views | same | identical IDs |
| Search / graph / result truncation | `true / true / true` | `true / true / true` | unchanged |
| Search wall time | 2,008 ms | 1,798 ms | −10.5% |
| JS heap at completion | 421,334,568 B | 309,351,776 B | −26.6% |
| RSS at completion | 616,022,016 B | 544,129,024 B | −11.7% |

## Candidate graph/search counters (PR #28, same query)

- Stop selection: 27 origin / 25 destination stops. Corridor: 423 stops; 814 interchange stops.
- Estimated graph demand: **413,764** segments against a 100,000 total bound; 70 route budgets received candidates, 41 routes filled their budget, 29 routes were underfilled, and 846 allocated slots remained unused. Retained graph: **99,154** segments. Of the bounded per-route overflow reservoirs, 6,522 candidates were retained and 31 reservoirs reached their 200-item bound.
- Search saw 533 feasible first legs, ran 81,970 steps (below the 1,000,000 absolute step ceiling), and produced 1,108 sampled itinerary candidates before returning 100. The search-budget truncation was triggered by bounded candidate pools; it did not hit the absolute step ceiling.
- This identifies two active losses: graph retention discards some of 413,764 estimated edges, and the candidate/result samplers then omit additional routes. A patch that only speeds object creation cannot remove either loss. Increasing the global cap is not justified by these counters alone.

All 100 returned candidates carried a fare from the code's local city-tariff fallback. The frozen GTFS archive itself does not establish an operator quote or purchase price; this replay did not test any fare API or commercial booking. The three winner IDs above are diagnostic rankings over this GTFS result set, not end-to-end cross-provider acceptance.

## Engineering conclusion

PR #28's deferred materialization preserves the exact bounded candidate list for this OD/time and reduces measured process memory and latency in this run. It does **not** improve route coverage: graph, search, and result sampling remain truncated. One process pair is not a performance distribution; repeat measurements and live/staging acceptance remain necessary. This is regression parity/resource evidence only, not evidence that every feasible route or global strategy winner was found.

Next algorithm work must change query-time search/candidate selection rather than raise caps or suppress truncation. The counters point first to route/segment retention and candidate-pool policy, not the one-million search-step ceiling. Acceptance for a new prototype: exhaustive one-/two-transfer tiny-feed oracle for all feasible itineraries and FASTEST/CHEAPEST/BALANCED winners; then identical ordered candidate/winner comparison on this frozen feed plus the established six OD queries; report unknown fares honestly, search-completeness flags, multiple process timing/RSS, and no regression in transfer/pathway constraints.
