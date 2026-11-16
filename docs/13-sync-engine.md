# 🔄 Module 13: Sync Engine

> **Priority**: 🟡 High  
> **Dependencies**: All Modules  
> **Phase**: 6 (Testing & Launch)  
> **Duration**: Week 21-22

---

## 📋 Overview

The sync engine enables bidirectional data synchronization between the local school server and the cloud server, ensuring data consistency and enabling offline operation.

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Real-time Sync | Instant sync for critical data | 🔴 Critical |
| Scheduled Sync | Periodic full sync | 🔴 Critical |
| Conflict Resolution | Handle concurrent edits | 🟡 High |
| Offline Queue | Queue changes when offline | 🔴 Critical |
| Sync Status | Monitor sync health | 🟢 Medium |
| Manual Sync | Trigger sync on demand | 🟢 Medium |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL SERVER (School)                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    PostgreSQL (Primary)                     ││
│  │  • All CRUD operations happen here                          ││
│  │  • sync_status table tracks pending changes                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                               │                                  │
│                               ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    SYNC ENGINE (Laravel)                    ││
│  │  • Watches for changes via database triggers                ││
│  │  • Queues changes for sync                                  ││
│  │  • Runs every 5 minutes (configurable)                      ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────│─────────────────────────────────┘
                                │
                    ════════════│════════════  INTERNET (HTTPS)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUD SERVER                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    PostgreSQL (Replica)                     ││
│  │  • Receives synced data                                     ││
│  │  • Powers parent portal                                     ││
│  │  • Handles online payments                                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Table: `sync_log` (Both servers)
```sql
CREATE TABLE sync_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    operation ENUM('insert', 'update', 'delete') NOT NULL,
    data JSONB, -- Full row data
    synced BOOLEAN DEFAULT FALSE,
    synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(table_name, record_id, operation, created_at)
);

CREATE INDEX idx_sync_pending ON sync_log(synced) WHERE synced = FALSE;
```

### Table: `sync_status` (Local server)
```sql
CREATE TABLE sync_status (
    id SERIAL PRIMARY KEY,
    last_sync_at TIMESTAMP,
    pending_count INT DEFAULT 0,
    status ENUM('idle', 'syncing', 'error') DEFAULT 'idle',
    error_message TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/push` | Push changes from local to cloud |
| POST | `/api/sync/pull` | Pull changes from cloud to local |
| GET | `/api/sync/status` | Get sync status |
| POST | `/api/sync/trigger` | Manually trigger sync |
| GET | `/api/sync/pending` | List pending changes |

---

## 🖥️ Backend Implementation

### Sync Service
```php
<?php

namespace App\Services;

use App\Models\SyncLog;
use App\Models\SyncStatus;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class SyncService
{
    private string $cloudUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->cloudUrl = config('sync.cloud_url');
        $this->apiKey = config('sync.api_key');
    }

    /**
     * Push pending changes to cloud
     */
    public function push(): array
    {
        $status = SyncStatus::first();
        $status->update(['status' => 'syncing']);

        try {
            $pending = SyncLog::where('synced', false)
                ->orderBy('created_at')
                ->limit(1000)
                ->get();

            if ($pending->isEmpty()) {
                $status->update([
                    'status' => 'idle',
                    'pending_count' => 0,
                    'last_sync_at' => now(),
                ]);
                return ['success' => true, 'synced' => 0];
            }

            $response = Http::withHeaders([
                'X-Sync-Key' => $this->apiKey,
                'X-Tenant-Id' => tenant()->id,
            ])->post($this->cloudUrl . '/api/sync/receive', [
                'changes' => $pending->toArray(),
            ]);

            if ($response->successful()) {
                $syncedIds = $response->json('synced_ids');
                SyncLog::whereIn('id', $syncedIds)->update([
                    'synced' => true,
                    'synced_at' => now(),
                ]);

                $status->update([
                    'status' => 'idle',
                    'pending_count' => SyncLog::where('synced', false)->count(),
                    'last_sync_at' => now(),
                ]);

                return ['success' => true, 'synced' => count($syncedIds)];
            }

            throw new \Exception($response->body());
        } catch (\Exception $e) {
            $status->update([
                'status' => 'error',
                'error_message' => $e->getMessage(),
            ]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Pull changes from cloud (e.g., online payments)
     */
    public function pull(): array
    {
        $response = Http::withHeaders([
            'X-Sync-Key' => $this->apiKey,
            'X-Tenant-Id' => tenant()->id,
        ])->get($this->cloudUrl . '/api/sync/changes', [
            'since' => SyncStatus::first()->last_sync_at,
        ]);

        if (!$response->successful()) {
            return ['success' => false, 'error' => 'Failed to fetch changes'];
        }

        $changes = $response->json('changes');
        $applied = 0;

        DB::beginTransaction();
        try {
            foreach ($changes as $change) {
                $this->applyChange($change);
                $applied++;
            }
            DB::commit();

            // Acknowledge received changes
            Http::withHeaders([
                'X-Sync-Key' => $this->apiKey,
            ])->post($this->cloudUrl . '/api/sync/acknowledge', [
                'ids' => collect($changes)->pluck('id')->toArray(),
            ]);

            return ['success' => true, 'applied' => $applied];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function applyChange(array $change): void
    {
        $model = 'App\\Models\\' . studly_case(str_singular($change['table_name']));
        
        switch ($change['operation']) {
            case 'insert':
                $model::create($change['data']);
                break;
            case 'update':
                $model::find($change['record_id'])?->update($change['data']);
                break;
            case 'delete':
                $model::find($change['record_id'])?->delete();
                break;
        }
    }
}
```

