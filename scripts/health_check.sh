#!/bin/bash
# health_check.sh - Quick diagnostics check for compose services and ports

set -e

# Change directory to the root of the project
cd "$(dirname "$0")/.."

echo "=========================================================="
echo "Checking NewsRoom Service Status..."
echo "=========================================================="

# Show standard docker compose process status
docker compose ps

echo ""
echo "----------------------------------------------------------"
echo "Connectivity Diagnostics"
echo "----------------------------------------------------------"

# Query Nginx status
if curl -sI http://localhost:80/ | grep -q "Server: nginx" || curl -sI http://localhost:80/ | grep -qi "HTTP"; then
  echo "✅ Nginx reverse proxy is answering on HTTP port 80."
else
  echo "❌ Nginx reverse proxy did not respond on HTTP port 80 (or localhost is mapping ports differently)."
fi

# Query Next.js direct status
if [ "$(docker ps -q -f name=news_nextjs)" ]; then
  if docker compose exec -T nextjs curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Next.js standalone web application is healthy on port 3000."
  else
    echo "⚠️ Next.js application container is running, but port 3000 is not responding yet."
  fi
else
  echo "❌ Next.js container 'news_nextjs' is offline."
fi

# Query Postgres
if [ "$(docker ps -q -f name=news_postgres)" ]; then
  if docker compose exec -T postgres pg_isready -U postgres > /dev/null; then
    echo "✅ Postgres database container is online and accepting connections."
  else
    echo "❌ Postgres container is running but database is not ready."
  fi
else
  echo "❌ Postgres container 'news_postgres' is offline."
fi

# Query Redis
if [ "$(docker ps -q -f name=news_redis)" ]; then
  # Try to read env REDIS_PASSWORD from .env
  REDIS_PASS=$(grep '^REDIS_PASSWORD=' .env | cut -d '=' -f2 | xargs || echo "redis_password")
  if docker compose exec -T redis redis-cli -a "$REDIS_PASS" ping 2>/dev/null | grep -q "PONG"; then
    echo "✅ Redis cache container is online and responding."
  else
    echo "❌ Redis container is running but ping request failed."
  fi
else
  echo "❌ Redis container 'news_redis' is offline."
fi

# Query Meilisearch
if [ "$(docker ps -q -f name=news_meilisearch)" ]; then
  if docker compose exec -T meilisearch curl -sf http://localhost:7700/health | grep -q "status"; then
    echo "✅ Meilisearch engine container is online and healthy."
  else
    echo "❌ Meilisearch container is running but health endpoint failed."
  fi
else
  echo "❌ Meilisearch container 'news_meilisearch' is offline."
fi

echo "=========================================================="
