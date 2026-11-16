# 🐳 Module 15: Docker Deployment

> **Priority**: 🔴 Critical (for deployment)  
> **Dependencies**: All modules  
> **Phase**: 6 (Testing & Launch)  
> **Duration**: Week 23-24

---

## 📋 Overview

This module provides complete Docker configuration for schools to run their own self-hosted ERP server. The setup includes Laravel backend, Next.js frontend, PostgreSQL database, Redis cache, and Nginx reverse proxy.

---

## 🔌 Port Configuration

| Service | Internal Port | External Port | Description |
|---------|---------------|---------------|-------------|
| **Nginx** (Web) | 80 | **8080** | Main web entry point |
| **Nginx** (HTTPS) | 443 | **8443** | Secure web entry (SSL) |
| **Laravel API** | 9000 | - | PHP-FPM (internal only) |
| **Next.js Frontend** | 3000 | - | Node.js (internal only) |
| **PostgreSQL** | 5432 | **5432** | Database (optional external) |
| **Redis** | 6379 | - | Cache (internal only) |
| **Biometric Sync** | 4370 | **4370** | ZKTeco device port |
| **Filament Admin** | 80 | **8080/admin** | Admin panel via Nginx |

### Quick Reference
```
School ERP Access Points:
─────────────────────────
🌐 Main App:        http://school-server:8080
🔐 Admin Panel:     http://school-server:8080/admin
📡 API Endpoint:    http://school-server:8080/api
🗄️ Database:        school-server:5432
🖐️ Biometric:       school-server:4370
```

---

## 📁 File Structure

```
all-in-one-erp/
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── sites/
│   │       └── default.conf
│   ├── php/
│   │   ├── Dockerfile
│   │   └── php.ini
│   ├── node/
│   │   └── Dockerfile
│   └── postgres/
│       └── init.sql
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.docker
└── Makefile
```

---

## 🐳 Docker Compose Configuration

See: [docker-compose.yml](file:///c:/xampp/htdocs/all-in-one-erp/docker-compose.yml)

### Services Overview

```yaml
services:
  nginx       → Reverse proxy (ports 8080, 8443)
  backend     → Laravel PHP-FPM
  frontend    → Next.js Node.js
  postgres    → PostgreSQL 16
  redis       → Redis 7
  queue       → Laravel Queue Worker
  scheduler   → Laravel Task Scheduler
```

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Minimum 4GB RAM available
- Ports 8080, 8443, 5432 available

### 1. Clone and Configure
```bash
# Clone the repository
git clone https://github.com/your-org/school-erp.git
cd school-erp

# Copy environment file
cp .env.docker .env

# Edit configuration
nano .env
```

### 2. Start Services
```bash
# Build and start all containers
docker-compose up -d --build

# Watch logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Initialize Database
```bash
# Run migrations
docker-compose exec backend php artisan migrate --seed

# Create admin user
docker-compose exec backend php artisan make:admin
```

### 4. Access the System
- **Web App**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin
- **API**: http://localhost:8080/api

---

## 🔧 Configuration Files

### Main docker-compose.yml
Located at project root - see the actual file for full configuration.

### Environment Variables (.env.docker)
```env
# Application
APP_NAME="School ERP"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8080

# Database
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=school_erp
DB_USERNAME=school_erp
DB_PASSWORD=your_secure_password_here

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis

# Mail (SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=

# SMS Gateway
MSG91_KEY=your_msg91_key
MSG91_SENDER_ID=SCHOOL

# Payment Gateway
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Biometric
BIOMETRIC_SYNC_ENABLED=true
BIOMETRIC_SYNC_PORT=4370
```

---

## 🖥️ Production Deployment

### Using docker-compose.prod.yml
```bash
# Deploy with production config
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Enable SSL (Let's Encrypt)
docker-compose exec nginx certbot --nginx -d school.example.com
```

### SSL Certificate Setup
1. Point domain to server IP
2. Run certbot in nginx container
3. Auto-renewal is configured

### Backup Strategy
```bash
# Database backup
docker-compose exec postgres pg_dump -U school_erp school_erp > backup.sql

# Full backup (including files)
docker-compose exec backend php artisan backup:run
```

---

## 📊 Resource Requirements

### Minimum (Small School - up to 500 students)
| Resource | Requirement |
|----------|-------------|
| CPU | 2 cores |
| RAM | 4 GB |
| Storage | 50 GB SSD |
| Bandwidth | 10 Mbps |

### Recommended (Medium School - up to 2000 students)
| Resource | Requirement |
|----------|-------------|
| CPU | 4 cores |
| RAM | 8 GB |
| Storage | 100 GB SSD |
| Bandwidth | 50 Mbps |

### Large (Big School - 2000+ students)
| Resource | Requirement |
|----------|-------------|
| CPU | 8 cores |
| RAM | 16 GB |
| Storage | 250 GB SSD |
| Bandwidth | 100 Mbps |

---

## 🛠️ Makefile Commands

```makefile
# Quick commands
make up          # Start all services
make down        # Stop all services
make logs        # View logs
make shell       # Enter backend container
make migrate     # Run migrations
make seed        # Seed database
make backup      # Create backup
make restore     # Restore from backup
```

---

## 🔐 Security Checklist

- [ ] Change default database password
- [ ] Configure firewall (allow only 8080, 8443, 4370)
- [ ] Enable SSL certificate
- [ ] Set APP_DEBUG=false
- [ ] Configure backup schedule
- [ ] Set up monitoring alerts
- [ ] Restrict PostgreSQL external access

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose up -d --build --force-recreate
```

### Database connection error
```bash
# Check if postgres is running
docker-compose ps postgres

# Test connection
docker-compose exec backend php artisan db:monitor
```

### Biometric device not connecting
```bash
# Check port is open
netstat -an | grep 4370

# Test from device network
telnet school-server 4370
```

---

## 📝 Implementation Checklist

- [x] Create docker-compose.yml
- [x] Create Dockerfiles for each service
- [x] Create nginx configuration
- [x] Create production compose file
- [x] Create .env.docker template
- [x] Create Makefile with commands
- [x] Document all ports and services
- [ ] Test deployment on fresh server
- [ ] Create backup/restore scripts
- [ ] Add health check endpoints

---

> 📝 **Next Step**: See the actual Docker files created in the project root.
