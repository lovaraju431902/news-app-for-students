# Docker Architecture Documentation

## Purpose
This document provides instructions on how the Docker containerization architecture for the NewsRoom platform is structured, built, and executed.

---

## Configuration Details

### 1. Multi-stage Dockerfile
The application uses a secure multi-stage `Dockerfile` based on `node:20-slim`:
*   **Base Stage**: Installs general OS updates, CA certificates, curl (used for healthchecks), and `openssl` (required by Prisma engine binaries).
*   **Deps Stage**: Runs `npm ci` to fetch package lock items in a clean state.
*   **Builder Stage**: Copies dependencies and codes, executes `npx prisma generate` to construct query clients, and calls `npm run build` to generate Next.js output standalone directories.
*   **Runner Stage**: Minimizes standard runtime sizes by pulling *only* compiled Next.js standalone outputs, static directories, and public assets. 
*   **Permissions**: Runs under a custom unprivileged user (`nextjs:nodejs`) rather than root.

### 2. Docker Compose
The system is divided into five isolated containers on a private network (`news_network`):
1.  **`news_postgres`**: Database service using `postgres:16-alpine`.
2.  **`news_redis`**: Key-value data cache using `redis:7-alpine`.
3.  **`news_meilisearch`**: Search server using `getmeili/meilisearch:v1.8`.
4.  **`news_nextjs`**: Next.js App Router standalone node process.
5.  **`news_nginx`**: Nginx reverse proxy using `nginxinc/nginx-unprivileged:alpine`.

---

## Commands

### Start Stack
Starts all containers in detached mode and builds the Next.js image if not present:
```bash
./scripts/start.sh
```

### Stop Stack
Shuts down all containers and networks cleanly:
```bash
./scripts/stop.sh
```

### Check Logs
Trails active logging output:
```bash
./scripts/logs.sh
```

---

## Troubleshooting & Migration Path
*   **Next.js standalone build fails**: Make sure `output: "standalone"` is set in `next.config.ts`.
*   **Prisma engine errors**: Ensure OpenSSL is installed inside the container environment. The `node:20-slim` Debian variant is used here because alpine-musl binaries occasionally hit linkage issues with precompiled Prisma assets.
*   **Network Isolation**: Standard configuration isolates all services except `nginx` inside a private Docker bridge network. For direct PostgreSQL access from host machines, the port `127.0.0.1:5432` is bound locally and securely in `docker-compose.prod.yml`.
