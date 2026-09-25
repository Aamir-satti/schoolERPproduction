# School Management System — Architecture Document

## 1. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  React + Vite + TypeScript + Tailwind CSS                   │
│  ├── Authentication (JWT tokens)                            │
│  ├── Role-based routing                                     │
│  ├── Axios API client                                       │
│  └── State management (React Context)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                           │
│  Node.js + Express + TypeScript                             │
│  ├── Authentication (JWT)                                   │
│  ├── Authorization (RBAC)                                   │
│  ├── Validation (Zod)                                       │
│  ├── File handling (Multer)                                 │
│  ├── PDF generation (Puppeteer)                             │
│  └── Business logic (Services)                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│  MongoDB                                                    │
│  ├── Collections with indexes                               │
│  ├── Document references                                    │
│  └── Data persistence                                       │
└─────────────────────────────────────────────────────────────┘
```

## 2. PROJECT STRUCTURE

```
school-management-system/
│
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/                     # Axios client & interceptors
│   │   │   └── axios.ts
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/
│   │   │   ├── forms/
│   │   │   └── tables/
│   │   ├── layouts/                 # Layout wrappers
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── TeacherLayout.tsx
│   │   │   ├── StudentLayout.tsx
│   │   │   └── GuestLayout.tsx
│   │   ├── pages/                   # Route pages
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── teacher/
│   │   │   ├── student/
│   │   │   └── guest/
│   │   ├── routes/                  # Route definitions
│   │   │   └── index.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── context/                 # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── services/                # API service modules
│   │   │   ├── authService.ts
│   │   │   ├── studentService.ts
│   │   │   ├── teacherService.ts
│   │   │   ├── attendanceService.ts
│   │   │   ├── examService.ts
│   │   │   ├── financeService.ts
│   │   │   └── notificationService.ts
│   │   ├── utils/                   # Utility functions
│   │   ├── types/                   # TypeScript type definitions
│   │   │   ├── user.ts
│   │   │   ├── student.ts
│   │   │   ├── teacher.ts
│   │   │   ├── attendance.ts
│   │   │   ├── exam.ts
│   │   │   └── finance.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/                  # Configuration
│   │   │   ├── database.ts
│   │   │   ├── env.ts
│   │   │   └── constants.ts
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── studentController.ts
│   │   │   ├── teacherController.ts
│   │   │   ├── attendanceController.ts
│   │   │   ├── examController.ts
│   │   │   ├── financeController.ts
│   │   │   └── notificationController.ts
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── authorization.ts
│   │   │   ├── validation.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── upload.ts
│   │   ├── models/                  # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Student.ts
│   │   │   ├── Teacher.ts
│   │   │   ├── Class.ts
│   │   │   ├── Subject.ts
│   │   │   ├── Timetable.ts
│   │   │   ├── Attendance.ts
│   │   │   ├── Exam.ts
│   │   │   ├── Mark.ts
│   │   │   ├── FeeStructure.ts
│   │   │   ├── FeePayment.ts
│   │   │   ├── SalaryProfile.ts
│   │   │   ├── SalaryRecord.ts
│   │   │   └── Notification.ts
│   │   ├── routes/                  # Express routes
│   │   │   ├── auth.ts
│   │   │   ├── students.ts
│   │   │   ├── teachers.ts
│   │   │   ├── classes.ts
│   │   │   ├── subjects.ts
│   │   │   ├── timetables.ts
│   │   │   ├── attendance.ts
│   │   │   ├── exams.ts
│   │   │   ├── marks.ts
│   │   │   ├── results.ts
│   │   │   ├── fees.ts
│   │   │   ├── salaries.ts
│   │   │   └── notifications.ts
│   │   ├── services/                # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── studentService.ts
│   │   │   ├── teacherService.ts
│   │   │   ├── attendanceService.ts
│   │   │   ├── examService.ts
│   │   │   ├── financeService.ts
│   │   │   ├── pdfService.ts
│   │   │   └── notificationService.ts
│   │   ├── validators/              # Zod schemas
│   │   │   ├── authValidator.ts
│   │   │   ├── studentValidator.ts
│   │   │   ├── teacherValidator.ts
│   │   │   ├── attendanceValidator.ts
│   │   │   ├── examValidator.ts
│   │   │   └── financeValidator.ts
│   │   ├── utils/                   # Utility functions
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── fileUpload.ts
│   │   ├── uploads/                 # Uploaded files (gitignored)
│   │   ├── templates/               # PDF HTML templates
│   │   │   ├── attendance-report.html
│   │   │   ├── result-card.html
│   │   │   └── fee-challan.html
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Server entry point
│   ├── scripts/                     # Utility scripts
│   │   ├── create-admin.ts
│   │   └── seed-dev.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .gitignore
├── README.md
└── package.json                     # Root package.json (workspaces)
```

## 3. DATABASE DESIGN

### Collections & Relationships

```
┌─────────────────────────────────────────────────────────────┐
│ USERS                                                        │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ email: String (unique, indexed)                              │
│ password: String (hashed)                                    │
│ role: Enum [ADMIN, TEACHER, STUDENT]                         │
│ name: String                                                 │
│ phone: String                                                │
│ address: String                                              │
│ isActive: Boolean (default: true)                            │
│ refreshToken: String                                         │
│ timestamps: true                                             │
└─────────────────────────────────────────────────────────────┘
        │
        │ 1:1
        ▼
