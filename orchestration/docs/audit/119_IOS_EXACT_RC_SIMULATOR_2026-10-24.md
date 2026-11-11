# iOS exact release-candidate simulator check — 2026-10-24

## Exact inputs

- iOS repository: `MarshGO-iOS`, branch `codex/ios-final-rc-20261024`, SHA `53b28ec86ee806e95284eee8ab6c8a12739f6df4`.
- Site repository: `MarshGO-Site`, CI-pinned SHA `10454f37b59a848e4a5b381689dfe7f701fe2b81`.
- Server SHA embedded in the build manifest: `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- Embedded API contract: `v1`; migration version is unset in the iOS build manifest.
- Build config used: unsigned iOS Simulator Debug, `VITE_API_BASE_URL=http://localhost:3002`. The API health probe on `127.0.0.1:3002` failed because no local Server process was listening.
- Final repeat toolchain: Node `24.21.0`, matching the repository engine. Earlier Node `25.4.0` exploratory builds are not used as final toolchain evidence.

## Results

| Check | Result | Evidence / boundary |
|---|---|---|
| Site production bundle | PASS | `npm run build` succeeded from exact Site SHA under Node `24.21.0`; Capacitor manifest recorded exact iOS/Site/Server SHAs. |
| Capacitor sync | PASS | `npx cap sync ios` completed and copied the bundle into the native target. |
| Xcode simulator build | PASS | `scripts/build-ios-simulator.sh` completed with signing disabled. |
| iPhone 15 Pro Max simulator | PASS | Installed/launched `ua.marshgo.app`; final Node 24 screenshot `/tmp/marshgo-rc-node24-iphone15.png` visually reviewed. Welcome screen rendered within device safe areas. |
| iPhone 16 Pro Max simulator | PASS | Installed/launched the same Node 24-built app; screenshot `/tmp/marshgo-rc-node24-iphone16.png` visually reviewed. Welcome screen rendered within device safe areas. |
| Native login/booking/GPS/map interactions | NOT_TESTED | No interactive simulator automation or reachable API was available; `localhost:3002` was not listening. |
| Physical iPhone, background GPS, push, TestFlight/signing | NOT_TESTED | Requires physical device, signing credentials, push configuration and release operations. |

## Correction during the check

An initial bundle used Site parent SHA `5a96e85630428c2ffc15dfe67308334eda9d7398`, which did not match the iOS CI pin. It is not counted as exact-candidate evidence. The web checkout was clean and locally created for this test; it was advanced to the exact pinned Site SHA `10454f37…`, then the bundle, manifest, Capacitor sync and simulator builds were repeated under Node `24.21.0`. Exact-candidate screenshots are the `node24` files above.

## Status

This establishes exact-SHA native packaging and first-screen rendering on two simulators only. It does not establish full iOS acceptance, API reachability, physical-device behavior or release readiness. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.
