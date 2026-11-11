# GTFS 71-hour service-date lookup fix — 2026-10-26

## Change

- Server PR #45 branch `codex/gtfs-bounded-discovery-pass-20261026`, commit `cb16fe8352c78917eaf6d89f675d6ae58461916f`, is stacked on PR #44 head `aaa1328f17c35029b7efa4f801dfae07301a9517`.
- `findDirectGtfsJourneys` now enumerates every service date in the query window and includes the two preceding service dates. `findGtfsItinerariesWithStats` also includes two preceding dates. This follows the repository parser's accepted GTFS times through `71:59:59` and avoids missing trips tied to a service day two local dates earlier.
- Regression test covers direct and multimodal production search for a 71:15 departure/71:55 arrival on the service date two days before the query date.

## Evidence

- Focused 24-hour and 71-hour service-date tests: 2/2 pass.
- Full Server suite: 317 pass, 3 opt-in integration skips, 0 fail.
- `npm run typecheck`, `npm run lint`, and `git diff --check`: pass.
- Frozen Lviv GTFS archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; three O/D pairs, five repeats each. Ordered-result hashes and FASTEST/CHEAPEST/BALANCED winners match the pre-change baseline for all O/D pairs. Median latency (baseline → candidate): Maloholoskivska–Sykhiv 2171.66 → 2213.90 ms; Naukova–Sykhiv 1944.31 → 1884.66 ms; Rynok–Dubliany 3164.48 → 3421.65 ms. Variation is mixed; no general speedup claimed. All three cases remain `searchTruncated=true` and `candidateGraphTruncated=true`.
- GitHub Actions Server CI run `40315614340` completed successfully: dependency audit, lint, typecheck, full unit tests, DB migrations, PostGIS/Redis integration tests, production API image build, and image smoke test all passed.

## Limits / next action

- This fixes a bounded service-date lookup omission; it does not make dense-feed route search complete or establish production readiness.
- PR #45 exact-head CI is green. PR #44 base checks were green at the prior checkpoint. Continue the production routing completeness work with exhaustive tiny-feed parity and honest truncation semantics. No merge or deployment performed.
- Local runtime is Node 25.4.0 while the package declares Node 24.21.0.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
