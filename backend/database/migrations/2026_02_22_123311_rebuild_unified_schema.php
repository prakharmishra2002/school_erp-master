<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // MODULE 02: MULTI-TENANCY
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('domain')->unique();
            $table->string('database_name')->nullable();
            $table->string('schema_name');
            $table->string('logo_url', 500)->nullable();
            $table->string('primary_color', 7)->default('#3B82F6');
            $table->text('address')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->enum('subscription_plan', ['starter', 'growth', 'pro', 'enterprise'])->default('starter');
            $table->date('subscription_expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        // MODULE 01 & 03: AUTHENTICATION & USER MANAGEMENT
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 20)->nullable();
            $table->string('password');
            $table->enum('role', ['super_admin', 'admin', 'developer', 'teacher', 'accountant', 'student', 'parent']);
            $table->string('avatar_url', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->timestamps();
        });

        Schema::create('tenant_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_owner')->default(false);
            $table->timestamps();
            
            $table->unique(['tenant_id', 'user_id']);
        });

        Schema::create('login_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('event', 50);
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('guard_name', 50)->default('web');
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('guard_name', 50)->default('web');
            $table->timestamps();
        });

        Schema::create('role_has_permissions', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });

        // MODULE 04: ACADEMIC STRUCTURE
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_current')->default(false);
            $table->timestamps();
        });

        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->integer('level')->nullable();
            $table->timestamps();
        });

        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->string('name', 10);
            $table->integer('capacity')->default(40);
            $table->timestamps();
            
            $table->unique(['class_id', 'name']);
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 20)->unique()->nullable();
            $table->enum('type', ['theory', 'practical', 'both'])->default('theory');
            $table->timestamps();
        });

        Schema::create('class_subjects', function (Blueprint $table) {
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->boolean('is_optional')->default(false);
            $table->primary(['class_id', 'subject_id']);
        });

        Schema::create('subject_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('sections')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unique(['section_id', 'subject_id', 'teacher_id']);
            $table->timestamps();
        });

        // MODULE 05: STUDENT MANAGEMENT
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('relation', 50);
            $table->string('phone', 20)->unique();
            $table->string('email')->nullable();
            $table->string('occupation', 100)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('admission_no', 50)->unique();
            $table->string('roll_no', 20)->nullable();
            $table->string('first_name', 100);
            $table->string('last_name', 100)->nullable();
            $table->date('date_of_birth');
            $table->string('gender', 20)->nullable();
            $table->string('blood_group', 5)->nullable();
            $table->foreignId('primary_guardian_id')->nullable()->constrained('guardians')->nullOnDelete();
            $table->text('address')->nullable();
            $table->string('photo_url', 500)->nullable();
            $table->enum('status', ['active', 'inactive', 'alumni', 'transferred'])->default('active');
            $table->date('admission_date')->nullable();
            $table->timestamps();
        });

        Schema::create('student_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('document_type', 100);
            $table->string('file_path', 500);
            $table->timestamp('uploaded_at')->useCurrent();
        });

        Schema::create('student_class_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->foreignId('section_id')->nullable()->constrained('sections')->nullOnDelete();
            $table->enum('result', ['pass', 'fail', 'promoted'])->nullable();
            $table->timestamps();
        });

        // MODULE 06: TEACHER MANAGEMENT
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('employee_id', 50)->unique();
            $table->string('first_name', 100);
            $table->string('last_name', 100)->nullable();
            $table->string('gender', 20)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('department', 100)->nullable();
            $table->string('designation', 100)->nullable();
            $table->text('qualification')->nullable();
            $table->date('joining_date')->nullable();
            $table->enum('status', ['active', 'on_leave', 'resigned'])->default('active');
            $table->string('photo_url', 500)->nullable();
            $table->timestamps();
        });

        Schema::create('teacher_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('section_id')->nullable()->constrained('sections')->nullOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            $table->integer('day_of_week')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('room_no', 50)->nullable();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('school_scheduling_rules', function (Blueprint $table) {
            $table->id();
            $table->integer('max_periods_per_day')->default(8);
            $table->integer('max_continuous_periods')->default(3);
            $table->integer('period_duration_minutes')->default(40);
            $table->time('school_start_time')->default('08:00');
            $table->time('school_end_time')->default('14:30');
            $table->timestamps();
        });

        Schema::create('timetable_assets', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->enum('type', ['room', 'lab', 'sports_field']);
            $table->integer('capacity')->nullable();
            $table->timestamps();
        });

        Schema::create('teacher_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('student_id')->nullable()->constrained('students')->nullOnDelete();
            $table->integer('rating');
            $table->text('review')->nullable();
            $table->timestamps();
        });

        // MODULE 07: ATTENDANCE SYSTEM
        Schema::create('student_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('section_id')->constrained('sections')->cascadeOnDelete();
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'late', 'half_day']);
            $table->string('remarks')->nullable();
            $table->foreignId('marked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->unique(['student_id', 'date']);
            $table->index('date');
        });

        Schema::create('biometric_devices', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('ip_address', 45)->unique()->nullable();
            $table->string('serial_number', 100)->unique()->nullable();
            $table->string('location', 100)->nullable();
            $table->enum('status', ['online', 'offline', 'error'])->default('offline');
            $table->timestamp('last_ping_at')->nullable();
            $table->timestamps();
        });

        Schema::create('biometric_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('device_id')->nullable()->constrained('biometric_devices')->nullOnDelete();
            $table->timestamp('punch_time');
            $table->enum('punch_type', ['in', 'out', 'auto'])->default('auto');
            $table->timestamps();
        });

        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('leave_type', 50);
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // MODULE 08: FEE MANAGEMENT
        Schema::create('fee_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->boolean('is_recurring')->default(true);
            $table->timestamps();
        });

        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->foreignId('fee_category_id')->nullable()->constrained('fee_categories')->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->enum('installment_type', ['monthly', 'quarterly', 'yearly', 'one_time']);
            $table->integer('due_day')->nullable();
            $table->timestamps();
        });

        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->enum('type', ['percentage', 'fixed']);
            $table->decimal('value', 10, 2);
            $table->timestamps();
        });

        Schema::create('student_fees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('fee_structure_id')->nullable()->constrained('fee_structures')->nullOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->foreignId('discount_id')->nullable()->constrained('discounts')->nullOnDelete();
            $table->date('due_date');
            $table->decimal('final_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->enum('status', ['pending', 'partial', 'paid', 'overdue'])->default('pending');
            $table->timestamps();
        });

        Schema::create('fee_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->nullable()->constrained('students')->nullOnDelete();
            $table->string('receipt_no', 50)->unique();
            $table->date('payment_date');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_mode', ['cash', 'cheque', 'bank_transfer', 'online', 'card']);
            $table->string('reference_no', 100)->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('collected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('fee_payment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_payment_id')->constrained('fee_payments')->cascadeOnDelete();
            $table->foreignId('student_fee_id')->nullable()->constrained('student_fees')->nullOnDelete();
            $table->decimal('amount_allocated', 10, 2);
            $table->timestamps();
        });

        // MODULE 09: EXAMINATION SYSTEM
        Schema::create('exam_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->decimal('weightage', 5, 2)->default(100);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_type_id')->nullable()->constrained('exam_types')->nullOnDelete();
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            $table->date('exam_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->decimal('max_marks', 5, 2)->default(100);
            $table->decimal('pass_marks', 5, 2)->default(33);
            $table->string('venue', 100)->nullable();
            $table->timestamps();
            
            $table->unique(['exam_type_id', 'class_id', 'subject_id']);
        });

        Schema::create('student_marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('exam_id')->constrained('exams')->cascadeOnDelete();
            $table->decimal('marks_obtained', 5, 2)->nullable();
            $table->string('grade', 5)->nullable();
            $table->text('remarks')->nullable();
            $table->boolean('is_absent')->default(false);
            $table->foreignId('entered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('entered_at')->useCurrent();
            
            $table->unique(['student_id', 'exam_id']);
        });

        Schema::create('grade_scales', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->decimal('min_percentage', 5, 2);
            $table->decimal('max_percentage', 5, 2);
            $table->decimal('grade_point', 3, 1)->nullable();
            $table->string('description', 100)->nullable();
            $table->integer('display_order')->nullable();
            $table->timestamps();
        });

        // MODULE 10: COMMUNICATION HUB
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->enum('audience', ['all', 'students', 'teachers', 'parents', 'class'])->default('all');
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_type', 50)->nullable();
            $table->bigInteger('recipient_id')->nullable();
            $table->enum('channel', ['sms', 'email', 'whatsapp', 'push']);
            $table->string('template', 100)->nullable();
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'sent', 'failed', 'delivered'])->default('pending');
            $table->string('external_id', 100)->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });

        // MODULE 13: SYNC ENGINE
        Schema::create('sync_log', function (Blueprint $table) {
            $table->id();
            $table->string('table_name', 100);
            $table->bigInteger('record_id');
            $table->enum('operation', ['insert', 'update', 'delete']);
            $table->json('data')->nullable();
            $table->boolean('synced')->default(false);
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
            
            $table->unique(['table_name', 'record_id', 'operation', 'created_at']);
        });

        Schema::create('sync_status', function (Blueprint $table) {
            $table->id();
            $table->timestamp('last_sync_at')->nullable();
            $table->integer('pending_count')->default(0);
            $table->enum('status', ['idle', 'syncing', 'error'])->default('idle');
            $table->text('error_message')->nullable();
            $table->timestamps();
        });

        // MODULE 14: DATA MIGRATION & IMPORT
        Schema::create('import_jobs', function (Blueprint $table) {
            $table->id();
            $table->enum('job_type', ['students', 'teachers', 'classes', 'fees', 'marks', 'mixed']);
            $table->enum('source_type', ['database', 'excel', 'csv']);
            $table->json('source_config')->nullable();
            $table->string('file_path', 500)->nullable();
            $table->string('original_filename')->nullable();
            $table->json('column_mapping');
            $table->integer('total_records')->default(0);
            $table->integer('processed_records')->default(0);
            $table->integer('success_count')->default(0);
            $table->integer('error_count')->default(0);
            $table->integer('warning_count')->default(0);
            $table->enum('status', ['pending', 'validating', 'importing', 'completed', 'failed', 'rolled_back'])->default('pending');
            $table->json('error_log')->nullable();
            $table->json('rollback_data')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('import_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('entity_type', 50);
            $table->json('columns');
            $table->string('sample_file_path', 500)->nullable();
            $table->timestamps();
        });

        // MODULE: API ACCESS (Sanctum)
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('import_templates');
        Schema::dropIfExists('import_jobs');
        Schema::dropIfExists('sync_status');
        Schema::dropIfExists('sync_log');
        Schema::dropIfExists('notification_logs');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('grade_scales');
        Schema::dropIfExists('student_marks');
        Schema::dropIfExists('exams');
        Schema::dropIfExists('exam_types');
        Schema::dropIfExists('fee_payment_items');
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('student_fees');
        Schema::dropIfExists('discounts');
        Schema::dropIfExists('fee_structures');
        Schema::dropIfExists('fee_categories');
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('biometric_attendances');
        Schema::dropIfExists('biometric_devices');
        Schema::dropIfExists('student_attendances');
        Schema::dropIfExists('teacher_ratings');
        Schema::dropIfExists('timetable_assets');
        Schema::dropIfExists('school_scheduling_rules');
        Schema::dropIfExists('teacher_schedules');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('student_class_history');
        Schema::dropIfExists('student_documents');
        Schema::dropIfExists('students');
        Schema::dropIfExists('guardians');
        Schema::dropIfExists('subject_teachers');
        Schema::dropIfExists('class_subjects');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('academic_years');
        Schema::dropIfExists('role_has_permissions');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('login_logs');
        Schema::dropIfExists('tenant_users');
        Schema::dropIfExists('users');
        Schema::dropIfExists('tenants');
    }
};
