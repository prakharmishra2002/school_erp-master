# 🏢 Module 02: Multi-Tenancy System

> ⚠️ **DEFERRED TO PHASE 2** - Not required for initial single-school deployment

> **Priority**: � Future Enhancement  
> **Dependencies**: Authentication (Module 01)  
> **Phase**: 2 (Future - Multi-School Support)  
> **Duration**: To be determined

---

## 📋 Current Status

**This module is NOT required for the initial release.** The ERP will first be built for a **single school deployment**. Multi-tenancy will be added in a future phase when:

1. ✅ Single-school version is fully functional and tested
2. ✅ Core modules are stable and production-ready
3. ✅ There's demand for multi-school SaaS deployment

For now, all data will be stored in a single database schema without tenant isolation.

---

## 📋 Overview (For Future Reference)

Multi-tenancy enables a single deployment to serve multiple schools, each with completely isolated data. This module implements schema-based isolation using PostgreSQL, where each school (tenant) has its own database schema.

---

## 🎯 Features

### Backend Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Tenant Registration | Create new school accounts | 🔴 Critical |
| Schema Isolation | Separate database schema per school | 🔴 Critical |
| Subdomain Routing | school1.erp.com, school2.erp.com | 🔴 Critical |
| Tenant Switching | Super admin can switch between schools | 🟡 High |
| Tenant Configuration | School branding, settings per tenant | 🟢 Medium |

### Frontend Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Subdomain Detection | Identify tenant from URL | 🔴 Critical |
| Super Admin Panel | Manage all tenants | 🟡 High |

---

## 🗄️ Database Schema

### Central Database (public schema)

#### Table: `tenants`
```sql
CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL, -- subdomain: 'abc' for abc.erp.com
    database_name VARCHAR(255), -- NULL for schema-based
    schema_name VARCHAR(255) NOT NULL, -- 'tenant_abc'
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    subscription_plan ENUM('starter', 'growth', 'pro', 'enterprise') DEFAULT 'starter',
    subscription_expires_at DATE,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_domain ON tenants(domain);
CREATE INDEX idx_tenants_active ON tenants(is_active);
```

#### Table: `tenant_users` (Super admin ↔ tenant mapping)
```sql
CREATE TABLE tenant_users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    is_owner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, user_id)
);
```

---

## 🏗️ Multi-Tenancy Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                          │
├─────────────────────────────────────────────────────────────────┤
│  public (shared schema)                                         │
│  ─────────────────────                                          │
│  • tenants                                                      │
│  • users (super_admin only)                                     │
│  • subscription_plans                                           │
│  • billing                                                      │
├─────────────────────────────────────────────────────────────────┤
│  tenant_school_abc                                              │
│  ────────────────────                                           │
│  • users (school users)                                         │
│  • students                                                     │
│  • teachers                                                     │
│  • classes                                                      │
│  • fee_payments                                                 │
│  • ... (all school data)                                        │
├─────────────────────────────────────────────────────────────────┤
│  tenant_school_xyz                                              │
│  ────────────────────                                           │
│  • users (school users)                                         │
│  • students                                                     │
│  • ... (isolated data)                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Tenant Management (Super Admin Only)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/tenants` | List all tenants | Super Admin |
| POST | `/api/admin/tenants` | Create new tenant | Super Admin |
| GET | `/api/admin/tenants/{id}` | Get tenant details | Super Admin |
| PUT | `/api/admin/tenants/{id}` | Update tenant | Super Admin |
| DELETE | `/api/admin/tenants/{id}` | Deactivate tenant | Super Admin |
| POST | `/api/admin/tenants/{id}/switch` | Switch to tenant context | Super Admin |

### Current Tenant

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tenant` | Get current tenant info | Any User |

---

## 🖥️ Backend Implementation

### Package: spatie/laravel-multitenancy

```bash
composer require spatie/laravel-multitenancy
php artisan vendor:publish --tag="multitenancy-config"
php artisan vendor:publish --tag="multitenancy-migrations"
```

### File Structure
```
backend/
├── app/
│   ├── Models/
│   │   └── Tenant.php
│   ├── Http/
│   │   ├── Middleware/
│   │   │   └── IdentifyTenant.php
│   │   └── Controllers/
│   │       └── TenantController.php
│   └── Providers/
│       └── TenancyServiceProvider.php
├── config/
│   └── multitenancy.php
└── database/
    └── migrations/
        ├── landlord/              # Central migrations
        │   └── create_tenants_table.php
        └── tenant/                # Per-tenant migrations
            └── create_students_table.php
```

### Key Code: Tenant Model
```php
<?php

namespace App\Models;

use Spatie\Multitenancy\Models\Tenant as BaseTenant;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class Tenant extends BaseTenant
{
    use UsesTenantConnection;

    protected $fillable = [
        'name',
        'domain',
        'schema_name',
        'logo_url',
        'primary_color',
        'address',
        'phone',
        'email',
        'subscription_plan',
        'subscription_expires_at',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'subscription_expires_at' => 'date',
    ];

    public function getDatabaseName(): string
    {
        return config('database.connections.pgsql.database');
    }

    public static function findByDomain(string $domain): ?self
    {
        return static::where('domain', $domain)
            ->where('is_active', true)
            ->first();
    }
}
```

