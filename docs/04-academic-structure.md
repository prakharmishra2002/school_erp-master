# 📚 Module 04: Academic Structure

> **Priority**: 🔴 Critical  
> **Dependencies**: User Management  
> **Phase**: 2 (Core Modules)  
> **Duration**: Week 4-5

---

## 📋 Overview

Academic structure defines the organizational hierarchy of a school: academic years, classes, sections, and subjects. This is the foundation for student enrollment, timetables, and examinations.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Academic Year Management | Define school years (2025-26, etc.) | 🔴 Critical |
| Class Management | Create classes (1st, 2nd, ... 12th) | 🔴 Critical |
| Section Management | Sections within classes (A, B, C) | 🔴 Critical |
| Subject Management | Define subjects per class | 🔴 Critical |
| Subject-Teacher Mapping | Assign teachers to subjects | 🟡 High |
| Timetable Configuration | Period durations, breaks | 🟢 Medium |

---

## 🗄️ Database Schema

### Table: `academic_years`
```sql
CREATE TABLE academic_years (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- '2025-26'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `classes`
```sql
CREATE TABLE classes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'Class 1', 'Class 12'
    short_name VARCHAR(10), -- '1', '12'
    display_order INT DEFAULT 0,
    academic_year_id BIGINT REFERENCES academic_years(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_classes_name_year ON classes(name, academic_year_id);
```

### Table: `sections`
```sql
CREATE TABLE sections (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL, -- 'A', 'B', 'C'
    class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    capacity INT DEFAULT 40,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sections_class ON sections(class_id);
```

### Table: `subjects`
```sql
CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Mathematics'
    code VARCHAR(20), -- 'MATH'
    subject_type ENUM('core', 'elective', 'language', 'practical') DEFAULT 'core',
    credits INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `class_subjects` (Pivot)
```sql
CREATE TABLE class_subjects (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES subjects(id) ON DELETE CASCADE,
    is_optional BOOLEAN DEFAULT FALSE,
    max_marks INT DEFAULT 100,
    pass_marks INT DEFAULT 33,
    UNIQUE(class_id, subject_id)
);
```

### Table: `subject_teachers` (Pivot)
```sql
CREATE TABLE subject_teachers (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT REFERENCES sections(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE CASCADE,
    is_class_teacher BOOLEAN DEFAULT FALSE,
    UNIQUE(section_id, subject_id)
);
```

---

## 🔌 API Endpoints

### Academic Years
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/academic-years` | List all academic years |
| POST | `/api/academic-years` | Create new academic year |
| PUT | `/api/academic-years/{id}` | Update academic year |
| POST | `/api/academic-years/{id}/set-current` | Set as current year |

### Classes & Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | List classes with sections |
| POST | `/api/classes` | Create class |
| POST | `/api/classes/{id}/sections` | Add section to class |
| DELETE | `/api/sections/{id}` | Delete section |

### Subjects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | List all subjects |
| POST | `/api/subjects` | Create subject |
| POST | `/api/classes/{id}/subjects` | Assign subjects to class |
| POST | `/api/sections/{id}/assign-teacher` | Assign teacher to subject |

---

## 🖥️ Backend Implementation

### Filament Resources

```php
// ClassResource with nested sections
public static function form(Forms\Form $form): Forms\Form
{
    return $form->schema([
        Forms\Components\TextInput::make('name')
            ->required()
            ->placeholder('Class 1'),
        Forms\Components\TextInput::make('short_name')
            ->placeholder('1'),
        Forms\Components\Select::make('academic_year_id')
            ->relationship('academicYear', 'name')
            ->required(),
        Forms\Components\Repeater::make('sections')
            ->relationship()
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(10),
                Forms\Components\TextInput::make('capacity')
                    ->numeric()
                    ->default(40),
            ])
            ->columns(2),
    ]);
}
```

### Class Model with Relationships
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    protected $table = 'classes';
    
    protected $fillable = [
        'name',
        'short_name',
        'display_order',
        'academic_year_id',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class, 'class_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'class_subjects')
            ->withPivot(['is_optional', 'max_marks', 'pass_marks']);
    }

    public function students()
    {
        return $this->hasManyThrough(
            Student::class,
            Section::class,
            'class_id',
            'section_id'
        );
    }
}
```

---

## 💻 Frontend Implementation

### Class Management UI
```typescript
// app/(admin)/academic/classes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';
import api from '@/lib/api';

interface Section {
  id: number;
  name: string;
  capacity: number;
  student_count: number;
}

interface ClassItem {
  id: number;
  name: string;
  short_name: string;
  sections: Section[];
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    api.get('/classes').then(res => setClasses(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes & Sections</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Class
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{cls.name}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cls.sections.map((section) => (
                  <div 
                    key={section.id}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <span className="font-medium">Section {section.name}</span>
                    <span className="text-sm text-gray-500">
                      {section.student_count} / {section.capacity} students
                    </span>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Section
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Verification Plan

### Test Cases
| Test | Expected Result |
|------|-----------------|
| Create academic year | Year created with dates |
| Set current academic year | Only one year is current |
| Create class with sections | Class and sections created |
| Assign subjects to class | Subjects linked with marks config |
| Assign teacher to subject | Teacher can see assigned classes |

### Manual Testing
1. Go to Admin → Academic → Academic Years
2. Create "2025-26" with start/end dates
3. Set as current year
4. Go to Classes → Create "Class 1"
5. Add sections A, B, C
6. Go to Subjects → Create subjects
7. Assign subjects to Class 1
8. Assign teachers to each subject-section

---

## 📝 Implementation Checklist

- [ ] Create migrations for all tables
- [ ] Create models with relationships
- [ ] Create Filament resources for each entity
- [ ] Create API controllers
- [ ] Frontend: Academic year selector
- [ ] Frontend: Class/section management
- [ ] Frontend: Subject assignment UI
- [ ] Frontend: Teacher assignment UI
- [ ] Seed data for demo

---

> 📝 **Next Module**: [05-student-management.md](./05-student-management.md)
