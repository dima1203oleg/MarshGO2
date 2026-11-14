# MARSHGO2 integration record

Status: **INTEGRATION CANDIDATE — NOT_RELEASED**
Updated: 2026-11-14
Working branch: `codex/marshgo2-current-integration-20261114`
Branch base: `87ec9584c40cdd306ba7e8e2bba052b1fdd1a4ea`

This change turns the existing source snapshot into a runnable workspace and
refreshes it from current canonical sources. It preserves application source
files, not the individual repositories' Git histories. No production deploy,
database write, port 7777 restart, or zrok restart is part of this integration.

## Source provenance

| App | Canonical revision | Included work | Verification state |
|---|---|---|---|
| Site | `MarshGO-Site/main` `6ed4875ef8f02c5861dfe021e6baaac41b2205f3` | Qoder worktree `f88ba552c89697a0a32da582d638fad1fc075be2`: all 56 tracked working-tree edits and 32 untracked paths overlaid. This retains the route geometry/HyperFlight, compact sheet, hidden global dock on map, all transport modes, Magnetic Domino, haptic/audio feedback, place-search recovery, home-screen art and related tests. | Tests and mobile simulator acceptance pending in this monorepo. |
| Server | Qoder A05 `248e413b2a9ee747ce3b0268ba724921b2e03501`, based exactly on merged `main` `53b8eed0a65550d1365e54c202fab5a65dd5ed58` | Includes merged Qoder CP5-A01 ordinals, CP5-A02 `TOTAL_ALL` fare basis, CP5-A03 proposal revision guard and the Qoder idempotency-key interval binding/tests from A05. | Merged A01/A02/A03 CI passed on `main`; A05 targeted checks still pending here. |
| iOS | `MarshGO-iOS/main` `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f` | Current canonical Capacitor shell and simulator project. Build is rewired to the integrated `apps/site` directory rather than fetching another Site checkout. | iPhone 15 Pro Max Simulator build and launch pending. |
| Admin | `main` `d8afa64c4efda8ce4f10557a03651943effa52a7` | Existing source snapshot. | Workspace checks pending. |
| Partner | `main` `4d605d4353af281dd295fabf0c7c2ac05efe222e` | Existing source snapshot. | Workspace checks pending. |
| Orchestration | `MarshGO` `antigravity/ultimate-premium-web-9` `4fd9bd70dd36b49f1c538c7a3e1a2cd1dc5ae0fd` | Selected docs, checks, end-to-end tests, operations and shared contracts from the captured dirty worktree. Runtime caches, environment files and generated release artifacts are excluded. | No production acceptance claim. |

Site import procedure: start with the current upstream Site `main`, then overlay
the active Qoder worktree's tracked deltas relative to its own HEAD and its
untracked source/test/assets. The upstream baseline was retained for files
where the Qoder working tree already matched current `main`. Qoder's working
tree was not edited or restarted.

Server A05 is an additional Qoder commit not yet merged to canonical Server
`main`; its source and tests are included so they are not lost. This does not
claim A05 is verified or released. Keep it visible for review until its
targeted checks pass and the canonical PR/main state is resolved.

## Workspace wiring

- Root `dev`, `build`, `preview`, and `test` commands now target `apps/site`.
- Root scripts expose Site and Server checks plus `ios:simulator`.
- The iOS wrapper builds `../site`, embeds source revisions in the release
  manifest, and syncs Capacitor from `../site/dist`.
- The Site map environment loader also recognizes a private, ignored
  `MarshGO2/.env`; only explicitly prefixed map settings are considered.
- No app `.env`, credentials, `node_modules`, `dist`, `build`, Xcode cache or
  Docker volume is part of the source integration.

## Initial verification and evidence

| Check | Result |
|---|---|
| Source pin / branch / dirty-tree inventory | Recorded above; existing Qoder and canonical working trees left unchanged. |
| Server merged A01/A02/A03 CI | PASS on Server `main` (`43573347454`); includes ordinal, fare-basis and proposal-revision database proofs and integration suite. |
| Qoder Server A05 interval-idempotency change | Included from `248e413`; verification pending. |
| Site typecheck, tests, build | Pending. |
| Cross-app contract checks | Pending. |
| iPhone 15 Pro Max Simulator build/install/launch | Pending. |
| Interactive application acceptance | Pending; simulation does not prove production auth, live feeds, GPS, booking or physical-device behavior. |

Simulator target: iPhone 15 Pro Max, iOS 27.0,
`95861893-8B55-4A9C-B30D-C9BD1FCC4132`.

## Release decision

**NOT_RELEASED.** Pushing this integration branch is source review, not a
production deployment. Release remains blocked until the pending checks and
independent release gates are evidenced. Do not push directly to protected
`main` or include credentials in this public repository.
