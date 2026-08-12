# Nginx Reverse Proxy & Security Architecture

## 1. Purpose
This document explains the Nginx reverse proxy configuration, non-root security containerization, SSL termination, caching layers, compression, and request rate limiting.

---

## 2. Configuration & Security

### Container Architecture
* **Image:** `nginxinc/nginx-unprivileged:alpine`
* **Non-Root Execution:** Runs under UID 101 (`nginx`), binding to unprivileged ports `8080` (mapped to host `80`) and `8443` (mapped to host `443`).
* **Process Management:** `worker_processes auto` with `epoll` connection model.

### Key Nginx Features
1. **Security Headers (OWASP Recommended):**
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: no-referrer-when-downgrade`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
   - `server_tokens off` (Hides Nginx version)
2. **Rate Limiting:**
   - `limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;`
   - Protects `/api/` endpoints with `burst=20 nodelay`.
3. **Static Caching:**
   - Microcaching on `/_next/static/` with 1-year immutable cache control headers.
   - Public assets (images, fonts, css) cached with 30-day client expiration.
4. **Large File Uploads:**
   - `client_max_body_size 50M;` enables smooth media and document uploads.
5. **Compression:**
   - Gzip enabled across text, JSON, JS, CSS, and SVG types at compression level 6.
6. **WebSockets:**
   - Full support for `Upgrade` and `Connection` headers for real-time features.

---

## 3. Commands

### Test Nginx Configuration Syntax
```bash
docker compose exec nginx nginx -t
```

### Reload Configuration (Zero Downtime)
```bash
docker compose exec nginx nginx -s reload
```

### Inspect Nginx Access / Error Logs
```bash
docker compose logs -f nginx
```

---

## 4. Troubleshooting

### 413 Payload Too Large
- Check `client_max_body_size` in `docker/nginx/nginx.conf`. Increase if larger video/audio files are required.

### 502 Bad Gateway
- Check that the `news_nextjs` container is healthy and responding on port `3000`.

---

## 5. Migration Path
- In multi-server or Kubernetes setups, Nginx can be swapped for an Ingress Controller (e.g. NGINX Ingress or Traefik) while preserving identical header rules and cache policies.
