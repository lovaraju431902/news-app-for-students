# News Website - Hetzner Cloud Production Deployment Guide

This document is a step-by-step production setup guide for deploying this application on a **Hetzner Cloud VPS (Virtual Private Server)**. It is written to be clean, professional, and directly handable to your clients purchasing this software.

---

## 1. Architecture Overview

Here is the system architecture of the application running inside the Docker network on your Hetzner VPS:

```mermaid
graph TD
    Client[Web Browser / Client] -->|HTTPS :443| Cloudflare[Cloudflare CDN / WAF]
    Cloudflare -->|HTTPS / Proxy| Nginx[Nginx Container :443 / :80]
    
    subgraph Hetzner Server (Docker Compose Stack)
        Nginx -->|Proxy Pass| NextJS[Next.js App Router Container :3000]
        NextJS -->|ORM Queries| Postgres[(PostgreSQL Container :5432)]
        NextJS -->|Caching / Sessions| Redis[(Redis Cache Container :6379)]
        NextJS -->|Search Queries| Meili[(Meilisearch Container :7700)]
    end
    
    NextJS -->|Media Uploads / Fetch| R2[Cloudflare R2 Bucket / S3]
```

---

## 2. Server Sizing & Pricing Recommendations

Hetzner Cloud offers some of the best price-to-performance VPS instances in the market. We recommend the following configurations:

| Instance Type | CPU | RAM | NVMe SSD | Monthly Price (approx.) | Target Audience |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CX22** (Standard) | 2 vCPU | 4 GB | 40 GB | ~€4.80 / mo | Startups & Low-Medium Traffic (Recommended) |
| **CPX22** (Compute) | 3 vCPU | 4 GB | 80 GB | ~€6.50 / mo | High Traffic / Rapid Media Uploads |

* **Recommended Operating System:** Ubuntu 24.04 LTS (x64)
* **Location:** Pick the region closest to your primary audience (Falkenstein, Germany for Europe / Hillsboro, Oregon for US / Singapore for Asia).

---

## 3. Step 1: Provisioning your Hetzner Server

1. **Log in** to your [Hetzner Cloud Console](https://console.hetzner.cloud/).
2. Click **Create Project** and name it (e.g. `news-app`).
3. Click **Add Server**:
   * **Location:** Choose closest region.
   * **Image:** `Ubuntu 24.04`.
   * **Type:** Shared vCPU -> `CX22` (2 vCPU, 4GB RAM).
   * **SSH Keys:** Click *Add SSH Key* and paste your local machine's public SSH key (`~/.ssh/id_rsa.pub`). *Never use passwords for SSH access!*
   * **Name:** Name your server (e.g., `news-production-server`).
4. Click **Create & Buy Now**. Within 10 seconds, your server IP will be active!

---

## 4. Step 2: Server Hardening & Dependencies Installation

SSH into your new Hetzner server using your terminal:
```bash
ssh root@<YOUR_SERVER_IP>
```

### 4.1 Configure 2GB Swap Memory (Crucial for Node.js builds)
To prevent out-of-memory errors during Next.js builds on low-cost servers, configure swap space:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 4.2 Install Docker and Docker Compose
```bash
# Update system dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw ca-certificates

# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify Installation
docker --version
docker compose version
```

### 4.3 Configure Firewalls (UFW)
Ensure only necessary traffic is allowed into your server:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH Secure Access'
sudo ufw allow 80/tcp comment 'HTTP Web traffic'
sudo ufw allow 443/tcp comment 'HTTPS Web traffic'
sudo ufw enable
```

---

## 5. Step 3: Application Setup & Environment Configurations

### 5.1 Clone your codebase
Clone your application repository to `/var/www/news-website`:
```bash
git clone <YOUR_GIT_REPOSITORY_URL> /var/www/news-website
cd /var/www/news-website
```

### 5.2 Configure Production Environment Variables
Copy the `.env.example` and edit it to set production-grade passwords and keys:
```bash
cp .env.example .env
nano .env
```

Set the following parameters carefully:

```env
# Database Credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=generate_a_strong_random_password_here
POSTGRES_DB=news_db
DATABASE_URL="postgresql://postgres:YOUR_STRONG_PASSWORD@postgres:5432/news_db?schema=public"

# Redis
REDIS_PASSWORD=generate_another_strong_password_here

# Meilisearch
MEILI_MASTER_KEY=choose_a_long_secure_master_key_minimum_16_chars

# Cloudflare R2 / S3 Storage configurations
S3_ACCESS_KEY_ID=your_cloudflare_r2_access_key
S3_SECRET_ACCESS_KEY=your_cloudflare_r2_secret_key
S3_ENDPOINT=https://<your_account_id>.r2.cloudflarestorage.com
S3_BUCKET_NAME=your_r2_bucket_name
CDN_URL=https://cdn.yourdomain.com  # or the Cloudflare R2 Public Dev URL

# Next.js Application General Settings
NODE_ENV=production
MAIN_URL=https://yourdomain.com
SESSION_SECRET=generate_a_random_64_character_string_here
```

---

## 6. Step 4: Booting the Application Stack

Run the built-in startup scripts to compile and launch the production containers:

```bash
# Make scripts executable
chmod +x scripts/*.sh


# Run startup script (rebuilds, migrates database, and seeds default tables)
./scripts/start.sh
```

Inspect container status to confirm everything is running:
```bash
docker compose ps

```
You should see 5 healthy containers: `news_nextjs`, `news_postgres`, `news_redis`, `news_meilisearch`, and `news_nginx`.

---

## 7. Step 5: Mapping the Domain via Cloudflare CDN

To route your client's custom domain (e.g. `yourdomain.com`) to the Hetzner server securely:

1. **DNS Settings:** In Cloudflare DNS settings, point an **A record** for `@` and `www` to your Hetzner Server IP address.
2. **Proxy Mode:** Ensure the Cloudflare Proxy status is set to **Proxied (orange cloud)**.
3. **SSL Mode:** Under Cloudflare -> SSL/TLS, choose **Full (Strict)** or **Full** encryption mode.
4. **Media CDN:** 
   * Go to **Cloudflare R2** -> bucket settings -> **Public Access**.
   * Add a custom subdomain like `cdn.yourdomain.com` (or use the free `r2.dev` public dev domain) and match it in your `.env` `CDN_URL`.

---

## 8. Database Maintenance Operations

These scripts are pre-packaged to help you back up and migrate client data:

### 8.1 Exporting Database Dump (Backup)
To backup all categories, blogs, prompts, files, and settings into a sql dump file:
```bash
./scripts/backup_db.sh
```
This generates a backup file inside the `backups/` folder (e.g. `backups/news_db_backup_20260816.sql`).

### 8.2 Importing Database Dump (Restore)
To import/restore a SQL dump file into the database container:

```bash
./scripts/restore_db.sh backups/news_db_backup_20260816.sql
```
*Warning: This will overwrite existing data in the database.*

### 8.3 Resetting Database to Factory Defaults
To completely empty the database and delete all data:
```bash
docker compose exec nextjs npx prisma db push --force-reset
```

---

## 9. Troubleshooting & Logs

* **View Next.js application logs:**
  ```bash
  docker compose logs -f nextjs
  ```
* **View Nginx logs (traffic and security headers):**
  ```bash
  docker compose logs -f nginx
  ```
* **Rebuild after making changes to code:**
  ```bash
  ./scripts/restart.sh
  ```
* **Run health checks diagnostic suite:**
  ```bash
  ./scripts/health_check.sh
  ```
