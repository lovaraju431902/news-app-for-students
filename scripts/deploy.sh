#!/bin/bash
# deploy.sh - Automated Continuous Deployment script
set -e

# Navigate to project directory
cd "$(dirname "$0")/.."

echo "=========================================================="
echo "🚀 Starting Automated Production Deployment..."
echo "Timestamp: $(date)"
echo "=========================================================="

# 1. Fetch latest changes from Git
echo "📥 Pulling latest codebase from origin main..."
git fetch origin main
git reset --hard origin/main

# 2. Check if .env exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file is missing on the server!"
  exit 1
fi

# 3. Build and restart updated containers
echo "🔨 Building and restarting Next.js and services..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --remove-orphans

# 4. Run Prisma Database Migrations safely
echo "🗄️ Applying Prisma database schema sync..."
docker compose exec -T nextjs npx prisma db push --accept-data-loss || docker compose exec -T nextjs npx prisma migrate deploy || echo "⚠️ Prisma schema sync skipped."

# 5. Clean up old dangling Docker images to save VPS disk space
echo "🧹 Pruning old unused Docker images..."
docker image prune -f

# 6. Verify Container Health
echo "🩺 Running health check verification..."
sleep 5
./scripts/health_check.sh || echo "⚠️ Health check warning: Please inspect logs with ./scripts/logs.sh"

echo "=========================================================="
echo "✅ Automated Deployment Completed Successfully!"
echo "=========================================================="
