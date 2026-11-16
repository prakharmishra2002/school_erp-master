# ═══════════════════════════════════════════════════════════════════════════════
# 🏫 SCHOOL ERP - Makefile Commands
# ═══════════════════════════════════════════════════════════════════════════════
# Quick commands for Docker management
# Usage: make <command>
# ═══════════════════════════════════════════════════════════════════════════════

.PHONY: help up down restart logs shell migrate seed backup restore fresh

# Default command
help:
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════════════╗"
	@echo "║           🏫 SCHOOL ERP - Docker Management Commands               ║"
	@echo "╠════════════════════════════════════════════════════════════════════╣"
	@echo "║                                                                    ║"
	@echo "║  BASIC COMMANDS:                                                   ║"
	@echo "║  ──────────────                                                    ║"
	@echo "║    make up          - Start all containers                         ║"
	@echo "║    make down        - Stop all containers                          ║"
	@echo "║    make restart     - Restart all containers                       ║"
	@echo "║    make logs        - View container logs                          ║"
	@echo "║    make status      - Show container status                        ║"
	@echo "║                                                                    ║"
	@echo "║  DEVELOPMENT:                                                      ║"
	@echo "║  ────────────                                                      ║"
	@echo "║    make shell       - Enter backend container shell                ║"
	@echo "║    make shell-db    - Enter PostgreSQL shell                       ║"
	@echo "║    make artisan     - Run artisan command (make artisan cmd=...)   ║"
	@echo "║                                                                    ║"
	@echo "║  DATABASE:                                                         ║"
	@echo "║  ─────────                                                         ║"
	@echo "║    make migrate     - Run database migrations                      ║"
	@echo "║    make seed        - Seed database with demo data                 ║"
	@echo "║    make fresh       - Fresh migration + seed (DESTRUCTIVE!)        ║"
	@echo "║    make backup      - Create database backup                       ║"
	@echo "║    make restore     - Restore from backup                          ║"
	@echo "║                                                                    ║"
	@echo "║  BUILD:                                                            ║"
	@echo "║  ──────                                                            ║"
	@echo "║    make build       - Build all containers                         ║"
	@echo "║    make rebuild     - Force rebuild all containers                 ║"
	@echo "║                                                                    ║"
	@echo "║  PORTS EXPOSED:                                                    ║"
	@echo "║  ──────────────                                                    ║"
	@echo "║    8080  - Web Application (HTTP)                                  ║"
	@echo "║    8443  - Web Application (HTTPS)                                 ║"
	@echo "║    5432  - PostgreSQL Database                                     ║"
	@echo "║    4370  - Biometric Device Port                                   ║"
	@echo "║                                                                    ║"
	@echo "╚════════════════════════════════════════════════════════════════════╝"
	@echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 BASIC COMMANDS
# ═══════════════════════════════════════════════════════════════════════════════

up:
	@echo "🚀 Starting School ERP containers..."
	docker-compose up -d
	@echo "✅ Containers started!"
	@echo ""
	@echo "📍 Access points:"
	@echo "   Web App:    http://localhost:8080"
	@echo "   Admin:      http://localhost:8080/admin"
	@echo "   API:        http://localhost:8080/api"
	@echo ""

down:
	@echo "🛑 Stopping containers..."
	docker-compose down
	@echo "✅ Containers stopped!"

restart:
	@echo "🔄 Restarting containers..."
	docker-compose restart
	@echo "✅ Containers restarted!"

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-nginx:
	docker-compose logs -f nginx

status:
	docker-compose ps

# ═══════════════════════════════════════════════════════════════════════════════
# 🛠️ DEVELOPMENT
# ═══════════════════════════════════════════════════════════════════════════════

shell:
	docker-compose exec backend sh

shell-db:
	docker-compose exec postgres psql -U school_erp -d school_erp

# Run arbitrary artisan command: make artisan cmd="migrate:status"
artisan:
	docker-compose exec backend php artisan $(cmd)

composer:
	docker-compose exec backend composer $(cmd)

npm:
	docker-compose exec frontend npm $(cmd)

# ═══════════════════════════════════════════════════════════════════════════════
# 🗄️ DATABASE
# ═══════════════════════════════════════════════════════════════════════════════

migrate:
	@echo "📦 Running migrations..."
	docker-compose exec backend php artisan migrate --force
	@echo "✅ Migrations complete!"

seed:
	@echo "🌱 Seeding database..."
	docker-compose exec backend php artisan db:seed --force
	@echo "✅ Seeding complete!"

fresh:
	@echo "⚠️  This will DELETE all data and recreate the database!"
	@read -p "Are you sure? (y/N) " confirm && [ "$$confirm" = "y" ]
	docker-compose exec backend php artisan migrate:fresh --seed --force
	@echo "✅ Fresh migration complete!"

backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	docker-compose exec postgres pg_dump -U school_erp school_erp > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup saved to backups/"

restore:
	@echo "📥 Restoring from backup..."
	@read -p "Enter backup filename: " file && \
	docker-compose exec -T postgres psql -U school_erp school_erp < backups/$$file
	@echo "✅ Restore complete!"

# ═══════════════════════════════════════════════════════════════════════════════
# 🔨 BUILD
# ═══════════════════════════════════════════════════════════════════════════════

build:
	@echo "🔨 Building containers..."
	docker-compose build
	@echo "✅ Build complete!"

rebuild:
	@echo "🔨 Force rebuilding containers..."
	docker-compose build --no-cache
	@echo "✅ Rebuild complete!"

# First time setup
setup:
	@echo "🚀 Setting up School ERP for the first time..."
	@cp -n .env.docker .env || true
	@echo "📝 Please edit .env file with your settings"
	@read -p "Press Enter when ready..."
	docker-compose up -d --build
	@echo "⏳ Waiting for database to be ready..."
	@sleep 10
	docker-compose exec backend php artisan key:generate --force
	docker-compose exec backend php artisan migrate --force
	docker-compose exec backend php artisan db:seed --force
	docker-compose exec backend php artisan storage:link
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════════════╗"
	@echo "║                    ✅ SETUP COMPLETE!                              ║"
	@echo "╠════════════════════════════════════════════════════════════════════╣"
	@echo "║                                                                    ║"
	@echo "║  🌐 Web App:     http://localhost:8080                             ║"
	@echo "║  🔐 Admin Panel: http://localhost:8080/admin                       ║"
	@echo "║                                                                    ║"
	@echo "║  Default Admin Login:                                              ║"
	@echo "║    Email:    admin@school.com                                      ║"
	@echo "║    Password: password                                              ║"
	@echo "║                                                                    ║"
	@echo "║  ⚠️  Change the password after first login!                        ║"
	@echo "║                                                                    ║"
	@echo "╚════════════════════════════════════════════════════════════════════╝"
	@echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 🧹 CLEANUP
# ═══════════════════════════════════════════════════════════════════════════════

clean:
	@echo "🧹 Cleaning up unused Docker resources..."
	docker-compose down -v --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup complete!"

# Remove everything including volumes (DESTRUCTIVE!)
nuke:
	@echo "☢️  This will DELETE EVERYTHING including all data!"
	@read -p "Are you REALLY sure? Type 'yes' to confirm: " confirm && [ "$$confirm" = "yes" ]
	docker-compose down -v --remove-orphans
	docker system prune -af --volumes
	@echo "💥 Everything has been removed!"
