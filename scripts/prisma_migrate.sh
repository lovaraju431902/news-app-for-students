#!/bin/bash
# prisma_migrate.sh - Apply pending database migrations in production container

set -e

# Change directory to the root of the project
cd "$(dirname "$0")/.."

echo "=========================================================="
echo "Applying database migrations inside nextjs container..."
echo "=========================================================="

if [ ! "$(docker ps -q -f name=news_nextjs)" ]; then
  echo "❌ Error: nextjs container 'news_nextjs' is not running."
  echo "Please start the Docker stack first."
  exit 1
fi

docker compose exec -T nextjs npx prisma migrate deploy

echo "=========================================================="
echo "✅ Prisma database migrations applied successfully."
echo "=========================================================="
