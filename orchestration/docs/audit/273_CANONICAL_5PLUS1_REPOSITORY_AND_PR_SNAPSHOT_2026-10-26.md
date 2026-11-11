# Canonical 5+1 repository and PR snapshot — 2026-10-26

Read-only Git/GitHub reconciliation. No branches, PRs, repository contents, containers or databases were deleted, reset, merged or deployed.

## Local checkouts

| Repository | Local HEAD / branch | Local state |
|---|---|---|
| `MarshGO` | `affef61e4706b2b9ce95c3ab4c2f5e2c0607e1dd`, `codex/production-finalization-20261014` | 5 commits ahead of origin and many pre-existing modified/untracked audit/release files; preserved |
| `MarshGO-Server` | `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, `feature/transport-layer-availability` | 2 commits ahead and dirty/untracked implementation files; preserved |
| `MarshGO-Site` | `1a922010562f334fe77e79fd0a89181c2f2f9963`, `codex/sync-journey-mobility-ui` | branch aligned with origin, dirty/untracked UI work; preserved |
| `MarshGO-iOS` | `4353cec3cacbaf662ceea047402f361024292b22`, `codex/production-site-sync-20261014` | clean checkout |
| `MarshGO-Admin` | — | checkout absent locally |
| `MarshGO-Partner` | — | checkout absent locally |

All six GitHub remotes resolve to `dima1203oleg/<canonical repository>`.

## Current relevant open PR candidates

| Repository | PR stack / head | State |
|---|---|---|
| Server | #43 `4ed81b47e45520475470b699deac115fb0000b69` → #44 `aaa1328f17c35029b7efa4f801dfae07301a9517` → #45 `cb16fe8352c78917eaf6d89f675d6ae58461916f` | all OPEN and merge-state CLEAN; #44/#45 draft; #45 is the latest service-date fix atop #44 |
| Site | #21 `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9` → #22 `5a12c6fbf0b18ca479e92c93d6d9597d567734d3` → #23 `9569bb4f174a4bdf912a6f490e69a359148db342` → #24 `16f5b217bea479268eb10ad021fb22ebe1beba3c` → #25 `7aed5344218058b024f5c269b36b03577d94026e` → #26 `1b5986de5af875c5c2945df4752c23603c135ed3` → #27 `cc1499573732a41e8ff31d7ab634d15421d45df1` → #28 `d6c9a957a5f767a491daed2ffb5e70bb8ed8b559` | open stack; merge-state CLEAN; #28 draft |
| iOS | #14 `be5478bed577b91a89035fe6785ab938f0335799` → #15 `7468cee5cdcb3d3a3fb4c182c0da6e1dc3a9f2aa` | OPEN; #15 draft and pins Site #28 / Server #43 per current manifest |
| Admin | #1 `a008dbad8edc5d81d716a0913e10c325f739540b` | OPEN, CLEAN |
| Partner | #1 `5ec9f368d2788e44483a0effe6eac34838e89790` | OPEN, CLEAN |
| Integration | #5 `688b58ca6eeae0175ee34cf1c423a3e35c9f765d` → #6 `2b87b8b016ce8b4c309adc4399ad31b81781cd09` | OPEN; #5 UNSTABLE, #6 draft |

The central release manifest pins the review tuple Server #43 + Site #28 + iOS #15, while the newer Server #44/#45 stack is not in the iOS/manifest tuple. This is an explicit integration decision still to reconcile; do not silently replace the pin. Admin/Partner source access is not available in local checkouts, and the manifest records the owner-managed cross-repo read token as a materialization blocker.

## Release disposition

No single integrated exact-SHA/image tuple, verified staging origin or deployed SHA is established. Current frozen Lviv routing remains truncated (audit 272). Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`; no release deployment was attempted.
