# Lviv trip-chain sample cap A/B: 2 vs 4

Date: 2026-10-21 UTC  
Server source: PR #24 exact candidate `c33651b1387e0d2b377216a0b88f6ae02cdbec32`  
Static GTFS ZIP SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`

## Frozen query set

Five city corridors from the 2026-10-20 Lviv feed-scale check: Railway→Sykhiv, Center→Dubliany, Center→South Bus Station, Naukova→Sykhiv, and Center→Pidzamche. A fixed 2026-10-22 08:00–08:30 Europe/Kyiv departure window; up to 3 hours, 4 transfers, 900 m access / 1,000 m egress / 400 m transfer walking, and 100 returned itineraries. Node `24.21.0`; same feed snapshot and query inputs for both variants. Each corridor ran sequentially in one fresh process per cap after one feed parse. This is a diagnostic A/B, not a production SLA or statistical latency study.

## Results

| Corridor | Cap 2: results / distinct route chains / time | Cap 4: results / distinct route chains / time | Search flags |
|---|---:|---:|---|
| Railway→Sykhiv | 100 / 39 / 2,776 ms | 100 / 26 / 2,826 ms | Both truncated; graph and result limits reached |
| Center→Dubliany | 100 / 31 / 3,495 ms | 100 / 25 / 3,421 ms | Both truncated; graph and result limits reached |
| Center→South Bus Station | 100 / 42 / 2,813 ms | 100 / 33 / 2,942 ms | Both truncated; graph and result limits reached |
| Naukova→Sykhiv | 100 / 27 / 2,397 ms | 100 / 20 / 2,525 ms | Both truncated; graph and result limits reached |
| Center→Pidzamche | 100 / 47 / 2,844 ms | 100 / 41 / 2,526 ms | Both truncated; graph and result limits reached |

Raising the per-scheduled-trip-chain variant cap from 2 to 4 reduced distinct route-name chains on all five corridors (by 6–13 chains) while never increasing the 100-result response limit. The larger cap admits more boarding/alighting variants for some exact trip combinations, but those consume the bounded response pool and crowd out distinct transit route sequences. Latency differences are mixed and inconclusive. No strategy winner or completeness claim can be inferred from chain counts alone.

## Decision

Reject cap 4. Keep the current cap 2. Any future sampling change must jointly preserve the FASTEST, CHEAPEST, and BALANCED winners, feasible stop-pair alternatives, and route-chain diversity. The test work in PR #24 protects only the sampled objective winners and a tiny exhaustive fixture; it does not clear dense-feed truncation. All five Lviv responses remain explicitly partial because candidate/result/graph bounds are reached.

Only a temporary constant was changed in the isolated worktree for the experiment; the source was restored to cap 2, no runtime change was committed, and temporary scripts were removed. This is static-feed evidence, not live-provider, staging, or production acceptance.
