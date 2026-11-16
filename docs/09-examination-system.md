# 📝 Module 09: Examination System

> **Priority**: 🟡 High  
> **Dependencies**: Academic Structure, Students  
> **Phase**: 3 (Academic Features)  
> **Duration**: Week 11-12

---

## 📋 Overview

The examination system manages exam schedules, mark entry, grade calculation, and report card generation.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Exam Types | Define Unit Test, Mid-term, Final | 🔴 Critical |
| Exam Schedule | Create exam timetables | 🟡 High |
| Marks Entry | Teacher marks input | 🔴 Critical |
| Grade Calculation | Auto GPA calculation | 🔴 Critical |
| Report Cards | PDF generation | 🔴 Critical |
| Result Analysis | Subject/class analytics | 🟢 Medium |

---

## 🗄️ Database Schema

### Table: `exam_types`
```sql
CREATE TABLE exam_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Unit Test 1', 'Mid Term'
    academic_year_id BIGINT REFERENCES academic_years(id),
    weightage DECIMAL(5, 2) DEFAULT 100, -- For GPA calculation
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `exams`
```sql
CREATE TABLE exams (
    id BIGSERIAL PRIMARY KEY,
    exam_type_id BIGINT REFERENCES exam_types(id),
    class_id BIGINT REFERENCES classes(id),
    subject_id BIGINT REFERENCES subjects(id),
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    max_marks DECIMAL(5, 2) DEFAULT 100,
    pass_marks DECIMAL(5, 2) DEFAULT 33,
    venue VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_type_id, class_id, subject_id)
);
```

### Table: `student_marks`
```sql
CREATE TABLE student_marks (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    exam_id BIGINT REFERENCES exams(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2),
    grade VARCHAR(5),
    remarks TEXT,
    is_absent BOOLEAN DEFAULT FALSE,
    entered_by BIGINT REFERENCES users(id),
    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, exam_id)
);

CREATE INDEX idx_student_marks_exam ON student_marks(exam_id);
```

### Table: `grade_scales`
```sql
CREATE TABLE grade_scales (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'A+', 'A', 'B+'
    min_percentage DECIMAL(5, 2) NOT NULL,
    max_percentage DECIMAL(5, 2) NOT NULL,
    grade_point DECIMAL(3, 1), -- 4.0, 3.5, etc.
    description VARCHAR(100), -- 'Excellent'
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exam-types` | List exam types |
| POST | `/api/exams` | Create exam |
| GET | `/api/exams/{id}/marks` | Get marks for exam |
| POST | `/api/exams/{id}/marks` | Enter/update marks |
| GET | `/api/students/{id}/report-card` | Generate report card |
| GET | `/api/exams/{id}/result-analysis` | Get result statistics |

---

## 🖥️ Backend Implementation

### Report Card Service
```php
<?php

namespace App\Services;

use App\Models\Student;
use App\Models\ExamType;
use App\Models\GradeScale;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportCardService
{
    public function generate(Student $student, int $examTypeId): string
    {
        $examType = ExamType::find($examTypeId);
        
        $marks = $student->marks()
            ->whereHas('exam', fn($q) => $q->where('exam_type_id', $examTypeId))
            ->with(['exam.subject'])
            ->get();

        $totalObtained = $marks->sum('marks_obtained');
        $totalMax = $marks->sum(fn($m) => $m->exam->max_marks);
        $percentage = $totalMax > 0 ? ($totalObtained / $totalMax) * 100 : 0;
        $overallGrade = $this->calculateGrade($percentage);

        $pdf = Pdf::loadView('reports.report-card', [
            'student' => $student,
            'examType' => $examType,
            'marks' => $marks,
            'totalObtained' => $totalObtained,
            'totalMax' => $totalMax,
            'percentage' => $percentage,
            'overallGrade' => $overallGrade,
            'school' => tenant(),
        ]);

        return $pdf->output();
    }

    private function calculateGrade(float $percentage): GradeScale
    {
        return GradeScale::where('min_percentage', '<=', $percentage)
            ->where('max_percentage', '>=', $percentage)
            ->first();
    }
}
```

### Marks Entry Controller
```php
<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\StudentMark;
use Illuminate\Http\Request;

class MarksController extends Controller
{
    public function store(Request $request, Exam $exam)
    {
        $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.marks_obtained' => 'nullable|numeric|min:0|max:' . $exam->max_marks,
            'marks.*.is_absent' => 'boolean',
        ]);

        foreach ($request->marks as $mark) {
            StudentMark::updateOrCreate(
                [
                    'student_id' => $mark['student_id'],
                    'exam_id' => $exam->id,
                ],
                [
                    'marks_obtained' => $mark['is_absent'] ? null : $mark['marks_obtained'],
                    'is_absent' => $mark['is_absent'] ?? false,
                    'grade' => $this->calculateGrade($mark['marks_obtained'], $exam->max_marks),
                    'entered_by' => auth()->id(),
                ]
            );
        }

        return response()->json(['success' => true]);
    }

    private function calculateGrade($obtained, $max): ?string
    {
        if ($obtained === null) return null;
        $percentage = ($obtained / $max) * 100;
        $grade = GradeScale::where('min_percentage', '<=', $percentage)
            ->where('max_percentage', '>=', $percentage)
            ->first();
        return $grade?->name;
    }
}
```

---

## 💻 Frontend Implementation

### Marks Entry Interface
```typescript
// app/(teacher)/marks/[examId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import api from '@/lib/api';

