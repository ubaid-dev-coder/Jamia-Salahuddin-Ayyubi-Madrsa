-- ====================================================================
-- جامعہ صلاح الدین ایوبی — نظامِ انتظامِ مدرسہ
-- SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DEPARTMENTS TABLE (شعبہ جات)
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY, -- 'hifz', 'nazra', 'baneen', 'banat'
    title TEXT NOT NULL,
    arabic_title TEXT NOT NULL,
    description TEXT,
    head_of_department TEXT NOT NULL,
    timing TEXT NOT NULL,
    total_students INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMINISTRATORS TABLE (انتظامیہ و منتظمین)
CREATE TABLE IF NOT EXISTS administrators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'nazim', -- 'super_admin', 'nazim', 'mudarris'
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENTS TABLE (طلباء و طالبات)
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY, -- e.g. "JSA-2026-0101"
    full_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    date_of_birth DATE,
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_para_or_level TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'لاہور',
    mobile_number TEXT,
    father_mobile_number TEXT NOT NULL,
    guardian_name TEXT NOT NULL,
    guardian_relation TEXT NOT NULL DEFAULT 'والد',
    guardian_phone TEXT,
    photo_url TEXT,
    monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
    fee_status TEXT NOT NULL DEFAULT 'paid' CHECK (fee_status IN ('paid', 'pending', 'waived')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'leave', 'struck_off')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENT CARDS TABLE (شناختی کارڈز و اسناد)
CREATE TABLE IF NOT EXISTS student_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    card_number TEXT UNIQUE NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
    qr_code_payload TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATTENDANCE TABLE (یومیہ حاضری رجسٹر)
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
    marked_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_daily_attendance UNIQUE (student_id, date)
);

-- 7. INSTITUTE SETTINGS TABLE (جامعہ کی ترتیبات و لوگو)
CREATE TABLE IF NOT EXISTS institute_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    institute_name TEXT NOT NULL DEFAULT 'جامعہ صلاح الدین ایوبی',
    sub_title TEXT NOT NULL DEFAULT 'نظامِ انتظامِ مدرسہ و دار القرآن',
    registration_number TEXT DEFAULT 'WFAQ-PK-1978/542',
    phone TEXT DEFAULT '042-35891234',
    email TEXT DEFAULT 'info@jamia-salahuddin.edu.pk',
    address TEXT DEFAULT 'مرکزی کیمپس، بالمقابل جامع مسجد صلاح الدین ایوبی، مین روڈ',
    city TEXT DEFAULT 'لاہور، پاکستان',
    logo_url TEXT,
    campus_photo_url TEXT,
    principal_name TEXT DEFAULT 'حضرت مولانا مفتی عبد القدوس صاحب حفظہ اللہ',
    academic_year TEXT DEFAULT '۱۴۴۷-۱۴۴۸ھ (2026)',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE institute_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins full read/write access
CREATE POLICY "Admins have full access to departments"
    ON departments FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public read departments"
    ON departments FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Admins have full access to students"
    ON students FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to attendance"
    ON attendance FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to student_cards"
    ON student_cards FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to institute_settings"
    ON institute_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public read institute_settings"
    ON institute_settings FOR SELECT
    TO anon
    USING (true);

-- ====================================================================
-- 8. STAFF & SALARY MANAGEMENT TABLES (اسٹاف و تنخواہ رجسٹر)
-- ====================================================================

CREATE TABLE IF NOT EXISTS staff_members (
    id TEXT PRIMARY KEY, -- e.g. "EMP-001"
    name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    mobile_number TEXT,
    address TEXT,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    monthly_salary NUMERIC(10, 2) NOT NULL DEFAULT 25000.00,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS salary_records (
    id TEXT PRIMARY KEY, -- e.g. "SAL-2026-05-EMP001"
    staff_id TEXT NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- "2026-05"
    month_urdu TEXT NOT NULL, -- "مئی ۲۰۲۶"
    year INT NOT NULL DEFAULT 2026,
    base_salary NUMERIC(10, 2) NOT NULL,
    attendance_days INT DEFAULT 30,
    leave_days INT DEFAULT 0,
    late_days INT DEFAULT 0,
    advance NUMERIC(10, 2) DEFAULT 0,
    allowances NUMERIC(10, 2) DEFAULT 0,
    deductions NUMERIC(10, 2) DEFAULT 0,
    net_payable NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) DEFAULT 0,
    remaining_amount NUMERIC(10, 2) DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'partial', 'pending')),
    payment_date DATE,
    payment_method TEXT DEFAULT 'cash',
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_staff_month UNIQUE (staff_id, month)
);

CREATE TABLE IF NOT EXISTS salary_payments (
    id TEXT PRIMARY KEY,
    record_id TEXT NOT NULL REFERENCES salary_records(id) ON DELETE CASCADE,
    staff_id TEXT NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT DEFAULT 'cash',
    paid_by_admin TEXT NOT NULL,
    receipt_number TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS salary_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id TEXT NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('allowance', 'deduction', 'advance')),
    amount NUMERIC(10, 2) NOT NULL,
    effective_month TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_adjustments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to staff_members"
    ON staff_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to salary_records"
    ON salary_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to salary_payments"
    ON salary_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to salary_adjustments"
    ON salary_adjustments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ====================================================================
-- STORAGE BUCKETS SETUP (Supabase Storage)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('madrasa-media', 'madrasa-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Allow public read access to madrasa media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'madrasa-media');

CREATE POLICY "Allow authenticated admins to upload madrasa media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'madrasa-media');

CREATE POLICY "Allow authenticated admins to update/delete madrasa media"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'madrasa-media');
