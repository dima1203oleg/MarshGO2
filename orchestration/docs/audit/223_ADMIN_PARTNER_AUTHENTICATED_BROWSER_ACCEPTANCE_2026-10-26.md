# Admin/Partner authenticated browser acceptance — 2026-10-26

## Scope and exact source

- Server API: PR #42 (`MarshGO-Server`, head `a403a51a203d9d89685c10c69658c8fd95b70e9b`). Browser API was served from isolated branch `codex/server-partner-integration-20261026` at `2ff505b96f284372e983ef267cc9b6d098db0caf`; its source tree is identical to PR #42 (`86c3899bed947fa94a7e30bca7ace6c61ab16b62`).
- Admin UI: open PR #1 exact head `f39c4b74839a393f4487c830930669eabc8c0390`; hosted `verify` passed. Its code includes the prior fix that omits empty partner-list filters.
- Partner UI: open PR #1 exact head `97a3727cc395dea092af6e3e24d6822370c2bc63`; hosted `verify` passed.
- API and browser sessions used only the isolated loopback database `marshgo_e2e_codex_20261026` and synthetic test identities. No production, shared user account, external provider, or real personal data was used.

## Browser results

- Admin OTP sign-in and overview: PASS.
- Admin partner list, provider registry, integration control center, and audit log: PASS; no browser JavaScript exceptions.
- Partner OTP sign-in and empty/onboarding overview: PASS.
- Partner organization application submission: PASS.
- Partner pending-application integration state and settings: PASS.
- Admin approval of the submitted partner: PASS; browser showed the active organization and success notice.
- Screenshots reviewed: `/tmp/marshgo-admin-portal-pr.png` and `/tmp/marshgo-partner-portal.png`. These are desktop portal captures, not acceptance of the passenger app's supplied mobile mockups.
- Partner local exact-PR source checks: typecheck, lint, 3/3 tests, and production build PASS. Admin exact-PR source checks: typecheck, lint, 4/4 tests, and production build PASS.

## Defect found and disposition

The stale Admin checkout at `bc37198ca139408907aaefa0d97dc9b60a568300` sent `status=` for the “all statuses” filter; the API correctly rejected it with `Invalid organization status filter`. This checkout was two commits behind the open Admin PR. The current PR head already fixes this in `src/adminQuery.ts` and tests it in `tests/admin-query.test.ts`; the fix was verified on the exact PR tree and was not duplicated or separately committed.

Several early browser attempts failed because a local Vite proxy was pointed at default port 3002 rather than the isolated API on 3310, and the OTP test rate limit was reached during retries. The test Vite was corrected to target 3310 and the rate limiter itself remained enabled. These setup failures are not product defects.

## Boundaries and remaining release work

This passes local authenticated portal acceptance on individually identified PR snapshots and a tree-identical API derivative. It does not establish a unified immutable six-repository release tuple, production deployment, staging, external provider entitlements, backup/restore/rollback, device acceptance, or production readiness. Admin/Partner PRs remain open and unmerged. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

## Next action

Reconcile exact Server/Site/iOS/Admin/Partner/root SHAs with the manifest and open PR ancestry without disturbing dirty worktrees; continue dense Lviv GTFS completeness and the remaining release gates on immutable candidates.
