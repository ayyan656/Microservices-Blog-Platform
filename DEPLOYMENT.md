# Microservices Blog Platform - DevOps Documentation

## 🏗️ Architecture Overview

This is a microservices-based blog platform with the following components:

### Application Services
- **User Service** (Port 5000) - Authentication & user management using PostgreSQL
- **Post Service** (Port 5001) - Blog post management using MongoDB
- **Comment Service** (Port 5002) - Comment system using MySQL

### Infrastructure Services
- **PostgreSQL** (Port 5432) - User database
- **MongoDB** (Port 27017) - Post database
- **MySQL** (Port 3306) - Comment database
- **Redis** (Port 6379) - Caching & rate limiting
- **RabbitMQ** (Ports 5672, 15672) - Message broker
- **Nginx** (Ports 80, 443) - API Gateway / Reverse Proxy

---

## 🚀 Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Microservices-Blog-Platform
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your secure credentials
   ```

3. **Start all services**
   ```bash
   docker compose up -d
   ```

4. **Verify all services are healthy**
   ```bash
   docker compose ps
   ```

5. **Check service health endpoints**
   ```bash
   # User service
   curl http://localhost:5000/api/auth/health
   
   # Post service
   curl http://localhost:5001/api/health
   
   # Comment service
   curl http://localhost:5002/api/comments/health
   
   # Nginx gateway
   curl http://localhost/health
   ```

---

## 📋 Service Health Checks

All services implement comprehensive health checks:

| Service | Endpoint | Interval | Timeout | Start Period |
|---------|----------|----------|---------|--------------|
| PostgreSQL | `pg_isready` | 10s | 5s | 10s |
| MongoDB | `mongosh ping` | 10s | 5s | 10s |
| MySQL | `mysqladmin ping` | 10s | 5s | 30s |
| Redis | `redis-cli ping` | 10s | 5s | 5s |
| RabbitMQ | `rabbitmq-diagnostics` | 10s | 5s | 30s |
| User Service | `/api/auth/health` | 15s | 5s | 30s |
| Post Service | `/api/health` | 15s | 5s | 30s |
| Comment Service | `/api/comments/health` | 15s | 5s | 30s |
| Nginx | `nginx -t` | 30s | 10s | N/A |

---

## 🔄 Dependency Management

The compose file ensures proper startup order:

```
Infrastructure Layer:
  └─ postgres, mongodb, mysql, redis, rabbitmq (parallel start)

Application Layer (waits for infrastructure):
  └─ user-service, post-service, comment-service (parallel start)

Gateway Layer (waits for applications):
  └─ nginx
```

---

## 🔧 Common Operations

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f user-service

# Last 100 lines
docker compose logs --tail=100 user-service
```

### Restart a Service
```bash
docker compose restart user-service
```

### Rebuild After Code Changes
```bash
docker compose up -d --build user-service
```

### Stop All Services
```bash
docker compose down
```

### Stop and Remove Volumes (⚠️ Deletes all data)
```bash
docker compose down -v
```

### Access RabbitMQ Management UI
```
URL: http://localhost:15672
Username: guest
Password: guest
```

---

## 🌐 API Routes via Nginx

| Route | Target Service | Example |
|-------|---------------|---------|
| `/api/auth/*` | user-service:5000 | `GET /api/auth/health` |
| `/users/*` | user-service:5000 | `POST /users/register` |
| `/api/posts*` | post-service:5001 | `GET /api/posts` |
| `/posts/*` | post-service:5001 | `GET /posts/123` |
| `/api/comments*` | comment-service:5002 | `POST /api/comments` |
| `/comments/*` | comment-service:5002 | `GET /comments/post/123` |

---

## 🗄️ Database Initialization

### PostgreSQL (User Service)
The service automatically connects. If you need to run migrations:
```bash
docker compose exec user-service npm run migrate
```

### MongoDB (Post Service)
Auto-initialized on first connection.

### MySQL (Comment Service)
Create the comments table:
```bash
docker compose exec mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} comment_service_db
```

```sql
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id INT NULL,
  status ENUM('active', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id),
  INDEX idx_parent_comment_id (parent_comment_id)
);
```

---

## 🔐 Security Recommendations

### Production Deployment
1. **Change all default passwords** in `.env`
2. **Generate strong JWT secret**: `openssl rand -base64 64`
3. **Enable TLS/SSL** for nginx
4. **Use secure secrets manager** (AWS Secrets Manager, HashiCorp Vault)
5. **Enable Redis authentication**
6. **Configure RabbitMQ with secure credentials**
7. **Set up firewall rules** to restrict port access
8. **Enable container security scanning**

---

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker compose logs service-name

# Check if port is already in use
netstat -tulpn | grep PORT_NUMBER

# Verify docker daemon
docker ps
```

### Database Connection Failed
```bash
# Check if database is healthy
docker compose ps

# Restart database
docker compose restart postgres

# Check environment variables
docker compose exec user-service env | grep DB_
```

### Redis Connection Issues
```bash
# Test Redis connection
docker compose exec redis redis-cli ping

# Should return: PONG
```

### RabbitMQ Connection Failed
```bash
# Check RabbitMQ status
docker compose exec rabbitmq rabbitmq-diagnostics status

# Access management UI
# http://localhost:15672
```

---

## 📊 Monitoring

### Container Stats
```bash
docker stats
```

### Resource Usage
```bash
docker compose top
```

### Network Inspection
```bash
docker network inspect blog-platform-network
```

---

## 🚢 CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/ci.yml`) with:

1. **Lint & Test** - Runs for each service
2. **Build** - Docker image builds with caching
3. **Integration Test** - Full stack health checks
4. **Security Scan** - Trivy vulnerability scanning
5. **Push** - Pushes to Docker Hub (main branch only)

### Required Secrets
Add these to GitHub repository secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

---

## 📦 Data Persistence

All data is persisted in named Docker volumes:

- `blog-postgres-data` - User data
- `blog-mongodb-data` - Post data
- `blog-mysql-data` - Comment data
- `blog-redis-data` - Cache data
- `blog-rabbitmq-data` - Message queue data

### Backup Volumes
```bash
# Backup example for postgres
docker run --rm -v blog-postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data
```

---

## 🔄 Update Strategy

### Zero-Downtime Deployment
```bash
# Build new images
docker compose build

# Rolling update
docker compose up -d --no-deps --build user-service
docker compose up -d --no-deps --build post-service
docker compose up -d --no-deps --build comment-service
```

---

## 📞 Support

For issues and questions:
- Check logs: `docker compose logs -f`
- Review this documentation
- Check health endpoints
- Inspect container status: `docker compose ps`
