# GTFS transfer-feasibility regression fix — 2026-10-26

## Scope and source identity

- Repository: `MarshGO-Server`.
- Branch: `feature/transport-layer-availability`.
- Committed HEAD: `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- Working tree was already heavily modified and contained untracked work. All unrelated changes were preserved; no reset, clean, commit, push, or deploy was performed.
- This checkpoint covers GTFS transfer/search correctness only. It is not a full-product or production acceptance.

## Corrections

- Restored the default transfer walking ceiling from 800 m to 400 m, matching the existing contract and tests.
- Removed a silent cap of two same-route/same-destination successor trips. The existing global queue and search-step bounds remain authoritative and set the partial/truncated status when reached.
- Restricted implicit cross-provider intermodal walking to a named railway-station interchange within 150 m; otherwise a cross-provider transfer must be represented by a shared canonical stop or an explicit GTFS transfer edge. This avoids joining nearby unrelated stops while preserving the tested station-to-rail walk.
- Removed an unused intercity helper left behind by the search correction.
- Removed an unapproved worker `console.error` that made repository-wide ESLint fail and could emit provider error details. Structured worker error results remain.

## Evidence

- Five targeted regressions: **5/5 PASS** (walking limits; exhaustive one-transfer identities; three-transfer four-mode chain; Kyiv timezone/cross-provider stop match; named station platform walk).
- Full `tests/gtfs-timetable.test.ts`: **77/77 PASS**.
- Full Server unit suite: **323 PASS / 0 FAIL / 3 opt-in integration tests skipped**.
- `npm run typecheck`: **PASS**.
- `npm run lint`: **PASS** after removing the worker console call.
- `git diff --check`: **PASS**.
- Local baseline diff remains uncommitted.

## Remaining verification

- The exact previously frozen Lviv GTFS archive (SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`) was not available in the inspected workspace/cache paths, and `GTFS_REPLAY_ZIP` is unset. The dense-feed replay therefore has **not** been repeated after this change.
- Before accepting this as a dense-feed improvement, restore that exact archive and repeat the three controlled O/Ds, including route-chain recall, the three ranking winners, truncation causes, latency, and RSS. Existing prior evidence says those searches were truncated.
- Database/Redis integration, staging, live providers, browser acceptance, iOS, and production deployment were not run in this checkpoint.

## Disposition

Small-feed transfer correctness is locally verified. Dense-search completeness, cross-repository integration, and production readiness remain open. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.
