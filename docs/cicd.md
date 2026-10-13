# GitHub Actions Automated CI/CD Deployment

This workflow automatically rebuilds and deploys your Next.js and Docker stack whenever you push code to `main` (or `master`). You will never need to manually SSH into AWS, Hetzner, or DigitalOcean to run `./scripts/start.sh` again!

---

## 1. How It Works

```mermaid
flowchart LR
    A[git push origin main] --> B[GitHub Actions Triggered]
    B --> C[SSH Connection to Server]
    C --> D[git pull latest code]
    D --> E[docker compose build & up -d]
    E --> F[Prisma migrate deploy]
    F --> G[Health Check Verified]
```

---

## 2. GitHub Secrets Setup (One-Time Setup)

Go to your GitHub Repository:
1. Click **Settings** (top tab).
2. On the left sidebar, click **Secrets and variables** &rarr; **Actions**.
3. Click **New repository secret** and add the following 4 secrets:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `SERVER_HOST` | Public IP Address of your VPS / Droplet | `164.92.123.45` |
| `SERVER_USER` | SSH Username for the server | `root` or `ubuntu` |
| `SSH_PRIVATE_KEY` | Your SSH Private Key (`id_rsa` or `id_ed25519`) | `-----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----` |
| `DEPLOY_PATH` *(Optional)* | Project folder path on your server | `/root/news-website` or `~/news-website` |

> [!TIP]
> If your SSH private key is protected by a passphrase, you can also add `SSH_PASSPHRASE`.

---

## 3. How to Generate an SSH Key Pair (If you don't have one)

On your server or local computer:
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
```

1. Copy the **Public Key** (`~/.ssh/github_deploy.pub`) to your server:
   ```bash
   cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```
2. Copy the **Private Key** (`~/.ssh/github_deploy`) and paste it as the `SSH_PRIVATE_KEY` secret on GitHub.

---

## 4. Testing Your Deployment

1. Make a small code change.
2. Commit and push:
   ```bash
   git add .
   git commit -m "feat: automated deployment test"
   git push origin main
   ```
3. Open your GitHub repository &rarr; **Actions** tab.
4. Watch the deployment run live in under 2 minutes!

---

## 5. Manual Trigger Option

You can also trigger a deployment manually at any time without making a code commit:
1. Go to **Actions** tab on GitHub.
2. Click **Production Auto Deployment (CI/CD)** on the left.
3. Click **Run workflow** &rarr; select `main` &rarr; click **Run workflow**.
