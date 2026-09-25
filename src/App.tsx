import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import GuestLayout from './layouts/GuestLayout';

// Pages
import LoginPage from './pages/LoginPage';
import GuestHomePage from './pages/GuestHomePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsPage from './pages/admin/StudentsPage';
import TeachersPage from './pages/admin/TeachersPage';
import ClassesPage from './pages/admin/ClassesPage';
import SubjectsPage from './pages/admin/SubjectsPage';
import TimetablePage from './pages/admin/TimetablePage';
import AttendancePage from './pages/admin/AttendancePage';
import ExamsPage from './pages/admin/ExamsPage';
import FeesPage from './pages/admin/FeesPage';
import SalariesPage from './pages/admin/SalariesPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import SettingsPage from './pages/admin/SettingsPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherClassesPage from './pages/teacher/TeacherClassesPage';
import TeacherTimetablePage from './pages/teacher/TeacherTimetablePage';
import TeacherAttendancePage from './pages/teacher/TeacherAttendancePage';
import TeacherExamsPage from './pages/teacher/TeacherExamsPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentTimetablePage from './pages/student/StudentTimetablePage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';
import StudentResultsPage from './pages/student/StudentResultsPage';
import StudentFeesPage from './pages/student/StudentFeesPage';
import StudentNotificationsPage from './pages/student/StudentNotificationsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<GuestLayout />}>
            <Route index element={<GuestHomePage />} />
          </Route>

          {/* Login Route */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="fees" element={<FeesPage />} />
            <Route path="salaries" element={<SalariesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherLayout /></ProtectedRoute>}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClassesPage />} />
            <Route path="timetable" element={<TeacherTimetablePage />} />
            <Route path="attendance" element={<TeacherAttendancePage />} />
            <Route path="exams" element={<TeacherExamsPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="timetable" element={<StudentTimetablePage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="results" element={<StudentResultsPage />} />
            <Route path="fees" element={<StudentFeesPage />} />
            <Route path="notifications" element={<StudentNotificationsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
