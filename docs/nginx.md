# Nginx Reverse Proxy Documentation

## Purpose
This document outlines the Nginx setup, upstream reverse proxy, rate limiting, and security configurations configured on the NewsRoom application stack.

---

## Configuration Architecture
*   **Container**: `news_nginx` running `nginxinc/nginx-unprivileged:alpine`.
*   **Security Context**: Runs as non-root user `nginx`. Because standard ports below `1024` are restricted, Nginx listens on port `8080` (HTTP) and `8443` (HTTPS) inside the container.
*   **Host Port Bindings**:
    *   Host `80` redirects to Container `8080`.
    *   Host `443` redirects to Container `8443`.

---

## Key Configurations

### 1. Security Headers
Injects standard OWASP headers to defend against clickjacking, CSS sniffing, cross-site scripting (XSS), and script injecting:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 2. Upstream Caching
Defines static mapping caching zones (`STATIC`) storing client assets locally for up to 7 days:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;
```
Enforces cache header limits on `_next/static/` directories:
```nginx
add_header Cache-Control "public, max-age=31536000, immutable";
```

### 3. API Rate Limiting
Enforces rate limits on `/api/` endpoints to protect against DDoS or crawling scrapers. Allows up to 10 requests per second with a burst queue up to 20:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

### 4. Gzip Compression
Compresses text, CSS, JS, JSON, and SVG data on the fly before transmitting to the client, reducing bandwidth usage.

---

## Operational Commands

### Test Configuration Syntax
Checks configurations for syntax issues or configuration errors:
```bash
docker compose exec -t nginx nginx -t
```

### Reload Configuration
Applies config updates without stopping active container services:
```bash
docker compose exec -t nginx nginx -s reload
```