┌─────────────────────────────────────────────────────────────┐
│ STUDENTS                                                     │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ userId: ObjectId → Users (unique, indexed)                   │
│ registrationNo: String (unique, indexed)                     │
│ admissionNo: String                                          │
│ admissionDate: Date                                          │
│ dateOfBirth: Date                                            │
│ gender: Enum [MALE, FEMALE, OTHER]                           │
│ bloodGroup: String                                           │
│ religion: String                                             │
│ fatherName: String                                           │
│ motherName: String                                           │
│ guardianPhone: String                                        │
│ guardianEmail: String                                        │
│ currentAddress: String                                       │
│ permanentAddress: String                                     │
│ classId: ObjectId → Classes (indexed)                        │
│ sectionId: ObjectId → Sections                               │
│ status: Enum [ACTIVE, GRADUATED, TRANSFERRED, DROPPED]      │
│ timestamps: true                                             │
└─────────────────────────────────────────────────────────────┘
        │
        │ N:1
        ▼
┌─────────────────────────────────────────────────────────────┐
│ CLASSES                                                      │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ name: String (e.g., "Class 10")                              │
│ code: String (unique, indexed)                               │
│ sections: [{                                                 │
│   _id: ObjectId                                              │
│   name: String (e.g., "A", "B", "C")                         │
│ }]                                                           │
│ isActive: Boolean                                            │
│ timestamps: true                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TEACHERS                                                     │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ userId: ObjectId → Users (unique, indexed)                   │
│ employeeId: String (unique, indexed)                         │
│ designation: String                                          │
│ department: String                                           │
│ qualification: String                                        │
│ experience: Number                                           │
│ joiningDate: Date                                            │
│ subjectIds: [ObjectId → Subjects]                            │
│ classIds: [ObjectId → Classes]                               │
│ isClassTeacher: Boolean                                      │
│ assignedClassId: ObjectId → Classes                          │
│ assignedSectionId: ObjectId                                  │
│ employmentStatus: Enum [ACTIVE, INACTIVE, ON_LEAVE]         │
│ timestamps: true                                             │
└─────────────────────────────────────────────────────────────┘
        │
        │ N:N
        ▼
