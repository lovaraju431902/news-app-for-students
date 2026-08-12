# Docker Architecture & Containerization Guide

## 1. Purpose
This document details the multi-container Docker infrastructure designed for deploying the Next.js application on a single Ubuntu 24.04 DigitalOcean Droplet. The architecture isolates the application runtime, database layer, caching engine, search indexing service, and reverse proxy into independent, interconnected containers orchestrated via Docker Compose.

---

## 2. Architecture & Service Breakdown

### Container Overview
1. **`news_nginx` (Reverse Proxy & Edge Gateway)**
   - **Base Image:** `nginxinc/nginx-unprivileged:alpine` (runs as non-root UID 101)
   - **Exposed Ports:** `80:8080` (HTTP) and `443:8443` (HTTPS)
   - **Role:** Directs public traffic, SSL termination, static asset caching, Gzip compression, rate limiting, and security header injection.
2. **`news_nextjs` (Application Service)**
   - **Base Image:** Custom multi-stage build using `node:20-slim`
   - **Internal Port:** `3000` (isolated to Docker network `news_network`)
   - **Role:** Executes the Next.js App Router standalone server with Prisma ORM.
3. **`news_postgres` (Relational Database)**
   - **Base Image:** `postgres:16-alpine`
   - **Internal Port:** `5432`
   - **Persistent Volume:** `postgres_data` (`/var/lib/postgresql/data`)
   - **Role:** Main transactional data store.
4. **`news_redis` (In-Memory Cache & Key-Value Store)**
   - **Base Image:** `redis:7-alpine`
   - **Internal Port:** `6379`
   - **Persistent Volume:** `redis_data` (`/data`)
   - **Role:** Application caching and session store.
5. **`news_meilisearch` (Fast Search Engine)**
   - **Base Image:** `getmeili/meilisearch:v1.8`
   - **Internal Port:** `7700`
   - **Persistent Volume:** `meilisearch_data` (`/meili_data`)
   - **Role:** Full-text search and filtering engine.

---

## 3. Configuration

### Network Isolation
All services communicate over an internal bridge network (`news_network`). Only `nginx` exposes ports directly to the internet (or host interfaces). Other containers communicate using internal service hostnames (`nextjs:3000`, `postgres:5432`, `redis:6379`, `meilisearch:7700`).

### Volume Persistence
* `postgres_data` -> `/var/lib/postgresql/data`
* `redis_data` -> `/data`
* `meilisearch_data` -> `/meili_data`

### Production Overrides (`docker-compose.prod.yml`)
* Resource constraints (CPU & Memory limits) to safeguard 1GB–2GB Droplet stability.
* JSON-file log rotation (`max-size: 10m`, `max-file: 3`) to prevent disk exhaustion.

---

## 4. Commands

### Build & Start Stack
```bash
# Production mode (includes resource limits and log rotation)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Or using the helper script:
./scripts/start.sh
```

### Stop Stack
```bash
docker compose down
# Or using the helper script:
./scripts/stop.sh
```

### View Live Logs
```bash
# All services
docker compose logs -f

# Specific service (e.g. nextjs or nginx)
docker compose logs -f nextjs
docker compose logs -f nginx
```

### Inspect Running Containers & Health
```bash
docker compose ps
./scripts/health_check.sh
```

---

## 5. Troubleshooting

### Container Keeps Restarting
1. Inspect container logs:
   ```bash
   docker compose logs <service_name>
   ```
2. Check for out-of-memory (OOM) kills:
   ```bash
   docker inspect news_nextjs --format='{{json .State}}'
   ```
3. Ensure `.env` is populated with all required variables.

### Port Conflicts on Host
If PostgreSQL or Nginx conflicts with existing host services:
- Ensure port 80/443 is not occupied by another web server (`sudo lsof -i :80`).
- Ensure Postgres port 5432 is not bound globally on the host.

---

## 6. Migration Path
- **Horizontal Scaling:** Transition from single Docker Compose host to Docker Swarm or Kubernetes (K8s) if traffic exceeds single-server capacity.
- **Managed Services:** Seamlessly migrate `postgres`, `redis`, and `meilisearch` to DigitalOcean Managed Databases by updating `.env` connection strings without altering the Next.js codebase.
