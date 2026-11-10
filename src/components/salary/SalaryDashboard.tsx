import React, { useState, useMemo } from 'react';
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Printer,
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  Edit,
  Trash2,
  Receipt,
  Eye,
  Camera,
  RotateCcw
} from 'lucide-react';
import { StaffMember, MonthlySalaryRecord, SalaryStats, InstituteSettings } from '../../types';

interface SalaryDashboardProps {
  staffList: StaffMember[];
  salaryRecords: MonthlySalaryRecord[];
  salaryStats: SalaryStats;
  currentMonth: string;
  currentMonthUrdu: string;
  currentYear: number;
  onChangeMonth: (monthStr: string, monthUrdu: string, year: number) => void;
  onOpenNewStaff: () => void;
  onEditStaff: (staff: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
  onOpenPaymentModal: (staff: StaffMember, record: MonthlySalaryRecord) => void;
  onOpenReceiptModal: (staff: StaffMember, record: MonthlySalaryRecord) => void;
  onUpdateSalaryRecord: (record: MonthlySalaryRecord) => Promise<void>;
  instituteSettings: InstituteSettings;
}

const MONTHS_URDU = [
  { val: '01', name: 'جنوری' },
  { val: '02', name: 'فروری' },
  { val: '03', name: 'مارچ' },
  { val: '04', name: 'اپریل' },
  { val: '05', name: 'مئی' },
  { val: '06', name: 'جون' },
  { val: '07', name: 'جولائی' },
  { val: '08', name: 'اگست' },
  { val: '09', name: 'ستمبر' },
  { val: '10', name: 'اکتوبر' },
  { val: '11', name: 'نومبر' },
  { val: '12', name: 'دسمبر' },
];

export const SalaryDashboard: React.FC<SalaryDashboardProps> = ({
  staffList,
  salaryRecords,
  salaryStats,
  currentMonth,
  currentMonthUrdu,
  currentYear,
  onChangeMonth,
  onOpenNewStaff,
  onEditStaff,
  onDeleteStaff,
  onOpenPaymentModal,
  onOpenReceiptModal,
  onUpdateSalaryRecord,
  instituteSettings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MonthlySalaryRecord>>({});
  const [isSavingRow, setIsSavingRow] = useState(false);

  // Month navigation
  const currentMonthNum = parseInt(currentMonth.split('-')[1] || '5', 10);

  const handlePrevMonth = () => {
    let newM = currentMonthNum - 1;
    let newY = currentYear;
    if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    const mStr = `${newY}-${newM < 10 ? '0' : ''}${newM}`;
    const mUrdu = `${MONTHS_URDU[newM - 1].name} ${newY}`;
    onChangeMonth(mStr, mUrdu, newY);
  };

  const handleNextMonth = () => {
    let newM = currentMonthNum + 1;
    let newY = currentYear;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    }
    const mStr = `${newY}-${newM < 10 ? '0' : ''}${newM}`;
    const mUrdu = `${MONTHS_URDU[newM - 1].name} ${newY}`;
    onChangeMonth(mStr, mUrdu, newY);
  };

  // Staff Map for fast join
  const staffMap = useMemo(() => {
    const map = new Map<string, StaffMember>();
    staffList.forEach((s) => map.set(s.id, s));
    return map;
  }, [staffList]);

  // Combined Rows
  const tableRows = useMemo(() => {
    return salaryRecords
      .map((rec, index) => {
        const staff = staffMap.get(rec.staffId) || {
          id: rec.staffId,
          name: 'نامعلوم ملازم',
          fatherName: '—',
          designation: 'ملازم',
          department: 'عام',
          mobileNumber: '—',
          address: '—',
          joiningDate: '—',
          monthlySalary: rec.baseSalary,
          status: 'active' as const,
          createdAt: '',
        };
        return {
          sr: index + 1,
          record: rec,
          staff,
        };
      })
      .filter(({ staff, record }) => {
        const matchesSearch =
          staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.designation.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = selectedDept === 'all' || staff.department === selectedDept;
        const matchesStatus = selectedStatus === 'all' || record.paymentStatus === selectedStatus;

        return matchesSearch && matchesDept && matchesStatus;
      });
  }, [salaryRecords, staffMap, searchTerm, selectedDept, selectedStatus]);

  // Departments List
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    staffList.forEach((s) => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set);
  }, [staffList]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'نمبر شمار',
      'شناختی نمبر',
      'ملازم کا نام',
      'عہدہ',
      'شعبہ',
      'بنیادی تنخواہ',
      'حاضری ایام',
      'رخصت',
      'تاخیر',
      'الاؤنسز',
      'کٹوتیاں',
      'ایڈوانس',
      'قابلِ ادائیگی',
      'ادا شدہ رقم',
      'بقایا رقم',
      'اسٹیٹس',
    ];

    const rows = tableRows.map(({ sr, staff, record }) => [
      sr,
      staff.id,
      staff.name,
      staff.designation,
      staff.department,
      record.baseSalary,
      record.attendanceDays,
      record.leaveDays,
      record.lateDays,
      record.allowances,
      record.deductions,
      record.advance,
      record.netPayable,
      record.paidAmount,
      record.remainingAmount,
      record.paymentStatus === 'paid' ? 'مکمل ادا شدہ' : record.paymentStatus === 'partial' ? 'جزوی' : 'واجب الادا',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Salary_Register_${currentMonth}_Jamia_Salahuddin.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartEditRow = (record: MonthlySalaryRecord) => {
    setEditingRowId(record.id);
    setEditFormData({
      attendanceDays: record.attendanceDays,
      leaveDays: record.leaveDays,
      lateDays: record.lateDays,
      allowances: record.allowances,
      deductions: record.deductions,
      advance: record.advance,
      notes: record.notes,
    });
  };

  const handleSaveRow = async (record: MonthlySalaryRecord) => {
    setIsSavingRow(true);
    try {
      const allowances = Number(editFormData.allowances ?? record.allowances);
      const deductions = Number(editFormData.deductions ?? record.deductions);
      const advance = Number(editFormData.advance ?? record.advance);
      const netPayable = Math.max(0, record.baseSalary + allowances - deductions - advance);
      const paidAmount = Number(record.paidAmount);
      const remainingAmount = Math.max(0, netPayable - paidAmount);
      const paymentStatus: 'paid' | 'partial' | 'pending' =
        remainingAmount <= 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'pending';

      const updated: MonthlySalaryRecord = {
        ...record,
        attendanceDays: Number(editFormData.attendanceDays ?? record.attendanceDays),
        leaveDays: Number(editFormData.leaveDays ?? record.leaveDays),
        lateDays: Number(editFormData.lateDays ?? record.lateDays),
        allowances,
        deductions,
        advance,
        netPayable,
        paidAmount,
        remainingAmount,
        paymentStatus,
        notes: editFormData.notes ?? record.notes,
        updatedAt: new Date().toISOString(),
      };

      await onUpdateSalaryRecord(updated);
      setEditingRowId(null);
    } catch {
      alert('ریکارڈ محفوظ کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsSavingRow(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expense */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-emerald-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600">کل ماہانہ تنخواہ خرچ</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-950 block">
            {salaryStats.totalMonthlyExpense.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            برائے ماہ: {currentMonthUrdu}
          </span>
        </div>

        {/* Paid Amount */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-emerald-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600">کل ادا شدہ رقم</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-mono text-teal-700 block">
            {salaryStats.totalPaid.toLocaleString()}
          </span>
          <span className="text-[11px] text-teal-600 mt-1 block">
            بذریعہ نقد و بینک
          </span>
        </div>

        {/* Remaining Outstanding */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-rose-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600">کل بقایا / واجب الادا</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-mono text-rose-700 block">
            {salaryStats.totalRemaining.toLocaleString()}
          </span>
          <span className="text-[11px] text-rose-500 mt-1 block">
            غیر ادا شدہ رقم
          </span>
        </div>

        {/* Total Staff */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-amber-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600">کل رجسٹرڈ ملازمین و اساتذہ</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-mono text-stone-900 block">
            {salaryStats.totalStaff}
          </span>
          <span className="text-[11px] text-amber-700 mt-1 block">
            {salaryStats.activeStaff} فعال ملازمین
          </span>
        </div>
      </div>

      {/* 2. CONTROLS BAR: Month Selector & Action Buttons */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Month Selector with Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNextMonth}
            title="اگلا مہینہ"
            className="p-2 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="px-4 py-2 rounded-xl bg-emerald-950 text-amber-300 border border-emerald-800 flex items-center gap-2 shadow-xs">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="font-calligraphy text-base font-bold">
              رجسٹر تنخواہ: {currentMonthUrdu}
            </span>
          </div>

          <button
            onClick={handlePrevMonth}
            title="پچھلا مہینہ"
            className="p-2 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* New Staff Button (Prominent) */}
          <button
            onClick={onOpenNewStaff}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>نیا ملازم شامل کریں</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="py-2 px-3.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-800" />
            <span>ایکسل ایکسپورٹ</span>
          </button>

          {/* Print Register */}
          <button
            onClick={() => window.print()}
            className="py-2 px-3.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>رجسٹر پرنٹ</span>
          </button>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="ملازم کا نام، شناختی نمبر یا عہدہ تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          />
        </div>

        {/* Filter Department */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="py-2 px-3 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          >
            <option value="all">تمام شعبہ جات ({staffList.length})</option>
            {departmentsList.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          >
            <option value="all">تمام ادائیگی اسٹیٹس</option>
            <option value="paid">مکمل ادا شدہ (Paid)</option>
            <option value="partial">جزوی ادائیگی (Partial)</option>
            <option value="pending">واجب الادا (Pending)</option>
          </select>
        </div>
      </div>

      {/* 4. MAIN SALARY REGISTER TABLE (Matching Paper Register Columns) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-calligraphy text-lg font-bold text-emerald-950">
              ماہانہ رجسٹرِ تنخواہ ملازمین و اساتذہ
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold">
              {tableRows.length} ملازمین
            </span>
          </div>

          <span className="text-[11px] text-stone-500 font-mono" dir="ltr">
            Session: {instituteSettings.academicYear}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#042f24] text-amber-300 font-bold border-b border-emerald-900">
              <tr>
                <th className="p-3 text-center">شمار</th>
                <th className="p-3">شناختی نمبر و نام ملازم</th>
                <th className="p-3">عہدہ و شعبہ</th>
                <th className="p-3 text-center">ماہانہ تنخواہ</th>
                <th className="p-3 text-center">حاضری</th>
                <th className="p-3 text-center">رخصت</th>
                <th className="p-3 text-center">الاؤنس</th>
                <th className="p-3 text-center">کٹوتیاں</th>
                <th className="p-3 text-center">پیشگی/ایڈوانس</th>
                <th className="p-3 text-center font-extrabold text-white">قابلِ ادائیگی</th>
                <th className="p-3 text-center text-teal-300">ادا شدہ رقم</th>
                <th className="p-3 text-center text-rose-300">بقایا رقم</th>
                <th className="p-3 text-center">اسٹیٹس</th>
                <th className="p-3 text-center no-print">ایکشنز</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-8 text-center text-stone-500">
                    کوئی ملازم یا تنخواہ کا ریکارڈ نہیں ملا۔
                  </td>
                </tr>
              ) : (
                tableRows.map(({ sr, staff, record }) => {
                  const isEditingThisRow = editingRowId === record.id;

                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-stone-50 transition-colors ${
                        record.paymentStatus === 'paid'
                          ? 'bg-white'
                          : record.paymentStatus === 'partial'
                          ? 'bg-amber-50/20'
                          : 'bg-rose-50/20'
                      }`}
                    >
                      {/* 1. نمبر شمار */}
                      <td className="p-3 text-center font-mono text-stone-500 font-semibold">
                        {sr}
                      </td>

                      {/* 2. شناختی نمبر و نام */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden ring-1 ring-emerald-700/20">
                            {staff.photoUrl ? (
                              <img src={staff.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              staff.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="font-calligraphy text-sm font-bold text-stone-900 block leading-tight">
                              {staff.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {staff.id} • ولد: {staff.fatherName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. عہدہ و شعبہ */}
                      <td className="p-3">
                        <span className="font-semibold text-stone-800 block text-xs">
                          {staff.designation}
                        </span>
                        <span className="text-[10px] text-emerald-800 block">
                          {staff.department}
                        </span>
                      </td>

                      {/* 4. بنیادی تنخواہ */}
                      <td className="p-3 text-center font-mono font-bold text-stone-900">
                        {record.baseSalary.toLocaleString()}
                      </td>

                      {/* 5. حاضری ایام */}
                      <td className="p-3 text-center font-mono">
                        {isEditingThisRow ? (
                          <input
                            type="number"
                            value={editFormData.attendanceDays ?? record.attendanceDays}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, attendanceDays: Number(e.target.value) })
                            }
                            className="w-12 text-center border rounded p-1 text-xs font-mono"
                          />
                        ) : (
                          `${record.attendanceDays} دن`
                        )}
                      </td>

                      {/* 6. رخصت ایام */}
                      <td className="p-3 text-center font-mono">
                        {isEditingThisRow ? (
                          <input
                            type="number"
                            value={editFormData.leaveDays ?? record.leaveDays}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, leaveDays: Number(e.target.value) })
                            }
                            className="w-12 text-center border rounded p-1 text-xs font-mono"
                          />
                        ) : (
                          <span className={record.leaveDays > 0 ? 'text-amber-700 font-bold' : 'text-stone-400'}>
                            {record.leaveDays}
                          </span>
                        )}
                      </td>

                      {/* 7. الاؤنسز */}
                      <td className="p-3 text-center font-mono">
                        {isEditingThisRow ? (
                          <input
                            type="number"
                            value={editFormData.allowances ?? record.allowances}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, allowances: Number(e.target.value) })
                            }
                            className="w-16 text-center border rounded p-1 text-xs font-mono"
                          />
                        ) : record.allowances > 0 ? (
                          <span className="text-emerald-700 font-bold font-mono">
                            +{record.allowances.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>

                      {/* 8. کٹوتیاں */}
                      <td className="p-3 text-center font-mono">
                        {isEditingThisRow ? (
                          <input
                            type="number"
                            value={editFormData.deductions ?? record.deductions}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, deductions: Number(e.target.value) })
                            }
                            className="w-16 text-center border rounded p-1 text-xs font-mono text-rose-700"
                          />
                        ) : record.deductions > 0 ? (
                          <span className="text-rose-700 font-bold font-mono">
                            -{record.deductions.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>

                      {/* 9. پیشگی / ایڈوانس */}
                      <td className="p-3 text-center font-mono">
                        {isEditingThisRow ? (
                          <input
                            type="number"
                            value={editFormData.advance ?? record.advance}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, advance: Number(e.target.value) })
                            }
                            className="w-16 text-center border rounded p-1 text-xs font-mono text-amber-700"
                          />
                        ) : record.advance > 0 ? (
                          <span className="text-amber-700 font-bold font-mono">
                            {record.advance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>

                      {/* 10. قابلِ ادائیگی تنخواہ */}
                      <td className="p-3 text-center font-mono font-extrabold text-stone-950 bg-stone-50">
                        {record.netPayable.toLocaleString()}
                      </td>

                      {/* 11. ادا شدہ رقم */}
                      <td className="p-3 text-center font-mono font-bold text-teal-800">
                        {record.paidAmount.toLocaleString()}
                      </td>

                      {/* 12. بقایا رقم */}
                      <td className="p-3 text-center font-mono font-bold text-rose-700">
                        {record.remainingAmount > 0 ? record.remainingAmount.toLocaleString() : '۰'}
                      </td>

                      {/* 13. ادائیگی اسٹیٹس */}
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            record.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : record.paymentStatus === 'partial'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {record.paymentStatus === 'paid' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>ادا شدہ</span>
                            </>
                          ) : record.paymentStatus === 'partial' ? (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>جزوی</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>واجب الادا</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* 14. ایکشنز */}
                      <td className="p-3 text-center no-print">
                        <div className="flex items-center justify-center gap-1.5">
                          {isEditingThisRow ? (
                            <button
                              onClick={() => handleSaveRow(record)}
                              disabled={isSavingRow}
                              className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                            >
                              محفوظ
                            </button>
                          ) : (
                            <>
                              {/* Payment Button */}
                              <button
                                onClick={() => onOpenPaymentModal(staff, record)}
                                title="ادائیگی درج کریں"
                                className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                              </button>

                              {/* Receipt Button */}
                              <button
                                onClick={() => onOpenReceiptModal(staff, record)}
                                title="رسید پرنٹ کریں"
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                              >
                                <Receipt className="w-3.5 h-3.5 text-emerald-800" />
                              </button>

                              {/* Edit Salary Line */}
                              <button
                                onClick={() => handleStartEditRow(record)}
                                title="کٹوتیاں / الاؤنسز ایڈجسٹ کریں"
                                className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-700 transition-colors cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Staff Record */}
                              <button
                                onClick={() => onEditStaff(staff)}
                                title="ملازم پروفائل ایڈٹ کریں"
                                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
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
