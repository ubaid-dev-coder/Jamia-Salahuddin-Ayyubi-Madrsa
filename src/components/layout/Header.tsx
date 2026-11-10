import React from 'react';
import {
  Menu,
  Search,
  Printer,
  Calendar,
  Sparkles,
  RefreshCw,
  Plus,
  Database,
  Settings,
  LogOut,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { AdminUser, SupabaseConfig } from '../../types';
import { Language, translations } from '../../utils/translations';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  title: string;
  onOpenNewStudent: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onResetData: () => void;
  adminUser: AdminUser | null;
  supabaseConfig: SupabaseConfig;
  onOpenSettings: () => void;
  onSignOut: () => void;
  lang?: Language;
  onToggleLang?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  title,
  onOpenNewStudent,
  searchTerm,
  setSearchTerm,
  onResetData,
  adminUser,
  supabaseConfig,
  onOpenSettings,
  onSignOut,
  lang = 'ur',
  onToggleLang,
}) => {
  const t = translations[lang];
  const gregorianDate = lang === 'ur' ? '۸ نومبر ۲۰۲۶ء (اتوار)' : 'Sunday, Nov 8, 2026';
  const hijriDate = lang === 'ur' ? '۲۸ شوال ۱۴۴۷ھ' : '28 Shawwal 1447 AH';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 lg:px-8 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Right side: Mobile Menu + Current View Title & Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg cursor-pointer"
            aria-label="مینیو کھولیں"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg lg:text-xl font-bold text-stone-900 flex items-center gap-1.5">
                <span className="w-2 h-5 bg-emerald-700 rounded-xs inline-block" />
                {title}
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{hijriDate}</span>
              <span>·</span>
              <span>{gregorianDate}</span>
            </div>
          </div>
        </div>

        {/* Center / Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="طالب علم کا نام، والد کا نام یا شناختی نمبر تلاش کریں..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-sm bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all text-stone-900 placeholder:text-stone-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                صاف کریں
              </button>
            )}
          </div>
        </div>

        {/* Left side actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Supabase Status Indicator */}
          <button
            onClick={onOpenSettings}
            title="سپابیس ڈیٹا بیس اسٹیٹس"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-700 text-xs font-mono text-stone-700 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span>{supabaseConfig.isConfigured ? 'Supabase Connected' : 'Supabase Ready'}</span>
          </button>

          {/* Language Switcher */}
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              title={lang === 'ur' ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-700 text-xs font-semibold text-stone-700 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-800" />
              <span className="font-mono text-[11px]">
                {lang === 'ur' ? 'English' : 'اردو'}
              </span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="جامعہ کی ترتیبات و سپابیس"
            className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Quick Print Button */}
          <button
            onClick={() => window.print()}
            title="صفحہ پرنٹ کریں"
            className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors hidden xl:flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>پرنٹ</span>
          </button>

          {/* Primary CTA: New Student */}
          <button
            onClick={onOpenNewStudent}
            className="py-2 px-3.5 lg:px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs lg:text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>نیا داخلہ</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            title="ایڈمن لاگ آؤٹ"
            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-stone-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="mt-2.5 md:hidden">
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="طالب علم، والد کا نام یا داخلہ نمبر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-3 py-1.5 text-xs bg-stone-100 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900"
          />
        </div>
      </div>
    </header>
  );
};
