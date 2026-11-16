# 📊 Module 11: Reporting Engine

> **Priority**: 🟢 Medium  
> **Dependencies**: All Data Modules  
> **Phase**: 5 (Advanced Features)  
> **Duration**: Week 19-20

---

## 📋 Overview

The reporting engine provides comprehensive analytics and export capabilities for academic, financial, and attendance data.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Academic Reports | Class/student performance | 🟡 High |
| Attendance Reports | Daily, monthly summaries | 🟡 High |
| Financial Reports | Collection, outstanding | 🔴 Critical |
| Export to Excel | Download reports | 🟡 High |
| Dashboard Charts | Visual analytics | 🟢 Medium |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/dashboard` | Dashboard statistics |
| GET | `/api/reports/attendance/students` | Student attendance report |
| GET | `/api/reports/attendance/teachers` | Teacher attendance report |
| GET | `/api/reports/fees/collection` | Fee collection report |
| GET | `/api/reports/fees/outstanding` | Outstanding dues |
| GET | `/api/reports/academic/class-results` | Class result analysis |
| GET | `/api/reports/export/{type}` | Export as Excel |

---

## 🖥️ Backend Implementation

### Report Service
```php
<?php

namespace App\Services;

use App\Models\Student;
use App\Models\FeePayment;
use App\Models\StudentAttendance;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class ReportService
{
    public function getDashboardStats(): array
    {
        return [
            'total_students' => Student::active()->count(),
            'total_teachers' => Teacher::where('status', 'active')->count(),
            'today_collection' => FeePayment::whereDate('payment_date', today())->sum('amount'),
            'monthly_collection' => FeePayment::whereMonth('payment_date', now()->month)->sum('amount'),
            'pending_dues' => StudentFee::where('status', '!=', 'paid')->sum(\DB::raw('final_amount - paid_amount')),
            'today_attendance' => [
                'present' => StudentAttendance::whereDate('date', today())->where('status', 'present')->count(),
                'absent' => StudentAttendance::whereDate('date', today())->where('status', 'absent')->count(),
            ],
        ];
    }

    public function getCollectionReport(Carbon $startDate, Carbon $endDate): array
    {
        $payments = FeePayment::whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw('DATE(payment_date) as date, SUM(amount) as total, payment_mode')
            ->groupBy('date', 'payment_mode')
            ->orderBy('date')
            ->get();

        return [
            'summary' => [
                'total' => $payments->sum('total'),
                'by_mode' => $payments->groupBy('payment_mode')->map->sum('total'),
            ],
            'daily' => $payments->groupBy('date'),
        ];
    }

    public function getOutstandingReport(): array
    {
        return Student::active()
            ->with(['section.classModel', 'pendingFees'])
            ->get()
            ->filter(fn($s) => $s->pendingFees->sum(\DB::raw('final_amount - paid_amount')) > 0)
            ->map(fn($s) => [
                'student_id' => $s->id,
                'name' => $s->full_name,
                'class' => $s->class_name,
                'pending_amount' => $s->pendingFees->sum(\DB::raw('final_amount - paid_amount')),
                'guardian_phone' => $s->primaryGuardian?->phone,
            ])
            ->sortByDesc('pending_amount')
            ->values()
            ->toArray();
    }

    public function exportToExcel(string $type, array $filters = []): string
    {
        $exportClass = match($type) {
            'students' => new StudentExport($filters),
            'collection' => new CollectionExport($filters),
            'outstanding' => new OutstandingExport($filters),
            'attendance' => new AttendanceExport($filters),
            default => throw new \Exception('Unknown export type'),
        };

        $filename = $type . '_' . now()->format('Y-m-d') . '.xlsx';
        Excel::store($exportClass, $filename, 'temp');
        
        return storage_path('app/temp/' . $filename);
    }
}
```

---

## 💻 Frontend Implementation

### Dashboard Overview
```typescript
// app/(admin)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, GraduationCap, IndianRupee, UserCheck } from 'lucide-react';
import api from '@/lib/api';

interface DashboardData {
  total_students: number;
  total_teachers: number;
  today_collection: number;
  monthly_collection: number;
  pending_dues: number;
  today_attendance: { present: number; absent: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [collectionChart, setCollectionChart] = useState<any[]>([]);

  useEffect(() => {
    api.get('/reports/dashboard').then(res => setStats(res.data.data));
    api.get('/reports/fees/collection?period=month').then(res => {
      setCollectionChart(res.data.data.daily);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <GraduationCap className="w-10 h-10 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{stats?.total_students || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="w-10 h-10 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Teachers</p>
              <p className="text-2xl font-bold">{stats?.total_teachers || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <IndianRupee className="w-10 h-10 text-emerald-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Today's Collection</p>
              <p className="text-2xl font-bold">₹{stats?.today_collection?.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <UserCheck className="w-10 h-10 text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Today's Attendance</p>
              <p className="text-2xl font-bold">
                {stats?.today_attendance?.present || 0} / 
                {(stats?.today_attendance?.present || 0) + (stats?.today_attendance?.absent || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Collection Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="total" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📝 Implementation Checklist

- [ ] Create ReportService with all report methods
- [ ] Install maatwebsite/excel for exports
- [ ] Create export classes for each report
- [ ] Create report API endpoints
- [ ] Frontend: Admin dashboard with charts
- [ ] Frontend: Report filters and downloads
- [ ] Add caching for expensive reports

---

> 📝 **Next Module**: [12-parent-portal.md](./12-parent-portal.md)