┌─────────────────────────────────────────────────────────────┐
│ SUBJECTS                                                     │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ name: String                                                 │
│ code: String (unique, indexed)                               │
│ classIds: [ObjectId → Classes] (indexed)                     │
│ teacherIds: [ObjectId → Teachers]                            │
│ isActive: Boolean                                            │
│ timestamps: true                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TIMETABLES                                                   │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ classId: ObjectId → Classes (indexed)                        │
│ sectionId: ObjectId                                          │
│ subjectId: ObjectId → Subjects                               │
│ teacherId: ObjectId → Teachers                               │
│ dayOfWeek: Enum [MONDAY, TUESDAY, ..., FRIDAY]              │
│ startTime: String (e.g., "08:00")                            │
│ endTime: String (e.g., "08:45")                              │
│ roomNo: String                                               │
│ timestamps: true                                             │
│ Compound Index: { classId, sectionId, dayOfWeek, startTime }│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ATTENDANCE                                                   │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ studentId: ObjectId → Students (indexed)                     │
│ classId: ObjectId → Classes (indexed)                        │
│ date: Date (indexed)                                         │
│ status: Enum [PRESENT, ABSENT, LATE, LEAVE]                 │
│ subjectId: ObjectId → Subjects (optional)                    │
│ markedBy: ObjectId → Teachers                                │
│ remarks: String                                              │
│ timestamps: true                                             │
│ Compound Unique Index: { studentId, date, subjectId }       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ EXAMS                                                        │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ name: String                                                 │
│ term: Enum [FIRST, SECOND, THIRD, FINAL]                     │
│ academicYear: String                                         │
│ classIds: [ObjectId → Classes] (indexed)                     │
│ subjects: [{                                                 │
│   subjectId: ObjectId → Subjects                             │
│   maxMarks: Number                                           │
│   passingMarks: Number                                       │
│   examDate: Date                                             │
│ }]                                                           │
│ startDate: Date                                              │
│ endDate: Date                                                │
│ status: Enum [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED] │
│ timestamps: true                                             │
└─────────────────────────────────────────────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────────────────────────────────────────────┐
│ MARKS                                                        │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ studentId: ObjectId → Students (indexed)                     │
│ examId: ObjectId → Exams (indexed)                           │
│ subjectId: ObjectId → Subjects                               │
│ obtainedMarks: Number                                        │
│ maxMarks: Number                                             │
│ passingMarks: Number                                         │
│ grade: String                                                │
│ remarks: String                                              │
│ enteredBy: ObjectId → Teachers                               │
│ timestamps: true                                             │
│ Compound Unique Index: { studentId, examId, subjectId }     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FEE STRUCTURES                                               │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ name: String                                                 │
│ classId: ObjectId → Classes (indexed)                        │
│ academicYear: String                                         │
│ components: [{                                               │
│   name: String (e.g., "Tuition Fee")                         │
│   amount: Number                                             │
│   frequency: Enum [ONE_TIME, MONTHLY, QUARTERLY, YEARLY]    │
│   dueDay: Number (day of month for monthly fees)             │
│ }]                                                           │
│ totalAmount: Number                                          │
│ isActive: Boolean                                            │
│ timestamps: true                                             │
│ Compound Index: { classId, academicYear }                   │
└─────────────────────────────────────────────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────────────────────────────────────────────┐
│ FEE PAYMENTS                                                 │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ studentId: ObjectId → Students (indexed)                     │
│ feeStructureId: ObjectId → FeeStructures                     │
│ month: String (e.g., "2024-01")                              │
│ component: String (fee component name)                       │
│ totalAmount: Number                                          │
│ paidAmount: Number                                           │
│ balanceAmount: Number                                        │
│ paymentDate: Date                                            │
│ paymentMethod: Enum [CASH, BANK, ONLINE, OTHER]             │
│ referenceNo: String                                          │
│ remarks: String                                              │
│ status: Enum [UNPAID, PARTIAL, PAID, OVERDUE]               │
│ challanNo: String (unique, indexed)                          │
│ timestamps: true                                             │
│ Compound Index: { studentId, month, component }             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SALARY PROFILES                                              │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ teacherId: ObjectId → Teachers (unique, indexed)             │
│ baseSalary: Number                                           │
│ allowances: [{                                               │
│   name: String                                               │
│   amount: Number                                             │
│ }]                                                           │
│ deductions: [{                                               │
│   name: String                                               │
│   amount: Number                                             │
│ }]                                                           │
│ netSalary: Number                                            │
│ effectiveDate: Date                                          │
│ isActive: Boolean                                            │
│ timestamps: true                                             │
└─────────────────────────────────────────────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────────────────────────────────────────────┐
│ SALARY RECORDS                                               │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ teacherId: ObjectId → Teachers (indexed)                     │
│ salaryProfileId: ObjectId → SalaryProfiles                   │
│ month: String (e.g., "2024-01")                              │
│ baseSalary: Number                                           │
│ totalAllowances: Number                                      │
│ totalDeductions: Number                                      │
│ netSalary: Number                                            │
│ paidAmount: Number                                           │
│ balanceAmount: Number                                        │
│ paymentDate: Date                                            │
│ paymentMethod: Enum [CASH, BANK, ONLINE, OTHER]             │
│ referenceNo: String                                          │
│ remarks: String                                              │
│ status: Enum [UNPAID, PARTIAL, PAID]                        │
│ timestamps: true                                             │
│ Compound Unique Index: { teacherId, month }                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ NOTIFICATIONS                                                │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ title: String                                                │
│ message: String                                              │
│ type: Enum [GENERAL, ACADEMIC, FINANCIAL, EVENT]            │
│ isPublic: Boolean (indexed)                                  │
│ targetRoles: [Enum [ADMIN, TEACHER, STUDENT, ALL]]          │
│ attachmentUrl: String                                        │
│ externalLink: String                                         │
│ publicationDate: Date (indexed)                              │
│ expiryDate: Date                                             │
│ createdBy: ObjectId → Users                                  │
│ isActive: Boolean                                            │
│ timestamps: true                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Relationships

