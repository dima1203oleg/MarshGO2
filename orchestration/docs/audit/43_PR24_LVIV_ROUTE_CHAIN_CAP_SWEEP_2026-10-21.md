# Lviv route-chain sampler cap sweep: 3, 4, 6, 8

Date: 2026-10-21 UTC  
Server source: PR #24 exact candidate `c33651b1387e0d2b377216a0b88f6ae02cdbec32`  
GTFS static snapshot SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`

## Method

Five fixed Lviv corridors (Railway→Sykhiv, Center→Dubliany, Center→South Bus Station, Naukova→Sykhiv, Center→Pidzamche), same 2026-10-22 08:00–08:30 Europe/Kyiv window, 3-hour journey bound, up to four transfers, 900/1,000/400 m access/egress/transfer walk caps, and 100 returned results. Node 24.21.0. Only the per-route-chain result cap changed; per-trip-chain cap stayed 2. Each corridor was run sequentially in a fresh Node process after loading the same archive. Caps 8, 4, and 3 were repeated twice; cap 6 was measured once. Times are diagnostics, not an SLA or latency percentile.

## Observed route-chain breadth and median time

| Corridor | Cap 8: chains / median ms | Cap 6: chains / ms (one run) | Cap 4: chains / median ms | Cap 3: chains / median ms |
|---|---:|---:|---:|---:|
| Railway→Sykhiv | 39 / 2,784 | 38 / 3,618 | 37 / 2,989 | 46 / 3,535 |
| Center→Dubliany | 31 / 3,496 | 32 / 3,963 | 40 / 3,996 | 45 / 3,975 |
| Center→South Bus Station | 42 / 2,736 | 44 / 2,854 | 46 / 3,084 | 47 / 2,958 |
| Naukova→Sykhiv | 27 / 2,368 | 25 / 2,386 | 34 / 3,616 | 38 / 3,567 |
| Center→Pidzamche | 47 / 2,664 | 47 / 2,518 | 51 / 2,748 | 53 / 2,649 |
| **Total chains across these 5 responses** | **186** | **186** | **208** | **229** |

Across repeated runs, FASTEST/CHEAPEST/BALANCED winner route chains stayed identical for every corridor at cap 3, 4, and 8. Cap 6 also matched in its single run. This compares winners within each bounded output, not against an exhaustive ground truth; for the static feed some fares are unknown/estimated, and route chain count is not itself a quality metric.

All runs still returned 100 results and set both result/search truncation and graph truncation. No cap recovered exhaustive search.

## Interpretation and decision

- Cap 3 gained 43 unique route-name chains across the five returned sets, but median per-corridor latency increased by 14% to 51% on four corridors relative to cap 8. The fifth was similar. This is too costly for the current search.
- Cap 4 gained 22 chains overall and preserved the observed strategy winners, but was slower on four of five corridors, with a large repeated regression on Naukova→Sykhiv. It loses two chains on Railway→Sykhiv.
- Cap 6 was a single, noisy run and changed total chain count by zero; it does not justify choosing a new production value.
- Keep production cap 8. A future sampling design should improve route-chain coverage without spending more search work per candidate. A stronger approach needs independent, exhaustive or Pareto-set validation plus repeated memory/latency measurements.

Temporary cap changes were restored; no product-code change was committed. This is static timetable evidence only, not live-provider, staging, physical-device, or production acceptance.
