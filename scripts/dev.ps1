# dev.ps1 - Start news-website with live Hot-Reload in Docker

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $ScriptDir "..")

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Starting NewsRoom in LIVE HOT-RELOAD Dev Mode..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan


if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file is missing." -ForegroundColor Red
    exit 1
}



Write-Host "📦 Building & launching nextjs dev container with live volume mount..." -ForegroundColor Yellow
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build nextjs
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "🔥 LIVE HOT-RELOAD IS ACTIVE!" -ForegroundColor Green
Write-Host "🌐 Open in browser: http://localhost/" -ForegroundColor Green
Write-Host "💡 Edit any file & save (Ctrl+S) -> changes appear in 1 second!" -ForegroundColor Green
Write-Host "📜 To watch live logs: docker compose logs -f nextjs" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green





