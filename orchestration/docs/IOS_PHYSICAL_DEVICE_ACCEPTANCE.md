# Current iOS/device checkpoint — 2026-11-06 23:50 EET

**Status: PAIRED; BUILD NOT RUN.** Xcode 27.0 (`27A266a`) and `xcrun devicectl list devices` show the physical iPhone 15 Pro Max as `available (paired)` over the local network. The existing installed `ua.marshgo.app` may be replaced per owner authorization; no install has been attempted.

- Prepared isolated candidate `/private/tmp/marshgo-ios-currentpin-20261106`: iOS `ad27b6f70b6255d1dd323bafcffafe4558232224`, with `web/` pinned to current Site main `d12789e47be608a1ca3abac17aa6d4c348206226`. Worktree is clean. The earlier candidate and its ignored Site checkout at `6e62b9f213640682a6953c3131e789c27593fe73` remain untouched.
- Dependencies are not installed. `xcodebuild -list` on the earlier candidate failed during Capacitor package graph resolution because `node_modules/@capacitor/status-bar` is absent; no install/build was attempted. No `DEVELOPMENT_TEAM` pin is committed in the Xcode project; signing availability remains unverified.
- Approved staging API still returned HTTP 502 for `/readyz` and `/api/v1/journeys/me` at 23:35 EET. No real API journey can currently pass on-device.
- Resource sample at 23:51 EET: 22 GiB free disk, 29% free memory, 12.99 GiB swap used. Defer npm/Xcode builds until the resource gate is met. No phone data or app installation was changed.

# iOS physical-device acceptance

**Status: BLOCKED (checked 2026-11-06 13:44 EET).** `xcrun devicectl list devices` reports the paired physical iPhone 15 Pro Max running iOS 27.0 as `available` over the local network after the owner reconnected it. A read-only device query found an existing `MARSHGO` installation (`ua.marshgo.app`, version 1.0, build 1). No build/install/launch was attempted. The resource gate is red (latest sample 2026-11-06 13:54 EET: 14 GiB disk free, 28% memory free, ~12.2 GiB swap in use; required 20 GiB and 35%). A 500 GB ExFAT reserve disk is mounted with 301 GB free; a documentation/evidence checkpoint is verified there, but no build artifacts have been moved, no approved HTTPS staging API origin is recorded, and owner confirmation is pending before updating the existing app. The phone must not be built against localhost or an unverified endpoint.

The current iOS GitHub repository has no `MARSHGO_API_BASE_URL` Actions variable, and no approved HTTPS staging API origin is recorded in the local acceptance documents. The owner has been asked to provide an approved HTTPS staging origin and confirm whether the existing installation may be updated. Resources are also below the documented local build threshold. No current build, install, or launch was attempted.

The simulator evidence below is historical and uses older pins; it does not verify the current iOS/Site/Server main tuple.

## Verified

- Capacitor sync completed from exact local iOS `cb32564`, Site `e47538b`, and Server `363532c` revisions; the embedded release manifest was checked against all three.
- Unsigned iOS Simulator compilation succeeded; the app installed and launched on the iPhone 16 Pro Max Simulator and rendered the MARSHGO welcome/onboarding screen. Screenshot: `/tmp/marshgo-ios-site-e475.png`.
- Unsigned iOS Release device archive compilation succeeded with those pinned local sources.
- The Simulator build uses `http://127.0.0.1:3002` as its API origin and does not represent a staging/production app.

## Not verified

Physical install/launch, OTP, force-quit session restore, real GPS, background/screen-lock navigation, rerouting, APNs, Universal Links, QR camera, upload, rendezvous, two-device passenger/driver flow, signed archive, provisioning and TestFlight.

Do not treat Simulator evidence as physical-device acceptance.
# Physical iPhone recheck — 2026-11-08 03:03 UTC

