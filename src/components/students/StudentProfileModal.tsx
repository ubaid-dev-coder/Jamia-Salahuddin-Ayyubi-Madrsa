import React, { useRef } from 'react';
import {
  X,
  Printer,
  Edit,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  User,
  ShieldCheck,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import { Student, InstituteSettings } from '../../types';
import { StudentBarcode, StudentQRCode } from '../common/StudentBarcode';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
  instituteSettings: InstituteSettings;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
  instituteSettings,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'زیرِ تعلیم (حاضر)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'graduated':
        return { text: 'فارغ التحصیل / تکمیل شدہ', color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'leave':
        return { text: 'رخصت پر', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'struck_off':
        return { text: 'خارج شدہ', color: 'text-red-700 bg-red-50 border-red-200' };
      default:
        return { text: status, color: 'text-stone-700 bg-stone-50 border-stone-200' };
    }
  };

  const statusInfo = getStatusLabel(student.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Top bar (Hidden on print) */}
        <div className="no-print bg-[#042f24] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 shrink-0 bg-emerald-950">
              <img
                src={instituteSettings.logoUrl}
                alt={instituteSettings.instituteName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-calligraphy text-lg font-bold text-amber-300">
                {instituteSettings.instituteName} — کوائف نامہ
              </h3>
              <p className="text-xs text-emerald-300">
                داخلہ نمبر:{' '}
                <span className="font-mono font-bold tracking-wider">{student.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(student)}
              className="py-1.5 px-3 bg-emerald-800 hover:bg-emerald-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>ترمیم</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ داخلہ کارڈ</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Card Content (Printable) */}
        <div ref={cardRef} className="p-6 lg:p-8 space-y-6">
          {/* Official Letterhead for Print */}
          <div className="border-b-2 border-emerald-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-16 rounded-xl overflow-hidden border-2 border-amber-500 shrink-0 bg-black flex items-center justify-center p-1">
                <img
                  src={instituteSettings.logoUrl}
                  alt={instituteSettings.instituteName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-calligraphy text-2xl font-bold text-emerald-950">
                  {instituteSettings.instituteName}
                </h2>
                <p className="text-xs text-stone-600 font-medium">
                  {instituteSettings.subTitle}
                </p>
                <p className="text-[11px] text-stone-500 font-calligraphy">
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ — اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* QR Code */}
              <div className="p-1 bg-white border border-stone-200 rounded-xl shadow-xs text-center shrink-0">
                <StudentQRCode value={`JSA:${student.id}:${student.fullName}`} size={64} />
                <span className="text-[9px] font-mono text-stone-500 block mt-0.5">اسکین QR</span>
              </div>

              {/* Code 128 Barcode */}
              <div className="text-left border-r-2 border-amber-500 pr-4">
                <span className="text-[11px] text-stone-500 block">شناختی کوڈ / داخلہ نمبر</span>
                <StudentBarcode studentId={student.id} width={1.3} height={32} fontSize={11} />
                <span className="text-[10px] text-stone-400 block font-mono">
                  تاریخِ داخلہ: {student.admissionDate}
                </span>
              </div>
            </div>
          </div>

          {/* Student Hero Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-700 bg-white shadow-md shrink-0 flex items-center justify-center">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-emerald-900 text-amber-300 flex items-center justify-center text-3xl font-bold font-calligraphy">
                  {student.fullName.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-right space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h3 className="text-2xl font-bold text-stone-900">
                  {student.fullName}
                </h3>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-medium border ${statusInfo.color}`}
                >
                  {statusInfo.text}
                </span>
              </div>

              <p className="text-stone-600 text-sm">
                فرزند / بنت:{' '}
                <span className="font-semibold text-stone-800">{student.fatherName}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  {student.department === 'hifz'
                    ? 'شعبہ حفظ القرآن الکریم'
                    : 'شعبہ ناظرہ قرآن و تجوید'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-700" />
                  {student.gender === 'male' ? 'طالب علم (بنین)' : 'طالبہ (بنات)'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  موجودہ درجہ: {student.currentParaOrLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Academic Details Box */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2.5">
              <h4 className="font-bold text-emerald-900 pb-1 border-b border-stone-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                تعلیمی کوائف
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">نگران استاد / قاری:</span>
                  <span className="font-semibold text-stone-800">{student.teacherName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">موجودہ پارہ / کتاب:</span>
                  <span className="font-semibold text-emerald-800">{student.currentParaOrLevel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">تاریخِ پیدائش:</span>
                  <span className="font-mono text-stone-700">{student.dateOfBirth || '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">ماہانہ فیس:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {student.monthlyFee > 0 ? `${student.monthlyFee} روپے` : 'معاف (وظیفہ)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Guardian Details Box */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2.5">
              <h4 className="font-bold text-emerald-900 pb-1 border-b border-stone-100 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-700" />
                رابطہ و سرپرست کی تفصیل
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">والد کا موبائل:</span>
                  <span className="font-mono text-stone-800" dir="ltr">{student.fatherMobileNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">سرپرست کا نام:</span>
                  <span className="font-semibold text-stone-800">
                    {student.guardianName} ({student.guardianRelation})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">سرپرست کا فون:</span>
                  <span className="font-mono text-stone-800" dir="ltr">{student.guardianPhone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">شہر / علاقہ:</span>
                  <span className="font-semibold text-stone-800">{student.city}</span>
                </div>
              </div>
            </div>

            {/* Residential Address */}
            <div className="md:col-span-2 p-4 rounded-xl border border-stone-200 bg-white">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 block text-xs">مکمل رہائشی پتہ:</span>
                  <p className="font-medium text-stone-800">{student.address}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {student.notes && (
              <div className="md:col-span-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <span className="text-xs font-bold text-amber-900 block mb-1">
                  خصوصی کیفیات / ریمارکس:
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">{student.notes}</p>
              </div>
            )}
          </div>

          {/* Stamp & Signatures Box (For Print) */}
          <div className="pt-8 border-t border-stone-200 grid grid-cols-3 gap-6 text-center text-xs text-stone-600">
            <div>
              <div className="h-14 border-b border-stone-300" />
              <p className="mt-2 font-medium">دستخط قاری / استاد صاحب</p>
            </div>
            <div>
              <div className="h-14 border-b border-stone-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-dashed border-emerald-700/60 flex items-center justify-center text-[9px] text-emerald-800 font-semibold rotate-12">
                  مہر جامعہ
                </div>
              </div>
              <p className="mt-2 font-medium">مہر دفتر داخلہ</p>
            </div>
            <div>
              <div className="h-14 border-b border-stone-300" />
              <p className="mt-2 font-medium">دستخط ناظمِ اعلیٰ / مہتمم</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
