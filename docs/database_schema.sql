-- School ERP - Unified Database Schema
-- Synthesized from Module Documentation 01-14

-- ==========================================
-- MODULE 02: MULTI-TENANCY (Central Database)
-- ==========================================
CREATE TABLE tenants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL, -- subdomain: 'abc' for abc.erp.com
    database_name VARCHAR(255), -- NULL for schema-based
    schema_name VARCHAR(255) NOT NULL, -- 'tenant_abc'
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    subscription_plan ENUM('starter', 'growth', 'pro', 'enterprise') DEFAULT 'starter',
    subscription_expires_at DATE,
    is_active TINYINT(1) DEFAULT 1,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_domain ON tenants(domain);
CREATE INDEX idx_tenants_active ON tenants(is_active);

-- ==========================================
-- MODULE 01 & 03: AUTHENTICATION & USER MANAGEMENT
-- ==========================================
-- Note: users table is modified from tenant schema in 03, but 01 has tenant_id. 
-- Assuming schema-based multi-tenancy for the rest.
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT ON DELETE CASCADE, -- For central tracking if needed
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'developer', 'teacher', 'accountant', 'student', 'parent') NOT NULL,
    avatar_url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE tenant_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT ON DELETE CASCADE,
    user_id BIGINT ON DELETE CASCADE,
    is_owner TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, user_id)
);

CREATE TABLE personal_access_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT ON DELETE CASCADE,
    event VARCHAR(50) NOT NULL, -- 'login', 'logout', 'failed_login'
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_login_logs_user ON login_logs(user_id);

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    guard_name VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    guard_name VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_has_permissions (
    role_id BIGINT ON DELETE CASCADE,
    permission_id BIGINT ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ==========================================
-- MODULE 04: ACADEMIC STRUCTURE
-- ==========================================
CREATE TABLE academic_years (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., '2023-2024'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'Class 1', 'Grade 10'
    level INT, -- For sorting (e.g., Nursery=0, KG=1, Class 1=2)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT ON DELETE CASCADE,
    name VARCHAR(10) NOT NULL, -- 'A', 'B', 'C'
    capacity INT DEFAULT 40,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, name)
);

CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Mathematics'
    code VARCHAR(20) UNIQUE, -- 'MATH101'
    type ENUM('theory', 'practical', 'both') DEFAULT 'theory',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class_subjects (
    class_id BIGINT ON DELETE CASCADE,
    subject_id BIGINT ON DELETE CASCADE,
    is_optional TINYINT(1) DEFAULT 0,
    PRIMARY KEY(class_id, subject_id)
);

CREATE TABLE subject_teachers (
    section_id BIGINT ON DELETE CASCADE,
    subject_id BIGINT ON DELETE CASCADE,
    teacher_id BIGINT ON DELETE SET NULL, -- Will map to teachers table later
    PRIMARY KEY(section_id, subject_id, teacher_id)
);

-- ==========================================
-- MODULE 05: STUDENT MANAGEMENT
-- ==========================================
CREATE TABLE guardians (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT ON DELETE CASCADE, -- Link to user account for parent portal
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(50) NOT NULL, -- 'Father', 'Mother', 'Other'
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    occupation VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    roll_no VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    blood_group VARCHAR(5),
    primary_guardian_id BIGINT,
    address TEXT,
    photo_url VARCHAR(500),
    status ENUM('active', 'inactive', 'alumni', 'transferred') DEFAULT 'active',
    admission_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'Birth Certificate', 'Transfer Certificate'
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_class_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT ON DELETE CASCADE,
    academic_year_id BIGINT,
    class_id BIGINT,
    section_id BIGINT,
    result ENUM('pass', 'fail', 'promoted') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MODULE 06: TEACHER MANAGEMENT
-- ==========================================
CREATE TABLE teachers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    department VARCHAR(100),
    designation VARCHAR(100),
    qualification TEXT,
    joining_date DATE,
    status ENUM('active', 'on_leave', 'resigned') DEFAULT 'active',
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teacher_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT ON DELETE CASCADE,
    section_id BIGINT,
    subject_id BIGINT,
    day_of_week INT, -- 1=Monday, 6=Saturday
    start_time TIME,
    end_time TIME,
    room_no VARCHAR(50),
    academic_year_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE school_scheduling_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    max_periods_per_day INT DEFAULT 8,
    max_continuous_periods INT DEFAULT 3,
    period_duration_minutes INT DEFAULT 40,
    school_start_time TIME DEFAULT '08:00',
    school_end_time TIME DEFAULT '14:30',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE timetable_assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Physics Lab', 'Room 101'
    type ENUM('room', 'lab', 'sports_field') NOT NULL,
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teacher_ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT ON DELETE CASCADE,
    student_id BIGINT ON DELETE SET NULL, -- Or guardian_id if parents rate
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MODULE 07: ATTENDANCE SYSTEM
-- ==========================================
CREATE TABLE student_attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT ON DELETE CASCADE,
    section_id BIGINT,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'half_day') NOT NULL,
    remarks VARCHAR(255),
    marked_by BIGINT, -- Teacher who marked it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);
CREATE INDEX idx_student_attendance_date ON student_attendances(date);
CREATE INDEX idx_student_attendance_section ON student_attendances(section_id);

