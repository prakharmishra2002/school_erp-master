# 🔐 Module 01: Authentication System

> **Priority**: 🔴 Critical  
> **Dependencies**: None (First module)  
> **Phase**: 1 (Foundation)  
> **Duration**: Week 1

---

## 📋 Overview

The authentication module provides secure login and access control for all user types across the School ERP system. It supports both token-based API authentication and session-based admin panel access.

---

## 🎯 Features

### Backend Features
| Feature | Description | Priority |
|---------|-------------|----------|
| JWT/Sanctum Authentication | Token-based API auth for frontend apps | 🔴 Critical |
| Session Authentication | Cookie-based auth for Filament admin | 🔴 Critical |
| Role-Based Access Control | 6 user roles with different permissions | 🔴 Critical |
| Password Reset | Email-based password recovery | 🟡 High |
| Two-Factor Authentication | OTP via SMS/Email (optional) | 🟢 Medium |
| Login Audit Logging | Track all login attempts | 🟢 Medium |

### Frontend Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Login Page | Email/password form with validation | 🔴 Critical |
| Logout Functionality | Clear tokens and redirect | 🔴 Critical |
| Protected Routes | Auth guards for authenticated pages | 🔴 Critical |
| Remember Me | Persistent login option | 🟢 Medium |
| Password Reset UI | Forgot password flow | 🟡 High |

---

## 🗄️ Database Schema

### Table: `users`
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'developer', 'teacher', 'accountant', 'student', 'parent') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Table: `personal_access_tokens` (Laravel Sanctum)
```sql
-- This is auto-created by Sanctum package
CREATE TABLE personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `login_logs`
```sql
CREATE TABLE login_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    event VARCHAR(50) NOT NULL, -- 'login', 'logout', 'failed_login'
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_login_logs_user ON login_logs(user_id);
```

---

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | ❌ No |
| POST | `/api/auth/logout` | User logout | ✅ Yes |
| GET | `/api/auth/me` | Get current user | ✅ Yes |
| POST | `/api/auth/refresh` | Refresh token | ✅ Yes |
| POST | `/api/auth/forgot-password` | Send reset email | ❌ No |
| POST | `/api/auth/reset-password` | Reset with token | ❌ No |

### Request/Response Examples

#### Login Request
```json
POST /api/auth/login
Content-Type: application/json

{
    "email": "admin@school.com",
    "password": "password123",
    "remember": true
}
```

#### Login Response (Success)
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "School Admin",
            "email": "admin@school.com",
            "role": "admin",
            "tenant_id": 1
        },
        "token": "1|abc123tokenhere...",
        "expires_at": "2026-02-26T15:30:00Z"
    }
}
```

#### Login Response (Error)
```json
{
    "success": false,
    "message": "Invalid credentials",
    "errors": {
        "email": ["These credentials do not match our records."]
    }
}
```

---

## 🖥️ Backend Implementation

### File Structure
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Auth/
│   │   │       ├── AuthController.php        # Login/logout/me
│   │   │       └── PasswordResetController.php
│   │   ├── Middleware/
│   │   │   ├── Authenticate.php              # Auth guard
│   │   │   └── EnsureUserIsActive.php        # Check is_active
│   │   └── Requests/
│   │       ├── LoginRequest.php              # Validation
│   │       └── ResetPasswordRequest.php
│   ├── Models/
│   │   ├── User.php                          # User model
│   │   └── LoginLog.php                      # Audit model
│   └── Observers/
│       └── UserObserver.php                  # Auto-hash password
├── database/
│   └── migrations/
│       ├── 2024_01_01_000001_create_users_table.php
│       └── 2024_01_01_000002_create_login_logs_table.php
└── routes/
    └── api.php                               # API routes
