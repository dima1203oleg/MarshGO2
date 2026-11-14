# MARSHGO Admin

Internal partner and provider operations console. This is one responsive React/TypeScript web application; authentication and business rules remain in the canonical [MarshGO Server](https://github.com/dima1203oleg/MarshGO-Server).

## Local development

Requirements: Node.js 24.21.0 and a running MARSHGO Server. Copy `.env.example` to `.env.local`, set `MARSHGO_API_PROXY` if the server is not on `127.0.0.1:3000`, then run:

```sh
npm ci
npm run dev
```

The API browser client uses the existing OTP/refresh session endpoints. In production set public `VITE_API_BASE_URL` and configure the Server CORS allowlist and refresh-cookie policy for the deployed Admin origin. Never put credentials or provider secrets in this app.

For local UI work, choose **«Увійти без SMS · режим розробки»** on the login screen. This is a UI-only preview role: it creates no Server session, blocks API calls and cannot perform administrative operations. The option is available only in Vite development mode and is excluded from production builds. Use OTP to test real Server RBAC.

## P0 scope

Real dashboard counts, partner applications/moderation, the existing mobility provider registry, and audit events. Orders, payouts, GPS tracking, and unconfigured integrations are intentionally not represented as live features.

See [`ADMIN_PARTNER_PLATFORM_SPEC.md`](https://github.com/dima1203oleg/MarshGO-Server/blob/codex/partner-platform-foundation/docs/ADMIN_PARTNER_PLATFORM_SPEC.md) for the API and security contract.
