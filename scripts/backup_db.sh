#!/bin/bash
# backup_db.sh - Create a PostgreSQL database backup from the running container

set -e

# Change directory to the root of the project
cd "$(dirname "$0")/.."

# Load environment variables
if [ -f .env ]; then
  # Load non-empty lines that don't start with '#'
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

DB_USER=${POSTGRES_USER:-postgres}
DB_NAME=${POSTGRES_DB:-news_db}
BACKUP_DIR="backups"

# Ensure backups directory exists on the host
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_${TIMESTAMP}.sql"

echo "=========================================================="
echo "Initiating Database Backup..."
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Backup File: $BACKUP_FILE"
echo "=========================================================="

# Verify container is running
if [ ! "$(docker ps -q -f name=news_postgres)" ]; then
  echo "❌ Error: Postgres container 'news_postgres' is not running."
  echo "Please start the Docker stack first."
  exit 1
fi

# Run pg_dump in the container. Using -T/tty-free to avoid term issues
docker compose exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

echo "=========================================================="
echo "✅ Database backup complete!"
echo "File: $BACKUP_FILE"
echo "Size: $(du -sh "$BACKUP_FILE" | cut -f1)"
echo "=========================================================="
