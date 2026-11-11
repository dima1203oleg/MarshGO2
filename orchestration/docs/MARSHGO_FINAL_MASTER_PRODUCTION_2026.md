# MARSHGO — Final Master Production 2026

## Mission and finish condition

Finish the existing MARSHGO system as one coherent, tested production release candidate. Work in the existing architecture; do not create a replacement app, second business backend, parallel map engine, or demo implementation in place of production functionality. Continue through audit, consolidation, refactor, implementation, integration, optimization, tests, fixes, retests and release-candidate review. Do not stop at a report, plan, single fix or green build. Preserve a durable checkpoint before a session/limit interruption. A checkpoint is not a release.

The final production rollout is a separate owner-controlled action. Never change production traffic or claim `PRODUCTION_READY` while a required gate is open. The final target is the most complete release candidate allowed by available access; enumerate any external blockers precisely.

## Canonical repository boundary (5+1)

Only these six repositories are in scope:

| Repository | Canonical responsibility |
|---|---|
| `dima1203oleg/MarshGO-Server` | API, auth, business rules, journey/routing/booking engines, GPS/realtime, GTFS/GBFS, providers, Redis, PostgreSQL/PostGIS, jobs and audit. |
| `dima1203oleg/MarshGO-Site` | The sole passenger/driver React, TypeScript, Web/PWA UI, map, search, navigation, trips, profile and shared design system. |
| `dima1203oleg/MarshGO-iOS` | Capacitor/Xcode shell and native permissions, GPS, push, deep links and iOS builds; pin an exact Site SHA. |
| `dima1203oleg/MarshGO-Admin` | Admin frontend, using Server roles and APIs for operators, providers, moderation, integration health and audit. |
| `dima1203oleg/MarshGO-Partner` | Partner frontend, using Server organization/membership/role checks for carrier operations. |
| `dima1203oleg/MarshGO` | Release orchestration, exact-SHA manifest, CI, images, staging/production configuration, integration tests and rollback. |

Do not inspect or modify other repositories or bring their code into this release. Root-embedded copies of application code are not an independent canonical backend or UI.

## Audit and progress artifacts

Use factual code, Git ancestry, PR state and exact check results; README and old reports are leads, not proof. Inventory all six repositories, main and active branches, open/merged/closed PRs, stacked dependencies, unmerged implementations, API contracts, migrations, CI/CD, Docker, E2E, deployment and production configuration. Classify every capability `IMPLEMENTED`, `TESTED`, `PARTIAL`, `DEMO_ONLY`, `BLOCKED_EXTERNAL`, `MISSING` or `PRODUCTION_READY`.

Maintain `REPOSITORY_INVENTORY.md`, `PR_DEPENDENCY_DAG.md`, `ARCHITECTURE_AUDIT.md`, `IMPLEMENTATION_MATRIX.md`, `PRODUCTION_GAP_ANALYSIS.md`, `CODEX_PROGRESS.md`, `NEXT_ACTIONS.md`, `docs/PRODUCTION_EXECUTION_STATE.md`, `docs/PRODUCTION_ACCEPTANCE_MATRIX.md` and `docs/EXTERNAL_BLOCKERS.md`. Each checkpoint records repository, branch, SHA, exact results, remaining issue and the next concrete action. On resume, read those plus the current `git status` and diffs; do not rerun completed audit steps without evidence they are stale.

## Safe Git and data handling

Preserve pre-existing uncommitted work. Before a risky operation, make a recoverable checkpoint. No `reset --hard`, destructive `clean`, force push, history rewrite, repository/branch deletion, or blind merge. Do not merge every candidate branch merely because checks are green; inspect ancestry and conflicts and preserve unique implementation. Migrations must be reconciled against actual applied schema, clean install and upgrade path; never renumber an applied migration arbitrarily. No database, volume, account, production data or container cleanup without explicit authorization.

Reconcile a compatible set of exact SHAs across the six repositories, API contract and database migration. Keep rejected prototypes isolated and retain their evidence; do not silently wire in experiments that fail correctness or real-feed replay.

## Product and UI requirements

One five-item bottom navigation: **Головна / Пошук / + / Поїздки / Профіль**. Messages and alerts stay at the top. Home has a single dynamic hero (carpool promo without active ticket; MarshPass for active tickets, with multiple tickets browsable), no duplicate search form, and four actions: Navigation, Transport Map, Publish Ride, Find Route.

Search supports origin/destination autocomplete, current location, map selection, swap/clear, date/time, passenger count, mode/provider choices, transfer, price and walking limits. The transport grid is exactly 4×3: carpool, minibus, bus, taxi; tram, trolleybus, metro, train; bicycle, scooter, carsharing, transfer. “All” selects categories, “Walk” is a planner preference, and Lviv metro and unsupported providers are honestly unavailable.

Route results sort OPTIMAL/BALANCED, FASTEST and CHEAPEST. Do not claim CHEAPEST where fare comparability is missing. Cards show total duration/cost, ordered modes, segment duration/fare or explicit unknown state, transfers, availability and reliability. Planned itinerary is not a booking.

