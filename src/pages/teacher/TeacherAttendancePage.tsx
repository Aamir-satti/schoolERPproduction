import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { AlertCircle } from 'lucide-react';

interface ClassInfo {
  _id: string;
  name: string;
  code: string;
}

interface StudentInfo {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  registrationNo: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  remarks?: string;
}

const TeacherAttendancePage: React.FC = () => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await apiClient.get('/attendance/teacher/my-classes');
        setClasses(res.data.data || []);
      } catch (err) {
        setError('Failed to load classes');
      }
    };
    fetchClasses();
  }, []);

  const loadStudents = async () => {
    if (!selectedClass) {
      setError('Please select a class');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiClient.get(`/attendance/class/${selectedClass}/students`);
      const studentsData = res.data.data || [];
      setStudents(studentsData);

      // Initialize attendance state
      const initialAttendance: Record<string, AttendanceRecord> = {};
      studentsData.forEach((student: StudentInfo) => {
        initialAttendance[student._id] = {
          studentId: student._id,
          status: 'PRESENT',
          remarks: '',
        };
      });
      setAttendance(initialAttendance);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const submitAttendance = async () => {
    if (!selectedClass || !selectedDate || students.length === 0) {
      setError('Please select class, date, and ensure students are loaded');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const records = Object.values(attendance);
      await apiClient.post('/attendance', {
        classId: selectedClass,
        date: selectedDate,
        records,
      });
      setSuccess(`Attendance marked for ${records.length} students`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500">Mark and view attendance for your classes</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={20} className="text-red-500 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select class...</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadStudents}
              disabled={loading || !selectedClass}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Students'}
            </button>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Students</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Reg No</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.registrationNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.userId?.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {(['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateAttendance(student._id, status)}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              attendance[student._id]?.status === status
                                ? status === 'PRESENT'
                                  ? 'bg-green-600 text-white'
                                  : status === 'ABSENT'
                                  ? 'bg-red-600 text-white'
                                  : status === 'LATE'
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t bg-gray-50">
            <button
              onClick={submitAttendance}
              disabled={loading}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendancePage;