1. **Users ↔ Students/Teachers**: 1:1 relationship via `userId`
2. **Students ↔ Classes**: N:1 (many students in one class)
3. **Teachers ↔ Subjects**: N:N (teachers teach multiple subjects)
4. **Teachers ↔ Classes**: N:N (teachers assigned to multiple classes)
5. **Students ↔ Attendance**: 1:N (one student has many attendance records)
6. **Exams ↔ Marks**: 1:N (one exam has many marks)
7. **Classes ↔ Fee Structures**: 1:N (one class has fee structures per year)
8. **Students ↔ Fee Payments**: 1:N (one student has many payments)
9. **Teachers ↔ Salary Profiles**: 1:1 (one teacher has one active profile)
10. **Teachers ↔ Salary Records**: 1:N (one teacher has many monthly records)

### Indexing Strategy

**Single Field Indexes:**
- `Users.email` (unique)
- `Students.registrationNo` (unique)
- `Students.userId` (unique)
- `Teachers.employeeId` (unique)
- `Teachers.userId` (unique)
- `Classes.code` (unique)
- `Subjects.code` (unique)
- `Attendance.studentId`
- `Attendance.date`
- `Exams.classIds`
- `Marks.studentId`
- `Marks.examId`
- `FeePayments.studentId`
- `SalaryRecords.teacherId`
- `Notifications.isPublic`
- `Notifications.publicationDate`

**Compound Indexes:**
- `Attendance: { studentId, date, subjectId }` (unique)
- `Timetables: { classId, sectionId, dayOfWeek, startTime }` (unique)
- `Marks: { studentId, examId, subjectId }` (unique)
- `FeePayments: { studentId, month, component }`
- `SalaryRecords: { teacherId, month }` (unique)
- `FeeStructures: { classId, academicYear }`

## 4. API STRUCTURE

### Authentication APIs
```
POST   /api/auth/login              # Login (public)
POST   /api/auth/refresh            # Refresh access token
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Get current user
POST   /api/auth/change-password    # Change password
```

### User Management APIs (ADMIN)
```
GET    /api/users                   # List all users
GET    /api/users/:id               # Get user by ID
POST   /api/users/teachers          # Create teacher
POST   /api/users/students          # Create student
PUT    /api/users/:id               # Update user
PATCH  /api/users/:id/status        # Activate/Deactivate user
DELETE /api/users/:id               # Delete user (soft delete)
POST   /api/users/:id/reset-password # Admin reset password
```

### Student Management APIs
```
GET    /api/students                # List students (with filters)
GET    /api/students/:id            # Get student details
PUT    /api/students/:id            # Update student profile
GET    /api/students/:id/profile    # Get full profile
```

### Teacher Management APIs
```
GET    /api/teachers                # List teachers
GET    /api/teachers/:id            # Get teacher details
PUT    /api/teachers/:id            # Update teacher profile
GET    /api/teachers/:id/classes    # Get assigned classes
GET    /api/teachers/:id/subjects   # Get assigned subjects
```

