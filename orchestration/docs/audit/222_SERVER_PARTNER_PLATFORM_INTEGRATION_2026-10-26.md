# Server Admin/Partner integration checkpoint — 2026-10-26

## What was found

- Audited current local Server `feature/transport-layer-availability` at `92a26a3f617f32d644a66c0af46cba096ccb0ce0` and the pushed `codex/partner-platform-foundation` branch. The local dirty Server source lacks the portal APIs, while the open PR #42 tree already contains the partner organization/membership schema, tenant-scoped Partner API, Admin dashboard/integration APIs, provider credential redaction, role rules and integration tests.
- Created an isolated integration branch `codex/server-partner-integration-20261026`; its initial merge commit was `45c3c9dbb842f1f275f288b8f057a531c4f40350`. After fetching PR #42, merged its head `a403a51a203d9d89685c10c69658c8fd95b70e9b` as a parent, producing `2ff505b96f284372e983ef267cc9b6d098db0caf`.
- Exact tree comparison confirms PR #42 and `2ff505b` have identical source tree SHA `86c3899bed947fa94a7e30bca7ace6c61ab16b62`. Therefore the portal backend was already part of PR #42; no distinct source delta or additional PR is needed. The temporary integration branch is pushed but is redundant and is retained, not deleted.
- PR #42 remains an open stacked candidate and is not merged to `main` or selected in the release manifest. The dirty canonical checkout was not modified.

## Verification

Runtime: bundled Node `v24.22.1`; local Postgres/PostGIS and Redis; new isolated DB `marshgo_e2e_codex_20261026`.

- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- `npm test` — 205 PASS, 0 FAIL, 1 opt-in integration SKIP (206 total).
- `npm run test:integration` — all phases PASS: journey schema 2/2; booking/trip editing 21/21; Partner tenant API and Admin authorization 1/1; navigation 2/2; Redis realtime 1/1; restart durability 1/1; Redis rate-limit 1/1.
- `git diff --cached --check` — PASS before commit.
- Fresh migrations applied both `051_owner_attested_micromobility_returns.sql` and `051_partner_organizations.sql`, plus later migrations. Migration identity is the full filename; no file was renumbered.

An initial run against the pre-existing shared `marshgo_e2e` database stopped on a test assumption that no healthy Lviv GTFS provider existed. The database contains persistent provider state; it was not cleaned or modified. A new isolated DB was created and the full suite passed there.

## Acceptance boundary

Partner authenticated API tenancy and Admin authorization/provider-redaction/moderation have local integration coverage on a tree-identical derivative of PR #42. This does not prove the separate Admin/Partner browser applications are wired to these APIs on an immutable 5+1 tuple, nor staging, production, or real identity-provider behavior. Dense Lviv routing still reports truncation; no staging host, deployed tuple, external provider entitlements, physical-device acceptance, production secrets, backup/restore, or rollback was established here.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. No production deployment occurred.

## Next exact action

Run the Admin and Partner browser clients against the existing PR #42 API tree using isolated identities, then execute cross-repository API/browser acceptance on one immutable Server/Site/Admin/Partner tuple. Keep the release manifest unchanged until the tuple is reviewed.