- `xcrun devicectl list devices` reports the physical iPhone 15 Pro Max as connected; simulator devices are shown separately. No install or launch has occurred in this checkpoint.
- Exact refs: iOS main `20f5fab6d33709844a0bbd97011bebf68542f549`; Site main `8ef18e89c22c8d84e5aa5c4c24de6a115ff751b4`. `scripts/checkout-site.mjs` supports `SITE_REF`; do not use its floating `main` default for a release build.
- Build/install deferred because `/` has 17 GiB free and memory free is 34%, below the local Xcode heavy-build gate. In addition, the user-approved HTTPS host is a development tunnel, not verified staging, and its geocoder currently returns 503. Do not ship a device build claiming route acceptance against that API.
- Owner authorization to replace the existing app remains available. Still required: pinned exact Site bundle, approved healthy staging API, signing, device build/install/launch, and physical route/map/GPS smoke. Current state is CONNECTED / NOT_BUILT / NOT_INSTALLED / NOT_LAUNCHED.


# Physical iPhone recheck — 2026-11-08 07:50 UTC

- `xcrun devicectl device info details` confirms the physical iPhone 15 Pro Max is connected over `localNetwork`, paired, booted, and has Developer Mode enabled. Software reports iOS 27.0. The device is ready for a signed development build. No install or launch occurred in this checkpoint.
- `xcrun devicectl device info apps --bundle-id ua.marshgo.app` confirms MARSHGO v1.0 (build 1) is already installed. The owner previously authorized replacement; no existing app data was changed.
- `security find-identity -v -p codesigning` reports one valid signing identity. Automatic signing is configured in the project; a matching team/provisioning profile has not yet been validated by a physical build.
- iOS PR #21 merged as `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff`, pinning Site `484980e1b50e0029973f8180a3bac377e7268f34` and Server `408d54b5531191885069e057b405cc50444eb268`. Exact-head simulator CI runs `42460162197` and `42460189051` passed; post-merge run `42460385464` was still running.
- Resource gate: 21 GiB free disk, 33% free RAM, 9,080.81 MiB swap; local Xcode build deferred. Physical status remains CONNECTED / PAIRED / NOT_BUILT / NOT_INSTALLED_FROM_CURRENT_CANDIDATE / NOT_LAUNCHED. The current app install is an older build and does not verify the new pin.


## CI follow-up — 2026-11-08 07:53 UTC

- PR-head iOS Simulator Build runs `42460162197` and `42460189051` passed; post-merge main run `42460385464` passed on iOS SHA `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff`, exact Site pin `484980e1b50e0029973f8180a3bac377e7268f34`, Server metadata pin `408d54b5531191885069e057b405cc50444eb268`.
- Device remains paired/ready, but current candidate is still NOT_BUILT / NOT_INSTALLED / NOT_LAUNCHED. Simulator CI is not physical acceptance. Local Xcode deferred at 30% free RAM and 21 GiB free disk.


## Physical iPhone recheck — 2026-11-08 07:59 UTC

- `xcrun devicectl list devices` reports the physical iPhone 15 Pro Max connected. Existing app replacement remains authorized, but no build, install, replacement, launch, GPS, map, or route interaction was performed in this checkpoint.
- GitHub confirms iOS PR #21 is merged at `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff`; its candidate pins Site `484980e1b50e0029973f8180a3bac377e7268f34` and Server `408d54b5531191885069e057b405cc50444eb268`.
- Xcode 27.0 and one Apple Development signing identity are available. Provisioning still needs validation by a physical build.
- Resource gate at 07:59:43 UTC: disk 25 GiB free, memory 29% free, swap 9,260.88 MiB. Build deferred because RAM is below 35%.
- The approved zrok endpoint is development-only. `/readyz` returned 200; prior geocoder/autocomplete returned 503. A future device run is limited to UI smoke unless the API is made healthy; it is not staging acceptance.
- Current device state: CONNECTED / NOT_BUILT / NOT_INSTALLED_FROM_CURRENT_CANDIDATE / NOT_LAUNCHED.


## RESUME BLOCK — 2026-11-08 08:06 UTC — exact pinned device worktrees prepared; memory gate still red

