# PostgreSQL Database & Prisma ORM Architecture

## 1. Purpose
This document details the PostgreSQL 16 database architecture, configuration, data persistence, and Prisma ORM workflow for production.

---

## 2. Configuration & Tuning

### Database Engine Settings (`docker/postgres/postgresql.conf`)
The database configuration is tuned for resource efficiency on a single DigitalOcean Droplet:
* **`shared_buffers = 256MB`**: Allocates 25% of available RAM for internal page cache.
* **`work_mem = 4MB`**: Dedicated memory per sort/hash operation to prevent disk spill.
* **`maintenance_work_mem = 64MB`**: Accelerates index creation and vacuuming.
* **`effective_cache_size = 768MB`**: Helps the query planner estimate OS cache capacity.
* **`client_encoding = 'UTF8'`**: Standard multilingual character encoding.
* **`timezone = 'UTC'`**: Standardized timestamp persistence.
* **`log_min_duration_statement = 250`**: Logs slow queries taking longer than 250ms for performance monitoring.

### Volume & Data Persistence
Data is stored inside named volume `news_postgres_data` mapped to `/var/lib/postgresql/data`. This guarantees data persists across container rebuilds, updates, and restarts.

---

## 3. Prisma Workflow & Compatibility

- **Binary Targets:** `schema.prisma` includes `native` and `rhel-openssl-3.0.x` to guarantee cross-compatibility across Debian/Ubuntu/Docker environments.
- **Connection Handling:** Handled via singleton in [lib/prisma.ts](file:///c:/Users/lovar/news-website/lib/prisma.ts) to prevent connection pool exhaustion during Next.js Hot Module Reloading (HMR) and SSR.

---

## 4. Commands

### Apply Database Migrations (Production)
```bash
./scripts/prisma_migrate.sh
# Equivalent direct command:
docker compose exec nextjs npx prisma migrate deploy
```

### Generate Prisma Client
```bash
./scripts/prisma_generate.sh
# Equivalent direct command:
docker compose exec nextjs npx prisma generate
```

### Database Backup
```bash
./scripts/backup_db.sh
# Dumps a timestamped gzip file to backups/postgres_backup_YYYYMMDD_HHMMSS.sql.gz
```

### Database Restore
```bash
./scripts/restore_db.sh backups/postgres_backup_YYYYMMDD_HHMMSS.sql.gz
```

### Direct PostgreSQL CLI Access
```bash
docker compose exec -it postgres psql -U postgres -d news_db
```

---

## 5. Troubleshooting

### "Too many connections"
- Ensure Next.js connects via the singleton instance in `lib/prisma.ts`.
- Adjust `max_connections = 100` in `docker/postgres/postgresql.conf` if necessary.

### Migration Lock or Sync Issues
- Check the `_prisma_migrations` table inside the database:
  ```bash
  docker compose exec postgres psql -U postgres -d news_db -c "SELECT * FROM _prisma_migrations;"
  ```

---

## 6. Migration Path
- **DigitalOcean Managed PostgreSQL:** Point `DATABASE_URL` in `.env` to DigitalOcean Managed DB cluster and comment out the local `postgres` service in `docker-compose.yml`.
- **Read Replicas:** When read traffic spikes, Prisma client can configure multi-URL connections (primary/replica) seamlessly.
