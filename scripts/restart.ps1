# restart.ps1 - Restart Docker stack from PowerShell
$ErrorActionPreference = "Stop"

Set-Location "$PSScriptRoot\.."

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Restarting NewsRoom Docker Stack..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

docker compose -f docker-compose.yml -f docker-compose.prod.yml restart

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "✅ Restart command sent to all containers successfully!" -ForegroundColor Green
Write-Host "Run '.\scripts\health_check.ps1' to inspect container health." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
