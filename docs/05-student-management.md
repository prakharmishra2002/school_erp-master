# 👨‍🎓 Module 05: Student Management

> **Priority**: 🔴 Critical  
> **Dependencies**: Academic Structure  
> **Phase**: 2 (Core Modules)  
> **Duration**: Week 6-7

---

## 📋 Overview

Student management handles the complete lifecycle of students from admission to graduation, including personal details, guardian information, class assignments, and academic history.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Student Registration | Complete enrollment with all details | 🔴 Critical |
| Guardian Information | Parent/guardian contacts | 🔴 Critical |
| Class Assignment | Assign to class/section | 🔴 Critical |
| Roll Number Generation | Auto/manual roll numbers | 🟡 High |
| Bulk Import | Import students from Excel | 🟡 High |
| Student ID Card | Generate printable ID cards | 🟢 Medium |
| Transfer Certificate | Generate TC document | 🟢 Medium |
| Academic History | Track class promotions | 🟢 Medium |

---

## 🗄️ Database Schema

### Table: `students`
```sql
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    roll_no VARCHAR(20),
    
    -- Personal Details
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    blood_group VARCHAR(5),
    religion VARCHAR(50),
    category VARCHAR(50), -- General, OBC, SC, ST
    nationality VARCHAR(50) DEFAULT 'Indian',
    aadhaar_number VARCHAR(12),
    
    -- Contact
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Academic
    section_id BIGINT REFERENCES sections(id),
    admission_date DATE NOT NULL,
    previous_school VARCHAR(255),
    previous_class VARCHAR(50),
    
    -- Status
    status ENUM('active', 'left', 'graduated', 'suspended') DEFAULT 'active',
    leaving_date DATE,
    leaving_reason TEXT,
    
    -- Photo
    photo_url VARCHAR(500),
    
    -- Medical
    medical_info JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_section ON students(section_id);
CREATE INDEX idx_students_admission ON students(admission_no);
```

### Table: `guardians`
```sql
CREATE TABLE guardians (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    relation ENUM('father', 'mother', 'guardian') NOT NULL,
    name VARCHAR(255) NOT NULL,
    occupation VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    aadhaar_number VARCHAR(12),
    annual_income DECIMAL(12, 2),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    user_id BIGINT REFERENCES users(id), -- For parent portal login
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guardians_student ON guardians(student_id);
```

