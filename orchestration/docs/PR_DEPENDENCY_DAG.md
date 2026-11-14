## Qoder stacked PR #72/#73 decisions — 2026-11-08 13:32 UTC

| PR | Base / head | Decision | Evidence / reason | Next gate |
|---|---|---|---|---|
| Server #72 | `qoder/qr-attestation-evidence` / `f681a1fc897f9871bdb6ee6c68f5913ee1901f87` | SUPERSEDED | Visual-zone module/test match current main byte-for-byte. Residual live-segment diff weakens exact trip/vehicle identity; both verify checks fail. | Keep current main identity validation. |
| Server #73 | `qoder/viz-engine-4-server` / `57ebc85630bf58e71d52eff2ddea354c7d28e246` | SUPERSEDED | Stacked on #72; current main already implements search-completeness indicators. Branch deletes walking-reach/extended-walk disclosures and tests; both verify checks fail. | Keep main's disclosure and continue live route completeness investigation. |

## Root PR #23 exact-head gate — 2026-11-08 13:22 UTC

| PR | Base / head | Decision | Evidence / reason | Next gate |
|---|---|---|---|---|
| Root #23 | base `1e7d0ee74f11121a7d5a29c6379944a5360581c4` / Qoder `0c10d116d6d50fd7de44276b6b6d7cfd7ccec3c8` | BLOCKED | Required run `42482724709` fails at exact-SHA materialization: Server and Site clones succeed; private Admin clone returns HTTP 403. Configured Actions credential lacks Admin read authorization; Partner access is unverified. CodeQL/Gitleaks pass. | Owner updates `MARSHGO_REPOS_READ_TOKEN` with read-only Contents access to Admin and Partner; rerun exact-head required checks. Do not weaken materialization. |

## Server PR #119 decision — 2026-11-08 13:18 UTC

| PR | Base / head | Decision | Evidence / reason | Next gate |
|---|---|---|---|---|
| Server #119 | Qoder `qoder/integration-20261108` / `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`; code commit `f8c3403296e4504fb2805487dbb857fb8f55c061`; current main `d8c25a560187a89aaa42422d602802854c19c694` | SUPERSEDED | Safe malformed-geocoder handling/readiness and scoring-oracle additions are already in main via #120. Residual differences weaken optional-geocoder readiness, treat capped stops as complete without schedule/transfer equivalence, loosen the regression assertion, and remove planner diagnostics from the feed smoke. PR is OPEN / DIRTY; green checks are on its older base. | Do not merge or port residual diff. Investigate real GTFS candidate-graph truncation and preserve honest partial status. |

## Current root integration decision register — 2026-11-08 06:35 UTC

| PR | Base / head | Decision | Evidence / reason | Next gate |
|---|---|---|---|---|
| Root #22 | `qoder/checkpoint-20261031` / `165a4d7a63b804a3545af704ec7661cc43c90f00` | BLOCKED | CodeQL and Gitleaks pass. Required `verify` fails in `materialize-release.mjs`: cloning private MarshGO-Admin returns HTTP 403, although the read-only-access setup step succeeds. | Owner refreshes `MARSHGO_REPOS_READ_TOKEN` with Contents: read to private Admin and Partner; rerun exact-head checks. |
| Root #12 | `main` (`1e7d0ee74f11121a7d5a29c6379944a5360581c4`) / `qoder/checkpoint-20261031` (`0fc36cf1ec588d42b0f43eb51374b6b18b9f4757`) | BLOCKED | `verify` and aggregate CodeQL fail; JS/TS CodeQL and Gitleaks pass. It depends on the stacked #22 temp-directory fix and still has the private-repository authorization blocker. | Recheck after #22 is merged into its declared stacked base; do not bypass branch protection. |

## Latest portal candidate heads — 2026-10-26

- Server PR #43: `4ed81b47e45520475470b699deac115fb0000b69`, stacked on Server PR #42. It includes the Admin aggregate audit endpoint and a lazy reverse-transfer reachability scan. Both exact-head hosted checks pass (runs `40304476493`, `40304482350`).
- Admin PR #1: `a008dbad8edc5d81d716a0913e10c325f739540b`; hosted verify passes. It consumes the metadata-only `/api/v1/admin/audit` endpoint introduced by Server PR #43, so it must not be released ahead of that API.
- Partner PR #1: `5ec9f368d2788e44483a0effe6eac34838e89790`; hosted verify passes. Its one-line UI fix exposes Settings in mobile navigation.
- All three PRs remain OPEN. Local isolated Admin/Partner acceptance is 54/54 responsive portal viewport/section checks; no production tuple has been selected or deployed. Evidence: [audit 225](audit/225_PORTAL_RESPONSIVE_NAVIGATION_ACCEPTANCE_2026-10-26.md).

## Latest portal audit stack — 2026-10-26

- Server PR #43 (`4ed81b47e45520475470b699deac115fb0000b69`) is stacked on Server PR #42 branch `codex/gtfs-sorted-frontier-scan-20261025`; #43 contains the Admin aggregate audit endpoint, regression assertions, and the parity-checked lazy reverse-transfer reachability optimization versus its base.
- Admin PR #1 (`a008dbad8edc5d81d716a0913e10c325f739540b`) consumes `/api/v1/admin/audit` and displays the actor field. It must be tested with Server #43 or a tree-identical source.
- Partner PR #1 remains `97a3727cc395dea092af6e3e24d6822370c2bc63`. All PRs remain open. Do not merge them as a loose set; reconcile a manifest-pinned tuple and test together first.
- Details: [audit 224](audit/224_ADMIN_AUDIT_FEED_CROSS_REPO_FIX_2026-10-26.md).

# Open PR dependency graph — 2026-10-26

GitHub open-PR metadata was queried for all six canonical repositories. Arrows below mean **head branch → base branch**. They describe GitHub PR ancestry, not confirmation that the change is integrated in the current release manifest.

## Orchestrator (`dima1203oleg/MarshGO`)

```text
#6 security-dependencies -> production-finalization (#5) -> marshgo-production (#1) -> main
#4 unified-repository-governance -> navigation-experience-6 (#3) -> redis-smart-cache (#2) -> marshgo-production (#1)
```

PR #2 is `CONFLICTING`; #1, #3–#6 are reported mergeable. #1/#4/#5/#6 are drafts. Resolve the cache chain before considering the release chain; do not merge all heads independently.

## Server (`MarshGO-Server`)

```text
#42 sorted-frontier-scan -> #41 nearby-stop-retention -> #40 current-pr39-integration
 -> #39 pathway-retention -> #38 round-search -> #36 production-integration
 -> #34 raptor-round-search -> #33 raptor-multilabel -> #31 realtime-freshness
 -> #30 lazy-event-search -> #29 candidate-diversity -> #28 compact-edge-retention
 -> #27 bounded-timetable -> #26 Lviv-trip-update -> #25 direct-only-search
 -> #24 route-oracle -> #23 sampling-truncation -> #22 freshness -> #21 server-release-integration
 -> #19 GTFS fixture / rendezvous stack -> #17 trip-segment-sampling -> #15 transfer-rule-index
 -> #14 worker-bounded-cache -> #12 journey-search-completeness -> #10 -> #9 -> main
```

Separate branch families include PR #20/#19 rendezvous/HTTP-fixture work, PR #7/#5/#4/#3 mobility-registry/cache/partner foundation, PR #6 GTFS stop arrivals, PR #2 bearer parsing. PR #1 rendezvous-live-pickup is `CONFLICTING`. Most recent PRs #38–#42 are a deep draft stack. Existing local dirty Server branch is PR #7's head branch, while current working code has additional uncommitted deltas.

Portal ancestry cross-check (2026-10-26): PR #42's exact head `a403a51a203d9d89685c10c69658c8fd95b70e9b` already contains the partner organization and Admin connector implementation from the partner-platform commit family. A separately constructed verification branch has identical source tree SHA `86c3899bed947fa94a7e30bca7ace6c61ab16b62`; this is not a new PR delta. Server portal API integration tests pass on that tree, but the separate Admin/Partner web clients still need authenticated browser acceptance against the exact tuple.

## Site (`MarshGO-Site`)

Current candidate revalidated on 2026-10-26: PR #28 head `d6c9a957a5f767a491daed2ffb5e70bb8ed8b559` targets PR #27 (`codex/site-gtfs-truncation-reasons-20261025`). It now carries the canonical reference colors and CSS-registry parity test; local checks pass, hosted CI is pending. Evidence: [audit 255](audit/255_SITE_PR28_CANONICAL_COLOR_PARITY_2026-10-26.md).

```text
#28 site-working-snapshot -> #27 GTFS-truncation-reasons -> #26 map-layers-fit -> #25 current-pr24-integration
 -> #24 place-search-guard -> #23 rideshare-route-detail -> #22 map-layers-reference
 -> #21 site-final-rc -> sync-journey-mobility-ui (#3) -> main
```

Earlier route-sheet/navigation chain: PR #20 -> #19 -> #18 -> #15, with PR #17 also targeting the route-overview branch. Rendezvous and production integration chain: PR #14 -> #13 -> #12 -> #11 -> #9 -> main; PR #10 also targets integration #9. PR #1 rendezvous-live-pickup is `CONFLICTING`. The current dirty checkout is the base for PR #21, not a cleanly materialized immutable candidate.

## iOS (`MarshGO-iOS`)

Current release-candidate PR #14 targets `main` directly and is reported mergeable. Older exact-pin stack: PR #12 -> #11 -> #9 -> #8 -> #7 -> `main`; PR #3 redis-smart-cache is `CONFLICTING`, and PR #1 simulator-smoke-capture is `CONFLICTING`. Do not combine this older stack with PR #14 without comparing exact Site and Server pins.

## Admin and Partner

- Admin PR #1 `codex/p0-admin -> main` is open and mergeable; PR #2 ownership guidance is a draft.
- Partner PR #1 `codex/p0-partner -> main` is open and mergeable; PR #2 ownership guidance is a draft.

## Closed and merged PR history

The current `state=all` query found these non-open PRs (others in these repositories are open as listed above):

| Repository / PR | State | Exact head SHA | Base SHA | Use in current candidate |
|---|---|---|---|---|
| Server #18 transfer-graph-underfill | Closed, not merged | `8a30211358da46243c15d8525d0d38f668bdca5c` | `751d83aedadf9b46b48b3d7e8103475cc058ffff` | Keep as unmerged history; compare unique logic before using. |
| Server #16 rendezvous-approach-routes | Closed, not merged | `5dcaa80b4a5cd52cf900b7f0f58bd807fdea734e` | `bdfdf24941809f4581965b9847022c68e0b2f127` | Do not assume its code is present in current candidate. |
| Server #13 GTFS queue scheduler | Closed, not merged | `f235ca91c75996bd2d5645642780ba7467a7574c` | `4a9015c476cc8ead44617c4544456a5cbf1a8f06` | Search/compare before integrating; closed candidate is not release code. |
| Site #16 self-contained map E2E | Merged | `fdeaa48fca8d05cda49dc2890b900ad9d714236f` | `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae` | Merged test infrastructure; current dirty source contains subsequent changes. |
| iOS #13 old exact pin | Closed, not merged | `ccb233495dfbc638b565b0a15ef5ba29e9109451` | `b8b1fcbfe9997e1a7a27594b5759690147de75df` | Current RC is separate PR #14; do not combine without comparing pins. |
| iOS #10 first-paint pin | Closed, not merged | `7df237845d8841a98a5c15082677ec4198728339` | `b8b1fcbfe9997e1a7a27594b5759690147de75df` | Historical unmerged candidate. |

