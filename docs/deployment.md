# Droplet Deployment Guide

## Purpose
This guide walks through step-by-step instructions on deploying the NewsRoom application container stack onto a single DigitalOcean Droplet running **Ubuntu 24.04**.

---

## Droplet Provisioning Settings

### 1. Specs Recommendation
*   **OS**: Ubuntu 24.04 LTS (x64)
*   **CPU/RAM**: Basic Droplet - 1 vCPU, 1 GB RAM, 25 GB SSD (Minimum) or 2 GB RAM (Recommended for faster builds).
*   **Firewall**: Expose Ports:
    *   `22` (SSH)
    *   `80` (HTTP)
    *   `443` (HTTPS)

---

## Installation Commands

Execute the following commands on the Droplet host after connecting via SSH:

### 1. Install Docker Engine & Compose Plugin
```bash
# Update package database
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker compose version
```

### 2. Configure Permissions (Optional but Recommended)
Enables executing scripts without typing `sudo` on every Docker invocation:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## Application Setup

### 1. Clone Project and Configure Settings
```bash
# Clone the repository onto the droplet
git clone <repository_url> /var/www/news-website
cd /var/www/news-website

# Copy environment template
cp .env.example .env

# Edit and fill in production secrets
nano .env
```

### 2. Startup Stack
Make helper scripts executable and boot the stack:
```bash
chmod +x scripts/*.sh

# Run start script (this will build Next.js and boot up the containers)
./scripts/start.sh
```

---

## Troubleshooting
*   **Out of Memory during Build**: Next.js builds on low-spec droplets (1GB RAM) may crash with compilation memory constraints. If this occurs, enable swap space on the droplet:
    ```bash
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    ```
*   **Connection Refused**: Check that the host firewall (`ufw`) is not blocking HTTP/HTTPS requests.
    ```bash
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    ```
