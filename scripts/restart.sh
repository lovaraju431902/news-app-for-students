#!/bin/bash
# restart.sh - Restart the news-website Docker stack

set -e

# Change directory to the root of the project
cd "$(dirname "$0")/.."

echo "=========================================================="
echo "Restarting NewsRoom Docker Stack..."
echo "=========================================================="

docker compose -f docker-compose.yml -f docker-compose.prod.yml restart

echo "=========================================================="
echo "✅ Restart command sent to all containers successfully!"
echo "Run './scripts/health_check.sh' to inspect container health."
echo "=========================================================="