### Key Code: Tenant Identification Middleware
```php
<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Spatie\Multitenancy\Exceptions\NoCurrentTenant;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        // Get subdomain from host
        $host = $request->getHost();
        $parts = explode('.', $host);
        
        // Assume format: subdomain.domain.com
        if (count($parts) >= 3) {
            $subdomain = $parts[0];
        } else {
            // Check for header (useful for API requests)
            $subdomain = $request->header('X-Tenant-Domain');
        }

        if (!$subdomain) {
            throw new NoCurrentTenant('No tenant identified');
        }

        $tenant = Tenant::findByDomain($subdomain);

        if (!$tenant) {
            abort(404, 'School not found');
        }

        // Set the current tenant
        $tenant->makeCurrent();

        // Switch to tenant's schema
        \DB::statement("SET search_path TO {$tenant->schema_name}");

        return $next($request);
    }
}
```

### Key Code: config/multitenancy.php
```php
<?php

return [
    'tenant_model' => App\Models\Tenant::class,
    
    'current_tenant_container_key' => 'currentTenant',

    'switch_tenant_tasks' => [
        \Spatie\Multitenancy\Tasks\SwitchTenantDatabaseTask::class,
    ],

    'tenant_finder' => \App\TenantFinders\DomainTenantFinder::class,
];
```

### Key Code: Tenant Creation Service
```php
<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class TenantService
{
    public function createTenant(array $data): Tenant
    {
        $schemaName = 'tenant_' . $this->generateSlug($data['name']);

        // Create tenant record in central database
        $tenant = Tenant::create([
            'name' => $data['name'],
            'domain' => $data['domain'],
            'schema_name' => $schemaName,
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'subscription_plan' => $data['plan'] ?? 'starter',
        ]);

        // Create schema
        DB::statement("CREATE SCHEMA IF NOT EXISTS {$schemaName}");

        // Run tenant migrations in new schema
        $tenant->makeCurrent();
        Artisan::call('migrate', [
            '--path' => 'database/migrations/tenant',
            '--force' => true,
        ]);

        // Create default admin user for this tenant
        $this->createTenantAdmin($tenant, $data);

        return $tenant;
    }

    private function generateSlug(string $name): string
    {
        return strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $name));
    }

    private function createTenantAdmin(Tenant $tenant, array $data): void
    {
        // Create admin user in tenant schema
        DB::table('users')->insert([
            'name' => $data['admin_name'] ?? 'Admin',
            'email' => $data['admin_email'],
            'password' => bcrypt($data['admin_password']),
            'role' => 'admin',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
```

---

## 💻 Frontend Implementation

### Subdomain Detection
```typescript
// lib/tenant.ts

export function getCurrentTenant(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Assume: subdomain.erp.com
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0];
  }
  
  // For local development: use query param or localStorage
  if (hostname === 'localhost') {
    return localStorage.getItem('dev_tenant') || 'demo';
  }
  
  return null;
}

export function setTenantHeader(config: any): any {
  const tenant = getCurrentTenant();
  if (tenant) {
    config.headers = {
      ...config.headers,
      'X-Tenant-Domain': tenant,
    };
  }
  return config;
}
```

### API Client with Tenant Header
```typescript
// lib/api.ts

import axios from 'axios';
import { setTenantHeader } from './tenant';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

// Add tenant header to all requests
api.interceptors.request.use(setTenantHeader);

export default api;
```

---

## ✅ Verification Plan

### Test Cases
| Test | Description | Expected Result |
|------|-------------|-----------------|
| Create tenant | Call tenant creation API | New schema created, admin user exists |
| Access tenant via subdomain | Visit school1.erp.com | Should see school1's data |
| Access wrong subdomain | Visit invalid.erp.com | Should get 404 |
| Data isolation | Add student in school1 | Student NOT visible in school2 |
| Super admin tenant switch | Switch from school1 to school2 | Should see school2 data |

### Manual Verification
1. Create a new tenant via Super Admin panel
2. Navigate to `newschool.localhost` (or subdomain in production)
3. Login with the created admin credentials
4. Add a student in this school
5. Switch to another school → Student should not be visible
6. Verify schema exists in PostgreSQL: `\dn` command

---

## 📝 Implementation Checklist

### Backend
- [ ] Install spatie/laravel-multitenancy
- [ ] Create tenants table migration
- [ ] Create Tenant model
- [ ] Configure multitenancy.php
- [ ] Create IdentifyTenant middleware
- [ ] Register middleware in Kernel
- [ ] Create TenantController (CRUD)
- [ ] Create TenantService for provisioning
- [ ] Add tenant migrations path
- [ ] Test tenant creation and isolation

### Frontend
- [ ] Create tenant detection utility
- [ ] Add X-Tenant-Domain header to API client
- [ ] Create Super Admin tenant management UI
- [ ] Test subdomain-based routing

---

> 📝 **Next Module**: [03-user-management.md](./03-user-management.md)
