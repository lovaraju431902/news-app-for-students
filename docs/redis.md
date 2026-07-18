# Redis Cache Administration Guide

## Purpose
This document explains the Redis configuration, caching topology, and data management inside the NewsRoom Docker Compose environment.

---

## Configuration Details
*   **Container**: `news_redis` running `redis:7-alpine`.
*   **Persistent Storage**: Volume `news_redis_data` mapping to `/data` in container filesystems.
*   **Tuning File**: `docker/redis/redis.conf`.

### Key Policies
1.  **Persistence (AOF)**: Appends database commands to `appendonly.aof` file every second (`appendfsync everysec`). In the event of system shutdown, Redis restores data directly from this log.
2.  **LRU Eviction**: Sets memory bounds to `maxmemory 256mb`. Under resource pressure, Redis discards the least recently used keys (`maxmemory-policy allkeys-lru`).
3.  **Password Security**: Implements `protected-mode yes` and enforces password authorization using command lines `redis-server --requirepass <password>`.

---

## Administrative Commands

### Test Connection
Connect to Redis command console and run ping checks:
```bash
# Retrieve Redis password from environment settings
REDIS_PASS=$(grep '^REDIS_PASSWORD=' .env | cut -d '=' -f2 | xargs)

# Execute interactive ping
docker compose exec -it redis redis-cli -a "$REDIS_PASS" ping
```
*   **Expected Response**: `PONG`

### Flush Cache
If caching states must be cleared manually:
```bash
docker compose exec -it redis redis-cli -a "$REDIS_PASS" flushall
```

---

## Future Migration Path (Phase 2)
In Phase 1, the Next.js application continues connecting to Upstash Redis REST endpoints as configured in `.env`.
Once you approve Phase 2 caching implementations:
*   The caching client in `lib/redis.ts` will be updated to point to the local Redis container upstream address `redis://:password@redis:6379`.
*   This will keep all caching traffic local to the droplet and remove external REST latency.
