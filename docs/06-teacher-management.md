# 👨‍🏫 Module 06: Teacher Management

> **Priority**: 🔴 Critical  
> **Dependencies**: Academic Structure  
> **Phase**: 2 (Core Modules)  
> **Duration**: Week 8

---

## 📋 Overview

Teacher management handles staff creation, department assignment, subject-class mapping, and work allocation. This module integrates with academic structure and attendance systems.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Teacher Registration | Add teachers with qualifications | 🔴 Critical |
| Subject Specializations | Define which subjects a teacher can teach | 🔴 Critical |
| Department Assignment | Organize by department | 🟡 High |
| Subject-Class Mapping | Assign teachers to subjects | 🔴 Critical |
| Workload Management | Track periods per teacher | 🟢 Medium |
| Scheduling Rules | Admin-defined rules for teacher scheduling | 🟡 High |
| Leave Management | Track teacher leaves | 🟢 Medium |

---

## 🗄️ Database Schema

### Table: `teachers`
```sql
CREATE TABLE teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) UNIQUE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Personal
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    photo_url VARCHAR(500),
    
    -- Employment
    department VARCHAR(100),
    designation VARCHAR(100), -- 'Principal', 'Senior Teacher', etc.
    joining_date DATE NOT NULL,
    employment_type ENUM('permanent', 'contract', 'part_time') DEFAULT 'permanent',
    
    -- Qualifications
    qualifications JSONB DEFAULT '[]', -- [{degree, university, year}]
    specializations TEXT,
    
    -- Subject Specializations (which subjects this teacher can teach)
    subject_specializations JSONB DEFAULT '[]', 
    -- Format: [{"subject_id": 1, "proficiency": "primary"}]
    -- Proficiency: "primary" (main), "secondary" (can teach), "backup" (emergency)
    
    -- Salary (optional, can be separate module)
    basic_salary DECIMAL(10, 2),
    
    -- Status
    status ENUM('active', 'on_leave', 'resigned', 'terminated') DEFAULT 'active',
    leaving_date DATE,
    
    -- Biometric
    biometric_id VARCHAR(50), -- ID registered in biometric device
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teachers_employee ON teachers(employee_id);
CREATE INDEX idx_teachers_department ON teachers(department);
```

### Table: `teacher_schedules`
```sql
CREATE TABLE teacher_schedules (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE CASCADE,
    section_id BIGINT REFERENCES sections(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES subjects(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 1=Monday, 2=Tuesday... 6=Saturday
    period_number INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    academic_year_id BIGINT REFERENCES academic_years(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section_id, day_of_week, period_number) -- One teacher per slot per section
);

CREATE INDEX idx_teacher_schedules_teacher ON teacher_schedules(teacher_id);
CREATE INDEX idx_teacher_schedules_day ON teacher_schedules(day_of_week);
```

### Table: `school_scheduling_rules`
Admin-configurable rules for teacher scheduling (warnings during assignment).
```sql
CREATE TABLE school_scheduling_rules (
    id BIGSERIAL PRIMARY KEY,
    rule_code VARCHAR(50) UNIQUE NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    description TEXT,
    rule_type ENUM('max_consecutive', 'max_daily', 'max_weekly', 'break_required') NOT NULL,
    rule_value INT NOT NULL, -- e.g., max 3 consecutive classes
    is_active BOOLEAN DEFAULT TRUE,
    severity ENUM('warning', 'error') DEFAULT 'warning', -- warning = soft validation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default rules to seed:
-- ('MAX_CONSECUTIVE', 'Max Consecutive Classes', 'Teacher cannot have more than X back-to-back classes', 'max_consecutive', 3, 'warning')
-- ('MAX_DAILY', 'Max Daily Periods', 'Teacher cannot have more than X periods per day', 'max_daily', 6, 'warning')
-- ('BREAK_REQUIRED', 'Break After Periods', 'Teacher must have break after X consecutive periods', 'break_required', 4, 'warning')
```