```

### Key Code: AuthController.php
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Models\LoginLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            LoginLog::create([
                'user_id' => $user?->id,
                'event' => 'failed_login',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated.'],
            ]);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Log successful login
        LoginLog::create([
            'user_id' => $user->id,
            'event' => 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Update last login
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->only(['id', 'name', 'email', 'role', 'tenant_id']),
                'token' => $token,
                'expires_at' => now()->addDays(7),
            ],
        ]);
    }

    public function logout()
    {
        $user = auth()->user();
        
        LoginLog::create([
            'user_id' => $user->id,
            'event' => 'logout',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        $user->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me()
    {
        return response()->json([
            'success' => true,
            'data' => auth()->user(),
        ]);
    }
}
```

---

## 💻 Frontend Implementation

### File Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                # Login page
│   │   └── forgot-password/
│   │       └── page.tsx                # Password reset
│   └── layout.tsx
├── components/
│   └── auth/
│       ├── LoginForm.tsx               # Login form component
│       └── PasswordResetForm.tsx
├── lib/
│   ├── api.ts                          # Axios instance
│   └── auth.ts                         # Auth utilities
├── hooks/
│   ├── useAuth.ts                      # Auth hook
│   └── useUser.ts                      # User state
└── contexts/
    └── AuthContext.tsx                 # Global auth state
```

### Key Code: AuthContext.tsx
```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  tenant_id: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user } = response.data.data;
    
    localStorage.setItem('auth_token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(user);
    
    // Redirect based on role
    switch (user.role) {
      case 'super_admin':
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'developer':
        // Developers have access to all portals - redirect to admin by default
        router.push('/admin/dashboard');
        break;
      case 'teacher':
        router.push('/teacher/dashboard');
        break;
      case 'accountant':
        router.push('/payment/dashboard');
        break;
      case 'parent':
      case 'student':
        router.push('/portal/dashboard');
        break;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Key Code: Login Page
```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <Card className="w-[400px] shadow-2xl">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">School ERP</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
```

---

## ✅ Verification Plan

### Automated Tests (Backend)
```bash
# Run all auth tests
php artisan test --filter=AuthTest

# Test commands
php artisan test tests/Feature/Auth/LoginTest.php
php artisan test tests/Feature/Auth/LogoutTest.php
php artisan test tests/Feature/Auth/PasswordResetTest.php
```

### Test Cases
| Test | Description | Expected Result |
|------|-------------|-----------------|
| Login with valid credentials | POST /api/auth/login with correct email/password | 200 with token |
| Login with invalid credentials | POST /api/auth/login with wrong password | 422 with error |
| Login with inactive account | User has is_active=false | 422 with error |
| Access protected route without token | GET /api/auth/me without Bearer token | 401 Unauthorized |
| Logout | POST /api/auth/logout with valid token | 200, token invalidated |
| Refresh token | POST /api/auth/refresh | 200 with new token |

### Manual Testing
1. Open browser and navigate to `/login`
2. Enter invalid credentials → Should show error message
3. Enter valid credentials → Should redirect to dashboard based on role
4. Check localStorage → Should have `auth_token` stored
5. Refresh page → Should stay logged in
6. Click logout → Should redirect to login page
7. Try accessing `/admin/dashboard` without login → Should redirect to login

---

## 📝 Implementation Checklist

### Backend
- [ ] Create migrations for users and login_logs tables
- [ ] Configure Sanctum in `config/sanctum.php`
- [ ] Create User model with Sanctum traits
- [ ] Create AuthController with login/logout/me methods
- [ ] Create LoginRequest for validation
- [ ] Add routes to `routes/api.php`
- [ ] Create EnsureUserIsActive middleware
- [ ] Write feature tests

### Frontend
- [ ] Create AuthContext provider
- [ ] Create api.ts with Axios instance
- [ ] Build login page with form
- [ ] Add protected route wrapper
- [ ] Implement logout functionality
- [ ] Add forgot password flow
- [ ] Test all auth flows

---

> 📝 **Next Module**: [02-multi-tenancy.md](./02-multi-tenancy.md)
