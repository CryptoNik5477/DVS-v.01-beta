#!/usr/bin/env bash
# Sync the Prisma schema to the database during the Vercel build.
# - If DATABASE_URL is configured, run `prisma db push` to create/update tables.
# - If it is NOT set, skip silently so the site still builds in DB-less mode.
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "→ DATABASE_URL detected: syncing schema with 'prisma db push'…"
  npx prisma db push --skip-generate
else
  echo "→ No DATABASE_URL: skipping db push (running in DB-less mode)."
fi
