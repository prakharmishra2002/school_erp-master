# 📋 School ERP - Work Index

> **Purpose**: Master checklist for LLM agents and developers to track implementation progress.  
> **Last Updated**: 2026-01-30  
> **Status**: 🟢 Core Portals Implemented

---

## 🎯 Quick Status

| Area | Status | Progress |
|------|--------|----------|
| Documentation | ✅ Complete | 16/16 files |
| Backend (Laravel) | 🔴 Not Started | 0% |
| Frontend (Next.js) | ✅ In Progress | ~65% (Teacher & Parent Portals Done) |
| Docker Setup | ✅ Complete | Config files ready |

---

## 📁 Documentation Files

| # | File | Status | Notes |
|---|------|--------|-------|
| 00 | `00-project-overview.md` | ✅ Done | Master roadmap |
| 01 | `01-authentication.md` | ✅ Done | JWT/Sanctum spec |
| 02 | `02-multi-tenancy.md` | ⏸️ Deferred | Future phase |
| 03 | `03-user-management.md` | ✅ Done | RBAC spec |
| 04 | `04-academic-structure.md` | ✅ Done | Classes/sections |
| 05 | `05-student-management.md` | ✅ Done | Full student lifecycle |
| 06 | `06-teacher-management.md` | ✅ Done | Teacher profiles |
| 07 | `07-attendance-system.md` | ✅ Done | Biometric + manual |
| 08 | `08-fee-management.md` | ✅ Done | Razorpay integration |
| 09 | `09-examination-system.md` | ✅ Done | Exams + grading |
| 10 | `10-communication-hub.md` | ✅ Done | SMS/Email |
| 11 | `11-reporting-engine.md` | ✅ Done | Analytics |
| 12 | `12-parent-portal.md` | ✅ Done | OTP login |
| 13 | `13-sync-engine.md` | ✅ Done | Local-cloud |
| 14 | `14-data-migration.md` | ✅ Done | Import wizard |
| 15 | `15-docker-deployment.md` | ✅ Done | Self-hosted |
| - | `SETUP_GUIDE.md` | ✅ Done | Local dev setup |

---

## 🏛️ Admin Console Recommendations (Management & Super Admin)
The Admin Console should satisfy management's need for bird's-eye view analytics and administrative control.

### Core Admin Modules
| Feature | Description | Priority |
|---------|-------------|----------|
| **Executive Dashboard** | Real-time charts for Fee Collection, Attendance Trends, and Student Strength. | P0 |
| **Academic Architect** | Central control for Academic Years, Global Timetable, and Subject Mapping. | P0 |
| **Finance Control** | Fee structure setup, discount rules, automated fine calculation, and collection reports. | P0 |
| **HR & Payroll** | Staff management, Spatie-based Role assignment, Payroll generation, and Leave approvals. | P1 |
| **Admission Portal** | Tracking new applications, verification, and roll-number generation. | P1 |
| **Communication Gateway**| SMTP/SMS settings and Bulk Messaging to groups (Parents/Staff). | P1 |
| **Inventory & Assets** | Tracking school furniture, labs, IT assets, and Library books. | P2 |
| **System Security** | Audit logs, Database backups, and IP whitelisting. | P2 |

---

## 🔧 Backend Implementation Checklist

### Module 01: Authentication
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Create Laravel project | `backend/` | 🔴 TODO | P0 |
| Install Sanctum | `backend/composer.json` | 🔴 TODO | P0 |
| Create User model | `backend/app/Models/User.php` | 🔴 TODO | P0 |
| Create AuthController | `backend/app/Http/Controllers/AuthController.php` | 🔴 TODO | P0 |
| Login API endpoint | `POST /api/auth/login` | 🔴 TODO | P0 |
| Logout API endpoint | `POST /api/auth/logout` | 🔴 TODO | P0 |
| User profile API | `GET /api/auth/me` | 🔴 TODO | P0 |
| Password reset flow | `POST /api/auth/forgot-password` | 🔴 TODO | P1 |

### Module 03: User Management
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Install Filament | `backend/composer.json` | 🔴 TODO | P0 |
| Install spatie/permission | `backend/composer.json` | 🔴 TODO | P0 |
| Create roles seeder | `backend/database/seeders/RoleSeeder.php` | 🔴 TODO | P0 |
| Create UserResource | `backend/app/Filament/Resources/UserResource.php` | 🔴 TODO | P0 |
| Create RoleResource | `backend/app/Filament/Resources/RoleResource.php` | 🔴 TODO | P1 |
| Bulk import users | `backend/app/Imports/UsersImport.php` | 🔴 TODO | P2 |