## Exact current PR checks (read-only)

- Server #42: both `verify` checks PASS on its exact head.
- Site #27: both `verify` checks PASS on its exact head.
- iOS #14: both `simulator-build` checks PASS on its exact head and pins manifest Site/Server SHAs.
- Admin #1 and Partner #1: current `verify` checks PASS on their manifest SHAs.
- Orchestrator #5: `verify` FAIL; the failing step is **Configure read-only access to private Admin and Partner repositories** (missing repository-read credential). CodeQL and Gitleaks checks PASS. No check was bypassed.

## Safe integration conclusion

There are long stacked PR chains, drafts, conflicting PRs, and local source deltas. The safe path is to select one reviewed head per component, verify its parent ancestry and checks, then pin the exact 5+1 tuple in the orchestrator. This inventory does not authorize or perform merges, branch deletion, force-push, or deployment.
## Server GTFS frontier guard — 2026-10-26 update

- Server PR #44 `codex/gtfs-queue-frontier-20261026` at `aaa1328f17c35029b7efa4f801dfae07301a9517` is stacked on the exact PR #43 candidate branch `codex/server-partner-integration-20261026` at `4ed81b47e45520475470b699deac115fb0000b69`.
- PR #44 exact-head `verify` runs `40313885418` and `40313914470` pass. PR #44 remains draft and unmerged; do not include its SHA in the release manifest until PR #43 dependency and final candidate are reconciled.
- Change is a bounded pending GTFS search-work queue with truthful truncation. Dense feed search remains partial; no production deployment or readiness claim.

## Root release PR stack — 2026-11-07 12:53 EET

| PR | Exact head | Base/dependency | Current decision | Evidence/blocker |
|---|---|---|---|---|
| #12 | `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757` | `main` at `1e7d0ee74f11121a7d5a29c6379944a5360581c4` | `MERGE` only after exact-head checks | Current fetched CI list is historical (runs 41918171695/41918171313 failed at missing secret). Exact pinned materialization/E2E/browser compatibility not yet proven. |
| #18 | `ae5a62bd2a02785626fd0c45d691cf3a377aa5e1` | Stacked on #12 | `MERGE` only after parent #12 and required checks | Removes fixed test password and isolates evidence temp directory; browser/API probe not run. |
| #20 | `041ab47d083830f1b4271ccf4c3b5d6cde080339` | Stacked on #18 | `MERGE` candidate after #12/#18 and exact-head checks | Run 42265893827 passed pre-materialization checks; read-only source setup succeeded, clone of private Admin returned HTTP 403; Docker/E2E/browser checks skipped. Latest run evidence was appended to the PR description. |
| #19 | `39d3ed414b580d5eb261495c8f37958fd29584d4` | Divergent `qoder/release-manifest-20261102` base `70ff20d9bf3af8fa7b2e62f735c32f8fda3e75d7` | `NEEDS_REVIEW` / do not merge alongside #20 | Narrower overlapping validator and integration SHA guard; run 42260243452 passed pre-access checks and failed private-source access. Compare/port any unique guard only if still needed after #20 is rebased onto the selected stack. |

Dependency order for the root release work is #12 → #18 → #20. #19 is an alternative implementation on a divergent base, not an additional stack member. No root PR is merged by this checkpoint. A fresh credential with read-only Contents access to both private Admin and Partner repositories must be authorized before clone, Docker and browser gates can complete.

## Site walking-provenance correction — 2026-11-07 13:17 EET

| PR | Base SHA | Head SHA | Decision | Evidence / dependency |
|---|---|---|---|---|
| MarshGO-Site #85 | `c13e648d1b9b08fced31eeda67fe9f29fae08526` | `75362b15a390e2084b864a3f41d56633423b9788` | `ALREADY_IN_MAIN` | Squash merge `3ade7a1b0035024a829b467b71e7ed60d9d9f3ea`; both exact-head required `verify` runs `42367509530` / `42367484358` passed. PR #56 is separate, older-base work and needs refreshed checks. |

### Merge verification — 2026-11-07 13:20 EET

Site PR #85 merged with required status checks satisfied. Current remote `MarshGO-Site/main` is `3ade7a1b0035024a829b467b71e7ed60d9d9f3ea`. PR #56 remains open and is not approved for merge by this decision: its base predates #85 and its old green CI is not current-base evidence.

Scope: mark legacy synthetic city-grid WALK paths/distance as approximate, with dashed fallback when the source omits a shape. Provider geometry remains exact. Does not provide live routing or modify saved journeys.

## Refresh — 2026-11-07 13:48 EET

### Root PR chain (current GitHub metadata)

| PR | Base branch/SHA | Head branch/SHA | Current checks | Decision |
|---|---|---|---|---|
| #12 | `main` / `1e7d0ee74f11121a7d5a29c6379944a5360581c4` | `qoder/checkpoint-20261031` / `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757` | verify and one CodeQL run failed; other security scans pass | Keep first in chain; do not merge until exact-head checks pass. |
| #18 | #12 branch / `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757` | `codex/root-ci-evidence-hardening-20261106` / `ae5a62bd2a02785626fd0c45d691cf3a377aa5e1` | verify failed; CodeQL/Gitleaks pass | Stacked after #12; exact current-base checks required. |
| #20 | #18 branch / `ae5a62bd2a02785626fd0c45d691cf3a377aa5e1` | `qoder/release-manifest-validator-20261106` / `041ab47d083830f1b4271ccf4c3b5d6cde080339` | verify failed at private Admin clone (HTTP 403); CodeQL/Gitleaks pass | Do not merge until source access and required checks pass. |
| #19 | `qoder/release-manifest-20261102` / `70ff20d9bf3af8fa7b2e62f735c32f8fda3e75d7` | `qoder/exact-sha-manifest-gate-20261106` / `39d3ed414b580d5eb261495c8f37958fd29584d4` | verify failed at private-source materialization; CodeQL/Gitleaks pass | Divergent alternative; compare/port only after selecting a root stack. |

Observed configuration includes an Actions secret named `MARSHGO_REPOS_READ_TOKEN` (value intentionally not inspected); current root verification still receives HTTP 403 for private Admin materialization. Owner action: replace it with a fresh fine-grained credential having read-only Contents access to the exact Admin and Partner repositories, then rerun required checks. Rotate/revoke the credential previously pasted in chat. Do not route an interactive desktop OAuth token into Actions.

Root PR #20 remains OPEN / UNSTABLE. Root main is still the older `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; do not treat an open stacked PR as part of main or as an exact release candidate.

### Site search controls

Site PR #86 (`codex/search-layout-20261107`, head `111cfea0360908861bde956eedad08c5b253878d`, base `3ade7a1b0035024a829b467b71e7ed60d9d9f3ea`) merged with both required exact-head checks passing. Merge/current Site main is `39681cd1800cf71639c3f5232fbec7d3c8a47d38`; post-merge CI run `42369380819` passed. Visual browser acceptance remains NOT_TESTED.

### Agent availability

Qoder UI was inspected at 2026-11-07 13:47 EET: its Qwen task PR #19 remains open, but the app reports “Daily chat limit reached”; no new Qoder task can be dispatched in this session. The existing PR's evidence is documented above; do not claim that a new Qwen run occurred.

### Exact-SHA materializer follow-up — 2026-11-07 14:20 EET

| PR | Base → head | Decision | Evidence / remaining gate |
|---|---|---|---|
| #19 Qoder exact-SHA manifest gate | `qoder/release-manifest-20261102` `70ff20d9bf3af8fa7b2e62f735c32f8fda3e75d7` → `39d3ed414b580d5eb261495c8f37958fd29584d4` | **PARTIAL_PORT** of the materializer's raw `integration_sha` gap; **do not merge the PR wholesale** | Divergent from #20; Qoder validator replacement removes stronger URL/placeholder/evidence/legacy-schema checks already present on #20. Current #20 manifest passes the stronger validator. PR #19 verify failed; security scans passed. |
| #21 exact integration pin materializer guard | #20 head branch `qoder/release-manifest-validator-20261106` at `041ab47d083830f1b4271ccf4c3b5d6cde080339` → `a93aa3617094d33c8222269f1db360f923665a25` | **PARTIAL_PORT / BLOCKED_EXTERNAL** | Local validator 81/81, contract 3/3, manifest CLI 6/6 pins. Exact-head run `42371962621`: manifest, install/audit, lint, typecheck, unit/ops/integration tests, migrations, build and bundle passed; materialization failed only cloning private Admin (HTTP 403); CodeQL/Gitleaks passed. Stacked behind #20; no merge until Actions repo-read credential is corrected and #12/#18/#20 are mergeable. |


### Site React runtime fix — 2026-11-07 14:41 EET

| PR | Base SHA | Head SHA | Decision | Evidence / remaining gate |
|---|---|---|---|---|
| MarshGO-Site #87 | `39681cd1800cf71639c3f5232fbec7d3c8a47d38` | `36adfa6f0ab7db78115eee02461f485a1cb2f512` | MERGE after required CI | `resolve.dedupe` makes the app and `react-dom/client` use one optimized runtime; visual browser reload renders the welcome screen. Exact-head CI `42373538205`: lint, typecheck, unit tests, token checks, build, bundle and single-React gates passed; Playwright install is in progress and boot-smoke pending. PR open/mergeable; not merged. Local address autocomplete still returns `503 geocoder_unavailable`; no staging claim. |


### Site React runtime fix — final decision (2026-11-07 14:44 EET)

| PR | Base SHA | Head SHA | Decision | Final evidence |
|---|---|---|---|---|
| MarshGO-Site #87 | `39681cd1800cf71639c3f5232fbec7d3c8a47d38` | `36adfa6f0ab7db78115eee02461f485a1cb2f512` | **ALREADY_IN_MAIN** | Exact-head CI `42373538205` succeeded including `npm run lint`, `typecheck`, `test`, `build`, `check:bundle`, `check-single-react`, and `boot-smoke`; visual reload rendered welcome screen. Squash merge `cf2fa64c8b8545e3c4554aa1438d0ed06021014b`; fetched `origin/main` confirms same SHA. Post-merge workflow run not observed yet. |

## Reconciled PR decisions — 2026-11-07 15:50 EET

This section supersedes earlier rows above where PR state has advanced. Historical sections remain as point-in-time evidence.