1. Safely refreshed iOS `origin/main` to `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff` and Site `origin/main` to `484980e1b50e0029973f8180a3bac377e7268f34`. Primary dirty checkouts were left on their existing branches and untouched.
2. Prepared clean isolated detached worktrees: iOS `/private/tmp/marshgo-ios-device-rc-20261108` at `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff`, nested canonical Site worktree at `484980e1b50e0029973f8180a3bac377e7268f34`. These are exact source candidates, not built artifacts.
3. Device remains connected. System Node is v25.4.0 while iOS declares Node 24.21.0; no standard local Node 24 installation was found. No matching `.mobileprovision` profile exists in the standard provisioning directory; automatic signing still needs a physical-build check.
4. Resource check 08:06:53 UTC: disk 26 GiB free, RAM free 28%, swap 9,024.19 MiB. RAM is under the 35% build gate. No npm install, Xcode build, E2E or other heavy job started; no services/cache/data were removed.
5. Current Server main includes a Photon adapter, but the active development API runtime is the dirty Server checkout and is configured to public Nominatim, yielding autocomplete 503. No endpoint/config was changed. Public Photon remains sample-only; staging/production needs an approved managed or self-hosted provider.
6. Next: wait for RAM ≥35% and disk ≥20 GiB; provide Node 24.21.0 in an isolated way, build the exact pinned Site bundle with the authorized development origin, sync Capacitor, attempt signed Debug build for the connected iPhone, and record actual installation/launch separately. Production stays `NOT_RELEASED`.


## Checkpoint — 2026-11-08 08:24 UTC — iOS Site pin merged; post-merge CI and physical build pending

1. iOS PR #22 merged normally at `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f` from head `33be8c19e27d9739603111d7bea8c4cb774369e8`, base `9fd5a0f10ca494f674fb54abf995bfc3845ad4ff`. Exact-head Simulator Build runs `42462472738` and `42462489767` passed; post-merge main run `42462745572` is in progress. iOS main now pins Site `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7` and Server build metadata `408d54b5531191885069e057b405cc50444eb268`.
2. Clean isolated candidate worktrees prepared: iOS `/private/tmp/marshgo-ios-device-rc-20261108-current` at `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f`, nested Site at `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7`. No dependencies/build artifacts created yet.
3. Physical iPhone 15 Pro Max is connected. Xcode 27.0 and a valid Apple Development identity are present; no matching provisioning profile in the standard directory. Official Node v24.21.0 arm64 runtime was downloaded to `/private/tmp/marshgo-node-v24.21.0` and its SHA-256 verified against the official Node `SHASUMS256.txt`. No signing/build/install/launch attempt.
4. Resource sample at 08:24:36 UTC: disk 33 GiB free, memory free 32%, swap 9,109.75 MiB. The 35% memory gate is red; no local npm install/Xcode/browser/E2E started. Preserve Docker and active services.
5. Current six main refs are recorded in `RELEASE_MANIFEST.json` under `observed_main_tuple_2026_11_08_0824_after_ios22_merge`; compatibility remains `NOT_VERIFIED_POSTMERGE_IOS_CI_PENDING`, `production_ready=false`, `deployed=false`.
6. P0 release blockers remain: current API is a dirty development server, autocomplete 503 due public Nominatim, no exact-SHA integrated journey E2E, no staging, no restore/rollback rehearsal, and no physical build. Next: poll iOS post-merge CI run `42462745572`; once memory ≥35%, install pinned Site/iOS dependencies with Node 24.21.0, build/sign Debug and attempt install/launch on the connected phone. Keep production `NOT_RELEASED`.

## Checkpoint — 2026-11-08 08:27 UTC — iOS post-merge CI passed; local build deferred

- iOS PR #22 is merged at `309cf66f9bd718d5ee9f794d2ee72f8b70a2536f`. Exact-head simulator checks `42462472738` and `42462489767`, plus post-merge main CI `42462745572`, passed; the post-merge run tested that exact iOS SHA. Site remains `9cbe8f665a9e5a4cd44c55c142e8e0668d2b3cd7`; Server metadata pin remains `408d54b5531191885069e057b405cc50444eb268`.
- Resource sample: `/` has 33 GiB free; memory free 29%; swap used 9,079 MiB; Docker build process active, `xcodebuild` absent. No heavy local task started or process stopped. Defer npm install/Xcode/browser/E2E until memory is at least 35% and competing heavy work is idle.
- Device remains paired, but no local physical-device build, install, or launch has been attempted. Provisioning profile availability remains unverified.
- Security: a provider API credential was inadvertently included in process-diagnostic output. Its value is not recorded here; treat it as exposed and rotate it at the provider.
- Release status remains `NOT_RELEASED`: root/Admin/Partner exact-main CI, exact six-SHA integration, route E2E, staging, backup/restore, rollback, and physical-device acceptance are not established.