### Database Trigger (PostgreSQL)
```sql
-- Function to log changes
CREATE OR REPLACE FUNCTION log_sync_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO sync_log (table_name, record_id, operation, data)
        VALUES (TG_TABLE_NAME, NEW.id, 'insert', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO sync_log (table_name, record_id, operation, data)
        VALUES (TG_TABLE_NAME, NEW.id, 'update', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO sync_log (table_name, record_id, operation, data)
        VALUES (TG_TABLE_NAME, OLD.id, 'delete', row_to_json(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables that need syncing
CREATE TRIGGER sync_students AFTER INSERT OR UPDATE OR DELETE ON students
    FOR EACH ROW EXECUTE FUNCTION log_sync_change();

CREATE TRIGGER sync_fee_payments AFTER INSERT OR UPDATE OR DELETE ON fee_payments
    FOR EACH ROW EXECUTE FUNCTION log_sync_change();

CREATE TRIGGER sync_attendances AFTER INSERT OR UPDATE OR DELETE ON student_attendances
    FOR EACH ROW EXECUTE FUNCTION log_sync_change();
```

### Laravel Scheduler
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Sync every 5 minutes
    $schedule->call(function () {
        app(SyncService::class)->push();
        app(SyncService::class)->pull();
    })->everyFiveMinutes()->withoutOverlapping();

    // Full reconciliation daily at midnight
    $schedule->call(function () {
        app(SyncService::class)->fullReconciliation();
    })->dailyAt('00:00');
}
```

---

## 💻 Frontend Implementation

### Sync Status Widget
```typescript
// components/sync/SyncStatus.tsx
'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface SyncStatusData {
  status: 'idle' | 'syncing' | 'error';
  last_sync_at: string;
  pending_count: number;
  error_message?: string;
}

export function SyncStatusWidget() {
  const [syncStatus, setSyncStatus] = useState<SyncStatusData | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    const res = await api.get('/sync/status');
    setSyncStatus(res.data.data);
  };

  const triggerSync = async () => {
    setSyncing(true);
    await api.post('/sync/trigger');
    await fetchStatus();
    setSyncing(false);
  };

  const getStatusIcon = () => {
    if (!syncStatus) return <CloudOff className="w-5 h-5 text-gray-400" />;
    switch (syncStatus.status) {
      case 'idle':
        return <Cloud className="w-5 h-5 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-white border rounded-lg shadow-sm">
      {getStatusIcon()}
      <div className="text-sm">
        {syncStatus?.status === 'syncing' && <span>Syncing...</span>}
        {syncStatus?.status === 'idle' && (
          <span>
            Last sync: {new Date(syncStatus.last_sync_at).toLocaleTimeString()}
            {syncStatus.pending_count > 0 && (
              <span className="ml-2 text-orange-500">
                ({syncStatus.pending_count} pending)
              </span>
            )}
          </span>
        )}
        {syncStatus?.status === 'error' && (
          <span className="text-red-500">Sync error</span>
        )}
      </div>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={triggerSync}
        disabled={syncing}
      >
        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
```

---

## ⚙️ Configuration

### config/sync.php
```php
<?php

return [
    'cloud_url' => env('SYNC_CLOUD_URL', 'https://cloud.schoolerp.com'),
    'api_key' => env('SYNC_API_KEY'),
    'interval_minutes' => env('SYNC_INTERVAL', 5),
    
    'tables' => [
        'students' => ['sync' => true, 'priority' => 'high'],
        'fee_payments' => ['sync' => true, 'priority' => 'high'],
        'student_attendances' => ['sync' => true, 'priority' => 'normal'],
        'biometric_attendances' => ['sync' => true, 'priority' => 'low'],
        'users' => ['sync' => true, 'priority' => 'high'],
    ],
    
    'conflict_resolution' => 'last_write_wins', // or 'manual'
];
```

---

## ✅ Verification Plan

| Test | Expected Result |
|------|-----------------|
| Create student locally | Appears on cloud after sync |
| Online payment on cloud | Appears locally after sync |
| Network disconnection | Changes queued, sync after reconnect |
| Concurrent edit | Last write wins (or manual resolution) |
| Sync status visible | Shows correct pending count and status |

---

## 📝 Implementation Checklist

- [ ] Create sync_log table and triggers
- [ ] Create SyncService with push/pull
- [ ] Setup cloud API endpoints
- [ ] Configure Laravel scheduler
- [ ] Add conflict resolution logic
- [ ] Frontend: Sync status widget
- [ ] Test offline scenarios
- [ ] Add sync monitoring dashboard

---

## 🎉 Documentation Complete!

This completes the module documentation for the School ERP system. Navigate to [00-project-overview.md](./00-project-overview.md) for the master roadmap.
