# School ERP - Workspace Rules for LLM Agents

## Project Type
School ERP System - Single school deployment

## Tech Stack
- Backend: Laravel 11, Filament 3, PostgreSQL
- Frontend: Next.js 14, TypeScript, ShadCN UI, TailwindCSS
- Auth: Laravel Sanctum (JWT tokens)

## Critical Rules

1. **READ DOCS FIRST**: Always read `docs/WORK_INDEX.md` before making changes
2. **FOLLOW SCHEMA**: Database schemas are defined in module docs - follow exactly
3. **NO MULTI-TENANCY**: This feature is deferred - do not implement tenant isolation
4. **PostgreSQL**: Use `pgsql` driver, not MySQL
5. **Class Model**: Name it `ClassModel`, not `Class` (reserved keyword)

## File Locations

### Backend (Laravel)
- Models: `backend/app/Models/`
- Controllers: `backend/app/Http/Controllers/`
- Filament Resources: `backend/app/Filament/Resources/`
- Migrations: `backend/database/migrations/`
- Services: `backend/app/Services/`

### Frontend (Next.js)
- Pages: `frontend/app/({panel})/{page}/page.tsx`
- Components: `frontend/components/`
- UI Components: `frontend/components/ui/`
- API Client: `frontend/lib/api.ts`

## Panels
- `(auth)` - Login, forgot password
- `(teacher)` - Teacher dashboard, attendance, marks
- `(payment)` - Fee collection
- `(parent)` - Parent portal
- `(admin)` - Admin features like import wizard

## API Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

## Status Updates
After completing any task, update `docs/WORK_INDEX.md`:
- `🔴 TODO` → `✅ DONE`

## Documentation Files
- `docs/00-project-overview.md` - Master roadmap
- `docs/01-15-*.md` - Module specifications
- `docs/WORK_INDEX.md` - Task tracker
- `docs/SETUP_GUIDE.md` - Local development setup


## Do not verify you implementation on browser ask user to verify.