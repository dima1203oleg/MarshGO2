# PR #50 frozen Lviv replay — 2026-10-28

- Server PR: https://github.com/dima1203oleg/MarshGO-Server/pull/50 (OPEN); candidate `657b2f936a09aa7faf7d6a13b11bd97b801067f2`, base comparison `3c14c28b5e3a8dfe50c806f8bb45ade2f3d6a942`.
- Exact-head Server CI runs `40593720268` and `40593727828`: SUCCESS. Verified audit, lint, typecheck, unit tests, DB migration, integration tests, production API image build, and PostGIS/Redis smoke steps.
- Frozen replay run `40593963347`: SUCCESS; feed SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; three serialized repeats per revision.
- Baseline and candidate have the same ordered-result hash and identical FASTEST/CHEAPEST/BALANCED winners on this one OD/time window; 44 distinct trip chains / 27 route chains; no chain identities added or removed. Repeats are deterministic within each revision.
- Median search duration: 5703.53 ms → 5755.83 ms (+0.92%). Peak sampled RSS: 671.1 → 681.4 MiB (+10.3 MiB). Candidate graph, search budget, candidate sampling, and response-page truncation remain true on both revisions; diagnostic counts are effectively unchanged.
- Assessment: this single static corridor shows no measured regression, but does not exercise or demonstrate the retention-tier fix. It does not establish route completeness, live GPS/GTFS-RT correctness, staging acceptance, or production readiness.
- Gemini 4 Argon read-only review reached the same conclusion. Its proposed next experiment: choose a frozen-feed Lviv OD requiring two transfers where the middle route also contains dead-end endpoint trips; inspect candidate graph retention by route/priority and compare the same OD on baseline/candidate without raising caps. The replay workflow already accepts origin/destination coordinates.
- No source changes from replay review; PR remains open; no merge or deploy. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
