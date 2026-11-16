# 👨‍👩‍👧 Module 12: Parent Portal

> **Priority**: 🟢 Medium  
> **Dependencies**: Students, Fees, Attendance  
> **Phase**: 5 (Advanced Features)  
> **Duration**: Week 17-18

---

## 📋 Overview

The parent portal is a cloud-hosted Next.js application that allows parents to view their child's academic progress, attendance, pay fees online, and communicate with teachers.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| OTP Login | Phone-based authentication | 🔴 Critical |
| Child Dashboard | View grades, attendance | 🔴 Critical |
| Online Fee Payment | Razorpay integration | 🟡 High |
| Receipt Downloads | PDF receipts | 🟡 High |
| Teacher Rating | Rate teachers on influence/quality | 🟡 High |
| Announcements | View school notices | 🟢 Medium |
| Teacher Messaging | Send messages | 🟢 Medium |

---

## 🔌 API Endpoints (Parent-facing)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parent/auth/send-otp` | Send OTP to phone |
| POST | `/api/parent/auth/verify-otp` | Verify and login |
| GET | `/api/parent/children` | List linked children |
| GET | `/api/parent/children/{id}/attendance` | Child attendance |
| GET | `/api/parent/children/{id}/grades` | Child grades |
| GET | `/api/parent/children/{id}/fees` | Fee status |
| POST | `/api/parent/children/{id}/pay` | Initiate payment |
| GET | `/api/parent/children/{id}/teachers` | Get child's teachers |
| GET | `/api/parent/teacher-ratings` | My submitted ratings |
| POST | `/api/parent/teacher-ratings` | Submit/update rating |

---

## 🖥️ Backend Implementation

### OTP Authentication
```php
<?php

namespace App\Http\Controllers\Parent;

use App\Models\Guardian;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    public function sendOtp(Request $request, NotificationService $sms)
    {
        $request->validate(['phone' => 'required|digits:10']);
        
        $guardian = Guardian::where('phone', $request->phone)->first();
        if (!$guardian) {
            return response()->json([
                'success' => false,
                'message' => 'Phone number not registered',
            ], 404);
        }

        $otp = rand(100000, 999999);
        Cache::put('otp_' . $request->phone, $otp, now()->addMinutes(10));
        
        $sms->sendSms($request->phone, "Your OTP is {$otp}. Valid for 10 minutes.");

        return response()->json(['success' => true, 'message' => 'OTP sent']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|digits:10',
            'otp' => 'required|digits:6',
        ]);

        $cachedOtp = Cache::get('otp_' . $request->phone);
        
        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP',
            ], 401);
        }

        Cache::forget('otp_' . $request->phone);
        
        $guardian = Guardian::where('phone', $request->phone)->first();
        $token = $guardian->user->createToken('parent-app')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'guardian' => $guardian,
                'children' => $guardian->students,
            ],
        ]);
    }
}
```

---

## 💻 Frontend Implementation

### Parent Dashboard
```typescript
// app/(parent)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, IndianRupee, Bell } from 'lucide-react';
import api from '@/lib/api';

interface Child {
  id: number;
  name: string;
  class_name: string;
  photo_url?: string;
}

export default function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [fees, setFees] = useState<any>(null);

  useEffect(() => {
    api.get('/parent/children').then(res => {
      setChildren(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedChild(res.data.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedChild) {
      api.get(`/parent/children/${selectedChild}/attendance`).then(res => setAttendance(res.data.data));
      api.get(`/parent/children/${selectedChild}/fees`).then(res => setFees(res.data.data));
    }
  }, [selectedChild]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, Parent!</h1>

      {/* Child Selector */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => setSelectedChild(child.id)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
              selectedChild === child.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {child.photo_url ? (
                <img src={child.photo_url} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{child.name[0]}</span>
              )}
            </div>
            <div className="text-left">
              <p className="font-medium">{child.name}</p>
              <p className="text-sm text-gray-500">{child.class_name}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="w-10 h-10 text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Attendance</p>
                  <p className="text-2xl font-bold">{attendance?.percentage || 0}%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <IndianRupee className="w-10 h-10 text-red-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Pending Fees</p>
                  <p className="text-2xl font-bold">₹{fees?.pending || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <BookOpen className="w-10 h-10 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Last Exam</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Pending Fees</CardTitle>
            </CardHeader>
            <CardContent>
              {fees?.items?.map((fee: any) => (
                <div key={fee.id} className="flex justify-between items-center p-4 border-b">
                  <div>
                    <p className="font-medium">{fee.category}</p>
                    <p className="text-sm text-gray-500">{fee.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">₹{fee.pending}</p>
                    <Button size="sm" onClick={() => initiatePayment(fee.id)}>
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 📝 Implementation Checklist

- [ ] Create parent auth routes with OTP
- [ ] Create parent API endpoints
- [ ] Deploy frontend on cloud (Vercel/Netlify)
- [ ] Configure subdomain (parents.erp.com)
- [ ] Integrate Razorpay for parent payments
- [ ] Design mobile-responsive UI
- [ ] Add push notifications

---

> 📝 **Next Module**: [13-sync-engine.md](./13-sync-engine.md)
