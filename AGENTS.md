# Phase 1 - Production Infrastructure Setup (Docker First)

You are a Senior DevOps Engineer, Senior Next.js Architect, Senior Infrastructure Engineer, Docker Expert and Site Reliability Engineer.

Your task is to prepare my existing Next.js App Router application for production deployment on a single DigitalOcean Droplet.

This is NOT a rewrite.

This is a production infrastructure implementation.

## Existing Stack

Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS

Database

* PostgreSQL
* Prisma ORM

Cache

* Redis

Search

* Meilisearch

Media

* DigitalOcean Spaces (future)

Deployment Target

* Ubuntu 24.04 DigitalOcean Droplet

Reverse Proxy

* Nginx

CDN

* Cloudflare Free

Runtime

* Docker Compose

There is NO authentication in this application.

Do NOT add authentication.

---

# Goal

Convert the existing project into a production-ready Docker architecture while preserving all existing functionality.

Everything must remain fully compatible.

No breaking changes.

---

# IMPORTANT RULES

Never rewrite existing business logic.

Never modify routes unless absolutely necessary.

Never change Prisma schema unless required.

Never change existing API responses.

Never remove existing files.

Never replace working implementations.

Never install unnecessary packages.

Prefer official Docker images.

Prefer production best practices.

Keep everything beginner friendly.

Every change must be documented.

---

# Folder Structure

Create a production-ready infrastructure folder structure.

Example:

docker/
docker/postgres/
docker/redis/
docker/meilisearch/
docker/nginx/
scripts/
docs/

Do not move application files unless necessary.

---

# Docker

Create production-ready Docker support.

Implement:

* Multi-stage Dockerfile
* docker-compose.yml
* docker-compose.prod.yml
* .dockerignore
* healthchecks
* restart policies
* named Docker volumes
* isolated Docker network

Containers:

1. nextjs
2. postgres
3. redis
4. meilisearch
5. nginx

Each container must have:

* healthcheck
* restart unless-stopped
* proper environment variables
* persistent volumes where required

---

# PostgreSQL

Configure PostgreSQL container.

Requirements:

* Persistent volume
* Production configuration
* UTF-8
* Proper timezone
* Automatic initialization
* Prisma compatibility

Never hardcode passwords.

Use environment variables.

---

# Prisma

Keep Prisma exactly as the ORM.

Do not replace Prisma.

Validate:

DATABASE_URL

Generate:

Prisma production workflow.

Do not modify existing models unless required.

---

# Redis

Configure Redis container.

Enable:

* persistence
* password protection
* appendonly mode

Create reusable Redis configuration.

---

# Meilisearch

Configure Meilisearch container.

Requirements:

Persistent storage

Master key via environment variables

Production configuration

Healthcheck

---

# Nginx

Configure production reverse proxy.

Requirements:

Reverse proxy

HTTP → HTTPS redirect

gzip

brotli (if possible)

security headers

cache headers

rate limiting

large file uploads

WebSocket support

Proper Next.js proxy configuration

---

# Cloudflare

Prepare configuration only.

Do NOT assume Cloudflare credentials.

Create documentation explaining:

DNS

SSL mode

Caching

WAF

Compression

Recommended Page Rules

Recommended Cache Rules

---

# Environment Variables

Create:

.env.example

Document every variable.

Do not expose secrets.

---

# Scripts

Create useful scripts:

start

stop

restart

logs

backup database

restore database

prisma generate

prisma migrate deploy

health check

---

# Documentation

Create documentation files:

docs/docker.md

docs/deployment.md

docs/environment.md

docs/database.md

docs/redis.md

docs/meilisearch.md

docs/nginx.md

docs/cloudflare.md

Every document must explain:

Purpose

Configuration

Commands

Troubleshooting

Migration path

---

# Security

Implement:

read-only containers where applicable

non-root containers

security headers

hidden server version

Docker network isolation

environment validation

---

# Output Requirements

Before modifying files:

Explain exactly what will change.

After implementation provide:

1. Summary

2. Files created

3. Files modified

4. Docker architecture diagram

5. Folder structure

6. Commands to run

7. Verification checklist

8. Rollback instructions

9. Future migration path

Do NOT continue beyond this phase.

Wait for my approval before implementing Redis caching logic, Meilisearch indexing, CI/CD, monitoring, or production scaling.

Only complete Phase 1.
