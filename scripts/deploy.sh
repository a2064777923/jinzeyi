#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/www/wwwroot/jinzeyi"
APP_NAME="jinzeyi"
LOG_FILE="/www/wwwlogs/jinzeyi-deploy.log"
LOCK_FILE="/tmp/jinzeyi-deploy.lock"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# Prevent concurrent deploys
if [ -f "$LOCK_FILE" ]; then
  log "ERROR: Deploy already running (lock: $LOCK_FILE)"
  exit 1
fi
trap 'rm -f "$LOCK_FILE"' EXIT
touch "$LOCK_FILE"

log "=== Deploy started ==="

cd "$APP_DIR"

# Pull latest code
log "Pulling latest code..."
git fetch origin main
git reset --hard origin/main
COMMIT=$(git log -1 --format="%h %s")
log "Deploying commit: $COMMIT"

# Install dependencies
log "Installing dependencies..."
npm ci --prefer-offline --no-audit --no-fund 2>&1 | tail -1

# Prisma
log "Generating Prisma client..."
npx prisma generate 2>&1 | tail -1

log "Syncing database schema..."
npx prisma db push --skip-generate 2>&1 | tail -1

# Build
log "Building..."
npm run build 2>&1 | tail -3

# Restart PM2
log "Restarting PM2 process..."
pm2 restart "$APP_NAME" --update-env 2>&1 | tail -3

# Verify
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8866/ 2>/dev/null || echo "000")
if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
  log "=== Deploy SUCCESS (HTTP $HTTP_CODE) — $COMMIT ==="
else
  log "=== Deploy WARNING: HTTP $HTTP_CODE — check pm2 logs $APP_NAME ==="
  exit 1
fi
