# MARSHGO

MARSHGO is an existing React/Vite transport marketplace PWA being migrated from browser-only demo state to a PostgreSQL-backed API. Read [`docs/PRODUCTION_AUDIT.md`](docs/PRODUCTION_AUDIT.md) and [`docs/PRODUCTION_PROGRESS.md`](docs/PRODUCTION_PROGRESS.md) before treating any screen as production functionality.

## Local development

Requirements: Node.js 24.21.0 (see `.nvmrc`), Docker Compose, and Bun 1.3.5 for the checked-in `bun.lock`.

```sh
cp .env.example .env
# Keep AUTH_DEV_BYPASS=false unless using the isolated integration-test setup.
# AUTH_DEV_OTP=true enables a no-network OTP fixture in development only.
npx bun@1.3.5 install --frozen-lockfile
./scripts/local-dependencies.sh start
DOTENV_CONFIG_PATH="$PWD/.env" npm --prefix MarshGO-Server run db:migrate
./scripts/start-local-api.sh
```

In another terminal run `npm --prefix MarshGO-Site run dev -- --host 127.0.0.1 --port 3000`. The canonical Site proxies `/api`, `/healthz`, and `/readyz` to `http://127.0.0.1:3002`; the API launcher uses the canonical Server and binds to loopback. The local Vite server stays on loopback for zrok access and is not exposed to the LAN.

Run `./scripts/local-stack-status.sh` for a read-only check of Site, the public-preview target, API health/readiness and build identity, Postgres, Redis, Docker, disk, memory pressure, swap, and CPU load. It compares the running API SHA/source state with the configured canonical Server checkout and flags mismatches without printing credentials. It does not start or modify services. Disk is GREEN at 20 GiB or more, YELLOW at 8–19 GiB, and RED below 8 GiB; memory is GREEN at 35% free or more, YELLOW at 20–34%, and RED below 20%. The dependency start helper refuses Docker startup until both disk and memory are GREEN. Use `./scripts/local-dependencies.sh stop` to stop only local PostGIS and Redis while preserving volumes; `status` shows those Compose services.

## Commands

* `npm run typecheck` — TypeScript check (excludes generated `dist/`).
* `npm run lint` — ESLint on backend, tests, and changed UI entry points.
* `npm test` — unit tests; the API/PostGIS suite skips unless `API_TEST_URL` and a loopback `API_TEST_DATABASE_URL` are provided.
* `npm run test:integration` — booking/lifecycle API integration against a loopback `marshgo_e2e` database, then opt-in navigation matching with a local OSRM contract fixture. Applies no migrations and refuses non-test databases.
* `npm run test:e2e` — builds a clean PWA bundle, then runs the iPhone-sized Chromium flow against a dedicated local PostGIS database; requires Playwright Chromium, see below.
* `npm run build` — production PWA build.
* `npm run db:migrate` — apply additive SQL migrations.
* `npm run ios:sync` — build the web bundle and sync it into the Capacitor iOS target.
* `SIMULATOR_UDID=<device-udid> SIMULATOR_API_BASE_URL=http://localhost:3002 npm run ios:simulator` — build, install, launch, and capture the app on an iOS simulator (local API must be running).

Manual API integration (requires a started local API and database):

```sh
API_TEST_URL=http://127.0.0.1:3002 \
API_TEST_DATABASE_URL=postgres://marshgo:local_only_change_me@127.0.0.1:5434/marshgo \
npm run test:integration:bookings
```

Browser E2E uses a separate database named `marshgo_e2e`, isolated service ports, and a local test geocoder. It seeds and removes only its UUID-scoped fixtures. Run after starting the local Compose database:

```sh
export E2E_DATABASE_URL=postgres://marshgo:local_only_change_me@127.0.0.1:5434/marshgo_e2e
E2E_DATABASE_URL="$E2E_DATABASE_URL" npx tsx scripts/ensure-e2e-database.ts
DATABASE_URL="$E2E_DATABASE_URL" npm run db:migrate
npx playwright install chromium
npm run test:e2e
```

This test exercises server-backed sign-up, geocoded search, two-seat booking, inventory visibility and persisted booking chat using two isolated browser contexts. OTP and geocoder are local test adapters; this is not a staging, real-SMS, production-provider, or physical-device test.

Never enable development OTP or identity bypass in production. Keep `.env` private; `.env.example` contains placeholders only. The local dependency helper starts only PostGIS and Redis after checking the 20 GiB disk threshold; it never runs `down` or removes volumes. Its `stop` action preserves both volumes.

## Production behavior and current limits

Production builds use the API-backed OTP sign-in, server offer search, transactional booking, and booking-history screen. The development build still includes the legacy demo UI. Production OTP requires a configured Twilio account and approved sender; without SMS configuration the login endpoint returns an unavailable error. Production offer creation requires a private or contracted OSRM-compatible endpoint configured through `ROUTING_ENGINE_URL`.

The production PWA now includes server-backed driver/garage, demand negotiation, booking chat, and foreground GPS/passive matching flows. These depend on real SMS, private object storage, geocoding, and routing providers, which are not configured. Authenticated WebSocket events work across local API instances; Web Push, external partner inventory, online payments, staging, and public deployment remain unavailable. See [`docs/PRODUCTION_CHECKLIST.md`](docs/PRODUCTION_CHECKLIST.md) for release gates and [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for local setup.

An iOS Capacitor target now packages the same API-backed production UI. See [`docs/IOS.md`](docs/IOS.md) for simulator setup and native release limitations; App Store signing and physical-device validation have not been completed.

## GitHub repositories

The API, PWA website and native iOS wrapper are also published separately: [Server](https://github.com/dima1203oleg/MarshGO-Server), [Site](https://github.com/dima1203oleg/MarshGO-Site), and [iOS](https://github.com/dima1203oleg/MarshGO-iOS). The original repository remains the umbrella source and end-to-end test suite. See [`docs/REPOSITORIES.md`](docs/REPOSITORIES.md) for package boundaries and release notes.

## Cross-repository audit

The current migration baseline, module inventory, feature comparison, readiness scores, test evidence, release blockers and archive status are indexed in [`docs/audit/INDEX.md`](docs/audit/INDEX.md). This working branch remains the documentation owner during migration; it is not yet safe to archive.
