import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Save,
  Upload,
  User,
  Phone,
  Calendar,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { StaffMember } from '../../types';
import { supabaseService } from '../../services/supabaseClient';

interface StaffMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingStaff: StaffMember | null;
  onSaveStaff: (staffData: any) => Promise<void>;
}

export const StaffMemberModal: React.FC<StaffMemberModalProps> = ({
  isOpen,
  onClose,
  editingStaff,
  onSaveStaff,
}) => {
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('شعبہ حفظ القرآن');
  const [monthlySalary, setMonthlySalary] = useState<number>(25000);
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('11G، نیو کراچی');
  const [joiningDate, setJoiningDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingStaff) {
      setName(editingStaff.name);
      setFatherName(editingStaff.fatherName);
      setDesignation(editingStaff.designation);
      setDepartment(editingStaff.department);
      setMonthlySalary(editingStaff.monthlySalary);
      setMobileNumber(editingStaff.mobileNumber);
      setAddress(editingStaff.address);
      setJoiningDate(editingStaff.joiningDate);
      setPhotoUrl(editingStaff.photoUrl || '');
      setStatus(editingStaff.status);
      setNotes(editingStaff.notes || '');
    } else {
      setName('');
      setFatherName('');
      setDesignation('مدرس حفظ القرآن');
      setDepartment('شعبہ حفظ القرآن');
      setMonthlySalary(25000);
      setMobileNumber('');
      setAddress('11G، نیو کراچی');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setPhotoUrl('');
      setStatus('active');
      setNotes('');
    }
    setErrorMsg('');
  }, [editingStaff, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await supabaseService.uploadFile(file, 'staff-photos');
      setPhotoUrl(publicUrl);
    } catch {
      alert('تصویر اپلوڈ کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('ملازم کا نام درج کرنا لازمی ہے۔');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveStaff({
        name: name.trim(),
        fatherName: fatherName.trim(),
        designation: designation.trim(),
        department,
        monthlySalary: Number(monthlySalary),
        mobileNumber: mobileNumber.trim(),
        address: address.trim(),
        joiningDate,
        photoUrl,
        status,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'ریکارڈ محفوظ کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-calligraphy text-xl font-bold text-amber-300">
                {editingStaff ? 'ملازم کے کوائف میں ترمیم' : 'نیا ملازم / استاد شامل کریں'}
              </h3>
              <p className="text-xs text-emerald-200">
                جامعہ صلاح الدین ایوبی — باضابطہ ملازمین و تنخواہ رجسٹر
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo & Basic Badge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-800 bg-stone-200 shrink-0 flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt="ملازم" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-stone-400" />
              )}
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold text-stone-800 block">
                ملازم کی تصویر اپلوڈ کریں (اختیاری)
              </label>
              <label className="inline-flex items-center gap-1.5 py-1 px-3 bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg cursor-pointer transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'اپلوڈ جاری ہے...' : 'تصویر منتخب کریں'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-stone-500">پاسپورٹ سائز تصویر برائے سروس کارڈ و رسید۔</p>
            </div>

            {editingStaff && (
              <div className="text-left" dir="ltr">
                <span className="text-[10px] text-stone-400 block font-semibold">EMPLOYEE ID</span>
                <span className="text-xs font-bold font-mono text-emerald-800">{editingStaff.id}</span>
              </div>
            )}
          </div>

          {/* Grid inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ملازم / استاد کا پورا نام *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: قاری عبد الرحمن حقانی"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                والد کا نام (ولدیت) *
              </label>
              <input
                type="text"
                required
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="والد کا نام درج کریں"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                عہدہ (Designation) *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="مثلاً: استاد حفظ القرآن / قاری / ناظم"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                شعبہ (Department) *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 bg-white"
              >
                <option value="شعبہ حفظ القرآن">شعبہ حفظ القرآن</option>
                <option value="شعبہ ناظرہ قرآن">شعبہ ناظرہ قرآن</option>
                <option value="شعبہ بنات (طالبات)">شعبہ بنات (طالبات)</option>
                <option value="شعبہ درسِ نظامی">شعبہ درسِ نظامی</option>
                <option value="دفتر اہتمام و سرپرستی">دفتر اہتمام و سرپرستی</option>
                <option value="دفتر تعلیمات">دفتر تعلیمات</option>
                <option value="شعبہ مالیات و فیس">شعبہ مالیات و فیس</option>
                <option value="شعبہ رہائش و ہاسٹل">شعبہ رہائش و ہاسٹل</option>
                <option value="شعبہ سیکورٹی و عامہ">شعبہ سیکورٹی و عامہ</option>
                <option value="شعبہ خدماتِ عامہ">شعبہ خدماتِ عامہ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                بنیادی ماہانہ تنخواہ (روپے) *
              </label>
              <input
                type="number"
                required
                min={1000}
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                موبائل / فون نمبر
              </label>
              <input
                type="text"
                dir="ltr"
                placeholder="0300-1234567"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                تاریخِ شمولیت (Joining Date)
              </label>
              <input
                type="date"
                required
                dir="ltr"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                اکاؤنٹ اسٹیٹس
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30 bg-white"
              >
                <option value="active">فعال ملازم (Active)</option>
                <option value="inactive">غیر فعال (Inactive / Deactivated)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                رہائش کا پتہ
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="گھر یا کوارٹر کا پتہ درج کریں"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                اضافی نوٹس و ریکارڈ
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="خصوصی ذمہ داری، اوقات کار یا دیگر کوائف..."
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>
          </div>

          {/* Footer Actions */}
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
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'محفوظ ہو رہا ہے...' : 'ملازم کا ریکارڈ محفوظ کریں'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
