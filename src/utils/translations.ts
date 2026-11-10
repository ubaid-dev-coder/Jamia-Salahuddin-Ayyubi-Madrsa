export type Language = 'ur' | 'en';

export interface Translations {
  // Brand & Common
  instituteName: string;
  subTitle: string;
  welcomeBismillah: string;
  welcomeBadge: string;
  slogan: string;
  tagline: string;
  
  // Navigation
  home: string;
  about: string;
  hifzDept: string;
  nazraDept: string;
  baneen: string;
  banat: string;
  studentCard: string;
  contact: string;
  adminLogin: string;
  adminPanel: string;
  logout: string;
  
  // Sidebar 15 Items
  sidebarTitle: string;
  dashboard: string;
  maleStudentsRecord: string;
  femaleStudentsRecord: string;
  hifzDepartment: string;
  nazraDepartment: string;
  newAdmission: string;
  attendanceManagement: string;
  feesManagement: string;
  salarySystem: string;
  staffRecords: string;
  studentCardGenerator: string;
  barcodeScanner: string;
  uploadLogo: string;
  adminProfile: string;
  
  // Metrics & Stats
  totalStudents: string;
  maleStudents: string;
  femaleStudents: string;
  hifzStudents: string;
  nazraStudents: string;
  todayAttendance: string;
  monthlyFees: string;
  staffCount: string;
  
  // Actions & Buttons
  searchPlaceholder: string;
  clear: string;
  print: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  close: string;
  actions: string;
  status: string;
  viewDetails: string;
  download: string;
  
  // Status Labels
  present: string;
  absent: string;
  leave: string;
  paid: string;
  pending: string;
  active: string;
  inactive: string;
}

export const translations: Record<Language, Translations> = {
  ur: {
    instituteName: 'جامعہ صلاح الدین ایوبی',
    subTitle: 'مرکزی دینی ادارہ و دار القرآن · 11G نیو کراچی',
    welcomeBismillah: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ',
    welcomeBadge: 'خوش آمدید',
    slogan: 'قرآن و سنت کی تعلیم، تربیت اور خدمت',
    tagline: 'حفظ القرآن الکریم، ناظرہ مع تجوید و ترتیل اور اسلامی تربیت کا ایک ممتاز تعلیمی ادارہ۔',
    
    home: 'ہوم پیج',
    about: 'تعارف جامعہ',
    hifzDept: 'شعبہ حفظ القرآن',
    nazraDept: 'شعبہ ناظرہ',
    baneen: 'طلباء (بنین)',
    banat: 'طالبات (بنات)',
    studentCard: 'اسٹوڈنٹ کارڈ',
    contact: 'رابطہ',
    adminLogin: 'ایڈمن لاگ ان',
    adminPanel: 'ایڈمن پینل',
    logout: 'لاگ آؤٹ',
    
    sidebarTitle: 'مرکزی ریکارڈ',
    dashboard: '۱. ڈیش بورڈ',
    maleStudentsRecord: '۲. طلباء کا ریکارڈ (بنین)',
    femaleStudentsRecord: '۳. طالبات کا ریکارڈ (بنات)',
    hifzDepartment: '۴. شعبہ حفظ القرآن',
    nazraDepartment: '۵. شعبہ ناظرہ',
    newAdmission: '۶. نیا داخلہ فارم',
    attendanceManagement: '۷. حاضری مینجمنٹ',
    feesManagement: 'شعبہ فیس مینجمنٹ',
    salarySystem: 'تنخواہوں کا نظام',
    staffRecords: 'ملازمین کا ریکارڈ',
    studentCardGenerator: '۸. اسٹوڈنٹ کارڈ جنریٹر',
    barcodeScanner: '۹. بارکوڈ اسکینر',
    uploadLogo: '۱۱. لوگو اور تصاویر اپلوڈ',
    adminProfile: '۱۴. ایڈمن پروفائل',
    
    totalStudents: 'کل طلباء و طالبات',
    maleStudents: 'طلباء (بنین)',
    femaleStudents: 'طالبات (بنات)',
    hifzStudents: 'شعبہ حفظ القرآن',
    nazraStudents: 'شعبہ ناظرہ قرآن',
    todayAttendance: 'آج کی حاضری',
    monthlyFees: 'ماہانہ فیس وصولی',
    staffCount: 'اساتذہ و ملازمین',
    
    searchPlaceholder: 'نام، ولدیت یا شناختی نمبر تلاش کریں...',
    clear: 'صاف کریں',
    print: 'پرنٹ',
    save: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    edit: 'ترمیم',
    delete: 'حذف',
    close: 'بند کریں',
    actions: 'کارروائی',
    status: 'حیثیت',
    viewDetails: 'تفصیلات دیکھیں',
    download: 'ڈاؤنلوڈ',
    
    present: 'حاضر',
    absent: 'غیر حاضر',
    leave: 'رخصت',
    paid: 'ادا شدہ',
    pending: 'واجب الادا',
    active: 'فعال',
    inactive: 'غیر فعال',
  },
  en: {
    instituteName: 'Jamia Salahuddin Ayyubi',
    subTitle: 'Central Islamic Institute & Dar-ul-Quran · 11G New Karachi',
    welcomeBismillah: 'In the name of Allah, Most Gracious, Most Merciful',
    welcomeBadge: 'Welcome',
    slogan: 'Education, Character Building & Service of Quran and Sunnah',
    tagline: 'Premier Islamic Seminary for Quran Memorization, Nazra Tajweed and Islamic Education.',
    
    home: 'Home',
    about: 'About Jamia',
    hifzDept: 'Hifz Department',
    nazraDept: 'Nazra Department',
    baneen: 'Male Students',
    banat: 'Female Students',
    studentCard: 'Student ID Card',
    contact: 'Contact',
    adminLogin: 'Admin Login',
    adminPanel: 'Admin Panel',
    logout: 'Sign Out',
    
    sidebarTitle: 'Main Records',
    dashboard: '1. Dashboard',
    maleStudentsRecord: '2. Male Students Record',
    femaleStudentsRecord: '3. Female Students Record',
    hifzDepartment: '4. Hifz-ul-Quran Dept',
    nazraDepartment: '5. Nazra Department',
    newAdmission: '6. New Admission Form',
    attendanceManagement: '7. Attendance Management',
    feesManagement: '8. Fees Management',
    salarySystem: '9. Staff Salary System',
    staffRecords: '10. Staff Directory',
    studentCardGenerator: '11. Student ID Card Generator',
    barcodeScanner: '12. Barcode & QR Scanner',
    uploadLogo: '13. Logo & Media Upload',
    adminProfile: '14. Admin Profile & Security',
    
    totalStudents: 'Total Students',
    maleStudents: 'Male Students',
    femaleStudents: 'Female Students',
    hifzStudents: 'Hifz Students',
    nazraStudents: 'Nazra Students',
    todayAttendance: "Today's Attendance",
    monthlyFees: 'Monthly Fee Collection',
    staffCount: 'Faculty & Staff',
    
    searchPlaceholder: 'Search by student name, father name or ID...',
    clear: 'Clear',
    print: 'Print',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    actions: 'Actions',
    status: 'Status',
    viewDetails: 'View Details',
    download: 'Download',
    
    present: 'Present',
    absent: 'Absent',
    leave: 'On Leave',
    paid: 'Paid',
    pending: 'Pending',
    active: 'Active',
    inactive: 'Inactive',
  },
};
