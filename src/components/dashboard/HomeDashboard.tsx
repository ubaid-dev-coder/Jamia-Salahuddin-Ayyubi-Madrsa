import React from 'react';
import {
  Users,
  UserCheck,
  BookMarked,
  BookOpen,
  CalendarCheck,
  UserPlus,
  ClipboardList,
  Sparkles,
  ArrowUpLeft,
  ChevronLeft,
  GraduationCap,
  Award,
  Bell,
  Clock,
  Printer,
  Receipt
} from 'lucide-react';
import { MadrasaStats, Student, ActivityLog, InstituteSettings } from '../../types';

interface HomeDashboardProps {
  stats: MadrasaStats;
  recentStudents: Student[];
  activities: ActivityLog[];
  onNavigateTab: (tab: string) => void;
  onOpenNewStudent: () => void;
  onViewStudent: (student: Student) => void;
  instituteSettings: InstituteSettings;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  stats,
  recentStudents,
  activities,
  onNavigateTab,
  onOpenNewStudent,
  onViewStudent,
  instituteSettings,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#022c22] via-[#044333] to-[#064e3b] text-white p-6 lg:p-8 shadow-xl border border-emerald-800">
        <div className="absolute top-0 left-0 w-full h-full bg-islamic-pattern opacity-10 pointer-events-none" />

        {/* Decorative ambient campus photo teaser on the left */}
        <div className="absolute -left-12 -top-12 w-80 h-80 rounded-full overflow-hidden opacity-20 pointer-events-none border-4 border-amber-400/40 hidden xl:block">
          <img
            src={instituteSettings.campusPhotoUrl}
            alt="جامعہ کیمپس"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</span>
              <span className="text-emerald-300/80">·</span>
              <span className="font-calligraphy">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</span>
            </div>

            <h1 className="font-calligraphy text-2xl lg:text-4xl font-bold tracking-tight text-white">
              {instituteSettings.instituteName} — مرکزی ڈیش بورڈ
            </h1>

            <p className="text-emerald-100/90 text-xs lg:text-sm leading-relaxed">
              خوش آمدید! نظامِ انتظامِ مدرسہ کے ذریعے طلباء کے داخلے، شعبہ جات، حفظ و ناظرہ کی تعلیمی پیش رفت اور یومیہ حاضری کو باآسانی منظم کریں۔
            </p>
          </div>

          {/* Quick Action Group on Hero */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewStudent}
              className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>نیا طالب علم داخلہ</span>
            </button>

