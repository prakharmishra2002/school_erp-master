---
description: How to work on the School ERP project - rules and conventions for LLM agents
---

# School ERP Project - LLM Agent Workflow

## 🎯 Project Context

This is a **School ERP system** for a single school deployment with:
- **Backend**: Laravel 11 + Filament 3 (Admin Panel) + PostgreSQL
- **Frontend**: Next.js 14 + TypeScript + ShadCN UI + TailwindCSS
- **Documentation**: Located in `docs/` folder

## 📁 Key Locations

```
all-in-one-erp/
├── docs/                    # 📚 READ THESE FIRST
│   ├── 00-project-overview.md    # Master roadmap
│   ├── 01-authentication.md      # Start here for auth
│   ├── WORK_INDEX.md             # Task status tracker
│   └── SETUP_GUIDE.md            # Local dev setup
├── backend/                 # 🔧 Laravel application
│   ├── app/Models/          # Eloquent models
│   ├── app/Http/Controllers/# API controllers
│   ├── app/Filament/        # Admin panel resources
│   ├── app/Services/        # Business logic
│   └── database/migrations/ # Database schema
├── frontend/                # 💻 Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable components
│   └── lib/                 # API client, utilities
└── docker/                  # 🐳 Docker configs
```

## 📋 Before Starting Any Work

// turbo-all
1. Read `docs/WORK_INDEX.md` to see current progress
2. Read the relevant module doc (e.g., `docs/05-student-management.md`)
3. Check if dependencies are complete (see module dependencies)
4. Follow the database schema EXACTLY as documented

## 🔧 Backend Development Rules

### Creating a New Model
```php
// Location: backend/app/Models/{ModelName}.php
// Follow the schema from docs, include:
// - All fillable fields
// - Proper casts for JSON/dates
// - Relationships
// - Any helper methods
```

### Creating a Migration
```bash
php artisan make:migration create_{table_name}_table
# Follow the SQL schema from the module doc EXACTLY
```

### Creating a Filament Resource
```bash
php artisan make:filament-resource {ModelName}
# Include: form, table, relations as per module doc
```

### Creating an API Controller
```bash
php artisan make:controller {Name}Controller --api
# Follow the API endpoints from module doc
# Always return JSON with consistent format:
# { "success": true, "data": {...}, "message": "..." }
```

## 💻 Frontend Development Rules

### Page Structure
```typescript
// Location: frontend/app/({panel})/{page}/page.tsx
// Panels: (auth), (teacher), (payment), (parent), (admin)
```

### Component Naming
- Use PascalCase: `StudentCard.tsx`
- UI primitives in: `components/ui/`
- Feature components in: `components/`

### API Calls
```typescript
// Use the api client from lib/api.ts
import api from '@/lib/api';
const response = await api.get('/endpoint');
```

### State Management
- Local state: `useState`
- Server state: `@tanstack/react-query`
- Global state: `zustand` (if needed)

## ✅ After Completing Work

1. Update `docs/WORK_INDEX.md`:
   - Change status: `🔴 TODO` → `✅ DONE`
   - Add any new files created
   
2. Test the implementation:
   - Run migrations: `php artisan migrate`
   - Test API endpoints with curl or Postman
   - Check Filament admin panel
   - Test frontend pages

3. Document any deviations from the spec

## 🚨 Common Gotchas

1. **PostgreSQL not MySQL**: Use `pgsql` driver, not `mysql`
2. **Class is reserved**: Use `ClassModel` for the model name
3. **JSON columns**: Cast as `array` in Laravel models
4. **Dates**: Use Carbon, cast as `date` or `datetime`
5. **Multi-tenancy is DEFERRED**: Don't implement tenant isolation

## 📝 Code Style

### PHP (Laravel)
- PSR-12 coding standard
- Use type hints for parameters and returns
- Use Eloquent relationships, not raw joins

### TypeScript (Next.js)
- Strict mode enabled
- Interface for all props
- Async/await over .then()

## 🔗 Module Dependencies

```
Auth (01) → Users (03) → Academic (04) → Students (05) / Teachers (06)
                                      ↓
                              Attendance (07)
                              Fees (08)
                              Exams (09)
```

Always implement dependencies first!

## 🏷️ Priority Legend

- **P0**: Critical, blocks other work
- **P1**: Important, do after P0
- **P2**: Nice to have, can defer

## 📚 Reference Docs

| Need | Read |
|------|------|
| Database schema | Module doc (01-15) |
| API endpoints | Module doc |
| UI components | Module doc frontend section |
| Setup help | `SETUP_GUIDE.md` |
| Task status | `WORK_INDEX.md` |
| Docker deploy | `15-docker-deployment.md` |
