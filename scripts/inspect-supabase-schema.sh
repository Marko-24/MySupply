#!/usr/bin/env bash
set -euo pipefail
set -a
source .env
set +a
curl -sS "$EXPO_PUBLIC_SUPABASE_URL/rest/v1/" \
  -H "apikey: $EXPO_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $EXPO_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Accept-Profile: public" \
  > /tmp/mysupply-supabase-openapi.json
node -e 'const fs=require("fs"); const raw=fs.readFileSync("/tmp/mysupply-supabase-openapi.json","utf8"); try { const j=JSON.parse(raw); console.log(JSON.stringify({paths:Object.keys(j.paths||{}), definitions:Object.keys(j.definitions||{})},null,2)); } catch { console.log(raw.slice(0,1000)); }'
