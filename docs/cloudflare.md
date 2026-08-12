# Cloudflare CDN & Edge Proxy Setup Guide

## 1. Purpose
This document provides recommended configurations for routing production traffic through Cloudflare's Free CDN and WAF tier to front the DigitalOcean Droplet.

---

## 2. Configuration Settings

### 2.1 DNS Setup
1. Add an **A Record**:
   - **Name:** `@` (or subdomain like `news`)
   - **IPv4 Address:** `<DIGITALOCEAN_DROPLET_PUBLIC_IP>`
   - **Proxy Status:** `Proxied` (Orange Cloud enabled)
2. Add a **CNAME Record**:
   - **Name:** `www`
   - **Target:** `@`
   - **Proxy Status:** `Proxied`

### 2.2 SSL/TLS Configuration
- **SSL/TLS Encryption Mode:** Set to **`Full`** or **`Full (Strict)`** (if using a Cloudflare Origin Certificate on Nginx).
- **Always Use HTTPS:** `ON`
- **Minimum TLS Version:** `TLS 1.2`
- **Opportunistic Encryption:** `ON`

### 2.3 Caching & Speed Optimizations
- **Brotli Compression:** `ON`
- **Early Hints:** `ON`
- **Auto Minify:** JS, CSS, HTML
- **Browser Cache TTL:** `Respect Existing Headers` (Nginx sends proper max-age for Next.js assets).

### 2.4 Recommended Cache Rules
1. **Rule 1 - Next.js Static Assets:**
   - **Matching Criteria:** `URI Path starts with "/_next/static/"`
   - **Cache Eligibility:** `Cache Everything`
   - **Edge TTL:** `1 month`
   - **Browser TTL:** `1 year`
2. **Rule 2 - Admin / Dynamic Routes Bypass:**
   - **Matching Criteria:** `URI Path starts with "/admin" OR URI Path starts with "/api"`
   - **Cache Eligibility:** `Bypass Cache`

### 2.5 Security & WAF Rules
- **Security Level:** `Medium`
- **Bot Fight Mode:** `ON`
- **Challenge Bad Bots:** Enabled

---

## 3. Commands & Verification

### Test Cloudflare Edge Caching Response
```bash
curl -I https://yourdomain.com/_next/static/chunks/main.js
# Look for headers:
# cf-cache-status: HIT
# server: cloudflare
```

---

## 4. Troubleshooting

### "Redirect Loop (ERR_TOO_MANY_REDIRECTS)"
- **Cause:** Cloudflare SSL mode set to `Flexible` while Nginx enforces HTTPS redirect.
- **Solution:** Change Cloudflare SSL mode to **`Full`** or **`Full (Strict)`**.

### Admin Login or Dynamic Pages Showing Stale Data
- **Cause:** Overly aggressive edge caching rule matching dynamic routes.
- **Solution:** Ensure Cache Bypass rule is placed at the top for `/admin*` and `/api*`.

---

## 5. Migration Path
- Easily upgrade to Cloudflare Pro or Enterprise for Image Optimization (Cloudflare Polish), custom WAF rulesets, and zero-trust Cloudflare Access tunnels.
