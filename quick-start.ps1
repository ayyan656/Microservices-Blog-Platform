# Microservices Blog Platform - Quick Start Script (PowerShell)
# This script helps you get started quickly with the platform

$ErrorActionPreference = "Stop"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Microservices Blog Platform Setup" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

try {
    $composeVersion = docker compose version
    Write-Host "✅ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env created. Please edit it with your secure credentials before proceeding." -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Enter to continue with default values, or Ctrl+C to exit and edit .env first." -ForegroundColor Yellow
    Read-Host
}

# Start services
Write-Host "🚀 Starting all services..." -ForegroundColor Cyan
Write-Host ""

docker compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to become healthy..." -ForegroundColor Yellow
Write-Host ""

# Wait for services
Start-Sleep -Seconds 10

# Check service health
Write-Host "🏥 Checking service health..." -ForegroundColor Yellow
Write-Host ""

function Test-ServiceHealth {
    param (
        [string]$Url,
        [string]$Name
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $Name is healthy" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "⚠️  $Name is not responding yet" -ForegroundColor Yellow
        return $false
    }
}

# Give services time to start
Write-Host "Waiting 30 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check each service
Test-ServiceHealth -Url "http://localhost:5000/api/auth/health" -Name "User Service"
Test-ServiceHealth -Url "http://localhost:5001/api/health" -Name "Post Service"
Test-ServiceHealth -Url "http://localhost:5002/api/comments/health" -Name "Comment Service"
Test-ServiceHealth -Url "http://localhost/health" -Name "Nginx Gateway"

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 Service Status:" -ForegroundColor Yellow
docker compose ps
Write-Host ""

Write-Host "🌐 Access Points:" -ForegroundColor Cyan
Write-Host "  - User Service:    http://localhost:5000"
Write-Host "  - Post Service:    http://localhost:5001"
Write-Host "  - Comment Service: http://localhost:5002"
Write-Host "  - API Gateway:     http://localhost"
Write-Host "  - RabbitMQ UI:     http://localhost:15672 (guest/guest)"
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Initialize MySQL schema:"
Write-Host "     Get-Content comment-service\schema.sql | docker compose exec -T mysql mysql -uroot -pSecurePassword123! comment_service_db"
Write-Host ""
Write-Host "  2. View logs:"
Write-Host "     docker compose logs -f"
Write-Host ""
Write-Host "  3. Stop services:"
Write-Host "     docker compose down"
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - DEPLOYMENT.md - Full deployment guide"
Write-Host "  - DEVOPS-AUDIT-REPORT.md - Infrastructure audit report"
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
