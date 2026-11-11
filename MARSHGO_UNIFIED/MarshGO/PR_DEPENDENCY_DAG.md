# PR dependency DAG — 2026-10-23

## Current GitHub recheck — 2026-10-25 17:35 UTC

### Incremental exact-head recheck — 2026-10-25 18:35 UTC

Server PR #42 code source `175d5dff3b39140e9410db0c078e9baf1ce5678d` passed exact-head CI runs `40221694242` and `40221698958`; docs-only checkpoint commits advanced the same open/draft branch to `a403a51a203d9d89685c10c69658c8fd95b70e9b`, stacked on PR #41 `70e11d8d8730e54311f13d73953ab565fd6b432a`. Exact-head CI runs `40222929785` / `40222932837` were queued/in progress at last check. Dense Lviv candidate-graph and search truncation remain unresolved. This update does not alter the six-repository tuple or release manifest.

This snapshot supersedes older PR-head and tuple statements below. GitHub currently lists **87 open PRs** across the six authorized repositories; these are not 87 release-ready changes. Read-only counts: MarshGO 6, Server 39, Site 26, iOS 12, Admin 2, Partner 2. Closed/merged history rechecked: Server #13/#16/#18 closed (not merged), Site #16 merged (`fdeaa48fca8d`, 2026-10-23), iOS #10/#13 closed; no other closed PRs appeared in the current six-repo result.

### Exact production-facing branches and dependencies

| Repository | PR / branch | Exact head | Base / dependency | Current checks and status |
|---|---|---|---|---|
| MarshGO | #5 `codex/production-finalization-20261014` | `40a46aced468830ca7c3ab5a7648b6a05a6e6f95` | `codex/marshgo-production` (#1 stack) | Verify run `40203469261` FAIL; CodeQL/Gitleaks pass. Failure is private Admin/Partner source materialization because `MARSHGO_REPOS_READ_TOKEN` is absent. Open draft. |
| MarshGO | #6 `codex/security-dependencies-20261021` | `2b87b8b016ce8b4c309adc4399ad31b81781cd09` | #5 branch | Open draft; no change to the missing private checkout authorization. |
| Server | #35 `codex/server-final-rc-20261024` | `6cd3b6c5613e4165576fdb4bc2662a02c9e54818` | dirty `feature/transport-layer-availability` head `182c77ae4f78d576a287007d8e0864fb130f43f8` | Separate release-candidate line; do not silently substitute it for the current routing stack. |
| Server | #36 → #38 → #39 → #40 → #41 → #42 | #42 `175d5dff3b39140e9410db0c078e9baf1ce5678d` | #42 → #41 `70e11d8d8730e54311f13d73953ab565fd6b432a` → #40 `38f17b88f98c8530f8090cfc6745cd334c87e53c` → #39 `142ed4f76e9da94430048d4a31e7ad3962b4858b` → #38 `8e570768c7e1e4dd2f016764d7396d9776e92abc` → #36 `134ed017828a020e1d5f696b3cb9ea95527bb093` | #41 checks `40194603311`/`40194607141` PASS; #42 checks `40221694242`/`40221698958` PASS on this exact head. #42 remains draft; dense Lviv search remains truncated. |
| Site | #3 → #21 → #22 → #23 → #24 → #25 → #26 → #27 | #27 `cc1499573732a41e8ff31d7ab634d15421d45df1` | #27 → #26 `1b5986de5af875c5c2945df4752c23603c135ed3` → #25 `7aed5344218058b024f5c269b36b03577d94026e` → #24 `16f5b217bea479268eb10ad021fb22ebe1beba3c` → #23 `9569bb4f174a4bdf912a6f490e69a359148db342` → #22 `5a96e85630428c2ffc15dfe67308334eda9d7398` → #21 `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9` → #3 `6961afcf008e2c845c0fde68c687ce61fe744f2f` | #27 checks `40201475281`/`40201478772` PASS. Open draft, not integrated to `main`. |
| iOS | #14 `codex/ios-final-rc-20261024` | `7dfd35bf5f06169d7df82fa8d0879fcaf02431b5` | `main`; embedded non-tag CI pins Server #40 `38f17b88f98c8530f8090cfc6745cd334c87e53c` + Site #25 `7aed5344218058b024f5c269b36b03577d94026e` | Simulator checks `40163988537`/`40163992039` PASS. These pins lag current Server #42/Site #27; exact cross-app tuple is not aligned. |
| Admin | #1 `codex/p0-admin` | `f39c4b74839a393f4487c830930669eabc8c0390` | `main` | Verify `40162633629` PASS. |
| Partner | #1 `codex/p0-partner` | `97a3727cc395dea092af6e3e24d6822370c2bc63` | `main` | Verify `40126462889` PASS. |

