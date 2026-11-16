# 📣 Module 10: Communication Hub

> **Priority**: 🟢 Medium  
> **Dependencies**: Users  
> **Phase**: 5 (Advanced Features)  
> **Duration**: Week 19-20

---

## 📋 Overview

Communication hub manages all notifications including SMS, Email, WhatsApp, and in-app announcements.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Announcements | School-wide/class notices | 🟡 High |
| SMS Notifications | MSG91/Twilio integration | 🟡 High |
| Email Notifications | Laravel mail | 🟢 Medium |
| WhatsApp | Business API | 🟢 Medium |
| Fee Reminders | Automated alerts | 🟡 High |
| Attendance Alerts | Low attendance notify | 🟢 Medium |

---

## 🗄️ Database Schema

### Table: `announcements`
```sql
CREATE TABLE announcements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audience ENUM('all', 'students', 'teachers', 'parents', 'class') DEFAULT 'all',
    class_id BIGINT REFERENCES classes(id),
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `notification_logs`
```sql
CREATE TABLE notification_logs (
    id BIGSERIAL PRIMARY KEY,
    recipient_type VARCHAR(50), -- 'student', 'parent', 'teacher'
    recipient_id BIGINT,
    channel ENUM('sms', 'email', 'whatsapp', 'push') NOT NULL,
    template VARCHAR(100),
    message TEXT,
    status ENUM('pending', 'sent', 'failed', 'delivered') DEFAULT 'pending',
    external_id VARCHAR(100), -- Provider message ID
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/announcements` | List announcements |
| POST | `/api/announcements` | Create announcement |
| POST | `/api/notifications/send-sms` | Send SMS |
| POST | `/api/notifications/fee-reminder` | Bulk fee reminder |
| GET | `/api/notifications/logs` | View notification logs |

---

## 🖥️ Backend Implementation

### Notification Service
```php
<?php

namespace App\Services;

use App\Models\NotificationLog;
use Illuminate\Support\Facades\Http;

class NotificationService
{
    public function sendSms(string $phone, string $message, array $meta = []): bool
    {
        $log = NotificationLog::create([
            'recipient_type' => $meta['recipient_type'] ?? null,
            'recipient_id' => $meta['recipient_id'] ?? null,
            'channel' => 'sms',
            'template' => $meta['template'] ?? null,
            'message' => $message,
            'status' => 'pending',
        ]);

        try {
            // MSG91 API
            $response = Http::withHeaders([
                'authkey' => config('services.msg91.key'),
            ])->post('https://api.msg91.com/api/v5/flow/', [
                'template_id' => config('services.msg91.template_id'),
                'mobiles' => '91' . $phone,
                'message' => $message,
            ]);

            if ($response->successful()) {
                $log->update([
                    'status' => 'sent',
                    'external_id' => $response->json('request_id'),
                    'sent_at' => now(),
                ]);
                return true;
            }

            throw new \Exception($response->body());
        } catch (\Exception $e) {
            $log->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function sendFeeReminder(array $studentIds): array
    {
        $results = ['success' => 0, 'failed' => 0];
        
        foreach ($studentIds as $studentId) {
            $student = Student::with('primaryGuardian')->find($studentId);
            if (!$student || !$student->primaryGuardian) continue;

            $pending = $student->pendingFees()->sum('final_amount');
            $message = "Dear Parent, fee of Rs.{$pending} is pending for {$student->full_name}. Please pay at the earliest.";

            $success = $this->sendSms(
                $student->primaryGuardian->phone,
                $message,
                [
                    'recipient_type' => 'parent',
                    'recipient_id' => $student->primaryGuardian->id,
                    'template' => 'fee_reminder',
                ]
            );

            $success ? $results['success']++ : $results['failed']++;
        }

        return $results;
    }
}
```

---

## 📝 Implementation Checklist

- [ ] Create NotificationService
- [ ] Integrate MSG91/Twilio
- [ ] Create announcement CRUD
- [ ] Create notification logs table
- [ ] Setup Laravel queues for async sending
- [ ] Frontend: Announcement management
- [ ] Frontend: Notification center

---

> 📝 **Next Module**: [11-reporting-engine.md](./11-reporting-engine.md)