### Class Management APIs
```
GET    /api/classes                 # List classes
GET    /api/classes/:id             # Get class details
POST   /api/classes                 # Create class
PUT    /api/classes/:id             # Update class
PATCH  /api/classes/:id/status      # Activate/Deactivate
POST   /api/classes/:id/sections    # Add section
PUT    /api/classes/:id/sections/:sectionId  # Update section
DELETE /api/classes/:id/sections/:sectionId  # Remove section
```

### Subject Management APIs
```
GET    /api/subjects                # List subjects
GET    /api/subjects/:id            # Get subject details
POST   /api/subjects                # Create subject
PUT    /api/subjects/:id            # Update subject
PATCH  /api/subjects/:id/status     # Activate/Deactivate
POST   /api/subjects/:id/teachers   # Assign teacher
DELETE /api/subjects/:id/teachers/:teacherId  # Remove teacher
```

### Timetable APIs
```
GET    /api/timetables              # List timetables (with filters)
GET    /api/timetables/:id          # Get timetable entry
POST   /api/timetables              # Create timetable entry
PUT    /api/timetables/:id          # Update timetable entry
DELETE /api/timetables/:id          # Delete timetable entry
GET    /api/timetables/class/:classId/section/:sectionId  # Get class timetable
GET    /api/timetables/teacher/:teacherId  # Get teacher timetable
```

### Attendance APIs
```
GET    /api/attendance              # List attendance (with filters)
POST   /api/attendance              # Mark attendance (single/bulk)
GET    /api/attendance/class/:classId/date/:date  # Get class attendance
GET    /api/attendance/student/:studentId  # Get student attendance
GET    /api/attendance/report/class/:classId  # Class attendance report
GET    /api/attendance/report/student/:studentId  # Student attendance report
GET    /api/attendance/report/class/:classId/pdf  # Download PDF report
GET    /api/attendance/report/student/:studentId/pdf  # Download PDF report
```

### Exam APIs
```
GET    /api/exams                   # List exams
GET    /api/exams/:id               # Get exam details
POST   /api/exams                   # Create exam
PUT    /api/exams/:id               # Update exam
DELETE /api/exams/:id               # Delete exam
PATCH  /api/exams/:id/status        # Update exam status
```

### Marks APIs
```
GET    /api/marks                   # List marks (with filters)
POST   /api/marks                   # Enter marks (single/bulk)
PUT    /api/marks/:id               # Update marks
GET    /api/marks/exam/:examId/student/:studentId  # Get student marks for exam
POST   /api/marks/upload/:examId/:subjectId  # Upload CSV marks
GET    /api/marks/teacher/:teacherId/exam/:examId  # Get marks for teacher's subject
```

### Results APIs
```
GET    /api/results/student/:studentId/exam/:examId  # Get student result
GET    /api/results/student/:studentId  # Get all results for student
GET    /api/results/student/:studentId/exam/:examId/pdf  # Download result card PDF
GET    /api/results/class/:classId/exam/:examId  # Get class results
```

### Fee APIs
```
GET    /api/fees/structures         # List fee structures
GET    /api/fees/structures/:id     # Get fee structure
POST   /api/fees/structures         # Create fee structure
PUT    /api/fees/structures/:id     # Update fee structure
GET    /api/fees/student/:studentId/ledger  # Get student fee ledger
POST   /api/fees/payments           # Record fee payment
GET    /api/fees/payments/:id       # Get payment details
GET    /api/fees/challan/:paymentId/pdf  # Download fee challan PDF
GET    /api/fees/dashboard          # Finance dashboard data
```

### Salary APIs
```
GET    /api/salaries/profiles       # List salary profiles
GET    /api/salaries/profiles/:id   # Get salary profile
POST   /api/salaries/profiles       # Create salary profile
PUT    /api/salaries/profiles/:id   # Update salary profile
GET    /api/salaries/records        # List salary records
POST   /api/salaries/records/generate  # Generate monthly salary records
POST   /api/salaries/records/:id/pay  # Record salary payment
GET    /api/salaries/teacher/:teacherId  # Get teacher salary history
GET    /api/salaries/dashboard      # Salary dashboard data
```

### Notification APIs
```
GET    /api/notifications           # List notifications
GET    /api/notifications/:id       # Get notification
POST   /api/notifications           # Create notification
PUT    /api/notifications/:id       # Update notification
DELETE /api/notifications/:id       # Delete notification
GET    /api/notifications/public    # Get public notifications (no auth)
```

