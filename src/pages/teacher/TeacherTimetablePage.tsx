import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { TimetableEntry } from '../../types';
import { Calendar } from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const TeacherTimetablePage: React.FC = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await apiClient.get('/teachers/me/timetable');
        setTimetable(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch teacher timetable:', err);
      } finally { setLoading(false); }
    };
    fetchTimetable();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">My Timetable</h1><p className="text-gray-500">Your weekly schedule</p></div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Day</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Room</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {timetable.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No timetable entries.</td></tr>
            ) : timetable.sort((a, b) => DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime)).map((entry) => (
              <tr key={entry._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.dayOfWeek}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{entry.startTime} - {entry.endTime}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{entry.subjectId?.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{entry.classId?.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{entry.roomNo || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTimetablePage;
