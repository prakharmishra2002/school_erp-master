# Codebase Map & Function Directory

This document serves as a live tracking map for all the important files in the `school_erp` project. It provides a quick reference to what each file does and the core functions it contains. We will update this file continuously as we build new features.

---

## Backend (Laravel) - `backend/`

### Database Migrations
- `database/migrations/2026_02_22_123311_rebuild_unified_schema.php`: **(Migration Builder)** Contains the complete, unified schema definition for all 39 tables across all modules (multi-tenancy, users, academic structure, students, teachers, fees, etc.). Creates the tables when `php artisan migrate` is run.

### Models (`backend/app/Models/`)
Contains Eloquent standard classes representing database tables, auto-generated with `$fillable` properties and basic relationships.
- **Core / Auth**: `Tenant`, `User`, `TenantUser`, `LoginLog`, `Role`, `Permission`, `RoleHasPermission`
- **Academic Structure**: `AcademicYear`, `Class` (for Classes table), `Section`, `Subject`, `ClassSubject`, `SubjectTeacher`
- **Student Management**: `Student`, `Guardian`, `StudentDocument`, `StudentClassHistory`
- **Teacher Management**: `Teacher`, `TeacherSchedule`, `SchoolSchedulingRule`, `TimetableAsset`, `TeacherRating`
- **Attendance**: `StudentAttendance`, `BiometricDevice`, `BiometricAttendance`, `LeaveRequest`
- **Fee Management**: `FeeCategory`, `FeeStructure`, `Discount`, `StudentFee`, `FeePayment`, `FeePaymentItem`
- **Examination**: `ExamType`, `Exam`, `StudentMark`, `GradeScale`
- **Communication & Sync**: `Announcement`, `NotificationLog`, `SyncLog`, `SyncStatus`, `ImportJob`, `ImportTemplate`

### Controllers (`backend/app/Http/Controllers/`)
Contains the application logic for API endpoints.
- `Api/AuthController.php`: **(Authentication)** Handles `login`, `logout`, and token generation using Laravel Sanctum. Also provides the `profile` endpoint.
- `Api/SubjectController.php`: **(Academic Structure)** Implements `index`, `store`, `show`, `update`, and `destroy` for Managing Subjects.
- `Api/ClassController.php`: **(Academic Structure)** Implements full CRUD operations for Classes (grades).
- `Api/SectionController.php`: **(Academic Structure)** Implements full CRUD operations for Sections. Allows filtering sections by `class_id`.
- `Api/TeacherController.php`: **(Teacher Management)** Implements `index`, `store`, `show`, `update`, and `destroy` for Teachers. The `store` method automatically creates the related User authentication account.
- `Api/StudentController.php`: **(Student Management)** Handles Student Admissions (`store`), listing, and profile management. Creates a User login account concurrently during admission.

### Routes (`backend/routes/`)
- `routes/api.php`: **(API Routing)** Will contain all the REST API endpoints that the Next.js frontend interacts with.
- `routes/web.php`: Standard web routes (primarily unused since we are using Next.js for the frontend).

---

## Frontend (Next.js) - `frontend/`

### Server Actions / API Helpers (`frontend/src/app/(admin)/_actions/`)
- `shared.ts`: Contains shared utilities, such as a `delay` function used to simulate network latency for mock data.
- `teachers.ts`: Currently contains mock data and the `getTeachers` function that simulates fetching a list of teachers. Will be updated to call the Laravel API.

### Pages & UI Components
- `src/app/(admin)/admin/fees/structure/page.tsx`: **(UI Component)** The frontend page for managing fee structures, displaying UI elements for grade-wise fees and incidental charges.
- `src/app/(admin)/admin/academic/subjects/page.tsx`: **(UI Component)** The frontend page for subject management, allowing admins to create subjects and assign them to classes.

---

*Note: This document only highlights the active working files and core architectural files. Standard boilerplate files (like `composer.json` or `package.json`) are generally omitted unless they have custom logic.*
