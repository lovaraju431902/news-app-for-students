# Cloudflare CDN & DNS Configuration Guide

## Purpose
This document provides recommendations and recommended practices for configuring Cloudflare to protect and accelerate the NewsRoom platform.

---

## Caching & DNS Rules

### 1. DNS Configuration
Point your domain names to the DigitalOcean Droplet IP address:
*   **A Record**: `@` pointing to Droplet Public IP (Proxy Status: `Proxied`).
*   **CNAME Record**: `www` pointing to `@` (Proxy Status: `Proxied`).

### 2. SSL/TLS Mode
Under the Cloudflare Dashboard -> **SSL/TLS**:
*   **Recommended Setting**: **Full (Strict)**.
    *   This requires importing TLS/SSL certificates (e.g. Let's Encrypt or Cloudflare Origin certificates) onto your droplet inside `./docker/nginx/certs`. Nginx is configured to serve strict TLS on port `443` (8443 internally).
*   **Alternative Setting**: **Flexible**.
    *   Traffic is encrypted between clients and Cloudflare, but clear text is sent from Cloudflare to your droplet on port `80` (8080 internally). This is easier to set up initially as it does not require installing certificates on your Nginx container, but is less secure.

---

## Optimization Rules

### 1. Speed and Auto Minify
Under **Speed** -> **Optimization**:
*   **Brotli**: Enforce **On**. Cloudflare will automatically apply Brotli compression on HTTP payloads even if the Nginx origin only has Gzip enabled.
*   **Auto Minify**: Check **JavaScript**, **CSS**, and **HTML** options to optimize asset delivery speeds.

### 2. Cache Rules
Under **Caching** -> **Cache Rules**, create a custom rule to ensure Next.js static assets are cached at Cloudflare edge locations:
*   **Rule Name**: `Cache Static Assets`
*   **Expression**: `(http.request.uri.path starts_with "/_next/static/") or (http.request.uri.path.extension in {"css", "js", "ico", "png", "jpg", "jpeg", "svg", "woff", "woff2"})`
*   **Settings**: Cache eligibility set to **Eligible for cache**, Edge TTL set to **Respect origin headers** or **Override to 1 month**.

---

## Security (WAF Rules)
Under **Security** -> **WAF**, activate:
1.  **Bot Fight Mode**: Enable to block malicious scrapers.
2.  **Rate Limiting**: Add rules matching `/api/` paths if necessary (though our Nginx layer already handles local rate limiting).
3.  **Country Blocking**: (Optional) Block countries that are not part of your target reader audience to reduce server load.
