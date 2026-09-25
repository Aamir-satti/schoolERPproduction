import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { academicService } from '../../services/academicService';
import type { TimetableEntry, ClassInfo } from '../../types';
import { Plus, AlertCircle } from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const TimetablePage: React.FC = () => {
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clsRes = await academicService.getClasses();
        setClasses(clsRes.data);
        const ttRes = await apiClient.get('/timetables');
        setTimetables(ttRes.data.data);
      } catch { setError('Unable to load timetable.'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filteredTimetable = selectedClass ? timetables.filter(t => t.classId?._id === selectedClass) : timetables;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Timetable</h1><p className="text-gray-500">Manage class schedules</p></div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"><Plus size={18} /> Add Entry</button>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-6">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{error}</div>}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTimetable.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No timetable entries found.</td></tr>
              ) : filteredTimetable.sort((a, b) => DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime)).map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.dayOfWeek}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.startTime} - {entry.endTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.subjectId?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{(entry.teacherId as any)?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.classId?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.roomNo || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
