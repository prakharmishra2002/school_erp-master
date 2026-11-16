# 👥 Module 03: User Management

> **Priority**: 🔴 Critical  
> **Dependencies**: Authentication, Multi-Tenancy  
> **Phase**: 2 (Core Modules)  
> **Duration**: Week 4

---

## 📋 Overview

User management handles all user accounts within a tenant (school), including staff creation, role assignment, and account lifecycle management.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| User CRUD | Create, read, update, deactivate users | 🔴 Critical |
| Role Assignment | Assign roles (admin, teacher, accountant) | 🔴 Critical |
| Bulk Import | Import users via Excel/CSV | 🟡 High |
| Password Management | Admin reset, user change password | 🟡 High |
| Profile Management | User self-update profile | 🟢 Medium |
| Activity Logging | Track user actions | 🟢 Medium |

---

## 🗄️ Database Schema

### Table: `users` (Tenant Schema)
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'developer', 'teacher', 'accountant', 'student', 'parent') NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `roles` (Optional - for fine-grained permissions)
```sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    guard_name VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    guard_name VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_has_permissions (
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| GET | `/api/users` | List all users | Admin |
| POST | `/api/users` | Create new user | Admin |
| GET | `/api/users/{id}` | Get user details | Admin |
| PUT | `/api/users/{id}` | Update user | Admin |
| DELETE | `/api/users/{id}` | Deactivate user | Admin |
| POST | `/api/users/import` | Bulk import from Excel | Admin |
| POST | `/api/users/{id}/reset-password` | Reset user password | Admin |
| PUT | `/api/profile` | Update own profile | Any User |
| PUT | `/api/profile/password` | Change own password | Any User |

---

## 🖥️ Backend Implementation

### Filament Resource (Admin Panel)
```php
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Tables;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationGroup = 'User Management';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255),
            Forms\Components\TextInput::make('email')
                ->email()
                ->required()
                ->unique(ignoreRecord: true),
            Forms\Components\TextInput::make('phone')
                ->tel(),
            Forms\Components\Select::make('role')
                ->options([
                    'admin' => 'Admin',
                    'developer' => 'Developer',
                    'teacher' => 'Teacher',
                    'accountant' => 'Accountant',
                ])
                ->required(),
            Forms\Components\TextInput::make('password')
                ->password()
                ->required(fn ($operation) => $operation === 'create')
                ->dehydrated(fn ($state) => filled($state))
                ->dehydrateStateUsing(fn ($state) => bcrypt($state)),
            Forms\Components\Toggle::make('is_active')
                ->default(true),
            Forms\Components\FileUpload::make('avatar_url')
                ->image()
                ->directory('avatars'),
        ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('avatar_url')
                ->circular(),
            Tables\Columns\TextColumn::make('name')
                ->searchable(),
            Tables\Columns\TextColumn::make('email')
                ->searchable(),
            Tables\Columns\BadgeColumn::make('role')
                ->colors([
                    'primary' => 'admin',
                    'success' => 'teacher',
                    'warning' => 'accountant',
                ]),
            Tables\Columns\IconColumn::make('is_active')
                ->boolean(),
            Tables\Columns\TextColumn::make('last_login_at')
                ->dateTime()
                ->sortable(),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\Action::make('resetPassword')
                ->icon('heroicon-o-key')
                ->action(fn (User $record) => $record->sendPasswordResetNotification()),
        ]);
    }
}
```

### User Import Service
```php
<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;

class UserImportService
{
    public function importFromExcel(string $filePath): array
    {
        $rows = Excel::toArray(null, $filePath)[0];
        $headers = array_map('strtolower', $rows[0]);
        
        $imported = 0;
        $errors = [];

        foreach (array_slice($rows, 1) as $index => $row) {
            $data = array_combine($headers, $row);
            
            try {
                User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? null,
                    'role' => $data['role'],
                    'password' => Hash::make($data['password'] ?? 'password123'),
                    'is_active' => true,
                ]);
                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
            }
        }

        return [
            'imported' => $imported,
            'errors' => $errors,
        ];
    }
}
```

---

## 💻 Frontend Implementation

### User List Table Component
```typescript
// components/users/UserTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Key, Trash } from 'lucide-react';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  avatar_url?: string;
  last_login_at?: string;
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-500';
      case 'teacher': return 'bg-green-500';
      case 'accountant': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Last Login</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {user.name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.is_active ? 'default' : 'destructive'}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              {user.last_login_at 
                ? new Date(user.last_login_at).toLocaleDateString()
                : 'Never'}
            </TableCell>
            <TableCell className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Key className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## ✅ Verification Plan

### Test Cases
| Test | Expected Result |
|------|-----------------|
| Create user with valid data | User created, can login |
| Create user with duplicate email | Error: Email already exists |
| Update user role | Role changed, permissions updated |
| Deactivate user | User cannot login |
| Reset user password | Email sent, new password works |
| Import users from Excel | Users created, errors reported |

### Manual Testing
1. Navigate to Admin → Users
2. Click "Create User" and fill form
3. Verify user appears in list
4. Edit user and change role
5. Click "Reset Password" → Check email
6. Toggle "Active" off → Try logging in as that user (should fail)

---

## 📝 Implementation Checklist

- [ ] Create UserResource in Filament
- [ ] Implement UserController for API
- [ ] Create UserImportService for bulk import
- [ ] Add password reset notification
- [ ] Create profile update endpoint
- [ ] Frontend: User list table
- [ ] Frontend: Create/edit user form
- [ ] Frontend: Import modal with Excel upload
- [ ] Write feature tests

---

> 📝 **Next Module**: [04-academic-structure.md](./04-academic-structure.md)
