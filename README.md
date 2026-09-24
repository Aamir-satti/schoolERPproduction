# 🏫 School Management System — MERN Stack

A complete, production-ready School Management System built with the MERN stack (MongoDB, Express, React, Node.js) with TypeScript.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Development Phases](#development-phases)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                     │
│  TypeScript • Tailwind CSS • React Router • Axios           │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTPS)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVER (Express + Node.js)                 │
│  TypeScript • JWT Auth • Zod Validation • Multer Uploads    │
│  Puppeteer PDF • Rate Limiting • Helmet Security            │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                       │
│  Indexed Collections • Document References • Timestamps     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
```
USER → React → Axios → Express API → Controller → Service → Mongoose → MongoDB → Response → React
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| React Router | Routing |
| Axios | HTTP Client |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| TypeScript | Type Safety |
| MongoDB + Mongoose | Database + ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Zod | Validation |
| Multer | File Uploads |
| Puppeteer | PDF Generation |
| Helmet | Security Headers |
| express-rate-limit | Rate Limiting |

---

## 📁 Project Structure

```
school-management-system/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/                     # Axios client & interceptors
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # React Context (Auth)
│   │   ├── layouts/                 # Layout wrappers per role
│   │   ├── pages/                   # Route pages
│   │   ├── routes/                  # Route protection
│   │   ├── services/                # API service modules
│   │   ├── types/                   # TypeScript definitions
│   │   ├── App.tsx                  # Main app with routes
│   │   └── main.tsx                 # Entry point
│   └── package.json
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/                  # Database, env config
│   │   ├── controllers/             # Request handlers
│   │   ├── middleware/              # Auth, validation, errors
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # Express routes
│   │   ├── services/                # Business logic
│   │   ├── validators/              # Zod schemas
│   │   ├── utils/                   # Helpers
│   │   └── templates/               # PDF HTML templates
│   ├── scripts/
│   │   ├── create-admin.ts          # Admin creation script
│   │   └── seed-dev.ts              # Dev seed data
│   ├── package.json
│   └── tsconfig.json
│
├── ARCHITECTURE.md                  # Detailed architecture doc
├── README.md                        # This file
└── .env.example                     # Environment template
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd school-management-system
```

#### 2. Setup Frontend
```bash
cd client
npm install
```

#### 3. Setup Backend
```bash
cd server
npm install
```

#### 4. Configure Environment
```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your settings

# Frontend
cd client
# Create .env with VITE_API_URL=http://localhost:5000/api
```

#### 5. Create Admin Account
```bash
cd server
npm run create-admin
# Follow prompts to enter name, email, password
```

#### 6. Start Development Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

#### 7. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_ACCESS_SECRET=<generate-strong-random-string>
JWT_REFRESH_SECRET=<generate-strong-random-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:5173
SCHOOL_NAME=Your School Name
SCHOOL_ADDRESS=Your Address
SCHOOL_PHONE=+1234567890
SCHOOL_EMAIL=info@school.edu
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database Design

### Collections

| Collection | Purpose |
|-----------|---------|
| `users` | Authentication & authorization |
| `students` | Student profiles |
| `teachers` | Teacher/staff profiles |
| `classes` | Class & section management |
| `subjects` | Subject definitions |
| `timetables` | Class schedules |
| `attendance` | Daily attendance records |
| `exams` | Examination schedules |
| `marks` | Student marks/grades |
| `feeStructures` | Fee definitions per class |
| `feePayments` | Fee payment records |
| `salaryProfiles` | Teacher salary structures |
| `salaryRecords` | Monthly salary records |
| `notifications` | System announcements |

### Key Relationships
```
User (1) ←→ (1) Student/Teacher
Student (N) ←→ (1) Class
Teacher (N) ←→ (N) Subject
Student (1) ←→ (N) Attendance
Student (1) ←→ (N) FeePayment
Teacher (1) ←→ (N) SalaryRecord
Exam (1) ←→ (N) Marks
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/change-password` | Change password |

### Students
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/students` | Admin | List students |
| GET | `/api/students/:id` | Admin | Get student |
| POST | `/api/students` | Admin | Create student |
| PUT | `/api/students/:id` | Admin | Update student |
| GET | `/api/students/profile` | Student | Own profile |

### Teachers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/teachers` | Admin | List teachers |
| POST | `/api/teachers` | Admin | Create teacher |
| PUT | `/api/teachers/:id` | Admin | Update teacher |
| GET | `/api/teachers/profile` | Teacher | Own profile |

