# 209 — Site 25-case final E2E rerun (2026-10-26)

## Scope and inputs

- Production Web/PWA entrypoint built from dirty `MarshGO-Site` branch `codex/sync-journey-mobility-ui`, base HEAD `ae2c8aaf140305c4a1124c0b9a232f21b09eed0e`.
- E2E API: immutable `MarshGO-Server` SHA `a403a51a203d9d89685c10c69658c8fd95b70e9b`; PostgreSQL, Redis, map, geocoder, and OSRM ran as isolated local test services/fixtures.
- The umbrella E2E tests and Site tree are dirty. This is working-tree evidence, not a reproducible release commit.
- Runtime: bundled Node.js v24.22.1.

## Results

- Full `npx playwright test`: **25 passed, 0 failed**, 6m36s.
- Button audit: **179 controls clicked, 0 without visible effect**.
- Covered production web flows include responsive entry/search, home/trips/publication actions, date/time, endpoint swap, route result/detail/map focus, 12 transport modes, search restore, booking/chat between separate accounts, multi-passenger driver GPS reroute, iPhone 15/16 Pro Max viewport, and consented rendezvous.
- Site `npm run typecheck`: PASS; `npm run lint`: PASS; `npm test`: **99 passed, 0 failed, 0 skipped**; production build with loopback map manifest: PASS.
- Traces showed the initial selector failures were stale test labels. Updated selectors match the current UI's actual accessible labels; product behavior/assertions were not weakened.

## Limits

- Repository route-map visual snapshots pass in the tested light/dark/sheet states, but the ten user-attached mockups were not individually pixel-compared against licensed real map assets.
- This does not verify live provider coverage, deployed staging/production, authenticated Admin/Partner tenant workflows, an exact iOS SHA/physical device, security/load/recovery, backup/restore, or rollback.
- Current Site changes and root E2E changes remain uncommitted. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. No deployment or release-manifest promotion occurred.

## Next actions

1. Review and split the dirty Site and E2E diffs while preserving unrelated work.
2. Create an immutable reviewed candidate and rerun the complete suite against exact Site/Server SHAs.
3. Continue external provider, Admin/Partner, iOS, staging, security, performance, backup/restore, and rollback gates.
