# MARSHGO Partner

One responsive partner workspace for transport companies using either their own integration or the MARSHGO Native Dispatch model. Authentication and business authorization are owned by the canonical [MarshGO Server](https://github.com/dima1203oleg/MarshGO-Server).

## Local development

Requirements: Node.js 24.21.0 and a running MARSHGO Server. Copy `.env.example` to `.env.local`, update `MARSHGO_API_PROXY` if needed, then run:

```sh
npm ci
npm run dev
```

Use the existing MARSHGO OTP login. Production requires the deployed Partner origin to be included in Server CORS/refresh-cookie configuration. Do not put credentials or provider secrets in frontend variables.

For local UI work, choose **«Увійти без SMS · режим розробки»** on the login screen. This creates no Server session, blocks API calls and business actions, and uses no real organization data. The option is available only in Vite development mode and is excluded from production builds. Use OTP to test real memberships and tenant permissions.

## P0 scope

Partner application submission, organization membership, onboarding status, requested service modules, and role-aware presentation. Orders, fleet tracking, live GPS, API credentials, and finance remain unavailable until their backend capability and partner permission are implemented.

See the [platform specification](https://github.com/dima1203oleg/MarshGO-Server/blob/codex/partner-platform-foundation/docs/ADMIN_PARTNER_PLATFORM_SPEC.md).
