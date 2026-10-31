# start.ps1 - Boot up production Docker stack from Windows PowerShell
$ErrorActionPreference = "Stop"

Set-Location "$PSScriptRoot\.."

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Starting NewsRoom Docker Stack..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file is missing." -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and configure all variables first."
    exit 1
}

Write-Host "🚀 Deploying containers in detached mode with build..." -ForegroundColor Yellow
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

Write-Host "🗄️ Synchronizing Prisma Database Schema..." -ForegroundColor Yellow
docker compose exec -T nextjs npx prisma db push --accept-data-loss

Write-Host "👥 Seeding Author Profile Images..." -ForegroundColor Yellow
docker compose exec -T nextjs node scripts/seed_authors.js

Write-Host "📝 Seeding Starter Blogs & Categories..." -ForegroundColor Yellow
docker compose exec -T nextjs node scripts/seed_data.js

Write-Host "🎯 Backfilling Dynamic Homepage Sections & Category Block Styles..." -ForegroundColor Yellow
docker compose exec -T nextjs node scripts/backfill_homepage_sections.js

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "✅ Docker stack started and updated successfully!" -ForegroundColor Green
Write-Host "Public Homepage: http://localhost" -ForegroundColor White
Write-Host "Admin Panel:     http://localhost/admin" -ForegroundColor White
Write-Host "Rich Editor:     http://localhost/admin/richeditor" -ForegroundColor White
Write-Host "Run '.\scripts\health_check.ps1' to verify container health." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
