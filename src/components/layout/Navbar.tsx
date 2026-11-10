import React, { useState } from 'react';
import {
  Menu,
  X,
  ShieldCheck,
  User,
  GraduationCap,
  Sparkles,
  Phone,
  BookOpen,
  BookMarked,
  Users,
  UserCheck,
  Home,
  Info,
  CreditCard,
  LogIn,
  LogOut,
  ChevronDown,
  Languages
} from 'lucide-react';
import { InstituteSettings, AdminUser } from '../../types';
import { Language, translations } from '../../utils/translations';

interface NavbarProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  instituteSettings: InstituteSettings;
  adminUser: AdminUser | null;
  onOpenLogin: () => void;
  onSignOut: () => void;
  onOpenStudentCardLookup: () => void;
  lang?: Language;
  onToggleLang?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigateTab,
  instituteSettings,
  adminUser,
  onOpenLogin,
  onSignOut,
  onOpenStudentCardLookup,
  lang = 'ur',
  onToggleLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const menuItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'about', label: t.about, icon: Info },
    { id: 'hifz', label: t.hifzDept, icon: BookMarked },
    { id: 'nazra', label: t.nazraDept, icon: BookOpen },
    { id: 'baneen', label: t.baneen, icon: Users },
    { id: 'banat', label: t.banat, icon: UserCheck },
    { id: 'student_card', label: t.studentCard, icon: CreditCard },
    { id: 'contact', label: t.contact, icon: Phone },
  ];

  const handleMenuClick = (id: string) => {
    if (id === 'student_card') {
      onOpenStudentCardLookup();
    } else {
      onNavigateTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#042f24] text-white border-b border-emerald-800/80 shadow-lg" dir="rtl">
      {/* Subtle Islamic Motif Strip at very top */}
      <div className="bg-gradient-to-r from-emerald-950 via-amber-600/30 to-emerald-950 h-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Right Zone: Official Logo + Institute Brand Name (RTL) */}
          <div
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-3.5 cursor-pointer shrink-0 group"
          >
            {/* Official Jamia Salahuddin Ayyubi Logo with Gold Border */}
            <div className="relative h-13 w-16 sm:w-18 sm:h-14 rounded-xl overflow-hidden ring-2 ring-amber-400 shadow-md bg-black flex items-center justify-center p-1 group-hover:scale-105 group-hover:ring-amber-300 transition-all duration-200 shrink-0">
              <img
                src={instituteSettings.logoUrl || '/assets/aistudio/image_414e9cbc.png'}
                alt={instituteSettings.instituteName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-calligraphy text-xl sm:text-2xl font-bold text-amber-300 group-hover:text-amber-200 transition-colors leading-tight">
                  {instituteSettings.instituteName}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium">
                مرکزی دینی ادارہ و دار القرآن · 11G نیو کراچی
              </p>
            </div>
          </div>

          {/* Center Zone: 8 Nav Links (Desktop) */}
          <div className="hidden xl:flex items-center gap-1 text-xs font-semibold">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800/90 text-amber-300 shadow-xs border border-emerald-700/80'
                      : 'text-stone-200 hover:text-white hover:bg-emerald-900/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Left Zone: Language Switcher + Admin Login / Dashboard Button & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switcher Toggle */}
            {onToggleLang && (
              <button
                onClick={onToggleLang}
                title={lang === 'ur' ? 'Switch to English' : 'اردو میں تبدیل کریں'}
                className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 border border-amber-400/40 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px] font-bold">
                  {lang === 'ur' ? 'English' : 'اردو'}
                </span>
              </button>
            )}

            {adminUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="py-2 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-600/60 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">{t.adminPanel}</span>
                </button>
                <button
                  onClick={onSignOut}
                  title={t.logout}
                  className="p-2 text-rose-300 hover:text-white hover:bg-rose-900/50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 text-stone-950" />
                <span>{t.adminLogin}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl transition-colors cursor-pointer"
              aria-label="مینیو کھولیں"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#03231b] border-t border-emerald-800/80 px-4 pt-3 pb-5 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Logo Brand Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/60 border border-amber-400/80 shadow-md mb-2">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-black flex items-center justify-center shrink-0 p-0.5">
              <img
                src={instituteSettings.logoUrl || '/assets/aistudio/image_414e9cbc.png'}
                alt={instituteSettings.instituteName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="font-calligraphy text-base font-bold text-amber-300">
                {instituteSettings.instituteName}
              </h4>
              <p className="text-[11px] text-emerald-300">
                11G، نیو کراچی · مرکزی دینی ادارہ
              </p>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-amber-300/80 px-3 py-1 uppercase tracking-wider">
            صفحات و شعبہ جات
          </div>
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-amber-300 font-bold'
                    : 'text-stone-300 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile Language Switcher */}
          {onToggleLang && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onToggleLang();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-950/90 text-amber-300 border border-amber-400/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Languages className="w-4 h-4 text-amber-400" />
                <span>زبان تبدیل کریں / Change Language ({lang === 'ur' ? 'English' : 'اردو'})</span>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-emerald-800/60 mt-2">
            {adminUser ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                <span className="text-xs text-emerald-200">
                  خوش آمدید، {adminUser.fullName}
                </span>
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-300 hover:text-rose-100 font-semibold"
                >
                  لاگ آؤٹ
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>ایڈمن لاگ ان کریں</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