### Table: `timetable_assets`
For uploading timetable images/PDFs as alternative to tabular view.
```sql
CREATE TABLE timetable_assets (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT REFERENCES sections(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_type ENUM('image', 'pdf') DEFAULT 'image',
    academic_year_id BIGINT REFERENCES academic_years(id),
    uploaded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `teacher_ratings`
Parent feedback and ratings for teachers (anonymous to teachers, visible to admin).
```sql
CREATE TABLE teacher_ratings (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE CASCADE,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    guardian_id BIGINT REFERENCES guardians(id) ON DELETE CASCADE,
    academic_year_id BIGINT REFERENCES academic_years(id),
    
    -- Rating categories (1-5 stars)
    teaching_quality INT CHECK (teaching_quality BETWEEN 1 AND 5),
    communication INT CHECK (communication BETWEEN 1 AND 5),
    student_engagement INT CHECK (student_engagement BETWEEN 1 AND 5),
    homework_feedback INT CHECK (homework_feedback BETWEEN 1 AND 5),
    overall_influence INT CHECK (overall_influence BETWEEN 1 AND 5),
    
    -- Optional text feedback
    feedback_text TEXT,
    is_anonymous BOOLEAN DEFAULT TRUE,
    
    -- One rating per parent-teacher-year
    UNIQUE(teacher_id, guardian_id, academic_year_id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teacher_ratings_teacher ON teacher_ratings(teacher_id);
```

---

## 🔌 API Endpoints

### Teacher Management (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teachers` | List all teachers |
| POST | `/api/teachers` | Create teacher |
| GET | `/api/teachers/{id}` | Get teacher details |
| PUT | `/api/teachers/{id}` | Update teacher |
| GET | `/api/teachers/{id}/schedule` | Get teacher's timetable |
| GET | `/api/teachers/{id}/classes` | Get assigned classes |
| POST | `/api/teachers/{id}/assign-subject` | Assign to subject-section |

### Teacher Panel (Teacher Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teacher/dashboard` | Dashboard stats for logged-in teacher |
| GET | `/api/teacher/my-classes` | Get assigned class-sections |
| GET | `/api/teacher/schedule` | Get weekly schedule |
| GET | `/api/teacher/pending-marks` | Exams needing marks entry |

### Scheduling Rules (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/scheduling-rules` | List all rules |
| POST | `/api/admin/scheduling-rules` | Create new rule |
| PUT | `/api/admin/scheduling-rules/{id}` | Update rule |
| DELETE | `/api/admin/scheduling-rules/{id}` | Delete rule |
| POST | `/api/teacher-schedule/validate` | Validate assignment (returns warnings) |

### Timetable Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sections/{id}/timetable` | Get tabular timetable |
| GET | `/api/sections/{id}/timetable-asset` | Get uploaded image/PDF |
| POST | `/api/sections/{id}/timetable-asset` | Upload timetable (Admin) |

---

## 🖥️ Backend Implementation

### Teacher Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        'user_id', 'employee_id', 'first_name', 'last_name',
        'date_of_birth', 'gender', 'phone', 'email', 'address', 'photo_url',
        'department', 'designation', 'joining_date', 'employment_type',
        'qualifications', 'specializations', 'basic_salary', 'status',
        'leaving_date', 'biometric_id',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'joining_date' => 'date',
        'leaving_date' => 'date',
        'qualifications' => 'array',
        'basic_salary' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subjectTeachers()
    {
        return $this->hasMany(SubjectTeacher::class);
    }

    public function sections()
    {
        return $this->belongsToMany(Section::class, 'subject_teachers')
            ->withPivot(['subject_id', 'is_class_teacher']);
    }

    public function biometricAttendances()
    {
        return $this->hasMany(BiometricAttendance::class);
    }

    // Get classes where this teacher is class teacher
    public function classTeacherOf()
    {
        return $this->subjectTeachers()->where('is_class_teacher', true);
    }

    public static function generateEmployeeId(): string
    {
        $prefix = 'TCH';
        $year = date('y');
        $last = static::whereYear('created_at', date('Y'))
            ->orderBy('id', 'desc')
            ->first();
        
        $number = $last 
            ? intval(substr($last->employee_id, -4)) + 1 
            : 1;
            
        return $prefix . $year . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
```

---

## 💻 Frontend Implementation

### Teacher Dashboard (Teacher Panel)
```typescript
// app/(teacher)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Users, ClipboardList, Clock } from 'lucide-react';
import api from '@/lib/api';

interface DashboardData {
  today_classes: number;
  total_students: number;
  pending_attendance: number;
  upcoming_periods: { time: string; subject: string; class: string }[];
}

export default function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get('/teacher/dashboard').then(res => setData(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Today's Classes</p>
              <p className="text-2xl font-bold">{data?.today_classes || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">My Students</p>
              <p className="text-2xl font-bold">{data?.total_students || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <ClipboardList className="w-8 h-8 text-orange-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Pending Attendance</p>
              <p className="text-2xl font-bold">{data?.pending_attendance || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.upcoming_periods.map((period, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{period.subject}</p>
                  <p className="text-sm text-gray-500">{period.class}</p>
                </div>
                <span className="text-lg font-mono">{period.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ✅ Verification Plan

| Test | Expected Result |
|------|-----------------|
| Create teacher | Employee ID auto-generated |
| Assign to subject-section | Appears in teacher's classes list |
| Mark as class teacher | Shown in section details |
| Teacher dashboard | Shows correct schedule and classes |

---

## 📝 Implementation Checklist

- [ ] Create migrations for teachers, subject_teachers tables
- [ ] Create Teacher model with relationships
- [ ] Create TeacherResource in Filament
- [ ] Create teacher API endpoints
- [ ] Frontend: Teacher list and form
- [ ] Frontend: Teacher dashboard
- [ ] Frontend: Subject-section assignment UI

---

> 📝 **Next Module**: [07-attendance-system.md](./07-attendance-system.md)
