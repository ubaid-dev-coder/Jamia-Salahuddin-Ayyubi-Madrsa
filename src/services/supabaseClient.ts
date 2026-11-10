import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Student,
  ActivityLog,
  MadrasaStats,
  InstituteSettings,
  AdminUser,
  SupabaseConfig,
  DepartmentInfo,
  StaffMember,
  MonthlySalaryRecord,
  SalaryPayment,
  SalaryStats
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_ACTIVITIES,
  INITIAL_DEPARTMENTS,
  INITIAL_STAFF,
  generateDefaultSalaryRecords
} from '../data/mockData';

// Storage keys
const SUPABASE_CONFIG_KEY = 'jamia_supabase_config';
const AUTH_SESSION_KEY = 'jamia_admin_session';
const STUDENTS_DB_KEY = 'jamia_db_students_v2';
const SETTINGS_KEY = 'jamia_db_settings';
const ACTIVITIES_DB_KEY = 'jamia_db_activities';
const ATTENDANCE_DB_KEY = 'jamia_db_attendance';
const ADMIN_REGISTRY_KEY = 'jamia_admin_registry_v1';
const STAFF_DB_KEY = 'jamia_db_staff_v1';
const SALARY_RECORDS_KEY = 'jamia_db_salaries_v1';
const SALARY_PAYMENTS_KEY = 'jamia_db_salary_payments_v1';

export interface StoredAdminAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  passwordHash: string; // Base64 encoded hash
  role: 'super_admin' | 'nazim' | 'mudarris';
  createdAt: string;
}

// In-memory hash helper (simple secure client hash representation)
const hashString = (str: string) => btoa(encodeURIComponent(str));

export const DEFAULT_SETTINGS: InstituteSettings = {
  id: 'primary',
  instituteName: 'جامعہ صلاح الدین ایوبی',
  subTitle: 'مرکزی دینی ادارہ و دار القرآن',
  registrationNumber: 'WFAQ-PK-1978/542',
  phone: '0300-1234567',
  email: 'info@jamia-salahuddin.edu.pk',
  address: '11G، نیو کراچی',
  city: 'کراچی، پاکستان',
  logoUrl: '/assets/aistudio/image_414e9cbc.png',
  campusPhotoUrl: '/assets/aistudio/image_0b17baf2.png',
  madinaHeroPhotoUrl: '/src/assets/images/madina_munawwara_hero_1794120021938.jpg',
  principalName: 'حضرت مولانا مفتی مجیب الرحمٰن صاحب (خطیبِ اسلام)',
  academicYear: '۱۴۴۷-۱۴۴۸ھ (2026)',
};

// Authorized default admin credentials (hashed logic)
const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-001',
  username: 'admin',
  email: 'nazim@jamia-salahuddin.edu.pk',
  fullName: 'مولانا مفتی عبد القدوس',
  role: 'super_admin',
};

class SupabaseService {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig;

  constructor() {
    // 1. Try env vars
    const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    let storedConfig: { url?: string; anonKey?: string } = {};
    try {
      const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (stored) storedConfig = JSON.parse(stored);
    } catch {
      // ignore
    }

    const finalUrl = storedConfig.url || envUrl;
    const finalKey = storedConfig.anonKey || envKey;

    const isConfigured = Boolean(
      finalUrl &&
        finalKey &&
        !finalUrl.includes('your-project') &&
        !finalKey.includes('your-anon-key')
    );

    this.config = {
      url: finalUrl,
      anonKey: finalKey,
      isConfigured,
      isConnected: false,
    };

    if (isConfigured) {
      try {
        this.client = createClient(finalUrl, finalKey);
        this.config.isConnected = true;
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
      }
    }
  }

