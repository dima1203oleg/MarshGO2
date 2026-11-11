#!/usr/bin/env bash
set -euo pipefail

# Manage only the isolated local PostGIS and Redis services. Never remove volumes.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
ENV_FILE="$ROOT_DIR/.env"
MIN_FREE_KIB=$((20 * 1024 * 1024))
MIN_FREE_MEMORY_PERCENT=35
action="${1:-start}"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  printf 'Compose file not found: %s\n' "$COMPOSE_FILE" >&2
  exit 2
fi

compose() {
  docker compose --project-directory "$ROOT_DIR" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

case "$action" in
  start)
    free_kib="$(df -Pk "$ROOT_DIR" | awk 'NR == 2 { print $4 }')"
    if [[ ! "$free_kib" =~ ^[0-9]+$ ]]; then
      printf 'Could not determine free disk space; refusing to start local containers.\n' >&2
      exit 2
    fi
    if (( free_kib < MIN_FREE_KIB )); then
      free_gib=$((free_kib / 1024 / 1024))
      printf 'Disk headroom is %s GiB; need at least 20 GiB before starting local containers. No changes made.\n' "$free_gib" >&2
      exit 2
    fi
    memory_free_percent="$(memory_pressure 2>/dev/null | awk -F': ' '/System-wide memory free percentage/ { gsub("%", "", $2); print $2; exit }')"
    if [[ ! "$memory_free_percent" =~ ^[0-9]+$ ]]; then
      printf 'Could not determine free memory; refusing to start local containers.\n' >&2
      exit 2
    fi
    if (( memory_free_percent < MIN_FREE_MEMORY_PERCENT )); then
      printf 'Memory headroom is %s%%; need at least 35%% free before starting local containers. No changes made.\n' "$memory_free_percent" >&2
      exit 2
    fi
    if ! docker info >/dev/null 2>&1; then
      printf 'Docker daemon is unavailable; no changes made.\n' >&2
      exit 2
    fi
    if [[ ! -f "$ENV_FILE" ]]; then
      printf 'Local env file not found: %s\n' "$ENV_FILE" >&2
      exit 2
    fi
    compose up --detach --wait --wait-timeout 120 db redis
    ;;
  stop)
    if ! docker info >/dev/null 2>&1; then
      printf 'Docker daemon is unavailable; cannot stop local containers.\n' >&2
      exit 2
    fi
    compose stop db redis
    ;;
  status)
    if ! docker info >/dev/null 2>&1; then
      printf 'Docker daemon is unavailable.\n' >&2
      exit 2
    fi
    compose ps db redis
    ;;
  *)
    printf 'Usage: %s [start|stop|status]\n' "$0" >&2
    exit 2
    ;;
esac
