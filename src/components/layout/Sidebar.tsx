import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookMarked,
  BookOpen,
  UserPlus,
  CalendarCheck,
  CreditCard,
  ScanLine,
  ClipboardList,
  Upload,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  LogOut,
  Sparkles,
  X,
  ExternalLink,
  Banknote,
  Receipt,
  Briefcase
} from 'lucide-react';
import { MadrasaStats, InstituteSettings, AdminUser } from '../../types';
import { Language, translations } from '../../utils/translations';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  stats: MadrasaStats;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenNewStudent: () => void;
  onOpenBarcodeScanner: () => void;
  onOpenStudentCardLookup: () => void;
  onOpenUploadLogo: () => void;
  onOpenChangeMadinaHero: () => void;
  onOpenSettings: () => void;
  onOpenAdminProfile: () => void;
  onSignOut: () => void;
  instituteSettings: InstituteSettings;
  adminUser: AdminUser | null;
  lang?: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  stats,
  isMobileOpen,
  setIsMobileOpen,
  onOpenNewStudent,
  onOpenBarcodeScanner,
  onOpenStudentCardLookup,
  onOpenUploadLogo,
  onOpenChangeMadinaHero,
  onOpenSettings,
  onOpenAdminProfile,
  onSignOut,
  instituteSettings,
  adminUser,
  lang = 'ur',
}) => {
  const t = translations[lang];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const closeMobile = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 right-0 z-50 h-screen w-72 bg-[#042f24] text-stone-100 flex flex-col border-l border-emerald-800/50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Subtle Islamic Pattern Overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        {/* Header / Brand */}
        <div className="relative p-4 sm:p-5 border-b border-emerald-800/60 bg-gradient-to-b from-[#021d16] to-[#042f24]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-amber-400/80 shadow-md shrink-0 bg-black flex items-center justify-center p-0.5">
                <img
                  src={instituteSettings.logoUrl}
                  alt={instituteSettings.instituteName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="overflow-hidden">
                <h1 className="font-calligraphy text-lg font-bold text-amber-300 leading-tight truncate">
                  {instituteSettings.instituteName}
                </h1>
                <p className="text-[11px] text-emerald-300/90 font-medium truncate">
                  {instituteSettings.subTitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-amber-200/80 pt-2 border-t border-emerald-800/50">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              تاسیس: ۱۳۹۸ھ
            </span>
            <span className="text-emerald-300 font-mono">سیشن: {instituteSettings.academicYear}</span>
          </div>
        </div>

        {/* 15 RTL Admin Sidebar Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 relative">
          {/* GROUP 1: Academic & Students Records */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold text-amber-400/80 uppercase tracking-wider">
              {t.sidebarTitle}
            </div>

            {/* 1. ڈیش بورڈ */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>۱. ڈیش بورڈ</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 border border-emerald-800">
                {stats.totalStudents}
              </span>
            </button>

            {/* 2. طلباء کا ریکارڈ */}
            <button
              onClick={() => handleNavClick('baneen')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'baneen'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-teal-300" />
                <span>۲. طلباء کا ریکارڈ</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-900/60 text-teal-200 border border-teal-800">
                {stats.totalMale}
              </span>
            </button>

            {/* 3. طالبات کا ریکارڈ */}
            <button
              onClick={() => handleNavClick('banat')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'banat'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-rose-300" />
                <span>۳. طالبات کا ریکارڈ</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-200 border border-rose-900/80">
                {stats.totalFemale}
              </span>
            </button>

            {/* 4. شعبہ حفظ القرآن */}
            <button
              onClick={() => handleNavClick('hifz')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'hifz'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookMarked className="w-4 h-4 text-emerald-300" />
                <span>۴. شعبہ حفظ القرآن</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-800 text-emerald-200 border border-emerald-700">
                {stats.totalHifz}
              </span>
            </button>

            {/* 5. شعبہ ناظرہ */}
            <button
              onClick={() => handleNavClick('nazra')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'nazra'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>۵. شعبہ ناظرہ</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-800/80">
                {stats.totalNazra}
              </span>
            </button>
          </div>

          {/* GROUP 2: Operations, Attendance & Finance */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold text-amber-400/80 uppercase tracking-wider">
              انتظام و مالیات
            </div>

            {/* 6. نیا داخلہ */}
            <button
              onClick={() => {
                onOpenNewStudent();
                closeMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/90 hover:bg-amber-400 text-stone-950 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-stone-950" />
                <span>۶. نیا داخلہ</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-900/20 text-stone-950">
                فوری
              </span>
            </button>

            {/* 7. حاضری مینجمنٹ */}
            <button
              onClick={() => handleNavClick('attendance')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'attendance'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-emerald-300" />
                <span>۷. حاضری مینجمنٹ</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-100">
                {stats.todayAttendanceRate}%
              </span>
            </button>

            {/* 8. فیس مینجمنٹ */}
            <button
              onClick={() => handleNavClick('fees')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'fees'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>۸. فیس مینجمنٹ</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                {stats.paidFeesCount}/{stats.totalStudents}
              </span>
            </button>

            {/* 9. تنخواہوں کا نظام */}
            <button
              onClick={() => handleNavClick('salary')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'salary'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Banknote className="w-4 h-4 text-amber-400" />
                <span>۹. تنخواہوں کا نظام</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900 text-amber-300 border border-emerald-800">
                ماہانہ
              </span>
            </button>

            {/* 10. ملازمین کا ریکارڈ */}
            <button
              onClick={() => handleNavClick('salary')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-300 hover:bg-emerald-900/50 hover:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-teal-300" />
                <span>۱۰. ملازمین کا ریکارڈ</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900 text-amber-300 border border-emerald-800">
                ۲۵ عملہ
              </span>
            </button>

            {/* 11. اسٹوڈنٹ کارڈ جنریٹر */}
            <button
              onClick={() => {
                onOpenStudentCardLookup();
                closeMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-300 hover:bg-emerald-900/50 hover:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>۱۱. اسٹوڈنٹ کارڈ جنریٹر</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50">
                پرنٹ
              </span>
            </button>

            {/* 12. بارکوڈ اسکینر */}
            <button
              onClick={() => {
                onOpenBarcodeScanner();
                closeMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 bg-emerald-950/80 hover:bg-emerald-900 border border-amber-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ScanLine className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>۱۲. بارکوڈ اسکینر</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-100">
                لیزر
              </span>
            </button>
          </div>

          {/* GROUP 3: Media, Settings & Profile */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold text-amber-400/80 uppercase tracking-wider">
              لوگو، ترتیبات و پروفائل
            </div>

            {/* 13. لوگو اور تصاویر اپلوڈ */}
            <button
              onClick={() => handleNavClick('logo-settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${
                currentTab === 'logo-settings'
                  ? 'bg-emerald-700/80 text-amber-300 shadow-sm border border-emerald-500/40'
                  : 'text-stone-300 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>۱۳. لوگو اور تصاویر اپلوڈ</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-amber-300 border border-emerald-800 font-mono">
                Storage
              </span>
            </button>

            {/* 14. ویب سائٹ سیٹنگز */}
            <button
              onClick={() => {
                onOpenSettings();
                closeMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-300 hover:bg-emerald-900/50 hover:text-white transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>۱۴. ویب سائٹ سیٹنگز</span>
            </button>

            {/* 15. ایڈمن پروفائل */}
            <button
              onClick={() => {
                onOpenAdminProfile();
                closeMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 hover:bg-emerald-900/60 hover:text-amber-200 transition-all cursor-pointer border border-amber-500/20"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>۱۵. ایڈمن پروفائل</span>
            </button>
          </div>
        </nav>

        {/* Footer / Admin Card & 16. لاگ آؤٹ */}
        <div className="p-3 border-t border-emerald-800/60 bg-[#021d16] relative space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/70 border border-emerald-800/50">
            <div
              onClick={() => {
                onOpenAdminProfile();
                closeMobile();
              }}
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-800 border border-amber-400/60 flex items-center justify-center font-bold text-amber-300 text-xs shrink-0">
                {adminUser?.fullName?.charAt(0) || 'ص'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-stone-200 truncate">
                  {adminUser?.fullName || 'مولانا عبد القدوس'}
                </p>
                <p className="text-[10px] text-emerald-400 truncate">ایڈمن: @{adminUser?.username || 'admin'}</p>
              </div>
            </div>

            {/* 16. لاگ آؤٹ */}
            <button
              onClick={onSignOut}
              title="۱۶. لاگ آؤٹ کریں"
              className="flex items-center gap-1 px-2.5 py-1.5 text-rose-300 hover:text-rose-100 hover:bg-rose-950/80 rounded-lg transition-colors cursor-pointer text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>۱۶. لاگ آؤٹ</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