Implement the six referenced map/navigation states in light/dark themes: full route details, full results list, half-expanded map/sheet, compact map, selected live bus, confirmed live carpool pickup. Keep the common bottom sheet and `CanonicalRouteLip` consistent; only route summary belongs in the lip, while route numbers and stop detail belong in expanded detail. Check map/overlay padding at all sheet heights, route focus, overview restore, segment selection and keyboard/safe-area behavior. Use the existing MapLibre engine; no visible plus/minus zoom buttons.

Canonical map/navigation states are DISCOVER, PREVIEW and ACTIVE; sheet states COMPACT, HALF and EXPANDED. Respect manual map movement until recenter is requested. Separate style choice (Scheme/Satellite), 3D and Layers. User-provided reference images are acceptance targets; generated screenshots alone are not visual acceptance.

Complete passenger, driver, reverse-marketplace, booking, MarshPass, trip lifecycle, cancellation, chat, notifications, profile, Admin and Partner journeys. Do not use fake payment, GPS, order, identity verification or wallet behavior. Server must enforce role, ownership, tenant, price, availability and idempotency. Private rideshare retains 0% platform commission as approved; do not invent money movement.

## Routing, map data and providers

Close the loop from source → normalized data → feasible planner → journey result → map → booking only where a provider supports it → lifecycle/replanning/monitoring. Correctly handle GTFS calendars/exceptions, time zones, service times past 24:00, direction, stops, shapes, pathways/transfers, realtime delay/cancellation, walking paths, boarding buffers, availability and operator rules. Never draw a straight line as a verified walking route, equate unknown fare to zero, deduplicate distinct sales offers incorrectly, or offer an impossible micro-mobility chain.

Audit provider owner, geographic coverage, license/commercial use, auth/quota, format/freshness/health, supported capabilities, probe evidence and actual product use. Distinguish schedules, live positions, predictions, fares, availability, deep links, booking, cancellation and tracking. GTFS static is not live GPS; OSM is not live availability; GBFS does not guarantee unauthenticated availability or booking. A URL or adapter is not a working production integration. Prepare adapters/tests when external access is missing; record exact credentials, contract and endpoint as `BLOCKED_EXTERNAL` without exposing secret values.

## Cache, performance, security and reliability

Audit existing Radius/Smart Cache semantics before changing them. Separate static timetable, realtime, rental inventory, routing, route results, quotes and personal data. Use canonical/versioned keys, bounded L1/L2, correct spatial neighbors/radius/timezone/preferences, TTL/invalidation, single-flight/stampede control, Redis-outage degradation and per-user isolation. Booking/fare/seats/idempotency always require server verification; auth and rate limiting must not fail open with cache.

Optimize SQL/PostGIS, indexes, pools, background work, bundles, images, lazy loading, subscriptions and viewport map layers/clustering. Measure cold/warm p50/p95/p99, errors, memory/CPU, cache hits/evictions, queries and provider calls. Treat 1,000 HTTP RPS, 1,000 WebSockets and 1,000 users as separate targets. Load test only an authorized isolated environment, never public feeds.

Check OTP/session refresh/revocation, cookies, CORS/CSRF, tenant/booking/chat access, GPS privacy, uploads, audit, account export/deletion and admin self-grant. Secrets remain server-side and are never logged. Preserve SSRF protection. Test concurrent last-seat booking, idempotency, double cancel, two-account lifecycle, partner isolation, PWA update/offline/deep link/reconnect, migrations and recovery.

## Web/PWA, iOS and release operations

Reproduce the Safari white-screen issue. Inspect stale service worker/cache and chunks, base paths, import failures, MIME/CSP/CORS/cookies/storage/assets, reload/offline/reconnect/background resume. Add recoverable error handling without infinite reload or losing entered data/active trip. WebKit automation is distinct from physical Safari/iPhone acceptance.

Finish and test the shared Web/PWA first; then pin exact Site SHA in iOS, sync Capacitor, check API origin, permissions, safe area, deep links and navigation restore. Simulator success is not physical device, signing, APNs, TestFlight or App Store success.

Identify real deployment host, domain/API origin, deployed SHA, HTTPS, secrets, monitoring, alerts, backup/restore, migrations and rollback. Localhost, `dist` and green CI are not production. Release sequence: exact candidate → required checks → owner-controlled staging → browser/visual/provider acceptance → backups/restore/rollback → production artifact → separately approved rollout → HTTPS smoke → exact manifest reconciliation. Record six SHAs, image digests, API contract, migration, tests and declared coverage. Never change `NOT_RELEASED` without evidence.

## Verification and completion gates

Run relevant lint, typecheck, unit, component, API-contract, migration, PostGIS/Redis, routing/feed/GPS/booking/WebSocket, Playwright, visual, accessibility, security, recovery and iOS checks. Full suites run at integration checkpoints and release review. A skipped check is not PASS. Separate fixture tests, live probes, staging E2E, production smoke and physical-device tests. Review all production screens and reference states; fix verified visual defects.

Release gates G0–G10 require six-repository exact-SHA consistency, integrated P0, compatible contracts/migrations, verified provider claims, web and iOS acceptance, security/performance, working staging, backup/restore/rollback, and manifest/image evidence. G11 is owner approval for production rollout. Until all required gates pass, `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

Final report gives completed work, screens, real provider capabilities/coverage, test evidence, SHAs/PRs, preview/deployment URL if actually available, blockers and runbooks. No arbitrary readiness percentages. External blockers do not stop unrelated engineering work, but they must not be represented as solved.
