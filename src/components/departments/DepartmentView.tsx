import React, { useMemo } from 'react';
import {
  BookOpen,
  BookMarked,
  Users,
  UserCheck,
  UserPlus,
  Clock,
  GraduationCap,
  Sparkles,
  School,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { Student, DepartmentType, GenderType, DepartmentInfo } from '../../types';
import { StudentList } from '../students/StudentList';

interface DepartmentViewProps {
  deptKey: 'hifz' | 'nazra' | 'baneen' | 'banat';
  deptInfo: DepartmentInfo;
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onOpenNewStudentForDept: (dept: DepartmentType, gender: GenderType) => void;
}

export const DepartmentView: React.FC<DepartmentViewProps> = ({
  deptKey,
  deptInfo,
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenNewStudentForDept,
}) => {
  // Filter students based on this department
  const filteredStudents = useMemo(() => {
    if (deptKey === 'hifz') {
      return students.filter((s) => s.department === 'hifz');
    }
    if (deptKey === 'nazra') {
      return students.filter((s) => s.department === 'nazra');
    }
    if (deptKey === 'baneen') {
      return students.filter((s) => s.gender === 'male');
    }
    if (deptKey === 'banat') {
      return students.filter((s) => s.gender === 'female');
    }
    return students;
  }, [students, deptKey]);

  // Derived counts
  const totalInDept = filteredStudents.length;
  const activeCount = filteredStudents.filter((s) => s.status === 'active').length;
  const graduatedCount = filteredStudents.filter((s) => s.status === 'graduated').length;
  const feesPaidCount = filteredStudents.filter((s) => s.feeStatus === 'paid').length;

  const getDeptIcon = () => {
    switch (deptKey) {
      case 'hifz':
        return BookMarked;
      case 'nazra':
        return BookOpen;
      case 'baneen':
        return Users;
      case 'banat':
        return UserCheck;
    }
  };

  const Icon = getDeptIcon();

  const handleAddNew = () => {
    let targetDept: DepartmentType = 'hifz';
    let targetGender: GenderType = 'male';

    if (deptKey === 'hifz') {
      targetDept = 'hifz';
      targetGender = 'male';
    } else if (deptKey === 'nazra') {
      targetDept = 'nazra';
      targetGender = 'male';
    } else if (deptKey === 'baneen') {
      targetDept = 'hifz';
      targetGender = 'male';
    } else if (deptKey === 'banat') {
      targetDept = 'hifz';
      targetGender = 'female';
    }

    onOpenNewStudentForDept(targetDept, targetGender);
  };

  return (
    <div className="space-y-6">
      {/* Department Banner & Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#022c22] via-[#044333] to-[#064e3b] text-white p-6 lg:p-8 shadow-lg border border-emerald-800">
        <div className="absolute top-0 left-0 w-96 h-full bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-amber-300 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-calligraphy">{deptInfo.arabicTitle}</span>
            </div>

            <h1 className="font-calligraphy text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {deptInfo.title}
            </h1>

            <p className="text-emerald-100/90 text-xs lg:text-sm leading-relaxed">
              {deptInfo.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 pt-2 border-t border-emerald-800/60">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                نگرانِ شعبہ: <strong className="text-white">{deptInfo.headOfDepartment}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                اوقات: {deptInfo.timing}
              </span>
            </div>
          </div>

          {/* Quick Registration Button */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={handleAddNew}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>نیا داخلہ ({deptInfo.title})</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mt-8 pt-6 border-t border-emerald-800/60">
          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3.5">
            <span className="text-[11px] text-emerald-300 block">کل درج شدہ طلبہ</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalInDept}
            </span>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3.5">
            <span className="text-[11px] text-emerald-300 block">زیرِ تعلیم (Active)</span>
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
              {activeCount}
            </span>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3.5">
            <span className="text-[11px] text-emerald-300 block">مکمل شدہ / اسناد یافتہ</span>
            <span className="text-2xl font-bold font-mono text-emerald-200 tabular-nums">
              {graduatedCount}
            </span>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3.5">
            <span className="text-[11px] text-emerald-300 block">فیس ادا شدہ طلبہ</span>
            <span className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">
              {feesPaidCount}
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Student Roster with live search, filters, actions */}
      <StudentList
        students={filteredStudents}
        onViewStudent={onViewStudent}
        onEditStudent={onEditStudent}
        onDeleteStudent={onDeleteStudent}
        onOpenNewStudent={handleAddNew}
        initialDepartmentFilter={deptKey === 'hifz' ? 'hifz' : deptKey === 'nazra' ? 'nazra' : 'all'}
        initialGenderFilter={deptKey === 'baneen' ? 'male' : deptKey === 'banat' ? 'female' : 'all'}
        title={`طلباء کی فہرست — ${deptInfo.title}`}
        subtitle={`${deptInfo.title} کے تمام طلبہ کے تعلیمی کوائف اور ریکارڈ`}
      />
    </div>
  );
};
