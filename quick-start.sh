#!/bin/bash

# Microservices Blog Platform - Quick Start Script
# This script helps you get started quickly with the platform

set -e

echo "=============================================="
echo "  Microservices Blog Platform Setup"
echo "=============================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker found: $(docker --version)"
echo "✅ Docker Compose found: $(docker compose version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ .env created. Please edit it with your secure credentials before proceeding."
    echo ""
    echo "Press Enter to continue with default values, or Ctrl+C to exit and edit .env first."
    read
fi

# Start services
echo "🚀 Starting all services..."
echo ""

docker compose up -d

echo ""
echo "⏳ Waiting for services to become healthy..."
echo ""

# Wait for services
sleep 10

# Check service health
echo "🏥 Checking service health..."
echo ""

check_health() {
    local url=$1
    local name=$2
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo "✅ $name is healthy"
        return 0
    else
        echo "⚠️  $name is not responding yet"
        return 1
    fi
}

# Give services time to start
echo "Waiting 30 seconds for services to initialize..."
sleep 30

# Check each service
check_health "http://localhost:5000/api/auth/health" "User Service"
check_health "http://localhost:5001/api/health" "Post Service"
check_health "http://localhost:5002/api/comments/health" "Comment Service"
check_health "http://localhost/health" "Nginx Gateway"

echo ""
echo "=============================================="
echo "  Setup Complete!"
echo "=============================================="
echo ""
echo "📊 Service Status:"
docker compose ps
echo ""
echo "🌐 Access Points:"
echo "  - User Service:    http://localhost:5000"
echo "  - Post Service:    http://localhost:5001"
echo "  - Comment Service: http://localhost:5002"
echo "  - API Gateway:     http://localhost"
echo "  - RabbitMQ UI:     http://localhost:15672 (guest/guest)"
echo ""
echo "📝 Next Steps:"
echo "  1. Initialize MySQL schema:"
echo "     docker compose exec mysql mysql -uroot -pSecurePassword123! comment_service_db < comment-service/schema.sql"
echo ""
echo "  2. View logs:"
echo "     docker compose logs -f"
echo ""
echo "  3. Stop services:"
echo "     docker compose down"
echo ""
echo "📚 Documentation:"
echo "  - DEPLOYMENT.md - Full deployment guide"
echo "  - DEVOPS-AUDIT-REPORT.md - Infrastructure audit report"
echo ""
echo "=============================================="
