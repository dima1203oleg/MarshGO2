# Audit 227 — GTFS unknown-fare balanced candidate ranking — 2026-10-26

## Finding and correction

The GTFS search preselection ranked BALANCED candidates with a local formula. It assigned a zero price penalty to every candidate without a comparable UAH fare. The common Server scorer treats an unknown price as the worst comparable-price score, so the GTFS preselector could otherwise give unknown-price routes an artificial advantage before API-level strategy scoring.

Added `rankGtfsItinerariesForCandidateSampling`, which maps comparable UAH fare into the shared `scoreJourneys(..., 'BALANCED')` contract, leaves missing/non-UAH prices unknown, preserves the existing duration/id tie-break and transfer-risk input, and replaces the duplicate local formula. Added an explicit regression case with a fast known fare, a cheaper slower fare, an expensive fare, and a missing fare. The known-fare itinerary now remains ahead of the otherwise similar unknown-fare option.

## Verification

- Repository: `MarshGO-Server`, branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; worktree was already dirty. This change is local and uncommitted; no existing dirty edits were overwritten or staged.
- Node `v24.22.1`: focused GTFS suite **45/45 PASS**, including exhaustive one- and two-transfer oracles and the new unknown-fare regression.
- Full Server suite: **240 PASS / 0 FAIL / 1 opt-in skip** (241 total); typecheck PASS; lint PASS; changed-file `git diff --check` PASS.
- Isolated loopback integration runner completed all phases without failing assertions: journey schema 2/2, live journey 1/1, booking/editing 21/21, navigation 2/2, Redis realtime 1/1, restart durability 1/1, rate limit 1/1 (**29/29**). It applied migrations only to the explicitly guarded `marshgo_e2e` database and used loopback services.
- Frozen Lviv archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; 72 routes, 1,071 stops, 15,716 trips. Three repeats each of Holosko→Sykhiv, Naukova→Sykhiv, and Rynok→Dubliany returned 100 journeys with stable ordered candidate hashes, stable FASTEST/CHEAPEST/BALANCED winners, and unchanged route-chain counts 62/43/45. Median times were 1,738/980/1,389 ms in this run; do not interpret this single run as a performance improvement. All three remain `searchTruncated=true` and `resultLimitReached=true`.

## Limits and next work

This closes one pricing-correctness issue in GTFS candidate preselection; it does **not** solve dense-feed recall or establish production readiness. The access-stop, search budget, candidate pool/sampling and segment-span bounds remain. No live-provider, staging, production, physical-device, security/load, or recovery acceptance is claimed. Continue analyzing candidate admission and search completeness with deterministic small-feed oracles and controlled frozen-feed replay. Keep partial results explicitly marked.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
