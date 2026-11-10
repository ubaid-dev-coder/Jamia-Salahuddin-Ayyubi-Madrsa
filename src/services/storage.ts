import { Student, ActivityLog, MadrasaStats } from '../types';
import { INITIAL_STUDENTS, INITIAL_ACTIVITIES } from '../data/mockData';

const STUDENTS_KEY = 'jamia_salahuddin_students';
const ACTIVITIES_KEY = 'jamia_salahuddin_activities';
const ATTENDANCE_KEY = 'jamia_salahuddin_attendance';

export const storageService = {
  getStudents: (): Student[] => {
    try {
      const stored = localStorage.getItem(STUDENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // initialize
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  },

  saveStudents: (students: Student[]): void => {
    try {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  },

  addStudent: (studentData: Omit<Student, 'id' | 'createdAt'>): Student => {
    const students = storageService.getStudents();
    const count = students.length + 1;
    const year = new Date().getFullYear();
    const newId = `JSA-${year}-${String(100 + count).padStart(4, '0')}`;
    
    const newStudent: Student = {
      ...studentData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    const updated = [newStudent, ...students];
    storageService.saveStudents(updated);

    // Record activity
    storageService.addActivity({
      id: `ACT-${Date.now()}`,
      title: 'نیا طالب علم داخل کیا گیا',
      description: `طالب علم "${newStudent.fullName}" کا شعبہ ${newStudent.department === 'hifz' ? 'حفظ القرآن' : 'ناظرہ قرآن'} میں داخلہ درج کیا گیا۔`,
      timestamp: 'ابھی',
      type: 'admission',
      studentName: newStudent.fullName,
    });

    return newStudent;
  },

  updateStudent: (student: Student): Student => {
    const students = storageService.getStudents();
    const updated = students.map((s) => (s.id === student.id ? student : s));
    storageService.saveStudents(updated);
    return student;
  },

  deleteStudent: (id: string): boolean => {
    const students = storageService.getStudents();
    const studentToDelete = students.find((s) => s.id === id);
    const updated = students.filter((s) => s.id !== id);
    storageService.saveStudents(updated);

    if (studentToDelete) {
      storageService.addActivity({
        id: `ACT-${Date.now()}`,
        title: 'طالب علم کا اخراج',
        description: `طالب علم "${studentToDelete.fullName}" (داخلہ نمبر ${studentToDelete.id}) کو خارج کر دیا گیا۔`,
        timestamp: 'ابھی',
        type: 'admission',
        studentName: studentToDelete.fullName,
      });
    }

    return true;
  },

  getActivities: (): ActivityLog[] => {
    try {
      const stored = localStorage.getItem(ACTIVITIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
    return INITIAL_ACTIVITIES;
  },

  addActivity: (activity: ActivityLog): void => {
    const activities = storageService.getActivities();
    const updated = [activity, ...activities.slice(0, 19)]; // keep 20 max
    try {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  getAttendanceState: (): Record<string, 'present' | 'absent' | 'leave'> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = localStorage.getItem(`${ATTENDANCE_KEY}_${today}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default attendance: 92% present
    const students = storageService.getStudents();
    const initialMap: Record<string, 'present' | 'absent' | 'leave'> = {};
    students.forEach((s, idx) => {
      if (idx === 2) initialMap[s.id] = 'leave';
      else if (idx === 6) initialMap[s.id] = 'absent';
      else initialMap[s.id] = 'present';
    });
    return initialMap;
  },

  saveAttendanceState: (map: Record<string, 'present' | 'absent' | 'leave'>): void => {
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`${ATTENDANCE_KEY}_${today}`, JSON.stringify(map));
    } catch {
      // ignore
    }
  },

  getStats: (): MadrasaStats => {
    const students = storageService.getStudents();
    const attendance = storageService.getAttendanceState();
    
    const totalStudents = students.length;
    const totalMale = students.filter((s) => s.gender === 'male').length;
    const totalFemale = students.filter((s) => s.gender === 'female').length;
    const totalHifz = students.filter((s) => s.department === 'hifz').length;
    const totalNazra = students.filter((s) => s.department === 'nazra').length;

    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    students.forEach((s) => {
      const status = attendance[s.id] || 'present';
      if (status === 'present') presentCount++;
      else if (status === 'absent') absentCount++;
      else if (status === 'leave') leaveCount++;
    });

    let totalMonthlyFees = 0;
    let paidFeesCount = 0;
    let pendingFeesCount = 0;

    students.forEach((s) => {
      totalMonthlyFees += s.monthlyFee || 0;
      if (s.feeStatus === 'paid') paidFeesCount++;
      else if (s.feeStatus === 'pending') pendingFeesCount++;
    });

    const rate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 100;

    return {
      totalStudents,
      totalMale,
      totalFemale,
      totalHifz,
      totalNazra,
      todayAttendanceRate: rate,
      presentCount,
      absentCount,
      leaveCount,
      totalMonthlyFees,
      paidFeesCount,
      pendingFeesCount,
    };
  },

  resetDemoData: (): void => {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
  }
};
