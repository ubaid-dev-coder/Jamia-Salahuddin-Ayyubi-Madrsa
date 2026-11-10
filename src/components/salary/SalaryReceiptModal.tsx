import React, { useRef } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Calendar,
  Building,
  Sparkles,
  Download
} from 'lucide-react';
import { StaffMember, MonthlySalaryRecord, InstituteSettings } from '../../types';

interface SalaryReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  salaryRecord: MonthlySalaryRecord | null;
  instituteSettings: InstituteSettings;
  paidAmountNow?: number;
  paymentMethod?: string;
}

export const SalaryReceiptModal: React.FC<SalaryReceiptModalProps> = ({
  isOpen,
  onClose,
  staff,
  salaryRecord,
  instituteSettings,
  paidAmountNow,
  paymentMethod = 'نقد (Cash)',
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !staff || !salaryRecord) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNumber = `SAL-REC-${salaryRecord.id.replace(/[^0-9]/g, '').slice(-6) || '1001'}`;
  const effectivePaid = paidAmountNow !== undefined ? paidAmountNow : salaryRecord.paidAmount;
  const remaining = Math.max(0, salaryRecord.netPayable - effectivePaid);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="no-print bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-300" />
            <span className="font-calligraphy text-lg font-bold text-amber-300">
              رسید ادائیگی تنخواہ و واؤچر
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>رسید پرنٹ کریں</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div ref={receiptRef} className="p-6 sm:p-8 bg-white text-stone-900 space-y-6 printable-receipt-area">
          {/* Header */}
          <div className="border-b-2 border-emerald-900/40 pb-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-amber-400 shadow-sm bg-black flex items-center justify-center p-1 shrink-0">
                  <img
                    src={instituteSettings.logoUrl}
                    alt={instituteSettings.instituteName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-calligraphy text-2xl font-extrabold text-emerald-950">
                    {instituteSettings.instituteName}
                  </h1>
                  <p className="text-xs text-stone-600 font-medium">
                    {instituteSettings.subTitle} — دفترِ مالیات و حسابات
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                    {instituteSettings.address} | فون: {instituteSettings.phone}
                  </p>
                </div>
              </div>

              {/* Receipt Number Badge */}
              <div className="text-left bg-stone-50 p-2.5 rounded-xl border border-stone-200 shrink-0" dir="ltr">
                <span className="text-[10px] text-stone-400 block font-semibold">RECEIPT NO.</span>
                <span className="text-xs font-bold text-emerald-900 font-mono">{receiptNumber}</span>
                <span className="text-[10px] text-stone-500 block font-mono mt-0.5">
                  {salaryRecord.paymentDate || new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-emerald-800/10 flex items-center justify-between text-xs text-emerald-900 font-semibold bg-emerald-50/70 p-2 rounded-lg">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>ماہانہ تنخواہ ادائیگی واؤچر (مع ریکارڈ تصدیق)</span>
              </span>
              <span>تنخواہ برائے ماہ: <strong className="text-emerald-950 font-bold">{salaryRecord.monthUrdu}</strong></span>
            </div>
          </div>

          {/* Employee Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50/80 p-4 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-[10px] text-stone-500 block">ملازم کا نام:</span>
              <strong className="text-stone-900 text-sm font-calligraphy">{staff.name}</strong>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">ملازم شناختی نمبر:</span>
              <span className="font-mono text-emerald-800 font-bold">{staff.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">عہدہ:</span>
              <span className="font-semibold text-stone-800">{staff.designation}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">شعبہ:</span>
              <span className="font-semibold text-stone-800">{staff.department}</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#042f24] text-amber-300 font-bold">
                <tr>
                  <th className="p-2.5">تفصیلات و مدات</th>
                  <th className="p-2.5 text-center">حاضری / ایام</th>
                  <th className="p-2.5 text-left font-mono">رقم (روپے)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr className="hover:bg-stone-50/50">
                  <td className="p-2.5 font-medium text-stone-800">بنیادی ماہانہ تنخواہ (Basic Salary)</td>
                  <td className="p-2.5 text-center font-mono">۳۰ دن</td>
                  <td className="p-2.5 text-left font-mono font-bold text-stone-900">
                    {salaryRecord.baseSalary.toLocaleString()}
                  </td>
                </tr>

                {salaryRecord.allowances > 0 && (
                  <tr className="bg-emerald-50/40 text-emerald-900">
                    <td className="p-2.5 font-medium">اضافی الاؤنسز و اعزازیہ (Allowances)</td>
                    <td className="p-2.5 text-center font-mono">—</td>
                    <td className="p-2.5 text-left font-mono font-bold text-emerald-800">
                      + {salaryRecord.allowances.toLocaleString()}
                    </td>
                  </tr>
                )}

                {salaryRecord.deductions > 0 && (
                  <tr className="bg-rose-50/40 text-rose-900">
                    <td className="p-2.5 font-medium">
                      کٹوتیاں (غیر حاضری / تاخیر)
                      <span className="text-[10px] text-rose-700 mr-2">
                        (رخصت: {salaryRecord.leaveDays} دن | تاخیر: {salaryRecord.lateDays})
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-mono">{salaryRecord.leaveDays} رخصت</td>
                    <td className="p-2.5 text-left font-mono font-bold text-rose-800">
                      - {salaryRecord.deductions.toLocaleString()}
                    </td>
                  </tr>
                )}

                {salaryRecord.advance > 0 && (
                  <tr className="bg-amber-50/40 text-amber-900">
                    <td className="p-2.5 font-medium">پیشگی تنخواہ کٹوتی (Advance Adjusted)</td>
                    <td className="p-2.5 text-center font-mono">—</td>
                    <td className="p-2.5 text-left font-mono font-bold text-amber-800">
                      - {salaryRecord.advance.toLocaleString()}
                    </td>
                  </tr>
                )}

                <tr className="bg-stone-100 font-bold border-t-2 border-stone-300">
                  <td className="p-2.5 text-stone-900" colSpan={2}>
                    کل قابلِ ادائیگی تنخواہ (Net Payable Salary)
                  </td>
                  <td className="p-2.5 text-left font-mono text-stone-950 font-extrabold text-sm">
                    {salaryRecord.netPayable.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-emerald-100/70 font-bold text-emerald-950">
                  <td className="p-2.5" colSpan={2}>
                    ادا شدہ رقم (Paid Amount) — {paymentMethod}
                  </td>
                  <td className="p-2.5 text-left font-mono text-emerald-900 font-extrabold text-base">
                    {effectivePaid.toLocaleString()} روپے
                  </td>
                </tr>

                {remaining > 0 && (
                  <tr className="bg-rose-50 text-rose-950 font-bold">
                    <td className="p-2.5" colSpan={2}>
                      بقایا رقم (Remaining Balance)
                    </td>
                    <td className="p-2.5 text-left font-mono text-rose-700 font-extrabold">
                      {remaining.toLocaleString()} روپے
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Verification & Status Stamp */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>اسٹیٹس: </span>
              <strong className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                remaining <= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {remaining <= 0 ? 'مکمل ادا شدہ (Fully Paid)' : 'جزوی ادائیگی (Partially Paid)'}
              </strong>
            </div>
            <span className="text-stone-500 text-[11px] font-mono">
              طریقہ ادائیگی: {paymentMethod}
            </span>
          </div>

          {/* Signatures */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-xs text-center border-t border-dashed border-stone-300">
            <div>
              <div className="border-b border-stone-400 w-44 mx-auto mb-2" />
              <span className="font-bold text-stone-800 block">دستخط وصول کنندہ ملازم / استاد</span>
              <span className="text-[10px] text-stone-400">تاریخ و دستخط</span>
            </div>

            <div>
              <div className="border-b border-stone-400 w-44 mx-auto mb-2" />
              <span className="font-bold text-stone-800 block">دستخطِ مجاز و مہر ناظمِ مالیات</span>
              <span className="text-[10px] text-stone-400">{instituteSettings.instituteName}</span>
            </div>
          </div>

          {/* Receipt Note */}
          <div className="text-[10px] text-stone-400 text-center pt-2">
            کمپیوٹرائزڈ رسید تنخواہ برائے جامعہ صلاح الدین ایوبی — کسی دستی ترمیم کی صورت میں قبول نہیں ہوگی۔
          </div>
        </div>
      </div>
    </div>
  );
};
