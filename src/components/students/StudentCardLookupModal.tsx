import React, { useState } from 'react';
import { X, Search, CreditCard, Printer, Eye, User, Sparkles } from 'lucide-react';
import { Student, InstituteSettings } from '../../types';

interface StudentCardLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSelectStudentForCard: (student: Student) => void;
  instituteSettings: InstituteSettings;
}

export const StudentCardLookupModal: React.FC<StudentCardLookupModalProps> = ({
  isOpen,
  onClose,
  students,
  onSelectStudentForCard,
  instituteSettings,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matches = students.filter(
    (s) =>
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.fullName.includes(query) ||
      s.fatherName.includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-calligraphy text-xl font-bold text-amber-300">
                اسٹوڈنٹ شناختی کارڈ و داخلہ سلپ
              </h3>
              <p className="text-xs text-emerald-200">
                {instituteSettings.instituteName} — تلاش و فوری پرنٹنگ
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

        {/* Search Input */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="طالب علم کا شناختی نمبر (مثلاً JSA-2026-0101) یا نام درج کریں..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
              autoFocus
            />
          </div>

          <div className="text-xs text-stone-500 flex items-center justify-between">
            <span>دستیاب ریکارڈ: {matches.length} طلبہ</span>
            <span className="text-emerald-800 font-medium">کارڈ دیکھنے کے لیے طالب علم پر کلک کریں</span>
          </div>

          {/* Matches List */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {matches.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                اس نام یا شناختی نمبر کا کوئی طالب علم موجود نہیں۔
              </div>
            ) : (
              matches.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    onSelectStudentForCard(student);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/50 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 border border-emerald-800/30 flex items-center justify-center font-bold text-xs text-emerald-900 font-calligraphy shrink-0">
                      {student.photoUrl ? (
                        <img
                          src={student.photoUrl}
                          alt={student.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        student.fullName.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-900">
                        {student.fullName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        ولد: {student.fatherName} · {student.department === 'hifz' ? 'شعبہ حفظ' : 'شعبہ ناظرہ'}
                      </p>
                    </div>
                  </div>

                  <div className="text-left flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                      {student.id}
                    </span>
                    <button className="py-1 px-2.5 rounded-lg bg-emerald-800 text-white text-xs font-medium flex items-center gap-1 group-hover:bg-emerald-700">
                      <Eye className="w-3.5 h-3.5" />
                      <span>کارڈ دیکھیں</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