### Local checkout mismatch

- Orchestrator checkout is on `codex/production-finalization-20261014` at `58d6f12acb68922d3d7f9ab18180e1cf10457537`, one local audit commit beyond PR #5 head and **286 dirty status entries**. Do not build/publish the root release from this mixed tree.
- Nested Server checkout is dirty at `feature/transport-layer-availability` `92a26a3f617f32d644a66c0af46cba096ccb0ce0` (37 status entries), not PR #41/#42. Nested Site is dirty at `codex/sync-journey-mobility-ui` `6961afcf008e2c845c0fde68c687ce61fe744f2f` (41 entries), not PR #27. Nested iOS is clean at older `codex/production-site-sync-20261014` `4353cec3cacbaf662ceea047402f361024292b22`, not PR #14.
- Admin/Partner have no nested branch checkouts; `.release` detached snapshots are Admin `9dbf7db0a935498ac40c98b19bc36bce056d630d` and Partner `c639257a7f28aeda5b378a816038b01651146b83`, each with 3 dirty/untracked entries. These differ from current PR #1 heads.
- No PR was merged and no manifest was promoted. No production deployment was attempted. See `REPOSITORY_INVENTORY.md` and `docs/EXTERNAL_BLOCKERS.md` for runtime/environment gates.

## Current exact-candidate recheck — 2026-10-24 19:55 UTC

This block supersedes older snapshots below for current heads and CI state. Open PRs remain separate changes; exact-head green CI does not mean merged or deployed.

| Repository | PR | Head SHA | Base ref | Current checks / disposition |
|---|---:|---|---|---|
| MarshGO | #6 | `2b87b8b016ce8b4c309adc4399ad31b81781cd09` | `codex/production-finalization-20261014` | CI fails closed while private `MARSHGO_REPOS_READ_TOKEN` is unavailable; CodeQL and Gitleaks pass. |
| Server | #35 | `6cd3b6c5613e4165576fdb4bc2662a02c9e54818` | `feature/transport-layer-availability` | CI pass. Candidate adds reviewed GTFS breadth/cache/security work; search remains explicitly truncated. |
| Server | #36 | `134ed017828a020e1d5f696b3cb9ea95527bb093` | `codex/gtfs-raptor-round-search-20261023` | CI runs `40056723422`, `40056739994` pass. Selected Server source in RC.6. |
| Server | #37 | `685eda4a9b18ea07c1264ccfe68bd21d3ebbbd16` | `codex/server-final-rc-20261024` (PR #35 head) | CI pass; endpoint stop-selection experiment preserves winners in three frozen ODs but remains truncated and measures a small runtime increase; keep draft/unintegrated pending review. |
| Server | #38 | `8e570768c7e1e4dd2f016764d7396d9776e92abc` | `codex/server-production-integration-20261024` (PR #36 head) | CI runs `40121317374`, `40121320888` pass. Refactors shared GTFS leg projection and adds incomplete test-only event traversal; production replay still truncated. Not selected into RC.6. |
| Site | #21 | `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9` | `codex/sync-journey-mobility-ui` | CI pass; parent of #22. |
| Site | #22 | `5a96e85630428c2ffc15dfe67308334eda9d7398` | #21 exact head | CI runs `40119406496`, `40119409597` pass; draft, parent of #23. |
| Site | #23 | `10454f37b59a848e4a5b381689dfe7f701fe2b81` | #22 exact head | CI runs `40124900205`, `40124905110` pass; draft, selected Site source in RC.6. |
| iOS | #14 | `53b28ec86ee806e95284eee8ab6c8a12739f6df4` | `main` | Simulator runs `40125380685`, `40125383444` pass; pins the exact Site #23 and Server #36 SHAs. |
| Admin | #1 | `bc37198ca139408907aaefa0d97dc9b60a568300` | `main` | Verify `40126700951` pass; selected Admin source in RC.6. |
| Partner | #1 | `97a3727cc395dea092af6e3e24d6822370c2bc63` | `main` | Verify `40126462889` pass; selected Partner source in RC.6. |

### Selected tuple and integration

RC.6 pins Server #36, Site #23, iOS #14, Admin #1 and Partner #1 at the exact SHAs above. The root integration checkout SHA is `8741bd1936115941386148104dff130525aa5f5d` but its working tree is dirty and it is not a reproducible immutable release source. Four local ARM64 images built for the selected Server/Site/Admin/Partner tuple and the disposable integration stack passed (audit 114); the images are not published. Production remains `NOT_RELEASED` / `PRODUCTION_READY=false`.

