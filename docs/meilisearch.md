# Meilisearch Engine Architecture

## 1. Purpose
This document details the Meilisearch v1.8 integration, persistent storage, master key security, and search engine configuration.

---

## 2. Configuration & Features

### Container Specifications
* **Docker Image:** `getmeili/meilisearch:v1.8`
* **Environment:**
  - `MEILI_HOST: 0.0.0.0:7700`
  - `MEILI_ENV: production` (requires master key with minimum 16 bytes)
  - `MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}`
* **Storage Volume:** `meilisearch_data` mapped to `/meili_data`.
* **Health Check:** Configured via `curl -f http://localhost:7700/health` with 10s interval.

---

## 3. Commands

### Check Health Status
```bash
docker compose exec meilisearch curl -sf http://localhost:7700/health
```

### Inspect Version and Engine Status
```bash
docker compose exec meilisearch curl -s http://localhost:7700/version
```

### Check Indexes (Using Master Key)
```bash
docker compose exec meilisearch curl -s \
  -H "Authorization: Bearer <YOUR_MEILI_MASTER_KEY>" \
  http://localhost:7700/indexes
```

---

## 4. Troubleshooting

### Meilisearch Exits Immediately on Startup
- Check master key length. In production mode (`MEILI_ENV=production`), Meilisearch requires the key to be at least 16 bytes long.
- Inspect logs:
  ```bash
  docker compose logs meilisearch
  ```

---

## 5. Migration Path
- **Meilisearch Cloud / Dedicated Search Cluster:** Switch `MEILI_URL` and `MEILI_MASTER_KEY` in `.env` to point to an external cluster without requiring Next.js code modifications.
