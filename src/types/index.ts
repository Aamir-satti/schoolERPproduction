// User & Auth Types
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Student Types
export type StudentStatus = 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'DROPPED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Student {
  _id: string;
  userId: User;
  registrationNo: string;
  admissionNo: string;
  admissionDate: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: string;
  religion?: string;
  fatherName: string;
  motherName?: string;
  guardianPhone: string;
  guardianEmail?: string;
  currentAddress?: string;
  permanentAddress?: string;
  classId: ClassInfo;
  section?: SectionInfo;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  registrationNo: string;
  admissionNo: string;
  admissionDate: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: string;
  religion?: string;
  fatherName: string;
  motherName?: string;
  guardianPhone: string;
  guardianEmail?: string;
  currentAddress?: string;
  permanentAddress?: string;
  classId: string;
  sectionId?: string;
}

// Teacher Types
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface Teacher {
  _id: string;
  userId: User;
  employeeId: string;
  designation: string;
  department?: string;
  qualification?: string;
  experience?: number;
  joiningDate: string;
  subjectIds: SubjectInfo[];
  classIds: ClassInfo[];
  isClassTeacher: boolean;
  assignedClassId?: ClassInfo;
  assignedSectionId?: SectionInfo;
  employmentStatus: EmploymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  employeeId: string;
  designation: string;
  department?: string;
  qualification?: string;
  experience?: number;
  joiningDate: string;
  subjectIds: string[];
  classIds: string[];
  isClassTeacher: boolean;
  assignedClassId?: string;
  assignedSectionId?: string;
}

// Class Types
export interface SectionInfo {
  _id: string;
  name: string;
}

export interface ClassInfo {
  _id: string;
  name: string;
  code: string;
  sections: SectionInfo[];
  isActive: boolean;
}

// Subject Types
export interface SubjectInfo {
  _id: string;
  name: string;
  code: string;
  classIds: string[];
  teacherIds: string[];
  isActive: boolean;
}

// Timetable Types
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface TimetableEntry {
  _id: string;
  classId: ClassInfo;
  sectionId: string;
  subjectId: SubjectInfo;
  teacherId: Teacher;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  roomNo?: string;
}

// Attendance Types
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';

export interface AttendanceRecord {
  _id: string;
  studentId: Student;
  classId: ClassInfo;
  date: string;
  status: AttendanceStatus;
  subjectId?: SubjectInfo;
  markedBy: Teacher;
  remarks?: string;
  createdAt: string;
}

export interface AttendanceReport {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percentage: number;
}

// Exam Types
export type ExamTerm = 'FIRST' | 'SECOND' | 'THIRD' | 'FINAL';
export type ExamStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ExamSubject {
  subjectId: SubjectInfo;
  maxMarks: number;
  passingMarks: number;
  examDate: string;
}

export interface Exam {
  _id: string;
  name: string;
  term: ExamTerm;
  academicYear: string;
  classIds: ClassInfo[];
  subjects: ExamSubject[];
  startDate: string;
  endDate: string;
  status: ExamStatus;
  isPublished: boolean;
  createdAt: string;
}

// Marks Types
export interface Mark {
  _id: string;
  studentId: Student;
  examId: Exam;
  subjectId: SubjectInfo;
  obtainedMarks: number;
  maxMarks: number;
  passingMarks: number;
  grade: string;
  remarks?: string;
  enteredBy: Teacher;
  createdAt: string;
}

// Result Types
export interface Result {
  examId: Exam;
  subjects: Mark[];
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string;
  resultStatus: 'PASS' | 'FAIL';
}

// Finance Types
export type FeeFrequency = 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type PaymentMethod = 'CASH' | 'BANK' | 'ONLINE' | 'OTHER';
export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';

export interface FeeComponent {
  name: string;
  amount: number;
  frequency: FeeFrequency;
  dueDay?: number;
}

export interface FeeStructure {
  _id: string;
  name: string;
  classId: ClassInfo;
  academicYear: string;
  components: FeeComponent[];
  totalAmount: number;
  isActive: boolean;
}

export interface FeePayment {
  _id: string;
  studentId: Student;
  feeStructureId: FeeStructure;
  month: string;
  component: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  referenceNo?: string;
  remarks?: string;
  status: PaymentStatus;
  challanNo: string;
  createdAt: string;
}

export interface FeeLedgerEntry {
  month: string;
  component: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: PaymentStatus;
  payments: FeePayment[];
}

export interface SalaryProfile {
  _id: string;
  teacherId: Teacher;
  baseSalary: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  netSalary: number;
  effectiveDate: string;
  isActive: boolean;
}

export interface SalaryRecord {
  _id: string;
  teacherId: Teacher;
  salaryProfileId: SalaryProfile;
  month: string;
  baseSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  paidAmount: number;
  balanceAmount: number;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  referenceNo?: string;
  remarks?: string;
  status: PaymentStatus;
}

// Notification Types
export type NotificationType = 'GENERAL' | 'ACADEMIC' | 'FINANCIAL' | 'EVENT';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isPublic: boolean;
  targetRoles: UserRole[];
  attachmentUrl?: string;
  externalLink?: string;
  publicationDate: string;
  expiryDate?: string;
  createdBy: User;
  isActive: boolean;
  createdAt: string;
}

// Dashboard Types
export interface AdminDashboardData {
  studentCount: number;
  teacherCount: number;
  classCount: number;
  attendanceSummary: {
    presentToday: number;
    absentToday: number;
    totalStudents: number;
  };
  feeSummary: {
    totalDue: number;
    totalCollected: number;
    outstanding: number;
    currentMonthCollection: number;
  };
  salarySummary: {
    totalDue: number;
    totalPaid: number;
    unpaidCount: number;
  };
  recentNotifications: Notification[];
}

export interface TeacherDashboardData {
  assignedClasses: ClassInfo[];
  todayTimetable: TimetableEntry[];
  attendanceTasks: { classId: ClassInfo; date: string; marked: boolean }[];
  upcomingExams: Exam[];
  marksEntryTasks: { examId: Exam; subjectId: SubjectInfo; pending: number }[];
}

export interface StudentDashboardData {
  timetable: TimetableEntry[];
  attendancePercentage: number;
  recentResults: Result[];
  outstandingFee: number;
  notifications: Notification[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