### Non-merged Server candidate branches

PR #35 and PR #36 have different bases and are not one ancestry stack. #37 is only stacked on #35; #38 is only stacked on #36. Do not combine their heads by blind merge. #37 is a measured heuristic experiment with modest candidate-count effects and still-reported truncation. #38 is a shared-projection refactor plus diagnostic traversal; it does not fix production truncation. The RC.6 Server image was therefore built from #36, and the remaining routing-completeness defect is explicitly open in the acceptance matrix.

---

## Recheck — current staged candidates (2026-10-23)

**Live GitHub recheck supersedes the historical notes below wherever they disagree.** All PRs in the inventory are still open; an open PR is not an integrated feature. Snapshot includes these open PR numbers: MarshGO #1–#6; Server #1–#33 except #13/#16/#18; Site #1–#20 except #16; iOS #1–#12 except #10; Admin #1–#2; Partner #1–#2. Site PR #16 is already merged into its route-overview branch. No release PR in this candidate tuple is merged to the respective default branch.

GitHub currently reports these exact open heads (none merged):

| Repository | PR | Head SHA | Base ref / SHA | Checks observed |
|---|---:|---|---|---|
| Server | #32 | `d34601cf4385b32a06bb92f7ce79998a518dfee3` | `codex/gtfs-rt-position-freshness-20261023` / `b65882584a3ad1e8dd7512d13176f52299cded51` | Server CI run `39989481206` SUCCESS |
| Server | #33 | `e7e695ee337f64af97679c283c3988dfe883c200` | `codex/gtfs-rt-position-freshness-20261023` / `b65882584a3ad1e8dd7512d13176f52299cded51` | Exact-head Server CI runs `40000373667`, `40000335218` SUCCESS; local 72/72 GTFS + typecheck/lint PASS. Test/oracle refactor only; not a routing-completeness fix |
| Site | #20 | `a000b3cc07a956ae7ded4563ab5e97b11fe3db71` | `codex/map-layers-reference-20261023` / `3ca6957461e5d3967fb0ca1e450f9e2495f4cc34` | runs `39995439983` and `39995439935` attempt 2 SUCCESS (dependency audit, lint/types, unit, build/bundle, browser acceptance, immutable artifact) |
| iOS | #12 | `6e825cd59df9529c9b88aab063989d7328497fef` | `codex/ios-pin-server-pr27-20261022` / `ef8a290dfe6bb870389f104b229d69a3843801a9` | Retry run `39996495495` SUCCESS: exact Site checkout, Capacitor build/sync, embedded-manifest verify, and iOS Simulator compile. Inputs: Site `a000b3cc07a956ae7ded4563ab5e97b11fe3db71`, Server `b65882584a3ad1e8dd7512d13176f52299cded51` |
| Admin | #1 | `9dbf7db0a935498ac40c98b19bc36bce056d630d` | `main` / `8ababeb88f1a6c9198125c9ed92906a2f7ad956b` | Verify run `38622007161` SUCCESS |
| Partner | #1 | `c639257a7f28aeda5b378a816038b01651146b83` | `main` / `725cb5573db5cd8199aa12594f31277b72a6169f` | Verify run `38622007703` SUCCESS |
| MarshGO | #6 | `b2535369f4636f1f2bb63f96525f2a1b4f929f08` | `codex/production-finalization-20261014` / `f944560a3babf7423befc53741217d9281f44dab` | Security SUCCESS; umbrella CI run `39658734667` FAILURE |

The iOS/Site input pin is now aligned on the exact Site #20 SHA. This is still not one complete compatible release tuple: Server #32 is a child of an existing Server stack and is test-only; the production Server candidate remains at PR #31, while Admin/Partner are unmerged. The umbrella failure remains tied to unavailable private-repository clone credential configuration. No branch was merged or deployed.

Edges below mean “head PR targets the branch named by the base ref”; they are not permission to merge. The displayed SHA and check status were read from GitHub on 2026-10-23.

## Current user-facing stacks

