import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Calendar,
  Sparkles,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { StaffMember, MonthlySalaryRecord, SalaryPayment } from '../../types';

interface SalaryPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  salaryRecord: MonthlySalaryRecord | null;
  onSavePayment: (payment: Omit<SalaryPayment, 'id'>) => Promise<void>;
  onOpenReceipt: (paidAmount: number, paymentMethod: string) => void;
}

export const SalaryPaymentModal: React.FC<SalaryPaymentModalProps> = ({
  isOpen,
  onClose,
  staff,
  salaryRecord,
  onSavePayment,
  onOpenReceipt,
}) => {
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<'full' | 'partial' | 'advance'>('full');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'easypaisa'>('cash');
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (salaryRecord) {
      const remaining = salaryRecord.remainingAmount > 0 ? salaryRecord.remainingAmount : salaryRecord.netPayable;
      setPayAmount(remaining);
      setPaymentType('full');
      setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`);
      setErrorMsg('');
    }
  }, [salaryRecord]);

  if (!isOpen || !staff || !salaryRecord) return null;

  const handleTypeChange = (type: 'full' | 'partial' | 'advance') => {
    setPaymentType(type);
    if (type === 'full') {
      const remaining = salaryRecord.remainingAmount > 0 ? salaryRecord.remainingAmount : salaryRecord.netPayable;
      setPayAmount(remaining);
    } else if (type === 'partial') {
      const remaining = salaryRecord.remainingAmount > 0 ? salaryRecord.remainingAmount : salaryRecord.netPayable;
      setPayAmount(Math.round(remaining / 2));
    } else if (type === 'advance') {
      setPayAmount(5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      setErrorMsg('برائے مہربانی درست رقم درج کریں۔');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSavePayment({
        recordId: salaryRecord.id,
        staffId: staff.id,
        amount: Number(payAmount),
        paymentDate,
        paymentMethod,
        paidByAdmin: 'دفتر اہتمام و مالیات',
        receiptNumber,
        notes,
      });

      const methodUrdu =
        paymentMethod === 'cash' ? 'نقد (Cash)' : paymentMethod === 'bank' ? 'بینک ٹرانسفر' : 'ایزی پیسہ / جاز کیش';

      onClose();
      onOpenReceipt(Number(payAmount), methodUrdu);
    } catch (err: any) {
      setErrorMsg(err.message || 'ادائیگی درج کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-calligraphy text-xl font-bold text-amber-300">
                تنخواہ ادائیگی درج کریں
              </h3>
              <p className="text-xs text-emerald-200">
                ماہ: {salaryRecord.monthUrdu} — {staff.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Employee Quick Info Card */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <p className="text-stone-500 text-[10px]">ملازم کا نام و شناختی نمبر:</p>
              <h4 className="font-calligraphy text-base font-bold text-stone-900">{staff.name}</h4>
              <p className="text-[11px] text-emerald-800 font-mono">{staff.id} • {staff.designation}</p>
            </div>
            <div className="text-left" dir="ltr">
              <span className="text-[10px] text-stone-500 block">Net Payable:</span>
              <span className="text-sm font-extrabold text-emerald-900 font-mono">
                {salaryRecord.netPayable.toLocaleString()} PKR
              </span>
              <span className="text-[11px] text-rose-600 font-mono block">
                بقایا: {salaryRecord.remainingAmount.toLocaleString()} PKR
              </span>
            </div>
          </div>

          {/* Payment Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              ادائیگی کی نوعیت:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('full')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  paymentType === 'full'
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                مکمل ادائیگی
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('partial')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  paymentType === 'partial'
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                جزوی ادائیگی
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('advance')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  paymentType === 'advance'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                ایڈوانس رقم
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ادائیگی کی رقم (روپے)
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min={1}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full pr-4 pl-12 py-2.5 text-base font-bold font-mono border-2 border-emerald-800/40 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-stone-900"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                روپے
              </span>
            </div>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ادائیگی کا طریقہ
              </label>
              <select
                value={paymentMethod}
                onChange={(e: any) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 bg-white"
              >
                <option value="cash">نقد رقم (Cash)</option>
                <option value="bank">بینک ٹرانسفر (Online Transfer)</option>
                <option value="easypaisa">ایزی پیسہ / جاز کیش</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ادائیگی کی تاریخ
              </label>
              <input
                type="date"
                required
                dir="ltr"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
              />
            </div>
          </div>

          {/* Receipt Number & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                رسید / واؤچر نمبر
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                خصوصی نوٹ / تفصیل
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثلاً: مئی کی تنخواہ نقد ادا کی گئی"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'ادائیگی درج ہو رہی ہے...' : 'ادائیگی محفوظ کریں و رسید پرنٹ کریں'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
