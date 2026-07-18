#!/bin/bash
# restore_db.sh - Restore a PostgreSQL database backup into the running container

set -e

# Change directory to the root of the project
cd "$(dirname "$0")/.."

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

DB_USER=${POSTGRES_USER:-postgres}
DB_NAME=${POSTGRES_DB:-news_db}
BACKUP_FILE=$1

# Validation checks
if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Error: Missing backup file argument."
  echo "Usage: ./scripts/restore_db.sh <path_to_backup_file.sql>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file '$BACKUP_FILE' does not exist."
  exit 1
fi

echo "=========================================================="
echo "Preparing Database Restore..."
echo "Target DB: $DB_NAME"
echo "Source SQL: $BACKUP_FILE"
echo "=========================================================="

# Check if postgres container is running
if [ ! "$(docker ps -q -f name=news_postgres)" ]; then
  echo "❌ Error: Postgres container 'news_postgres' is not running."
  echo "Please start the stack before attempting to restore."
  exit 1
fi

# Prompt confirmation to avoid accidental data loss
echo "⚠️ WARNING: This will overwrite all existing data in '$DB_NAME'."
read -p "Are you absolutely sure you want to proceed? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "❌ Restore cancelled by user."
  exit 0
fi

echo "⏳ Restoring database..."
# Pipe backup sql into postgres client
docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

echo "=========================================================="
echo "✅ Database restore completed successfully!"
echo "=========================================================="
