#!/bin/bash
set -euo pipefail

# Solo in ambienti remoti (Claude Code sul web)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

APP_DIR="$CLAUDE_PROJECT_DIR/app"

# 1. Avvia PostgreSQL se non è già online
if ! pg_lsclusters | grep -q "online"; then
  pg_ctlcluster 16 main start
fi

# 2. Installa dipendenze se mancano
if [ ! -d "$APP_DIR/node_modules/.pnpm" ]; then
  cd "$APP_DIR" && pnpm install
fi

# 3. Avvia dev server se non è già in ascolto sulla porta 3000
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -qE '^[23]'; then
  cd "$APP_DIR" && nohup pnpm dev > /tmp/nextjs.log 2>&1 &
fi
