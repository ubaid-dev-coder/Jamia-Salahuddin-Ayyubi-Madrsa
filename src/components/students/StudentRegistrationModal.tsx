import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Upload, User, Sparkles, AlertCircle } from 'lucide-react';
import { Student, DepartmentType, GenderType, StudentStatus } from '../../types';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: any) => void;
  editingStudent?: Student | null;
  defaultDepartment?: DepartmentType;
  defaultGender?: GenderType;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingStudent,
  defaultDepartment = 'hifz',
  defaultGender = 'male',
}) => {
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [department, setDepartment] = useState<DepartmentType>(defaultDepartment);
  const [gender, setGender] = useState<GenderType>(defaultGender);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [currentParaOrLevel, setCurrentParaOrLevel] = useState('پارہ نمبر ۱');
  const [teacherName, setTeacherName] = useState('قاری عبد الرحمن حقانی');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('لاہور');
  const [mobileNumber, setMobileNumber] = useState('');
  const [fatherMobileNumber, setFatherMobileNumber] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('والد');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [monthlyFee, setMonthlyFee] = useState<number>(2000);
  const [feeStatus, setFeeStatus] = useState<'paid' | 'pending' | 'waived'>('paid');
  const [status, setStatus] = useState<StudentStatus>('active');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingStudent) {
      setFullName(editingStudent.fullName);
      setFatherName(editingStudent.fatherName);
      setDepartment(editingStudent.department);
      setGender(editingStudent.gender);
      setDateOfBirth(editingStudent.dateOfBirth);
      setAdmissionDate(editingStudent.admissionDate);
      setCurrentParaOrLevel(editingStudent.currentParaOrLevel);
      setTeacherName(editingStudent.teacherName);
      setAddress(editingStudent.address);
      setCity(editingStudent.city);
      setMobileNumber(editingStudent.mobileNumber);
      setFatherMobileNumber(editingStudent.fatherMobileNumber);
      setGuardianName(editingStudent.guardianName);
      setGuardianRelation(editingStudent.guardianRelation);
      setGuardianPhone(editingStudent.guardianPhone);
      setMonthlyFee(editingStudent.monthlyFee);
      setFeeStatus(editingStudent.feeStatus);
      setStatus(editingStudent.status);
      setNotes(editingStudent.notes || '');
      setPhotoUrl(editingStudent.photoUrl || '');
    } else {
      // Reset defaults
      setFullName('');
      setFatherName('');
      setDepartment(defaultDepartment);
      setGender(defaultGender);
      setDateOfBirth('2014-01-01');
      setAdmissionDate(new Date().toISOString().split('T')[0]);
      setCurrentParaOrLevel(defaultDepartment === 'hifz' ? 'پارہ نمبر ۱' : 'نورانی قاعدہ');
      setTeacherName(
        defaultDepartment === 'hifz'
          ? 'قاری عبد الرحمن حقانی'
          : 'مولانا حافظ محمد بلال'
      );
      setAddress('');
      setCity('لاہور');
      setMobileNumber('');
      setFatherMobileNumber('');
      setGuardianName('');
      setGuardianRelation('والد');
      setGuardianPhone('');
      setMonthlyFee(2000);
      setFeeStatus('paid');
      setStatus('active');
      setNotes('');
      setPhotoUrl('');
      setErrors({});
    }
  }, [editingStudent, isOpen, defaultDepartment, defaultGender]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'طالب علم کا نام درج کرنا ضروری ہے۔';
    if (!fatherName.trim()) errs.fatherName = 'والد کا نام درج کرنا ضروری ہے۔';
    if (!fatherMobileNumber.trim())
      errs.fatherMobileNumber = 'والد کا موبائل نمبر درج کرنا ضروری ہے۔';
    if (!address.trim()) errs.address = 'مکمل پتہ درج کرنا ضروری ہے۔';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const studentData = {
      fullName,
      fatherName,
      department,
      gender,
      dateOfBirth,
      admissionDate,
      currentParaOrLevel,
      teacherName,
      address,
      city,
      mobileNumber: mobileNumber || fatherMobileNumber,
      fatherMobileNumber,
      guardianName: guardianName || fatherName,
      guardianRelation: guardianRelation || 'والد',
      guardianPhone: guardianPhone || fatherMobileNumber,
      monthlyFee: Number(monthlyFee),
      feeStatus,
      status,
      notes,
      photoUrl,
    };

    onSave(studentData);
    onClose();
  };

  const handlePhotoUploadMock = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPhoto(true);
      try {
        const { supabaseService } = await import('../../services/supabaseClient');
        const uploadedUrl = await supabaseService.uploadFile(file, 'avatars');
        setPhotoUrl(uploadedUrl);
      } catch (err) {
        console.error('Photo upload failed:', err);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-calligraphy text-xl font-bold text-amber-300">
                {editingStudent ? 'طالب علم کے کوائف میں ترمیم' : 'نیا طالب علم داخلہ فارم'}
              </h3>
              <p className="text-xs text-emerald-200">
                جامعہ صلاح الدین ایوبی — تعلیمی سال ۱۴۴۷-۱۴۴۸ھ
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-stone-200 text-emerald-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>۱. بنیادی و ذاتی معلومات</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Photo Upload Card */}
              <div className="md:row-span-2 flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-stone-200 mb-3 border-2 border-emerald-700/50 flex items-center justify-center">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="طالب علم تصویر"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-stone-400" />
                  )}
                </div>
                <label className="text-xs py-1.5 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>تصویر منتخب کریں</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUploadMock}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-stone-400 mt-1.5">
                  JPG یا PNG فارمیٹ (اختیاری)
                </span>
              </div>

              {/* Student Full Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  طالب علم کا مکمل نام <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: حافظ محمد اسامہ فاروق"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 ${
                    errors.fullName ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  والد کا نام <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: محمد فاروق احمد"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 ${
                    errors.fatherName ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.fatherName && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fatherName}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  جنس (سیکشن) <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as GenderType)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 bg-white"
                >
                  <option value="male">طالب علم (لڑکا / بنین)</option>
                  <option value="female">طالبہ (لڑکی / بنات)</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  تاریخِ پیدائش
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Department & Academic Details */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-stone-200 text-emerald-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>۲. تعلیمی شعبہ و درجہ کی تفصیلات</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  تعلیمی شعبہ <span className="text-red-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => {
                    const dept = e.target.value as DepartmentType;
                    setDepartment(dept);
                    if (dept === 'hifz') {
                      setCurrentParaOrLevel('پارہ نمبر ۱');
                      setTeacherName('قاری عبد الرحمن حقانی');
                    } else {
                      setCurrentParaOrLevel('نورانی قاعدہ');
                      setTeacherName('مولانا حافظ محمد بلال');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 bg-white"
                >
                  <option value="hifz">شعبہ حفظ القرآن الکریم</option>
                  <option value="nazra">شعبہ ناظرہ قرآن و تجوید</option>
                </select>
              </div>

              {/* Current Para / Level */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  موجودہ پارہ / درجہ
                </label>
                <input
                  type="text"
                  placeholder={
                    department === 'hifz'
                      ? 'مثلاً: پارہ نمبر ۱۲'
                      : 'مثلاً: نورانی قاعدہ تختی نمبر ۸ یا پارہ عم'
                  }
                  value={currentParaOrLevel}
                  onChange={(e) => setCurrentParaOrLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Teacher / Qari Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  استاد / قاری صاحب کا نام
                </label>
                <input
                  type="text"
                  placeholder="استاد محترم کا نام"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Admission Date */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  تاریخِ داخلہ
                </label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-mono"
                />
              </div>

              {/* Monthly Fee */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  ماہانہ تعلیمی فیس (روپے)
                </label>
                <input
                  type="number"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-mono"
                />
              </div>

              {/* Fee Status */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  فیس کی صورتحال
                </label>
                <select
                  value={feeStatus}
                  onChange={(e) => setFeeStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 bg-white"
                >
                  <option value="paid">ادا شدہ (Paid)</option>
                  <option value="pending">زیرِ التواء (Pending)</option>
                  <option value="waived">رعایت / مکمل وظیفہ (Scholarship)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Guardian Details */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-stone-200 text-emerald-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>۳. رابطہ اور سرپرست کی تفصیلات</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Father's Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  والد کا موبائل نمبر <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="0300-1234567"
                  value={fatherMobileNumber}
                  onChange={(e) => setFatherMobileNumber(e.target.value)}
                  className={`w-full px-3 py-2 text-sm text-left border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-mono ${
                    errors.fatherMobileNumber ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.fatherMobileNumber && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fatherMobileNumber}
                  </p>
                )}
              </div>

              {/* Student / Alternative Mobile */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  متبادل موبائل نمبر
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="0321-7654321"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-left border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-mono"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  شہر
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: لاہور، کراچی، راولپنڈی"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Full Address */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  مکمل پتہ بشمول محلہ و گلی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مکان نمبر، گلی نمبر، محلہ، نزد اہم عمارت"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 ${
                    errors.address ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Guardian Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  سرپرست کا نام (اگر والد کے علاوہ ہوں)
                </label>
                <input
                  type="text"
                  placeholder="سرپرست کا نام"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Guardian Relation */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  طالب علم سے رشتہ
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: والد، بڑا بھائی، چچا، ماموں"
                  value={guardianRelation}
                  onChange={(e) => setGuardianRelation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Guardian Phone */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  سرپرست کا فون نمبر
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="0300-0000000"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-left border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Additional Notes */}
          <div>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-stone-200 text-emerald-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>۴. اضافی کیفیات / خصوصی ہدایات</span>
            </div>
            <textarea
              rows={2}
              placeholder="طالب علم کے بارے میں کوئی خصوصی کیفیت، حفظ کی رفتار، صحت یا رعایت سے متعلق نوٹ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-medium transition-colors cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingStudent ? 'تبدیلیاں محفوظ کریں' : 'داخلہ مکمل کریں'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
