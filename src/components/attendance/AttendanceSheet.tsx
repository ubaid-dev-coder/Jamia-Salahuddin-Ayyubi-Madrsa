import React, { useState } from 'react';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  Printer,
  Sparkles,
  Save,
  Search,
  Filter
} from 'lucide-react';
import { Student } from '../../types';

interface AttendanceSheetProps {
  students: Student[];
  attendanceState: Record<string, 'present' | 'absent' | 'leave'>;
  onSaveAttendance: (map: Record<string, 'present' | 'absent' | 'leave'>) => void;
}

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  students,
  attendanceState,
  onSaveAttendance,
}) => {
  const [currentAttendance, setCurrentAttendance] = useState(attendanceState);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<'all' | 'hifz' | 'nazra'>('all');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.includes(searchTerm) || s.id.includes(searchTerm);
    const matchesDept = selectedDept === 'all' || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleStatusChange = (
    studentId: string,
    status: 'present' | 'absent' | 'leave'
  ) => {
    setCurrentAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setSavedSuccess(false);
  };

  const handleMarkAll = (status: 'present' | 'absent' | 'leave') => {
    const updated = { ...currentAttendance };
    filteredStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setCurrentAttendance(updated);
    setSavedSuccess(false);
  };

  const handleSave = () => {
    onSaveAttendance(currentAttendance);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Stats calculation
  const total = students.length;
  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;

  students.forEach((s) => {
    const st = currentAttendance[s.id] || 'present';
    if (st === 'present') presentCount++;
    else if (st === 'absent') absentCount++;
    else if (st === 'leave') leaveCount++;
  });

  const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-700 rounded-xs inline-block" />
            <h2 className="text-xl font-bold text-stone-900">
              یومیہ حاضری رجسٹر — جامعہ صلاح الدین ایوبی
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            آج کی تاریخ: ۸ نومبر ۲۰۲۶ء بمطابق ۲۸ شوال ۱۴۴۷ھ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="py-2 px-3.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>حاضری شیٹ پرنٹ کریں</span>
          </button>

          <button
            onClick={handleSave}
            className="py-2 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حاضری محفوظ کریں</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <span>ماشاء اللہ! آج کی حاضری کامیابی کے ساتھ محفوظ کر لی گئی ہے۔</span>
          <span className="text-emerald-600 font-mono">محفوظ شدہ</span>
        </div>
      )}

      {/* 4 Attendance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">کل حاضری تناسب</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-emerald-800 tabular-nums">
              {percentage}%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-emerald-700 block">حاضر طلبہ (Present)</span>
          <span className="text-3xl font-bold font-mono text-emerald-700 tabular-nums mt-1 block">
            {presentCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-red-600 block">غیر حاضر (Absent)</span>
          <span className="text-3xl font-bold font-mono text-red-600 tabular-nums mt-1 block">
            {absentCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-blue-600 block">رخصت باقاعدہ (On Leave)</span>
          <span className="text-3xl font-bold font-mono text-blue-600 tabular-nums mt-1 block">
            {leaveCount}
          </span>
        </div>
      </div>

      {/* Filter and Quick Mark Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="طالب علم کا نام یا داخلہ نمبر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
          >
            <option value="all">تمام شعبہ جات</option>
            <option value="hifz">شعبہ حفظ القرآن</option>
            <option value="nazra">شعبہ ناظرہ قرآن</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 ml-1">اجتماعی نشان دہی:</span>
          <button
            onClick={() => handleMarkAll('present')}
            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium cursor-pointer"
          >
            سب کو حاضر کریں
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            className="px-2.5 py-1 text-xs rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors font-medium cursor-pointer"
          >
            سب کو غیر حاضر
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-semibold">
                <th className="py-3 px-4">داخلہ نمبر</th>
                <th className="py-3 px-4">طالب علم کا نام</th>
                <th className="py-3 px-4">شعبہ / درجہ</th>
                <th className="py-3 px-4">نگران قاری / استاد</th>
                <th className="py-3 px-4 text-center">حاضری کی حیثیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
              {filteredStudents.map((student) => {
                const status = currentAttendance[student.id] || 'present';
                return (
                  <tr
                    key={student.id}
                    className="hover:bg-stone-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-emerald-800">
                      {student.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900">{student.fullName}</p>
                      <p className="text-[11px] text-stone-500">
                        ولد: {student.fatherName}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-stone-700">
                        {student.department === 'hifz'
                          ? 'شعبہ حفظ القرآن'
                          : 'شعبہ ناظرہ قرآن'}
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        {student.currentParaOrLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{student.teacherName}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
                        <button
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            status === 'present'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-stone-600 hover:text-emerald-800'
                          }`}
                        >
                          حاضر
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            status === 'absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'text-stone-600 hover:text-red-700'
                          }`}
                        >
                          غیر حاضر
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'leave')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            status === 'leave'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-stone-600 hover:text-blue-700'
                          }`}
                        >
                          رخصت
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
