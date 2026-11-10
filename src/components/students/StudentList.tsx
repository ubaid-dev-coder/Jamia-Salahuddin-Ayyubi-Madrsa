import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Printer,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { Student, DepartmentType, GenderType } from '../../types';

interface StudentListProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onOpenNewStudent: () => void;
  initialDepartmentFilter?: DepartmentType | 'all';
  initialGenderFilter?: GenderType | 'all';
  title?: string;
  subtitle?: string;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenNewStudent,
  initialDepartmentFilter = 'all',
  initialGenderFilter = 'all',
  title = 'تمام طلباء و طالبات کی فہرست',
  subtitle = 'جامعہ صلاح الدین ایوبی کے تمام شعبہ جات کا تفصیلی ریکارڈ',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentType | 'all'>(
    initialDepartmentFilter
  );
  const [genderFilter, setGenderFilter] = useState<GenderType | 'all'>(
    initialGenderFilter
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search Match
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.city.toLowerCase().includes(searchTerm.toLowerCase());

      // Department Match
      const matchesDept =
        departmentFilter === 'all' || student.department === departmentFilter;

      // Gender Match
      const matchesGender =
        genderFilter === 'all' || student.gender === genderFilter;

      // Status Match
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && student.status === 'active') ||
        (statusFilter === 'graduated' && student.status === 'graduated') ||
        (statusFilter === 'pending_fee' && student.feeStatus === 'pending');

      return matchesSearch && matchesDept && matchesGender && matchesStatus;
    });
  }, [students, searchTerm, departmentFilter, genderFilter, statusFilter]);

  const handleExportCSV = () => {
    const headers = [
      'شناختی نمبر',
      'طالب علم کا نام',
      'والد کا نام',
      'شعبہ',
      'جنس',
      'موجودہ پارہ/درجہ',
      'نگران استاد',
      'شہر',
      'موبائل نمبر',
      'تاریخ داخلہ',
      'فیس صورتحال',
    ];

    const rows = filteredStudents.map((s) => [
      s.id,
      s.fullName,
      s.fatherName,
      s.department === 'hifz' ? 'حفظ القرآن' : 'ناظرہ قرآن',
      s.gender === 'male' ? 'بنین (لڑکا)' : 'بنات (لڑکی)',
      s.currentParaOrLevel,
      s.teacherName,
      s.city,
      s.fatherMobileNumber,
      s.admissionDate,
      s.feeStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jamia_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">{title}</h2>
          <p className="text-xs text-stone-500 mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="py-2 px-3.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>ایکسپورٹ CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="py-2 px-3.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>پرنٹ لسٹ</span>
          </button>

          <button
            onClick={onOpenNewStudent}
            className="py-2 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>نیا طالب علم داخل کریں</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="نام، ولدیت یا شناختی نمبر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 text-stone-900"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value as DepartmentType | 'all')
              }
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 text-stone-800"
            >
              <option value="all">تمام شعبہ جات</option>
              <option value="hifz">شعبہ حفظ القرآن</option>
              <option value="nazra">شعبہ ناظرہ قرآن</option>
            </select>
          </div>

          {/* Gender / Section Filter */}
          <div>
            <select
              value={genderFilter}
              onChange={(e) =>
                setGenderFilter(e.target.value as GenderType | 'all')
              }
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 text-stone-800"
            >
              <option value="all">تمام سیکشنز (طلباء و طالبات)</option>
              <option value="male">صرف طلباء (بنین)</option>
              <option value="female">صرف طالبات (بنات)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 text-stone-800"
            >
              <option value="all">تمام حالات (Status)</option>
              <option value="active">زیرِ تعلیم (Active)</option>
              <option value="graduated">تکمیل شدہ (Graduated)</option>
              <option value="pending_fee">فیس واجب الاداء (Pending Fee)</option>
            </select>
          </div>
        </div>

        {/* Results count & Active filters info */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <div>
            <span>تلاش کے نتائج: </span>
            <span className="font-mono font-bold text-emerald-800">
              {filteredStudents.length}
            </span>
            <span> طالب علم برائے فہرست</span>
          </div>

          {(searchTerm ||
            departmentFilter !== 'all' ||
            genderFilter !== 'all' ||
            statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('all');
                setGenderFilter('all');
                setStatusFilter('all');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              تمام فلٹرز ختم کریں
            </button>
          )}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold">
                <th className="py-3.5 px-4">داخلہ نمبر</th>
                <th className="py-3.5 px-4">طالب علم کا نام و ولدیت</th>
                <th className="py-3.5 px-4">تعلیمی شعبہ</th>
                <th className="py-3.5 px-4">سیکشن / جنس</th>
                <th className="py-3.5 px-4">موجودہ پارہ / درجہ</th>
                <th className="py-3.5 px-4">نگران استاد</th>
                <th className="py-3.5 px-4">رابطہ فون</th>
                <th className="py-3.5 px-4 text-center">فیس کی صورتحال</th>
                <th className="py-3.5 px-4 text-center">اقدامات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-500">
                    <p className="font-semibold text-base text-stone-700 mb-1">
                      کوئی طالب علم نہیں ملا
                    </p>
                    <p className="text-xs text-stone-400">
                      برائے مہربانی تلاش کے الفاظ تبدیل کریں یا نیا طالب علم داخل کریں۔
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-emerald-50/40 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-800 whitespace-nowrap">
                        {student.id}
                      </td>

                      {/* Name & Father */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-100 border border-emerald-800/20 shrink-0 flex items-center justify-center font-bold text-xs text-emerald-900 font-calligraphy">
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
                            <p className="font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                              {student.fullName}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              ولد: {student.fatherName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                            student.department === 'hifz'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {student.department === 'hifz'
                            ? 'شعبہ حفظ القرآن'
                            : 'شعبہ ناظرہ قرآن'}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="py-3 px-4 whitespace-nowrap text-stone-600">
                        {student.gender === 'male' ? 'طلباء (بنین)' : 'طالبات (بنات)'}
                      </td>

                      {/* Current Para / Level */}
                      <td className="py-3 px-4 font-medium text-stone-800">
                        {student.currentParaOrLevel}
                      </td>

                      {/* Teacher */}
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                        {student.teacherName}
                      </td>

                      {/* Phone */}
                      <td
                        className="py-3 px-4 font-mono text-stone-600 whitespace-nowrap"
                        dir="ltr"
                      >
                        {student.fatherMobileNumber}
                      </td>

                      {/* Fee status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            student.feeStatus === 'paid'
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : student.feeStatus === 'pending'
                              ? 'text-red-700 bg-red-50 border border-red-200'
                              : 'text-stone-700 bg-stone-100 border border-stone-200'
                          }`}
                        >
                          {student.feeStatus === 'paid'
                            ? 'ادا شدہ'
                            : student.feeStatus === 'pending'
                            ? 'واجب الاداء'
                            : 'وظیفہ'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onViewStudent(student)}
                            title="کوائف نامہ دیکھیں و پرنٹ کارڈ"
                            className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditStudent(student)}
                            title="ترمیم کریں"
                            className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student)}
                            title="اخراج کریں"
                            className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
