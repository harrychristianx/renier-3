#!/bin/bash
set -euo pipefail

WORK_TREE=/home/homelab/renier-real-estate
LOG=/home/homelab/renier-real-estate/deploy.log
LOCK=/tmp/renier-real-estate-deploy.lock

run_deploy() {
  echo "[$(date)] Deploy started"
  cd "$WORK_TREE"
  docker compose -f docker-compose.prod.yml up -d --build
  echo "[$(date)] Deploy finished"
}

{
  if command -v flock >/dev/null 2>&1; then
    flock -n 9 || { echo "[$(date)] Deploy skipped: lock busy"; exit 0; }
    run_deploy
  else
    run_deploy
  fi
} 9>"$LOCK" >> "$LOG" 2>&1
