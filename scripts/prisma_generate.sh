#!/bin/bash
# prisma_generate.sh - Run Prisma Client generation inside the nextjs container

set -e

# Change directory to the root of the project
cd "$(dirname "$0")/.."

echo "=========================================================="
echo "Generating Prisma Client inside nextjs container..."
echo "=========================================================="

if [ ! "$(docker ps -q -f name=news_nextjs)" ]; then
  echo "❌ Error: nextjs container 'news_nextjs' is not running."
  echo "Please start the Docker stack first."
  exit 1
fi

docker compose exec -T nextjs npx prisma generate

echo "=========================================================="
echo "✅ Prisma Client generated successfully inside nextjs container."
echo "=========================================================="
