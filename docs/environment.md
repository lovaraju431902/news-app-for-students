# Environment Variables Reference

## 1. Purpose
This document provides a comprehensive inventory of all environment variables used by the news website application, Docker Compose services, and external integrations.

---

## 2. Variables Directory

| Variable | Scope | Required | Example / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POSTGRES_USER` | Docker / DB | Yes | `postgres` | Database superuser name |
| `POSTGRES_PASSWORD` | Docker / DB | Yes | `<random-string>` | Database password (must be strong) |
| `POSTGRES_DB` | Docker / DB | Yes | `news_db` | Name of the primary PostgreSQL database |
| `DATABASE_URL` | Application | Yes | `postgresql://...` | Full connection URI used by Prisma |
| `REDIS_PASSWORD` | Docker / Cache | Yes | `<random-string>` | Authentication password for Redis container |
| `REDIS_URL` | Application | Optional | `redis://:...@localhost:6379` | Full connection URI for Redis clients |
| `MEILI_MASTER_KEY` | Docker / Search | Yes | `<random-16+chars>` | Master key for Meilisearch instance |
| `MEILI_URL` | Application | Optional | `http://meilisearch:7700` | Meilisearch host URL inside Docker network |
| `ADMIN_PASSWORD` | Application | Yes | `<random-string>` | Password protecting admin dashboard endpoints |
| `SESSION_SECRET` | Application | Yes | `<random-32+chars>` | Secret key for signing session tokens and cookies |
| `S3_ACCESS_KEY_ID` | Storage / S3 | Optional | `<key_id>` | AWS S3 / Cloudflare R2 / DO Spaces access key |
| `S3_SECRET_ACCESS_KEY` | Storage / S3 | Optional | `<secret_key>` | AWS S3 / Cloudflare R2 / DO Spaces secret |
| `S3_ENDPOINT` | Storage / S3 | Optional | `https://blr1.digitaloceanspaces.com` | Custom endpoint for S3-compatible storage |
| `S3_BUCKET_NAME` | Storage / S3 | Optional | `news-assets` | Target bucket name for media storage |
| `CDN_URL` | Storage / CDN | Optional | `https://cdn.yourdomain.com` | Public CDN URL mapping to the storage bucket |

---

## 3. Configuration & Usage

- **Local Development:** Copy `.env.example` to `.env` and set standard localhost credentials.
- **Docker Compose Production:** Docker Compose automatically reads `.env` from the project root and injects the corresponding environment variables into each service container.

---

## 4. Commands

### Verify Loaded Environment in a Container
```bash
# Check Next.js container environment (excluding sensitive values from logs)
docker compose exec nextjs env | grep -E 'NODE_ENV|PORT|HOSTNAME'
```

---

## 5. Troubleshooting & Security Best Practices
- **Never commit `.env` to Git:** Ensure `.env` is listed in `.gitignore` and `.dockerignore`.
- **Minimum Key Lengths:** `MEILI_MASTER_KEY` requires at least 16 bytes in production; `SESSION_SECRET` should be 32+ characters.
- **Special Characters in Database URLs:** Special characters (like `@`, `:`, `#`, `/`) in passwords must be URL-encoded if supplied directly in connection strings.

---

## 6. Migration Path
- For enterprise secrets management, migrate from flat `.env` files to HashiCorp Vault, AWS Secrets Manager, or Doppler with zero application code changes.
