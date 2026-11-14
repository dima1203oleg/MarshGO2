#!/usr/bin/env bash
set -euo pipefail

SIMULATOR_UDID="${SIMULATOR_UDID:-}"
if [[ -z "$SIMULATOR_UDID" ]]; then
  echo "Set SIMULATOR_UDID to an available iOS Simulator device." >&2
  exit 2
fi
if [[ ! -f ../site/package.json ]]; then
  echo "Integrated Site source is missing at ../site; build from the MarshGO2 workspace." >&2
  exit 2
fi
if [[ -z "${VITE_API_BASE_URL:-}" ]]; then
  echo "Set VITE_API_BASE_URL to the HTTPS/local MARSHGO Server URL before producing a usable app bundle." >&2
  exit 2
fi
SETTLE_SECONDS="${SIMULATOR_SETTLE_SECONDS:-20}"
if [[ ! "$SETTLE_SECONDS" =~ ^[0-9]+$ ]] || (( SETTLE_SECONDS < 15 || SETTLE_SECONDS > 120 )); then
  echo "SIMULATOR_SETTLE_SECONDS must be an integer from 15 to 120 so the first WebView render can finish." >&2
  exit 2
fi
SCREENSHOT_PATH="${SIMULATOR_SCREENSHOT_PATH:-/tmp/marshgo-ios-simulator.png}"
npm ci --prefix ../site
npm ci
CAPACITOR_BUILD=true VITE_API_BASE_URL="$VITE_API_BASE_URL" npm run build --prefix ../site
MARSHGO_SITE_DIR=../site MARSHGO_SITE_SOURCE_COMMIT="${MARSHGO_SITE_SOURCE_COMMIT:-$(git -C ../site rev-parse HEAD)}" MARSHGO_IOS_SOURCE_COMMIT="${MARSHGO_IOS_SOURCE_COMMIT:-$(git rev-parse HEAD)}" npm run site:build-info
CAPACITOR_WEB_DIR=../site/dist ./node_modules/.bin/cap sync ios
xcrun simctl boot "$SIMULATOR_UDID" 2>/dev/null || true
xcrun simctl bootstatus "$SIMULATOR_UDID" -b
xcodebuild -quiet -project ios/App/App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator \
  -destination "platform=iOS Simulator,id=$SIMULATOR_UDID" -derivedDataPath ios/build CODE_SIGNING_ALLOWED=NO build
xcrun simctl install "$SIMULATOR_UDID" ios/build/Build/Products/Debug-iphonesimulator/App.app
xcrun simctl launch "$SIMULATOR_UDID" ua.marshgo.app
sleep "$SETTLE_SECONDS"
xcrun simctl io "$SIMULATOR_UDID" screenshot "$SCREENSHOT_PATH"
echo "Simulator screenshot saved to $SCREENSHOT_PATH"
