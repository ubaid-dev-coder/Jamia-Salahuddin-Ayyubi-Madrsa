import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  CreditCard,
  Building,
  Calendar,
  Sparkles,
  Phone,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Student, InstituteSettings } from '../../types';
import { StudentBarcode, StudentQRCode } from '../common/StudentBarcode';

interface StudentIdCardModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  instituteSettings: InstituteSettings;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  student,
  isOpen,
  onClose,
  instituteSettings,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header Controls (Hidden on Print) */}
        <div className="no-print bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-calligraphy text-lg font-bold text-amber-300">
                اسٹوڈنٹ شناختی کارڈ (Student ID Card)
              </h3>
              <p className="text-[11px] text-emerald-200">
                شناختی کارڈ مع اصل Code 128 بارکوڈ اور کیو آر کوڈ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>کارڈ پرنٹ کریں</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div ref={cardRef} className="p-6 sm:p-8 bg-stone-100 flex flex-col items-center justify-center gap-6">
          {/* FRONT OF THE ID CARD */}
          <div className="w-full max-w-[420px] bg-white rounded-2xl border-2 border-emerald-900 shadow-xl overflow-hidden relative">
            {/* Islamic Gold & Emerald Top Header */}
            <div className="bg-gradient-to-r from-[#021d16] via-[#042f24] to-[#064e3b] text-white p-3.5 relative">
              <div className="flex items-center justify-between gap-2.5">
                {/* Official Logo */}
                <div className="w-13 h-11 rounded-lg overflow-hidden ring-1 ring-amber-400 bg-black flex items-center justify-center p-0.5 shrink-0">
                  <img
                    src={instituteSettings.logoUrl}
                    alt={instituteSettings.instituteName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center flex-1">
                  <span className="text-[10px] text-amber-300 font-calligraphy block">
                    بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
                  </span>
                  <h4 className="font-calligraphy text-lg font-bold text-amber-300 leading-tight">
                    {instituteSettings.instituteName}
                  </h4>
                  <p className="text-[9px] text-emerald-200 font-medium">
                    مرکزی دینی ادارہ و دار القرآن · کراچی
                  </p>
                </div>
                {/* Session Badge */}
                <div className="text-left bg-emerald-950/80 px-2 py-1 rounded border border-amber-400/40 shrink-0">
                  <span className="text-[9px] text-amber-300 block font-mono">1447-48H</span>
                  <span className="text-[8px] text-emerald-300 block">طالب علم کارڈ</span>
                </div>
              </div>
            </div>

            {/* Gold separator strip */}
            <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

            {/* Card Body */}
            <div className="p-4 bg-white space-y-3">
              <div className="flex items-start gap-4">
                {/* Student Photo */}
                <div className="relative w-24 h-28 rounded-xl overflow-hidden border-2 border-emerald-800 bg-stone-50 shadow-md shrink-0 flex items-center justify-center">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-900 text-amber-300 flex items-center justify-center text-2xl font-bold font-calligraphy">
                      {student.fullName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Student Identity Information */}
                <div className="flex-1 space-y-1 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">طالب علم کا نام:</span>
                    <h5 className="font-bold text-stone-900 text-base leading-tight">
                      {student.fullName}
                    </h5>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 block">ولدیت:</span>
                    <p className="font-semibold text-stone-800">{student.fatherName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
                    <div>
                      <span className="text-[10px] text-stone-400 block">شعبہ:</span>
                      <span className="font-bold text-emerald-800 text-[11px]">
                        {student.department === 'hifz' ? 'شعبہ حفظ القرآن' : 'شعبہ ناظرہ قرآن'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">شناختی نمبر:</span>
                      <span className="font-mono font-extrabold text-stone-900 text-xs">
                        {student.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="p-1 bg-white border border-stone-200 rounded-xl shadow-xs text-center shrink-0">
                  <StudentQRCode value={`JSA:${student.id}:${student.fullName}`} size={56} />
                  <span className="text-[8px] font-mono text-stone-400 block mt-0.5">QR Verify</span>
                </div>
              </div>

              {/* Real Code 128 Barcode Area */}
              <div className="pt-2 border-t border-dashed border-stone-200 text-center bg-stone-50/70 p-2 rounded-xl">
                <StudentBarcode studentId={student.id} width={1.4} height={34} fontSize={11} />
              </div>
            </div>

            {/* Bottom Footer Strip */}
            <div className="bg-[#042f24] text-white px-3 py-1.5 flex items-center justify-between text-[9px]">
              <span className="text-emerald-300">فون: {instituteSettings.phone}</span>
              <span className="text-amber-300 font-calligraphy">دستخط مہتمم / ناظم</span>
              <span className="text-emerald-300">{instituteSettings.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
