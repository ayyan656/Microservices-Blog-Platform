# 🚀 Microservices Blog Platform

A production-ready microservices architecture for a blog platform with authentication, posts, and comments.

## 🏗️ Architecture

```
┌─────────────────┐
│   API Gateway   │ ← Nginx (Port 80/443)
│    (Nginx)      │
└────────┬────────┘
         │
    ┌────┴─────────────────┬──────────────────┐
    │                      │                  │
┌───▼────────┐    ┌───────▼──────┐    ┌─────▼────────┐
│   User     │    │    Post      │    │   Comment    │
│  Service   │    │   Service    │    │   Service    │
│  (Port     │    │  (Port       │    │  (Port       │
│   5000)    │    │   5001)      │    │   5002)      │
└───┬────────┘    └───────┬──────┘    └─────┬────────┘
    │                     │                  │
    │                     │                  │
┌───▼────────┐    ┌───────▼──────┐    ┌─────▼────────┐
│ PostgreSQL │    │   MongoDB    │    │    MySQL     │
└────────────┘    └──────────────┘    └──────────────┘
         │                │                  │
         └────────────────┼──────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
        ┌─────▼──────┐          ┌────▼──────┐
        │   Redis    │          │ RabbitMQ  │
        │  (Cache)   │          │ (Queue)   │
        └────────────┘          └───────────┘
```

## ✨ Features

- **User Service**: Authentication, JWT tokens, user management (PostgreSQL)
- **Post Service**: Blog post CRUD, author management (MongoDB)
- **Comment Service**: Threaded comments, notifications (MySQL)
- **Message Queue**: Event-driven architecture with RabbitMQ
- **Caching**: Redis for performance optimization
- **API Gateway**: Nginx reverse proxy with load balancing
- **Health Checks**: Comprehensive monitoring for all services
- **CI/CD**: Automated testing and deployment pipeline

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows (PowerShell):**
```powershell
.\quick-start.ps1
```

**Linux/Mac:**
```bash
chmod +x quick-start.sh
./quick-start.sh
```

### Option 2: Manual Setup

1. **Prerequisites**
   - Docker 20.10+
   - Docker Compose 2.0+
   - 4GB RAM, 10GB disk space

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your secure credentials
   ```

3. **Start All Services**
   ```bash
   docker compose up -d
   ```

4. **Initialize Database** (MySQL only)
   ```bash
   # Linux/Mac
   docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD comment_service_db < comment-service/schema.sql
   
   # Windows PowerShell
   Get-Content comment-service\schema.sql | docker compose exec -T mysql mysql -uroot -pSecurePassword123! comment_service_db
   ```

5. **Verify Services**
   ```bash
   docker compose ps
   curl http://localhost/health
   ```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Complete deployment & operations guide |
| [DEVOPS-AUDIT-REPORT.md](DEVOPS-AUDIT-REPORT.md) | Infrastructure audit & stability report |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | CI/CD pipeline configuration |

## 🌐 Service Endpoints

### Via API Gateway (Nginx)
- **Gateway Health**: `GET http://localhost/health`
- **User Auth**: `POST http://localhost/api/auth/register`
- **Login**: `POST http://localhost/api/auth/login`
- **Posts**: `GET http://localhost/api/posts`
- **Comments**: `GET http://localhost/api/comments`

### Direct Access
- **User Service**: http://localhost:5000
- **Post Service**: http://localhost:5001
- **Comment Service**: http://localhost:5002
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## 🛠️ Development

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f user-service
```

### Rebuild Service
```bash
docker compose up -d --build user-service
```

### Stop Services
```bash
docker compose down
```

### Remove All Data (⚠️ Destructive)
```bash
docker compose down -v
```

## 🗂️ Project Structure

```
Microservices-Blog-Platform/
├── user-service/          # Authentication & user management
│   ├── Controllers/       # Request handlers
│   ├── Models/            # Data models
│   ├── Routes/            # API routes
│   ├── Middleware/        # Auth, validation
│   ├── config/            # DB, Redis, RabbitMQ
│   └── Dockerfile/        # Container config
├── post-service/          # Blog post management
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── config/
│   └── Dockerfile/
├── comment-service/       # Comment system
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── config/
│   ├── consumers/         # RabbitMQ consumers
│   └── Dockerfile/
├── nginx/                 # API Gateway
│   ├── default.conf       # Routing config
│   └── ssl.conf           # SSL config
├── .github/workflows/     # CI/CD pipelines
├── docker-compose.yml     # Orchestration
├── .env.example           # Config template
└── Documentation (this file)
```

## 🔐 Security

### Development
- Default credentials in `.env.example`
- Suitable for local development only

### Production Checklist
- [ ] Generate strong JWT secret: `openssl rand -base64 64`
- [ ] Use unique database passwords (16+ characters)
- [ ] Enable Redis authentication
- [ ] Configure RabbitMQ with secure credentials
- [ ] Set up TLS/SSL certificates
- [ ] Use secrets manager (AWS Secrets Manager, Vault)
- [ ] Enable container security scanning
- [ ] Implement rate limiting
- [ ] Set up centralized logging
- [ ] Configure backup strategy

## 📊 Monitoring

### Health Checks
```bash
# User Service
curl http://localhost:5000/api/auth/health

# Post Service
curl http://localhost:5001/api/health

# Comment Service
curl http://localhost:5002/api/comments/health

# Gateway
curl http://localhost/health
```

### Container Stats
```bash
docker stats
```

### Resource Usage
```bash
docker compose top
```

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check logs
docker compose logs service-name

# Check Docker daemon
docker ps

# Restart specific service
docker compose restart service-name
```

### Port Conflicts
```bash
# On Windows
netstat -ano | findstr :5000

# On Linux/Mac
lsof -i :5000
```

### Database Connection Issues
```bash
# Restart database
docker compose restart postgres

# Check connection
docker compose exec user-service env | grep DB_
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive troubleshooting guide.

## 🧪 Testing

### Automated Tests (CI/CD)
Tests run automatically on push/PR via GitHub Actions:
- Lint & Code Quality
- Unit Tests
- Integration Tests
- Security Scanning

### Manual Testing
```bash
# Run tests for a service
docker compose exec user-service npm test

# Integration test
./quick-start.sh  # Runs health checks
```

## 📈 Performance

### Startup Times
- Infrastructure: 10-30s
- Application Services: 20-40s
- Total: 40-60s

### Resource Requirements (Idle)
- CPU: ~1.5 cores
- Memory: ~2.5GB
- Disk: ~2GB + data volumes

## 🚢 Deployment

### Docker Hub
CI/CD automatically pushes to Docker Hub on main branch.

Required secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### Production Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Zero-downtime deployment
- Scaling strategies
- Backup procedures
- Disaster recovery

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

- 📧 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Docs: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🔍 Audit: [DEVOPS-AUDIT-REPORT.md](DEVOPS-AUDIT-REPORT.md)

## ✅ Status

**Infrastructure**: ✅ Production Ready  
**CI/CD**: ✅ Configured  
**Documentation**: ✅ Complete  
**Security**: ⚠️ Development Mode (see Security section)

---

**Built with** 💙 using Node.js, Express, PostgreSQL, MongoDB, MySQL, Redis, RabbitMQ, Docker, and Nginx.
