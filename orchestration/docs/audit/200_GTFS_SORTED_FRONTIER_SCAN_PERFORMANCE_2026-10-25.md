# GTFS sorted-frontier scan optimization — 2026-10-25

## Change

- Server PR #42, branch `codex/gtfs-sorted-frontier-scan-20261025`, commit `d5a1067e637ffcab3a2ea3f4f30e41c7fdbb5e24`, based on PR #41 SHA `70e11d8d8730e54311f13d73953ab565fd6b432a`.
- In query-time `hasNextEvent`, each reachable-stop event list was already sorted by timestamp. The old code flattened, deduplicated, globally sorted, and searched the merged event array for every retained candidate. The change instead binary-searches each source list and checks feasibility directly, returning at the first valid event.
- Existing exact transfer/pathway rules and output ordering are unchanged. This is a search-cost optimization, not a graph-completeness fix.

## Evidence

- Exact Server #41 baseline vs #42 source, five alternating process runs per frozen OD (15 paired observations total) on archive SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, local Node `v25.4.0`.
- Median elapsed time: Holosko → Sykhiv **3,066 ms → 2,700 ms** (-11.9%); Naukova → Sykhiv **2,174 ms → 1,978 ms** (-9.0%); Rynok → Dubliany **4,448 ms → 3,620 ms** (-18.6%). Candidate was faster in 12/15 paired runs. A single Rynok baseline result was a 10.96 s outlier; per-OD medians reduce but do not eliminate measurement noise.
- All 15 pairs had identical ordered result identity hashes, trip/route-chain counts, and truncation flags. Every OD still reported `searchTruncated=true` and `candidateGraphTruncated=true`.
- Median RSS did not move consistently: Holosko about **329 → 313 MB**, Naukova **377 → 408 MB**, Rynok **329 → 342 MB**. RSS is process-level/noisy; no memory reduction is claimed.
- Full exact-branch Server unit suite: **316 pass, 0 fail, 3 opt-in integration skips**. GTFS timetable file: **76/76 pass**, including exhaustive one-/two-transfer oracles and pathway/transfer/realtime/fare coverage. TypeScript, changed-file ESLint and `git diff --check` pass.
- Hosted exact-head CI runs `40216580417` and `40216598199` both completed **success** on the exact head SHA. Each passed dependency audit, full lint, typecheck, unit suite, database migration, integration suite, production API image build, and local PostGIS/Redis image smoke.

## State and limits

- Open draft Server PR #42 is stacked on open draft PR #41; do not merge #42 independently or promote it into a release manifest. CI passed; PR review/stack integration and release gates remain outstanding.
- Frozen static Lviv feed only. No realtime, staging, deployed or supported-runtime benchmark is claimed. Dense candidate-graph truncation remains unresolved.
- `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
