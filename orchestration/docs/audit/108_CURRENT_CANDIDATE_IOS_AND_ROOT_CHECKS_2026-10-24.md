# Current candidate checks: Site, iOS and orchestrator — 2026-10-24

## Exact references

- Server PR #36: `134ed017828a020e1d5f696b3cb9ea95527bb093`, based on PR #34.
- Site PR #21 → #22 → #23: `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9` → `5a96e85630428c2ffc15dfe67308334eda9d7398` → `10454f37b59a848e4a5b381689dfe7f701fe2b81`.
- Admin PR #1: `9dbf7db0a935498ac40c98b19bc36bce056d630d`.
- Partner PR #1: `c639257a7f28aeda5b378a816038b01651146b83`.
- iOS PR #14: `53b28ec86ee806e95284eee8ab6c8a12739f6df4`, pins the exact Site #23 and Server #36 SHAs above.
- All component branches remain candidates; Site #22/#23 are drafts. No production release or deployment is represented.

## Verification completed in this continuation

- iOS hosted push run `40125380685` and pull-request run `40125383444`: SUCCESS on exact iOS SHA `53b28ec86ee806e95284eee8ab6c8a12739f6df4`. The workflow checked Site revision and embedded manifest, built/synced the shared web app, and compiled for iOS Simulator. Unsigned archive and artifact upload were skipped by conditions. Physical iPhone, APNs, signing and TestFlight are NOT_TESTED.
- Orchestrator at commit `8741bd1936115941386148104dff130525aa5f5d`, with a dirty working tree: `npm run check:production` PASS; typecheck, ESLint, 256 unit tests pass, zero fail, one opt-in DB integration test skipped, production build PASS, 51-chunk gzip budget PASS. `git diff --check` PASS. These checks do not prove an immutable artifact or staging/production.
- `node ops/scripts/materialize-release.mjs` PASS for exact Server/Site/Admin/Partner SHAs in the review manifest; source origin/SHA/cleanliness guards passed. `docker compose -f .release/compose.production.yml config --quiet` could not run because actual deployment configuration is absent: domain, DB/Redis credentials, approved map/geocoder/routing endpoints, Twilio and S3 values. No placeholders were used to create a client bundle or start Compose.
- Site exact candidate has 105/105 unit tests, typecheck/lint/build/bundle PASS and local fixture Playwright 20/20 PASS from the preceding checkpoint; hosted exact-head Site CI run `40124900205` PASS.
- Visual spot review of supplied mock #10 versus current dark expanded fixture screenshot: route detail hierarchy is present; map imagery is synthetic in the fixture. Visual parity remains NOT_ACCEPTED; this was not a full ten-image acceptance.

## Remaining release gates

- The Site dependency chain is not merged. Materialize a clean, exact six-repository source tuple and run integrated image/runtime/browser acceptance after normal PR integration.
- Dense Lviv GTFS search remains truncated, and Site displays that partial-search condition honestly.
- Root umbrella CI cannot materialize private Admin/Partner without the owner-managed least-privilege `MARSHGO_REPOS_READ_TOKEN`; no bypass was attempted.
- No verified staging origin, deployment identity, deployed SHA, licensed production map style, or required commercial-provider entitlements are present in evidence.
- Authenticated Admin/Partner tenant isolation, physical iPhone/background/APNs, production visual acceptance, security/load/recovery, backup/restore and rollback remain NOT_TESTED.
- Production deployment still requires the owner's separate approval.

## Release state

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`; deployed SHA is absent. Review candidate manifests were synchronized to the current Site/iOS heads and dirty orchestrator base commit; manifests remain uncommitted in the shared dirty checkout.
