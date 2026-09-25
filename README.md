# 🏫 School ERP System

A comprehensive School Management System built with React, TypeScript, Node.js, Express, and MongoDB.

## 📋 Features

### Authentication & Authorization
- JWT-based authentication with access/refresh tokens
- Role-based access control (Admin, Teacher, Student)
- Secure password hashing with bcrypt
- HTTP-only cookies for refresh tokens
- Protected routes on both frontend and backend

### Admin Module
- **Dashboard**: Real-time statistics from database (students, teachers, classes, attendance, fees, salaries)
- **Student Management**: Create, edit, deactivate students with full profile management
- **Teacher Management**: Create, edit, manage teacher profiles and assignments
- **Class Management**: Create classes with sections, assign class teachers
- **Subject Management**: Create subjects, assign to classes and teachers
- **Timetable Management**: Create and manage class schedules with conflict detection
- **Attendance**: Mark and manage student attendance by class and date
- **Examinations**: Create exams, manage subjects and dates
- **Fee Management**: Fee structures, payment recording, financial dashboard
- **Salary Management**: Salary profiles, monthly records, payment tracking
- **Notifications**: Create and manage system-wide announcements
- **Settings**: School configuration

### Teacher Module
- **Dashboard**: Assigned classes, today's schedule, pending tasks
- **My Classes**: View assigned classes and subjects
- **Timetable**: Personal weekly schedule
- **Attendance**: Mark attendance for assigned classes
- **Exams & Marks**: View exams and enter student marks

### Student Module
- **Dashboard**: Personal timetable, attendance percentage, results, fee status
- **Timetable**: View class schedule
- **Attendance**: View personal attendance records and statistics
- **Results**: View published exam results
- **Fees**: View fee status and payment history
- **Notifications**: View relevant notifications

### Public/Guest
- School information landing page
- Public announcements
- Contact information
- Admission information

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for routing
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **express-rate-limit** for rate limiting
- **cookie-parser** for cookie handling

## 📁 Project Structure

```
schoolERPproduction/
├── src/                          # React Frontend
│   ├── api/                      # Axios client configuration
│   ├── context/                  # React Context (Auth)
│   ├── layouts/                  # Layout components per role
│   ├── pages/                    # Page components
│   │   ├── admin/               # Admin pages
│   │   ├── teacher/             # Teacher pages
│   │   └── student/             # Student pages
│   ├── routes/                   # Route protection
│   ├── services/                 # API service modules
│   ├── types/                    # TypeScript type definitions
│   ├── App.tsx                   # Main app with routing
│   └── main.tsx                  # Entry point
│
├── server/                       # Express Backend
│   ├── src/
│   │   ├── config/              # Database, environment config
│   │   ├── middleware/          # Auth, error handling
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # Express routes
│   │   ├── services/            # Business logic
│   │   ├── app.ts               # Express app setup
│   │   └── server.ts            # Server entry point
│   └── scripts/
│       └── create-admin.ts      # Admin creation script
│
├── index.html                    # HTML entry point
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Aamir-satti/schoolERPproduction.git
cd schoolERPproduction
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
```

4. **Configure environment variables**

Frontend (create `.env` in root):
```env
VITE_API_URL=http://localhost:5000/api
```

