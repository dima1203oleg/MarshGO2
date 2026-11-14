# Orchestrator production checks — 2026-10-25

## Exact checkout

- Repository: central `MarshGO` orchestrator.
- Branch: `codex/production-finalization-20261014`.
- HEAD: `5ccef68dfdd58ab7fc44327018eafbc0c0102c0e`; working tree has 256 changed/untracked paths, preserved as found.
- This run made no source edits, commits, pushes, manifest promotion, or deployment.

## Local release checks

`npm run check:production` exited 0:

- TypeScript typecheck PASS.
- ESLint PASS.
- Unit suite: 257 total, 256 pass, 0 fail, 1 opt-in integration test skipped in this non-integration invocation.
- Vite production build PASS (1,885 modules transformed).
- Bundle budget PASS: 51 JavaScript chunks at or below 350 KB gzip each; largest reported transfer chunks were MapLibre 275.7 KB gzip and app 223.6 KB gzip.
- `git diff --check` PASS.

## Loopback integration suite

`npm run test:integration` exited 0 using the existing local `marshgo_e2e` database and healthy loopback Postgres/Redis containers. Runner enforces loopback database host/name. It applied migration `048_provider_license_commercial_use.sql` and ran isolated integration scenarios:

- Journey schema/spatial constraints: 2/2 PASS.
- Booking, auth, inventory concurrency, negotiation, cancellation, rendezvous, moderation and vehicle workflows: 23/23 PASS.
- Foreground navigation API and location privacy: 2/2 PASS.
- Redis-backed realtime across two API instances: 1/1 PASS.
- Booking durability after API process restart: 1/1 PASS.
- Shared Redis rate-limit window: 1/1 PASS.
- Total: 30/30 PASS, no skipped cases in the integration runner.

The runner disabled external mobility-feed polling and used local OSRM/realtime fixtures. These results do not establish live-provider, staging, production, or device behavior.

## Release status

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. No staging/deployed endpoint or deployed SHA was exercised. Live provider contracts/keys, staging credentials/origins, physical iPhone/signing, security/load/recovery, backup/restore and rollback remain unverified or externally blocked. Production deployment remains a separate owner-approved action.
