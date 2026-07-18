# Meilisearch Search Service Guide

## Purpose
This document outlines the Meilisearch database configurations, endpoint statuses, and indexing workflows for the NewsRoom platform.

---

## Configuration Details
*   **Container**: `news_meilisearch` using `getmeili/meilisearch:v1.8`.
*   **Storage**: Persistent volume `news_meilisearch_data` mapped to `/meili_data`.
*   **Access Port**: `7700` (isolated internally within `news_network` bridge network).
*   **Security Settings**: Runs in `production` mode, which automatically disables default sandbox configs and enforces master key verification.

---

## Service Operations

### Check Health status
Executes a quick endpoint query against Meilisearch inside the container environment:
```bash
docker compose exec -t meilisearch curl -f http://localhost:7700/health
```
*   **Expected JSON output**: `{"status":"available"}`

---

## Future Migration Path (Phase 2)
Currently, the application implements PostgreSQL-based weighted full-text search (`lib/search-service.ts`). Meilisearch has been spun up as part of the container architecture to prepare for high-scale traffic.

Once Phase 2 is approved, we will:
1.  Add a synchronization event trigger inside blog mutations (e.g. create/update/delete) that pushes structured article payloads to Meilisearch index endpoints.
2.  Enable search queries on the `/search` route via Meilisearch indexes instead of SQL query scans.
3.  Configure index parameters like `searchableAttributes` (title, content, tags) and `rankingRules` for optimized search results.
