#!/usr/bin/env bash
set -euo pipefail

# Local development launcher only. Production must use managed environments and
# must never enable AUTH_DEV_BYPASS.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_DIR="${MARSHGO_SERVER_DIR:-$ROOT_DIR/MarshGO-Server}"
ENV_FILE="${MARSHGO_ENV_FILE:-$ROOT_DIR/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Local env file not found: $ENV_FILE" >&2
  exit 2
fi
if [[ ! -f "$SERVER_DIR/package.json" ]]; then
  echo "Server checkout not found. Set MARSHGO_SERVER_DIR to its local checkout." >&2
  exit 2
fi

server_sha="$(git -C "$SERVER_DIR" rev-parse --verify HEAD 2>/dev/null || true)"
source_state="unknown"
if [[ "$server_sha" =~ ^[a-f0-9]{40}$ ]]; then
  if [[ -z "$(git -C "$SERVER_DIR" status --porcelain --untracked-files=all)" ]]; then
    source_state="clean"
  else
    source_state="dirty"
  fi
  build_time="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  build_id="local-${server_sha:0:12}-${source_state}-$(date -u '+%Y%m%dT%H%M%SZ')"
fi

node --input-type=module - "$ENV_FILE" <<'NODE'
import { config } from 'dotenv';
import process from 'node:process';

const file = process.argv[2];
const { parsed, error } = config({ path: file, quiet: true });
if (error || !parsed) {
  process.stderr.write('Could not read the local development env file.\n');
  process.exit(2);
}

const loopbackHosts = new Set(['127.0.0.1', 'localhost', '::1']);
for (const key of ['DATABASE_URL', 'REDIS_URL']) {
  let endpoint;
  try { endpoint = new URL(parsed[key] ?? ''); } catch {
    process.stderr.write(`${key} is missing or invalid in the local env file.\n`);
    process.exit(2);
  }
  if (!loopbackHosts.has(endpoint.hostname)) {
    process.stderr.write(`${key} must point to loopback for this local launcher.\n`);
    process.exit(2);
  }
}

if (parsed.NODE_ENV === 'production') {
  process.stderr.write('This launcher refuses NODE_ENV=production.\n');
  process.exit(2);
}
const routingUrl = parsed.OSRM_URL || parsed.ROUTING_ENGINE_URL;
const geocodingUrl = parsed.GEOCODING_ENGINE_URL;
for (const [label, value] of [['OSRM_URL/ROUTING_ENGINE_URL', routingUrl], ['GEOCODING_ENGINE_URL', geocodingUrl]]) {
  let endpoint;
  try { endpoint = new URL(value ?? ''); } catch {
    process.stderr.write(`${label} is missing or invalid in the local env file.\n`);
    process.exit(2);
  }
  if (endpoint.protocol !== 'https:' && !loopbackHosts.has(endpoint.hostname)) {
    process.stderr.write(`${label} must use HTTPS unless it is a loopback development service.\n`);
    process.exit(2);
  }
}

const fixturesEnabled = process.env.MG_ENABLE_LOCAL_API_FIXTURES === '1';
console.log(`Local API preflight OK: env targets validated. Launcher will set AUTH_DEV_BYPASS=false, AUTH_DEV_OTP=false, SMS_PROVIDER=disabled, API fixtures ${fixturesEnabled ? 'explicitly enabled' : 'disabled'} and static multimodal estimates disabled. Runtime readiness is not checked.`);
NODE

if [[ "$server_sha" =~ ^[a-f0-9]{40}$ ]]; then
  printf 'Local API source identity: sha=%s sourceState=%s buildId=%s builtAt=%s\n' \
    "$server_sha" "$source_state" "$build_id" "$build_time"
else
  printf 'Local API source identity unavailable: checkout is not a Git worktree.\n'
fi

if [[ "${1:-}" == "--check" ]]; then
  exit 0
fi

local_api_env=( \
  DOTENV_CONFIG_PATH="$ENV_FILE" \
  NODE_ENV=development \
  AUTH_DEV_BYPASS=false \
  AUTH_DEV_OTP=false \
  SMS_PROVIDER=disabled \
  MARSHGO_ALLOW_UNVERIFIED_MULTIMODAL_ESTIMATES=0 \
  API_HOST=127.0.0.1 \
  API_PORT=3002 \
  API_RATE_LIMIT_LIMIT=50000 \
  MARSHGO_API_TEST_FIXTURE_MODE=0 \
  CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://127.0.0.1:7777,capacitor://localhost,https://marshgo-dima.shares.zrok.io,http://127.0.0.1:4301,http://127.0.0.1:4302,http://127.0.0.1:4303 \
)

if [[ "$server_sha" =~ ^[a-f0-9]{40}$ ]]; then
  local_api_env+=( \
    "MARSHGO_BUILD_ID=$build_id" \
    "MARSHGO_BUILD_SHA=$server_sha" \
    "MARSHGO_BUILD_TIME=$build_time" \
    "MARSHGO_SOURCE_STATE=$source_state" \
  )
fi

# Fixtures are opt-in for test work; real provider data remains the default.
if [[ "${MG_ENABLE_LOCAL_API_FIXTURES:-0}" == "1" ]]; then
  local_api_env+=(
    MARSHGO_API_TEST_FIXTURE_MODE=1
    MARSHGO_GTFS_TEST_FIXTURE_DIR="$SERVER_DIR/tests/fixtures/gtfs-http"
  )
fi

exec env "${local_api_env[@]}" npm --prefix "$SERVER_DIR" run api