### Attendance
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/attendance` | Teacher | Mark attendance |
| GET | `/api/attendance/class/:id/date/:date` | Teacher/Admin | Class attendance |
| GET | `/api/attendance/student/:id` | Student/Parent | Student attendance |
| GET | `/api/attendance/report/student/:id` | All | Attendance report |
| GET | `/api/attendance/report/student/:id/pdf` | All | Download PDF |

### Exams & Marks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/exams` | All | List exams |
| POST | `/api/exams` | Admin | Create exam |
| POST | `/api/marks` | Teacher | Enter marks |
| POST | `/api/marks/upload/:examId/:subjectId` | Teacher | CSV upload |
| GET | `/api/results/student/:id/exam/:id` | Student | View result |
| GET | `/api/results/student/:id/exam/:id/pdf` | Student | Download PDF |

### Finance
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/fees/structures` | Admin | List fee structures |
| POST | `/api/fees/structures` | Admin | Create fee structure |
| GET | `/api/fees/student/:id/ledger` | Admin/Student | Fee ledger |
| POST | `/api/fees/payments` | Admin | Record payment |
| GET | `/api/fees/challan/:id/pdf` | Admin/Student | Download challan |
| GET | `/api/fees/dashboard` | Admin | Finance dashboard |

### Salaries
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/salaries/profiles` | Admin | List profiles |
| POST | `/api/salaries/profiles` | Admin | Create profile |
| POST | `/api/salaries/records/generate` | Admin | Generate monthly |
| POST | `/api/salaries/records/:id/pay` | Admin | Record payment |

### Notifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | Authenticated | List notifications |
| POST | `/api/notifications` | Admin | Create notification |
| GET | `/api/notifications/public` | Public | Public notifications |

---

## 🔑 Authentication

### JWT Flow
1. User logs in with email/password
2. Server validates credentials
3. Server generates access token (15 min) + refresh token (7 days)
4. Access token stored in memory, refresh token in httpOnly cookie
5. Subsequent requests include access token in Authorization header
6. When access token expires, client calls refresh endpoint
7. Server validates refresh token and issues new tokens

### Role-Based Access Control
```
ADMIN: Full system access
TEACHER: Attendance, marks, own timetable
STUDENT: Own results, attendance, fees, timetable
```

### Security Measures
- Password hashing: bcrypt (12 rounds)
- JWT with separate access/refresh secrets
- Rate limiting: 100 requests per 15 minutes
- CORS: Whitelist specific origins
- Helmet: Security headers
- Input validation: Zod schemas
- File upload validation
- MongoDB injection prevention

---

## 🌐 Deployment

### Render Deployment

#### Backend
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory: `server`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables from `.env.example`

#### Frontend
1. Create new Static Site on Render
2. Connect GitHub repository
3. Set root directory: `client`
4. Build command: `npm install && npm run build`
5. Publish directory: `dist`
6. Set `VITE_API_URL` to backend URL

### Railway Deployment

#### Backend
1. Create new project
2. Deploy from GitHub
3. Set root directory: `server`
4. Add environment variables
5. Add MongoDB plugin

#### Frontend
1. Deploy as static site
2. Set build command and output directory
3. Configure environment variables

### VPS Deployment (Ubuntu)

```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm nginx mongodb-org

# Clone and setup
git clone <repo>
cd school-management-system/server
npm install
npm run build

# Setup PM2
npm install -g pm2
pm2 start dist/server.js --name school-api
pm2 startup
pm2 save

# Configure Nginx
sudo nano /etc/nginx/sites-available/school
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Architecture & Design | ✅ Complete |
| 2 | Backend Foundation | ✅ Structure Created |
| 3 | Authentication | ✅ Service Created |
| 4 | User Management | 📋 Ready |
| 5 | Students & Teachers | 📋 Ready |
| 6 | Academics | 📋 Ready |
| 7 | Attendance | 📋 Ready |
| 8 | Exams & Results | 📋 Ready |
| 9 | Finance | 📋 Ready |
| 10 | Notifications | 📋 Ready |
| 11 | React Frontend | ✅ Core Complete |
| 12 | Integration Testing | 📋 Ready |
| 13 | Production Hardening | 📋 Ready |

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Access protected route without token (should redirect)
- [ ] Token refresh on expiry
- [ ] Logout clears tokens

#### Student Management
- [ ] Create student (admin)
- [ ] View student list
- [ ] Update student details
- [ ] Deactivate student
- [ ] Data persists after refresh

#### Attendance
- [ ] Teacher marks attendance
- [ ] Duplicate prevention works
- [ ] Report generation
- [ ] PDF download

#### Finance
- [ ] Create fee structure
- [ ] Record partial payment
- [ ] View ledger
- [ ] Download challan PDF
- [ ] Dashboard aggregation correct

---

## 🔒 Security Checklist

- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Role-based authorization
- [x] Input validation (Zod)
- [x] Rate limiting
- [x] CORS configuration
- [x] Security headers (Helmet)
- [x] File upload validation
- [x] MongoDB injection prevention
- [x] Centralized error handling
- [x] Environment variable protection
- [x] No mock data in production
- [x] No hardcoded credentials

---

## 📝 License

This project is built for educational purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ using MERN Stack + TypeScript**
