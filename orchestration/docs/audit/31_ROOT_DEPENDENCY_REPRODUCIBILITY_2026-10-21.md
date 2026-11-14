# Root dependency reproducibility and security — 2026-10-21

## Finding

At clean root source SHA `f944560a3babf7423befc53741217d9281f44dab`, `npm ci --ignore-scripts` failed because the committed `package-lock.json` did not satisfy the dependency graph in `package.json`. npm reported an incompatible `@grpc/grpc-js`, a missing nested `@grpc/proto-loader`, and a `source-map-js` version mismatch. The same clean source resolved Vite `8.3.1` and `markdown-it` `14.3.2`, both within High-severity advisories.

This means a release workflow relying on `npm ci` was not reproducible at that SHA.

## Isolated repair

MarshGO PR [#6](https://github.com/dima1203oleg/MarshGO/pull/6), branch `codex/security-dependencies-20261021`, current head `af5f0abd11396fd65c022648688d48fbb1c071a1`, updates `package-lock.json` and `bun.lock`, and adds one shared root override in `package.json`. It realigns npm and Bun lockfiles with the manifest, selects Vite `8.3.5`, and pins patched markdown-it `14.3.3` without a major-version upgrade.

The PR is draft and stacked on open MarshGO PR #5. On the current exact head, Gitleaks and CodeQL pass. Hosted `verify` completed its install/audit, lint, typecheck, unit tests, database migration, Postgres/Redis integration tests, production build and bundle gate successfully, then failed at the explicit private Admin/Partner read-token step because `MARSHGO_REPOS_READ_TOKEN` is absent. Release materialization, container build, and browser E2E were consequently skipped. This is an external CI credential blocker, not an application test failure. The original dirty checkout was not overwritten or reset. Until the dependency repair is integrated in dependency order, the release lineage still has this installability/security blocker.

## Verification on the isolated PR candidate

- `npm ci --ignore-scripts`: PASS, 669 packages installed.
- Bun `1.3.5 install --frozen-lockfile`: PASS.
- Full npm audit: **0 vulnerabilities**.
- Production-only npm audit: **0 vulnerabilities**.
- Bun audit at High severity: **0 vulnerabilities**.
- Node `24.21.0` `npm run check:production`: TypeScript, ESLint, **235 PASS / 0 FAIL / 1 opt-in integration SKIP**, production build and bundle budget PASS.
- Hosted exact-head CodeQL and Gitleaks: PASS. `verify`: prerequisite checks including DB migration/integration, production build and bundle PASS; overall workflow FAIL at missing private-repository read token. Release materialization/container build/browser E2E SKIPPED.
- No database, staging, or production deployment was performed.
