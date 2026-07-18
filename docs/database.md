# PostgreSQL Database Administration Guide

## Purpose
This document provides instructions on how to manage, migrate, and backup the PostgreSQL database inside the NewsRoom Docker architecture.

---

## Architecture details
*   **Container**: `news_postgres` based on `postgres:16-alpine`.
*   **Storage**: Persistent volume named `news_postgres_data` mapped to `/var/lib/postgresql/data` inside the container.
*   **Settings**: Tuning configurations are injected from `docker/postgres/postgresql.conf`.
*   **Timezone**: Forced to `UTC` to maintain consistent time tracking records across server logic.

---

## Migration & Initialization Workflow

Prisma is the primary database manager. The migrations are executed during deployment:

### 1. Apply Migrations (Production)
Applies existing Prisma migrations located in the `/prisma/migrations` folder to the target database:
```bash
./scripts/prisma_migrate.sh
```

### 2. Manual Client Generation
Triggers compilation updates to regenerate Prisma Client structures inside the Next.js container context:
```bash
./scripts/prisma_generate.sh
```

---

## Backups & Restores

To prevent loss of user articles, schedule database backups regularly:

### 1. Create a Backup
Dump schema details and table rows into a `.sql` file:
```bash
./scripts/backup_db.sh
```
*   This creates an archival dump inside the host `backups/` directory (e.g., `backups/news_db_backup_20260627_120000.sql`).

### 2. Restore from a Backup
Overwrites the current container database contents using a backup file:
```bash
./scripts/restore_db.sh backups/<backup_file_name>.sql
```
*   *Note*: This requires typing `y` to confirm data overwrite.

---

## Troubleshooting
*   **Schema Out of Sync**: If models diverge from active tables:
    1.  Validate database connection strings.
    2.  Run migration deployment inside the container stack using `./scripts/prisma_migrate.sh`.
*   **Locks or Connection Limit Reached**: Check active connections. The maximum is tuned to `100` connections in `postgresql.conf`.
