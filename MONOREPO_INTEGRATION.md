# MARSHGO2 integration record

Status: **INTEGRATION CANDIDATE — NOT_RELEASED**
Updated: 2026-11-14 (integration review follow-up)
Working branch: `codex/marshgo2-current-integration-20261114`
Branch base: `87ec9584c40cdd306ba7e8e2bba052b1fdd1a4ea`

This change turns the existing source snapshot into a runnable workspace and
refreshes it from current canonical sources. It preserves application source
files, not the individual repositories' Git histories. No production deploy,
database write, port 7777 restart, or zrok restart is part of this integration.

Current review branch head before the follow-up commit: `58822deba3b84e3f8d2b7022355c417747915fa1`.

## Source provenance

| App | Canonical revision | Included work | Verification state |
|---|---|---|---|
| Site | `MarshGO-Site/main` `6ed4875ef8f02c5861dfe021e6baaac41b2205f3` | Qoder worktree `f88ba552c89697a0a32da582d638fad1fc075be2`: all 56 tracked working-tree edits and 32 untracked paths overlaid. This retains the route geometry/HyperFlight, compact sheet, hidden global dock on map, all transport modes, Magnetic Domino, haptic/audio feedback, place-search recovery, home-screen art and related tests. File-level comparison of all 88 changed paths found no missing Qoder paths; three integration files now add responsive-shell wiring/tokens and accessible tab names. | CI `43592559307` PASS on `7b69d673879681a5bb27e0947ef0975145468712`: Site typecheck, lint, tests and build all pass. Local simulator install/launch and interaction remain pending. |
| Server | Qoder A05 `248e413b2a9ee747ce3b0268ba724921b2e03501`, based exactly on merged `main` `53b8eed0a65550d1365e54c202fab5a65dd5ed58` | Includes merged Qoder CP5-A01 ordinals, CP5-A02 `TOTAL_ALL` fare basis, CP5-A03 proposal revision guard and the Qoder idempotency-key interval binding/tests from A05. Previously captured source-only files absent from current main were retained; see the preserved legacy files note below. | CI `43592559307` PASS on `7b69d673879681a5bb27e0947ef0975145468712`: typecheck/lint pass; tests 764 total, 758 pass, 0 fail, 6 opt-in skips. A05 targeted HTTP/idempotency checks remain separate from this unit suite. |
| iOS | `MarshGO-iOS/main` `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f` | Current canonical Capacitor shell and simulator project. Build is rewired to the integrated `apps/site` directory rather than fetching another Site checkout. | GitHub CI `43592559307` PASS for Simulator compile on `7b69d673879681a5bb27e0947ef0975145468712`; local iPhone 15 Pro Max boot, install, launch and interaction are pending. Do not infer device acceptance from generic compile. |
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

The original MarshGO2 snapshot also contained 13 tracked Server source/test/doc
files that are absent from the current canonical Server A05 tree. They were
preserved in the integration branch to avoid deleting existing work. They are
not imported into the current Server-main verification claim and need a
separate provenance/reconciliation review before any later cleanup.

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

Initial GitHub integration run `43589767277` on `58822deba3b84e3f8d2b7022355c417747915fa1` completed with: iOS Simulator compile **PASS**; Site typecheck and lint **PASS**, but Site tests were 886 pass / 6 fail because the already-imported responsive shell was not wired into the entry point, form-factor root, and screen hooks; Server typecheck **FAIL** because the preserved snapshot's `vehicle-country-scope.test.ts` targeted exports absent from current canonical Server. The responsive-shell wiring was added in the follow-up; the legacy country-scope test was preserved outside active canonical globs, with no claim that country filtering is implemented. Do not interpret the generic iOS compile as simulator install/launch or user-flow acceptance.

## 2026-11-14 13:59 EET — Qoder integration follow-up

- Latest source branch SHA: `7b69d673879681a5bb27e0947ef0975145468712` (`codex/marshgo2-current-integration-20261114`), pushed to origin. The CI run for this SHA is queued: `43592559307`.
- Previous run `43592249837` on `211d30ee6389d9d67cbef7612acf2da202e54908`: Site typecheck/lint/tests/build **PASS**; iOS Simulator generic compile **PASS**; Server typecheck and lint **PASS**, tests **757 pass / 1 fail / 6 skip**. The one failure was stale test wording for the Жмеринка feed. Its current catalog metadata explicitly says not to use it for route search until its CSV snapshot has consistent trip/stop_times IDs and route shapes.
- Updated only `apps/server/tests/ukraine-catalog-license.test.ts` to assert that actual exclusion and both defects. `git diff --check` passed. Local focused test could not start because `apps/server/node_modules` is absent (`tsx: command not found`); do not claim it ran. The queued GitHub CI is the next verification.
- Resource checkpoint: 26 GiB available disk, RAM free 36%, encrypted swap used 6,025 MiB. Docker/Virtualization and Qoder remained active, so no local Simulator build, boot, browser, Docker or other heavy process was started. Existing `:7777`, `:3002`, zrok and Qoder worktree remain untouched. Simulator target remains iPhone 15 Pro Max iOS 27.0, UDID `95861893-8B55-4A9C-B30D-C9BD1FCC4132`, currently Shutdown.
- Production remains **NOT_RELEASED**; the feature branch push is not a deployment. Continue with current CI, then run local Simulator install/launch only after resource contention clears.
- CI `43592559307` completed successfully on exact SHA `7b69d673879681a5bb27e0947ef0975145468712`: Site typecheck/lint/tests/build **PASS**; Server typecheck/lint and tests **PASS** (764 total, 758 pass, 0 fail, 6 opt-in skips); iOS Simulator compile **PASS**. This is CI compilation, not a locally booted simulator or interactive device acceptance.
- Local Simulator build remains deferred: latest resource sample still had active Docker Virtualization, Qoder, and shared Server `:3002`; disk 26 GiB free, memory free 36%, encrypted swap 6,300 MiB. Nothing in those services was restarted. Exact simulator install/launch and screenshots remain NOT_TESTED.

Simulator target: iPhone 15 Pro Max, iOS 27.0,
`95861893-8B55-4A9C-B30D-C9BD1FCC4132`.

## Release decision

**NOT_RELEASED.** Pushing this integration branch is source review, not a
production deployment. Release remains blocked until the pending checks and
independent release gates are evidenced. Do not push directly to protected
`main` or include credentials in this public repository.
