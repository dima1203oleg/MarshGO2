# MARSHGO2

MARSHGO2 is the integration repository for the MARSHGO product. Canonical
application sources are kept under `apps/`; the root is the workspace entry
point, not a second application implementation.

## Applications

- `apps/site` — canonical React/MapLibre Web/PWA, including the current Qoder
  route-motion, bottom-sheet, transport selector, haptic and sound-feedback
  work.
- `apps/server` — API, routing and transport-provider services.
- `apps/ios` — Capacitor iOS wrapper that builds the integrated `apps/site`.
- `apps/admin` and `apps/partner` — operational and partner applications.
- `orchestration` — shared checks, evidence and product operations.

The integration preserves the source repositories' files but does not combine
their Git histories. `MONOREPO_INTEGRATION.md` records source commits, imported
Qoder work and verification status.

## Run the canonical web app

Install dependencies in `apps/site`, then run:

```sh
npm run site:dev
```

The API is available through `npm run server:api` after installing
`apps/server` dependencies and configuring its local environment. Do not put
credentials or private provider keys in the repository.

## Build and launch iPhone 15 Pro Max Simulator

The iOS command builds the local integrated Site, syncs Capacitor and compiles
the selected simulator. It requires Xcode, Node 24.21.0, a reachable API URL,
and the simulator UDID:

```sh
SIMULATOR_UDID=<device-udid> \
VITE_API_BASE_URL=http://localhost:3002 \
npm run ios:simulator
```

Optionally provide exact 40-character source pins with
`MARSHGO_SITE_SOURCE_COMMIT`, `MARSHGO_IOS_SOURCE_COMMIT`, and
`MARSHGO_SERVER_SHA`. A local simulator build is not a production deployment
or physical-device acceptance.

## Release state

**NOT_RELEASED.** This branch is an integration candidate. Production release
requires its documented API, provider, security, device, and acceptance gates
to pass. No production systems or data are changed by this repository setup.
