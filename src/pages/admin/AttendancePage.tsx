import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { academicService } from '../../services/academicService';
import { studentService } from '../../services/studentService';
import type { Student, ClassInfo, AttendanceStatus } from '../../types';
import { AlertCircle, Check, X } from 'lucide-react';

const AttendancePage: React.FC = () => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    academicService.getClasses().then(res => setClasses(res.data)).catch(() => {});
  }, []);

  const loadStudents = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const res = await studentService.getAll({ classId: selectedClass });
      setStudents(res.data);
      const attRes = await attendanceService.getClassAttendance(selectedClass, selectedDate);
      const attMap: Record<string, AttendanceStatus> = {};
      attRes.data.forEach((a: any) => { attMap[a.studentId?._id || a.studentId] = a.status; });
      setAttendance(attMap);
    } catch { setError('Unable to load students.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (selectedClass) loadStudents(); }, [selectedClass, selectedDate]);

  const markAttendance = async () => {
    if (!selectedClass || students.length === 0) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const records = students.map(s => ({
        studentId: s._id,
        status: attendance[s._id] || 'ABSENT',
      }));
      await attendanceService.markAttendance({ classId: selectedClass, date: selectedDate, records });
      setSuccess('Attendance marked successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally { setLoading(false); }
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Attendance</h1><p className="text-gray-500">Mark and manage attendance</p></div>

      <div className="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select Class</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
        <button onClick={markAttendance} disabled={!selectedClass || loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 mb-4">{success}</div>}

      {students.length > 0 && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Reg No</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Present</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Late</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Leave</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.registrationNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.userId?.name}</td>
                  {(['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as AttendanceStatus[]).map((status) => (
                    <td key={status} className="px-4 py-3 text-center">
                      <button onClick={() => setStatus(student._id, status)}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${attendance[student._id] === status ? (status === 'PRESENT' ? 'bg-green-500 border-green-500 text-white' : status === 'ABSENT' ? 'bg-red-500 border-red-500 text-white' : 'bg-amber-500 border-amber-500 text-white') : 'border-gray-300 hover:border-gray-400'}`}>
                        {status === 'PRESENT' ? 'P' : status === 'ABSENT' ? 'A' : status === 'LATE' ? 'L' : 'Lv'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
