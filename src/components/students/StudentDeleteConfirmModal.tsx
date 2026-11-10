import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Student } from '../../types';

interface StudentDeleteConfirmModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const StudentDeleteConfirmModal: React.FC<StudentDeleteConfirmModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 p-6 flex items-start gap-4 border-b border-red-100">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-950">
              طالب علم کے اخراج کی تصدیق
            </h3>
            <p className="text-xs text-red-700 mt-1">
              کیا آپ واقعی اس طالب علم کو جامعہ کے ریکارڈ سے خارج کرنا چاہتے ہیں؟
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 mr-auto p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3 text-sm text-stone-700 bg-white">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-stone-500">طالب علم کا نام:</span>
              <span className="font-bold text-stone-900">{student.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">والد کا نام:</span>
              <span className="font-medium text-stone-800">{student.fatherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">داخلہ نمبر:</span>
              <span className="font-mono font-semibold text-emerald-800">{student.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">شعبہ:</span>
              <span>
                {student.department === 'hifz' ? 'شعبہ حفظ القرآن' : 'شعبہ ناظرہ قرآن'}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-500">
            نوٹ: یہ عمل مستقل ہے اور طالب علم کی معلومات حذف کر دی جائیں گی۔
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            منسوخ کریں
          </button>
          <button
            type="button"
            onClick={() => onConfirm(student.id)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>ہاں، اخراج کی تصدیق کریں</span>
          </button>
        </div>
      </div>
    </div>
  );
};
