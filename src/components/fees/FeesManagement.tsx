import React, { useState } from 'react';
import { Receipt, CheckCircle, Clock, Award, Printer, Search, Download, Sparkles, X, Eye } from 'lucide-react';
import { Student, InstituteSettings } from '../../types';

interface FeesManagementProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  instituteSettings: InstituteSettings;
}

export const FeesManagement: React.FC<FeesManagementProps> = ({
  students,
  onUpdateStudent,
  instituteSettings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [receiptStudent, setReceiptStudent] = useState<Student | null>(null);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.fullName.includes(searchTerm) || s.id.includes(searchTerm);
    const matchesStatus =
      filterStatus === 'all' || s.feeStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleToggleFee = (student: Student) => {
    const nextStatus = student.feeStatus === 'paid' ? 'pending' : 'paid';
    onUpdateStudent({
      ...student,
      feeStatus: nextStatus,
    });
  };

  const totalFeesExpected = students.reduce((acc, s) => acc + s.monthlyFee, 0);
  const totalFeesCollected = students
    .filter((s) => s.feeStatus === 'paid')
    .reduce((acc, s) => acc + s.monthlyFee, 0);
  const pendingCount = students.filter((s) => s.feeStatus === 'pending').length;
  const waivedCount = students.filter((s) => s.feeStatus === 'waived').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-700 rounded-xs inline-block" />
            <h2 className="text-xl font-bold text-stone-900">
              شعبہ فیس و مالیات — جامعہ صلاح الدین ایوبی
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            ماہانہ فیس ریکارڈ، وصولیاں اور مستحق طلبہ کے تعلیمی وظائف کا انتظام
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="py-2 px-4 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-emerald-800" />
          <span>فیس وصولی رپورٹ پرنٹ کریں</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">کل متوقع ماہانہ فیس</span>
          <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-1 block">
            {totalFeesExpected.toLocaleString()} روپے
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-emerald-700 block">وصول شدہ فیس</span>
          <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums mt-1 block">
            {totalFeesCollected.toLocaleString()} روپے
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-red-600 block">واجب الاداء طلبہ (Pending)</span>
          <span className="text-2xl font-bold font-mono text-red-600 tabular-nums mt-1 block">
            {pendingCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-amber-700 block">مکمل وظیفہ / معافی</span>
          <span className="text-2xl font-bold font-mono text-amber-700 tabular-nums mt-1 block">
            {waivedCount}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="طالب علم یا داخلہ نمبر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">فلٹر:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            >
              <option value="all">تمام فیس کیفیات</option>
              <option value="paid">صرف ادا شدہ</option>
              <option value="pending">صرف واجب الاداء</option>
              <option value="waived">صرف وظیفہ یافتہ</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs">
                <th className="py-3 px-4 font-semibold">داخلہ نمبر</th>
                <th className="py-3 px-4 font-semibold">طالب علم کا نام</th>
                <th className="py-3 px-4 font-semibold">والد کا نام</th>
                <th className="py-3 px-4 font-semibold">شعبہ</th>
                <th className="py-3 px-4 font-semibold">ماہانہ فیس</th>
                <th className="py-3 px-4 font-semibold text-center">کیفیت</th>
                <th className="py-3 px-4 font-semibold text-center">رسید / کارروائی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-emerald-800">
                    {s.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900">{s.fullName}</td>
                  <td className="py-3 px-4 text-stone-600">{s.fatherName}</td>
                  <td className="py-3 px-4 text-stone-600">
                    {s.department === 'hifz' ? 'شعبہ حفظ' : 'شعبہ ناظرہ'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    {s.monthlyFee > 0 ? `${s.monthlyFee} روپے` : 'معاف (وظیفہ)'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${
                        s.feeStatus === 'paid'
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : s.feeStatus === 'pending'
                          ? 'text-red-700 bg-red-50 border border-red-200'
                          : 'text-amber-800 bg-amber-50 border border-amber-200'
                      }`}
                    >
                      {s.feeStatus === 'paid'
                        ? 'ادا شدہ'
                        : s.feeStatus === 'pending'
                        ? 'واجب الاداء'
                        : 'وظیفہ'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleToggleFee(s)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          s.feeStatus === 'paid'
                            ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            : 'bg-emerald-800 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {s.feeStatus === 'paid' ? 'منسوخ' : 'وصول کریں'}
                      </button>

                      {s.feeStatus === 'paid' && (
                        <button
                          onClick={() => setReceiptStudent(s)}
                          className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="فیس رسید دیکھیں و پرنٹ کریں"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>رسید</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Fee Receipt Modal with Institute Logo */}
      {receiptStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="no-print bg-[#042f24] text-white px-5 py-3 flex items-center justify-between">
              <span className="font-calligraphy text-base font-bold text-amber-300">
                رسید وصولی ماہانہ فیس
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-1 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>پرنٹ رسید</span>
                </button>
                <button
                  onClick={() => setReceiptStudent(null)}
                  className="p-1 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-white text-stone-900 space-y-4">
              {/* Header with Institute Logo */}
              <div className="border-b-2 border-emerald-900/40 pb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-amber-400 shadow-xs bg-black flex items-center justify-center p-1 shrink-0">
                    <img
                      src={instituteSettings.logoUrl}
                      alt={instituteSettings.instituteName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-calligraphy text-xl font-bold text-emerald-950">
                      {instituteSettings.instituteName}
                    </h3>
                    <p className="text-[11px] text-stone-600 font-medium">
                      {instituteSettings.subTitle} — شعبہ فیس و مالیات
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono">
                      {instituteSettings.address} | فون: {instituteSettings.phone}
                    </p>
                  </div>
                </div>

                <div className="text-left bg-stone-50 p-2 rounded-xl border border-stone-200 font-mono text-[11px]" dir="ltr">
                  <span className="text-[10px] text-stone-400 block font-semibold">RECEIPT NO.</span>
                  <span className="font-bold text-emerald-900">FEE-{receiptStudent.id.slice(-4)}</span>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block text-[11px]">طالب علم کا نام:</span>
                  <span className="font-bold text-stone-900 text-sm">{receiptStudent.fullName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">ولدیت:</span>
                  <span className="font-bold text-stone-900">{receiptStudent.fatherName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">داخلہ نمبر:</span>
                  <span className="font-mono font-bold text-emerald-800">{receiptStudent.id}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">شعبہ:</span>
                  <span className="font-bold text-stone-800">
                    {receiptStudent.department === 'hifz' ? 'شعبہ حفظ القرآن' : 'شعبہ ناظرہ قرآن'}
                  </span>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950">ماہانہ فیس وصول شدہ رقم:</span>
                <span className="font-mono font-extrabold text-emerald-900 text-base">
                  {receiptStudent.monthlyFee} روپے
                </span>
              </div>

              {/* Stamp & Sign */}
              <div className="pt-4 border-t border-dashed border-stone-300 flex items-center justify-between text-xs text-stone-500">
                <div className="text-center">
                  <span className="block border-t border-stone-400 pt-1 px-4 text-[10px]">دستخط نگران / کیشیئر</span>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-emerald-800/40 text-emerald-900 flex items-center justify-center text-[10px] font-calligraphy p-1 text-center rotate-[-12deg]">
                  جامعہ صلاح الدین ایوبی دفتر اہتمام
                </div>
                <div className="text-center">
                  <span className="block border-t border-stone-400 pt-1 px-4 text-[10px]">مہر شعبہ مالیات</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
