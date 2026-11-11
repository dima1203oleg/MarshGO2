#!/usr/bin/env bash
set -u

# Read-only local stack diagnostics. Never prints environment variables or credentials.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
server_dir="${MARSHGO_SERVER_DIR:-$ROOT_DIR/MarshGO-Server}"
site_base="${MARSHGO_SITE_URL:-http://127.0.0.1:7777}"
canonical_site_base="${MARSHGO_CANONICAL_SITE_URL:-http://127.0.0.1:7777}"
api_base="http://127.0.0.1:3002"
failed=0

# Resource-control policy: do not start Docker/build workloads below green disk/RAM headroom.
disk_free_kib="$(df -Pk "$ROOT_DIR" | awk 'NR == 2 { print $4 }')"
if [[ "$disk_free_kib" =~ ^[0-9]+$ ]]; then
  disk_free_gib=$((disk_free_kib / 1024 / 1024))
  if (( disk_free_kib >= 20 * 1024 * 1024 )); then
    printf 'RESOURCE_DISK       GREEN  %s GiB free\n' "$disk_free_gib"
  elif (( disk_free_kib >= 8 * 1024 * 1024 )); then
    printf 'RESOURCE_DISK       YELLOW %s GiB free; defer heavy local starts\n' "$disk_free_gib"
  else
    printf 'RESOURCE_DISK       RED    %s GiB free; defer heavy local starts\n' "$disk_free_gib"
  fi
else
  printf 'RESOURCE_DISK       UNKNOWN could not read free space\n'
fi
memory_free_percent="$(memory_pressure 2>/dev/null | awk -F': ' '/System-wide memory free percentage/ { gsub("%", "", $2); print $2; exit }')"
if [[ "$memory_free_percent" =~ ^[0-9]+$ ]]; then
  if (( memory_free_percent >= 35 )); then
    printf 'RESOURCE_MEMORY     GREEN  %s%% free\n' "$memory_free_percent"
  elif (( memory_free_percent >= 20 )); then
    printf 'RESOURCE_MEMORY     YELLOW %s%% free; defer heavy local starts (minimum 35%%)\n' "$memory_free_percent"
  else
    printf 'RESOURCE_MEMORY     RED    %s%% free; defer heavy local starts (minimum 35%%)\n' "$memory_free_percent"
  fi
else
  printf 'RESOURCE_MEMORY     UNKNOWN could not read memory pressure\n'
fi
swap_state="$(sysctl vm.swapusage 2>/dev/null | sed 's/^vm.swapusage: //')"
printf 'RESOURCE_SWAP       %s\n' "${swap_state:-UNKNOWN}"
cpu_load="$(uptime | sed -E 's/.*load averages?: //')"
cpu_count="$(sysctl -n hw.logicalcpu 2>/dev/null || true)"
printf 'RESOURCE_CPU        load=%s logical_cpus=%s\n' "${cpu_load:-UNKNOWN}" "${cpu_count:-UNKNOWN}"

http_check() {
  local label="$1" url="$2" status
  status="$(curl -sS -o /dev/null --max-time 3 -w '%{http_code}' "$url" 2>/dev/null || true)"
  if [[ "$status" == 2* ]]; then
    printf 'PASS %-18s HTTP %s %s\n' "$label" "$status" "$url"
  elif [[ "$status" =~ ^[0-9]{3}$ && "$status" != 000 ]]; then
    printf 'FAIL %-18s HTTP %s %s\n' "$label" "$status" "$url"
    failed=1
  else
    printf 'DOWN %-18s %s\n' "$label" "$url"
    failed=1
  fi
}

tcp_check() {
  local label="$1" port="$2"
  if nc -z -w 1 127.0.0.1 "$port" >/dev/null 2>&1; then
    printf 'PASS %-18s TCP 127.0.0.1:%s\n' "$label" "$port"
  else
    printf 'DOWN %-18s TCP 127.0.0.1:%s\n' "$label" "$port"
    failed=1
  fi
}

