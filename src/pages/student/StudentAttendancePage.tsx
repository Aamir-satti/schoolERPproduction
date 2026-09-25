import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../../context/AuthContext';
import type { AttendanceReport } from '../../types';
import { AlertCircle } from 'lucide-react';

const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real implementation, we'd get the student ID from the student profile
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">My Attendance</h1><p className="text-gray-500">View your attendance records</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{report?.totalDays || 0}</p>
          <p className="text-xs text-gray-500">Total Days</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{report?.present || 0}</p>
          <p className="text-xs text-gray-500">Present</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{report?.absent || 0}</p>
          <p className="text-xs text-gray-500">Absent</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{report?.late || 0}</p>
          <p className="text-xs text-gray-500">Late</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{report?.percentage || 0}%</p>
          <p className="text-xs text-gray-500">Percentage</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <p className="text-gray-500 text-sm">Login to view your detailed attendance records. Attendance data will be fetched from the server.</p>
      </div>
    </div>
  );
};

export default StudentAttendancePage;
