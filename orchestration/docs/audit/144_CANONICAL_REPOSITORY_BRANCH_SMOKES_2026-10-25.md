# Canonical repository branch smoke checks — 2026-10-25

## Repository state and checks

| Repository | Branch / SHA | Worktree | Checks | Result / limitation |
|---|---|---:|---|---|
| MarshGO central | `codex/production-finalization-20261014` / `5ccef68dfdd58ab7fc44327018eafbc0c0102c0e` | 256 changed/untracked paths | `npm run check:production`; `npm run test:integration`; `git diff --check` | local release checks PASS; integration 30/30 PASS; external providers disabled and local fixtures used. Preserve tree. |
| MarshGO-Server | `feature/transport-layer-availability` / `182c77ae4f78d576a287007d8e0864fb130f43f8` | 30 changed/untracked paths | `npm run typecheck`, `npm run lint`, `npm test` | typecheck/lint PASS; 224 pass, 0 fail, 1 opt-in integration skipped. No changes made. |
| MarshGO-Site | `codex/sync-journey-mobility-ui` / `6961afcf008e2c845c0fde68c687ce61fe744f2f` | 40 changed/untracked paths | local check/build + fixture E2E | typecheck/lint/build/98 unit PASS; fixture E2E 25/25 PASS. Layers visual snapshot still about 5% different; see audit 142. No changes made in this checkpoint. |
| MarshGO-iOS | `codex/production-site-sync-20261014` / `4353cec3cacbaf662ceea047402f361024292b22` | clean | prior audit records unsigned simulator compile | no current physical-device, signing, APNs/TestFlight evidence. |
| MarshGO-Admin | remote `codex/p0-admin` / `bc37198ca139408907aaefa0d97dc9b60a568300` | isolated `/tmp` clone, clean | typecheck, lint, test, build | all PASS; 2/2 tests. Node 25.4.0 produced an engine warning; package requests Node 24.21.0. `main` HEAD `8ababeb88f1a6c9198125c9ed92906a2f7ad956b` contains only README. Candidate branch was not merged. |
| MarshGO-Partner | remote `codex/p0-partner` / `97a3727cc395dea092af6e3e24d6822370c2bc63` | isolated `/tmp` clone, clean | typecheck, lint, test, build | all PASS; 3/3 tests. Node 25.4.0 produced an engine warning; package requests Node 24.21.0. `main` HEAD `725cb5573db5cd8199aa12594f31277b72a6169f` contains only README. Candidate branch was not merged. |

Admin and Partner P0 refs were fetched read-only into temporary directories because their `main` refs do not contain application source. Their passing unit tests are presentation/access-state guards, not authenticated browser workflow acceptance or proof that the branches are integrated with the current Server SHA.

## Release decision

This is not a compatible six-repository release tuple. Do not promote these SHAs into a production manifest based only on branch-local checks. Outstanding: review PR DAG and stack dependencies, integrate candidate branches without overwriting dirty work, complete full visual acceptance, authenticated Admin/Partner workflows, live providers and rights, configured staging, security/load/recovery, backup/restore/rollback, exact iOS-to-Site sync and physical-device acceptance. No deployment was performed. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## GitHub PR state snapshot

Read-only `gh pr list --state all --limit 100` on 2026-10-25 returned:

| Repository | PRs observed | State summary | Relevant open candidates |
|---|---:|---|---|
| MarshGO | 6 | 6 open, 0 merged | #5 release-finalization draft; #6 security-dependencies draft stacked on it; #1 production/app split draft. |
| MarshGO-Server | 39 | 36 open, 3 closed, 0 merged | #35 Server RC; #36 production integration; #38 round search; #39 pathway retention, stacked. Also #37 stop relevance. |
| MarshGO-Site | 24 | 23 open, 1 merged | #21 Site RC, #22 map layers, #23 rideshare details, #24 feedback/place-search guard form a base-ref chain; additional navigation/rendezvous PRs remain open. |
| MarshGO-iOS | 14 | 12 open, 0 merged, 2 closed | #14 exact production-candidate pins; earlier Site/Server pin PRs remain open. |
| MarshGO-Admin | 2 | 2 open, 0 merged | #1 P0 operations console; #2 ownership guidance draft. |
| MarshGO-Partner | 2 | 2 open, 0 merged | #1 P0 onboarding workspace; #2 ownership guidance draft. |

The open branches are not automatically release-ready or mutually compatible. This is a PR inventory snapshot, not a completed dependency DAG or merge authorization. Exact PR base chains and source SHAs must be reviewed before integrating. No PR was modified, merged, or closed.