http_check site_preview "$site_base/"
canonical_site_status="$(curl -sS -o /dev/null --max-time 3 -w '%{http_code}' "$canonical_site_base/" 2>/dev/null || true)"
if [[ "$canonical_site_status" == 2* ]]; then
  printf 'INFO %-19s HTTP %s %s\n' canonical_site "$canonical_site_status" "$canonical_site_base"
else
  printf 'INFO %-19s not running; current preview remains the tested local UI\n' canonical_site
fi
http_check api_health "$api_base/healthz"
http_check api_ready "$api_base/readyz"
version_body="$(curl -sS --max-time 3 "$api_base/api/v1/version" 2>/dev/null || true)"
version_status="$(curl -sS -o /dev/null --max-time 3 -w '%{http_code}' "$api_base/api/v1/version" 2>/dev/null || true)"
api_identity=""
if command -v node >/dev/null 2>&1 && [[ -n "$version_body" ]]; then
  api_identity="$(printf '%s' "$version_body" | node -e '
let body = "";
process.stdin.on("data", (chunk) => { body += chunk; });
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(body).data ?? {};
    process.stdout.write([data.commitSha ?? "", data.sourceState ?? "", data.buildId ?? ""].join("\t"));
  } catch { process.exitCode = 1; }
});
' 2>/dev/null || true)"
fi
IFS=$'\t' read -r actual_api_sha actual_api_source_state actual_api_build_id <<< "$api_identity"
expected_api_sha="$(git -C "$server_dir" rev-parse --verify HEAD 2>/dev/null || true)"
expected_api_source_state="unknown"
if [[ "$expected_api_sha" =~ ^[a-f0-9]{40}$ ]]; then
  if [[ -z "$(git -C "$server_dir" status --porcelain --untracked-files=normal 2>/dev/null)" ]]; then
    expected_api_source_state="clean"
  else
    expected_api_source_state="dirty"
  fi
fi
if [[ "$version_status" == 2* && "$actual_api_sha" =~ ^[a-f0-9]{40}$ && "$expected_api_sha" =~ ^[a-f0-9]{40}$ ]]; then
  if [[ "$actual_api_sha" == "$expected_api_sha" && "$actual_api_source_state" == "$expected_api_source_state" ]]; then
    printf 'PASS %-18s sha=%s sourceState=%s buildId=%s\n' api_build_identity "$actual_api_sha" "$actual_api_source_state" "$actual_api_build_id"
  else
    printf 'FAIL %-18s expected=%s/%s actual=%s/%s buildId=%s\n' api_build_identity "$expected_api_sha" "$expected_api_source_state" "$actual_api_sha" "$actual_api_source_state" "$actual_api_build_id"
    failed=1
  fi
else
  printf 'FAIL %-18s HTTP %s; expected and running API identities could not be compared\n' api_build_identity "${version_status:-000}"
  failed=1
fi

if command -v pg_isready >/dev/null 2>&1; then
  if pg_isready -h 127.0.0.1 -p 5434 -d marshgo >/dev/null 2>&1; then
    printf 'PASS %-18s PostgreSQL accepts connections; PostGIS requires API readiness\n' database
  else
    printf 'DOWN %-18s TCP 127.0.0.1:5434\n' database
    failed=1
  fi
else
  tcp_check database 5434
fi
tcp_check redis 6380
tcp_check redis_cache 6381

printf 'INFO %-19s email/password route; credentials and account state not tested\n' auth
printf 'INFO %-19s OTP/SMS disabled by local launcher; not required for email/password sign-in\n' auth_otp

if docker info --format '{{.ServerVersion}}' >/dev/null 2>&1; then
  printf 'PASS %-18s Docker daemon available\n' docker
else
  printf 'DOWN %-18s Docker daemon unavailable\n' docker
  failed=1
fi

if [[ "$failed" -eq 0 ]]; then
  printf 'LOCAL_STACK_STATUS: SERVICES_RESPONDING (credentials, journey coverage, and release readiness not tested)\n'
else
  printf 'LOCAL_STACK_STATUS: SERVICES_INCOMPLETE (this is not a production-readiness verdict)\n'
fi
exit "$failed"