### Health Check API
```
GET    /api/health                  # Health check endpoint
```

## 5. AUTHENTICATION STRATEGY

### JWT Token Architecture

**Access Token:**
- Lifetime: 15 minutes
- Stored in: Memory (React state) + httpOnly cookie (backup)
- Contains: userId, role, email
- Used for: API requests

**Refresh Token:**
- Lifetime: 7 days
- Stored in: MongoDB (Users collection) + httpOnly cookie
- Contains: userId, token hash
- Used for: Obtaining new access token

### Authentication Flow

```
1. Login Request
   POST /api/auth/login { email, password }
   ↓
2. Backend validates credentials
   - Check user exists
   - Verify password hash
   - Check user is active
   ↓
3. Generate tokens
   - Access token (15 min)
   - Refresh token (7 days)
   ↓
4. Store refresh token in MongoDB
   ↓
5. Return tokens to client
   - Access token in response body
   - Refresh token in httpOnly cookie
   ↓
6. Client stores access token in state
   ↓
7. Subsequent requests include access token in Authorization header
   Authorization: Bearer <access_token>
   ↓
8. If access token expires (401 response)
   - Client calls POST /api/auth/refresh
   - Backend validates refresh token from cookie
   - Generates new access token
   - Returns new access token
   ↓
9. Logout
   - Clear refresh token from MongoDB
   - Clear cookies
   - Clear client state
```

### Middleware Chain

```typescript
// Authentication middleware
authMiddleware() → requireAuth() → requireRole(['ADMIN']) → controller

// Example usage
router.post('/students', 
  requireAuth, 
  requireRole(['ADMIN']), 
  validateRequest(createStudentSchema),
  studentController.createStudent
);
```

### Security Measures

1. **Password Hashing**: bcrypt with salt rounds = 12
2. **JWT Secrets**: Separate secrets for access and refresh tokens
3. **Token Rotation**: Refresh token rotation on each refresh
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS**: Whitelist specific origins
6. **Helmet**: Security headers
7. **Input Validation**: Zod schemas for all inputs
8. **SQL Injection Prevention**: Mongoose parameterized queries
9. **XSS Prevention**: Input sanitization
10. **CSRF Protection**: SameSite cookies + CSRF tokens for state-changing operations

## 6. FINANCE ARCHITECTURE

### Fee Management Flow

```
1. Admin creates Fee Structure for a class
   - Define components (tuition, transport, etc.)
   - Set amounts and frequency
   ↓
2. Student is admitted to class
   - Fee structure is linked to student
   ↓
3. Monthly fee records are generated
   - One record per component per month
   - Status: UNPAID
   ↓
4. Admin records payment
   - Payment can be full or partial
   - Creates payment transaction record
   - Updates fee record status
   ↓
5. Fee challan is generated
   - PDF with payment details
   - Can be downloaded by student/admin
   ↓
6. Ledger shows complete history
   - All fees, payments, balances
   - Month-wise breakdown
```

### Salary Management Flow

```
1. Admin creates Salary Profile for teacher
   - Base salary
   - Allowances
   - Deductions
   - Net salary calculation
   ↓
2. Monthly salary records are generated
   - One record per teacher per month
   - Status: UNPAID
   ↓
3. Admin records salary payment
   - Payment can be full or partial
   - Updates salary record status
   ↓
4. Salary slip is generated (optional)
   - PDF with breakdown
   ↓
5. History maintained
   - All salary records accessible
   - Payment history preserved
```

### Financial Dashboard Aggregations

```typescript
// Fee Dashboard
{
  totalFeesDue: aggregate sum of all unpaid/partial fees
  totalFeesCollected: aggregate sum of all paid amounts
  outstandingFees: totalFeesDue - totalFeesCollected
  currentMonthCollection: payments in current month
  overdueFees: fees past due date
}

// Salary Dashboard
{
  totalSalariesDue: sum of all unpaid/partial salaries
  totalSalariesPaid: sum of all paid amounts
  currentMonthSalaries: salaries for current month
  unpaidSalaries: count of unpaid salary records
}
```

## 7. DEPLOYMENT ARCHITECTURE

### Development Environment

