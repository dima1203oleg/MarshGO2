# MARSHGO iOS

Native Capacitor iOS wrapper for the shared MARSHGO Site/PWA. In this monorepo the React UI is built from `../site`, avoiding a second independently edited UI or a stale remote checkout. Bundle ID: `ua.marshgo.app`.

## Local simulator build

Requirements: macOS, Xcode, iOS Simulator, Node 24.21.0, and a reachable MARSHGO API.

```sh
SIMULATOR_UDID=<device-udid> VITE_API_BASE_URL=http://localhost:3002 npm run build:simulator
```

The included iOS GitHub Action builds the site, syncs Capacitor and compiles the iOS Simulator target. It does not sign an App Store archive or perform a public deployment.

Version-tagged iOS builds require `MARSHGO_SITE_SHA` and `MARSHGO_SERVER_SHA` full commit SHAs, plus API-contract and migration versions. The workflow embeds `release-manifest.json` containing those exact revisions. A simulator build verifies compilation only; authenticated booking, GPS permission, and map-provider behavior require a configured reachable API and separate interactive/device acceptance.

## Status and limits

The current client is a WKWebView wrapper around the PWA. Foreground GPS is supported by the web experience; guaranteed background GPS, physical-device permission verification, camera/QR scanner, push notifications, App Store signing, and release metadata are not complete. Map display and navigation need configured production routing and contracted/self-hosted map tiles. Do not ship with a blank or local-only `VITE_API_BASE_URL`.

Earlier simulator visual checks covered the welcome screen and safe-area layout on iPhone 15 Pro Max and iPhone 16 Pro Max; they did not exercise production sign-in or booking. Branch CI now builds the Site web bundle from exact main SHA `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7` and identifies Server main SHA `408d54b5531191885069e057b405cc50444eb268` in the build metadata; release tags still require the owner-configured `MARSHGO_SITE_SHA` / `MARSHGO_SERVER_SHA` / `MARSHGO_API_BASE_URL` repository variables. Physical-device acceptance is still open.

## Cross-repository audit

The architecture and migration audit is maintained by the MarshGO documentation owner in the [`codex/marshgo-production` audit index](https://github.com/dima1203oleg/MarshGO/tree/codex/marshgo-production/docs/audit). Simulator success does not imply App Store or production readiness.
