#!/bin/bash
# start.sh - Boot up the production Docker stack

set -e

# Change directory to the root of the project (parent of scripts/)
cd "$(dirname "$0")/.."

echo "=========================================================="
echo "Starting NewsRoom Docker Stack..."
echo "=========================================================="

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file is missing."
  echo "Please copy .env.example to .env and configure all variables first."
  exit 1
fi

# Run docker compose using both base and production configuration overrides
echo "🚀 Deploying containers in detached mode..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

echo "🗄️ Synchronizing Prisma Database Schema..."
docker compose exec -T nextjs npx prisma db push --accept-data-loss || true

echo "👥 Seeding Author Profile Images..."
docker compose exec -T nextjs node scripts/seed_authors.js || true

echo "📝 Seeding 30 Starter Blogs & Categories..."
docker compose exec -T nextjs node scripts/seed_data.js || true

echo "=========================================================="
echo "✅ Docker stack started successfully!"
echo "Run './scripts/health_check.sh' to inspect container health."
echo "=========================================================="