CREATE TABLE biometric_devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) UNIQUE,
    serial_number VARCHAR(100) UNIQUE,
    location VARCHAR(100),
    status ENUM('online', 'offline', 'error') DEFAULT 'offline',
    last_ping_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE biometric_attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT ON DELETE CASCADE, -- Links to teacher user
    device_id BIGINT,
    punch_time TIMESTAMP NOT NULL,
    punch_type ENUM('in', 'out', 'auto') DEFAULT 'auto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT ON DELETE CASCADE, -- Teacher requesting leave
    leave_type VARCHAR(50) NOT NULL, -- 'Sick', 'Casual', 'Maternity'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MODULE 08: FEE MANAGEMENT
-- ==========================================
CREATE TABLE fee_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Tuition Fee', 'Transport', 'Library'
    description TEXT,
    is_recurring TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_structures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    academic_year_id BIGINT,
    class_id BIGINT,
    fee_category_id BIGINT,
    amount DECIMAL(10, 2) NOT NULL,
    installment_type ENUM('monthly', 'quarterly', 'yearly', 'one_time') NOT NULL,
    due_day INT, -- e.g., 5th of every month
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Sibling Discount', 'Staff Child'
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_fees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT ON DELETE CASCADE,
    fee_structure_id BIGINT,
    academic_year_id BIGINT,
    discount_id BIGINT,
    due_date DATE NOT NULL,
    final_amount DECIMAL(10, 2) NOT NULL, -- After discount applied
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT,
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_mode ENUM('cash', 'cheque', 'bank_transfer', 'online', 'card') NOT NULL,
    reference_no VARCHAR(100), -- Transaction ID, Cheque No.
    remarks TEXT,
    collected_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_payment_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fee_payment_id BIGINT ON DELETE CASCADE,
    student_fee_id BIGINT,
    amount_allocated DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MODULE 09: EXAMINATION SYSTEM
-- ==========================================
CREATE TABLE exam_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Unit Test 1', 'Mid Term'
    academic_year_id BIGINT,
    weightage DECIMAL(5, 2) DEFAULT 100, -- For GPA calculation
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exam_type_id BIGINT,
    class_id BIGINT,
    subject_id BIGINT,
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    max_marks DECIMAL(5, 2) DEFAULT 100,
    pass_marks DECIMAL(5, 2) DEFAULT 33,
    venue VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_type_id, class_id, subject_id)
);

CREATE TABLE student_marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT ON DELETE CASCADE,
    exam_id BIGINT ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2),
    grade VARCHAR(5),
    remarks TEXT,
    is_absent TINYINT(1) DEFAULT 0,
    entered_by BIGINT,
    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, exam_id)
);
CREATE INDEX idx_student_marks_exam ON student_marks(exam_id);

CREATE TABLE grade_scales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'A+', 'A', 'B+'
    min_percentage DECIMAL(5, 2) NOT NULL,
    max_percentage DECIMAL(5, 2) NOT NULL,
    grade_point DECIMAL(3, 1), -- 4.0, 3.5, etc.
    description VARCHAR(100), -- 'Excellent'
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MODULE 10: COMMUNICATION HUB
-- ==========================================
CREATE TABLE announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audience ENUM('all', 'students', 'teachers', 'parents', 'class') DEFAULT 'all',
    class_id BIGINT,
    is_pinned TINYINT(1) DEFAULT 0,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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

-- ==========================================
-- MODULE 13: SYNC ENGINE
-- ==========================================
CREATE TABLE sync_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    operation ENUM('insert', 'update', 'delete') NOT NULL,
    data JSON, -- Full row data
    synced TINYINT(1) DEFAULT 0,
    synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(table_name, record_id, operation, created_at)
);
CREATE INDEX idx_sync_pending ON sync_log(synced) WHERE synced = FALSE;

CREATE TABLE sync_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_sync_at TIMESTAMP,
    pending_count INT DEFAULT 0,
    status ENUM('idle', 'syncing', 'error') DEFAULT 'idle',
    error_message TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MODULE 14: DATA MIGRATION & IMPORT
-- ==========================================
CREATE TABLE import_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_type ENUM('students', 'teachers', 'classes', 'fees', 'marks', 'mixed') NOT NULL,
    source_type ENUM('database', 'excel', 'csv') NOT NULL,
    source_config JSON, -- {host, port, database, table}
    file_path VARCHAR(500),
    original_filename VARCHAR(255),
    column_mapping JSON NOT NULL, -- {source_col: target_field}
    total_records INT DEFAULT 0,
    processed_records INT DEFAULT 0,
    success_count INT DEFAULT 0,
    error_count INT DEFAULT 0,
    warning_count INT DEFAULT 0,
    status ENUM('pending', 'validating', 'importing', 'completed', 'failed', 'rolled_back') DEFAULT 'pending',
    error_log JSON,
    rollback_data JSON, -- IDs of created records
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_import_jobs_status ON import_jobs(status);

CREATE TABLE import_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Student Import Template'
    entity_type VARCHAR(50) NOT NULL, -- 'students'
    columns JSON NOT NULL, -- [{name, required, type, example}]
    sample_file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





