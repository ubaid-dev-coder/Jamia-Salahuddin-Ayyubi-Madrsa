import React from 'react';
import {
  Sparkles,
  BookMarked,
  BookOpen,
  Users,
  UserCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronLeft,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Library,
  School,
  CalendarCheck,
  Send,
  UserPlus
} from 'lucide-react';
import { InstituteSettings, MadrasaStats, Student } from '../../types';

interface LandingHomePageProps {
  instituteSettings: InstituteSettings;
  stats: MadrasaStats;
  onNavigateTab: (tab: string) => void;
  onOpenNewStudent: () => void;
  onViewStudentCardLookup: () => void;
}

export const LandingHomePage: React.FC<LandingHomePageProps> = ({
  instituteSettings,
  stats,
  onNavigateTab,
  onOpenNewStudent,
  onViewStudentCardLookup,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('آپ کا پیغام جامعہ کی انتظامیہ کو موصول ہو چکا ہے۔ جلد رابطہ کیا جائے گا۔ شکریہ!');
  };

  return (
    <div className="space-y-16 pb-12" dir="rtl">
      {/* ============================================================== */}
      {/* 1. MADINA MUNAWWARA HERO SECTION */}
      {/* ============================================================== */}
      <section className="relative min-h-[580px] lg:min-h-[640px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/60 flex items-center justify-center text-center text-white">
        {/* Authentic Madina Munawwara Photograph Background */}
        <img
          src={instituteSettings.madinaHeroPhotoUrl}
          alt="مدینہ منورہ — مسجد نبوی الشریف و گنبدِ خضراء"
          className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Elegant Emerald & Dark Gradient Scrim for readable Urdu typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#021d16] via-[#043327]/85 to-[#021d16]/75" />

        {/* Islamic Subtle Motif Background Overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-6">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-amber-400/60 shadow-lg backdrop-blur-md text-amber-300 text-xs sm:text-sm font-semibold animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</span>
            <span>·</span>
            <span className="font-calligraphy">خوش آمدید</span>
          </div>

          {/* Main Title */}
          <h1 className="font-calligraphy text-4xl sm:text-6xl lg:text-7xl font-extrabold text-amber-300 drop-shadow-md tracking-tight leading-tight">
            {instituteSettings.instituteName}
          </h1>

          {/* Slogan */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-calligraphy text-white font-medium drop-shadow-sm max-w-2xl mx-auto leading-relaxed">
            قرآن و سنت کی تعلیم، تربیت اور خدمت
          </p>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            حفظ القرآن الکریم، ناظرہ مع تجوید و ترتیل اور اسلامی تربیت کا ایک ممتاز، پرسکون اور باوقار تعلیمی ادارہ برائے طلباء و طالبات۔
          </p>

          {/* Two Prominent Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('about-section')}
              className="py-3 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm sm:text-base shadow-xl hover:shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>جامعہ کا تعارف</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab('students_list')}
              className="py-3 px-6 sm:px-8 rounded-2xl bg-emerald-900/90 hover:bg-emerald-800 text-white border border-emerald-500/60 font-semibold text-sm sm:text-base shadow-lg backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>طلباء کا ریکارڈ</span>
            </button>
          </div>

          {/* Trust Marker */}
          <div className="pt-6 text-[11px] sm:text-xs text-emerald-300/90 flex items-center justify-center gap-3">
            <span>تاسیس: ۱۳۹۸ھ / ۱۹۷۸ء</span>
            <span>·</span>
            <span>منظور شدہ وفاق المدارس العربیہ پاکستان</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. STATS OVERVIEW SECTION */}
      {/* ============================================================== */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center group hover:border-emerald-700/50 transition-colors">
          <span className="text-xs text-stone-500 block mb-1">کل طلباء و طالبات</span>
          <span className="text-3xl font-bold font-mono text-emerald-900 tabular-nums">
            {stats.totalStudents}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">رجسٹرڈ طلبہ</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center group hover:border-teal-700/50 transition-colors">
          <span className="text-xs text-stone-500 block mb-1">طلباء (بنین)</span>
          <span className="text-3xl font-bold font-mono text-teal-800 tabular-nums">
            {stats.totalMale}
          </span>
          <span className="text-[11px] text-teal-700 block mt-1">لڑکوں کا کیمپس</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center group hover:border-rose-700/50 transition-colors">
          <span className="text-xs text-stone-500 block mb-1">طالبات (بنات)</span>
          <span className="text-3xl font-bold font-mono text-rose-800 tabular-nums">
            {stats.totalFemale}
          </span>
          <span className="text-[11px] text-rose-700 block mt-1">لڑکیوں کا کیمپس</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center group hover:border-emerald-700/50 transition-colors">
          <span className="text-xs text-stone-500 block mb-1">شعبہ حفظ القرآن</span>
          <span className="text-3xl font-bold font-mono text-emerald-800 tabular-nums">
            {stats.totalHifz}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">حفاظ کرام</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center group hover:border-amber-700/50 transition-colors">
          <span className="text-xs text-stone-500 block mb-1">شعبہ ناظرہ قرآن</span>
          <span className="text-3xl font-bold font-mono text-amber-800 tabular-nums">
            {stats.totalNazra}
          </span>
          <span className="text-[11px] text-amber-700 block mt-1">ناظرہ و تجوید</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center group hover:border-emerald-700/50 transition-colors">
          <span className="text-xs text-stone-500 block mb-1">آج کی حاضری</span>
          <span className="text-3xl font-bold font-mono text-emerald-700 tabular-nums">
            {stats.todayAttendanceRate}%
          </span>
          <span className="text-[11px] text-emerald-600 block mt-1">
            {stats.presentCount} حاضر طلبہ
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ABOUT JAMIA SECTION */}
      {/* ============================================================== */}
      <section id="about-section" className="scroll-mt-24 bg-white rounded-3xl border border-stone-200 shadow-xs p-6 lg:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Description (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>تعارف، سرپرستی و شعبہ جات</span>
            </div>

            <h2 className="font-calligraphy text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
              جامعہ صلاح الدین ایوبی کا تعارف و خدمات
            </h2>

            <p className="text-stone-600 text-sm leading-relaxed">
              جامعہ صلاح الدین ایوبی ایک مرکزی دینی و تعلیمی ادارہ ہے جو زیرِ سرپرستی <strong>حضرت مولانا مفتی مجیب الرحمٰن صاحب (خطیبِ اسلام)</strong> قرآن مجید، سنتِ نبوی ﷺ اور عصری علوم کی ترویج و اشاعت کے لیے شب و روز خدمات انجام دے رہا ہے۔
            </p>

            <p className="text-stone-600 text-sm leading-relaxed">
              ادارہ طلباء و طالبات کے لیے درسِ نظامی، شعبہ حفظ القرآن، شعبہ ناظرہ، اسکول نظام اور کوچنگ سینٹر کی معیاری اور پرسکون سہولیات فراہم کرتا ہے۔
            </p>

            {/* Core Offerings from Official Board */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-center">
                <span className="font-bold text-xs text-emerald-900 block font-calligraphy">درسِ نظامی (بنات)</span>
                <span className="text-[10px] text-emerald-700">عالمہ کورس</span>
              </div>
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-center">
                <span className="font-bold text-xs text-emerald-900 block font-calligraphy">دار الحفظ و تجوید</span>
                <span className="text-[10px] text-emerald-700">حفظ القرآن الکریم</span>
              </div>
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-center">
                <span className="font-bold text-xs text-emerald-900 block font-calligraphy">اسکول نظام و تعلیم</span>
                <span className="text-[10px] text-emerald-700">بنیادی عصری تعلیم</span>
              </div>
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-center">
                <span className="font-bold text-xs text-amber-900 block font-calligraphy">ناظرہ قرآن کریم</span>
                <span className="text-[10px] text-amber-700">مع نورانی قاعدہ</span>
              </div>
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-center">
                <span className="font-bold text-xs text-amber-900 block font-calligraphy">کوچنگ سینٹر</span>
                <span className="text-[10px] text-amber-700">طلبہ رہنمائی</span>
              </div>
              <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-center">
                <span className="font-bold text-xs text-blue-900 block font-calligraphy">11G، نیو کراچی</span>
                <span className="text-[10px] text-blue-700">مرکزی کیمپس</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-100">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="font-bold text-xs sm:text-sm text-emerald-900 block">خطیبِ اسلام و نگران</span>
                <span className="text-xs text-stone-600 font-semibold">مفتی مجیب الرحمٰن صاحب</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="font-bold text-xs sm:text-sm text-emerald-900 block">شعارِ ادارہ</span>
                <span className="text-xs text-amber-700 font-semibold font-calligraphy">تاجدارِ ختمِ نبوت ﷺ</span>
              </div>
            </div>
          </div>

          {/* User's Official Board Image (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border-4 border-amber-400/80 shadow-2xl bg-slate-900 group">
              <img
                src="/assets/aistudio/image_0b17baf2.png"
                alt="جامعہ صلاح الدین ایوبی — مفتی مجیب الرحمٰن مرکزی دینی ادارہ"
                className="w-full h-auto max-h-[380px] object-contain sm:object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-calligraphy text-base sm:text-lg font-bold text-amber-300">
                      مرکزی دینی ادارہ — مفتی مجیب الرحمٰن
                    </h4>
                    <p className="text-[11px] text-emerald-200">
                      11G، نیو کراچی — درسِ نظامی، دار الحفظ، اسکول نظام
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-bold shrink-0">
                    سرکاری بورڈ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. DEPARTMENTS HIGHLIGHT (HIFZ & NAZRA) */}
      {/* ============================================================== */}
      <section id="departments-section" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>تعلیمی شعبہ جات</span>
          </div>
          <h2 className="font-calligraphy text-3xl font-bold text-stone-900">
            شعبہ حفظ و ناظرہ قرآن کریم
          </h2>
          <p className="text-xs text-stone-500">
            ہر شعبہ کا الگ نصاب، باقاعدہ روزانہ حاضری، سبق و منزل کا ریکارڈ اور سند کا اجراء
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Hifz Dept */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 lg:p-8 flex flex-col justify-between hover:shadow-md transition-shadow border-t-4 border-t-emerald-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <BookMarked className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {stats.totalHifz} طلبہ زیرِ حفظ
                </span>
              </div>

              <h3 className="font-calligraphy text-2xl font-bold text-stone-900">
                شعبہ حفظ القرآن الکریم
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                مکمل ۳۰ پارے مع تجوید، ترتیل، مخارج اور وقف کی مکمل پاسداری کے ساتھ حفظ کرائے جاتے ہیں۔ روزانہ سبق، سبقی اور منزل کا کڑا نظام قائم ہے۔
              </p>

              <ul className="text-xs text-stone-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  <span>انفرادی توجہ برائے ہر طالب علم</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  <span>ماہانہ تجوید ٹیسٹ اور سالانہ امتحان</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  <span>تکمیل پر خصوصی دستار بندی و اعزازی سند</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('hifz')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>شعبہ حفظ کا مکمل ریکارڈ دیکھیں</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenNewStudent}
                className="py-1.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer"
              >
                داخلہ لیں
              </button>
            </div>
          </div>

          {/* Card 2: Nazra Dept */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 lg:p-8 flex flex-col justify-between hover:shadow-md transition-shadow border-t-4 border-t-amber-600">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg">
                  {stats.totalNazra} طلبہ زیرِ ناظرہ
                </span>
              </div>

              <h3 className="font-calligraphy text-2xl font-bold text-stone-900">
                شعبہ ناظرہ قرآن و تجوید
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                نورانی قاعدہ سے لے کر مکمل ناظرہ قرآن کریم تک صحیح تلفظ، عربی لب و لہجے اور بنیادی مسنون دعاؤں کی مشق کرائی جاتی ہے۔
              </p>

              <ul className="text-xs text-stone-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>نورانی قاعدہ کے حروفِ تہجی و مخارج کی پختگی</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>نماز، کلمے اور بنیادی اسلامی فرائض کی تعلیم</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>ناظرہ کے بعد شعبہ حفظ میں داخلے کی خصوصی تیاری</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('nazra')}
                className="text-xs font-bold text-amber-800 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>شعبہ ناظرہ کا مکمل ریکارڈ دیکھیں</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenNewStudent}
                className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium cursor-pointer"
              >
                داخلہ لیں
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. JAMIA KEY FEATURES (جامعہ کی خصوصیات) */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 5. JAMIA KEY FEATURES (جامعہ کی نمایاں خصوصیات و شعبہ جات) */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-b from-stone-50 to-emerald-50/30 rounded-3xl p-6 lg:p-10 border border-emerald-900/10 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>جامعہ کی نمایاں خصوصیات و خدمات</span>
          </div>
          <h2 className="font-calligraphy text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            جامعہ صلاح الدین ایوبی کی اہم خصوصیات
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            قرآن مجید کی درست تعلیم، باوقار اسلامی ماحول اور طلبہ کی بہترین فکری و اخلاقی نشوونما
          </p>
        </div>

        {/* Six Professional Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: شعبہ حفظ القرآن */}
          <div className="group bg-white rounded-3xl border-2 border-stone-200/90 hover:border-emerald-700/60 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-700 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center justify-center shadow-xs group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                  <BookMarked className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-calligraphy">
                  دار الحفظ
                </span>
              </div>

              <div>
                <h3 className="font-calligraphy text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2">
                  ۱. شعبہ حفظ القرآن
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  مکمل ۳۰ پارے مع تجوید، ترتیل اور مخارج کی درستگی۔ روزانہ سبق، سبقی اور منزل کا کڑا نظام قائم ہے تاکہ کلامِ الٰہی طالب علم کے سینے میں محفوظ ہو سکے۔
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('hifz')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>شعبہ کی تفصیلات</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-stone-400">۳۰ پارے مکمل</span>
            </div>
          </div>

          {/* Card 2: شعبہ ناظرہ و تجوید */}
          <div className="group bg-white rounded-3xl border-2 border-stone-200/90 hover:border-amber-500/70 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-600 to-amber-400 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shadow-xs group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-calligraphy">
                  تجوید و ترتیل
                </span>
              </div>

              <div>
                <h3 className="font-calligraphy text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors mb-2">
                  ۲. شعبہ ناظرہ و تجوید
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  نورانی قاعدہ سے لے کر مکمل ناظرہ قرآن کریم تک صحیح تلفظ، عربی لب و لہجے اور بنیادی مسنون دعاؤں، نماز اور کلموں کی مشق کے ساتھ پختہ بنیاد۔
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('nazra')}
                className="text-xs font-bold text-amber-800 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>شعبہ کی تفصیلات</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-stone-400">قاعدہ تا ناظرہ</span>
            </div>
          </div>

          {/* Card 3: تجربہ کار اساتذہ */}
          <div className="group bg-white rounded-3xl border-2 border-stone-200/90 hover:border-emerald-700/60 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-700 to-teal-600 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center justify-center shadow-xs group-hover:bg-teal-800 group-hover:text-amber-300 transition-colors">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-200 font-calligraphy">
                  مستند اساتذہ
                </span>
              </div>

              <div>
                <h3 className="font-calligraphy text-xl font-bold text-stone-900 group-hover:text-teal-900 transition-colors mb-2">
                  ۳. تجربہ کار اساتذہ
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  وفاق المدارس سے سند یافتہ، شفیق، باصلاحیت اور حسنِ قرأت کے ماہر شیوخ و اساتذہ کرام جو ہر طالب علم کی انفرادی صلاحیتوں کے مطابق شفقت سے تعلیم دیتے ہیں۔
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => scrollToSection('about-section')}
                className="text-xs font-bold text-teal-800 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>اساتذہ و سرپرستی</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-stone-400">انفرادی توجہ</span>
            </div>
          </div>

          {/* Card 4: طلباء و طالبات کی علیحدہ تعلیم */}
          <div className="group bg-white rounded-3xl border-2 border-stone-200/90 hover:border-rose-600/60 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-600 via-amber-400 to-rose-700 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200/60 flex items-center justify-center shadow-xs group-hover:bg-rose-800 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-200 font-calligraphy">
                  بنین و بنات
                </span>
              </div>

              <div>
                <h3 className="font-calligraphy text-xl font-bold text-stone-900 group-hover:text-rose-900 transition-colors mb-2">
                  ۴. طلباء و طالبات کی علیحدہ تعلیم
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  لڑکوں (بنین) اور لڑکیوں (بنات) کے لیے الگ الگ پردہ دار اور باحجاب تعلیمی شعبہ جات۔ طالبات کے لیے مستند و دیندار معلمات کے زیرِ سایہ محفوظ اور پاکیزہ ماحول۔
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigateTab('baneen')}
                  className="text-xs font-bold text-teal-800 hover:underline cursor-pointer"
                >
                  طلباء سیکشن
                </button>
                <span className="text-stone-300">|</span>
                <button
                  onClick={() => onNavigateTab('banat')}
                  className="text-xs font-bold text-rose-800 hover:underline cursor-pointer"
                >
                  طالبات سیکشن
                </button>
              </div>
              <span className="text-[10px] text-stone-400">مکمل پردہ</span>
            </div>
          </div>

          {/* Card 5: داخلہ اور رہنمائی */}
          <div className="group bg-white rounded-3xl border-2 border-stone-200/90 hover:border-emerald-700/60 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-800 to-amber-500 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center justify-center shadow-xs group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                  <UserPlus className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-calligraphy">
                  داخلہ جاری ہے
                </span>
              </div>

              <div>
                <h3 className="font-calligraphy text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2">
                  ۵. داخلہ اور رہنمائی
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  نئے طلباء و سرپرستوں کے لیے آسان اور شفاف داخلہ عمل، ڈیجیٹل اسٹوڈنٹ کارڈ، شناختی بارکوڈ اور تعلیمی کارکردگی سے متعلق والدین کے ساتھ بروقت اور باقاعدہ رابطہ۔
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={onOpenNewStudent}
                className="py-1 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>داخلہ فارم پُر کریں</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onViewStudentCardLookup}
                className="text-xs text-stone-500 hover:text-emerald-800 cursor-pointer"
              >
                کارڈ سرچ
              </button>
            </div>
          </div>

          {/* Card 6: اخلاقی و اسلامی تربیت */}
          <div className="group bg-white rounded-3xl border-2 border-stone-200/90 hover:border-amber-500/70 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-700 to-amber-500 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shadow-xs group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-calligraphy">
                  تزکیہ و کردار
                </span>
              </div>

              <div>
                <h3 className="font-calligraphy text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors mb-2">
                  ۶. اخلاقی و اسلامی تربیت
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  نماز باجماعت کی پابندی، مسنون دعائیں، سنتِ نبوی ﷺ کے مطابق آدابِ زندگی، احترامِ والدین و اساتذہ اور سچے و باکردار مسلمان بننے کی عملی اور مسلسل تربیت۔
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>سنت کے مطابق تربیت</span>
              </span>
              <span className="text-[10px] text-stone-400">دینی و اخلاقی نشوونما</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. CONTACT SECTION (رابطہ) */}
      {/* ============================================================== */}
      <section id="contact-section" className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>رابطہ و معلومات</span>
            </div>

            <h2 className="font-calligraphy text-3xl font-bold text-stone-900">
              جامعہ سے رابطہ فرمائیں
            </h2>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              داخلہ فارم، فیس کی معلومات یا جامعہ کے دورے کے لیے دفترِ اہتمام سے دفتری اوقات میں رابطہ فرمائیں۔
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <MapPin className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">پتہ:</span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800">
                    {instituteSettings.address}، {instituteSettings.city}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <Phone className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">لینڈ لائن و رابطہ:</span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 font-mono" dir="ltr">
                    {instituteSettings.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <Mail className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">سرکاری ای میل:</span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 font-mono" dir="ltr">
                    {instituteSettings.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <Clock className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">دفتری اوقات:</span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800">
                    صبح ۰۸:۰۰ تا بعد نمازِ ظہر ۰۲:۰۰ (اتوار چھٹی)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Message Form */}
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-base mb-1">فوری آن لائن پیغام / استفسار</h4>
            <p className="text-xs text-stone-500 mb-4">داخلہ سے متعلق اپنا سوال ارسال کریں</p>

            <form onSubmit={handleInquirySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  آپ کا نام
                </label>
                <input
                  type="text"
                  required
                  placeholder="مکمل نام درج کریں"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  موبائل / واٹس ایپ نمبر
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  شعبہ جس میں دلچسپی ہے
                </label>
                <select className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30">
                  <option>شعبہ حفظ القرآن الکریم (بنین)</option>
                  <option>شعبہ حفظ القرآن الکریم (بنات)</option>
                  <option>شعبہ ناظرہ قرآن و تجوید</option>
                  <option>عمومی معلومات</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  پیغام کی تفصیل
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اپنا استفسار یا سوال تحریر کریں..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>پیغام ارسال کریں</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. FOOTER */}
      {/* ============================================================== */}
      <footer className="bg-[#021d16] text-white rounded-3xl p-8 border border-emerald-900/60 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-emerald-800/60">
          <div className="flex items-center gap-4 text-center md:text-right">
            <div className="w-16 h-14 rounded-xl overflow-hidden ring-2 ring-amber-400 shrink-0 bg-black flex items-center justify-center p-1">
              <img
                src={instituteSettings.logoUrl}
                alt={instituteSettings.instituteName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-calligraphy text-2xl font-bold text-amber-300">
                {instituteSettings.instituteName}
              </h3>
              <p className="text-xs text-emerald-300">{instituteSettings.subTitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-200">
            <button
              onClick={() => onNavigateTab('home')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              ہوم پیج
            </button>
            <span>·</span>
            <button
              onClick={() => scrollToSection('about-section')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              تعارف
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigateTab('hifz')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              شعبہ حفظ
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigateTab('nazra')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              شعبہ ناظرہ
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigateTab('baneen')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              طلباء
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigateTab('banat')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              طالبات
            </button>
            <span>·</span>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              رابطہ
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-300/80 gap-2">
          <span>
            جملہ حقوق بحق {instituteSettings.instituteName} محفوظ ہیں © ۱۴۴۷ھ / ۲۰۲۶ء
          </span>
          <span className="font-mono">
            نظامِ انتظامِ مدرسہ و دار القرآن
          </span>
        </div>
      </footer>
    </div>
  );
};
