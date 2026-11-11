# Dirty Site local validation — 2026-10-25

- Repository: `MarshGO-Site`, branch `codex/sync-journey-mobility-ui`, committed HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`.
- The checkout has 40 modified/untracked paths. Results describe that working tree, not HEAD or the exact RC Site SHA; no staging, commit, push or deployment was performed.
- Runtime used: Node `v25.4.0`; `package.json` pins `24.21.0`.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: 98 passed, 0 failed, 0 skipped.
- `npm run build`: PASS; 1,862 modules transformed.
- `npm run check:bundle`: PASS; all 16 JavaScript chunks are under 350 KB gzip (largest 285.81 KB gzip).
- `git diff --check`: PASS.
- No authenticated API/staging, live-provider, real GPS, iOS-device or production browser acceptance was run for this separate checkout. Those remain unverified; see current exact-release audits and the current-working-tree Web acceptance audit 165.
