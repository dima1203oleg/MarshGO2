# Admin OTP fix and authenticated UI gate — 2026-10-24

- Repository `dima1203oleg/MarshGO-Admin`, branch `codex/p0-admin`, PR #1.
- Exact commit `bc37198ca139408907aaefa0d97dc9b60a568300`; hosted Verify run `40126700951` PASS.
- Fixed the local development OTP flow so submit uses the editable code or, when untouched, the displayed development code.
- Local Admin checks: 2/2 unit tests, typecheck, lint, production build and diff check PASS.
- Exact image `marshgo/admin:RC-2026-10-24-admin-bc37198`, linux/arm64, OCI digest `sha256:a4668ffc8d7d516a40fa79f7d1d1db19ded6bcba9ee58781d4b8157620f66633`; static HTTP smoke for root, `/partners`, `/providers`, `/integrations`, `/audit`, JS bundle and `/healthz`: 7/7 PASS. The smoke used only a DNS alias for Nginx and did not call Server APIs.
- Server security rule `adminGrantAllowed()` intentionally refuses to grant a platform admin role when development OTP is visible. Therefore a local dev OTP browser flow cannot authenticate as Admin; bypassing that rule would invalidate authorization evidence. Admin authenticated UI E2E remains NOT_TESTED pending secure test OTP configuration or an authorized staging account.
- Server API-level partner moderation and provider permission paths are covered by the exact isolated integration run documented in audit 112, but this does not replace Admin UI acceptance.
- Production/staging remain NOT_RELEASED / NOT_TESTED.
