import React, { useState } from 'react';
import {
  X,
  ScanLine,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  Camera,
  RotateCcw,
  Printer
} from 'lucide-react';
import { Student, InstituteSettings } from '../../types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  attendanceState: Record<string, 'present' | 'absent' | 'leave'>;
  onUpdateAttendance: (studentId: string, status: 'present' | 'absent' | 'leave') => void;
  onViewStudentProfile: (student: Student) => void;
  instituteSettings: InstituteSettings;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  students,
  attendanceState,
  onUpdateAttendance,
  onViewStudentProfile,
  instituteSettings,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isScanningSim, setIsScanningSim] = useState(true);
  const [recentScans, setRecentScans] = useState<Array<{
    student: Student;
    time: string;
    status: 'present' | 'absent' | 'leave';
  }>>([]);

  if (!isOpen) return null;

  const handleLookup = (query: string) => {
    const clean = query.trim().toUpperCase();
    if (!clean) {
      setMatchedStudent(null);
      setScanMessage(null);
      return;
    }

    const found = students.find(
      (s) =>
        s.id.toUpperCase() === clean ||
        s.id.replace(/[^0-9]/g, '').endsWith(clean) ||
        s.fullName.includes(query.trim())
    );

    if (found) {
      setMatchedStudent(found);
      setScanMessage({
        text: `طالب علم مل گیا: ${found.fullName} (${found.id})`,
        type: 'success',
      });
    } else {
      setMatchedStudent(null);
      setScanMessage({
        text: 'اس بارکوڈ یا شناختی نمبر کا طالب علم نہیں ملا۔',
        type: 'error',
      });
    }
  };

  const handleMarkAttendance = (status: 'present' | 'absent' | 'leave') => {
    if (!matchedStudent) return;
    onUpdateAttendance(matchedStudent.id, status);

    const timeStr = new Date().toLocaleTimeString('ur-PK', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setRecentScans((prev) => [
      { student: matchedStudent, time: timeStr, status },
      ...prev.slice(0, 7),
    ]);

    const statusUrdu =
      status === 'present' ? 'حاضر' : status === 'absent' ? 'غیر حاضر' : 'رخصت';

    setScanMessage({
      text: `${matchedStudent.fullName} کی حاضری (${statusUrdu}) درج کر لی گئی۔`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042f24] to-[#064e3b] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-calligraphy text-xl font-bold text-amber-300">
                بارکوڈ و شناختی اسکینر
              </h3>
              <p className="text-xs text-emerald-200">
                طلباء شناختی کارڈ بارکوڈ اسکیننگ اور فوری حاضری درج کرنے کا نظام
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

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Scanner Simulation Viewport */}
          <div className="relative rounded-2xl bg-stone-900 border-2 border-emerald-800/80 overflow-hidden text-center text-white p-6 shadow-inner">
            <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

            {/* Glowing Laser Scan Line Animation */}
            {isScanningSim && (
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-pulse pointer-events-none" />
            )}

            <div className="relative z-10 max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-amber-300 font-medium">
                <Camera className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>لیزر و کیمرہ اسکینر تیار ہے — بارکوڈ اسکین کریں یا آئی ڈی درج کریں</span>
              </div>

              {/* Input Box for Barcode Scanner Hardware / Manual Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <ScanLine className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="بارکوڈ / آئی ڈی (مثال: JSA-2026-0101)"
                    value={barcodeInput}
                    onChange={(e) => {
                      setBarcodeInput(e.target.value);
                      handleLookup(e.target.value);
                    }}
                    autoFocus
                    className="w-full pr-10 pl-4 py-2.5 bg-stone-800 text-amber-300 border border-stone-700 rounded-xl font-mono text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>
                {barcodeInput && (
                  <button
                    onClick={() => {
                      setBarcodeInput('');
                      setMatchedStudent(null);
                      setScanMessage(null);
                    }}
                    className="p-2.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Sample Selector */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                <span className="text-[11px] text-stone-400">فوری ٹیسٹ بارکوڈز:</span>
                {students.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setBarcodeInput(s.id);
                      handleLookup(s.id);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 hover:bg-emerald-900 border border-stone-700 text-emerald-300 font-mono transition-colors cursor-pointer"
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scan Result Notice */}
          {scanMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                scanMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : scanMessage.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-700" />
              <span className="font-medium">{scanMessage.text}</span>
            </div>
          )}

          {/* Matched Student Profile Card */}
          {matchedStudent && (
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-800/40 bg-gradient-to-br from-emerald-50/60 to-white shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-3 ring-amber-400/80 shadow-md bg-stone-100 shrink-0">
                  <img
                    src={matchedStudent.photoUrl || '/assets/aistudio/image_414e9cbc.png'}
                    alt={matchedStudent.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-right space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="font-calligraphy text-xl font-bold text-stone-900">
                      {matchedStudent.fullName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-amber-300 font-mono text-xs">
                      {matchedStudent.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-medium">
                      {matchedStudent.department === 'hifz' ? 'شعبہ حفظ القرآن' : 'شعبہ ناظرہ'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    ولدیت: <strong className="text-stone-900">{matchedStudent.fatherName}</strong> | استاد محترم: {matchedStudent.teacherName}
                  </p>
                  <p className="text-xs text-stone-500 font-mono" dir="ltr">
                    موبائل: {matchedStudent.fatherMobileNumber || 'درج نہیں'} | پارہ: {matchedStudent.currentParaOrLevel}
                  </p>
                </div>

                <button
                  onClick={() => onViewStudentProfile(matchedStudent)}
                  className="py-1.5 px-3 rounded-xl border border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>کارڈ و سلپ پرنٹ</span>
                </button>
              </div>

              {/* Attendance Quick Action Buttons */}
              <div className="pt-3 border-t border-emerald-800/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-stone-700">
                    آج کی حاضری اسٹیٹس لگائیں:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkAttendance('present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        attendanceState[matchedStudent.id] === 'present'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>حاضر (Present)</span>
                    </button>
                    <button
                      onClick={() => handleMarkAttendance('absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        attendanceState[matchedStudent.id] === 'absent'
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-rose-100 hover:bg-rose-200 text-rose-900'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>غیر حاضر (Absent)</span>
                    </button>
                    <button
                      onClick={() => handleMarkAttendance('leave')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        attendanceState[matchedStudent.id] === 'leave'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>رخصت (Leave)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Scans Session Log */}
          {recentScans.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-800" />
                <span>حالیہ اسکینز لاگ (Session Log)</span>
              </h4>
              <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                {recentScans.map((scan, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-stone-500">{scan.time}</span>
                      <strong className="text-stone-900">{scan.student.fullName}</strong>
                      <span className="text-[10px] font-mono text-stone-500">({scan.student.id})</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        scan.status === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : scan.status === 'absent'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {scan.status === 'present' ? 'حاضر' : scan.status === 'absent' ? 'غیر حاضر' : 'رخصت'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
