# Site WebKit place-search race fix — 2026-10-25

## Candidate

- Existing Site PR #24, branch `codex/site-place-search-guard-20261025`.
- Previous head `0235406e4bddb812935870e02f0cb21d76e0bfcd`; fix commit `16f5b21` (`fix(site): use current place query on Enter`).
- Changed only `src/views/ProductionMarketplace.tsx` in the PR worktree. The shared orchestrator checkout and its unrelated dirty files were not staged or committed.

## Finding and repair

- The first three-engine compatibility run passed Chromium and Firefox, but WebKit timed out while searching for `вул. Стрийська, 32`. The captured page showed a blank input and the “enter at least 3 characters” validation message.
- The Enter handler called asynchronous place search using React state. Immediately after a field update, that state could still be stale in WebKit. The handler now passes the input element's current value into the search function; its existing React-state fallback remains for callers without an explicit value.
- Repeated the previously failing WebKit route-map scenario: **1/1 PASS**.

## Verification on the updated Site candidate bundle

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: **105/105 PASS**.
- Production build: PASS.
- `git diff --check`: PASS.
- `npm run test:browser-compat`: **6/6 PASS** — Chromium, Firefox and WebKit; responsive sign-in/home/search and route-map/light-dark/layers cases.
- `npm run test:e2e`: **25/25 PASS** on isolated loopback `marshgo_e2e` database with pinned Server fixture `134ed017828a020e1d5f696b3cb9ea95527bb093` and updated Site candidate bundle. Button audit clicked **179 enabled visible controls** with **0** no-effect, **0** stale, no browser errors or unexpected 5xx.
- Covered local fixture flows include route search and endpoint swap; canonical twelve-mode listing; route-map focus and detail; passenger/driver booking, reverse demand, negotiation and persisted chat; GPS deviation/re-routing; denied GPS handling; direct-link hydration; truncated-result warning; rendezvous two-party consent and revocation; iPhone 15/16 Pro Max viewport rendering.
- Hosted PR checks for new head `16f5b21` passed: runs `40145665453` and `40145666886` (both `verify` jobs).

## Limits

- These are local fixture and browser-emulation checks, not live-provider, staging, production or physical iPhone/Safari acceptance.
- Full 10-image visual acceptance remains **NOT_ACCEPTED**. Snapshot tests use a synthetic fixture map and do not establish parity with licensed satellite imagery or real bus/rideshare vehicle states.
- This does not establish complete coverage of all conditional/destructive controls, authenticated Admin/Partner roles, all live providers, background GPS, release security/load/recovery, backup/restore or rollback.
- Release manifest remains unchanged; no deployment was performed. `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Next action

Continue remaining mockup acceptance and role-gated workflow coverage, followed by staging/release gates when the required external access is available.
