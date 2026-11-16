# 📋 Module 07: Attendance System

> **Priority**: 🟡 High  
> **Dependencies**: Students, Teachers  
> **Phase**: 3 (Academic Features)  
> **Duration**: Week 9-10

---

## 📋 Overview

The attendance system handles two types of attendance:
1. **Student Attendance**: Manual marking by teachers
2. **Teacher/Staff Attendance**: Biometric integration with ZKTeco/eSSL devices

---

## 🎯 Features

### Student Attendance
| Feature | Description | Priority |
|---------|-------------|----------|
| Daily Attendance | Mark present/absent/late | 🔴 Critical |
| Bulk Marking | Mark entire class at once | 🔴 Critical |
| Leave Requests | Track approved leaves | 🟡 High |
| Attendance Reports | Daily, monthly, student-wise | 🟡 High |
| Low Attendance Alerts | Notify parents | 🟢 Medium |

### Teacher Biometric Attendance
| Feature | Description | Priority |
|---------|-------------|----------|
| Device Integration | ZKTeco API sync | 🔴 Critical |
| Check-in/Check-out | Track work hours | 🔴 Critical |
| Shift Management | Multiple shifts | 🟢 Medium |
| Leave Management | Leave applications | 🟡 High |
| Overtime Tracking | Calculate extra hours | 🟢 Medium |

---

## 🗄️ Database Schema

### Table: `student_attendances`
```sql
CREATE TABLE student_attendances (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'half_day', 'leave') NOT NULL,
    remarks TEXT,
    marked_by BIGINT REFERENCES users(id),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

CREATE INDEX idx_student_attendance_date ON student_attendances(date);
CREATE INDEX idx_student_attendance_student ON student_attendances(student_id);
```

### Table: `biometric_devices`
```sql
CREATE TABLE biometric_devices (
    id BIGSERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_ip VARCHAR(45) NOT NULL,
    device_port INT DEFAULT 4370,
    device_type ENUM('zkteco', 'essl', 'hikvision') DEFAULT 'zkteco',
    serial_number VARCHAR(100),
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `biometric_attendances`
```sql
CREATE TABLE biometric_attendances (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Punch times
    punch_in TIMESTAMP,
    punch_out TIMESTAMP,
    
    -- Calculated
    worked_hours DECIMAL(4, 2), -- 7.5 hours
    status ENUM('present', 'absent', 'half_day', 'leave', 'holiday') DEFAULT 'present',
    
    -- Device info
    device_id BIGINT REFERENCES biometric_devices(id),
    raw_punches JSONB DEFAULT '[]', -- All punch times
    
    -- Manual adjustments
    is_manual BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    approved_by BIGINT REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, date)
);

CREATE INDEX idx_biometric_date ON biometric_attendances(date);
CREATE INDEX idx_biometric_teacher ON biometric_attendances(teacher_id);
```

### Table: `leave_requests`
```sql
CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    leave_type ENUM('casual', 'sick', 'earned', 'unpaid') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Student Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/students` | Get attendance for a section/date |
| POST | `/api/attendance/students` | Mark attendance (single/bulk) |
| PUT | `/api/attendance/students/{id}` | Update attendance record |
| GET | `/api/attendance/students/report` | Attendance report |

### Teacher Biometric
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/teachers` | Get teacher attendance |
| POST | `/api/attendance/sync-biometric` | Sync from devices |
| POST | `/api/attendance/manual` | Manual entry |
| GET | `/api/attendance/teachers/report` | Teacher attendance report |

---

## 🖥️ Backend Implementation

### Biometric Sync Service
```php
<?php

namespace App\Services;

use App\Models\BiometricDevice;
use App\Models\BiometricAttendance;
use App\Models\Teacher;
use Carbon\Carbon;

class BiometricSyncService
{
    /**
     * Sync attendance from all active devices
     */
    public function syncAll(): array
    {
        $results = [];
        $devices = BiometricDevice::where('is_active', true)->get();

        foreach ($devices as $device) {
            try {
                $punches = $this->fetchFromDevice($device);
                $processed = $this->processPunches($punches);
                $results[$device->device_name] = [
                    'success' => true,
                    'records' => count($processed),
                ];
                $device->update(['last_sync_at' => now()]);
            } catch (\Exception $e) {
                $results[$device->device_name] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Fetch punch logs from device
     */
    private function fetchFromDevice(BiometricDevice $device): array
    {
        // Using ZKTeco SDK or HTTP API
        $zk = new \ZKLib($device->device_ip, $device->device_port);
        
        if (!$zk->connect()) {
            throw new \Exception("Cannot connect to device");
        }

        $zk->disableDevice();
        $logs = $zk->getAttendance();
        $zk->enableDevice();
        $zk->disconnect();

        return $logs;
    }

    /**
     * Process punch logs into attendance records
     */
    private function processPunches(array $punches): array
    {
        $grouped = collect($punches)->groupBy(function ($punch) {
            return $punch['id'] . '_' . Carbon::parse($punch['timestamp'])->format('Y-m-d');
        });

        $processed = [];

        foreach ($grouped as $key => $dayPunches) {
            [$biometricId, $date] = explode('_', $key);
            
            $teacher = Teacher::where('biometric_id', $biometricId)->first();
            if (!$teacher) continue;

            $sortedPunches = $dayPunches->sortBy('timestamp');
            $punchIn = $sortedPunches->first();
            $punchOut = $sortedPunches->last();

            $workedHours = 0;
            if ($punchIn && $punchOut && $punchIn !== $punchOut) {
                $workedHours = Carbon::parse($punchIn['timestamp'])
                    ->diffInMinutes(Carbon::parse($punchOut['timestamp'])) / 60;
            }

            BiometricAttendance::updateOrCreate(
                ['teacher_id' => $teacher->id, 'date' => $date],
                [
                    'punch_in' => $punchIn['timestamp'],
                    'punch_out' => $punchOut['timestamp'],
                    'worked_hours' => round($workedHours, 2),
                    'raw_punches' => $dayPunches->pluck('timestamp')->toArray(),
                    'status' => $workedHours >= 4 ? 'present' : 'half_day',
                ]
            );

            $processed[] = $teacher->id;
        }

        return $processed;
    }
}
```

