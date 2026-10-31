# logs.ps1 - Tail container logs from PowerShell
param(
    [string]$Service = "",
    [int]$Lines = 100
)

Set-Location "$PSScriptRoot\.."

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Tailing container logs (showing last $Lines lines)..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to exit." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

if ($Service -ne "") {
    docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f --tail=$Lines $Service
} else {
    docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f --tail=$Lines
}