- **MarshGO release:** PR #1 (`codex/marshgo-production` → `main`) → #2 (`codex/redis-smart-cache` → #1) → #3 (`codex/navigation-experience-6` → #2) → #4 (`feature/unified-repository-governance` → #3). A separate #5 draft (`codex/production-finalization-20261014` → `codex/marshgo-production`, head `39a182094c82f58d84b3dbabd4a18808569bd206`) has failed verify; #6 (`codex/security-dependencies-20261021` → #5, head `b2535369f4636f1f2bb63f96525f2a1b4f929f08`) also has failed verify. Latest check detail: #6 CodeQL/Gitleaks pass, CI `39658734667` fails because private Admin/Partner materialization credential is absent.
- **Server:** The route/search chain is #9 → #10 → #12 → #14 → #15 → #17 → #20/#19/#21 and the newer search chain #22 → #23 → #24 → #25 → #26 → #27 → #28 → #29 → #30 → #31. PR #31 (`b65882584a3ad1e8dd7512d13176f52299cded51`) is the current production-facing candidate and is the parent for test-only #32 (`d34601cf4385b32a06bb92f7ce79998a518dfee3`). PRs #13, #16, and #18 are not in the current open-PR snapshot. Independent open PRs #1–#8 cover rideshare rendezvous, auth parsing, mobility registry, partner foundation, Redis cache, stop arrivals, transport layers and governance; verify ancestry before claiming any is in #31. PR #31's exact local/hosted acceptance is recorded above; it is unmerged.
- **Server follow-up:** PR #33 (`codex/gtfs-raptor-multilabel-20261023`, `e7e695ee337f64af97679c283c3988dfe883c200`) is stacked directly on PR #31. It centralizes the production transfer decision and exposes a read-only test snapshot so an independent oracle can compare feasibility, identities, fares and ranking winners. It is validation infrastructure; it does not change search limits or solve dense-feed truncation. Exact-head CI is running.
- **Site:** Main product PR #9 is followed by consent/GPS/map PRs #10–#15. Current map/detail sequence is #15 → #18 (head `e01bef59db362071954b8fc9279a0d06a3bd5d70`) → #19 (head `3ca6957461e5d3967fb0ca1e450f9e2495f4cc34`) → #20 (head `a000b3cc07a956ae7ded4563ab5e97b11fe3db71`). PR #20 targets the PR #19 branch and is the exact browser-verified Site SHA paired with iOS. PR #16 has been merged into the route overview branch; PR #17 is a CI-timeout remedy, not itself a product integration. Open PRs also include #1–#8. No Site candidate in this tuple is merged to `main`.
- **iOS:** The pin chain is #7 → #8 → #9 → #11 → #12. PR #12 is the exact simulator-verified head; its metadata pins Site #20 `a000b3cc…` and Server #31 `b658825…`. It is open/unmerged; simulator success does not prove physical device, signing, APNs, or TestFlight.
- **Admin:** #1 (`codex/p0-admin`, head `9dbf7db0a935498ac40c98b19bc36bce056d630d`) is the open P0 app candidate; #2 is the ownership-guidance docs PR. Local typecheck/lint/unit/build were verified for exact #1 snapshot, but authenticated app workflows were NOT_TESTED.
- **Partner:** #1 (`codex/p0-partner`, head `c639257a7f28aeda5b378a816038b01651146b83`) is the open P0 app candidate; #2 is the ownership-guidance docs PR. Local typecheck/lint/unit/build were verified for exact #1 snapshot, but authenticated app workflows were NOT_TESTED.

## Integration conclusion

There is not yet one proven tuple of all six exact commits. The root umbrella materialization check fails because private Admin/Partner cannot be checked out in CI without the repository owner configuring `MARSHGO_REPOS_READ_TOKEN`; root #5/#6 are therefore not release-ready. The latest Site map UI (#19) is not the Site commit pinned in the current root manifest or necessarily the iOS #12 tuple. No merge is performed by this audit.


### 2026-10-28 — live Server PR ancestry check

- GitHub confirms Server PR #50 is OPEN, non-draft, MERGEABLE at `5e7b985ea12b0017a63dbd02b576c94ef4a4d3fe`; its two exact-head CI checks are SUCCESS. It targets `codex/gtfs-99-hour-lookback-20261027`, not the default branch.
- Live ancestry continues through #49 → #48 → #47 → #46 → #45 → #44 (DRAFT) → #43 → #42 (DRAFT) → #41 (DRAFT) → #40 (DRAFT) → #39 (DRAFT) → #38 (DRAFT) → #36 → #34 → #33 → #31 → #30 (DRAFT) → #29 (DRAFT) → #28 → #27 → #26 (DRAFT) → #25 → #24 (DRAFT) → #23 (DRAFT) → #22 → #21 → #19. Checks observed on queried parents are green, but multiple ancestors remain Draft and the stack does not target main at its top.
- No PR was merged. Green checks on #50 do not establish safe integration of this entire dependency stack, nor complete Lviv route search: frozen replay still preserves identities/winners while reporting truncation. Preserve the PR stack and dirty checkouts until the base sequence is reconciled and reviewed.
### 2026-11-08 07:22 UTC — Site PR #104 decision

