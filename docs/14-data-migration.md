# 📥 Module 14: Data Migration & Import

> **Priority**: 🔴 Critical (for onboarding)  
> **Dependencies**: Academic Structure, Students, Teachers, Fees  
> **Phase**: 1 (Foundation) - Run during school setup  
> **Duration**: Week 2-3

---

## 📋 Overview

The Data Migration module provides a **hassle-free UI** to import data from existing school databases or spreadsheets. This is critical for schools transitioning from legacy systems (Tally, Excel, custom software, or other ERPs).

---

## 🎯 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Database Connection | Connect to existing MySQL/PostgreSQL/SQL Server | 🔴 Critical |
| Excel/CSV Import | Bulk upload via spreadsheets | 🔴 Critical |
| Data Mapping UI | Visual column-to-field mapping | 🔴 Critical |
| Preview & Validation | Preview data before import | 🔴 Critical |
| Incremental Import | Add new records without duplicates | 🟡 High |
| Rollback Support | Undo failed imports | 🟡 High |
| Import Templates | Downloadable Excel templates | 🟡 High |
| Progress Tracking | Real-time import status | 🟢 Medium |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA MIGRATION WIZARD                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 1: Choose Source                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Database   │  │  Excel/CSV   │  │   Template   │           │
│  │  Connection  │  │    Upload    │  │   Download   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                           │                                      │
│                           ▼                                      │
│  STEP 2: Select Data Type                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ☑ Students  ☑ Teachers  ☑ Classes  ☑ Fees  ☐ Marks     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  STEP 3: Map Columns                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Source Column    →    Target Field                       │   │
│  │  ─────────────        ─────────────                       │   │
│  │  "student_name"   →   first_name + last_name              │   │
│  │  "class"          →   class_id (lookup)                   │   │
│  │  "father_name"    →   guardian.name (relation:father)     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  STEP 4: Preview & Validate                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ✅ 450 valid records                                     │   │
│  │  ⚠️ 12 warnings (missing phone)                           │   │
│  │  ❌ 3 errors (duplicate admission no)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  STEP 5: Import                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ████████████████████░░░░░░░░░░░  65% (293/450)          │   │
│  │  Importing students...                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Table: `import_jobs`
```sql
CREATE TABLE import_jobs (
    id BIGSERIAL PRIMARY KEY,
    job_type ENUM('students', 'teachers', 'classes', 'fees', 'marks', 'mixed') NOT NULL,
    source_type ENUM('database', 'excel', 'csv') NOT NULL,
    
    -- Connection details (encrypted)
    source_config JSONB, -- {host, port, database, table}
    
    -- File details
    file_path VARCHAR(500),
    original_filename VARCHAR(255),
    
    -- Mapping configuration
    column_mapping JSONB NOT NULL, -- {source_col: target_field}
    
    -- Statistics
    total_records INT DEFAULT 0,
    processed_records INT DEFAULT 0,
    success_count INT DEFAULT 0,
    error_count INT DEFAULT 0,
    warning_count INT DEFAULT 0,
    
    -- Status
    status ENUM('pending', 'validating', 'importing', 'completed', 'failed', 'rolled_back') DEFAULT 'pending',
    error_log JSONB DEFAULT '[]',
    
    -- Rollback support
    rollback_data JSONB, -- IDs of created records
    
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_import_jobs_status ON import_jobs(status);
```

### Table: `import_templates`
```sql
CREATE TABLE import_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Student Import Template'
    entity_type VARCHAR(50) NOT NULL, -- 'students'
    columns JSONB NOT NULL, -- [{name, required, type, example}]
    sample_file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Import Wizard
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/import/connect-database` | Test database connection |
| POST | `/api/import/upload-file` | Upload Excel/CSV file |
| GET | `/api/import/preview/{jobId}` | Preview data with validation |
| POST | `/api/import/validate/{jobId}` | Run full validation |
| POST | `/api/import/start/{jobId}` | Begin import |
| GET | `/api/import/status/{jobId}` | Get import progress |
| POST | `/api/import/rollback/{jobId}` | Undo import |

### Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/import/templates` | List available templates |
| GET | `/api/import/templates/{type}/download` | Download Excel template |

### Database Schema Discovery
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/import/discover-tables` | List tables in connected DB |
| POST | `/api/import/discover-columns` | List columns in a table |

---

## 🖥️ Backend Implementation

### Database Connection Service
```php
<?php

namespace App\Services\Import;

use Illuminate\Support\Facades\DB;
use PDO;

class DatabaseConnectionService
{
    public function testConnection(array $config): array
    {
        try {
            $dsn = $this->buildDsn($config);
            $pdo = new PDO(
                $dsn,
                $config['username'],
                $config['password'],
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            
            return [
                'success' => true,
                'message' => 'Connection successful',
                'server_version' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    public function getTables(array $config): array
    {
        $pdo = $this->connect($config);
        
        $query = match($config['driver']) {
            'mysql' => "SHOW TABLES",
            'pgsql' => "SELECT tablename FROM pg_tables WHERE schemaname = 'public'",
            'sqlsrv' => "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'",
            default => throw new \Exception('Unsupported database driver'),
        };

        return $pdo->query($query)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getColumns(array $config, string $table): array
    {
        $pdo = $this->connect($config);
        
        $query = match($config['driver']) {
            'mysql' => "DESCRIBE `{$table}`",
            'pgsql' => "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{$table}'",
            'sqlsrv' => "SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{$table}'",
            default => throw new \Exception('Unsupported database driver'),
        };

        return $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function fetchData(array $config, string $table, int $limit = 1000): array
    {
        $pdo = $this->connect($config);
        $stmt = $pdo->query("SELECT * FROM {$table} LIMIT {$limit}");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function connect(array $config): PDO
    {
        return new PDO(
            $this->buildDsn($config),
            $config['username'],
            $config['password']
        );
    }

    private function buildDsn(array $config): string
    {
        return match($config['driver']) {
            'mysql' => "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']}",
            'pgsql' => "pgsql:host={$config['host']};port={$config['port']};dbname={$config['database']}",
            'sqlsrv' => "sqlsrv:Server={$config['host']},{$config['port']};Database={$config['database']}",
            default => throw new \Exception('Unsupported driver'),
        };
    }
}
```

### Import Service
```php
<?php

namespace App\Services\Import;

use App\Models\ImportJob;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Guardian;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class DataImportService
{
    public function processExcelUpload(string $filePath, string $entityType): ImportJob
    {
        $data = Excel::toArray(null, $filePath)[0];
        $headers = array_map('strtolower', array_map('trim', $data[0]));
        
        $job = ImportJob::create([
            'job_type' => $entityType,
            'source_type' => 'excel',
            'file_path' => $filePath,
            'total_records' => count($data) - 1, // Exclude header
            'status' => 'pending',
            'created_by' => auth()->id(),
        ]);

        // Store raw data for preview
        cache()->put("import_raw_{$job->id}", [
            'headers' => $headers,
            'rows' => array_slice($data, 1, 100), // First 100 rows for preview
        ], now()->addHours(2));

        return $job;
    }

    public function autoDetectMapping(ImportJob $job): array
    {
        $rawData = cache()->get("import_raw_{$job->id}");
        $sourceHeaders = $rawData['headers'];
        
        $targetFields = $this->getTargetFields($job->job_type);
        $suggestions = [];

        foreach ($targetFields as $field) {
            $bestMatch = $this->findBestMatch($field['name'], $sourceHeaders);
            $suggestions[$field['name']] = [
                'target' => $field,
                'suggested_source' => $bestMatch,
                'confidence' => $bestMatch ? $this->calculateConfidence($field['name'], $bestMatch) : 0,
            ];
        }

        return $suggestions;
    }

    public function validateData(ImportJob $job): array
    {
        $rawData = cache()->get("import_raw_{$job->id}");
        $mapping = $job->column_mapping;
        
        $results = [
            'valid' => [],
            'warnings' => [],
            'errors' => [],
        ];

        foreach ($rawData['rows'] as $index => $row) {
            $rowData = array_combine($rawData['headers'], $row);
            $validation = $this->validateRow($rowData, $mapping, $job->job_type, $index + 2);
            
            if ($validation['status'] === 'error') {
                $results['errors'][] = $validation;
            } elseif ($validation['status'] === 'warning') {
                $results['warnings'][] = $validation;
                $results['valid'][] = $validation['data'];
            } else {
                $results['valid'][] = $validation['data'];
            }
        }

        $job->update([
            'status' => 'validated',
            'error_count' => count($results['errors']),
            'warning_count' => count($results['warnings']),
        ]);

        return $results;
    }

    public function executeImport(ImportJob $job): void
    {
        $job->update(['status' => 'importing', 'started_at' => now()]);
        
        $rawData = cache()->get("import_raw_{$job->id}");
        $mapping = $job->column_mapping;
        $createdIds = [];
        $processed = 0;

        DB::beginTransaction();
        
        try {
            foreach ($rawData['rows'] as $row) {
                $rowData = array_combine($rawData['headers'], $row);
                $mapped = $this->mapRow($rowData, $mapping);
                
                $record = $this->createRecord($job->job_type, $mapped);
                $createdIds[] = $record->id;
                
                $processed++;
                
                // Update progress every 50 records
                if ($processed % 50 === 0) {
                    $job->update([
                        'processed_records' => $processed,
                        'success_count' => $processed,
                    ]);
                }
            }

            DB::commit();

            $job->update([
                'status' => 'completed',
                'processed_records' => $processed,
                'success_count' => $processed,
                'rollback_data' => $createdIds,
                'completed_at' => now(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            $job->update([
                'status' => 'failed',
                'error_log' => [['message' => $e->getMessage(), 'row' => $processed]],
            ]);
            
            throw $e;
        }
    }

    public function rollbackImport(ImportJob $job): void
    {
        $createdIds = $job->rollback_data;
        
        $modelClass = match($job->job_type) {
            'students' => Student::class,
            'teachers' => Teacher::class,
            default => throw new \Exception('Unsupported entity type'),
        };

        $modelClass::whereIn('id', $createdIds)->delete();
        
        $job->update(['status' => 'rolled_back']);
    }

    private function getTargetFields(string $entityType): array
    {
        return match($entityType) {
            'students' => [
                ['name' => 'first_name', 'required' => true, 'type' => 'string'],
                ['name' => 'last_name', 'required' => false, 'type' => 'string'],
                ['name' => 'admission_no', 'required' => true, 'type' => 'string'],
                ['name' => 'date_of_birth', 'required' => true, 'type' => 'date'],
                ['name' => 'gender', 'required' => true, 'type' => 'enum:male,female,other'],
                ['name' => 'class_name', 'required' => true, 'type' => 'lookup:classes'],
                ['name' => 'section_name', 'required' => true, 'type' => 'lookup:sections'],
                ['name' => 'phone', 'required' => false, 'type' => 'string'],
                ['name' => 'email', 'required' => false, 'type' => 'email'],
                ['name' => 'address', 'required' => false, 'type' => 'text'],
                ['name' => 'father_name', 'required' => false, 'type' => 'string'],
                ['name' => 'father_phone', 'required' => false, 'type' => 'string'],
                ['name' => 'mother_name', 'required' => false, 'type' => 'string'],
                ['name' => 'mother_phone', 'required' => false, 'type' => 'string'],
            ],
            'teachers' => [
                ['name' => 'first_name', 'required' => true, 'type' => 'string'],
                ['name' => 'last_name', 'required' => false, 'type' => 'string'],
                ['name' => 'employee_id', 'required' => true, 'type' => 'string'],
                ['name' => 'email', 'required' => true, 'type' => 'email'],
                ['name' => 'phone', 'required' => true, 'type' => 'string'],
                ['name' => 'department', 'required' => false, 'type' => 'string'],
                ['name' => 'designation', 'required' => false, 'type' => 'string'],
                ['name' => 'joining_date', 'required' => true, 'type' => 'date'],
            ],
            default => [],
        };
    }

    private function findBestMatch(string $targetField, array $sourceHeaders): ?string
    {
        $aliases = [
            'first_name' => ['firstname', 'first_name', 'fname', 'student_name', 'name', 'student name'],
            'last_name' => ['lastname', 'last_name', 'lname', 'surname'],
            'admission_no' => ['admission_no', 'admno', 'adm_no', 'admission number', 'roll_no', 'rollno'],
            'date_of_birth' => ['dob', 'date_of_birth', 'birth_date', 'birthdate', 'birth date'],
            'gender' => ['gender', 'sex'],
            'class_name' => ['class', 'class_name', 'grade', 'standard', 'std'],
            'section_name' => ['section', 'section_name', 'div', 'division'],
            'phone' => ['phone', 'mobile', 'contact', 'contact_no', 'mobile_no', 'phone_no'],
            'email' => ['email', 'email_id', 'mail'],
            'address' => ['address', 'addr', 'residential_address'],
            'father_name' => ['father_name', 'father', 'fathername', 'father name', 'guardian'],
            'father_phone' => ['father_phone', 'father_mobile', 'fatherphone', 'guardian_phone'],
            'mother_name' => ['mother_name', 'mother', 'mothername', 'mother name'],
        ];

        $targetAliases = $aliases[$targetField] ?? [$targetField];
        
        foreach ($sourceHeaders as $header) {
            $normalized = strtolower(str_replace([' ', '-', '_'], '', $header));
            foreach ($targetAliases as $alias) {
                $normalizedAlias = strtolower(str_replace([' ', '-', '_'], '', $alias));
                if ($normalized === $normalizedAlias) {
                    return $header;
                }
            }
        }

        return null;
    }

    private function calculateConfidence(string $target, string $source): int
    {
        similar_text(strtolower($target), strtolower($source), $percent);
        return (int) $percent;
    }
}
```

---

## 💻 Frontend Implementation

### Import Wizard Component
```typescript
// app/(admin)/import/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, FileSpreadsheet, Download, Upload, Check, X, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

type Step = 'source' | 'type' | 'mapping' | 'preview' | 'import';

export default function ImportWizardPage() {
  const [step, setStep] = useState<Step>('source');
  const [sourceType, setSourceType] = useState<'database' | 'excel' | null>(null);
  const [entityType, setEntityType] = useState<string>('students');
  const [jobId, setJobId] = useState<number | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<any>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [dbConfig, setDbConfig] = useState({
    driver: 'mysql',
    host: 'localhost',
    port: '3306',
    database: '',
    username: '',
    password: '',
  });

  // Step 1: Choose Source
  const renderSourceStep = () => (
    <div className="grid grid-cols-3 gap-6">
      <Card 
        className={`cursor-pointer hover:border-blue-500 transition ${sourceType === 'database' ? 'border-blue-500 bg-blue-50' : ''}`}
        onClick={() => setSourceType('database')}
      >
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Database className="w-16 h-16 text-blue-500 mb-4" />
          <h3 className="font-semibold text-lg">Existing Database</h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            Connect to MySQL, PostgreSQL, or SQL Server
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className={`cursor-pointer hover:border-green-500 transition ${sourceType === 'excel' ? 'border-green-500 bg-green-50' : ''}`}
        onClick={() => setSourceType('excel')}
      >
        <CardContent className="flex flex-col items-center justify-center p-8">
          <FileSpreadsheet className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="font-semibold text-lg">Excel / CSV File</h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            Upload spreadsheet with your data
          </p>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:border-purple-500 transition">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Download className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="font-semibold text-lg">Download Template</h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            Get Excel template with correct format
          </p>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={() => downloadTemplate('students')}>
              Students
            </Button>
            <Button size="sm" variant="outline" onClick={() => downloadTemplate('teachers')}>
              Teachers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 2: Database Connection Form
  const renderDatabaseConfig = () => (
    <Card>
      <CardHeader>
        <CardTitle>Connect to Existing Database</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Database Type</label>
            <Select value={dbConfig.driver} onValueChange={(v) => setDbConfig({...dbConfig, driver: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="pgsql">PostgreSQL</SelectItem>
                <SelectItem value="sqlsrv">SQL Server</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Host</label>
            <Input 
              value={dbConfig.host} 
              onChange={(e) => setDbConfig({...dbConfig, host: e.target.value})}
              placeholder="localhost or IP address"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Port</label>
            <Input 
              value={dbConfig.port} 
              onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Database Name</label>
            <Input 
              value={dbConfig.database} 
              onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Username</label>
            <Input 
              value={dbConfig.username} 
              onChange={(e) => setDbConfig({...dbConfig, username: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input 
              type="password"
              value={dbConfig.password} 
              onChange={(e) => setDbConfig({...dbConfig, password: e.target.value})}
            />
          </div>
        </div>
        <Button onClick={testConnection}>Test Connection</Button>
      </CardContent>
    </Card>
  );

  // Step 3: Column Mapping UI
  const renderMappingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Map Columns to Fields</CardTitle>
        <p className="text-sm text-gray-500">
          Match your source columns to the correct fields. Auto-detected mappings are highlighted.
        </p>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Target Field</th>
              <th className="p-3 text-left">Required</th>
              <th className="p-3 text-left">Source Column</th>
              <th className="p-3 text-left">Sample Data</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(mapping).map(([field, config]: [string, any]) => (
              <tr key={field} className="border-t">
                <td className="p-3 font-medium">{field}</td>
                <td className="p-3">
                  {config.required ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-400">Optional</span>
                  )}
                </td>
                <td className="p-3">
                  <Select 
                    value={config.source || ''} 
                    onValueChange={(v) => updateMapping(field, v)}
                  >
                    <SelectTrigger className={config.confidence > 80 ? 'border-green-500' : ''}>
                      <SelectValue placeholder="Select column..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Skip --</SelectItem>
                      {preview?.headers.map((h: string) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {config.sample || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );

  // Step 4: Preview & Validation
  const renderPreviewStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Preview & Validation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Check className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-700">{preview?.valid?.length || 0}</p>
              <p className="text-sm text-green-600">Valid Records</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-yellow-700">{preview?.warnings?.length || 0}</p>
              <p className="text-sm text-yellow-600">Warnings</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <X className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-700">{preview?.errors?.length || 0}</p>
              <p className="text-sm text-red-600">Errors</p>
            </div>
          </div>
        </div>

        {preview?.errors?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-red-700 mb-2">Errors (will not be imported)</h4>
            <div className="max-h-40 overflow-y-auto border rounded">
              {preview.errors.map((err: any, i: number) => (
                <div key={i} className="p-2 border-b text-sm">
                  Row {err.row}: {err.message}
                </div>
              ))}
            </div>
          </div>
        )}

        <h4 className="font-medium mb-2">Data Preview (first 10 rows)</h4>
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(mapping).filter(k => mapping[k].source).map(k => (
                  <th key={k} className="p-2 text-left">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview?.valid?.slice(0, 10).map((row: any, i: number) => (
                <tr key={i} className="border-t">
                  {Object.keys(mapping).filter(k => mapping[k].source).map(k => (
                    <td key={k} className="p-2">{row[k] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  // Step 5: Import Progress
  const renderImportStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Import in Progress</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="#e5e7eb" strokeWidth="10"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="#22c55e" strokeWidth="10"
              strokeDasharray={`${importProgress * 2.83} 283`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{importProgress}%</span>
          </div>
        </div>
        <p className="text-lg mb-2">Importing {entityType}...</p>
        <p className="text-gray-500">{Math.round(importProgress * preview?.valid?.length / 100)} of {preview?.valid?.length} records</p>
      </CardContent>
    </Card>
  );

  const downloadTemplate = async (type: string) => {
    window.open(`/api/import/templates/${type}/download`, '_blank');
  };

  const testConnection = async () => {
    const res = await api.post('/import/connect-database', dbConfig);
    if (res.data.success) {
      alert('Connection successful!');
    } else {
      alert('Connection failed: ' + res.data.message);
    }
  };

  const updateMapping = (field: string, sourceColumn: string) => {
    setMapping({
      ...mapping,
      [field]: { ...mapping[field], source: sourceColumn },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Import Wizard</h1>
      
      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {['source', 'type', 'mapping', 'preview', 'import'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === s ? 'bg-blue-500 text-white' : 
              ['source', 'type', 'mapping', 'preview', 'import'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              {i + 1}
            </div>
            {i < 4 && <div className="w-16 h-1 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 'source' && renderSourceStep()}
      {step === 'source' && sourceType === 'database' && renderDatabaseConfig()}
      {step === 'mapping' && renderMappingStep()}
      {step === 'preview' && renderPreviewStep()}
      {step === 'import' && renderImportStep()}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => setStep(prev => prev === 'type' ? 'source' : prev === 'mapping' ? 'type' : prev === 'preview' ? 'mapping' : 'source')}
          disabled={step === 'source' || step === 'import'}
        >
          Back
        </Button>
        <Button 
          onClick={() => {
            if (step === 'source') setStep('type');
            else if (step === 'type') setStep('mapping');
            else if (step === 'mapping') setStep('preview');
            else if (step === 'preview') setStep('import');
          }}
          disabled={step === 'import'}
        >
          {step === 'preview' ? 'Start Import' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
```

---

## 📄 Import Templates

### Student Import Template (Excel columns)
| Column | Required | Format | Example |
|--------|----------|--------|---------|
| admission_no | ✅ Yes | Text | 2025001 |
| first_name | ✅ Yes | Text | Rahul |
| last_name | No | Text | Sharma |
| date_of_birth | ✅ Yes | DD/MM/YYYY | 15/06/2010 |
| gender | ✅ Yes | male/female | male |
| class | ✅ Yes | Text | Class 5 |
| section | ✅ Yes | Text | A |
| phone | No | 10 digits | 9876543210 |
| email | No | Email | parent@email.com |
| address | No | Text | 123 Main Street |
| father_name | No | Text | Suresh Sharma |
| father_phone | No | 10 digits | 9876543211 |
| mother_name | No | Text | Priya Sharma |
| mother_phone | No | 10 digits | 9876543212 |

---

## ✅ Verification Plan

| Test | Expected Result |
|------|-----------------|
| Connect to MySQL database | Shows tables list |
| Upload Excel file | Parses headers correctly |
| Auto-map columns | Suggests correct mappings |
| Validate with errors | Shows error count and details |
| Import valid records | All records created in DB |
| Rollback import | All created records deleted |
| Download template | Excel file downloads |

---

## 📝 Implementation Checklist

- [ ] Create import_jobs table migration
- [ ] Create DatabaseConnectionService
- [ ] Create DataImportService with validation
- [ ] Create import templates (Excel files)
- [ ] Create ImportController with all endpoints
- [ ] Frontend: Import wizard with all steps
- [ ] Frontend: Column mapping drag-drop UI
- [ ] Frontend: Real-time progress updates
- [ ] Add rollback functionality
- [ ] Test with various data sources

---

> 📝 **This module should be implemented early** in the project as it's essential for school onboarding. Schools need to migrate existing data before they can start using the ERP.