            <button
              onClick={() => onNavigateTab('attendance')}
              className="py-2.5 px-4 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/80 font-medium text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-300" />
              <span>آج کی حاضری لگائیں</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Key Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {/* Total Students */}
        <div
          onClick={() => onNavigateTab('students_list')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-700/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">کل طلبہ و طالبات</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {stats.totalStudents}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
            <span>تمام شعبہ جات</span>
            <ArrowUpLeft className="w-3 h-3" />
          </div>
        </div>

        {/* Male Students */}
        <div
          onClick={() => onNavigateTab('baneen')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-teal-700/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">طلباء (بنین)</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-teal-950 tabular-nums">
            {stats.totalMale}
          </div>
          <div className="text-[11px] text-teal-700 flex items-center gap-1 mt-1 font-medium">
            <span>سیکشن طلباء</span>
            <ArrowUpLeft className="w-3 h-3" />
          </div>
        </div>

        {/* Female Students */}
        <div
          onClick={() => onNavigateTab('banat')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-rose-700/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">طالبات (بنات)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-950 tabular-nums">
            {stats.totalFemale}
          </div>
          <div className="text-[11px] text-rose-700 flex items-center gap-1 mt-1 font-medium">
            <span>سیکشن طالبات</span>
            <ArrowUpLeft className="w-3 h-3" />
          </div>
        </div>

        {/* Hifz Students */}
        <div
          onClick={() => onNavigateTab('hifz')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-700/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">شعبہ حفظ القرآن</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-950 tabular-nums">
            {stats.totalHifz}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
            <span>تحفیظ القرآن</span>
            <ArrowUpLeft className="w-3 h-3" />
          </div>
        </div>

        {/* Nazra Students */}
        <div
          onClick={() => onNavigateTab('nazra')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-amber-700/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">شعبہ ناظرہ قرآن</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-950 tabular-nums">
            {stats.totalNazra}
          </div>
          <div className="text-[11px] text-amber-700 flex items-center gap-1 mt-1 font-medium">
            <span>ناظرہ و تجوید</span>
            <ArrowUpLeft className="w-3 h-3" />
          </div>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-700/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">آج کی حاضری</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
            {stats.todayAttendanceRate}%
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-1 font-medium">
            <span className="text-emerald-700">{stats.presentCount} حاضر</span>
            <span>·</span>
            <span className="text-red-600">{stats.absentCount} غ/ح</span>
          </div>
        </div>

        {/* Monthly Fees */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-amber-700/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">ماہانہ فیس وصولی</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-800 tabular-nums text-sm sm:text-xl">
            {stats.totalMonthlyFees ? `Rs. ${stats.totalMonthlyFees.toLocaleString()}` : 'Rs. 0'}
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1 font-medium">
            <span className="text-emerald-700 font-semibold">{stats.paidFeesCount} ادا شدہ</span>
            <span>·</span>
            <span className="text-amber-700 font-semibold">{stats.pendingFeesCount} بقایا</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 bg-emerald-700 rounded-xs inline-block" />
            <h3 className="text-sm font-bold text-stone-900">
              فوری اقدامات (Quick Actions)
            </h3>
          </div>
          <span className="text-xs text-stone-400">شارٹ کٹس</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenNewStudent}
            className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-right transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <p className="font-bold text-stone-900 text-xs sm:text-sm">نیا داخلہ فارم</p>
            <p className="text-[11px] text-stone-500 mt-0.5">طالب علم کا ریکارڈ درج کریں</p>
          </button>

          <button
            onClick={() => onNavigateTab('attendance')}
            className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-right transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <p className="font-bold text-stone-900 text-xs sm:text-sm">یومیہ حاضری ریکارڈ</p>
            <p className="text-[11px] text-stone-500 mt-0.5">آج کی حاضری درج کریں</p>
          </button>

          <button
            onClick={() => onNavigateTab('hifz')}
            className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-right transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <BookMarked className="w-4 h-4" />
            </div>
            <p className="font-bold text-stone-900 text-xs sm:text-sm">شعبہ حفظ القرآن</p>
            <p className="text-[11px] text-stone-500 mt-0.5">حفاظ کرام اور پارے کی منزل</p>
          </button>

          <button
            onClick={() => onNavigateTab('students_list')}
            className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-right transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
            <p className="font-bold text-stone-900 text-xs sm:text-sm">تمام طلبہ ڈائرکٹری</p>
            <p className="text-[11px] text-stone-500 mt-0.5">مکمل فہرست اور کارڈ پرنٹنگ</p>
          </button>
        </div>
      </div>

      {/* Main Split: Recent Registrations & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Student Registrations Table (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-700 rounded-xs inline-block" />
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                حالیہ داخلے (Recent Registrations)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('students_list')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>تمام دیکھیں</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-stone-50/70 border-b border-stone-200 text-stone-600 text-xs">
                  <th className="py-2.5 px-4 font-semibold">داخلہ نمبر</th>
                  <th className="py-2.5 px-4 font-semibold">طالب علم کا نام</th>
                  <th className="py-2.5 px-4 font-semibold">شعبہ</th>
                  <th className="py-2.5 px-4 font-semibold">نگران قاری</th>
                  <th className="py-2.5 px-4 font-semibold text-center">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {recentStudents.slice(0, 5).map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-stone-50/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-emerald-800">
                        {student.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-950 text-amber-300 font-bold flex items-center justify-center font-calligraphy text-xs shrink-0">
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{student.fullName}</p>
                            <p className="text-[10px] text-stone-500">
                              ولد: {student.fatherName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            student.department === 'hifz'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {student.department === 'hifz' ? 'حفظ القرآن' : 'ناظرہ قرآن'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                        {student.teacherName}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onViewStudent(student)}
                          className="py-1 px-2.5 bg-stone-100 hover:bg-emerald-800 hover:text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          کوائف کارڈ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities Feed (1 Column) */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-amber-600 rounded-xs inline-block" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  حالیہ سرگرمیاں (Recent Activities)
                </h3>
              </div>
              <Bell className="w-4 h-4 text-amber-600" />
            </div>

            <div className="space-y-4">
              {activities.slice(0, 5).map((act) => {
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                      {act.type === 'admission' ? (
                        <UserPlus className="w-3.5 h-3.5" />
                      ) : act.type === 'completion' ? (
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-xs text-stone-900">
                          {act.title}
                        </p>
                        <span className="text-[10px] text-stone-400 font-mono shrink-0">
                          {act.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quran Study Hall Photo Callout */}
          <div className="mt-5 pt-4 border-t border-stone-100">
            <div className="relative rounded-xl overflow-hidden border border-emerald-900/30 group">
              <img
                src="/src/assets/images/quran_study_hall_1794118767793.jpg"
                alt="درسگاہ قرآن"
                className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3 text-white">
                <p className="font-bold text-xs font-calligraphy text-amber-300">
                  درسگاہ شعبہ تحفیظ القرآن
                </p>
                <p className="text-[10px] text-emerald-100">
                  روزانہ صبح و شام کی باقاعدہ کلاسز
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