### Student Attendance Controller
```php
<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentAttendance;
use Illuminate\Http\Request;

class StudentAttendanceController extends Controller
{
    /**
     * Get attendance for a section on a date
     */
    public function index(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
            'date' => 'required|date',
        ]);

        $students = Student::where('section_id', $request->section_id)
            ->with(['attendances' => fn($q) => $q->whereDate('date', $request->date)])
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->full_name,
                    'roll_no' => $student->roll_no,
                    'status' => $student->attendances->first()?->status ?? null,
                ];
            });

        return response()->json(['data' => $students]);
    }

    /**
     * Mark attendance for multiple students
     */
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,half_day,leave',
        ]);

        foreach ($request->attendances as $record) {
            StudentAttendance::updateOrCreate(
                [
                    'student_id' => $record['student_id'],
                    'date' => $request->date,
                ],
                [
                    'status' => $record['status'],
                    'remarks' => $record['remarks'] ?? null,
                    'marked_by' => auth()->id(),
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Attendance marked successfully',
        ]);
    }
}
```

---

## 💻 Frontend Implementation

### Student Attendance Marking UI
```typescript
// app/(teacher)/attendance/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Student {
  id: number;
  name: string;
  roll_no: string;
  status: 'present' | 'absent' | 'late' | null;
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sectionId, setSectionId] = useState<number | null>(null);

  useEffect(() => {
    if (sectionId) {
      api.get('/attendance/students', { params: { section_id: sectionId, date } })
        .then(res => setStudents(res.data.data));
    }
  }, [sectionId, date]);

  const updateStatus = (studentId: number, status: string) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, status: status as any } : s
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: 'present' })));
  };

  const saveAttendance = async () => {
    await api.post('/attendance/students', {
      date,
      attendances: students.map(s => ({
        student_id: s.id,
        status: s.status || 'absent',
      })),
    });
    alert('Attendance saved!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <div className="flex gap-4">
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <Button variant="outline" onClick={markAllPresent}>
            Mark All Present
          </Button>
          <Button onClick={saveAttendance}>
            Save Attendance
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Roll No</th>
              <th className="px-4 py-3 text-left">Student Name</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="px-4 py-3">{student.roll_no}</td>
                <td className="px-4 py-3">{student.name}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    {['present', 'absent', 'late'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(student.id, status)}
                        className={cn(
                          'px-4 py-2 rounded text-sm font-medium transition',
                          student.status === status
                            ? status === 'present' ? 'bg-green-500 text-white' :
                              status === 'absent' ? 'bg-red-500 text-white' :
                              'bg-yellow-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        )}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## ⚙️ Biometric Device Setup

### Supported Devices
- **ZKTeco** (F18, K40, iClock series)
- **eSSL** (X990, Uface series)
- **HikVision** (DS-K1T series)

### Connection Flow
```
1. Register device in admin panel
   - Enter IP address and port
   - Select device type
   - Test connection

2. Register employee biometric ID
   - Employee enrolls finger/face on device
   - Note the User ID from device
   - Enter in teacher profile as "Biometric ID"

3. Schedule sync job
   - Laravel scheduler runs every 5 minutes
   - Fetches punch logs from all devices
   - Processes into attendance records
```

### Scheduler Setup
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->call(function () {
        app(BiometricSyncService::class)->syncAll();
    })->everyFiveMinutes();
}
```

---

## ✅ Verification Plan

| Test | Expected Result |
|------|-----------------|
| Mark student attendance | Records saved with marker info |
| Bulk mark all present | All students marked present |
| Sync biometric device | Punch logs imported correctly |
| Calculate worked hours | Hours calculated from in/out |
| Attendance report | Correct counts and percentages |

---

## 📝 Implementation Checklist

- [ ] Create all attendance tables
- [ ] Create BiometricSyncService
- [ ] Install ZKTeco PHP SDK
- [ ] Create attendance controllers
- [ ] Create Filament resources for devices
- [ ] Schedule biometric sync job
- [ ] Frontend: Student attendance marking
- [ ] Frontend: Teacher attendance view
- [ ] Frontend: Attendance reports

---

> 📝 **Next Module**: [08-fee-management.md](./08-fee-management.md)