### Module 04: Academic Structure
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| AcademicYear migration | `backend/database/migrations/*_academic_years.php` | 🔴 TODO | P0 |
| Class migration | `backend/database/migrations/*_classes.php` | 🔴 TODO | P0 |
| Section migration | `backend/database/migrations/*_sections.php` | 🔴 TODO | P0 |
| Subject migration | `backend/database/migrations/*_subjects.php` | 🔴 TODO | P0 |
| AcademicYear model | `backend/app/Models/AcademicYear.php` | 🔴 TODO | P0 |
| ClassModel model | `backend/app/Models/ClassModel.php` | 🔴 TODO | P0 |
| Section model | `backend/app/Models/Section.php` | 🔴 TODO | P0 |
| Subject model | `backend/app/Models/Subject.php` | 🔴 TODO | P0 |
| AcademicYearResource | `backend/app/Filament/Resources/AcademicYearResource.php` | 🔴 TODO | P0 |
| ClassResource | `backend/app/Filament/Resources/ClassResource.php` | 🔴 TODO | P0 |
| SectionResource | `backend/app/Filament/Resources/SectionResource.php` | 🔴 TODO | P0 |
| SubjectResource | `backend/app/Filament/Resources/SubjectResource.php` | 🔴 TODO | P0 |

### Module 05: Student Management
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Student migration | `backend/database/migrations/*_students.php` | 🔴 TODO | P0 |
| Guardian migration | `backend/database/migrations/*_guardians.php` | 🔴 TODO | P0 |
| Student model | `backend/app/Models/Student.php` | 🔴 TODO | P0 |
| Guardian model | `backend/app/Models/Guardian.php` | 🔴 TODO | P0 |
| StudentResource | `backend/app/Filament/Resources/StudentResource.php` | 🔴 TODO | P0 |
| Student API controller | `backend/app/Http/Controllers/StudentController.php` | 🔴 TODO | P0 |
| Bulk import | `backend/app/Imports/StudentsImport.php` | 🔴 TODO | P1 |
| ID card generator | `backend/app/Services/IdCardService.php` | 🔴 TODO | P2 |
| Promotion service | `backend/app/Services/PromotionService.php` | 🔴 TODO | P2 |

### Module 06: Teacher Management
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Teacher migration | `backend/database/migrations/*_teachers.php` | 🔴 TODO | P0 |
| SubjectTeacher migration | `backend/database/migrations/*_subject_teachers.php` | 🔴 TODO | P0 |
| TeacherSchedule migration | `backend/database/migrations/*_teacher_schedules.php` | 🔴 TODO | P0 |
| TeacherRatings migration | `backend/database/migrations/*_teacher_ratings.php` | 🔴 TODO | P1 |
| SchedulingRules migration | `backend/database/migrations/*_school_scheduling_rules.php` | 🔴 TODO | P1 |
| TimetableAssets migration | `backend/database/migrations/*_timetable_assets.php` | 🔴 TODO | P1 |
| Teacher model | `backend/app/Models/Teacher.php` | 🔴 TODO | P0 |
| TeacherSchedule model | `backend/app/Models/TeacherSchedule.php` | 🔴 TODO | P0 |
| TeacherRating model | `backend/app/Models/TeacherRating.php` | 🔴 TODO | P1 |
| SchedulingRule model | `backend/app/Models/SchoolSchedulingRule.php` | 🔴 TODO | P1 |
| TeacherResource | `backend/app/Filament/Resources/TeacherResource.php` | 🔴 TODO | P0 |
| SchedulingRuleResource | `backend/app/Filament/Resources/SchedulingRuleResource.php` | 🔴 TODO | P1 |
| Teacher dashboard API | `backend/app/Http/Controllers/TeacherDashboardController.php` | 🔴 TODO | P0 |
| Parent rating API | `backend/app/Http/Controllers/Parent/TeacherRatingController.php` | 🔴 TODO | P1 |

