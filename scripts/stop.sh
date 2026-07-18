#!/bin/bash
# stop.sh - Stop the news-website Docker stack

set -e

# Change directory to the root of the project
cd "$(dirname "$0")/.."

echo "=========================================================="
echo "Stopping NewsRoom Docker Stack..."
echo "=========================================================="

docker compose -f docker-compose.yml -f docker-compose.prod.yml down

echo "=========================================================="
echo "✅ Docker stack stopped successfully."
echo "=========================================================="
