import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LandingHomePage } from './components/home/LandingHomePage';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { DepartmentView } from './components/departments/DepartmentView';
import { StudentList } from './components/students/StudentList';
import { AttendanceSheet } from './components/attendance/AttendanceSheet';
import { FeesManagement } from './components/fees/FeesManagement';
import { ReportsView } from './components/reports/ReportsView';
import { StudentRegistrationModal } from './components/students/StudentRegistrationModal';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { StudentDeleteConfirmModal } from './components/students/StudentDeleteConfirmModal';
import { StudentCardLookupModal } from './components/students/StudentCardLookupModal';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { InstituteSettingsModal } from './components/admin/InstituteSettingsModal';
import { LogoManagementModal } from './components/admin/LogoManagementModal';
import { LogoSettingsPage } from './components/admin/LogoSettingsPage';
import { BarcodeScannerModal } from './components/admin/BarcodeScannerModal';
import { AdminProfileModal } from './components/admin/AdminProfileModal';
import { SalaryDashboard } from './components/salary/SalaryDashboard';
import { SalaryPaymentModal } from './components/salary/SalaryPaymentModal';
import { SalaryReceiptModal } from './components/salary/SalaryReceiptModal';
import { StaffMemberModal } from './components/salary/StaffMemberModal';
import { supabaseService, DEFAULT_SETTINGS } from './services/supabaseClient';
import { INITIAL_DEPARTMENTS } from './data/mockData';
import {
  Student,
  DepartmentType,
  GenderType,
  AdminUser,
  InstituteSettings,
  SupabaseConfig,
  StaffMember,
  MonthlySalaryRecord,
  SalaryPayment,
  SalaryStats
} from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Admin Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() =>
    supabaseService.getCurrentUser()
  );
  const [showLoginModal, setShowLoginModal] = useState(false);

  // App Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent' | 'leave'>>({});
  const [instituteSettings, setInstituteSettings] = useState<InstituteSettings>(DEFAULT_SETTINGS);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(supabaseService.getConfig());
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Navigation & UI State (defaults to 'home' per UI update)
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<'general' | 'logo' | 'supabase'>('general');
  const [isCardLookupOpen, setIsCardLookupOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [defaultRegDept, setDefaultRegDept] = useState<DepartmentType>('hifz');
  const [defaultRegGender, setDefaultRegGender] = useState<GenderType>('male');

  // Staff & Salary Management State
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<MonthlySalaryRecord[]>([]);
  const [salaryStats, setSalaryStats] = useState<SalaryStats>({
    totalStaff: 0,
    activeStaff: 0,
    totalMonthlyExpense: 0,
    totalPaid: 0,
    totalRemaining: 0,
  });
  const [currentSalaryMonth, setCurrentSalaryMonth] = useState<string>('2026-05');
  const [currentSalaryMonthUrdu, setCurrentSalaryMonthUrdu] = useState<string>('مئی ۲۰۲۶');
  const [currentSalaryYear, setCurrentSalaryYear] = useState<number>(2026);

  // Salary Modals State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeSalaryStaff, setActiveSalaryStaff] = useState<StaffMember | null>(null);
  const [activeSalaryRecord, setActiveSalaryRecord] = useState<MonthlySalaryRecord | null>(null);
  const [isSalaryReceiptOpen, setIsSalaryReceiptOpen] = useState(false);
  const [receiptPaidAmount, setReceiptPaidAmount] = useState<number | undefined>(undefined);
  const [receiptPaymentMethod, setReceiptPaymentMethod] = useState<string | undefined>(undefined);

  // Load initial settings and user
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoadingData(true);
      try {
        const [
          loadedSettings,
          loadedStudents,
          loadedActs,
          loadedAtt,
          loadedStaff,
          loadedSalaries,
          loadedStats
        ] = await Promise.all([
          supabaseService.getSettings(),
          supabaseService.getStudents(),
          supabaseService.getActivities(),
          supabaseService.getAttendanceState(),
          supabaseService.getStaffMembers(),
          supabaseService.getSalaryRecords('2026-05', 'مئی ۲۰۲۶', 2026),
          supabaseService.getSalaryStats('2026-05', 'مئی ۲۰۲۶', 2026),
        ]);
        setInstituteSettings(loadedSettings);
        setStudents(loadedStudents);
        setActivities(loadedActs);
        setAttendanceState(loadedAtt);
        setStaffList(loadedStaff);
        setSalaryRecords(loadedSalaries);
        setSalaryStats(loadedStats);
      } catch (err) {
        console.error('Failed to load database records:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAllData();
  }, []);

  // Recalculate stats dynamically from real records
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalMale = students.filter((s) => s.gender === 'male').length;
    const totalFemale = students.filter((s) => s.gender === 'female').length;
    const totalHifz = students.filter((s) => s.department === 'hifz').length;
    const totalNazra = students.filter((s) => s.department === 'nazra').length;

    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    students.forEach((s) => {
      const status = attendanceState[s.id] || 'present';
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
  }, [students, attendanceState]);

  // Handle Save (Add or Update) in Database
  const handleSaveStudent = async (studentData: any) => {
    if (editingStudent) {
      const updated = await supabaseService.updateStudent({
        ...editingStudent,
        ...studentData,
      });
      const all = await supabaseService.getStudents();
      const acts = await supabaseService.getActivities();
      setStudents(all);
      setActivities(acts);
      setEditingStudent(null);
      if (profileStudent?.id === updated.id) {
        setProfileStudent(updated);
      }
    } else {
      await supabaseService.addStudent(studentData);
      const all = await supabaseService.getStudents();
      const acts = await supabaseService.getActivities();
      setStudents(all);
      setActivities(acts);
    }
  };

  // Handle Delete in Database
  const handleConfirmDelete = async (id: string) => {
    await supabaseService.deleteStudent(id);
    const all = await supabaseService.getStudents();
    const acts = await supabaseService.getActivities();
    setStudents(all);
    setActivities(acts);
    setDeletingStudent(null);
    if (profileStudent?.id === id) {
      setProfileStudent(null);
    }
  };

  // Handle Attendance Save
  const handleSaveAttendance = async (map: Record<string, 'present' | 'absent' | 'leave'>) => {
    await supabaseService.saveAttendanceState(map);
    setAttendanceState(map);
  };

  // Handle Single Attendance Mark from Barcode Scanner
  const handleSingleAttendance = async (studentId: string, status: 'present' | 'absent' | 'leave') => {
    const updated = {
      ...attendanceState,
      [studentId]: status,
    };
    await handleSaveAttendance(updated);
  };

  // Handle Settings Save
  const handleSaveSettings = async (newSettings: InstituteSettings) => {
    const updated = await supabaseService.updateSettings(newSettings);
    setInstituteSettings(updated);
  };

  // Handle Sign Out (Redirects to Admin Login)
  const handleSignOut = async () => {
    await supabaseService.signOut();
    setAdminUser(null);
    setCurrentTab('admin_login');
  };

  // Reset demo
  const handleResetData = async () => {
    supabaseService.resetDemoData();
    const all = await supabaseService.getStudents();
    const acts = await supabaseService.getActivities();
    const att = await supabaseService.getAttendanceState();
    const sett = await supabaseService.getSettings();
    setStudents(all);
    setActivities(acts);
    setAttendanceState(att);
    setInstituteSettings(sett);
  };

  // Quick Open Registration Modal
  const handleOpenNewStudent = (
    dept: DepartmentType = 'hifz',
    gender: GenderType = 'male'
  ) => {
    setEditingStudent(null);
    setDefaultRegDept(dept);
    setDefaultRegGender(gender);
    setIsRegModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsRegModalOpen(true);
  };

  // Salary & Staff Management Handlers
  const handleChangeSalaryMonth = async (monthStr: string, monthUrdu: string, year: number) => {
    setCurrentSalaryMonth(monthStr);
    setCurrentSalaryMonthUrdu(monthUrdu);
    setCurrentSalaryYear(year);
    const [recs, sStats] = await Promise.all([
      supabaseService.getSalaryRecords(monthStr, monthUrdu, year),
      supabaseService.getSalaryStats(monthStr, monthUrdu, year),
    ]);
    setSalaryRecords(recs);
    setSalaryStats(sStats);
  };

  const handleSaveStaff = async (staffData: any) => {
    if (editingStaff) {
      await supabaseService.updateStaffMember({
        ...editingStaff,
        ...staffData,
      });
    } else {
      await supabaseService.addStaffMember(staffData);
    }
    const [updatedStaff, updatedRecords, updatedStats] = await Promise.all([
      supabaseService.getStaffMembers(),
      supabaseService.getSalaryRecords(currentSalaryMonth, currentSalaryMonthUrdu, currentSalaryYear),
      supabaseService.getSalaryStats(currentSalaryMonth, currentSalaryMonthUrdu, currentSalaryYear),
    ]);
    setStaffList(updatedStaff);
    setSalaryRecords(updatedRecords);
    setSalaryStats(updatedStats);
    setIsStaffModalOpen(false);
    setEditingStaff(null);
  };

  const handleDeleteStaff = async (id: string) => {
    await supabaseService.deleteStaffMember(id);
    const [updatedStaff, updatedRecords, updatedStats] = await Promise.all([
      supabaseService.getStaffMembers(),
      supabaseService.getSalaryRecords(currentSalaryMonth, currentSalaryMonthUrdu, currentSalaryYear),
      supabaseService.getSalaryStats(currentSalaryMonth, currentSalaryMonthUrdu, currentSalaryYear),
    ]);
    setStaffList(updatedStaff);
    setSalaryRecords(updatedRecords);
    setSalaryStats(updatedStats);
  };

  const handleUpdateSalaryRecord = async (record: MonthlySalaryRecord) => {
    await supabaseService.updateSalaryRecord(record);
    const [updatedRecords, updatedStats] = await Promise.all([
      supabaseService.getSalaryRecords(currentSalaryMonth, currentSalaryMonthUrdu, currentSalaryYear),
      supabaseService.getSalaryStats(currentSalaryMonth, currentSalaryMonthUrdu, currentSalaryYear),
    ]);
    setSalaryRecords(updatedRecords);
    setSalaryStats(updatedStats);
  };

  const handleRecordSalaryPayment = async (paymentData: Omit<SalaryPayment, 'id'>) => {
    await supabaseService.recordSalaryPayment(paymentData);
    const [updatedRecords, updatedStats] = await Promise.all([
      supabaseService.getSalaryRecords(currentSalaryMonth, currentSalaryMonthUrdu, currentSalaryYear),
      supabaseService.getSalaryStats(currentSalaryMonth, currentSalaryMonthUrdu, currentSalaryYear),
    ]);
    setSalaryRecords(updatedRecords);
    setSalaryStats(updatedStats);
  };

  // Is current view an admin workspace tab?
  const isAdminWorkspace = Boolean(
    adminUser &&
    [
      'dashboard',
      'students_list',
      'attendance',
      'fees',
      'reports',
      'baneen',
      'banat',
      'hifz',
      'nazra',
      'salary',
      'logo-settings',
    ].includes(currentTab) &&
    !['home', 'about', 'contact', 'admin_login'].includes(currentTab)
  );

  // Render main view body
  const renderContent = () => {
    if (isLoadingData) {
      return (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-800 mx-auto mb-3" />
          <p className="text-sm font-medium text-stone-600">ڈیٹا بیس سے ریکارڈ لوڈ ہو رہا ہے...</p>
        </div>
      );
    }

    // Global Search override on dashboard
    if (searchTerm.trim() !== '' && currentTab === 'dashboard') {
      return (
        <StudentList
          students={students}
          onViewStudent={(s) => setProfileStudent(s)}
          onEditStudent={handleEditStudent}
          onDeleteStudent={(s) => setDeletingStudent(s)}
          onOpenNewStudent={() => handleOpenNewStudent()}
          title="تلاش کے نتائج"
          subtitle={`تلاش کردہ عبارت: "${searchTerm}"`}
        />
      );
    }

    // Route Protection: If accessing restricted admin areas without authentication
    if (['dashboard', 'attendance', 'fees', 'reports', 'students_list', 'salary', 'logo-settings'].includes(currentTab) && !adminUser) {
      return (
        <div className="py-6 sm:py-10">
          <AdminLoginPage
            onLoginSuccess={(user) => {
              setAdminUser(user);
              setCurrentTab('dashboard');
            }}
            instituteSettings={instituteSettings}
            onBackToHome={() => setCurrentTab('home')}
          />
        </div>
      );
    }

    if (currentTab === 'admin_login') {
      return (
        <div className="py-6 sm:py-10">
          <AdminLoginPage
            onLoginSuccess={(user) => {
              setAdminUser(user);
              setCurrentTab('dashboard');
            }}
            instituteSettings={instituteSettings}
            onBackToHome={() => setCurrentTab('home')}
          />
        </div>
      );
    }

    switch (currentTab) {
      case 'home':
      case 'about':
      case 'contact':
        return (
          <LandingHomePage
            instituteSettings={instituteSettings}
            stats={stats}
            onNavigateTab={setCurrentTab}
            onOpenNewStudent={() => handleOpenNewStudent()}
            onViewStudentCardLookup={() => setIsCardLookupOpen(true)}
          />
        );

      case 'dashboard':
        return (
          <HomeDashboard
            stats={stats}
            recentStudents={students}
            activities={activities}
            onNavigateTab={setCurrentTab}
            onOpenNewStudent={() => handleOpenNewStudent()}
            onViewStudent={(s) => setProfileStudent(s)}
            instituteSettings={instituteSettings}
          />
        );

      case 'hifz':
        return (
          <DepartmentView
            deptKey="hifz"
            deptInfo={INITIAL_DEPARTMENTS[0]}
            students={students}
            onViewStudent={(s) => setProfileStudent(s)}
            onEditStudent={handleEditStudent}
            onDeleteStudent={(s) => setDeletingStudent(s)}
            onOpenNewStudentForDept={(dept, gender) =>
              handleOpenNewStudent(dept, gender)
            }
          />
        );

      case 'nazra':
        return (
          <DepartmentView
            deptKey="nazra"
            deptInfo={INITIAL_DEPARTMENTS[1]}
            students={students}
            onViewStudent={(s) => setProfileStudent(s)}
            onEditStudent={handleEditStudent}
            onDeleteStudent={(s) => setDeletingStudent(s)}
            onOpenNewStudentForDept={(dept, gender) =>
              handleOpenNewStudent(dept, gender)
            }
          />
        );

      case 'baneen':
        return (
          <DepartmentView
            deptKey="baneen"
            deptInfo={INITIAL_DEPARTMENTS[2]}
            students={students}
            onViewStudent={(s) => setProfileStudent(s)}
            onEditStudent={handleEditStudent}
            onDeleteStudent={(s) => setDeletingStudent(s)}
            onOpenNewStudentForDept={(dept, gender) =>
              handleOpenNewStudent(dept, gender)
            }
          />
        );

      case 'banat':
        return (
          <DepartmentView
            deptKey="banat"
            deptInfo={INITIAL_DEPARTMENTS[3]}
            students={students}
            onViewStudent={(s) => setProfileStudent(s)}
            onEditStudent={handleEditStudent}
            onDeleteStudent={(s) => setDeletingStudent(s)}
            onOpenNewStudentForDept={(dept, gender) =>
              handleOpenNewStudent(dept, gender)
            }
          />
        );

      case 'students_list':
        return (
          <StudentList
            students={students}
            onViewStudent={(s) => setProfileStudent(s)}
            onEditStudent={handleEditStudent}
            onDeleteStudent={(s) => setDeletingStudent(s)}
            onOpenNewStudent={() => handleOpenNewStudent()}
          />
        );

      case 'attendance':
        return (
          <AttendanceSheet
            students={students}
            attendanceState={attendanceState}
            onSaveAttendance={handleSaveAttendance}
          />
        );

      case 'fees':
        return (
          <FeesManagement
            students={students}
            onUpdateStudent={(s) => handleSaveStudent(s)}
            instituteSettings={instituteSettings}
          />
        );

      case 'salary':
        return (
          <SalaryDashboard
            staffList={staffList}
            salaryRecords={salaryRecords}
            salaryStats={salaryStats}
            currentMonth={currentSalaryMonth}
            currentMonthUrdu={currentSalaryMonthUrdu}
            currentYear={currentSalaryYear}
            onChangeMonth={handleChangeSalaryMonth}
            onOpenNewStaff={() => {
              setEditingStaff(null);
              setIsStaffModalOpen(true);
            }}
            onEditStaff={(st) => {
              setEditingStaff(st);
              setIsStaffModalOpen(true);
            }}
            onDeleteStaff={handleDeleteStaff}
            onOpenPaymentModal={(st, rec) => {
              setActiveSalaryStaff(st);
              setActiveSalaryRecord(rec);
              setIsPaymentModalOpen(true);
            }}
            onOpenReceiptModal={(st, rec) => {
              setActiveSalaryStaff(st);
              setActiveSalaryRecord(rec);
              setReceiptPaidAmount(undefined);
              setReceiptPaymentMethod(undefined);
              setIsSalaryReceiptOpen(true);
            }}
            onUpdateSalaryRecord={handleUpdateSalaryRecord}
            instituteSettings={instituteSettings}
          />
        );

      case 'reports':
        return <ReportsView stats={stats} students={students} />;

      case 'logo-settings':
        return (
          <LogoSettingsPage
            instituteSettings={instituteSettings}
            onSaveSettings={handleSaveSettings}
            onNavigateTab={setCurrentTab}
          />
        );

      default:
        return (
          <LandingHomePage
            instituteSettings={instituteSettings}
            stats={stats}
            onNavigateTab={setCurrentTab}
            onOpenNewStudent={() => handleOpenNewStudent()}
            onViewStudentCardLookup={() => setIsCardLookupOpen(true)}
          />
        );
    }
  };

  // Current View Title for Admin Header
  const getAdminPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'مرکزی ایڈمن ڈیش بورڈ';
      case 'students_list':
        return 'تمام طلباء و طالبات کی فہرست';
      case 'attendance':
        return 'یومیہ حاضری رجسٹر';
      case 'fees':
        return 'شعبہ فیس و مالیات';
      case 'salary':
        return 'ماہانہ رجسٹرِ تنخواہ ملازمین و اساتذہ';
      case 'reports':
        return 'رپورٹس و اسناد';
      case 'logo-settings':
        return 'جامعہ کا لوگو اپلوڈ کریں';
      default:
        return 'ایڈمن پینل';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-stone-900 flex flex-col" dir="rtl">
      {/* 1. TOP PREMIUM NAVIGATION BAR (Persistent across entire app) */}
      <Navbar
        currentTab={currentTab}
        onNavigateTab={(tab) => {
          if (['dashboard', 'attendance', 'fees', 'reports', 'students_list', 'salary', 'logo-settings'].includes(tab) && !adminUser) {
            setCurrentTab('admin_login');
          } else {
            setCurrentTab(tab);
          }
        }}
        instituteSettings={instituteSettings}
        adminUser={adminUser}
        onOpenLogin={() => {
          if (adminUser) {
            setCurrentTab('dashboard');
          } else {
            setCurrentTab('admin_login');
          }
        }}
        onSignOut={handleSignOut}
        onOpenStudentCardLookup={() => setIsCardLookupOpen(true)}
      />

      {/* Main Body Layout */}
      {isAdminWorkspace && adminUser ? (
        // When in Admin Workspace view (Dashboard, Attendance, Fees, Reports, Directory)
        <div className="flex-1 flex min-w-0">
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            stats={stats}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            onOpenNewStudent={() => handleOpenNewStudent()}
            onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
            onOpenStudentCardLookup={() => setIsCardLookupOpen(true)}
            onOpenUploadLogo={() => {
              setIsLogoModalOpen(true);
            }}
            onOpenChangeMadinaHero={() => {
              setSettingsModalTab('logo');
              setIsSettingsModalOpen(true);
            }}
            onOpenSettings={() => {
              setSettingsModalTab('general');
              setIsSettingsModalOpen(true);
            }}
            onOpenAdminProfile={() => setIsAdminProfileOpen(true)}
            onSignOut={handleSignOut}
            instituteSettings={instituteSettings}
            adminUser={adminUser}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <Header
              onOpenMobileMenu={() => setIsMobileOpen(true)}
              title={getAdminPageTitle()}
              onOpenNewStudent={() => handleOpenNewStudent()}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onResetData={handleResetData}
              adminUser={adminUser}
              supabaseConfig={supabaseConfig}
              onOpenSettings={() => {
                setSettingsModalTab('general');
                setIsSettingsModalOpen(true);
              }}
              onSignOut={handleSignOut}
            />

            <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
              {renderContent()}
            </main>
          </div>
        </div>
      ) : (
        // When on Public Homepage, Departments, or Portal views
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      )}

      {/* Admin Login Modal (when invoked as modal) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md">
            <AdminLoginPage
              onLoginSuccess={(user) => {
                setAdminUser(user);
                setShowLoginModal(false);
                setCurrentTab('dashboard');
              }}
              instituteSettings={instituteSettings}
              onBackToHome={() => setShowLoginModal(false)}
            />
          </div>
        </div>
      )}

      {/* Barcode & QR Code Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        students={students}
        attendanceState={attendanceState}
        onUpdateAttendance={handleSingleAttendance}
        onViewStudentProfile={(s) => setProfileStudent(s)}
        instituteSettings={instituteSettings}
      />

      {/* Admin Profile & Password Management Modal */}
      <AdminProfileModal
        isOpen={isAdminProfileOpen}
        onClose={() => setIsAdminProfileOpen(false)}
        adminUser={adminUser}
        onUpdateAdminUser={(user) => setAdminUser(user)}
        instituteSettings={instituteSettings}
      />

      {/* Student Card Lookup Modal */}
      <StudentCardLookupModal
        isOpen={isCardLookupOpen}
        onClose={() => setIsCardLookupOpen(false)}
        students={students}
        onSelectStudentForCard={(student) => setProfileStudent(student)}
        instituteSettings={instituteSettings}
      />

      {/* Student Registration / Edit Modal with Supabase Storage */}
      <StudentRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => {
          setIsRegModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        editingStudent={editingStudent}
        defaultDepartment={defaultRegDept}
        defaultGender={defaultRegGender}
      />

      {/* Student Profile & Printable Admission Slip Modal */}
      <StudentProfileModal
        student={profileStudent}
        isOpen={!!profileStudent}
        onClose={() => setProfileStudent(null)}
        onEdit={(s) => {
          setProfileStudent(null);
          handleEditStudent(s);
        }}
        instituteSettings={instituteSettings}
      />

      {/* Student Deletion Confirmation Modal */}
      <StudentDeleteConfirmModal
        student={deletingStudent}
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Institute Settings & Supabase Connection Modal */}
      <InstituteSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={instituteSettings}
        onSaveSettings={handleSaveSettings}
        onConfigUpdated={() => setSupabaseConfig(supabaseService.getConfig())}
        initialTab={settingsModalTab}
      />

      {/* Staff Member Modal */}
      <StaffMemberModal
        isOpen={isStaffModalOpen}
        onClose={() => {
          setIsStaffModalOpen(false);
          setEditingStaff(null);
        }}
        editingStaff={editingStaff}
        onSaveStaff={handleSaveStaff}
      />

      {/* Salary Payment Modal */}
      <SalaryPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setActiveSalaryStaff(null);
          setActiveSalaryRecord(null);
        }}
        staff={activeSalaryStaff}
        salaryRecord={activeSalaryRecord}
        onSavePayment={handleRecordSalaryPayment}
        onOpenReceipt={(paidAmt, method) => {
          setIsPaymentModalOpen(false);
          setReceiptPaidAmount(paidAmt);
          setReceiptPaymentMethod(method);
          setIsSalaryReceiptOpen(true);
        }}
      />

      {/* Salary Printable Receipt / Voucher Modal */}
      <SalaryReceiptModal
        isOpen={isSalaryReceiptOpen}
        onClose={() => {
          setIsSalaryReceiptOpen(false);
          setActiveSalaryStaff(null);
          setActiveSalaryRecord(null);
          setReceiptPaidAmount(undefined);
          setReceiptPaymentMethod(undefined);
        }}
        staff={activeSalaryStaff}
        salaryRecord={activeSalaryRecord}
        instituteSettings={instituteSettings}
        paidAmountNow={receiptPaidAmount}
        paymentMethod={receiptPaymentMethod}
      />

      {/* Institute Logo Management Modal */}
      <LogoManagementModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        instituteSettings={instituteSettings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