### Module 06.b: Teacher Panel API Index (Frontend Requirements)
| Category | Endpoint | Description | Status |
|----------|----------|-------------|--------|
| **Dashboard** | `GET /api/teacher/dashboard/stats` | Active students, overall attendance, today's periods | 🔴 TODO |
| | `GET /api/teacher/dashboard/timeline` | Today's schedule for timeline component | 🔴 TODO |
| | `GET /api/teacher/dashboard/activities` | Recent actions/notifications log | 🔴 TODO |
| **Students** | `GET /api/teacher/students` | List students with filters (class, section, search) | 🔴 TODO |
| | `GET /api/teacher/students/{id}/profile` | Detailed student profile for profile modal | 🔴 TODO |
| **Classes** | `GET /api/teacher/classes` | Classes where current teacher is assigned | 🔴 TODO |
| **Attendance** | `GET /api/teacher/attendance/students` | List students for marking (target date/class) | 🔴 TODO |
| | `POST /api/teacher/attendance` | Bulk store/update attendance for a section | 🔴 TODO |
| **Marks** | `GET /api/teacher/marks/exams` | Available exams for teacher's subjects | 🔴 TODO |
| | `GET /api/teacher/marks/students` | Students list with marks for entry | 🔴 TODO |
| | `POST /api/teacher/marks` | Bulk store marks | 🔴 TODO |
| | `PUT /api/teacher/marks/lock` | Finalize and lock marks for an exam | 🔴 TODO |
| **Salary** | `GET /api/teacher/salary/slips` | Employee payslips list | 🔴 TODO |
| | `GET /api/teacher/salary/bank-accounts` | Linked bank accounts | 🔴 TODO |
| | `POST /api/teacher/salary/bank-accounts` | Link a new bank account | 🔴 TODO |
| **Leave** | `GET /api/teacher/leave/balance` | Remaining casual/sick/earned leave | 🔴 TODO |
| | `GET /api/teacher/leave/history` | Teacher's own leave requests | 🔴 TODO |
| | `POST /api/teacher/leave/apply` | Submit new leave application | 🔴 TODO |
| **Schedule** | `GET /api/teacher/timetable` | Weekly/Monthly schedule | 🔴 TODO |
| **Announcements**| `GET /api/teacher/announcements` | Global and class-specific announcements | 🔴 TODO |
| **Profile** | `GET /api/teacher/profile` | Current teacher profile data | 🔴 TODO |
| | `PUT /api/teacher/profile` | Update personal info/settings | 🔴 TODO |

### 💡 Recommended Teacher Features (Phase 2)
- [ ] **Assignment Management**: Post tasks, set deadlines, and accept file submissions.
- [ ] **Classroom Materials**: Upload and share PDFs/Resources per subject/class.
- [ ] **Syllabus Tracker**: Mark topics as "In Progress" or "Completed".
- [ ] **Parent Communication**: Direct messaging or PTM scheduling tool.
- [ ] **Behavioral Log**: Log student disciplinary or excellence remarks.
- [ ] **Analytics**: Student performance trends and attendance alerts.


### Module 07: Attendance System
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| StudentAttendance migration | `backend/database/migrations/*_student_attendances.php` | 🔴 TODO | P0 |
| BiometricDevice migration | `backend/database/migrations/*_biometric_devices.php` | 🔴 TODO | P0 |
| BiometricAttendance migration | `backend/database/migrations/*_biometric_attendances.php` | 🔴 TODO | P0 |
| StudentAttendance model | `backend/app/Models/StudentAttendance.php` | 🔴 TODO | P0 |
| BiometricSyncService | `backend/app/Services/BiometricSyncService.php` | 🔴 TODO | P1 |
| AttendanceController | `backend/app/Http/Controllers/AttendanceController.php` | 🔴 TODO | P0 |

### Module 08: Fee Management
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| FeeCategory migration | `backend/database/migrations/*_fee_categories.php` | 🔴 TODO | P0 |
| FeeStructure migration | `backend/database/migrations/*_fee_structures.php` | 🔴 TODO | P0 |
| StudentFee migration | `backend/database/migrations/*_student_fees.php` | 🔴 TODO | P0 |
| FeePayment migration | `backend/database/migrations/*_fee_payments.php` | 🔴 TODO | P0 |
| FeeCollectionService | `backend/app/Services/FeeCollectionService.php` | 🔴 TODO | P0 |
| PaymentGatewayService | `backend/app/Services/PaymentGatewayService.php` | 🔴 TODO | P1 |
| Receipt PDF template | `backend/resources/views/receipts/fee.blade.php` | 🔴 TODO | P1 |

### Module 09: Examination System
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| ExamType migration | `backend/database/migrations/*_exam_types.php` | 🔴 TODO | P0 |
| Exam migration | `backend/database/migrations/*_exams.php` | 🔴 TODO | P0 |
| StudentMark migration | `backend/database/migrations/*_student_marks.php` | 🔴 TODO | P0 |
| GradeScale migration | `backend/database/migrations/*_grade_scales.php` | 🔴 TODO | P0 |
| MarksController | `backend/app/Http/Controllers/MarksController.php` | 🔴 TODO | P0 |
| ReportCardService | `backend/app/Services/ReportCardService.php` | 🔴 TODO | P1 |

