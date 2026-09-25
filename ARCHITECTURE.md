# School ERP System — Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                     │
│  TypeScript • Tailwind CSS • React Router • Axios           │
│  Role-based layouts • Protected routes • API services       │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTP)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVER (Express + Node.js)                 │
│  TypeScript • JWT Auth • Role-based Authorization           │
│  Helmet • CORS • Rate Limiting • Cookie Parser              │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                       │
│  14 Collections • Indexed • Referenced • Timestamped        │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User submits credentials → POST /api/auth/login
2. Server validates → bcrypt.compare(password, hash)
3. Server generates → JWT access token (15m) + refresh token (7d)
4. Server stores → refresh token in MongoDB + httpOnly cookie
5. Client stores → access token in memory
6. Subsequent requests → Authorization: Bearer <access_token>
7. On 401 → POST /api/auth/refresh (uses httpOnly cookie)
8. On logout → Clear cookie + remove refresh token from DB
```

## Database Collections

| Collection | Purpose | Key Indexes |
|-----------|---------|-------------|
| users | Authentication | email (unique), role+isActive |
| students | Student profiles | registrationNo (unique), userId (unique), classId |
| teachers | Teacher profiles | employeeId (unique), userId (unique) |
| classes | Class management | code (unique), isActive |
| subjects | Subject management | code (unique), isActive |
| timetables | Schedules | classId+dayOfWeek, teacherId+dayOfWeek |
| attendance | Daily records | studentId+date+subjectId (unique), classId+date |
| exams | Examinations | classIds+academicYear, status |
| marks | Student marks | studentId+examId+subjectId (unique) |
| feeStructures | Fee definitions | classId+academicYear |
| feePayments | Payment records | studentId+month+component, challanNo (unique) |
| salaryProfiles | Salary structures | teacherId (unique) |
| salaryRecords | Monthly salaries | teacherId+month (unique) |
| notifications | Announcements | publicationDate+isPublic |

## Relationships

```
User (1) ←→ (1) Student    [userId]
User (1) ←→ (1) Teacher    [userId]
Student (N) ←→ (1) Class   [classId]
Teacher (N) ←→ (N) Subject [subjectIds/teacherIds]
Teacher (N) ←→ (N) Class   [classIds]
Student (1) ←→ (N) Attendance    [studentId]
Student (1) ←→ (N) FeePayment    [studentId]
Teacher (1) ←→ (1) SalaryProfile [teacherId]
Teacher (1) ←→ (N) SalaryRecord  [teacherId]
Exam (1) ←→ (N) Mark             [examId]
```

## Role Permissions

| Feature | Admin | Teacher | Student |
|---------|-------|---------|---------|
| Manage Users | ✅ | ❌ | ❌ |
| Manage Classes | ✅ | ❌ | ❌ |
| Manage Subjects | ✅ | ❌ | ❌ |
| Manage Timetable | ✅ | View Own | View Own |
| Mark Attendance | ✅ | ✅ (Own Classes) | View Own |
| Manage Exams | ✅ | ❌ | ❌ |
| Enter Marks | ✅ | ✅ (Own Subjects) | ❌ |
| View Results | All | Own Classes | Own Only |
| Manage Fees | ✅ | ❌ | View Own |
| Manage Salaries | ✅ | ❌ | ❌ |
| Manage Notifications | ✅ | ❌ | View Relevant |
| Dashboard | Full Stats | Own Tasks | Own Info |

## API Structure

```
/api/
├── auth/           # Authentication
├── students/       # Student CRUD
├── teachers/       # Teacher CRUD
├── classes/        # Class management
├── subjects/       # Subject management
├── timetables/     # Schedule management
├── attendance/     # Attendance tracking
├── exams/          # Exam management
├── marks/          # Marks entry
├── results/        # Result viewing
├── fees/           # Fee management
├── salaries/       # Salary management
├── notifications/  # Announcements
├── dashboard/      # Role-specific dashboards
└── health          # Health check
```

## Frontend Architecture

```
src/
├── api/              # Axios client with interceptors
│   └── axios.ts      # Token refresh, error handling
├── context/          # React Context
│   └── AuthContext.tsx # Auth state, login/logout
├── layouts/          # Role-based layouts
│   ├── AdminLayout.tsx
│   ├── TeacherLayout.tsx
│   ├── StudentLayout.tsx
│   └── GuestLayout.tsx
├── pages/            # Route pages
│   ├── admin/        # 12 admin pages
│   ├── teacher/      # 5 teacher pages
│   ├── student/      # 6 student pages
│   ├── LoginPage.tsx
│   └── GuestHomePage.tsx
├── routes/           # Route protection
│   └── ProtectedRoute.tsx
├── services/         # API service modules
│   ├── authService.ts
│   ├── studentService.ts
│   ├── teacherService.ts
│   ├── attendanceService.ts
│   ├── examService.ts
│   ├── financeService.ts
│   ├── notificationService.ts
│   └── academicService.ts
└── types/            # TypeScript definitions
    └── index.ts
```

## Backend Architecture

```
server/src/
├── config/           # Configuration
│   ├── database.ts   # MongoDB connection
│   └── env.ts        # Environment variables
├── middleware/        # Express middleware
│   ├── auth.ts       # JWT verification, role checking
│   └── errorHandler.ts # Centralized error handling
├── models/           # Mongoose schemas (14 models)
├── routes/           # Express routes (14 route files)
├── services/         # Business logic
│   └── authService.ts
├── app.ts            # Express app configuration
└── server.ts         # Server entry point
```

## Security Measures

1. **Password Hashing**: bcrypt with 12 salt rounds
2. **JWT**: Separate access/refresh tokens with rotation
3. **Cookies**: httpOnly, secure (production), sameSite=lax
4. **CORS**: Restricted to CLIENT_URL
5. **Rate Limiting**: 100 requests per 15 minutes
6. **Helmet**: Security headers
7. **Validation**: Server-side validation on all inputs
8. **Authorization**: Role-based middleware on all protected routes
9. **Error Handling**: No stack traces in production
10. **Environment**: Secrets externalized, production validation

## Deployment Architecture

### Development
```
MongoDB (localhost:27017)
Backend (localhost:5000)
Frontend (localhost:3000)
```

### Production
```
MongoDB Atlas (Cloud)
Backend (Render/Railway)
Frontend (Vercel/Netlify/Render Static)
```

### VPS (Future)
```
Nginx → Frontend (static)
Nginx → Backend (PM2)
MongoDB (Atlas or self-hosted)
```
