# Single Droplet Production Deployment Guide

## 1. Purpose
This document provides step-by-step instructions for deploying and operating the News application on a single DigitalOcean Droplet running **Ubuntu 24.04 LTS**.

---

## 2. Server Preparation

### 2.1 Droplet Provisioning
- **OS:** Ubuntu 24.04 x64
- **Recommended Size:** Basic Droplet (2GB RAM / 1 vCPU / 50GB NVMe SSD minimum, 4GB RAM recommended for production traffic)
- **Region:** Closest to target audience (e.g., BLR1 or SGP1)

### 2.2 Initial Server Hardening & Swap Setup
Connect via SSH and configure a 2GB swap file to prevent out-of-memory spikes during builds:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2.3 Install Docker & Docker Compose
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl ufw git ca-certificates

# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2.4 Firewall Configuration (UFW)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw enable
```

---

## 3. Application Deployment Workflow

### 3.1 Clone Repository
```bash
git clone <YOUR_GIT_REPOSITORY_URL> /var/www/news-website
cd /var/www/news-website
```

### 3.2 Configure Environment Variables
```bash
cp .env.example .env
nano .env
```
Ensure strong passwords for `POSTGRES_PASSWORD`, `REDIS_PASSWORD`, `MEILI_MASTER_KEY`, and `SESSION_SECRET`.

### 3.3 Launch Production Stack
```bash
chmod +x scripts/*.sh
./scripts/start.sh
```

### 3.4 Database Migrations
Run Prisma migrations to create the database schema:
```bash
./scripts/prisma_migrate.sh
```

---

## 4. Verification & Diagnostics
Run the health check suite:
```bash
./scripts/health_check.sh
```

Inspect container status:
```bash
docker compose ps
```

---

## 5. Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `502 Bad Gateway` | Next.js container still building or crashed | Run `docker compose logs nextjs` to inspect startup errors |
| Database connection error | PostgreSQL container not ready or bad password | Check `.env` matches between services, run `docker compose logs postgres` |
| Droplet becomes unresponsive | Out of memory | Verify swap is active (`free -m`) and check Docker memory limits in `docker-compose.prod.yml` |

---

## 6. Migration Path
- **Zero-Downtime Blue-Green Deployment:** Transition to a rolling update pattern using Docker Compose `--scale` or an external proxy like Traefik/Caddy.
- **CI/CD Pipeline:** Implement GitHub Actions to SSH into the Droplet, pull updates, run migrations, and reload containers automatically.