| Repository / PR | Base → head | Decision now | Current evidence / remaining gate |
|---|---|---|---|
| MarshGO-Site #86 | `3ade7a1b0035024a829b467b71e7ed60d9d9f3ea` → `111cfea0360908861bde956eedad08c5b253878d` | **ALREADY_IN_MAIN** | Merged as `39681cd1800cf71639c3f5232fbec7d3c8a47d38`; post-merge CI `42369380819` passed. Screenshot-requested provider/search controls require manual visual confirmation. |
| MarshGO-Site #87 | `39681cd1800cf71639c3f5232fbec7d3c8a47d38` → `36adfa6f0ab7db78115eee02461f485a1cb2f512` | **ALREADY_IN_MAIN** | Merged as `cf2fa64c8b8545e3c4554aa1438d0ed06021014b`; exact-head CI including boot-smoke passed. |
| MarshGO-Site #88 | `cf2fa64c8b8545e3c4554aa1438d0ed06021014b` → `e5179e469a25da4824c9289660c1e53cc17c5819` | **ALREADY_IN_MAIN** | Squash merge / current Site main `250ccf04ec56de676a19e1797b15a40319978bac`; targeted tests 26/26, exact-head CI `42376256802` and `42376281612`, post-merge CI `42376821848` passed. Visual confirmation on this SHA is pending a separate clean preview after owner sign-in. |
| MarshGO root #21 | #20 head `041ab47d083830f1b4271ccf4c3b5d6cde080339` → `a93aa3617094d33c8222269f1db360f923665a25` | **PARTIAL_PORT / BLOCKED_EXTERNAL** | `gh pr view` rechecked at 15:50 EET: OPEN, MERGEABLE; verify run `42371962621` FAILURE because Actions cannot clone private Admin (HTTP 403); CodeQL/Gitleaks pass. Do not merge or rerun until the least-privilege private-repository read credential is repaired. |

Current observed `main` tuple remains observation-only: root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; Server `9df0ae097abc43a4f611151a482c349a8f931a82`; Site `250ccf04ec56de676a19e1797b15a40319978bac`; iOS `ad27b6f70b6255d1dd323bafcffafe4558232224`; Admin `02b28940ee017523f2feed01de458f8d0aa20279`; Partner `179631f45e984c5712bef83af43912125e3521d1`. No exact six-SHA compatibility gate has passed.


### Site destination field map-pin correction — 2026-11-07 16:03 EET

| PR | Base → head | Decision | Final evidence |
|---|---|---|---|
| MarshGO-Site #89 | `250ccf04ec56de676a19e1797b15a40319978bac` → `47e2329f9bdbd291457bca8229b58f54adadcbf6` | **ALREADY_IN_MAIN** | Squash merge/current Site main `864e2383da8b0f1355e534381d2783017b7d1a51`. Restores the compact in-field destination pin for the empty field while retaining the conditional clear action and omitting the redundant full-width map-picker row. Focused tests 26/26 and targeted ESLint passed; exact-head `verify` runs `42379179535` and `42379197776` passed. Post-merge CI `42379422310` passed on exact main SHA. Local screenshot review on the updated `:4181` preview confirms the destination in-field pin and requested search controls at one approx. 630×940 viewport; other sizes and button interaction are NOT_TESTED. |

## Qoder / Antigravity contribution reconciliation — 2026-11-07 16:31 EET

