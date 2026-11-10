export type DepartmentType = 'hifz' | 'nazra';
export type GenderType = 'male' | 'female';
export type StudentStatus = 'active' | 'graduated' | 'leave' | 'struck_off';

export interface Student {
  id: string; // e.g. "JSA-2026-0101"
  fullName: string;
  fatherName: string;
  department: DepartmentType;
  gender: GenderType;
  dateOfBirth: string;
  admissionDate: string;
  currentParaOrLevel: string; // e.g. "پارہ نمبر 14" or "قاعدہ و ناظرہ پارہ 3"
  teacherName: string;
  address: string;
  city: string;
  mobileNumber: string;
  fatherMobileNumber: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  photoUrl: string;
  monthlyFee: number;
  feeStatus: 'paid' | 'pending' | 'waived';
  status: StudentStatus;
  notes?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'admission' | 'completion' | 'attendance' | 'exam' | 'fee';
  studentName?: string;
}

export interface DepartmentInfo {
  id: DepartmentType | 'baneen' | 'banat';
  title: string;
  arabicTitle: string;
  description: string;
  headOfDepartment: string;
  totalStudents: number;
  teachersCount: number;
  classroomsCount: number;
  timing: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
}

export interface MadrasaStats {
  totalStudents: number;
  totalMale: number;
  totalFemale: number;
  totalHifz: number;
  totalNazra: number;
  todayAttendanceRate: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  totalMonthlyFees: number;
  paidFeesCount: number;
  pendingFeesCount: number;
}

export interface InstituteSettings {
  id: string;
  instituteName: string;
  subTitle: string;
  registrationNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  logoUrl: string;
  campusPhotoUrl: string;
  madinaHeroPhotoUrl: string;
  principalName: string;
  academicYear: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'nazim' | 'mudarris';
  lastLogin?: string;
}

export interface StudentCard {
  id: string;
  studentId: string;
  cardNumber: string;
  issueDate: string;
  expiryDate: string;
  qrCodePayload?: string;
  isActive: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  isConnected: boolean;
}

export interface StaffMember {
  id: string; // e.g. "EMP-001"
  name: string;
  fatherName: string;
  designation: string; // e.g. "مدرس حفظ القرآن", "قاری", "استاد ناظرہ", "ناظم"
  department: string; // e.g. "شعبہ حفظ القرآن", "شعبہ ناظرہ", "شعبہ بنات", "دفتر اہتمام"
  mobileNumber: string;
  address: string;
  joiningDate: string;
  monthlySalary: number; // بیسک ماہانہ تنخواہ
  photoUrl?: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
}

export interface MonthlySalaryRecord {
  id: string; // e.g. "SAL-2026-05-EMP001"
  staffId: string;
  month: string; // e.g. "2026-05"
  monthUrdu: string; // e.g. "مئی ۲۰۲۶"
  year: number;
  baseSalary: number;
  attendanceDays: number;
  leaveDays: number;
  lateDays: number;
  advance: number;
  allowances: number;
  deductions: number;
  netPayable: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentDate?: string;
  paymentMethod?: 'cash' | 'bank' | 'easypaisa';
  notes?: string;
  updatedAt: string;
}

export interface SalaryPayment {
  id: string;
  recordId: string;
  staffId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank' | 'easypaisa';
  paidByAdmin: string;
  receiptNumber: string;
  notes?: string;
}

export interface SalaryStats {
  totalStaff: number;
  activeStaff: number;
  totalMonthlyExpense: number;
  totalPaid: number;
  totalRemaining: number;
}