```
┌─────────────────────────────────────────┐
│ Local Development                       │
├─────────────────────────────────────────┤
│ MongoDB: localhost:27017                │
│ Backend: localhost:5000                 │
│ Frontend: localhost:5173                │
│ File Storage: ./server/uploads          │
└─────────────────────────────────────────┘
```

### Production Environment (Render/Railway)

```
┌─────────────────────────────────────────┐
│ Production Deployment                   │
├─────────────────────────────────────────┤
│ MongoDB Atlas (Cloud)                   │
│ Backend: Render/Railway                 │
│ Frontend: Render/Railway (static)       │
│ File Storage: Cloud storage (S3/R2)     │
│ Environment Variables: Platform secrets │
└─────────────────────────────────────────┘
```

### VPS Deployment (Future)

```
┌─────────────────────────────────────────┐
│ VPS (Ubuntu)                            │
├─────────────────────────────────────────┤
│ Nginx (Reverse Proxy)                   │
│ ├── / → React static build              │
│ └── /api → Node.js backend              │
│ PM2 (Process Manager)                   │
│ ├── Backend process                     │
│ └── Auto-restart, logging               │
│ MongoDB (Self-hosted or Atlas)          │
│ Let's Encrypt (SSL)                     │
└─────────────────────────────────────────┘
```

### Environment Variables

**Development (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_ACCESS_SECRET=dev_access_secret_key
JWT_REFRESH_SECRET=dev_refresh_secret_key
CLIENT_URL=http://localhost:5173
SCHOOL_NAME=Demo School
SCHOOL_ADDRESS=123 Main Street
SCHOOL_PHONE=+1234567890
SCHOOL_EMAIL=info@demoschool.com
```

**Production (.env)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school_management
JWT_ACCESS_SECRET=<strong_random_secret>
JWT_REFRESH_SECRET=<strong_random_secret>
CLIENT_URL=https://app.yourschool.com
SCHOOL_NAME=Your School Name
SCHOOL_ADDRESS=Your Address
SCHOOL_PHONE=Your Phone
SCHOOL_EMAIL=your@email.com
```

## 8. TECHNOLOGY CHOICES RATIONALE

### Frontend
- **React + Vite**: Fast development, HMR, modern tooling
- **TypeScript**: Type safety, better IDE support, fewer runtime errors
- **Tailwind CSS**: Utility-first, responsive, rapid UI development
- **React Router**: Standard routing solution
- **Axios**: HTTP client with interceptors, better error handling
- **React Context**: Simple state management for auth

### Backend
- **Node.js + Express**: Industry standard, large ecosystem
- **TypeScript**: Type safety, better maintainability
- **Mongoose**: Mature ODM, schema validation, middleware
- **Zod**: Runtime validation, TypeScript integration
- **JWT**: Stateless authentication, scalable
- **Multer**: File upload handling
- **Puppeteer**: PDF generation from HTML

### Database
- **MongoDB**: Flexible schema, good for hierarchical data
- **Document References**: Maintain data integrity
- **Indexes**: Query performance optimization

### DevOps
- **Render/Railway**: Easy deployment, free tier available
- **MongoDB Atlas**: Managed MongoDB, free tier available
- **PM2 + Nginx**: Production-ready VPS deployment

## 9. SECURITY CHECKLIST

- [x] Password hashing with bcrypt
- [x] JWT authentication
- [x] Role-based authorization
- [x] Input validation with Zod
- [x] Rate limiting
- [x] CORS configuration
- [x] Security headers (Helmet)
- [x] File upload validation
- [x] MongoDB injection prevention
- [x] Centralized error handling
- [x] Environment variable protection
- [x] HTTPS in production
- [x] Secure cookies (httpOnly, secure, sameSite)
- [x] XSS prevention
- [x] CSRF protection

## 10. NEXT STEPS

After this architecture is approved, we will proceed with:

**PHASE 2**: Backend Foundation
- Express setup
- MongoDB connection
- Error handling
- Health check endpoint

**PHASE 3**: Authentication
- User model
- Admin creation script
- Login/logout
- JWT tokens
- Auth middleware

**PHASE 4-13**: Continue with remaining modules as outlined in requirements.

---

**STATUS**: Awaiting approval to proceed with Phase 2.
