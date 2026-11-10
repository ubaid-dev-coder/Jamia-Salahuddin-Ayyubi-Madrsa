import React from 'react';
import { Award, Printer, BookOpen, Users, CheckCircle, Sparkles, FileText } from 'lucide-react';
import { Student, MadrasaStats } from '../../types';

interface ReportsViewProps {
  stats: MadrasaStats;
  students: Student[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ stats, students }) => {
  const hifzGraduates = students.filter(
    (s) => s.department === 'hifz' && (s.status === 'graduated' || s.currentParaOrLevel.includes('مکمل'))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-700 rounded-xs inline-block" />
            <h2 className="text-xl font-bold text-stone-900">
              جامعہ صلاح الدین ایوبی — سالانہ تعلیمی رپورٹ و اسناد
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            سیشن ۱۴۴۷-۱۴۴۸ھ کے تعلیمی نتائج، حفاظ کرام کی فہرست اور مجموعی تجزیہ
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="py-2.5 px-5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>مکمل رپورٹ پرنٹ کریں</span>
        </button>
      </div>

      {/* Official Certificate / Report Document */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        {/* Top Header */}
        <div className="text-center pb-6 border-b-2 border-emerald-900/80 space-y-2">
          <div className="w-24 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md bg-black flex items-center justify-center p-1.5">
            <img
              src="/assets/aistudio/image_414e9cbc.png"
              alt="جامعہ لوگو"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-calligraphy text-3xl font-bold text-emerald-950">
            جامعہ صلاح الدین ایوبی
          </h1>
          <p className="text-xs text-stone-600 font-medium">
            رجسٹرڈ و منظور شدہ وفاق المدارس العربیہ پاکستان
          </p>
          <p className="text-xs font-calligraphy text-amber-800">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ — رپورٹ برائے تعلیمی کارکردگی
          </p>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs text-stone-500 block">کل رجسٹرڈ طلبہ</span>
            <span className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
              {stats.totalStudents}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs text-stone-500 block">شعبہ حفظ کے طلبہ</span>
            <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
              {stats.totalHifz}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs text-stone-500 block">شعبہ ناظرہ کے طلبہ</span>
            <span className="text-2xl font-bold font-mono text-amber-800 tabular-nums">
              {stats.totalNazra}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs text-stone-500 block">اوسط یومیہ حاضری</span>
            <span className="text-2xl font-bold font-mono text-teal-800 tabular-nums">
              {stats.todayAttendanceRate}%
            </span>
          </div>
        </div>

        {/* Section: Hifz Graduates */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-stone-900">
              حالیہ حفاظ کرام (دستار بندی و تکمیل شدہ طلبہ)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hifzGraduates.map((grad) => (
              <div
                key={grad.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {grad.fullName}
                  </h4>
                  <p className="text-xs text-stone-600">ولد: {grad.fatherName}</p>
                  <p className="text-[11px] text-emerald-800 font-medium mt-1">
                    استاد محترم: {grad.teacherName}
                  </p>
                </div>
                <div className="text-left">
                  <span className="text-[11px] px-2 py-1 rounded bg-amber-200/80 text-amber-900 font-semibold block">
                    مکمل ۳۰ پارے
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono mt-1 block">
                    {grad.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attestation / Stamp Area */}
        <div className="pt-8 border-t border-stone-200 grid grid-cols-3 gap-6 text-center text-xs text-stone-600">
          <div>
            <div className="h-16 border-b border-stone-300" />
            <p className="mt-2 font-medium">دستخط صدر شعبہ امتحانات</p>
          </div>
          <div>
            <div className="h-16 border-b border-stone-300 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-dashed border-emerald-800 flex items-center justify-center text-[10px] text-emerald-900 font-bold rotate-12">
                مہر جامعہ
              </div>
            </div>
            <p className="mt-2 font-medium">مہر دفتر اہتمام</p>
          </div>
          <div>
            <div className="h-16 border-b border-stone-300" />
            <p className="mt-2 font-medium">دستخط مہتمم جامعہ صلاح الدین ایوبی</p>
          </div>
        </div>
      </div>
    </div>
  );
};
