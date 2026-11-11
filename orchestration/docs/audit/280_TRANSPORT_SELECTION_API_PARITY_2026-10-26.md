# Production transport selection and API parity — 2026-10-26

## Scope and evidence

- Read-only review by Antigravity (Gemini 3.8 Flash Medium), independently checked against the current dirty `MarshGO-Site` source and existing tests.
- Reviewed `src/domain/transportPreferences.ts`, `src/views/ProductionMarketplace.tsx`, `src/services/productionApi.ts`, and `tests/transport-preferences.test.ts`.
- No files, API state, credentials, or database records were changed. This is source/test evidence, not a live authenticated browser or provider probe.

## Verified behavior

- The UI catalog has 12 approved categories, but the production route-search allowlist intentionally contains nine: bus, marshrutka, trolleybus, tram, metro, carpool, train, bike, and scooter. Taxi, carsharing, and transfer are excluded from `supportedJourneySearchTypes` (`src/domain/transportPreferences.ts:14-18`).
- Selection, persistence, and “select all” filter through that allowlist; unsupported categories cannot become active by toggling (`src/domain/transportPreferences.ts:47-79`).
- Supported categories are further restricted to available providers with the required route source (GTFS, MARSHGO carpool, GBFS scooter, or the supported bike estimate) (`src/domain/transportPreferences.ts:95-115`).
- `toJourneyPreferences` builds `allowedTransportTypes` from active supported modes with providers, and the production search passes that object to `productionApi.searchJourneys` (`src/domain/transportPreferences.ts:133-165`, `src/views/ProductionMarketplace.tsx:392-399`). The client calls `POST /journeys/search` (`src/services/productionApi.ts:473-482`). Unsupported taxi/carsharing/transfer flags remain false.
- Existing Site tests explicitly assert 12 display categories versus nine routable categories, unsupported taxi filtering, and correct provider-specific payloads (`tests/transport-preferences.test.ts:23-30, 41-49, 99-120`).
- The Server fare catalog marks taxi, shared mobility/carsharing, and transfer prices as partner-dependent dynamic quotes rather than routable offers (`MarshGO-Server/server/mobility/transportTariffs.ts:167-184`). A schema/provider catalog entry is not a route adapter or a live quote.

## Decision

This is not a client serialization defect. Do not add the three excluded categories to the request allowlist until the Server has a working, truthful route adapter and a provider-backed availability contract for each. Next, verify the user-reported date-picker-to-`departureAt` flow, then continue Server candidate-search work from audit 279. No additional Site test run was needed because this review found no code change and the existing focused tests already cover the observed contract.

## Acceptance boundary

Proved: current source behavior and matching unit-test assertions. Not proved: current city/provider availability in an authenticated browser, actual taxi/carsharing/transfer offers, or deployment behavior.