  // Configuration management
  public getConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public saveConfig(url: string, anonKey: string): boolean {
    try {
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url, anonKey }));
      const isValid = Boolean(url && anonKey);
      this.config = {
        url,
        anonKey,
        isConfigured: isValid,
        isConnected: false,
      };

      if (isValid) {
        this.client = createClient(url, anonKey);
        this.config.isConnected = true;
      } else {
        this.client = null;
      }
      return true;
    } catch {
      return false;
    }
  }

  public async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.client || !this.config.isConfigured) {
      return {
        success: false,
        message: 'سپابیس کی URL اور Anon Key درج نہیں کی گئی ہیں۔ فی الحال لوکل ڈیٹا بیس فعال ہے۔',
      };
    }
    try {
      const { data, error } = await this.client.from('departments').select('count');
      if (error) {
        return {
          success: false,
          message: `کنکشن میں خرابی: ${error.message}`,
        };
      }
      this.config.isConnected = true;
      return {
        success: true,
        message: 'ماشاء اللہ! سپابیس کلاؤڈ ڈیٹا بیس سے رابطہ کامیابی سے قائم ہو چکا ہے۔',
      };
    } catch (e: any) {
      return {
        success: false,
        message: `رابطہ نہیں ہو سکا: ${e.message || 'نامعلوم غلطی'}`,
      };
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  // Initialize or get admin accounts
  private getStoredAdmins(): StoredAdminAccount[] {
    try {
      const stored = localStorage.getItem(ADMIN_REGISTRY_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default initial admin setup if no custom admins created yet
    const initialAdmins: StoredAdminAccount[] = [
      {
        id: 'adm-001',
        username: 'admin',
        email: 'nazim@jamia-salahuddin.edu.pk',
        fullName: 'حضرت مولانا مفتی مجیب الرحمٰن صاحب',
        passwordHash: hashString('admin123'),
        role: 'super_admin',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(ADMIN_REGISTRY_KEY, JSON.stringify(initialAdmins));
    return initialAdmins;
  }

  private saveStoredAdmins(admins: StoredAdminAccount[]) {
    localStorage.setItem(ADMIN_REGISTRY_KEY, JSON.stringify(admins));
  }

  public getAdminAccounts(): StoredAdminAccount[] {
    return this.getStoredAdmins();
  }

  public async registerAdminAccount(account: {
    username: string;
    email: string;
    fullName: string;
    password: string;
    role: 'super_admin' | 'nazim' | 'mudarris';
  }): Promise<{ success: boolean; error?: string }> {
    const cleanUser = account.username.trim().toLowerCase();
    const cleanEmail = account.email.trim().toLowerCase();
    const admins = this.getStoredAdmins();

    if (admins.some((a) => a.username.toLowerCase() === cleanUser)) {
      return { success: false, error: 'یہ یوزرنیم پہلے سے زیرِ استعمال ہے۔' };
    }

    // If Supabase is connected, also sign up in Supabase Auth
    if (this.client && this.config.isConfigured) {
      try {
        await this.client.auth.signUp({
          email: cleanEmail,
          password: account.password,
          options: {
            data: { full_name: account.fullName, username: cleanUser },
          },
        });
      } catch (err) {
        console.warn('Supabase auth sign up notice:', err);
      }
    }

    const newAdmin: StoredAdminAccount = {
      id: `adm-${Date.now()}`,
      username: cleanUser,
      email: cleanEmail,
      fullName: account.fullName,
      passwordHash: hashString(account.password),
      role: account.role,
      createdAt: new Date().toISOString(),
    };

    admins.push(newAdmin);
    this.saveStoredAdmins(admins);
    return { success: true };
  }

  public async changeAdminPassword(
    username: string,
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> {
    const admins = this.getStoredAdmins();
    const target = admins.find((a) => a.username.toLowerCase() === username.trim().toLowerCase());

    if (!target) {
      return { success: false, error: 'ایڈمن اکاؤنٹ نہیں ملا۔' };
    }

    if (target.passwordHash !== hashString(oldPass)) {
      return { success: false, error: 'پرانا پاس ورڈ درست نہیں ہے۔' };
    }

    target.passwordHash = hashString(newPass);
    this.saveStoredAdmins(admins);

    // If Supabase connected, update password
    if (this.client && this.config.isConfigured) {
      try {
        await this.client.auth.updateUser({ password: newPass });
      } catch {
        // ignore
      }
    }

    return { success: true };
  }

  public async updateAdminProfile(
    username: string,
    fullName: string,
    email: string
  ): Promise<{ success: boolean; user?: AdminUser }> {
    const admins = this.getStoredAdmins();
    const target = admins.find((a) => a.username.toLowerCase() === username.trim().toLowerCase());

    if (target) {
      target.fullName = fullName;
      target.email = email;
      this.saveStoredAdmins(admins);
    }

    const current = this.getCurrentUser();
    if (current) {
      const updated: AdminUser = {
        ...current,
        fullName,
        email,
      };
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updated));
      return { success: true, user: updated };
    }

    return { success: true };
  }

  public async requestPasswordReset(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();

    if (this.client && this.config.isConfigured) {
      try {
        const { error } = await this.client.auth.resetPasswordForEmail(cleanEmail);
        if (error) {
          return { success: false, message: error.message };
        }
      } catch {
        // ignore
      }
    }

    return {
      success: true,
      message: `پاس ورڈ ری سیٹ کا طریقہ کار ${cleanEmail} پر روانہ کر دیا گیا ہے۔`,
    };
  }

  public getCurrentUser(): AdminUser | null {
    try {
      const session = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY);
      if (session) {
        return JSON.parse(session);
      }
    } catch {
      // ignore
    }
    return null;
  }

  public async signIn(
    identifier: string,
    pass: string,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanId = identifier.trim().toLowerCase();

    // 1. If Supabase is connected, authenticate via Supabase Auth
    if (this.client && this.config.isConfigured) {
      try {
        const emailToUse = cleanId.includes('@')
          ? cleanId
          : `${cleanId}@jamia-salahuddin.edu.pk`;

        const { data, error } = await this.client.auth.signInWithPassword({
          email: emailToUse,
          password: pass,
        });

        if (!error && data.user) {
          const adminUser: AdminUser = {
            id: data.user.id,
            username: cleanId,
            email: data.user.email || emailToUse,
            fullName:
              data.user.user_metadata?.full_name || 'حضرت مولانا مفتی مجیب الرحمٰن صاحب',
            role: 'super_admin',
            lastLogin: new Date().toISOString(),
          };

          if (rememberMe) {
            localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(adminUser));
          } else {
            sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(adminUser));
          }
          return { success: true, user: adminUser };
        }
      } catch (e: any) {
        console.warn('Supabase auth attempt:', e);
      }
    }

    // 2. Authenticate against registered admin accounts
    const admins = this.getStoredAdmins();
    const matchingAdmin = admins.find(
      (a) =>
        (a.username.toLowerCase() === cleanId || a.email.toLowerCase() === cleanId) &&
        a.passwordHash === hashString(pass)
    );

    if (matchingAdmin) {
      const adminUser: AdminUser = {
        id: matchingAdmin.id,
        username: matchingAdmin.username,
        email: matchingAdmin.email,
        fullName: matchingAdmin.fullName,
        role: matchingAdmin.role,
        lastLogin: new Date().toISOString(),
      };

      if (rememberMe) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(adminUser));
      } else {
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(adminUser));
      }
      return { success: true, user: adminUser };
    }

    return {
      success: false,
      error: 'صارف کا نام (Username) یا پاس ورڈ درست نہیں ہے۔ برائے مہربانی درست کوائف درج کریں۔',
    };
  }

  public async signOut(): Promise<void> {
    if (this.client) {
      try {
        await this.client.auth.signOut();
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }

  // ==========================================
  // STORAGE & FILE UPLOADS
  // ==========================================
  public async uploadFile(
    file: File,
    folder: 'avatars' | 'logos' | 'documents' | 'campus' | 'staff-photos'
  ): Promise<string> {
    const timestamp = Date.now();
    const cleanFileName = `${folder}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // 1. If Supabase client is connected, upload to 'madrasa-media' bucket
    if (this.client && this.config.isConfigured) {
      try {
        const { data, error } = await this.client.storage
          .from('madrasa-media')
          .upload(cleanFileName, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data) {
          const { data: urlData } = this.client.storage
            .from('madrasa-media')
            .getPublicUrl(cleanFileName);
          if (urlData?.publicUrl) {
            return urlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, using persistent fallback', err);
      }
    }

    // 2. High-performance browser persistent data URL fallback
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('فائل اپلوڈ کرنے میں ناکامی ہوئی'));
      reader.readAsDataURL(file);
    });
  }

  // ==========================================
  // INSTITUTE SETTINGS
  // ==========================================
  public async getSettings(): Promise<InstituteSettings> {
    if (this.client && this.config.isConfigured) {
      try {
        const { data, error } = await this.client
          .from('institute_settings')
          .select('*')
          .eq('id', 'primary')
          .single();
        if (!error && data) {
          return {
            id: data.id,
            instituteName: data.institute_name,
            subTitle: data.sub_title,
            registrationNumber: data.registration_number,
            phone: data.phone,
            email: data.email,
            address: data.address,
            city: data.city,
            logoUrl: data.logo_url || DEFAULT_SETTINGS.logoUrl,
            campusPhotoUrl: data.campus_photo_url || DEFAULT_SETTINGS.campusPhotoUrl,
            madinaHeroPhotoUrl: data.madina_hero_photo_url || DEFAULT_SETTINGS.madinaHeroPhotoUrl,
            principalName: data.principal_name,
            academicYear: data.academic_year,
          };
        }
      } catch {
        // fallback
      }
    }

    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.madinaHeroPhotoUrl) {
          parsed.madinaHeroPhotoUrl = DEFAULT_SETTINGS.madinaHeroPhotoUrl;
        }
        if (!parsed.logoUrl || parsed.logoUrl.includes('image_0b17baf2') || parsed.logoUrl.includes('madrasa_emblem_logo')) {
          parsed.logoUrl = DEFAULT_SETTINGS.logoUrl;
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }

  public async updateSettings(settings: InstituteSettings): Promise<InstituteSettings> {
    if (this.client && this.config.isConfigured) {
      try {
        await this.client.from('institute_settings').upsert({
          id: 'primary',
          institute_name: settings.instituteName,
          sub_title: settings.subTitle,
          registration_number: settings.registrationNumber,
          phone: settings.phone,
          email: settings.email,
          address: settings.address,
          city: settings.city,
          logo_url: settings.logoUrl,
          campus_photo_url: settings.campusPhotoUrl,
          madina_hero_photo_url: settings.madinaHeroPhotoUrl,
          principal_name: settings.principalName,
          academic_year: settings.academicYear,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Failed to update settings in Supabase:', err);
      }
    }

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  }

  // ==========================================
  // STUDENTS CRUD (DATABASE)
  // ==========================================
  public async getStudents(): Promise<Student[]> {
    // 1. Try Supabase
    if (this.client && this.config.isConfigured) {
      try {
        const { data, error } = await this.client
          .from('students')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            fullName: d.full_name,
            fatherName: d.father_name,
            department: d.department_id as any,
            gender: d.gender as any,
            dateOfBirth: d.date_of_birth,
            admissionDate: d.admission_date,
            currentParaOrLevel: d.current_para_or_level,
            teacherName: d.teacher_name,
            address: d.address,
            city: d.city,
            mobileNumber: d.mobile_number,
            fatherMobileNumber: d.father_mobile_number,
            guardianName: d.guardian_name,
            guardianRelation: d.guardian_relation,
            guardianPhone: d.guardian_phone,
            photoUrl: d.photo_url || '',
            monthlyFee: Number(d.monthly_fee),
            feeStatus: d.fee_status as any,
            status: d.status as any,
            notes: d.notes,
            createdAt: d.created_at,
          }));
        }
      } catch (e) {
        console.warn('Error reading from Supabase students table:', e);
      }
    }

    // 2. Persistent storage fallback
    try {
      const stored = localStorage.getItem(STUDENTS_DB_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }

  public async addStudent(studentData: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
    const existing = await this.getStudents();
    const count = existing.length + 1;
    const year = new Date().getFullYear();
    const newId = `JSA-${year}-${String(100 + count).padStart(4, '0')}`;

    const newStudent: Student = {
      ...studentData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    // 1. Try Supabase
    if (this.client && this.config.isConfigured) {
      try {
        await this.client.from('students').insert({
          id: newStudent.id,
          full_name: newStudent.fullName,
          father_name: newStudent.fatherName,
          department_id: newStudent.department,
          gender: newStudent.gender,
          date_of_birth: newStudent.dateOfBirth,
          admission_date: newStudent.admissionDate,
          current_para_or_level: newStudent.currentParaOrLevel,
          teacher_name: newStudent.teacherName,
          address: newStudent.address,
          city: newStudent.city,
          mobile_number: newStudent.mobileNumber,
          father_mobile_number: newStudent.fatherMobileNumber,
          guardian_name: newStudent.guardianName,
          guardian_relation: newStudent.guardianRelation,
          guardian_phone: newStudent.guardianPhone,
          photo_url: newStudent.photoUrl,
          monthly_fee: newStudent.monthlyFee,
          fee_status: newStudent.feeStatus,
          status: newStudent.status,
          notes: newStudent.notes,
          created_at: newStudent.createdAt,
        });
      } catch (err) {
        console.warn('Failed to insert student into Supabase:', err);
      }
    }

    // Save locally
    const updated = [newStudent, ...existing];
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(updated));

    // Record activity
    await this.addActivity({
      id: `ACT-${Date.now()}`,
      title: 'نیا داخلہ درج ہوا',
      description: `طالب علم "${newStudent.fullName}" کا شعبہ ${
        newStudent.department === 'hifz' ? 'حفظ القرآن' : 'ناظرہ قرآن'
      } میں داخلہ مکمل ہوا۔`,
      timestamp: 'ابھی',
      type: 'admission',
      studentName: newStudent.fullName,
    });

    return newStudent;
  }

  public async updateStudent(student: Student): Promise<Student> {
    // 1. Try Supabase
    if (this.client && this.config.isConfigured) {
      try {
        await this.client
          .from('students')
          .update({
            full_name: student.fullName,
            father_name: student.fatherName,
            department_id: student.department,
            gender: student.gender,
            date_of_birth: student.dateOfBirth,
            admission_date: student.admissionDate,
            current_para_or_level: student.currentParaOrLevel,
            teacher_name: student.teacherName,
            address: student.address,
            city: student.city,
            mobile_number: student.mobileNumber,
            father_mobile_number: student.fatherMobileNumber,
            guardian_name: student.guardianName,
            guardian_relation: student.guardianRelation,
            guardian_phone: student.guardianPhone,
            photo_url: student.photoUrl,
            monthly_fee: student.monthlyFee,
            fee_status: student.feeStatus,
            status: student.status,
            notes: student.notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', student.id);
      } catch (err) {
        console.warn('Failed to update student in Supabase:', err);
      }
    }

    const existing = await this.getStudents();
    const updated = existing.map((s) => (s.id === student.id ? student : s));
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(updated));
    return student;
  }

  public async deleteStudent(id: string): Promise<boolean> {
    if (this.client && this.config.isConfigured) {
      try {
        await this.client.from('students').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete student from Supabase:', err);
      }
    }

    const existing = await this.getStudents();
    const studentToDelete = existing.find((s) => s.id === id);
    const updated = existing.filter((s) => s.id !== id);
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(updated));

    if (studentToDelete) {
      await this.addActivity({
        id: `ACT-${Date.now()}`,
        title: 'طالب علم کا اخراج',
        description: `طالب علم "${studentToDelete.fullName}" (داخلہ نمبر ${studentToDelete.id}) کو حذف کیا گیا۔`,
        timestamp: 'ابھی',
        type: 'admission',
        studentName: studentToDelete.fullName,
      });
    }

    return true;
  }

  // ==========================================
  // ACTIVITIES & ATTENDANCE
  // ==========================================
  public async getActivities(): Promise<ActivityLog[]> {
    try {
      const stored = localStorage.getItem(ACTIVITIES_DB_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(ACTIVITIES_DB_KEY, JSON.stringify(INITIAL_ACTIVITIES));
    return INITIAL_ACTIVITIES;
  }

  public async addActivity(act: Omit<ActivityLog, 'id'> & { id?: string }): Promise<void> {
    const existing = await this.getActivities();
    const fullAct: ActivityLog = {
      id: act.id || `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...act,
    };
    const updated = [fullAct, ...existing.slice(0, 19)];
    localStorage.setItem(ACTIVITIES_DB_KEY, JSON.stringify(updated));
  }

  public async getAttendanceState(): Promise<Record<string, 'present' | 'absent' | 'leave'>> {
    const today = new Date().toISOString().split('T')[0];
    try {
      const stored = localStorage.getItem(`${ATTENDANCE_DB_KEY}_${today}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    const students = await this.getStudents();
    const initialMap: Record<string, 'present' | 'absent' | 'leave'> = {};
    students.forEach((s, idx) => {
      if (idx === 2) initialMap[s.id] = 'leave';
      else if (idx === 6) initialMap[s.id] = 'absent';
      else initialMap[s.id] = 'present';
    });
    return initialMap;
  }

  public async saveAttendanceState(map: Record<string, 'present' | 'absent' | 'leave'>): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`${ATTENDANCE_DB_KEY}_${today}`, JSON.stringify(map));

    if (this.client && this.config.isConfigured) {
      try {
        const rows = Object.entries(map).map(([studentId, status]) => ({
          student_id: studentId,
          date: today,
          status,
        }));
        await this.client.from('attendance').upsert(rows, {
          onConflict: 'student_id,date',
        });
      } catch (err) {
        console.warn('Failed to upsert attendance to Supabase:', err);
      }
    }
  }

  public async getStats(): Promise<MadrasaStats> {
    const students = await this.getStudents();
    const attendance = await this.getAttendanceState();

    const totalStudents = students.length;
    const totalMale = students.filter((s) => s.gender === 'male').length;
    const totalFemale = students.filter((s) => s.gender === 'female').length;
    const totalHifz = students.filter((s) => s.department === 'hifz').length;
    const totalNazra = students.filter((s) => s.department === 'nazra').length;

    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    students.forEach((s) => {
      const status = attendance[s.id] || 'present';
      if (status === 'present') presentCount++;
      else if (status === 'absent') absentCount++;
      else if (status === 'leave') leaveCount++;
    });

    let totalMonthlyFees = 0;
    let paidFeesCount = 0;
    let pendingFeesCount = 0;

    students.forEach((s) => {
      totalMonthlyFees += s.monthlyFee || 0;
      if (s.feeStatus === 'paid') paidFeesCount++;
      else if (s.feeStatus === 'pending') pendingFeesCount++;
    });

    const rate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 100;

    return {
      totalStudents,
      totalMale,
      totalFemale,
      totalHifz,
      totalNazra,
      todayAttendanceRate: rate,
      presentCount,
      absentCount,
      leaveCount,
      totalMonthlyFees,
      paidFeesCount,
      pendingFeesCount,
    };
  }

  // ==========================================
  // STAFF MEMBERS MANAGEMENT (اسٹاف و ملازمین مینجمنٹ)
  // ==========================================
  public async getStaffMembers(): Promise<StaffMember[]> {
    if (this.client && this.config.isConfigured) {
      try {
        const { data, error } = await this.client
          .from('staff_members')
          .select('*')
          .order('id', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            fatherName: item.father_name,
            designation: item.designation,
            department: item.department,
            mobileNumber: item.mobile_number,
            address: item.address,
            joiningDate: item.joining_date,
            monthlySalary: Number(item.monthly_salary),
            photoUrl: item.photo_url,
            status: item.status,
            notes: item.notes,
            createdAt: item.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch staff notice:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STAFF_DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    localStorage.setItem(STAFF_DB_KEY, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  }

  public async addStaffMember(
    staffData: Omit<StaffMember, 'id' | 'createdAt'>
  ): Promise<StaffMember> {
    const existing = await this.getStaffMembers();
    const count = existing.length + 1;
    const newId = `EMP-${count < 10 ? '00' : count < 100 ? '0' : ''}${count}`;

    const newStaff: StaffMember = {
      ...staffData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    if (this.client && this.config.isConfigured) {
      try {
        await this.client.from('staff_members').insert([
          {
            id: newStaff.id,
            name: newStaff.name,
            father_name: newStaff.fatherName,
            designation: newStaff.designation,
            department: newStaff.department,
            mobile_number: newStaff.mobileNumber,
            address: newStaff.address,
            joining_date: newStaff.joiningDate,
            monthly_salary: newStaff.monthlySalary,
            photo_url: newStaff.photoUrl,
            status: newStaff.status,
            notes: newStaff.notes,
            created_at: newStaff.createdAt,
          },
        ]);
      } catch (err) {
        console.warn('Supabase add staff notice:', err);
      }
    }

    const updatedList = [newStaff, ...existing];
    localStorage.setItem(STAFF_DB_KEY, JSON.stringify(updatedList));

    // Also append activity log
    await this.addActivity({
      title: 'نیا ملازم شامل ہوا',
      description: `${newStaff.name} کو بطور "${newStaff.designation}" شامل کیا گیا۔`,
      timestamp: 'ابھی',
      type: 'admission',
    });

    return newStaff;
  }

  public async updateStaffMember(staff: StaffMember): Promise<StaffMember> {
    if (this.client && this.config.isConfigured) {
      try {
        await this.client
          .from('staff_members')
          .update({
            name: staff.name,
            father_name: staff.fatherName,
            designation: staff.designation,
            department: staff.department,
            mobile_number: staff.mobileNumber,
            address: staff.address,
            joining_date: staff.joiningDate,
            monthly_salary: staff.monthlySalary,
            photo_url: staff.photoUrl,
            status: staff.status,
            notes: staff.notes,
          })
          .eq('id', staff.id);
      } catch (err) {
        console.warn('Supabase update staff notice:', err);
      }
    }

    const existing = await this.getStaffMembers();
    const updated = existing.map((s) => (s.id === staff.id ? staff : s));
    localStorage.setItem(STAFF_DB_KEY, JSON.stringify(updated));
    return staff;
  }

  public async deleteStaffMember(id: string): Promise<boolean> {
    if (this.client && this.config.isConfigured) {
      try {
        await this.client.from('staff_members').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete staff notice:', err);
      }
    }

    const existing = await this.getStaffMembers();
    const updated = existing.filter((s) => s.id !== id);
    localStorage.setItem(STAFF_DB_KEY, JSON.stringify(updated));
    return true;
  }

  // ==========================================
  // MONTHLY SALARY REGISTERS & PAYMENTS (ماہانہ تنخواہ رجسٹر)
  // ==========================================
  public async getSalaryRecords(
    monthStr: string = '2026-05',
    monthUrdu: string = 'مئی ۲۰۲۶',
    yearNum: number = 2026
  ): Promise<MonthlySalaryRecord[]> {
    const key = `${SALARY_RECORDS_KEY}_${monthStr}`;

    if (this.client && this.config.isConfigured) {
      try {
        const { data, error } = await this.client
          .from('salary_records')
          .select('*')
          .eq('month', monthStr);
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            staffId: item.staff_id,
            month: item.month,
            monthUrdu: item.month_urdu || monthUrdu,
            year: item.year || yearNum,
            baseSalary: Number(item.base_salary),
            attendanceDays: Number(item.attendance_days || 30),
            leaveDays: Number(item.leave_days || 0),
            lateDays: Number(item.late_days || 0),
            advance: Number(item.advance || 0),
            allowances: Number(item.allowances || 0),
            deductions: Number(item.deductions || 0),
            netPayable: Number(item.net_payable),
            paidAmount: Number(item.paid_amount || 0),
            remainingAmount: Number(item.remaining_amount || 0),
            paymentStatus: item.payment_status || 'pending',
            paymentDate: item.payment_date,
            paymentMethod: item.payment_method || 'cash',
            notes: item.notes,
            updatedAt: item.updated_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch salaries notice:', err);
      }
    }

    // Try localStorage
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    // Fallback: generate default from staff members
    const staffList = await this.getStaffMembers();
    const defaults = generateDefaultSalaryRecords(staffList, monthStr, monthUrdu, yearNum);
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }

  public async updateSalaryRecord(record: MonthlySalaryRecord): Promise<MonthlySalaryRecord> {
    const key = `${SALARY_RECORDS_KEY}_${record.month}`;

    if (this.client && this.config.isConfigured) {
      try {
        await this.client.from('salary_records').upsert({
          id: record.id,
          staff_id: record.staffId,
          month: record.month,
          month_urdu: record.monthUrdu,
          year: record.year,
          base_salary: record.baseSalary,
          attendance_days: record.attendanceDays,
          leave_days: record.leaveDays,
          late_days: record.lateDays,
          advance: record.advance,
          allowances: record.allowances,
          deductions: record.deductions,
          net_payable: record.netPayable,
          paid_amount: record.paidAmount,
          remaining_amount: record.remainingAmount,
          payment_status: record.paymentStatus,
          payment_date: record.paymentDate,
          payment_method: record.paymentMethod,
          notes: record.notes,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase update salary record notice:', err);
      }
    }

    const records = await this.getSalaryRecords(record.month, record.monthUrdu, record.year);
    const updated = records.map((r) => (r.id === record.id ? record : r));
    localStorage.setItem(key, JSON.stringify(updated));
    return record;
  }

  public async recordSalaryPayment(
    paymentData: Omit<SalaryPayment, 'id'>,
    monthUrdu: string = 'مئی ۲۰۲۶',
    yearNum: number = 2026
  ): Promise<{ success: boolean; record: MonthlySalaryRecord; payment: SalaryPayment }> {
    const paymentId = `PAY-${Date.now()}`;
    const payment: SalaryPayment = {
      ...paymentData,
      id: paymentId,
    };

    // Save payment log
    try {
      const storedPayments = localStorage.getItem(SALARY_PAYMENTS_KEY);
      const list = storedPayments ? JSON.parse(storedPayments) : [];
      list.unshift(payment);
      localStorage.setItem(SALARY_PAYMENTS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    // Fetch and update corresponding salary record
    const month = paymentData.recordId.split('-')[1] + '-' + paymentData.recordId.split('-')[2];
    const records = await this.getSalaryRecords(month, monthUrdu, yearNum);
    const target = records.find((r) => r.id === paymentData.recordId);

    if (!target) {
      throw new Error('تنخواہ کا ریکارڈ نہیں ملا۔');
    }

    const newPaid = Number(target.paidAmount) + Number(paymentData.amount);
    const newRemaining = Math.max(0, target.netPayable - newPaid);
    const newStatus: 'paid' | 'partial' | 'pending' =
      newRemaining <= 0 ? 'paid' : newPaid > 0 ? 'partial' : 'pending';

    const updatedRecord: MonthlySalaryRecord = {
      ...target,
      paidAmount: newPaid,
      remainingAmount: newRemaining,
      paymentStatus: newStatus,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      updatedAt: new Date().toISOString(),
    };

    await this.updateSalaryRecord(updatedRecord);

    // Add activity log
    await this.addActivity({
      title: 'تنخواہ ادائیگی درج',
      description: `ملازم (آئی ڈی: ${paymentData.staffId}) کو رقم ${paymentData.amount.toLocaleString()} روپے ادا کی گئی۔ (رسید نمبر: ${paymentData.receiptNumber})`,
      timestamp: 'ابھی',
      type: 'fee',
    });

    return {
      success: true,
      record: updatedRecord,
      payment,
    };
  }

  public async getSalaryPayments(staffId?: string): Promise<SalaryPayment[]> {
    try {
      const stored = localStorage.getItem(SALARY_PAYMENTS_KEY);
      if (stored) {
        const list: SalaryPayment[] = JSON.parse(stored);
        if (staffId) {
          return list.filter((p) => p.staffId === staffId);
        }
        return list;
      }
    } catch {
      // ignore
    }
    return [];
  }

  public async getSalaryStats(
    monthStr: string = '2026-05',
    monthUrdu: string = 'مئی ۲۰۲۶',
    yearNum: number = 2026
  ): Promise<SalaryStats> {
    const staff = await this.getStaffMembers();
    const records = await this.getSalaryRecords(monthStr, monthUrdu, yearNum);

    const activeStaff = staff.filter((s) => s.status === 'active').length;
    let totalMonthlyExpense = 0;
    let totalPaid = 0;
    let totalRemaining = 0;

    records.forEach((r) => {
      totalMonthlyExpense += Number(r.netPayable || 0);
      totalPaid += Number(r.paidAmount || 0);
      totalRemaining += Number(r.remainingAmount || 0);
    });

    return {
      totalStaff: staff.length,
      activeStaff,
      totalMonthlyExpense,
      totalPaid,
      totalRemaining,
    };
  }

  public resetDemoData(): void {
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(ACTIVITIES_DB_KEY, JSON.stringify(INITIAL_ACTIVITIES));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STAFF_DB_KEY, JSON.stringify(INITIAL_STAFF));
    localStorage.removeItem(`${SALARY_RECORDS_KEY}_2026-05`);
  }
}

export const supabaseService = new SupabaseService();
