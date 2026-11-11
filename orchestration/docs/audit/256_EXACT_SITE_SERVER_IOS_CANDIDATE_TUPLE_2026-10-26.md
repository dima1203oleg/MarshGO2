# Exact Site / Server / iOS candidate tuple — 2026-10-26

## Candidate inputs

| Component | Repository / PR | Exact head | API / schema |
|---|---|---|---|
| Site/PWA | MarshGO-Site PR #28, stacked on #27 | `d6c9a957a5f767a491daed2ffb5e70bb8ed8b559` | canonical transport color correction included |
| Server/API | MarshGO-Server PR #43, stacked on #42 | `4ed81b47e45520475470b699deac115fb0000b69` | API contract `v1`; migration `055` |
| iOS wrapper | MarshGO-iOS PR #15, based on `codex/ios-final-rc-20261024` | `7468cee5cdcb3d3a3fb4c182c0da6e1dc3a9f2aa` | CI pins the exact Site and Server heads above |
| Admin | MarshGO-Admin PR #1, open head | `a008dbad8edc5d81d716a0913e10c325f739540b` | hosted verify run `40271205348` passed |
| Partner | MarshGO-Partner PR #1, open head | `5ec9f368d2788e44483a0effe6eac34838e89790` | hosted verify run `40272376131` passed |
| Orchestrator | MarshGO PR #5 integration head | `688b58ca6eeae0175ee34cf1c423a3e35c9f765d` | checkout is dirty; central materialization blocked on owner-managed `MARSHGO_REPOS_READ_TOKEN` |

## Evidence

- Dependency heads inspected: Site #28 → #27 (`cc149957…`) → #26 (`1b5986de…`) → #24 (`16f5b217…`); Server #43 → #42 (`a403a51…`) → #41 (`70e11d8…`) → #39 (`142ed4f…`); iOS #15 → #14 (`be5478…`). These PRs are open, and the verified hosted checks on #24/#26/#27, #39/#41/#42 and #14 passed. Root [PR #5](https://github.com/dima1203oleg/MarshGO/pull/5) is also open on exact head `688b58ca…`.
- Site PR #28 hosted checks passed on exact Site SHA: runs `40305831219` and `40305837568`. Local Node 25.4 checks: 117/117 tests, typecheck, lint, Vite build, and bundle budget pass.
- Server PR #43 hosted checks passed on exact Server SHA: runs `40304476493` and `40304482350`, including unit, migration, PostGIS/Redis integration, API image build and smoke. Local paired frozen-feed test preserved exact results and all three strategy winners.
- iOS PR #15 was updated to pin Site `d6c9…` and Server `4ed81…`; exact tuple checkout, bundled Site build, embedded release-manifest verification, and iOS Simulator compile passed on head `7468cee5cdcb3d3a3fb4c182c0da6e1dc3a9f2aa` in hosted runs `40306113642` and `40306122358`. The workflow did not run the optional unsigned Release archive step. It retains API contract `v1` and migration `055`.
- Admin and Partner individual checks passed on the exact open PR heads above. Central orchestrator PR #5 Verify `40301391620` passed source checks, database migration/integration, build and bundle, then failed closed because private Admin/Partner read access is not configured; materialization, image builds and cross-repository E2E were skipped.
- All three PRs remain open; PRs #28/#43 remain stacked on parent PRs. This is a verified candidate tuple. It is not merged, staged, deployed, TestFlight-distributed, or physically device-accepted.

## Remaining multimodal / release gates

The frozen Lviv GTFS searches still expose truncation, so route completeness and global optimality are not accepted. iOS physical-device GPS/background/deep-link acceptance, live-provider entitlement and freshness, staging HTTPS smoke, security/load/recovery, backup/restore/rollback, and any owner-approved rollout remain open. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
