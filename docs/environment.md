# Environment Variables Reference

## Purpose
This document provides explanations, safety considerations, and verification steps for all environmental keys declared inside `.env.example`.

---

## Configuration Reference Checklist

### 1. Database Variables (PostgreSQL)
*   **`POSTGRES_USER`**
    *   *Description*: The primary administrator user for the postgres container.
    *   *Default*: `postgres`
*   **`POSTGRES_PASSWORD`**
    *   *Description*: The database superuser password. Must be a long, alphanumeric random string.
*   **`POSTGRES_DB`**
    *   *Description*: Name of the default database created upon container initialization.
    *   *Default*: `news_db`

### 2. Cache Variables (Redis)
*   **`REDIS_PASSWORD`**
    *   *Description*: Root password protecting local Redis caching queues. Enables password check constraints inside local instances.

### 3. Search Variables (Meilisearch)
*   **`MEILI_MASTER_KEY`**
    *   *Description*: Authorization master key verifying requests to Meilisearch engine nodes. Must be at least 16 bytes/characters long.

### 4. Application Secrets (Next.js)
*   **`ADMIN_PASSWORD`**
    *   *Description*: Password string evaluated to grant entry to the admin dashboard panels (`/admin-[hash]`).
*   **`SESSION_SECRET`**
    *   *Description*: Cryptographic seed (HMAC SHA-256) validating generated session JWT cookies. Ensure it is at least 32 characters in length.

### 5. Fallback/Remote Upstash Credentials
*   **`UPSTASH_REDIS_REST_URL`** & **`UPSTASH_REDIS_REST_TOKEN`**
    *   *Description*: Point to remote Upstash instances currently running search-filtering/caching query logs.

---

## Security Guidelines

> [!CAUTION]
> *   **Never Commit `.env` files**: Ensure `.env` is listed under `.gitignore`.
> *   **Strong Secrets**: Generate secrets using secure tools (e.g. `openssl rand -base64 32`).
> *   **Droplet Variables**: Set correct environment parameters directly on droplet nodes rather than copying dev credentials.
