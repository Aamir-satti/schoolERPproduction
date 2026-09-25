import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const TeacherAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Teacher can view their class attendance reports
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Attendance</h1><p className="text-gray-500">Mark and view attendance for your classes</p></div>
      
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h3>
        <p className="text-gray-500 text-sm mb-4">Select a class and date to mark attendance for students.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Select class...</option>
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div className="flex items-end"><button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Load Students</button></div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;
