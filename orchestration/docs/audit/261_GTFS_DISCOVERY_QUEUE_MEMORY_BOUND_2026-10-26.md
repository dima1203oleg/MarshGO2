# Audit 261 — bound memory in dense GTFS discovery experiment — 2026-10-26

## Scope

- Isolated Server worktree: `/private/tmp/marshgo-gtfs-time-label-setting`.
- Branch: `codex/gtfs-time-label-setting-20261026`.
- New local test-only commit: `49bf104808b6f1a3bd8669aa125dfb04af4f0a87`, based on Server PR #43 candidate `4ed81b47e45520475470b699deac115fb0000b69` plus prior experiment commits. Not pushed.
- No change to the default production GTFS search path, release PR, manifest, deployment, or external data. The optional graph-observer seam is used only by the experiment/tests.
- Frozen feed SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.

## Change and evidence

An initial 10,000-label Naukova→Sykhiv replay exhausted Node's default ~2 GB heap. Reducing deep copies in the test graph snapshot alone did not prevent it. Inspection found the test traversal eagerly enqueued a potentially very large successor frontier while bounding only labels already expanded. The experimental traversal now also caps pending labels at its explicit search bound and reports queue truncation; a unit assertion checks both the maximum pending count and truthful truncation. The observer snapshot copies only mutable fields and retains feed-owned geometry/stops by reference. Production routing without the optional observer is unchanged.

- Focused GTFS tests: **76/76 PASS** before the final added queue-bound assertion; after that assertion, the targeted graph-relative test passes.
- Full Server unit suite after the implementation change: **316 PASS / 0 FAIL / 3 opt-in database integration SKIP** (319 total).
- Typecheck, full Server lint, and `git diff --check`: PASS.
- Frozen replay with 10,000 expanded-label and pending-label caps:

| O/D | New chains found | New chains in 100 results | Baseline chain coverage | Exact baseline winners | Candidate hash | Search truncated | peak RSS sample |
|---|---:|---:|---:|---|---|---|---:|
| Holosko→Sykhiv | 1,188 | 34 | 100/100 | 3/3 | `4ffae1d27d031896ea1b15521d8a701ae7c30dcdd3f3cd5b0a7f3bd963c84ecf` | yes | ~842 MB |
| Naukova→Sykhiv | 939 | 40 | 100/100 | 3/3 | `339eb1cee7628c184cc8c6a76b24ebbdbf4d7ba11fed0bf138943cf04c24937f` | yes | ~846 MB |
| Rynok→Dubliany | 685 | 33 | 100/100 | 3/3 | `0e75e7ed618b5c18a3cbfcf933328224090edfaf5d027f6c8df58fa169438c07` | yes | ~752 MB |

Naukova repeated with identical candidate hash. One run per other O/D in this checkpoint. Timings (about 2.0–6.2 seconds for the supplemental graph pass) exclude feed parsing and base graph construction; these are local diagnostic samples, not service latency or capacity claims. Runtime was Node `v25.4.0`, outside the package's declared `24.21.0`.

## Decision and limits

The explicit frontier cap prevents the observed OOM in this run and the unit test enforces the bound. The experiment retains all 100 bounded baseline chain representatives and exact FASTEST/CHEAPEST/BALANCED baseline result identities in these samples, and fills 33–40 response slots with distinct additional chains. Both production graph and discovery remain truncated. This is not a production routing implementation, not complete-graph recall, not API/staging/E2E evidence, and not a release gate pass. Do not raise either cap based on these samples. Do not port into the serving path until full API-contract, correctness, and resource tests are designed around the demonstrated frontier cost.

Separately, current root E2E remains blocked by the isolated PostGIS DB refusal at `127.0.0.1:5434`; after the laptop restart, Docker Desktop processes were present but `docker info` still timed out after 8 seconds. No containers, volumes, or databases were changed. Homebrew PostgreSQL remains unsafe for this test (no PostGIS and unrelated production-named databases).

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
