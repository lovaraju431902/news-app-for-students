#!/bin/bash
# dev.sh - Start news-website with live Hot-Reload in Docker

set -e

# Change directory to the root of the project
cd "$(dirname "$0")/.."

echo "=========================================================="
echo "🚀 Starting NewsRoom in LIVE HOT-RELOAD Dev Mode..."
echo "=========================================================="

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file is missing."
  exit 1
fi

# Build and start dev stack
echo "📦 Building & launching nextjs dev container with live volume mount..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build nextjs
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

echo "=========================================================="
echo "🔥 LIVE HOT-RELOAD IS ACTIVE!"
echo "🌐 Open in browser: http://localhost/"
echo "💡 Edit any file & save (Ctrl+S) -> changes appear in 1 second!"
echo "📜 To watch live logs: docker compose logs -f nextjs"
echo "=========================================================="
