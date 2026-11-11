# Partner inactive control and exact image smoke — 2026-10-24

## Change

- Partner PR #1 branch `codex/p0-partner`, commit `9a90b8833d0dc031b307d00e558ab78a251451fe`.
- Removed the integration-row icon button with no URL or handler. The row already presents “Не підключено” and explains that provider/API rights must be confirmed.
- No API contract, organization membership, or authorization behavior changed.

## Checks

- Unit tests: 3/3 PASS.
- TypeScript: PASS.
- ESLint: PASS.
- Production build: PASS.
- Exact Partner image: `marshgo/partner:RC-2026-10-24-partner-9a90b88`, linux/arm64, OCI digest `sha256:8c829d1774b4a6527a0fdaca1a4c1dc8c559de6823649badd6088ca8484ed17e`.
- Isolated static HTTP smoke: root, `/organization`, `/integrations`, `/settings`, JS bundle and `/healthz` returned HTTP 200. A DNS-only `api` alias let Nginx resolve its expected upstream; API/auth operations were not tested. Temporary containers/network were removed.
- Hosted Partner PR #1 Verify run `40126076348`: SUCCESS on exact head `9a90b8833d0dc031b307d00e558ab78a251451fe`; PR remains OPEN/MERGEABLE.

## Limits

- The 3-test suite is limited to membership gating; no full page/button acceptance or authenticated API/tenant-isolation E2E is included.
- The image is an independent candidate, not an integrated six-repository release tuple.
- Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