interface StudentMark {
  student_id: number;
  name: string;
  roll_no: string;
  marks_obtained: number | null;
  is_absent: boolean;
}

export default function MarksEntryPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [marks, setMarks] = useState<StudentMark[]>([]);

  useEffect(() => {
    api.get(`/exams/${examId}/marks`).then(res => {
      setExam(res.data.data.exam);
      setMarks(res.data.data.students);
    });
  }, [examId]);

  const updateMark = (studentId: number, field: string, value: any) => {
    setMarks(marks.map(m => 
      m.student_id === studentId ? { ...m, [field]: value } : m
    ));
  };

  const saveMarks = async () => {
    await api.post(`/exams/${examId}/marks`, { marks });
    alert('Marks saved successfully!');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Enter Marks</h1>
      <p className="text-gray-500 mb-6">
        {exam?.subject} | {exam?.class} | Max: {exam?.max_marks}
      </p>

      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Roll No</th>
            <th className="p-3 text-left">Student Name</th>
            <th className="p-3 text-center">Marks (/{exam?.max_marks})</th>
            <th className="p-3 text-center">Absent</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((student) => (
            <tr key={student.student_id} className="border-t">
              <td className="p-3">{student.roll_no}</td>
              <td className="p-3">{student.name}</td>
              <td className="p-3 text-center">
                <Input
                  type="number"
                  min="0"
                  max={exam?.max_marks}
                  value={student.marks_obtained ?? ''}
                  onChange={(e) => updateMark(student.student_id, 'marks_obtained', parseFloat(e.target.value))}
                  disabled={student.is_absent}
                  className="w-24 mx-auto"
                />
              </td>
              <td className="p-3 text-center">
                <Checkbox
                  checked={student.is_absent}
                  onCheckedChange={(v) => updateMark(student.student_id, 'is_absent', v)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <Button onClick={saveMarks}>Save Marks</Button>
      </div>
    </div>
  );
}
```

---

## 📝 Implementation Checklist

- [ ] Create exam tables and models
- [ ] Create grade scale configuration
- [ ] Create ExamResource in Filament
- [ ] Implement marks entry API
- [ ] Create ReportCardService
- [ ] Design report card PDF template
- [ ] Frontend: Exam schedule view
- [ ] Frontend: Marks entry interface
- [ ] Frontend: Report card download

---

> 📝 **Next Module**: [10-communication-hub.md](./10-communication-hub.md)