### Module 14: Data Migration
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| ImportJob migration | `backend/database/migrations/*_import_jobs.php` | 🔴 TODO | P0 |
| DatabaseConnectionService | `backend/app/Services/Import/DatabaseConnectionService.php` | 🔴 TODO | P0 |
| DataImportService | `backend/app/Services/Import/DataImportService.php` | 🔴 TODO | P0 |
| ImportController | `backend/app/Http/Controllers/ImportController.php` | 🔴 TODO | P0 |
| Excel import templates | `backend/storage/app/templates/` | 🔴 TODO | P1 |

---

## 💻 Frontend Implementation Checklist

### Core Setup
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Create Next.js project | `frontend/` | ✅ DONE | P0 |
| Design System CSS | `frontend/src/app/globals.css` | ✅ DONE | P0 |
| Install UI dependencies | `frontend/components/ui/` | ✅ DONE | P0 |
| Setup Axios API client | `frontend/src/lib/api.ts` | ✅ DONE | P0 |
| Utils (cn, formatters) | `frontend/src/lib/utils.ts` | ✅ DONE | P0 |
| Button component | `frontend/src/components/ui/button.tsx` | ✅ DONE | P0 |
| Input component | `frontend/src/components/ui/input.tsx` | ✅ DONE | P0 |
| Card component | `frontend/src/components/ui/card.tsx` | ✅ DONE | P0 |
| Badge component | `frontend/src/components/ui/badge.tsx` | ✅ DONE | P0 |
| Create auth context | `frontend/contexts/AuthContext.tsx` | ⏸️ DEFERRED | P1 |
| Protected route wrapper | `frontend/components/ProtectedRoute.tsx` | ⏸️ DEFERRED | P1 |

### Authentication Pages
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Login page | `frontend/src/app/login/page.tsx` | ✅ DONE | P0 |
| Forgot password | `frontend/app/(auth)/forgot-password/page.tsx` | 🔴 TODO | P2 |
| Layout with sidebar | `frontend/src/app/(dashboard)/layout.tsx` | ✅ DONE | P0 |
| Dashboard page | `frontend/src/app/(dashboard)/dashboard/page.tsx` | ✅ DONE | P0 |

### Teacher Panel
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Teacher layout | `frontend/src/app/(teacher)/layout.tsx` | ✅ DONE | P0 |
| Teacher dashboard | `frontend/src/app/(teacher)/dashboard/page.tsx` | ✅ DONE | P0 |
| My classes | `frontend/src/app/(teacher)/classes/page.tsx` | ✅ DONE | P0 |
| Student list | `frontend/src/app/(teacher)/students/page.tsx` | ✅ DONE | P0 |
| Attendance marking | `frontend/src/app/(teacher)/attendance/page.tsx` | ✅ DONE | P0 |
| Marks entry | `frontend/src/app/(teacher)/marks/page.tsx` | ✅ DONE | P0 |
| My schedule | `frontend/src/app/(teacher)/schedule/page.tsx` | ✅ DONE | P1 |
| Timetable view | `frontend/src/app/(teacher)/timetable/page.tsx` | ✅ DONE | P1 |
| Exam schedule | `frontend/src/app/(teacher)/exams/page.tsx` | ✅ DONE | P1 |
| Leave requests | `frontend/src/app/(teacher)/leave/page.tsx` | ✅ DONE | P1 |
| Announcements | `frontend/src/app/(teacher)/announcements/page.tsx` | ✅ DONE | P1 |
| Settings Connection | `frontend/src/app/(teacher)/layout.tsx` | ✅ DONE | P2 |
| Reports & analytics | `frontend/src/app/(teacher)/reports/page.tsx` | ✅ DONE | P2 |
| Salary Management | `frontend/src/app/(teacher)/salary/page.tsx` | ✅ DONE | P1 |
| Notifications Hub | `frontend/src/app/(teacher)/notifications/page.tsx` | ✅ DONE | P2 |

### Payment Panel
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Fee collection | `frontend/app/(payment)/collect/[studentId]/page.tsx` | 🔴 TODO | P0 |
| Student search | `frontend/app/(payment)/search/page.tsx` | 🔴 TODO | P0 |
| Collection report | `frontend/app/(payment)/reports/page.tsx` | 🔴 TODO | P1 |