Backend (create `.env` in `server/`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_ACCESS_SECRET=your_secure_access_secret_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:3000
SCHOOL_NAME=Your School Name
SCHOOL_ADDRESS=Your School Address
SCHOOL_PHONE=Your School Phone
SCHOOL_EMAIL=your@email.com
```

5. **Create admin account**
```bash
cd server
npm run create-admin
```

6. **Start development servers**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 📦 Build

### Frontend
```bash
npm run build
```

### Backend
```bash
cd server
npm run build
```

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT access tokens (short-lived) + refresh tokens (httpOnly cookies)
- Role-based authorization enforced on backend
- CORS configured for specific origins
- Helmet security headers
- Rate limiting (100 requests per 15 minutes)
- Input validation
- MongoDB injection prevention
- Secure cookie configuration (httpOnly, secure in production, sameSite)
- No sensitive data exposure in production errors

## 📊 Database Models

- **User**: Authentication and user management
- **Student**: Student profiles and academic information
- **Teacher**: Teacher profiles and assignments
- **Class**: Classes and sections
- **Subject**: Subjects with class and teacher assignments
- **Timetable**: Class schedules
- **Attendance**: Daily attendance records
- **Exam**: Examination schedules and configuration
- **Mark**: Student marks and grades
- **FeeStructure**: Fee definitions per class
- **FeePayment**: Fee payment records
- **SalaryProfile**: Teacher salary structures
- **SalaryRecord**: Monthly salary records
- **Notification**: System announcements

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `POST /api/auth/change-password` - Change password

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/teacher` - Teacher dashboard data
- `GET /api/dashboard/student` - Student dashboard data

### Students
- `GET /api/students` - List students (Admin)
- `POST /api/students` - Create student (Admin)
- `GET /api/students/:id` - Get student
- `PUT /api/students/:id` - Update student (Admin)
- `PATCH /api/students/:id/status` - Update status (Admin)

### Teachers
- `GET /api/teachers` - List teachers (Admin)
- `POST /api/teachers` - Create teacher (Admin)
- `GET /api/teachers/:id` - Get teacher
- `PUT /api/teachers/:id` - Update teacher (Admin)

### Classes
- `GET /api/classes` - List classes
- `POST /api/classes` - Create class (Admin)
- `PUT /api/classes/:id` - Update class (Admin)

### Subjects
- `GET /api/subjects` - List subjects
- `POST /api/subjects` - Create subject (Admin)
- `PUT /api/subjects/:id` - Update subject (Admin)

### Timetable
- `GET /api/timetables` - List timetables
- `POST /api/timetables` - Create entry (Admin)
- `GET /api/timetables/class/:classId/section/:sectionId` - Class timetable
- `GET /api/timetables/teacher/:teacherId` - Teacher timetable

### Attendance
- `POST /api/attendance` - Mark attendance (Admin/Teacher)
- `GET /api/attendance/class/:classId/date/:date` - Class attendance
- `GET /api/attendance/student/:studentId` - Student attendance
- `GET /api/attendance/report/student/:studentId` - Student report
- `GET /api/attendance/report/class/:classId` - Class report

### Exams
- `GET /api/exams` - List exams
- `POST /api/exams` - Create exam (Admin)
- `PUT /api/exams/:id` - Update exam (Admin)
- `DELETE /api/exams/:id` - Delete exam (Admin)
- `PATCH /api/exams/:id/status` - Update status (Admin)

### Marks
- `POST /api/marks` - Enter marks (Admin/Teacher)
- `GET /api/marks/exam/:examId/student/:studentId` - Student marks

### Results
- `GET /api/results/student/:studentId/exam/:examId` - Student result
- `GET /api/results/student/:studentId` - All student results

### Fees
- `GET /api/fees/structures` - List fee structures
- `POST /api/fees/structures` - Create fee structure (Admin)
- `GET /api/fees/student/:studentId/ledger` - Student ledger
- `POST /api/fees/payments` - Record payment (Admin)
- `GET /api/fees/dashboard` - Fee dashboard (Admin)

### Salaries
- `GET /api/salaries/profiles` - List salary profiles (Admin)
- `POST /api/salaries/profiles` - Create profile (Admin)
- `GET /api/salaries/records` - List records (Admin)
- `POST /api/salaries/records/generate` - Generate monthly (Admin)
- `POST /api/salaries/records/:id/pay` - Record payment (Admin)
- `GET /api/salaries/dashboard` - Salary dashboard (Admin)

### Notifications
- `GET /api/notifications` - List notifications (Authenticated)
- `GET /api/notifications/public` - Public notifications
- `POST /api/notifications` - Create notification (Admin)
- `PUT /api/notifications/:id` - Update notification (Admin)
- `DELETE /api/notifications/:id` - Delete notification (Admin)

## 🚢 Deployment

### Frontend (Vercel/Netlify/Render)
```bash
npm run build
# Deploy the 'dist' directory
```

Environment variables:
- `VITE_API_URL` - Backend API URL

### Backend (Render/Railway)
```bash
cd server
npm run build
npm start
```

Environment variables:
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - Strong random secret
- `JWT_REFRESH_SECRET` - Strong random secret
- `CLIENT_URL` - Frontend URL
- All other variables from `.env.example`

### Database (MongoDB Atlas)
1. Create a cluster at mongodb.com/cloud/atlas
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string
5. Set `MONGODB_URI` environment variable

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run typecheck    # Run TypeScript type checking
```

### Backend
```bash
cd server
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript
npm start            # Start production server
npm run create-admin # Create admin account
```

## 📝 Environment Variables

See `.env.example` (frontend) and `server/.env.example` (backend) for all available configuration options.

**Important**: Never commit `.env` files with real secrets to version control.

## 🧪 Testing

The application includes manual testing workflows. To test the complete system:

1. Create admin account
2. Login as admin
3. Create teachers and students
4. Create classes and subjects
5. Assign teachers to subjects/classes
6. Create timetable entries
7. Mark attendance
8. Create exams
9. Enter marks
10. View results
11. Create fee structures
12. Record payments
13. Create notifications

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Aamir Satti**
- GitHub: [@Aamir-satti](https://github.com/Aamir-satti)

## 🙏 Acknowledgments

Built with modern web technologies and best practices for production-ready applications.

---

**Built with ❤️ using MERN Stack + TypeScript**