### Table: `student_documents`
```sql
CREATE TABLE student_documents (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'birth_certificate', 'tc', 'aadhaar', 'photo'
    document_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `student_class_history`
```sql
CREATE TABLE student_class_history (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id BIGINT REFERENCES academic_years(id),
    class_id BIGINT REFERENCES classes(id),
    section_id BIGINT REFERENCES sections(id),
    roll_no VARCHAR(20),
    promoted BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List students (with filters) |
| POST | `/api/students` | Create new student |
| GET | `/api/students/{id}` | Get student details |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Mark as left/graduated |
| POST | `/api/students/import` | Bulk import from Excel |
| GET | `/api/students/{id}/id-card` | Generate ID card PDF |
| GET | `/api/students/{id}/tc` | Generate transfer certificate |
| POST | `/api/students/promote` | Bulk class promotion |

### Query Parameters for List
```
GET /api/students?
  class_id=5&
  section_id=12&
  status=active&
  search=john&
  sort=name&
  per_page=50
```

---

## 🖥️ Backend Implementation

### Student Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'admission_no', 'roll_no',
        'first_name', 'last_name', 'date_of_birth', 'gender',
        'blood_group', 'religion', 'category', 'nationality', 'aadhaar_number',
        'address', 'city', 'state', 'pincode', 'phone', 'email',
        'section_id', 'admission_date', 'previous_school', 'previous_class',
        'status', 'leaving_date', 'leaving_reason', 'photo_url', 'medical_info',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'admission_date' => 'date',
        'leaving_date' => 'date',
        'medical_info' => 'array',
    ];

    protected $appends = ['full_name', 'class_name'];

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function getClassNameAttribute(): string
    {
        return $this->section 
            ? "{$this->section->classModel->name} - {$this->section->name}"
            : 'Not Assigned';
    }

    // Relationships
    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function guardians()
    {
        return $this->hasMany(Guardian::class);
    }

    public function primaryGuardian()
    {
        return $this->hasOne(Guardian::class)->where('is_primary', true);
    }

    public function documents()
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function classHistory()
    {
        return $this->hasMany(StudentClassHistory::class);
    }

    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInClass($query, $classId)
    {
        return $query->whereHas('section', function ($q) use ($classId) {
            $q->where('class_id', $classId);
        });
    }

    public function scopeInSection($query, $sectionId)
    {
        return $query->where('section_id', $sectionId);
    }

    // Methods
    public static function generateAdmissionNo(): string
    {
        $prefix = date('Y');
        $lastStudent = static::whereYear('created_at', date('Y'))
            ->orderBy('id', 'desc')
            ->first();
        
        $number = $lastStudent 
            ? intval(substr($lastStudent->admission_no, -4)) + 1 
            : 1;
            
        return $prefix . str_pad($number, 4, '0', STR_PAD_LEFT);
    }

    public function promote(Section $newSection): void
    {
        // Save history
        StudentClassHistory::create([
            'student_id' => $this->id,
            'academic_year_id' => $this->section->classModel->academic_year_id,
            'class_id' => $this->section->class_id,
            'section_id' => $this->section_id,
            'roll_no' => $this->roll_no,
            'promoted' => true,
        ]);

        // Update to new section
        $this->update([
            'section_id' => $newSection->id,
            'roll_no' => null, // Will be reassigned
        ]);
    }
}
```

### Filament Resource
```php
// StudentResource.php
public static function form(Forms\Form $form): Forms\Form
{
    return $form->schema([
        Forms\Components\Wizard::make([
            Forms\Components\Wizard\Step::make('Personal Information')
                ->schema([
                    Forms\Components\FileUpload::make('photo_url')
                        ->image()
                        ->avatar()
                        ->directory('students'),
                    Forms\Components\Grid::make(3)->schema([
                        Forms\Components\TextInput::make('first_name')
                            ->required(),
                        Forms\Components\TextInput::make('last_name'),
                        Forms\Components\DatePicker::make('date_of_birth')
                            ->required(),
                    ]),
                    Forms\Components\Grid::make(3)->schema([
                        Forms\Components\Select::make('gender')
                            ->options(['male' => 'Male', 'female' => 'Female', 'other' => 'Other'])
                            ->required(),
                        Forms\Components\TextInput::make('blood_group'),
                        Forms\Components\TextInput::make('aadhaar_number')
                            ->mask('9999 9999 9999'),
                    ]),
                ]),
            Forms\Components\Wizard\Step::make('Contact Details')
                ->schema([
                    Forms\Components\Textarea::make('address'),
                    Forms\Components\Grid::make(3)->schema([
                        Forms\Components\TextInput::make('city'),
                        Forms\Components\TextInput::make('state'),
                        Forms\Components\TextInput::make('pincode'),
                    ]),
                    Forms\Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('phone')
                            ->tel(),
                        Forms\Components\TextInput::make('email')
                            ->email(),
                    ]),
                ]),
            Forms\Components\Wizard\Step::make('Guardian Information')
                ->schema([
                    Forms\Components\Repeater::make('guardians')
                        ->relationship()
                        ->schema([
                            Forms\Components\Select::make('relation')
                                ->options([
                                    'father' => 'Father',
                                    'mother' => 'Mother', 
                                    'guardian' => 'Guardian',
                                ])
                                ->required(),
                            Forms\Components\TextInput::make('name')
                                ->required(),
                            Forms\Components\TextInput::make('phone')
                                ->tel()
                                ->required(),
                            Forms\Components\TextInput::make('occupation'),
                            Forms\Components\Toggle::make('is_primary')
                                ->label('Primary Contact'),
                        ])
                        ->columns(3)
                        ->minItems(1),
                ]),
            Forms\Components\Wizard\Step::make('Academic Details')
                ->schema([
                    Forms\Components\TextInput::make('admission_no')
                        ->default(fn () => Student::generateAdmissionNo())
                        ->disabled(),
                    Forms\Components\DatePicker::make('admission_date')
                        ->default(now())
                        ->required(),
                    Forms\Components\Select::make('section_id')
                        ->label('Class & Section')
                        ->options(fn () => Section::with('classModel')
                            ->get()
                            ->mapWithKeys(fn ($s) => [
                                $s->id => "{$s->classModel->name} - Section {$s->name}"
                            ]))
                        ->searchable()
                        ->required(),
                    Forms\Components\TextInput::make('previous_school'),
                    Forms\Components\TextInput::make('previous_class'),
                ]),
        ]),
    ]);
}
```

---

## 💻 Frontend Implementation

### Student Registration Form
```typescript
// components/students/StudentForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';

const studentSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().optional(),
  date_of_birth: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  section_id: z.number({ required_error: 'Class selection is required' }),
  guardians: z.array(z.object({
    relation: z.enum(['father', 'mother', 'guardian']),
    name: z.string().min(2),
    phone: z.string().min(10),
    is_primary: z.boolean(),
  })).min(1, 'At least one guardian is required'),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface Props {
  sections: { id: number; name: string }[];
  onSuccess: () => void;
}

export function StudentForm({ sections, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState('personal');
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      guardians: [{ relation: 'father', name: '', phone: '', is_primary: true }],
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    try {
      await api.post('/students', data);
      onSuccess();
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="guardian">Guardian</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>First Name *</label>
              <Input {...register('first_name')} />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
            </div>
            <div>
              <label>Last Name</label>
              <Input {...register('last_name')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Date of Birth *</label>
              <Input type="date" {...register('date_of_birth')} />
            </div>
            <div>
              <label>Gender *</label>
              <Select onValueChange={(v) => setValue('gender', v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="button" onClick={() => setActiveTab('contact')}>
            Next: Contact Details
          </Button>
        </TabsContent>

        {/* ... other tabs ... */}
        
        <TabsContent value="academic" className="space-y-4">
          <div>
            <label>Class & Section *</label>
            <Select onValueChange={(v) => setValue('section_id', parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Create Student</Button>
        </TabsContent>
      </Tabs>
    </form>
  );
}
```

### Student ID Card Generator
```typescript
// lib/id-card-generator.ts
import jsPDF from 'jspdf';

interface Student {
  admission_no: string;
  full_name: string;
  class_name: string;
  date_of_birth: string;
  blood_group?: string;
  photo_url?: string;
  guardians: { name: string; phone: string; is_primary: boolean }[];
}

export function generateIdCard(student: Student): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98], // Standard ID card size
  });

  // Background
  doc.setFillColor(0, 71, 171);
  doc.rect(0, 0, 85.6, 15, 'F');
  
  // School name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('ABC PUBLIC SCHOOL', 42.8, 8, { align: 'center' });
  
  // Student details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text(`Name: ${student.full_name}`, 30, 22);
  doc.text(`Admission No: ${student.admission_no}`, 30, 27);
  doc.text(`Class: ${student.class_name}`, 30, 32);
  doc.text(`DOB: ${student.date_of_birth}`, 30, 37);
  doc.text(`Blood Group: ${student.blood_group || 'N/A'}`, 30, 42);
  
  // Guardian contact
  const primaryGuardian = student.guardians.find(g => g.is_primary);
  if (primaryGuardian) {
    doc.text(`Emergency: ${primaryGuardian.phone}`, 30, 48);
  }
  
  // Save
  doc.save(`ID_${student.admission_no}.pdf`);
}
```

---

## ✅ Verification Plan

### Test Cases
| Test | Expected Result |
|------|-----------------|
| Create student with all details | Student created with auto admission no |
| Create student without guardian | Validation error |
| Update student section | Student moved, history recorded |
| Bulk import students | Students created, errors reported |
| Generate ID card | PDF downloaded with correct details |
| Promote students | Students moved to new class |

### Manual Testing
1. Go to Admin → Students → Add New
2. Fill all tabs (Personal, Contact, Guardian, Academic)
3. Submit and verify admission number is generated
4. View student profile → All details visible
5. Click "Generate ID Card" → PDF downloads
6. Try bulk import with Excel file
7. Promote students to next class at year end

---

## 📝 Implementation Checklist

- [ ] Create all migrations
- [ ] Create Student, Guardian, Document models
- [ ] Create StudentResource in Filament (wizard form)
- [ ] Create StudentController for API
- [ ] Implement admission number generation
- [ ] Implement bulk import service
- [ ] Create ID card PDF generator
- [ ] Create transfer certificate template
- [ ] Implement promotion logic
- [ ] Frontend: Student list with search/filter
- [ ] Frontend: Student registration wizard
- [ ] Frontend: Student profile view
- [ ] Frontend: ID card download
- [ ] Write tests

---

> 📝 **Next Module**: [06-teacher-management.md](./06-teacher-management.md)