### Parent Portal
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| OTP login | `frontend/src/app/(parent)/parent/login/page.tsx` | ✅ DONE | P0 |
| Parent dashboard | `frontend/src/app/(parent)/parent/dashboard/page.tsx` | ✅ DONE | P0 |
| Fee payment | `frontend/src/app/(parent)/parent/fees/page.tsx` | ✅ DONE | P0 |
| Child attendance | `frontend/src/app/(parent)/parent/attendance/page.tsx` | ✅ DONE | P1 |
| Child grades | `frontend/src/app/(parent)/parent/results/page.tsx` | ✅ DONE | P1 |
| Rate teachers | `frontend/src/app/(parent)/parent/teachers/page.tsx` | ✅ DONE | P1 |
| Settings Drawer | `frontend/src/app/(parent)/parent/SettingsDrawer.tsx` | ✅ DONE | P1 |
| Communication Hub | `frontend/src/app/(parent)/parent/notifications/page.tsx` | ✅ DONE | P2 |

### Admin Console (Frontend)
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| Login & Auth Guard | `frontend/src/middleware.ts` | 🔴 TODO | P0 |
| Admin Layout | `frontend/src/app/(admin)/layout.tsx` | 🔴 TODO | P0 |
| Management Dashboard | `frontend/src/app/(admin)/dashboard/page.tsx` | 🔴 TODO | P0 |
| Data Import Wizard | `frontend/src/app/(admin)/import/page.tsx` | 🔴 TODO | P0 |
| Fee Configurator | `frontend/src/app/(admin)/fees/page.tsx` | 🔴 TODO | P1 |
| Academic Year Manager | `frontend/src/app/(admin)/academic/page.tsx` | 🔴 TODO | P1 |
| Payroll & Staff Hub | `frontend/src/app/(admin)/staff/page.tsx` | 🔴 TODO | P1 |
| Global Settings | `frontend/src/app/(admin)/settings/page.tsx` | 🔴 TODO | P2 |
| Audit Logs | `frontend/src/app/(admin)/logs/page.tsx` | 🔴 TODO | P2 |

### Shared Components
| Task | File/Location | Status | Priority |
|------|---------------|--------|----------|
| DataTable component | `frontend/components/ui/data-table.tsx` | 🔴 TODO | P0 |
| StudentCard component | `frontend/components/StudentCard.tsx` | 🔴 TODO | P1 |
| SyncStatus widget | `frontend/components/SyncStatus.tsx` | 🔴 TODO | P2 |

---

## 🏗️ Implementation Order

Follow this sequence for optimal development:

```
Phase 1: Foundation
├── 1.1 Create Laravel project
├── 1.2 Install dependencies (Sanctum, Filament, Spatie)
├── 1.3 Setup authentication
├── 1.4 Create Next.js project with ShadCN
└── 1.5 Create login page

Phase 2: Core Data
├── 2.1 Academic structure (Years, Classes, Sections, Subjects)
├── 2.2 User management with Filament
├── 2.3 Data migration/import wizard
└── 2.4 Student management

Phase 3: Teachers & Attendance
├── 3.1 Teacher management
├── 3.2 Subject-teacher assignment
├── 3.3 Student attendance (manual)
├── 3.4 Biometric integration
└── 3.5 Teacher panel frontend

Phase 4: Fees & Exams
├── 4.1 Fee structure setup
├── 4.2 Fee collection interface
├── 4.3 Razorpay integration
├── 4.4 Examination system
└── 4.5 Report card generation

Phase 5: External Access
├── 5.1 Parent portal (OTP login)
├── 5.2 Online fee payment
├── 5.3 Communication (SMS/Email)
└── 5.4 Reporting dashboard

Phase 6: Production
├── 6.1 Docker deployment testing
├── 6.2 Performance optimization
└── 6.3 Security audit
```

---

## 📝 Notes for LLM Agents

### Before Starting Any Task:
1. Read the relevant module doc (e.g., `05-student-management.md`)
2. Check this WORK_INDEX for current status
3. Follow the database schema exactly as documented
4. Use the code examples from docs as starting templates

### When Completing a Task:
1. Update status in this file: `🔴 TODO` → `✅ DONE`
2. Add any new files created
3. Note any deviations from the original spec

### Priority Legend:
- **P0**: Must be done first, blocks other work
- **P1**: Important, do after P0 tasks
- **P2**: Nice to have, can be deferred

---

> 📖 **Full documentation**: See [00-project-overview.md](./00-project-overview.md)
