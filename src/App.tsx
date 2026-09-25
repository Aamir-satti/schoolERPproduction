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
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsPage from './pages/admin/StudentsPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Placeholder pages for future implementation
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500">This module is connected to the backend API.</p>
      <p className="text-sm text-gray-400 mt-1">Data will appear when the backend server is running.</p>
    </div>
  </div>
);

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
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="teachers" element={<PlaceholderPage title="Teachers Management" />} />
              <Route path="classes" element={<PlaceholderPage title="Class Management" />} />
              <Route path="subjects" element={<PlaceholderPage title="Subject Management" />} />
              <Route path="timetable" element={<PlaceholderPage title="Timetable Management" />} />
              <Route path="attendance" element={<PlaceholderPage title="Attendance Management" />} />
              <Route path="exams" element={<PlaceholderPage title="Examination Module" />} />
              <Route path="fees" element={<PlaceholderPage title="Fee Management" />} />
              <Route path="salaries" element={<PlaceholderPage title="Salary Management" />} />
              <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
              <Route path="settings" element={<PlaceholderPage title="School Settings" />} />
            </Route>

            {/* Teacher Routes */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <TeacherLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDashboard />} />
              <Route path="classes" element={<PlaceholderPage title="My Classes" />} />
              <Route path="timetable" element={<PlaceholderPage title="My Timetable" />} />
              <Route path="attendance" element={<PlaceholderPage title="Mark Attendance" />} />
              <Route path="exams" element={<PlaceholderPage title="Exams & Marks Entry" />} />
            </Route>

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="timetable" element={<PlaceholderPage title="My Timetable" />} />
              <Route path="attendance" element={<PlaceholderPage title="My Attendance" />} />
              <Route path="results" element={<PlaceholderPage title="My Results" />} />
              <Route path="fees" element={<PlaceholderPage title="Fee Details" />} />
              <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