| Source | Current decision | What was preserved / why | Evidence or blocker |
|---|---|---|---|
| MarshGO-Site PR #56 (`qoder/search-empty-honesty-20261103`, head `ce559b3a69a10d1aba0295e87a5ae8f64f9e28f8`) | **PARTIAL_PORT** | Per-provider notices now keep schedule fallback and rejected-candidate explanations amber while real feed/queue outages remain rose. Qoder's nested walkingReach UI helpers and diagnostic additions were not duplicated; current main already has those contracts, approximate legacy-walk distance, truncation and retry states. | Site PR #90 merged at `9c637c7dcbf0815b72478f64666d8a05267ece6c`; exact-head runs `42381729385`/`42381732849` passed. Local tests 7/7 + 29/29. Post-merge run `42381911143` completed successfully on the merge SHA. Fixtures only, not live feed verification. |
| MarshGO-Site PR #51 (`qoder/cp6b-site-activation-20261103`, head `106903fac1a3a699ebed3f35d18ad890c0d00ad1`) | **ALREADY_IN_MAIN (feature)** | Server-backed passenger journey activation/end and restoration from journey state are already in current Site main. Keep stale PR unmerged; avoid duplicate client lifecycle code. | Verified current main has `productionApi.activateJourney`, lifecycle service, active navigation and lifecycle tests; Server main has `/activate`, `/end`, audit and integration tests. PR itself remains dirty and depends on stale Server #76. |
| MarshGO-Server PR #76 (`qoder/cp6-journey-activation-20261103`, head `15ad28e3bc70b124799c671737501d1da40ed5ff`) | **ALREADY_IN_MAIN (feature); PR not merged** | Passenger journey lifecycle behavior exists in current Server main; its old stacked router/timetable patch is not merged wholesale. | Current Server `origin/main` has `/api/v1/journeys/:id/activate` and `/end`, `journey_already_finished`, audit events and `journey-activation.integration.test.ts`. PR #76 remains DIRTY/conflicting. |
| MarshGO-Server PR #72 / #73 (Qoder viz/completeness stack) | **NEEDS_REVIEW / BLOCKED** | Do not merge stacked candidates as-is; retain for a later isolated diff review and choose only missing behavior. | `UNSTABLE`, exact checks had failures, bases are stacked on older Server heads. Current main already has walking routing and completeness contracts; candidate-only claims require file-by-file comparison. |
| Antigravity dirty Server worktree `antigravity/ukraine-12-transports-multimodal`, local base `e9934abbd8fc973177de8d7f47548739758a1b74` | **PRESERVED / NEEDS_REVIEW** | No edits to the dirty worktree. Geometry provenance and fail-closed static-estimate policy are promising; the branch also includes generated grid paths and broad route-engine changes that must not be presented as source geometry/live service. | 3 tracked modifications + 4 untracked files observed; no tests run in this checkpoint. Requires isolated port, precise data-source semantics and CI before integration. |
| Antigravity walking-distance provenance change (Site PR #85) | **ALREADY_IN_MAIN** | Legacy `walking` / `transfer-walk` distances render approximate; do not re-port. | Previously merged Site main and existing `journey-result-presentation` tests cover approximate legacy distances. |

Unchanged release blockers: root Qoder manifest stack remains unable to materialize private Admin in CI (HTTP 403); no managed staging target and no exact six-SHA acceptance. This decision register classifies the candidates above; it is not a claim that every historical PR/commit from every agent has been exhaustively replayed on one release candidate.

### Additional Qoder / Antigravity reconciliation — 2026-11-07 16:34 EET

| Candidate | Decision | Evidence |
|---|---|---|
| Server PR #83, Antigravity multimodal-chain/registry candidate (head `47d1833a116bafdf2beeb76f13826eede13c6dea`) | **ALREADY_IN_MAIN (code)** | Merge commit `88634119a63f3078eb78039cc39102bf8351e36c` is an ancestor of current Server main. Its registry, intercity chain, feed audit and replay tooling are already integrated. This confirms code presence only; active provider rows and current live feed availability remain unverified. |
| Site PR #85, Antigravity walking provenance (head `75362b15a390e2084b864a3f41d56633423b9788`) | **ALREADY_IN_MAIN** | Merge commit `3ade7a1b0035024a829b467b71e7ed60d9d9f3ea` is an ancestor of current Site main; tests cover legacy walking labels as estimates. |
| Site PR #54, Qoder motion primitives | **ALREADY_IN_MAIN (feature)** | Current main imports `src/styles/motion.css` and includes global/local `prefers-reduced-motion` guards. The stale branch is not merged wholesale. |
| Site PR #55, Qoder theme/error feedback | **PARTIAL_PORT — MERGED as Site PR #91** | Theme bootstrap was already represented in main. Journey-search failures were selectively ported with alert semantics, icon, screen-reader cue and contrast tokens; exact-head checks and post-merge CI passed on `24f305bb65591b8d5104ceb603b0132cc7051b0c`. Do not merge the stale PR wholesale or claim every operational status call site was converted. |


## Agent-tagged PR inventory correction — 2026-11-07 16:50 EET

A paginated-state inventory of PRs with `qoder` or `antigravity` in the head branch/title found: root 12 open; Server 20 merged / 10 open / 3 closed; Site 22 merged / 11 open / 14 closed; iOS 1 merged / 1 open; Admin 1 merged; Partner 1 merged. This is a discovery filter only; do not infer authorship solely from branch labels.

### Antigravity Server PR #83 scope correction

GitHub confirms PR #83 merged at `88634119a63f3078eb78039cc39102bf8351e36c`, and that merge is an ancestor of Server main. The actual merged tree includes `server/journey/intercityChain.ts`, registry/catalog changes, feed audit, and replay tooling. It does **not** contain the later `server/journey/multimodalChainEngine.ts`; current Server `origin/main` has no file by that path. The broader engine remains in the dirty Antigravity worktree at `e9934abbd8fc973177de8d7f47548739758a1b74` (88 commits behind / 4 ahead plus local edits). It adds synthetic grid geometry to generated transit/micromobility/taxi legs, so decision is **PRESERVE / NEEDS_REVIEW; no wholesale port**. Current main instead has `legGeometryProvenance.ts` and route-shape/foot-endpoint validation from later reviewed changes.

### 2026-11-07 — Antigravity chain-w2 branch reconciliation

- Preserved clone `mg-argon-chain`, branch `antigravity/chain-w2-composition-20261104`, HEAD `d89e1cf87755ba5c3188a946d5ea31d09f07418f`; clean tracked tree. Its fetched `origin/main` is Server SHA `9df0ae097abc43a4f611151a482c349a8f931a82`; branch is 62 commits behind and 8 ahead. Do not merge this stale branch wholesale.
- Content comparison proves the core innovations are already in current Server main: `TRANSPORT_PROVIDER_REGISTRY.json`, `server/journey/intercityChain.ts`, `scripts/replay-chain-od-matrix.mts`, `scripts/verify-real-chains-ukraine.mts`, and `scripts/transport-feed-smoke.ts` are byte-identical to `origin/main`. The current route handler also contains community + transit prefix/suffix composition. No duplicate port is needed.
- `scripts/sync-acceptance-db.ts` is intentionally different in current main; preserve that newer version rather than copying the candidate version.
- The shared 88-feed registry is a 2026-11-04 probe snapshot, not live coverage: 48 healthy, 14 degraded, 21 offline, 5 skipped; only 62 marked routable, 26 not routable; pricing/reservation/cancellation are mostly `NOT_MEASURED`. Keep it as catalog/evidence, never as proof of current availability or fare/booking support. Next validation must re-probe relevant feeds and run route-level acceptance.
- Decision: `ALREADY_IN_MAIN` for the verified core code/tools; `PRESERVE / NO MERGE` for the stale branch and its Nov 4 state snapshot. No source tree, database, or remote branch was changed.

### Site Antigravity production-finalize branch

- Preserved clone `mg-site-prod-finalize`, local `antigravity/prod-finalize-boot-20261104` at `1481b691ef81dccc5e4d057df12bf1ac955d8d1a`; current `origin/main` is `24f305bb65591b8d5104ceb603b0132cc7051b0c`.
- Remote branch `origin/antigravity/prod-finalize-boot-20261104` is an ancestor of current Site main; `git rev-list --left-right --count origin/main...origin/antigravity/prod-finalize-boot-20261104` = `58 0`. It contributes no commits missing from main. Decision: `ALREADY_IN_MAIN`; do not merge or copy older changes over newer Site code.

### 2026-11-07 — Root release PR and CI recheck

- GitHub current root `main` SHA `1e7d0ee74f11121a7d5a29c6379944a5360581c4` contains only the legacy root app tree and has no `.github/workflows/`; commit check-runs are empty and combined status is pending with zero contexts. Do not treat root CI as passing.
- PR #12 (`qoder/checkpoint-20261031`, head `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757`) remains OPEN and mergeable; verify fails while `materialize-release.mjs` clones private Admin (HTTP 403).
- PR #13 (`qoder/release-manifest-20261102`, head `70ff20d9bf3af8fa7b2e62f735c32f8fda3e75d7`) remains OPEN and CONFLICTING; verify fails in private-repository access configuration.
- PR #21 (`codex/exact-sha-gate-port-20261107`, head `a93aa3617094d33c8222269f1db360f923665a25`) remains OPEN and mergeable; verify fails cloning private Admin (HTTP 403). CodeQL/Gitleaks passed, but verify remains required. Do not merge or bypass.
- The token previously posted in chat was not used. Need a fresh, secure, least-privilege Actions secret or another approved private-repository materialization mechanism before retrying exact-head checks.

### Remaining Qoder candidates

- Server Qoder PR #76 journey activation behavior is present in current main even though its old stacked PR remains open; do not duplicate or merge the stale branch wholesale. Server #72/#73 remain old stacked candidates; current-main acceptance is required before considering unique behavior.
- Site Qoder #55: theme bootstrap is already represented in main. Error-vs-status semantics may be useful, but old exact checks are stale and the PR modifies broad UI callsites; decision **NEEDS_REVIEW / focused port only**, with fresh-main tests required.
- Site Qoder #58 and the old mobile/token PR stack contain design work, but they do not qualify for wholesale merge based on stale green checks. Compare against current design tokens and the approved current search UI before any port.
- Root Qoder #19 validator replacement is not accepted wholesale: it removes stronger evidence/schema checks in the #20 implementation. The unique raw `integration_sha` guard was ported in root #21; required CI is still blocked by private Admin/Partner clone HTTP 403.


## 2026-11-07 — Qoder #55 accessible search error feedback (PARTIAL_PORT)

- Qoder Site PR #55 (`qoder/theme-boot-auto-1`, head `bd532f972a8585d100b76b5954b9f3433d51841a`, base `8d927e8098a36f94f2ac519e52f7c720f1e0d239`) was not merged wholesale: its theme boot behavior is already present in current main, and its wider UI edits are stale against current main.
- Ported the unique error-vs-status semantics only for journey-search failures onto Site main base `9c637c7dcbf0815b72478f64666d8a05267ece6c`; alert role, icon, hidden text label, and tested light/dark contrast tokens. Source branch `codex/qoder-accessible-feedback-20261107`, commit `ecd28d4d62a6871e3a2d3b4bcaec2b9d9f718f21`, PR [#91](https://github.com/dima1203oleg/MarshGO-Site/pull/91).
- Targeted test result: 2 passed, 0 failed, 0 skipped; `git diff --check` passed. Exact-head Site CI is still pending (runs `42384161207`, `42384165172`); do not merge unless both pass and base remains current. This is a focused subset; other Qoder #55 call-site severity annotations remain outside the slice.
- No changes made to the dirty canonical Site worktree. Production remains `NOT_RELEASED`.


## 2026-11-07 17:09 EET — Qoder #55 accessibility slice merged

- Site PR #91 merged normally: https://github.com/dima1203oleg/MarshGO-Site/pull/91. Base `9c637c7dcbf0815b72478f64666d8a05267ece6c`; exact head `ffc8b920da25fefe7a7ad99f7fd00c0e49115931`; merge commit and current Site `origin/main`: `24f305bb65591b8d5104ceb603b0132cc7051b0c`.
- Exact-head required Site CI runs `42384364772` and `42384368760`: PASS. Post-merge main CI run `42384556014` on the merge SHA: PASS, including lint, typecheck, full Site tests, token check, build, bundle checks, and boot smoke. The first attempt failed only because the existing token checker omitted the new imported feedback stylesheet; that gate was updated to scan it, then all fresh checks passed.
- Targeted local accessibility/contrast test: 2/2 passed; token check passed (145 defined / 114 referenced); `git diff --check` passed.
- This is a PARTIAL_PORT from Qoder #55: journey search failures now have alert semantics, icon and screen-reader cue, with light/dark AA contrast-tested styling. Other Qoder #55 status-message call sites were not bulk-converted. Theme boot implementation was already present in main. Dirty original Site worktree remains untouched.
- Current Site main SHA is now `24f305bb65591b8d5104ceb603b0132cc7051b0c`. This does not constitute exact-six-SHA, staging, backend journey, or production acceptance. Production remains `NOT_RELEASED`.


### Qoder worker memory guard — selective port (2026-11-07 17:52 EET)

| Source | Decision | Main coverage | Port | Evidence / remaining gate |
|---|---|---|---|---|
| Server `qoder/cp6-journey-activation-20261103`, commits `617ee81b2e6faef6eb2f865c6d27a5512f6b15eb` and `2f007ef23c1a7014f4f6c19f10aec3d2c9cca71c` | PARTIAL_PORT | Current Server main had no GTFS worker `resourceLimits` ceiling or visibility into a `NODE_OPTIONS` override; other lifecycle changes in the stacked branch were already represented in main | PR #111 `codex/antigravity-geometry-provenance-server-20261107`, head `c89b85f3e2677255525d7c14b0060524af56e79`, base `9df0ae097abc43a4f611151a482c349a8f931a82` | Targeted 6/6 tests pass on Node 25.4.0; diff check passes. ESLint blocked by missing shared plugin; exact-head CI runs `42388476225` and `42388451810` were in progress. Merge only after required checks pass and base is rechecked. |
| Server `antigravity/ukraine-12-transports-multimodal` dirty geometry/fallback candidate | REJECT wholesale / retain for selective review | Current main already has the stronger `legGeometryProvenance.ts` validator and provider-backed GTFS geometry path; candidate bundles a static multimodal fallback and synthetic walking lines | None | Do not port fake street geometry or unverified corridor lines as real routes. Re-review only a narrow independent improvement with source attribution and tests. |
| Site `antigravity/ultimate-premium-web-9` camera candidate | NEEDS_REVIEW / PARTIAL_PORT candidate | Camera rotation, pitch and map-area zoom are not established as visually accepted on current main; candidate also changes synthetic walking geometry and route rendering | None yet | Requires a camera-only diff, route-geometry provenance assertions, reduced-motion review and visual acceptance on current main. |
| Qoder/Antigravity features found on branches but present in current component main | ALREADY_IN_MAIN | Search cancellation, active-navigation persistence, cash-fare provenance, route oracle/bounded-search work, accessibility feedback, chain registry/composition/replay and Site boot behavior were verified on current main | None | Do not duplicate; retain exact current-main evidence from the preceding reconciliations. |


### PR #111 review follow-up — 2026-11-07 18:57 EET

- Codex review found the cgroup v1 memory controller's common nested mount path was missing and the negative-control test assumed no ambient container limit. Both were corrected in `c89b85f3e2677255525d7c14b0060524af56e79`; targeted test remains 6/6 and diff check passes.
- Fresh exact-head CI runs `42388826698` and `42388831522` are IN_PROGRESS; PR remains unmerged. Recheck required checks and exact base before any merge.


### Server PR #111 — merged Qoder worker memory safeguard (2026-11-07 19:02 EET)

- Decision: `PARTIAL_PORT` from Qoder CP6 stack. The two worker heap commits were selectively ported; unrelated operator graph-budget changes and duplicate lifecycle work were excluded.
- Exact head `c89b85f3e2677255525d7c14b0060524af56e79`, base `9df0ae097abc43a4f611151a482c349a8f931a82`; exact-head checks `42388826698` and `42388831522` passed.
- PR #111 merged normally at `2026-11-07T16:01:30Z`; merge commit/current Server main `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6`. Post-merge verify run `42389192270` was still IN_PROGRESS at checkpoint.
- Targeted local test `tests/gtfs-worker-memory-ceiling.test.ts`: 6/6 passed; `git diff --check` passed. Local Node was 25.4.0 vs declared 24.21.0; full local typecheck/lint not verified because available shared dependencies lack `eslint-plugin-unused-imports`.


### PR #111 post-merge result — 2026-11-07 19:06 EET

- Current Server main is `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` after normal merge. Post-merge `verify` run `42389192270` passed in 4m11s with lint, typecheck, unit tests, migration, integration, image build/smoke, and Compose lifecycle.
- Six current main SHAs were requeried; only Server changed since the 19:02 observation. Release manifest remains explicitly observation-only and production remains unreleased.


### Antigravity Site PR #66 — map controls and MarshPass home card reconciliation

- PR #66 (`antigravity/marshpass-ticket-walking-cleanup-20261104`, head `03e77de89ea343584475429360308270e668f9f3`) merged to Site on 2026-11-04 as squash merge `388e06e3b2e250ab4fd327927ba9571ac201232c`. Its head is not an ancestor of current Site main because it was squash-merged.
- Decision: `ALREADY_IN_MAIN` by behavior, not ancestry. Current Site main `24f305bb65591b8d5104ceb603b0132cc7051b0c` contains the home MarshPass card (`src/views/HomeHero.tsx`) and accessible independent 2D/3D plus satellite controls (`src/views/TransportMapView.tsx` and shared map mode). Existing main CI passed on this exact SHA in the latest component check. No duplicate port.
- The same candidate's synthetic walking-path additions are not treated as real street geometry; current `journeyRouteModel`/Server provenance rules remain authoritative.

### Current-main reconciliation — 2026-11-07 18:18 EET

- Site PR #91 (Qoder accessibility slice) merged at `24f305bb65591b8d5104ceb603b0132cc7051b0c`; exact-head runs `42384364772` / `42384368760` and post-merge run `42384556014` passed. Server PR #111 (Qoder worker-memory safeguard) merged at `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6`; post-merge run `42389192270` passed.
- The dirty local Antigravity Site checkout's `origin/main` was stale; it is now refreshed to `24f305bb65591b8d5104ceb603b0132cc7051b0c`. The worktree itself remains untouched. Relative to exact main, `antigravity/ultimate-premium-web-9` is 48 behind / 5 ahead and has mixed map/controller/screen/sheet/geometry changes. Main already contains the live-transit marker position update; remaining pitch/bearing/fit changes have no isolated current-main visual acceptance and alter padding safeguards. Decision: **PRESERVE / NEEDS_REVIEW**, no port.
- The Antigravity Server chain registry/intercity/replay code is already in main; synthetic geometry from its broader chain-engine work remains **NOT_ACCEPTED**.
- Root PR #12 and #21 remain open; current required `verify` fails materializing private Admin/Partner (HTTP 403), and #12 has CodeQL failure. Do not merge or bypass protections.
- Six current GitHub main SHA observation: root `1e7d0ee74f11121a7d5a29c6379944a5360581c4`; Server `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6`; Site `24f305bb65591b8d5104ceb603b0132cc7051b0c`; iOS `ad27b6f70b6255d1dd323bafcffafe4558232224`; Admin `02b28940ee017523f2feed01de458f8d0aa20279`; Partner `179631f45e984c5712bef83af43912125e3521d1`. This is not unified acceptance.

### 2026-11-07 18:41 EET — focused Qoder/Antigravity Site port

- **Qoder Site PR #54:** `PARTIAL_PORT`. Its primitives and other mobile improvements are already represented in current Site main; remaining undefined `animate-slideUp` / `animate-fade-in` usage and one onboarding smooth-scroll reduced-motion gap were ported from current main into PR #92. Original old-base PR is not merged wholesale.
- **Antigravity Site commits `96ef24f` and `d00aed7`:** `PARTIAL_PORT` into the same isolated PR #92: Escape dismisses route-map and point-picker overlays; point picker now uses canonical dark theme tokens. The candidate branch and original dirty worktree remain untouched.
- **Antigravity Site camera commit `eda449f` / broader `e23eea4`:** `NEEDS_REVIEW` / preserve only. The diff couples camera fit/pitch with synthetic pedestrian geometry and broad test deletions; not safe as a bundle, and there is no current-main visual acceptance.
- Candidate PR #92 uses base `24f305bb65591b8d5104ceb603b0132cc7051b0c` and head `d1b708a0bb98f811557ea3b5614d6ce5cd37b126`; local targeted tests 50/50 and ESLint/diff-check pass. Exact-head GitHub CI pending.

### 2026-11-07 18:44 EET — candidate PR #92 merged

- Site PR #92 merged by normal squash at `0ee96c8052c094a99daf3218abea7b77b3e6df95` from exact head `d1b708a0bb98f811557ea3b5614d6ce5cd37b126`, based on `24f305bb65591b8d5104ceb603b0132cc7051b0c`. Exact-head CI passed; post-merge run `42392731336` pending at checkpoint.
- Qoder PR #54 decision remains `PARTIAL_PORT`; its current-main defects were ported selectively. Antigravity commits `96ef24f` and `d00aed7` were selectively integrated. No wholesale merge of old agent branches.

### 2026-11-07 18:46 EET — remaining Qoder/Antigravity reconciliation

- Qoder Server #76 activation portion, #73 search-completeness, #72 visual-zone prioritization, #71 Node globals for worker `.mjs`, #68 P0 integration gating, and #67 enforced `user_roles` are `ALREADY_IN_MAIN` by current code and regression-test presence. The #76 stacked worker-memory part was separately and selectively merged as Server #111. Do not merge those stale stacks wholesale.
- Qoder Site #56 provider/empty-corridor honesty coverage is present in current main (`tests/journey-completeness-notices.test.ts`); #54's remaining undefined motion utilities and reduced-motion gap were selectively merged through Site #92. #49 320px quick-action and #46 mobile ergonomics branches are not blindly merged: current Site has the canonical two-column action grid and current token tests cover mobile legibility/touch targets; exact old-base visual deltas remain for focused comparison if needed.
- Root Qoder #19/#20/#21 exact-release gate stack remains `BLOCKED`: exact-head `verify` fails at `Run node ops/scripts/materialize-release.mjs` because private Admin/Partner source access returns HTTP 403. CodeQL/Gitleaks pass. Do not bypass protection or reuse credentials exposed in chat.
- Antigravity Server PR #83, Site release/design PRs #63–#66/#70, and Qoder Site #91/Server #111/#92 are accounted for as merged/current-main. The dirty Antigravity camera branch is retained but not accepted wholesale; approximate geometry and deleted tests remain unacceptable.

### Antigravity camera interaction and reduced motion — PR #93 (2026-11-07)

| Source innovation | Decision | Integration / evidence | Remaining boundary |
|---|---|---|---|
| Stop in-flight MapLibre camera animation on a gesture carrying a native input event | PARTIAL_PORT | Site PR #93, head `9936891493228c1f797c3dcf516b4ce63fce9fdf`, base `0ee96c8052c094a99daf3218abea7b77b3e6df95`; tests assert programmatic events do not interrupt, user input stops animation, and FREE mode is not redundantly re-entered | Exact-head CI pending at 18:56 EET (`42393945375`, `42393969285`); not merged yet |
| Respect `prefers-reduced-motion` in fit/follow/focus/perspective camera transitions | PARTIAL_PORT | Same PR; duration policy extracted and covered by focused test; 5/5 local tests, scoped ESLint, `tsc --noEmit`, and diff-check pass | Full browser visual acceptance awaits current-head CI/preview |
| Route bearing/pitch, sheet geometry, synthetic approaching-vehicle animation, generated pedestrian paths, broad presentation changes | PRESERVE / NEEDS_REVIEW | Not included in PR #93; mixed into Antigravity candidate and/or imply non-live location/geometry | Requires isolated camera-only review, source-backed geometry and fresh visual acceptance; do not present predictions as live |

### Qoder mobile ergonomics and short-screen home follow-up (2026-11-07)

| Source | Decision | Current-main evidence / port | Boundary |
|---|---|---|---|
| Qoder Site PR #46 (`qoder/premium-8-mobile-1`, head `42fae900` in the historical remote ref; stacked with CP5 token work) | ALREADY_IN_MAIN by behavior for its drag/touch/reduced-motion features | Current main `JourneyActiveNavigation.tsx` and `JourneyRouteMapScreen.tsx` use `createFrameWriter`, imperative drag writes, flush/discard and `routeSheetTransition`; `tests/route-sheet.test.ts` and `tests/canonical-design.test.ts` cover frame coalescing, reduced motion and 44 px targets | Do not cherry-pick its stale broad CSS/token refactor or test snapshots; current-main visual tests remain governed by its own acceptance |
| Qoder Site PR #49 short-home viewport fix (`qoder/home-quickactions-320`, source head `be978c2c8172d075bddddc808a1559a7dbf81235`, original base `62fe81683f2aba283ecf4c64e84f4f39e660a2b0`) | PARTIAL_PORT | Site PR #94 head `d34d89cdcee1184abc91b084a31c743c41e5ba25`: measured fixed tabbar inset, removed empty scroll tail, kept square quick-action grid; 7 local tests, targeted lint and typecheck pass | Exact-head CI runs `42394678784`/`42394703966` in progress. Old branch images/metrics are evidence from its old base only; fresh current-main visual acceptance is not claimed |

### Antigravity camera safety follow-up (2026-11-07)

- Site PR #93 merged normally at `248595807552b0cdc0d09ca6221bad0c304bde68` from head `9936891493228c1f797c3dcf516b4ce63fce9fdf`, base `0ee96c8052c094a99daf3218abea7b77b3e6df95`.
- Exact-head verify runs `42393945375` and `42393969285` passed; post-merge Site CI `42394233896` passed on the exact merge SHA.
- Accepted only user-gesture animation interruption and reduced-motion durations. Synthetic approaching positions, generated walking geometry, and unreviewed camera pitch/bearing/padding changes remain unaccepted.

### Qoder #49 short-screen home fix — merge confirmation

- PR #94 merged at `59115680cf96ec6f359ec62130db20d3fa4df1af` from exact head `d34d89cdcee1184abc91b084a31c743c41e5ba25`, base `248595807552b0cdc0d09ca6221bad0c304bde68`.
- Exact-head checks `42394678784` / `42394703966` passed. Post-merge Site CI `42394893033` is in progress.
- Decision remains `PARTIAL_PORT` from Qoder #49; implementation is now in main. Current-main visual screenshot is not yet refreshed; original source-branch metrics remain historical.

### Qoder #49 post-merge verification

- Site PR #94 is merged at `59115680cf96ec6f359ec62130db20d3fa4df1af`; exact-head checks `42394678784` and `42394703966` passed.
- Post-merge Site CI `42394893033` passed on the exact main SHA, including lint, typecheck, full tests, token check, build, bundle checks, Playwright installation and boot smoke.
- Mainline visual screenshot is still not recorded. The Qoder source-branch before/after screenshots and metrics remain evidence of that older base only.

### Qoder Site #58 theme-token alignment — 2026-11-07

- PR #58 remains open, based on stale `8d927e8098a36f94f2ac519e52f7c720f1e0d239`, with `mergeable=false`. Decision: **PARTIAL_PORT**.
- Selected only the home quick-action text/muted/border/default-surface conversion to canonical light/dark tokens and a regression test. Site PR #95 head `1a865be8e2c5f2efcd2b3afc7acc5d91b3925296` (base `59115680cf96ec6f359ec62130db20d3fa4df1af`); focused design tests 27/27 and diff check passed; exact-head CI `42395690147` was running at checkpoint.
- Existing mode-specific colors and geometry stayed intact. Broad onboarding choreography, extra copy/screen changes and old-branch snapshots were not ported; the branch contains a reported button/navigation overlap and has no current-main visual acceptance. Preserve the remainder pending separate evidence.

### Qoder #58 token slice — PR #95 merge confirmation

- Site PR #95 merged normally at `ca8c54498ec717807aba630d26e478795e2c32ca` from exact head `1a865be8e2c5f2efcd2b3afc7acc5d91b3925296`, base `59115680cf96ec6f359ec62130db20d3fa4df1af`.
- Exact-head verify run `42395690147` passed; post-merge Site CI run `42395920829` is in progress. The contribution decision is **PARTIAL_PORT / INTEGRATED**. No wholesale stale-branch merge; screenshot-based visual acceptance remains open.

- Post-merge confirmation: Site CI run `42395920829` completed SUCCESS on exact main `ca8c54498ec717807aba630d26e478795e2c32ca`; the Qoder #58 selected token slice is **PARTIAL_PORT / INTEGRATED / CI_PASS**. Current-main visual screenshot is still not recorded.


### 2026-11-07 19:41 EET — Antigravity endpoint provider coverage, selective port

| Candidate | Decision | Integration | Evidence / boundary |
|---|---|---|---|
| Dirty Site branch `antigravity/ultimate-premium-web-9`, `ProductionMarketplace` provider-discovery effect (origin-only lookup) | **PARTIAL_PORT / INTEGRATED** | Site PR #96 merged at `748bb5db93739b5be76bc2c46d461ab35b9ff404`; source head `b5ed65f82f446947dd0e6a3854f63dd83eda9081`, base `ca8c54498ec717807aba630d26e478795e2c32ca` | Queries origin and destination, unions unique provider metadata, deduplicates identical points, and falls back to the existing unknown-coverage state if any endpoint query fails. Targeted transport-preference tests 18/18; exact-head CI passed; post-merge Site CI run `42397408778` passed. No live route/fare/booking is implied. Mixed geometry/camera changes from the same dirty branch were not ported. |

Current Site main already contains the user-requested search layout controls (provider action beside “Усі види”, one provider-only dialog, highlighted carpool tile, destination-row map pin). No duplicate UI port is needed. Browser visual acceptance remains unverified in this session.


### 2026-11-07 20:22 EET — Qoder diagnostic counter semantics and iOS pin chain

| Candidate | Decision | Integration | Evidence / boundary |
|---|---|---|---|
| Qoder Site PR #56 remaining funnel-count label | **PARTIAL_PORT / INTEGRATED** | Site PR #97 merged at `1b8838163aeb78d96915eec8c4a014960b0c6181`; source commit `3872a843fbd51d8e21e0bf39222b7518f02c59a1` | The server exposes `candidatesDeduplicated` as `paretoCandidates.length`; the displayed label now describes the actual Pareto-filtered count. Targeted diagnostics tests 8/8, exact-head checks and post-merge Site CI run `42400528874` passed. No broad stale-branch merge. |
| Qoder iOS PR #16/#17 pin-chain follow-up | **PARTIAL_PORT / PR OPEN** | iOS PR #18 head `1c44cbd72c526eb46166982c08153a45333d0da8` pins branch builds to verified Site `1b8838163aeb78d96915eec8c4a014960b0c6181` and Server `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` | Only CI fallback refs changed; release tags keep owner-configured exact SHA. iOS Simulator workflow `42400902946` is in progress; merge only after passing exact-head checks and a fresh base check. This does not prove physical iPhone installation or acceptance. |
| Current observed six component mains | **OBSERVATION ONLY** | Tuple written to `RELEASE_MANIFEST.json` at 2026-11-07T18:22:52Z | Refs were read directly from canonical GitHub `main`. Not a compatible six-SHA candidate; staging, exact tuple tests, backups and rollback remain unverified. |


### 2026-11-07 20:25 EET — Qoder/Antigravity reconciliation and iOS pin refresh

| Contribution | Decision | Evidence / integration | Remaining boundary |
|---|---|---|---|
| Qoder Site #56 diagnostic count semantics | **PARTIAL_PORT / INTEGRATED** | Site PR #97 main `1b8838163aeb78d96915eec8c4a014960b0c6181`; focused test 8/8 and post-merge CI `42400528874` pass. | No live routing claim. |
| Qoder Site #55/#54/#51/#48/#49 and Server #76/#73/#72 | **ALREADY_IN_MAIN / SUPERSEDED WHERE STACKED** | Audited against current canonical mains; theme/motion/lifecycle/touch/sheet/short viewport and Server journey/completeness/memory-bound behavior have current-main equivalents. | Do not merge stale stacks or duplicate their changes. |
| Antigravity endpoint-scoped provider metadata discovery | **PARTIAL_PORT / INTEGRATED** | Site PR #96; targeted `transport-preferences.test.ts` 18/18 and post-merge CI `42397408778` passed. | Provider discovery coverage does not prove live vehicle availability. |
| Antigravity camera cancellation, reduced motion, picker Escape/theme protections | **ALREADY_IN_MAIN** | Behavior verified present on current Site main; no duplicate port. | Full visual device acceptance is separate. |
| Antigravity fabricated walking/vehicle motion and broad camera pitch/bearing redesign | **REJECTED / NEEDS_REVIEW** | Preserved in source branch; no acceptable provenance for synthetic geometry/position and broad change conflicts with canonical camera behavior. | Revisit only with sourced geometry and focused camera tests. |
| Qoder iOS stale-pin chain | **PARTIAL_PORT / MERGED; POST-MERGE CI PENDING** | iOS PR #18 merge SHA `42265870291f34641e8519a347e1ebde5cdf7441`, exact head checks passed; post-merge run `42401155512` in progress. | Simulator only; no physical iPhone acceptance. |
| Qoder root release materialization PRs | **BLOCKED** | Required Actions materialization cannot clone private Admin/Partner repositories (HTTP 403). | Needs narrowly scoped approved read access; do not bypass protection or publish broad token. |


### 2026-11-07 20:28 EET — iOS post-merge CI outcome

- iOS PR #18 main SHA `42265870291f34641e8519a347e1ebde5cdf7441`; main push run `42401155512` completed SUCCESS. The workflow verified Site `1b8838163aeb78d96915eec8c4a014960b0c6181`, built the Site bundle, synced Capacitor, and compiled iOS Simulator.
- Unsigned Release archive and artifact upload were skipped by the workflow condition. Simulator CI success is not signed distribution, physical iPhone, staging, or production acceptance.
- All six `main` refs were refreshed at 2026-11-07T18:27:55Z. The exact tuple is recorded as an observation in the release manifest; cross-repository compatibility remains `NOT_VERIFIED`.


### 2026-11-07 21:18 EET — Site PR #98 decisions

- **Qoder city/ticket work: PARTIAL_PORT / INTEGRATED.** Site PR #98 (`a2f547b5e69757b4186cc91bff60ff5cdc1999d6` → `21030d2b53b9e3b939240320c0cc2509a14fec5b`) reuses the current-main city registry and server-backed MarshPass/ticket domain, while adding a global selector, provenance-aware city persistence and server-confirmed ticket display. Verified by local checks and exact-head/post-merge Site CI.
- **Antigravity MarshPass/home direction: PARTIAL_PORT / INTEGRATED.** Retained the active-pass card/carousel direction and canonical motion/theme/accessibility tokens. Rejected fabricated route/price/status/QR content for empty passes.
- **Antigravity `ultimate-premium-web-9` broad dirty worktree: PRESERVED / NOT PORTED BY THIS PR.** It contains unrelated map, routing, provider and UI changes; no broad cherry-pick was made into this scoped change.
- **PR #98:** merged to Site main as `21030d2b53b9e3b939240320c0cc2509a14fec5b`. No API or database contract change.


### 2026-11-07 22:14 EET — Site PR #99 navy monochrome redesign

- **Codex Site redesign: PARTIAL_PORT / PR OPEN.** PR #99 head `c302f0ccca360c389057f0ebe1f4ac55a9f012ee`, base Site main `21030d2b53b9e3b939240320c0cc2509a14fec5b`. Token-driven navy palette spans home/search/navigation/map/profile/MarshPass and shared controls while preserving business logic and map geometry. Exact-head checks `42410046471` and `42410080779` were pending at this checkpoint.
- **Evidence:** 528 local tests, typecheck, lint, token/bundle/single-React checks, build, diff check and 11 guest-entry browser viewport configurations passed. Authenticated visual acceptance is still missing; do not treat this PR as release acceptance.
- **Merge decision:** MERGE only after current-base/required checks are green and normal review rules pass. No branch-protection bypass. No release-manifest pin change until merge and downstream acceptance.


### 2026-11-07 22:18 EET — Site PR #99 merge result

- **Site navy monochrome candidate: MERGE / INTEGRATED.** PR #99 merged by squash to Site main `98b1227c0a378d43ef4661fd73622975f8eb93bc`; exact head was `c302f0ccca360c389057f0ebe1f4ac55a9f012ee`, base `21030d2b53b9e3b939240320c0cc2509a14fec5b`. Exact-head verify runs `42410046471` and `42410080779` passed.
- Post-merge Site CI run `42410244020` is IN_PROGRESS. The six-main observation tuple was refreshed, not promoted to a compatible release candidate. Keep production `NOT_RELEASED` pending the remaining independent gates.


### 2026-11-07 22:35 EET — Site PR #100 final integration decision

- **Site PR #100: MERGE / INTEGRATED.** It fixes the sign-in/registration backdrop to use stable dark navy tokens in both selected app themes and adds a regression assertion plus light/dark boot-smoke evidence. PR #100 merged normally from exact head `9d432d570558214115b213f92166dc3c40d7103f`, base #99 result `98b1227c0a378d43ef4661fd73622975f8eb93bc`, to Site main `4e6fc594b0fd68c8e059c531dd5b2cc51406344a`.
- Both exact-head CI runs `42411297616` and `42411324106` and post-merge Site CI `42411544859` passed. Local full suite 529/529 and responsive boot-smoke 11/11 passed; light/dark sign-in screenshots were visually inspected.
- No new Server, API, database or migration dependency. This PR closes the sign-in contrast defect; it does not close authenticated route/map/ticket visual acceptance or any release/staging gate.

## 2026-11-07 22:51 EET — Navy theme decisions

- Site PR #99 (main 98b1227c0a378d43ef4661fd73622975f8eb93bc) and PR #100 (main 4e6fc594b0fd68c8e059c531dd5b2cc51406344a) are integrated; #100 fixes sign-in contrast over light theme preference.
- iOS PR #19 (00614d4a7e87ada354f66c3f84800c960f133a6f) is merged as 20f5fab6d33709844a0bbd97011bebf68542f549, pinning branch builds to Site 4e6fc594b0fd68c8e059c531dd5b2cc51406344a; exact-head and post-merge Simulator CI passed.
- Admin PR #4: PARTIAL_PORT / MERGE_PENDING_CI; candidate 0fa35c42f3a3f78de26b2a565d71acbbe428e341, based on Admin 02b28940ee017523f2feed01de458f8d0aa20279, aligns portal CSS tokens and surfaces to Site. No business/API behavior changed; pending exact-head Verify 42412957787.
- Partner PR #4: PARTIAL_PORT / MERGE_PENDING_CI; candidate 19c9aba7bca19bd1d0a8befe1936a9d744c1af30, based on Partner 179631f45e984c5712bef83af43912125e3521d1, aligns portal CSS tokens and surfaces to Site. No business/API behavior changed; pending exact-head Verify 42412957411.
- Acceptance for Admin/Partner is exact-head CI plus visual browser check when resources permit; after any merge, recheck base and post-merge main CI. These theme changes do not establish six-repo runtime compatibility or production readiness.

## 2026-11-07 22:57 EET — Navy theme PR outcomes

- Site PR #99 and #100: MERGE / ALREADY_IN_MAIN; Site main 4e6fc594b0fd68c8e059c531dd5b2cc51406344a. #100 fixed the sign-in surface when app theme preference is light.
- iOS PR #19: MERGE / ALREADY_IN_MAIN; iOS main 20f5fab6d33709844a0bbd97011bebf68542f549 pins branch builds to the verified Site SHA. Simulator CI passed; no physical device evidence.
- Admin PR #4: MERGE / ALREADY_IN_MAIN; Admin main d8afa64c4efda8ce4f10557a03651943effa52a. Exact-head and post-merge typecheck/lint/11 tests/build passed.
- Partner PR #4: MERGE / ALREADY_IN_MAIN; Partner main 4d605d4353af281dd295fabf0c7c2ac05efe222e. Exact-head and post-merge typecheck/lint/5 tests/build passed.
- No Server/root files or business/API behavior were changed for this design-system slice. Portal screenshot/manual visual acceptance remains outstanding; do not conflate visual token tests and CI builds with full visual approval.
### 2026-11-08 03:19 UTC — Server PR #112 post-merge result

- **Server PR #112: MERGED normally.** Base `main` SHA `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6`; branch head `10afa683a8f0542fbbc8ff80c8905e661cc79a96`; squash/main SHA `f0326ca0d0bfec17bf138a3b479d758f53107a8f`. It changes only production geocoder config validation and its tests.
- The guard fails startup for the known public Nominatim autocomplete endpoint and public Photon demo endpoints; managed HTTPS endpoint configurations remain valid. This prevents a production API from reporting ready with a geocoder that the runtime rejects or an uncontracted public demo.
- Local evidence: `tests/config.test.ts` 10/10, scoped ESLint, and `git diff --check` pass. Exact-head CI runs `42441620667` and `42441648841` passed; post-merge Server CI `42441962165` passed on main SHA `f0326ca0d0bfec17bf138a3b479d758f53107a8f`.
- Limit: this does not provision a geocoder or establish live route acceptance; the current dev tunnel still needs an approved forward/reverse endpoint.


## 2026-11-08 06:17 UTC — Antigravity/Qoder Server branch comparison; static nationwide fallback rejected for release

- Preserved and inspected canonical Server dirty checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`: branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, remote main `408d54b5531191885069e057b405cc50444eb268`, merge-base `fcdf9d8bca2206f30a5e95b578165b0dc0be89c7`, **91 commits behind / 4 ahead**. Its four unique commits add ~7,070 lines across 14 files; working-tree edits/untracked provenance/policy/tests also remain untouched. No cherry-pick/merge/delete.
- Decision by component: (a) static catalog claim “all 12 modes in all 26 regions” is **REJECTED for production availability**: its test verifies enum/shape presence, not source freshness, legal coverage, route, or booking; e.g. metro is asserted present nationwide. (b) 72-corridor `UkraineTransitGraph`/`multimodalChainEngine` is **REJECTED for provider-backed journey results** pending authoritative schedules/shape/fare/availability and route oracle; station/time/fare tables are embedded and generated pedestrian grid paths are not street geometry. (c) old foot-route implementation is **SUPERSEDED** by current main's bbox-selected OSRM foot graphs, bounded routing budget, and source/mode provenance; exact current-main tree already passed `journey-walking-routes.test.ts` 19/19 and live adapter samples for two cities. (d) branch's coordinate-only `sourceRouteGeometry` helper is **SUPERSEDED** by main's stricter `trustedRouteGeometry`, which checks mode/source provenance and sanitizes persisted legs. (e) Photon adapter contribution is **ALREADY_IN_MAIN/SUPERSEDED** by current main Photon support plus production-demo guard; public Photon remains sample-only. Keep the branch and its dirty data as a future provider-discovery reference, not release code. Short decision record appended to `docs/PR_DEPENDENCY_DAG.md`.
- `scripts/local-stack-status.sh` was run read-only: Site preview 4178, API health/readiness 3002, Postgres 5434, Redis 6380/6381, and Docker respond; `SERVICES_INCOMPLETE` because expected local Server checkout is dirty e993 while running API is dirty SHA `20f64a8b745137f08808d0198ea554f8da8a3911`. The running API reports build ID `local-20f64a8b7451-dirty-20261107T074421Z`; its `/readyz` is 200, but generic address suggestion is 503. `start-local-api.sh --check` passes for the e993 checkout; no runtime restart attempted.
- Resource checkpoint 06:16 UTC: 17 GiB disk free, 33% free RAM, swap 8,510.94 MiB, CPU 26.82% user / 30.24% system / 42.92% idle. Existing Docker cache review shows no safely reclaimable builder cache; images/volumes are preserved. No cleanup or heavy build/test was performed. Keep services and all dirty branch work intact; production stays `NOT_RELEASED`.


## Site PR #105 — custom budget edit state — 2026-11-08 08:14 UTC

- Decision: `MERGE` only after exact-head checks pass. Base SHA `484980e1b50e0029973f8180a3bac377e7268f34`; head SHA `ce99f79cbc89f7b8c4b6d5e949896cc14f186638`.
- The custom budget option already existed. This patch preserves the applied filter while editing, supports cancel, keeps non-preset custom amounts selectable after apply, and blocks search on a changed/invalid draft.
- Focused journey-search-bounds test: 13/13 pass. Exact-head GitHub `verify` checks are pending. Visual/browser verification not run.
- Dependencies: none beyond current Site main; no API/database change. Risk: low, bounded to the search form.
- Final status: `MERGED` at Site SHA `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7`; PR-head checks passed, post-merge CI `42462237825` running.


## iOS PR #22 — Site pin after Site #105 — 2026-11-08 08:20 UTC

- Decision: `MERGE` only after required exact-head checks pass. Base SHA `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff`; head SHA `33be8c19e27d9739603111d7bea8c4cb774369e8`.
- Pins branch CI and README to Site main `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7`; Server metadata pin remains `408d54b5531191885069e057b405cc50444eb268`.
- Exact-head Simulator Build checks are in progress. No local or physical-device build. Site #105 post-merge CI `42462237825` is green.
- Final status: `MERGED` at iOS SHA `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f`; PR-head checks and post-merge run `42462745572` passed.

## Server routing stack decision update — 2026-11-08 11:19 UTC

| PR | Base SHA / head SHA | Current-main comparison | Decision | Reason / required acceptance |
|---|---|---|---|---|
| Server #50 — `fix(gtfs): retain feasible bounded connectors` | `1157b4df29736a7936f9fe5713cb7f9c522d6c26` / `84f700e15f39d77575dd7e71ce52550751c22403` | Current main `0b0aac1f1dd4e2f6cc8b59411380b09042f99043`; 249 ahead / 120 behind; merge-base `92a26a3f617f32d644a66c0af46cba096ccb0ce0` | `NEEDS_REVIEW` | Exact-head CI passes. Frozen Lviv replay found route identity parity NO, truncation remains, median latency +4.59%; stage trace proves a feasible candidate can be omitted by response-page cap. Rebase or isolate relevant commits, then prove strategy-winner and route-chain correctness on current main with unchanged feed/input. Do not merge the broad stack. |
| Server #59 — `fix(gtfs): retain one-sided multi-hop connectors` | `2f84a4c15488b66484574ab68d0fc4fda5b8bfd2` / `90ec8cb1ce3bfb7a49fd1f187b427a4ed83d476b` | Current main `0b0aac1f1dd4e2f6cc8b59411380b09042f99043`; 364 ahead / 120 behind; merge-base `92a26a3f617f32d644a66c0af46cba096ccb0ce0` | `NEEDS_REVIEW` | Synthetic four-leg retention regression passes; one frozen replay on old production SHA `25609cdefefbbc2a929e6edd31d3a09a3ae97a74` reported no changed route identities/winners and truncation remained. Isolate its narrow production change and retest on current main before porting. Do not merge the stack. |
| Server #52 / #53 — timezone and cheapest-oracle tests | stacked on PR #50 | Old base `1ad337e191c40fa847c669f3fff18a944f696ad5`; exact-head CI passed | `NEEDS_REVIEW` | Test-only commits; decide whether current main lacks these assertions, then cherry-pick only missing tests onto a compatible head. Do not merge as standalone stale-base PRs. |

These dispositions are specific to the current route-completeness investigation; they do not replace the repository-wide PR inventory. The user's mode distinction is recorded: 3 strategies (FASTEST/CHEAPEST/OPTIMAL) are separate from 12 transport categories.


## Site PR #109 — `codex/place-autocomplete-abort-20261108`

- Base SHA: `0b825b160981eacd6ffa09cd52bea312294c2123`; head SHA: `d2b75702d089fbec47cab3edc14b3f3eaeda2e77`.
- Decision: `MERGE` only after exact-head required checks and current-base review.
- Scope: cancel superseded route-place HTTP lookups; suppress stale response/error writes; reset pending state when query is too short or picker closes.
- Evidence: focused tests added; `git diff --check` passed. CI runs `42476339005` / `42476355946` pending at checkpoint. Local tests not run due resource gate.
- Limitation: does not provision a geocoder; HTTP 503 remains blocked by absent approved provider configuration.


### Site PR #109 final outcome

- Status: `ALREADY_IN_MAIN` / merged normally. PR checks `42476339005` and `42476355946` passed on head `d2b75702d089fbec47cab3edc14b3f3eaeda2e77`; post-merge Site main CI `42476534113` passed on `cfc3c021515390f78abaa639752660c5866c1922`.
- The change cancels superseded browser place-suggestion requests and prevents stale UI writes. It does not supply the absent geocoder provider.


## Server PR #122 decision — 2026-11-09 02:58 EET

| PR | Base / head | Scope | Decision | Evidence / state | Dependency |
|---|---|---|---|---|---|
| Server #122 | base `5b6462adff2cab44625d9a9c3bb50e839c208ddb`; head `a287266c071f2e6dcf8723ba7de033904b709ffc` | Add isolated `--lviv` catalog selection to `mobility:seed`; preserve existing scopes | MERGE after required checks | 4 focused tests, targeted ESLint, diff check pass; GitHub verify runs `42542978091`, `42543005344` pending at checkpoint | None; exact-main base |

Rationale: enables narrow Lviv GTFS/GTFS-RT setup without probing the entire catalog. It does not enable a provider absent valid terms/health and does not claim live route acceptance. No DB writes or live feed probes are part of this PR.


### Server PR #122 final status — 2026-11-09 03:02 EET

- Merged to `main` as `ba158074ee45ca70486cef10462f9860942e1fa7` (squash); head `a287266c071f2e6dcf8723ba7de033904b709ffc` tree matches. Both required CI `verify` runs passed.
- Final result: `ALREADY_IN_MAIN`; enables selective Lviv catalog registration/probing; no provider was queried during merge and no live-route claim is made.


## 2026-11-09 07:07 EET — current decision for preserved all-Ukraine multimodal branch

- Rechecked against actual GitHub-tracking refs: Server `origin/main=4db6e97b392cb9f01e07fea035b8346826119333`; dirty checkout `antigravity/ukraine-12-transports-multimodal= e9934abbd8fc973177de8d7f47548739758a1b74`; merge base `fcdf9d8bca2206f30a5e95b578165b0dc0be89c7`; main has 105 commits not in the checkout and the checkout has 4 unique commits. A paginated GitHub PR query for this exact head returned no PR. The four commits are authored as Dima in Git metadata; branch naming is not proof they were produced by Qoder.
- Decision register update: `b986ac7`, `6eda068`, `2280390` (12-mode/72-corridor static engine and stop metadata) = **REJECTED as provider-backed production results**; those paths embed route/timetable corridors without verified source-backed service. `e9934ab` and generated grid paths = **SUPERSEDED for real walking geometry**; current main uses provider geometry provenance and routed foot paths, while the grid helper is explicitly synthetic. Dirty `sourceRouteGeometry` = **SUPERSEDED** by main's stricter `trustedRouteGeometry` (validates mode/source provenance and sanitizes persisted geometry). Dirty `staticMultimodalFallbackPolicy` = **NEEDS_REVIEW / no port**: current main has no static engine call site, so the test-only gate has no production behavior to protect.
- Preservation: Server working tree remains at `e9934...` with 3 tracked modifications (`server/index.ts`, `server/journey/multimodalChainEngine.ts`, `shared/navigation/pedestrianGeometry.ts`) and 4 untracked helper/test files. No edit, checkout, stash, cherry-pick, merge, cleanup or restart was performed. Existing current-main CI run `42561570045` is successful, but branch dirty tests were not run.
- This branch must not be launched as the newest compatible Server build or merged wholesale. Use exact `origin/main` for the first API→Site runtime acceptance; if a later verified improvement is found, port it to a new isolated worktree and run acceptance there. Current local preview remains HTTP 200 with API 502; resource gate 22 GiB disk, 29% free RAM, 12,799 MiB swap at 07:06 EET; defer heavy build/test.

## 2026-11-09 09:39 EET — Qoder Site/Server PR decisions on live GitHub

| PR | Live GitHub status / head | Decision | Reason and evidence boundary |
|---|---|---|---|
| Site #112 | MERGED as `e25847deb158ec5677835d4651ac2c18f2d826f2` | ALREADY_IN_MAIN | Qoder map-sheet contribution was selectively integrated; current main contains sheet-aware route focus. |
| Site #113 | CLOSED, not merged; Qoder head `e9fbb94a0b23348c71ead4fc30f4ff78940ac383` | PARTIAL_PORT / no wholesale merge | Rotated focus/callout work overlaps current main (`cameraForRotatedPoints`, `layoutCallouts`, route callout placement). Main exact-SHA visual acceptance is still pending, so do not cherry-pick the divergent stack without a specific uncovered behavior and test. |
| Site #114 | CLOSED, not merged; Qoder head `e26c598572a0b032d1cd8f6503e65902f45ae387` | SUPERSEDED | Its design/search slice was selectively ported by #115. Its screenshots are from a branch that lacks newer #115/#117 main changes. |
| Site #115 | MERGED as `d54149e23f0f28daec34bda5a7b65f5dbb0df4d1` | ALREADY_IN_MAIN | Selectively ported Qoder navy polish, compact card styling, motion and passengers/budget row; preserved provider-coverage disclosure. |
| Site #117 | MERGED as current Site main `411cb45794d70ce744f64099d4d9d3b19d71588a` | ALREADY_IN_MAIN | Compact cards retain duration, total price, actual time window, transfers and mode strip; source/wait details move into details; critical failures and collapsed diagnostics remain. This is the current-main contract, not the older Qoder preview screenshot. |
| Server #119 | OPEN; GitHub reports unmergeable/conflicting; Qoder head `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3` | SUPERSEDED / do not merge | Main is `4db6e97b392cb9f01e07fea035b8346826119333`. PR #120 (`d8c25a560187a89aaa42422d602802854c19c694`) selectively integrated the safe Qoder work and corrected optional-geocoder readiness and capped-stop semantics; it is an ancestor of current main. Do not merge #119 or duplicate #120. |

Current conclusion: Qoder’s useful Site changes are represented in current main by #112/#115/#117 or later map code. Server PR #120 selectively ported Qoder’s safe search changes; #119 remains open/conflicting and must not be merged again. No code from the divergent worktrees was newly merged in this checkpoint. Recheck exact-main visuals and fix the real search truncation on an isolated Server candidate.


## 2026-11-09 11:04 EET — new search mode contract PR decisions

| PR | Base / head | Scope | Decision | Evidence / missing gate | Dependency |
|---|---|---|---|---|---|
| Server #126 | 4db6e97b392cb9f01e07fea035b8346826119333 → 39d76899ee829bced26212ab3f8609c2c0d058ea | Add per-mode bike/scooter provider allowlists; preserve legacy flat contract | NEEDS_REVIEW; draft | Focused tests, typecheck, changed-file lint pass; exact-head CI 42589392341 SUCCESS; paired source/parser contract passes. HTTP provider-backed journey acceptance remains missing. | None |
| Site #118 | 411cb45794d70ce744f64099d4d9d3b19d71588a → a59b67646e80519eaa8a8e7810dae24248406bd4 | Preserve selected modes independent of endpoint-local provider discovery; emit provider filters by category | NEEDS_REVIEW; draft | Focused tests, typecheck, lint, build and boot-smoke pass; exact-head CI 42589422740 SUCCESS; paired source/parser contract passes. Rendered route/map acceptance remains missing. | Server #126 must merge first |

Neither PR changes the Qoder worktrees or running preview. Do not merge the Site contract before Server #126. Neither PR proves 12 provider categories are live or production-ready.

## Server #126 + Site #118 — 2026-11-09 09:47 UTC decision refresh

| PR | Base → exact head | Decision | Current evidence | Gate before merge |
|---|---|---|---|---|
| MarshGO-Server #126 | main `4db6e97b392cb9f01e07fea035b8346826119333` → `d181af6afaf32c2076e762e1cf35a8a5d8218135` | `NEEDS_REVIEW` (keep draft) | Per-mode bike/scooter provider filters; all canonical 12 request parser contract. Exact-head runs `42594262395`,`42594255710` SUCCESS. | Execute authenticated HTTP search on isolated candidate+DB and verify route provenance/geometry; do not use Qoder's shared DB. |
| MarshGO-Site #118 | main `411cb45794d70ce744f64099d4d9d3b19d71588a` → `e80d0472d5fde501865ad8bac1ca0e9cdd36a883` | `NEEDS_REVIEW` (keep draft; depends on Server #126) | All 12 categories stay selectable across endpoint-local provider gaps; provider message doesn't imply route coverage. Exact-head runs `42593815323`,`42593808907` SUCCESS. | Same exact-pair route→response-geometry→rendered-map acceptance, including UX check. Browser automation cannot currently attach to the locked local UI. |

Neither PR has been merged or deployed. This is deliberate to protect the working Qoder preview until the paired runtime gate is available. Current CI does not establish provider coverage for every mode.

## Server #127 — provider seed status safety — 2026-11-09 10:02 UTC

| PR | Base → head | Decision | Evidence | Next gate |
|---|---|---|---|---|
| MarshGO-Server #127 | main `4db6e97b392cb9f01e07fea035b8346826119333` → `dc69252a48bd2d0a164ee3ab19db564e510bddd9` | `NEEDS_REVIEW` / draft | Seed upsert no longer rewrites existing `status`; failed probes update health/freshness only. New eligible catalog sources get a default enabled status and remain gated by health. Typecheck, 5 focused tests, ESLint, diff check pass. | Exact-head CI runs `42597489068`,`42597483399` pending; then review source-state integration and paired provider route acceptance. Does not merge automatically with #126. |

**Worktree note:** an unused worktree was mistakenly created from root `MarshGO` while preparing Server isolation: `/Users/dima1203/.codex/worktrees/marshgo-server-seed-status-4db6`, HEAD `1e7d0ee74f11121a7d5a29c6379944a5360581c4`, no tracked changes, untracked dependency symlink only. Preserve; do not use as Server checkout. The actual Server branch is in `/Users/dima1203/.codex/worktrees/marshgo-server-seed-status-srv-4db6`.

## Dependency refresh — 2026-11-09 10:29 UTC

| PR | Current base → head | Decision | Evidence / gate |
|---|---|---|---|
| Server #127 | `4db6e97b392cb9f01e07fea035b8346826119333` → `dc69252a48bd2d0a164ee3ab19db564e510bddd9`; merged as `a2bc6c753b8e452f040e545dddbee5b34d7166a9` | `MERGED` | Source reviewed; exact-head CI `42597489068`,`42597483399` SUCCESS. Existing provider admin status is no longer overwritten by a transient probe. No DB or deployment action. |
| Server #126 | `a2bc6c753b8e452f040e545dddbee5b34d7166a9` → `7f4d94d0786442626407e1d36f58a3c32531553c` | `NEEDS_REVIEW`, draft | Updated branch with a normal merge commit; new CI runs `42601025099`,`42601030862` in progress. Do not merge until both exact-head checks pass. |
| Site #118 | `411cb45794d70ce744f64099d4d9d3b19d71588a` → `e80d0472d5fde501865ad8bac1ca0e9cdd36a883` | `NEEDS_REVIEW`, draft; depends on Server #126 | Exact-head CI `42593815323`,`42593808907` SUCCESS. Site sends `allowedProviderIdsByType`; old Server parser would reject it. Merge only after #126 and then validate the pair. |

Qoder remains on the prior known-good runtime pair; remote main/PR merges do not restart or mutate it. Green CI and selector/request-contract tests are not provider-backed route→geometry→render acceptance.


## Merge confirmation — 2026-11-09 10:42 UTC

| PR | Integration | Verified checks | Remaining acceptance |
|---|---|---|---|
| Server #127 | MERGED as `a2bc6c753b8e452f040e545dddbee5b34d7166a9` | Exact-head CI runs `42597489068`,`42597483399` SUCCESS | No runtime/database recovery test in this operation |
| Server #126 | MERGED as `3d53e33b26f5c147dc437d56e92596828a72d1f7` | Updated exact head `7f4d94d0786442626407e1d36f58a3c32531553c`; runs `42601025099`,`42601030862` SUCCESS | Per-mode provider request contract is not live route proof |
| Site #118 | MERGED as `b2f20d7ad3b2bc1a724d7050601ee1f51432c3c7` | Exact-head runs `42593815323`,`42593808907` SUCCESS | Must validate against the merged Server contract on one pinned runtime pair |

The local Qoder preview remains on Site `411cb45794d70ce744f64099d4d9d3b19d71588a` and Server `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`; it was not restarted. Qoder's “test every function” task is active but currently limited to HTTP smoke because free RAM sampled 30–32% (below the 35% guard). Walking-geometry repair is prepared as a follow-up after that task completes. No release manifest refresh or production deployment follows from these merges.


## Qoder verification handoff — 2026-11-09 10:49 UTC

- The merged Server #127/#126 and Site #118 work is still not loaded into Qoder's older pinned preview. Exact-head CI passed; unified compatibility remains unverified.
- Qoder's isolated Site unit suite passed 583/583 with no skips. Qoder reported some route-chain/transfer presence via API but has not yet provided reproducible per-strategy/all-category evidence.
- Qoder is currently generating a guest-only functional matrix, then continuing with the foot-router bind-mount issue. Authenticated UI is blocked by design unless an already-authorized session exists; no credentials/account creation.
- Resource gate at this checkpoint: RAM free 29%, swap about 4.0 GiB, disk 34 GiB free. Defer heavy browser or Docker tests. No Qoder preview restart, source merge, provider toggle, or production operation.
