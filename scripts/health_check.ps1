# health_check.ps1 - Health and diagnostics check for PowerShell
Set-Location "$PSScriptRoot\.."

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Checking NewsRoom Service Status..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

docker compose ps

Write-Host "`n----------------------------------------------------------" -ForegroundColor Yellow
Write-Host "Diagnostics" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------" -ForegroundColor Yellow

# Test Nginx
try {
    $res = Invoke-WebRequest -Uri "http://localhost:80" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($res.StatusCode -eq 200 -or $res.StatusCode -eq 301 -or $res.StatusCode -eq 302) {
        Write-Host "✅ Nginx reverse proxy is answering on HTTP port 80." -ForegroundColor Green
    } else {
        Write-Host "⚠️ Nginx responded with status code: $($res.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Nginx did not respond on http://localhost:80: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Next.js
$nextjsHealthy = docker inspect news_nextjs --format '{{.State.Health.Status}}' 2>$null
if ($nextjsHealthy -eq "healthy") {
    Write-Host "✅ Next.js container 'news_nextjs' is healthy." -ForegroundColor Green
} else {
    Write-Host "⚠️ Next.js container status: $nextjsHealthy" -ForegroundColor Yellow
}

# Test Postgres
$postgresHealthy = docker inspect news_postgres --format '{{.State.Health.Status}}' 2>$null
if ($postgresHealthy -eq "healthy") {
    Write-Host "✅ Postgres container 'news_postgres' is healthy." -ForegroundColor Green
} else {
    Write-Host "⚠️ Postgres container status: $postgresHealthy" -ForegroundColor Yellow
}

# Test Redis
$redisHealthy = docker inspect news_redis --format '{{.State.Health.Status}}' 2>$null
if ($redisHealthy -eq "healthy") {
    Write-Host "✅ Redis container 'news_redis' is healthy." -ForegroundColor Green
} else {
    Write-Host "⚠️ Redis container status: $redisHealthy" -ForegroundColor Yellow
}

# Test Meilisearch
$meiliHealthy = docker inspect news_meilisearch --format '{{.State.Health.Status}}' 2>$null
if ($meiliHealthy -eq "healthy") {
    Write-Host "✅ Meilisearch container 'news_meilisearch' is healthy." -ForegroundColor Green
} else {
    Write-Host "⚠️ Meilisearch container status: $meiliHealthy" -ForegroundColor Yellow
}

Write-Host "==========================================================" -ForegroundColor Cyan
