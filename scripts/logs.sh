#!/bin/bash
# logs.sh - Follow the logs of the Docker compose services

# Change directory to the root of the project
cd "$(dirname "$0")/.."

# Default to tailing 100 lines unless specified otherwise
TAIL_LINES=${1:-100}

echo "=========================================================="
echo "Tailing container logs (showing last $TAIL_LINES lines)..."
echo "Press Ctrl+C to exit."
echo "=========================================================="

docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f --tail="$TAIL_LINES"
