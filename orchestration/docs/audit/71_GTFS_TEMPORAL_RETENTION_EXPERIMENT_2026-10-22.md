# GTFS temporal-retention experiment — 2026-10-22

## Scope

Tested an isolated, uncommitted prototype against Server PR #28 (`d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`) in worktree `/Users/dima1203/Desktop/MarshGO-Server-query-temporal-priority-20261022`, branch `codex/gtfs-query-temporal-priority-20261022`. The experiment changes only bounded whole-trip retention: after preserving direct endpoint tiers, transfer-only trip groups with less total slack around a feasible access/egress connection are retained first. The normal transfer validator remains authoritative.

## Evidence

- Focused GTFS timetable and retention tests: **69 passed, 0 failed**.
- Full Server suite rerun on Node `24.21.0`: **297 passed, 0 failed, 3 opt-in integration tests skipped**; lint/typecheck PASS under that runtime.
- `npm run lint`: PASS. `npm run typecheck`: PASS. `git diff --check`: PASS.
- Opt-in Journey/PostGIS integration against loopback test DB `marshgo_e2e_pr28_20261022`: **2 passed, 0 failed**; transaction-owned rows were rolled back.
- Frozen input: Lviv static GTFS ZIP SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Repeated the same A/B using the required Node `24.21.0` runtime, in separate baseline and prototype processes, over five city corridors for 2026-10-23 08:00–08:30 Europe/Kyiv; 3-hour horizon; up to four transfers; 900 m access, 1,000 m egress, 400 m transfer walk; 100 results; bus, tram and trolleybus.

| Corridor | Baseline route/trip chains | Prototype route/trip chains | FASTEST/CHEAPEST/BALANCED winners | Search flags |
|---|---:|---:|---|---|
| Railway station → Sykhiv | 28 / 49 | 27 / 49 | same in all 3 | graph + results + search truncated |
| Centre → Dubliany | 39 / 64 | 39 / 64 | same in all 3 | graph + results + search truncated |
| Centre → south terminal | 42 / 52 | 42 / 52 | same in all 3 | graph + results + search truncated |
| Nauka → Sykhiv | 39 / 53 | 39 / 53 | same in all 3 | graph + results + search truncated |
| Centre → Pidzamche | 40 / 58 | 40 / 58 | same in all 3 | graph + results + search truncated |

All returned Lviv public-transit prices in these five candidate sets resolved to the registry's **23 UAH adult LeoCard/app fare estimate**. This is a published tariff assumption, not a generic invented price or a confirmed fare for every passenger: cash and bank-card prices differ, and the current search request does not ask which fare medium the passenger uses. Because candidate totals therefore share the same assumed per-ride tariff, the CHEAPEST winner comparison does not establish the genuinely cheapest operator-priced route for that passenger.

## Decision

**Do not merge or promote this prototype yet.** The five-corridor replay preserved every strategy winner and route-chain count on four corridors; it lost one route chain on the fifth. This is limited non-regression evidence, not a demonstrated quality improvement. All searches remain truncated and the assumed LeoCard/app tariff does not establish each passenger's actual cheapest payment option. Preserve the isolated diff for further fare-aware/candidate-completeness analysis; do not treat it as a production fix or claim complete search.

The verified Server PR #28 + Site PR #15 browser E2E remains **16/16 PASS on local deterministic fixtures**, but that does not clear live-provider, staging, deployment, physical-iPhone, or production acceptance. No container, database, volume, or user data was cleaned or removed in this experiment.
