# GTFS production search frontier — 2026-10-26

## Change

- Server candidate branch: `codex/gtfs-queue-frontier-20261026`.
- Commit: `aaa1328f17c35029b7efa4f801dfae07301a9517`, based on Server PR #43 candidate `4ed81b47e45520475470b699deac115fb0000b69`.
- Draft PR: https://github.com/dima1203oleg/MarshGO/pull/44 (stacked on Server PR #43).
- Production GTFS traversal now has an independent 10,000-item pending-work frontier cap. Dropped frontier work sets the existing `searchBudget` truncation flag; a partial result is never described as complete. A test-only override verifies this behavior.
- No fare/dominance pruning, feed semantics, API schema, credentials, or deployment behavior changed.

## Evidence

- Exact candidate local Server suite: 316 passed, 3 opt-in DB integration tests skipped, 0 failed.
- Typecheck, ESLint, and `git diff --check`: PASS.
- Three frozen Lviv O/Ds, five repeats each on Node 25.4.0: result hashes and winner identities were stable within each O/D. FASTEST/CHEAPEST/BALANCED winners were unchanged from the recorded baseline. Peak pending frontier on one-run diagnostic replay: 3,635–5,832 of 10,000.
- Searches remain truncated by existing candidate graph/pool limits. The replay is not proof of route completeness, supported-Node performance, staging, or production readiness.
- GitHub PR #44 exact-head `verify` runs `40313885418` and `40313914470`: PASS.

## Status

This bounds worst-case queued search work and makes queue loss visible. It does not resolve dense-feed candidate truncation or prove globally optimal routing. PR #44 remains draft; exact-head hosted verification passed. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Next

1. Read exact-head PR #44 CI results; fix failures without weakening assertions.
2. Continue route-completeness work against the exhaustive small-feed oracle and frozen three-O/D replay. Do not promote test-only search experiments or remove truncation disclosure.
3. Keep root E2E/staging, licensed live-provider checks, physical iPhone, security/load/recovery, backup/restore, rollback, and owner release approval open.
