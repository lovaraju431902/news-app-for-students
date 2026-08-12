# Redis Cache Architecture

## 1. Purpose
This document details the Redis 7 container configuration, memory policies, persistence model, and authentication strategy for fast in-memory caching.

---

## 2. Configuration & Features

### Redis Configuration (`docker/redis/redis.conf`)
* **Persistence (AOF & Snapshots):**
  - `appendonly yes` with `appendfsync everysec` ensures maximum 1 second data loss tolerance.
  - Periodic RDB snapshotting enabled (`save 900 1`, `save 300 10`, `save 60 10000`).
* **Memory Management:**
  - `maxmemory 256mb`
  - `maxmemory-policy allkeys-lru` (evicts least recently used keys when memory limit is reached).
* **Security & Authentication:**
  - `protected-mode yes`
  - Password authentication enforced via `--requirepass ${REDIS_PASSWORD}` injected by Docker Compose.

### Data Volume
Stored in named volume `news_redis_data` mounted at `/data`.

---

## 3. Commands

### Redis CLI Access
```bash
docker compose exec -it redis redis-cli -a "<YOUR_REDIS_PASSWORD>"
```

### Check Redis Health & Ping
```bash
docker compose exec redis redis-cli -a "<YOUR_REDIS_PASSWORD>" ping
```

### Inspect Redis Memory & Keyspace Stats
```bash
docker compose exec redis redis-cli -a "<YOUR_REDIS_PASSWORD>" info memory
docker compose exec redis redis-cli -a "<YOUR_REDIS_PASSWORD>" info stats
```

---

## 4. Troubleshooting

### "NOAUTH Authentication required"
- Verify that `REDIS_PASSWORD` in `.env` is supplied and matches the client connection string in `REDIS_URL`.

### OOM / Memory Pressure
- Redis is bounded to `256mb` by default. Under heavy caching loads, inspect large keys using:
  ```bash
  docker compose exec redis redis-cli -a "<PASSWORD>" --bigkeys
  ```

---

## 5. Migration Path
- **DigitalOcean Managed Redis / Upstash:** Update `REDIS_URL` to point to the managed cluster URI and scale up instances with zero downtime.