| PR | Base SHA | Head SHA | Feature | Main coverage | Decision | Evidence / dependency | Final status |
|---|---|---|---|---|---|---|---|
| Site #104 | `868a7d16d44369d8d73767e28359f4ea8d87195f` | `b11b178bb94991f06ce0769e8d84f1add8f3b3ac` | Prevent retry from removing transport/provider/budget/deadline constraints after a failed journey-search request. | This fail-open compatibility retry existed on main; new behavior is not yet integrated. | MERGE after checks | Files: `src/services/productionApi.ts`, `tests/journey-search-abort.test.ts`. Stubbed fetch regression 5/5; scoped ESLint/diff-check pass. Exact-head CI run `42458453322` in progress. Main Server source supports the filter keys; no live API proof. Recheck base and required checks before merge. | OPEN / CI_PENDING |

### 2026-11-08 07:24 UTC — Site PR #104 integration result

- **Site #104: MERGED / INTEGRATED** by normal squash at main SHA `484980e1b50e0029973f8180a3bac377e7268f34` (head `b11b178bb94991f06ce0769e8d84f1add8f3b3ac`, base `868a7d16d44369d8d73767e28359f4ea8d87195f`). Exact-head verify run `42458453322` passed. Post-merge CI `42458620427` is still running, so post-merge validation remains pending.
- Behavior fix prevents stale-API errors from triggering a retry without selected filters. It is now integrated; live API compatibility and route acceptance remain unverified. Release manifest records the six current main refs as `OBSERVATION_ONLY`, `compatibility=NOT_VERIFIED`, and `production_ready=false`.


### 2026-11-08 07:31 UTC — Site PR #104 final verification update

- **PR #104: ALREADY_IN_MAIN / MERGED.** Site PR-head CI `42458453322` and post-merge main verify job `42458620427` both succeeded. Main SHA: `484980e1b50e0029973f8180a3bac377e7268f34`; PR head `b11b178bb94991f06ce0769e8d84f1add8f3b3ac`. No change to decision or integration SHA.
- Scope remains the client journey-search behavior: failed requests no longer silently retry without transport/provider/budget/deadline constraints. CI does not establish live API compatibility. The currently reachable public tunnel runs a dirty development Server and place autocomplete returns 503 because public Nominatim is not an autocomplete provider.


### 2026-11-08 07:34 UTC — Server PR #112 decision finalized

| PR | Base SHA | Head SHA | Feature | Main coverage | Decision | Evidence / dependencies | Final status |
|---|---|---|---|---|---|---|---|
| Server #112 | `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6` | `10afa683a8f0542fbbc8ff80c8905e661cc79a96` | Fail closed for public-demo geocoder endpoints in production configuration. | Integrated in current main `408d54b5531191885069e057b405cc50444eb268`; merge `f0326ca0d0bfec17bf138a3b479d758f53107a8f` is an ancestor one commit behind current main. | MERGE / ALREADY_IN_MAIN | Exact-head CI `42441620667`, `42441648841`; post-merge `42441962165`; current-main CI `42447556073`: all success. Files: `server/config.ts`, `tests/config.test.ts`. It does not configure a provider or unblock dev autocomplete; provider approval/config remains external. | MERGED; current main CI PASS; provider-backed route acceptance BLOCKED |


### 2026-11-08 07:50 UTC — iOS PR #21 integration decision

| PR | Base SHA | Head SHA | Feature | Decision | Tests / checks | Final status |
|---|---|---|---|---|---|---|
| iOS #21 | `0114f7b11d042bd0964fb3d2e3a90fc98d34fc83` | `14e317eadbfdcc0754168e700c96d259a3dedf4f` | Refresh branch CI Site checkout/assertion from old `868a7d16d44369d8d73767e28359f4ea8d87195f` to verified Site main `484980e1b50e0029973f8180a3bac377e7268f34`; correct README build metadata wording. | MERGE | Exact-head iOS simulator runs `42460162197` and `42460189051` succeeded; base was rechecked immediately before normal squash merge. Post-merge run `42460385464` is pending. | MERGED at `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff`; post-merge CI pending |


### 2026-11-08 07:53 UTC — iOS PR #21 post-merge CI result

- iOS #21 remains **MERGED / INTEGRATED** at `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff`. PR-head Simulator Build runs `42460162197` and `42460189051` and post-merge main run `42460385464` all succeeded. This validates simulator compilation with Site pin `484980e1b50e0029973f8180a3bac377e7268f34`; it does not prove physical install, API compatibility, or route acceptance.
